/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, st = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = Symbol(), ut = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== nt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (st && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ut.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ut.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Wt = (i) => new Et(typeof i == "string" ? i : i + "", void 0, nt), St = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new Et(e, i, nt);
}, Gt = (i, t) => {
  if (st) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = G.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, dt = st ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Wt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Vt, defineProperty: Ft, getOwnPropertyDescriptor: Zt, getOwnPropertyNames: Jt, getOwnPropertySymbols: Kt, getPrototypeOf: Yt } = Object, K = globalThis, ft = K.trustedTypes, Qt = ft ? ft.emptyScript : "", Xt = K.reactiveElementPolyfillSupport, B = (i, t) => i, it = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Qt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ct = (i, t) => !Vt(i, t), pt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: Ct };
Symbol.metadata ??= Symbol("metadata"), K.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let R = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = pt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Ft(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = Zt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const h = n?.call(this);
      r?.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const t = Yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const e = this.properties, s = [...Jt(e), ...Kt(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(dt(n));
    } else t !== void 0 && e.push(dt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : it).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = s.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : it;
      this._$Em = n;
      const h = o.fromAttribute(e, r.type);
      this[n] = h ?? this._$Ej?.get(n) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? Ct)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: o } = r, h = this[n];
        o !== !0 || this._$AL.has(n) || h === void 0 || this.C(n, void 0, r, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[B("elementProperties")] = /* @__PURE__ */ new Map(), R[B("finalized")] = /* @__PURE__ */ new Map(), Xt?.({ ReactiveElement: R }), (K.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, gt = (i) => i, F = rt.trustedTypes, $t = F ? F.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Mt = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + A, te = `<${zt}>`, P = document, L = () => P.createComment(""), I = (i) => i === null || typeof i != "object" && typeof i != "function", ot = Array.isArray, ee = (i) => ot(i) || typeof i?.[Symbol.iterator] == "function", et = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, mt = /-->/g, _t = />/g, C = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), yt = /'/g, bt = /"/g, Pt = /^(?:script|style|textarea|title)$/i, Ot = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), V = Ot(1), O = Ot(2), N = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), M = P.createTreeWalker(P, 129);
function Rt(i, t) {
  if (!ot(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $t !== void 0 ? $t.createHTML(t) : t;
}
const ie = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = H;
  for (let h = 0; h < e; h++) {
    const a = i[h];
    let d, l, u = -1, c = 0;
    for (; c < a.length && (o.lastIndex = c, l = o.exec(a), l !== null); ) c = o.lastIndex, o === H ? l[1] === "!--" ? o = mt : l[1] !== void 0 ? o = _t : l[2] !== void 0 ? (Pt.test(l[2]) && (n = RegExp("</" + l[2], "g")), o = C) : l[3] !== void 0 && (o = C) : o === C ? l[0] === ">" ? (o = n ?? H, u = -1) : l[1] === void 0 ? u = -2 : (u = o.lastIndex - l[2].length, d = l[1], o = l[3] === void 0 ? C : l[3] === '"' ? bt : yt) : o === bt || o === yt ? o = C : o === mt || o === _t ? o = H : (o = C, n = void 0);
    const y = o === C && i[h + 1].startsWith("/>") ? " " : "";
    r += o === H ? a + te : u >= 0 ? (s.push(d), a.slice(0, u) + Mt + a.slice(u) + A + y) : a + A + (u === -2 ? h : y);
  }
  return [Rt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const h = t.length - 1, a = this.parts, [d, l] = ie(t, e);
    if (this.el = j.createElement(d, s), M.currentNode = this.el.content, e === 2 || e === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = M.nextNode()) !== null && a.length < h; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(Mt)) {
          const c = l[o++], y = n.getAttribute(u).split(A), x = /([.?@])?(.*)/.exec(c);
          a.push({ type: 1, index: r, name: x[2], strings: y, ctor: x[1] === "." ? ne : x[1] === "?" ? re : x[1] === "@" ? oe : Y }), n.removeAttribute(u);
        } else u.startsWith(A) && (a.push({ type: 6, index: r }), n.removeAttribute(u));
        if (Pt.test(n.tagName)) {
          const u = n.textContent.split(A), c = u.length - 1;
          if (c > 0) {
            n.textContent = F ? F.emptyScript : "";
            for (let y = 0; y < c; y++) n.append(u[y], L()), M.nextNode(), a.push({ type: 2, index: ++r });
            n.append(u[c], L());
          }
        }
      } else if (n.nodeType === 8) if (n.data === zt) a.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(A, u + 1)) !== -1; ) a.push({ type: 7, index: r }), u += A.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = P.createElement("template");
    return s.innerHTML = t, s;
  }
}
function k(i, t, e = i, s) {
  if (t === N) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = I(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = k(i, n._$AS(i, t.values), n, s)), t;
}
class se {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? P).importNode(e, !0);
    M.currentNode = n;
    let r = M.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new D(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new ae(r, this, t)), this._$AV.push(d), a = s[++h];
      }
      o !== a?.index && (r = M.nextNode(), o++);
    }
    return M.currentNode = P, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), I(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ee(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && I(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = j.createElement(Rt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const r = new se(n, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = vt.get(t.strings);
    return e === void 0 && vt.set(t.strings, e = new j(t)), e;
  }
  k(t) {
    ot(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new D(this.O(L()), this.O(L()), this, this.options)) : s = e[n], s._$AI(r), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = gt(t).nextSibling;
      gt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, r) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = f;
  }
  _$AI(t, e = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = k(this, t, e, 0), o = !I(t) || t !== this._$AH && t !== N, o && (this._$AH = t);
    else {
      const h = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = k(this, h[s + a], e, a), d === N && (d = this._$AH[a]), o ||= !I(d) || d !== this._$AH[a], d === f ? t = f : t !== f && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ne extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class re extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class oe extends Y {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? f) === N) return;
    const s = this._$AH, n = t === f && s !== f || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== f && (s === f || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ae {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const ce = rt.litHtmlPolyfillSupport;
ce?.(j, D), (rt.litHtmlVersions ??= []).push("3.3.3");
const le = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = n = new D(t.insertBefore(L(), r), r, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = globalThis;
class U extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = le(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return N;
  }
}
U._$litElement$ = !0, U.finalized = !0, at.litElementHydrateSupport?.({ LitElement: U });
const he = at.litElementPolyfillSupport;
he?.({ LitElement: U });
(at.litElementVersions ??= []).push("4.2.2");
const ct = (i) => ({ name: i, selector: { entity: {} } }), m = (i, t = {}) => ({
  name: i,
  selector: { number: { mode: "box", step: "any", ...t } }
}), Q = (i) => ({ name: i, selector: { text: { type: "color" } } }), Z = (i) => ({ name: i, selector: { text: {} } }), ue = [
  {
    type: "grid",
    name: "",
    schema: [m("radius"), m("width"), m("gap", { min: 0, max: 359 }), m("rotation"), m("spacing"), Q("color")]
  }
], de = [
  ct("entity"),
  Z("attribute"),
  {
    type: "grid",
    name: "",
    schema: [
      m("min"),
      m("max"),
      { name: "origin_mode", selector: { select: { mode: "dropdown", options: [
        { value: "min", label: "Minimum" },
        { value: "centre", label: "Centre" },
        { value: "value", label: "Value" }
      ] } } },
      m("origin_value"),
      { name: "reverse", selector: { boolean: {} } },
      m("width"),
      Q("color")
    ]
  }
], fe = [
  ct("entity"),
  Z("attribute"),
  {
    type: "grid",
    name: "",
    schema: [m("min"), m("max"), m("padding"), m("width"), Q("color"), { name: "reverse", selector: { boolean: {} } }]
  }
], pe = [
  ct("entity"),
  Z("attribute"),
  {
    type: "grid",
    name: "",
    schema: [m("scale"), m("decimals", { min: 0, max: 6, step: 1 }), Z("unit"), Q("color")]
  }
], ge = {
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
function $e(i) {
  const t = i.origin, e = { ...i };
  return delete e.origin, typeof t == "number" ? (e.origin_mode = "value", e.origin_value = t) : e.origin_mode = t === "centre" || t === "center" ? "centre" : "min", e;
}
function me(i) {
  const t = { ...i }, e = t.origin_mode;
  return delete t.origin_mode, delete t.origin_value, e === "value" ? t.origin = i.origin_value ?? 0 : e === "centre" && (t.origin = "centre"), t;
}
class _e extends U {
  constructor() {
    super(...arguments), this._config = {}, this._label = (t) => ge[t.name] ?? t.name;
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      _config: { state: !0 }
    };
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    this._config = t, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: t }, bubbles: !0, composed: !0 }));
  }
  _section(t, e, s, n = this._config[t] ?? {}) {
    return V`
      <ha-expansion-panel outlined .header=${s}>
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${e}
          .computeLabel=${this._label}
          @value-changed=${(r) => this._fire({ ...this._config, [t]: this._prune(r.detail.value) })}
        ></ha-form>
      </ha-expansion-panel>
    `;
  }
  _prune(t) {
    return Object.fromEntries(Object.entries(t).filter(([, e]) => e !== void 0 && e !== ""));
  }
  _setBar(t, e) {
    const s = [...this._config.bars ?? []];
    s[t] = this._prune(me(e)), this._fire({ ...this._config, bars: s });
  }
  _removeBar(t) {
    const e = (this._config.bars ?? []).filter((s, n) => n !== t);
    this._fire({ ...this._config, bars: e });
  }
  _moveBar(t, e) {
    const s = [...this._config.bars ?? []], n = t + e;
    n < 0 || n >= s.length || ([s[t], s[n]] = [s[n], s[t]], this._fire({ ...this._config, bars: s }));
  }
  _addBar() {
    this._fire({ ...this._config, bars: [...this._config.bars ?? [], { entity: "", min: 0, max: 100 }] });
  }
  _toggleSecondary(t) {
    const e = { ...this._config };
    t.detail.value ? e.secondary = { entity: "", min: 0, max: 100, padding: 10 } : delete e.secondary, this._fire(e);
  }
  render() {
    if (!this.hass)
      return f;
    const t = this._config.bars ?? [];
    return V`
      ${this._section("gauge", ue, "Gauge")}
      <ha-expansion-panel outlined .header=${"Bars"}>
        ${t.map(
      (e, s) => V`
            <div class="bar">
              <div class="bar-header">
                <span>Bar ${s + 1}</span>
                <span>
                  <ha-icon-button .label=${"Move up"} @click=${() => this._moveBar(s, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .label=${"Move down"} @click=${() => this._moveBar(s, 1)}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .label=${"Remove"} @click=${() => this._removeBar(s)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </ha-icon-button>
                </span>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${$e(e)}
                .schema=${de}
                .computeLabel=${this._label}
                @value-changed=${(n) => this._setBar(s, n.detail.value)}
              ></ha-form>
            </div>
          `
    )}
        <mwc-button @click=${this._addBar}>Add bar</mwc-button>
      </ha-expansion-panel>
      <ha-formfield .label=${"Secondary bar"}>
        <ha-switch .checked=${this._config.secondary !== void 0} @change=${(e) => this._toggleSecondary(new CustomEvent("x", { detail: { value: e.target.checked } }))}></ha-switch>
      </ha-formfield>
      ${this._config.secondary ? this._section("secondary", fe, "Secondary bar") : f}
      ${this._section("center", pe, "Centre display")}
      <p class="hint">
        Colour rules, indicators, the secondary icon and label, and centre segments are edited in the code editor.
      </p>
    `;
  }
  static {
    this.styles = St`
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
}
customElements.get("gauge-card-editor") || customElements.define("gauge-card-editor", _e);
const Ut = 5, b = (i) => Math.round(i * 1e3) / 1e3;
function ye(i) {
  return i * Math.PI / 180;
}
function z(i, t, e, s) {
  const n = ye(s);
  return { x: i + e * Math.cos(n), y: t + e * Math.sin(n) };
}
function Nt(i) {
  return i.arc ? i.arc : { start: 90 + i.gap / 2 + i.rotation, sweep: 360 - i.gap };
}
function be(i) {
  const t = Math.sign(i.sweep) || 1, e = 360 - Math.abs(i.sweep);
  return i.start - t * (e / 2);
}
function kt(i, t) {
  const e = Math.sign(i.sweep) || 1, s = 360 - Math.abs(i.sweep) - 2 * t;
  return s < Ut ? null : { start: i.start - e * t, sweep: -e * s };
}
function Tt(i, t, e, s) {
  const n = (i - t) / (e - t);
  return s ? Math.min(1, Math.max(0, n)) : n;
}
function wt(i, t, e) {
  const s = e ? 1 - t : t;
  return i.start + i.sweep * s;
}
function ve(i, t, e) {
  return i === "min" ? 0 : i === "centre" ? 0.5 : Tt(i, t, e, !0);
}
function At(i, t, e) {
  const s = wt(i, ve(t.origin, t.min, t.max), t.reverse), n = wt(i, Tt(e, t.min, t.max, t.clamp), t.reverse), r = Math.max(-360, Math.min(360, n - s));
  return { start: s, sweep: r };
}
function we(i, t, e, s, n) {
  if (Math.abs(n) < 0.01)
    return "";
  const r = n > 0 ? 1 : 0, o = z(i, t, e, s);
  if (Math.abs(n) >= 359.99) {
    const d = z(i, t, e, s + n / 2), l = z(i, t, e, s + n);
    return `M ${b(o.x)} ${b(o.y)} A ${e} ${e} 0 1 ${r} ${b(d.x)} ${b(d.y)} A ${e} ${e} 0 1 ${r} ${b(l.x)} ${b(l.y)}`;
  }
  const h = z(i, t, e, s + n), a = Math.abs(n) > 180 ? 1 : 0;
  return `M ${b(o.x)} ${b(o.y)} A ${e} ${e} 0 ${a} ${r} ${b(h.x)} ${b(h.y)}`;
}
class $ extends Error {
}
function _(i, t) {
  if (i == null)
    return {};
  if (typeof i != "object" || Array.isArray(i))
    throw new $(`${t} must be an object`);
  return i;
}
function X(i, t) {
  if (i == null)
    return [];
  if (!Array.isArray(i))
    throw new $(`${t} must be a list`);
  return i.map((e, s) => _(e, `${t}[${s}]`));
}
function p(i, t, e) {
  if (i == null || i === "")
    return t;
  const s = Number(i);
  if (!Number.isFinite(s))
    throw new $(`${e} must be a number`);
  return s;
}
function T(i, t) {
  return i == null || i === "" ? void 0 : p(i, 0, t);
}
function w(i, t) {
  return typeof i == "string" && i !== "" ? i : t;
}
function lt(i, t) {
  return X(i, t).map((e, s) => {
    if (typeof e.color != "string")
      throw new $(`${t}[${s}].color is required`);
    return { when: _(e.when, `${t}[${s}].when`), color: e.color };
  });
}
function Ae(i, t) {
  return i == null || i === "min" ? "min" : i === "centre" || i === "center" ? "centre" : p(i, 0, t);
}
function Ht(i, t, e) {
  if (typeof i.entity != "string" || i.entity === "")
    throw new $(`${t}.entity is required`);
  const s = p(i.min, 0, `${t}.min`), n = p(i.max, 100, `${t}.max`);
  if (s === n)
    throw new $(`${t}.min and ${t}.max must differ`);
  return {
    entity: i.entity,
    attribute: typeof i.attribute == "string" && i.attribute !== "" ? i.attribute : void 0,
    min: s,
    max: n,
    origin: Ae(i.origin, `${t}.origin`),
    reverse: i.reverse === !0,
    clamp: i.clamp !== !1,
    color: w(i.color, e),
    color_rules: lt(i.color_rules, `${t}.color_rules`)
  };
}
function Bt(i, t) {
  if (i == null)
    return;
  const e = _(i, t);
  if (typeof e.icon != "string" || e.icon === "")
    throw new $(`${t}.icon is required`);
  return {
    icon: e.icon,
    x: T(e.x, `${t}.x`),
    y: T(e.y, `${t}.y`),
    size: p(e.size, 24, `${t}.size`),
    color: w(e.color, "#ffffff")
  };
}
function xe(i, t) {
  if (i == null)
    return;
  const e = _(i, t);
  return {
    x: T(e.x, `${t}.x`),
    y: T(e.y, `${t}.y`),
    size: p(e.size, 15, `${t}.size`),
    color: w(e.color, "#ffffff"),
    decimals: p(e.decimals, 0, `${t}.decimals`),
    unit: typeof e.unit == "string" ? e.unit : void 0
  };
}
function Ee(i) {
  const t = _(i, "gauge"), e = p(t.gap, 80, "gauge.gap");
  if (e < 0 || e >= 360)
    throw new $("gauge.gap must be in [0, 360)");
  let s;
  if (t.arc !== void 0 && t.arc !== null) {
    const r = _(t.arc, "gauge.arc");
    s = { start: p(r.start, 0, "gauge.arc.start"), sweep: p(r.sweep, 0, "gauge.arc.sweep") };
  }
  const n = w(t.linecap, "round");
  if (!["butt", "round", "square"].includes(n))
    throw new $("gauge.linecap must be butt, round or square");
  return {
    radius: p(t.radius, 100, "gauge.radius"),
    width: p(t.width, 20, "gauge.width"),
    gap: e,
    rotation: p(t.rotation, 0, "gauge.rotation"),
    arc: s,
    color: w(t.color, "#282828"),
    color_rules: lt(t.color_rules, "gauge.color_rules"),
    spacing: p(t.spacing, 10, "gauge.spacing"),
    linecap: n
  };
}
function Se(i) {
  const t = X(i, "bars");
  if (t.length === 0)
    throw new $("bars must contain at least one bar");
  return t.map((e, s) => ({
    ...Ht(e, `bars[${s}]`, "#5794f2"),
    radius: T(e.radius, `bars[${s}].radius`),
    width: p(e.width, 5, `bars[${s}].width`)
  }));
}
function Ce(i, t) {
  if (i == null)
    return;
  const e = _(i, "secondary"), s = _(e.track, "secondary.track"), n = p(e.padding, 10, "secondary.padding");
  if (kt(Nt(t), n) === null)
    throw new $(
      `secondary does not fit: gauge.gap minus 2 x padding must be at least ${Ut} degrees`
    );
  const r = p(s.width, 15, "secondary.track.width"), o = p(e.inset, 3, "secondary.inset");
  return {
    ...Ht(e, "secondary", "#37c7ff"),
    padding: n,
    radius: T(e.radius, "secondary.radius"),
    width: p(e.width, Math.max(1, r - 2 * o), "secondary.width"),
    track: {
      width: r,
      color: w(s.color, "#1e1e1e"),
      color_rules: lt(s.color_rules, "secondary.track.color_rules")
    },
    icon: Bt(e.icon, "secondary.icon"),
    label: xe(e.label, "secondary.label")
  };
}
function Me(i, t, e) {
  if (i != null)
    return X(i, "center.segments").map((n, r) => {
      const o = w(n.type, "");
      if (!["integer", "fraction", "unit", "text"].includes(o))
        throw new $(`center.segments[${r}].type must be integer, fraction, unit or text`);
      return {
        type: o,
        text: typeof n.text == "string" ? n.text : void 0,
        size: p(n.size, 20, `center.segments[${r}].size`),
        shift: p(n.shift, 0, `center.segments[${r}].shift`),
        color: typeof n.color == "string" ? n.color : void 0
      };
    });
  const s = [{ type: "integer", size: 60, shift: 0 }];
  return t > 0 && s.push({ type: "fraction", size: 30, shift: 0 }), e && s.push({ type: "unit", size: 20, shift: 0 }), s;
}
function ze(i) {
  const t = _(i, "center"), e = p(t.decimals, 0, "center.decimals");
  if (e < 0 || !Number.isInteger(e))
    throw new $("center.decimals must be a non-negative integer");
  const s = w(t.rounding, "floor");
  if (s !== "floor" && s !== "round")
    throw new $("center.rounding must be floor or round");
  const n = typeof t.unit == "string" && t.unit !== "" ? t.unit : void 0;
  return {
    entity: typeof t.entity == "string" && t.entity !== "" ? t.entity : void 0,
    attribute: typeof t.attribute == "string" && t.attribute !== "" ? t.attribute : void 0,
    scale: p(t.scale, 1, "center.scale"),
    decimals: e,
    rounding: s,
    unit: n,
    color: w(t.color, "#ffffff"),
    segments: Me(t.segments, e, n !== void 0)
  };
}
function Pe(i) {
  return X(i, "indicators").map((t, e) => ({ ...Bt(t, `indicators[${e}]`), when: _(t.when, `indicators[${e}].when`) }));
}
function Oe(i) {
  if (i == null)
    return;
  const t = _(i, "action");
  if (typeof t.action != "string")
    throw new $("action.action is required");
  return t;
}
function Re(i) {
  const t = _(i, "config"), e = Ee(t.gauge);
  let s;
  if (t.view !== void 0 && t.view !== null) {
    const n = _(t.view, "view");
    if (s = { width: p(n.width, 0, "view.width"), height: p(n.height, 0, "view.height") }, s.width <= 0 || s.height <= 0)
      throw new $("view.width and view.height must be positive");
  }
  return {
    type: typeof t.type == "string" ? t.type : void 0,
    view: s,
    gauge: e,
    bars: Se(t.bars),
    secondary: Ce(t.secondary, e),
    center: ze(t.center),
    indicators: Pe(t.indicators),
    tap_action: Oe(t.tap_action)
  };
}
function Ue(i) {
  const t = /* @__PURE__ */ new Set(), e = (s) => s.forEach((n) => n.when.entity && t.add(n.when.entity));
  e(i.gauge.color_rules);
  for (const s of i.bars)
    t.add(s.entity), e(s.color_rules);
  i.secondary && (t.add(i.secondary.entity), e(i.secondary.color_rules), e(i.secondary.track.color_rules)), i.center.entity && t.add(i.center.entity);
  for (const s of i.indicators)
    s.when.entity && t.add(s.when.entity);
  return [...t];
}
const Ne = ["unavailable", "unknown"];
function Lt(i, t, e) {
  const s = i.states[t];
  if (!s)
    return;
  const n = e ? s.attributes[e] : s.state;
  if (n != null && !(typeof n == "string" && Ne.includes(n)))
    return n;
}
function J(i, t, e) {
  const s = Lt(i, t, e);
  if (s === void 0)
    return;
  const n = typeof s == "number" ? s : parseFloat(String(s));
  return Number.isFinite(n) ? n : void 0;
}
function It(i, t, e, s) {
  const n = i.entity ?? e, r = i.entity ? i.attribute : i.attribute ?? s;
  if (!n)
    return !1;
  const o = Lt(t, n, r);
  if (i.unavailable !== void 0 && o === void 0 !== i.unavailable || i.state !== void 0 && (o === void 0 || String(o) !== i.state) || i.state_not !== void 0 && (o === void 0 || String(o) === i.state_not))
    return !1;
  if (!(i.gt !== void 0 || i.gte !== void 0 || i.lt !== void 0 || i.lte !== void 0 || i.eq !== void 0 || i.between !== void 0 || i.outside !== void 0))
    return !0;
  const a = J(t, n, r);
  return !(a === void 0 || i.gt !== void 0 && !(a > i.gt) || i.gte !== void 0 && !(a >= i.gte) || i.lt !== void 0 && !(a < i.lt) || i.lte !== void 0 && !(a <= i.lte) || i.eq !== void 0 && a !== i.eq || i.between && !(a >= i.between[0] && a <= i.between[1]) || i.outside && !(a < i.outside[0] || a > i.outside[1]));
}
function q(i, t, e, s, n) {
  for (const r of i)
    if (It(r.when, e, s, n))
      return r.color;
  return t;
}
const ke = 0.78, Te = 0.4, He = 15, xt = 0.36, Be = "—";
function jt(i) {
  const t = i.bars.length;
  return i.bars.map(
    (e, s) => e.radius ?? i.gauge.radius + ((t - 1) / 2 - s) * i.gauge.spacing
  );
}
function Dt(i) {
  if (i.view)
    return i.view;
  const t = i.gauge, e = jt(i);
  let s = t.radius + t.width / 2;
  if (i.bars.forEach((r, o) => {
    s = Math.max(s, e[o] + r.width / 2);
  }), i.secondary) {
    const r = i.secondary;
    s = Math.max(s, (r.radius ?? t.radius) + r.track.width / 2);
  }
  const n = Math.ceil(2 * (s + He));
  return { width: n, height: n };
}
function Le(i, t) {
  const e = i.center, s = Math.abs(t * e.scale), n = 10 ** e.decimals, r = e.rounding === "round" ? Math.round(s * n) : Math.floor(s * n + 1e-9), o = Math.floor(r / n), h = String(r % n).padStart(e.decimals, "0");
  return { integer: (t * e.scale < 0 && r !== 0 ? "-" : "") + String(o), fraction: h };
}
function Ie(i, t) {
  const e = i.center, s = e.segments[0]?.size ?? 20, n = e.entity ?? i.bars[0].entity, r = e.entity ? e.attribute : e.attribute ?? i.bars[0].attribute, o = J(t, n, r);
  if (o === void 0)
    return [{ text: Be, size: s, dy: 0, color: e.color }];
  const h = Le(i, o), a = [];
  let d = 0;
  for (const l of e.segments) {
    let u;
    switch (l.type) {
      case "integer":
        u = h.integer;
        break;
      case "fraction":
        u = e.decimals > 0 ? `.${h.fraction}` : "";
        break;
      case "unit":
        u = e.unit ?? "";
        break;
      default:
        u = l.text ?? "";
    }
    u !== "" && (a.push({ text: u, size: l.size, dy: -(l.shift - d), color: l.color ?? e.color }), d = l.shift);
  }
  return a;
}
function W(i, t, e, s, n, r) {
  return { path: we(i, t, e, r.start, r.sweep), start: r.start, sweep: r.sweep, radius: e, width: s, color: n };
}
function je(i, t) {
  const e = i.gauge, { width: s, height: n } = Dt(i), r = s / 2, o = n / 2, h = Nt(e), a = be(h), d = i.bars[0], l = {
    width: s,
    height: n,
    linecap: e.linecap,
    track: W(
      r,
      o,
      e.radius,
      e.width,
      q(e.color_rules, e.color, t, d.entity, d.attribute),
      h
    ),
    bars: [],
    center: { x: r, y: o + (i.center.segments[0]?.size ?? 20) * xt, runs: [] },
    indicators: []
  }, u = jt(i);
  i.bars.forEach((g, E) => {
    const v = J(t, g.entity, g.attribute), tt = q(g.color_rules, g.color, t, g.entity, g.attribute), S = v === void 0 ? { start: h.start, sweep: 0 } : At(h, g, v);
    l.bars.push(W(r, o, u[E], g.width, tt, S));
  });
  const c = i.secondary;
  if (c) {
    const g = kt(h, c.padding), E = c.radius ?? e.radius;
    l.secondaryTrack = W(
      r,
      o,
      E,
      c.track.width,
      q(c.track.color_rules, c.track.color, t, c.entity, c.attribute),
      g
    );
    const v = J(t, c.entity, c.attribute), tt = v === void 0 ? { start: g.start, sweep: 0 } : At(g, c, v);
    if (l.secondaryBar = W(
      r,
      o,
      E,
      c.width,
      q(c.color_rules, c.color, t, c.entity, c.attribute),
      tt
    ), c.icon) {
      const S = z(r, o, e.radius * ke, a);
      l.secondaryIcon = {
        icon: c.icon.icon,
        x: c.icon.x !== void 0 ? r + c.icon.x : S.x,
        y: c.icon.y !== void 0 ? o + c.icon.y : S.y,
        size: c.icon.size,
        color: c.icon.color
      };
    }
    if (c.label && v !== void 0) {
      const S = z(r, o, E, a), ht = 10 ** c.label.decimals, qt = Math.round(v * ht) / ht;
      l.secondaryLabel = {
        text: `${qt.toFixed(c.label.decimals)}${c.label.unit ?? ""}`,
        x: c.label.x !== void 0 ? r + c.label.x : S.x,
        y: c.label.y !== void 0 ? o + c.label.y : S.y + c.label.size * xt,
        size: c.label.size,
        color: c.label.color
      };
    }
  }
  l.center.runs = Ie(i, t);
  const y = i.indicators.filter((g) => It(g.when, t)), x = z(r, o, e.radius * Te, a);
  return y.forEach((g, E) => {
    const v = (E - (y.length - 1) / 2) * (g.size + 4);
    l.indicators.push({
      icon: g.icon,
      x: g.x !== void 0 ? r + g.x : x.x + v,
      y: g.y !== void 0 ? o + g.y : x.y,
      size: g.size,
      color: g.color
    });
  }), l;
}
const De = 56;
class qe extends U {
  constructor() {
    super(...arguments), this._entities = [], this._tap = () => {
      if (!this._config)
        return;
      const t = this._config.center.entity ?? this._config.bars[0].entity, e = this._config.tap_action ?? { action: "more-info" };
      e.action !== "none" && this.dispatchEvent(
        new CustomEvent("hass-action", {
          bubbles: !0,
          composed: !0,
          detail: { config: { entity: t, tap_action: e }, action: "tap" }
        })
      );
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
      gauge: { radius: 100, width: 20 },
      bars: [{ entity: "", min: 0, max: 100 }]
    };
  }
  static async getConfigElement() {
    return document.createElement("gauge-card-editor");
  }
  setConfig(t) {
    try {
      this._config = Re(t), this._entities = Ue(this._config), this._error = void 0;
    } catch (e) {
      throw e instanceof $ ? new Error(e.message) : e;
    }
  }
  getCardSize() {
    return this._config ? Math.ceil(this._viewHeight() / 50) : 4;
  }
  getGridOptions() {
    return { columns: 6, rows: Math.max(2, Math.round(this._viewHeight() / De)), min_columns: 3, min_rows: 2 };
  }
  shouldUpdate(t) {
    if (!this._config)
      return !1;
    if (t.has("_config") || t.has("_error"))
      return !0;
    const e = t.get("hass");
    return !e || !this.hass ? !0 : this._entities.some((s) => e.states[s] !== this.hass.states[s]);
  }
  render() {
    if (!this._config || !this.hass)
      return f;
    const t = je(this._config, this.hass);
    return V`
      <ha-card @click=${this._tap}>
        <svg viewBox="0 0 ${t.width} ${t.height}" role="img" aria-label=${this._ariaLabel(t)}>
          ${this._arc(t.track, t.linecap, "track")} ${t.secondaryTrack ? this._arc(t.secondaryTrack, t.linecap) : f}
          ${t.secondaryBar ? this._arc(t.secondaryBar, t.linecap) : f}
          ${t.bars.map((e) => this._arc(e, t.linecap))} ${this._center(t)}
          ${t.secondaryIcon ? this._icon(t.secondaryIcon) : f} ${t.indicators.map((e) => this._icon(e))}
          ${t.secondaryLabel ? O`<text x=${t.secondaryLabel.x} y=${t.secondaryLabel.y} font-size=${t.secondaryLabel.size}
                fill=${t.secondaryLabel.color} text-anchor="middle">${t.secondaryLabel.text}</text>` : f}
        </svg>
      </ha-card>
    `;
  }
  _viewHeight() {
    return this._config ? Dt(this._config).height : 250;
  }
  _ariaLabel(t) {
    return t.center.runs.map((e) => e.text).join("");
  }
  _arc(t, e, s = "") {
    return t.path === "" ? f : O`<path class=${s} d=${t.path} fill="none" stroke=${t.color} stroke-width=${t.width}
      stroke-linecap=${e} />`;
  }
  _center(t) {
    return O`<text x=${t.center.x} y=${t.center.y} text-anchor="middle">
      ${t.center.runs.map(
      (e) => O`<tspan font-size=${e.size} dy=${e.dy} fill=${e.color}>${e.text}</tspan>`
    )}
    </text>`;
  }
  _icon(t) {
    if (t.icon.startsWith("M")) {
      const e = t.size / 24;
      return O`<path d=${t.icon} fill=${t.color}
        transform="translate(${t.x - t.size / 2} ${t.y - t.size / 2}) scale(${e})" />`;
    }
    return O`<foreignObject x=${t.x - t.size / 2} y=${t.y - t.size / 2} width=${t.size} height=${t.size}>
      <ha-icon .icon=${t.icon} style="--mdc-icon-size:${t.size}px;color:${t.color};display:flex"></ha-icon>
    </foreignObject>`;
  }
  static {
    this.styles = St`
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
}
customElements.get("gauge-card") || customElements.define("gauge-card", qe);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "gauge-card",
  name: "Gauge Card",
  description: "Configurable multi-bar arc gauge with a secondary bar, centre display and colour rules.",
  preview: !0
});
