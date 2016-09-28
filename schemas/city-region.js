const Duck = require('../modules/duck');

const CityRegion = Duck({
	Table: 'CityRegions',
	Item: {
		Id: String,
		url: String,
		name: String,
		city: String,
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name', 'city']
}, null, false);

module.exports = CityRegion;