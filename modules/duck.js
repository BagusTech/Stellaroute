const bcrypt        = require('bcrypt-nodejs');
const uuid          = require('uuid');
const assign        = require('../modules/assign');
const cache         = require('../modules/caching');
const parseData     = require('../modules/parseData');
const readJSON      = require('../modules/readJSON');
const flattenObject = require('../modules/flattenObject');

// TODO: have cache duration set through schema
const oneHour = 3600;
const oneDay = 86400;

const Duck = function(schema, isReady, items){
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~~~~~ Properties ~~~~~~ */
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
		this.schema     = schema;
		this.db         = schema.Database;
		this.table      = schema.Table;
		this.itemSchema = schema.Item;
		this.hash       = schema.HASH;
		this.hashType   = schema.HASHType;
		this.range      = schema.Range;
		this.rangeType  = schema.RangeType;
		this.indexes    = schema.Indexes || [];
		this.items      = items;		

	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~~~~~~~~ Init ~~~~~~~~~ */
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
		var isReady = isReady || false;

		// if the required parameters aren't there, fail
		if(!this.db || !this.hash || !this.table || !this.schema){
			 console.error('you must define a databse, table, schema, AND hash');
			 process.exit();
		}
		const db = this.db
		const table = this.table

		if(!isReady){	
			// check to see the list of tables against the current table name
			// if there is a match, set isReady = true
			// if there isn't a match, create the table
			// once table sucessfuly created, set isReady = true
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

							db.lite.scan({TableName: table}, function(err, data){
								if (err) {
									console.error(JSON.stringify(err, null, 2));

									console.error('~~~ failed to initialize ~~~');
									process.exit();
								} else {
									cache.set(table, data.Items, oneDay);

									isReady = true;
								}
							});
						});
					} else {
						db.lite.scan({TableName: table}, function(err, data){
							if (err) {
								console.error(JSON.stringify(err, null, 2));

								console.error('~~~ failed to initialize ~~~');
								process.exit();
							} else {
								cache.set(table, data.Items, oneDay);

								isReady = true;
							}
						});
					}
				}
			});
		}

	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~~~~~~ Methods ~~~~~~~~ */
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
		this.cached        = () => { return cache.get(this.table); } 
		this.generateHash  = (password) => { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); }; // generateing a hash
		this.validPassword = (password, encodedPassword) => { return bcrypt.compareSync(password, encodedPassword); }; // checking if password is valid
		// documentation
			// field: string = 'continent'
			// data: array of objects = [{Id: 3, name: North America}, {Id: 4, name: South America}]
			// joinOn: string = 'Id'
			// display: string = 'name'
			// returns: new Duck()
		this.join          = function(field, data, joinOn, display){ 
			var joinedItems = this.items || this.cached();
			const joinedField = joinedItems.map(item =>
				Array(item[field]).map(field =>
					data.map(data =>
						data[joinOn] == field ? data[display] : null)
					.filter(nullCheck => nullCheck)));

			for (i in joinedItems){
				joinedItems[i][field] = [].concat.apply([], joinedField[i]);
			}
			return new Duck(this.schema, true, joinedItems);
		}
		// documentation
			// field: string = 'name'
			// value: string = 'Joe'
			// contains: bool = true (if it isn't contains, it's equals)
		this.find = function(field, value, contains){
			const fieldPath = field.split('.'); // make the accepted arguments into an aray			
			const items = this.items || this.cached();
			const returnedItems = items.map(function(item){
							  	var res = item;

							  	// for each item in the array
							  	for (i in fieldPath){
									res = res[fieldPath[i]]
								}

								if(contains && (typeof contains == 'string' || contains instanceof Array)){
									return res.indexOf(value) == -1 ? null : item
								}

							  	return res == value ? item : null;
							  })
							  .filter(nullCheck => nullCheck);

			return returnedItems;
		}
		// same as find, but only returns one result, does not allow contains
		this.findOne = function(field, value){
			const fieldPath = field.split('.'); // make the accepted arguments into an aray			
			const items = this.items || this.cached();
			const returnedItem = function(){
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
			return returnedItem();
		}

	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~~~~~ Middleware ~~~~~~ */
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
		this.getCached = function(req, res, next){ //middleware check cache
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
	
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~~~~~~ Promises ~~~~~~~ */
	/* ~~~~~~~~~~~~~~~~~~~~~~~~ */

		// Write an item into the database
		// Data is the object being added to the database
		// TODO make accept array of items to do a batch write
		Duck.prototype.add = function(data, conditions){
			var table = this.table;
			var schema = this.itemSchema;
			var hash = this.hash;

			return new Promise(function(resolve, reject){
				if(!isReady){
					reject('still initializing ' + table);
				}

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
		Duck.prototype.delete = function(data){
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
		Duck.prototype.update = function(data){
			var table = this.table;
			var schema = this.itemSchema;
			var key = this.hash;

			return new Promise(function(resolve, reject){
				if(!isReady){
					reject('still initializing ' + table);
					return;
				}

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
		Duck.prototype.updateCache = function(){
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

	// testing
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
				"TableName": "Countries",
				"Key": {
					"Id": "6b50f784-a9df-47e2-891b-5b5126edf60a"
				},
				"ExpressionAttributeNames": {
					"#names": "names",
					"#official": "official",
					"#native": "native"
				},
				"ExpressionAttributeValues": {
					":empty": {},
					":0": "Serious Country Name",
					":1": "El Nameo"
				},
				"UpdateExpression": "set #names= if_not_exists(#names, :empty), #names.#official= :0, #names.#native= :1"
			}

			db.lite.update(params, function(err, data){
									if (err){
										console.error(err);
										process.exit();
									} else {
										console.log('success');
										process.exit();
									}
								});
		*/
}

module.exports = Duck;
