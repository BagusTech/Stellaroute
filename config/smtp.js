const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const smtpUserName = 'AKIAJHDZC7F3HYN5D36Q';
const smtpPassword = 'Aiy78LCZX8DXAPUefusbQBn5D8aazsm6ydS2MgcJrLyf';

const smtp = nodemailer.createTransport(smtpTransport({
	host: 'email-smtp.us-west-2.amazonaws.com',
	port: 465,
	secure: true,
	auth: {	
		user: smtpUserName,
		pass: smtpPassword
	  }
}));

module.exports = smtp;