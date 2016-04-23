const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const WorldRegion = require('../schemas/world-region');
const router = express.Router();

router.get('/', Country.getCached, Continent.getCached, WorldRegion.getCached, function(req, res, next){
	var countries = Country.join('continent', Continent.cached(), 'Id', 'name' )
	                       .join('worldRegions', WorldRegion.cached(), 'Id', 'name' )
	                       .items.sort(sortBy('name'));

	res.render('countries/_countries', {
		title: 'Stellaroute: countries',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		countries: countries
	});
});

router.get('/new', Continent.getCached, WorldRegion.getCached, function(req, res, next){
	res.render('countries/new', {
		title: 'Stellaroute: Add a Country',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		continents: Continent.cached().sort(sortBy('name')),
		worldRegions: WorldRegion.cached().sort(sortBy('name'))
	});
});

router.post('/new', Country.getCached, function(req, res){
	const params = req.body;

	// only allowed to add a country that doesn't exist
	if (Country.findOne('name', params.name)){
		req.flash('error', 'A country with that name already exists');
		res.redirect('/countries')
	}

	// if the multiselect has one item, it returns a string and it needs to be an array
	if (typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	if (typeof params.worldRegions === 'string'){
		params.worldRegions = Array(params.worldRegions);
	}
	
	// only attempt to split if alias' are entered else delete it
	if(params.alias.length > 1){
		params.alias = params.alias.split(', ');
	} else{
		delete params.alias;
	}

	Country.add(params).then(function(data){
	// resolved add

		Country.updateCache().then(function(){
			// resolved updateCache

			req.flash('success', 'Country Successfully added');
			res.redirect('/countries');
		}, function(err){
			// rejected updateCache

			console.error(err);
			req.flash('error', 'Country was added, but something went wrong')
			res.redirect('/countries');
		});
	},
	function(err){
	// rejected add

		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/countries');
	});
});

router.post('/update', function(req, res){
	if (req.body.delete){
		Country.delete(req.body[Country.hash]).then(function(){
			// resolved delete

			cache.del('/countries/' + req.body.name);
			Country.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'Country successfully deleted')
				res.redirect('/countries');
			},function(err){
				// rejected updateCache

				console.error(err);
				req.flash('error', 'Country was deleted, but something went wrong')
				res.redirect('/countries');
			});
		}, function(err){
			// rejected delete

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/countries');
		});
	} else if (req.body.update) {
		delete req.body.update;

		var params = {};

		readJSON(req.body, readJSON, function(item, data){
			assign(params, item, data[item])
		});

		if(typeof params.continent === 'string'){
			params.continent = Array(params.continent);
		}

		if(typeof params.worldRegions === 'string'){
			params.worldRegions = Array(params.worldRegions);
		}

		params.alias = params.alias.split(', ');

		Country.update(params).then(function(){
			// resolved

			cache.del('/countries/' + req.body.name);
			Country.updateCache().then(function(){
				req.flash('success', 'Country successfully updated')
				res.redirect('/countries/' + req.body.name)
			}, function(err){

				console.error(err);
				req.flash('error', 'There was a small issue, but the country was updated')
				res.redirect('/countries/' + req.body.name)
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/countries')
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/countries')
	}
});

router.get('/:name', Continent.getCached, WorldRegion.getCached, CountryRegion.getCached, function(req, res, next){
	var country = Country.join('continent', Continent.cached(), 'Id', 'name')
						 .join('worldRegions', WorldRegion.cached(), 'Id', 'name')
						 .findOne('name', req.params.name);

	res.render('countries/country', {
		title: '',
		description: '',
		continents: Continent.cached().sort(sortBy('name')),
		country: country,
		key: Country.hash,
		countryRegions: CountryRegion.find('country', country.Id),
		worldRegions: WorldRegion.cached().sort(sortBy('name'))
	});
});

module.exports = router;