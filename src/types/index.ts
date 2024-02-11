// Модели данных

interface Product {
	productId: string;
	description: string;
	category: string;
	title: string;
	imageUrl: string;
	price: number;
}

interface Customer {
	id: string;
	payType: number;
	address: string;
	email: string;
	phone: string;
}

// Действия с товарами

interface ProductsActions {
	getAvailableProducts(): Product[];
	getProduct(id: string): Product | null;
}

// Действия с корзиной

interface CartActions {
	openCartWindow(): void;
	closeCartWindow(): void;
	addProductToCart(id: string): void;
	removeProductFromCart(index: number): void;
	calculateOverallProductsPrice(): number;
}

// Действия с оформлением заказа

interface CheckoutActions {
	openCheckoutWindow(): void;
	closeCheckoutWindow(): void;
	updatePayType(type: number): void;
	updateAddress(address: string): void;
	updateEmail(email: string): void;
	updatePhone(phone: string): void;
	proceedToPayment(): void;
}

// Представления

interface HomeView {
	displayProducts(products: Product[]): void;
}

interface CardView {
	// Можно расширить интерфейс, если нужно
}

interface CartView {
	// Можно расширить интерфейс, если нужно
}

interface CheckoutPaymentView {
	// Можно расширить интерфейс, если нужно
}

interface CheckoutContactInfoView {
	// Можно расширить интерфейс, если нужно
}

interface CheckoutResultView {
	// Можно расширить интерфейс, если нужно
}
