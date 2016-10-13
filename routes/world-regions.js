const express = require('express');
const flash = require('connect-flash');
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
		worldRegions: WorldRegion.join('continent', Continent.cached(), 'Id', 'names.display').items.sort(sortBy('url')),
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
	params.url = params.url || params['names.display'].replace(/ /g, '-').toLowerCase();
	
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
			return;
		}, function(err){
			// rejected update 

			console.error(err);
			res.redirect(redirect);
			return;
		});		
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again.');
		res.redirect(redirect);
		return;
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
				return;
			}, function(){
				res.redirect('/world-regions');
				return;
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/world-regions');
			return;
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
				return;
			}, function(){
				// rejected updateCache

				res.redirect(redirect);
				return;
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/world-regions');
			return;
		});
	}
});

module.exports = router;