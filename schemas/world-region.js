const Duck = require('../modules/duck');

var WorldRegion = Duck({
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