import { el } from './elements.js';

/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {HTMLElement} parentElement Element sem á að birta skilbaoð í.
 * @param {Element | undefined} searchForm Leitarform sem á að gera óvirkt.
 */
export function setLoading(parentElement, searchForm = undefined) {
	let loadingElement = parentElement.querySelector('.loading');
	let body = parentElement.parentElement;
	if (!body) {
		body = parentElement;
	}
	body.classList.add('loading');
	if (!loadingElement) {
		loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
		parentElement.appendChild(loadingElement);
	}
	if (!searchForm) {
		return;
	}
	const button = searchForm.querySelector('button');
	if (button) {
		button.setAttribute('disabled', 'disabled');
	}
}
/**
 * Fjarlægir „loading state“.
 * @param {HTMLElement} parentElement Element sem inniheldur skilaboð.
 * @param {Element | undefined} searchForm Leitarform sem á að gera virkt.
 */
export function setNotLoading(parentElement, searchForm = undefined) {
	const loadingElement = parentElement.querySelector('.loading');
	let body = parentElement.parentElement;
	if (!body) {
		body = parentElement;
	}
	body.classList.remove('loading');
	if (loadingElement) {
		loadingElement.remove();
	}
	if (!searchForm) {
		return;
	}
	const disabledButton = searchForm.querySelector('button[disabled]');
	if (disabledButton) {
		disabledButton.removeAttribute('disabled');
	}
}
