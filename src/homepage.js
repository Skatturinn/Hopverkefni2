export function homepage() {
	window.history.pushState({}, '', '/');
	window.history.go();
}
