export interface ICart {
	openCartWindow(): void;
	closeCartWindow(): void;
	addProductToCart(id: string): void;
	removeProductFromCart(index: number): void;
	calculateOverallProductsPrice(): number;
}