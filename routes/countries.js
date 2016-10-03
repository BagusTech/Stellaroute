const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/cache');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Continent = require('../schemas/continent');
const WorldRegion = require('../schemas/world-region');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const Province = require('../schemas/province');

const router = express.Router();

router.get('/', function(req, res, next){
	var countries = Country.join('continent', Continent.cached(), 'Id', 'name' )
	                       .join('worldRegions', WorldRegion.cached(), 'Id', 'name' )
	                       .items.sort(sortBy('url'));

	res.render('locations/countries/_countries', {
		title: 'Stellaroute: countries',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		countries: countries
	});
});

router.get('/new', function(req, res, next){
	res.render('locations/countries/new', {
		title: 'Stellaroute: Add a Country',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		continents: Continent.cached().sort(sortBy('name')),
		worldRegions: WorldRegion.cached().sort(sortBy('name'))
	});
});

router.post('/new', function(req, res){
	const params = req.body;
	params.url = params.url || params.names.display.replace(/ /g, '-').toLowerCase();

	// start combining native name and native langauge into an array of objects from two seperate arrays
	const nativeNames = typeof params['native.name'] === 'string' ? Array(params['native.name']) : params['native.name'];
	delete params['native.name'];

	const nativeLanguages = typeof params['native.language'] === 'string' ? Array(params['native.language']) : params['native.language'];
	delete params['native.language'];

	params['names.native'] = [];

	for(i in nativeNames){
		params['names.native'].push({name: nativeNames[i], language: nativeLanguages[i]});
	}
	// end combining

	// only allowed to add a country that doesn't exist
	if (Country.findOne('name', params.name)){
		req.flash('error', 'A country with that name already exists');
		res.redirect(params.url)
		return;
	}

	// if the multiselect has one item, it returns a string and it needs to be an array
	if (typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	if (typeof params.worldRegions === 'string'){
		params.worldRegions = Array(params.worldRegions);
	}

	if (typeof params.languages === 'string'){
		params.languages = Array(params.languages);
	}
	
	// only attempt to split if alias' are entered else delete it
	if(params.alias.length > 0){
		params.alias = params.alias.split(', ');
	} else{
		delete params.alias;
	}

	Country.add(params).then(function(data){
	// resolved add

		Country.updateCache().then(function(){
			// resolved updateCache

			req.flash('success', 'Country Successfully added');
			res.redirect(params.url);
			return;
		}, function(err){
			// rejected updateCache

			console.error(err);
			res.redirect('/countries');
			return;
		});
	},
	function(err){
	// rejected add

		req.flash('error', 'Opps, something when wrong! Please try again.');
		res.redirect('/countries');
		return;
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.redirect;
	delete req.body.redirect;

	if (req.body.delete){
		Country.delete(req.body[Country.hash]).then(function(){
			// resolved delete

			Country.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'Country successfully deleted')
				res.redirect('/countries');
				return;
			},function(err){
				// rejected updateCache

				console.error(err);
				req.flash('error', 'Country was deleted, but something went wrong')
				res.redirect('/countries');
				return;
			});
		}, function(err){
			// rejected delete

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/countries');
			return;
		});
	} else if (req.body.update) {
		delete req.body.update;

		// start combining native name and native langauge into an array of objects from two seperate arrays
		var nativeNames = typeof req.body['native.name'] === 'string' ? Array(req.body['native.name']) : req.body['native.name'];
		delete req.body['native.name'];

		var nativeLanguages = typeof req.body['native.language'] === 'string' ? Array(req.body['native.language']) : req.body['native.language'];
		delete req.body['native.language'];

		req.body['names.native'] = [];

		for(i in nativeNames){
			req.body['names.native'].push({name: nativeNames[i], language: nativeLanguages[i]});
		}

		const params = req.body;

		if(typeof params.continent === 'string'){
			params.continent = Array(params.continent);
		}

		if(typeof params.worldRegions === 'string'){
			params.worldRegions = Array(params.worldRegions);
		}

		if (typeof params.languages === 'string'){
			params.languages = Array(params.languages);
		}

		params.alias = params.alias.split(', ');

		Country.update(params, true).then(function(){
			// resolved

			Country.updateCache().then(function(){
				req.flash('success', 'Country successfully updated');
				res.redirect(redirect);
				return;
			}, function(err){

				console.error(err);
				res.redirect('/countries');
				return;
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
			return;
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/countries');
		return;
	}
});

module.exports = router;