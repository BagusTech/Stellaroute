const Duck = require('../modules/duck');

const City = Duck({
	Table: 'Cities',
	Item: {
		Id: String,
		url: String,
		name: String,
		continent: Array,
		worldRegions: Array,
		country: String,
		countryRegions: Array,
		province: Array,
		provinceRegions: Array,
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name', ['country', 'province']]
}, null, false);

module.exports = City;