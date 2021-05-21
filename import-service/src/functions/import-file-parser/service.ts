import AWS, { S3 } from 'aws-sdk';
import csv from 'csv-parser';

const BUCKET = process.env.BUCKET;
const REGION = process.env.REGION;

export const parseFile = async (fileName) => {
  const s3 = getS3Instance();
  const readStream = s3.getObject({
    Key: fileName,
    Bucket: BUCKET
  }).createReadStream();

  await new Promise<void>((resolve, reject) => {
    readStream
      .pipe(csv())
      .on('data', (data) => console.log(data))
      .on('end', () => {
        console.log(`${fileName} parsed successfully`);
        resolve();
      })
      .on('error', (err) => reject(err))
  });
};

export const moveFileToParsed = async (fileName) => {
  const s3 = getS3Instance();

  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${fileName}`,
    Key: fileName.replace('uploaded', 'parsed')
  }).promise();

  console.log(`Copied into ${BUCKET}/${fileName.replace('uploaded', 'parsed')}`);

  await s3.deleteObject({
    Bucket: BUCKET,
    Key: fileName
  }).promise();

  console.log(`Deleted from ${BUCKET}/${fileName}`);
};

function getS3Instance(): S3 {
  return new AWS.S3({ region: REGION });
}
