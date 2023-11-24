function createElement(tag, attributes, ...children) {
	const element = document.createElement(tag);
	for (const key in attributes) {
		element[key] = attributes[key];
	}
	children.forEach(child => {
		if (typeof child === 'string') {
			element.innerHTML += child;
		} else {
			element.appendChild(child);
		}
	});
	return element;
}

const apisida = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/'

function page(destination) {
	window.history.pushState({}, '', `/${destination}`)
	window.history.go()
}

function heim(el) {
	const tilbaka = createElement('button', {}, 'til baka á forsíðu');
	tilbaka.onclick = () => page('')
	el.appendChild(tilbaka)
}

function setLoading(element) {
	if (element) {
		const loadingText = createElement('p', { className: 'loading' }, 'Sækja gögn...');
		element.appendChild(loadingText);
	} else {
		console.error(`Element with ID '${element}' not found`);
	}
}

function setNotLoading(element) {
	if (element) {
		const loadingElements = element.getElementsByClassName('loading');
		while (loadingElements.length > 0) {
			loadingElements[0].parentNode.removeChild(loadingElements[0]);
		}
	}
}

function formatPrice(price) {
	const formatter = new Intl.NumberFormat('is-IS', {
		style: 'currency',
		currency: 'ISK',
	});

	return formatter.format(price);
}

function createProductElement(product, check) {
	let vara = 'product';
	const p = createElement('p', {})
	if (check) {
		p.textContent = product.description
		vara = 'product-detail'
	}
	const nyja = createElement('li', { className: vara },
		createElement('img', { src: product.image, alt: 'mynd af vöru' }),
		createElement('h3', { className: 'titill' }, `${product.title ? product.title : 'vantar nafn vöru'}`),
		createElement('p', {}, `${product.category_title}`),
		createElement('p', { className: 'verd' }, `${product.price ? formatPrice(product.price) : 'vantar verð'}`),
		p);
	nyja.onclick = () => page(`?id=${product.id}`)
	return nyja
}

function loadDataFromAPI(apiURL, processFunction) {
	fetch(apiURL)
		.then(response => response.json())
		.then(data => {
			processFunction(data);
		})
		.catch(error => {
			console.error('Error', error);
		});
}


function createHeader(parentEL) {
	const logo = createElement('h1',
		{ className: 'logo', },
		'Vefforitunarbúðin');
	logo.onclick = () => page('')
	const header = createElement('header', { className: 'main-header' },
		logo,
		createElement('nav', { className: 'main-nav' },
			createElement('ul', {},
				createElement('li', {},
					createElement('a', { href: '#new-products' },
						'Nýjar vörur')),
				createElement('li', {},
					createElement('a', { href: '#categories' },
						'Flokkar'))
			)
		)
	);
	parentEL.appendChild(header);
}

function loadCategories(el) {
	loadDataFromAPI(`${apisida}categories`, data => {
		const categoriesContainer = createElement('ul', []);
		data.items.forEach(category => {
			const categoryDiv = createElement('li',
				{ className: 'category' },
				createElement('h3', {}, `${category.title ? category.title : 'vantar nafn á flokki'}`)
			);
			// categoryDiv.addEventListener('click', page(`/categories?id=${category.id}`))
			categoryDiv.onclick = () => page(`?category=${category.id}`);
			categoriesContainer.appendChild(categoryDiv);
		});
		el.appendChild(categoriesContainer)
	});
}

function loadProducts(el, limit, bin) {
	const productsContainer = createElement('ul', {})
	loadDataFromAPI(`${apisida}products${limit}`, data => {
		data.items.forEach(product => productsContainer.appendChild(createProductElement(product)));
		el.appendChild(productsContainer)
	});
	if (bin) {
		heim(el)
	}
}

function loadProductDetails(el, productId) {
	loadDataFromAPI(`${apisida}products/${productId}`, product => {
		el.appendChild(createProductElement(product, true));
	});
}

function initializePage() {
	const parentElement = document.body;
	createHeader(parentElement);
	const mainEl = parentElement?.appendChild(createElement('main', {}))
	const efriHluti = createElement('section', { className: 'efri' });
	const nedriHluti = createElement('section', { className: 'neðri' });
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');
	const categoryId = urlParams.get('category');
	setLoading(mainEl)
	const midja = createElement('div', {})
	if (productId) {
		loadProductDetails(efriHluti, productId);
		loadProducts(nedriHluti, `?limit=3&category=${categoryId}`, true)
	} else if (categoryId) {
		let param = `?category=${categoryId}`;
		if (categoryId === String(0)) {
			param = '';
		}
		loadProducts(efriHluti, param, true);
	} else {
		efriHluti.appendChild(createElement('h2', {}, 'Nýjar vörur'))
		loadProducts(efriHluti, '?limit=6')
		const takki = createElement('button', {}, 'Skoða alla vörur');
		takki.onclick = () => page('?category=0')
		midja.appendChild(takki) // Þetta er fáranleg aðferð til að laga uppsetninguna á takkanum
		nedriHluti.appendChild(createElement('h2', {}, 'Skoðaðu vöruflokkana okkar'))
		loadCategories(nedriHluti)
	}
	if (productId && categoryId) {
		heim(nedriHluti)
	}
	setNotLoading(mainEl)
	mainEl.appendChild(efriHluti)
	mainEl.appendChild(midja)
	mainEl.appendChild(nedriHluti)
}

window.onpopstate = () => {
	window.history.go()
};

document.addEventListener('DOMContentLoaded', initializePage);