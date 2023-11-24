import { createHeader } from './create.js'
import { createElement } from './element.js'
import { loadProductDetails, loadProducts, loadCategories } from './loadProductDetails.js';
import { page, heim } from './page.js'
import { setLoading, setNotLoading } from './setLoading.js';

function initializePage() {
	const parentElement = document.body;
	createHeader(parentElement);
	const mainEl = parentElement?.appendChild(createElement('main', { id: 'efni' }))
	const efriHluti = createElement('section', { className: 'efri' });
	const nedriHluti = createElement('section', { className: 'neðri' });
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');
	const categoryId = urlParams.get('category');
	const categoryTitle = urlParams.get('title');
	const skoda = urlParams.get('skoda');
	setLoading(mainEl)
	const midja = createElement('div', {})
	if (productId) {
		loadProductDetails(efriHluti, productId);
		nedriHluti.appendChild(createElement('h2', {}, `Meira úr flokknum ${String(categoryTitle || 'vantar nafn flokks')}`))
		loadProducts(nedriHluti, `?limit=3&category=${categoryId}`)
	} else if (categoryId) {
		let param = `?category=${categoryId}`;
		if (categoryId === String(0)) {
			param = '';
		}
		efriHluti.appendChild(createElement('h2', {}, `${`${categoryTitle} vörur` || 'Vörur'}`))
		loadProducts(efriHluti, param);
	} else if (window.location.pathname === '/') {
		if (skoda !== 'categories') {
			efriHluti.appendChild(createElement('h2', {}, 'Nýjar vörur'))
			loadProducts(efriHluti, '?limit=6')
			const takki = createElement('button', {}, 'Skoða allar vörur');
			takki.onclick = () => page('?category=0&title=Allar')
			midja.appendChild(takki) // Þetta er fáranleg aðferð til að laga uppsetninguna á takkanum
		}
		if (skoda !== 'nyjar-vorur') {
			let hluti = nedriHluti
			if (skoda) {
				hluti = efriHluti
			} hluti.appendChild(createElement('h2', {}, 'Skoðaðu vöruflokkana okkar'))
			loadCategories(hluti)
		}
	}
	if (productId || categoryId || skoda) {
		heim(nedriHluti)
	}
	mainEl.appendChild(efriHluti)
	mainEl.appendChild(midja)
	mainEl.appendChild(nedriHluti)
	setNotLoading(mainEl)
}

window.onpopstate = () => {
	window.history.go()
};

initializePage()