const awsS3 = require('../config/s3.js');
const Upload = require('s3-uploader');
const s3 = {};

s3.getFiles = (callback, folder, extentions) => {
	const filesFolder = folder || 'images/';
	const fileExtensions = extentions || ['jpg'];

	awsS3.listObjects({Bucket: 'stellaroute.com', Prefix: filesFolder}, function(err, data) {
		if (err) {
			console.log(err, err.stack)
			return;
		};

		const bucketObjects = data.Contents.filter((i) => fileExtensions.indexOf(i.Key.split('.').pop()) > -1);

		if (callback) {
			callback(bucketObjects);
		}
	});
}

s3.uploadImage = (file, options, callback, fileType, filePath) => {
	const extention = fileType || 'jpg'
	const path = filePath || 'images/';
	const client = new Upload('stellaroute.com', {
		aws: {
			path: path,
			region: 'us-west-2',
			acl: 'public-read',
			accessKeyId: process.env.AWS_S3_ID, 
			secretAccessKey: process.env.AWS_S3_KEY,
		},

		cleanup: {
			versions: true,
			original: true
		},

		versions: [{
			maxHeight: 1040,
			maxWidth: 1040,
			format: extention,
			suffix: '-large',
			quality: 80,
			awsImageExpires: 31536000,
			awsImageMaxAge: 31536000
		},{
			maxWidth: 780,
			format: extention,
			aspect: '3:2!h',
			suffix: '-medium'
		},{
			maxWidth: 320,
			format: extention,
			aspect: '16:9!h',
			suffix: '-small'
		},{
			maxHeight: 100,
			format: extention,
			aspect: '1:1',
			suffix: '-thumb1'
		},{
			maxHeight: 250,
			maxWidth: 250,
			format: extention,
			aspect: '1:1',
			suffix: '-thumb2'
		}],
	});

	client.upload(file, options, callback);
}

module.exports = s3;