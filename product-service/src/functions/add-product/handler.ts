import { APIGatewayProxyHandler } from 'aws-lambda';

import * as Products from './model';
import { Product } from '@libs/interfaces/product.interface';
import { successResponse, errorResponse } from '@libs/api-gateway';

export const addProduct: APIGatewayProxyHandler = async (event) => {
  console.log(`addProduct: incoming event: ${JSON.stringify(event)}`);

  try {
    const product = await Products.addProduct(JSON.parse(event.body) as Product);

    return successResponse(product);
  } catch (err) {
    console.log(`Error on adding product: ${err}`);
    return errorResponse(err);
  }
};
