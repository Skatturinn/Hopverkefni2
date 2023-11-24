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

function page(destination) {
	window.history.pushState({}, '', `/${destination}`)
	window.history.go()
}

function setLoading(element) {
	if (element) {
		const loadingText = createElement('p', { className: 'loading', style: 'cursor: wait;' }, 'Sækja gögn...');
		element.appendChild(loadingText);
	} else {
		// console.error(`Element with ID '${elementId}' not found`);
		console.error('Element not found');
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
function createProductElement(product) {
	// 	const gamla = createElement('div', { className: 'product' },
	// 		`<a href="product.html?id=${product.id}">
	// 	  <img src="${product.image}" alt="${product.title}">
	// 	  <h3>${product.title}</h3>
	// 	  <p>${product.price} kr.</p>
	// 	  <p>${product.category_title}</p>
	//   </a>`); window.history.pushState({}, '', `/products?=${product.id}`)
	const nyja = createElement('li', { className: 'product' },
		createElement('img', { src: product.image, alt: 'mynd af vöru' }),
		createElement('h3', { className: 'titill' }, 
			`${product.title ? product.title : 'vantar nafn vöru'}`),
		createElement('p', { className: 'verd' }, 
			`${product.price ? formatPrice(product.price) : 'vantar verð'}`),
		createElement('p', { className: 'vorulysing' }));
	// categoryDiv.onclick = () => page(`?category=${category.id}`);
	nyja.onclick = () => page(`?id=${product.id}`)
	return nyja
}

function loadDataFromAPI(apiURL, processFunction) {
	fetch(apiURL)
		.then(response => response.json())
		.then(data => {
			processFunction(data);
			setNotLoading();
		})
		.catch(error => {
			console.error('Error', error);
			setNotLoading();
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
	// appendchild
	parentEL.appendChild(header);
}

function loadCategories() {
	loadDataFromAPI('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/categories', data => {
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
		return categoriesContainer
	});
}

function loadProducts(limit) {
	loadDataFromAPI(`https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products${limit}`, data => {
		// const productsContainer = document.getElementById('new-products'); gamla
		const productsContainer = createElement('ul', {})
		data.items.forEach(product => productsContainer.appendChild(createProductElement(product)));
		return productsContainer
	});
}

function loadRelatedProducts(categoryId) {
	loadDataFromAPI(`https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=3&category=${categoryId}`, data => {
		const relatedProductsContainer = document.getElementById('related-products');
		data.items.forEach(product => relatedProductsContainer.appendChild(createProductElement(product)));
	});
}

function loadProductDetails(productId) {
	loadDataFromAPI(`https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products/${productId}`, product => {
		const productDetailsContainer = document.getElementById('product-details');
		productDetailsContainer.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.price} kr.</p>
          <p>${product.category_title}</p>
          <p>${product.description}</p>
      `;
		loadRelatedProducts(product.category_id);
	});
	
}

function loadProductsByCategory(categoryId) {
	const apiURL = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?category=${categoryId}`;
	loadDataFromAPI(apiURL, data => {
		const productsContainer = document.getElementById('products');
		productsContainer.innerHTML = '';
		data.items.forEach(product => {
			productsContainer.appendChild(createProductElement(product));
		});
	});
}

function initializePage() {
	const parentElement = document.body;
	createHeader(parentElement);
	const mainEl = parentElement?.appendChild(createElement('main', {}))
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');
	const categoryId = urlParams.get('category');
	setLoading(mainEl)
	if (productId) {
		loadProductDetails(productId);
	} else if (categoryId) {
		loadProductsByCategory(categoryId);
	} else if (window.location.pathname === '/') {
		loadProducts('?limit=6');
		loadCategories()
	} else if (window.location.pathname.includes('vorulisti.html')) {
		loadProducts();
	}
}

window.onpopstate = () => {
	window.history.go()
	// swindow.location.reload()
};
document.addEventListener('DOMContentLoaded', initializePage);