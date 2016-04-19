const db = require('../config/aws');
const Duck = require('../modules/duck');

var Country = new Duck({
	Database: db,
	Table: 'Countries',
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