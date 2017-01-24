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
			isEndorsed: Boolean,
			remove: Boolean, 
			title: String,
			description: String,
		}],
	// Quick Facts (or Fun Facts)
		quickFacts: [{
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
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			countries: Array,
			requirements: String,
			description: String,
		}],
		vaccines: [{
			order: Number,
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
			order: Number,
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
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				style: String,
				description: String,
			}],
			traditions: [{
				order: Number,
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
				description: String,
			}],
			expressions: [{
				order: Number,
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
			/* card: [{
				image: String, 
				title: String, 
				arrive: String,
				move: String,
				description: String,
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
				description: String,
			}],
			car: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			taxis: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			motorcycle: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			bus: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			train: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			public: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			airports: [{
				city: String,
				airport: String,
				abbreviation: String,
				description: String,
			}],
			plane: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			borderCrossing: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			bicycle: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			hitchHiking: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}], */
		},
	// Eating and Meals
		food: {
			overview: String,
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
			/* habits: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String,
				title: String,
				description: String,
			}],
			dishs: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String,
				title: String,
				meal: String,
				cuisinse: String,
				description: String,
			}],
			drinks: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String, 
				title: String,
				description: String,
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
				description: String,
			}],
			bars: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				image: String, 
				category: String,
				address: String,
				title: String,
				description: String,
			}], */
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