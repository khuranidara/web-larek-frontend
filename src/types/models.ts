// Тип данных для продукта
interface Product {
	Product_ID: string;
	Description: string;
	Category: string;
	Title: string;
	Image_URL: string;
	Price: number;
}

// Тип данных для пользователя
interface Customer {
	ID: string;
	PAY_TYPE: number;
	ADDRESS: string;
	EMAIL: string;
	PHONE: string;
	PRODUCTS: Product[];
}

export { Product, Customer };