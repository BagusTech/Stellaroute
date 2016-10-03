const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const WorldRegion = require('../schemas/world-region');
const Country = require('../schemas/country');
const router = express.Router();

router.get('/', function(req, res, next){
	res.render('locations/continents/_continents', {
		title: 'Stellaroute: Continents',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		continents: Continent.cached().sort(sortBy('name')),
	});
});

router.get('/new', function(req, res, next){
	res.render('locations/continents/new', {
		title: 'Stellaroute: Add a Continent',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

router.post('/new', Continent.getCached(), function(req, res){
	const params = req.body;
	params.url = params.url || params.name.replace(/ /g, '-').toLowerCase();
	
	// only allowed to add a continent that doesn't exist
	if (Continent.findOne('name', params.name).items){
		req.flash('error', 'A country with that name already exists');
		res.redirect('/continents');
		return;
	}

	Continent.add(params).then(function(data){
		// resolved add

		Continent.updateCache().then(function(){
			// resolved update

			req.flash('success', 'Continent Successfully added');
			res.redirect('/continents');
			return;
		}, function(err){
			// rejected update 

			console.error(err);
			res.redirect('/continents');
			return;
		});
	}, function(err){
		// rejected add
		
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/continents');
		return;
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.redirect;
	delete req.body.redirect;

	if (req.body.delete){

		Continent.delete(req.body[Continent.hash]).then(function(){
			// resolved

			Continent.updateCache().then(function(){
				req.flash('success', 'Continent successfully deleted');
				res.redirect('/continents');
				return;
			}, function(){
				res.redirect('/continents');
				return;
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/continents');
			return;
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		Continent.update(params, true).then(function(){
			// resolved

			Continent.updateCache().then(function(){
				req.flash('success', 'Continent successfully updated');
				res.redirect(redirect);
				return;
			}, function(){
				res.redirect('/continents');
				return;
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/continents');
			return;
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/continents');
		return;
	}
});

module.exports = router;