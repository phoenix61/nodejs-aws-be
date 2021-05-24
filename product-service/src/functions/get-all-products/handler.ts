import { APIGatewayProxyHandler } from 'aws-lambda';

import { successResponse, errorResponse } from '@libs/api-gateway';
import * as Products from '@models/product.model';

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log(`getAllProducts: incoming event: ${JSON.stringify(event)}`);

  try {
    const products = await Products.getAllProducts();

    return successResponse(products);
  } catch (err) {
    console.log(`Error on getting products list: ${err}`);
    return errorResponse(err);
  }
};
