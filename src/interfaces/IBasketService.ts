import { OrderData } from '../types/OrderData';
import { IProductsService } from './IProductsService';

export interface IBasketService {
	addToBasket(productId: string): boolean;
	removeFromBasket(productId: string): boolean;
	updateTotal(productsService: IProductsService): void;
	renderBasket(productsService: IProductsService): void;
	getOrderData(): OrderData;
}