const uuid          = require('uuid');
const update        = require('./update');
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
	// works with object or array
	// TODO make it work with HASH-RANGE keys
	_duck.prototype.update = update;


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