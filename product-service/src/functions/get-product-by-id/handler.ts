import { APIGatewayProxyHandler } from 'aws-lambda';

import { successResponse, errorResponse } from '@libs/api-gateway';
import * as Product from './model';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  console.log(`getProductById: incoming event: ${JSON.stringify(event)}`);

  try {
    const { productId = '' } = event.pathParameters;
    const product = await Product.getProductById(productId);

    if (product) {
      return successResponse(product);
    }

    return errorResponse(new Error('Product not found'), 404);
  } catch (err) {
    console.log(`Error on fetching product by ID: ${err}`);
    return errorResponse(err);
  }
};
