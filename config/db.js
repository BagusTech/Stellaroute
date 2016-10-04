const AWS = require('aws-sdk');

//Connect to database
AWS.config.update({
  accessKeyId: process.env.AWS_DYNAMO_ID,
  secretAccessKey: process.env.AWS_DYNAMO_KEY,
  region: 'us-west-2',
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const db = new AWS.DynamoDB();
db.lite = new AWS.DynamoDB.DocumentClient()

module.exports = db;