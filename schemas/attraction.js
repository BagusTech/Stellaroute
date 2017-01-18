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
		isTopAttraction: Boolean,
		category: Array,
		address: String,
		description: String,
		tagline: String,
		cardImage: String,
		images: Array,
		needToKnow: [{
			title: String,
			order: Number,
			idEndorsed: Boolean,
			description: String,
		}],
		quickFacts: [{
			title: String,
			order: Number,
			idEndorsed: Boolean,
			description: String,
		}],
		orientation: {
			description: String,
			map: String,
			gettingThere: String,
		},
		price: String,
		hours: String,
		nearbyAttractions: Array,
		subAttractions: Array,
		parentAttraction: String
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', ['country', 'city']]
}, null, false);

module.exports = Attraction;