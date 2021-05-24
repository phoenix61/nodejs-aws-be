import { SNS } from 'aws-sdk';

export const sendNotification = async (subject, message) => {
  console.log(`Sending message: ${subject}: ${message}`);

  const sns = new SNS({ region: process.env.REGION });

  try {
    await sns.publish({
      Subject: subject,
      Message: message,
      TargetArn: process.env.SNS_ARN
    }).promise();
  } catch (err) {
    console.log(`Error occurred during email sanding: ${subject}: ${message}`);
    throw err;
  }
};
