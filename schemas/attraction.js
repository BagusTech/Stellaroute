const Duck = require('../modules/duck');

// Not used anywhere yet
var Attraction = Duck({
	Table: 'Attractions',
	Item: {
		Id: String,
		url: String,
		continent: Array,
		worldRegions: Array,
		country: Array,
		countryRegions: Array,
		province: Array,
		provinceRegions: Array,
		city: Array,
		cityRegions: Array,
		neighborhoods: Array,
		names: {
			display: String,
			official: String,
			native: [{  
				name: String, 
				language: String,
			}],
			alias: Array, 
		},
		description: String,
		tagline: String,
		cardImage: String,
		images: Array,
		needToKnow: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
		quickFact: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
		orientation: {
			description: String,
			map: String,
			gettingThere: String,
		},
		price: String,
		hours: Array,
		location: String,
		nearByAttractions: Array,
		guides: Array,
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', ['country', 'city']]
}, null, false);

module.exports = Attraction;