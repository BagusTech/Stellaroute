const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const Country = require('../schemas/country');
const WorldRegion = require('../schemas/world-region');
const router = express.Router();

router.get('/', Country.getCached, Continent.getCached, WorldRegion.getCached, function(req, res, next){
	var cachedCountries = Country.cached();

	var mappedContinentIdsToName = Country.cached().map( country => 
		country.continent.map( continentId => 
			Continent.cached().map((continent) => 
				continent.Id == continentId ? continent.name : null)
				.filter(name => name)));
	for (i in cachedCountries){
		cachedCountries[i].continent = mappedContinentIdsToName[i]
	}

	var mappedWorldRegionIdsToName = Country.cached().map( country => 
		country.worldRegions.map( worldRegionsId => 
			WorldRegion.cached().map((worldRegions) => 
				worldRegions.Id == worldRegionsId ? worldRegions.name : null)
				.filter(name => name)));
	for (i in cachedCountries){
		cachedCountries[i].worldRegions = mappedWorldRegionIdsToName[i]
	}


	console.log('Make the Join')
	//console.log(JSON.stringify(Country.join('continent', Continent.cached()), null, 2));
	//console.log(JSON.stringify(cachedCountries, null, 2));


	res.render('countries/_countries', {
		title: 'Stellaroute: countries',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		countries: cachedCountries.sort(sortBy('name'))
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

router.post('/new', function(req, res){
	const params = req.body;

	// if the multiselect has one item, it returns a string and it needs to be an array
	if (typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	if (typeof params.worldRegions === 'string'){
		params.worldRegions = Array(params.worldRegions);
	}
	
	params.alias = params.alias.split(', ');

	Country.add(params).then(function(data){
	// resolved

		Country.updateCache();

		req.flash('success', 'Country Successfully added');
		res.redirect('/countries');
	},
	function(err){
	// rejected

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

router.get('/:name', Continent.getCached, WorldRegion.getCached, function(req, res, next){
	if(cache.get('/countries/' + req.params.name)){
		next();
	} else {
		Country.find('name', req.params.name, 1).then(function(data){
			// resolved

			cache.set('/countries/' + req.params.name, data.Items[0], 3600);
			next();
		}, function(err){
			// rejected

			req.flash('error', 'Sorry, couln\'t find that country, please try again.')
			res.redirect('/countries')
		});
	}

}, function(req, res, next){
	var country = cache.get('/countries/' + req.params.name);

	var mappedContinentIdsToName = country.continent.map( continentId => 
			Continent.cached().map((continent) => 
				continent.Id == continentId ? continent.name : null)
				.filter(name => name));

	country.continent = mappedContinentIdsToName

	var mappedWorldRegionIdsToName = country.worldRegions.map( worldRegionsId => 
			WorldRegion.cached().map((worldRegions) => 
				worldRegions.Id == worldRegionsId ? worldRegions.name : null)
				.filter(name => name));
	
	country.worldRegions = mappedWorldRegionIdsToName

	console.log('Make the Join')

	res.render('countries/country', {
		title: '',
		description: '',
		continents: Continent.cached().sort(sortBy('name')),
		country: country,
		key: Country.hash,
		worldRegions: WorldRegion.cached().sort(sortBy('name'))
	});
});

module.exports = router;