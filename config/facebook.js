const fb = require('fb');
const facebook = new fb.Facebook({
	appId: process.env.INSTAGRAM_ID,
	appSecret: process.env.INSTAGRAM_SECRET,
});

module.exports = facebook;