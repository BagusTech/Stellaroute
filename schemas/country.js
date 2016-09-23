const Duck = require('../modules/duck');

const Country = Duck({
	Table: 'Countries',
	Item: {
		Id: String,
	//Required Fields Card
		names: {
			display: String, 
			official: String,
			native: Array,
			alias: Array,
		},
		languages: Array,
		abbreviation: String,
		currency: String,
		currenySmbol: String,
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
			orderRanking: String,
			postTitle: String,
			advice: String,
		}],
	//Travel Basics 
		travelBasics: {
			primaryAirports: [{
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
			electricityType: String,
			water: {
				quality: String,
				explanation: String,
			},
			toilets: {
				types: String,
				explanation: String,
			},
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
		atms: {
			acceptedCards: Array,
			availability: String,
			explanation: String,
		},
		exchanging: {
			title: String,
			explanation: String,
		},
		clothing: [{
			whatToWear: String,
			explanation: String,
		}],
	// People and Customs
		customs: {
			tipping: {
				tippingPractice: String,
				explanation: String,
			},
			bargaining: {
				bargainingStyle: String,
				explanation: String,
			}, 
			dressStyle: {
				dress: String,
				explanation: String,
			},
		},
		people: [{
			practices: String,
			explanation: String,
		}],
		traditions: [{
			title: String,
			explanation: String,
		}],
	//Quick Facts (or Fun Facts)
		quickFact: [{
					title: String,
					explanation: String,
				}],
	//When to Go
		whenToGo: {
			months: Array,
			description: String,
		},
		climate: String,
		seasons: [{
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
	//Communication
	//Getting Around
		transitDescription: String,
		suggestedTransit: {
			mode: String,
			description: String,
		},
		transitAdvice: [{
				title: String,
				explanation: String,
			}],
		car: {
			roadQuality: String,
			tolls: String,
			drivingStyle: String,
			explanation: String,
		},
		taxis: {
			alias: String,
			bargainingStyle: String,
			explanation: String,
		},
		train: {
			trainQuality: String,
			reliability: String,
			explanation: String,
		},
		bus: {
			operators: Array,
			explanation: String,	
		},
		publicTransit: {
			quality: String,
			explanation: String,
		},
		bike: {
			friendliness: String,
			explanation: String,
			
		},
		hitchHiking: {
			title: String,
			explanation: String, 
		},

	//Fascilities and Infrastructure 
	// Eating and Meals 
			eatingHabits: [{
				title: String,
				explanation: String,
			}],
	//Top Places
		//Top Destinations
		//Top Attractions
		//Geographical Landmarks 
	//Regions
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name']
});

module.exports = Country;