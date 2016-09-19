const bcrypt = require('bcrypt-nodejs');
const cache  = require('../caching');

module.exports = function(_duck){
	_duck.prototype.generateHash  = (password) => { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); }; // generateing a hash
	_duck.prototype.validPassword = (password, encodedPassword) => { return bcrypt.compareSync(password, encodedPassword); }; // checking if password is valid

	_duck.prototype.cached = function() {
		return cache.get(this.table);
	}
	
	// field: string = 'continent'
	// data: array of objects = [{Id: 3, name: North America}, {Id: 4, name: South America}]
	// joinOn: string = 'Id'
	// display: string = 'name'
	// returns: this
	_duck.prototype.join = function(field, data, joinOn, display){
		var joinedItems = this.items || this.cached();

		for(var i in joinedItems){
			if(joinedItems[i][field] instanceof Array){
				for(var j in joinedItems[i][field]){
					for(var k in data){
						if (data[k][joinOn] == joinedItems[i][field][j]){
							joinedItems[i][field][j] = data[k][display]
						}
					}
				}
			} else {
				for(var k in data){
					if (data[k][joinOn] == joinedItems[i][field]){
						joinedItems[i][field] = data[k][display]
					}
				}
			}
		}

		this.items = joinedItems;

		return this
	}

	// field: string = 'name'
	// value: string = 'Joe'
	// contains: bool = true (if it isn't contains, it's equals)
	// return array of items
	_duck.prototype.find = function(field, value, contains){
		if(!field){
			return this.cached();
		}

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
	_duck.prototype.findOne = function(field, value){
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
}