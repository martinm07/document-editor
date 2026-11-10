import { $n as e, Bn as t, Cr as n, Er as r, G as i, Gn as a, Gt as o, H as s, Hn as c, I as l, J as u, K as d, Kn as f, Ln as p, Mn as ee, O as te, On as ne, Q as re, R as m, Rn as h, Sn as ie, U as ae, Ut as oe, Vn as se, W as g, Wn as _, Wt as ce, X as v, Xn as le, Y as ue, Yn as de, Z as y, _ as b, _t as x, a as S, an as C, ar as w, b as T, c as E, cr as fe, ct as pe, dt as me, er as he, et as ge, ft as _e, g as ve, gr as ye, gt as be, k as D, l as O, lt as xe, mr as Se, n as Ce, nn as we, or as k, pr as A, qt as j, rn as Te, t as M, tn as Ee, v as De, yn as Oe, yt as ke } from "./runtime-E822YlbE.js";
import { c as N, i as P, s as F } from "./constants-BYz4oKkd.js";
import { d as Ae, p as je, y as Me } from "./warnings-b11YuAde.js";
import { t as Ne } from "./flags-BPZQ2-TS.js";
import { d as Pe } from "./utils-CnzbyS0T.js";
import { c as I, s as L, t as Fe, u as R } from "./events-D5E3B28u.js";
import { t as Ie } from "./create-subscriber-DINoSkF3.js";
// node_modules/svelte/src/internal/client/dom/reconciler.js
var Le = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function z(e) {
	return Le?.createHTML(e) ?? e;
}
function B(e) {
	var t = g("template");
	return t.innerHTML = z(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/svelte/src/internal/client/dom/template.js
var Re = w ? "template" : "TEMPLATE", ze = w ? "script" : "SCRIPT";
function V(e, t) {
	var n = M;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Be(e, n) {
	var r = !!(n & 1), i = !!(n & 2), a, o = !e.startsWith("<!>");
	return () => {
		if (t) return V(h, null), h;
		a === void 0 && (a = B(o ? e : "<!>" + e), r || (a = /* @__PURE__ */ u(a)));
		var n = i || y ? document.importNode(a, !0) : a.cloneNode(!0);
		if (r) {
			var s = /* @__PURE__ */ u(n), c = n.lastChild;
			V(s, c);
		} else V(n, n);
		return n;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, n, r = "svg") {
	var i = !e.startsWith("<!>"), a = !!(n & 1), o = `<${r}>${i ? e : "<!>" + e}</${r}>`, s;
	return () => {
		if (t) return V(h, null), h;
		if (!s) {
			var e = B(o), n = /* @__PURE__ */ u(e);
			if (a) for (s = document.createDocumentFragment(); /* @__PURE__ */ u(n);) s.appendChild(/* @__PURE__ */ u(n));
			else s = /* @__PURE__ */ u(n);
		}
		var r = s.cloneNode(!0);
		if (a) {
			var i = /* @__PURE__ */ u(r), c = r.lastChild;
			V(i, c);
		} else V(r, r);
		return r;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ve(e, t) {
	return /* @__PURE__ */ H(e, t, "svg");
}
/*#__NO_SIDE_EFFECTS__*/
function He(e, t) {
	return /* @__PURE__ */ H(e, t, "math");
}
function U(e, t) {
	var n = i();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(d(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(ae(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, i, ...s] = r, c = e === "svg" ? N : e === "math" ? F : t;
		var a = g(e, c, i?.is);
		for (var o in i) ge(a, o, i[o]);
		s.length > 0 && (a.nodeName === Re ? a.content : a).append(U(s, a.nodeName === "foreignObject" ? void 0 : c)), n.append(a);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ue(e, n) {
	var r = !!(n & 1), i = !!(n & 2), a;
	return () => {
		if (t) return V(h, null), h;
		a === void 0 && (a = U(e, n & 4 ? N : n & 8 ? F : void 0), r || (a = /* @__PURE__ */ u(a)));
		var o = i || y ? document.importNode(a, !0) : a.cloneNode(!0);
		if (r) {
			var s = /* @__PURE__ */ u(o), c = o.lastChild;
			V(s, c);
		} else V(o, o);
		return o;
	};
}
function We(e) {
	return () => Ge(e());
}
function Ge(e) {
	if (t) return e;
	let n = e.nodeType === 11, r = e.nodeName === ze ? [e] : e.querySelectorAll("script"), i = M;
	for (let t of r) {
		let r = g("script");
		for (var a of t.attributes) r.setAttribute(a.name, a.value);
		r.textContent = t.textContent, (n ? e.firstChild === t : e === t) && (i.nodes.start = r), (n ? e.lastChild === t : e === t) && (i.nodes.end = r), t.replaceWith(r);
	}
	return e;
}
function Ke(e = "") {
	if (!t) {
		var n = d(e + "");
		return V(n, n), n;
	}
	var r = h;
	return r.nodeType === 3 ? re(r) : (r.before(r = d()), _(r)), V(r, r), r;
}
function qe() {
	if (t) return V(h, null), h;
	var e = document.createDocumentFragment(), n = document.createComment(""), r = d();
	return e.append(n, r), V(n, r), e;
}
function Je(e, n) {
	if (t) {
		var r = M;
		r.f & 32768 && r.nodes.end !== null || (r.nodes.end = h), p();
	} else e !== null && e.before(n);
}
function Ye() {
	if (t && h && h.nodeType === 8 && h.textContent?.startsWith("$")) {
		let e = h.textContent.substring(1);
		return p(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Xe = he | e;
function W(e, t, n, r) {
	new Ze(e, t, n, r);
}
var Ze = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = t ? h : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Ie(() => (this.#m = _e(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, n, r, i) {
		this.#e = e, this.#n = n, this.#r = (e) => {
			var t = M;
			t.b = this, t.f |= 128, r(e);
		}, this.parent = M.b, this.transform_error = i ?? this.parent?.transform_error ?? ((e) => e), this.#i = ve(() => {
			if (t) {
				let e = c(this.#t);
				p();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Xe), t && (this.#e = h);
	}
	#g() {
		try {
			this.#a = b(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		o(r), t && (this.#s = b(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? Me() : (t = !0, n && ne(), this.#s !== null && D(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					m(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (de | le)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = b(() => e(this.#e)), o(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = d(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return b(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							m(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(x)) : this.#u === 0 && (this.#e.before(e), this.#c = null, D(this.#o, () => {
					this.#o = null;
				}), this.#S(x));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = b(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				te(this.#a, e);
				let t = this.#n.pending;
				this.#o = b(() => t(this.#e));
			} else this.#S(x);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		oe(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = M, n = Ce, r = j;
		E(this.#i), O(this.#i), C(this.#i.ctx);
		try {
			return be.ensure(), e();
		} finally {
			E(t), O(n), C(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && D(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, o(() => {
			this.#d = !1, this.#m && pe(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), S(this.#m);
	}
	error(e) {
		if (e === P || !this.#n.onerror && !this.#n.failed) throw e;
		x?.is_fork ? (this.#a && x.skip_effect(this.#a), this.#o && x.skip_effect(this.#o), this.#s && x.skip_effect(this.#s), x.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (T(this.#a), null), this.#o &&= (T(this.#o), null), this.#s &&= (T(this.#s), null), t && (_(this.#t), se(), _(f()));
		let n = this.#n.failed, r = (e) => {
			if (this.#y()) return;
			let { reset: t, invoke_onerror: r } = this.#v(e);
			r(), n && !this.#y() && (this.#s = this.#C(() => {
				try {
					return b(() => {
						var r = M;
						r.b = this, r.f |= 128, n(this.#e, () => e, () => t);
					});
				} catch (e) {
					return m(e, this.#i.parent), null;
				}
			}));
		};
		o(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					m(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(r, (e) => m(e, this.#i && this.#i.parent)) : r(t);
			}
		});
	}
};
function Qe() {
	M === null && Oe();
	var e = M.b;
	return e === null ? 0 : e.get_effect_pending();
}
// node_modules/svelte/src/internal/client/render.js
var G = !0;
function $e(e) {
	G = e;
}
function et(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[A] ??= e.nodeValue) && (e[A] = n, e.nodeValue = `${n}`);
}
function K(e, t) {
	return Y(e, t);
}
function q(e, n) {
	v(), n.intro = n.intro ?? !1;
	let r = n.target, i = t, o = h;
	try {
		for (var c = /* @__PURE__ */ u(r); c && (c.nodeType !== 8 || c.data !== "[");) c = /* @__PURE__ */ ue(c);
		if (!c) throw P;
		a(!0), _(c);
		let t = Y(e, {
			...n,
			anchor: c
		});
		return a(!1), t;
	} catch (t) {
		if (t instanceof Error && t.message.split("\n").some((e) => e.startsWith("https://svelte.dev/e/"))) throw t;
		return t !== P && console.warn("Failed to hydrate: ", t), n.recover === !1 && ie(), v(), s(r), a(!1), K(e, n);
	} finally {
		a(i), _(o);
	}
}
var J = /* @__PURE__ */ new Map();
function Y(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	v();
	var l = void 0, u = De(() => {
		var u = r ?? n.appendChild(d());
		W(u, { pending: () => {} }, (n) => {
			Te({});
			var r = j;
			if (o && (r.c = o), a && (i.$$events = a), t && V(n, null), G = s, l = e(n, i) || Ee(), G = !0, t && (M.nodes.end = h, h === null || h.nodeType !== 8 || h.data !== "]")) throw Ae(), P;
			we();
		}, c);
		var f = /* @__PURE__ */ new Set(), p = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!f.has(r)) {
					f.add(r);
					var i = Pe(r);
					for (let e of [n, document]) {
						var a = J.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), J.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, L, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return p(Se(Fe)), R.add(p), () => {
			for (var e of f) for (let r of [n, document]) {
				var t = J.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, L), t.delete(e), t.size === 0 && J.delete(r)) : t.set(e, i);
			}
			R.delete(p), u !== r && u.parentNode?.removeChild(u);
		};
	});
	return X.set(l, u), l;
}
var X = /* @__PURE__ */ new WeakMap();
function Z(e, t) {
	let n = X.get(e);
	return n ? (X.delete(e), n(t)) : Promise.resolve();
}
// node_modules/svelte/src/internal/client/dom/legacy/event-modifiers.js
function tt(e) {
	return function(...t) {
		t[0].isTrusted && e?.apply(this, t);
	};
}
function nt(e) {
	return function(...t) {
		t[0].target === this && e?.apply(this, t);
	};
}
function rt(e) {
	return function(...t) {
		return t[0].stopPropagation(), e?.apply(this, t);
	};
}
function it(e) {
	var t = !1;
	return function(...n) {
		if (!t) return t = !0, e?.apply(this, n);
	};
}
function at(e) {
	return function(...t) {
		return t[0].stopImmediatePropagation(), e?.apply(this, t);
	};
}
function Q(e) {
	return function(...t) {
		return t[0].preventDefault(), e?.apply(this, t);
	};
}
function ot(e, [t, n]) {
	l(() => I(e, t, n() ?? r, { passive: !0 }));
}
function st(e, [t, n]) {
	l(() => I(e, t, n() ?? r, { passive: !1 }));
}
// node_modules/svelte/src/legacy/legacy-client.js
function ct(e) {
	return new $(e);
}
function lt(e) {
	return class extends $ {
		constructor(t) {
			super({
				component: e,
				...t
			});
		}
	};
}
var $ = class {
	#e;
	#t;
	constructor(e) {
		var t = /* @__PURE__ */ new Map(), n = (e, n) => {
			var r = /* @__PURE__ */ xe(n, !1, !1);
			return t.set(e, r), r;
		};
		let r = new Proxy({
			...e.props || {},
			$$events: {}
		}, {
			get(e, r) {
				return S(t.get(r) ?? n(r, Reflect.get(e, r)));
			},
			has(e, r) {
				return r === k || (S(t.get(r) ?? n(r, Reflect.get(e, r))), Reflect.has(e, r));
			},
			set(e, r, i) {
				return me(t.get(r) ?? n(r, i), i), Reflect.set(e, r, i);
			}
		});
		this.#t = (e.hydrate ? q : K)(e.component, {
			target: e.target,
			anchor: e.anchor,
			props: r,
			context: e.context,
			intro: e.intro ?? !1,
			recover: e.recover,
			transformError: e.transformError
		}), Ne || e?.props?.$$host && e.sync !== !1 || ke(), this.#e = r.$$events;
		for (let e of Object.keys(this.#t)) e !== "$set" && e !== "$destroy" && e !== "$on" && ye(this, e, {
			get() {
				return this.#t[e];
			},
			set(t) {
				this.#t[e] = t;
			},
			enumerable: !0
		});
		this.#t.$set = (e) => {
			Object.assign(r, e);
		}, this.#t.$destroy = () => {
			Z(this.#t);
		};
	}
	$set(e) {
		this.#t.$set(e);
	}
	$on(e, t) {
		this.#e[e] = this.#e[e] || [];
		let n = (...e) => t.call(this, ...e);
		return this.#e[e].push(n), () => {
			this.#e[e] = this.#e[e].filter((e) => e !== n);
		};
	}
	$destroy() {
		this.#t.$destroy();
	}
};
function ut(e) {
	l(() => {
		e();
		var t = M;
		t.f & 2048 && (je("a file (we can't know which one)"), ce(t, fe));
	});
}
function dt(...e) {
	return function(t) {
		let { stopImmediatePropagation: n } = t, r = !1;
		t.stopImmediatePropagation = () => {
			r = !0, n.call(t);
		};
		let i = [];
		for (let n of e) {
			try {
				n?.call(this, t);
			} catch (e) {
				i.push(e);
			}
			if (r) break;
		}
		for (let e of i) queueMicrotask(() => {
			throw e;
		});
	};
}
function ft() {
	let e = j;
	return e === null && ee("createBubbler"), (t) => (r) => {
		let i = e.s.$$events?.[t];
		if (i) {
			let t = n(i) ? i.slice() : [i];
			for (let n of t) n.call(e.x, r);
			return !r.defaultPrevented;
		}
		return !0;
	};
}
export { Ke as A, V as C, Ve as D, He as E, B as M, z as N, Ue as O, Je as S, Be as T, et as _, ut as a, W as b, ot as c, at as d, rt as f, $e as g, K as h, dt as i, We as j, Ye as k, Q as l, q as m, ft as n, st as o, tt as p, ct as r, it as s, lt as t, nt as u, G as v, qe as w, Qe as x, Z as y };
