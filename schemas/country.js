const Duck = require('../modules/duck');

const Country = Duck({
	Table: 'Countries',
	Item: {
		Id: String,
		url: String,
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
		abbreviation: String,
		continent: Array,
		worldRegions: Array,
	//At a Glance Card
		averageStay: String,
		bestTimeToVisit: Array,
		topPlaces: Array,	
		tagline: String,
		overview: String,
	// Need to Know
		needToKnow: [{
			order: Number,
			category: String,
				/*
					communication
				*/
			title: String,
			advice: String,
		}],
	//Quick Facts (or Fun Facts)
		quickFact: [{
			order: Number,
			title: String,
			explanation: String,
		}],
	//Travel Basics 
		airports: [{
			city: String,
			airport: String,
			abbreviation: String,
		}],
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
		};
		mobile: {
			simCard: bolean,
			explanation: String,
		};
		water: {
			quality: String,
			explanation: String,
		},
		toilets: {
			types: Array,
			explanation: String,
		},
		visa: [{
			countries: Array,
			requirements: String,
			explanation: String,
		}],
		vaccines: [{
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
			}
		},
		clothing: [{
			whatToWear: String,
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
			dress: {
				style: String,
				explanation: String,
			},
			traditions: [{
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
				language: String,
				saying: String,
				translation: String,
				explanation: String,
			}],
			expressions: [{
				language: String,
				phrase: String,
				translation: String,
				explanation: String,
			}],
			/*nonVerbal: [{
				title: String,
				explanation: String,
			}], */
		},
	// Getting Around
		transit: {
			overview: String,
			roadQuality: String,
			suggested: [{
				order: Number,
				mode: String,
				description: String,
			}],
			advice: [{
				title: String,
				description: String,
			}],
			public: {
				quality: String,
				title: String,
				explanation: String,
			},
			car: {
				roadQuality: String,
				tolls: String,
				drivingStyle: String,
				title: String,
				explanation: String,
			},
			taxis: {
				alias: String,
				bargaining: String,
				explanation: String,
			},
			train: {
				operators: Array,
				trainQuality: String,
				reliability: String,
				title: String,
				explanation: String,
			},
			bus: {
				operators: Array,
				title: String,
				explanation: String,
			},
			
			boats: {
				title: String,
				explanation: String,
				
			},
			bike: {
				friendliness: String,
				title: String,
				explanation: String,
				
			},
			hitchHiking: {
				title: String,
				explanation: String, 
			},
		},
	//Fascilities and Infrastructure 
	// Eating and Meals
		food: {
			overview: String,
			habits: [{
				order: Number,
				title: String,
				explanation: String,
			}],
			dishs: [{
				order: Number,
				title: String,
				mealType: String,
				cuisinse: String,
				explanation: String,
			}],
			drinks: [{
				order: Number,
				title: String,
				drinkType: String,
				explanation: String,
				isAlcoholic: Boolean,
			}],
		}
	//Top Places
		top: {
			destinations: [{
				order: String,
				name: String,
				type: String,
			}],
			attractions: [{
				order: String,
				name: String,
				city: String,
			}],
			geographicalLandmarks: [{
				order: String,
				name: String,
				classification: String,
			}],
		}
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name']
});

module.exports = Country;