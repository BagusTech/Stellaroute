const Duck = require('../modules/duck');

const CountryRegion = Duck({
	Table: 'CountryRegions',
	Item: {
		Id: String,
		url: String,
		country: String,
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

module.exports = CountryRegion;