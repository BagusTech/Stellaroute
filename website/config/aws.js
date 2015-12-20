const AWS = require('aws-sdk');

//Connect to database
AWS.config.update({
  accessKeyId: '[accessKeyId]', 
  secretAccessKey: '[secretAccessKey]',
  region: '[region]',
  endpoint: "[endpoint]"
});

var db = new AWS.DynamoDB();
db.lite = new AWS.DynamoDB.DocumentClient()

module.exports = db;