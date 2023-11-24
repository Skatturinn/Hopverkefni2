import { createElement } from './element.js';

export function setLoading(element) {
	if (element) {
		element.setAttribute('class', 'loading');
		const loadingText = createElement('p', { className: 'loading' }, 'Sækja gögn...');
		element.appendChild(loadingText);
	} else {
		console.error(`Element with ID '${element}' not found`);
	}
}
export function setNotLoading(element) {
	if (element) {
		element.removeAttribute('class');
		const loadingElements = element.getElementsByClassName('loading');
		while (loadingElements.length > 0) {
			loadingElements[0].parentNode.removeChild(loadingElements[0]);
		}
	}
}
