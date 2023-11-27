import { createHeader } from './lib/create.js'
import { createElement } from './lib/element.js'
import { loadProductDetails, loadProducts, loadCategories } from './lib/loadProductDetails.js';
import { page, heim } from './lib/page.js'
import { setLoading, setNotLoading } from './lib/setLoading.js';

async function initializePage() {
	const parentElement = document.body;
	createHeader(parentElement);
	const mainEl = parentElement?.appendChild(createElement('main', { id: 'efni' }))
	const efriHluti = createElement('section', { className: 'efri' });
	const nedriHluti = createElement('section', { className: 'nedri' });
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');
	const categoryId = urlParams.get('category');
	const categoryTitle = urlParams.get('title');
	const skoda = urlParams.get('skoda');
	setLoading(mainEl)
	const midja = createElement('div', { className: 'nedri' })
	const botn = createElement('div', { className: 'nedri' })
	if (productId) {
		await loadProductDetails(efriHluti, productId);
		nedriHluti.appendChild(createElement('h2', {}, `Meira úr flokknum ${String(categoryTitle || 'vantar nafn flokks')}`))
		await loadProducts(nedriHluti, `?limit=3&category=${categoryId}`)
	} else if (categoryId) {
		let param = `?category=${categoryId}`;
		if (categoryId === String(0)) {
			param = '';
		}
		efriHluti.appendChild(createElement('h2', {}, `${`${categoryTitle} vörur` || 'Vörur'}`))
		await loadProducts(efriHluti, param);
	} else {
		if (skoda !== 'categories') {
			efriHluti.appendChild(createElement('h2', {}, 'Nýjar vörur'))
			await loadProducts(efriHluti, '?limit=6')
			const takki = createElement('button', {}, 'Skoða allar vörur');
			takki.onclick = () => page('?category=0&title=Allar')
			midja.appendChild(takki) // Þetta er fáranleg aðferð til að laga uppsetninguna á takkanum
		}
		if (skoda !== 'nyjar-vorur') {
			let hluti = nedriHluti
			if (skoda) {
				hluti = efriHluti
			} hluti.appendChild(createElement('h2', {}, 'Skoðaðu vöruflokkana okkar'))
			await loadCategories(hluti)
		}
	}
	if (productId || categoryId || skoda) {
		heim(botn)
	}
	mainEl.appendChild(efriHluti)
	mainEl.appendChild(midja)
	mainEl.appendChild(nedriHluti)
	mainEl.appendChild(botn)
	setNotLoading(mainEl)
}

window.onpopstate = () => {
	window.history.go()
};

initializePage()
