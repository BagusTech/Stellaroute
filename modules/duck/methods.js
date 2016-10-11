const bcrypt = require('bcrypt-nodejs');
const cache  = require('../cache');
const joinObject  = require('../joinObject');

module.exports = function(_duck){
	_duck.prototype.generateHash  = (password) => { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); }; // generateing a hash
	_duck.prototype.validPassword = (password, encodedPassword) => { return bcrypt.compareSync(password, encodedPassword); }; // checking if password is valid

	_duck.prototype.cached = function() {
		return cache.get(this.table);
	}

	_duck.prototype.deleteCached = function() {
		return cache.del(this.table);
	}
	
	// field: string = 'continent'
	// data: array of objects = [{Id: 3, name: North America}, {Id: 4, name: South America}]
	// joinOn: string = 'Id'
	// display: string = 'name'
	// returns: this
	_duck.prototype.join = function(field, data, joinOn, display){
		const items = this.items && !(this.items instanceof Array) ? Array(this.items) : (this.items || this.cached());
		const fields = field.split('.');
	    const displays = display.split('.');
	    const joinedFieldName = fields[fields.length-1]+displays[displays.length-1].charAt(0).toUpperCase() + displays[displays.length-1].slice(1);
		const joinedItems = [];

		for(var i in items){
			for(var j in data){
				var item = joinObject(items[i], field.split('.'), data[j], joinOn.split('.'), data[j], display.split('.'), joinedFieldName);

				joinedItems.indexOf(item) > -1 ? null : joinedItems.push(item);
			}

		}

		return new _duck(this.schema, joinedItems.filter(function(i) { return i}));
	}

	// field: string = 'name'
	// value: string = 'Joe'
	// contains: bool = true (if it isn't contains, it's equals)
	// return array of items
	_duck.prototype.find = function(field, value, contains){
		if(!field){
			return new _duck(this.schema, this.items || this.cached());
		}

		const fieldPaths = typeof field === 'string' ? Array(field.split('.')) : field.map(f => f.split('.')); // make the accepted arguments into an aray			
		const values = typeof value === 'string' ? Array(value) : value;
		const items = this.items || this.cached();

		const foundItems = items.map(function(item){
							for (var i in fieldPaths){
								var res = item;

								// for each item in the array
								for (var j in fieldPaths[i]){
									if(res[fieldPaths[i][j]]){
										res = res[fieldPaths[i][j]]
									}
								}

								if(contains && (typeof contains == 'string' || contains instanceof Array)){
									return res.indexOf(values[i]) == -1 ? null : item
								}

								if (res != values[i]){
									return null;
								}
							}

							return item;
						  })
						  .filter(nullCheck => nullCheck);

		return new _duck(this.schema, foundItems);
	}

	// same as find, but only returns one result, does not allow contains
	_duck.prototype.findOne = function(field, value){
		const fieldPaths = typeof field === 'string' ? Array(field.split('.')) : field.map(f => f.split('.')); // make the accepted arguments into an aray			
		const values = typeof value === 'string' ? Array(value) : value;
		const items = this.items || this.cached();

		for (var item in items){
			var addItem = true;

			for (var i in fieldPaths){
				var res = items[item];

				// for each item in the array
				for (var j in fieldPaths[i]){
					if(res[fieldPaths[i][j]]){
						res = res[fieldPaths[i][j]]
					}
				}

				if (res != values[i]){
					addItem = false;
				}
			}

			if(addItem){
				return new _duck(this.schema, items[item]);
			}
		}
		
		return new _duck();
	}
}