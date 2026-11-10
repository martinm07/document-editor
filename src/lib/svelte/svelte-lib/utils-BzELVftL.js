import { Er as e, f as t } from "./runtime-E822YlbE.js";
// node_modules/svelte/src/store/utils.js
function n(n, r, i) {
	if (n == null) return r(void 0), i && i(void 0), e;
	let a = t(() => n.subscribe(r, i));
	return a.unsubscribe ? () => a.unsubscribe() : a;
}
export { n as t };
