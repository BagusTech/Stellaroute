const Duck = require('../modules/duck');

const ProvinceRegion = Duck({
	Table: 'ProvinceRegions',
	Item: {
		Id: String,
		url: String,
		name: String,
		countryRegions: Array,
		province: String,
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name', 'province']
}, null, false);

module.exports = ProvinceRegion;