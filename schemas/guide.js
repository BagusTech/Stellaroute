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
		created: String,
		isPublished: Boolean,
		lastEdited: String,
		bannerImage: String,
		cardImage: String,
		tagline: String,
		description: String,
		tags: Array,
		cards: [{
			title: String,
			image: String,
			text: String,
			style: String,
		}],

		continents: Array,
		worldRegions: Array,
		countries: Array,
		countryRegions: Array,
		provinces: Array,
		provinceRegions: Array,
		cities: Array,
		cityRegions: Array,
		neighborhoods: Array,
		/*attractions: Array,
		isGroupedByDay: Boolean,
		map: String,
		description: String,
		needToKnow: [{
			title: String,
			description: String,
		}],
		highlights: [{
			order: String, // depricated
			Id: String, // id of what is being highlighted i.e. the Id of an attraction or City
			table: String, // the table the id corresponds to i.e. Attractions, Cities
			cardImage: String,
			title: String,
			description: String,
			readMore: String,
		}],
		whereToStay: String,
		whereToGoOut: String,
		whereToEat: String,
		whereToExplore: String,
		days: [{
			title: String,
			description: String,
			cards: [{
				cardId: String, // the card's unique id
				directionsTo: [{
					method: String,
					time: String,
					distance: String,
				}],
				type: String, // food/attraction/area attraction/sub attraction/city/activity/note
				tagTitle: String,
				image: String,
				table: String, // the table the id corresponds to i.e. Attractions, Cities
				Id: String, // id of what the card is i.e. the Id of an attraction or City
				title: String,
				description: String,
				suggestedTime: String,
			}]
		}],*/
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', 'author']
}, null, false);

module.exports = Guide;