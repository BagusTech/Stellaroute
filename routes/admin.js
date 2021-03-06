const express        = require('express');
const pickTable      = require('../modules/pickTable');
const sendEmail      = require('../modules/sendEmail');
const router         = express.Router();

// admin
router.get('/', (req, res) => {
	res.render('admin', {
		title: 'Stellaroute: Admin Controls',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		users: pickTable('Users').cached(),
		countries: pickTable('Countries').cached(),
		countryRegions: pickTable('CountryRegions').cached(),
		provinces: pickTable('Provinces').cached(),
		cities: pickTable('Cities').join('country', pickTable('Countries').cached(), 'Id', 'url').items,
	});
});

router.post('/clear-cache/:table', (req, res) => {
	const table = pickTable(req.params.table);

	if(!table) {
		console.error('Please choose a table.');
		res.status(500).send('Please choose a table.');
	}

	table.updateCache().then(() => {
		res.send('success');
	});
});

module.exports = router;