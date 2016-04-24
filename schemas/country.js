const db = require('../config/aws');
const Duck = require('../modules/duck');

var Country = new Duck({
	Database: db,
	Table: 'Countries',
	Item: {
		Id: String,
		name: String,
		names: {
			official: String,
			native: Array
		},
		languages: Array,
		abbreviation: String,
		alias: Array,
		continent: Array,
		worldRegions: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Country;