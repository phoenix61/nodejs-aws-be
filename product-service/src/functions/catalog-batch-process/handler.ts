import { SQSEvent } from 'aws-lambda/trigger/sqs';

import * as ProductModel from '@models/product.model';
import { errorResponse, successResponse } from '@libs/api-gateway';
import { sendNotification } from './service';

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));

    console.log(`Received products: ${JSON.stringify(products)}`);

    for (const product of products) {
      await ProductModel.addProduct(product);

      console.log(`Product added to DB: ${JSON.stringify(product)}`);
    }

    await sendNotification(
      'Products import notification',
      `Next products were successfully added to DB: ${JSON.stringify(products)}`
    );

    return successResponse('Products were successfully added to DB');
  } catch (error) {
    console.log(`Failed to import products: ${JSON.stringify(error)}`);
    return errorResponse(error);
  }
};
