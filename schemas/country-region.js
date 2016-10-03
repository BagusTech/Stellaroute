const Duck = require('../modules/duck');

const CountryRegion = Duck({
	Table: 'CountryRegions',
	Item: {
		Id: String,
		url: String,
		name: String,
		country: String
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', 'country']
}, null, false);

module.exports = CountryRegion;