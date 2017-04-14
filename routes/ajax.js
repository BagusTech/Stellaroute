const express      = require('express');
const pug          = require('pug');
const isLoggedIn   = require('../middleware/isLoggedIn');
const formidable   = require('../middleware/formidable');
const isAuthorized = require('../modules/isAuthorized');
const pickTable    = require('../modules/pickTable');
const s3           = require('../modules/s3');
const sendEmail    = require('../modules/sendEmail');
const router       = express.Router();

//// database ajax calls
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

	router.get('/get/:table', (req, res) => {
		const user = req.user;

		if(!isAuthorized(user, 'beta-travel-wishlist', 'beta-general')) {
			console.error('User is unauthorized.');
			res.status(401).send('User is unauthorized.');
			return;
		};

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

	router.post('/add/:table', (req, res) => {
		const user = req.user;
		
		if(!isAuthorized(user, 'beta-travel-wishlist', 'beta-general')) {
			console.error('User is unauthorized.');
			res.status(401).send('User is unauthorized.');
			return;
		};

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

	router.post('/update/:table', (req, res) => {
		const user = req.user;
		const item = req.body.item;
		const tableName = req.params.table;

		if(((tableName === 'Users') && (item.Id !== req.user.Id)) || !isAuthorized(user, 'beta-travel-wishlist', 'beta-general')) {
			console.error('User is unauthorized.');
			res.status(401).send('User is unauthorized.');
			return;
		};

		const table = pickTable(req.params.table);

		if(!table){
			console.error('Please choose a table.');
			res.status(400).send('Please choose a table.');
			return;
		} else if (tableName === 'Users') {
			if (item.local && item.local.password) {
				if (item.local.password.length > 4) {
					item.local.password = table.generateHash(item.local.password);	
				} else {
					res.status(400).send({msg: 'Password must be at least 5 characters long',})
				}
			}
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

	router.post('/delete/:table', (req, res) => {
		const user = req.user;
		
		if(((tableName === 'Users') && (!isAuthorized(user))) || !isAuthorized(user, 'beta-travel-wishlist', 'beta-general')) {
			console.error('User is unauthorized.');
			res.status(401).send('User is unauthorized.');
			return;
		};

		const key = req.body['key'];
		const table = pickTable(req.params.table);

		if(!table){
			console.error('Please choose a table.');
			res.status(400).send('Please choose a table.');
			return;
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

//// s3 ajax calls
	router.get('/getFiles', isLoggedIn(), (req, res) => {
		if(req.query.folder.split('/')[0] !== req.user.Id && !req.user.isAdmin) {
			res.status(401).send('Request unauthorized');
			return;
		}


		s3.getFiles((files, folder, subFolders, marker, nextMarker) => {
			res.send({files, folder, subFolders, marker, nextMarker});
		}, req.query.folder, req.query.marker, req.query.maxKeys);
	});

	router.get('/getRootDirectory', isLoggedIn(), (req, res) => {
		res.send(req.user.Id);
	});

	router.post('/upload', isLoggedIn(), formidable(), (req, res) => {
		/*if(req.query.folder.split('/')[0] !== req.user.Id && !req.user.isAdmin) {
			res.status(401).send('Request unauthorized');
			return;
		}*/

		const files = req.files || [];
		const length = files.length;

		function uploadImage(file) {
			const fileName = file.name.split('.');
			const fileType = fileName.pop();

			s3.uploadImage(file.path, {path: fileName.join('')}, function(err, versions, meta) {
				if (err) {
					console.error(err);
					res.status(500).send(err);

					return;
				} else if(files.length) {
					uploadImage(files.shift());
				} else {
					res.send('success');
				}
			}, fileType, req.fields.filePath);
		}

		uploadImage(files.shift());
	});

	router.post('/deleteFiles', isLoggedIn(), (req, res) => {
		const files = req.body.files;

		s3.deleteFiles(files, req.user, (err) => {
			if(err) {
				if (err === 'Request unauthorized') {
					res.status(401).send(err);
					return;
				}

				res.status(500).send(err);
				console.error(err);

				return;
			}

			res.send('success');
		})
	});

//// utility ajax calls
	router.get('/renderPug', (req, res) => {
		const params = req.query;
		const filePath = `views/${params.file}`;
		const locals = params.locals;

		locals.getImagePath = res.locals.getImagePath;
		locals.wysiwygHasData = res.locals.wysiwygHasData;

		res.send(pug.compileFile(filePath)(locals));
	});

module.exports = router;