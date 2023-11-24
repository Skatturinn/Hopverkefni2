import { createElement } from './element.js';

export function page(destination) {
	window.history.pushState({}, '', `/${destination}`);
	window.history.go();
}
export function heim(el) {
	const tilbaka = createElement('button', {}, 'til baka á forsíðu');
	tilbaka.onclick = () => page('');
	el.appendChild(tilbaka);
}

