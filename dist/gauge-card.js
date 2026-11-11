// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, re = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ie = (e, t) => !l(e, t), ae = {
	attribute: !0,
	type: String,
	converter: re,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var _ = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ae) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ae;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? re : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? re : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ie)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[g("elementProperties")] = /* @__PURE__ */ new Map(), _[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: _ }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var v = globalThis, oe = (e) => e, y = v.trustedTypes, se = y ? y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, S = () => x.createComment(""), C = (e) => e === null || typeof e != "object" && typeof e != "function", w = Array.isArray, de = (e) => w(e) || typeof e?.[Symbol.iterator] == "function", T = "[ 	\n\f\r]", E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, pe = />/g, D = RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), me = /'/g, he = /"/g, ge = /^(?:script|style|textarea|title)$/i, _e = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), O = _e(1), k = _e(2), A = Symbol.for("lit-noChange"), j = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), M = x.createTreeWalker(x, 129);
function ye(e, t) {
	if (!w(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var be = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === E ? c[1] === "!--" ? o = fe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = D) : (ge.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = D) : o = pe : o === D ? c[0] === ">" ? (o = i ?? E, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? D : c[3] === "\"" ? he : me) : o === he || o === me ? o = D : o === fe || o === pe ? o = E : (o = D, i = void 0);
		let d = o === D && e[t + 1].startsWith("/>") ? " " : "";
		a += o === E ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [ye(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, N = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = be(t, n);
		if (this.el = e.createElement(l, r), M.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = M.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Se : r[1] === "?" ? Ce : r[1] === "@" ? we : I
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ge.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = y ? y.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], S()), M.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], S());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === le) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(b, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += b.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = x.createElement("template");
		return n.innerHTML = e, n;
	}
};
function P(e, t, n = e, r) {
	if (t === A) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = C(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = P(e, i._$AS(e, t.values), i, r)), t;
}
var xe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		M.currentNode = r;
		let i = M.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new F(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Te(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = M.nextNode(), a++);
		}
		return M.currentNode = x, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, F = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = j, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = P(this, e, t), C(e) ? e === j || e == null || e === "" ? (this._$AH !== j && this._$AR(), this._$AH = j) : e !== this._$AH && e !== A && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== j && C(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = N.createElement(ye(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new xe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ve.get(e.strings);
		return t === void 0 && ve.set(e.strings, t = new N(e)), t;
	}
	k(t) {
		w(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(S()), this.O(S()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = oe(e).nextSibling;
			oe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, I = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = j, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = j;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = P(this, e, t, 0), a = !C(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = P(this, r[n + o], t, o), s === A && (s = this._$AH[o]), a ||= !C(s) || s !== this._$AH[o], s === j ? e = j : e !== j && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === j ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Se = class extends I {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === j ? void 0 : e;
	}
}, Ce = class extends I {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== j);
	}
}, we = class extends I {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = P(this, e, t, 0) ?? j) === A) return;
		let n = this._$AH, r = e === j && n !== j || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== j && (n === j || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Te = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		P(this, e);
	}
}, Ee = v.litHtmlPolyfillSupport;
Ee?.(N, F), (v.litHtmlVersions ??= []).push("3.3.3");
var De = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new F(t.insertBefore(S(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, L = globalThis, R = class extends _ {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = De(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return A;
	}
};
R._$litElement$ = !0, R.finalized = !0, L.litElementHydrateSupport?.({ LitElement: R });
var Oe = L.litElementPolyfillSupport;
Oe?.({ LitElement: R }), (L.litElementVersions ??= []).push("4.2.2");
// src/editor.ts
var z = (e) => ({
	name: e,
	selector: { entity: {} }
}), B = (e, t = {}) => ({
	name: e,
	selector: { number: {
		mode: "box",
		step: "any",
		...t
	} }
}), V = (e) => ({
	name: e,
	selector: { text: { type: "color" } }
}), H = (e) => ({
	name: e,
	selector: { text: {} }
}), ke = [{
	type: "grid",
	name: "",
	schema: [
		B("radius"),
		B("width"),
		B("gap", {
			min: 0,
			max: 359
		}),
		B("rotation"),
		B("spacing"),
		V("color")
	]
}], Ae = [
	z("entity"),
	H("attribute"),
	{
		type: "grid",
		name: "",
		schema: [
			B("min"),
			B("max"),
			{
				name: "origin_mode",
				selector: { select: {
					mode: "dropdown",
					options: [
						{
							value: "min",
							label: "Minimum"
						},
						{
							value: "centre",
							label: "Centre"
						},
						{
							value: "value",
							label: "Value"
						}
					]
				} }
			},
			B("origin_value"),
			{
				name: "reverse",
				selector: { boolean: {} }
			},
			B("width"),
			V("color")
		]
	}
], je = [
	z("entity"),
	H("attribute"),
	{
		type: "grid",
		name: "",
		schema: [
			B("min"),
			B("max"),
			B("padding"),
			B("width"),
			V("color"),
			{
				name: "reverse",
				selector: { boolean: {} }
			}
		]
	}
], Me = [
	z("entity"),
	H("attribute"),
	{
		type: "grid",
		name: "",
		schema: [
			B("scale"),
			B("decimals", {
				min: 0,
				max: 6,
				step: 1
			}),
			H("unit"),
			V("color")
		]
	}
], Ne = {
	entity: "Entity",
	attribute: "Attribute",
	radius: "Radius",
	width: "Width",
	gap: "Gap (degrees)",
	rotation: "Rotation (degrees)",
	spacing: "Bar spacing",
	color: "Colour",
	min: "Minimum",
	max: "Maximum",
	origin_mode: "Origin",
	origin_value: "Origin value",
	reverse: "Reverse",
	padding: "Padding (degrees)",
	scale: "Scale",
	decimals: "Decimals",
	unit: "Unit"
};
function Pe(e) {
	let t = e.origin, n = { ...e };
	return delete n.origin, typeof t == "number" ? (n.origin_mode = "value", n.origin_value = t) : n.origin_mode = t === "centre" || t === "center" ? "centre" : "min", n;
}
function Fe(e) {
	let t = { ...e }, n = t.origin_mode;
	return delete t.origin_mode, delete t.origin_value, n === "value" ? t.origin = e.origin_value ?? 0 : n === "centre" && (t.origin = "centre"), t;
}
var Ie = class extends R {
	constructor(...e) {
		super(...e), this._config = {}, this._label = (e) => Ne[e.name] ?? e.name;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	setConfig(e) {
		this._config = e;
	}
	_fire(e) {
		this._config = e, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: e },
			bubbles: !0,
			composed: !0
		}));
	}
	_section(e, t, n, r = this._config[e] ?? {}) {
		return O`
      <ha-expansion-panel outlined .header=${n}>
        <ha-form
          .hass=${this.hass}
          .data=${r}
          .schema=${t}
          .computeLabel=${this._label}
          @value-changed=${(t) => this._fire({
			...this._config,
			[e]: this._prune(t.detail.value)
		})}
        ></ha-form>
      </ha-expansion-panel>
    `;
	}
	_prune(e) {
		return Object.fromEntries(Object.entries(e).filter(([, e]) => e !== void 0 && e !== ""));
	}
	_setBar(e, t) {
		let n = [...this._config.bars ?? []];
		n[e] = this._prune(Fe(t)), this._fire({
			...this._config,
			bars: n
		});
	}
	_removeBar(e) {
		let t = (this._config.bars ?? []).filter((t, n) => n !== e);
		this._fire({
			...this._config,
			bars: t
		});
	}
	_moveBar(e, t) {
		let n = [...this._config.bars ?? []], r = e + t;
		r < 0 || r >= n.length || ([n[e], n[r]] = [n[r], n[e]], this._fire({
			...this._config,
			bars: n
		}));
	}
	_addBar() {
		this._fire({
			...this._config,
			bars: [...this._config.bars ?? [], {
				entity: "",
				min: 0,
				max: 100
			}]
		});
	}
	_toggleSecondary(e) {
		let t = { ...this._config };
		e.detail.value ? t.secondary = {
			entity: "",
			min: 0,
			max: 100,
			padding: 10
		} : delete t.secondary, this._fire(t);
	}
	render() {
		if (!this.hass) return j;
		let e = this._config.bars ?? [];
		return O`
      ${this._section("gauge", ke, "Gauge")}
      <ha-expansion-panel outlined .header=${"Bars"}>
        ${e.map((e, t) => O`
            <div class="bar">
              <div class="bar-header">
                <span>Bar ${t + 1}</span>
                <span>
                  <ha-icon-button .label=${"Move up"} @click=${() => this._moveBar(t, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .label=${"Move down"} @click=${() => this._moveBar(t, 1)}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .label=${"Remove"} @click=${() => this._removeBar(t)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </ha-icon-button>
                </span>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${Pe(e)}
                .schema=${Ae}
                .computeLabel=${this._label}
                @value-changed=${(e) => this._setBar(t, e.detail.value)}
              ></ha-form>
            </div>
          `)}
        <mwc-button @click=${this._addBar}>Add bar</mwc-button>
      </ha-expansion-panel>
      <ha-formfield .label=${"Secondary bar"}>
        <ha-switch .checked=${this._config.secondary !== void 0} @change=${(e) => this._toggleSecondary(new CustomEvent("x", { detail: { value: e.target.checked } }))}></ha-switch>
      </ha-formfield>
      ${this._config.secondary ? this._section("secondary", je, "Secondary bar") : j}
      ${this._section("center", Me, "Centre display")}
      <p class="hint">
        Colour rules, indicators, the secondary icon and label, and centre segments are edited in the code editor.
      </p>
    `;
	}
	static {
		this.styles = o`
    ha-expansion-panel {
      display: block;
      margin-bottom: 8px;
    }
    .bar {
      border-bottom: 1px solid var(--divider-color);
      padding: 8px 0;
    }
    .bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `;
	}
};
customElements.get("gauge-card-editor") || customElements.define("gauge-card-editor", Ie);
var U = (e) => Math.round(e * 1e3) / 1e3;
function Le(e) {
	return e * Math.PI / 180;
}
function W(e, t, n, r) {
	let i = Le(r);
	return {
		x: e + n * Math.cos(i),
		y: t + n * Math.sin(i)
	};
}
function Re(e) {
	return e.arc ? e.arc : {
		start: 90 + e.gap / 2 + e.rotation,
		sweep: 360 - e.gap
	};
}
function ze(e) {
	let t = Math.sign(e.sweep) || 1, n = 360 - Math.abs(e.sweep);
	return e.start - n / 2 * t;
}
function Be(e, t) {
	let n = Math.sign(e.sweep) || 1, r = 360 - Math.abs(e.sweep) - 2 * t;
	return r < 5 ? null : {
		start: e.start - n * t,
		sweep: -n * r
	};
}
function Ve(e, t, n, r) {
	let i = (e - t) / (n - t);
	return r ? Math.min(1, Math.max(0, i)) : i;
}
function He(e, t, n) {
	let r = n ? 1 - t : t;
	return e.start + e.sweep * r;
}
function Ue(e, t, n) {
	return e === "min" ? 0 : e === "centre" ? .5 : Ve(e, t, n, !0);
}
function We(e, t, n) {
	let r = He(e, Ue(t.origin, t.min, t.max), t.reverse), i = He(e, Ve(n, t.min, t.max, t.clamp), t.reverse);
	return {
		start: r,
		sweep: Math.max(-360, Math.min(360, i - r))
	};
}
function Ge(e, t, n, r, i) {
	if (Math.abs(i) < .01) return "";
	let a = +(i > 0), o = W(e, t, n, r);
	if (Math.abs(i) >= 359.99) {
		let s = W(e, t, n, r + i / 2), c = W(e, t, n, r + i);
		return `M ${U(o.x)} ${U(o.y)} A ${n} ${n} 0 1 ${a} ${U(s.x)} ${U(s.y)} A ${n} ${n} 0 1 ${a} ${U(c.x)} ${U(c.y)}`;
	}
	let s = W(e, t, n, r + i), c = +(Math.abs(i) > 180);
	return `M ${U(o.x)} ${U(o.y)} A ${n} ${n} 0 ${c} ${a} ${U(s.x)} ${U(s.y)}`;
}
// src/config.ts
var G = class extends Error {};
function K(e, t) {
	if (e == null) return {};
	if (typeof e != "object" || Array.isArray(e)) throw new G(`${t} must be an object`);
	return e;
}
function q(e, t) {
	if (e == null) return [];
	if (!Array.isArray(e)) throw new G(`${t} must be a list`);
	return e.map((e, n) => K(e, `${t}[${n}]`));
}
function J(e, t, n) {
	if (e == null || e === "") return t;
	let r = Number(e);
	if (!Number.isFinite(r)) throw new G(`${n} must be a number`);
	return r;
}
function Y(e, t) {
	return e == null || e === "" ? void 0 : J(e, 0, t);
}
function X(e, t) {
	return typeof e == "string" && e !== "" ? e : t;
}
function Ke(e, t) {
	return q(e, t).map((e, n) => {
		if (typeof e.color != "string") throw new G(`${t}[${n}].color is required`);
		return {
			when: K(e.when, `${t}[${n}].when`),
			color: e.color
		};
	});
}
function qe(e, t) {
	return e == null || e === "min" ? "min" : e === "centre" || e === "center" ? "centre" : J(e, 0, t);
}
function Je(e, t, n) {
	if (typeof e.entity != "string" || e.entity === "") throw new G(`${t}.entity is required`);
	let r = J(e.min, 0, `${t}.min`), i = J(e.max, 100, `${t}.max`);
	if (r === i) throw new G(`${t}.min and ${t}.max must differ`);
	return {
		entity: e.entity,
		attribute: typeof e.attribute == "string" && e.attribute !== "" ? e.attribute : void 0,
		min: r,
		max: i,
		origin: qe(e.origin, `${t}.origin`),
		reverse: e.reverse === !0,
		clamp: e.clamp !== !1,
		color: X(e.color, n),
		color_rules: Ke(e.color_rules, `${t}.color_rules`)
	};
}
function Ye(e, t) {
	if (e == null) return;
	let n = K(e, t);
	if (typeof n.icon != "string" || n.icon === "") throw new G(`${t}.icon is required`);
	return {
		icon: n.icon,
		x: Y(n.x, `${t}.x`),
		y: Y(n.y, `${t}.y`),
		size: J(n.size, 24, `${t}.size`),
		color: X(n.color, "#ffffff")
	};
}
function Xe(e, t) {
	if (e == null) return;
	let n = K(e, t);
	return {
		x: Y(n.x, `${t}.x`),
		y: Y(n.y, `${t}.y`),
		size: J(n.size, 15, `${t}.size`),
		color: X(n.color, "#ffffff"),
		decimals: J(n.decimals, 0, `${t}.decimals`),
		unit: typeof n.unit == "string" ? n.unit : void 0
	};
}
function Ze(e) {
	let t = K(e, "gauge"), n = J(t.gap, 80, "gauge.gap");
	if (n < 0 || n >= 360) throw new G("gauge.gap must be in [0, 360)");
	let r;
	if (t.arc !== void 0 && t.arc !== null) {
		let e = K(t.arc, "gauge.arc");
		r = {
			start: J(e.start, 0, "gauge.arc.start"),
			sweep: J(e.sweep, 0, "gauge.arc.sweep")
		};
	}
	let i = X(t.linecap, "round");
	if (![
		"butt",
		"round",
		"square"
	].includes(i)) throw new G("gauge.linecap must be butt, round or square");
	return {
		radius: J(t.radius, 100, "gauge.radius"),
		width: J(t.width, 20, "gauge.width"),
		gap: n,
		rotation: J(t.rotation, 0, "gauge.rotation"),
		arc: r,
		color: X(t.color, "#282828"),
		color_rules: Ke(t.color_rules, "gauge.color_rules"),
		spacing: J(t.spacing, 10, "gauge.spacing"),
		linecap: i
	};
}
function Qe(e) {
	let t = q(e, "bars");
	if (t.length === 0) throw new G("bars must contain at least one bar");
	return t.map((e, t) => ({
		...Je(e, `bars[${t}]`, "#5794f2"),
		radius: Y(e.radius, `bars[${t}].radius`),
		width: J(e.width, 5, `bars[${t}].width`)
	}));
}
function $e(e, t) {
	if (e == null) return;
	let n = K(e, "secondary"), r = K(n.track, "secondary.track"), i = J(n.padding, 10, "secondary.padding");
	if (Be(Re(t), i) === null) throw new G("secondary does not fit: gauge.gap minus 2 x padding must be at least 5 degrees");
	let a = J(r.width, 15, "secondary.track.width"), o = J(n.inset, 3, "secondary.inset");
	return {
		...Je(n, "secondary", "#37c7ff"),
		padding: i,
		radius: Y(n.radius, "secondary.radius"),
		width: J(n.width, Math.max(1, a - 2 * o), "secondary.width"),
		track: {
			width: a,
			color: X(r.color, "#1e1e1e"),
			color_rules: Ke(r.color_rules, "secondary.track.color_rules")
		},
		icon: Ye(n.icon, "secondary.icon"),
		label: Xe(n.label, "secondary.label")
	};
}
function et(e, t, n) {
	if (e != null) return q(e, "center.segments").map((e, t) => {
		let n = X(e.type, "");
		if (![
			"integer",
			"fraction",
			"unit",
			"text"
		].includes(n)) throw new G(`center.segments[${t}].type must be integer, fraction, unit or text`);
		return {
			type: n,
			text: typeof e.text == "string" ? e.text : void 0,
			size: J(e.size, 20, `center.segments[${t}].size`),
			shift: J(e.shift, 0, `center.segments[${t}].shift`),
			color: typeof e.color == "string" ? e.color : void 0
		};
	});
	let r = [{
		type: "integer",
		size: 60,
		shift: 0
	}];
	return t > 0 && r.push({
		type: "fraction",
		size: 30,
		shift: 0
	}), n && r.push({
		type: "unit",
		size: 20,
		shift: 0
	}), r;
}
function tt(e) {
	let t = K(e, "center"), n = J(t.decimals, 0, "center.decimals");
	if (n < 0 || !Number.isInteger(n)) throw new G("center.decimals must be a non-negative integer");
	let r = X(t.rounding, "floor");
	if (r !== "floor" && r !== "round") throw new G("center.rounding must be floor or round");
	let i = typeof t.unit == "string" && t.unit !== "" ? t.unit : void 0;
	return {
		entity: typeof t.entity == "string" && t.entity !== "" ? t.entity : void 0,
		attribute: typeof t.attribute == "string" && t.attribute !== "" ? t.attribute : void 0,
		scale: J(t.scale, 1, "center.scale"),
		decimals: n,
		rounding: r,
		unit: i,
		color: X(t.color, "#ffffff"),
		segments: et(t.segments, n, i !== void 0)
	};
}
function nt(e) {
	return q(e, "indicators").map((e, t) => ({
		...Ye(e, `indicators[${t}]`),
		when: K(e.when, `indicators[${t}].when`)
	}));
}
function rt(e) {
	if (e == null) return;
	let t = K(e, "action");
	if (typeof t.action != "string") throw new G("action.action is required");
	return t;
}
function it(e) {
	let t = K(e, "config"), n = Ze(t.gauge), r;
	if (t.view !== void 0 && t.view !== null) {
		let e = K(t.view, "view");
		if (r = {
			width: J(e.width, 0, "view.width"),
			height: J(e.height, 0, "view.height")
		}, r.width <= 0 || r.height <= 0) throw new G("view.width and view.height must be positive");
	}
	return {
		type: typeof t.type == "string" ? t.type : void 0,
		view: r,
		gauge: n,
		bars: Qe(t.bars),
		secondary: $e(t.secondary, n),
		center: tt(t.center),
		indicators: nt(t.indicators),
		tap_action: rt(t.tap_action)
	};
}
function at(e) {
	let t = /* @__PURE__ */ new Set(), n = (e) => e.forEach((e) => e.when.entity && t.add(e.when.entity));
	n(e.gauge.color_rules);
	for (let r of e.bars) t.add(r.entity), n(r.color_rules);
	e.secondary && (t.add(e.secondary.entity), n(e.secondary.color_rules), n(e.secondary.track.color_rules)), e.center.entity && t.add(e.center.entity);
	for (let n of e.indicators) n.when.entity && t.add(n.when.entity);
	return [...t];
}
// src/conditions.ts
var ot = ["unavailable", "unknown"];
function st(e, t, n) {
	let r = e.states[t];
	if (!r) return;
	let i = n ? r.attributes[n] : r.state;
	if (i != null && !(typeof i == "string" && ot.includes(i))) return i;
}
function Z(e, t, n) {
	let r = st(e, t, n);
	if (r === void 0) return;
	let i = typeof r == "number" ? r : parseFloat(String(r));
	return Number.isFinite(i) ? i : void 0;
}
function ct(e, t, n, r) {
	let i = e.entity ?? n, a = e.entity ? e.attribute : e.attribute ?? r;
	if (!i) return !1;
	let o = st(t, i, a);
	if (e.unavailable !== void 0 && o === void 0 !== e.unavailable || e.state !== void 0 && (o === void 0 || String(o) !== e.state) || e.state_not !== void 0 && (o === void 0 || String(o) === e.state_not)) return !1;
	if (e.gt === void 0 && e.gte === void 0 && e.lt === void 0 && e.lte === void 0 && e.eq === void 0 && e.between === void 0 && e.outside === void 0) return !0;
	let s = Z(t, i, a);
	return !(s === void 0 || e.gt !== void 0 && !(s > e.gt) || e.gte !== void 0 && !(s >= e.gte) || e.lt !== void 0 && !(s < e.lt) || e.lte !== void 0 && !(s <= e.lte) || e.eq !== void 0 && s !== e.eq || e.between && !(s >= e.between[0] && s <= e.between[1]) || e.outside && !(s < e.outside[0] || s > e.outside[1]));
}
function Q(e, t, n, r, i) {
	for (let t of e) if (ct(t.when, n, r, i)) return t.color;
	return t;
}
// src/layout.ts
var lt = .78, ut = .4, dt = 15, ft = .36, pt = "—";
function mt(e) {
	let t = e.bars.length;
	return e.bars.map((n, r) => n.radius ?? e.gauge.radius + ((t - 1) / 2 - r) * e.gauge.spacing);
}
function ht(e) {
	if (e.view) return e.view;
	let t = e.gauge, n = mt(e), r = t.radius + t.width / 2;
	if (e.bars.forEach((e, t) => {
		r = Math.max(r, n[t] + e.width / 2);
	}), e.secondary) {
		let n = e.secondary;
		r = Math.max(r, (n.radius ?? t.radius) + n.track.width / 2);
	}
	let i = Math.ceil(2 * (r + dt));
	return {
		width: i,
		height: i
	};
}
function gt(e, t) {
	let n = e.center, r = Math.abs(t * n.scale), i = 10 ** n.decimals, a = n.rounding === "round" ? Math.round(r * i) : Math.floor(r * i + 1e-9), o = Math.floor(a / i), s = String(a % i).padStart(n.decimals, "0");
	return {
		integer: (t * n.scale < 0 && a !== 0 ? "-" : "") + String(o),
		fraction: s
	};
}
function _t(e, t) {
	let n = e.center, r = n.segments[0]?.size ?? 20, i = Z(t, n.entity ?? e.bars[0].entity, n.entity ? n.attribute : n.attribute ?? e.bars[0].attribute);
	if (i === void 0) return [{
		text: pt,
		size: r,
		dy: 0,
		color: n.color
	}];
	let a = gt(e, i), o = [], s = 0;
	for (let e of n.segments) {
		let t;
		switch (e.type) {
			case "integer":
				t = a.integer;
				break;
			case "fraction":
				t = n.decimals > 0 ? `.${a.fraction}` : "";
				break;
			case "unit":
				t = n.unit ?? "";
				break;
			default: t = e.text ?? "";
		}
		t !== "" && (o.push({
			text: t,
			size: e.size,
			dy: -(e.shift - s),
			color: e.color ?? n.color
		}), s = e.shift);
	}
	return o;
}
function $(e, t, n, r, i, a) {
	return {
		path: Ge(e, t, n, a.start, a.sweep),
		start: a.start,
		sweep: a.sweep,
		radius: n,
		width: r,
		color: i
	};
}
function vt(e, t) {
	let n = e.gauge, { width: r, height: i } = ht(e), a = r / 2, o = i / 2, s = Re(n), c = ze(s), l = e.bars[0], u = {
		width: r,
		height: i,
		linecap: n.linecap,
		track: $(a, o, n.radius, n.width, Q(n.color_rules, n.color, t, l.entity, l.attribute), s),
		bars: [],
		center: {
			x: a,
			y: o + (e.center.segments[0]?.size ?? 20) * ft,
			runs: []
		},
		indicators: []
	}, d = mt(e);
	e.bars.forEach((e, n) => {
		let r = Z(t, e.entity, e.attribute), i = Q(e.color_rules, e.color, t, e.entity, e.attribute), c = r === void 0 ? {
			start: s.start,
			sweep: 0
		} : We(s, e, r);
		u.bars.push($(a, o, d[n], e.width, i, c));
	});
	let f = e.secondary;
	if (f) {
		let e = Be(s, f.padding), r = f.radius ?? n.radius;
		u.secondaryTrack = $(a, o, r, f.track.width, Q(f.track.color_rules, f.track.color, t, f.entity, f.attribute), e);
		let i = Z(t, f.entity, f.attribute), l = i === void 0 ? {
			start: e.start,
			sweep: 0
		} : We(e, f, i);
		if (u.secondaryBar = $(a, o, r, f.width, Q(f.color_rules, f.color, t, f.entity, f.attribute), l), f.icon) {
			let e = W(a, o, n.radius * lt, c);
			u.secondaryIcon = {
				icon: f.icon.icon,
				x: f.icon.x === void 0 ? e.x : a + f.icon.x,
				y: f.icon.y === void 0 ? e.y : o + f.icon.y,
				size: f.icon.size,
				color: f.icon.color
			};
		}
		if (f.label && i !== void 0) {
			let e = W(a, o, r, c), t = 10 ** f.label.decimals;
			u.secondaryLabel = {
				text: `${(Math.round(i * t) / t).toFixed(f.label.decimals)}${f.label.unit ?? ""}`,
				x: f.label.x === void 0 ? e.x : a + f.label.x,
				y: f.label.y === void 0 ? e.y + f.label.size * ft : o + f.label.y,
				size: f.label.size,
				color: f.label.color
			};
		}
	}
	u.center.runs = _t(e, t);
	let p = e.indicators.filter((e) => ct(e.when, t)), m = W(a, o, n.radius * ut, c);
	return p.forEach((e, t) => {
		let n = (t - (p.length - 1) / 2) * (e.size + 4);
		u.indicators.push({
			icon: e.icon,
			x: e.x === void 0 ? m.x + n : a + e.x,
			y: e.y === void 0 ? m.y : o + e.y,
			size: e.size,
			color: e.color
		});
	}), u;
}
// src/gauge-card.ts
var yt = 56, bt = class extends R {
	constructor(...e) {
		super(...e), this._entities = [], this._tap = () => {
			if (!this._config) return;
			let e = this._config.center.entity ?? this._config.bars[0].entity, t = this._config.tap_action ?? { action: "more-info" };
			t.action !== "none" && this.dispatchEvent(new CustomEvent("hass-action", {
				bubbles: !0,
				composed: !0,
				detail: {
					config: {
						entity: e,
						tap_action: t
					},
					action: "tap"
				}
			}));
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_error: { state: !0 }
		};
	}
	static getStubConfig() {
		return {
			gauge: {
				radius: 100,
				width: 20
			},
			bars: [{
				entity: "",
				min: 0,
				max: 100
			}]
		};
	}
	static async getConfigElement() {
		return document.createElement("gauge-card-editor");
	}
	setConfig(e) {
		try {
			this._config = it(e), this._entities = at(this._config), this._error = void 0;
		} catch (e) {
			throw e instanceof G ? Error(e.message) : e;
		}
	}
	getCardSize() {
		return this._config ? Math.ceil(this._viewHeight() / 50) : 4;
	}
	getGridOptions() {
		return {
			columns: 6,
			rows: Math.max(2, Math.round(this._viewHeight() / yt)),
			min_columns: 3,
			min_rows: 2
		};
	}
	shouldUpdate(e) {
		if (!this._config) return !1;
		if (e.has("_config") || e.has("_error")) return !0;
		let t = e.get("hass");
		return !t || !this.hass || this._entities.some((e) => t.states[e] !== this.hass.states[e]);
	}
	render() {
		if (!this._config || !this.hass) return j;
		let e = vt(this._config, this.hass);
		return O`
      <ha-card @click=${this._tap}>
        <svg viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label=${this._ariaLabel(e)}>
          ${this._arc(e.track, e.linecap, "track")} ${e.secondaryTrack ? this._arc(e.secondaryTrack, e.linecap) : j}
          ${e.secondaryBar ? this._arc(e.secondaryBar, e.linecap) : j}
          ${e.bars.map((t) => this._arc(t, e.linecap))} ${this._center(e)}
          ${e.secondaryIcon ? this._icon(e.secondaryIcon) : j} ${e.indicators.map((e) => this._icon(e))}
          ${e.secondaryLabel ? k`<text x=${e.secondaryLabel.x} y=${e.secondaryLabel.y} font-size=${e.secondaryLabel.size}
                fill=${e.secondaryLabel.color} text-anchor="middle">${e.secondaryLabel.text}</text>` : j}
        </svg>
      </ha-card>
    `;
	}
	_viewHeight() {
		return this._config ? ht(this._config).height : 250;
	}
	_ariaLabel(e) {
		return e.center.runs.map((e) => e.text).join("");
	}
	_arc(e, t, n = "") {
		return e.path === "" ? j : k`<path class=${n} d=${e.path} fill="none" stroke=${e.color} stroke-width=${e.width}
      stroke-linecap=${t} />`;
	}
	_center(e) {
		return k`<text x=${e.center.x} y=${e.center.y} text-anchor="middle">
      ${e.center.runs.map((e) => k`<tspan font-size=${e.size} dy=${e.dy} fill=${e.color}>${e.text}</tspan>`)}
    </text>`;
	}
	_icon(e) {
		if (e.icon.startsWith("M")) {
			let t = e.size / 24;
			return k`<path d=${e.icon} fill=${e.color}
        transform="translate(${e.x - e.size / 2} ${e.y - e.size / 2}) scale(${t})" />`;
		}
		return k`<foreignObject x=${e.x - e.size / 2} y=${e.y - e.size / 2} width=${e.size} height=${e.size}>
      <ha-icon .icon=${e.icon} style="--mdc-icon-size:${e.size}px;color:${e.color};display:flex"></ha-icon>
    </foreignObject>`;
	}
	static {
		this.styles = o`
    ha-card {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      box-sizing: border-box;
    }
    svg {
      width: 100%;
      height: 100%;
      max-height: 100%;
    }
    text {
      dominant-baseline: alphabetic;
      font-family: var(--ha-card-font-family, inherit);
    }
  `;
	}
};
customElements.get("gauge-card") || customElements.define("gauge-card", bt), window.customCards = window.customCards || [], window.customCards.push({
	type: "gauge-card",
	name: "Gauge Card",
	description: "Configurable multi-bar arc gauge with a secondary bar, centre display and colour rules.",
	preview: !0
});
