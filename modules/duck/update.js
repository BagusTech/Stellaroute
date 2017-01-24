const db            = require('../../config/db');
const assign        = require('../assign');
const cache         = require('../cache');
const flattenObject = require('../flattenObject');
const parseData     = require('../parseData');
const readJSON      = require('../readJSON');

/*  checkSchema
	Checks the given object against it's schema making sure that all the fields are the correct type and name
	ReAssign - bool - change object from { a.b: 'foo'} to { a: { b: 'foo' }} */
	
	function checkSchema(data, reAssign, schema, table) {
		const params = reAssign ? {} : data;


		if (reAssign){
			readJSON(data, readJSON, (item, data) => {
				assign(params, item, data[item]);
			});
		}

		if(parseData(params, schema, table) !== 'success'){ 
			console.error('failed to add ' + JSON.stringify(data));
			return false;
		}

		return true;
	}

/*  findObjectsToAdd
	finds all the fields that need to be added to the data base before the final update
	example: if the current item is { name: 'Joe' } and update will make it { name: 'Joe', address: { street: '123 Broadway'} }
			 then we need to do an update between to first have { name: 'Joe' } become { name: 'Joe', address: {} }
			 so this would RETURN ['address'] */
	
	function findObjectsToAdd(table, originalData, oldItem) {
		const objectsToAdd = [];
		const items = cache.get(table);
		const itemLength = items.length;

		// 
		function parse(data, schema){
			for (var item in data){
				const itemType = data[item] instanceof Array === true ? 'array' : typeof data[item];

				if (schema[item] === undefined && itemType === 'object'){
					objectsToAdd.push(item);
				}
				
				if (itemType === 'object' && schema[item]) {
					parse(data[item], schema[item])
				} else if (itemType === 'object') {
					parse(data[item], {})
				}
			}
		}

		parse(originalData, oldItem)

		return objectsToAdd;
	}

/*  final update
	makes the last call to the database, */

	function finalUpdate(table, key, data, resolve, reject){
		const params = {
				TableName: table,
				Key: {},
				// UpdateExpression -- created below
				ExpressionAttributeNames: {},
				ExpressionAttributeValues: {}
			}
		const flattenedData = flattenObject(data);
		let updateExpression = 'set';
		let expressionCounter = 0;
		
		// create the full update expression
		for (item in flattenedData){
			if(item !== key) {
				// 'a.b.c' => 'a.#b.#c'
				const concatinatedExpression = item.replace('.', '.#');
				const arr = item.split('.');
				const arrLength = arr.length;

				updateExpression += ` #${concatinatedExpression}= :${expressionCounter},`;
				
				for(let i = 0; i < arrLength; i++){
					if (!params.ExpressionAttributeNames[`#${arr[i]}`]) {
						params.ExpressionAttributeNames[`#${arr[i]}`] = arr[i];
					}
				}

				// DynamoDB doesn't except empty strings as ReturnValues, so the value to null if that's the case
				const attributeValue = flattenedData[item] == String() ? null : flattenedData[item];
				params.ExpressionAttributeValues[`:${expressionCounter}`] = attributeValue;
					
			}

			expressionCounter++;
		}

		params.Key[key] = data[key];

		// delete the last comma from the UpdateExpression
		updateExpression = updateExpression.substring(0, updateExpression.length - 1);
		params.UpdateExpression = updateExpression;

		db.lite.update(params, (err, data) => {
			if (err){
				console.error(err);
				console.error('~~~ tried updating ~~~')
				console.error(JSON.stringify(params, null, 2));
				reject();
			} else {
				resolve();
			}
		});
	}

/*  addMissingObjects
	adds the missing objects to the database in preperation for the final update */
	
	function addMissingObjects(i, table, objectsToAdd, key, data, resolve, reject){
		const params = {
			TableName: table,
			Key: {},
			// UpdateExpression -- created below
			ExpressionAttributeNames: {
				"#0": objectsToAdd[i]
			},
			ExpressionAttributeValues: {
				":empty": {}
			},
			"UpdateExpression": "set #0= if_not_exists(#0, :empty)"
		}
		params.Key[key] = data[key];

		i++;
		db.lite.update(params, (err, data) => {
			if (err){
				console.error(err);
				process.exit();
			} else {
				if (objectsToAdd.length == i) {
					finalUpdate(table, key, data, resolve, reject);
				} else {
					addMissingObjects(i, table, objectsToAdd, key, data, resolve, reject)
				}
			}
		});
	}

/*  updateItem
    updates an item 
    ReAssign - bool - change object from { a.b: 'foo'} to { a: { b: 'foo' }}
	TODO make it work with HASH-RANGE keys*/

    function updateItem(data, reAssign, table, schema, key, oldItem) {
    	return new Promise((resolve, reject) => {
    		if(!checkSchema(data, reAssign, schema, table)) {
				reject('Mismatch of data types');
				return;
			}

			const objectsToAdd = findObjectsToAdd(table, data, oldItem);

			if(objectsToAdd.length){
				addMissingObjects(0, table, objectsToAdd, key, data, resolve, reject);
			} else {
				finalUpdate(table, key, data, resolve, reject);
			}
    	})
    }

/*  update
	updates one or many items
	ReAssign - bool - change object from { a.b: 'foo'} to { a: { b: 'foo' }} */

	function update(data, reAssign) {
		const table = this.table;
		const schema = this.itemSchema;
		const key = this.hash;
		const bulkUpdate = data instanceof Array;
		const oldItem = bulkUpdate ? [] : this.findOne(key, data[key]).items;
		
		if(bulkUpdate) {
			const length = data.length;

			for(let i = 0; i < length; i++) {
				oldItem[data[i][key]] = this.findOne(key, data[i][key]).items;
			}
		}

		return new Promise((resolve, reject) => {
			if(bulkUpdate) {
				void function updates(item) {
					updateItem(item, reAssign, table, schema, key, oldItem[item[key]]).then((success) => {
						if (data.length) {
							updates(data.shift())
						} else {
							resolve(success)
						}
					}, (error) => {
						reject(error)
					});
				}(data.shift())
			} else {
				updateItem(data, reAssign, table, schema, key, oldItem).then((success) => {
					resolve(success)
				}, (error) => {
					reject(error)
				});
			}
		});
	}

module.exports = update;

/* delete attribute from item
	var params = {
	    TableName: 'table_name',
	    Key: { // The primary key of the item (a map of attribute name to AttributeValue)

	        attribute_name: { S: 'STRING_VALUE' }
	        // more attributes...
	    },
	    AttributeUpdates: { // The attributes to update (map of attribute name to AttributeValueUpdate)

	        attribute_name: {
	            Action: 'PUT', // PUT (replace)
	                           // ADD (adds to number or set)
	                           // DELETE (delete attribute or remove from set)
	            Value: { S: 'STRING_VALUE' }
	        },
	        // more attribute updates: ...
	    },
	    Expected: { // optional (map of attribute name to ExpectedAttributeValue)
	    
	        attribute_name: {
	            Exists: true, // optional (if false, Value must be null)
	            Value: { S: 'STRING_VALUE' },
	        },
	        // more attributes...
	    },
	    ReturnValues: 'NONE', // optional (NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW)
	    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
	    ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
	};
	dynamodb.updateItem(params, function(err, data) {
	    if (err) console.log(err); // an error occurred
	    else console.log(data); // successful response
	}); */