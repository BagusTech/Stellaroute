const express        = require('express');
const isLoggedIn     = require('../middleware/isLoggedIn');
const formidable     = require('../middleware/formidable');
const pickTable      = require('../modules/pickTable');
const s3             = require('../modules/s3');
const sendEmail      = require('../modules/sendEmail');
const router         = express.Router();

router.get('/get/:table', isLoggedIn(true), (req, res) => {
	const field = req.query.field
	const value = req.query.value
	const findOne = req.query.findOne
	const table = pickTable(req.params.table);

	if(!table){
		console.error('Please choose a table.');
		res.status(500).send('Please choose a table.');
	}

	const items = findOne ? table.findOne(field, value).items : table.find(field, value).items

	if(items){
		res.send(items)
	} else {
		res.send('Nothing Found');
	}
});

router.get('/getFiles', isLoggedIn(), (req, res) => {
	s3.getFiles((data) => {
		if(!data) {
			res.status(500).send('No Data To Return')
		}

		res.send(data);
	})
});

router.post('/add/:table', isLoggedIn(true), (req, res) => {
	const item = req.body;
	const table = pickTable(req.params.table);

	if(!table){
		console.error('Please choose a table.');
		res.status(500).send('Please choose a table.');
	}

	table.add(item)
	.then(() => {
		table.updateCache().then(() => {
			res.send(item);
		});
	}, (err) => {
		console.error(err);
		res.status(500).send(err);
	});
});

router.post('/update/:table', isLoggedIn(true), (req, res) => {
	const item = req.body.item;
	const table = pickTable(req.params.table);

	if(!table){
		console.error('Please choose a table.');
		res.status(500).send('Please choose a table.');
	}

	table.update(item)
		.then(() => {
			table.updateCache().then(() => {
				res.send(item);
			});
		}, (err) => {
			console.error(err);
			res.status(500).send(err);
		});
});

router.post('/delete/:table', isLoggedIn(true), (req, res) => {
	const key = req.body['key'];
	const table = pickTable(req.params.table);

	if(!table){
		console.error('Please choose a table.');
		res.status(500).send('Please choose a table.');
	}

	table.delete(key)
	.then(() => {
		table.updateCache().then(() => {
			res.send('success');
		});
	}, (err) => {
		console.error(err);
		res.status(500).send(err);
	});
});

router.post('/upload', isLoggedIn(), formidable(), (req, res) => {
	const files = req.files || [];
	const length = files.length;

	for (let i = 0; i < length; i++) {
		const file = files[i];
		const fileName = file.name.split('.');
		fileName.pop();

		s3.uploadImage(file.path, {path: fileName.join('')}, function(err, versions, meta) {
			if (err) {console.error(err); res.status(500).send(err); return;}

			res.send('success');
		}, null, null);
	}	
});

module.exports = router;