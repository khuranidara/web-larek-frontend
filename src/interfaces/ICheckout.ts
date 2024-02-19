export interface ICheckout {
	openCheckoutWindow(): void;
	closeCheckoutWindow(): void;
	updatePayType(type: number): void;
	updateAddress(address: string): void;
	updateEmail(email: string): void;
	updatePhone(phone: string): void;
	proceedToPayment(): void;
}