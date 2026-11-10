import { i as e, l as t, n } from "./constants-BYz4oKkd.js";
import { d as r, o as i, v as a } from "./warnings-b11YuAde.js";
import { a as o, t as s } from "./flags-BPZQ2-TS.js";
// node_modules/svelte/src/internal/shared/utils.js
var c = Array.isArray, l = Array.prototype.indexOf, u = Array.prototype.includes, d = Array.from, f = Object.keys, p = Object.defineProperty, ee = Object.getOwnPropertyDescriptor, te = Object.getOwnPropertyDescriptors, ne = Object.prototype, re = Array.prototype, m = Object.getPrototypeOf, ie = Object.isExtensible, ae = Object.prototype.hasOwnProperty;
function oe(e) {
	return typeof e == "function";
}
var se = () => {};
function ce(e) {
	return typeof e?.then == "function";
}
function le(e) {
	return e();
}
function ue(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function de() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function fe(e, t, n = !1) {
	return e === void 0 ? n ? t() : t : e;
}
function pe(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
function me(e, t) {
	var n = {};
	for (var r in e) t.includes(r) || (n[r] = e[r]);
	for (var i of Object.getOwnPropertySymbols(e)) Object.propertyIsEnumerable.call(e, i) && !t.includes(i) && (n[i] = e[i]);
	return n;
}
// node_modules/svelte/src/internal/client/constants.js
var he = 1 << 24, h = 1024, g = 2048, _ = 4096, ge = 8192, _e = 16384, ve = 32768, ye = 1 << 25, be = 65536, xe = 1 << 17, Se = 1 << 18, Ce = 1 << 19, we = 1 << 20, Te = 1 << 25, Ee = 1 << 21, De = 1 << 22, Oe = 1 << 23, v = Symbol("$state"), ke = Symbol("component"), Ae = Symbol("legacy props"), je = Symbol(""), Me = Symbol("proxy path"), Ne = Symbol("attributes"), Pe = Symbol("class"), Fe = Symbol("style"), Ie = Symbol("text"), Le = Symbol("form reset"), Re = Symbol("hmr anchor"), y = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ze = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), b = !1;
function Be(e) {
	b = e;
}
var x;
function S(t) {
	if (t === null) throw r(), e;
	return x = t;
}
function Ve() {
	return S(/* @__PURE__ */ L(x));
}
function He(t) {
	if (b) {
		if (/* @__PURE__ */ L(x) !== null) throw r(), e;
		x = t;
	}
}
function Ue(e) {
	b && (x = e.content);
}
function We(e = 1) {
	if (b) {
		for (var t = e, n = x; t--;) n = /* @__PURE__ */ L(n);
		x = n;
	}
}
function Ge(e = !0) {
	for (var t = 0, n = x;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ L(n);
		e && n.remove(), n = i;
	}
}
function Ke(t) {
	if (!t || t.nodeType !== 8) throw r(), e;
	return t.data;
}
// node_modules/svelte/src/internal/client/reactivity/equality.js
function qe(e) {
	return e === this.v;
}
function Je(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ye(e) {
	return !Je(e, this.v);
}
// node_modules/svelte/src/internal/shared/errors.js
function Xe(e) {
	throw Error("https://svelte.dev/e/experimental_async_required");
}
function Ze() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function Qe() {
	throw Error("https://svelte.dev/e/invalid_snippet_arguments");
}
function $e(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function et() {
	throw Error("https://svelte.dev/e/missing_context");
}
function tt() {
	throw Error("https://svelte.dev/e/set_context_after_init");
}
function nt() {
	throw Error("https://svelte.dev/e/snippet_without_render_tag");
}
function rt(e) {
	throw Error("https://svelte.dev/e/store_invalid_shape");
}
function it() {
	throw Error("https://svelte.dev/e/svelte_element_invalid_this_value");
}
// node_modules/svelte/src/internal/client/errors.js
function at() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function ot() {
	throw Error("https://svelte.dev/e/bind_invalid_checkbox_value");
}
function st(e, t) {
	throw Error("https://svelte.dev/e/component_api_changed");
}
function ct(e, t) {
	throw Error("https://svelte.dev/e/component_api_invalid_new");
}
function lt(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ut(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_volatile");
}
function dt(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ft() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function pt(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function mt() {
	throw Error("https://svelte.dev/e/effect_pending_outside_reaction");
}
function ht() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function gt() {
	throw Error("https://svelte.dev/e/fork_discarded");
}
function _t() {
	throw Error("https://svelte.dev/e/fork_timing");
}
function vt() {
	throw Error("https://svelte.dev/e/get_abort_signal_outside_reaction");
}
function yt(e) {
	throw Error("https://svelte.dev/e/hydratable_missing_but_required");
}
function bt() {
	throw Error("https://svelte.dev/e/hydration_failed");
}
function xt() {
	throw Error("https://svelte.dev/e/invalid_snippet");
}
function St(e) {
	throw Error("https://svelte.dev/e/lifecycle_legacy_only");
}
function Ct(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function wt(e) {
	throw Error("https://svelte.dev/e/props_rest_readonly");
}
function Tt(e) {
	throw Error("https://svelte.dev/e/rune_outside_svelte");
}
function Et() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Dt() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ot() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function kt() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function At(e) {
	console.warn("https://svelte.dev/e/dynamic_void_element_content");
}
// node_modules/svelte/src/internal/shared/clone.js
var jt = [];
function Mt(e, t = !1, n = !1) {
	return Nt(e, /* @__PURE__ */ new Map(), "", jt, null, n);
}
function Nt(e, t, n, r, i = null, a = !1) {
	if (typeof e == "object" && e) {
		var o = t.get(e);
		if (o !== void 0) return o;
		if (e instanceof Map) return new Map(e);
		if (e instanceof Set) return new Set(e);
		if (c(e)) {
			var s = Array(e.length);
			t.set(e, s), i !== null && t.set(i, s);
			for (var l = 0; l < e.length; l += 1) {
				var u = e[l];
				l in e && (s[l] = Nt(u, t, n, r, null, a));
			}
			return s;
		}
		if (m(e) === ne) {
			s = {}, t.set(e, s), i !== null && t.set(i, s);
			for (var d of Object.keys(e)) s[d] = Nt(e[d], t, n, r, null, a);
			return s;
		}
		if (e instanceof Date) return e.getTime(), structuredClone(e);
		if (typeof e.toJSON == "function" && !a) return Nt(e.toJSON(), t, n, r, e);
	}
	if (e instanceof EventTarget) return e;
	try {
		return structuredClone(e);
	} catch {
		return e;
	}
}
// node_modules/svelte/src/internal/client/dev/tracing.js
var Pt = null;
function Ft(e, n) {
	let r = e.v;
	if (r === t) return;
	let i = It(e), a = H, o = e.wv > a.wv || a.wv === 0, s = o ? "color: CornflowerBlue; font-weight: bold" : "color: grey; font-weight: normal";
	if (console.groupCollapsed(e.label ? `%c${i}%c ${e.label}` : `%c${i}%c`, s, o ? "font-weight: normal" : s, typeof r == "object" && r && v in r ? Mt(r, !0) : r), i === "$derived") {
		let t = new Set(e.deps);
		for (let e of t) Ft(e);
	}
	if (e.created && console.log(e.created), o && e.updated) for (let t of e.updated.values()) t.error && console.log(t.error);
	if (n) for (var c of n.traces) console.log(c);
	console.groupEnd();
}
function It(e) {
	return e.f & 4194306 ? "$derived" : e.label?.startsWith("$") ? "store" : "$state";
}
function Lt(e, t) {
	var n = Pt;
	try {
		Pt = {
			entries: /* @__PURE__ */ new Map(),
			reaction: H
		};
		var r = performance.now(), i = t(), a = (performance.now() - r).toFixed(2), o = qi(e);
		if (!Zr()) console.log(`${o} %cran outside of an effect (${a}ms)`, "color: grey");
		else if (Pt.entries.size === 0) console.log(`${o} %cno reactive dependencies (${a}ms)`, "color: grey");
		else {
			console.group(`${o} %c(${a}ms)`, "color: grey");
			var s = Pt.entries;
			qi(() => {
				for (let [e, t] of s) Ft(e, t);
			}), Pt = null, console.groupEnd();
		}
		return i;
	} finally {
		Pt = n;
	}
}
function Rt(e, t) {
	return e.label = t, zt(e.v, t), e;
}
function zt(e, t) {
	return e?.[Me]?.(t), e;
}
function Bt(e) {
	return typeof e == "symbol" ? `Symbol(${e.description})` : typeof e == "function" ? "<function>" : typeof e == "object" && e ? "<object>" : String(e);
}
// node_modules/svelte/src/internal/shared/dev.js
function Vt(e) {
	let t = /* @__PURE__ */ Error(), n = Ht();
	return n.length === 0 ? null : (n.unshift("\n"), p(t, "stack", { value: n.join("\n") }), p(t, "name", { value: e }), t);
}
function Ht() {
	let e = Error.stackTraceLimit;
	Error.stackTraceLimit = Infinity;
	let t = (/* @__PURE__ */ Error()).stack;
	if (Error.stackTraceLimit = e, !t) return [];
	let n = t.split("\n"), r = [];
	for (let e = 0; e < n.length; e++) {
		let t = n[e], i = t.replaceAll("\\", "/");
		if (t.trim() !== "Error") {
			if (t.includes("validate_each_keys")) return [];
			i.includes("svelte/src/internal") || i.includes("node_modules/.vite") || r.push(t);
		}
	}
	return r;
}
// node_modules/svelte/src/internal/shared/context.js
function Ut(e, t, n) {
	let r = {};
	return [
		() => (n(r) || et(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Wt(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Gt(e, t) {
	return e === null && $e(t), e.c ??= new Map(Wt(e) || void 0);
}
// node_modules/svelte/src/internal/client/context.js
var C = null;
function Kt(e) {
	C = e;
}
var qt = null;
function Jt(e, t, r, i, a, o) {
	let s = qt;
	qt = {
		type: t,
		file: r[n],
		line: i,
		column: a,
		parent: s,
		...o
	};
	try {
		return e();
	} finally {
		qt = s;
	}
}
var Yt = null;
function Xt(e) {
	Yt = e;
}
function Zt() {
	return Ut(Qt, $t, en);
}
function Qt(e) {
	return Gt(C, "getContext").get(e);
}
function $t(e, t) {
	let n = Gt(C, "setContext");
	if (s) {
		var r = G.f;
		!H && r & 32 && !C.i || tt();
	}
	return n.set(e, t), t;
}
function en(e) {
	return Gt(C, "hasContext").has(e);
}
function tn() {
	return Gt(C, "getAllContexts");
}
function nn(e, t = !1, n) {
	C = {
		p: C,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: o && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function rn(e) {
	var t = C, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) ei(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, C = t.p, an(e);
}
function an(e = {}) {
	return p(e, ke, { value: !0 }), e;
}
function on() {
	return !o || C !== null && C.l === null;
}
// node_modules/svelte/src/internal/client/dom/task.js
var w = [];
function sn() {
	var e = w;
	w = [], ue(e);
}
function cn(e) {
	if (w.length === 0 && !Kn) {
		var t = w;
		queueMicrotask(() => {
			t === w && sn();
		});
	}
	w.push(e);
}
function ln() {
	for (; w.length > 0;) sn();
}
// node_modules/svelte/src/internal/client/reactivity/status.js
var un = ~(g | _ | h);
function T(e, t) {
	e.f = e.f & un | t;
}
function dn(e) {
	e.f & 512 || e.deps === null ? T(e, h) : T(e, _);
}
// node_modules/svelte/src/internal/client/reactivity/utils.js
function fn(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), T(e, h);
}
// node_modules/svelte/src/internal/client/dom/elements/misc.js
function pn(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, cn(() => {
			document.activeElement === t && e.focus();
		});
	}
}
function mn(e) {
	b && /* @__PURE__ */ Ir(e) !== null && Vr(e);
}
var hn = !1;
function gn() {
	hn || (hn = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[Le]?.();
		});
	}, { capture: !0 }));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function _n(e, t, n, r = !0) {
	r && n();
	for (var i of t) e.addEventListener(i, n);
	Qr(() => {
		for (var r of t) e.removeEventListener(r, n);
	});
}
function vn(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
function yn(e, t, n, r = n) {
	e.addEventListener(t, () => vn(n));
	let i = e[Le];
	e[Le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), gn();
}
// node_modules/svelte/src/internal/client/reactivity/async.js
function bn(e, t, n, r) {
	let i = on() ? Nn : Ln;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = Sn(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			E();
		}
	}
	var d = An();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Fn(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), E());
	}) : f();
}
function xn(e, t) {
	bn(e, [], [], t);
}
function Sn() {
	var e = G, t = H, n = C, r = D;
	return function(i = !0) {
		K(e), W(t), Kt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
var Cn = !1;
async function wn(e) {
	var t = Sn();
	Tn();
	var n = await e;
	return () => (t(), Cn = !0, n);
}
function Tn(e) {
	return Cn && E(), e;
}
async function En(e) {
	Tn();
	var t = jn;
	queueMicrotask(() => {
		jn === t && Mn(null);
	});
	var n = await e;
	return () => (Mn(t), queueMicrotask(() => {
		jn === t && Mn(null);
	}), n);
}
async function* Dn(e) {
	let t = e[Symbol.asyncIterator]?.() ?? e[Symbol.iterator]?.();
	if (t === void 0) throw TypeError("value is not async iterable");
	let n = !0;
	try {
		for (;;) {
			let { done: e, value: i } = (await En(t.next()))();
			if (e) {
				n = !1;
				break;
			}
			var r = jn;
			try {
				yield i;
			} catch (e) {
				throw Mn(r), t.return !== void 0 && (await En(t.return()))(), e;
			}
			Mn(r);
		}
	} catch (e) {
		throw n = !1, e;
	} finally {
		if (n && t.return !== void 0) return (await En(t.return()))().value;
	}
}
function E(e = !0) {
	Cn = !1, K(null), W(null), Kt(null), e && D?.deactivate();
}
function On(e) {
	let t = Sn(), n = An();
	var r = G, i = null;
	let a = (e) => {
		i = { error: e }, wi(r) || R(e, r);
	};
	var o = Promise.resolve(e[0]()).catch(a), s = {
		promise: o,
		settled: !1
	}, c = [s];
	o.finally(() => {
		s.settled = !0, E();
	});
	for (let n of e.slice(1)) {
		o = o.then(() => {
			t();
			try {
				if (i) throw i.error;
				if (wi(r)) throw y;
				return n();
			} finally {
				E();
			}
		}).catch(a);
		let e = {
			promise: o,
			settled: !1
		};
		c.push(e), o.finally(() => {
			e.settled = !0, E();
		});
	}
	return o.then(() => Promise.resolve()).finally(n), c;
}
function kn(e) {
	return Promise.all(e.map((e) => e.promise));
}
function An() {
	var e = G, t = e.b, n = D, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var jn = null;
function Mn(e) {
	jn = e;
}
/*#__NO_SIDE_EFFECTS__*/
function Nn(e) {
	var n = 2 | g;
	return G !== null && (G.f |= Ce), {
		ctx: C,
		deps: null,
		effects: null,
		equals: qe,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: G,
		ac: null
	};
}
var Pn = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Fn(e, n, r) {
	let i = G;
	i === null && at();
	var a = void 0, o = mr(t), s = !H, c = /* @__PURE__ */ new Set();
	return ci(() => {
		var t = G, n = de();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== y && n.reject(e);
			}).finally(E);
		} catch (e) {
			n.reject(e), E();
		}
		var r = D;
		if (s) {
			if (t.f & 32768) var l = An();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Pn);
			else for (let e of c.values()) e.reject(Pn);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Pn && (r.activate(), t ? (o.f |= Oe, vr(o, t)) : (o.f & 8388608 && (o.f ^= Oe), vr(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Qr(() => {
		for (let e of c) e.reject(Pn);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === a ? e(o) : t(a);
			}
			n.then(r, r);
		}
		t(a);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function In(e) {
	let t = /* @__PURE__ */ Nn(e);
	return s || Ai(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ln(e) {
	let t = /* @__PURE__ */ Nn(e);
	return t.equals = Ye, t;
}
function Rn(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function zn(e) {
	var n, r = G, a = e.parent;
	if (!V && a !== null && e.v !== t && a.f & 24576) return i(), e.v;
	K(a);
	try {
		Rn(e), n = Ri(e);
	} finally {
		K(r);
	}
	return n;
}
function Bn(e) {
	var t = zn(e);
	!e.equals(t) && (e.wv = Fi(), (!D?.is_fork || e.deps === null) && (D === null ? e.v = t : (D.capture(e, t, !0), O?.capture(e, t, !0)), e.deps === null)) ? T(e, h) : V || (k === null ? dn(e) : (Zr() || D?.is_fork) && k.set(e, t));
}
function Vn(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && vn(() => {
		t.ac.abort(y), t.ac = null;
	}), t.fn !== null && (t.teardown = se), Vi(t, 0), gi(t));
}
function Hn(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Q(t);
}
// node_modules/svelte/src/internal/client/reactivity/batch.js
var Un = null, Wn = null, D = null, O = null, k = null, Gn = null, Kn = !1, qn = !1, Jn = null, Yn = null, Xn = 0, Zn = 1, A = class e {
	id = Zn++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Wn === null ? Un = Wn = this : (Wn.#n = this, this.#t = Wn), Wn = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) T(r, g), t(r);
			for (r of n.m) T(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= h;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), T(e, g), this.schedule(e);
		for (let e of this.#d) T(e, _), this.schedule(e);
		this.apply();
		for (var t = Jn = [], n = [], r = Yn = []; this.#c.length > 0;) {
			Xn++ > 1e3 && (this.#C(), Qn());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw lr(e), this.#h() || this.discard(), t;
			}
		}
		if (D = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Jn = null, Yn = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) cr(e, t);
			r.length > 0 && D.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), O = this, $n(n), $n(t), O = null, this.#s?.resolve();
			var o = D;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && (this.#C(), s && (this.#S(), D = o)), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (N.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : s && i & 16777224 ? n.push(r) : Ii(r) && (i & 16 && this.#d.add(r), Q(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var c = r.next;
				if (c !== null) {
					r = c;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), T(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#C(), D = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) fn(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), k?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		D = this;
	}
	deactivate() {
		D = null, k = null;
	}
	flush() {
		try {
			qn = !0, D = this, this.#_();
		} finally {
			Xn = 0, Gn = null, Jn = null, Yn = null, qn = !1, D = null, k = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Pn);
		this.#C(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	#S() {
		for (let u = Un; u !== null; u = u.#n) {
			var e = u.id < this.id, t = [];
			for (let [r, [i, a]] of this.current) {
				if (u.current.has(r)) {
					var n = u.current.get(r)[0];
					if (e && i !== n) u.current.set(r, [i, a]);
					else continue;
				}
				t.push(r);
			}
			if (e) for (let [e, t] of this.async_deriveds) {
				let n = u.async_deriveds.get(e);
				n && t.promise.then(n.resolve).catch(n.reject);
			}
			var r = [...u.current.keys()].filter((e) => !u.current.get(e)[1]);
			if (u.#e && r.length !== 0) {
				var i = r.filter((e) => !this.current.has(e));
				if (i.length === 0) e && u.discard();
				else if (t.length > 0) {
					if (e) for (let e of this.#p) u.unskip_effect(e, (e) => {
						e.f & 4194320 ? u.schedule(e) : u.#x([e]);
					});
					u.activate();
					var a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
					for (var s of t) er(s, i, a, o);
					o = /* @__PURE__ */ new Map();
					var c = [...u.current].filter(([e, t]) => {
						let n = this.current.get(e);
						return !n || n[0] !== t[0] || n[1] !== t[1];
					}).map(([e]) => e);
					if (c.length > 0) for (let e of this.#l) !(e.f & 155648) && nr(e, c, o) && (e.f & 4194320 ? (T(e, g), u.schedule(e)) : u.#u.add(e));
					if (u.#c.length > 0 && !u.#m) {
						u.apply();
						for (var l of u.#g()) u.#v(l, [], []);
					}
					u.deactivate();
				}
			}
		}
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, cn(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= de()).promise;
	}
	static ensure() {
		if (D === null) {
			let t = D = new e();
			!qn && !Kn && cn(() => {
				t.#e || t.flush();
			});
		}
		return D;
	}
	apply() {
		if (!s || !this.is_fork && this.#t === null && this.#n === null) k = null;
		else {
			k = /* @__PURE__ */ new Map();
			for (let [e, [t]] of this.current) k.set(e, t);
			for (let t = Un; t !== null; t = t.#n) if (!(t === this || t.is_fork)) {
				var e = !1;
				if (t.id < this.id) {
					for (let [n, [, r]] of t.current) if (!r && this.current.has(n)) {
						e = !0;
						break;
					}
				}
				if (!e) for (let [e, n] of t.previous) k.has(e) || k.set(e, n);
			}
		}
	}
	schedule(e) {
		Gn = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#C() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null ? Un = t : e.#n = t, t === null ? Wn = e : t.#t = e, this.linked = !1;
		}
	}
};
function j(e) {
	var t = Kn, n = O;
	O = null, Kn = !0;
	try {
		var r;
		for (e && (j(), r = e());;) {
			if (ln(), D === null) return r;
			D.flush();
		}
	} finally {
		Kn = t, O = n;
	}
}
function Qn() {
	try {
		ht();
	} catch (e) {
		R(e, Gn);
	}
}
var M = null;
function $n(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Ii(r) && (M = /* @__PURE__ */ new Set(), Q(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && yi(r), M?.size > 0)) {
				N.clear();
				for (let e of M) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) M.has(n) && (M.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Q(n);
					}
				}
				M.clear();
			}
		}
		M = null;
	}
}
function er(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? er(i, t, n, r) : e & 4194320 && !(e & 2048) && nr(i, t, r) && (T(i, g), rr(i));
	}
}
function tr(e, t) {
	if (e.reactions !== null) for (let n of e.reactions) {
		let e = n.f;
		e & 2 ? tr(n, t) : e & 131072 && (T(n, g), t.add(n));
	}
}
function nr(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (u.call(t, r)) return !0;
		if (r.f & 2 && nr(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function rr(e) {
	D.schedule(e);
}
var ir = [];
function ar() {
	j(() => {
		let e = ir;
		ir = [];
		for (let t of e) br(t);
	});
}
var or = /* @__PURE__ */ new Map();
function sr(e) {
	var t = !0, n = void 0;
	if (H === null) return e();
	let r = H, i = or.get(r) ?? mr(0);
	return or.set(r, i), Qr(() => {
		r.f & 33554432 && or.delete(r);
	}), $(i), ni(() => {
		if (t) {
			var r = k;
			try {
				k = null, n = e();
			} finally {
				k = r;
			}
		} else ir.length === 0 && cn(ar), ir.push(i);
	}), t = !1, n;
}
function cr(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), T(e, h);
		for (var n = e.first; n !== null;) cr(n, t), n = n.next;
	}
}
function lr(e) {
	T(e, h);
	for (var t = e.first; t !== null;) lr(t), t = t.next;
}
function ur(e) {
	s || Xe("fork"), D !== null && _t(), j();
	var t = A.ensure();
	t.is_fork = !0, k = /* @__PURE__ */ new Map();
	var n = !1, r = t.settled();
	return e(), j(), {
		commit: async () => {
			if (n) await r;
			else {
				t.linked || gt(), n = !0, t.is_fork = !1;
				for (var [e, [i]] of t.current) e.v = i, e.wv = Fi();
				j(() => {
					var e = /* @__PURE__ */ new Set();
					for (var n of t.current.keys()) tr(n, e);
					fr(e), yr();
				}), t.flush(), await r;
			}
		},
		discard: () => {
			for (var e of t.current.keys()) e.wv = Fi();
			!n && t.linked && t.discard();
		}
	};
}
// node_modules/svelte/src/internal/client/reactivity/sources.js
var dr = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map();
function fr(e) {
	dr = e;
}
var pr = !1;
function mr(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: qe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t) {
	let n = mr(e, t);
	return Ai(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function hr(e, t = !1, n = !0) {
	let r = mr(e);
	return t || (r.equals = Ye), o && n && C !== null && C.l !== null && (C.l.s ??= []).push(r), r;
}
function gr(e, t) {
	return F(e, qi(() => $(e))), t;
}
function F(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && on() && H.f & 4325394 && (q === null || !q.has(e)) && Ot(), vr(e, n ? wr(t) : t, Yn);
}
var I = null, _r = 0;
function vr(e, t, n = null) {
	if (!e.equals(t)) {
		V ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = A.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && zn(t), k === null && dn(t);
		}
		e.wv = Fi(), I = null, _r = 0, Cr(e, g, n), I = null, on() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? ji([e]) : X.push(e)), !r.is_fork && dr.size > 0 && !pr && yr();
	}
	return t;
}
function yr() {
	pr = !1;
	for (let e of dr) {
		e.f & 1024 && T(e, _);
		let t;
		try {
			t = Ii(e);
		} catch {
			t = !0;
		}
		t && Q(e);
	}
	dr.clear();
}
function br(e, t = 1) {
	var n = $(e), r = t === 1 ? n++ : n--;
	return F(e, n), r;
}
function xr(e, t = 1) {
	var n = $(e);
	return F(e, t === 1 ? ++n : --n);
}
function Sr(e) {
	F(e, e.v + 1);
}
function Cr(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = on(), a = r.length;
		if (_r += a, _r > 1e5 && I === null && (I = /* @__PURE__ */ new Set()), I !== null) {
			if (I.has(e)) return;
			I.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & g) === 0;
				if (l && T(s, t), c & 131072) dr.add(s);
				else if (c & 2) {
					var u = s;
					k?.delete(u), Cr(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && M !== null && M.add(d), n === null ? rr(d) : n.push(d);
				}
			}
		}
	}
}
function wr(e) {
	if (typeof e != "object" || !e || v in e || ke in e) return e;
	let n = m(e);
	if (n !== ne && n !== re) return e;
	var r = /* @__PURE__ */ new Map(), i = c(e), a = /* @__PURE__ */ P(0), o = null, s = Z, l = (e) => {
		if (Z === s) return e();
		var t = H, n = Z;
		W(null), Pi(s);
		var r = e();
		return W(t), Pi(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ P(e.length, o)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Et();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ P(n.value, o);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var i = r.get(n);
			if (i === void 0) {
				if (n in e) {
					let e = l(() => /* @__PURE__ */ P(t, o));
					r.set(n, e), Sr(a);
				}
			} else F(i, t), Sr(a);
			return !0;
		},
		get(n, i, a) {
			if (i === v) return e;
			var s = r.get(i), c = i in n;
			if (s === void 0 && (!c || ee(n, i)?.writable) && (s = l(() => /* @__PURE__ */ P(wr(c ? n[i] : t), o)), r.set(i, s)), s !== void 0) {
				var u = $(s);
				return u === t ? void 0 : u;
			}
			return Reflect.get(n, i, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var i = Reflect.getOwnPropertyDescriptor(e, n), a = r.get(n);
			if (a !== void 0) {
				var o = $(a);
				if (o === t) return;
				if (i && "value" in i) i.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return i;
		},
		has(e, n) {
			if (n === v) return !0;
			var i = r.get(n), a = i !== void 0 && i.v !== t || Reflect.has(e, n);
			return (i !== void 0 || G !== null && (!a || ee(e, n)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ P(a ? wr(e[n]) : t, o)), r.set(n, i)), $(i) === t) ? !1 : a;
		},
		set(e, n, s, c) {
			var u = r.get(n), d = n in e;
			if (i && n === "length") for (var f = s; f < u.v; f += 1) {
				var p = r.get(f + "");
				p === void 0 ? f in e && (p = l(() => /* @__PURE__ */ P(t, o)), r.set(f + "", p)) : F(p, t);
			}
			if (u === void 0) (!d || ee(e, n)?.writable) && (u = l(() => /* @__PURE__ */ P(void 0, o)), F(u, wr(s)), r.set(n, u));
			else {
				d = u.v !== t;
				var te = l(() => wr(s));
				F(u, te);
			}
			var ne = Reflect.getOwnPropertyDescriptor(e, n);
			if (ne?.set && ne.set.call(c, s), !d) {
				if (i && typeof n == "string") {
					var re = r.get("length"), m = Number(n);
					Number.isInteger(m) && m >= re.v && F(re, m + 1);
				}
				Sr(a);
			}
			return !0;
		},
		ownKeys(e) {
			$(a);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = r.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [i, o] of r) o.v !== t && !(i in e) && n.push(i);
			return n;
		},
		setPrototypeOf() {
			Dt();
		}
	});
}
function Tr(e) {
	try {
		if (typeof e == "object" && e && v in e) return e[v];
	} catch {}
	return e;
}
function Er(e, t) {
	return Object.is(Tr(e), Tr(t));
}
function Dr(e, t, n = !0) {
	try {
		e === t != (Tr(e) === Tr(t)) && a(n ? "===" : "!==");
	} catch {}
	return e === t === n;
}
function Or(e, t, n = !0) {
	return e == t != (Tr(e) == Tr(t)) && a(n ? "==" : "!="), e == t === n;
}
// node_modules/svelte/src/internal/client/dom/operations.js
var kr, Ar, jr, Mr, Nr;
function Pr() {
	if (kr === void 0) {
		kr = window, Ar = document, jr = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Mr = ee(t, "firstChild").get, Nr = ee(t, "nextSibling").get, ie(e) && (e[Pe] = void 0, e[Ne] = null, e[Fe] = void 0, e.__e = void 0), ie(n) && (n[Ie] = void 0);
	}
}
function Fr(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Ir(e) {
	return Mr.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function L(e) {
	return Nr.call(e);
}
function Lr(e, t) {
	if (!b) return /* @__PURE__ */ Ir(e);
	var n = /* @__PURE__ */ Ir(x);
	if (n === null) n = x.appendChild(Fr());
	else if (t && n.nodeType !== 3) {
		var r = Fr();
		return n?.before(r), S(r), r;
	}
	return t && qr(n), S(n), n;
}
function Rr(e, t = !1) {
	if (!b) {
		var n = /* @__PURE__ */ Ir(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ L(n) : n;
	}
	if (t) {
		if (x?.nodeType !== 3) {
			var r = Fr();
			return x?.before(r), S(r), r;
		}
		qr(x);
	}
	return x;
}
function zr(e, t = !1) {
	if (!b) return /* @__PURE__ */ Ir(e);
	var n = Lr(e, t);
	return He(e), n;
}
function Br(e, t = 1, n = !1) {
	let r = b ? x : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ L(r);
	if (!b) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Fr();
			return r === null ? i?.after(a) : r.before(a), S(a), a;
		}
		qr(r);
	}
	return S(r), r;
}
function Vr(e) {
	e.textContent = "";
}
function Hr() {
	return !s || M !== null ? !1 : (G.f & ve) !== 0;
}
function Ur(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Wr() {
	return document.createDocumentFragment();
}
function Gr(e = "") {
	return document.createComment(e);
}
function Kr(e, t, n = "") {
	if (t.startsWith("xlink:")) e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
	else return e.setAttribute(t, n);
}
function qr(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Jr(e) {
	var t = G;
	if (t === null) return H.f |= Oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	R(e, t);
}
function R(t, n) {
	if (t === e) throw t;
	if (!(n !== null && n.f & 16384)) {
		for (; n !== null;) {
			if (n.f & 128 && !(n.f & 33570816)) {
				if (!(n.f & 32768)) throw t;
				try {
					n.b.error(t);
					return;
				} catch (e) {
					t = e;
				}
			}
			n = n.parent;
		}
		throw t;
	}
}
// node_modules/svelte/src/internal/client/reactivity/effects.js
function Yr(e) {
	G === null && (H === null && pt(e), ft()), V && dt(e);
}
function Xr(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = G;
	n !== null && n.f & 8192 && (e |= ge);
	var r = {
		ctx: C,
		deps: null,
		nodes: null,
		f: e | g | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	D?.register_created_effect(r);
	var i = r;
	if (e & 4) Jn === null ? A.ensure().schedule(r) : Jn.push(r);
	else if (t !== null) {
		try {
			Q(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= be));
	}
	if (i !== null && (i.parent = n, n !== null && Xr(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Zr() {
	return H !== null && !U;
}
function Qr(e) {
	let t = z(8, null);
	return T(t, h), t.teardown = e, t;
}
function $r(e) {
	Yr("$effect");
	var t = G.f;
	if (!H && t & 32 && C !== null && !C.i) {
		var n = C;
		(n.e ??= []).push(e);
	} else return ei(e);
}
function ei(e) {
	return z(4 | we, e);
}
function ti(e) {
	return Yr("$effect.pre"), z(8 | we, e);
}
function ni(e) {
	return z(xe, e);
}
function ri(e) {
	A.ensure();
	let t = z(64 | Ce, e);
	return () => {
		B(t);
	};
}
function ii(e) {
	A.ensure();
	let t = z(64 | Ce, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? bi(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function ai(e) {
	return z(4, e);
}
function oi(e, t) {
	var n = C, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = li(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = G;
			try {
				K(n.parent), qi(t);
			} finally {
				K(n);
			}
		}
	});
}
function si() {
	var e = C;
	li(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && T(n, _), Ii(n) && Q(n), t.ran = !1;
		}
	});
}
function ci(e) {
	return z(De | Ce, e);
}
function li(e, t = 0) {
	return z(8 | t, e);
}
function ui(e, t = [], n = [], r = []) {
	bn(r, t, n, (t) => {
		z(8, () => {
			e(...t.map($));
		});
	});
}
function di(e, t = [], n = [], r = []) {
	bn(r, t, n, (t) => {
		z(4, () => e(...t.map($)));
	});
}
function fi(e, t = 0) {
	return z(16 | t, e);
}
function pi(e, t = 0) {
	return z(he | t, e);
}
function mi(e) {
	return z(32 | Ce, e);
}
function hi(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = V, r = H;
		ki(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			ki(n), W(r);
		}
	}
}
function gi(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && vn(() => {
			e.abort(y);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function _i(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (vi(e.nodes.start, e.nodes.end), n = !0), e.f |= ye, gi(e, t && !n), Vi(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	hi(e), e.f ^= ye, e.f |= _e;
	var i = e.parent;
	i !== null && i.first !== null && yi(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function vi(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ L(e);
		e.remove(), e = n;
	}
}
function yi(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function bi(e, t, n = !0) {
	var r = [];
	e.f |= 256, xi(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function xi(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ge;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				xi(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Si(e) {
	e.f &= -257, Ci(e, !0);
}
function Ci(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ge, e.f & 1024 || (T(e, g), A.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Ci(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function wi(e = G) {
	return (e.f & _e) !== 0;
}
function Ti(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ L(n);
		t.append(n), n = i;
	}
}
// node_modules/svelte/src/internal/client/legacy.js
var Ei = null;
function Di(e) {
	var t = Ei;
	try {
		if (Ei = /* @__PURE__ */ new Set(), qi(e), t !== null) for (var n of Ei) t.add(n);
		return Ei;
	} finally {
		Ei = t;
	}
}
function Oi(e) {
	for (var t of Di(e)) vr(t, t.v);
}
// node_modules/svelte/src/internal/client/runtime.js
var V = !1;
function ki(e) {
	V = e;
}
var H = null, U = !1;
function W(e) {
	H = e;
}
var G = null;
function K(e) {
	G = e;
}
var q = null;
function Ai(e) {
	H !== null && (!s && H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function ji(e) {
	X = e;
}
var Mi = 1, Ni = 0, Z = Ni;
function Pi(e) {
	Z = e;
}
function Fi() {
	return ++Mi;
}
function Ii(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Ii(a) && Bn(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && T(e, h);
	}
	return !1;
}
function Li(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && (s || q === null || !q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Li(a, t, !1) : t === a && (n ? T(a, g) : a.f & 1024 && T(a, _), rr(a));
	}
}
function Ri(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = C, s = U, c = Z, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Kt(e.ctx), U = !1, Z = ++Ni, e.ac !== null && (vn(() => {
		e.ac.abort(y);
	}), e.ac = null);
	try {
		e.f |= Ee;
		var u = e.fn, d = u();
		e.f |= ve;
		var f = zi(e);
		if (on() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Li(X[p], e);
		if (i !== null && i !== e) {
			if (Ni++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Ni;
			if (t !== null) for (let e of t) e.rv = Ni;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= Oe), d;
	} catch (t) {
		return zi(e), Jr(t);
	} finally {
		e.f ^= Ee, J = t, Y = n, X = r, H = i, q = a, Kt(o), U = s, Z = c;
	}
}
function zi(e) {
	var t = e.deps, n = D?.is_fork;
	if (J !== null) {
		var r;
		if (n || Vi(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (Zr() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Vi(e, Y), t.length = Y);
	return t;
}
function Bi(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var i = l.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = n.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && n.f & 2 && (J === null || !u.call(J, n))) {
		var o = n;
		o.f & 512 && (o.f ^= 512), o.v !== t && dn(o), o.ac !== null && vn(() => {
			o.ac.abort(y), o.ac = null, T(o, g);
		}), Vn(o), Vi(o, 0);
	}
}
function Vi(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Bi(e, n[r]);
}
function Q(e) {
	var t = e.f;
	if (!(t & 16384)) {
		T(e, h);
		var n = G;
		G = e;
		try {
			t & 16777232 ? _i(e) : gi(e), hi(e);
			var r = Ri(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Mi;
		} finally {
			G = n;
		}
	}
}
async function Hi() {
	if (s) return new Promise((e) => {
		requestAnimationFrame(() => e()), setTimeout(() => e());
	});
	await Promise.resolve(), j();
}
function Ui() {
	return A.ensure().settled();
}
function $(e) {
	var t = !!(e.f & 2);
	if (Ei?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Ni && (e.rv = Ni, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], u.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : u.call(r, H) || r.push(H);
		}
	}
	if (V && N.has(e)) return N.get(e);
	if (t) {
		var i = e;
		if (V) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Gi(i)) && (a = zn(i)), N.set(i, a), a;
		}
		var o = !(i.f & 512) && !U && H !== null && !!(H.f & 512), s = (i.f & ve) === 0;
		Ii(i) && (o && (i.f |= 512), Bn(i)), o && !s && (Hn(i), Wi(i));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Wi(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : u.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (Hn(n), Wi(n));
	}
}
function Gi(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Gi(t)) return !0;
	return !1;
}
function Ki(e) {
	return e && $(e);
}
function qi(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
function Ji(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (v in e) Yi(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && v in n && Yi(n);
		}
	}
}
function Yi(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Yi(e[n], t);
		} catch {}
		let n = m(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = te(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
export { zr as $, Ce as $n, en as $t, vi as A, Ze as An, pe as Ar, On as At, kr as B, b as Bn, gn as Bt, ri as C, xt as Cn, c as Cr, Fn as Ct, pi as D, Tt as Dn, f as Dr, Sn as Dt, si as E, wt as En, se as Er, In as Et, $r as F, it as Fn, E as Ft, Wr as G, Be as Gn, cn as Gt, Vr as H, Ke as Hn, mn as Ht, ti as I, Je as In, kn as It, Ir as J, Pe as Jn, Zt as Jt, Fr as K, Ge as Kn, Jt as Kt, Yr as L, Ve as Ln, _n as Lt, Si as M, $e as Mn, wn as Mt, Qr as N, nt as Nn, En as Nt, Ti as O, kt as On, le as Or, bn as Ot, ui as P, rt as Pn, Tn as Pt, qr as Q, Te as Qn, Qt, R, x as Rn, yn as Rt, ai as S, bt as Sn, ae as Sr, O as St, oi as T, Ct as Tn, ce as Tr, Ln as Tt, Gr as U, He as Un, fn as Ut, Lr as V, We as Vn, pn as Vt, Ur as W, S as Wn, T as Wt, Pr as X, ye as Xn, qt as Xt, L as Y, _e as Yn, Yt, jr as Z, g as Zn, tn as Zt, mi as _, lt as _n, me as _r, D as _t, $ as a, Kt as an, ze as ar, Er as at, B as b, vt as bn, te as br, ur as bt, K as c, Bt as cn, _ as cr, vr as ct, Hi as d, Lt as dn, v as dr, F as dt, on as en, be as er, Kr as et, qi as f, Mt as fn, Fe as fr, mr as ft, fi as g, ct as gn, p as gr, A as gt, wi as h, st as hn, de as hr, xr as ht, Ji as i, $t as in, ge as ir, Dr as it, li as j, Qe as jn, xn as jt, bi as k, Xe as kn, ue as kr, Dn as kt, W as l, Rt as ln, ve as lr, hr as lt, Oi as m, ot as mn, d as mr, br as mt, H as n, rn as nn, Se as nr, Br as nt, V as o, Xt as on, Ae as or, wr as ot, Z as p, At as pn, Ie as pr, P as pt, Rr as q, Ne as qn, C as qt, Yi as r, nn as rn, Re as rr, Or as rt, Ki as s, Vt as sn, je as sr, Sr as st, G as t, an as tn, Le as tr, Hr as tt, Ui as u, zt as un, y as ur, gr as ut, ii as v, ut as vn, fe as vr, sr as vt, Zr as w, St as wn, oe as wr, Nn as wt, ni as x, yt as xn, m as xr, Kn as xt, di as y, mt as yn, ee as yr, j as yt, Ar as z, Ue as zn, vn as zt };
