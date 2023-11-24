export function createElement(tag, attributes, ...children) {
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