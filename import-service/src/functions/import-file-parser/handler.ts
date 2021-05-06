import { S3CreateEvent } from 'aws-lambda';

import { successResponse, errorResponse } from '@libs/api-gateway';
import { moveFileToParsed, parseFile } from './service';

const importFileParser = async (event: S3CreateEvent) => {
  console.log(`ImportFileParser invoked for file: ${JSON.stringify(event.Records[0])}`);

  try {
    const fileName = event.Records[0].s3.object.key;

    await parseFile(fileName);
    await moveFileToParsed(fileName);

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
};

export {
  importFileParser
}
