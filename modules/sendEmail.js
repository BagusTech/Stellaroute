const fs   = require('fs');
const smtp = require('../config/smtp');

const sendEmail = function(toEmail, subject, template, rawHTML, fromEmail) {
	const htmlstream = template ? fs.createReadStream('./emailTemplates/' + template + '.html') : rawHTML;
	const mailOptions = {
		from: fromEmail || 'marketing@stellaroute.com', // sender address
		to: toEmail, // list of receivers
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