const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const WorldRegion = require('../schemas/world-region');
const router = express.Router();

// TODO: make duck.checkcached and have it become middleware


router.get('/', WorldRegion.checkCache, function(req, res, next){
	res.render('world-regions/_world-regions', {
		title: 'Stellaroute: World Regions',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		worldRegion: WorldRegion.cached().sort(sortBy('name'))
	});
});

router.get('/new', Continent.checkCache, function(req, res, next){
	res.render('world-regions/new', {
		title: 'Stellaroute: Add a World Region',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		continents: Continent.cached().sort(sortBy('name'))
	});
});

router.post('/new', function(req, res){
	const params = req.body;

	if(typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	WorldRegion.add(params).then(function(data){
		// resolved
		WorldRegion.updateCache().then(function(){
			req.flash('success', 'World Region Successfully added');
			res.redirect('/world-regions');
		}, function(err){
			console.error(err);
			res.redirect('/world-regions');
		})
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/world-regions');
	});
});

router.post('/update', function(req, res){
	if (req.body.delete){

		WorldRegion.delete(req.body[WorldRegion.hash]).then(function(){
			// resolved

			cache.del('/world-regions/' + req.body.name);
			WorldRegion.updateCache().then(function(){
				req.flash('success', 'World Region successfully deleted')
				res.redirect('/world-regions');
			}, function(){
				req.flash('error', 'There was a small issue, but your country was deleted')
				res.redirect('/world-regions');
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/world-regions');
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

		WorldRegion.update(params).then(function(){
			// resolved update

			cache.del('/world-regions/' + req.body.name);
			WorldRegion.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'World Region successfully updated')
				res.redirect('/world-regions/' + req.body.name)
			}, function(){
				// rejected updateCache

				req.flash('error', 'There was a small issue, but the world region was updated')
				res.redirect('/world-regions');
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/world-regions')
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/world-regions')
	}
});

router.get('/:name', Continent.checkCache, function(req, res, next){
	if(cache.get('/world-regions/' + req.params.name)){
		next();
	} else {
		WorldRegion.find('name', req.params.name, 1).then(function(data){
			// resolved

			cache.set('/world-regions/' + req.params.name, data.Items[0], 3600);
			next();
		}, function(err){
			// rejected

			req.flash('error', 'Sorry, couln\'t find that country, please try again.')
			res.redirect('/world-regions')
		});
	}

}, function(req, res, next){
	var worldRegion = cache.get('/world-regions/' + req.params.name);

	var mappedContinentIdsToName = worldRegion.continent.map( continentId => 
			Continent.cached().map((continent) => 
				continent.Id == continentId ? continent.name : null)
				.filter(name => name));

	worldRegion.continent = mappedContinentIdsToName;

	console.log('Make the Join')

	res.render('world-regions/world-region', {
		title: '',
		description: '',
		continents: Continent.cached().sort(sortBy('name')),
		key: WorldRegion.hash,
		worldRegion: worldRegion
	});
});

module.exports = router;