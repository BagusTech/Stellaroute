const Duck = require('../modules/duck');

const Neighborhood = Duck({
	Table: 'Neighborhoods',
	Item: {
		Id: String,
		url: String,
		description: String,
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
		cardImage: String,
		images: Array,
		city: String,
		cityRegions: Array,
	//At a Glance Card
		averageStay: String,
		bestTimeToVisit: Array,
		topPlaces: Array,	
		tagline: String,
		overview: String,
		goodFor: [{ //Good For (Staying / Eating / Sightseeing / Nightlfe)
			order: Number,
			category: String,
		}],
		popularWith: [{ //The types of people that like this neighborhood 
			order: Number,
			crowd: String,
		}],
	// Need to Know
		needToKnow: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	////Quick Facts (or Fun Facts)
		quickFact: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			explanation: String,
		}],
	// When to Go
		festival: [{
			name: String,
			alias: Array,
			type: String, ///ability to destingious between event/festival type. ie Cherry Blossoms as oppose to a Musica Festival???
			date: String,
			description: String,
		}],
	// Getting Around
		transit: {
			overview: String,
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
				stops: [{
					name: String,
					lines: Array,
					explanation: String,
				}], 
				order: Number,
				endorse: Boolean,
				remove: Boolean,
				image: String, 
				map: String, 
				title: String,
				explanation: String,
			}],
			/*airports: [{
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
			}],*/
			bicycle: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],
			/*hitchHiking: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				explanation: String,
			}],*/
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
	//Main Attractions
		attractions: [{
				order: String,
				name: String,
				id: String,
			}],
		mainAttractions: [{ ///this is a list of the cities major sites and the approximate distance to them from that neighborhood
				order: String,
				name: String,
				id: String,
				mode: String, //transit mode
				time: String,
				distance: String, //need miles and km
				description: String,
			}],
		/*top: {
			destinations: [{
				order: String,
				name: String,
				type: String,
			}],
			geographicalLandmarks: [{
				order: String,
				name: String,
				classification: String,
			}],
		}
		nearby: [{
				order: String,
				name: String,
				type: String,
				id: String,
		}],*/
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', 'city']
}, null, false);

module.exports = Neighborhood;