import { Product } from '../types/Product';
import { IProductsService } from '../interfaces/IProductsService';
import { ProductItems } from '../types/ProductItems';
import { Api } from '../components/base/api';
import { API_URL } from '../utils/constants';


const api = new Api(API_URL);
const cardtemp = document.querySelector('#card-catalog') as HTMLTemplateElement;
let productItems: ProductItems = {} as ProductItems;

export class ProductsService implements IProductsService{

	async getProductItems(): Promise<ProductItems> {
		return Promise.resolve(api.get('/product/').then(result => {
			return productItems = result as ProductItems;
		}));
    }

    getProductById(id: string): Product {
			return productItems.items.find(product => product.id == id);
    }
    renderProductCard(product: Product): DocumentFragment {

			const catalog_clone = document.importNode(cardtemp.content, true);

			const category = catalog_clone.querySelector('.card__category');
			const title = catalog_clone.querySelector('.card__title');
			const image = catalog_clone.querySelector('.card__image');
			const price = catalog_clone.querySelector('.card__price');

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


			return catalog_clone;
    }
}