const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const WorldRegion = require('../schemas/world-region');
const Country = require('../schemas/country');
const router = express.Router();

router.get('/', WorldRegion.getCached(), Continent.getCached(), function(req, res, next){
	res.render('locations/world-regions/_world-regions', {
		title: 'Stellaroute: World Regions',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		worldRegions: WorldRegion.join('continent', Continent.cached(), 'Id', 'name').items.sort(sortBy('name')),
	});
});

router.get('/new', Continent.getCached(), function(req, res, next){
	res.render('locations/world-regions/new', {
		title: 'Stellaroute: Add a World Region',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		continents: Continent.cached().sort(sortBy('name')),
	});
});

router.post('/new', WorldRegion.getCached(), function(req, res){
	const params = req.body;
	
	const redirect = (params.redirect == 'world-regions' ? `/world-regions/${params.name}` : params.redirect) || '/world-regions';
	delete params.redirect;

	console.log(redirect);
	

	// only allowed to add a world region that doesn't exist
	if (WorldRegion.findOne('name', params.name)){
		req.flash('error', 'A World Region with that name already exists');
		res.redirect('/world-regions');
	}

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
				res.redirect('/world-regions/' + req.body.name);
			}, function(){
				// rejected updateCache

				req.flash('error', 'There was a small issue, but the world region was updated');
				res.redirect('/world-regions');
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/world-regions');
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/world-regions');
	}
});

router.get('/:name', Continent.getCached(), WorldRegion.getCached(), function(req, res, next){
	const worldRegion = WorldRegion.join('continent', Continent.cached(), 'Id', 'name')
								 .findOne('name', req.params.name);
	const countries = Country.find('worldRegions', worldRegion.Id).sort(sortBy('name'));

	res.render('locations/world-regions/world-region', {
		title: `Stellaroute: ${worldRegion.name}`,
		description: 'Stellaroute: ${worldRegion.name} Overview',
		continents: Continent.cached().sort(sortBy('name')),
		countries: countries,
		key: WorldRegion.hash,
		worldRegion: worldRegion
	});
});

module.exports = router;