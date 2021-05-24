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
      .on('data', (data) => sendProductToQueue(data))
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

function sendProductToQueue(product) {
  const sqs = new AWS.SQS({ region: process.env.REGION });

  console.log(`Sending product to the queue: ${JSON.stringify(product)}`)

  sqs.sendMessage(
    {
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(product),
    },
    (error, data) => {
      if (error) {
        console.log(`Error on sending product to the queue: ${JSON.stringify(error)}`);
        return;
      }

      console.log(`Product was successfully sent to the queue: ${JSON.stringify(data)}`);
    }
  );
}

function getS3Instance(): S3 {
  return new AWS.S3({ region: REGION });
}
