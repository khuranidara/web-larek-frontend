//IMPORTS
import './scss/styles.scss';
import { Product } from './types/Product';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductItems } from './types/ProductItems';
import * as querystring from 'querystring';
import { OrderData } from './types/OrderData';
import { ensureElement } from './utils/utils';
import { IProductsService } from './interfaces/IProductsService';
import { ProductsService } from './services/ProductsService';
import { IBasketService } from './interfaces/IBasketService';
import { BasketService } from './services/BasketService';

// CONSTANTS
const gallery = document.querySelector('.gallery');
const api = new Api(API_URL);


// SERVICES
const productsService: IProductsService = new ProductsService();
const basketService: IBasketService = new BasketService();

function cloneTemplate() {

	productsService.getProductItems().then(productItems=> {
		for (let i = 0; i < productItems.total; i++) {
			const item: Product = productItems.items[i];
			const catalog_clone = productsService.renderProductCard(item);
			const card = catalog_clone.querySelector('.card');
			card.addEventListener('click', () => {
				console.log('card clicked');
				openFilledPreview(item);
			});

			gallery.appendChild(catalog_clone);
		}
	});
}

const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;


cloneTemplate();

function openFilledPreview(product: Product) {
	modalContainer.classList.add('modal_active');
	modalContainer.style.position = 'fixed';
	modalContent.innerHTML = '';
	const previewClone = document.importNode(previewTemplate.content, true);
	const image = previewClone.querySelector('.card__image');
	const category = previewClone.querySelector('.card__category');
	const title = previewClone.querySelector('.card__title');
	const text = previewClone.querySelector('.card__text');
	const price = previewClone.querySelector('.card__price');
	const addToBasketButton = previewClone.querySelector('.card__button');

	image.setAttribute('src', 'https://larek-api.nomoreparties.co/content/weblarek' + product.image);
	category.textContent = product.category;
	title.textContent = product.title;
	text.textContent = product.description;
	modalContent.appendChild(previewClone);
	if (price) {
		if (product.price !== null) {
			price.textContent = product.price.toString();
		} else {
			price.textContent = 'Бесценно';
		}
	}
	addToBasketButton.addEventListener('click', () => {

		if(basketService.addToBasket(product.id)){
			basketService.updateTotal(productsService);
			document.dispatchEvent(new CustomEvent('basketUpdated'));
		}
		document.dispatchEvent(new CustomEvent('basketUpdated'));
		modalContainer.classList.remove('modal_active');
		modalContainer.style.position = 'fixed';
	});
};


const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;

const basket_button = document.querySelector('.header__basket');
basket_button.addEventListener('click', function(event) {
	modalContent.innerHTML = '';
	const basketContent = basketTemplate.content.cloneNode(true);
	modalContent.appendChild(basketContent);
	modalContainer.classList.add('modal_active');
	modalContainer.style.position = 'fixed';
	basketService.renderBasket(productsService);
});

const closeModalButton = modalContainer.querySelector('.modal__close');
closeModalButton.addEventListener('click', function(event) {
	modalContainer.classList.remove('modal_active');
	modalContainer.style.position = 'fixed';
});


const basketList = document.querySelector('.basket__list');
document.addEventListener('basketUpdated', function () {
	basketList.innerHTML = '';
	updateBasketCounter();
});

function updateBasketCounter() {
	const basketCounterElement = document.querySelector('.header__basket-counter');
	if (basketCounterElement) {
		const orderData = basketService.getOrderData();
		basketCounterElement.textContent = orderData.items.length.toString();
	}
}



window.addEventListener('click', function(event) {
	if (event.target === modalContainer) {
		modalContainer.classList.remove('modal_active');
		modalContainer.style.position = 'fixed';
	}
});