const bcrypt        = require('bcrypt-nodejs');
const uuid          = require('uuid');
const cache         = require('../modules/caching');
const parseData     = require('../modules/parseData');
const readJSON      = require('../modules/readJSON');
const flattenObject = require('../modules/flattenObject');

// TODO: have cache duration set through schema
const oneHour = 3600;
const oneDay = 86400;

var duck = function(db, table, schema){
	this.table      = table;
	this.schema     = schema.Item;
	this.hash       = schema.HASH;
	this.hashType   = schema.HASHType;
	this.range      = schema.Range;
	this.rangeType  = schema.RangeType;
	this.indexes    = schema.Indexes || [];
	this.cached     = function(){ return cache.get(table); }
	this.checkCache = function(req, res, next){ //middleware check cache
		if(!isReady){
			console.error('still initializing ' + table);
			req.flash('error', 'Opps, something when wrong! Please try again.');
			res.redirect('/');
		}

		if(cache.get(table)){
			next();
		} else{
			db.lite.scan({TableName: table}, function(err, data){
				if (err) {
					console.error(JSON.stringify(err, null, 2));

					req.flash('error', 'Opps, something when wrong! Please try again.');
					res.redirect('/');
				} else {
					cache.set(table, data.Items, oneDay);

					next();
				}
			});
		}
	}

	// generateing a hash
	this.generateHash = function(password){ return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); };
	// checking if password is valid
	this.validPassword = function(password, encodedPassword){ return bcrypt.compareSync(password, encodedPassword); };
	
	/*	 
		var testPut = {
			  "TableName": "Continents",
			  "Item": {
			    "Id": "alsdkfjs",
			    "local": {
			      "email": "test@test.com",
			      "password": "test"
			    }
			  },
			  "ExpressionAttributeNames": {
			    //"#h": "Id",
			    "#local": "local",
			    "#email": "email",
			    //"#password": "password"
			  },
			  "ExpressionAttributeValues": {
			    //":h": "alsdkfj",
			    ":v0": "test@test.com",
			    //":v1": "password"
			  },
			  "ReturnValues": "ALL_OLD"
			}

		db.lite.put(testPut, function(err, data){
			if (err){
				console.error(JSON.stringify(err, null, 2));
			} else {
				console.log(JSON.stringify(data, null, 2));
			}

			process.exit();
		});

		var testScan = {
			TableName: 'Users',
			FilterExpression: '#n1.#n2 = :v1 OR #n1.#n3 = :v3 OR #n1.#n2 = :v2',
		    ExpressionAttributeNames:{
		        '#n1': 'local',
		        '#n2': 'email',
		        '#n3': 'password'
		    },
		    ExpressionAttributeValues: {
		        ':v1': 'test@test.com',
		        ':v2': 'test2@test.com',
		        ':v3': 'test'
		    }
		}

		db.lite.scan(testScan, function(err, data){
			if (err){
				console.error(JSON.stringify(err, null, 2));
			} else {
				console.log(JSON.stringify(data, null, 2));
			}

			process.exit();
		});

		var params = {
				  "TableName": "Users",
				  "Key": {
				    "Id": "b677b0d7-c734-48ca-87ed-0d542e472fa4"
				  },
				  "ExpressionAttributeNames": {
				    "#name": "name",
				    "#first": "first",
				    "#last": "last",
				    "#local": "local",
				    "#email": "email"
				  },
				  "ExpressionAttributeValues": {
				    ":0": "Joe",
				    ":1": "Lissner",
				    ":3": "test@test.com"
				  },
				  "UpdateExpression": "set #name.#first= :0, #name.#last= :1, #local.#email= :3"
				}

		db.lite.update(params, function(err, data){
						if (err){
							console.error(err);
							process.exit();
						} else {
							process.exit();
						}
					}); 
	*/


	if(!db || !this.hash || !this.table || !this.schema){
		 console.error('you must define a databse, table, schema, AND hash');
		 process.exit();
	}

	var isReady = false;

	db.listTables({}, function(err, data){
		if(err){
			console.error(JSON.stringify(err, null, 2));

			process.exit();
		} else {
			if(data.TableNames.indexOf(table) === -1) {
				var params = {
				    TableName : table,
				    KeySchema: [       
				        { AttributeName: schema.HASH,
				          KeyType: 'HASH'} //Partition key
				    ],
				    AttributeDefinitions: [       
				        { AttributeName: schema.HASH, 
				          AttributeType: schema.HASHType }
				    ],
				    ProvisionedThroughput: {       
				        ReadCapacityUnits: 1, 
				        WriteCapacityUnits: 1
				    }
				};

				if (schema.rangeKey){
					params.KeySchema += {AttributeName: schema.rangeKey, KeyType: 'RANGE'} //Sort key
					params.AttributeDefinitions += { AttributeName: schema.rangeKey, AttributeType: schema.rangeType }
				}

				db.createTable(params, function(err, data){
					if (err){
						console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));

						process.exit();
					}

					isReady = true;
				});
			}

			isReady = true;
		}
	});


	// Write an item into the database
	// Data is an object being added to the database
	// Conditions is an array of objects with an 'attribute' property and a 'value' property
	//// [{attribute: 'local.email', value: 'joe@bagusco.com'}, {attribute: 'username', value: 'howsc'}]
	// TODO make accept array of items to do a batch write
	duck.prototype.add = function(data, conditions){
		var table = this.table;
		var schema = this.schema;
		var hash = this.hash;

		return new Promise(function(resolve, reject){
			if(!isReady){
				reject('still initializing ' + table);
			}

			if(parseData(data, schema, table) !== 'success'){ 
				console.error('failed to add ' + JSON.stringify(data));

				reject('Mismatch of data types');
				return;
			}

			data[hash] = data[hash] || uuid.v4();

			var params = {
				TableName: table,
				Item: data,
				ConditionExpression: '#h <> :h',
				ExpressionAttributeNames: { '#h': hash },
				ExpressionAttributeValues: { ':h': data[hash] }
			}

			// DynamoDB doesn't except empty strings as ReturnValues
			for (var item in params.Item){
				if(params.Item[item] === String()){
					params.Item[item] = null;
				}
			}

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

	// find an item
	// returns a promise, making it thennable
	// field is the index, data object
	// if no params are filled, returns all items in that data base (scan)
	// TODO make it work with HASH-RANGE keys
	duck.prototype.find = function(field, data){
		const table = this.table;
		const hash = this.hash;
		const indexes = this.indexes;

		return new Promise(function(resolve, reject){
			if(!isReady){
				reject('still initializing ' + table);
			}

			if (data){
				if (field == hash) {
					var params = {
						TableName : table,
						KeyConditionExpression: '#h = :h',
						ExpressionAttributeNames: { '#h': field },
						ExpressionAttributeValues: { ':h': data }
					}

					db.lite.query(params, function(err, data){
						if (err){
							console.error(JSON.stringify(err, null, 2));
							reject(err);
						} else {
							resolve(data);
						}
					});
				}
				else if (indexes.indexOf(field) > -1) {
					var params = {
						TableName : table,
						KeyConditionExpression: '#h = :h',
						ExpressionAttributeNames: { '#h': field },
						ExpressionAttributeValues: { ':h': data }
					}

					db.lite.query(params, function(err, data){
						if (err){
							console.error(JSON.stringify(err, null, 2));
							reject(err);
						} else {
							resolve(data);
						}
					});
				} else {
					var params = {
						TableName: table,
						FilterExpression: '', // created in code
					    ExpressionAttributeNames: {},
					    ExpressionAttributeValues: {
					        ':value': data
					    }
					};

					var expressionAttributeNames = field.split('.'); // make the accepted arguments into an aray
					var filterExpression = String();

					// for each item in the array, add an expression attribute name 
					// equal to the value and assign it's value to the value
					for (value in expressionAttributeNames) {
						var item = expressionAttributeNames[value];

						// if the ExpressionAttributeName doesn't already exist add it
						if (!params.ExpressionAttributeNames['#' + item]) {
							params.ExpressionAttributeNames['#' + item] = item;
						}

						filterExpression += '.#' + expressionAttributeNames[value];
					}

					// set filter expression
					params.FilterExpression = filterExpression.substring(1) + ' = :value';

					db.lite.scan(params, function(err, data){
						if (err){
							console.error(JSON.stringify(err, null, 2));
							reject(err);
						} else {
							resolve(data);
						}
					});
				}
			} else {
				db.lite.scan({TableName: table}, function(err, data){
					if (err){
						console.error(JSON.stringify(err, null, 2));
						reject(err);
					} else {
						resolve(data);
					}
				});
			}
		});
	}

	// delete an item
	// accepts a HASH primary key
	// TODO make it work with HASH-RANGE keys
	duck.prototype.delete = function(data){
		var table = this.table;
		var key = this.hash;

		return new Promise(function(resolve, reject){
			if(!isReady){
				reject('still initializing ' + table);
			}

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
	duck.prototype.update = function(data){
		var table = this.table;
		var schema = this.schema;
		var key = this.hash;

		return new Promise(function(resolve, reject){
			if(!isReady){
				reject('still initializing ' + table);
			}

			if(parseData(data, schema, table) !== 'success'){ 
				console.error('failed to add ' + JSON.stringify(data));
				
				reject('Mismatch of data types');
				return;
			}

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
		});
	}

	// update cache
	duck.prototype.updateCache = function(){
		var table = this.table;

		return new Promise(function(resolve, reject){

			if(!isReady){
				reject('still initializing ' + table);
			}

			db.lite.scan({TableName: table}, function(err, data){
				if (err) {
					console.error(JSON.stringify(err, null, 2));

					reject(err);
				} else {
					cache.set(table, data.Items, oneDay);

					resolve(cache.get(table));
				}
			});
		});
	}
}

module.exports = duck;