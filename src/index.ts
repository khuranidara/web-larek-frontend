import './scss/styles.scss';
import { Product } from './types/Product';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductItems } from './types/ProductItems';

const gallery = document.querySelector('.gallery');
const cardtemp = document.querySelector("#card-catalog") as HTMLTemplateElement;
const api = new Api(API_URL);

function cloneTemplate(){

api.get("/product/").then( result => {

	const productItems: ProductItems = result as ProductItems;
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
}


const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;

const basket_button = document.querySelector('.header__basket');
basket_button.addEventListener("click", function(event) {
	modalContent.innerHTML = '';
	const basketContent = basketTemplate.content.cloneNode(true);
	modalContent.appendChild(basketContent);
	modalContainer.classList.add('modal_active');
});

const closeModalButton = modalContainer.querySelector('.modal__close');
closeModalButton.addEventListener("click", function(event) {
	modalContainer.classList.remove('modal_active');
});