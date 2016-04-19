const db = require('../config/aws');
const Duck = require('../modules/duck');

var Continent = new Duck({
	Database: db,
	Table: 'Continents',
	Item: {
		Id: String,
		name: String
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Continent;