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
const ProvinceRegion = require('../schemas/province-region');
const City = require('../schemas/city');
const router = express.Router();

router.get('/', function(req, res){
	req.flash('info', 'That page doesn\'t exist, but this is a close second!');
	res.redirect('/countries');
	return;
});

router.post('/new', function(req, res){
	const params = req.body;
	params.url = params.url || params['names.display'].replace(/ /g, '-').toLowerCase();

	const redirect = params.redirect;
	delete params.redirect;

	if (typeof params.continent === 'string'){
		params.continent = Array(params.continent);
	}

	if (typeof params.worldRegions === 'string'){
		params.worldRegions = Array(params.worldRegions);
	}

	if (typeof params.countryRegions === 'string'){
		params.countryRegions = Array(params.countryRegions);
	}

	Province.add(params).then(function(data){
		// resolved
		Province.updateCache().then(function(){
			req.flash('success', 'State/Province Successfully added');
			res.redirect(redirect);
			return;
		}, function(err){
			console.error(err);
			res.redirect('/countries');
			return;
		})
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/countries');
		return;
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.delete ? req.body.deleteRedirect : req.body.redirect;
	delete req.body.redirect;
	delete req.body.deleteRedirect;

	if (req.body.delete){

		Province.delete(req.body[Province.hash]).then(function(){
			// resolved

			Province.updateCache().then(function(){
				req.flash('success', 'State/Province successfully deleted');
				res.redirect(redirect);
				return;
			}, function(){
				res.redirect(redirect);
				return;
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
			return;
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		if (typeof params.continent === 'string'){
			params.continent = Array(params.continent);
		}

		if (params.continent === undefined){
			params.continent = [];
		}

		if (typeof params.worldRegions === 'string'){
			params.worldRegions = Array(params.worldRegions);
		}

		if (params.worldRegions === undefined){
			params.worldRegions = [];
		}

		if (typeof params.countryRegions === 'string'){
			params.countryRegions = Array(params.countryRegions);
		}

		if (params.countryRegions === undefined){
			params.countryRegions = [];
		}

		Province.update(params, true).then(function(){
			// resolved update

			Province.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'State/Province successfully updated');
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
			res.redirect(redirect);
			return;
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect(redirect);
		return;
	}
});

module.exports = router;