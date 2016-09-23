const Duck = require('../modules/duck');

const Country = Duck({
	Table: 'Countries',
	Item: {
		Id: String,
		name: String,
		names: {
			official: String,
			native: Array
		},
		languages: Array,
		abbreviation: String,
		alias: Array,
		continent: Array,
		worldRegions: Array,
		advice: {
			tipping: String,
			barganinig: {
				amount: String,
				explanation: String
			},
			clothing: {
				cultural: String,
				whatToWear: String
			}
		}
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name']
});

module.exports = Country;