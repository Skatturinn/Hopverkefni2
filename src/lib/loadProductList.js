import { API_URL } from './api.js';

function loadProductList(inntak) {
	const ProductListObject = [];
	const apiURL = `${API_URL}products${inntak}`;
	fetch(apiURL).then(response => {
		if (!response.ok) {
			throw new error(`Netowrk response was not ok: ${response.statusText}`);
		}
		return response.json();
	}).then(data => {
		data.items.forEach(product => {
			ProductListObject.push({
				name: product.name,
				status: product.status,
				mission: product.mission,
				window_start: product.window_start,
				window_end: product.window_end,
				image: product.image,
			});
		});
	});
}
