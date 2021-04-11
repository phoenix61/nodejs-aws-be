import { APIGatewayProxyResult } from 'aws-lambda';

const corsHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*'
};

const successResponse = (body: Object, statusCode: number = 200): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      ...corsHeaders
    },
    body: JSON.stringify(body)
  };
};

const errorResponse = (error: Error, statusCode: number = 500): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      ...corsHeaders
    },
    body: JSON.stringify({ message: error.message || 'Something went wrong'})
  };
};

export {
  successResponse,
  errorResponse
}

