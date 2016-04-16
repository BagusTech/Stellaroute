const db = require('../config/aws');
const duck = require('../modules/duck');

var Country =  new duck(db, 'Countries', {
	Item: {
		Id: String,
		name: String,
		abbreviation: String,
		alias: Array,
		continent: Array,
		worldRegions: Array
		//countryRegions: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Country;