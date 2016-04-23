const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const router = express.Router();

router.get('/', CountryRegion.getCached, Country.getCached, function(req, res, next){
	res.render('country-regions/_country-regions', {
		title: 'Stellaroute: Country Regions',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		countryRegions: CountryRegion.join('country', Country.cached(), 'Id', 'name').items.sort(sortBy('name'))
	});
});

router.get('/new', Country.getCached, function(req, res, next){
	res.render('country-regions/new', {
		title: 'Stellaroute: Add a World Region',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		countries: Country.cached().sort(sortBy('name'))
	});
});

router.post('/new', CountryRegion.getCached, function(req, res){
	const params = req.body;

	// only allowed to add a world region that doesn't exist
	if (CountryRegion.findOne('name', params.name)){
		req.flash('error', 'A country with that name already exists');
		res.redirect('/country-regions')
	}

	CountryRegion.add(params).then(function(data){
		// resolved
		CountryRegion.updateCache().then(function(){
			req.flash('success', 'World Region Successfully added');
			res.redirect('/country-regions');
		}, function(err){
			console.error(err);
			res.redirect('/country-regions');
		})
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/country-regions');
	});
});

router.post('/update', function(req, res){
	if (req.body.delete){

		CountryRegion.delete(req.body[CountryRegion.hash]).then(function(){
			// resolved

			cache.del('/country-regions/' + req.body.name);
			CountryRegion.updateCache().then(function(){
				req.flash('success', 'World Region successfully deleted')
				res.redirect('/country-regions');
			}, function(){
				req.flash('error', 'There was a small issue, but your country was deleted')
				res.redirect('/country-regions');
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/country-regions');
		});
	} else if (req.body.update) {
		delete req.body.update;

		var params = {};

		readJSON(req.body, readJSON, function(item, data){
			assign(params, item, data[item])
		});

		CountryRegion.update(params).then(function(){
			// resolved update

			cache.del('/country-regions/' + req.body.name);
			CountryRegion.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'World Region successfully updated')
				res.redirect('/country-regions/' + req.body.name)
			}, function(){
				// rejected updateCache

				req.flash('error', 'There was a small issue, but the world region was updated')
				res.redirect('/country-regions');
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/country-regions')
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/country-regions')
	}
});

router.get('/:name', Country.getCached, CountryRegion.getCached, function(req, res, next){
	var countryRegion = CountryRegion.join('country', Country.cached(), 'Id', 'name')
								 .findOne('name', req.params.name);

	res.render('country-regions/country-region', {
		title: '',
		description: '',
		countries: Country.cached().sort(sortBy('name')),
		key: CountryRegion.hash,
		countryRegion: countryRegion
	});
});

module.exports = router;