const express = require('express');
const flash = require('connect-flash');
const setFlash = require('../modules/setFlash');
const passport = require('passport');
const isLoggedIn = require('../modules/isLoggedIn');
const Country = require('../schemas/country');
const User = require('../schemas/user');
const parseData = require('../modules/parseData');
const router = express.Router();

require('../config/passport')(passport);


// make caching into middleware (probably done by someone already)
var loadedCountries;
var cashedAt = new Date();
var cacheDuration = 3600000; // 1 hour

// TODO: Dynamically create this list
var continents = ['Africa', 'Antartica', 'Asia', 'Austrailia', 'Europe', 'North America', 'South America' ];

// TODO: Dynamically create this list
var worldRegions = ['South-east Asia', 'Western Europe', 'Central America'];

router.get('/', function(req, res, next){
	// check to see if the countries are chached
	if (!loadedCountries || ((new Date() - cashedAt) > cacheDuration )) {
		Country.find().then(function(data) {
		// resolved

			// set cache
			cashedAt = new Date();
			loadedCountries = data.Items;

			res.render('countries/_countries', {
				title: 'Stellaroute: Countries',
				description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
				data: loadedCountries
			});
		}, 
		function(err) {
		// rejected

			req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');

			res.render('countries/_countries', {
				title: 'Stellaroute: Countries',
				description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
				data: {}
			});
		});
	} else {
		res.render('countries/_countries', {
			title: 'Stellaroute: Countries',
			description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
			data: loadedCountries
		});
	}		
});

router.get('/new', function(req, res, next){
	res.render('countries/new', {
		title: 'Stellaroute: Add a Country',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		continents: continents,
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

		// if the countries are cached, 
		if(loadedCountries) {
			loadedCountries = null;
		}

		req.flash('success', 'Country Successfully added');
		res.redirect('./');
	},
	function(err){
	// rejected

		console.log('it failed');
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('./');
	});
});

// HTML form cannot pass an actual delete, so using post
router.post('/delete', function(req, res){
	Country.delete(req.body[Country.hash]).then(function(){
		// resolved

		if(loadedCountries) {
			loadedCountries = null;
		}

		req.flash('success', 'Country successfully deleted')
		res.redirect('./');
	}, function(){
		// rejected

		req.flash('error', 'Oops, something went wrong. Please try again.')
		res.redirect('./');
	});
});

router.post('/update', function(req, res){
	const params = req.body;

	// if the multiselect has one item, it returns a string and it needs to be an array
	if (typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	if (typeof params.worldRegions === 'string'){
		params.worldRegions = Array(params.worldRegions);
	}

	Country.update(params).then(function(data){
	// resolved
		if(loadedCountries) {
			loadedCountries = null;
		}

		req.flash('success', 'Country Successfully updated');
		res.redirect('./');
	},
	function(err){
	// rejected

		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('./');
	});
});

router.get('/:name', function(req, res, next){
	Country.find('name', req.params.name, 1).then(
	function(data){
		// resolved

		res.render('countries/country', {
			title: '',
			description: '',
			continents: continents,
			data: data.Items[0],
			key: Country.hash,
			worldRegions: worldRegions
		})
	}, function(err){
		// rejected

		res.render('countries/country', {
			title: '',
			description: '',
			data: [],
			key: String()
		})
	})
});

module.exports = router;