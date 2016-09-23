const Duck = require('../modules/duck');

const Province = Duck({
	Table: 'Provinces',
	Item: {
		Id: String,
		url: String,
		name: String,
		continent: Array,
		worldRegions: Array,
		country: String,
		countryRegions: Array,
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name', 'country']
});

module.exports = Province;