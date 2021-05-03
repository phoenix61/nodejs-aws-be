import { APIGatewayProxyHandler } from 'aws-lambda';

import { successResponse, errorResponse } from './utils/responseBuilder';
import { productsService } from './services';

export const getAllProducts: APIGatewayProxyHandler = async () => {
  try {
    const products = await productsService.getAllProducts();

    return successResponse(products);
  } catch (err) {
    return errorResponse(err);
  }
};
