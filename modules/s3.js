const awsS3 = require('../config/s3.js');
const Upload = require('s3-uploader');
const s3 = {};

function getSetFolders(folderName, folder, subFolders) {
	if(subFolders && subFolders.length > 0) {
		folder[folderName] = folder[folderName] || {};

		getSetFolders(subFolders.shift(), folder[folderName], subFolders)
	} else if(!folder[folderName]) {
		folder[folderName] = false;
	};
}

function createFolderStructure(files) {
	const folders = {};

	files.forEach((file) => {
		const fileArr = file.split('/');
		fileArr.pop(); // get rid of the file name, only worrying about the folders

		getSetFolders(fileArr.shift(), folders, fileArr);
	});

	return folders
};

s3.getFiles = (callback, folder, marker, maxKeys) => {
	if(!callback) {
		console.error('A callback is required for getFiles');
		return;
	}

	const prefix = folder
	const filesFolder = '/';
	const options = {
		Bucket: 'stellaroute',
		MaxKeys: maxKeys,
		Prefix: prefix,
		Delimiter: '/',
		Marker: marker,
	}

	awsS3.listObjects(options, function(err, data) {
		if (err) {
			console.error(err, err.stack)
			return;
		};

		const bucketObjects = data.Contents.filter((i) => {
			const key = i.Key.split('/');
			key.pop();
			return `${key.join('/')}/` === prefix;
		});

		const subFolders = data.CommonPrefixes.map((folderPath) => {
			const folders = folderPath.Prefix.split('/'); 

			folders.pop(); // the last item in the array will always be an empty string
			return folders.pop(); // return the last item, the folder name
		});

		callback(bucketObjects, prefix, subFolders, data.Marker, data.NextMarker);
	});
}

s3.uploadImage = (file, options, callback, fileType, filePath) => {
	const extention = fileType || 'jpg'
	const path = filePath || '/';
	const client = new Upload('stellaroute', {
		aws: {
			path: path,
			region: 'us-west-2',
			acl: 'public-read',
			accessKeyId: process.env.AWS_S3_ID, 
			secretAccessKey: process.env.AWS_S3_KEY,
		},

		cleanup: {
			versions: true,
			original: true,
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