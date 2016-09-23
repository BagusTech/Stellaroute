const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const Province = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City = require('../schemas/city');
const router = express.Router();

router.get('/', function(req, res){
	req.flash('info', 'That page doesn\'t exist, but this is a close second!');
	res.redirect('/countries');
});

router.post('/new', CountryRegion.getCached(), Country.getCached(), function(req, res){
	const params = req.body;

	const redirect = (params.redirect == 'provinces' ? `/provinces/${params.name}` : params.redirect) || '/countries';
	delete params.redirect;

	if (typeof params.countryRegions === 'string'){
		params.countryRegions = Array(params.countryRegions);
	}

	Province.add(params).then(function(data){
		// resolved
		Province.updateCache().then(function(){
			req.flash('success', 'World Region Successfully added');
			res.redirect(redirect);
		}, function(err){
			console.error(err);
			res.redirect('/countries');
		})
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again or contact Joe.');
		res.redirect('/countries');
	});
});

router.post('/update', Country.getCached(), Province.getCached(), function(req, res){
	const redirect = req.body.redirect || '/countries';
	delete req.body.redirect;

	if (req.body.delete){

		Province.delete(req.body[Province.hash]).then(function(){
			// resolved

			Province.updateCache().then(function(){
				req.flash('success', 'State/Province successfully deleted');
				res.redirect(redirect);
			}, function(){
				res.redirect(redirect);
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		Province.update(params, true).then(function(){
			// resolved update

			Province.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'State/Province successfully updated');
				res.redirect(`/provinces/${req.body.name}`);
			}, function(){
				// rejected updateCache

				res.redirect(`/provinces/${req.body.name}`);
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect(redirect);
	}
});

router.get('/:name', Country.getCached(), CountryRegion.getCached(), Province.getCached(), ProvinceRegion.getCached(), City.getCached(), function(req, res, next){
	const province = Province.join('country', Country.cached(), 'Id', 'name')
						   .join('countryRegions', CountryRegion.cached(), 'Id', 'name')
						   .findOne('name', req.params.name);

	const provinceRegions = ProvinceRegion.find('province', province.Id);
	const cities = City.find('province', province.Id);

	res.render('locations/provinces/province', {
		title: `Stellaroute: ${province.name}`,
		description: 'Stellaroute: ${province.name} Overview',
		key: Province.hash,
		province: province,
		provinceRegions: provinceRegions,
		cities: cities,
	});
});

module.exports = router;