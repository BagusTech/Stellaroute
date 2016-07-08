const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const router = express.Router();

router.get('/', Continent.getCached(), function(req, res, next){
	res.render('continents/_continents', {
		title: 'Stellaroute: continents',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		continents: Continent.cached().sort(sortBy('name'))
	});
});

router.get('/new', function(req, res, next){
	res.render('continents/new', {
		title: 'Stellaroute: Add a Continent',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

router.post('/new', Continent.getCached(), function(req, res){
	const params = req.body;

	// only allowed to add a continent that doesn't exist
	if (Continent.findOne('name', params.name)){
		req.flash('error', 'A country with that name already exists');
		res.redirect('/continents')
	}

	Continent.add(params).then(function(data){
		// resolved add

		Continent.updateCache().then(function(){
			// resolved update

			req.flash('success', 'Continent Successfully added');
			res.redirect('/continents');
		}, function(err){
			// rejected update 

			console.error(err);
			res.redirect('/continents');
		})
	}, function(err){
		// rejected add
		
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/continents');
	});
});

router.post('/update', function(req, res){
	if (req.body.delete){

		Continent.delete(req.body[Continent.hash]).then(function(){
			// resolved

			Continent.updateCache().then(function(){
				req.flash('success', 'Continent successfully deleted')
				res.redirect('/continents');
			}, function(){
				req.flash('error', 'There was a small issue, but your country was deleted')
				res.redirect('/continents');
			});
		}, function(err){
			// rejected

			console.error(err);
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

			Continent.updateCache().then(function(){
				req.flash('success', 'Continent successfully updated')
			res.redirect('/continents/' + req.body.name)
			}, function(){
				req.flash('error', 'There was a small issue, but your country was updated')
				res.redirect('/continents');
			});
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

router.get('/:name', Continent.getCached(), function(req, res, next){
	res.render('continents/continent', {
		title: '',
		description: '',
		continent: Continent.findOne('name', req.params.name),
		key: Continent.hash
	});
});

module.exports = router;