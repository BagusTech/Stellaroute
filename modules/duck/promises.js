const uuid          = require('uuid');
const db            = require('../../config/db');
const assign        = require('../assign');
const cache         = require('../cache');
const flattenObject = require('../flattenObject');
const parseData     = require('../parseData');
const readJSON      = require('../readJSON');

module.exports = (_duck) => {
	// Write an item into the database
	// Data is the object being added to the database
	// Conditions - TODO
	// ReAssign - bool - change object from { a.b: 'foo'} to { a: { b: 'foo' }} 
	// CheckSchema - bool - verify that data matches Schema (defaults to true, SHOULD ONLY BE USED FOR TESTING)
	// TODO make accept array of items to do a batch write
	_duck.prototype.add = function(data, reAssign, conditions, checkSchema){
		const table = this.table;
		const schema = this.itemSchema;
		const hash = this.hash;
		const uniqueBy = this.uniqueBy;
		const items = this.cached() || [];

		reAssign = reAssign === undefined ? false : reAssign;
		checkSchema = checkSchema === undefined ? true : checkSchema;

		return new Promise(function(resolve, reject){


			// if the HASH isn't set, set it to a uuid
			data[hash] = data[hash] || uuid.v4();

			// item to add is an object object if it needs to be re-assigned
			const itemToAdd = reAssign ? {} : data;

			if (reAssign) {
				readJSON(data, readJSON, function(item, data){
					assign(itemToAdd, item, data[item])
				});
			}

			if (checkSchema) {
				if(parseData(itemToAdd, schema, table) !== 'success'){ 
					console.error('failed to add ' + JSON.stringify(data));

					reject('Mismatch of data types');
					return;
				}
			}

			// check to see if it has any special rules for going into the db
			if(uniqueBy){
				const key = uniqueBy[0];
				const range = (typeof uniqueBy[1] === 'string' ? Array(uniqueBy[1]) : uniqueBy[1]) || [];
				const isUnique = items.filter(function(item){
					if(!itemToAdd[key]) {
						return true  
					}

					function isEqual(a, b){
						if (a instanceof Array){
							for (var i in b){
								if(a.indexOf(b[i]) > -1){
									return true;
								}
							}
						} else {
							return a === b;
						}
					}

					const keyCheck = isEqual(item[key], itemToAdd[key]);
					const range1 = isEqual(item[range[0]], itemToAdd[range[0]]);
					const range2 = isEqual(item[range[1]], itemToAdd[range[1]]);

					return (keyCheck && range1 && range2)
				}).length === 0;

				if(!isUnique){
					reject({ forUser: `Cant add to ${table} because "${key}" must be unique between "${range}"`});
					return;
				}
			}

			var params = {
				TableName: table,
				Item: itemToAdd,
				ConditionExpression: '#h <> :h', //make sure an item with the same is doesn't already exist
				ExpressionAttributeNames: { '#h': hash },
				ExpressionAttributeValues: { ':h': data[hash] }
			}

			// DynamoDB doesn't except empty strings as ReturnValues, so change them to null
			void function setEmptyStringToNull(Item){
				for (var item in Item){
					if(Item[item] === String()){
						Item[item] = null;
					} else if(typeof Item[item] === 'object' && !(Item[item] instanceof Array)) {
						setEmptyStringToNull(Item[item]);
					}
				}
			}(params.Item);

			db.lite.put(params, function(err, data) {
				if (err){
					console.error('error adding item: ' + JSON.stringify(err, null, 2));

					reject(err);
				} else {
					resolve(data.Items);
				}
			});
		});
	}

	// delete an item
	// accepts a HASH primary key
	// TODO make it work with HASH-RANGE keys
	_duck.prototype.delete = function(data){
		const table = this.table;
		const key = this.hash;

		return new Promise(function(resolve, reject){

			var params = {
				TableName: table,
				Key: {}
			}

			params.Key[key] = data;

			db.lite.delete(params, function(err, data){
				if (err){
					console.error('error deleting item: ' + JSON.stringify(err, null, 2));
					reject(err)
				} else {
					resolve();
				}
			})
		});
	}

	// updates an item
	// ReAssign - bool - change object from { a.b: 'foo'} to { a: { b: 'foo' }} 
	// TODO make it work with HASH-RANGE keys
	_duck.prototype.update = function(data, reAssign){
		const table = this.table;
		const schema = this.itemSchema;
		const key = this.hash;
		const params = reAssign ? {} : data;

		if (reAssign){
			readJSON(data, readJSON, function(item, data){
				assign(params, item, data[item]);
			});
		}

		return new Promise(function(resolve, reject){
			if(parseData(params, schema, table) !== 'success'){ 
				console.error('failed to add ' + JSON.stringify(data));
				
				reject('Mismatch of data types');
				return;
			}

			var objectsToAdd = []

			function parse(data, schema){
				for (var item in data){
					var itemType = data[item] instanceof Array === true ? 'array' : typeof data[item];

					if (schema[item] === undefined && itemType === 'object'){
						objectsToAdd.push(item);
					}
					
					if (itemType === 'object' && schema[item]) {
						parse(data[item], schema[item])
					} else if ( itemType === 'object' ){
						parse(data[item], {})
					}
				}
			}

			void function getCountry(field, value){
				const fieldPath = field.split('.'); // make the accepted arguments into an array
				const items = cache.get(table);
				const currentCountry = function(){
					for (var i in items){
						var res = items[i];

						for (var j in fieldPath){
							res = res[fieldPath[j]]
						}

						if(res === value){
							return items[i];
						}
					}
				}
				parse(data, currentCountry())
			}(key, data[key])


			function addMissingObjects(i){
				var params = {
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
				db.lite.update(params, function(err, data){
					if (err){
						console.error(err);
						process.exit();
					} else {
						if (objectsToAdd.length == i){
							finalUpdate(data);
						} else {
							addMissingObjects(i)
						}
					}
				});
			}

			function finalUpdate(item){
				var params = {
					TableName: table,
					Key: {},
					// UpdateExpression -- created below
					ExpressionAttributeNames: {},
					ExpressionAttributeValues: {}
				}

				var updateExpression = 'set';

				params.Key[key] = data[key];

				var flattenedData = flattenObject(data);

				var expressionCounter = 0;
				for (item in flattenedData){
					if(item !== key) {

						// 'a.b.c' => 'a.#b.#c'
						var concatinatedExpression = item.replace('.', '.#');

						updateExpression += ` #${concatinatedExpression}= :${expressionCounter},`;

						var arr = item.split('.');
						for(i in arr){
							if (!params.ExpressionAttributeNames[`#${arr[i]}`]) {
								params.ExpressionAttributeNames[`#${arr[i]}`] = arr[i];
							}
						}

						// DynamoDB doesn't except empty strings as ReturnValues, so the value to null if that's the case
						var attributeValue = flattenedData[item] == String() ? null : flattenedData[item];
						params.ExpressionAttributeValues[`:${expressionCounter}`] = attributeValue;
							
					}

					expressionCounter++;
				}

				// delete the last comma from the UpdateExpression
				updateExpression = updateExpression.substring(0, updateExpression.length - 1);
				params.UpdateExpression = updateExpression;

				db.lite.update(params, function(err, data){
					if (err){
						console.error(err);
						reject();
					} else {
						resolve();
					}
				});
			}

			if(objectsToAdd.length > 0){
				addMissingObjects(0);
			} else {
				finalUpdate(data);
			}
			/*
				// delete attribute from item
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
				});
			*/
		});
	}

	// updates the cache
	_duck.prototype.updateCache = function(){
		const table = this.table;
		const cacheDuration = this.cacheDuration;

		//console.log(`${table} - updating cache`);

		cache.del(table);
		this.items = null;

		return new Promise(function(resolve, reject){
			db.lite.scan({TableName: table}, function(err, data){
				if (err) {
					console.error(JSON.stringify(err, null, 2));

					reject(err);
				} else {
					cache.set(table, data.Items, cacheDuration);

					resolve(data.Items);
				}
			});
		});
	}
}