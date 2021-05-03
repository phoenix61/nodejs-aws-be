import { APIGatewayProxyHandler } from 'aws-lambda';

import { successResponse, errorResponse } from './utils/responseBuilder';
import { productsService } from './services';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId = '' } = event.pathParameters;
    const product = await productsService.getProductById(productId);

    if (product) {
      return successResponse(product);
    }

    return errorResponse(new Error('Product not found'), 404);
  } catch (err) {
    return errorResponse(err);
  }
};
