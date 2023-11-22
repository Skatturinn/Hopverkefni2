// scripts.js
import { renderPage, renderDetails, } from './lib/ui.js';
import { el, empty } from './lib/aukafoll.js';

document.addEventListener('DOMContentLoaded', () => {
    createHeader();
    route(); // Initial route to load the appropriate content on page load
  });
  
  window.onpopstate = () => {
    route(); // Reroute on browser navigation
  };
  
  function route() {
    const qs = new URLSearchParams(window.location.search);
    const id = qs.get('id');
    const category = qs.get('category');
    const contentElement = document.getElementById('content');

    if (id) {
        loadProductDetails(id, contentElement);
      } else if (category) {
        loadCategoryProducts(category, contentElement);
      } else {
        loadFrontPage(contentElement);
      }
  
    // if(id) {
      // Product details view
     // renderDetails(contentElement, id);
    //} else if (category) {
      // Category view
      //renderPage('category', contentElement); // Here 'category' is the type used in your switch case in ui.js
    //} else {
      // Frontpage view
      //renderPage('frontpage', contentElement); // 'frontpage' is the type for the front page
    //}
  }

  function loadFrontPage(parentElement) {
    renderPage('frontpage', parentElement);
    loadCategories();
    loadNewProducts();
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

function loadProductDetails(productId, parentElement) {
    renderDetails(parentElement, productId);
    // Load related products etc.
  }
  
  function loadCategoryProducts(categoryId, parentElement) {
    // Fetch and display products for a specific category
    // Similar to how you handle this in renderPage
  }
  
  // Rest of your existing code
  // ...
  
  window.onpopstate = route;

  function onSearch(query) {
    navigate(`/?query=${encodeURIComponent(query)}`);
  }
