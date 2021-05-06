import { APIGatewayProxyResult } from 'aws-lambda';

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*'
};

const successResponse = (body: Object, statusCode: number = 200): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      ...defaultHeaders
    },
    body: JSON.stringify(body)
  };
};

const errorResponse = (error: Error, statusCode: number = 500): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      ...defaultHeaders
    },
    body: JSON.stringify({ message: error.message || 'Something went wrong'})
  };
};

export {
  successResponse,
  errorResponse
}

