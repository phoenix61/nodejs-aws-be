import products from '../storage/products.json';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
}

export class ProductsService {
  getAllProducts = (): Product[] => products;
  getProductById = (id: string): Product => products.find(product => product.id === id);
}

