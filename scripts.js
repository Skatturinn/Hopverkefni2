function createProductElement(product) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.innerHTML = `
      <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.price} kr.</p>
          <p>${product.category_title}</p>
      </a>
  `;
  return productDiv;
}

function loadCategories() {
  const apiURL = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/categories';
  fetch(apiURL)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Error ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('API response:', data);

          const categoriesArray = data.items || data;
          if (!Array.isArray(categoriesArray)) {
              throw new Error('Expected an array of categories');
          }

          const categoriesContainer = document.getElementById('categories');
          categoriesArray.forEach(category => {
              const categoryDiv = document.createElement('div');
              categoryDiv.className = 'category';
              categoryDiv.innerHTML = `<h3>${category.title}</h3>`;

              categoryDiv.onclick = function() {
                  window.location.href = `products.html?category=${category.id}`;
              };

              categoriesContainer.appendChild(categoryDiv);
          });
      })
      .catch(error => {
          console.error('Error', error);
      });
}

function loadProductsByCategory(categoryId) {
  const apiURL = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?category=${categoryId}`;
  fetch(apiURL)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Error ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => {
          const productsArray = data.items || data;
          const productsContainer = document.getElementById('products');

          productsContainer.innerHTML = '';

          productsArray.forEach(product => {
              const productDiv = document.createElement('div');
              productDiv.className = 'product';
              productDiv.innerHTML = `
                  <img src="${product.image}" alt="${product.title}">
                  <h3>${product.title}</h3>
                  <p>${product.price}</p>
                  <p>${product.category_title}</p>
              `;
              productsContainer.appendChild(productDiv);
          });
      })
      .catch(error => {
          console.error('Error', error);
      });
}

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');
  if (categoryId) {
      loadProductsByCategory(categoryId);
  }
});


function loadNewProducts() {
  const apiURL = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6';
  fetch(apiURL)
      .then(response => {
          if (!response.ok) {
              throw new Error('Error ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          const products = data.items;
          const productsContainer = document.getElementById('new-products');
          products.forEach(product => {
              const productDiv = createProductElement(product);
              productsContainer.appendChild(productDiv);
              productDiv.onclick = function() {
                  window.location.href = `product.html?id=${product.id}`;
              };

              productsContainer.appendChild(productDiv);
          });
      })
      .catch(error => {
          console.error('Error', error);
      });
}

/*vörulisti*/
function loadProductList() {
  const apiURL = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
  fetch(apiURL)
      .then(response => response.json())
          .then(data => {
              const productListContainer = document.getElementById('product-list');
              productListContainer.innerHTML = '';

              data.items.forEach(product => {
                productListContainer.innerHTML += `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>${product.price}</p>
                    <p>${product.category_title}</p>
                `;
            });

      })
      .catch(error => {
          console.error('Error', error);
      });
}


/*vörusíða*/
function loadProductDetails(productId) {
  

  const apiURL = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products/${productId}`;
  fetch(apiURL)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Error ${response.status}`);
          }
          return response.json();
      })
      .then(product => {
          const productDetailsContainer = document.getElementById('product-details');
          if (!productDetailsContainer) {
              console.error('vara fannst ekki');
              return;
          }
          productDetailsContainer.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p>${product.price}</p>
              <p>${product.category_title}</p>
              <p>${product.description}</p>
          `;

          if (product.category_id) {
              loadRelatedProducts(product.category_id);
          }
      })
      .catch(error => {
          console.error('Error', error);
      });

      if (product.category_id) {
        loadRelatedProducts(product.category_id);
      }

  }


  function loadRelatedProducts(categoryId) {
    const apiURL = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=3&category=${categoryId}`;
  
    fetch(apiURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const products = Array.isArray(data) ? data : data.items;
        if (!Array.isArray(products)) {
          throw new Error('Error');
        }
  
        const productsContainer = document.getElementById('related-products'); 
        productsContainer.innerHTML = ''; 
  
        products.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.className = 'product';
          productDiv.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p>${product.price}</p>
              <p>${product.category_title}</p>
              <p>${product.description}</p>
          `;
          productsContainer.appendChild(productDiv);
        });
      })
      .catch(error => {
        console.error('Error', error);
      });
  }


function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function createHeader() {
  const header = el('header', { class: 'main-header' },
    el('h1', { class: 'logo' }, 'Vefforitunarbúðin'),
    el('nav', { class: 'main-nav' },
      el('ul', {},
        el('li', {}, el('a', { href: '#new-products' }, 'Nýjar vörur')),
        el('li', {}, el('a', { href: '#categories' }, 'Flokkar')),
      )
    )
  );

  document.body.prepend(header);
  document.querySelector('.logo').addEventListener('click', () => {
    window.location.href = '/';
  });
}

function el(tag, attrs, ...children) {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  return element;
}

function determinePage() {
  const productId = getQueryParam('id');
  createHeader();

  if (window.location.pathname.includes('vorulisti.html')) {
      loadProductList();
  } else if (window.location.pathname.includes('product.html') && productId) {
      loadProductDetails(productId);
      loadRelatedProducts(productId);
  } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      loadNewProducts();
      loadCategories();
  } else if (window.location.pathname.includes('products.html') && categoryId) {
      loadProductsByCategory(categoryId);
  }
}

document.addEventListener('DOMContentLoaded', determinePage);