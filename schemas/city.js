const Duck = require('../modules/duck');

const City = Duck({
	Table: 'Cities',
	Item: {
		Id: String,
		url: String,
	// Modal Fields Card
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
		images: Array,
		mapImage: String,
		continent: Array,
		worldRegions: Array,
		country: String,
		countryRegions: Array,
		province: Array,
		provinceRegions: Array,
	// At a Glance Card
		averageStay: String,
		bestTimeToVisit: Array,
		topPlaces: Array,	
		tagline: String,
		overview: String,
	// Need to Know
		needToKnow: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	// Quick Facts (or Fun Facts)
		quickFact: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	// Travel Basics
		entryTax: {
			amount: String,
			explanation: String,
		}, 
		exitTax: {
			amount: String,
			explanation: String,
		}, 
		timeZones: Array,
		electricity: {
			type: String,
			image: String,
		},
		mobile: {
			title: String,
			explanation: String,
		},
		water: {
			quality: String,
			explanation: String,
		},
		toilets: {
			types: Array,
			explanation: String,
		},
		visa: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			countries: Array,
			requirements: String,
			explanation: String,
		}],
		vaccines: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			countries: Array,
			requirements: String,
			explanation: String,
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
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	// People and Customs
		customs: {
			overview: String,
			tipping: {
				tippingPractice: String,
				explanation: String,
			},
			bargaining: {
				bargainingStyle: String,
				explanation: String,
			}, 
			dress: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				style: String,
				explanation: String,
			}],
			traditions: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
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
			order: Number,
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
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				language: String,
				saying: String,
				translation: String,
				explanation: String,
			}],
			expressions: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				language: String,
				language: String,
				phrase: String,
				translation: String,
				explanation: String,
			}],
		},
	// Getting Around
		transit: {
			overview: String,
			card: [{
				image: String, 
				title: String, 
				arrive: String,
				move: String,
				explanation: String,
			}],
			rank: [{ // ranking of transit options
				order: Number,
				mode: String, // dropdown
			}],
			advice: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			car: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			taxis: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			motorcycle: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			bus: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			train: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			public: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			airports: [{
				city: String,
				airport: String,
				abbreviation: String,
				explanation: String,
			}],
			plane: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			borderCrossing: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			bicycle: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			hitchHiking: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
		},
	// Eating and Meals
		food: {
			overview: String,
			habits: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String,
				title: String,
				explanation: String,
			}],
			foods: [{
				Id: String,
				order: Number,
				category: String,
				tagline: String,
				description: String,
				suggestedRestaurant: String,
				dishes: Array,
				area: String,
				address: String,
				whatToOrder: String,
				contains: Array,
				readMore: String
			}],
			dishs: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String,
				title: String,
				meal: String,
				cuisinse: String,
				explanation: String,
			}],
			drinks: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String, 
				title: String,
				explanation: String,
				isAlcoholic: Boolean,
			}],
			restaurants: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String, 
				category: String,
				address: String,
				title: String,
				explanation: String,
			}],
			bars: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String, 
				category: String,
				address: String,
				title: String,
				explanation: String,
			}],
		},
	// Top Places
		top: {
			destinations: [{
				order: String,
				name: String,
				type: String,
				id: String,
			}],
			attractions: [{
				order: String,
				name: String,
				city: String,
				id: String,
			}],
			geographicalLandmarks: [{
				order: String,
				name: String,
				classification: String,
			}],
		},
		nearby: [{
				order: String,
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