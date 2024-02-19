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

function renderProductCard(product: Product):DocumentFragment  {
	const catalog_clone = document.importNode(cardtemp.content, true);

	const category = catalog_clone.querySelector('.card__category');
	const title = catalog_clone.querySelector('.card__title');
	const image = catalog_clone.querySelector('.card__image');
	const price = catalog_clone.querySelector('.card__price');

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

	return catalog_clone;
}

cloneTemplate();


const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketContent = basketTemplate.content.cloneNode(true);
const modalContainer = document.getElementById('modal-container');
modalContainer.querySelector('.modal__content').appendChild(basketContent);

const basket_button = document.querySelector('.header__basket');
basket_button.addEventListener("click", function(event) {
	modalContainer.classList.add('modal_active');
});

const closeModalButton = modalContainer.querySelector('.modal__close');
closeModalButton.addEventListener("click", function(event) {
	modalContainer.classList.remove('modal_active');
});
