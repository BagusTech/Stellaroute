const db = require('../config/aws');
const Duck = require('../modules/duck');

var CountryRegion = new Duck({
	Database: db,
	Table: 'CountryRegions',
	Item: {
		Id: String,
		name: String,
		country: String
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = CountryRegion;