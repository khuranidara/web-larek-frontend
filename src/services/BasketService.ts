import { IBasketService } from '../interfaces/IBasketService';
import { ensureElement } from '../utils/utils';
import { Api } from '../components/base/api';
import { API_URL } from '../utils/constants';
import { OrderData } from '../types/OrderData';
import { IProductsService } from '../interfaces/IProductsService';

const api = new Api(API_URL);

const orderData: OrderData = {
	payment: 'online',
	email: '',
	phone: '',
	address: '',
	total: 0,
	items: [] as string[],
};

const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate: HTMLTemplateElement = document.getElementById('contacts') as HTMLTemplateElement;


export class BasketService implements IBasketService{
    updateTotal(productsService: IProductsService): void {
			orderData.total = 0;
			for (let i = 0; i < orderData.items.length; i++) {
				const productId = orderData.items[i];
				const product = productsService.getProductById(productId);
				if (product.price !== null) {
					orderData.total += product.price;
				} else {
					orderData.total += 0;
				}
			}
    }

     getOrderData(): OrderData {
        return orderData;
     }
     addToBasket(productId: string): boolean {
			 if (!orderData.items.includes(productId)) {
				 orderData.items.push(productId);
				 return true;
			 }

			 return false;
     }

	removeFromBasket(productId: string): boolean {
		if(orderData.items.includes(productId)){
			const itemIndex = orderData.items.indexOf(productId);
			orderData.items.splice(itemIndex, 1);
			return true;
		}
		return false;
	}


	 renderBasket(productsService: IProductsService):void {
		const basketList = document.querySelector('.basket__list');
		while (basketList.firstChild) {
			basketList.removeChild(basketList.firstChild);
		}

		for (let i = 0; i < orderData.items.length; i++) {
			const productId = orderData.items[i];
			const product = productsService.getProductById(productId);
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
			} else {
				price.textContent = 'Бесценно';
			}

			deleteButton.addEventListener('click', () => {
				if(this.removeFromBasket(productId)){
					this.updateTotal(productsService);
					this.renderBasket(productsService);
					document.dispatchEvent(new CustomEvent('basketUpdated'));
				}
			});

			basketList.appendChild(basketItem);
		}

		const totalPriceElement = document.querySelector('.basket__price');
		totalPriceElement.textContent = `${orderData.total} синапсов`;
		const checkoutButton = modalContent.querySelector('.basket__button') as HTMLButtonElement;
		if (orderData.items.length === 0) {
			checkoutButton.disabled = true;
		}
		checkoutButton.addEventListener('click', function() {
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
							descriptionElement.textContent = `Списано ${orderData.total} синапсов`;
						}
						const closeModalButton = modalContent.querySelector('.order-success__close');
						closeModalButton.addEventListener('click', function(event) {
							modalContainer.classList.remove('modal_active');
							modalContainer.style.position = 'fixed';
						});
						orderData.items = [];
						document.dispatchEvent(new CustomEvent('basketUpdated'));
						orderData.total = 0;
					});
				});
			});
		});
	}
}
