const Duck = require('../modules/duck');

const Province = Duck({
	Table: 'Provinces',
	Item: {
		Id: String,
		url: String,
		continent: Array,
		worldRegions: Array,
		country: String,
		countryRegions: Array,
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
	UniqueBy: ['url', 'country']
}, null, false);

module.exports = Province;