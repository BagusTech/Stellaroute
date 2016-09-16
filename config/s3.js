const Upload = require('s3-uploader');
const client = new Upload('stellaroute.com', {
	aws: {
		path: 'images/',
		region: 'us-west-2',
		acl: 'public-read',
		accessKeyId: 'AKIAIJEG2OGEQALNK2WA', 
		secretAccessKey: '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',
	},

	cleanup: {
		versions: false,
		original: true
	},

	original: {
		awsImageAcl: 'public-read'
	}
});


/* client.upload('C:/bagus/Stellaroute/website/public/images/index-bg.jpg', {}, function(err, versions, meta) {
	if (err) { throw err; }

	versions.forEach(function(image) {
		console.log(image.width, image.height, image.url);
		// 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg 
	});
}); */

module.exports = function(x) {return x;}; 