const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    const Bucket = event.Records[0].s3.bucket.name; // react-nodebird-aws-s3
    const Key = decodeURIComponent(event.Records[0].s3.object.Key); // original/2313213_abc.png
    const filename = Key.split("/")[Key.split("/").length - 1];
    const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase();
    const requiredFormat = ext === "jpg" ? "jpeg" : ext;
    try {
        const s3Object = await s3.getObject({ Bucket, Key }).promise();
        const resizedImage = await sharp(s3Object.Body)
            .resize(400, 400, {
                fit: "inside",
            })
            .toFormat(requiredFormat)
            .toBuffer();
        await s3
            .putObject({
                Bucket,
                Key: `thumb/${filename}`,
                Body: resizedImage,
            })
            .promise();
        return callback(null, `thumb/${filename}`);
    } catch (error) {
        console.error(error);
        return callback(error);
    }
};
