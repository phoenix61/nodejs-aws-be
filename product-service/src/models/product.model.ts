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
};

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
    client.end();
  }
};

export const addProduct = async (product: Product): Promise<Product> => {
  const client = new Client(dbOptions);
  const { count, description, price, title } = product;

  try {
    await client.connect();
    await client.query('BEGIN');

    const addProductQuery = `
      INSERT INTO products (title, description, price) 
      VALUES ($1, $2, $3)
      ON CONFLICT (title)
      DO UPDATE SET
        description = EXCLUDED.description,
        price = EXCLUDED.price
      RETURNING id;
    `;
    const { rows: [{ id }] } = await client.query(addProductQuery, [title, description, price]);

    const addStockQuery = `
      INSERT INTO stock (product_id, count)
      VALUES ($1, $2)
      ON CONFLICT (product_id)
      DO UPDATE SET
        count = EXCLUDED.count;
    `;

    await client.query(addStockQuery, [id, count]);
    await client.query('COMMIT');

    return { id, ...product };
  } catch (err) {
    await client.query('ROLLBACK')
    throw err;
  } finally {
    client.end();
  }
};

