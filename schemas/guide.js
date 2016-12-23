const Duck = require('../modules/duck');

// Not used anywhere yet
var Guide = Duck({
	Table: 'Guides',
	Item: {
		Id: String,
		url: String,
		author: String,
		names: {
			display: String,
			alias: Array
		},
		continents: Array,
		worldRegions: Array,
		countries: Array,
		countryRegions: Array,
		provinces: Array,
		provinceRegions: Array,
		cities: Array,
		cityRegions: Array,
		neighborhoods: Array,
		attractions: Array,
		backgroundImage: String,
		cardImage: String,
		map: String,
		tagline: String,
		description: String,
		travelHacks: [{
			order: Number,
			title: String,
			description: String,
		}],
		highlights: [{
			Id: String, // id of what is being highlighted i.e. the Id of an attraction or City
			table: String, // the table the id corresponds to i.e. Attractions, Cities
			order: Number,
			cardImage: String,
			title: String,
			description: String,
		}],
		whereToStay: String,
		whereToGoOut: String,
		whereToEat: String,
		whereToExplore: String,
		days: [{
			order: Number,
			title: String,
			description: String,
			cards: [{
				cardId: String, // the card's unique id
				title: String,
				order: Number,
				image: String,
				description: String,
				Id: String, // id of what is being highlighted i.e. the Id of an attraction or City
				table: String, // the table the id corresponds to i.e. Attractions, Cities
				type: String, // food/attraction/area attraction/sub attraction/city
				tagTitle: String,
				directionsTo: [{
					method: String,
					time: String,
					distance: String,
				}],
				suggestedTime: String,
			}]
		}],
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url']
}, null, false);

module.exports = Guide;