const AWS = require('./aws');

const params = {
	accessKeyId: process.env.AWS_DYNAMO_ID,
	secretAccessKey: process.env.AWS_DYNAMO_KEY,
	endpoint: "https://dynamodb.us-west-2.amazonaws.com",
}

const db = new AWS.DynamoDB(params);
db.lite = new AWS.DynamoDB.DocumentClient(params);

module.exports = db;