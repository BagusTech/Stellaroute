const Duck = require('../modules/duck');

const ProvinceRegion = Duck({
	Table: 'ProvinceRegions',
	Item: {
		Id: String,
		url: String,
		countryRegions: Array,
		province: String,
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
	UniqueBy: ['url', 'province']
}, null, false);

//module.exports = ProvinceRegion;