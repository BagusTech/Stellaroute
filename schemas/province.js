const db = require('../config/aws');
const Duck = require('../modules/duck');

var Province = new Duck({
	Database: db,
	Table: 'Provinces',
	Item: {
		Id: String,
		name: String,
		countryRegions: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Province;