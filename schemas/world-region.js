const db = require('../config/aws');
const Duck = require('../modules/duck');

var WorldRegion = new Duck({
	Database: db,
	Table: 'WorldRegions',
	Item: {
		Id: String,
		name: String,
		continent: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = WorldRegion;