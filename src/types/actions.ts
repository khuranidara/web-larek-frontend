interface CartActionTypes {
	OPEN_CART: string;
	CLOSE_CART: string;
	ADD_TO_CART: string;
	REMOVE_FROM_CART: string;
	CALCULATE_TOTAL: string;
}

interface CheckoutActionTypes {
	OPEN_CHECKOUT: string;
	CLOSE_CHECKOUT: string;
	UPDATE_PAY_TYPE: string;
	UPDATE_ADDRESS: string;
	UPDATE_EMAIL: string;
	UPDATE_PHONE: string;
	PROCEED_TO_PAYMENT: string;
}

export { CartActionTypes, CheckoutActionTypes };