const bcrypt = require('bcrypt-nodejs');
const cache  = require('../cache');
const joinObject  = require('../joinObject');

function returnItem(obj, field, value, contains) {
	if (!obj || !field) { return false; }
	if (!(field instanceof Array)) { field = field.split('.'); }

	const currentField = field.shift();
	if (field.length) {
		return returnItem(obj[currentField], field, value, contains);
	}

	const objValue = obj[currentField];
	if(objValue instanceof Array) {
		return objValue.indexOf(value) > -1;
	}

	if(value instanceof Array) {
		return value.indexOf(objValue) > -1;
	}

	return contains ? objValue.indexOf(value) > -1 : objValue === value;
}

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

				if(joinedItems.indexOf(item) === -1) {
					joinedItems.push(item)
				}
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

		const items = this.items || this.cached() || [];
		const foundItems = items.filter((item) => returnItem(item, field, value, contains));
		const sortedItems = (foundItems && value instanceof Array) ? value.map((val, i) => {
			const length = foundItems.length;

			for(let j = 0; j < length; j++) {
				const item = foundItems[j];

				if(returnItem(item, field, value[i])){
					return item;
				}
			}
		}) : foundItems;

		return new _duck(this.schema, sortedItems);
	}

	// same as find, but only returns one result, does not allow contains
	_duck.prototype.findOne = function(field, value){
		const items = this.items || this.cached() || [];
		const length = items.length;

		for (let i = 0;  i < length; i++){
			const item = items[i];

			if(returnItem(item, field, value)){
				//console.log(field, value);
				return new _duck(this.schema, item);
			}
		}
		
		return new _duck();
	}
}