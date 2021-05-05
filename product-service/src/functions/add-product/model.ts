import { Client } from 'pg';

import { dbOptions } from '@libs/db.config';
import { Product } from '@libs/interfaces/product.interface';

export const addProduct = async (product: Product): Promise<Product> => {
  const client = new Client(dbOptions);
  const { count, description, price, title } = product;

  try {
    await client.connect();
    await client.query('BEGIN');

    const addProductQuery = `
      INSERT INTO products (title, description, price) 
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const { rows: [{ id }] } = await client.query(addProductQuery, [title, description, price]);

    const addStockQuery = `
      INSERT INTO stock (product_id, count)
      VALUES ($1, $2);
    `;

    await client.query(addStockQuery,  [id, count]);
    await client.query('COMMIT');

    return { id, ...product };
  } catch (err) {
    await client.query('ROLLBACK')
    throw err;
  } finally {
    client.end();
  }
}
