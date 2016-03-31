const db = require('../config/aws');
const duck = require('../modules/duck');

var Country =  new duck(db, 'Countries', {
	Item: {
		Id: String,
		name: String,
		continent: Array,
		worldRegions: Array
		//countryRegions: Array
	},
	HASH: 'name',
	HASHType: 'S'
});

module.exports = Country;