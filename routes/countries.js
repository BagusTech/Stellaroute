const express = require('express');
const flash = require('connect-flash');
const isLoggedIn = require('../middleware/isLoggedIn');
const assign = require('../modules/assign');
const readJSON = require('../modules/readJSON');
const Country = require('../schemas/country');
const router = express.Router();

// make caching into middleware (probably done by someone already)
var loadedCountries;
var cashedAt = new Date();
var cacheDuration = 3600000; // 1 hour

// TODO: Dynamically create this list
var continents = ['Africa', 'Antartica', 'Asia', 'Austrailia', 'Europe', 'North America', 'South America' ];

// TODO: Dynamically create this list
var worldRegions = ['South-east Asia', 'Western Europe', 'Eastern Europe', 'Central America'];

router.get('/', isLoggedIn, function(req, res, next){
	// check to see if the countries are chached
	if (!loadedCountries || ((new Date() - cashedAt) > cacheDuration )) {
		Country.find().then(function(data) {
		// resolved

			// set cache
			cashedAt = new Date();
			loadedCountries = data.Items || {};

			res.render('countries/_countries', {
				title: 'Stellaroute: Countries',
				description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
				user: req.user,
				countries: loadedCountries
			});
		}, 
		function(err) {
		// rejected

			req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');

			res.render('countries/_countries', {
				title: 'Stellaroute: Countries',
				description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
				user: req.user,
				countries: {}
			});
		});
	} else {
		res.render('countries/_countries', {
			title: 'Stellaroute: Countries',
			description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
			user: req.user,
			countries: loadedCountries
		});
	}		
});

router.get('/new', isLoggedIn, function(req, res, next){
	res.render('countries/new', {
		title: 'Stellaroute: Add a Country',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		continents: continents,
		worldRegions: worldRegions
	});
});

router.post('/new', isLoggedIn, function(req, res){
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

		// if the countries are cached, 
		if(loadedCountries) {
			loadedCountries = null;
		}

		req.flash('success', 'Country Successfully added');
		res.redirect('/countries');
	},
	function(err){
	// rejected

		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/countries');
	});
});

router.post('/update', isLoggedIn, function(req, res){
	if (req.body.delete){
		Country.delete(req.body[Country.hash]).then(function(){
			// resolved

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

router.get('/:name', isLoggedIn, function(req, res, next){
	Country.find('name', req.params.name, 1).then(
	function(data){
		// resolved

		res.render('countries/country', {
			title: '',
			description: '',
			user: req.user,
			continents: continents,
			country: data.Items[0],
			key: Country.hash,
			worldRegions: worldRegions
		})
	}, function(err){
		// rejected

		res.render('countries/country', {
			title: '',
			description: '',
			user: req.user,
			country: [],
			key: String()
		})
	})
});

module.exports = router;