const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const smtp = nodemailer.createTransport(smtpTransport({
	host: 'email-smtp.us-west-2.amazonaws.com',
	port: 465,
	secure: true,
	auth: {	
		user: process.env.AWS_SMPT_ID,
		pass: process.env.AWS_SMPT_KEY
	  }
}));

module.exports = smtp;