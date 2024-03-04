import './scss/styles.scss';
import { Product } from './types/Product';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductItems } from './types/ProductItems';
import * as querystring from 'querystring';
import { OrderData } from './types/OrderData';
import { ensureElement } from './utils/utils';

const gallery = document.querySelector('.gallery');
const cardtemp = document.querySelector('#card-catalog') as HTMLTemplateElement;
const api = new Api(API_URL);
let productItems: ProductItems = {} as ProductItems;

function cloneTemplate() {

	api.get('/product/').then(result => {

		productItems = result as ProductItems;
		console.log(productItems.items);

		for (let i = 0; i < productItems.total; i++) {
			const item: Product = productItems.items[i];
			gallery.appendChild(renderProductCard(item));
		}
	});
}

const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

function renderProductCard(product: Product): DocumentFragment {
	const catalog_clone = document.importNode(cardtemp.content, true);

	const category = catalog_clone.querySelector('.card__category');
	const title = catalog_clone.querySelector('.card__title');
	const image = catalog_clone.querySelector('.card__image');
	const price = catalog_clone.querySelector('.card__price');

	const card = catalog_clone.querySelector('.card');

	category.textContent = product.category;
	title.textContent = product.title;
	image.setAttribute('src', 'https://larek-api.nomoreparties.co/content/weblarek' + product.image);
	if (price) {
		if (product.price !== null) {
			price.textContent = product.price.toString();
		} else {
			price.textContent = 'Бесценно';
		}
	}
	switch (product.category) {
		case 'софт-скил':
			category.classList.add('card__category_soft');
			break;
		case 'хард-скил':
			category.classList.add('card__category_hard');
			break;
		case 'другое':
			category.classList.add('card__category_other');
			break;
		case 'дополнительное':
			category.classList.add('card__category_additional');
			break;
		default:
			category.classList.add('card__category_button');
			break;
	}
	card.addEventListener('click', () => {
		console.log('card clicked');
		openFilledPreview(product);
	});

	return catalog_clone;
}

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
		addToBasket(product.id);
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
	fillBasket();
});

const closeModalButton = modalContainer.querySelector('.modal__close');
closeModalButton.addEventListener('click', function(event) {
	modalContainer.classList.remove('modal_active');
	modalContainer.style.position = 'fixed';
});

const basket: string[] = [];

function addToBasket(productId: string) {
	if (!basket.includes(productId)) {
		basket.push(productId);
		document.dispatchEvent(new CustomEvent('basketUpdated'));
	}
}

let totalPrice = 0;

const orderData: OrderData = {
	payment: 'online',
	email: '',
	phone: '',
	address: '',
	total: 0,
	items: [] as string[],
};

function fillBasket() {
	const basketList = document.querySelector('.basket__list');
	while (basketList.firstChild) {
		basketList.removeChild(basketList.firstChild);
	}
	totalPrice = 0;
	orderData.items = [];
	for (let i = 0; i < basket.length; i++) {
		const productId = basket[i];
		const product = productItems.items.find(product => product.id == productId);
		const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
		const basketItem = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
		const indexSpan = basketItem.querySelector('.basket__item-index');
		const title = basketItem.querySelector('.card__title');
		const price = basketItem.querySelector('.card__price');
		const deleteButton = basketItem.querySelector('.basket__item-delete');
		indexSpan.textContent = `${i + 1}`;
		title.textContent = product.title;
		if (product.price !== null) {
			price.textContent = product.price.toString() + ' синапсов';
			totalPrice += product.price;
		} else {
			price.textContent = 'Бесценно';
			totalPrice += 0;
		}
		deleteButton.addEventListener('click', () => {
			basket.splice(i, 1);
			fillBasket();
			document.dispatchEvent(new CustomEvent('basketUpdated'));
		});
		basketList.appendChild(basketItem);
		orderData.items.push(productId);
	}
	const totalPriceElement = document.querySelector('.basket__price');
	totalPriceElement.textContent = `${totalPrice} синапсов`;
	orderData.total = totalPrice;
	const checkoutButton = modalContent.querySelector('.basket__button') as HTMLButtonElement;
	if (basket.length === 0) {
		checkoutButton.disabled = true;
	}
	checkoutButton.addEventListener('click', function(event) {
		modalContent.innerHTML = '';
		const orderContent = orderTemplate.content.cloneNode(true);
		modalContent.appendChild(orderContent);
		modalContainer.classList.add('modal_active');
		modalContainer.style.position = 'fixed';
		let payType = 'online';
		const orderForm = ensureElement('.order', modalContent);
		const onlinePaymentButton = ensureElement('button[name="card"]', orderForm);
		const cashPaymentButton = ensureElement('button[name="cash"]', orderForm);
		const addressInput = ensureElement<HTMLInputElement>('.form__input', modalContent);
		const errorSpan = ensureElement('.form__errors', modalContent);
		const nextButton = ensureElement('.order__button', modalContent);

		onlinePaymentButton.addEventListener('click', function () {
			payType = 'online';
			orderData.payment = payType;
			onlinePaymentButton.classList.add('button_alt-active');
			cashPaymentButton.classList.remove('button_alt-active');
			console.log('paytype:' + payType);
		});

		cashPaymentButton.addEventListener('click', function () {
			payType = 'offline';
			orderData.payment = payType;
			cashPaymentButton.classList.add('button_alt-active');
			onlinePaymentButton.classList.remove('button_alt-active');
			console.log('paytype:' + payType);
		});

		addressInput.addEventListener('input', function () {
			if (addressInput.value.trim() !== '') {
				orderData.address = addressInput.value.trim();
				nextButton.removeAttribute('disabled');
				errorSpan.textContent = '';
			} else {
				nextButton.setAttribute('disabled', 'true');
				errorSpan.textContent = 'Пожалуйста, введите адрес доставки';
			}
		});
		nextButton.addEventListener('click', function() {
			console.log('Далее');
			modalContent.innerHTML = '';
			const contactsContent = contactsTemplate.content.cloneNode(true);
			modalContent.appendChild(contactsContent);
			modalContainer.classList.add('modal_active');
			modalContainer.style.position = 'fixed';
			const emailInput: HTMLInputElement = modalContent.querySelector('input[name="email"]');
			const phoneInput: HTMLInputElement = modalContent.querySelector('input[name="phone"]');
			const contactsForm: HTMLFormElement = modalContent.querySelector('.form');
			const submitButton: HTMLButtonElement = modalContent.querySelector('button[type="submit"]');
			const contactsErrorSpan: HTMLSpanElement = modalContent.querySelector('.form__errors');
			emailInput.addEventListener('input', function () {
				if (emailInput.checkValidity() && phoneInput.checkValidity() && emailInput.value.trim() !== '' && phoneInput.value.trim() !== '') {
					orderData.email = emailInput.value.trim();
					submitButton.removeAttribute('disabled');
					contactsErrorSpan.textContent = '';
				} else {
					submitButton.setAttribute('disabled', 'true');
					let errorMessage = '';
					if (!emailInput.checkValidity()) {
						errorMessage += 'Пожалуйста, введите корректный email. ';
					}
					if (!phoneInput.checkValidity()) {
						errorMessage += 'Пожалуйста, введите корректный номер телефона. ';
					}
					if (emailInput.value.trim() === '') {
						errorMessage += 'Пожалуйста, укажите email. ';
					}
					if (phoneInput.value.trim() === '') {
						errorMessage += 'Пожалуйста, укажите номер телефона. ';
					}
					contactsErrorSpan.textContent = errorMessage;
					orderData.email = emailInput.value.trim();
				}
			});

			phoneInput.addEventListener('input', function () {
				if (emailInput.checkValidity() && phoneInput.checkValidity() && emailInput.value.trim() !== '' && phoneInput.value.trim() !== '') {
					submitButton.removeAttribute('disabled');
					contactsErrorSpan.textContent = '';
					orderData.phone = phoneInput.value.trim();
				} else {
					submitButton.setAttribute('disabled', 'true');
					let errorMessage = '';
					if (!emailInput.checkValidity()) {
						errorMessage += 'Пожалуйста, введите корректный email. ';
					}
					if (!phoneInput.checkValidity()) {
						errorMessage += 'Пожалуйста, введите корректный номер телефона. ';
					}
					if (emailInput.value.trim() === '') {
						errorMessage += 'Пожалуйста, укажите email. ';
					}
					if (phoneInput.value.trim() === '') {
						errorMessage += 'Пожалуйста, укажите номер телефона. ';
					}
					contactsErrorSpan.textContent = errorMessage;
				}
			});
			submitButton.addEventListener('click', function(event) {
				event.preventDefault();
				console.log('Данные заказа:', orderData);
				api.post('/order/', orderData).then(response => {
					console.log(JSON.stringify(response));
					modalContent.innerHTML = '';
					const successTemplate = document.getElementById('success') as HTMLTemplateElement;
					const successContent = successTemplate.content.cloneNode(true) as HTMLElement;
					modalContent.appendChild(successContent);
					const descriptionElement = modalContent.querySelector('.order-success__description');
					if (descriptionElement) {
						descriptionElement.textContent = `Списано ${totalPrice} синапсов`;
					}
					const closeModalButton = modalContent.querySelector('.order-success__close');
					closeModalButton.addEventListener('click', function(event) {
						modalContainer.classList.remove('modal_active');
						modalContainer.style.position = 'fixed';
					});
					basket.length = 0;
					document.dispatchEvent(new CustomEvent('basketUpdated'));
					totalPrice = 0;
				});
			});
		});
	});
}
const basketList = document.querySelector('.basket__list');
document.addEventListener('basketUpdated', function () {
	basketList.innerHTML = '';
	updateBasketCounter();
});

function updateBasketCounter() {
	const basketCounterElement = document.querySelector('.header__basket-counter');
	if (basketCounterElement) {
		basketCounterElement.textContent = basket.length.toString();
	}
}


const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

const contactsTemplate: HTMLTemplateElement = document.getElementById('contacts') as HTMLTemplateElement;

window.addEventListener('click', function(event) {
	if (event.target === modalContainer) {
		modalContainer.classList.remove('modal_active');
		modalContainer.style.position = 'fixed';
	}
});