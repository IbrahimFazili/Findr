const AWS = require('aws-sdk');

AWS.config = new AWS.Config({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.BUCKET_REGION
});

const Bucket = process.env.BUCKET_NAME;
const S3 = new AWS.S3();

/**
 * Generates a signed GET url that expires in 10 seconds
 * 
 * @param {String} Key Path to the image inside the Bucket
 * @returns {Promise<String>} Signed GET Url to allow client to download image from the bucket
 */
function generateSignedGetUrl(Key) {
    return new Promise(function(resolve, reject) {
        const params = {
            Bucket,
            Key,
            Expires: 10
        };

        S3.getSignedUrl('getObject', params, (err, url) => {
            if (err) reject(err);
            else resolve(url);
        });
    });
}

/**
 * Generates a signed PUT url that expires in 30 seconds
 * 
 * @param {String} Key Path to the image inside the Bucket
 * @returns {Promise<String>} Signed PUT Url to allow client to upload image to the bucket
 */
function generateSignedPutUrl(Key) {

    return new Promise(function(resolve, reject) {
        const params = {
            Bucket,
            Key,
            Expires: 30
        }
    
        S3.getSignedUrl('putObject', params, (err, url) => {
            if (err) reject(err);
            else resolve(url);
        });
    });
    
}

module.exports.generateSignedGetUrl = generateSignedGetUrl;
module.exports.generateSignedPutUrl = generateSignedPutUrl;
