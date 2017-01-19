const Duck = require('../modules/duck');

const Country = Duck({
	Table: 'Countries',
	Item: {
		Id: String,
		url: String,
		abbreviation: String,
		image: String,
		continent: Array,
		worldRegions: Array,
	//At a Glance Card
		description: String,
		tagline: String,
		averageStay: String,
		bestTimeToVisit: Array,
		topPlaces: Array,
		climate: String,
		timeZones: Array,
	//Modal Fields Card
		names: {
			display: String,  
			official: String, 
			native: [{  
				name: String, 
				language: String,
			}],
			alias: Array, 
		},
	// Need to Know
		needToKnow: [{
			isEndorsed: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	//Quick Facts (or Fun Facts)
		quickFact: [{
			isEndorsed: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	//Travel Basics 
		entryTax: {
			amount: String,
			explanation: String,
		}, 
		exitTax: {
			amount: String,
			explanation: String,
		}, 
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
		seasons: [{
			order: Number,
			season: String,
			months: Array,
			description: String,
		}],
		holidays: [{
			name: String,
			alias: Array,
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
		},
	//Top Places
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
		}
	// Fascilities and Infrastructure 
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url']
}, null, false);

module.exports = Country;