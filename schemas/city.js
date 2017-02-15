const Duck = require('../modules/duck');

const City = Duck({
	Table: 'Cities',
	Item: {
		Id: String,
		url: String,
		isPublic: Boolean,
		names: {
			display: String,
			official: String,
			native: [{  
				name: String, 
				language: String,
			}],
			alias: Array, 
		},
		abbreviation: String,
		isAutonomous: Boolean,
		backgroundImage: String,
		cardImage: String,
		images: Array,
		continent: Array,
		worldRegions: Array,
		country: String,
		countryRegions: Array,
		province: Array,
		provinceRegions: Array,
		guides: Array,
	// At a Glance Card
		averageStay: String,
		bestTimeToVisit: Array,
		topPlaces: Array,	
		tagline: String,
		description: String,
	// Orientation
		orientation: {
			map: String,
		},
	// Need to Know
		needToKnow: [{
			order: String, // depricated
			isEndorsed: Boolean,
			remove: Boolean, 
			title: String,
			description: String,
		}],
	// Quick Facts (or Fun Facts)
		quickFacts: [{
			order: String, // depricated
			isEndorsed: Boolean,
			remove: Boolean, 
			title: String,
			description: String,
		}],
	// Travel Basics
		entryTax: {
			amount: String,
			description: String,
		}, 
		exitTax: {
			amount: String,
			description: String,
		}, 
		timeZones: Array,
		electricity: {
			type: String,
			image: String,
		},
		mobile: {
			title: String,
			description: String,
		},
		water: {
			quality: String,
			description: String,
		},
		toilets: {
			types: Array,
			description: String,
		},
		visa: [{
			order: String, // depricated
			endorse: Boolean,
			remove: Boolean, 
			countries: Array,
			requirements: String,
			description: String,
		}],
		vaccines: [{
			order: String, // depricated
			endorse: Boolean,
			remove: Boolean, 
			countries: Array,
			requirements: String,
			description: String,
		}],
		money: {
			overview: String,
			currency: {
				name: String,
				symbol: String,
			},
			creditCards: {
				overview: String,
				availability: String,
				accepted: Array,
			},
		},
		clothing: [{
			order: String, // depricated
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			description: String,
		}],
	// People and Customs
		customs: {
			overview: String,
			tipping: {
				tippingPractice: String,
				description: String,
			},
			bargaining: {
				bargainingStyle: String,
				description: String,
			}, 
			dress: [{
				order: String, // depricated
				endorse: Boolean,
				remove: Boolean, 
				style: String,
				description: String,
			}],
			traditions: [{
				order: String, // depricated
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
		},
	// When to Go
		whenToGo: [{
			activity: String,
			start: String,
			end: String,
			description: String,
		}],
		climate: String,
		weather: [{
			month: String,
			avgTemp: Number, //need farhenheit and celsius 
			percipitation: Number, //inches and cm???
		}],
		seasons: [{
			order: String, // depricated
			season: String,
			months: Array,
			description: String,
		}],
		festival: [{
			name: String,
			alias: Array,
			type: String, ///ability to destingious between event/festival type. ie Cherry Blossoms as oppose to a Musica Festival???
			date: String,
			description: String,
		}],
	// Communication
		communication: {
			overview: String,
			languages: Array, 
			basicSayings: [{
				order: String, // depricated
				endorse: Boolean,
				remove: Boolean, 
				language: String,
				saying: String,
				translation: String,
				description: String,
			}],
			expressions: [{
				order: String, // depricated
				endorse: Boolean,
				remove: Boolean, 
				language: String,
				language: String,
				phrase: String,
				translation: String,
				description: String,
			}],
		},
	// Getting Around
		transit: {
			tagline: String,
			transitFacts: [{
				title: String,
				description: String
			}],
		},
	// Eating and Meals
		food: {
			overview: String,
			foods: [{
				Id: String,
				order: String,
				image: String,
				name: String,
				category: String,
				tagline: String,
				description: String,
				suggestedRestaurant: String,
				dishes: Array,
				area: String,
				address: String,
				whatToOrder: String, // depricated
				contains: Array,
				readMore: String
			}],
		},
	// Top Places
		top: {
			destinations: [{
				order: String, // depricated
				name: String,
				type: String,
				id: String,
			}],
			attractions: [{
				order: String, // depricated
				name: String,
				city: String,
				id: String,
			}],
			geographicalLandmarks: [{
				order: String, // depricated
				name: String,
				classification: String,
			}],
		},
		nearby: [{
				order: String, // depricated
				name: String,
				type: String,
				id: String,
		}],
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', ['country', 'province']]
}, null, false);

module.exports = City;