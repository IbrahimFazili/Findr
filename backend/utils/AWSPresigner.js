const AWS = require("aws-sdk");

AWS.config = new AWS.Config({
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.SECRET_KEY,
	region: process.env.BUCKET_REGION,
});

const Bucket = process.env.BUCKET_NAME;
const S3 = new AWS.S3();

/**
 * Generates a signed GET url that expires in 10 seconds
 *
 * @param {String} Key Path to the image inside the Bucket
 * @returns {Promise<String>} Signed GET Url to allow client to download image from the bucket
 */
function generateSignedGetUrl(Key, timeout=10) {
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket,
			Key,
			Expires: timeout,
		};

		S3.getSignedUrl("getObject", params, (err, url) => {
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
function generateSignedPutUrl(Key, filetype) {
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket,
			Key,
			Expires: 30,
			ContentType: filetype === undefined ? "image/jpeg" : filetype,
		};

		S3.getSignedUrl("putObject", params, (err, url) => {
			if (err) reject(err);
			else resolve(url);
		});
	});
}

function deleteMedia(Key) {
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket,
			Key
		};

		S3.deleteObject(params, (err, data) => {
			if (err) reject(err, err.stack); // an error occurred
   			else resolve(data);           // successful response
		});
	});
}

module.exports.generateSignedGetUrl = generateSignedGetUrl;
module.exports.generateSignedPutUrl = generateSignedPutUrl;
module.exports.deleteMedia = deleteMedia;
