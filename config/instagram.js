const instagram = require('instagram-node').instagram();

instagram.use({
	client_id: process.env.INSTAGRAM_ID,
	client_secret: process.env.INSTAGRAM_SECRET,
});

module.exports = instagram;