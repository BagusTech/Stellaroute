const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const Province = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City = require('../schemas/city');
const CityRegion = require('../schemas/city-region');
const Neighborhood = require('../schemas/neighborhood');
const router = express.Router();

router.get('/', function(req, res){
	req.flash('info', 'That page doesn\'t exist, but this is a close second!');
	res.redirect('/countries');
});

router.post('/new', function(req, res){
	const params = req.body;

	const redirect = (params.redirect == 'city' ? `/cities/${params.name}` : params.redirect) || '/countries';
	delete params.redirect;

	if (typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	if (typeof params.worldRegions === 'string'){
		params.worldRegions = Array(params.worldRegions);
	}

	if (typeof params.countryRegions === 'string'){
		params.countryRegions = Array(params.countryRegions);
	}

	if (typeof params.province === 'string'){
		params.province = Array(params.province);
	}

	if (typeof params.provinceRegions === 'string'){
		params.provinceRegions = Array(params.provinceRegions);
	}

	City.add(params).then(function(data){
		// resolved
		City.updateCache().then(function(){
			req.flash('success', 'City Successfully added');
			res.redirect(redirect);
		}, function(err){
			console.error(err);
			res.redirect('/countries');
		})
	}, function(err){
		// rejected

		if(err && err.forUser){
			req.flash('error', err.forUser);
		}

		res.redirect(redirect);
	});
});

router.post('/update', Country.getCached(), City.getCached(), function(req, res){
	const redirect = req.body.redirect || '/countries';
	delete req.body.redirect;

	if (req.body.delete){

		City.delete(req.body[City.hash]).then(function(){
			// resolved

			City.updateCache().then(function(){
				req.flash('success', 'City successfully deleted');
				res.redirect(redirect);
			}, function(){
				res.redirect(redirect);
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		if (typeof params.continent === 'string'){
			params.continent = Array(params.continent);
		}

		if (typeof params.worldRegions === 'string'){
			params.worldRegions = Array(params.worldRegions);
		}

		if (typeof params.countryRegions === 'string'){
			params.countryRegions = Array(params.countryRegions);
		}

		if (typeof params.province === 'string'){
			params.province = Array(params.province);
		}

		if (typeof params.provinceRegions === 'string'){
			params.provinceRegions = Array(params.provinceRegions);
		}

		City.update(params, true).then(function(){
			// resolved update

			City.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'World Region successfully updated');
				res.redirect(`/cities/${req.body.name}`);
			}, function(){
				// rejected updateCache

				req.flash('error', 'There was a small issue, but the world region was updated');
				res.redirect(`/cities/${req.body.name}`);
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect(redirect);
	}
});

router.get('/:name', Country.getCached(), CountryRegion.getCached(), Province.getCached(), ProvinceRegion.getCached(), City.getCached(), CityRegion.getCached(), Neighborhood.getCached(), function(req, res, next){
	const city = City.join('country', Country.cached(), 'Id', 'name')
					 .join('countryRegions', CountryRegion.cached(), 'Id', 'name' )
					 .join('province', Province.cached(), 'Id', 'name' )
					 .join('provinceRegions', ProvinceRegion.cached(), 'Id', 'name' )
					 .findOne('name', req.params.name);
	const countryRegions = CountryRegion.find('country', city.country)
	const province = Province.find('country', city.country)
	const provinceRegions = [];
	const cityRegions = CityRegion.find('city', city.Id);
	const neighborhoods = Neighborhood.find('city', city.Id);

	province.forEach(function(p){
		provinceRegions.push(ProvinceRegion.find('province', p.Id))
	});

	console.log(JSON.stringify(provinceRegions, null, 2));

	res.render('locations/cities/city', {
		title: `Stellaroute: ${city.name}`,
		description: 'Stellaroute: ${city.name} Overview',
		key: City.hash,
		countryRegions: countryRegions,
		province: province,
		provinceRegions: provinceRegions,
		city: city,
		cityRegions: cityRegions,
		neighborhoods: neighborhoods,
	});
});

module.exports = router;