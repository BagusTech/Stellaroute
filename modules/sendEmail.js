const fs   = require('fs');
const smtp = require('../config/smtp');

const sendEmail = function(toEmail, subject, template, rawHTML, fromEmail) {
	const htmlstream = template ? fs.createReadStream('./emailTemplates/' + template + '.html') : rawHTML;
	const mailOptions = {
		from: fromEmail || '"Stellaroute" <marketing@stellaroute.com>', // sender address (formatted to be named)
		to: toEmail, // list of receivers (can be array)
		subject: subject, // Subject line
		//text: 'Hello world', // plaintext body
		html: htmlstream // html body
	};

	smtp.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.error(error);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
}

module.exports = sendEmail;