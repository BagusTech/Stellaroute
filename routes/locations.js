const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/cache');
const duck = require('../modules/duck');
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
	const continent = Continent.findOne('url', req.params.continent).items;

	if(!continent){
		next();
		return;
	}


	const worldRegions = WorldRegion.find('continent', continent.Id).items.sort(sortBy('name'));
	const countries = Country.find('continent', continent.Id).items.sort(sortBy('name'));

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
	const worldRegion = WorldRegion.findOne('url', req.params.worldRegion)
								   .join('continent', Continent.cached(), 'Id', 'name')
								   .items[0];

	if(!worldRegion){
		next();
		return;
	}


	const countries = Country.find('worldRegions', worldRegion.Id).items.sort(sortBy('url'));

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
	const country = Country.findOne('url', req.params.country)
						   .join('continent', Continent.cached(), 'Id', 'name')
						   .join('worldRegions', WorldRegion.cached(), 'Id', 'name')
						   .items[0];

	if(!country){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const provinces = Province.find('country', country.Id).items.sort(sortBy('url'));

	res.render('locations/countries/country', {
		title: `Stellaroute: ${country.names.display}`,
		description: 'Stellaroute: ${country.names.display} Overview',
		continents: Continent.cached().sort(sortBy('name')),
		country: country,
		key: Country.hash,
		countryRegions: CountryRegion.find('country', country.Id).items,
		worldRegions: WorldRegion.cached().sort(sortBy('name')),
		provinces: provinces,
	});
});

router.get('/:country/:countryRegion', function(req, res, next){
	const country = Country.findOne('url', req.params.country).items;

	if(!country){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const countryRegion = CountryRegion.findOne('url', req.params.countryRegion).items;
	if(!countryRegion){
		next();
		return;
	}

	const provinces = Province.find('countryRegions', countryRegion.Id).items;

	res.render('locations/countries/country-region', {
		title: `Stellaroute: ${countryRegion.name}`,
		description: 'Stellaroute: ${countryRegion.name} Overview',
		countries: Country.cached().sort(sortBy('name')),
		key: CountryRegion.hash,
		country: country,
		countryRegion: countryRegion,
		provinces: provinces,
	});
});

router.get('/:country/:province', function(req, res, next){
	const country = Country.findOne('url', req.params.country).items;
	const province = Province.findOne(['url', 'country'], [req.params.province, country.Id])
							 .join('continent', Continent.cached(), 'Id', 'name')
							 .join('continent', Continent.cached(), 'Id', 'url')
							 .join('worldRegions', WorldRegion.cached(), 'Id', 'name')
							 .join('worldRegions', WorldRegion.cached(), 'Id', 'url')
						     .join('countryRegions', CountryRegion.cached(), 'Id', 'name')
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
		title: `Stellaroute: ${province.name}`,
		description: 'Stellaroute: ${province.name} Overview',
		key: Province.hash,
		continents: Continent.cached().sort(sortBy('name')),
		worldRegions: WorldRegion.cached().sort(sortBy('name')),
		country: country,
		countryRegions: countryRegions,
		province: province,
		provinceRegions: provinceRegions,
		cities: cities,
	});
});

router.get('/:country/:province/:provinceRegion', function(req, res, next){
	const province = Province.findOne('url', req.params.province).items;
	
	if(!province){
		next();
		return;
	}

	const provinceRegion = ProvinceRegion.findOne('url', req.params.provinceRegion)
										 .join('province', Province.cached(), 'Id', 'name')
										 .join('province', Province.cached(), 'Id', 'url')
									     .join('countryRegions', CountryRegion.cached(), 'Id', 'name')
									     .join('countryRegions', CountryRegion.cached(), 'Id', 'url')
									     .items[0];
	if(!provinceRegion){
		next();
		return;
	}

	const country = Country.findOne('url', req.params.country).items;
	const countryRegions = CountryRegion.find('country', country.Id).items;
	const cities = City.find('provinceRegions', provinceRegion.Id).items;

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
	const city = City.findOne('url', req.params.city)
					 .join('country', Country.cached(), 'Id', 'names.display')
					 .join('country', Country.cached(), 'Id', 'url')
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'name' )
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'url' )
					 .join('province', Province.cached(), 'Id', 'name' )
					 .join('province', Province.cached(), 'Id', 'url' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'name' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'url' )
					 .items[0];
	
	if(!city){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const countryRegions = CountryRegion.find('country', city.country).items
	const provinces = Province.find('country', city.country).items
	var provinceRegions = [];
	const cityRegions = CityRegion.find('city', city.Id).items;
	const neighborhoods = Neighborhood.find('city', city.Id).items;

	provinces.forEach(function(p){
		provinceRegions = provinceRegions.concat(ProvinceRegion.find('province', p.Id).items)
	});

	res.render('locations/cities/city', {
		title: `Stellaroute: ${city.names.display}`,
		description: 'Stellaroute: ${city.names.display} Overview',
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

	const country = Country.findOne('url', req.params.country)
						   .items;

	if(!country){
		console.log('1')
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const city = City.findOne('url', req.params.city)
					 .items;
	
	if(!city){
		console.log('2')
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const cityRegion = CityRegion.findOne('url', req.params.cityRegion)
								 .items;

	if(!cityRegion){
		console.log('3')
		next();
		return;
	}

	const neighborhoods = Neighborhood.find('cityRegions', cityRegion.Id).items;

	res.render('locations/cities/city-region', {
		title: `Stellaroute: ${cityRegion.names.display}`,
		description: 'Stellaroute: ${cityRegion.names.display} Overview',
		key: CityRegion.hash,
		country: country,
		city: city,
		cityRegion: cityRegion,
		neighborhoods: neighborhoods,
	});
});

router.get('/:country/:city/:neighborhood', function(req, res, next){
	const neighborhood = Neighborhood.findOne('url', req.params.neighborhood)
									 .join('city', City.cached(), 'Id', 'names.display')
									 .join('city', City.cached(), 'Id', 'url')
									 .join('cityRegions', CityRegion.cached(), 'Id', 'names.display')
									 .items[0];
	if(!neighborhood){
		req.flash('error', missingLocationMessage);
		res.redirect(missingLocationUrl);
		return;
	}

	const country = Country.findOne('url', req.params.country).items;
	const cityRegions = CityRegion.find('city', neighborhood.city).items.sort(sortBy('name'))

	res.render('locations/cities/neighborhood', {
		title: `Stellaroute: ${neighborhood.names.display}`,
		description: 'Stellaroute: ${neighborhood.names.display} Overview',
		key: Neighborhood.hash,
		country: country,
		cityRegions: cityRegions,
		neighborhood: neighborhood,
	});
});

router.post('/delete', function(req, res){
	const params = req.body;

	duck({Table: params.table, HASH: params.keyName,})
	.delete(params.key)
	.then(function success(){
		cache.del(params.table);

		req.flash('success', 'Successfully deleted!');
		res.redirect(params.redirect);
		return;
	}, function failed(err){
		console.error(err);
		req.flash('error', 'Something went wrong, please try again.');
		res.redirect(params.retry);
		return;
	});
});

module.exports = router;