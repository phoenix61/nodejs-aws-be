import AWS from 'aws-sdk';

const BUCKET = process.env.BUCKET;
const REGION = process.env.REGION;

export const getSignedUrl = async (fileName: string): Promise<string> => {
  console.log(`Get upload URL for file requested: "${fileName}"`);

  const s3 = new AWS.S3({
    region: REGION,
    signatureVersion: 'v4'
  });

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: 'text/csv',
    ACL: 'public-read',
  };

  return await s3.getSignedUrlPromise('putObject', params);
};