const express        = require('express');
const flash          = require('connect-flash');
const sortBy         = require('../modules/sortBy');
const pickTable      = require('../modules/pickTable');
const User           = require('../schemas/user');
const Attraction     = require('../schemas/attraction');
const Guide          = require('../schemas/guide');
const Continent      = require('../schemas/continent');
const WorldRegion    = require('../schemas/world-region');
const Country        = require('../schemas/country');
const CountryRegion  = require('../schemas/country-region');
const Province       = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City           = require('../schemas/city');
const CityRegion     = require('../schemas/city-region');
const Neighborhood   = require('../schemas/neighborhood');
const router         = express.Router();

router.get('/:user', (req, res, next) => {
	const user = User.findOne('username', req.params.user).items || User.findOne('Id', req.params.user).items;

	if(!user) {
		next();
		return;
	}

	const isMe = req.user && req.user.Id === user.Id;
	const guides = Guide.find('author', user.Id).join('countries', Country.cached(), 'Id', 'names.display').items;
	const countries = [];
	const favorites = user.favorites && user.favorites.map((favorite) => {
		const guide = Guide.findOne('Id', favorite.guide).items;
		//const card = guide.cards.find((_card) => {});

		return guide
	});
	let hasUnknown = false;

	guides.forEach((guide) => {
		if(!guide.countriesDisplay) {
			hasUnknown = true;
			return;
		}

		guide.countriesDisplay.forEach((country) => {
			if(countries.indexOf(country) > -1 || (!guide.isPublished && !isMe)) {
				return;
			}

			countries.push(country);
		});
	});

	if (hasUnknown) {
		countries.splice(0, 0, 'Unknown')
	}

	res.locals.userProfile = user;
	res.locals.isMe = isMe;

	res.render('profile/profile', {
		title: `Stellaroute: ${isMe ? 'Youre profile' : user.username+"'s Profile"}`,
		description: 'Stellaroute: It\'s a pretty nice place to see other peoples things and edit your own.',
		favorites,
		guides,
		countries
	});
});

router.get('/:user/:guide', (req, res, next) => {
	let user = User.findOne('username', req.params.user).items;
	const userById = User.findOne('Id', req.params.user).items;

	if(!user && userById) {
		if(userById.username) {
			res.redirect(`/${userById.username}/${req.params.guide}`);
			return;
		}

		user = userById;
	}

	const guide = Guide.find('url', req.params.guide).findOne('author', user && user.Id).items;

	if(!user || !guide) {
		next();
		return;
	}

	const isMe = req.user && req.user.Id === user.Id;

	res.locals.userProfile = user;
	res.locals.isMe = isMe;

	if(!isMe && !guide.isPublished) {
		req.flash('error', 'That guide isn\'t published yet, but you can look at their other guides!');
		res.redirect(`/${user.username || user.Id}`);
		return;
	}

	const author = user;
	const _cards = guide.cards || [];

	let endSubCards = _cards.length
	const cards = _cards.map((_card, cardIndex, arr) => {
		const obj = {};

		obj.section = _card
		obj.subCards = [];

		if(obj.section.style !== 'section') {
			return obj;
		}

		const startIndex = cardIndex;
		let endIndex = _cards.length;
		obj.subCards = arr.filter((_subCard, subCardIndex) => {
			if(subCardIndex < cardIndex || subCardIndex >= endSubCards) {
				return false;
			}

			if(_subCard.style === 'section') {
				if(cardIndex !== subCardIndex) {
					endSubCards = subCardIndex;
					endIndex = subCardIndex;
				}
				return false;
			}

			return true;
		});

		_cards.splice(startIndex, (endIndex - startIndex - 1));

		endSubCards = _cards.length;
		return obj;
	}).filter((_) => _);

	res.render('guides/guide', {
		title: `Stellaroute: ${guide.names.display}`,
		description: `Stellaroute: ${guide.names.display} Overview`,
		guide,
		author,
		cards,
		countries: Country.cached().sort(sortBy('url')),
		startInEditMode: !(cards && cards.length)
	});
});

/*
router.get('/:continent', (req, res, next) => {
	const continent = Continent.findOne('url', req.params.continent).items;

	if(!continent){
		next();
		return;
	}

	const worldRegions = WorldRegion.find('continent', continent.Id).items.sort(sortBy('url'));
	const countries = Country.find('continent', continent.Id).items.sort(sortBy('url'));

	res.render('locations/continents/continent', {
		title: `Stellaroute: ${continent.names.display}`,
		description: `Stellaroute: ${continent.names.display} Overview`,
		continent: continent,
		worldRegions: worldRegions,
		countries: countries,
		key: Continent.hash
	});
});

router.get('/:worldRegion', (req, res, next) => {
	const worldRegion = WorldRegion.findOne('url', req.params.worldRegion)
								   .join('continent', Continent.cached(), 'Id', 'names.display')
								   .items[0];

	if(!worldRegion){
		next();
		return;
	}

	const countries = Country.find('worldRegions', worldRegion.Id).items.sort(sortBy('url'));

	res.render('locations/world-regions/world-region', {
		title: `Stellaroute: ${worldRegion.names.display}`,
		description: `Stellaroute: ${worldRegion.names.display} Overview`,
		continents: Continent.cached().sort(sortBy('url')),
		countries: countries,
		key: WorldRegion.hash,
		worldRegion: worldRegion
	});
});

router.get('/:country', (req, res, next) => {
	const country = Country.findOne('url', req.params.country)
						   .join('continent', Continent.cached(), 'Id', 'names.display')
						   .join('worldRegions', WorldRegion.cached(), 'Id', 'names.display')
						   .items[0];

	if(!country){
		next();
		return;
	}

	const provinces = Province.find('country', country.Id).items.sort(sortBy('url'));
	const attractions = Attraction.find('country', country.Id).items.sort(sortBy('url'));
	const cities = City.find('country', country.Id).items.sort(sortBy('url'))
	const guides = Guide.find('countries', country.Id).join('cities', City.cached(), 'Id', 'names.display').items;

	res.render('locations/countries/country', {
		title: `Stellaroute: ${country.names.display}`,
		description: `Stellaroute: ${country.names.display} Overview`,
		continents: Continent.cached().sort(sortBy('url')),
		country: country,
		key: Country.hash,
		countryRegions: CountryRegion.find('country', country.Id).items,
		worldRegions: WorldRegion.cached().sort(sortBy('url')),
		provinces: provinces,
		cities: cities,
		attractions: attractions,
		guides: guides,
	});
});

router.get('/:country/food', (req, res, next) => {
	const country = Country.findOne('url', req.params.country)
						   .join('continent', Continent.cached(), 'Id', 'names.display')
						   .join('worldRegions', WorldRegion.cached(), 'Id', 'names.display')
						   .items[0];

	if(!country){
		next();
		return;
	}

	const provinces = Province.find('country', country.Id).items.sort(sortBy('url'));
	const attractions = Attraction.find('country', country.Id).items.sort(sortBy('url'));

	res.render('locations/countries/food', {
		title: `Stellaroute: ${country.names.display}`,
		description: `Stellaroute: ${country.names.display} Overview`,
		continents: Continent.cached().sort(sortBy('url')),
		country: country,
		key: Country.hash,
		countryRegions: CountryRegion.find('country', country.Id).items,
		worldRegions: WorldRegion.cached().sort(sortBy('url')),
		provinces: provinces,
		attractions: attractions,
	});
});

router.get('/:country/:attraction', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const attraction = Attraction.findOne('url', req.params.attraction).items;
	if(!attraction){
		next();
		return;
	}

	res.render('locations/countries/attraction', {
		title: `Stellaroute: ${attraction.names.display}`,
		description: `Stellaroute: ${attraction.names.display} Overview`,
		key: Attraction.hash,
		country: country,
		attraction: attraction,
	});
});

router.get('/:country/:countryRegion', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const countryRegion = CountryRegion.findOne('url', req.params.countryRegion).items;
	if(!countryRegion){
		next();
		return;
	}

	const provinces = Province.find('countryRegions', countryRegion.Id).items;

	res.render('locations/countries/country-region', {
		title: `Stellaroute: ${countryRegion.names.display}`,
		description: `Stellaroute: ${countryRegion.names.display} Overview`,
		countries: Country.cached().sort(sortBy('url')),
		key: CountryRegion.hash,
		country: country,
		countryRegion: countryRegion,
		provinces: provinces,
	});
});

router.get('/:country/:province', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const province = Province.find('url', req.params.province)
							 .findOne('country', country.Id)
							 .join('continent', Continent.cached(), 'Id', 'names.display')
							 .join('continent', Continent.cached(), 'Id', 'url')
							 .join('worldRegions', WorldRegion.cached(), 'Id', 'names.display')
							 .join('worldRegions', WorldRegion.cached(), 'Id', 'url')
						     .join('countryRegions', CountryRegion.cached(), 'Id', 'names.display')
						     .join('countryRegions', CountryRegion.cached(), 'Id', 'url')
						     .items[0];

	if(!province){
		next();
		return;
	}

    const countryRegions = CountryRegion.find('country', province.country).items;
	const provinceRegions = ProvinceRegion.find('province', province.Id).items;
	const cities = City.find('province', province.Id).items;

	res.render('locations/provinces/province', {
		title: `Stellaroute: ${province.names.display}`,
		description: `Stellaroute: ${province.names.display} Overview`,
		key: Province.hash,
		continents: Continent.cached().sort(sortBy('url')),
		worldRegions: WorldRegion.cached().sort(sortBy('url')),
		country: country,
		countryRegions: countryRegions,
		province: province,
		provinceRegions: provinceRegions,
		cities: cities,
	});
});

router.get('/:country/:province/:provinceRegion', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const province = Province.findOne('url', req.params.province).items;
	
	if(!province){
		next();
		return;
	}

	const provinceRegion = ProvinceRegion.findOne('url', req.params.provinceRegion)
										 .join('province', Province.cached(), 'Id', 'names.display')
										 .join('province', Province.cached(), 'Id', 'url')
									     .join('countryRegions', CountryRegion.cached(), 'Id', 'names.display')
									     .join('countryRegions', CountryRegion.cached(), 'Id', 'url')
									     .items[0];
	if(!provinceRegion){
		next();
		return;
	}

	const countryRegions = CountryRegion.find('country', country.Id).items;
	const cities = City.find('provinceRegions', provinceRegion.Id).items;

	res.render('locations/provinces/province-region', {
		title: `Stellaroute: ${provinceRegion.names.display}`,
		description: `Stellaroute: ${provinceRegion.names.display} Overview`,
		key: ProvinceRegion.hash,
		countryRegions: countryRegions,
		provinceRegion: provinceRegion,
		cities: cities,
		country: country,
	});
});

router.get('/:country/:city', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const city = City.find('url', req.params.city)
					 .findOne('country', country.Id)
					 .join('country', Country.cached(), 'Id', 'names.display')
					 .join('country', Country.cached(), 'Id', 'url')
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'names.display' )
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'url' )
					 .join('province', Province.cached(), 'Id', 'names.display' )
					 .join('province', Province.cached(), 'Id', 'url' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'names.display' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'url' )
					 .join('topPlaces', Neighborhood.cached(), 'Id', 'names.display')
					 .items[0];
	
	if(!city){
		next();
		return;
	}

	const attractions = Attraction.find('city', city.Id).items;
	const guides = Guide.find('Id', city.guides).items;
	const countryRegions = CountryRegion.find('country', city.country).items;
	const provinces = Province.find('country', city.country).items;
	let provinceRegions = [];
	const cityRegions = CityRegion.find('city', city.Id).items;
	const neighborhoods = Neighborhood.find('city', city.Id).items;

	provinces.forEach(function(p){
		provinceRegions = provinceRegions.concat(ProvinceRegion.find('province', p.Id).items)
	});

	res.render('locations/cities/city', {
		title: `Stellaroute: ${city.names.display}`,
		description: `Stellaroute: ${city.names.display} Overview`,
		key: City.hash,
		attractions: attractions,
		guides: guides,
		countryRegions: countryRegions,
		provinces: provinces,
		provinceRegions: provinceRegions,
		city: city,
		cityRegions: cityRegions,
		neighborhoods: neighborhoods,
	});
});

router.get('/:country/:city/:guide', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const city = City.findOne('url', req.params.city)
					 .join('country', Country.cached(), 'Id', 'names.display')
					 .join('country', Country.cached(), 'Id', 'url')
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'names.display' )
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'url' )
					 .join('province', Province.cached(), 'Id', 'names.display' )
					 .join('province', Province.cached(), 'Id', 'url' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'names.display' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'url' )
					 .items[0];

	if(!city) {
		next();
		return;
	}

	const guide = Guide.findOne('url', req.params.guide).items;

	if(!guide) {
		next();
		return;
	}

	if(guide.highlights) {
		const length = guide.highlights.length

		for (let i = 0; i < length; i++) {
			const highlight = guide.highlights[i];

			if(highlight.Id && highlight.table) {
				const table = pickTable(highlight.table);

				const referenceItem = table.findOne('Id', highlight.Id).items

				if(referenceItem) {
					guide.highlights[i].cardImage = guide.highlights[i].cardImage || referenceItem.cardImage;
					guide.highlights[i].title = guide.highlights[i].title || referenceItem.names.display || 'Oops, looks like there isn\'t a title!';
					guide.highlights[i].description = (guide.highlights[i].description && guide.highlights[i].description !== '<p><br></p>' && guide.highlights[i].description !== '<br>') ? guide.highlights[i].description : (referenceItem.description || 'Woopsy Daisy! Need to get a description here...');
				}
			}
		}
	}

	if(guide.days) {
		const daysLength = guide.days.length

		for (let i = 0; i < daysLength; i++) {
			const day = guide.days[i];

			if(day.cards){
				const cardsLength = day.cards.length;

				for (let j = 0; j < cardsLength; j++) {
					const card = day.cards[j];

					if(card.Id && card.table) {
						const table = pickTable(card.table);

						const referenceItem = table.findOne('Id', card.Id).items

						if(referenceItem) {
							card.image = card.image || referenceItem.cardImage;
							card.title = card.title || referenceItem.names.display || 'Oops, looks like there isn\'t a title!';							
							card.description = (card.description && card.description !== '<p><br></p>' && card.description !== '<br>') ? card.description : (referenceItem.description || 'Woopsy Daisy! Need to get a description here...');
						}
					}
				}
			}
		}
	}

	const countryRegions = CountryRegion.find('country', city.country).items
	const provinces = Province.find('country', city.country).items
	let provinceRegions = [];
	const cityRegions = CityRegion.find('city', city.Id).items;
	const neighborhoods = Neighborhood.find('city', city.Id).items;

	provinces.forEach(function(p){
		provinceRegions = provinceRegions.concat(ProvinceRegion.find('province', p.Id).items)
	});

	res.render('guides/guide', {
		title: `Stellaroute: ${city.names.display}`,
		description: `Stellaroute: ${city.names.display} Overview`,
		key: City.hash,
		guide: guide,
		country: country,
		countryRegions: countryRegions,
		provinces: provinces,
		provinceRegions: provinceRegions,
		city: city,
		cityRegions: cityRegions,
		neighborhoods: neighborhoods,
	});
});

router.get('/:country/:city/attraction/:attraction', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const city = City.findOne('url', req.params.city)
					 .join('country', Country.cached(), 'Id', 'names.display')
					 .join('country', Country.cached(), 'Id', 'url')
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'names.display' )
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'url' )
					 .join('province', Province.cached(), 'Id', 'names.display' )
					 .join('province', Province.cached(), 'Id', 'url' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'names.display' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'url' )
					 .items[0];

	const attraction = Attraction.findOne('url', req.params.attraction).items;

	if(!attraction){
		next();
		return;
	}

	const nearbyAttractions = Attraction.find('Id', attraction.nearbyAttractions).items;
	const subAttractions = Attraction.find('Id', attraction.subAttractions).items;
	const parentAttraction = attraction.parentAttraction ? Attraction.findOne('Id', attraction.parentAttraction).items : null;
	const siblingAttractions = parentAttraction ? Attraction.find('parentAttraction', attraction.parentAttraction).items.filter((i) => i.Id !== attraction.Id) : null;

	const countryRegions = CountryRegion.find('country', city.country).items
	const provinces = Province.find('country', city.country).items
	let provinceRegions = [];
	const cityRegions = CityRegion.find('city', city.Id).items;
	const neighborhoods = Neighborhood.find('city', city.Id).items;

	provinces.forEach(function(p){
		provinceRegions = provinceRegions.concat(ProvinceRegion.find('province', p.Id).items)
	});

	res.render('attractions/attraction', {
		title: `Stellaroute: ${attraction.names.display}`,
		description: `Stellaroute: ${attraction.names.display} Overview`,
		key: City.hash,
		attraction: attraction,
		country: country,
		countryRegions: countryRegions,
		provinces: provinces,
		provinceRegions: provinceRegions,
		city: city,
		cityRegions: cityRegions,
		neighborhoods: neighborhoods,
		nearbyAttractions: nearbyAttractions,
		subAttractions: subAttractions,
		parentAttraction: parentAttraction,
		siblingAttractions: siblingAttractions,
	});
});

router.get('/:country/:city/:cityRegion', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		next();
		return;
	}

	const city = City.findOne('url', req.params.city)
					 .items;
	
	if(!city){
		next();
		return;
	}

	const cityRegion = CityRegion.findOne('url', req.params.cityRegion)
								 .items;

	if(!cityRegion){
		next();
		return;
	}

	const neighborhoods = Neighborhood.find('cityRegions', cityRegion.Id).items;

	res.render('locations/cities/city-region', {
		title: `Stellaroute: ${cityRegion.names.display}`,
		description: `Stellaroute: ${cityRegion.names.display} Overview`,
		key: CityRegion.hash,
		country: country,
		city: city,
		cityRegion: cityRegion,
		neighborhoods: neighborhoods,
	});
});

router.get('/:country/:city/:neighborhood', (req, res, next) => {
	const country = Country.findOne('url', req.params.country).items;
	const city = City.findOne('url', req.params.city).items;
	const neighborhood = Neighborhood.findOne('url', req.params.neighborhood)
									 .join('cityRegions', CityRegion.cached(), 'Id', 'names.display')
									 .items[0];
	if(!country || !city || !neighborhood){
		next();
		return;
	}

	const cityRegions = CityRegion.find('city', neighborhood.city).items.sort(sortBy('url'))
	const nearbyNeighborhoods = neighborhood.nearbyNeighborhoods ? Neighborhood.find().items.filter((i) => neighborhood.nearbyNeighborhoods.indexOf(i.Id) > -1) : []

	res.render('locations/cities/neighborhood', {
		title: `Stellaroute: ${neighborhood.names.display}`,
		description: `Stellaroute: ${neighborhood.names.display} Overview`,
		key: Neighborhood.hash,
		country: country,
		city: city,
		cityRegions: cityRegions,
		neighborhood: neighborhood,
		nearbyNeighborhoods: nearbyNeighborhoods,
	});
}); */

module.exports = router;