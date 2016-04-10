const express = require('express');
const flash = require('connect-flash');
const isLoggedIn = require('../middleware/isLoggedIn');
const assign = require('../modules/assign');
const readJSON = require('../modules/readJSON');
const Continent = require('../schemas/continent');
const router = express.Router();

// make caching into middleware (probably done by someone already)
var loadedContinents;
var cashedAt = new Date();
var cacheDuration = 86400000; // 1 day

router.get('/', isLoggedIn, function(req, res, next){
	// check to see if the continents are chached
	if (!loadedContinents || ((new Date() - cashedAt) > cacheDuration )) {
		Continent.find().then(function(data) {
		// resolved

			// set cache
			cashedAt = new Date();
			loadedContinents = data.Items || {};

			res.render('continents/_continents', {
				title: 'Stellaroute: Continents',
				description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
				user: req.user,
				continents: loadedContinents
			});
		}, 
		function(err) {
		// rejected

			req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');

			res.render('continents/_countries', {
				title: 'Stellaroute: Continents',
				description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
				user: req.user,
				continents: {}
			});
		});
	} else {
		res.render('continents/_continents', {
			title: 'Stellaroute: Continents',
			description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
			user: req.user,
			continents: loadedContinents
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

	Continent.add(params).then(function(data){
	// resolved

		// if the countries are cached, 
		if(loadedContinents) {
			loadedContinents = null;
		}

		req.flash('success', 'Continent Successfully added');
		res.redirect('/continents');
	},
	function(err){
	// rejected

		console.log('it failed');
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/continents');
	});
});

router.post('/update', isLoggedIn, function(req, res){
	if (req.body.delete){
		Continent.delete(req.body[Continent.hash]).then(function(){
			// resolved

			req.flash('success', 'Continent successfully deleted')
			res.redirect('/continents');
		}, function(){
			// rejected

			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/continents');
		});
	} else if (req.body.update) {
		delete req.body.update;

		var params = {};

		readJSON(req.body, readJSON, function(item, data){
			assign(params, item, data[item])
		});

		Continent.update(params).then(function(){
			// resolved

			req.flash('success', 'Continent successfully updated')
			res.redirect('/continents/' + req.body.name)
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/continents')
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/continents')
	}
});

router.get('/:name', isLoggedIn, function(req, res, next){
	Continent.find('name', req.params.name).then(
	function(data){
		// resolved

		res.render('continents/continent', {
			title: '',
			description: '',
			user: req.user,
			continent: data.Items[0],
			key: Continent.hash
		})
	}, function(err){
		// rejected

		res.render('continents/continent', {
			title: '',
			description: '',
			user: req.user,
			data: [],
			key: String()
		})
	})
});

module.exports = router;