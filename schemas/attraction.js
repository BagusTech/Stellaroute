const Duck = require('../modules/duck');

// Not used anywhere yet
var Attraction = Duck({
	Table: 'Attractions',
	Item: {
		Id: String,
		url: String,
		country: Array,
		countryRegions: Array,
		province: Array,
		provinceRegions: Array,
		city: Array,
		cityRegions: Array,
		neighborhoods: Array,
		names: {
			display: String,
			Alias: Array
		}
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', ['country', 'city']]
}, null, false);

module.exports = Attraction;