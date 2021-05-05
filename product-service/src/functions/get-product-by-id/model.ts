import { Client } from 'pg';

import { dbOptions } from '@libs/db.config';
import { Product } from '@libs/interfaces/product.interface';

export const getProductById = async (productId: string): Promise<Product> => {
  const client = new Client(dbOptions);

  await client.connect();

  try {
    const query = `
      SELECT p.*, s.count
      FROM products AS p
      JOIN stock AS s ON s.product_id = p.id
      WHERE p.id = $1;
    `;
    const { rows: [product] } = await client.query(query, [productId])

    return product;
  } catch (error) {
    throw error;
  } finally {
    client.end()
  }
}
