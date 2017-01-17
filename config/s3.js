const AWS = require('./aws');

const params = {
  accessKeyId: process.env.AWS_S3_ID,
  secretAccessKey: process.env.AWS_S3_KEY
}

const awsS3 = new AWS.S3(params);

module.exports = awsS3; 