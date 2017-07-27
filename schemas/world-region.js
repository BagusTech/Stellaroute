const Duck = require('../modules/duck');

const WorldRegion = Duck({
	Table: 'WorldRegions',
	Item: {
		Id: String,
		url: String,
		continent: Array,
		names: {
			display: String,
			official: String,
			native: [{  
				name: String, 
				language: String,
			}],
			alias: Array, 
		},
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url']
}, null, false);

//module.exports = WorldRegion;