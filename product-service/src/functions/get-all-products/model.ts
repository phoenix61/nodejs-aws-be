import { Client } from 'pg';

import { dbOptions } from '@libs/db.config';
import { Product } from '@libs/interfaces/product.interface';

export const getAllProducts = async (): Promise<Product[]> => {
  const client = new Client(dbOptions);

  try {
    await client.connect();

    const query = `
      SELECT p.*, s.count
      FROM products AS p
      JOIN stock AS s ON s.product_id = p.id;
    `;
    const { rows: products } = await client.query(query);
    
    return products;
  } catch (err) {
    throw err;
  } finally {
    client.end();
  }
}
