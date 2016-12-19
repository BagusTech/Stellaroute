const Duck = require('../modules/duck');

const Neighborhood = Duck({
	Table: 'Neighborhoods',
	Item: {
		Id: String,
		url: String,
		description: String,
		tagline: String,
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
		//isAutonomous: Boolean,
		backgroundImage: String,
		cardImage: String,
		images: Array,
		city: String,
		cityRegions: Array,
		nearbyNeighborhoods: Array,
		eatingDrinking: {
			image: String,
			description: String,
		},
		shopping: {
			image: String,
			description: String,
		},
	// Orientation
		orientation: {
			description: String,
			map: String,
			waysToGetThere: [{
				name: String,
				method: String,
				stops: Array,
			}],
			mainIntersection: String,
			mainStrip: String,
			distanceFrom: [{
				order: Number,
				name: String,
				type: String,
				waysToGetThere: [{
					method: String,
					distance: String,
					description: String,
					time: String,
				}],
			}],
		},
	// Exploreing
		explore: {
			map: String,
			areas: [{
				name: String,
				description: String,
				suggestedSpots: [{
					type: String,
					name: String,
					link: String,
				}],
			}],
		},
		notiblePlaces: [{
			image: String,
			name: String,
			description: String,
			address: String,		
		}],
	// At a Glance Card
		averageStay: String,
		bestTimeToVisit: Array,
		topPlaces: Array,	
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
			description: String,
		}],
	// Quick Facts (or Fun Facts)
		quickFacts: [{
			order: Number,
			endorse: Boolean,
			remove: Boolean, 
			title: String,
			description: String,
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
				stops: [{
					name: String,
					lines: Array,
					description: String,
				}], 
				order: Number,
				endorse: Boolean,
				remove: Boolean,
				image: String, 
				map: String, 
				title: String,
				description: String,
			}],
			/*airports: [{
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
			}],*/
			bicycle: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
			}],
			/*hitchHiking: [{
				order: Number,
				endorse: Boolean,
				remove: Boolean, 
				title: String,
				description: String,
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
			}],
		},
	// Main Attractions
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