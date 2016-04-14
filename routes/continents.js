const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const router = express.Router();

// TODO: make duck.checkcached and have it become middleware


router.get('/', Continent.checkCache, function(req, res, next){
	res.render('continents/_continents', {
		title: 'Stellaroute: continents',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user,
		continents: Continent.cached().sort(sortBy('name'))
	});
});

router.get('/new', function(req, res, next){
	res.render('continents/new', {
		title: 'Stellaroute: Add a Continent',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user
	});
});

router.post('/new', function(req, res){
	const params = req.body;

	Continent.add(params).then(function(data){
		// resolved
		Continent.updateCache().then(function(){
			req.flash('success', 'Continent Successfully added');
			res.redirect('/continents');
		}, function(err){
			console.error(err);
			res.redirect('/continents');
		})
	}, function(err){
		// rejected
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

router.get('/:name', function(req, res, next){
	Continent.find('name', req.params.name).then(
	function(data){
		// resolved

		if (data.Items.length === 0){
			req.flash('error', 'Opps, something when wrong! Please try again.');
			res.redirect('/continents');
		}

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