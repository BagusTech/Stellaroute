const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const WorldRegion = require('../schemas/world-region');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const Province = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City = require('../schemas/city');
const CityRegion = require('../schemas/city-region');
const Neighborhood = require('../schemas/neighborhood');
const router = express.Router();

const missingLocationUrl = '/'
const missingLocationMessage = 'Sorry, that location doesn\'t exist.';

router.get('/:continent', function(req, res, next){
	const continent = Continent.findOne('url', req.params.continent);

	if(!continent){
		next();
		return;
	}

	const worldRegions = WorldRegion.find('continent', continent.Id).sort(sortBy('name'));
	const countries = Country.find('continent', continent.Id).sort(sortBy('name'));

	res.render('locations/continents/continent', {
		title: `Stellaroute: ${continent.name}`,
		description: `Stellaroute: ${continent.name} Overview`,
		continent: continent,
		worldRegions: worldRegions,
		countries: countries,
		key: Continent.hash
	});
});

router.get('/:worldRegion', function(req, res, next){
	const worldRegion = WorldRegion.join('continent', Continent.cached(), 'Id', 'name')
								 .findOne('name', req.params.worldRegion);
	if(!worldRegion){
		next();
		return;
	}

	const countries = Country.find('worldRegions', worldRegion.Id).sort(sortBy('name'));

	res.render('locations/world-regions/world-region', {
		title: `Stellaroute: ${worldRegion.name}`,
		description: 'Stellaroute: ${worldRegion.name} Overview',
		continents: Continent.cached().sort(sortBy('name')),
		countries: countries,
		key: WorldRegion.hash,
		worldRegion: worldRegion
	});
});

router.get('/:country', function(req, res, next){
	const country = Country.join('continent', Continent.cached(), 'Id', 'name')
						   .join('worldRegions', WorldRegion.cached(), 'Id', 'name')
						   .findOne('name', req.params.country);

	if(!country){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const provinces = Province.find('country', country.Id).sort(sortBy('name'));

	res.render('locations/countries/country', {
		title: `Stellaroute: ${country.name}`,
		description: 'Stellaroute: ${country.name} Overview',
		continents: Continent.cached().sort(sortBy('name')),
		country: country,
		key: Country.hash,
		countryRegions: CountryRegion.find('country', country.Id),
		worldRegions: WorldRegion.cached().sort(sortBy('name')),
		provinces: provinces,
	});
});

router.get('/:country/:countryRegion', function(req, res, next){
	const country = Country.findOne('name', req.params.country);

	if(!country){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const countryRegion = CountryRegion.join('country', Country.cached(), 'Id', 'name')
									   .findOne('name', req.params.countryRegion);
	if(!countryRegion){
		next();
		return;
	}

	const provinces = Province.find('countryRegions', countryRegion.Id);

	res.render('locations/countries/country-region', {
		title: `Stellaroute: ${countryRegion.name}`,
		description: 'Stellaroute: ${countryRegion.name} Overview',
		countries: Country.cached().sort(sortBy('name')),
		key: CountryRegion.hash,
		countryRegion: countryRegion,
		provinces: provinces,
	});
});

router.get('/:country/:province', function(req, res, next){
	const province = Province.join('continent', Continent.cached(), 'Id', 'name')
							 .join('worldRegions', WorldRegion.cached(), 'Id', 'name')
							 .join('country', Country.cached(), 'Id', 'name')
						     .join('countryRegions', CountryRegion.cached(), 'Id', 'name')
						     .findOne('name', req.params.province);
	
	if(!province){
		next();
		return;
	}

    const countryRegions = CountryRegion.find('country', province.country);
	const provinceRegions = ProvinceRegion.find('province', province.Id);
	const cities = City.find('province', province.Id);

	res.render('locations/provinces/province', {
		title: `Stellaroute: ${province.name}`,
		description: 'Stellaroute: ${province.name} Overview',
		key: Province.hash,
		continents: Continent.find(),
		worldRegions: WorldRegion.find(),
		countryRegions: countryRegions,
		province: province,
		provinceRegions: provinceRegions,
		cities: cities,
	});
});

router.get('/:country/:province/:provinceRegion', function(req, res, next){
	const province = Province.findOne('name', req.params.province);
	
	if(!province){
		next();
		return;
	}

	const provinceRegion = ProvinceRegion.join('province', Province.cached(), 'Id', 'name')
									     .join('countryRegions', CountryRegion.cached(), 'Id', 'name')
									     .findOne('name', req.params.provinceRegion);
	if(!provinceRegion){
		next();
		return;
	}

	const country = Country.findOne('Id', req.params.country);
	const countryRegions = CountryRegion.find('country', country.Id);
	const cities = City.find('provinceRegions', provinceRegion.Id);

	res.render('locations/provinces/province-region', {
		title: `Stellaroute: ${provinceRegion.name}`,
		description: 'Stellaroute: ${provinceRegion.name} Overview',
		key: ProvinceRegion.hash,
		countryRegions: countryRegions,
		provinceRegion: provinceRegion,
		cities: cities,
		country: country,
	});
});

router.get('/:country/:city', function(req, res, next){
	const city = City.join('country', Country.cached(), 'Id', 'name')
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'name' )
					 .join('province', Province.cached(), 'Id', 'name' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'name' )
					 .findOne('name', req.params.city);
	
	if(!city){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const countryRegions = CountryRegion.find('country', city.country)
	const provinces = Province.find('country', city.country)
	var provinceRegions = [];
	const cityRegions = CityRegion.find('city', city.Id);
	const neighborhoods = Neighborhood.find('city', city.Id);

	provinces.forEach(function(p){
		provinceRegions = provinceRegions.concat(ProvinceRegion.find('province', p.Id))
	});

	res.render('locations/cities/city', {
		title: `Stellaroute: ${city.name}`,
		description: 'Stellaroute: ${city.name} Overview',
		key: City.hash,
		countryRegions: countryRegions,
		provinces: provinces,
		provinceRegions: provinceRegions,
		city: city,
		cityRegions: cityRegions,
		neighborhoods: neighborhoods,
	});
});

router.get('/:country/:city/:cityRegion', function(req, res, next){
	const country = Country.findOne('name', req.params.country);

	if(!country){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const city = City.findOne('name', req.params.city);
	
	if(!city){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const cityRegion = CityRegion.join('city', City.cached(), 'Id', 'name')
								 .findOne('name', req.params.cityRegion);

	if(!cityRegion){
		next();
		return;
	}

	const neighborhoods = Neighborhood.find('cityRegions', cityRegion.Id);

	res.render('locations/cities/city-region', {
		title: `Stellaroute: ${cityRegion.name}`,
		description: 'Stellaroute: ${cityRegion.name} Overview',
		key: CityRegion.hash,
		country: country,
		cityRegion: cityRegion,
		neighborhoods: neighborhoods,
	});
});

router.get('/:country/:city/:neighborhood', function(req, res, next){
	const neighborhood = Neighborhood.join('city', City.cached(), 'Id', 'name')
									 .join('cityRegions', CityRegion.cached(), 'Id', 'name')
									 .findOne('name', req.params.neighborhood);
	if(!neighborhood){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const country = Country.findOne('name', req.params.country);
	const cityRegions = CityRegion.find('city', neighborhood.city).sort(sortBy('name'))

	res.render('locations/cities/neighborhood', {
		title: `Stellaroute: ${neighborhood.name}`,
		description: 'Stellaroute: ${neighborhood.name} Overview',
		key: Neighborhood.hash,
		country: country,
		cityRegions: cityRegions,
		neighborhood: neighborhood,
	});
});

module.exports = router;