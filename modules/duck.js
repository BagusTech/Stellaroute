const fs = require('fs');
const parseData = require('../modules/parseData');
const readJSON = require('../modules/readJSON');

var duck = function(db, table, schema){
	this.table    = table;
	this.schema   = schema.Item;
	this.hashKey  = schema.HASH;
	this.rangeKey = schema.rangeKey;
	this.methods  = schema.Methods || [];
	this.indices  = schema.Indices || [];

	if(!db || !this.hashKey || !this.table || !this.schema){
		 console.error('you must define a databse, table, schema, AND hashKey');
		 process.exit();
	}

	db.listTables({}, function(err, data){
		if(err){
			console.log(JSON.stringify(err, null, 2));

			process.exit();
		} else {
			if(data.TableNames.indexOf(table) === -1) {
				console.log(table + 'doesn\'t exist! Attempting to create')
			} else {
				crud();
			}
		}
	})

	/*if(!TableExists(this.table, db)){
		console.log('the table didn\'t exist!')
		var params = {
			TableName : this.table,
			KeySchema : [{AttributeName: this.hashKey, KeyType: 'HASH'}],
			ProvisionedThroughput : {
				ReadCapacityUnits : 1,
				WriteCapacityUnits : 1
			}
		}

		if (this.rangeKey){
			params.KeySchema += {AttributeName: this.rangeKey, KeyType: 'RANGE'}
		}
	
		db.createTable(params, function(err, data){
			if (err){
				console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log('successful createTable!')
			}
		});
	}*/
	
	var crud = function(){
		// add an item
		// Write an item into the database
		// TODO make accept array of items to do a batch write
		duck.prototype.add = function(data){
			var table = this.table;
			var schema = this.schema;

			return new Promise(function(resolve, reject){
				if(parseData(data, schema, table) !== 'success'){ 
					console.log('failed to add ' + JSON.stringify(data))
					
					reject();
				}

				var params = {
					TableName : table,
					Item: data
				}

				for (var item in params.Item){
					if(params.Item[item] === ""){
						params.Item[item] = null;
					}
				}

				console.log(JSON.stringify(data, null, 2));

				db.lite.put(params, function(err, data) {
					if (err){
						console.error('error adding item: ' + JSON.stringify(err, null, 2));

						reject();
					} else {
						resolve();
					}
				});
			});
		}

		// find an item
		// Returns a promise, making it thennable
		// field is the index, data object, limit (optional) is the number of items returned 
		// if no params are filled, returns all items in that data base (scan)
		// TODO make it work with HASH-RANGE keys
		duck.prototype.find = function(field, data, limit){
			var table = this.table;
			var hashKey = this.hashKey;
			var indices = this.indices;

			return new Promise(function(resolve, reject){
				if (data){
					if (field == hashKey) {
						var params = {
							TableName : table,
							KeyConditionExpression: field + ' = :' + field,
							ExpressionAttributeValues: {}
						}
						
						params.ExpressionAttributeValues[':' + field] = data;
						if(limit){params.Limit = limit;}

						db.lite.query(params, function(err, data){
							if (err){
								reject(err);
							} else {
								console.log('successful query!')
								resolve(data);
							}
						});
					}
					else if (indices.indexOf(field) > -1) {
						var params = {
							TableName : table,
							IndexName : field + '-index',
							KeyConditionExpression: field + ' = :' + field,
							ExpressionAttributeValues: {}
						}

						params.ExpressionAttributeValues[':' + field] = data;
						if(limit){params.Limit = limit;}

						db.lite.query(params, function(err, data){
							if (err){
								reject(err);
							} else {
								console.log('successful query!')
								resolve(data);
							}
						});
					} else {
						reject(field + ' is not an index of ' + table)
					}
				} else {
					db.lite.scan({TableName: table}, function(err, data){
						if (err){
							reject(err);
						} else {
							console.log('successful scan!')
							resolve(data);
						}
					})
				}
			});
		}

		// delete an item
		// accepts a HASH primary key
		// TODO make it work with HASH-RANGE keys
		duck.prototype.delete = function(data){
			var table = this.table;
			var key = this.hashKey;

			return new Promise(function(resolve, reject){
				var params = {
					TableName: table,
					Key: {}
				}

				params.Key[key] = data;

				db.lite.delete(params, function(err, data){
					if (err){
						console.error('error deleting item: ' + JSON.stringify(err, null, 2));

						reject()
					} else {
						resolve();
					}
				})
			});
		}

		// updates an item
		// TODO make it work with HASH-RANGE keys
		duck.prototype.update = function(data){
			var table = this.table;
			var key = this.hashKey;

			return new Promise(function(resolve, reject){
				var params = {
					TableName: table,
					Key: {},
					//UpdateExpression: String(), // this is actually created below and added in
					ExpressionAttributeValues: {}
				}
				var updateExpression = 'set';

				params.Key[key] = data[key]

				readJSON(data, readJSON, function(){
					if(item != key){
						if(data[item] === ""){data[item] = null;}

						updateExpression += ' ' + item + ' = :' + item + ',';

						params.ExpressionAttributeValues[':' + item] = data[item];
					}
				});

				updateExpression = updateExpression.substring(0, updateExpression.length - 1);

				params.UpdateExpression = updateExpression;
				
				db.lite.update(params, function(err, data){
					if (err){
						console.log(err);

						reject();
					} else {
						console.log('successful update!')

						resolve();
					}
				})
			});
		}
	}
}

module.exports = duck;