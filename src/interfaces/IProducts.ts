import { Product } from '../types/Product';

export interface IProducts {
	getAvailableProducts(): Product[];
	getProduct(id: string): Product | null;
}