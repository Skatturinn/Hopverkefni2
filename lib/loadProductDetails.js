import { createProductElement } from './create.js';
import { createElement } from './element.js';
import { page } from './page.js';

const apisida = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';

async function loadDataFromAPI(apiURL, processFunction) {
	await fetch(apiURL)
		.then(response => response.json())
		.then(data => {
			processFunction(data);
		})
		.catch(error => {
			console.error('Error', error);
		});
}
export async function loadCategories(el) {
	await loadDataFromAPI(`${apisida}categories`, data => {
		const categoriesContainer = createElement('ul', []);
		data.items.forEach(category => {
			const categoryDiv = createElement('li',
				{ className: 'category' },
				createElement('h3', {}, `${category.title || 'vantar nafn á flokki'}`)
			);
			categoryDiv.onclick = () => page(`?category=${category.id}&title=${category.title}`);
			categoriesContainer.appendChild(categoryDiv);
		});
		el.appendChild(categoriesContainer);
	});
}
export async function loadProducts(el, limit) {
	const productsContainer = createElement('ul', {});
	await loadDataFromAPI(`${apisida}products${limit}`, data => {
		data.items.forEach(product => productsContainer.appendChild(createProductElement(product)));
		el.appendChild(productsContainer);
	});
}
export async function loadProductDetails(el, productId) {
	loadDataFromAPI(`${apisida}products/${productId}`, product => {
		el.appendChild(createProductElement(product, true));
	});
}
