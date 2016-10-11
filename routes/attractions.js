const express        = require('express');
const flash          = require('connect-flash');
const assign         = require('../modules/assign');
const readJSON       = require('../modules/readJSON');
const sortBy         = require('../modules/sortBy');
const Attraction     = require('../schemas/attraction');
const Country        = require('../schemas/country');
const CountryRegion  = require('../schemas/country-region');
const Province       = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City           = require('../schemas/city');
const CityRegion     = require('../schemas/city-region');
const Neighborhood   = require('../schemas/neighborhood');
const router         = express.Router();

router.get('/', function(req, res, next){
	var guides = Attraction.join('country', Country.cached(), 'Id', 'names.display')
	                  .items.sort(sortBy('url'));

	res.render('guides/_guides', {
		title: 'Stellaroute: Guides',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		guides: guides,
	});
});

router.post('/new', function(req, res){
	const redirect = req.body.redirect;
	delete req.body.redirect;

	const params = req.body;
	params.url = params.url || params['names.display'].replace(/ /g, '-').toLowerCase();

	if (typeof params.country === 'string'){
		params.country = Array(params.country);
	}

	if (typeof params.countryRegions === 'string'){
		params.countryRegions = Array(params.countryRegions);
	}

	if (typeof params.province === 'string'){
		params.province = Array(params.province);
	}

	if (typeof params.provinceRegions === 'string'){
		params.provinceRegions = Array(params.provinceRegions);
	}

	if (typeof params.city === 'string'){
		params.city = Array(params.city);
	}

	if (typeof params.cityRegions === 'string'){
		params.cityRegions = Array(params.cityRegions);
	}

	if (typeof params.neighborhoods === 'string'){
		params.neighborhoods = Array(params.neighborhoods);
	}

	Attraction.add(params).then(function(data){
		// resolved
		Attraction.updateCache().then(function(){
			req.flash('success', 'Attraction Successfully added');
			res.redirect(redirect);
			return;
		}, function(err){
			console.error(err);
			res.redirect('/guides');
			return;
		})
	}, function(err){
		// rejected
		console.error(err);
		req.flash('error', 'Opps, something when wrong! Please try again.');
		res.redirect('/guides');
		return;
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.redirect;
	delete req.body.redirect;

	if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		Attraction.update(params, true).then(function(){
			// resolved

			Attraction.updateCache().then(function(){
				req.flash('success', 'Attraction successfully updated');
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
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect(redirect);
		return;
	}
});

module.exports = router;