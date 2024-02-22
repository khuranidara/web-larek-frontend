import './scss/styles.scss';
import { Product } from './types/Product';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductItems } from './types/ProductItems';
import * as querystring from 'querystring';
import { Customer } from './types/Customer';

const gallery = document.querySelector('.gallery');
const cardtemp = document.querySelector("#card-catalog") as HTMLTemplateElement;
const api = new Api(API_URL);
let productItems: ProductItems = {} as ProductItems;
function cloneTemplate(){

api.get("/product/").then( result => {

	productItems = result as ProductItems;
	console.log(productItems.items);

	for (let i = 0; i < productItems.total; i++) {
		const item: Product = productItems.items[i];
		gallery.appendChild(renderProductCard(item));
	}
});
}

const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
function renderProductCard(product: Product):DocumentFragment  {
	const catalog_clone = document.importNode(cardtemp.content, true);

	const category = catalog_clone.querySelector('.card__category');
	const title = catalog_clone.querySelector('.card__title');
	const image = catalog_clone.querySelector('.card__image');
	const price = catalog_clone.querySelector('.card__price');

	const card = catalog_clone.querySelector('.card');

	category.textContent = product.category;
	title.textContent = product.title;
	image.setAttribute('src',  'https://larek-api.nomoreparties.co/content/weblarek' + product.image);
	if (price) {
		if (product.price !== null) {
			price.textContent = product.price.toString();
		} else {
			price.textContent = "Бесценно";
		}
	}

	card.addEventListener('click', () => {
		console.log("card clicked");
		openFilledPreview(product);
	});

	return catalog_clone;
}

cloneTemplate();

function openFilledPreview(product: Product) {
	modalContainer.classList.add('modal_active');
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
			price.textContent = product.price.toString();}
		else {
			price.textContent = "Бесценно";
		}
	}
	addToBasketButton.addEventListener('click', () => {
		addToBasket(product.id);
		upateBasketCounter();
	});
};


const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;

const basket_button = document.querySelector('.header__basket');
basket_button.addEventListener("click", function(event) {
	modalContent.innerHTML = '';
	const basketContent = basketTemplate.content.cloneNode(true);
	modalContent.appendChild(basketContent);
	modalContainer.classList.add('modal_active');
	fillBasket();
});

const closeModalButton = modalContainer.querySelector('.modal__close');
closeModalButton.addEventListener("click", function(event) {
	modalContainer.classList.remove('modal_active');
});

const basket: string[] =[];
function addToBasket(productId: string) {
	if (!basket.includes(productId)) {
		basket.push(productId);
		upateBasketCounter();
	}
}

function fillBasket(){
	let totalPrice = 0;
	const basketList = document.querySelector('.basket__list');
	while (basketList.firstChild) {
		basketList.removeChild(basketList.firstChild);
	}
	for (let i = 0; i < basket.length; i++) {
		const productId = basket[i];
		const product = productItems.items.find(product=> product.id == productId);
			const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
			const basketItem = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
			const indexSpan = basketItem.querySelector('.basket__item-index');
			const title = basketItem.querySelector('.card__title');
			const price = basketItem.querySelector('.card__price');
			const deleteButton = basketItem.querySelector('.basket__item-delete');
			indexSpan.textContent = `${i+1}`;
			title.textContent = product.title;
			if (product.price!== null) {
				price.textContent = product.price.toString() + " синапсов";
				totalPrice += product.price;
			} else {
				price.textContent = "Бесценно"
				totalPrice += 0;
			}
			deleteButton.addEventListener('click', () =>{
				basket.splice(i,1);
				fillBasket();
				upateBasketCounter();
			});
			basketList.appendChild(basketItem);
	}
		const  totalPriceElement = document.querySelector('.basket__price');
		totalPriceElement.textContent = `${totalPrice} синапсов`;
		const checkoutButton = modalContent.querySelector('.basket__button');
		checkoutButton.addEventListener('click', function(event) {
			modalContent.innerHTML = '';
			const orderContent = orderTemplate.content.cloneNode(true);
			modalContent.appendChild(orderContent);
			modalContainer.classList.add('modal_active');
			const orderForm:HTMLFormElement = modalContent.querySelector('.order');
			const onlinePaymentButton = orderForm.querySelector('button[name="card"]');
			const cashPaymentButton = orderForm.querySelector('button[name="cash"]');
			const addressInput:HTMLInputElement = modalContent.querySelector('.form__input');
			const errorSpan = modalContent.querySelector('.form__errors');
			const nextButton = modalContent.querySelector('.order__button');

			let payType = 0;
			onlinePaymentButton.addEventListener('click', function() {
				payType = 0;
				onlinePaymentButton.classList.add('button_alt-active');
				cashPaymentButton.classList.remove('button_alt-active');
				console.log('paytype:' + payType);
			});
			cashPaymentButton.addEventListener('click', function() {
				payType = 1;
				cashPaymentButton.classList.add('button_alt-active');
				onlinePaymentButton.classList.remove('button_alt-active');
				console.log('paytype:' + payType);
			});
			addressInput.addEventListener('input', function(){
				if (addressInput.value.trim() != '') {
					nextButton.removeAttribute('disabled');
					errorSpan.textContent = '';
				} else {
					nextButton.setAttribute('disabled', 'true');
					errorSpan.textContent = 'Пожалуйста, введите адрес доставки';
				}
			});
			modalContent.addEventListener('submit', function(event) {
				event.preventDefault();
				const payTypeValue = payType;
				const deliveryAddress = addressInput.value.trim();
				customer = {
					id: '',
					payType: payTypeValue,
					address: deliveryAddress,
					email: '',
					phone: ''
				}
				console.log('payType:', customer.payType);
				console.log('Delivery address:', customer.address);
			});
			nextButton.addEventListener('click', function() {
				console.log('Далее');
			});
		})
}

function upateBasketCounter() {
	const basketCounterElement = document.querySelector('.header__basket-counter');
	if (basketCounterElement) {
		basketCounterElement.textContent = basket.length.toString();
	}
}


const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

let customer: Customer | null = null;