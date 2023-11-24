import { createElement } from './element.js';
import { formatPrice } from './formatPrice.js';
import { page } from './page.js';

export function createHeader(parentEL) {
	const logo = createElement('h1',
		{ className: 'logo', },
		'Vefforitunarbúðin');
	logo.onclick = () => page('');
	const nyjar = createElement('a', { href: '?skoda=nyjar-vorur' },
		'Nýjar vörur');
	nyjar.onclick = () => page('?skoda=nyjar-vorur');
	const flokkar = createElement('a', { href: '?skoda=categories' },
		'Flokkar');
	flokkar.onclick = () => page('?skoda=categories');
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
					createElement('a', { href: '/' }, 'Nýskrá')
				),
				createElement('li', {},
					createElement('a', { href: '/' }, 'Innskrá')
				), createElement('li', {},
					createElement('a', { href: '/' }, 'Karfa')
				)
			)
		)
	);
	parentEL.appendChild(header);
}

export function createProductElement(product, check) {
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