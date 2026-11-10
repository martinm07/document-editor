import { t as e } from "./create-subscriber-DINoSkF3.js";
// node_modules/svelte/src/reactivity/reactive-value.js
var t = class {
	#e;
	#t;
	constructor(t, n) {
		this.#e = t, this.#t = e(n);
	}
	get current() {
		return this.#t(), this.#e();
	}
};
export { t };
