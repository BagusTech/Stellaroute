const AWS = require('aws-sdk');

//Connect to database
AWS.config.update({
  accessKeyId: 'AKIAIJEG2OGEQALNK2WA', 
  secretAccessKey: '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',
  region: 'us-west-2',
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const db = new AWS.DynamoDB();
db.lite = new AWS.DynamoDB.DocumentClient()

module.exports = db;