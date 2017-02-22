const express    = require('express');
const pug        = require('pug');
const isLoggedIn = require('../middleware/isLoggedIn');
const formidable = require('../middleware/formidable');
const pickTable  = require('../modules/pickTable');
const s3         = require('../modules/s3');
const sendEmail  = require('../modules/sendEmail');
const router     = express.Router();

// used to see if (an) item(s) exist without returning the data of the items
router.get('/exists/:table', (req, res) => {
	const field = req.query.field;
	const value = req.query.value;
	const findOne = req.query.findOne;
	const table = pickTable(req.params.table);

	if(!table){
		res.status(500).send('Please choose a table.');
	}

	const items = findOne ? table.findOne(field, value).items : table.find(field, value).items;

	res.send(items.length.toString());
});

router.get('/get/:table', isLoggedIn(true), (req, res) => {
	const field = req.query.field;
	const value = req.query.value;
	const findOne = req.query.findOne;
	const table = pickTable(req.params.table);

	if(!table){
		res.status(500).send('Please choose a table.');
	}

	const items = findOne ? table.findOne(field, value).items : table.find(field, value).items;

	res.send(items);
});

router.get('/getFiles', isLoggedIn(), (req, res) => {
	s3.getFiles((files, folder, subFolders, marker, nextMarker) => {
		res.send({files, folder, subFolders, marker, nextMarker});
	}, req.query.folder, req.query.marker, req.query.maxKeys);
});

router.get('/renderPug', (req, res) => {
	const params = req.query;
	const filePath = `views/${params.file}`;
	const locals = params.locals;

	res.send(pug.compileFile(filePath)(locals));
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
		const fileType = fileName.pop();

		s3.uploadImage(file.path, {path: fileName.join('')}, function(err, versions, meta) {
			if (err) {console.error(err); res.status(500).send(err); return;}

			res.send('success');
		}, fileType, req.fields.filePath);
	}	
});

router.post('/deleteFiles', isLoggedIn(), (req, res) => {
	const files = req.body.files;

	s3.deleteFiles(files, (err) => {
		if(err) {
			res.status(500).send(err);
			console.error(err);

			return;
		}

		res.send('success');
	})
});

module.exports = router;