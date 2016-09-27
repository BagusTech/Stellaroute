const Duck = require('../modules/duck');

const WorldRegion = Duck({
	Table: 'WorldRegions',
	Item: {
		Id: String,
		url: String,
		name: String,
		continent: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = WorldRegion;