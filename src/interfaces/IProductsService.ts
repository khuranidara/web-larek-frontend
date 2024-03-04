import { Product } from '../types/Product';
import { ProductItems } from '../types/ProductItems';

export interface IProductsService {
	renderProductCard(product: Product): DocumentFragment;
	getProductById(id: string): Product;
	getProductItems(): Promise<ProductItems>;
}