const uuid          = require('uuid');
const db            = require('../../config/db');
const assign        = require('../assign');
const cache         = require('../caching');
const flattenObject = require('../flattenObject');
const parseData     = require('../parseData');
const readJSON      = require('../readJSON');

// TODO: have cache duration set through schema

module.exports = function(_duck){
	// Write an item into the database
	// Data is the object being added to the database
	// TODO make accept array of items to do a batch write
	_duck.prototype.add = function(data, conditions){
		const table = this.table;
		const schema = this.itemSchema;
		const hash = this.hash;

		return new Promise(function(resolve, reject){

			// if the HASH isn't set, set it to a uuid
			data[hash] = data[hash] || uuid.v4();

			var itemToAdd = {};
			readJSON(data, readJSON, function(item, data){
				assign(itemToAdd, item, data[item])
			});

			if(parseData(itemToAdd, schema, table) !== 'success'){ 
				console.error('failed to add ' + JSON.stringify(data));

				reject('Mismatch of data types');
				return;
			}

			var params = {
				TableName: table,
				Item: itemToAdd,
				ConditionExpression: '#h <> :h',
				ExpressionAttributeNames: { '#h': hash },
				ExpressionAttributeValues: { ':h': data[hash] }
			}

			// DynamoDB doesn't except empty strings as ReturnValues
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
					resolve(data);
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
	// TODO make it work with HASH-RANGE keys
	_duck.prototype.update = function(data){
		const table = this.table;
		const schema = this.itemSchema;
		const key = this.hash;

		return new Promise(function(resolve, reject){
			if(parseData(data, schema, table) !== 'success'){ 
				console.error('failed to add ' + JSON.stringify(data));
				
				reject('Mismatch of data types');
				return;
			}

			var objectsToAdd = []

			function parse(data, schema){
				for (var item in data){
					var itemType = data[item] instanceof Array === true ? 'array' : typeof data[item];

					if ( schema[item] === undefined && itemType === 'object'){
						objectsToAdd.push(item);
					}
					
					if ( itemType === 'object' && schema[item]) {
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
					for (i in items){
						var res = items[i];

						for (j in fieldPath){
							res = res[fieldPath[j]]
						}

						if(res == value){
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
						console.log('success');
						if (objectsToAdd.length == i){
							finalUpdate(data);
						} else {
							addMissingObjects(i)
						}
					}
				});
			}

			if(objectsToAdd.length > 0){
				addMissingObjects(0);
			} else {
				finalUpdate(data);
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

						updateExpression += ' #' + concatinatedExpression + '= :' + expressionCounter + ',';

						var arr = item.split('.');
						for(i in arr){
							if (!params.ExpressionAttributeNames['#' + arr[i]]) {
								params.ExpressionAttributeNames['#' + arr[i]] = arr[i];
							}
						}

						// DynamoDB doesn't except empty strings as ReturnValues, so the value to null if that's the case
						var attributeValue = flattenedData[item] == String() ? null : flattenedData[item];
						params.ExpressionAttributeValues[':' + expressionCounter] = attributeValue;
							
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
		});
	}

	// updates the cache
	_duck.prototype.updateCache = function(){
		const table = this.table;
		const cacheDuration = this.cacheDuration;

		return new Promise(function(resolve, reject){
			db.lite.scan({TableName: table}, function(err, data){
				if (err) {
					console.error(JSON.stringify(err, null, 2));

					reject(err);
				} else {
					cache.set(table, data.Items, cacheDuration);

					resolve(cache.get(table));
				}
			});
		});
	}
}