const Duck = require('../modules/duck');

const CityRegion = Duck({
	Table: 'CityRegions',
	Item: {
		Id: String,
		url: String,
		city: String,
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
	UniqueBy: ['url', 'city']
}, null, false);

//module.exports = CityRegion;