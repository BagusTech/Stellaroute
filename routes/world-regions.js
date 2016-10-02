const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/cache');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const WorldRegion = require('../schemas/world-region');
const Country = require('../schemas/country');
const router = express.Router();

router.get('/', function(req, res, next){
	res.render('locations/world-regions/_world-regions', {
		title: 'Stellaroute: World Regions',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		worldRegions: WorldRegion.join('continent', Continent.cached(), 'Id', 'name').items.sort(sortBy('name')),
	});
});

router.get('/new', function(req, res, next){
	res.render('locations/world-regions/new', {
		title: 'Stellaroute: Add a World Region',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		continents: Continent.cached().sort(sortBy('name')),
	});
});

router.post('/new', function(req, res){
	const params = req.body;
	params.url = params.url || params.name.replace(/ /g, '-').toLowerCase();
	
	const redirect = params.redirect;
	delete params.redirect;

	if(typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	WorldRegion.add(params).then(function(data){
		// resolved
		WorldRegion.updateCache().then(function(){
			req.flash('success', 'World Region Successfully added');
			res.redirect(redirect);
		}, function(err){
			// rejected update 

			console.error(err);
			res.redirect('/world-regions');
		});		
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again.');
		res.redirect('/world-regions');
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.redirect;
	delete req.body.redirect;

	if (req.body.delete){

		WorldRegion.delete(req.body[WorldRegion.hash]).then(function(){
			// resolved

			WorldRegion.updateCache().then(function(){
				req.flash('success', 'World Region successfully deleted');
				res.redirect('/world-regions');
			}, function(){
				res.redirect('/world-regions');
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/world-regions');
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		if(typeof params.continent === 'string'){
			params.continent = Array(params.continent);
		}

		WorldRegion.update(params, true).then(function(){
			// resolved update

			WorldRegion.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'World Region successfully updated');
				res.redirect(redirect);
			}, function(){
				// rejected updateCache

				res.redirect(redirect);
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/world-regions');
		});
	}
});

module.exports = router;