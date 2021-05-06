import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { successResponse, errorResponse } from '@libs/api-gateway';
import { getSignedUrl } from './service';

export const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const fileName = event.queryStringParameters.name;

  if (!fileName) {
    return errorResponse(new Error('File name was not specified'), 400);
  }

  try {
    const url = await getSignedUrl(fileName);

    console.log(`Got URL for file upload: ${JSON.stringify(url)}`);

    return successResponse(url);
  } catch (err) {
    console.log(`Error on getting URL for file upload: ${JSON.stringify(err)}`)
    return errorResponse(err);
  }
};