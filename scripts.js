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

  function setLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const loadingText = createElement('p', { className: 'loading', style: 'cursor: wait;' }, 'Sækja gögn...');
      element.appendChild(loadingText);
    } else {
      console.error(`Element with ID '${elementId}' not found`);
    }
  }

  function setNotLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const loadingElements = element.getElementsByClassName('loading');
      while (loadingElements.length > 0) {
        loadingElements[0].parentNode.removeChild(loadingElements[0]);
      }
    }
  }
  
  function createProductElement(product) {
    return createElement('div', { className: 'product' },
      `<a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.price} kr.</p>
          <p>${product.category_title}</p>
      </a>`
    );
  }
  
  function loadDataFromAPI(apiURL, processFunction, elementId) {
    const element = document.getElementById(elementId);
    setLoading(element);
  
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        setNotLoading(element);
        processFunction(data);
      })
      .catch(error => {
        setNotLoading(element);
        console.error('Error', error);
      });
  }

  function createHeader() {
    const header = createElement('header', { className: 'main-header' },
      createElement('h1', { className: 'logo', style: 'cursor: pointer;' }, 'Vefforitunarbúðin'),
      createElement('nav', { className: 'main-nav' },
        createElement('ul', {},
          createElement('li', {}, createElement('a', { href: '#new-products' }, 'Nýjar vörur')),
          createElement('li', {}, createElement('a', { href: '#categories' }, 'Flokkar'))
        )
      )
    );
    document.body.prepend(header);
    document.querySelector('.logo').addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  function loadCategories() {
    loadDataFromAPI('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/categories', data => {
      const categoriesContainer = document.getElementById('categories');
      data.items.forEach(category => {
        const categoryDiv = createElement('div', { className: 'category', style: 'cursor: pointer;' },
          `<h3>${category.title}</h3>`
        );
        categoryDiv.onclick = () => window.location.href = `products.html?category=${category.id}`;
        categoriesContainer.appendChild(categoryDiv);
      });
    });
  }
  
  function loadNewProducts() {
    loadDataFromAPI('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6', data => {
      const productsContainer = document.getElementById('new-products');
      data.items.forEach(product => productsContainer.appendChild(createProductElement(product)));
    });
  }
  
  function loadProductList() {
    loadDataFromAPI('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products', data => {
      const productListContainer = document.getElementById('product-list');
      data.items.forEach(product => productListContainer.appendChild(createProductElement(product)));
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
  
  function loadRelatedProducts(categoryId) {
    loadDataFromAPI(`https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=3&category=${categoryId}`, data => {
      const relatedProductsContainer = document.getElementById('related-products');
      data.items.forEach(product => relatedProductsContainer.appendChild(createProductElement(product)));
    });
  }
  
  function initializePage() {
    createHeader();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const categoryId = urlParams.get('category');
  
    if (window.location.pathname.includes('product.html') && productId) {
      loadProductDetails(productId);
    } else if (window.location.pathname.includes('products.html') && categoryId) {
      loadProductsByCategory(categoryId);
    } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      loadNewProducts();
      loadCategories()
    } else if (window.location.pathname.includes('vorulisti.html')) {
      loadProductList();
    }
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
  
  document.addEventListener('DOMContentLoaded', initializePage);