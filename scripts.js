function createElement(tag, attributes, ...children) {
	const element = document.createElement(tag);
	for (const key in attributes) {
		if (Object.prototype.hasOwnProperty.call(attributes, key)) {
			element[key] = attributes[key];
		}
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
		element.setAttribute('class', 'loading')
		const loadingText = createElement('p', { className: 'loading' }, 'Sækja gögn...');
		element.appendChild(loadingText);
	} else {
		console.error(`Element with ID '${element}' not found`);
	}
}

function setNotLoading(element) {
	if (element) {
		element.removeAttribute('class')
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
		createElement('h3', { className: 'titill' }, `${product.title || 'vantar nafn vöru'}`),
		createElement('p', { className: 'flokk' }, `${product.category_title || 'vantar nafn á flokki'}`),
		createElement('p', { className: 'verd' }, `${product.price ? formatPrice(product.price) : 'vantar verð'}`),
		p);
	nyja.onclick = () => page(`?category=${product.category_id}&title=${product.category_title}&id=${product.id}`)
	return nyja
}

async function loadDataFromAPI(apiURL, processFunction) {
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
	const nyjar = createElement('a', {},
		'Nýjar vörur')
	nyjar.onclick = () => page('?skoda=nyjar-vorur')
	const flokkar = createElement('a', { href: '?skoda=categories' },
		'Flokkar')
	flokkar.onclick = () => page('?skoda=categories')
	const header = createElement('header', { className: 'main-header' },
		logo,
		createElement('nav', { className: 'site-nav' },
			createElement('ul', {},
				createElement('li', {},
					nyjar
				),
				createElement('li', {},
					flokkar)
			)
		),
		createElement('nav', { className: 'user-nac' },
			createElement('ol', {},
				createElement('li', {},
					createElement('a', {}, 'Nýskrá')
				),
				createElement('li', {},
					createElement('a', {}, 'Innskrá')
				), createElement('li', {},
					createElement('a', {}, 'Karfa')
				)
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
				createElement('h3', {}, `${category.title || 'vantar nafn á flokki'}`)
			);
			categoryDiv.onclick = () => page(`?category=${category.id}&title=${category.title}`);
			categoriesContainer.appendChild(categoryDiv);
		});
		el.appendChild(categoriesContainer)
	});
}

function loadProducts(el, limit) {
	const productsContainer = createElement('ul', {})
	loadDataFromAPI(`${apisida}products${limit}`, data => {
		data.items.forEach(product => productsContainer.appendChild(createProductElement(product)));
		el.appendChild(productsContainer)
	});
}

function loadProductDetails(el, productId) {
	loadDataFromAPI(`${apisida}products/${productId}`, product => {
		el.appendChild(createProductElement(product, true));
	});
}

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