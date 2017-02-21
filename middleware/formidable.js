const formidable = require('formidable');

function formidableMiddleware() {
	return (req, res, next) => {
		req.fields = req.fields || {};
		req.files = req.files || [];

		const form = new formidable.IncomingForm();

		// specify that we want to allow the user to upload multiple files in a single request
		form.multiples = true;

		// Limits the amount of memory all fields together (except files) can allocate in bytes.
		// If this value is exceeded, an 'error' event is emitted. The default size is 2MB.
		form.maxFieldsSize = 5 * 1024 * 1024;

		form.on('file', (field, file) => {
			req.files.push(file);
		});

		form.on('field', function(name, value) {
			req.fields[name] = value;
		});

		// log any errors that occur
		form.on('error', (err) => {
			console.log('An error has occured: \n' + err);
			next();
		});

		// once all the files have been uploaded, send a response to the client
		form.on('end', () => {
			next();
		});

		form.parse(req);
	}
}

module.exports = formidableMiddleware;