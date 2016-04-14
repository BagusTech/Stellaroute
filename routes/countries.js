const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const Country = require('../schemas/country');
const router = express.Router();

// TODO: Dynamically create this list
var worldRegions = ['South-east Asia', 'Western Europe', 'Eastern Europe', 'Central America'];

router.get('/', Country.checkCache, function(req, res, next){
	res.render('countries/_countries', {
		title: 'Stellaroute: countries',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		countries: Country.cached().sort(sortBy('name'))
	});
});

router.get('/new', Continent.checkCache, function(req, res, next){

	res.render('countries/new', {
		title: 'Stellaroute: Add a Country',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		continents: Continent.cached(),
		worldRegions: worldRegions
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
			// resolved

			Country.updateCache();

			req.flash('success', 'Country successfully deleted')
			res.redirect('/countries');
		}, function(){
			// rejected

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

		Country.update(params).then(function(){
			// resolved

			Country.updateCache();

			req.flash('success', 'Country successfully updated')
			res.redirect('/countries/' + req.body.name)
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

router.get('/:name', Continent.checkCache, function(req, res, next){
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
	res.render('countries/country', {
		title: '',
		description: '',
		user: req.user,
		continents: Continent.cached().sort(sortBy('name')).map((c) => c.name),
		country: cache.get('/countries/' + req.params.name),
		key: Country.hash,
		worldRegions: worldRegions
	});
});

module.exports = router;