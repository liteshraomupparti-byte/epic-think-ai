//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function ee(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var te = ee.prototype = new b();
	te.constructor = ee, _(te, y.prototype), te.isPureReactComponent = !0;
	var ne = Array.isArray;
	function x() {}
	var S = {
		H: null,
		A: null,
		T: null,
		S: null
	}, re = Object.prototype.hasOwnProperty;
	function C(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ie(e, t) {
		return C(e.type, t, e.props);
	}
	function ae(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function oe(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var se = /\/+/g;
	function ce(e, t) {
		return typeof e == "object" && e && e.key != null ? oe("" + e.key) : t.toString(36);
	}
	function le(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(x, x) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function ue(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, ue(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ce(e, 0) : a, ne(o) ? (i = "", c != null && (i = c.replace(se, "$&/") + "/"), ue(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ae(o) && (o = ie(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(se, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ne(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ce(a, u), c += ue(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ce(a, u++), c += ue(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return ue(le(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function de(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return ue(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function w(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var fe = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function pe(e) {
		var t = S.T, n = {};
		n.types = t === null ? null : t.types, S.T = n;
		try {
			var r = e(), i = S.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(x, fe);
		} catch (e) {
			fe(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), S.T = t;
		}
	}
	function me(e) {
		var t = S.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else pe(me.bind(null, e));
	}
	var he = {
		map: de,
		forEach: function(e, t, n) {
			de(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return de(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return de(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ae(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = he, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = ee, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = S, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return S.H.useMemoCache(e);
		}
	}, e.addTransitionType = me, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !re.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return C(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) re.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return C(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ae, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: w
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = pe, e.unstable_useCacheRefresh = function() {
		return S.H.useCacheRefresh();
	}, e.use = function(e) {
		return S.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return S.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return S.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return S.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return S.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return S.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return S.H.useEffectEvent(e);
	}, e.useId = function() {
		return S.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return S.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return S.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return S.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return S.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return S.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return S.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return S.H.useRef(e);
	}, e.useState = function(e) {
		return S.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return S.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return S.H.useTransition();
	}, e.version = "19.3.0";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function ee(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, te || (te = !0, ie());
			else {
				var t = n(l);
				t !== null && se(ee, t.startTime - e);
			}
		}
	}
	var te = !1, ne = -1, x = 5, S = -1;
	function re() {
		return g ? !0 : !(e.unstable_now() - S < x);
	}
	function C() {
		if (g = !1, te) {
			var t = e.unstable_now();
			S = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(ne), ne = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && re());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && se(ee, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ie() : te = !1;
			}
		}
	}
	var ie;
	if (typeof y == "function") ie = function() {
		y(C);
	};
	else if (typeof MessageChannel < "u") {
		var ae = new MessageChannel(), oe = ae.port2;
		ae.port1.onmessage = C, ie = function() {
			oe.postMessage(null);
		};
	} else ie = function() {
		_(C, 0);
	};
	function se(t, n) {
		ne = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : x = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(ne), ne = -1) : h = !0, se(ee, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, te || (te = !0, ie()))), r;
	}, e.unstable_shouldYield = re, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.0";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var ee = null, te = null;
	function ne(e, t, n) {
		return e === n || e === t && (ee = e, !0);
	}
	function x(e, t, n) {
		return e === n ? (te = e, !1) : e === t && (te !== null && (ee = e), !0);
	}
	function S(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function re(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var C = Object.assign, ie = Symbol.for("react.element"), ae = Symbol.for("react.transitional.element"), oe = Symbol.for("react.portal"), se = Symbol.for("react.fragment"), ce = Symbol.for("react.strict_mode"), le = Symbol.for("react.profiler"), ue = Symbol.for("react.consumer"), de = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), fe = Symbol.for("react.suspense"), pe = Symbol.for("react.suspense_list"), me = Symbol.for("react.memo"), he = Symbol.for("react.lazy"), ge = Symbol.for("react.activity"), _e = Symbol.for("react.legacy_hidden"), ve = Symbol.for("react.memo_cache_sentinel"), ye = Symbol.for("react.view_transition"), T = Symbol.for("react.recoverable"), be = Symbol.iterator;
	function xe(e) {
		return typeof e != "object" || !e ? null : (e = be && e[be] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var Se = Symbol.for("react.client.reference");
	function Ce(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === Se ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case se: return "Fragment";
			case le: return "Profiler";
			case ce: return "StrictMode";
			case fe: return "Suspense";
			case pe: return "SuspenseList";
			case ge: return "Activity";
			case ye: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case oe: return "Portal";
			case de: return e.displayName || "Context";
			case ue: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case me: return t = e.displayName || null, t === null ? Ce(e.type) || "Memo" : t;
			case he:
				t = e._payload, e = e._init;
				try {
					return Ce(e(t));
				} catch {}
		}
		return null;
	}
	var we = Array.isArray, E = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Te = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Ee = [], De = -1;
	function O(e) {
		return { current: e };
	}
	function Oe(e) {
		0 > De || (e.current = Ee[De], Ee[De] = null, De--);
	}
	function ke(e, t) {
		De++, Ee[De] = e.current, e.current = t;
	}
	var Ae = O(null), je = O(null), Me = O(null), k = O(null);
	function Ne(e, t) {
		switch (ke(Me, t), ke(je, e), ke(Ae, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Oe(Ae), ke(Ae, e);
	}
	function Pe() {
		Oe(Ae), Oe(je), Oe(Me);
	}
	function A(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, ke(k, e)), t = Ae.current;
		var n = dp(t, e.type);
		t !== n && (ke(je, e), ke(Ae, n));
	}
	function Fe(e) {
		je.current === e && (Oe(Ae), Oe(je)), k.current === e && (Oe(k), sh._currentValue = Te);
	}
	var Ie, Le;
	function Re(e) {
		if (Ie === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ie = t && t[1] || "", Le = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ie + e + Le;
	}
	var ze = !1;
	function Be(e, t) {
		if (!e || ze) return "";
		ze = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			ze = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Re(n) : "";
	}
	function Ve(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Re(e.type);
			case 16: return Re("Lazy");
			case 13: return e.child !== t && t !== null ? Re("Suspense Fallback") : Re("Suspense");
			case 19: return Re("SuspenseList");
			case 0:
			case 15: return Be(e.type, !1);
			case 11: return Be(e.type.render, !1);
			case 1: return Be(e.type, !0);
			case 31: return Re("Activity");
			case 30: return Re("ViewTransition");
			default: return "";
		}
	}
	function He(e) {
		try {
			var t = "", n = null;
			do
				t += Ve(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ue = Object.prototype.hasOwnProperty, We = t.unstable_scheduleCallback, Ge = t.unstable_cancelCallback, j = t.unstable_shouldYield, Ke = t.unstable_requestPaint, qe = t.unstable_now, Je = t.unstable_getCurrentPriorityLevel, Ye = t.unstable_ImmediatePriority, Xe = t.unstable_UserBlockingPriority, Ze = t.unstable_NormalPriority, Qe = t.unstable_LowPriority, $e = t.unstable_IdlePriority, et = t.log, tt = t.unstable_setDisableYieldValue, nt = null, rt = null;
	function M(e) {
		if (typeof et == "function" && tt(e), rt && typeof rt.setStrictMode == "function") try {
			rt.setStrictMode(nt, e);
		} catch {}
	}
	var it = Math.clz32 ? Math.clz32 : st, at = Math.log, ot = Math.LN2;
	function st(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (at(e) / ot | 0) | 0;
	}
	var ct = 256, lt = 262144, ut = 4194304;
	function dt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function ft(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = dt(n))) : i = dt(o) : i = dt(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = dt(n))) : i = dt(o)) : i = dt(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function pt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function mt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - it(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function ht(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function gt() {
		var e = ut;
		return ut <<= 1, !(ut & 62914560) && (ut = 4194304), e;
	}
	function _t(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function vt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function yt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - it(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && bt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function bt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - it(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function xt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - it(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function St(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : Ct(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function Ct(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function wt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function Tt() {
		var e = D.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function Et(e, t) {
		var n = D.p;
		try {
			return D.p = e, t();
		} finally {
			D.p = n;
		}
	}
	var Dt = Math.random().toString(36).slice(2), Ot = "__reactFiber$" + Dt, kt = "__reactProps$" + Dt, At = "__reactContainer$" + Dt, jt = "__reactEvents$" + Dt, Mt = "__reactListeners$" + Dt, Nt = "__reactHandles$" + Dt, Pt = "__reactResources$" + Dt, Ft = "__reactMarker$" + Dt, It = "__reactLoad$" + Dt;
	function Lt(e) {
		delete e[Ot], delete e[kt], delete e[Mt], delete e[Nt];
	}
	function Rt(e) {
		var t;
		if (t = e[Ot]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[At] || n[Ot]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[Ot]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function zt(e) {
		if (e = e[Ot] || e[At]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Bt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Vt(e) {
		var t = e[Pt];
		return t ||= e[Pt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ht(e) {
		e[Ft] = !0;
	}
	function Ut(e) {
		e[It] = void 0;
	}
	var Wt = /* @__PURE__ */ new Set(), Gt = {};
	function Kt(e, t) {
		qt(e, t), qt(e + "Capture", t);
	}
	function qt(e, t) {
		for (Gt[e] = t, e = 0; e < t.length; e++) Wt.add(t[e]);
	}
	var Jt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Yt = {}, Xt = {};
	function Zt(e) {
		return Ue.call(Xt, e) ? !0 : Ue.call(Yt, e) ? !1 : Jt.test(e) ? Xt[e] = !0 : (Yt[e] = !0, !1);
	}
	var N = !1;
	function Qt() {
		var e = N;
		return N = !1, e;
	}
	function $t(e, t, n) {
		if (Zt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function en(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function tn(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function nn(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function rn(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function an(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function on(e) {
		if (!e._valueTracker) {
			var t = rn(e) ? "checked" : "value";
			e._valueTracker = an(e, t, "" + e[t]);
		}
	}
	function sn(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = rn(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var cn = /[\n"\\]/g;
	function ln(e) {
		return e.replace(cn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function un(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + nn(t)) : e.value !== "" + nn(t) && (e.value = "" + nn(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : fn(e, nn(n)) : o === "number" && e.value == t ? fn(e, nn(e.value)) : fn(e, nn(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + nn(s) : e.removeAttribute("name");
	}
	function dn(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				on(e);
				return;
			}
			n = n == null ? "" : "" + nn(n), t = t == null ? n : "" + nn(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), on(e);
	}
	function fn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function pn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + nn(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function mn(e, t, n) {
		if (t != null && (t = "" + nn(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + nn(n);
	}
	function hn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (we(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = nn(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), on(e);
	}
	function gn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var _n = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function vn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || _n.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function yn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", N = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (vn(e, a, r), N = !0);
		} else for (var o in t) t.hasOwnProperty(o) && vn(e, o, t[o]);
	}
	function bn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var xn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), Sn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Cn(e) {
		return Sn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function wn() {}
	var Tn = null;
	function En(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Dn = null, On = null;
	function kn(e) {
		var t = zt(e);
		if (t && (e = t.stateNode)) {
			var n = e[kt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (un(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + ln("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[kt] || null;
								if (!a) throw Error(i(90));
								un(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && sn(r);
					}
					break a;
				case "textarea":
					mn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && pn(e, !!n.multiple, t, !1);
			}
		}
	}
	var An = !1;
	function jn(e, t, n) {
		if (An) return e(t, n);
		An = !0;
		try {
			return e(t);
		} finally {
			if (An = !1, (Dn !== null || On !== null) && (Vd(), Dn && (t = Dn, e = On, On = Dn = null, kn(t), e))) for (t = 0; t < e.length; t++) kn(e[t]);
		}
	}
	function Mn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[kt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var Nn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Pn = !1;
	if (Nn) try {
		var Fn = {};
		Object.defineProperty(Fn, "passive", { get: function() {
			Pn = !0;
		} }), window.addEventListener("test", Fn, Fn), window.removeEventListener("test", Fn, Fn);
	} catch {
		Pn = !1;
	}
	var In = null, Ln = null, Rn = null;
	function zn() {
		if (Rn) return Rn;
		var e, t = Ln, n = t.length, r, i = "value" in In ? In.value : In.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Rn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Bn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Vn() {
		return !0;
	}
	function Hn() {
		return !1;
	}
	function Un(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Vn : Hn, this.isPropagationStopped = Hn, this;
		}
		return C(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Vn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Vn);
			},
			persist: function() {},
			isPersistent: Vn
		}), t;
	}
	var Wn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Gn = Un(Wn), Kn = C({}, Wn, {
		view: 0,
		detail: 0
	}), qn = Un(Kn), Jn, Yn, Xn, Zn = C({}, Kn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: cr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Xn && (Xn && e.type === "mousemove" ? (Jn = e.screenX - Xn.screenX, Yn = e.screenY - Xn.screenY) : Yn = Jn = 0, Xn = e), Jn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Yn;
		}
	}), Qn = Un(Zn), $n = Un(C({}, Zn, { dataTransfer: 0 })), er = Un(C({}, Kn, { relatedTarget: 0 })), tr = Un(C({}, Wn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), nr = Un(C({}, Wn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), rr = Un(C({}, Wn, { data: 0 })), ir = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, ar = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, or = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function sr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = or[e]) ? !!t[e] : !1;
	}
	function cr() {
		return sr;
	}
	var lr = Un(C({}, Kn, {
		key: function(e) {
			if (e.key) {
				var t = ir[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Bn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? ar[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: cr,
		charCode: function(e) {
			return e.type === "keypress" ? Bn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Bn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), ur = Un(C({}, Zn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), dr = Un(C({}, Wn, { submitter: 0 })), fr = Un(C({}, Kn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: cr
	})), pr = Un(C({}, Wn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), mr = Un(C({}, Zn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), hr = Un(C({}, Wn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), gr = [
		9,
		13,
		27,
		32
	], _r = Nn && "CompositionEvent" in window, vr = null;
	Nn && "documentMode" in document && (vr = document.documentMode);
	var yr = Nn && "TextEvent" in window && !vr, br = Nn && (!_r || vr && 8 < vr && 11 >= vr), xr = " ", Sr = !1;
	function Cr(e, t) {
		switch (e) {
			case "keyup": return gr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function wr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var Tr = !1;
	function Er(e, t) {
		switch (e) {
			case "compositionend": return wr(t);
			case "keypress": return t.which === 32 ? (Sr = !0, xr) : null;
			case "textInput": return e = t.data, e === xr && Sr ? null : e;
			default: return null;
		}
	}
	function Dr(e, t) {
		if (Tr) return e === "compositionend" || !_r && Cr(e, t) ? (e = zn(), Rn = Ln = In = null, Tr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return br && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Or = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function kr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Or[e.type] : t === "textarea";
	}
	function Ar(e, t, n, r) {
		Dn ? On ? On.push(r) : On = [r] : Dn = r, t = Yf(t, "onChange"), 0 < t.length && (n = new Gn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var jr = null, Mr = null;
	function Nr(e) {
		Hf(e, 0);
	}
	function Pr(e) {
		if (sn(Bt(e))) return e;
	}
	function Fr(e, t) {
		if (e === "change") return t;
	}
	var Ir = !1;
	if (Nn) {
		var Lr;
		if (Nn) {
			var Rr = "oninput" in document;
			if (!Rr) {
				var zr = document.createElement("div");
				zr.setAttribute("oninput", "return;"), Rr = typeof zr.oninput == "function";
			}
			Lr = Rr;
		} else Lr = !1;
		Ir = Lr && (!document.documentMode || 9 < document.documentMode);
	}
	function Br() {
		jr && (jr.detachEvent("onpropertychange", Vr), Mr = jr = null);
	}
	function Vr(e) {
		if (e.propertyName === "value" && Pr(Mr)) {
			var t = [];
			Ar(t, Mr, e, En(e)), jn(Nr, t);
		}
	}
	function Hr(e, t, n) {
		e === "focusin" ? (Br(), jr = t, Mr = n, jr.attachEvent("onpropertychange", Vr)) : e === "focusout" && Br();
	}
	function Ur(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Pr(Mr);
	}
	function Wr(e, t) {
		if (e === "click") return Pr(t);
	}
	function Gr(e, t) {
		if (e === "input" || e === "change") return Pr(t);
	}
	function Kr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var qr = typeof Object.is == "function" ? Object.is : Kr;
	function Jr(e, t) {
		if (qr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ue.call(t, i) || !qr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Yr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Xr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Zr(e, t) {
		var n = Xr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Xr(n);
		}
	}
	function Qr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Qr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function $r(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Yr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Yr(e.document);
		}
		return t;
	}
	function P(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var ei = Nn && "documentMode" in document && 11 >= document.documentMode, ti = null, ni = null, ri = null, ii = !1;
	function ai(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ii || ti == null || ti !== Yr(r) || (r = ti, "selectionStart" in r && P(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), ri && Jr(ri, r) || (ri = r, r = Yf(ni, "onSelect"), 0 < r.length && (t = new Gn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = ti)));
	}
	function oi(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var si = {
		animationend: oi("Animation", "AnimationEnd"),
		animationiteration: oi("Animation", "AnimationIteration"),
		animationstart: oi("Animation", "AnimationStart"),
		transitionrun: oi("Transition", "TransitionRun"),
		transitionstart: oi("Transition", "TransitionStart"),
		transitioncancel: oi("Transition", "TransitionCancel"),
		transitionend: oi("Transition", "TransitionEnd")
	}, ci = {}, li = {};
	Nn && (li = document.createElement("div").style, "AnimationEvent" in window || (delete si.animationend.animation, delete si.animationiteration.animation, delete si.animationstart.animation), "TransitionEvent" in window || delete si.transitionend.transition);
	function ui(e) {
		if (ci[e]) return ci[e];
		if (!si[e]) return e;
		var t = si[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in li) return ci[e] = t[n];
		return e;
	}
	var di = ui("animationend"), fi = ui("animationiteration"), pi = ui("animationstart"), mi = ui("transitionrun"), hi = ui("transitionstart"), gi = ui("transitioncancel"), _i = ui("transitionend"), vi = /* @__PURE__ */ new Map(), yi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	yi.push("scrollEnd");
	function bi(e, t) {
		vi.set(e, t), Kt(t, [e]);
	}
	var xi = 0;
	function Si(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = Sd.identifierPrefix;
		var n = xi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function Ci(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Ad;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function wi(e, t) {
		return e = Ci(e), t = Ci(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var Ti = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Ei = [], Di = 0, Oi = 0;
	function ki() {
		for (var e = Di, t = Oi = Di = 0; t < e;) {
			var n = Ei[t];
			Ei[t++] = null;
			var r = Ei[t];
			Ei[t++] = null;
			var i = Ei[t];
			Ei[t++] = null;
			var a = Ei[t];
			if (Ei[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ni(n, i, a);
		}
	}
	function Ai(e, t, n, r) {
		Ei[Di++] = e, Ei[Di++] = t, Ei[Di++] = n, Ei[Di++] = r, Oi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ji(e, t, n, r) {
		return Ai(e, t, n, r), Pi(e);
	}
	function Mi(e, t) {
		return Ai(e, null, null, t), Pi(e);
	}
	function Ni(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - it(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Pi(e) {
		if (50 < jd) throw jd = 0, Md = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Fi = {};
	function Ii(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Li(e, t, n, r) {
		return new Ii(e, t, n, r);
	}
	function Ri(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function zi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Bi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Vi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ri(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Ae.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ge: return e = Li(31, n, t, a), e.elementType = ge, e.lanes = o, e;
			case se: return Hi(n.children, a, o, t);
			case ce:
				s = 8, a |= 24;
				break;
			case le: return e = Li(12, n, t, a | 2), e.elementType = le, e.lanes = o, e;
			case fe: return e = Li(13, n, t, a), e.elementType = fe, e.lanes = o, e;
			case pe: return e = Li(19, n, t, a), e.elementType = pe, e.lanes = o, e;
			case _e:
			case ye: return e = a | 32, e = Li(30, n, t, e), e.elementType = ye, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case de:
						s = 10;
						break a;
					case ue:
						s = 9;
						break a;
					case w:
						s = 11;
						break a;
					case me:
						s = 14;
						break a;
					case he:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Li(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Hi(e, t, n, r) {
		return e = Li(7, e, r, t), e.lanes = n, e;
	}
	function Ui(e, t, n) {
		return e = Li(6, e, null, t), e.lanes = n, e;
	}
	function Wi(e) {
		var t = Li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Gi(e, t, n) {
		return t = Li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ki = /* @__PURE__ */ new WeakMap();
	function qi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ki.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: He(t)
			}, Ki.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: He(t)
		};
	}
	var Ji = [], Yi = 0, Xi = null, Zi = 0, Qi = [], $i = 0, ea = null, ta = 1, na = "";
	function ra(e, t) {
		Ji[Yi++] = Zi, Ji[Yi++] = Xi, Xi = e, Zi = t;
	}
	function ia(e, t, n) {
		Qi[$i++] = ta, Qi[$i++] = na, Qi[$i++] = ea, ea = e;
		var r = ta;
		e = na;
		var i = 32 - it(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - it(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, ta = 1 << 32 - it(t) + i | n << i | r, na = a + e;
		} else ta = 1 << a | n << i | r, na = e;
	}
	function aa(e) {
		e.return !== null && (ra(e, 1), ia(e, 1, 0));
	}
	function oa(e) {
		for (; e === Xi;) Xi = Ji[--Yi], Ji[Yi] = null, Zi = Ji[--Yi], Ji[Yi] = null;
		for (; e === ea;) ea = Qi[--$i], Qi[$i] = null, na = Qi[--$i], Qi[$i] = null, ta = Qi[--$i], Qi[$i] = null;
	}
	function sa(e, t) {
		Qi[$i++] = ta, Qi[$i++] = na, Qi[$i++] = ea, ta = t.id, na = t.overflow, ea = e;
	}
	var ca = null, F = null, I = !1, la = null, ua = !1, da = Error(i(519));
	function fa(e) {
		throw va(qi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), da;
	}
	function pa(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Ot] = e, t[kt] = r, n) {
			case "dialog":
				Z("cancel", t), Z("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Z("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Bf.length; n++) Z(Bf[n], t);
				break;
			case "source":
				Z("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Z("error", t), Z("load", t);
				break;
			case "details":
				Z("toggle", t);
				break;
			case "input":
				Z("invalid", t), dn(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Z("invalid", t);
				break;
			case "textarea": Z("invalid", t), hn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || tp(t.textContent, n) ? (r.popover != null && (Z("beforetoggle", t), Z("toggle", t)), r.onScroll != null && Z("scroll", t), r.onScrollEnd != null && Z("scrollend", t), r.onClick != null && (t.onclick = wn), t = !0) : t = !1, t || fa(e, !0);
	}
	function ma(e) {
		for (ca = e.return; ca;) switch (ca.tag) {
			case 5:
			case 31:
			case 13:
				ua = !1;
				return;
			case 27:
			case 3:
				ua = !0;
				return;
			default: ca = ca.return;
		}
	}
	function ha(e) {
		if (e !== ca) return !1;
		if (!I) return ma(e), I = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && F && fa(e), ma(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			F = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			F = dm(e);
		} else t === 27 ? (t = F, Sp(e.type) ? (e = um, um = null, F = e) : F = t) : F = ca ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ga() {
		F = ca = null, I = !1;
	}
	function _a() {
		var e = la;
		return e !== null && (md === null ? md = e : md.push.apply(md, e), la = null), e;
	}
	function va(e) {
		la === null ? la = [e] : la.push(e);
	}
	var ya = O(null), ba = null, xa = null;
	function Sa(e, t, n) {
		ke(ya, t._currentValue), t._currentValue = n;
	}
	function Ca(e) {
		e._currentValue = ya.current, Oe(ya);
	}
	function wa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Ta(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), wa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), wa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), wa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Ea(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					qr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === k.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && Ta(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Da(e) {
		for (e = e.firstContext; e !== null;) {
			if (!qr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Oa(e) {
		ba = e, xa = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ka(e) {
		return ja(ba, e);
	}
	function Aa(e, t) {
		return ba === null && Oa(e), ja(e, t);
	}
	function ja(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, xa === null) {
			if (e === null) throw Error(i(308));
			xa = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else xa = xa.next = t;
		return n;
	}
	var Ma = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Na = t.unstable_scheduleCallback, Pa = t.unstable_NormalPriority, Fa = {
		$$typeof: de,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ia() {
		return {
			controller: new Ma(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function La(e) {
		e.refCount--, e.refCount === 0 && Na(Pa, function() {
			e.controller.abort();
		});
	}
	function Ra(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var za = null;
	function Ba(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Va = null, Ha = 0, Ua = 0, Wa = null;
	function Ga(e, t) {
		if (Va === null) {
			var n = Va = [];
			Ha = 0, Ua = Ff(), Wa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ha++, t.then(Ka, Ka), t;
	}
	function Ka() {
		if (--Ha === 0 && (za = null, Va !== null)) {
			Wa !== null && (Wa.status = "fulfilled");
			var e = Va;
			Va = null, Ua = 0, Wa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function qa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ja = E.S;
	E.S = function(e, t) {
		if (_d = qe(), typeof t == "object" && t && typeof t.then == "function" && Ga(e, t), za !== null) for (var n = xf; n !== null;) Ra(n, za), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = xf; r !== null;) Ra(r, n), r = r.next;
			if (Ua !== 0) {
				r = za, r === null && (r = za = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ja !== null && Ja(e, t);
	};
	var Ya = O(null);
	function Xa() {
		var e = Ya.current;
		return e === null ? td.pooledCache : e;
	}
	function Za(e, t) {
		t === null ? ke(Ya, Ya.current) : ke(Ya, t.pool);
	}
	function Qa() {
		var e = Xa();
		return e === null ? null : {
			parent: Fa._currentValue,
			pool: e
		};
	}
	var $a = Error(i(460)), eo = Error(i(474)), to = Error(i(542)), no = { then: function() {} };
	function ro(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function io(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(wn, wn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, co(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(wn, wn);
				else {
					if (e = td, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, co(e), e;
				}
				throw oo = t, $a;
		}
	}
	function ao(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (oo = e, $a) : e;
		}
	}
	var oo = null;
	function so() {
		if (oo === null) throw Error(i(459));
		var e = oo;
		return oo = null, e;
	}
	function co(e) {
		if (e === $a || e === to) throw Error(i(483));
	}
	var lo = null, uo = 0;
	function fo(e) {
		var t = uo;
		return uo += 1, lo === null && (lo = []), io(lo, e, t);
	}
	function po(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function mo(e, t) {
		throw t.$$typeof === ie ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ho(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = zi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ui(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === se ? (e = d(e, t, n.props.children, r, n.key), po(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === he && ao(i) === t.type) ? (t = a(t, n.props), po(t, n), t.return = e, t) : (t = Vi(n.type, n.key, n.props, null, e.mode, r), po(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Gi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Hi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ui("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case ae: return n = Vi(t.type, t.key, t.props, null, e.mode, n), po(n, t), n.return = e, n;
					case oe: return t = Gi(t, e.mode, n), t.return = e, t;
					case he: return t = ao(t), f(e, t, n);
				}
				if (we(t) || xe(t)) return t = Hi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, fo(t), n);
				if (t.$$typeof === de) return f(e, Aa(e, t), n);
				mo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case ae: return n.key === i ? l(e, t, n, r) : null;
					case oe: return n.key === i ? u(e, t, n, r) : null;
					case he: return n = ao(n), p(e, t, n, r);
				}
				if (we(n) || xe(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, fo(n), r);
				if (n.$$typeof === de) return p(e, t, Aa(e, n), r);
				mo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case ae: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case oe: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case he: return r = ao(r), m(e, t, n, r, i);
				}
				if (we(r) || xe(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, fo(r), i);
				if (r.$$typeof === de) return m(e, t, n, Aa(t, r), i);
				mo(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), I && ra(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return I && ra(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), I && ra(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), I && ra(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return I && ra(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), I && ra(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === se && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case ae:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === se) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), po(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === he && ao(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), po(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === se ? (c = Hi(o.props.children, e.mode, c, o.key), po(c, o), c.return = e, e = c) : (c = Vi(o.type, o.key, o.props, null, e.mode, c), po(c, o), c.return = e, e = c);
						}
						return s(e);
					case oe:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Gi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case he: return o = ao(o), _(e, r, o, c);
				}
				if (we(o)) return h(e, r, o, c);
				if (xe(o)) {
					if (l = xe(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, fo(o), c);
				if (o.$$typeof === de) return _(e, r, Aa(e, o), c);
				mo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Ui(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				uo = 0;
				var i = _(e, t, n, r);
				return lo = null, i;
			} catch (t) {
				if (t === $a || t === to) throw t;
				var a = Li(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var go = ho(!0), _o = ho(!1), vo = !1;
	function yo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function bo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function xo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function So(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, G & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Pi(e), Ni(e, null, n), t;
		}
		return Ai(e, r, t, n), Pi(e);
	}
	function Co(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, xt(e, n);
		}
	}
	function wo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var To = !1;
	function Eo() {
		if (To) {
			var e = Wa;
			if (e !== null) throw e;
		}
	}
	function Do(e, t, n, r) {
		To = !1;
		var i = e.updateQueue;
		vo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (q & f) === f : (r & f) === f) {
					f !== 0 && f === Ua && (To = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = C({}, d, f);
								break a;
							case 2: vo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), cd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Oo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function ko(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Oo(n[e], t);
	}
	var Ao = O(null), jo = O(0);
	function Mo(e, t) {
		e = od, ke(jo, e), ke(Ao, t), od = e | t.baseLanes;
	}
	function No() {
		ke(jo, od), ke(Ao, Ao.current);
	}
	function Po() {
		od = jo.current, Oe(Ao), Oe(jo);
	}
	var Fo = O(null), Io = null;
	function Lo(e) {
		var t = e.alternate;
		ke(Ho, Ho.current & 1), ke(Fo, e), Io === null && (t === null || Ao.current !== null || t.memoizedState !== null) && (Io = e);
	}
	function Ro(e) {
		ke(Ho, Ho.current), ke(Fo, e), Io === null && (Io = e);
	}
	function zo(e) {
		e.tag === 22 ? (ke(Ho, Ho.current), ke(Fo, e), Io === null && (Io = e)) : Bo();
	}
	function Bo() {
		ke(Ho, Ho.current), ke(Fo, Fo.current);
	}
	function Vo(e) {
		Oe(Fo), Io === e && (Io = null), Oe(Ho);
	}
	var Ho = O(0);
	function Uo(e, t) {
		ke(Fo, Fo.current), ke(Ho, t);
	}
	function Wo(e) {
		Oe(Ho), Oe(Fo), Io === e && (Io = null);
	}
	function Go(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Ko = 0, L = null, R = null, qo = null, Jo = !1, Yo = !1, Xo = !1, Zo = 0, Qo = 0, $o = null, es = 0;
	function ts() {
		throw Error(i(321));
	}
	function ns(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!qr(e[n], t[n])) return !1;
		return !0;
	}
	function rs(e, t, n, r, i, a) {
		return Ko = a, L = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = e === null || e.memoizedState === null ? bc : xc, Xo = !1, a = n(r, i), Xo = !1, Yo && (a = as(t, n, r, i)), is(e), a;
	}
	function is(e) {
		E.H = yc;
		var t = R !== null && R.next !== null;
		if (Ko = 0, qo = R = L = null, Jo = !1, Qo = 0, $o = null, t) throw Error(i(300));
		e === null || Rc || (e = e.dependencies, e !== null && Da(e) && (Rc = !0));
	}
	function as(e, t, n, r) {
		L = e;
		var a = 0;
		do {
			if (Yo && ($o = null), Qo = 0, Yo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, qo = R = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			E.H = Sc, o = t(n, r);
		} while (Yo);
		return o;
	}
	function os() {
		var e = E.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ps(t) : t, e = e.useState()[0], (R === null ? null : R.memoizedState) !== e && (L.flags |= 1024), t;
	}
	function ss() {
		var e = Zo !== 0;
		return Zo = 0, e;
	}
	function cs(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function ls(e) {
		if (Jo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Jo = !1;
		}
		Ko = 0, qo = R = L = null, Yo = !1, Qo = Zo = 0, $o = null;
	}
	function us() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return qo === null ? L.memoizedState = qo = e : qo = qo.next = e, qo;
	}
	function ds() {
		if (R === null) {
			var e = L.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = R.next;
		var t = qo === null ? L.memoizedState : qo.next;
		if (t !== null) qo = t, R = e;
		else {
			if (e === null) throw L.alternate === null ? Error(i(467)) : Error(i(310));
			R = e, e = {
				memoizedState: R.memoizedState,
				baseState: R.baseState,
				baseQueue: R.baseQueue,
				queue: R.queue,
				next: null
			}, qo === null ? L.memoizedState = qo = e : qo = qo.next = e;
		}
		return qo;
	}
	function fs() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ps(e) {
		var t = Qo;
		return Qo += 1, $o === null && ($o = []), e = io($o, e, t), t = L, (qo === null ? t.memoizedState : qo.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? bc : xc), e;
	}
	function ms(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ps(e);
			if (e.$$typeof === T) return;
			if (e.$$typeof === de) return ka(e);
		}
		throw Error(i(438, String(e)));
	}
	function hs(e) {
		var t = null, n = L.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = L.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = fs(), L.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ve;
		return t.index++, n;
	}
	function gs(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function _s(e) {
		return vs(ds(), R, e);
	}
	function vs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Ko & f) === f : (q & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ua && (d = !0);
					else if ((Ko & p) === p) {
						u = u.next, p === Ua && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, L.lanes |= p, cd |= p;
					f = u.action, Xo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, L.lanes |= f, cd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !qr(o, e.memoizedState) && (Rc = !0, d && (n = Wa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ys(e) {
		var t = ds(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			qr(o, t.memoizedState) || (Rc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function bs(e, t, n) {
		var r = L, a = ds(), o = I;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !qr((R || a).memoizedState, n);
		if (s && (a.memoizedState = n, Rc = !0), a = a.queue, Gs(Cs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || qo !== null && !!(qo.memoizedState.tag & 1), Bs(e ? 9 : 8, { destroy: void 0 }, Ss.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, td === null) throw Error(i(349));
			o || Ko & 127 || xs(r, t, n);
		}
		return n;
	}
	function xs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = L.updateQueue, t === null ? (t = fs(), L.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Ss(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ws(t) && Ts(e);
	}
	function Cs(e, t, n) {
		return n(function() {
			ws(t) && Ts(e);
		});
	}
	function ws(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !qr(e, n);
		} catch {
			return !0;
		}
	}
	function Ts(e) {
		var t = Mi(e, 2);
		t !== null && Id(t, e, 2);
	}
	function Es(e) {
		var t = us();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Xo) {
				M(!0);
				try {
					n();
				} finally {
					M(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: gs,
			lastRenderedState: e
		}, t;
	}
	function Ds(e, t, n, r) {
		return e.baseState = n, vs(e, R, typeof r == "function" ? r : gs);
	}
	function Os(e, t, n, r, a) {
		if (gc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			E.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ks(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ks(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = E.T, o = {};
			o.types = a === null ? null : a.types, E.T = o;
			try {
				var s = n(i, r), c = E.S;
				c !== null && c(o, s), As(e, t, s);
			} catch (n) {
				Ms(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), E.T = a;
			}
		} else try {
			a = n(i, r), As(e, t, a);
		} catch (n) {
			Ms(e, t, n);
		}
	}
	function As(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			js(e, t, n);
		}, function(n) {
			return Ms(e, t, n);
		}) : js(e, t, n);
	}
	function js(e, t, n) {
		t.status = "fulfilled", t.value = n, Ns(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ks(e, n)));
	}
	function Ms(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ns(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ns(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Ps(e, t) {
		return t;
	}
	function Fs(e, t) {
		if (I) {
			var n = td.formState;
			if (n !== null) {
				a: {
					var r = L;
					if (I) {
						if (F) {
							b: {
								for (var i = F, a = ua; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = lm(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								F = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						fa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = us(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ps,
			lastRenderedState: t
		}, n.queue = r, n = pc.bind(null, L, r), r.dispatch = n, r = Es(!1), a = hc.bind(null, L, !1, r.queue), r = us(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Os.bind(null, L, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Is(e) {
		return Ls(ds(), R, e);
	}
	function Ls(e, t, n) {
		if (t = vs(e, t, Ps)[0], e = _s(gs)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ps(t);
		} catch (e) {
			throw e === $a ? to : e;
		}
		else r = t;
		t = ds();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (L.flags |= 2048, Bs(9, { destroy: void 0 }, Rs.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Rs(e, t) {
		e.action = t;
	}
	function zs(e) {
		var t = ds(), n = R;
		if (n !== null) return Ls(t, n, e);
		ds(), t = t.memoizedState, n = ds();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Bs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = L.updateQueue, t === null && (t = fs(), L.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Vs() {
		return ds().memoizedState;
	}
	function Hs(e, t, n, r) {
		var i = us();
		L.flags |= e, i.memoizedState = Bs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Us(e, t, n, r) {
		var i = ds();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		R !== null && r !== null && ns(r, R.memoizedState.deps) ? i.memoizedState = Bs(t, a, n, r) : (L.flags |= e, i.memoizedState = Bs(1 | t, a, n, r));
	}
	function Ws(e, t) {
		Hs(8390656, 8, e, t);
	}
	function Gs(e, t) {
		Us(2048, 8, e, t);
	}
	function Ks(e) {
		L.flags |= 4;
		var t = L.updateQueue;
		if (t === null) t = fs(), L.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function qs(e) {
		var t = ds().memoizedState;
		return Ks({
			ref: t,
			nextImpl: e
		}), function() {
			if (G & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Js(e, t) {
		return Us(4, 2, e, t);
	}
	function Ys(e, t) {
		return Us(4, 4, e, t);
	}
	function Xs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Zs(e, t, n) {
		n = n == null ? null : n.concat([e]), Us(4, 4, Xs.bind(null, t, e), n);
	}
	function Qs() {}
	function $s(e, t) {
		var n = ds();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && ns(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ec(e, t) {
		var n = ds();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && ns(t, r[1])) return r[0];
		if (r = e(), Xo) {
			M(!0);
			try {
				e();
			} finally {
				M(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function tc(e, t, n) {
		return n === void 0 || Ko & 1073741824 && !(q & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Pd(), L.lanes |= e, cd |= e, n);
	}
	function nc(e, t, n, r) {
		return qr(n, t) ? n : Ao.current === null ? !(Ko & 106) || Ko & 1073741824 && !(q & 261930) ? (Rc = !0, e.memoizedState = n) : (e = Pd(), L.lanes |= e, cd |= e, t) : (e = tc(e, n, r), qr(e, t) || (Rc = !0), e);
	}
	function rc(e, t, n, r, i) {
		var a = D.p;
		D.p = a !== 0 && 8 > a ? a : 8;
		var o = E.T, s = {};
		s.types = o === null ? null : o.types, E.T = s, hc(e, !1, t, n);
		try {
			var c = i(), l = E.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? mc(e, t, qa(c, r), Nd(e)) : mc(e, t, r, Nd(e));
		} catch (n) {
			mc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Nd());
		} finally {
			D.p = a, o !== null && s.types !== null && (o.types = s.types), E.T = o;
		}
	}
	function ic() {}
	function ac(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = oc(e).queue;
		rc(e, a, t, Te, n === null ? ic : function() {
			return sc(e), n(r);
		});
	}
	function oc(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: Te,
			baseState: Te,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: gs,
				lastRenderedState: Te
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: gs,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function sc(e) {
		var t = oc(e);
		t.next === null && (t = e.alternate.memoizedState), mc(e, t.next.queue, {}, Nd());
	}
	function cc() {
		return ka(sh);
	}
	function lc() {
		return ds().memoizedState;
	}
	function uc() {
		return ds().memoizedState;
	}
	function dc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Nd();
					e = xo(n);
					var r = So(t, e, n);
					r !== null && (Id(r, t, n), Co(r, t, n)), t = { cache: Ia() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function fc(e, t, n) {
		var r = Nd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, gc(e) ? _c(t, n) : (n = ji(e, t, n, r), n !== null && (Id(n, e, r), vc(n, t, r)));
	}
	function pc(e, t, n) {
		mc(e, t, n, Nd());
	}
	function mc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (gc(e)) _c(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, qr(s, o)) return Ai(e, t, i, 0), td === null && ki(), !1;
			} catch {}
			if (n = ji(e, t, i, r), n !== null) return Id(n, e, r), vc(n, t, r), !0;
		}
		return !1;
	}
	function hc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Ff(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, gc(e)) {
			if (t) throw Error(i(479));
		} else t = ji(e, n, r, 2), t !== null && Id(t, e, 2);
	}
	function gc(e) {
		var t = e.alternate;
		return e === L || t !== null && t === L;
	}
	function _c(e, t) {
		Yo = Jo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function vc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, xt(e, n);
		}
	}
	var yc = {
		readContext: ka,
		use: ms,
		useCallback: ts,
		useContext: ts,
		useEffect: ts,
		useImperativeHandle: ts,
		useLayoutEffect: ts,
		useInsertionEffect: ts,
		useMemo: ts,
		useReducer: ts,
		useRef: ts,
		useState: ts,
		useDebugValue: ts,
		useDeferredValue: ts,
		useTransition: ts,
		useSyncExternalStore: ts,
		useId: ts,
		useHostTransitionStatus: ts,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: ts,
		useMemoCache: ts,
		useCacheRefresh: ts,
		useEffectEvent: ts
	}, bc = {
		readContext: ka,
		use: ms,
		useCallback: function(e, t) {
			return us().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ka,
		useEffect: Ws,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Hs(4194308, 4, Xs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Hs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Hs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = us();
			t = t === void 0 ? null : t;
			var r = e();
			if (Xo) {
				M(!0);
				try {
					e();
				} finally {
					M(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = us();
			if (n !== void 0) {
				var i = n(t);
				if (Xo) {
					M(!0);
					try {
						n(t);
					} finally {
						M(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = fc.bind(null, L, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = us();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Es(e);
			var t = e.queue, n = pc.bind(null, L, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Qs,
		useDeferredValue: function(e, t) {
			return tc(us(), e, t);
		},
		useTransition: function() {
			var e = Es(!1);
			return e = rc.bind(null, L, e.queue, !0, !1), us().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = L, a = us();
			if (I) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), td === null) throw Error(i(349));
				q & 127 || xs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ws(Cs.bind(null, r, o, e), [e]), r.flags |= 2048, Bs(9, { destroy: void 0 }, Ss.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = us(), t = td.identifierPrefix;
			if (I) {
				var n = na, r = ta;
				n = (r & ~(1 << 32 - it(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Zo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = es++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: cc,
		useFormState: Fs,
		useActionState: Fs,
		useOptimistic: function(e) {
			var t = us();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = hc.bind(null, L, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: hs,
		useCacheRefresh: function() {
			return us().memoizedState = dc.bind(null, L);
		},
		useEffectEvent: function(e) {
			var t = us(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (G & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, xc = {
		readContext: ka,
		use: ms,
		useCallback: $s,
		useContext: ka,
		useEffect: Gs,
		useImperativeHandle: Zs,
		useInsertionEffect: Js,
		useLayoutEffect: Ys,
		useMemo: ec,
		useReducer: _s,
		useRef: Vs,
		useState: function() {
			return _s(gs);
		},
		useDebugValue: Qs,
		useDeferredValue: function(e, t) {
			return nc(ds(), R.memoizedState, e, t);
		},
		useTransition: function() {
			var e = _s(gs)[0], t = ds().memoizedState;
			return [typeof e == "boolean" ? e : ps(e), t];
		},
		useSyncExternalStore: bs,
		useId: lc,
		useHostTransitionStatus: cc,
		useFormState: Is,
		useActionState: Is,
		useOptimistic: function(e, t) {
			return Ds(ds(), R, e, t);
		},
		useMemoCache: hs,
		useCacheRefresh: uc,
		useEffectEvent: qs
	}, Sc = {
		readContext: ka,
		use: ms,
		useCallback: $s,
		useContext: ka,
		useEffect: Gs,
		useImperativeHandle: Zs,
		useInsertionEffect: Js,
		useLayoutEffect: Ys,
		useMemo: ec,
		useReducer: ys,
		useRef: Vs,
		useState: function() {
			return ys(gs);
		},
		useDebugValue: Qs,
		useDeferredValue: function(e, t) {
			var n = ds();
			return R === null ? tc(n, e, t) : nc(n, R.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ys(gs)[0], t = ds().memoizedState;
			return [typeof e == "boolean" ? e : ps(e), t];
		},
		useSyncExternalStore: bs,
		useId: lc,
		useHostTransitionStatus: cc,
		useFormState: zs,
		useActionState: zs,
		useOptimistic: function(e, t) {
			var n = ds();
			return R === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ds(n, R, e, t);
		},
		useMemoCache: hs,
		useCacheRefresh: uc,
		useEffectEvent: qs
	};
	function Cc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : C({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var wc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Nd(), i = xo(r);
			i.payload = t, n != null && (i.callback = n), t = So(e, i, r), t !== null && (Id(t, e, r), Co(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Nd(), i = xo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = So(e, i, r), t !== null && (Id(t, e, r), Co(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Nd(), r = xo(n);
			r.tag = 2, t != null && (r.callback = t), t = So(e, r, n), t !== null && (Id(t, e, n), Co(t, e, n));
		}
	};
	function Tc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Jr(n, r) || !Jr(i, a) : !0;
	}
	function Ec(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wc.enqueueReplaceState(t, t.state, null);
	}
	function Dc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = C({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Oc(e) {
		Ti(e);
	}
	function kc(e) {
		console.error(e);
	}
	function Ac(e) {
		Ti(e);
	}
	function jc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Mc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Nc(e, t, n) {
		return n = xo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			jc(e, t);
		}, n;
	}
	function Pc(e) {
		return e = xo(e), e.tag = 3, e;
	}
	function Fc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Mc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Mc(t, n, r), typeof i != "function" && (bd === null ? bd = /* @__PURE__ */ new Set([this]) : bd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ic(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Ea(t, n, a, !0), n = Fo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Io === null ? Jd() : n.alternate === null && sd === 0 && (sd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === no ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), X(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === no ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), X(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return X(e, r, a), Jd(), !1;
		}
		if (I) return t = Fo.current, t === null ? (r !== da && (t = Error(i(423), { cause: r }), va(qi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = qi(r, n), a = Nc(e.stateNode, r, a), wo(e, a), sd !== 4 && (sd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== da && (e = Error(i(422), { cause: r }), va(qi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = qi(o, n), pd === null ? pd = [o] : pd.push(o), sd !== 4 && (sd = 2), t === null) return !0;
		r = qi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Nc(n.stateNode, r, e), wo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (bd === null || !bd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Pc(a), Fc(a, e, n, r), wo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Lc = Error(i(461)), Rc = !1;
	function zc(e, t, n, r) {
		t.child = e === null ? _o(t, null, n, r) : go(t, e.child, n, r);
	}
	function Bc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Oa(t), r = rs(e, t, n, o, a, i), s = ss(), e !== null && !Rc ? (cs(e, t, i), ml(e, t, i)) : (I && s && aa(t), t.flags |= 1, zc(e, t, r, i), t.child);
	}
	function Vc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ri(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Hc(e, t, a, r, i)) : (e = Vi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !hl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Jr : n, n(o, r) && e.ref === t.ref) return ml(e, t, i);
		}
		return t.flags |= 1, e = zi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Hc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Jr(a, r) && e.ref === t.ref) {
				if (Rc = !1, t.pendingProps = r = a, hl(e, i)) e.flags & 131072 && (Rc = !0);
				else return t.lanes = e.lanes, ml(e, t, i);
			}
		}
		return Xc(e, t, n, r, i);
	}
	function Uc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Gc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Za(t, a === null ? null : a.cachePool), a === null ? No() : Mo(t, a), zo(t);
			else return r = t.lanes = 536870912, Gc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Za(t, null), No(), Bo()) : (Za(t, a.cachePool), Mo(t, a), Bo(), t.memoizedState = null);
		return zc(e, t, i, n), t.child;
	}
	function Wc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Gc(e, t, n, r, i) {
		var a = Xa();
		return a = a === null ? null : {
			parent: Fa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Za(t, null), No(), zo(t), e !== null && Ea(e, t, r, !0), t.childLanes = i, null;
	}
	function Kc(e, t) {
		return t = al({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function qc(e, t, n) {
		return go(t, e.child, null, n), e = Kc(t, t.pendingProps), e.flags |= 2, Vo(t), t.memoizedState = null, e;
	}
	function Jc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (I) {
				if (r.mode === "hidden") return e = Kc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Wc(null, e);
				if (Ro(t), (e = F) ? (e = am(e, ua), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ea === null ? null : {
						id: ta,
						overflow: na
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Wi(e), n.return = t, t.child = n, ca = t, F = null)) : e = null, e === null) throw fa(t);
				return t.lanes = 536870912, null;
			}
			return Kc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Ro(t), a) {
				if (t.flags & 256) t.flags &= -257, t = qc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Rc || Ea(e, t, n, !1), a = (n & e.childLanes) !== 0, Rc || a) {
				if (Ao.current === null) {
					if (r = td, r !== null && (s = St(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Mi(e, s), Id(r, e, s), Lc;
					Jd();
				}
				t = qc(e, t, n);
			} else e = o.treeContext, F = lm(s.nextSibling), ca = t, I = !0, la = null, ua = !1, e !== null && sa(t, e), t = Kc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = zi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Yc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Xc(e, t, n, r, i) {
		return Oa(t), n = rs(e, t, n, r, void 0, i), r = ss(), e !== null && !Rc ? (cs(e, t, i), ml(e, t, i)) : (I && r && aa(t), t.flags |= 1, zc(e, t, n, i), t.child);
	}
	function Zc(e, t, n, r, i, a) {
		return Oa(t), t.updateQueue = null, n = as(t, r, n, i), is(e), r = ss(), e !== null && !Rc ? (cs(e, t, a), ml(e, t, a)) : (I && r && aa(t), t.flags |= 1, zc(e, t, n, a), t.child);
	}
	function Qc(e, t, n, r, i) {
		if (Oa(t), t.stateNode === null) {
			var a = Fi, o = n.contextType;
			typeof o == "object" && o && (a = ka(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = wc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, yo(t), o = n.contextType, a.context = typeof o == "object" && o ? ka(o) : Fi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Cc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && wc.enqueueReplaceState(a, a.state, null), Do(t, r, a, i), Eo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Dc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Fi, typeof u == "object" && u && (o = ka(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Ec(t, a, r, o), vo = !1;
			var f = t.memoizedState;
			a.state = f, Do(t, r, a, i), Eo(), l = t.memoizedState, s || f !== l || vo ? (typeof d == "function" && (Cc(t, n, d, r), l = t.memoizedState), (c = vo || Tc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, bo(e, t), o = t.memoizedProps, u = Dc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Fi, typeof l == "object" && l && (c = ka(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Ec(t, a, r, c), vo = !1, f = t.memoizedState, a.state = f, Do(t, r, a, i), Eo();
			var p = t.memoizedState;
			o !== d || f !== p || vo || e !== null && e.dependencies !== null && Da(e.dependencies) ? (typeof s == "function" && (Cc(t, n, s, r), p = t.memoizedState), (u = vo || Tc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Da(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Yc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = go(t, e.child, null, i), t.child = go(t, null, n, i)) : zc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = ml(e, t, i), e;
	}
	function $c(e, t, n, r) {
		return ga(), t.flags |= 256, zc(e, t, n, r), t.child;
	}
	var el = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function tl(e) {
		return {
			baseLanes: e,
			cachePool: Qa()
		};
	}
	function nl(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= dd), e;
	}
	function rl(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Ho.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (I) {
				if (i ? Lo(t) : Bo(), (e = F) ? (e = am(e, ua), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ea === null ? null : {
						id: ta,
						overflow: na
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Wi(e), n.return = t, t.child = n, ca = t, F = null)) : e = null, e === null) throw fa(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Bo(), i = t.mode, a = al({
				mode: "hidden",
				children: a
			}, i), r = Hi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = tl(n), r.childLanes = nl(e, o, n), t.memoizedState = el, Wc(null, r)) : (Lo(t), il(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return sl(e, t, a, o, r, c, s, n);
		}
		return i ? (Bo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = zi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Hi(i, a, n, null), i.flags |= 2) : i = zi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Wc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = tl(n) : (a = i.cachePool, a === null ? a = Qa() : (s = Fa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = nl(e, o, n), t.memoizedState = el, Wc(e.child, r)) : (Lo(t), n = e.child, e = n.sibling, n = zi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function il(e, t) {
		return t = al({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function al(e, t) {
		return e = Li(22, e, null, t), e.lanes = 0, e;
	}
	function ol(e, t, n) {
		return go(t, e.child, null, n), e = il(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function sl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Lo(t), t.flags &= -257, ol(e, t, c)) : t.memoizedState === null ? (Bo(), o = a.fallback, s = t.mode, a = al({
			mode: "visible",
			children: a.children
		}, s), o = Hi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, go(t, e.child, null, c), a = t.child, a.memoizedState = tl(c), a.childLanes = nl(e, r, c), t.memoizedState = el, Wc(null, a)) : (Bo(), t.child = e.child, t.flags |= 128, null);
		if (Lo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, va({
				value: a,
				source: null,
				stack: null
			})), ol(e, t, c);
		}
		if (Rc || Ea(e, t, c, !1), r = (c & e.childLanes) !== 0, Rc || r) {
			if (Ao.current !== null) return ol(e, t, c);
			if (r = td, r !== null && (a = St(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Mi(e, a), Id(r, e, a), Lc;
			return om(o) || Jd(), ol(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, F = lm(o.nextSibling), ca = t, I = !0, la = null, ua = !1, e !== null && sa(t, e), t = il(t, a.children), t.flags |= 134221824, t);
	}
	function cl(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), wa(e.return, t, n);
	}
	function ll(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Go(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function ul(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function dl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function fl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Ho.current;
		if (t.flags & 128) return Uo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Uo(t, o), i === "backwards" && e !== null ? (dl(e), zc(e, t, r, n), dl(e)) : zc(e, t, r, n), r = I ? Zi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && cl(e, n, t);
			else if (e.tag === 19) cl(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = ll(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, dl(t)), ul(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Go(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				ul(t, !0, n, null, a, r);
				break;
			case "together":
				ul(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = ll(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), ul(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function pl(e, t, n) {
		var r = t.pendingProps;
		return Sa(t, t.type, r.value), zc(e, t, r.children, n), t.child;
	}
	function ml(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), cd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Ea(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = zi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = zi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function hl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Da(e)));
	}
	function gl(e, t, n) {
		switch (t.tag) {
			case 3:
				Ne(t, t.stateNode.containerInfo), Sa(t, Fa, e.memoizedState.cache), ga();
				break;
			case 27:
			case 5:
				A(t);
				break;
			case 4:
				Ne(t, t.stateNode.containerInfo);
				break;
			case 10:
				Sa(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Ro(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Lo(t), t.flags |= 128, null;
					r = Ea(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? rl(e, t, n) : (Lo(t), e = ml(e, t, n), e === null ? null : e.sibling);
				}
				Lo(t);
				break;
			case 19:
				if (t.flags & 128) return fl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (Ea(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return fl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Uo(t, Ho.current), r) break;
				return null;
			case 22: return t.lanes = 0, Uc(e, t, n, t.pendingProps);
			case 24: Sa(t, Fa, e.memoizedState.cache);
		}
		return ml(e, t, n);
	}
	function _l(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Rc = !0;
			else {
				if (!hl(e, n) && !(t.flags & 128)) return Rc = !1, gl(e, t, n);
				Rc = !!(e.flags & 131072);
			}
		} else Rc = !1, I && t.flags & 1048576 && ia(t, Zi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = ao(t.elementType), t.type = e, typeof e == "function") Ri(e) ? (r = Dc(e, r), t.tag = 1, t = Qc(null, t, e, r, n)) : (t.tag = 0, t = Xc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = Bc(null, t, e, r, n);
								break a;
							}
							if (a === me) {
								t.tag = 14, t = Vc(null, t, e, r, n);
								break a;
							}
							if (a === de) {
								t.tag = 10, t.type = e, t = pl(null, t, n);
								break a;
							}
						}
						throw t = Ce(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Xc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Dc(r, t.pendingProps), Qc(e, t, r, a, n);
			case 3:
				a: {
					if (Ne(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, bo(e, t), Do(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Sa(t, Fa, r), r !== o.cache && Ta(t, [Fa], n, !0), Eo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = $c(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = qi(Error(i(424)), t), va(a), t = $c(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (F = lm(e.firstChild), ca = t, I = !0, la = null, ua = !0, n = _o(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ga(), r === a) {
							t = ml(e, t, n);
							break a;
						}
						zc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Yc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : I || (t.stateNode = fp(t.type, t.pendingProps, Me.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return A(t), e === null && I && (r = t.stateNode = hm(t.type, t.pendingProps, Me.current), ca = t, ua = !0, a = F, Sp(t.type) ? (um = a, F = lm(r.firstChild)) : F = a), zc(e, t, t.pendingProps.children, n), Yc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && I && ((a = r = F) && (r = rm(r, t.type, t.pendingProps, ua), r === null ? a = !1 : (t.stateNode = r, ca = t, F = lm(r.firstChild), ua = !1, a = !0)), a || fa(t)), A(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = rs(e, t, os, null, null, n), sh._currentValue = a), Yc(e, t), zc(e, t, r, n), t.child;
			case 6: return e === null && I && ((e = n = F) && (n = im(n, t.pendingProps, ua), n === null ? e = !1 : (t.stateNode = n, ca = t, F = null, e = !0)), e || fa(t)), null;
			case 13: return rl(e, t, n);
			case 4: return Ne(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = go(t, null, r, n) : zc(e, t, r, n), t.child;
			case 11: return Bc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Yc(e, t), zc(e, t, r, n), t.child;
			case 8: return zc(e, t, t.pendingProps.children, n), t.child;
			case 12: return zc(e, t, t.pendingProps.children, n), t.child;
			case 10: return pl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Oa(t), a = ka(a), r = r(a), t.flags |= 1, zc(e, t, r, n), t.child;
			case 14: return Vc(e, t, t.type, t.pendingProps, n);
			case 15: return Hc(e, t, t.type, t.pendingProps, n);
			case 19: return fl(e, t, n);
			case 31: return Jc(e, t, n);
			case 22: return Uc(e, t, n, t.pendingProps);
			case 24: return Oa(t), r = ka(Fa), e === null ? (a = Xa(), a === null && (a = td, o = Ia(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, yo(t), Sa(t, Fa, a)) : ((e.lanes & n) !== 0 && (bo(e, t), Do(t, null, null, n), Eo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Sa(t, Fa, r), r !== a.cache && Ta(t, [Fa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Sa(t, Fa, r))), zc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : I && aa(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Yc(e, t), zc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function vl(e) {
		e.flags |= 4;
	}
	function yl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Gd()) e.flags |= 8192;
				else throw oo = no, eo;
			}
		} else e.flags &= -16777217;
	}
	function bl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Gd()) e.flags |= 8192;
			else throw oo = no, eo;
		}
	}
	function xl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : gt(), e.lanes |= t, fd |= t);
	}
	function Sl(e, t) {
		if (!I) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function Cl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function wl(e, t, n) {
		var r = t.pendingProps;
		switch (oa(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Cl(t), null;
			case 1: return Cl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Ca(Fa), Pe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ha(t) ? vl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, _a())), Cl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (vl(t), o === null ? (Cl(t), yl(t, a, null, r, n)) : (Cl(t), bl(t, o))) : o ? o === e.memoizedState ? (Cl(t), t.flags &= -16777217) : (vl(t), Cl(t), bl(t, o)) : (e = e.memoizedProps, e !== r && vl(t), Cl(t), yl(t, a, e, r, n)), null;
			case 27:
				if (Fe(t), n = Me.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && vl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Cl(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ae.current, ha(t) ? pa(t, e) : (e = hm(a, r, n), t.stateNode = e, vl(t));
				}
				return Cl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Fe(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && vl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Cl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ae.current, ha(t)) pa(t, o);
					else {
						var s = lp(Me.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[Ot] = t, o[kt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (rp(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && vl(t);
					}
				}
				return Cl(t), t.subtreeFlags &= -33554433, yl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && vl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Me.current, ha(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ca, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Ot] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || tp(e.nodeValue, n)), e || fa(t, !0);
					} else e = lp(e).createTextNode(r), e[Ot] = t, t.stateNode = e;
				}
				return Cl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ha(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Ot] = t;
						} else ga(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Cl(t), e = !1;
					} else n = _a(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Vo(t), t) : (Vo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Cl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ha(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Ot] = t;
						} else ga(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Cl(t), a = !1;
					} else a = _a(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Vo(t), t) : (Vo(t), null);
				}
				return Vo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), xl(t, t.updateQueue), Cl(t), null);
			case 4: return Pe(), e === null && Gf(t.stateNode.containerInfo), t.flags |= 67108864, Cl(t), null;
			case 10: return Ca(t.type), Cl(t), null;
			case 19:
				if (Wo(t), r = t.memoizedState, r === null) return Cl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) Sl(r, !1);
					else {
						if (sd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Go(e), o !== null) {
								for (t.flags |= 128, Sl(r, !1), e = o.updateQueue, t.updateQueue = e, xl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Bi(n, e), n = n.sibling;
								return Uo(t, Ho.current & 1 | 2), I && ra(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && qe() > vd && (t.flags |= 128, a = !0, Sl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Go(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, xl(t, e), Sl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !I) return Cl(t), null;
						} else 2 * qe() - r.renderingStartTime > vd && n !== 536870912 && (t.flags |= 128, a = !0, Sl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = qe(), e.sibling = null, o = Ho.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || I ? Uo(t, o) : (n = o, ke(Fo, t), ke(Ho, n), Io === null && (Io = t)), I && ra(t, r.treeForkCount), e;
				}
				return Cl(t), null;
			case 22:
			case 23: return Vo(t), Po(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Cl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Cl(t), n = t.updateQueue, n !== null && xl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Oe(Ya), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Ca(Fa), Cl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, Cl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function Tl(e, t) {
		switch (oa(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Ca(Fa), Pe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Fe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Vo(t), t.alternate === null) throw Error(i(340));
					ga();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Vo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ga();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Wo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Pe(), null;
			case 10: return Ca(t.type), null;
			case 22:
			case 23: return Vo(t), Po(), e !== null && Oe(Ya), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Ca(Fa), null;
			case 25: return null;
			default: return null;
		}
	}
	function El(e, t) {
		switch (oa(t), t.tag) {
			case 3:
				Ca(Fa), Pe();
				break;
			case 26:
			case 27:
			case 5:
				Fe(t);
				break;
			case 4:
				Pe();
				break;
			case 31:
				t.memoizedState !== null && Vo(t);
				break;
			case 13:
				Vo(t);
				break;
			case 19:
				Wo(t);
				break;
			case 10:
				Ca(t.type);
				break;
			case 22:
			case 23:
				Vo(t), Po(), e !== null && Oe(Ya);
				break;
			case 24: Ca(Fa);
		}
	}
	function Dl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function Ol(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Y(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function kl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				ko(t, n);
			} catch (t) {
				Y(e, e.return, t);
			}
		}
	}
	function Al(e, t, n) {
		n.props = Dc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Y(e, t, n);
		}
	}
	function jl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = Si(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Y(e, t, n);
		}
	}
	function Ml(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Y(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Y(e, t, n);
			}
			else n.current = null;
		}
	}
	function Nl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Pl(e) {
		for (var t = e.return; t !== null && (Ll(t) && em(e.stateNode, t.stateNode), !Il(t));) t = t.return;
	}
	function Fl(e) {
		for (var t = e.return; t !== null && (Ll(t) && tm(e.stateNode, t.stateNode), !Il(t));) t = t.return;
	}
	function Il(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Ll(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Rl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function zl(e, t, n) {
		try {
			var r = e.stateNode;
			ap(r, e.type, n, t), r[kt] = t;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function Bl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Vl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Bl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Hl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = wn)), Nl(e, r), N = !0;
		else if (i !== 4 && (i === 27 && (Nl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Hl(e, t, n, r), e = e.sibling; e !== null;) Hl(e, t, n, r), e = e.sibling;
	}
	function Ul(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Nl(e, r), N = !0;
		else if (i !== 4 && (i === 27 && (Nl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Ul(e, t, n, r), e = e.sibling; e !== null;) Ul(e, t, n, r), e = e.sibling;
	}
	function Wl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			rp(t, r, n), t[Ot] = e, t[kt] = n;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	var Gl = !1, Kl = null;
	function ql(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Gl = !0);
	}
	var Jl = null;
	function Yl() {
		var e = Jl;
		return Jl = null, e;
	}
	var Xl = 0;
	function Zl(e, t, n, r, i) {
		return Xl = 0, Ql(e.child, t, n, r, i);
	}
	function Ql(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Gl = !0, Tp(o, Xl === 0 ? t : t + "_" + Xl, n), Xl++;
			} else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && i || Ql(e.child, t, n, r, i) && (a = !0));
			e = e.sibling;
		}
		return a;
	}
	function $l(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || $l(e.child, t)), e = e.sibling;
	}
	function eu(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (eu(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = wi(t.default, t.share), t !== "none" && (Zl(e, n, t, null, !1) || $l(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function tu(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = Si(r, n), a = wi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? eu(e) : Zl(e, i, a, null, !1) ? (eu(e), n.paired || t || Fd(e, r.onEnter)) : $l(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) tu(e, t), e = e.sibling;
		else eu(e);
	}
	function nu(e) {
		if (Kl !== null && Kl.size !== 0) {
			var t = Kl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = wi(n.default, n.share);
								if (a !== "none" && (Zl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Fd(e, n.onShare)) : $l(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					nu(e);
				}
				e = e.sibling;
			}
		}
	}
	function ru(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = Si(t, e.stateNode), r = Kl === null ? void 0 : Kl.get(n), i = wi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Zl(e, n, i, null, !1) ? r === void 0 ? Fd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Kl.delete(n), Fd(e, t.onShare)) : $l(e.child, !1)), Kl !== null && nu(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ru(e), e = e.sibling;
		else Kl !== null && nu(e);
	}
	function iu(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = Si(t, e.stateNode);
				t = wi(t.default, t.update), e.flags &= -5, t !== "none" && Zl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && iu(e);
			e = e.sibling;
		}
	}
	function au(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, $l(e.child, !1));
				}
				au(e);
			}
			e = e.sibling;
		}
	}
	function ou(e) {
		if (e.tag === 30) e.stateNode.paired = null, $l(e.child, !1), au(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ou(e), e = e.sibling;
		else au(e);
	}
	function su(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? $l(e.child, !1) : e.subtreeFlags & 33554432 && su(e), e = e.sibling;
	}
	function cu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Xl < a.length) {
					var l = a[Xl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Xl === 0 ? n : n + "_" + Xl, i), s && e.flags & 4 || (Jl === null && (Jl = []), Jl.push(c, Xl === 0 ? r : r + "_" + Xl, t.memoizedProps)), Xl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : cu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function lu(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = Si(n, r), a = wi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Xl = 0, i = cu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Fd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && lu(e, t);
			e = e.sibling;
		}
	}
	var uu = !1, z = !1, du = !1, fu = !1, pu = typeof WeakSet == "function" ? WeakSet : Set, mu = null, B = !1, hu = !1, gu = !1, _u = !1;
	function vu(e, t, n) {
		if (e = e.containerInfo, $ = gh, e = $r(e), P(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, mu = t, t = n ? 9270 : 1024; mu !== null;) {
			if (e = mu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && ru(r[a]);
			if (e.alternate === null && e.flags & 2) n && ql(e), yu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && ru(r), yu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && ql(e), yu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, mu = r) : (n && iu(e), yu(n));
			}
		}
		Kl = null;
	}
	function yu(e) {
		for (; mu !== null;) {
			var t = mu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = Dc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Y(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = Si(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = wi(a.default, a.update), a !== "none" && Zl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, mu = r;
				break;
			}
			mu = t.return;
		}
	}
	function bu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Lu(e, n), r & 4 && Dl(5, n);
				break;
			case 1:
				if (Lu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Y(n, n.return, e);
					}
					else {
						var i = Dc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Y(n, n.return, e);
						}
					}
				}
				r & 64 && kl(n), r & 512 && jl(n, n.return);
				break;
			case 3:
				if (Lu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						ko(e, t);
					} catch (e) {
						Y(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Wl(n);
			case 26:
			case 5:
				Lu(e, n), t === null && r & 4 && Rl(n), r & 512 && jl(n, n.return);
				break;
			case 12:
				Lu(e, n);
				break;
			case 31:
				Lu(e, n), r & 4 && Du(e, n);
				break;
			case 13:
				Lu(e, n), r & 4 && Ou(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = vf.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || uu, !r) {
					var a = t !== null && t.memoizedState !== null || z;
					t = uu, i = z, uu = r, (z = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), zu(e, n, r)) : Lu(e, n), uu = t, z = i;
				}
				break;
			case 30:
				Lu(e, n), r & 512 && jl(n, n.return);
				break;
			case 7: r & 512 && jl(n, n.return);
			default: Lu(e, n);
		}
	}
	function xu(e, t) {
		for (e = e.child; e !== null;) Su(e, t), e = e.sibling;
	}
	function Su(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Y(e, e.return, t);
				}
				Cu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, N = !0;
				} catch (t) {
					Y(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Y(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && xu(e, t);
				break;
			default: xu(e, t);
		}
	}
	function Cu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						Su(n, r);
						break a;
					case 22:
						n.memoizedState === null && Cu(n, r);
						break a;
					default: Cu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function V(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, V(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Lt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var H = null, wu = !1;
	function Tu(e, t, n) {
		for (n = n.child; n !== null;) Eu(e, t, n), n = n.sibling;
	}
	function Eu(e, t, n) {
		if (rt && typeof rt.onCommitFiberUnmount == "function") try {
			rt.onCommitFiberUnmount(nt, n);
		} catch {}
		switch (n.tag) {
			case 26:
				z || Ml(n, t), Tu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !z && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				z || Ml(n, t), Fl(n);
				var r = H, i = wu;
				Sp(n.type) && (H = n.stateNode, wu = !1), Tu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), H = r, wu = i;
				break;
			case 5: z || Ml(n, t), Fl(n);
			case 6:
				if (n.tag === 6 && Fl(n), r = H, i = wu, H = null, Tu(e, t, n), H = r, wu = i, H !== null) {
					if (wu) try {
						(H.nodeType === 9 ? H.body : H.nodeName === "HTML" ? H.ownerDocument.body : H).removeChild(n.stateNode), N = !0;
					} catch (e) {
						Y(n, t, e);
					}
					else try {
						H.removeChild(n.stateNode), N = !0;
					} catch (e) {
						Y(n, t, e);
					}
				}
				break;
			case 18:
				H !== null && (wu ? (e = H, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(H, n.stateNode));
				break;
			case 4:
				r = H, i = wu, H = n.stateNode.containerInfo, wu = !0, Tu(e, t, n), H = r, wu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Ol(2, n, t), z || Ol(4, n, t), Tu(e, t, n);
				break;
			case 1:
				z || (Ml(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Al(n, t, r)), Tu(e, t, n);
				break;
			case 21:
				Tu(e, t, n);
				break;
			case 22:
				z = (r = z) || n.memoizedState !== null, Tu(e, t, n), z = r;
				break;
			case 30:
				Ml(n, t), Tu(e, t, n);
				break;
			case 7:
				z || Ml(n, t), Tu(e, t, n);
				break;
			default: Tu(e, t, n);
		}
	}
	function Du(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Y(t, t.return, e);
			}
		}
	}
	function Ou(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function ku(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new pu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new pu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Au(e, t) {
		var n = ku(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = yf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function ju(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							H = l.stateNode, wu = !1;
							break a;
						}
						break;
					case 5:
						H = l.stateNode, wu = !1;
						break a;
					case 3:
					case 4:
						H = l.stateNode.containerInfo, wu = !0;
						break a;
				}
				l = l.return;
			}
			if (H === null) throw Error(i(160));
			Eu(s, c, o), H = null, wu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Nu(t, e, n), t = t.sibling;
	}
	var Mu = null;
	function Nu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				ju(t, e, n), U(e), a & 4 && (Ol(3, e, e.return), Dl(3, e), Ol(5, e, e.return));
				break;
			case 1:
				ju(t, e, n), U(e), a & 512 && (z || r === null || Ml(r, r.return)), a & 64 && uu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Mu, ju(t, e, n), U(e), a & 512 && (z || r === null || Ml(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (uu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Ft] || r[Ot] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), rp(r, t, n), r[Ot] = e, Ht(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), rp(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), rp(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[Ot] = e, Ht(r), t = r;
									}
									e.stateNode = t;
								}
							} else uu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && zl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || z || t.parentNode.removeChild(t)) : a.count--, n === null ? uu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				ju(t, e, n), U(e), a & 512 && (z || r === null || Ml(r, r.return)), r !== null && a & 4 && zl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = du, du = !1, ju(t, e, n), du = o, U(e), a & 512 && (z || r === null || Ml(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						gn(t, ""), N = !0;
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, zl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (fu = !0);
				break;
			case 6:
				if (ju(t, e, n), U(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, N = !0;
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				break;
			case 3:
				if (N = !1, Wm = null, o = Mu, Mu = bm(t.containerInfo), ju(t, e, n), Mu = o, U(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Y(e, e.return, t);
				}
				fu && (fu = !1, Pu(e)), N = !1;
				break;
			case 4:
				a = du, du = uu, r = Qt(), o = Mu, Mu = bm(e.stateNode.containerInfo), ju(t, e, n), U(e), Mu = o, N && hu && (gu = !0), N = r, du = a;
				break;
			case 12:
				ju(t, e, n), U(e);
				break;
			case 31:
				ju(t, e, n), U(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 13:
				ju(t, e, n), U(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (gd = qe()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = uu, l = z, u = du;
				uu = c || o, du = u || o, z = l || s, ju(t, e, n), z = l, du = u, uu = c, U(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || uu || z || (t = s || z, n = uu, r = z, uu = o || uu, z = t, Ru(e, 2), uu = n, z = r), !o && du || xu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Au(e, n))));
				break;
			case 19:
				ju(t, e, n), U(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 30:
				a & 512 && (z || r === null || Ml(r, r.return)), a = Qt(), o = hu, s = (n & 335544064) === n, c = e.memoizedProps, hu = s && wi(c.default, c.update) !== "none", ju(t, e, n), U(e), s && r !== null && N && (e.flags |= 4), hu = o, N = a;
				break;
			case 21: break;
			case 7: a & 512 && (z || r === null || Ml(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: ju(t, e, n), U(e);
		}
	}
	function U(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Bl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Ll(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Il(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Ul(e, Vl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (gn(l, ""), n.flags &= -33), Ul(e, Vl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Hl(e, Vl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Y(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Pu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Pu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Fu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Iu(t, e), t = t.sibling;
		else lu(t, !1);
	}
	function Iu(e, t) {
		var n = e.alternate;
		if (n === null) tu(e, !1);
		else switch (e.tag) {
			case 3:
				if (_u = B = !1, Yl(), Fu(t, e), !B && !gu) {
					if (e = Jl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), _u = !0;
				}
				Jl = null;
				break;
			case 5:
				Fu(t, e);
				break;
			case 4:
				r = B, B = !1, Fu(t, e), B && (gu = !0), B = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Fu(t, e) : tu(e, !1));
				break;
			case 30:
				r = B, i = Yl(), B = !1, Fu(t, e), B && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = Si(a, o), o = Si(n.memoizedProps, o);
				var s = wi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Xl = 0, t = cu(e, n, t, o, s, a, !0), Xl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Fd(e, e.memoizedProps.onUpdate), Jl = i) : i !== null && (i.push.apply(i, Jl), Jl = i), B = e.flags & 32 ? !0 : r;
				break;
			default: Fu(t, e);
		}
	}
	function Lu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) bu(e, t.alternate, t), t = t.sibling;
	}
	function Ru(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Ol(4, n, n.return), Ru(n, r);
					break;
				case 1:
					Ml(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Al(n, n.return, i), Ru(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Ml(n, n.return), n.tag !== 5 && n.tag !== 27 || Fl(n), Ru(n, r);
					break;
				case 6:
					Fl(n);
					break;
				case 26:
					Ml(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || z || i.parentNode.removeChild(i), Ru(n, r);
					break;
				case 22:
					n.memoizedState === null && Ru(n, r);
					break;
				case 30:
					Ml(n, n.return), Ru(n, r);
					break;
				case 7: Ml(n, n.return);
				default: Ru(n, r);
			}
			e = e.sibling;
		}
	}
	function zu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					zu(i, a, n), Dl(4, a);
					break;
				case 1:
					if (zu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Y(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Oo(l[i], c);
						} catch (e) {
							Y(r, r.return, e);
						}
					}
					s && o & 64 && kl(a), jl(a, a.return);
					break;
				case 27: n & 2 && Wl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Pl(a), zu(i, a, n), s && r === null && o & 4 && Rl(a), jl(a, a.return);
					break;
				case 6:
					Pl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || uu || Km(bm(c.ownerDocument), a.type, c), zu(i, a, n), s && r === null && o & 4 && Rl(a), jl(a, a.return);
					break;
				case 12:
					zu(i, a, n);
					break;
				case 31:
					zu(i, a, n), s && o & 4 && Du(i, a);
					break;
				case 13:
					zu(i, a, n), s && o & 4 && Ou(i, a);
					break;
				case 22:
					a.memoizedState === null && zu(i, a, n), jl(a, a.return);
					break;
				case 30:
					zu(i, a, n), jl(a, a.return);
					break;
				case 7: jl(a, a.return);
				default: zu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Bu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && La(n));
	}
	function W(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && La(e));
	}
	function Vu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Hu(e, t, n, r), t = t.sibling;
		else i && su(t);
	}
	function Hu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && ou(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Vu(e, t, n, r), a & 2048 && Dl(9, t);
				break;
			case 1:
				Vu(e, t, n, r);
				break;
			case 3:
				Vu(e, t, n, r), i && _u && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && La(a)));
				break;
			case 12:
				if (a & 2048) {
					Vu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Y(t, t.return, e);
					}
				} else Vu(e, t, n, r);
				break;
			case 31:
				Vu(e, t, n, r);
				break;
			case 13:
				Vu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && ou(t), o._visibility & 2 ? Vu(e, t, n, r) : (o._visibility |= 2, Uu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && ou(s), o._visibility & 2 ? Vu(e, t, n, r) : Wu(e, t)), a & 2048 && Bu(s, t);
				break;
			case 24:
				Vu(e, t, n, r), a & 2048 && W(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && ($l(a.child, !0), $l(t.child, !0))), Vu(e, t, n, r);
				break;
			default: Vu(e, t, n, r);
		}
	}
	function Uu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Uu(a, o, s, c, i), Dl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Uu(a, o, s, c, i)) : u._visibility & 2 ? Uu(a, o, s, c, i) : Wu(a, o), i && l & 2048 && Bu(o.alternate, o);
					break;
				case 24:
					Uu(a, o, s, c, i), i && l & 2048 && W(o.alternate, o);
					break;
				default: Uu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Wu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Wu(n, r), i & 2048 && Bu(r.alternate, r);
					break;
				case 24:
					Wu(n, r), i & 2048 && W(r.alternate, r);
					break;
				default: Wu(n, r);
			}
			t = t.sibling;
		}
	}
	var Gu = 8192;
	function Ku(e, t, n) {
		if (e.subtreeFlags & Gu) for (e = e.child; e !== null;) qu(e, t, n), e = e.sibling;
	}
	function qu(e, t, n) {
		switch (e.tag) {
			case 26:
				Ku(e, t, n), e.flags & Gu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, Mu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Ku(e, t, n), e.flags & Gu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = Mu;
				Mu = bm(e.stateNode.containerInfo), Ku(e, t, n), Mu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Gu, Gu = 16777216, Ku(e, t, n), Gu = r) : Ku(e, t, n));
				break;
			case 30:
				if ((e.flags & Gu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Kl === null && (Kl = /* @__PURE__ */ new Map()), Kl.set(r, i);
				}
				Ku(e, t, n);
				break;
			default: Ku(e, t, n);
		}
	}
	function Ju(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Yu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				mu = r, Qu(r, e);
			}
			Ju(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Xu(e), e = e.sibling;
	}
	function Xu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Yu(e), e.flags & 2048 && Ol(9, e, e.return);
				break;
			case 3:
				Yu(e);
				break;
			case 12:
				Yu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Zu(e)) : Yu(e);
				break;
			default: Yu(e);
		}
	}
	function Zu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				mu = r, Qu(r, e);
			}
			Ju(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Ol(8, t, t.return), Zu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Zu(t));
					break;
				default: Zu(t);
			}
			e = e.sibling;
		}
	}
	function Qu(e, t) {
		for (; mu !== null;) {
			var n = mu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Ol(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: La(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, mu = r;
			else a: for (n = e; mu !== null;) {
				r = mu;
				var i = r.sibling, a = r.return;
				if (V(r), r === n) {
					mu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, mu = i;
					break a;
				}
				mu = a;
			}
		}
	}
	var $u = {
		getCacheForType: function(e) {
			var t = ka(Fa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ka(Fa).controller.signal;
		}
	}, ed = typeof WeakMap == "function" ? WeakMap : Map, G = 0, td = null, K = null, q = 0, J = 0, nd = null, rd = !1, id = !1, ad = !1, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = 0, fd = 0, pd = null, md = null, hd = !1, gd = 0, _d = 0, vd = Infinity, yd = null, bd = null, xd = 0, Sd = null, Cd = null, wd = 0, Td = 0, Ed = null, Dd = null, Od = null, kd = null, Ad = null, jd = 0, Md = null;
	function Nd() {
		return G & 2 && q !== 0 ? q & -q : E.T === null ? Tt() : Ff();
	}
	function Pd() {
		if (dd === 0) {
			if (!(q & 536870912) || I) {
				var e = lt;
				lt <<= 1, !(lt & 3932160) && (lt = 262144), dd = e;
			} else dd = 536870912;
		}
		return e = Fo.current, e !== null && (e.flags |= 32), dd;
	}
	function Fd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(Si(e.memoizedProps, n))), kd === null && (kd = []), kd.push(t.bind(null, r));
		}
	}
	function Id(e, t, n) {
		(e === td && (J === 2 || J === 9) || e.cancelPendingCommit !== null) && (Ud(e, 0), Bd(e, q, dd, !1)), vt(e, n), (!(G & 2) || e !== td) && (e === td && (!(G & 2) && (ld |= n), sd === 4 && Bd(e, q, dd, !1)), Df(e));
	}
	function Ld(e, t, n) {
		if (G & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || pt(e, t), a = r ? Zd(e, t) : Yd(e, t, !0), o = r;
		do {
			if (a === 0) {
				id && !r && Bd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !zd(n)) {
				a = Yd(e, t, !1), o = !1;
				continue;
			}
			if (a === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						a = pd;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (Ud(c, s).flags |= 256), s = Yd(c, s, !1), s !== 2 && s !== 6) {
							if (ad && !l) {
								c.errorRecoveryDisabledLanes |= o, ld |= o, a = 4;
								break a;
							}
							o = md, md = a, o !== null && (md === null ? md = o : md.push.apply(md, o));
						}
						a = s;
					}
					if (o = !1, a !== 2) continue;
				}
			}
			if (a === 1) {
				Ud(e, 0), Bd(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = a, o) {
					case 0:
					case 1: throw Error(i(345));
					case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
					case 6:
						Bd(r, t, dd, !rd);
						break a;
					case 2:
						md = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(i(329));
				}
				if ((t & 62914560) === t && (a = gd + 300 - qe(), 10 < a)) {
					if (Bd(r, t, dd, !rd), ft(r, 0, !0) !== 0) break a;
					wd = t, r.timeoutHandle = gp(Rd.bind(null, r, n, md, yd, hd, t, dd, ld, fd, rd, o, "Throttled", -0, 0), a);
					break a;
				}
				Rd(r, n, md, yd, hd, t, dd, ld, fd, rd, o, null, -0, 0);
			}
			break;
		} while (1);
		Df(e);
	}
	function Rd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		if (d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: wn
		}, Kl = null, qu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? gd - qe() : (a & 4194048) === a ? _d - qe() : 0, m = eh(d, m), m !== null)) {
			wd = a, e.cancelPendingCommit = m(af.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Bd(e, a, o, !l);
			return;
		}
		af(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function zd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!qr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Bd(e, t, n, r) {
		t = mt(e, t), t &= ~ud, t &= ~ld, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - it(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && bt(e, n, t);
	}
	function Vd() {
		return G & 6 ? !0 : (Of(0, !1), !1);
	}
	function Hd() {
		if (K !== null) {
			if (J === 0) var e = K.return;
			else e = K, xa = ba = null, ls(e), lo = null, uo = 0, e = K;
			for (; e !== null;) El(e.alternate, e), e = e.return;
			K = null;
		}
	}
	function Ud(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), wd = 0, Hd(), td = e, K = n = zi(e.current, null), q = t, J = 0, nd = null, rd = !1, id = pt(e, t), ad = !1, fd = dd = ud = ld = cd = sd = 0, md = pd = null, hd = !1, od = mt(e, t), ki(), n;
	}
	function Wd(e, t) {
		L = null, E.H = yc, t === $a || t === to ? (t = so(), J = 3) : t === eo ? (t = so(), J = 4) : J = t === Lc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, nd = t, K === null && (sd = 1, jc(e, qi(t, e.current)));
	}
	function Gd() {
		var e = Fo.current;
		return e === null ? !0 : (q & 4194048) === q ? Io === null : (q & 62914560) === q || q & 536870912 ? e === Io : !1;
	}
	function Kd() {
		var e = E.H;
		return E.H = yc, e === null ? yc : e;
	}
	function qd() {
		var e = E.A;
		return E.A = $u, e;
	}
	function Jd() {
		sd = 4, rd || (q & 4194048) !== q && Fo.current !== null || (id = !0), !(cd & 134217727) && !(ld & 134217727) || td === null || Bd(td, q, dd, !1);
	}
	function Yd(e, t, n) {
		var r = G;
		G |= 2;
		var i = Kd(), a = qd();
		(td !== e || q !== t) && (yd = null, Ud(e, t)), t = !1;
		var o = sd;
		a: do
			try {
				if (J !== 0 && K !== null) {
					var s = K, c = nd;
					switch (J) {
						case 8:
							Hd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Fo.current === null && (t = !0);
							var l = J;
							if (J = 0, nd = null, tf(e, s, c, l), n && id) {
								o = 0;
								break a;
							}
							break;
						default: l = J, J = 0, nd = null, tf(e, s, c, l);
					}
				}
				Xd(), o = sd;
				break;
			} catch (t) {
				Wd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, xa = ba = null, G = r, E.H = i, E.A = a, K === null && (td = null, q = 0, ki()), o;
	}
	function Xd() {
		for (; K !== null;) $d(K);
	}
	function Zd(e, t) {
		var n = G;
		G |= 2;
		var r = Kd(), a = qd();
		td !== e || q !== t ? (yd = null, vd = qe() + 500, Ud(e, t)) : id = pt(e, t);
		a: do
			try {
				if (J !== 0 && K !== null) {
					t = K;
					var o = nd;
					b: switch (J) {
						case 1:
							J = 0, nd = null, tf(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (ro(o)) {
								J = 0, nd = null, ef(t);
								break;
							}
							t = function() {
								J !== 2 && J !== 9 || td !== e || (J = 7), Df(e);
							}, o.then(t, t);
							break a;
						case 3:
							J = 7;
							break a;
						case 4:
							J = 5;
							break a;
						case 7:
							ro(o) ? (J = 0, nd = null, ef(t)) : (J = 0, nd = null, tf(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (K.tag) {
								case 26: s = K.memoizedState;
								case 5:
								case 27:
									var c = K;
									if (s ? Ym(s) : c.stateNode.complete) {
										J = 0, nd = null;
										var l = c.sibling;
										if (l !== null) K = l;
										else {
											var u = c.return;
											u === null ? K = null : (K = u, nf(u));
										}
										break b;
									}
							}
							J = 0, nd = null, tf(e, t, o, 5);
							break;
						case 6:
							J = 0, nd = null, tf(e, t, o, 6);
							break;
						case 8:
							Hd(), sd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Qd();
				break;
			} catch (t) {
				Wd(e, t);
			}
		while (1);
		return xa = ba = null, E.H = r, E.A = a, G = n, K === null ? (td = null, q = 0, ki(), sd) : 0;
	}
	function Qd() {
		for (; K !== null && !j();) $d(K);
	}
	function $d(e) {
		var t = _l(e.alternate, e, od);
		e.memoizedProps = e.pendingProps, t === null ? nf(e) : K = t;
	}
	function ef(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Zc(n, t, t.pendingProps, t.type, void 0, q);
				break;
			case 11:
				t = Zc(n, t, t.pendingProps, t.type.render, t.ref, q);
				break;
			case 5:
				ls(t);
				var r = t;
				r === ca && (I ? (ma(r), r.tag === 5 && r.stateNode != null && (F = r.stateNode)) : (ma(r), I = !0));
			default: El(n, t), t = K = Bi(t, od), t = _l(n, t, od);
		}
		e.memoizedProps = e.pendingProps, t === null ? nf(e) : K = t;
	}
	function tf(e, t, n, r) {
		xa = ba = null, ls(t), lo = null, uo = 0;
		var i = t.return;
		try {
			if (Ic(e, i, t, n, q)) {
				sd = 1, jc(e, qi(n, e.current)), K = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw K = i, t;
			sd = 1, jc(e, qi(n, e.current)), K = null;
			return;
		}
		t.flags & 32768 ? (I || r === 1 ? e = !0 : id || q & 536870912 ? e = !1 : (rd = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Fo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), rf(t, e)) : nf(t);
	}
	function nf(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				rf(t, rd);
				return;
			}
			e = t.return;
			var n = wl(t.alternate, t, od);
			if (n !== null) {
				K = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				K = t;
				return;
			}
			K = t = e;
		} while (t !== null);
		sd === 0 && (sd = 5);
	}
	function rf(e, t) {
		do {
			var n = Tl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, K = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				K = e;
				return;
			}
			K = e = n;
		} while (e !== null);
		sd = 6, K = null;
	}
	function af(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			pf();
		while (xd !== 0);
		if (G & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === td && (K = td = null, q = 0), Cd = t, Sd = e, wd = n, Ed = a, Dd = r, of(e, t, n, s, c, l, f);
		}
	}
	function of(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Td = s, s |= Oi, yt(e, n, s, r, i, a), kd = null, (n & 335544064) === n ? (Ad = Ba(e), r = 10262) : (Ad = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, bf(Ze, function() {
			return mf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Gl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = E.T, E.T = null, i = D.p, D.p = 2, a = G, G |= 4;
			try {
				vu(e, t, n);
			} finally {
				G = a, D.p = i, E.T = r;
			}
		}
		xd = 1, Gl ? Od = Mp(o, e.containerInfo, Ad, lf, uf, cf, df, mf, sf, null, null) : (lf(), uf(), df());
	}
	function sf(e) {
		if (xd !== 0) {
			var t = Sd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function cf() {
		xd === 3 && (xd = 0, Iu(Cd, Sd), xd = 4);
	}
	function lf() {
		if (xd === 1) {
			xd = 0;
			var e = Sd, t = Cd, n = wd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = E.T, E.T = null;
				var i = D.p;
				D.p = 2;
				var a = G;
				G |= 4;
				try {
					hu = gu = !1, Nu(t, e, n), n = cp;
					var o = $r(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Qr(s.ownerDocument.documentElement, s)) {
						if (c !== null && P(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Zr(s, h), v = Zr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!$, cp = $ = null;
				} finally {
					G = a, D.p = i, E.T = r;
				}
			}
			e.current = t, xd = 2;
		}
	}
	function uf() {
		if (xd === 2) {
			xd = 0;
			var e = Sd, t = Cd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = E.T, E.T = null;
				var r = D.p;
				D.p = 2;
				var i = G;
				G |= 4;
				try {
					bu(e, t.alternate, t);
				} finally {
					G = i, D.p = r, E.T = n;
				}
			}
			xd = 3;
		}
	}
	function df() {
		if (xd === 4 || xd === 3) {
			xd = 0;
			var e = Od;
			Od = null, Ke();
			var t = Sd, n = Cd, r = wd, i = Dd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? xd = 5 : (xd = 0, Cd = Sd = null, ff(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (bd = null), wt(r), n = n.stateNode, rt && typeof rt.onCommitFiberRoot == "function") try {
				rt.onCommitFiberRoot(nt, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = E.T, a = D.p, D.p = 2, E.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					E.T = n, D.p = a;
				}
			}
			if (i = kd, o = Ad, Ad = null, i !== null && (kd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			wd & 3 && pf(), Df(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Md ? jd++ : (jd = 0, Md = t) : (jd = 0, Md = null), Of(0, !1);
		}
	}
	function ff(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, La(t)));
	}
	function pf() {
		return Od !== null && (Od.skipTransition(), Od = null), lf(), uf(), df(), mf();
	}
	function mf() {
		if (xd !== 5) return !1;
		var e = Sd, t = Td;
		Td = 0;
		var n = wt(wd), r = E.T, a = D.p;
		try {
			D.p = 32 > n ? 32 : n, E.T = null, n = Ed, Ed = null;
			var o = Sd, s = wd;
			if (xd = 0, Cd = Sd = null, wd = 0, G & 6) throw Error(i(331));
			var c = G;
			if (G |= 4, Xu(o.current), Hu(o, o.current, s, n), G = c, Of(0, !1), rt && typeof rt.onPostCommitFiberRoot == "function") try {
				rt.onPostCommitFiberRoot(nt, o);
			} catch {}
			return !0;
		} finally {
			D.p = a, E.T = r, ff(e, t);
		}
	}
	function hf(e, t, n) {
		t = qi(n, t), t = Nc(e.stateNode, t, 2), e = So(e, t, 2), e !== null && (vt(e, 2), Df(e));
	}
	function Y(e, t, n) {
		if (e.tag === 3) hf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				hf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (bd === null || !bd.has(r))) {
					e = qi(n, e), n = Pc(2), r = So(t, n, 2), r !== null && (Fc(n, r, t, e), vt(r, 2), Df(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function X(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new ed();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (ad = !0, i.add(n), e = gf.bind(null, e, t, n), t.then(e, e));
	}
	function gf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, td === e && (q & n) === n && (sd === 4 || sd === 3 && (q & 62914560) === q && 300 > qe() - gd ? G & 2 ? ud |= n : Ud(e, 0) : ud |= n, fd === q && (fd = 0)), Df(e);
	}
	function _f(e, t) {
		t === 0 && (t = gt()), e = Mi(e, t), e !== null && (vt(e, t), Df(e));
	}
	function vf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), _f(e, n);
	}
	function yf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), _f(e, n);
	}
	function bf(e, t) {
		return We(e, t);
	}
	var xf = null, Sf = null, Cf = !1, wf = !1, Tf = !1, Ef = 0;
	function Df(e) {
		e !== Sf && e.next === null && (Sf === null ? xf = Sf = e : Sf = Sf.next = e), wf = !0, Cf || (Cf = !0, Pf());
	}
	function Of(e, t) {
		if (!Tf && wf) {
			Tf = !0;
			do
				for (var n = !1, r = xf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - it(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Nf(r, a));
						} else a = q, a = ft(r, r === td ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || pt(r, a) || (n = !0, Nf(r, a));
					}
					r = r.next;
				}
			while (n);
			Tf = !1;
		}
	}
	function kf() {
		Af();
	}
	function Af() {
		wf = Cf = !1;
		var e = 0;
		Ef !== 0 && hp() && (e = Ef);
		for (var t = qe(), n = null, r = xf; r !== null;) {
			var i = r.next, a = jf(r, t);
			a === 0 ? (r.next = null, n === null ? xf = i : n.next = i, i === null && (Sf = n)) : (n = r, (e !== 0 || a & 3) && (wf = !0)), r = i;
		}
		xd !== 0 && xd !== 5 || Of(e, !1), Ef !== 0 && (Ef = 0);
	}
	function jf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - it(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ht(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = td, n = q, n = ft(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (J === 2 || J === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ge(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || pt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ge(r), wt(n)) {
				case 2:
				case 8:
					n = Xe;
					break;
				case 32:
					n = Ze;
					break;
				case 268435456:
					n = $e;
					break;
				default: n = Ze;
			}
			return r = Mf.bind(null, e), n = We(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ge(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Mf(e, t) {
		if (xd !== 0 && xd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (pf() && e.callbackNode !== n) return null;
		var r = q;
		return r = ft(e, e === td ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Ld(e, r, t), jf(e, qe()), e.callbackNode != null && e.callbackNode === n ? Mf.bind(null, e) : null);
	}
	function Nf(e, t) {
		if (pf()) return null;
		Ld(e, t, !0);
	}
	function Pf() {
		bp(function() {
			G & 6 ? We(Ye, kf) : Af();
		});
	}
	function Ff() {
		if (Ef === 0) {
			var e = Ua;
			e === 0 && (e = ct, ct <<= 1, !(ct & 261888) && (ct = 256)), Ef = e;
		}
		return Ef;
	}
	function If(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Cn(e);
	}
	function Lf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = If((i[kt] || null).action), o = r.submitter;
			o && (t = (t = o[kt] || null) ? If(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Gn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Ef !== 0) {
								var e = new FormData(i, o);
								ac(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), ac(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Rf = 0; Rf < yi.length; Rf++) {
		var zf = yi[Rf];
		bi(zf.toLowerCase(), "on" + (zf[0].toUpperCase() + zf.slice(1)));
	}
	bi(di, "onAnimationEnd"), bi(fi, "onAnimationIteration"), bi(pi, "onAnimationStart"), bi("dblclick", "onDoubleClick"), bi("focusin", "onFocus"), bi("focusout", "onBlur"), bi(mi, "onTransitionRun"), bi(hi, "onTransitionStart"), bi(gi, "onTransitionCancel"), bi(_i, "onTransitionEnd"), qt("onMouseEnter", ["mouseout", "mouseover"]), qt("onMouseLeave", ["mouseout", "mouseover"]), qt("onPointerEnter", ["pointerout", "pointerover"]), qt("onPointerLeave", ["pointerout", "pointerover"]), Kt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Kt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Kt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Kt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Kt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Kt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Bf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Vf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bf));
	function Hf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ti(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ti(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Z(e, t) {
		var n = t[jt];
		n === void 0 && (n = t[jt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Kf(t, e, 2, !1), n.add(r));
	}
	function Uf(e, t, n) {
		var r = 0;
		t && (r |= 4), Kf(n, e, r, t);
	}
	var Wf = "_reactListening" + Math.random().toString(36).slice(2);
	function Gf(e) {
		if (!e[Wf]) {
			e[Wf] = !0, Wt.forEach(function(t) {
				t !== "selectionchange" && (Vf.has(t) || Uf(t, !1, e), Uf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Wf] || (t[Wf] = !0, Uf("selectionchange", !1, t));
		}
	}
	function Kf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !Pn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function qf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Rt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		jn(function() {
			var r = a, i = En(n), s = [];
			a: {
				var c = vi.get(e);
				if (c !== void 0) {
					var l = Gn, u = e;
					switch (e) {
						case "keypress": if (Bn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = lr;
							break;
						case "focusin":
							u = "focus", l = er;
							break;
						case "focusout":
							u = "blur", l = er;
							break;
						case "beforeblur":
						case "afterblur":
							l = er;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Qn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = $n;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = fr;
							break;
						case di:
						case fi:
						case pi:
							l = tr;
							break;
						case _i:
							l = pr;
							break;
						case "scroll":
						case "scrollend":
							l = qn;
							break;
						case "wheel":
							l = mr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = nr;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = ur;
							break;
						case "submit":
							l = dr;
							break;
						case "toggle":
						case "beforetoggle": l = hr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = Mn(m, p), g != null && d.push(Jf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== Tn && (u = n.relatedTarget || n.fromElement) && (Rt(u) || u[At])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Rt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Qn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = ur, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Bt(c), h = l == null ? u : Bt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Rt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? re(c, l, Xf) : null, c !== null && Zf(s, u, c, d, !1), l !== null && f !== null && Zf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Bt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Fr;
					else if (kr(c)) {
						if (Ir) _ = Gr;
						else {
							_ = Ur;
							var v = Hr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && bn(r.elementType) && (_ = Fr) : _ = Wr;
					if (_ &&= _(e, r)) {
						Ar(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Bt(r) : window, e) {
					case "focusin":
						(kr(v) || v.contentEditable === "true") && (ti = v, ni = r, ri = null);
						break;
					case "focusout":
						ri = ni = ti = null;
						break;
					case "mousedown":
						ii = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ii = !1, ai(s, n, i);
						break;
					case "selectionchange": if (ei) break;
					case "keydown":
					case "keyup": ai(s, n, i);
				}
				var y;
				if (_r) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else Tr ? Cr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (br && n.locale !== "ko" && (Tr || b !== "onCompositionStart" ? b === "onCompositionEnd" && Tr && (y = zn()) : (In = i, Ln = "value" in In ? In.value : In.textContent, Tr = !0)), v = Yf(r, b), 0 < v.length && (b = new rr(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = wr(n), y !== null && (b.data = y)))), (y = yr ? Er(e, n) : Dr(e, n)) && (b = Yf(r, "onBeforeInput"), 0 < b.length && (v = new rr("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Lf(s, e, r, n, i);
			}
			Hf(s, t);
		});
	}
	function Jf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Yf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = Mn(e, n), i != null && r.unshift(Jf(e, i, a)), i = Mn(e, t), i != null && r.push(Jf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Xf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Zf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = Mn(n, a), l != null && o.unshift(Jf(n, l, c))) : i || (l = Mn(n, a), l != null && o.push(Jf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Qf = /\r\n?/g, $f = /\u0000|\uFFFD/g;
	function ep(e) {
		return (typeof e == "string" ? e : "" + e).replace(Qf, "\n").replace($f, "");
	}
	function tp(e, t) {
		return t = ep(t), ep(e) === t;
	}
	function Q(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || gn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && gn(e, "" + r);
				else return;
				break;
			case "className":
				en(e, "class", r);
				break;
			case "tabIndex":
				en(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				en(e, n, r);
				break;
			case "style":
				yn(e, r, o);
				return;
			case "data": if (t !== "object") {
				en(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Cn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && Q(e, t, "name", a.name, a, null), Q(e, t, "formEncType", a.formEncType, a, null), Q(e, t, "formMethod", a.formMethod, a, null), Q(e, t, "formTarget", a.formTarget, a, null)) : (Q(e, t, "encType", a.encType, a, null), Q(e, t, "method", a.method, a, null), Q(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Cn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = wn);
				return;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = Cn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Z("beforetoggle", e), Z("toggle", e), $t(e, "popover", r);
				break;
			case "xlinkActuate":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				$t(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = xn.get(n) || n, $t(e, n, r);
			else return;
		}
		N = !0;
	}
	function np(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				yn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") gn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") gn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = wn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Gt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[kt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					N = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : $t(e, n, r);
				}
				return;
		}
		N = !0;
	}
	function rp(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Z("error", e), Z("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Q(e, t, o, s, n, null);
					}
				}
				a && Q(e, t, "srcSet", n.srcSet, n, null), r && Q(e, t, "src", n.src, n, null);
				return;
			case "input":
				Z("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: Q(e, t, r, d, n, null);
					}
				}
				dn(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Z("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Q(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && pn(e, !!r, n, !0) : pn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Z("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Q(e, t, s, c, n, null);
				}
				hn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Q(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Z("beforetoggle", e), Z("toggle", e), Z("cancel", e), Z("close", e);
				break;
			case "iframe":
			case "object":
				Z("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Bf.length; r++) Z(Bf[r], e);
				break;
			case "image":
				Z("error", e), Z("load", e);
				break;
			case "details":
				Z("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Z("error", e), Z("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Q(e, t, u, r, n, null);
				}
				return;
			default: if (bn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && np(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Q(e, t, c, r, n, null));
	}
	var ip = {};
	function ap(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Q(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (N = !0), o = m;
							break;
						case "name":
							m !== f && (N = !0), a = m;
							break;
						case "checked":
							m !== f && (N = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (N = !0), d = m;
							break;
						case "value":
							m !== f && (N = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (N = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Q(e, t, p, m, r, f);
					}
				}
				un(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Q(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (N = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (N = !0), c = o;
						break;
					case "multiple": o !== l && (N = !0), s = o;
					default: o !== l && Q(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? pn(e, !!n, n ? [] : "", !1) : pn(e, !!n, t, !0)) : pn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Q(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (N = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (N = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Q(e, t, s, a, r, o);
				}
				mn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Q(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (N = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Q(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Q(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Q(e, t, u, p, r, m);
				}
				return;
			default: if (bn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && np(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || np(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Q(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Q(e, t, f, p, r, m);
	}
	function op(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function sp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && op(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && op(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var $ = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[Ot] = r, n[kt] = t, rp(n, e, t), Ht(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Ft] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : C({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag !== 6 && (e = b(e), t.observe(e), !1);
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag !== 6 && (e = b(e), t.unobserve(e), !1);
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Rt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = re(n, a, S), t === null ? t = !1 : (h(t, !0, ne, a, n), a = ee, ee = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = re(r, a, S), t === null ? t = !1 : (h(t, !0, x, a, r), a = ee, te = ee = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), Lt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Ft]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && Q(e, t, r, null, ip, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === wn && (e.onclick = null), Lt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Lt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = D.d;
	D.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = Vd();
		return e || t;
	}
	function Cm(e) {
		var t = zt(e);
		t !== null && t.tag === 5 && t.type === "form" ? sc(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = ln(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), rp(t, "link", e), Ht(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + ln(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + ln(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + ln(n.imageSizes) + "\"]")) : i += "[href=\"" + ln(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = C({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				rp(o, "link", e), t === "style" && (o[It] = !0, o.onload = o.onerror = function() {
					Ut(o);
				}), Ht(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + ln(r) + "\"][href=\"" + ln(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = C({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), rp(r, "link", e), Ht(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Vt(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = C({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					Ht(c), rp(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Vt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = C({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Ht(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Vt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = C({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Ht(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Me.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Vt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Vt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Vt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + ln(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return C({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[It]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[It] = !0, t.onload = t.onerror = Ut.bind(null, t), rp(t, "link", n), Ht(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + ln(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + ln(n.href) + "\"]");
				if (r) return t.instance = r, Ht(r), r;
				var a = C({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ht(r), rp(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ht(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), Ht(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), rp(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, Ht(a), a) : (r = n, (a = vm.get(o)) && (r = C({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ht(a), rp(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Ft] || a[Ot] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ht(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), Ht(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), rp(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * sp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: de,
		Provider: null,
		Consumer: null,
		_currentValue: Te,
		_currentValue2: Te,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = _t(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = _t(0), this.hiddenUpdates = _t(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Li(3, null, null, t), e.current = a, a.stateNode = e, t = Ia(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, yo(a), e;
	}
	function uh(e) {
		return e ? (e = Fi, e) : Fi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = xo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = So(e, r, t), n !== null && (Id(n, e, t), Co(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Mi(e, 67108864);
			t !== null && Id(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Nd();
			t = Ct(t);
			var n = Mi(e, t);
			n !== null && Id(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 2, yh(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 8, yh(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) qf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = zt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = dt(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - it(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Df(a), !(G & 6) && (vd = qe() + 500, Of(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Mi(a, 2), s !== null && Id(s, a, 2), Vd(), ph(a, 2);
					}
					if (a = bh(r), a === null && qf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else qf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = En(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Rt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Je()) {
				case Ye: return 2;
				case Xe: return 8;
				case Ze:
				case Qe: return 32;
				case $e: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = zt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Rt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, Et(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, Et(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				Tn = r, n.target.dispatchEvent(r), Tn = null;
			} else return t = zt(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = zt(n);
				a !== null && (e.splice(t, 3), t -= 3, ac(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[kt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[kt] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, Nd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), Vd(), t[At] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = Tt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.0") throw Error(i(527, Kh, "19.3.0"));
	D.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.0",
		rendererPackageName: "react-dom",
		currentDispatcherRef: E,
		reconcilerVersion: "19.3.0"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			nt = Jh.inject(qh), rt = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Oc, s = kc, c = Ac;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[At] = t.current, Gf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ c(u(), 1), v = /* @__PURE__ */ c(g(), 1), y = "generated", b = "pointerdown", ee = "pointerup", te = "pointerleave", ne = "pointerout", x = "pointermove", S = "touchstart", re = "touchend", C = "touchmove", ie = "touchcancel", ae = "resize", oe = "visibilitychange", se = "tsParticles - Error", ce = .5, le = 1e3, ue = {
	x: 0,
	y: 0,
	z: 0
}, de = {
	a: 1,
	b: 0,
	c: 0,
	d: 1
}, w = "random", fe = Math.PI * 2, pe = "true", me = "false", he = "canvas", ge = .25, _e = .75, ve = -.25, ye = 1.5, T;
(function(e) {
	e.bottom = "bottom", e.bottomLeft = "bottom-left", e.bottomRight = "bottom-right", e.left = "left", e.none = "none", e.right = "right", e.top = "top", e.topLeft = "top-left", e.topRight = "top-right", e.outside = "outside", e.inside = "inside";
})(T ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/TypeUtils.js
function be(e) {
	return typeof e == "boolean";
}
function xe(e) {
	return typeof e == "string";
}
function Se(e) {
	return typeof e == "number";
}
function Ce(e) {
	return typeof e == "object" && !!e;
}
function we(e) {
	return Array.isArray(e);
}
function E(e) {
	return e == null;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/Vectors.js
var D = class e {
	constructor(e, t, n) {
		if (this._updateFromAngle = (e, t) => {
			this.x = Math.cos(e) * t, this.y = Math.sin(e) * t;
		}, !Se(e) && e) {
			this.x = e.x, this.y = e.y;
			let t = e;
			this.z = t.z ? t.z : ue.z;
		} else if (e !== void 0 && t !== void 0) this.x = e, this.y = t, this.z = n ?? ue.z;
		else throw Error(`${se} Vector3d not initialized correctly`);
	}
	static get origin() {
		return e.create(ue.x, ue.y, ue.z);
	}
	get angle() {
		return Math.atan2(this.y, this.x);
	}
	set angle(e) {
		this._updateFromAngle(e, this.length);
	}
	get length() {
		return Math.sqrt(this.getLengthSq());
	}
	set length(e) {
		this._updateFromAngle(this.angle, e);
	}
	static clone(t) {
		return e.create(t.x, t.y, t.z);
	}
	static create(t, n, r) {
		return new e(t, n, r);
	}
	add(t) {
		return e.create(this.x + t.x, this.y + t.y, this.z + t.z);
	}
	addTo(e) {
		this.x += e.x, this.y += e.y, this.z += e.z;
	}
	copy() {
		return e.clone(this);
	}
	distanceTo(e) {
		return this.sub(e).length;
	}
	distanceToSq(e) {
		return this.sub(e).getLengthSq();
	}
	div(t) {
		return e.create(this.x / t, this.y / t, this.z / t);
	}
	divTo(e) {
		this.x /= e, this.y /= e, this.z /= e;
	}
	getLengthSq() {
		return this.x ** 2 + this.y ** 2;
	}
	mult(t) {
		return e.create(this.x * t, this.y * t, this.z * t);
	}
	multTo(e) {
		this.x *= e, this.y *= e, this.z *= e;
	}
	normalize() {
		let e = this.length;
		e != 0 && this.multTo(1 / e);
	}
	rotate(t) {
		return e.create(this.x * Math.cos(t) - this.y * Math.sin(t), this.x * Math.sin(t) + this.y * Math.cos(t), ue.z);
	}
	setTo(e) {
		this.x = e.x, this.y = e.y;
		let t = e;
		this.z = t.z ? t.z : ue.z;
	}
	sub(t) {
		return e.create(this.x - t.x, this.y - t.y, this.z - t.z);
	}
	subFrom(e) {
		this.x -= e.x, this.y -= e.y, this.z -= e.z;
	}
}, Te = class e extends D {
	constructor(e, t) {
		super(e, t, ue.z);
	}
	static get origin() {
		return e.create(ue.x, ue.y);
	}
	static clone(t) {
		return e.create(t.x, t.y);
	}
	static create(t, n) {
		return new e(t, n);
	}
}, Ee = Math.random, De = {
	nextFrame: (e) => requestAnimationFrame(e),
	cancel: (e) => cancelAnimationFrame(e)
};
function O() {
	return Ae(Ee(), 0, 1 - 2 ** -52);
}
function Oe(e) {
	return De.nextFrame(e);
}
function ke(e) {
	De.cancel(e);
}
function Ae(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function je(e, t, n, r) {
	return Math.floor((e * n + t * r) / (n + r));
}
function Me(e) {
	let t = Pe(e), n = Ne(e);
	return t === n && (n = 0), O() * (t - n) + n;
}
function k(e) {
	return Se(e) ? e : Me(e);
}
function Ne(e) {
	return Se(e) ? e : e.min;
}
function Pe(e) {
	return Se(e) ? e : e.max;
}
function A(e, t) {
	if (e === t || t === void 0 && Se(e)) return e;
	let n = Ne(e), r = Pe(e);
	return t === void 0 ? A(n, r) : {
		min: Math.min(n, t),
		max: Math.max(r, t)
	};
}
function Fe(e, t) {
	let n = e.x - t.x, r = e.y - t.y;
	return {
		dx: n,
		dy: r,
		distance: Math.sqrt(n ** 2 + r ** 2)
	};
}
function Ie(e, t) {
	return Fe(e, t).distance;
}
function Le(e) {
	return e * Math.PI / 180;
}
function Re(e, t, n) {
	if (Se(e)) return Le(e);
	switch (e) {
		case T.top: return -Math.PI * ce;
		case T.topRight: return -Math.PI * ge;
		case T.right: return 0;
		case T.bottomRight: return Math.PI * ge;
		case T.bottom: return Math.PI * ce;
		case T.bottomLeft: return Math.PI * _e;
		case T.left: return Math.PI;
		case T.topLeft: return -Math.PI * _e;
		case T.inside: return Math.atan2(n.y - t.y, n.x - t.x);
		case T.outside: return Math.atan2(t.y - n.y, t.x - n.x);
		default: return O() * fe;
	}
}
function ze(e) {
	let t = Te.origin;
	return t.length = 1, t.angle = e, t;
}
function Be(e, t, n, r) {
	return Te.create(e.x * (n - r) / (n + r) + t.x * 2 * r / (n + r), e.y);
}
function Ve(e) {
	return {
		x: e.position?.x ?? O() * e.size.width,
		y: e.position?.y ?? O() * e.size.height
	};
}
function He(e) {
	return e ? e.endsWith("%") ? parseFloat(e) / 100 : parseFloat(e) : 1;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Modes/AnimationMode.js
var Ue;
(function(e) {
	e.auto = "auto", e.increase = "increase", e.decrease = "decrease", e.random = "random";
})(Ue ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/AnimationStatus.js
var We;
(function(e) {
	e.increasing = "increasing", e.decreasing = "decreasing";
})(We ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/DestroyType.js
var Ge;
(function(e) {
	e.none = "none", e.max = "max", e.min = "min";
})(Ge ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Directions/OutModeDirection.js
var j;
(function(e) {
	e.bottom = "bottom", e.left = "left", e.right = "right", e.top = "top";
})(j ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Modes/PixelMode.js
var Ke;
(function(e) {
	e.precise = "precise", e.percent = "percent";
})(Ke ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/StartValueType.js
var qe;
(function(e) {
	e.max = "max", e.min = "min", e.random = "random";
})(qe ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/Utils.js
var Je = {
	debug: console.debug,
	error: console.error,
	info: console.info,
	log: console.log,
	verbose: console.log,
	warning: console.warn
};
function Ye() {
	return Je;
}
function Xe(e) {
	let t = /* @__PURE__ */ new Map();
	return (...n) => {
		let r = JSON.stringify(n);
		if (t.has(r)) return t.get(r);
		let i = e(...n);
		return t.set(r, i), i;
	};
}
function Ze(e) {
	let t = { bounced: !1 }, { pSide: n, pOtherSide: r, rectSide: i, rectOtherSide: a, velocity: o, factor: s } = e;
	return r.min < a.min || r.min > a.max || r.max < a.min || r.max > a.max || (n.max >= i.min && n.max <= (i.max + i.min) * .5 && o > 0 || n.min <= i.max && n.min > (i.max + i.min) * .5 && o < 0) && (t.velocity = o * -s, t.bounced = !0), t;
}
function Qe(e, t) {
	let n = vt(t, (t) => e.matches(t));
	return we(n) ? n.some((e) => e) : n;
}
function $e() {
	return typeof window > "u" || !window || window.document === void 0 || !window.document;
}
function et() {
	return !$e() && typeof matchMedia < "u";
}
function tt(e) {
	if (et()) return matchMedia(e);
}
function nt(e) {
	if (!($e() || typeof IntersectionObserver > "u")) return new IntersectionObserver(e);
}
function rt(e) {
	if (!($e() || typeof MutationObserver > "u")) return new MutationObserver(e);
}
function M(e, t) {
	return e === t || we(t) && t.indexOf(e) > -1;
}
async function it(e, t) {
	try {
		await document.fonts.load(`${t ?? "400"} 36px '${e ?? "Verdana"}'`);
	} catch {}
}
function at(e) {
	return Math.floor(O() * e.length);
}
function ot(e, t, n = !0) {
	return e[t !== void 0 && n ? t % e.length : at(e)];
}
function st(e, t, n, r, i) {
	return ct(lt(e, r ?? 0), t, n, i);
}
function ct(e, t, n, r) {
	let i = !0;
	return (!r || r === j.bottom) && (i = e.top < t.height + n.x), i && (!r || r === j.left) && (i = e.right > n.x), i && (!r || r === j.right) && (i = e.left < t.width + n.y), i && (!r || r === j.top) && (i = e.bottom > n.y), i;
}
function lt(e, t) {
	return {
		bottom: e.y + t,
		left: e.x - t,
		right: e.x + t,
		top: e.y - t
	};
}
function ut(e, ...t) {
	for (let n of t) {
		if (n == null) continue;
		if (!Ce(n)) {
			e = n;
			continue;
		}
		let t = Array.isArray(n);
		t && (Ce(e) || !e || !Array.isArray(e)) ? e = [] : !t && (Ce(e) || !e || Array.isArray(e)) && (e = {});
		for (let t in n) {
			if (t === "__proto__") continue;
			let r = n[t], i = e;
			i[t] = Ce(r) && Array.isArray(r) ? r.map((e) => ut(i[t], e)) : ut(i[t], r);
		}
	}
	return e;
}
function dt(e, t) {
	return !!bt(t, (t) => t.enable && M(e, t.mode));
}
function ft(e, t, n) {
	vt(t, (t) => {
		let r = t.mode;
		t.enable && M(e, r) && pt(t, n);
	});
}
function pt(e, t) {
	let n = e.selectors;
	vt(n, (n) => {
		t(n, e);
	});
}
function mt(e, t) {
	if (t && e) return bt(e, (e) => Qe(t, e.selectors));
}
function ht(e) {
	return {
		position: e.getPosition(),
		radius: e.getRadius(),
		mass: e.getMass(),
		velocity: e.velocity,
		factor: Te.create(k(e.options.bounce.horizontal.value), k(e.options.bounce.vertical.value))
	};
}
function gt(e, t) {
	let { x: n, y: r } = e.velocity.sub(t.velocity), [i, a] = [e.position, t.position], { dx: o, dy: s } = Fe(a, i);
	if (n * o + r * s < 0) return;
	let c = -Math.atan2(s, o), l = e.mass, u = t.mass, d = e.velocity.rotate(c), f = t.velocity.rotate(c), p = Be(d, f, l, u), m = Be(f, d, l, u), h = p.rotate(-c), g = m.rotate(-c);
	e.velocity.x = h.x * e.factor.x, e.velocity.y = h.y * e.factor.y, t.velocity.x = g.x * t.factor.x, t.velocity.y = g.y * t.factor.y;
}
function _t(e, t) {
	let n = lt(e.getPosition(), e.getRadius()), r = e.options.bounce, i = Ze({
		pSide: {
			min: n.left,
			max: n.right
		},
		pOtherSide: {
			min: n.top,
			max: n.bottom
		},
		rectSide: {
			min: t.left,
			max: t.right
		},
		rectOtherSide: {
			min: t.top,
			max: t.bottom
		},
		velocity: e.velocity.x,
		factor: k(r.horizontal.value)
	});
	i.bounced && (i.velocity !== void 0 && (e.velocity.x = i.velocity), i.position !== void 0 && (e.position.x = i.position));
	let a = Ze({
		pSide: {
			min: n.top,
			max: n.bottom
		},
		pOtherSide: {
			min: n.left,
			max: n.right
		},
		rectSide: {
			min: t.top,
			max: t.bottom
		},
		rectOtherSide: {
			min: t.left,
			max: t.right
		},
		velocity: e.velocity.y,
		factor: k(r.vertical.value)
	});
	a.bounced && (a.velocity !== void 0 && (e.velocity.y = a.velocity), a.position !== void 0 && (e.position.y = a.position));
}
function vt(e, t) {
	return we(e) ? e.map((e, n) => t(e, n)) : t(e, 0);
}
function yt(e, t, n) {
	return we(e) ? ot(e, t, n) : e;
}
function bt(e, t) {
	return we(e) ? e.find((e, n) => t(e, n)) : t(e, 0) ? e : void 0;
}
function xt(e, t) {
	let n = e.value, r = e.animation, i = {
		delayTime: k(r.delay) * le,
		enable: r.enable,
		value: k(e.value) * t,
		max: Pe(n) * t,
		min: Ne(n) * t,
		loops: 0,
		maxLoops: k(r.count),
		time: 0
	};
	if (r.enable) {
		switch (i.decay = 1 - k(r.decay), r.mode) {
			case Ue.increase:
				i.status = We.increasing;
				break;
			case Ue.decrease:
				i.status = We.decreasing;
				break;
			case Ue.random: i.status = O() >= .5 ? We.increasing : We.decreasing;
		}
		let e = r.mode === Ue.auto;
		switch (r.startValue) {
			case qe.min:
				i.value = i.min, e && (i.status = We.increasing);
				break;
			case qe.max:
				i.value = i.max, e && (i.status = We.decreasing);
				break;
			case qe.random:
			default: i.value = Me(i), e && (i.status = O() >= .5 ? We.increasing : We.decreasing);
		}
	}
	return i.initialValue = i.value, i;
}
function St(e, t) {
	if (e.mode !== Ke.percent) {
		let { mode: t, ...n } = e;
		return n;
	}
	return "x" in e ? {
		x: e.x / 100 * t.width,
		y: e.y / 100 * t.height
	} : {
		width: e.width / 100 * t.width,
		height: e.height / 100 * t.height
	};
}
function Ct(e, t) {
	return St(e, t);
}
function wt(e, t, n, r, i) {
	switch (t) {
		case Ge.max:
			n >= i && e.destroy();
			break;
		case Ge.min: n <= r && e.destroy();
	}
}
function Tt(e, t, n, r, i) {
	if (e.destroyed || !t || !t.enable || (t.maxLoops ?? 0) > 0 && (t.loops ?? 0) > (t.maxLoops ?? 0)) return;
	let a = (t.velocity ?? 0) * i.factor, o = t.min, s = t.max, c = t.decay ?? 1;
	if (t.time ||= 0, (t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0) && (t.time += i.value), !((t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0))) {
		switch (t.status) {
			case We.increasing:
				t.value >= s ? (n ? t.status = We.decreasing : t.value -= s, t.loops ||= 0, t.loops++) : t.value += a;
				break;
			case We.decreasing: t.value <= o ? (n ? t.status = We.increasing : t.value += s, t.loops ||= 0, t.loops++) : t.value -= a;
		}
		t.velocity && c !== 1 && (t.velocity *= c), wt(e, r, t.value, o, s), e.destroyed || (t.value = Ae(t.value, o, s));
	}
}
function Et(e) {
	let t = document.createElement("div").style;
	if (!e) return t;
	for (let n in e) {
		let r = e[n];
		if (!Object.prototype.hasOwnProperty.call(e, n) || E(r)) continue;
		let i = e.getPropertyValue?.(r);
		if (!i) continue;
		let a = e.getPropertyPriority?.(r);
		a ? t.setProperty?.(r, i, a) : t.setProperty?.(r, i);
	}
	return t;
}
function Dt(e) {
	let t = document.createElement("div").style, n = {
		width: "100%",
		height: "100%",
		margin: "0",
		padding: "0",
		borderWidth: "0",
		position: "fixed",
		zIndex: e.toString(10),
		"z-index": e.toString(10),
		top: "0",
		left: "0"
	};
	for (let e in n) {
		let r = n[e];
		t.setProperty(e, r);
	}
	return t;
}
var Ot = Xe(Dt), kt;
(function(e) {
	e.darken = "darken", e.enlighten = "enlighten";
})(kt ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/ColorUtils.js
function At(e, t) {
	if (t) {
		for (let n of e.colorManagers.values()) if (t.startsWith(n.stringPrefix)) return n.parseString(t);
	}
}
function jt(e, t, n, r = !0) {
	if (!t) return;
	let i = xe(t) ? { value: t } : t;
	if (xe(i.value)) return Mt(e, i.value, n, r);
	if (we(i.value)) return jt(e, { value: ot(i.value, n, r) });
	for (let t of e.colorManagers.values()) {
		let e = t.handleRangeColor(i);
		if (e) return e;
	}
}
function Mt(e, t, n, r = !0) {
	if (!t) return;
	let i = xe(t) ? { value: t } : t;
	if (xe(i.value)) return i.value === "random" ? Rt() : Ft(e, i.value);
	if (we(i.value)) return Mt(e, { value: ot(i.value, n, r) });
	for (let t of e.colorManagers.values()) {
		let e = t.handleColor(i);
		if (e) return e;
	}
}
function Nt(e, t, n, r = !0) {
	let i = jt(e, t, n, r);
	return i ? Pt(i) : void 0;
}
function Pt(e) {
	let t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.max(t, n, r), a = Math.min(t, n, r), o = {
		h: 0,
		l: (i + a) * ce,
		s: 0
	};
	return i !== a && (o.s = o.l < .5 ? (i - a) / (i + a) : (i - a) / (2 - i - a), o.h = t === i ? (n - r) / (i - a) : o.h = n === i ? 2 + (r - t) / (i - a) : 4 + (t - n) / (i - a)), o.l *= 100, o.s *= 100, o.h *= 60, o.h < 0 && (o.h += 360), o.h >= 360 && (o.h -= 360), o;
}
function Ft(e, t) {
	return At(e, t);
}
function It(e) {
	let t = (e.h % 360 + 360) % 360, n = Math.max(0, Math.min(100, e.s)), r = Math.max(0, Math.min(100, e.l)), i = t / 360, a = n / 100, o = r / 100;
	if (n === 0) {
		let e = Math.round(o * 255);
		return {
			r: e,
			g: e,
			b: e
		};
	}
	let s = (e, t, n) => (n < 0 && n++, n > 1 && n--, n * 6 < 1 ? e + (t - e) * 6 * n : n * 2 < 1 ? t : n * 3 < 2 ? e + (t - e) * (.6666666666666666 - n) * 6 : e), c = o < .5 ? o * (1 + a) : o + a - o * a, l = 2 * o - c, u = 1 / 3, d = Math.min(255, 255 * s(l, c, i + u)), f = Math.min(255, 255 * s(l, c, i)), p = Math.min(255, 255 * s(l, c, i - u));
	return {
		r: Math.round(d),
		g: Math.round(f),
		b: Math.round(p)
	};
}
function Lt(e) {
	let t = It(e);
	return {
		a: e.a,
		b: t.b,
		g: t.g,
		r: t.r
	};
}
function Rt(e) {
	let t = e ?? 0;
	return {
		b: Math.floor(Me(A(t, 256))),
		g: Math.floor(Me(A(t, 256))),
		r: Math.floor(Me(A(t, 256)))
	};
}
function zt(e, t) {
	return `rgba(${e.r}, ${e.g}, ${e.b}, ${t ?? 1})`;
}
function Bt(e, t) {
	return `hsla(${e.h}, ${e.s}%, ${e.l}%, ${t ?? 1})`;
}
function Vt(e, t, n, r) {
	let i = e, a = t;
	return i.r === void 0 && (i = It(e)), a.r === void 0 && (a = It(t)), {
		b: je(i.b, a.b, n, r),
		g: je(i.g, a.g, n, r),
		r: je(i.r, a.r, n, r)
	};
}
function Ht(e, t, n) {
	if (n === "random") return Rt();
	if (n === "mid") {
		let n = e.getFillColor() ?? e.getStrokeColor(), r = t?.getFillColor() ?? t?.getStrokeColor();
		if (n && r && t) return Vt(n, r, e.getRadius(), t.getRadius());
		{
			let e = n ?? r;
			if (e) return It(e);
		}
	} else return n;
}
function Ut(e, t, n, r) {
	let i = xe(t) ? t : t.value;
	return i === "random" ? r ? jt(e, { value: i }) : n ? w : "mid" : i === "mid" ? "mid" : jt(e, { value: i });
}
function Wt(e) {
	return e === void 0 ? void 0 : {
		h: e.h.value,
		s: e.s.value,
		l: e.l.value
	};
}
function Gt(e, t, n) {
	let r = {
		h: {
			enable: !1,
			value: e.h
		},
		s: {
			enable: !1,
			value: e.s
		},
		l: {
			enable: !1,
			value: e.l
		}
	};
	return t && (Kt(r.h, t.h, n), Kt(r.s, t.s, n), Kt(r.l, t.l, n)), r;
}
function Kt(e, t, n) {
	e.enable = t.enable, e.enable ? (e.velocity = k(t.speed) / 100 * n, e.decay = 1 - k(t.decay), e.status = We.increasing, e.loops = 0, e.maxLoops = k(t.count), e.time = 0, e.delayTime = k(t.delay) * le, t.sync || (e.velocity *= O(), e.value *= O()), e.initialValue = e.value, e.offset = A(t.offset)) : e.velocity = 0;
}
function qt(e, t, n, r) {
	if (!e || !e.enable || (e.maxLoops ?? 0) > 0 && (e.loops ?? 0) > (e.maxLoops ?? 0) || (e.time ||= 0, (e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0) && (e.time += r.value), (e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0))) return;
	let i = e.offset ? Me(e.offset) : 0, a = (e.velocity ?? 0) * r.factor + i * 3.6, o = e.decay ?? 1, s = Pe(t), c = Ne(t);
	!n || e.status === We.increasing ? (e.value += a, e.value > s && (e.loops ||= 0, e.loops++, n ? e.status = We.decreasing : e.value -= s)) : (e.value -= a, e.value < 0 && (e.loops ||= 0, e.loops++, e.status = We.increasing)), e.velocity && o !== 1 && (e.velocity *= o), e.value = Ae(e.value, c, s);
}
function Jt(e, t) {
	if (!e) return;
	let { h: n, s: r, l: i } = e, a = {
		h: {
			min: 0,
			max: 360
		},
		s: {
			min: 0,
			max: 100
		},
		l: {
			min: 0,
			max: 100
		}
	};
	n && qt(n, a.h, !1, t), r && qt(r, a.s, !0, t), i && qt(i, a.l, !0, t);
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/CanvasUtils.js
function Yt(e, t, n) {
	e.beginPath(), e.moveTo(t.x, t.y), e.lineTo(n.x, n.y), e.closePath();
}
function Xt(e, t, n) {
	e.fillStyle = n ?? "rgba(0,0,0,0)", e.fillRect(ue.x, ue.y, t.width, t.height);
}
function Zt(e, t, n, r) {
	n && (e.globalAlpha = r, e.drawImage(n, ue.x, ue.y, t.width, t.height), e.globalAlpha = 1);
}
function N(e, t) {
	e.clearRect(ue.x, ue.y, t.width, t.height);
}
function Qt(e) {
	let { container: t, context: n, particle: r, delta: i, colorStyles: a, backgroundMask: o, composite: s, radius: c, opacity: l, shadow: u, transform: d } = e, f = r.getPosition(), p = r.rotation + (r.pathRotation ? r.velocity.angle : 0), m = {
		sin: Math.sin(p),
		cos: Math.cos(p)
	}, h = !!p, g = {
		a: m.cos * (d.a ?? de.a),
		b: h ? m.sin * (d.b ?? 1) : d.b ?? de.b,
		c: h ? -m.sin * (d.c ?? 1) : d.c ?? de.c,
		d: m.cos * (d.d ?? de.d)
	};
	n.setTransform(g.a, g.b, g.c, g.d, f.x, f.y), o && (n.globalCompositeOperation = s);
	let _ = r.shadowColor;
	u.enable && _ && (n.shadowBlur = u.blur, n.shadowColor = zt(_), n.shadowOffsetX = u.offset.x, n.shadowOffsetY = u.offset.y), a.fill && (n.fillStyle = a.fill);
	let v = r.strokeWidth ?? 0;
	n.lineWidth = v, a.stroke && (n.strokeStyle = a.stroke);
	let y = {
		container: t,
		context: n,
		particle: r,
		radius: c,
		opacity: l,
		delta: i,
		transformData: g,
		strokeWidth: v
	};
	en(y), tn(y), $t(y), n.globalCompositeOperation = "source-over", n.resetTransform();
}
function $t(e) {
	let { container: t, context: n, particle: r, radius: i, opacity: a, delta: o, transformData: s } = e;
	if (!r.effect) return;
	let c = t.effectDrawers.get(r.effect);
	c && c.draw({
		context: n,
		particle: r,
		radius: i,
		opacity: a,
		delta: o,
		pixelRatio: t.retina.pixelRatio,
		transformData: { ...s }
	});
}
function en(e) {
	let { container: t, context: n, particle: r, radius: i, opacity: a, delta: o, strokeWidth: s, transformData: c } = e;
	if (!r.shape) return;
	let l = t.shapeDrawers.get(r.shape);
	l && (n.beginPath(), l.draw({
		context: n,
		particle: r,
		radius: i,
		opacity: a,
		delta: o,
		pixelRatio: t.retina.pixelRatio,
		transformData: { ...c }
	}), r.shapeClose && n.closePath(), s > 0 && n.stroke(), r.shapeFill && n.fill());
}
function tn(e) {
	let { container: t, context: n, particle: r, radius: i, opacity: a, delta: o, transformData: s } = e;
	if (!r.shape) return;
	let c = t.shapeDrawers.get(r.shape);
	c?.afterDraw && c.afterDraw({
		context: n,
		particle: r,
		radius: i,
		opacity: a,
		delta: o,
		pixelRatio: t.retina.pixelRatio,
		transformData: { ...s }
	});
}
function nn(e, t, n) {
	t.draw && t.draw(e, n);
}
function rn(e, t, n, r) {
	t.drawParticle && t.drawParticle(e, n, r);
}
function an(e, t, n) {
	return {
		h: e.h,
		s: e.s,
		l: e.l + (t === kt.darken ? -1 : 1) * n
	};
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Canvas.js
function on(e, t, n) {
	let r = t[n];
	r !== void 0 && (e[n] = (e[n] ?? 1) * r);
}
function sn(e, t, n = !1) {
	if (!t) return;
	let r = e;
	if (!r) return;
	let i = r.style;
	if (!i) return;
	let a = /* @__PURE__ */ new Set();
	for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && a.add(i[e]);
	for (let e in t) Object.prototype.hasOwnProperty.call(t, e) && a.add(t[e]);
	for (let e of a) {
		let r = t.getPropertyValue(e);
		r ? i.setProperty(e, r, n ? "important" : "") : i.removeProperty(e);
	}
}
var cn = class {
	constructor(e, t) {
		this.container = e, this._applyPostDrawUpdaters = (e) => {
			for (let t of this._postDrawUpdaters) t.afterDraw?.(e);
		}, this._applyPreDrawUpdaters = (e, t, n, r, i, a) => {
			for (let o of this._preDrawUpdaters) {
				if (o.getColorStyles) {
					let { fill: a, stroke: s } = o.getColorStyles(t, e, n, r);
					a && (i.fill = a), s && (i.stroke = s);
				}
				if (o.getTransformValues) {
					let e = o.getTransformValues(t);
					for (let t in e) on(a, e, t);
				}
				o.beforeDraw?.(t);
			}
		}, this._applyResizePlugins = () => {
			for (let e of this._resizePlugins) e.resize?.();
		}, this._getPluginParticleColors = (e) => {
			let t, n;
			for (let r of this._colorPlugins) if (!t && r.particleFillColor && (t = Nt(this._engine, r.particleFillColor(e))), !n && r.particleStrokeColor && (n = Nt(this._engine, r.particleStrokeColor(e))), t && n) break;
			return [t, n];
		}, this._initCover = async () => {
			let e = this.container.actualOptions.backgroundMask.cover, t = e.color;
			if (t) {
				let n = jt(this._engine, t);
				if (n) {
					let t = {
						...n,
						a: e.opacity
					};
					this._coverColorStyle = zt(t, t.a);
				}
			} else await new Promise((t, n) => {
				if (!e.image) return;
				let r = document.createElement("img");
				r.addEventListener("load", () => {
					this._coverImage = {
						image: r,
						opacity: e.opacity
					}, t();
				}), r.addEventListener("error", (e) => {
					n(e.error);
				}), r.src = e.image;
			});
		}, this._initStyle = () => {
			let e = this.element, t = this.container.actualOptions;
			if (e) {
				this._fullScreen ? this._setFullScreenStyle() : this._resetOriginalStyle();
				for (let n in t.style) {
					if (!n || !t.style || !Object.prototype.hasOwnProperty.call(t.style, n)) continue;
					let r = t.style[n];
					r && e.style.setProperty(n, r, "important");
				}
			}
		}, this._initTrail = async () => {
			let e = this.container.actualOptions.particles.move.trail, t = e.fill;
			if (!e.enable) return;
			let n = 1 / e.length;
			if (t.color) {
				let e = jt(this._engine, t.color);
				if (!e) return;
				this._trailFill = {
					color: { ...e },
					opacity: n
				};
			} else await new Promise((e, r) => {
				if (!t.image) return;
				let i = document.createElement("img");
				i.addEventListener("load", () => {
					this._trailFill = {
						image: i,
						opacity: n
					}, e();
				}), i.addEventListener("error", (e) => {
					r(e.error);
				}), i.src = t.image;
			});
		}, this._paintBase = (e) => {
			this.draw((t) => Xt(t, this.size, e));
		}, this._paintImage = (e, t) => {
			this.draw((n) => Zt(n, this.size, e, t));
		}, this._repairStyle = () => {
			let e = this.element;
			if (!e) return;
			this._safeMutationObserver((e) => e.disconnect()), this._initStyle(), this.initBackground();
			let t = this._pointerEvents;
			e.style.pointerEvents = t, e.setAttribute("pointer-events", t), this._safeMutationObserver((t) => {
				e && e instanceof Node && t.observe(e, { attributes: !0 });
			});
		}, this._resetOriginalStyle = () => {
			let e = this.element, t = this._originalStyle;
			e && t && sn(e, t, !0);
		}, this._safeMutationObserver = (e) => {
			this._mutationObserver && e(this._mutationObserver);
		}, this._setFullScreenStyle = () => {
			let e = this.element;
			e && sn(e, Ot(this.container.actualOptions.fullScreen.zIndex), !0);
		}, this._engine = t, this._standardSize = {
			height: 0,
			width: 0
		};
		let n = e.retina.pixelRatio, r = this._standardSize;
		this.size = {
			height: r.height * n,
			width: r.width * n
		}, this._context = null, this._generated = !1, this._preDrawUpdaters = [], this._postDrawUpdaters = [], this._resizePlugins = [], this._colorPlugins = [], this._pointerEvents = "none";
	}
	get _fullScreen() {
		return this.container.actualOptions.fullScreen.enable;
	}
	clear() {
		let e = this.container.actualOptions, t = e.particles.move.trail, n = this._trailFill;
		e.backgroundMask.enable ? this.paint() : t.enable && t.length > 0 && n ? n.color ? this._paintBase(zt(n.color, n.opacity)) : n.image && this._paintImage(n.image, n.opacity) : e.clear && this.draw((e) => {
			N(e, this.size);
		});
	}
	destroy() {
		this.stop(), this._generated ? (this.element?.remove(), this.element = void 0) : this._resetOriginalStyle(), this._preDrawUpdaters = [], this._postDrawUpdaters = [], this._resizePlugins = [], this._colorPlugins = [];
	}
	draw(e) {
		let t = this._context;
		if (t) return e(t);
	}
	drawAsync(e) {
		let t = this._context;
		if (t) return e(t);
	}
	drawParticle(e, t) {
		if (e.spawning || e.destroyed) return;
		let n = e.getRadius();
		if (n <= 0) return;
		let r = e.getFillColor(), i = e.getStrokeColor() ?? r, [a, o] = this._getPluginParticleColors(e);
		a ||= r, o ||= i, (a || o) && this.draw((r) => {
			let i = this.container, s = i.actualOptions, c = e.options.zIndex, l = 1 - e.zIndexFactor, u = l ** c.opacityRate, d = e.bubble.opacity ?? e.opacity?.value ?? 1, f = e.strokeOpacity ?? d, p = d * u, m = f * u, h = {}, g = { fill: a ? Bt(a, p) : void 0 };
			g.stroke = o ? Bt(o, m) : g.fill, this._applyPreDrawUpdaters(r, e, n, p, g, h), Qt({
				container: i,
				context: r,
				particle: e,
				delta: t,
				colorStyles: g,
				backgroundMask: s.backgroundMask.enable,
				composite: s.backgroundMask.composite,
				radius: n * l ** c.sizeRate,
				opacity: p,
				shadow: e.options.shadow,
				transform: h
			}), this._applyPostDrawUpdaters(e);
		});
	}
	drawParticlePlugin(e, t, n) {
		this.draw((r) => rn(r, e, t, n));
	}
	drawPlugin(e, t) {
		this.draw((n) => nn(n, e, t));
	}
	async init() {
		this._safeMutationObserver((e) => e.disconnect()), this._mutationObserver = rt((e) => {
			for (let t of e) t.type === "attributes" && t.attributeName === "style" && this._repairStyle();
		}), this.resize(), this._initStyle(), await this._initCover();
		try {
			await this._initTrail();
		} catch (e) {
			Ye().error(e);
		}
		this.initBackground(), this._safeMutationObserver((e) => {
			this.element && this.element instanceof Node && e.observe(this.element, { attributes: !0 });
		}), this.initUpdaters(), this.initPlugins(), this.paint();
	}
	initBackground() {
		let e = this.container.actualOptions.background, t = this.element;
		if (!t) return;
		let n = t.style;
		if (n) {
			if (e.color) {
				let t = jt(this._engine, e.color);
				n.backgroundColor = t ? zt(t, e.opacity) : "";
			} else n.backgroundColor = "";
			n.backgroundImage = e.image || "", n.backgroundPosition = e.position || "", n.backgroundRepeat = e.repeat || "", n.backgroundSize = e.size || "";
		}
	}
	initPlugins() {
		this._resizePlugins = [];
		for (let e of this.container.plugins.values()) e.resize && this._resizePlugins.push(e), (e.particleFillColor ?? e.particleStrokeColor) && this._colorPlugins.push(e);
	}
	initUpdaters() {
		this._preDrawUpdaters = [], this._postDrawUpdaters = [];
		for (let e of this.container.particles.updaters) e.afterDraw && this._postDrawUpdaters.push(e), (e.getColorStyles ?? e.getTransformValues ?? e.beforeDraw) && this._preDrawUpdaters.push(e);
	}
	loadCanvas(e) {
		this._generated && this.element && this.element.remove(), this._generated = e.dataset && "generated" in e.dataset ? e.dataset[y] === "true" : this._generated, this.element = e, this.element.ariaHidden = "true", this._originalStyle = Et(this.element.style);
		let t = this._standardSize;
		t.height = e.offsetHeight, t.width = e.offsetWidth;
		let n = this.container.retina.pixelRatio, r = this.size;
		e.height = r.height = t.height * n, e.width = r.width = t.width * n, this._context = this.element.getContext("2d"), this._safeMutationObserver((e) => e.disconnect()), this.container.retina.init(), this.initBackground(), this._safeMutationObserver((e) => {
			this.element && this.element instanceof Node && e.observe(this.element, { attributes: !0 });
		});
	}
	paint() {
		let e = this.container.actualOptions;
		this.draw((t) => {
			e.backgroundMask.enable && e.backgroundMask.cover ? (N(t, this.size), this._coverImage ? this._paintImage(this._coverImage.image, this._coverImage.opacity) : this._coverColorStyle ? this._paintBase(this._coverColorStyle) : this._paintBase()) : this._paintBase();
		});
	}
	resize() {
		if (!this.element) return !1;
		let e = this.container, t = e.canvas._standardSize, n = {
			width: this.element.offsetWidth,
			height: this.element.offsetHeight
		}, r = e.retina.pixelRatio, i = {
			width: n.width * r,
			height: n.height * r
		};
		if (n.height === t.height && n.width === t.width && i.height === this.element.height && i.width === this.element.width) return !1;
		let a = { ...t };
		t.height = n.height, t.width = n.width;
		let o = this.size;
		return this.element.width = o.width = i.width, this.element.height = o.height = i.height, this.container.started && e.particles.setResizeFactor({
			width: t.width / a.width,
			height: t.height / a.height
		}), !0;
	}
	setPointerEvents(e) {
		this.element && (this._pointerEvents = e, this._repairStyle());
	}
	stop() {
		this._safeMutationObserver((e) => e.disconnect()), this._mutationObserver = void 0, this.draw((e) => N(e, this.size));
	}
	async windowResize() {
		if (!this.element || !this.resize()) return;
		let e = this.container, t = e.updateActualOptions();
		e.particles.setDensity(), this._applyResizePlugins(), t && await e.refresh();
	}
}, ln;
(function(e) {
	e.canvas = "canvas", e.parent = "parent", e.window = "window";
})(ln ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/EventListeners.js
function un(e, t, n, r, i) {
	if (r) {
		let r = { passive: !0 };
		be(i) ? r.capture = i : i !== void 0 && (r = i), e.addEventListener(t, n, r);
	} else {
		let r = i;
		e.removeEventListener(t, n, r);
	}
}
var dn = class {
	constructor(e) {
		this.container = e, this._doMouseTouchClick = (e) => {
			let t = this.container, n = t.actualOptions;
			if (this._canPush) {
				let e = t.interactivity.mouse, r = e.position;
				if (!r) return;
				e.clickPosition = { ...r }, e.clickTime = (/* @__PURE__ */ new Date()).getTime();
				let i = n.interactivity.events.onClick;
				vt(i.mode, (e) => this.container.handleClickMode(e));
			}
			e.type === "touchend" && setTimeout(() => this._mouseTouchFinish(), 500);
		}, this._handleThemeChange = (e) => {
			let t = e, n = this.container, r = n.options, i = r.defaultThemes, a = t.matches ? i.dark : i.light;
			r.themes.find((e) => e.name === a)?.default.auto && n.loadTheme(a);
		}, this._handleVisibilityChange = () => {
			let e = this.container, t = e.actualOptions;
			this._mouseTouchFinish(), t.pauseOnBlur && (document?.hidden ? (e.pageHidden = !0, e.pause()) : (e.pageHidden = !1, e.animationStatus ? e.play(!0) : e.draw(!0)));
		}, this._handleWindowResize = () => {
			this._resizeTimeout && (clearTimeout(this._resizeTimeout), delete this._resizeTimeout);
			let e = async () => {
				await this.container.canvas?.windowResize();
			};
			this._resizeTimeout = setTimeout(() => void e(), this.container.actualOptions.interactivity.events.resize.delay * le);
		}, this._manageInteractivityListeners = (e, t) => {
			let n = this._handlers, r = this.container, i = r.actualOptions, a = r.interactivity.element;
			if (!a) return;
			let o = a, s = r.canvas;
			s.setPointerEvents(o === s.element ? "initial" : "none"), (i.interactivity.events.onHover.enable || i.interactivity.events.onClick.enable) && (un(a, x, n.mouseMove, t), un(a, S, n.touchStart, t), un(a, C, n.touchMove, t), i.interactivity.events.onClick.enable ? (un(a, re, n.touchEndClick, t), un(a, ee, n.mouseUp, t), un(a, b, n.mouseDown, t)) : un(a, re, n.touchEnd, t), un(a, e, n.mouseLeave, t), un(a, ie, n.touchCancel, t));
		}, this._manageListeners = (e) => {
			let t = this._handlers, n = this.container, r = n.actualOptions.interactivity.detectsOn, i = n.canvas.element, a = te;
			r === ln.window ? (n.interactivity.element = window, a = ne) : r === ln.parent && i ? n.interactivity.element = i.parentElement ?? i.parentNode : n.interactivity.element = i, this._manageMediaMatch(e), this._manageResize(e), this._manageInteractivityListeners(a, e), document && un(document, oe, t.visibilityChange, e, !1);
		}, this._manageMediaMatch = (e) => {
			let t = this._handlers, n = tt("(prefers-color-scheme: dark)");
			if (n) {
				if (n.addEventListener !== void 0) {
					un(n, "change", t.themeChange, e);
					return;
				}
				n.addListener !== void 0 && (e ? n.addListener(t.oldThemeChange) : n.removeListener(t.oldThemeChange));
			}
		}, this._manageResize = (e) => {
			let t = this._handlers, n = this.container;
			if (!n.actualOptions.interactivity.events.resize) return;
			if (typeof ResizeObserver > "u") {
				un(window, ae, t.resize, e);
				return;
			}
			let r = n.canvas.element;
			this._resizeObserver && !e ? (r && this._resizeObserver.unobserve(r), this._resizeObserver.disconnect(), delete this._resizeObserver) : !this._resizeObserver && e && r && (this._resizeObserver = new ResizeObserver((e) => {
				e.find((e) => e.target === r) && this._handleWindowResize();
			}), this._resizeObserver.observe(r));
		}, this._mouseDown = () => {
			let { interactivity: e } = this.container;
			if (!e) return;
			let { mouse: t } = e;
			t.clicking = !0, t.downPosition = t.position;
		}, this._mouseTouchClick = (e) => {
			let t = this.container, n = t.actualOptions, { mouse: r } = t.interactivity;
			r.inside = !0;
			let i = !1, a = r.position;
			if (a && n.interactivity.events.onClick.enable) {
				for (let e of t.plugins.values()) if (e.clickPositionValid && (i = e.clickPositionValid(a), i)) break;
				i || this._doMouseTouchClick(e), r.clicking = !1;
			}
		}, this._mouseTouchFinish = () => {
			let e = this.container.interactivity;
			if (!e) return;
			let t = e.mouse;
			delete t.position, delete t.clickPosition, delete t.downPosition, e.status = te, t.inside = !1, t.clicking = !1;
		}, this._mouseTouchMove = (e) => {
			let t = this.container, n = t.actualOptions, r = t.interactivity, i = t.canvas.element;
			if (!r?.element) return;
			r.mouse.inside = !0;
			let a;
			if (e.type.startsWith("pointer")) {
				this._canPush = !0;
				let t = e;
				if (r.element === window) {
					if (i) {
						let e = i.getBoundingClientRect();
						a = {
							x: t.clientX - e.left,
							y: t.clientY - e.top
						};
					}
				} else if (n.interactivity.detectsOn === ln.parent) {
					let e = t.target, n = t.currentTarget;
					if (e && n && i) {
						let r = e.getBoundingClientRect(), o = n.getBoundingClientRect(), s = i.getBoundingClientRect();
						a = {
							x: t.offsetX + 2 * r.left - (o.left + s.left),
							y: t.offsetY + 2 * r.top - (o.top + s.top)
						};
					} else a = {
						x: t.offsetX ?? t.clientX,
						y: t.offsetY ?? t.clientY
					};
				} else t.target === i && (a = {
					x: t.offsetX ?? t.clientX,
					y: t.offsetY ?? t.clientY
				});
			} else if (this._canPush = e.type !== "touchmove", i) {
				let t = e, n = t.touches[t.touches.length - 1], r = i.getBoundingClientRect();
				a = {
					x: n.clientX - (r.left ?? 0),
					y: n.clientY - (r.top ?? 0)
				};
			}
			let o = t.retina.pixelRatio;
			a && (a.x *= o, a.y *= o), r.mouse.position = a, r.status = x;
		}, this._touchEnd = (e) => {
			let t = e, n = Array.from(t.changedTouches);
			for (let e of n) this._touches.delete(e.identifier);
			this._mouseTouchFinish();
		}, this._touchEndClick = (e) => {
			let t = e, n = Array.from(t.changedTouches);
			for (let e of n) this._touches.delete(e.identifier);
			this._mouseTouchClick(e);
		}, this._touchStart = (e) => {
			let t = e, n = Array.from(t.changedTouches);
			for (let e of n) this._touches.set(e.identifier, performance.now());
			this._mouseTouchMove(e);
		}, this._canPush = !0, this._touches = /* @__PURE__ */ new Map(), this._handlers = {
			mouseDown: () => this._mouseDown(),
			mouseLeave: () => this._mouseTouchFinish(),
			mouseMove: (e) => this._mouseTouchMove(e),
			mouseUp: (e) => this._mouseTouchClick(e),
			touchStart: (e) => this._touchStart(e),
			touchMove: (e) => this._mouseTouchMove(e),
			touchEnd: (e) => this._touchEnd(e),
			touchCancel: (e) => this._touchEnd(e),
			touchEndClick: (e) => this._touchEndClick(e),
			visibilityChange: () => this._handleVisibilityChange(),
			themeChange: (e) => this._handleThemeChange(e),
			oldThemeChange: (e) => this._handleThemeChange(e),
			resize: () => {
				this._handleWindowResize();
			}
		};
	}
	addListeners() {
		this._manageListeners(!0);
	}
	removeListeners() {
		this._manageListeners(!1);
	}
}, fn;
(function(e) {
	e.configAdded = "configAdded", e.containerInit = "containerInit", e.particlesSetup = "particlesSetup", e.containerStarted = "containerStarted", e.containerStopped = "containerStopped", e.containerDestroyed = "containerDestroyed", e.containerPaused = "containerPaused", e.containerPlay = "containerPlay", e.containerBuilt = "containerBuilt", e.particleAdded = "particleAdded", e.particleDestroyed = "particleDestroyed", e.particleRemoved = "particleRemoved";
})(fn ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/OptionsColor.js
var pn = class e {
	constructor() {
		this.value = "";
	}
	static create(t, n) {
		let r = new e();
		return r.load(t), n !== void 0 && (xe(n) || we(n) ? r.load({ value: n }) : r.load(n)), r;
	}
	load(e) {
		E(e) || E(e.value) || (this.value = e.value);
	}
}, mn = class {
	constructor() {
		this.color = new pn(), this.color.value = "", this.image = "", this.position = "", this.repeat = "", this.size = "", this.opacity = 1;
	}
	load(e) {
		E(e) || (e.color !== void 0 && (this.color = pn.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.position !== void 0 && (this.position = e.position), e.repeat !== void 0 && (this.repeat = e.repeat), e.size !== void 0 && (this.size = e.size), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, hn = class {
	constructor() {
		this.opacity = 1;
	}
	load(e) {
		E(e) || (e.color !== void 0 && (this.color = pn.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, gn = class {
	constructor() {
		this.composite = "destination-out", this.cover = new hn(), this.enable = !1;
	}
	load(e) {
		if (!E(e)) {
			if (e.composite !== void 0 && (this.composite = e.composite), e.cover !== void 0) {
				let t = e.cover, n = xe(e.cover) ? { color: e.cover } : e.cover;
				this.cover.load(t.color !== void 0 || t.image !== void 0 ? t : { color: n });
			}
			e.enable !== void 0 && (this.enable = e.enable);
		}
	}
}, _n = class {
	constructor() {
		this.enable = !0, this.zIndex = 0;
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.zIndex !== void 0 && (this.zIndex = e.zIndex));
	}
}, vn = class {
	constructor() {
		this.enable = !1, this.mode = [];
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode));
	}
}, yn;
(function(e) {
	e.circle = "circle", e.rectangle = "rectangle";
})(yn ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Interactivity/Events/DivEvent.js
var bn = class {
	constructor() {
		this.selectors = [], this.enable = !1, this.mode = [], this.type = yn.circle;
	}
	load(e) {
		E(e) || (e.selectors !== void 0 && (this.selectors = e.selectors), e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), e.type !== void 0 && (this.type = e.type));
	}
}, xn = class {
	constructor() {
		this.enable = !1, this.force = 2, this.smooth = 10;
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.force !== void 0 && (this.force = e.force), e.smooth !== void 0 && (this.smooth = e.smooth));
	}
}, Sn = class {
	constructor() {
		this.enable = !1, this.mode = [], this.parallax = new xn();
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), this.parallax.load(e.parallax));
	}
}, Cn = class {
	constructor() {
		this.delay = .5, this.enable = !0;
	}
	load(e) {
		E(e) || (e.delay !== void 0 && (this.delay = e.delay), e.enable !== void 0 && (this.enable = e.enable));
	}
}, wn = class {
	constructor() {
		this.onClick = new vn(), this.onDiv = new bn(), this.onHover = new Sn(), this.resize = new Cn();
	}
	load(e) {
		if (E(e)) return;
		this.onClick.load(e.onClick);
		let t = e.onDiv;
		t !== void 0 && (this.onDiv = vt(t, (e) => {
			let t = new bn();
			return t.load(e), t;
		})), this.onHover.load(e.onHover), this.resize.load(e.resize);
	}
}, Tn = class {
	constructor(e, t) {
		this._engine = e, this._container = t;
	}
	load(e) {
		if (E(e) || !this._container) return;
		let t = this._engine.interactors.get(this._container);
		if (t) for (let n of t) n.loadModeOptions && n.loadModeOptions(this, e);
	}
}, En = class {
	constructor(e, t) {
		this.detectsOn = ln.window, this.events = new wn(), this.modes = new Tn(e, t);
	}
	load(e) {
		if (E(e)) return;
		let t = e.detectsOn;
		t !== void 0 && (this.detectsOn = t), this.events.load(e.events), this.modes.load(e.modes);
	}
}, Dn = class {
	load(e) {
		E(e) || (e.position && (this.position = {
			x: e.position.x ?? 50,
			y: e.position.y ?? 50,
			mode: e.position.mode ?? Ke.percent
		}), e.options && (this.options = ut({}, e.options)));
	}
}, On;
(function(e) {
	e.screen = "screen", e.canvas = "canvas";
})(On ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Responsive.js
var kn = class {
	constructor() {
		this.maxWidth = Infinity, this.options = {}, this.mode = On.canvas;
	}
	load(e) {
		E(e) || (E(e.maxWidth) || (this.maxWidth = e.maxWidth), E(e.mode) || (this.mode = e.mode === On.screen ? On.screen : On.canvas), E(e.options) || (this.options = ut({}, e.options)));
	}
}, An;
(function(e) {
	e.any = "any", e.dark = "dark", e.light = "light";
})(An ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Theme/ThemeDefault.js
var jn = class {
	constructor() {
		this.auto = !1, this.mode = An.any, this.value = !1;
	}
	load(e) {
		E(e) || (e.auto !== void 0 && (this.auto = e.auto), e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
	}
}, Mn = class {
	constructor() {
		this.name = "", this.default = new jn();
	}
	load(e) {
		E(e) || (e.name !== void 0 && (this.name = e.name), this.default.load(e.default), e.options !== void 0 && (this.options = ut({}, e.options)));
	}
}, Nn = class {
	constructor() {
		this.count = 0, this.enable = !1, this.speed = 1, this.decay = 0, this.delay = 0, this.sync = !1;
	}
	load(e) {
		E(e) || (e.count !== void 0 && (this.count = A(e.count)), e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = A(e.speed)), e.decay !== void 0 && (this.decay = A(e.decay)), e.delay !== void 0 && (this.delay = A(e.delay)), e.sync !== void 0 && (this.sync = e.sync));
	}
}, Pn = class extends Nn {
	constructor() {
		super(), this.mode = Ue.auto, this.startValue = qe.random;
	}
	load(e) {
		super.load(e), !E(e) && (e.mode !== void 0 && (this.mode = e.mode), e.startValue !== void 0 && (this.startValue = e.startValue));
	}
}, Fn = class extends Nn {
	constructor() {
		super(), this.offset = 0, this.sync = !0;
	}
	load(e) {
		super.load(e), !E(e) && e.offset !== void 0 && (this.offset = A(e.offset));
	}
}, In = class {
	constructor() {
		this.h = new Fn(), this.s = new Fn(), this.l = new Fn();
	}
	load(e) {
		E(e) || (this.h.load(e.h), this.s.load(e.s), this.l.load(e.l));
	}
}, Ln = class e extends pn {
	constructor() {
		super(), this.animation = new In();
	}
	static create(t, n) {
		let r = new e();
		return r.load(t), n !== void 0 && (xe(n) || we(n) ? r.load({ value: n }) : r.load(n)), r;
	}
	load(e) {
		if (super.load(e), E(e)) return;
		let t = e.animation;
		t !== void 0 && (t.enable === void 0 ? this.animation.load(e.animation) : this.animation.h.load(t));
	}
}, Rn;
(function(e) {
	e.absorb = "absorb", e.bounce = "bounce", e.destroy = "destroy";
})(Rn ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Particles/Collisions/CollisionsAbsorb.js
var zn = class {
	constructor() {
		this.speed = 2;
	}
	load(e) {
		E(e) || e.speed !== void 0 && (this.speed = e.speed);
	}
}, Bn = class {
	constructor() {
		this.enable = !0, this.retries = 0;
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.retries !== void 0 && (this.retries = e.retries));
	}
}, Vn = class {
	constructor() {
		this.value = 0;
	}
	load(e) {
		E(e) || E(e.value) || (this.value = A(e.value));
	}
}, Hn = class extends Vn {
	constructor() {
		super(), this.animation = new Nn();
	}
	load(e) {
		if (super.load(e), E(e)) return;
		let t = e.animation;
		t !== void 0 && this.animation.load(t);
	}
}, Un = class extends Hn {
	constructor() {
		super(), this.animation = new Pn();
	}
	load(e) {
		super.load(e);
	}
}, Wn = class extends Vn {
	constructor() {
		super(), this.value = 1;
	}
}, Gn = class {
	constructor() {
		this.horizontal = new Wn(), this.vertical = new Wn();
	}
	load(e) {
		E(e) || (this.horizontal.load(e.horizontal), this.vertical.load(e.vertical));
	}
}, Kn = class {
	constructor() {
		this.absorb = new zn(), this.bounce = new Gn(), this.enable = !1, this.maxSpeed = 50, this.mode = Rn.bounce, this.overlap = new Bn();
	}
	load(e) {
		E(e) || (this.absorb.load(e.absorb), this.bounce.load(e.bounce), e.enable !== void 0 && (this.enable = e.enable), e.maxSpeed !== void 0 && (this.maxSpeed = A(e.maxSpeed)), e.mode !== void 0 && (this.mode = e.mode), this.overlap.load(e.overlap));
	}
}, qn = class {
	constructor() {
		this.close = !0, this.fill = !0, this.options = {}, this.type = [];
	}
	load(e) {
		if (E(e)) return;
		let t = e.options;
		if (t !== void 0) for (let e in t) {
			let n = t[e];
			n && (this.options[e] = ut(this.options[e] ?? {}, n));
		}
		e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
	}
}, Jn = class {
	constructor() {
		this.offset = 0, this.value = 90;
	}
	load(e) {
		E(e) || (e.offset !== void 0 && (this.offset = A(e.offset)), e.value !== void 0 && (this.value = A(e.value)));
	}
}, Yn = class {
	constructor() {
		this.distance = 200, this.enable = !1, this.rotate = {
			x: 3e3,
			y: 3e3
		};
	}
	load(e) {
		if (!E(e) && (e.distance !== void 0 && (this.distance = A(e.distance)), e.enable !== void 0 && (this.enable = e.enable), e.rotate)) {
			let t = e.rotate.x;
			t !== void 0 && (this.rotate.x = t);
			let n = e.rotate.y;
			n !== void 0 && (this.rotate.y = n);
		}
	}
}, Xn = class {
	constructor() {
		this.x = 50, this.y = 50, this.mode = Ke.percent, this.radius = 0;
	}
	load(e) {
		E(e) || (e.x !== void 0 && (this.x = e.x), e.y !== void 0 && (this.y = e.y), e.mode !== void 0 && (this.mode = e.mode), e.radius !== void 0 && (this.radius = e.radius));
	}
}, Zn = class {
	constructor() {
		this.acceleration = 9.81, this.enable = !1, this.inverse = !1, this.maxSpeed = 50;
	}
	load(e) {
		E(e) || (e.acceleration !== void 0 && (this.acceleration = A(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.inverse !== void 0 && (this.inverse = e.inverse), e.maxSpeed !== void 0 && (this.maxSpeed = A(e.maxSpeed)));
	}
}, Qn = class {
	constructor() {
		this.clamp = !0, this.delay = new Vn(), this.enable = !1, this.options = {};
	}
	load(e) {
		E(e) || (e.clamp !== void 0 && (this.clamp = e.clamp), this.delay.load(e.delay), e.enable !== void 0 && (this.enable = e.enable), this.generator = e.generator, e.options && (this.options = ut(this.options, e.options)));
	}
}, $n = class {
	load(e) {
		E(e) || (e.color !== void 0 && (this.color = pn.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image));
	}
}, er = class {
	constructor() {
		this.enable = !1, this.length = 10, this.fill = new $n();
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.fill !== void 0 && this.fill.load(e.fill), e.length !== void 0 && (this.length = e.length));
	}
}, tr;
(function(e) {
	e.bounce = "bounce", e.none = "none", e.out = "out", e.destroy = "destroy", e.split = "split";
})(tr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Particles/Move/OutModes.js
var nr = class {
	constructor() {
		this.default = tr.out;
	}
	load(e) {
		E(e) || (e.default !== void 0 && (this.default = e.default), this.bottom = e.bottom ?? e.default, this.left = e.left ?? e.default, this.right = e.right ?? e.default, this.top = e.top ?? e.default);
	}
}, rr = class {
	constructor() {
		this.acceleration = 0, this.enable = !1;
	}
	load(e) {
		E(e) || (e.acceleration !== void 0 && (this.acceleration = A(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.position && (this.position = ut({}, e.position)));
	}
}, ir = class {
	constructor() {
		this.angle = new Jn(), this.attract = new Yn(), this.center = new Xn(), this.decay = 0, this.distance = {}, this.direction = T.none, this.drift = 0, this.enable = !1, this.gravity = new Zn(), this.path = new Qn(), this.outModes = new nr(), this.random = !1, this.size = !1, this.speed = 2, this.spin = new rr(), this.straight = !1, this.trail = new er(), this.vibrate = !1, this.warp = !1;
	}
	load(e) {
		if (E(e)) return;
		this.angle.load(Se(e.angle) ? { value: e.angle } : e.angle), this.attract.load(e.attract), this.center.load(e.center), e.decay !== void 0 && (this.decay = A(e.decay)), e.direction !== void 0 && (this.direction = e.direction), e.distance !== void 0 && (this.distance = Se(e.distance) ? {
			horizontal: e.distance,
			vertical: e.distance
		} : { ...e.distance }), e.drift !== void 0 && (this.drift = A(e.drift)), e.enable !== void 0 && (this.enable = e.enable), this.gravity.load(e.gravity);
		let t = e.outModes;
		t !== void 0 && (Ce(t) ? this.outModes.load(t) : this.outModes.load({ default: t })), this.path.load(e.path), e.random !== void 0 && (this.random = e.random), e.size !== void 0 && (this.size = e.size), e.speed !== void 0 && (this.speed = A(e.speed)), this.spin.load(e.spin), e.straight !== void 0 && (this.straight = e.straight), this.trail.load(e.trail), e.vibrate !== void 0 && (this.vibrate = e.vibrate), e.warp !== void 0 && (this.warp = e.warp);
	}
}, ar = class extends Pn {
	constructor() {
		super(), this.destroy = Ge.none, this.speed = 2;
	}
	load(e) {
		super.load(e), !E(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
	}
}, or = class extends Un {
	constructor() {
		super(), this.animation = new ar(), this.value = 1;
	}
	load(e) {
		if (E(e)) return;
		super.load(e);
		let t = e.animation;
		t !== void 0 && this.animation.load(t);
	}
}, sr = class {
	constructor() {
		this.enable = !1, this.width = 1920, this.height = 1080;
	}
	load(e) {
		if (E(e)) return;
		e.enable !== void 0 && (this.enable = e.enable);
		let t = e.width;
		t !== void 0 && (this.width = t);
		let n = e.height;
		n !== void 0 && (this.height = n);
	}
}, cr;
(function(e) {
	e.delete = "delete", e.wait = "wait";
})(cr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Particles/Number/ParticlesNumberLimit.js
var lr = class {
	constructor() {
		this.mode = cr.delete, this.value = 0;
	}
	load(e) {
		E(e) || (e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
	}
}, ur = class {
	constructor() {
		this.density = new sr(), this.limit = new lr(), this.value = 0;
	}
	load(e) {
		E(e) || (this.density.load(e.density), this.limit.load(e.limit), e.value !== void 0 && (this.value = e.value));
	}
}, dr = class {
	constructor() {
		this.blur = 0, this.color = new pn(), this.enable = !1, this.offset = {
			x: 0,
			y: 0
		}, this.color.value = "#000";
	}
	load(e) {
		E(e) || (e.blur !== void 0 && (this.blur = e.blur), this.color = pn.create(this.color, e.color), e.enable !== void 0 && (this.enable = e.enable), e.offset !== void 0 && (e.offset.x !== void 0 && (this.offset.x = e.offset.x), e.offset.y !== void 0 && (this.offset.y = e.offset.y)));
	}
}, fr = class {
	constructor() {
		this.close = !0, this.fill = !0, this.options = {}, this.type = "circle";
	}
	load(e) {
		if (E(e)) return;
		let t = e.options;
		if (t !== void 0) for (let e in t) {
			let n = t[e];
			n && (this.options[e] = ut(this.options[e] ?? {}, n));
		}
		e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
	}
}, pr = class extends Pn {
	constructor() {
		super(), this.destroy = Ge.none, this.speed = 5;
	}
	load(e) {
		super.load(e), !E(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
	}
}, mr = class extends Un {
	constructor() {
		super(), this.animation = new pr(), this.value = 3;
	}
	load(e) {
		if (super.load(e), E(e)) return;
		let t = e.animation;
		t !== void 0 && this.animation.load(t);
	}
}, hr = class {
	constructor() {
		this.width = 0;
	}
	load(e) {
		E(e) || (e.color !== void 0 && (this.color = Ln.create(this.color, e.color)), e.width !== void 0 && (this.width = A(e.width)), e.opacity !== void 0 && (this.opacity = A(e.opacity)));
	}
}, gr = class extends Vn {
	constructor() {
		super(), this.opacityRate = 1, this.sizeRate = 1, this.velocityRate = 1;
	}
	load(e) {
		super.load(e), !E(e) && (e.opacityRate !== void 0 && (this.opacityRate = e.opacityRate), e.sizeRate !== void 0 && (this.sizeRate = e.sizeRate), e.velocityRate !== void 0 && (this.velocityRate = e.velocityRate));
	}
}, _r = class {
	constructor(e, t) {
		this._engine = e, this._container = t, this.bounce = new Gn(), this.collisions = new Kn(), this.color = new Ln(), this.color.value = "#fff", this.effect = new qn(), this.groups = {}, this.move = new ir(), this.number = new ur(), this.opacity = new or(), this.reduceDuplicates = !1, this.shadow = new dr(), this.shape = new fr(), this.size = new mr(), this.stroke = new hr(), this.zIndex = new gr();
	}
	load(e) {
		if (E(e)) return;
		if (e.groups !== void 0) for (let t of Object.keys(e.groups)) {
			if (!Object.hasOwn(e.groups, t)) continue;
			let n = e.groups[t];
			n !== void 0 && (this.groups[t] = ut(this.groups[t] ?? {}, n));
		}
		e.reduceDuplicates !== void 0 && (this.reduceDuplicates = e.reduceDuplicates), this.bounce.load(e.bounce), this.color.load(Ln.create(this.color, e.color)), this.effect.load(e.effect), this.move.load(e.move), this.number.load(e.number), this.opacity.load(e.opacity), this.shape.load(e.shape), this.size.load(e.size), this.shadow.load(e.shadow), this.zIndex.load(e.zIndex), this.collisions.load(e.collisions), e.interactivity !== void 0 && (this.interactivity = ut({}, e.interactivity));
		let t = e.stroke;
		if (t && (this.stroke = vt(t, (e) => {
			let t = new hr();
			return t.load(e), t;
		})), this._container) {
			let t = this._engine.updaters.get(this._container);
			if (t) for (let n of t) n.loadOptions && n.loadOptions(this, e);
			let n = this._engine.interactors.get(this._container);
			if (n) for (let t of n) t.loadParticlesOptions && t.loadParticlesOptions(this, e);
		}
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/OptionsUtils.js
function vr(e, ...t) {
	for (let n of t) e.load(n);
}
function yr(e, t, ...n) {
	let r = new _r(e, t);
	return vr(r, ...n), r;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Options.js
var br = class {
	constructor(e, t) {
		this._findDefaultTheme = (e) => this.themes.find((t) => t.default.value && t.default.mode === e) ?? this.themes.find((e) => e.default.value && e.default.mode === An.any), this._importPreset = (e) => {
			this.load(this._engine.getPreset(e));
		}, this._engine = e, this._container = t, this.autoPlay = !0, this.background = new mn(), this.backgroundMask = new gn(), this.clear = !0, this.defaultThemes = {}, this.delay = 0, this.fullScreen = new _n(), this.detectRetina = !0, this.duration = 0, this.fpsLimit = 120, this.interactivity = new En(e, t), this.manualParticles = [], this.particles = yr(this._engine, this._container), this.pauseOnBlur = !0, this.pauseOnOutsideViewport = !0, this.responsive = [], this.smooth = !1, this.style = {}, this.themes = [], this.zLayers = 100;
	}
	load(e) {
		if (E(e)) return;
		e.preset !== void 0 && vt(e.preset, (e) => this._importPreset(e)), e.autoPlay !== void 0 && (this.autoPlay = e.autoPlay), e.clear !== void 0 && (this.clear = e.clear), e.key !== void 0 && (this.key = e.key), e.name !== void 0 && (this.name = e.name), e.delay !== void 0 && (this.delay = A(e.delay));
		let t = e.detectRetina;
		t !== void 0 && (this.detectRetina = t), e.duration !== void 0 && (this.duration = A(e.duration));
		let n = e.fpsLimit;
		n !== void 0 && (this.fpsLimit = n), e.pauseOnBlur !== void 0 && (this.pauseOnBlur = e.pauseOnBlur), e.pauseOnOutsideViewport !== void 0 && (this.pauseOnOutsideViewport = e.pauseOnOutsideViewport), e.zLayers !== void 0 && (this.zLayers = e.zLayers), this.background.load(e.background);
		let r = e.fullScreen;
		be(r) ? this.fullScreen.enable = r : this.fullScreen.load(r), this.backgroundMask.load(e.backgroundMask), this.interactivity.load(e.interactivity), e.manualParticles && (this.manualParticles = e.manualParticles.map((e) => {
			let t = new Dn();
			return t.load(e), t;
		})), this.particles.load(e.particles), this.style = ut(this.style, e.style), this._engine.loadOptions(this, e), e.smooth !== void 0 && (this.smooth = e.smooth);
		let i = this._engine.interactors.get(this._container);
		if (i) for (let t of i) t.loadOptions && t.loadOptions(this, e);
		if (e.responsive !== void 0) for (let t of e.responsive) {
			let e = new kn();
			e.load(t), this.responsive.push(e);
		}
		if (this.responsive.sort((e, t) => e.maxWidth - t.maxWidth), e.themes !== void 0) for (let t of e.themes) {
			let e = this.themes.find((e) => e.name === t.name);
			if (e) e.load(t);
			else {
				let e = new Mn();
				e.load(t), this.themes.push(e);
			}
		}
		this.defaultThemes.dark = this._findDefaultTheme(An.dark)?.name, this.defaultThemes.light = this._findDefaultTheme(An.light)?.name;
	}
	setResponsive(e, t, n) {
		this.load(n);
		let r = this.responsive.find((n) => n.mode === On.screen && screen ? n.maxWidth > screen.availWidth : n.maxWidth * t > e);
		return this.load(r?.options), r?.maxWidth;
	}
	setTheme(e) {
		if (e) {
			let t = this.themes.find((t) => t.name === e);
			t && this.load(t.options);
		} else {
			let e = tt("(prefers-color-scheme: dark)")?.matches, t = this._findDefaultTheme(e ? An.dark : An.light);
			t && this.load(t.options);
		}
	}
}, xr;
(function(e) {
	e.external = "external", e.particles = "particles";
})(xr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/InteractionManager.js
var Sr = class {
	constructor(e, t) {
		this.container = t, this._engine = e, this._interactors = [], this._externalInteractors = [], this._particleInteractors = [];
	}
	externalInteract(e) {
		for (let t of this._externalInteractors) t.isEnabled() && t.interact(e);
	}
	handleClickMode(e) {
		for (let t of this._externalInteractors) t.handleClickMode?.(e);
	}
	async init() {
		this._interactors = await this._engine.getInteractors(this.container, !0), this._externalInteractors = [], this._particleInteractors = [];
		for (let e of this._interactors) {
			switch (e.type) {
				case xr.external:
					this._externalInteractors.push(e);
					break;
				case xr.particles: this._particleInteractors.push(e);
			}
			e.init();
		}
	}
	particlesInteract(e, t) {
		for (let n of this._externalInteractors) n.clear(e, t);
		for (let n of this._particleInteractors) n.isEnabled(e) && n.interact(e, t);
	}
	reset(e) {
		for (let t of this._externalInteractors) t.isEnabled() && t.reset(e);
		for (let t of this._particleInteractors) t.isEnabled(e) && t.reset(e);
	}
}, Cr;
(function(e) {
	e.normal = "normal", e.inside = "inside", e.outside = "outside";
})(Cr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Particle.js
function wr(e, t, n, r) {
	let i = t.options[e];
	if (i) return ut({
		close: t.close,
		fill: t.fill
	}, yt(i, n, r));
}
function Tr(e, t, n, r) {
	let i = t.options[e];
	if (i) return ut({
		close: t.close,
		fill: t.fill
	}, yt(i, n, r));
}
function Er(e) {
	if (!M(e.outMode, e.checkModes)) return;
	let t = e.radius * 2;
	e.coord > e.maxCoord - t ? e.setCb(-e.radius) : e.coord < t && e.setCb(e.radius);
}
var Dr = class {
	constructor(e, t) {
		this.container = t, this._calcPosition = (e, t, n, r = 0) => {
			for (let r of e.plugins.values()) {
				let e = r.particlePosition === void 0 ? void 0 : r.particlePosition(t, this);
				if (e) return D.create(e.x, e.y, n);
			}
			let i = e.canvas.size, a = Ve({
				size: i,
				position: t
			}), o = D.create(a.x, a.y, n), s = this.getRadius(), c = this.options.move.outModes, l = (t) => {
				Er({
					outMode: t,
					checkModes: [tr.bounce],
					coord: o.x,
					maxCoord: e.canvas.size.width,
					setCb: (e) => o.x += e,
					radius: s
				});
			}, u = (t) => {
				Er({
					outMode: t,
					checkModes: [tr.bounce],
					coord: o.y,
					maxCoord: e.canvas.size.height,
					setCb: (e) => o.y += e,
					radius: s
				});
			};
			return l(c.left ?? c.default), l(c.right ?? c.default), u(c.top ?? c.default), u(c.bottom ?? c.default), this._checkOverlap(o, r) ? this._calcPosition(e, void 0, n, r + 1) : o;
		}, this._calculateVelocity = () => {
			let e = ze(this.direction).copy(), t = this.options.move;
			if (t.direction === T.inside || t.direction === T.outside) return e;
			let n = Le(k(t.angle.value)), r = Le(k(t.angle.offset)), i = {
				left: r - n * ce,
				right: r + n * ce
			};
			return t.straight || (e.angle += Me(A(i.left, i.right))), t.random && typeof t.speed == "number" && (e.length *= O()), e;
		}, this._checkOverlap = (e, t = 0) => {
			let n = this.options.collisions, r = this.getRadius();
			if (!n.enable) return !1;
			let i = n.overlap;
			if (i.enable) return !1;
			let a = i.retries;
			if (a >= 0 && t > a) throw Error(`${se} particle is overlapping and can't be placed`);
			return !!this.container.particles.find((t) => Ie(e, t.position) < r + t.getRadius());
		}, this._getRollColor = (e) => {
			if (!e || !this.roll || !this.backColor && !this.roll.alter) return e;
			let t = this.roll.horizontal && this.roll.vertical ? 2 : 1, n = this.roll.horizontal ? Math.PI * ce : 0;
			return Math.floor(((this.roll.angle ?? 0) + n) / (Math.PI / t)) % 2 ? this.backColor ? this.backColor : this.roll.alter ? an(e, this.roll.alter.type, this.roll.alter.value) : e : e;
		}, this._initPosition = (e) => {
			let t = this.container, n = k(this.options.zIndex.value);
			this.position = this._calcPosition(t, e, Ae(n, 0, t.zLayers)), this.initialPosition = this.position.copy();
			let r = t.canvas.size;
			switch (this.moveCenter = {
				...Ct(this.options.move.center, r),
				radius: this.options.move.center.radius ?? 0,
				mode: this.options.move.center.mode ?? Ke.percent
			}, this.direction = Re(this.options.move.direction, this.position, this.moveCenter), this.options.move.direction) {
				case T.inside:
					this.outType = Cr.inside;
					break;
				case T.outside: this.outType = Cr.outside;
			}
			this.offset = Te.origin;
		}, this._engine = e;
	}
	destroy(e) {
		if (this.unbreakable || this.destroyed) return;
		this.destroyed = !0, this.bubble.inRange = !1, this.slow.inRange = !1;
		let t = this.container, n = this.pathGenerator;
		t.shapeDrawers.get(this.shape)?.particleDestroy?.(this);
		for (let n of t.plugins.values()) n.particleDestroyed?.(this, e);
		for (let n of t.particles.updaters) n.particleDestroyed?.(this, e);
		n?.reset(this), this._engine.dispatchEvent(fn.particleDestroyed, {
			container: this.container,
			data: { particle: this }
		});
	}
	draw(e) {
		let t = this.container, n = t.canvas;
		for (let r of t.plugins.values()) n.drawParticlePlugin(r, this, e);
		n.drawParticle(this, e);
	}
	getFillColor() {
		return this._getRollColor(this.bubble.color ?? Wt(this.color));
	}
	getMass() {
		return this.getRadius() ** 2 * Math.PI * ce;
	}
	getPosition() {
		return {
			x: this.position.x + this.offset.x,
			y: this.position.y + this.offset.y,
			z: this.position.z
		};
	}
	getRadius() {
		return this.bubble.radius ?? this.size.value;
	}
	getStrokeColor() {
		return this._getRollColor(this.bubble.color ?? Wt(this.strokeColor));
	}
	init(e, t, n, r) {
		let i = this.container, a = this._engine;
		this.id = e, this.group = r, this.effectClose = !0, this.effectFill = !0, this.shapeClose = !0, this.shapeFill = !0, this.pathRotation = !1, this.lastPathTime = 0, this.destroyed = !1, this.unbreakable = !1, this.isRotating = !1, this.rotation = 0, this.misplaced = !1, this.retina = { maxDistance: {} }, this.outType = Cr.normal, this.ignoresResizeRatio = !0;
		let o = i.retina.pixelRatio, s = i.actualOptions, c = yr(this._engine, i, s.particles), { reduceDuplicates: l } = c, u = c.effect.type, d = c.shape.type;
		this.effect = yt(u, this.id, l), this.shape = yt(d, this.id, l);
		let f = c.effect, p = c.shape;
		if (n) {
			if (n.effect?.type) {
				let e = n.effect.type, t = yt(e, this.id, l);
				t && (this.effect = t, f.load(n.effect));
			}
			if (n.shape?.type) {
				let e = n.shape.type, t = yt(e, this.id, l);
				t && (this.shape = t, p.load(n.shape));
			}
		}
		if (this.effect === "random") {
			let e = [...this.container.effectDrawers.keys()];
			this.effect = e[Math.floor(O() * e.length)];
		}
		if (this.shape === "random") {
			let e = [...this.container.shapeDrawers.keys()];
			this.shape = e[Math.floor(O() * e.length)];
		}
		this.effectData = wr(this.effect, f, this.id, l), this.shapeData = Tr(this.shape, p, this.id, l), c.load(n);
		let m = this.effectData;
		m && c.load(m.particles);
		let h = this.shapeData;
		h && c.load(h.particles);
		let g = new En(a, i);
		g.load(i.actualOptions.interactivity), g.load(c.interactivity), this.interactivity = g, this.effectFill = m?.fill ?? c.effect.fill, this.effectClose = m?.close ?? c.effect.close, this.shapeFill = h?.fill ?? c.shape.fill, this.shapeClose = h?.close ?? c.shape.close, this.options = c;
		let _ = this.options.move.path;
		this.pathDelay = k(_.delay.value) * le, _.generator && (this.pathGenerator = this._engine.getPathGenerator(_.generator), this.pathGenerator && i.addPath(_.generator, this.pathGenerator) && this.pathGenerator.init(i)), i.retina.initParticle(this), this.size = xt(this.options.size, o), this.bubble = { inRange: !1 }, this.slow = {
			inRange: !1,
			factor: 1
		}, this._initPosition(t), this.initialVelocity = this._calculateVelocity(), this.velocity = this.initialVelocity.copy(), this.moveDecay = 1 - k(this.options.move.decay);
		let v = i.particles;
		v.setLastZIndex(this.position.z), this.zIndexFactor = this.position.z / i.zLayers, this.sides = 24;
		let y = i.effectDrawers.get(this.effect);
		y || (y = this._engine.getEffectDrawer(this.effect), y && i.effectDrawers.set(this.effect, y)), y?.loadEffect && y.loadEffect(this);
		let b = i.shapeDrawers.get(this.shape);
		b || (b = this._engine.getShapeDrawer(this.shape), b && i.shapeDrawers.set(this.shape, b)), b?.loadShape && b.loadShape(this);
		let ee = b?.getSidesCount;
		ee && (this.sides = ee(this)), this.spawning = !1, this.shadowColor = jt(this._engine, this.options.shadow.color);
		for (let e of v.updaters) e.init(this);
		for (let e of v.movers) e.init?.(this);
		y?.particleInit?.(i, this), b?.particleInit?.(i, this);
		for (let e of i.plugins.values()) e.particleCreated?.(this);
	}
	isInsideCanvas() {
		let e = this.getRadius(), t = this.container.canvas.size, n = this.position;
		return n.x >= -e && n.y >= -e && n.y <= t.height + e && n.x <= t.width + e;
	}
	isVisible() {
		return !this.destroyed && !this.spawning && this.isInsideCanvas();
	}
	reset() {
		for (let e of this.container.particles.updaters) e.reset?.(this);
	}
}, Or = class {
	constructor(e, t) {
		this.position = e, this.particle = t;
	}
}, kr;
(function(e) {
	e.circle = "circle", e.rectangle = "rectangle";
})(kr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/Ranges.js
var Ar = class {
	constructor(e, t, n) {
		this.position = {
			x: e,
			y: t
		}, this.type = n;
	}
}, jr = class e extends Ar {
	constructor(e, t, n) {
		super(e, t, kr.circle), this.radius = n;
	}
	contains(e) {
		return Ie(e, this.position) <= this.radius;
	}
	intersects(t) {
		let n = this.position, r = t.position, i = {
			x: Math.abs(r.x - n.x),
			y: Math.abs(r.y - n.y)
		}, a = this.radius;
		if (t instanceof e || t.type === kr.circle) return a + t.radius > Math.sqrt(i.x ** 2 + i.y ** 2);
		if (t instanceof Mr || t.type === kr.rectangle) {
			let { width: e, height: n } = t.size;
			return (i.x - e) ** 2 + (i.y - n) ** 2 <= a ** 2 || i.x <= a + e && i.y <= a + n || i.x <= e || i.y <= n;
		}
		return !1;
	}
}, Mr = class e extends Ar {
	constructor(e, t, n, r) {
		super(e, t, kr.rectangle), this.size = {
			height: r,
			width: n
		};
	}
	contains(e) {
		let t = this.size.width, n = this.size.height, r = this.position;
		return e.x >= r.x && e.x <= r.x + t && e.y >= r.y && e.y <= r.y + n;
	}
	intersects(t) {
		if (t instanceof jr) return t.intersects(this);
		let n = this.size.width, r = this.size.height, i = this.position, a = t.position, o = t instanceof e ? t.size : {
			width: 0,
			height: 0
		}, s = o.width, c = o.height;
		return a.x < i.x + n && a.x + s > i.x && a.y < i.y + r && a.y + c > i.y;
	}
}, Nr = class e {
	constructor(t, n) {
		this.rectangle = t, this.capacity = n, this._subdivide = () => {
			let { x: t, y: n } = this.rectangle.position, { width: r, height: i } = this.rectangle.size, { capacity: a } = this;
			for (let o = 0; o < 4; o++) {
				let s = o % 2;
				this._subs.push(new e(new Mr(t + r * ce * s, n + i * ce * (Math.round(o * ce) - s), r * ce, i * ce), a));
			}
			this._divided = !0;
		}, this._points = [], this._divided = !1, this._subs = [];
	}
	insert(e) {
		return this.rectangle.contains(e.position) ? this._points.length < this.capacity ? (this._points.push(e), !0) : (this._divided || this._subdivide(), this._subs.some((t) => t.insert(e))) : !1;
	}
	query(e, t) {
		let n = [];
		if (!e.intersects(this.rectangle)) return [];
		for (let r of this._points) !e.contains(r.position) && Ie(e.position, r.position) > r.particle.getRadius() && (!t || t(r.particle)) || n.push(r.particle);
		if (this._divided) for (let r of this._subs) n.push(...r.query(e, t));
		return n;
	}
	queryCircle(e, t, n) {
		return this.query(new jr(e.x, e.y, t), n);
	}
	queryRectangle(e, t, n) {
		return this.query(new Mr(e.x, e.y, t.width, t.height), n);
	}
}, Pr = (e) => {
	let { height: t, width: n } = e;
	return new Mr(ve * n, ve * t, ye * n, ye * t);
}, Fr = class {
	constructor(e, t) {
		this._addToPool = (...e) => {
			this._pool.push(...e);
		}, this._applyDensity = (e, t, n, r) => {
			let i = e.number;
			if (!e.number.density?.enable) {
				n === void 0 ? this._limit = i.limit.value : (r?.number.limit?.value ?? i.limit.value) && this._groupLimits.set(n, r?.number.limit?.value ?? i.limit.value);
				return;
			}
			let a = this._initDensityFactor(i.density), o = i.value, s = i.limit.value > 0 ? i.limit.value : o, c = Math.min(o, s) * a + t, l = Math.min(this.count, this.filter((e) => e.group === n).length);
			n === void 0 ? this._limit = i.limit.value * a : this._groupLimits.set(n, i.limit.value * a), l < c ? this.push(Math.abs(c - l), void 0, e, n) : l > c && this.removeQuantity(l - c, n);
		}, this._initDensityFactor = (e) => {
			let t = this._container;
			if (!t.canvas.element || !e.enable) return 1;
			let n = t.canvas.element, r = t.retina.pixelRatio;
			return n.width * n.height / (e.height * e.width * r ** 2);
		}, this._pushParticle = (e, t, n, r) => {
			try {
				let i = this._pool.pop();
				i ||= new Dr(this._engine, this._container), i.init(this._nextId, e, t, n);
				let a = !0;
				return r && (a = r(i)), a ? (this._array.push(i), this._zArray.push(i), this._nextId++, this._engine.dispatchEvent(fn.particleAdded, {
					container: this._container,
					data: { particle: i }
				}), i) : void 0;
			} catch (e) {
				Ye().warning(`${se} adding particle: ${e}`);
			}
		}, this._removeParticle = (e, t, n) => {
			let r = this._array[e];
			if (!r || r.group !== t) return !1;
			let i = this._zArray.indexOf(r);
			return this._array.splice(e, 1), this._zArray.splice(i, 1), r.destroy(n), this._engine.dispatchEvent(fn.particleRemoved, {
				container: this._container,
				data: { particle: r }
			}), this._addToPool(r), !0;
		}, this._engine = e, this._container = t, this._nextId = 0, this._array = [], this._zArray = [], this._pool = [], this._limit = 0, this._groupLimits = /* @__PURE__ */ new Map(), this._needsSort = !1, this._lastZIndex = 0, this._interactionManager = new Sr(e, t), this._pluginsInitialized = !1;
		let n = t.canvas.size;
		this.quadTree = new Nr(Pr(n), 4), this.movers = [], this.updaters = [];
	}
	get count() {
		return this._array.length;
	}
	addManualParticles() {
		let e = this._container;
		e.actualOptions.manualParticles.forEach((t) => this.addParticle(t.position ? Ct(t.position, e.canvas.size) : void 0, t.options));
	}
	addParticle(e, t, n, r) {
		let i = this._container.actualOptions.particles.number.limit.mode, a = n === void 0 ? this._limit : this._groupLimits.get(n) ?? this._limit, o = this.count;
		if (a > 0) switch (i) {
			case cr.delete: {
				let e = o + 1 - a;
				e > 0 && this.removeQuantity(e);
				break;
			}
			case cr.wait: if (o >= a) return;
		}
		return this._pushParticle(e, t, n, r);
	}
	clear() {
		this._array = [], this._zArray = [], this._pluginsInitialized = !1;
	}
	destroy() {
		this._array = [], this._zArray = [], this.movers = [], this.updaters = [];
	}
	draw(e) {
		let t = this._container, n = t.canvas;
		n.clear(), this.update(e);
		for (let r of t.plugins.values()) n.drawPlugin(r, e);
		for (let t of this._zArray) t.draw(e);
	}
	filter(e) {
		return this._array.filter(e);
	}
	find(e) {
		return this._array.find(e);
	}
	get(e) {
		return this._array[e];
	}
	handleClickMode(e) {
		this._interactionManager.handleClickMode(e);
	}
	async init() {
		let e = this._container, t = e.actualOptions;
		this._lastZIndex = 0, this._needsSort = !1, await this.initPlugins();
		let n = !1;
		for (let t of e.plugins.values()) if (n = t.particlesInitialization?.() ?? n, n) break;
		if (this.addManualParticles(), !n) {
			let e = t.particles, n = e.groups;
			for (let t in n) {
				let r = n[t];
				for (let n = this.count, i = 0; i < r.number?.value && n < e.number.value; n++, i++) this.addParticle(void 0, r, t);
			}
			for (let t = this.count; t < e.number.value; t++) this.addParticle();
		}
	}
	async initPlugins() {
		if (this._pluginsInitialized) return;
		let e = this._container;
		this.movers = await this._engine.getMovers(e, !0), this.updaters = await this._engine.getUpdaters(e, !0), await this._interactionManager.init();
		for (let t of e.pathGenerators.values()) t.init(e);
	}
	push(e, t, n, r) {
		for (let i = 0; i < e; i++) this.addParticle(t?.position, n, r);
	}
	async redraw() {
		this.clear(), await this.init(), this.draw({
			value: 0,
			factor: 0
		});
	}
	remove(e, t, n) {
		this.removeAt(this._array.indexOf(e), void 0, t, n);
	}
	removeAt(e, t = 1, n, r) {
		if (e < 0 || e > this.count) return;
		let i = 0;
		for (let a = e; i < t && a < this.count; a++) this._removeParticle(a, n, r) && (a--, i++);
	}
	removeQuantity(e, t) {
		this.removeAt(0, e, t);
	}
	setDensity() {
		let e = this._container.actualOptions, t = e.particles.groups, n = e.manualParticles.length;
		for (let e in t) this._applyDensity(t[e], n, e);
		this._applyDensity(e.particles, n);
	}
	setLastZIndex(e) {
		this._lastZIndex = e, this._needsSort = this._needsSort || this._lastZIndex < e;
	}
	setResizeFactor(e) {
		this._resizeFactor = e;
	}
	update(e) {
		let t = this._container, n = /* @__PURE__ */ new Set();
		this.quadTree = new Nr(Pr(t.canvas.size), 4);
		for (let e of t.pathGenerators.values()) e.update();
		for (let n of t.plugins.values()) n.update?.(e);
		let r = this._resizeFactor;
		for (let t of this._array) {
			r && !t.ignoresResizeRatio && (t.position.x *= r.width, t.position.y *= r.height, t.initialPosition.x *= r.width, t.initialPosition.y *= r.height), t.ignoresResizeRatio = !1, this._interactionManager.reset(t);
			for (let n of this._container.plugins.values()) {
				if (t.destroyed) break;
				n.particleUpdate?.(t, e);
			}
			for (let n of this.movers) n.isEnabled(t) && n.move(t, e);
			if (t.destroyed) {
				n.add(t);
				continue;
			}
			this.quadTree.insert(new Or(t.getPosition(), t));
		}
		if (n.size) {
			let e = (e) => !n.has(e);
			this._array = this.filter(e), this._zArray = this._zArray.filter(e);
			for (let e of n) this._engine.dispatchEvent(fn.particleRemoved, {
				container: this._container,
				data: { particle: e }
			});
			this._addToPool(...n);
		}
		this._interactionManager.externalInteract(e);
		for (let t of this._array) {
			for (let n of this.updaters) n.update(t, e);
			!t.destroyed && !t.spawning && this._interactionManager.particlesInteract(t, e);
		}
		if (delete this._resizeFactor, this._needsSort) {
			let e = this._zArray;
			e.sort((e, t) => t.position.z - e.position.z || e.id - t.id), this._lastZIndex = e[e.length - 1].position.z, this._needsSort = !1;
		}
	}
}, Ir = class {
	constructor(e) {
		this.container = e, this.pixelRatio = 1, this.reduceFactor = 1;
	}
	init() {
		let e = this.container, t = e.actualOptions;
		this.pixelRatio = !t.detectRetina || $e() ? 1 : devicePixelRatio, this.reduceFactor = 1;
		let n = this.pixelRatio, r = e.canvas;
		if (r.element) {
			let e = r.element;
			r.size.width = e.offsetWidth * n, r.size.height = e.offsetHeight * n;
		}
		let i = t.particles, a = i.move;
		this.maxSpeed = k(a.gravity.maxSpeed) * n, this.sizeAnimationSpeed = k(i.size.animation.speed) * n;
	}
	initParticle(e) {
		let t = e.options, n = this.pixelRatio, r = t.move, i = r.distance, a = e.retina;
		a.moveDrift = k(r.drift) * n, a.moveSpeed = k(r.speed) * n, a.sizeAnimationSpeed = k(t.size.animation.speed) * n;
		let o = a.maxDistance;
		o.horizontal = i.horizontal === void 0 ? void 0 : i.horizontal * n, o.vertical = i.vertical === void 0 ? void 0 : i.vertical * n, a.maxSpeed = k(r.gravity.maxSpeed) * n;
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Container.js
function Lr(e) {
	return e && !e.destroyed;
}
function Rr(e, t = 60, n = !1) {
	return {
		value: e,
		factor: n ? 60 / t : 60 * e / le
	};
}
function zr(e, t, ...n) {
	let r = new br(e, t);
	return vr(r, ...n), r;
}
var Br = class {
	constructor(e, t, n) {
		this._intersectionManager = (e) => {
			if (Lr(this) && this.actualOptions.pauseOnOutsideViewport) for (let t of e) t.target === this.interactivity.element && (t.isIntersecting ? this.play() : this.pause());
		}, this._nextFrame = (e) => {
			try {
				if (!this._smooth && this._lastFrameTime !== void 0 && e < this._lastFrameTime + 1e3 / this.fpsLimit) {
					this.draw(!1);
					return;
				}
				this._lastFrameTime ??= e;
				let t = Rr(e - this._lastFrameTime, this.fpsLimit, this._smooth);
				if (this.addLifeTime(t.value), this._lastFrameTime = e, t.value > 1e3) {
					this.draw(!1);
					return;
				}
				if (this.particles.draw(t), !this.alive()) {
					this.destroy();
					return;
				}
				this.animationStatus && this.draw(!1);
			} catch (e) {
				Ye().error(`${se} in animation loop`, e);
			}
		}, this._engine = e, this.id = Symbol(t), this.fpsLimit = 120, this._smooth = !1, this._delay = 0, this._duration = 0, this._lifeTime = 0, this._firstStart = !0, this.started = !1, this.destroyed = !1, this._paused = !0, this._lastFrameTime = 0, this.zLayers = 100, this.pageHidden = !1, this._clickHandlers = /* @__PURE__ */ new Map(), this._sourceOptions = n, this._initialSourceOptions = n, this.retina = new Ir(this), this.canvas = new cn(this, this._engine), this.particles = new Fr(this._engine, this), this.pathGenerators = /* @__PURE__ */ new Map(), this.interactivity = { mouse: {
			clicking: !1,
			inside: !1
		} }, this.plugins = /* @__PURE__ */ new Map(), this.effectDrawers = /* @__PURE__ */ new Map(), this.shapeDrawers = /* @__PURE__ */ new Map(), this._options = zr(this._engine, this), this.actualOptions = zr(this._engine, this), this._eventListeners = new dn(this), this._intersectionObserver = nt((e) => this._intersectionManager(e)), this._engine.dispatchEvent(fn.containerBuilt, { container: this });
	}
	get animationStatus() {
		return !this._paused && !this.pageHidden && Lr(this);
	}
	get options() {
		return this._options;
	}
	get sourceOptions() {
		return this._sourceOptions;
	}
	addClickHandler(e) {
		if (!Lr(this)) return;
		let t = this.interactivity.element;
		if (!t) return;
		let n = (t, n, r) => {
			if (!Lr(this)) return;
			let i = this.retina.pixelRatio, a = {
				x: n.x * i,
				y: n.y * i
			};
			e(t, this.particles.quadTree.queryCircle(a, r * i));
		}, r = (e) => {
			if (!Lr(this)) return;
			let t = e, r = {
				x: t.offsetX || t.clientX,
				y: t.offsetY || t.clientY
			};
			n(e, r, 1);
		}, i = () => {
			Lr(this) && (c = !0, l = !1);
		}, a = () => {
			Lr(this) && (l = !0);
		}, o = (e) => {
			if (Lr(this)) {
				if (c && !l) {
					let t = e, r = t.touches[t.touches.length - 1];
					if (!r && (r = t.changedTouches[t.changedTouches.length - 1], !r)) return;
					let i = this.canvas.element, a = i ? i.getBoundingClientRect() : void 0, o = {
						x: r.clientX - (a ? a.left : 0),
						y: r.clientY - (a ? a.top : 0)
					};
					n(e, o, Math.max(r.radiusX, r.radiusY));
				}
				c = !1, l = !1;
			}
		}, s = () => {
			Lr(this) && (c = !1, l = !1);
		}, c = !1, l = !1;
		this._clickHandlers.set("click", r), this._clickHandlers.set("touchstart", i), this._clickHandlers.set("touchmove", a), this._clickHandlers.set("touchend", o), this._clickHandlers.set("touchcancel", s);
		for (let [e, n] of this._clickHandlers) t.addEventListener(e, n);
	}
	addLifeTime(e) {
		this._lifeTime += e;
	}
	addPath(e, t, n = !1) {
		return !Lr(this) || !n && this.pathGenerators.has(e) ? !1 : (this.pathGenerators.set(e, t), !0);
	}
	alive() {
		return !this._duration || this._lifeTime <= this._duration;
	}
	clearClickHandlers() {
		if (Lr(this)) {
			for (let [e, t] of this._clickHandlers) this.interactivity.element?.removeEventListener(e, t);
			this._clickHandlers.clear();
		}
	}
	destroy(e = !0) {
		if (Lr(this)) {
			this.stop(), this.clearClickHandlers(), this.particles.destroy(), this.canvas.destroy();
			for (let e of this.effectDrawers.values()) e.destroy?.(this);
			for (let e of this.shapeDrawers.values()) e.destroy?.(this);
			for (let e of this.effectDrawers.keys()) this.effectDrawers.delete(e);
			for (let e of this.shapeDrawers.keys()) this.shapeDrawers.delete(e);
			if (this._engine.clearPlugins(this), this.destroyed = !0, e) {
				let e = this._engine.items, t = e.findIndex((e) => e === this);
				t >= 0 && e.splice(t, 1);
			}
			this._engine.dispatchEvent(fn.containerDestroyed, { container: this });
		}
	}
	draw(e) {
		if (!Lr(this)) return;
		let t = e, n = (e) => {
			t &&= (this._lastFrameTime = void 0, !1), this._nextFrame(e);
		};
		this._drawAnimationFrame = Oe((e) => n(e));
	}
	async export(e, t = {}) {
		for (let n of this.plugins.values()) {
			if (!n.export) continue;
			let r = await n.export(e, t);
			if (r.supported) return r.blob;
		}
		Ye().error(`${se} - Export plugin with type ${e} not found`);
	}
	handleClickMode(e) {
		if (Lr(this)) {
			this.particles.handleClickMode(e);
			for (let t of this.plugins.values()) t.handleClickMode?.(e);
		}
	}
	async init() {
		if (!Lr(this)) return;
		let e = this._engine.getSupportedEffects();
		for (let t of e) {
			let e = this._engine.getEffectDrawer(t);
			e && this.effectDrawers.set(t, e);
		}
		let t = this._engine.getSupportedShapes();
		for (let e of t) {
			let t = this._engine.getShapeDrawer(e);
			t && this.shapeDrawers.set(e, t);
		}
		await this.particles.initPlugins(), this._options = zr(this._engine, this, this._initialSourceOptions, this.sourceOptions), this.actualOptions = zr(this._engine, this, this._options);
		let n = await this._engine.getAvailablePlugins(this);
		for (let [e, t] of n) this.plugins.set(e, t);
		this.retina.init(), await this.canvas.init(), this.updateActualOptions(), this.canvas.initBackground(), this.canvas.resize();
		let { zLayers: r, duration: i, delay: a, fpsLimit: o, smooth: s } = this.actualOptions;
		this.zLayers = r, this._duration = k(i) * le, this._delay = k(a) * le, this._lifeTime = 0, this.fpsLimit = o > 0 ? o : 120, this._smooth = s;
		for (let e of this.effectDrawers.values()) await e.init?.(this);
		for (let e of this.shapeDrawers.values()) await e.init?.(this);
		for (let e of this.plugins.values()) await e.init?.();
		this._engine.dispatchEvent(fn.containerInit, { container: this }), await this.particles.init(), this.particles.setDensity();
		for (let e of this.plugins.values()) e.particlesSetup?.();
		this._engine.dispatchEvent(fn.particlesSetup, { container: this });
	}
	async loadTheme(e) {
		Lr(this) && (this._currentTheme = e, await this.refresh());
	}
	pause() {
		if (Lr(this) && (this._drawAnimationFrame !== void 0 && (ke(this._drawAnimationFrame), delete this._drawAnimationFrame), !this._paused)) {
			for (let e of this.plugins.values()) e.pause?.();
			this.pageHidden || (this._paused = !0), this._engine.dispatchEvent(fn.containerPaused, { container: this });
		}
	}
	play(e) {
		if (!Lr(this)) return;
		let t = this._paused || e;
		if (this._firstStart && !this.actualOptions.autoPlay) {
			this._firstStart = !1;
			return;
		}
		if (this._paused &&= !1, t) for (let e of this.plugins.values()) e.play && e.play();
		this._engine.dispatchEvent(fn.containerPlay, { container: this }), this.draw(t ?? !1);
	}
	async refresh() {
		if (Lr(this)) return this.stop(), this.start();
	}
	async reset(e) {
		if (Lr(this)) return this._initialSourceOptions = e, this._sourceOptions = e, this._options = zr(this._engine, this, this._initialSourceOptions, this.sourceOptions), this.actualOptions = zr(this._engine, this, this._options), this.refresh();
	}
	async start() {
		Lr(this) && !this.started && (await this.init(), this.started = !0, await new Promise((e) => {
			let t = async () => {
				this._eventListeners.addListeners(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.observe(this.interactivity.element);
				for (let e of this.plugins.values()) await e.start?.();
				this._engine.dispatchEvent(fn.containerStarted, { container: this }), this.play(), e();
			};
			this._delayTimeout = setTimeout(() => void t(), this._delay);
		}));
	}
	stop() {
		if (Lr(this) && this.started) {
			this._delayTimeout && (clearTimeout(this._delayTimeout), delete this._delayTimeout), this._firstStart = !0, this.started = !1, this._eventListeners.removeListeners(), this.pause(), this.particles.clear(), this.canvas.stop(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.unobserve(this.interactivity.element);
			for (let e of this.plugins.values()) e.stop?.();
			for (let e of this.plugins.keys()) this.plugins.delete(e);
			this._sourceOptions = this._options, this._engine.dispatchEvent(fn.containerStopped, { container: this });
		}
	}
	updateActualOptions() {
		this.actualOptions.responsive = [];
		let e = this.actualOptions.setResponsive(this.canvas.size.width, this.retina.pixelRatio, this._options);
		return this.actualOptions.setTheme(this._currentTheme), this._responsiveMaxWidth !== e && (this._responsiveMaxWidth = e, !0);
	}
}, Vr = class {
	constructor() {
		this._listeners = /* @__PURE__ */ new Map();
	}
	addEventListener(e, t) {
		this.removeEventListener(e, t);
		let n = this._listeners.get(e);
		n || (n = [], this._listeners.set(e, n)), n.push(t);
	}
	dispatchEvent(e, t) {
		this._listeners.get(e)?.forEach((e) => e(t));
	}
	hasEventListener(e) {
		return !!this._listeners.get(e);
	}
	removeAllEventListeners(e) {
		e ? this._listeners.delete(e) : this._listeners = /* @__PURE__ */ new Map();
	}
	removeEventListener(e, t) {
		let n = this._listeners.get(e);
		if (!n) return;
		let r = n.length, i = n.indexOf(t);
		i < 0 || (r === 1 ? this._listeners.delete(e) : n.splice(i, 1));
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Engine.js
async function Hr(e, t, n, r = !1) {
	let i = t.get(e);
	return (!i || r) && (i = await Promise.all([...n.values()].map((t) => t(e))), t.set(e, i)), i;
}
async function Ur(e) {
	let t = yt(e.url, e.index);
	if (!t) return e.fallback;
	let n = await fetch(t);
	return n.ok ? await n.json() : (Ye().error(`${se} ${n.status} while retrieving config file`), e.fallback);
}
var Wr = (e) => {
	let t;
	if (e instanceof HTMLCanvasElement || e.tagName.toLowerCase() === "canvas") t = e, t.dataset.generated || (t.dataset[y] = me);
	else {
		let n = e.getElementsByTagName(he);
		n.length ? (t = n[0], t.dataset[y] = me) : (t = document.createElement(he), t.dataset[y] = pe, e.appendChild(t));
	}
	let n = "100%";
	return t.style.width || (t.style.width = n), t.style.height || (t.style.height = n), t;
}, Gr = (e, t) => {
	let n = t ?? document.getElementById(e);
	return n || (n = document.createElement("div"), n.id = e, n.dataset[y] = pe, document.body.append(n), n);
}, Kr = class {
	constructor() {
		this._configs = /* @__PURE__ */ new Map(), this._domArray = [], this._eventDispatcher = new Vr(), this._initialized = !1, this.plugins = [], this.colorManagers = /* @__PURE__ */ new Map(), this.easingFunctions = /* @__PURE__ */ new Map(), this._initializers = {
			interactors: /* @__PURE__ */ new Map(),
			movers: /* @__PURE__ */ new Map(),
			updaters: /* @__PURE__ */ new Map()
		}, this.interactors = /* @__PURE__ */ new Map(), this.movers = /* @__PURE__ */ new Map(), this.updaters = /* @__PURE__ */ new Map(), this.presets = /* @__PURE__ */ new Map(), this.effectDrawers = /* @__PURE__ */ new Map(), this.shapeDrawers = /* @__PURE__ */ new Map(), this.pathGenerators = /* @__PURE__ */ new Map();
	}
	get configs() {
		let e = {};
		for (let [t, n] of this._configs) e[t] = n;
		return e;
	}
	get items() {
		return this._domArray;
	}
	get version() {
		return "3.9.1";
	}
	async addColorManager(e, t = !0) {
		this.colorManagers.set(e.key, e), await this.refresh(t);
	}
	addConfig(e) {
		let t = e.key ?? e.name ?? "default";
		this._configs.set(t, e), this._eventDispatcher.dispatchEvent(fn.configAdded, { data: {
			name: t,
			config: e
		} });
	}
	async addEasing(e, t, n = !0) {
		this.getEasing(e) || (this.easingFunctions.set(e, t), await this.refresh(n));
	}
	async addEffect(e, t, n = !0) {
		vt(e, (e) => {
			this.getEffectDrawer(e) || this.effectDrawers.set(e, t);
		}), await this.refresh(n);
	}
	addEventListener(e, t) {
		this._eventDispatcher.addEventListener(e, t);
	}
	async addInteractor(e, t, n = !0) {
		this._initializers.interactors.set(e, t), await this.refresh(n);
	}
	async addMover(e, t, n = !0) {
		this._initializers.movers.set(e, t), await this.refresh(n);
	}
	async addParticleUpdater(e, t, n = !0) {
		this._initializers.updaters.set(e, t), await this.refresh(n);
	}
	async addPathGenerator(e, t, n = !0) {
		this.getPathGenerator(e) || this.pathGenerators.set(e, t), await this.refresh(n);
	}
	async addPlugin(e, t = !0) {
		this.getPlugin(e.id) || this.plugins.push(e), await this.refresh(t);
	}
	async addPreset(e, t, n = !1, r = !0) {
		(n || !this.getPreset(e)) && this.presets.set(e, t), await this.refresh(r);
	}
	async addShape(e, t = !0) {
		for (let t of e.validTypes) this.getShapeDrawer(t) || this.shapeDrawers.set(t, e);
		await this.refresh(t);
	}
	checkVersion(e) {
		if (this.version !== e) throw Error(`The tsParticles version is different from the loaded plugins version. Engine version: ${this.version}. Plugin version: ${e}`);
	}
	clearPlugins(e) {
		this.updaters.delete(e), this.movers.delete(e), this.interactors.delete(e);
	}
	dispatchEvent(e, t) {
		this._eventDispatcher.dispatchEvent(e, t);
	}
	dom() {
		return this.items;
	}
	domItem(e) {
		return this.item(e);
	}
	async getAvailablePlugins(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.plugins) n.needsPlugin(e.actualOptions) && t.set(n.id, await n.getPlugin(e));
		return t;
	}
	getEasing(e) {
		return this.easingFunctions.get(e) ?? ((e) => e);
	}
	getEffectDrawer(e) {
		return this.effectDrawers.get(e);
	}
	async getInteractors(e, t = !1) {
		return Hr(e, this.interactors, this._initializers.interactors, t);
	}
	async getMovers(e, t = !1) {
		return Hr(e, this.movers, this._initializers.movers, t);
	}
	getPathGenerator(e) {
		return this.pathGenerators.get(e);
	}
	getPlugin(e) {
		return this.plugins.find((t) => t.id === e);
	}
	getPreset(e) {
		return this.presets.get(e);
	}
	getShapeDrawer(e) {
		return this.shapeDrawers.get(e);
	}
	getSupportedEffects() {
		return this.effectDrawers.keys();
	}
	getSupportedShapes() {
		return this.shapeDrawers.keys();
	}
	async getUpdaters(e, t = !1) {
		return Hr(e, this.updaters, this._initializers.updaters, t);
	}
	init() {
		this._initialized ||= !0;
	}
	item(e) {
		let { items: t } = this, n = t[e];
		if (!n || n.destroyed) {
			t.splice(e, 1);
			return;
		}
		return n;
	}
	async load(e) {
		let t = e.id ?? e.element?.id ?? `tsparticles${Math.floor(O() * 1e4)}`, { index: n, url: r } = e, i = yt(r ? await Ur({
			fallback: e.options,
			url: r,
			index: n
		}) : e.options, n), { items: a } = this, o = a.findIndex((e) => e.id.description === t), s = new Br(this, t, i);
		if (o >= 0) {
			let e = this.item(o), t = +!!e;
			e && !e.destroyed && e.destroy(!1), a.splice(o, t, s);
		} else a.push(s);
		let c = Wr(Gr(t, e.element));
		return s.canvas.loadCanvas(c), await s.start(), s;
	}
	loadOptions(e, t) {
		this.plugins.forEach((n) => n.loadOptions?.(e, t));
	}
	loadParticlesOptions(e, t, ...n) {
		let r = this.updaters.get(e);
		r && r.forEach((e) => e.loadOptions?.(t, ...n));
	}
	async refresh(e = !0) {
		e && await Promise.all(this.items.map((e) => e.refresh()));
	}
	removeEventListener(e, t) {
		this._eventDispatcher.removeEventListener(e, t);
	}
	setOnClickHandler(e) {
		let { items: t } = this;
		if (!t.length) throw Error(`${se} can only set click handlers after calling tsParticles.load()`);
		t.forEach((t) => t.addClickHandler(e));
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/init.js
function qr() {
	let e = new Kr();
	return e.init(), e;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/ExternalInteractorBase.js
var Jr = class {
	constructor(e) {
		this.type = xr.external, this.container = e;
	}
}, Yr = class {
	constructor(e) {
		this.type = xr.particles, this.container = e;
	}
}, Xr;
(function(e) {
	e.clockwise = "clockwise", e.counterClockwise = "counter-clockwise", e.random = "random";
})(Xr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/EasingType.js
var Zr;
(function(e) {
	e.easeInBack = "ease-in-back", e.easeInCirc = "ease-in-circ", e.easeInCubic = "ease-in-cubic", e.easeInLinear = "ease-in-linear", e.easeInQuad = "ease-in-quad", e.easeInQuart = "ease-in-quart", e.easeInQuint = "ease-in-quint", e.easeInExpo = "ease-in-expo", e.easeInSine = "ease-in-sine", e.easeOutBack = "ease-out-back", e.easeOutCirc = "ease-out-circ", e.easeOutCubic = "ease-out-cubic", e.easeOutLinear = "ease-out-linear", e.easeOutQuad = "ease-out-quad", e.easeOutQuart = "ease-out-quart", e.easeOutQuint = "ease-out-quint", e.easeOutExpo = "ease-out-expo", e.easeOutSine = "ease-out-sine", e.easeInOutBack = "ease-in-out-back", e.easeInOutCirc = "ease-in-out-circ", e.easeInOutCubic = "ease-in-out-cubic", e.easeInOutLinear = "ease-in-out-linear", e.easeInOutQuad = "ease-in-out-quad", e.easeInOutQuart = "ease-in-out-quart", e.easeInOutQuint = "ease-in-out-quint", e.easeInOutExpo = "ease-in-out-expo", e.easeInOutSine = "ease-in-out-sine";
})(Zr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/index.js
var Qr = qr();
$e() || (window.tsParticles = Qr);
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var $r = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), P = (/* @__PURE__ */ o(((e, t) => {
	t.exports = $r();
})))(), ei = (e) => {
	let t = e.id ?? "tsparticles";
	return (0, _.useEffect)(() => {
		let n;
		return Qr.load({
			id: t,
			url: e.url,
			options: e.options
		}).then((t) => {
			var r;
			n = t, (r = e.particlesLoaded) == null || r.call(e, t);
		}), () => {
			n?.destroy();
		};
	}, [
		t,
		e,
		e.url,
		e.options
	]), /* @__PURE__ */ (0, P.jsx)("div", {
		id: t,
		className: e.className
	});
};
//#endregion
//#region node_modules/@tsparticles/react/dist/index.js
async function ti(e) {
	await e(Qr);
}
//#endregion
//#region node_modules/@tsparticles/move-base/browser/Utils.js
var ni = .5, ri = 2, ii = 0, ai = 1, oi = 60, si = 0, ci = .01, li = Math.PI * ri;
function ui(e) {
	let t = e.initialPosition, { dx: n, dy: r } = Fe(t, e.position), i = Math.abs(n), a = Math.abs(r), { maxDistance: o } = e.retina, s = o.horizontal, c = o.vertical;
	if (s || c) {
		if ((((s && i >= s) ?? !1) || ((c && a >= c) ?? !1)) && !e.misplaced) e.misplaced = !!s && i > s || !!c && a > c, s && (e.velocity.x = e.velocity.y * ni - e.velocity.x), c && (e.velocity.y = e.velocity.x * ni - e.velocity.y);
		else if ((!s || i < s) && (!c || a < c) && e.misplaced) e.misplaced = !1;
		else if (e.misplaced) {
			let n = e.position, r = e.velocity;
			s && (n.x < t.x && r.x < ii || n.x > t.x && r.x > ii) && (r.x *= -O()), c && (n.y < t.y && r.y < ii || n.y > t.y && r.y > ii) && (r.y *= -O());
		}
	}
}
function di(e, t, n, r, i, a, o) {
	pi(e, o);
	let s = e.gravity, c = s?.enable && s.inverse ? -1 : ai;
	i && n && (e.velocity.x += i * o.factor / (oi * n)), s?.enable && n && (e.velocity.y += c * (s.acceleration * o.factor) / (oi * n));
	let l = e.moveDecay;
	e.velocity.multTo(l);
	let u = e.velocity.mult(n);
	s?.enable && r > ii && (!s.inverse && u.y >= ii && u.y >= r || s.inverse && u.y <= ii && u.y <= -r) && (u.y = c * r, n && (e.velocity.y = u.y / n));
	let d = e.options.zIndex, f = (ai - e.zIndexFactor) ** d.velocityRate;
	u.multTo(f), u.multTo(a);
	let { position: p } = e;
	p.addTo(u), t.vibrate && (p.x += Math.sin(p.x * Math.cos(p.y)) * a, p.y += Math.cos(p.y * Math.sin(p.x)) * a);
}
function fi(e, t, n) {
	let r = e.container;
	if (!e.spin) return;
	let i = e.spin.direction === Xr.clockwise, a = {
		x: i ? Math.cos : Math.sin,
		y: i ? Math.sin : Math.cos
	};
	e.position.x = e.spin.center.x + e.spin.radius * a.x(e.spin.angle) * n, e.position.y = e.spin.center.y + e.spin.radius * a.y(e.spin.angle) * n, e.spin.radius += e.spin.acceleration * n;
	let o = Math.max(r.canvas.size.width, r.canvas.size.height), s = o * ni;
	e.spin.radius > s ? (e.spin.radius = s, e.spin.acceleration *= -1) : e.spin.radius < si && (e.spin.radius = si, e.spin.acceleration *= -1), e.spin.angle += t * ci * (ai - e.spin.radius / o);
}
function pi(e, t) {
	let n = e.options.move.path;
	if (!n.enable) return;
	if (e.lastPathTime <= e.pathDelay) {
		e.lastPathTime += t.value;
		return;
	}
	let r = e.pathGenerator?.generate(e, t);
	r && e.velocity.addTo(r), n.clamp && (e.velocity.x = Ae(e.velocity.x, -1, ai), e.velocity.y = Ae(e.velocity.y, -1, ai)), e.lastPathTime -= e.pathDelay;
}
function mi(e) {
	return e.slow.inRange ? e.slow.factor : ai;
}
function hi(e) {
	let t = e.container, n = e.options.move.spin;
	if (!n.enable) return;
	let r = n.position ?? {
		x: 50,
		y: 50
	}, i = .01, a = {
		x: r.x * i * t.canvas.size.width,
		y: r.y * i * t.canvas.size.height
	}, o = Ie(e.getPosition(), a), s = k(n.acceleration);
	e.retina.spinAcceleration = s * t.retina.pixelRatio, e.spin = {
		center: a,
		direction: e.velocity.x >= ii ? Xr.clockwise : Xr.counterClockwise,
		angle: O() * li,
		radius: o,
		acceleration: e.retina.spinAcceleration
	};
}
//#endregion
//#region node_modules/@tsparticles/move-base/browser/BaseMover.js
var gi = 2, _i = 1, vi = 1, yi = class {
	init(e) {
		let t = e.options.move.gravity;
		e.gravity = {
			enable: t.enable,
			acceleration: k(t.acceleration),
			inverse: t.inverse
		}, hi(e);
	}
	isEnabled(e) {
		return !e.destroyed && e.options.move.enable;
	}
	move(e, t) {
		let n = e.options, r = n.move;
		if (!r.enable) return;
		let i = e.container, a = i.retina.pixelRatio;
		e.retina.moveSpeed ??= k(r.speed) * a, e.retina.moveDrift ??= k(e.options.move.drift) * a;
		let o = mi(e), s = i.retina.reduceFactor, c = e.retina.moveSpeed, l = e.retina.moveDrift, u = Pe(n.size.value) * a, d = r.size ? e.getRadius() / u : _i, f = t.factor || vi, p = c * d * o * f / gi, m = e.retina.maxSpeed ?? i.retina.maxSpeed;
		r.spin.enable ? fi(e, p, s) : di(e, r, p, m, l, s, t), ui(e);
	}
};
//#endregion
//#region node_modules/@tsparticles/move-base/browser/index.js
async function bi(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addMover("base", () => Promise.resolve(new yi()), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-circle/browser/Utils.js
var xi = Math.PI * 2, Si = 0, Ci = {
	x: 0,
	y: 0
};
function wi(e) {
	let { context: t, particle: n, radius: r } = e;
	n.circleRange ||= {
		min: Si,
		max: xi
	};
	let i = n.circleRange;
	t.arc(Ci.x, Ci.y, r, i.min, i.max, !1);
}
//#endregion
//#region node_modules/@tsparticles/shape-circle/browser/CircleDrawer.js
var Ti = 12, Ei = 360, Di = 0, Oi = class {
	constructor() {
		this.validTypes = ["circle"];
	}
	draw(e) {
		wi(e);
	}
	getSidesCount() {
		return Ti;
	}
	particleInit(e, t) {
		let n = t.shapeData?.angle ?? {
			max: Ei,
			min: Di
		};
		t.circleRange = Ce(n) ? {
			min: Le(n.min),
			max: Le(n.max)
		} : {
			min: Di,
			max: Le(n)
		};
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-circle/browser/index.js
async function ki(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new Oi(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-color/browser/ColorUpdater.js
var Ai = class {
	constructor(e, t) {
		this._container = e, this._engine = t;
	}
	init(e) {
		let t = Nt(this._engine, e.options.color, e.id, e.options.reduceDuplicates);
		t && (e.color = Gt(t, e.options.color.animation, this._container.retina.reduceFactor));
	}
	isEnabled(e) {
		let { h: t, s: n, l: r } = e.options.color.animation, { color: i } = e;
		return !e.destroyed && !e.spawning && (i?.h.value !== void 0 && t.enable || i?.s.value !== void 0 && n.enable || i?.l.value !== void 0 && r.enable);
	}
	update(e, t) {
		Jt(e.color, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-color/browser/index.js
async function ji(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("color", (t) => Promise.resolve(new Ai(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-hex-color/browser/HexColorManager.js
var Mi;
(function(e) {
	e[e.r = 1] = "r", e[e.g = 2] = "g", e[e.b = 3] = "b", e[e.a = 4] = "a";
})(Mi ||= {});
var Ni = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i, Pi = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i, Fi = 16, Ii = 1, Li = 255, Ri = class {
	constructor() {
		this.key = "hex", this.stringPrefix = "#";
	}
	handleColor(e) {
		return this._parseString(e.value);
	}
	handleRangeColor(e) {
		return this._parseString(e.value);
	}
	parseString(e) {
		return this._parseString(e);
	}
	_parseString(e) {
		if (typeof e != "string" || !e?.startsWith(this.stringPrefix)) return;
		let t = e.replace(Ni, (e, t, n, r, i) => t + t + n + n + r + r + (i === void 0 ? "" : i + i)), n = Pi.exec(t);
		return n ? {
			a: n[Mi.a] === void 0 ? Ii : parseInt(n[Mi.a], Fi) / Li,
			b: parseInt(n[Mi.b], Fi),
			g: parseInt(n[Mi.g], Fi),
			r: parseInt(n[Mi.r], Fi)
		} : void 0;
	}
};
//#endregion
//#region node_modules/@tsparticles/plugin-hex-color/browser/index.js
async function zi(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addColorManager(new Ri(), t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-hsl-color/browser/HslColorManager.js
var Bi;
(function(e) {
	e[e.h = 1] = "h", e[e.s = 2] = "s", e[e.l = 3] = "l", e[e.a = 5] = "a";
})(Bi ||= {});
var Vi = class {
	constructor() {
		this.key = "hsl", this.stringPrefix = "hsl";
	}
	handleColor(e) {
		let t = e.value.hsl ?? e.value;
		if (t.h !== void 0 && t.s !== void 0 && t.l !== void 0) return It(t);
	}
	handleRangeColor(e) {
		let t = e.value.hsl ?? e.value;
		if (t.h !== void 0 && t.l !== void 0) return It({
			h: k(t.h),
			l: k(t.l),
			s: k(t.s)
		});
	}
	parseString(e) {
		if (!e.startsWith("hsl")) return;
		let t = /hsla?\(\s*(\d+)\s*[\s,]\s*(\d+)%\s*[\s,]\s*(\d+)%\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i.exec(e);
		return t ? Lt({
			a: t.length > 4 ? He(t[Bi.a]) : 1,
			h: parseInt(t[Bi.h], 10),
			l: parseInt(t[Bi.l], 10),
			s: parseInt(t[Bi.s], 10)
		}) : void 0;
	}
};
//#endregion
//#region node_modules/@tsparticles/plugin-hsl-color/browser/index.js
async function Hi(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addColorManager(new Vi(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-opacity/browser/OpacityUpdater.js
var Ui = class {
	constructor(e) {
		this.container = e;
	}
	init(e) {
		let t = e.options.opacity;
		e.opacity = xt(t, 1);
		let n = t.animation;
		n.enable && (e.opacity.velocity = k(n.speed) / 100 * this.container.retina.reduceFactor, n.sync || (e.opacity.velocity *= O()));
	}
	isEnabled(e) {
		return !e.destroyed && !e.spawning && !!e.opacity && e.opacity.enable && ((e.opacity.maxLoops ?? 0) <= 0 || (e.opacity.maxLoops ?? 0) > 0 && (e.opacity.loops ?? 0) < (e.opacity.maxLoops ?? 0));
	}
	reset(e) {
		e.opacity && (e.opacity.time = 0, e.opacity.loops = 0);
	}
	update(e, t) {
		this.isEnabled(e) && e.opacity && Tt(e, e.opacity, !0, e.options.opacity.animation.destroy, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-opacity/browser/index.js
async function Wi(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("opacity", (e) => Promise.resolve(new Ui(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-out-modes/browser/Utils.js
var Gi = 0, Ki = 0;
function qi(e) {
	if (e.outMode !== tr.bounce && e.outMode !== tr.split || e.direction !== j.left && e.direction !== j.right) return;
	e.bounds.right < Ki && e.direction === j.left ? e.particle.position.x = e.size + e.offset.x : e.bounds.left > e.canvasSize.width && e.direction === j.right && (e.particle.position.x = e.canvasSize.width - e.size - e.offset.x);
	let t = e.particle.velocity.x, n = !1;
	if (e.direction === j.right && e.bounds.right >= e.canvasSize.width && t > Gi || e.direction === j.left && e.bounds.left <= Ki && t < Gi) {
		let t = k(e.particle.options.bounce.horizontal.value);
		e.particle.velocity.x *= -t, n = !0;
	}
	if (!n) return;
	let r = e.offset.x + e.size;
	e.bounds.right >= e.canvasSize.width && e.direction === j.right ? e.particle.position.x = e.canvasSize.width - r : e.bounds.left <= Ki && e.direction === j.left && (e.particle.position.x = r), e.outMode === tr.split && e.particle.destroy();
}
function Ji(e) {
	if (e.outMode !== tr.bounce && e.outMode !== tr.split || e.direction !== j.bottom && e.direction !== j.top) return;
	e.bounds.bottom < Ki && e.direction === j.top ? e.particle.position.y = e.size + e.offset.y : e.bounds.top > e.canvasSize.height && e.direction === j.bottom && (e.particle.position.y = e.canvasSize.height - e.size - e.offset.y);
	let t = e.particle.velocity.y, n = !1;
	if (e.direction === j.bottom && e.bounds.bottom >= e.canvasSize.height && t > Gi || e.direction === j.top && e.bounds.top <= Ki && t < Gi) {
		let t = k(e.particle.options.bounce.vertical.value);
		e.particle.velocity.y *= -t, n = !0;
	}
	if (!n) return;
	let r = e.offset.y + e.size;
	e.bounds.bottom >= e.canvasSize.height && e.direction === j.bottom ? e.particle.position.y = e.canvasSize.height - r : e.bounds.top <= Ki && e.direction === j.top && (e.particle.position.y = r), e.outMode === tr.split && e.particle.destroy();
}
//#endregion
//#region node_modules/@tsparticles/updater-out-modes/browser/BounceOutMode.js
var Yi = class {
	constructor(e) {
		this.container = e, this.modes = [tr.bounce, tr.split];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r)) return;
		let i = this.container, a = !1;
		for (let r of i.plugins.values()) if (r.particleBounce !== void 0 && (a = r.particleBounce(e, n, t)), a) break;
		if (a) return;
		let o = e.getPosition(), s = e.offset, c = e.getRadius(), l = lt(o, c), u = i.canvas.size;
		qi({
			particle: e,
			outMode: r,
			direction: t,
			bounds: l,
			canvasSize: u,
			offset: s,
			size: c
		}), Ji({
			particle: e,
			outMode: r,
			direction: t,
			bounds: l,
			canvasSize: u,
			offset: s,
			size: c
		});
	}
}, Xi = 0, Zi = class {
	constructor(e) {
		this.container = e, this.modes = [tr.destroy];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r)) return;
		let i = this.container;
		switch (e.outType) {
			case Cr.normal:
			case Cr.outside:
				if (st(e.position, i.canvas.size, Te.origin, e.getRadius(), t)) return;
				break;
			case Cr.inside: {
				let { dx: t, dy: n } = Fe(e.position, e.moveCenter), { x: r, y: i } = e.velocity;
				if (r < Xi && t > e.moveCenter.radius || i < Xi && n > e.moveCenter.radius || r >= Xi && t < -e.moveCenter.radius || i >= Xi && n < -e.moveCenter.radius) return;
				break;
			}
		}
		i.particles.remove(e, e.group, !0);
	}
}, Qi = 0, $i = class {
	constructor(e) {
		this.container = e, this.modes = [tr.none];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r) || ((e.options.move.distance.horizontal && (t === j.left || t === j.right)) ?? (e.options.move.distance.vertical && (t === j.top || t === j.bottom)))) return;
		let i = e.options.move.gravity, a = this.container, o = a.canvas.size, s = e.getRadius();
		if (i.enable) {
			let n = e.position;
			(!i.inverse && n.y > o.height + s && t === j.bottom || i.inverse && n.y < -s && t === j.top) && a.particles.remove(e);
		} else {
			if (e.velocity.y > Qi && e.position.y <= o.height + s || e.velocity.y < Qi && e.position.y >= -s || e.velocity.x > Qi && e.position.x <= o.width + s || e.velocity.x < Qi && e.position.x >= -s) return;
			st(e.position, a.canvas.size, Te.origin, s, t) || a.particles.remove(e);
		}
	}
}, ea = 0, ta = 0, na = class {
	constructor(e) {
		this.container = e, this.modes = [tr.out];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r)) return;
		let i = this.container;
		switch (e.outType) {
			case Cr.inside: {
				let { x: t, y: n } = e.velocity, r = Te.origin;
				r.length = e.moveCenter.radius, r.angle = e.velocity.angle + Math.PI, r.addTo(Te.create(e.moveCenter));
				let { dx: a, dy: o } = Fe(e.position, r);
				if (t <= ea && a >= ta || n <= ea && o >= ta || t >= ea && a <= ta || n >= ea && o <= ta) return;
				e.position.x = Math.floor(Me({
					min: 0,
					max: i.canvas.size.width
				})), e.position.y = Math.floor(Me({
					min: 0,
					max: i.canvas.size.height
				}));
				let { dx: s, dy: c } = Fe(e.position, e.moveCenter);
				e.direction = Math.atan2(-c, -s), e.velocity.angle = e.direction;
				break;
			}
			default:
				if (st(e.position, i.canvas.size, Te.origin, e.getRadius(), t)) return;
				switch (e.outType) {
					case Cr.outside: {
						e.position.x = Math.floor(Me({
							min: -e.moveCenter.radius,
							max: e.moveCenter.radius
						})) + e.moveCenter.x, e.position.y = Math.floor(Me({
							min: -e.moveCenter.radius,
							max: e.moveCenter.radius
						})) + e.moveCenter.y;
						let { dx: t, dy: n } = Fe(e.position, e.moveCenter);
						e.moveCenter.radius && (e.direction = Math.atan2(n, t), e.velocity.angle = e.direction);
						break;
					}
					case Cr.normal: {
						let n = e.options.move.warp, r = i.canvas.size, a = {
							bottom: r.height + e.getRadius() + e.offset.y,
							left: -e.getRadius() - e.offset.x,
							right: r.width + e.getRadius() + e.offset.x,
							top: -e.getRadius() - e.offset.y
						}, o = e.getRadius(), s = lt(e.position, o);
						t === j.right && s.left > r.width + e.offset.x ? (e.position.x = a.left, e.initialPosition.x = e.position.x, n || (e.position.y = O() * r.height, e.initialPosition.y = e.position.y)) : t === j.left && s.right < -e.offset.x && (e.position.x = a.right, e.initialPosition.x = e.position.x, n || (e.position.y = O() * r.height, e.initialPosition.y = e.position.y)), t === j.bottom && s.top > r.height + e.offset.y ? (n || (e.position.x = O() * r.width, e.initialPosition.x = e.position.x), e.position.y = a.top, e.initialPosition.y = e.position.y) : t === j.top && s.bottom < -e.offset.y && (n || (e.position.x = O() * r.width, e.initialPosition.x = e.position.x), e.position.y = a.bottom, e.initialPosition.y = e.position.y);
						break;
					}
				}
		}
	}
}, ra = (e, t) => e.default === t || e.bottom === t || e.left === t || e.right === t || e.top === t, ia = class {
	constructor(e) {
		this._addUpdaterIfMissing = (e, t, n) => {
			let r = e.options.move.outModes;
			!this.updaters.has(t) && ra(r, t) && this.updaters.set(t, n(this.container));
		}, this._updateOutMode = (e, t, n, r) => {
			for (let i of this.updaters.values()) i.update(e, r, t, n);
		}, this.container = e, this.updaters = /* @__PURE__ */ new Map();
	}
	init(e) {
		this._addUpdaterIfMissing(e, tr.bounce, (e) => new Yi(e)), this._addUpdaterIfMissing(e, tr.out, (e) => new na(e)), this._addUpdaterIfMissing(e, tr.destroy, (e) => new Zi(e)), this._addUpdaterIfMissing(e, tr.none, (e) => new $i(e));
	}
	isEnabled(e) {
		return !e.destroyed && !e.spawning;
	}
	update(e, t) {
		let n = e.options.move.outModes;
		this._updateOutMode(e, t, n.bottom ?? n.default, j.bottom), this._updateOutMode(e, t, n.left ?? n.default, j.left), this._updateOutMode(e, t, n.right ?? n.default, j.right), this._updateOutMode(e, t, n.top ?? n.default, j.top);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-out-modes/browser/index.js
async function aa(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("outModes", (e) => Promise.resolve(new ia(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-rgb-color/browser/RgbColorManager.js
var oa;
(function(e) {
	e[e.r = 1] = "r", e[e.g = 2] = "g", e[e.b = 3] = "b", e[e.a = 5] = "a";
})(oa ||= {});
var sa = class {
	constructor() {
		this.key = "rgb", this.stringPrefix = "rgb";
	}
	handleColor(e) {
		let t = e.value.rgb ?? e.value;
		if (t.r !== void 0) return t;
	}
	handleRangeColor(e) {
		let t = e.value.rgb ?? e.value;
		if (t.r !== void 0) return {
			r: k(t.r),
			g: k(t.g),
			b: k(t.b)
		};
	}
	parseString(e) {
		if (!e.startsWith(this.stringPrefix)) return;
		let t = /rgba?\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i.exec(e);
		return t ? {
			a: t.length > 4 ? He(t[oa.a]) : 1,
			b: parseInt(t[oa.b], 10),
			g: parseInt(t[oa.g], 10),
			r: parseInt(t[oa.r], 10)
		} : void 0;
	}
};
//#endregion
//#region node_modules/@tsparticles/plugin-rgb-color/browser/index.js
async function ca(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addColorManager(new sa(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-size/browser/SizeUpdater.js
var F = 0, I = class {
	init(e) {
		let t = e.container, n = e.options.size.animation;
		n.enable && (e.size.velocity = (e.retina.sizeAnimationSpeed ?? t.retina.sizeAnimationSpeed) / 100 * t.retina.reduceFactor, n.sync || (e.size.velocity *= O()));
	}
	isEnabled(e) {
		return !e.destroyed && !e.spawning && e.size.enable && ((e.size.maxLoops ?? F) <= F || (e.size.maxLoops ?? F) > F && (e.size.loops ?? F) < (e.size.maxLoops ?? F));
	}
	reset(e) {
		e.size.loops = F;
	}
	update(e, t) {
		this.isEnabled(e) && Tt(e, e.size, !0, e.options.size.animation.destroy, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-size/browser/index.js
async function la(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("size", () => Promise.resolve(new I()), t);
}
//#endregion
//#region node_modules/@tsparticles/basic/browser/index.js
async function ua(e, t = !0) {
	e.checkVersion("3.9.1"), await zi(e, !1), await Hi(e, !1), await ca(e, !1), await bi(e, !1), await ki(e, !1), await ji(e, !1), await Wi(e, !1), await aa(e, !1), await la(e, !1), await e.refresh(t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-easing-quad/browser/index.js
async function da(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addEasing(Zr.easeInQuad, (e) => e ** 2, !1), await e.addEasing(Zr.easeOutQuad, (e) => 1 - (1 - e) ** 2, !1), await e.addEasing(Zr.easeInOutQuad, (e) => e < .5 ? 2 * e ** 2 : 1 - (-2 * e + 2) ** 2 / 2, !1), await e.refresh(t);
}
//#endregion
//#region node_modules/@tsparticles/shape-emoji/browser/Utils.js
function fa(e, t) {
	let { context: n, opacity: r } = e, i = n.globalAlpha;
	if (!t) return;
	let a = t.width, o = a * .5;
	n.globalAlpha = r, n.drawImage(t, -o, -o, a, a), n.globalAlpha = i;
}
//#endregion
//#region node_modules/@tsparticles/shape-emoji/browser/EmojiDrawer.js
var pa = "\"Twemoji Mozilla\", Apple Color Emoji, \"Segoe UI Emoji\", \"Noto Color Emoji\", \"EmojiOne Color\"", ma = 0, ha = class {
	constructor() {
		this.validTypes = ["emoji"], this._emojiShapeDict = /* @__PURE__ */ new Map();
	}
	destroy() {
		for (let [e, t] of this._emojiShapeDict) t instanceof ImageBitmap && t?.close(), this._emojiShapeDict.delete(e);
	}
	draw(e) {
		let t = e.particle.emojiDataKey;
		if (!t) return;
		let n = this._emojiShapeDict.get(t);
		n && fa(e, n);
	}
	async init(e) {
		let t = e.actualOptions, { validTypes: n } = this;
		if (!n.find((e) => M(e, t.particles.shape.type))) return;
		let r = [it(pa)], i = n.map((e) => t.particles.shape.options[e]).find((e) => !!e);
		i && vt(i, (e) => {
			e.font && r.push(it(e.font));
		}), await Promise.all(r);
	}
	particleDestroy(e) {
		e.emojiDataKey = void 0;
	}
	particleInit(e, t) {
		let n = t.shapeData;
		if (!n?.value) return;
		let r = yt(n.value, t.randomIndexData);
		if (!r) return;
		let i = typeof r == "string" ? {
			font: n.font ?? pa,
			padding: n.padding ?? ma,
			value: r
		} : {
			font: pa,
			padding: ma,
			...n,
			...r
		}, a = i.font, o = i.value, s = `${o}_${a}`;
		if (this._emojiShapeDict.has(s)) {
			t.emojiDataKey = s;
			return;
		}
		let c = i.padding * 2, l = Pe(t.size.value), u = l + c, d = u * 2, f;
		if (typeof OffscreenCanvas < "u") {
			let e = new OffscreenCanvas(d, d), t = e.getContext("2d");
			if (!t) return;
			t.font = `400 ${l * 2}px ${a}`, t.textBaseline = "middle", t.textAlign = "center", t.fillText(o, u, u), f = e.transferToImageBitmap();
		} else {
			let e = document.createElement("canvas");
			e.width = d, e.height = d;
			let t = e.getContext("2d");
			if (!t) return;
			t.font = `400 ${l * 2}px ${a}`, t.textBaseline = "middle", t.textAlign = "center", t.fillText(o, u, u), f = e;
		}
		this._emojiShapeDict.set(s, f), t.emojiDataKey = s;
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-emoji/browser/index.js
async function ga(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new ha(), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-attract/browser/Utils.js
var _a = 1, va = 1, ya = 0;
function ba(e, t, n, r, i, a) {
	let o = t.actualOptions.interactivity.modes.attract;
	if (!o) return;
	let s = t.particles.quadTree.query(i, a);
	for (let t of s) {
		let { dx: i, dy: a, distance: s } = Fe(t.position, n), c = o.speed * o.factor, l = Ae(e.getEasing(o.easing)(va - s / r) * c, _a, o.maxSpeed), u = Te.create(s ? i / s * l : c, s ? a / s * l : c);
		t.position.subFrom(u);
	}
}
function xa(e, t, n) {
	t.attract ||= { particles: [] };
	let { attract: r } = t;
	if (r.finish || (r.count ||= 0, r.count++, r.count === t.particles.count && (r.finish = !0)), r.clicking) {
		let r = t.interactivity.mouse.clickPosition, i = t.retina.attractModeDistance;
		if (!i || i < ya || !r) return;
		ba(e, t, r, i, new jr(r.x, r.y, i), (e) => n(e));
	} else r.clicking === !1 && (r.particles = []);
}
function Sa(e, t, n) {
	let r = t.interactivity.mouse.position, i = t.retina.attractModeDistance;
	!i || i < ya || !r || ba(e, t, r, i, new jr(r.x, r.y, i), (e) => n(e));
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-attract/browser/Options/Classes/Attract.js
var Ca = class {
	constructor() {
		this.distance = 200, this.duration = .4, this.easing = Zr.easeOutQuad, this.factor = 1, this.maxSpeed = 50, this.speed = 1;
	}
	load(e) {
		E(e) || (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.easing !== void 0 && (this.easing = e.easing), e.factor !== void 0 && (this.factor = e.factor), e.maxSpeed !== void 0 && (this.maxSpeed = e.maxSpeed), e.speed !== void 0 && (this.speed = e.speed));
	}
}, wa = "attract", Ta = class extends Jr {
	constructor(e, t) {
		super(t), this._engine = e, t.attract ||= { particles: [] }, this.handleClickMode = (e) => {
			let n = this.container.actualOptions.interactivity.modes.attract;
			if (n && e === wa) {
				t.attract ||= { particles: [] }, t.attract.clicking = !0, t.attract.count = 0;
				for (let e of t.attract.particles) this.isEnabled(e) && e.velocity.setTo(e.initialVelocity);
				t.attract.particles = [], t.attract.finish = !1, setTimeout(() => {
					t.destroyed || (t.attract ||= { particles: [] }, t.attract.clicking = !1);
				}, n.duration * le);
			}
		};
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.attract;
		t && (e.retina.attractModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions, n = e.interactivity.status === x, r = t.interactivity.events, { enable: i, mode: a } = r.onHover, { enable: o, mode: s } = r.onClick;
		n && i && M(wa, a) ? Sa(this._engine, this.container, (e) => this.isEnabled(e)) : o && M(wa, s) && xa(this._engine, this.container, (e) => this.isEnabled(e));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, i = (e?.interactivity ?? n.interactivity).events;
		if ((!r.position || !i.onHover.enable) && (!r.clickPosition || !i.onClick.enable)) return !1;
		let a = i.onHover.mode, o = i.onClick.mode;
		return M(wa, a) || M(wa, o);
	}
	loadModeOptions(e, ...t) {
		e.attract ||= new Ca();
		for (let n of t) e.attract.load(n?.attract);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-attract/browser/index.js
async function Ea(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalAttract", (t) => Promise.resolve(new Ta(e, t)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bounce/browser/Utils.js
var Da = 2, Oa = .5, ka = Math.PI * Oa, Aa = 2, ja = 10, Ma = 0;
function Na(e, t, n, r, i) {
	let a = e.particles.quadTree.query(r, i);
	for (let e of a) r instanceof jr ? gt(ht(e), {
		position: t,
		radius: n,
		mass: n ** Da * ka,
		velocity: Te.origin,
		factor: Te.origin
	}) : r instanceof Mr && _t(e, lt(t, n));
}
function Pa(e, t, n, r) {
	let i = document.querySelectorAll(t);
	i.length && i.forEach((t) => {
		let i = t, a = e.retina.pixelRatio, o = {
			x: (i.offsetLeft + i.offsetWidth * Oa) * a,
			y: (i.offsetTop + i.offsetHeight * Oa) * a
		}, s = i.offsetWidth * Oa * a, c = ja * a;
		r(o, s, n.type === yn.circle ? new jr(o.x, o.y, s + c) : new Mr(i.offsetLeft * a - c, i.offsetTop * a - c, i.offsetWidth * a + c * Aa, i.offsetHeight * a + c * Aa));
	});
}
function Fa(e, t, n, r) {
	ft(n, t, (t, n) => Pa(e, t, n, (t, n, i) => Na(e, t, n, i, r)));
}
function Ia(e, t) {
	let n = ja * e.retina.pixelRatio, r = e.interactivity.mouse.position, i = e.retina.bounceModeDistance;
	!i || i < Ma || !r || Na(e, r, i, new jr(r.x, r.y, i + n), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bounce/browser/Options/Classes/Bounce.js
var La = class {
	constructor() {
		this.distance = 200;
	}
	load(e) {
		E(e) || e.distance !== void 0 && (this.distance = e.distance);
	}
}, Ra = "bounce", za = class extends Jr {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.bounce;
		t && (e.retina.bounceModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions.interactivity.events, n = e.interactivity.status === x, r = t.onHover.enable, i = t.onHover.mode, a = t.onDiv;
		n && r && M(Ra, i) ? Ia(this.container, (e) => this.isEnabled(e)) : Fa(this.container, a, Ra, (e) => this.isEnabled(e));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, i = (e?.interactivity ?? n.interactivity).events, a = i.onDiv;
		return !!r.position && i.onHover.enable && M(Ra, i.onHover.mode) || dt(Ra, a);
	}
	loadModeOptions(e, ...t) {
		e.bounce ||= new La();
		for (let n of t) e.bounce.load(n?.bounce);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-bounce/browser/index.js
async function Ba(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalBounce", (e) => Promise.resolve(new za(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/Options/Classes/BubbleBase.js
var Va = class {
	constructor() {
		this.distance = 200, this.duration = .4, this.mix = !1;
	}
	load(e) {
		if (!E(e)) {
			if (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.mix !== void 0 && (this.mix = e.mix), e.opacity !== void 0 && (this.opacity = e.opacity), e.color !== void 0) {
				let t = we(this.color) ? void 0 : this.color;
				this.color = vt(e.color, (e) => pn.create(t, e));
			}
			e.size !== void 0 && (this.size = e.size);
		}
	}
}, Ha = class extends Va {
	constructor() {
		super(), this.selectors = [];
	}
	load(e) {
		super.load(e), !E(e) && e.selectors !== void 0 && (this.selectors = e.selectors);
	}
}, Ua = class extends Va {
	load(e) {
		super.load(e), !E(e) && (this.divs = vt(e.divs, (e) => {
			let t = new Ha();
			return t.load(e), t;
		}));
	}
}, Wa;
(function(e) {
	e.color = "color", e.opacity = "opacity", e.size = "size";
})(Wa ||= {});
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/Utils.js
function Ga(e, t, n, r) {
	if (t >= n) return Ae(e + (t - n) * r, e, t);
	if (t < n) return Ae(e - (n - t) * r, t, e);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/Bubbler.js
var Ka = "bubble", qa = 0, Ja = 0, Ya = 2, Xa = 1, Za = 1, Qa = 0, $a = 0, eo = .5, to = 1, no = class extends Jr {
	constructor(e, t) {
		super(e), this._clickBubble = () => {
			let e = this.container, t = e.actualOptions, n = e.interactivity.mouse.clickPosition, r = t.interactivity.modes.bubble;
			if (!r || !n) return;
			e.bubble ||= {};
			let i = e.retina.bubbleModeDistance;
			if (!i || i < qa) return;
			let a = e.particles.quadTree.queryCircle(n, i, (e) => this.isEnabled(e)), { bubble: o } = e;
			for (let t of a) {
				if (!o.clicking) continue;
				t.bubble.inRange = !o.durationEnd;
				let a = Ie(t.getPosition(), n), s = ((/* @__PURE__ */ new Date()).getTime() - (e.interactivity.mouse.clickTime ?? Ja)) / le;
				s > r.duration && (o.durationEnd = !0), s > r.duration * Ya && (o.clicking = !1, o.durationEnd = !1);
				let c = {
					bubbleObj: {
						optValue: e.retina.bubbleModeSize,
						value: t.bubble.radius
					},
					particlesObj: {
						optValue: Pe(t.options.size.value) * e.retina.pixelRatio,
						value: t.size.value
					},
					type: Wa.size
				};
				this._process(t, a, s, c);
				let l = {
					bubbleObj: {
						optValue: r.opacity,
						value: t.bubble.opacity
					},
					particlesObj: {
						optValue: Pe(t.options.opacity.value),
						value: t.opacity?.value ?? Xa
					},
					type: Wa.opacity
				};
				this._process(t, a, s, l), !o.durationEnd && a <= i ? this._hoverBubbleColor(t, a) : delete t.bubble.color;
			}
		}, this._hoverBubble = () => {
			let e = this.container, t = e.interactivity.mouse.position, n = e.retina.bubbleModeDistance;
			if (!n || n < qa || !t) return;
			let r = e.particles.quadTree.queryCircle(t, n, (e) => this.isEnabled(e));
			for (let i of r) {
				i.bubble.inRange = !0;
				let r = Ie(i.getPosition(), t), a = Za - r / n;
				r <= n ? a >= $a && e.interactivity.status === "pointermove" && (this._hoverBubbleSize(i, a), this._hoverBubbleOpacity(i, a), this._hoverBubbleColor(i, a)) : this.reset(i), e.interactivity.status === "pointerleave" && this.reset(i);
			}
		}, this._hoverBubbleColor = (e, t, n) => {
			let r = this.container.actualOptions, i = n ?? r.interactivity.modes.bubble;
			if (i) {
				if (!e.bubble.finalColor) {
					let t = i.color;
					if (!t) return;
					let n = yt(t);
					e.bubble.finalColor = Nt(this._engine, n);
				}
				if (e.bubble.finalColor) {
					if (i.mix) {
						e.bubble.color = void 0;
						let n = e.getFillColor();
						e.bubble.color = n ? Pt(Vt(n, e.bubble.finalColor, Za - t, t)) : e.bubble.finalColor;
					} else e.bubble.color = e.bubble.finalColor;
				}
			}
		}, this._hoverBubbleOpacity = (e, t, n) => {
			let r = this.container.actualOptions, i = n?.opacity ?? r.interactivity.modes.bubble?.opacity;
			if (!i) return;
			let a = e.options.opacity.value, o = Ga(e.opacity?.value ?? Xa, i, Pe(a), t);
			o !== void 0 && (e.bubble.opacity = o);
		}, this._hoverBubbleSize = (e, t, n) => {
			let r = this.container, i = n?.size ? n.size * r.retina.pixelRatio : r.retina.bubbleModeSize;
			if (i === void 0) return;
			let a = Pe(e.options.size.value) * r.retina.pixelRatio, o = e.size.value, s = Ga(o, i, a, t);
			s !== void 0 && (e.bubble.radius = s);
		}, this._process = (e, t, n, r) => {
			let i = this.container, a = r.bubbleObj.optValue, o = i.actualOptions.interactivity.modes.bubble;
			if (!o || a === void 0) return;
			let s = o.duration, c = i.retina.bubbleModeDistance, l = r.particlesObj.optValue, u = r.bubbleObj.value, d = r.particlesObj.value ?? Qa, f = r.type;
			if (!(!c || c < qa || a === l)) {
				if (i.bubble ||= {}, i.bubble.durationEnd) u && (f === Wa.size && delete e.bubble.radius, f === Wa.opacity && delete e.bubble.opacity);
				else if (t <= c) {
					if ((u ?? d) !== a) {
						let t = d - n * (d - a) / s;
						f === Wa.size && (e.bubble.radius = t), f === Wa.opacity && (e.bubble.opacity = t);
					}
				} else f === Wa.size && delete e.bubble.radius, f === Wa.opacity && delete e.bubble.opacity;
			}
		}, this._singleSelectorHover = (e, t, n) => {
			let r = this.container, i = document.querySelectorAll(t), a = r.actualOptions.interactivity.modes.bubble;
			a && i.length && i.forEach((t) => {
				let i = t, o = r.retina.pixelRatio, s = {
					x: (i.offsetLeft + i.offsetWidth * eo) * o,
					y: (i.offsetTop + i.offsetHeight * eo) * o
				}, c = i.offsetWidth * eo * o, l = n.type === yn.circle ? new jr(s.x, s.y, c) : new Mr(i.offsetLeft * o, i.offsetTop * o, i.offsetWidth * o, i.offsetHeight * o), u = r.particles.quadTree.query(l, (e) => this.isEnabled(e));
				for (let t of u) {
					if (!l.contains(t.getPosition())) continue;
					t.bubble.inRange = !0;
					let n = a.divs, r = mt(n, i);
					(!t.bubble.div || t.bubble.div !== i) && (this.clear(t, e, !0), t.bubble.div = i), this._hoverBubbleSize(t, to, r), this._hoverBubbleOpacity(t, to, r), this._hoverBubbleColor(t, to, r);
				}
			});
		}, this._engine = t, e.bubble ||= {}, this.handleClickMode = (t) => {
			t === Ka && (e.bubble ||= {}, e.bubble.clicking = !0);
		};
	}
	clear(e, t, n) {
		(!e.bubble.inRange || n) && (delete e.bubble.div, delete e.bubble.opacity, delete e.bubble.radius, delete e.bubble.color);
	}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.bubble;
		t && (e.retina.bubbleModeDistance = t.distance * e.retina.pixelRatio, t.size !== void 0 && (e.retina.bubbleModeSize = t.size * e.retina.pixelRatio));
	}
	interact(e) {
		let t = this.container.actualOptions.interactivity.events, n = t.onHover, r = t.onClick, i = n.enable, a = n.mode, o = r.enable, s = r.mode, c = t.onDiv;
		i && M(Ka, a) ? this._hoverBubble() : o && M(Ka, s) ? this._clickBubble() : ft(Ka, c, (t, n) => this._singleSelectorHover(e, t, n));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, { onClick: i, onDiv: a, onHover: o } = (e?.interactivity ?? n.interactivity).events, s = dt(Ka, a);
		return s || o.enable && r.position || i.enable && r.clickPosition ? M(Ka, o.mode) || M(Ka, i.mode) || s : !1;
	}
	loadModeOptions(e, ...t) {
		e.bubble ||= new Ua();
		for (let n of t) e.bubble.load(n?.bubble);
	}
	reset(e) {
		e.bubble.inRange = !1;
	}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/index.js
async function ro(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalBubble", (t) => Promise.resolve(new no(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-connect/browser/Options/Classes/ConnectLinks.js
var io = class {
	constructor() {
		this.opacity = .5;
	}
	load(e) {
		E(e) || e.opacity !== void 0 && (this.opacity = e.opacity);
	}
}, ao = class {
	constructor() {
		this.distance = 80, this.links = new io(), this.radius = 60;
	}
	load(e) {
		E(e) || (e.distance !== void 0 && (this.distance = e.distance), this.links.load(e.links), e.radius !== void 0 && (this.radius = e.radius));
	}
}, oo = 0, so = 1, co = 0;
function lo(e, t, n, r) {
	let i = Math.floor(n.getRadius() / t.getRadius()), a = t.getFillColor(), o = n.getFillColor();
	if (!a || !o) return;
	let s = t.getPosition(), c = n.getPosition(), l = Vt(a, o, t.getRadius(), n.getRadius()), u = e.createLinearGradient(s.x, s.y, c.x, c.y);
	return u.addColorStop(oo, Bt(a, r)), u.addColorStop(Ae(i, oo, so), zt(l, r)), u.addColorStop(so, Bt(o, r)), u;
}
function uo(e, t, n, r, i) {
	Yt(e, r, i), e.lineWidth = t, e.strokeStyle = n, e.stroke();
}
function fo(e, t, n, r) {
	let i = e.actualOptions.interactivity.modes.connect;
	if (i) return lo(t, n, r, i.links.opacity);
}
function po(e, t, n) {
	e.canvas.draw((r) => {
		let i = fo(e, r, t, n);
		if (!i) return;
		let a = t.getPosition(), o = n.getPosition();
		uo(r, t.retina.linksWidth ?? co, i, a, o);
	});
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-connect/browser/Connector.js
var mo = "connect", ho = 0, go = class extends Jr {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.connect;
		t && (e.retina.connectModeDistance = t.distance * e.retina.pixelRatio, e.retina.connectModeRadius = t.radius * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container;
		if (e.actualOptions.interactivity.events.onHover.enable && e.interactivity.status === "pointermove") {
			let t = e.interactivity.mouse.position, { connectModeDistance: n, connectModeRadius: r } = e.retina;
			if (!n || n < ho || !r || r < ho || !t) return;
			let i = Math.abs(r), a = e.particles.quadTree.queryCircle(t, i, (e) => this.isEnabled(e));
			a.forEach((t, r) => {
				let i = t.getPosition();
				for (let o of a.slice(r + 1)) {
					let r = o.getPosition(), a = Math.abs(n), s = Math.abs(i.x - r.x), c = Math.abs(i.y - r.y);
					s < a && c < a && po(e, t, o);
				}
			});
		}
	}
	isEnabled(e) {
		let t = this.container, n = t.interactivity.mouse, r = (e?.interactivity ?? t.actualOptions.interactivity).events;
		return r.onHover.enable && n.position ? M(mo, r.onHover.mode) : !1;
	}
	loadModeOptions(e, ...t) {
		e.connect ||= new ao();
		for (let n of t) e.connect.load(n?.connect);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-connect/browser/index.js
async function _o(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalConnect", (e) => Promise.resolve(new go(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-grab/browser/Options/Classes/GrabLinks.js
var vo = class {
	constructor() {
		this.blink = !1, this.consent = !1, this.opacity = 1;
	}
	load(e) {
		E(e) || (e.blink !== void 0 && (this.blink = e.blink), e.color !== void 0 && (this.color = pn.create(this.color, e.color)), e.consent !== void 0 && (this.consent = e.consent), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, yo = class {
	constructor() {
		this.distance = 100, this.links = new vo();
	}
	load(e) {
		E(e) || (e.distance !== void 0 && (this.distance = e.distance), this.links.load(e.links));
	}
}, bo = 0;
function xo(e, t, n, r, i, a) {
	Yt(e, n, r), e.strokeStyle = zt(i, a), e.lineWidth = t, e.stroke();
}
function So(e, t, n, r, i) {
	e.canvas.draw((e) => {
		let a = t.getPosition();
		xo(e, t.retina.linksWidth ?? bo, a, i, n, r);
	});
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-grab/browser/Grabber.js
var Co = "grab", wo = 0, To = 0, Eo = class extends Jr {
	constructor(e, t) {
		super(e), this._engine = t;
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.grab;
		t && (e.retina.grabModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions.interactivity;
		if (!t.modes.grab || !t.events.onHover.enable || e.interactivity.status !== "pointermove") return;
		let n = e.interactivity.mouse.position;
		if (!n) return;
		let r = e.retina.grabModeDistance;
		if (!r || r < wo) return;
		let i = e.particles.quadTree.queryCircle(n, r, (e) => this.isEnabled(e));
		for (let a of i) {
			let i = Ie(a.getPosition(), n);
			if (i > r) continue;
			let o = t.modes.grab.links, s = o.opacity, c = s - i * s / r;
			if (c <= To) continue;
			let l = o.color ?? a.options.links?.color;
			if (!e.particles.grabLineColor && l) {
				let n = t.modes.grab.links;
				e.particles.grabLineColor = Ut(this._engine, l, n.blink, n.consent);
			}
			let u = Ht(a, void 0, e.particles.grabLineColor);
			u && So(e, a, u, c, n);
		}
	}
	isEnabled(e) {
		let t = this.container, n = t.interactivity.mouse, r = (e?.interactivity ?? t.actualOptions.interactivity).events;
		return r.onHover.enable && !!n.position && M(Co, r.onHover.mode);
	}
	loadModeOptions(e, ...t) {
		e.grab ||= new yo();
		for (let n of t) e.grab.load(n?.grab);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-grab/browser/index.js
async function Do(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalGrab", (t) => Promise.resolve(new Eo(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-pause/browser/Pauser.js
var Oo = "pause", ko = class extends Jr {
	constructor(e) {
		super(e), this.handleClickMode = (e) => {
			if (e !== Oo) return;
			let t = this.container;
			t.animationStatus ? t.pause() : t.play();
		};
	}
	clear() {}
	init() {}
	interact() {}
	isEnabled() {
		return !0;
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-pause/browser/index.js
async function Ao(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalPause", (e) => Promise.resolve(new ko(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-push/browser/Options/Classes/Push.js
var jo = class {
	constructor() {
		this.default = !0, this.groups = [], this.quantity = 4;
	}
	load(e) {
		if (E(e)) return;
		e.default !== void 0 && (this.default = e.default), e.groups !== void 0 && (this.groups = e.groups.map((e) => e)), this.groups.length || (this.default = !0);
		let t = e.quantity;
		t !== void 0 && (this.quantity = A(t)), this.particles = vt(e.particles, (e) => ut({}, e));
	}
}, Mo = "push", No = 0, Po = class extends Jr {
	constructor(e) {
		super(e), this.handleClickMode = (e) => {
			if (e !== Mo) return;
			let t = this.container, n = t.actualOptions.interactivity.modes.push;
			if (!n) return;
			let r = k(n.quantity);
			if (r <= No) return;
			let i = ot([void 0, ...n.groups]), a = ut(i === void 0 ? void 0 : t.actualOptions.particles.groups[i], yt(n.particles));
			t.particles.push(r, t.interactivity.mouse, a, i);
		};
	}
	clear() {}
	init() {}
	interact() {}
	isEnabled() {
		return !0;
	}
	loadModeOptions(e, ...t) {
		e.push ||= new jo();
		for (let n of t) e.push.load(n?.push);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-push/browser/index.js
async function Fo(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalPush", (e) => Promise.resolve(new Po(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-remove/browser/Options/Classes/Remove.js
var Io = class {
	constructor() {
		this.quantity = 2;
	}
	load(e) {
		if (E(e)) return;
		let t = e.quantity;
		t !== void 0 && (this.quantity = A(t));
	}
}, Lo = "remove", Ro = class extends Jr {
	constructor(e) {
		super(e), this.handleClickMode = (e) => {
			let t = this.container, n = t.actualOptions;
			if (!n.interactivity.modes.remove || e !== Lo) return;
			let r = k(n.interactivity.modes.remove.quantity);
			t.particles.removeQuantity(r);
		};
	}
	clear() {}
	init() {}
	interact() {}
	isEnabled() {
		return !0;
	}
	loadModeOptions(e, ...t) {
		e.remove ||= new Io();
		for (let n of t) e.remove.load(n?.remove);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-remove/browser/index.js
async function zo(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalRemove", (e) => Promise.resolve(new Ro(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-repulse/browser/Options/Classes/RepulseBase.js
var Bo = class {
	constructor() {
		this.distance = 200, this.duration = .4, this.factor = 100, this.speed = 1, this.maxSpeed = 50, this.easing = Zr.easeOutQuad;
	}
	load(e) {
		E(e) || (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.easing !== void 0 && (this.easing = e.easing), e.factor !== void 0 && (this.factor = e.factor), e.speed !== void 0 && (this.speed = e.speed), e.maxSpeed !== void 0 && (this.maxSpeed = e.maxSpeed));
	}
}, Vo = class extends Bo {
	constructor() {
		super(), this.selectors = [];
	}
	load(e) {
		super.load(e), !E(e) && e.selectors !== void 0 && (this.selectors = e.selectors);
	}
}, Ho = class extends Bo {
	load(e) {
		super.load(e), !E(e) && (this.divs = vt(e.divs, (e) => {
			let t = new Vo();
			return t.load(e), t;
		}));
	}
}, Uo = "repulse", Wo = 0, Go = 6, Ko = 3, L = 2, R = 0, qo = 0, Jo = 1, Yo = .5, Xo = class extends Jr {
	constructor(e, t) {
		super(t), this._clickRepulse = () => {
			let e = this.container, t = e.actualOptions.interactivity.modes.repulse;
			if (!t) return;
			let n = e.repulse ?? { particles: [] };
			if (n.finish || (n.count ||= 0, n.count++, n.count === e.particles.count && (n.finish = !0)), n.clicking) {
				let r = e.retina.repulseModeDistance;
				if (!r || r < Wo) return;
				let i = (r / Go) ** +Ko, a = e.interactivity.mouse.clickPosition;
				if (a === void 0) return;
				let o = new jr(a.x, a.y, i), s = e.particles.quadTree.query(o, (e) => this.isEnabled(e));
				for (let e of s) {
					let { dx: r, dy: o, distance: s } = Fe(a, e.position), c = s ** L, l = t.speed, u = -i * l / c;
					if (c <= i) {
						n.particles.push(e);
						let t = Te.create(r, o);
						t.length = u, e.velocity.setTo(t);
					}
				}
			} else if (n.clicking === !1) {
				for (let e of n.particles) e.velocity.setTo(e.initialVelocity);
				n.particles = [];
			}
		}, this._hoverRepulse = () => {
			let e = this.container, t = e.interactivity.mouse.position, n = e.retina.repulseModeDistance;
			!n || n < R || !t || this._processRepulse(t, n, new jr(t.x, t.y, n));
		}, this._processRepulse = (e, t, n, r) => {
			let i = this.container, a = i.particles.quadTree.query(n, (e) => this.isEnabled(e)), o = i.actualOptions.interactivity.modes.repulse;
			if (!o) return;
			let { easing: s, speed: c, factor: l, maxSpeed: u } = o, d = this._engine.getEasing(s), f = (r?.speed ?? c) * l;
			for (let n of a) {
				let { dx: r, dy: i, distance: a } = Fe(n.position, e), o = Ae(d(Jo - a / t) * f, qo, u), s = Te.create(a ? r / a * o : f, a ? i / a * o : f);
				n.position.addTo(s);
			}
		}, this._singleSelectorRepulse = (e, t) => {
			let n = this.container, r = n.actualOptions.interactivity.modes.repulse;
			if (!r) return;
			let i = document.querySelectorAll(e);
			i.length && i.forEach((e) => {
				let i = e, a = n.retina.pixelRatio, o = {
					x: (i.offsetLeft + i.offsetWidth * Yo) * a,
					y: (i.offsetTop + i.offsetHeight * Yo) * a
				}, s = i.offsetWidth * Yo * a, c = t.type === yn.circle ? new jr(o.x, o.y, s) : new Mr(i.offsetLeft * a, i.offsetTop * a, i.offsetWidth * a, i.offsetHeight * a), l = r.divs, u = mt(l, i);
				this._processRepulse(o, s, c, u);
			});
		}, this._engine = e, t.repulse ||= { particles: [] }, this.handleClickMode = (e) => {
			let n = this.container.actualOptions.interactivity.modes.repulse;
			if (!n || e !== Uo) return;
			t.repulse ||= { particles: [] };
			let r = t.repulse;
			r.clicking = !0, r.count = 0;
			for (let e of t.repulse.particles) this.isEnabled(e) && e.velocity.setTo(e.initialVelocity);
			r.particles = [], r.finish = !1, setTimeout(() => {
				t.destroyed || (r.clicking = !1);
			}, n.duration * le);
		};
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.repulse;
		t && (e.retina.repulseModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions, n = e.interactivity.status === x, r = t.interactivity.events, i = r.onHover, a = i.enable, o = i.mode, s = r.onClick, c = s.enable, l = s.mode, u = r.onDiv;
		n && a && M(Uo, o) ? this._hoverRepulse() : c && M(Uo, l) ? this._clickRepulse() : ft(Uo, u, (e, t) => this._singleSelectorRepulse(e, t));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, i = (e?.interactivity ?? n.interactivity).events, a = i.onDiv, o = i.onHover, s = i.onClick, c = dt(Uo, a);
		if (!(c || o.enable && r.position || s.enable && r.clickPosition)) return !1;
		let l = o.mode, u = s.mode;
		return M(Uo, l) || M(Uo, u) || c;
	}
	loadModeOptions(e, ...t) {
		e.repulse ||= new Ho();
		for (let n of t) e.repulse.load(n?.repulse);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-repulse/browser/index.js
async function Zo(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalRepulse", (t) => Promise.resolve(new Xo(e, t)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-slow/browser/Options/Classes/Slow.js
var Qo = class {
	constructor() {
		this.factor = 3, this.radius = 200;
	}
	load(e) {
		E(e) || (e.factor !== void 0 && (this.factor = e.factor), e.radius !== void 0 && (this.radius = e.radius));
	}
}, $o = "slow", es = 0, ts = class extends Jr {
	constructor(e) {
		super(e);
	}
	clear(e, t, n) {
		(!e.slow.inRange || n) && (e.slow.factor = 1);
	}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.slow;
		t && (e.retina.slowModeRadius = t.radius * e.retina.pixelRatio);
	}
	interact() {}
	isEnabled(e) {
		let t = this.container, n = t.interactivity.mouse, r = (e?.interactivity ?? t.actualOptions.interactivity).events;
		return r.onHover.enable && !!n.position && M($o, r.onHover.mode);
	}
	loadModeOptions(e, ...t) {
		e.slow ||= new Qo();
		for (let n of t) e.slow.load(n?.slow);
	}
	reset(e) {
		e.slow.inRange = !1;
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse.position, i = t.retina.slowModeRadius, a = n.interactivity.modes.slow;
		if (!a || !i || i < es || !r) return;
		let o = Ie(r, e.getPosition()), s = o / i, c = a.factor, { slow: l } = e;
		o > i || (l.inRange = !0, l.factor = s / c);
	}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-slow/browser/index.js
async function ns(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalSlow", (e) => Promise.resolve(new ts(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/Utils.js
var rs = 0, is = 1, as = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))|currentcolor/gi;
function os(e, t, n) {
	let { svgData: r } = e;
	if (!r) return "";
	let i = Bt(t, n);
	if (r.includes("fill")) return r.replace(as, () => i);
	let a = r.indexOf(">");
	return `${r.substring(rs, a)} fill="${i}"${r.substring(a)}`;
}
async function ss(e) {
	return new Promise((t) => {
		e.loading = !0;
		let n = new Image();
		e.element = n, n.addEventListener("load", () => {
			e.loading = !1, t();
		}), n.addEventListener("error", () => {
			e.element = void 0, e.error = !0, e.loading = !1, Ye().error(`${se} loading image: ${e.source}`), t();
		}), n.src = e.source;
	});
}
async function cs(e) {
	if (e.type !== "svg") {
		await ss(e);
		return;
	}
	e.loading = !0;
	let t = await fetch(e.source);
	t.ok ? e.svgData = await t.text() : (Ye().error(`${se} Image not found`), e.error = !0), e.loading = !1;
}
function ls(e, t, n, r) {
	let i = os(e, n, r.opacity?.value ?? is), a = {
		color: n,
		gif: t.gif,
		data: {
			...e,
			svgData: i
		},
		loaded: !1,
		ratio: t.width / t.height,
		replaceColor: t.replaceColor,
		source: t.src
	};
	return new Promise((t) => {
		let n = new Blob([i], { type: "image/svg+xml" }), r = URL || window.URL || window.webkitURL || window, o = r.createObjectURL(n), s = new Image();
		s.addEventListener("load", () => {
			a.loaded = !0, a.element = s, t(a), r.revokeObjectURL(o);
		});
		let c = async () => {
			r.revokeObjectURL(o);
			let n = {
				...e,
				error: !1,
				loading: !0
			};
			await ss(n), a.loaded = !0, a.element = n.element, t(a);
		};
		s.addEventListener("error", () => void c()), s.src = o;
	});
}
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/GifUtils/Constants.js
var us = [
	0,
	4,
	2,
	1
], ds = [
	8,
	8,
	4,
	2
], fs = class {
	constructor(e) {
		this.pos = 0, this.data = new Uint8ClampedArray(e);
	}
	getString(e) {
		let t = this.data.slice(this.pos, this.pos + e);
		return this.pos += t.length, t.reduce((e, t) => e + String.fromCharCode(t), "");
	}
	nextByte() {
		return this.data[this.pos++];
	}
	nextTwoBytes() {
		return this.pos += 2, this.data[this.pos - 2] + (this.data[this.pos - 1] << 8);
	}
	readSubBlocks() {
		let e = "", t = 0;
		do {
			t = this.data[this.pos++];
			for (let n = t; --n >= 0; e += String.fromCharCode(this.data[this.pos++]));
		} while (t !== 0);
		return e;
	}
	readSubBlocksBin() {
		let e = this.data[this.pos], t = 0;
		for (let n = 0; e !== 0; n += e + 1, e = this.data[this.pos + n]) t += e;
		let n = new Uint8Array(t);
		e = this.data[this.pos++];
		for (let t = 0; e !== 0; e = this.data[this.pos++]) for (let r = e; --r >= 0; n[t++] = this.data[this.pos++]);
		return n;
	}
	skipSubBlocks() {
		for (; this.data[this.pos] !== 0; this.pos += this.data[this.pos] + 1);
		this.pos++;
	}
}, ps;
(function(e) {
	e[e.Replace = 0] = "Replace", e[e.Combine = 1] = "Combine", e[e.RestoreBackground = 2] = "RestoreBackground", e[e.RestorePrevious = 3] = "RestorePrevious", e[e.UndefinedA = 4] = "UndefinedA", e[e.UndefinedB = 5] = "UndefinedB", e[e.UndefinedC = 6] = "UndefinedC", e[e.UndefinedD = 7] = "UndefinedD";
})(ps ||= {});
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/GifUtils/Types/GIFDataHeaders.js
var ms;
(function(e) {
	e[e.Extension = 33] = "Extension", e[e.ApplicationExtension = 255] = "ApplicationExtension", e[e.GraphicsControlExtension = 249] = "GraphicsControlExtension", e[e.PlainTextExtension = 1] = "PlainTextExtension", e[e.CommentExtension = 254] = "CommentExtension", e[e.Image = 44] = "Image", e[e.EndOfFile = 59] = "EndOfFile";
})(ms ||= {});
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/GifUtils/Utils.js
var hs = {
	x: 0,
	y: 0
}, gs = 0, _s = .5, vs = 0, ys = 0, bs = 0;
function xs(e, t) {
	let n = [];
	for (let r = 0; r < t; r++) n.push({
		r: e.data[e.pos],
		g: e.data[e.pos + 1],
		b: e.data[e.pos + 2]
	}), e.pos += 3;
	return n;
}
function Ss(e, t, n, r) {
	switch (e.nextByte()) {
		case ms.GraphicsControlExtension: {
			let i = t.frames[n(!1)];
			e.pos++;
			let a = e.nextByte();
			i.GCreserved = (a & 224) >>> 5, i.disposalMethod = (a & 28) >>> 2, i.userInputDelayFlag = (a & 2) == 2;
			let o = (a & 1) == 1;
			i.delayTime = e.nextTwoBytes() * 10;
			let s = e.nextByte();
			o && r(s), e.pos++;
			break;
		}
		case ms.ApplicationExtension: {
			e.pos++;
			let n = {
				identifier: e.getString(8),
				authenticationCode: e.getString(3),
				data: e.readSubBlocksBin()
			};
			t.applicationExtensions.push(n);
			break;
		}
		case ms.CommentExtension:
			t.comments.push([n(!1), e.readSubBlocks()]);
			break;
		case ms.PlainTextExtension:
			if (t.globalColorTable.length === 0) throw EvalError("plain text extension without global color table");
			e.pos++, t.frames[n(!1)].plainTextData = {
				left: e.nextTwoBytes(),
				top: e.nextTwoBytes(),
				width: e.nextTwoBytes(),
				height: e.nextTwoBytes(),
				charSize: {
					width: e.nextTwoBytes(),
					height: e.nextTwoBytes()
				},
				foregroundColor: e.nextByte(),
				backgroundColor: e.nextByte(),
				text: e.readSubBlocks()
			};
			break;
		default: e.skipSubBlocks();
	}
}
async function Cs(e, t, n, r, i, a) {
	let o = t.frames[r(!0)];
	o.left = e.nextTwoBytes(), o.top = e.nextTwoBytes(), o.width = e.nextTwoBytes(), o.height = e.nextTwoBytes();
	let s = e.nextByte(), c = (s & 128) == 128, l = (s & 64) == 64;
	o.sortFlag = (s & 32) == 32, o.reserved = (s & 24) >>> 3;
	let u = 1 << (s & 7) + 1;
	c && (o.localColorTable = xs(e, u));
	let d = (e) => {
		let { r, g: a, b: s } = (c ? o.localColorTable : t.globalColorTable)[e];
		return e === i(null) ? {
			r,
			g: a,
			b: s,
			a: n ? ~~((r + a + s) / 3) : 0
		} : {
			r,
			g: a,
			b: s,
			a: 255
		};
	}, f = (() => {
		try {
			return new ImageData(o.width, o.height, { colorSpace: "srgb" });
		} catch (e) {
			if (e instanceof DOMException && e.name === "IndexSizeError") return null;
			throw e;
		}
	})();
	if (f == null) throw EvalError("GIF frame size is to large");
	let p = e.nextByte(), m = e.readSubBlocksBin(), h = 1 << p, g = (e, t) => {
		let n = e >>> 3, r = e & 7;
		return (m[n] + (m[n + 1] << 8) + (m[n + 2] << 16) & (1 << t) - 1 << r) >>> r;
	};
	if (l) {
		for (let n = 0, i = p + 1, s = 0, c = [[0]], l = 0; l < 4; l++) {
			if (us[l] < o.height) {
				let e = 0, t = 0, r = !1;
				for (; !r;) {
					let a = n;
					if (n = g(s, i), s += i + 1, n === h) {
						i = p + 1, c.length = h + 2;
						for (let e = 0; e < c.length; e++) c[e] = e < h ? [e] : [];
					} else {
						n >= c.length ? c.push(c[a].concat(c[a][0])) : a !== h && c.push(c[a].concat(c[n][0]));
						for (let r of c[n]) {
							let { r: n, g: i, b: a, a: s } = d(r);
							f.data.set([
								n,
								i,
								a,
								s
							], us[l] * o.width + ds[l] * t + e % (o.width * 4)), e += 4;
						}
						c.length === 1 << i && i < 12 && i++;
					}
					e === o.width * 4 * (t + 1) && (t++, us[l] + ds[l] * t >= o.height && (r = !0));
				}
			}
			a?.(e.pos / (e.data.length - 1), r(!1) + 1, f, {
				x: o.left,
				y: o.top
			}, {
				width: t.width,
				height: t.height
			});
		}
		o.image = f, o.bitmap = await createImageBitmap(f);
	} else {
		let n = 0, i = p + 1, s = 0, c = -4, l = !1, u = [[0]];
		for (; !l;) {
			let e = n;
			if (n = g(s, i), s += i, n === h) {
				i = p + 1, u.length = h + 2;
				for (let e = 0; e < u.length; e++) u[e] = e < h ? [e] : [];
			} else {
				if (n === h + 1) {
					l = !0;
					break;
				}
				n >= u.length ? u.push(u[e].concat(u[e][0])) : e !== h && u.push(u[e].concat(u[n][0]));
				for (let e of u[n]) {
					let { r: t, g: n, b: r, a: i } = d(e);
					f.data.set([
						t,
						n,
						r,
						i
					], c += 4);
				}
				u.length >= 1 << i && i < 12 && i++;
			}
		}
		o.image = f, o.bitmap = await createImageBitmap(f), a?.((e.pos + 1) / e.data.length, r(!1) + 1, o.image, {
			x: o.left,
			y: o.top
		}, {
			width: t.width,
			height: t.height
		});
	}
}
async function ws(e, t, n, r, i, a) {
	switch (e.nextByte()) {
		case ms.EndOfFile: return !0;
		case ms.Image:
			await Cs(e, t, n, r, i, a);
			break;
		case ms.Extension:
			Ss(e, t, r, i);
			break;
		default: throw EvalError("undefined block found");
	}
	return !1;
}
function Ts(e) {
	for (let t of e.applicationExtensions) if (t.identifier + t.authenticationCode === "NETSCAPE2.0") return t.data[1] + (t.data[2] << 8);
	return NaN;
}
async function Es(e, t, n) {
	n ||= !1;
	let r = await fetch(e);
	if (!r.ok && r.status === 404) throw EvalError("file not found");
	let i = await r.arrayBuffer(), a = {
		width: 0,
		height: 0,
		totalTime: 0,
		colorRes: 0,
		pixelAspectRatio: 0,
		frames: [],
		sortFlag: !1,
		globalColorTable: [],
		backgroundImage: new ImageData(1, 1, { colorSpace: "srgb" }),
		comments: [],
		applicationExtensions: []
	}, o = new fs(new Uint8ClampedArray(i));
	if (o.getString(6) !== "GIF89a") throw Error("not a supported GIF file");
	a.width = o.nextTwoBytes(), a.height = o.nextTwoBytes();
	let s = o.nextByte(), c = (s & 128) == 128;
	a.colorRes = (s & 112) >>> 4, a.sortFlag = (s & 8) == 8;
	let l = 1 << (s & 7) + 1, u = o.nextByte();
	a.pixelAspectRatio = o.nextByte(), a.pixelAspectRatio !== 0 && (a.pixelAspectRatio = (a.pixelAspectRatio + 15) / 64), c && (a.globalColorTable = xs(o, l));
	let d = (() => {
		try {
			return new ImageData(a.width, a.height, { colorSpace: "srgb" });
		} catch (e) {
			if (e instanceof DOMException && e.name === "IndexSizeError") return null;
			throw e;
		}
	})();
	if (d == null) throw Error("GIF frame size is to large");
	let { r: f, g: p, b: m } = a.globalColorTable[u];
	d.data.set(c ? [
		f,
		p,
		m,
		255
	] : [
		0,
		0,
		0,
		0
	]);
	for (let e = 4; e < d.data.length; e *= 2) d.data.copyWithin(e, 0, e);
	a.backgroundImage = d;
	let h = -1, g = !0, _ = -1, v = (e) => (e && (g = !0), h), y = (e) => (e != null && (_ = e), _);
	try {
		do
			g &&= (a.frames.push({
				left: 0,
				top: 0,
				width: 0,
				height: 0,
				disposalMethod: ps.Replace,
				image: new ImageData(1, 1, { colorSpace: "srgb" }),
				plainTextData: null,
				userInputDelayFlag: !1,
				delayTime: 0,
				sortFlag: !1,
				localColorTable: [],
				reserved: 0,
				GCreserved: 0
			}), h++, _ = -1, !1);
		while (!await ws(o, a, n, v, y, t));
		a.frames.length--;
		for (let e of a.frames) {
			if (e.userInputDelayFlag && e.delayTime === 0) {
				a.totalTime = Infinity;
				break;
			}
			a.totalTime += e.delayTime;
		}
		return a;
	} catch (e) {
		throw e instanceof EvalError ? Error(`error while parsing frame ${h} "${e.message}"`) : e;
	}
}
function Ds(e) {
	let { context: t, radius: n, particle: r, delta: i } = e, a = r.image;
	if (!a?.gifData || !a.gif) return;
	let o = new OffscreenCanvas(a.gifData.width, a.gifData.height), s = o.getContext("2d");
	if (!s) throw Error("could not create offscreen canvas context");
	s.imageSmoothingQuality = "low", s.imageSmoothingEnabled = !1, s.clearRect(hs.x, hs.y, o.width, o.height), r.gifLoopCount === void 0 && (r.gifLoopCount = a.gifLoopCount ?? bs);
	let c = r.gifFrame ?? gs, l = {
		x: -a.gifData.width * _s,
		y: -a.gifData.height * _s
	}, u = a.gifData.frames[c];
	if (r.gifTime === void 0 && (r.gifTime = vs), u.bitmap) {
		switch (t.scale(n / a.gifData.width, n / a.gifData.height), u.disposalMethod) {
			case ps.UndefinedA:
			case ps.UndefinedB:
			case ps.UndefinedC:
			case ps.UndefinedD:
			case ps.Replace:
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y), s.clearRect(hs.x, hs.y, o.width, o.height);
				break;
			case ps.Combine:
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y);
				break;
			case ps.RestoreBackground:
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y), s.clearRect(hs.x, hs.y, o.width, o.height), a.gifData.globalColorTable.length ? s.putImageData(a.gifData.backgroundImage, l.x, l.y) : s.putImageData(a.gifData.frames[ys].image, l.x + u.left, l.y + u.top);
				break;
			case ps.RestorePrevious: {
				let e = s.getImageData(hs.x, hs.y, o.width, o.height);
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y), s.clearRect(hs.x, hs.y, o.width, o.height), s.putImageData(e, hs.x, hs.y);
			}
		}
		if (r.gifTime += i.value, r.gifTime > u.delayTime) {
			if (r.gifTime -= u.delayTime, ++c >= a.gifData.frames.length) {
				if (--r.gifLoopCount <= bs) return;
				c = ys, s.clearRect(hs.x, hs.y, o.width, o.height);
			}
			r.gifFrame = c;
		}
		t.scale(a.gifData.width / n, a.gifData.height / n);
	}
}
async function Os(e) {
	if (e.type !== "gif") {
		await ss(e);
		return;
	}
	e.loading = !0;
	try {
		e.gifData = await Es(e.source), e.gifLoopCount = Ts(e.gifData) ?? bs, e.gifLoopCount ||= Infinity;
	} catch {
		e.error = !0;
	}
	e.loading = !1;
}
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/ImageDrawer.js
var ks = 2, As = 1, js = 12, Ms = 1, Ns = class {
	constructor(e) {
		this.validTypes = ["image", "images"], this.loadImageShape = async (e) => {
			if (!this._engine.loadImage) throw Error(`${se} image shape not initialized`);
			await this._engine.loadImage({
				gif: e.gif,
				name: e.name,
				replaceColor: e.replaceColor ?? !1,
				src: e.src
			});
		}, this._engine = e;
	}
	addImage(e) {
		this._engine.images || (this._engine.images = []), this._engine.images.push(e);
	}
	draw(e) {
		let { context: t, radius: n, particle: r, opacity: i } = e, a = r.image, o = a?.element;
		if (a) {
			if (t.globalAlpha = i, a.gif && a.gifData) Ds(e);
			else if (o) {
				let e = a.ratio, r = {
					x: -n,
					y: -n
				}, i = n * ks;
				t.drawImage(o, r.x, r.y, i, i / e);
			}
			t.globalAlpha = As;
		}
	}
	getSidesCount() {
		return js;
	}
	async init(e) {
		let t = e.actualOptions;
		if (t.preload && this._engine.loadImage) for (let e of t.preload) await this._engine.loadImage(e);
	}
	loadShape(e) {
		if (e.shape !== "image" && e.shape !== "images") return;
		this._engine.images || (this._engine.images = []);
		let t = e.shapeData;
		t && (this._engine.images.find((e) => e.name === t.name || e.source === t.src) || this.loadImageShape(t).then(() => {
			this.loadShape(e);
		}));
	}
	particleInit(e, t) {
		if (t.shape !== "image" && t.shape !== "images") return;
		this._engine.images || (this._engine.images = []);
		let n = this._engine.images, r = t.shapeData;
		if (!r) return;
		let i = t.getFillColor(), a = n.find((e) => e.name === r.name || e.source === r.src);
		if (!a) return;
		let o = r.replaceColor ?? a.replaceColor;
		if (a.loading) {
			setTimeout(() => {
				this.particleInit(e, t);
			});
			return;
		}
		(async () => {
			let e;
			e = a.svgData && i ? await ls(a, r, i, t) : {
				color: i,
				data: a,
				element: a.element,
				gif: a.gif,
				gifData: a.gifData,
				gifLoopCount: a.gifLoopCount,
				loaded: !0,
				ratio: r.width && r.height ? r.width / r.height : a.ratio ?? Ms,
				replaceColor: o,
				source: r.src
			}, e.ratio || (e.ratio = 1);
			let n = r.fill ?? t.shapeFill, s = r.close ?? t.shapeClose, c = {
				image: e,
				fill: n,
				close: s
			};
			t.image = c.image, t.shapeFill = c.fill, t.shapeClose = c.close;
		})();
	}
}, Ps = class {
	constructor() {
		this.src = "", this.gif = !1;
	}
	load(e) {
		E(e) || (e.gif !== void 0 && (this.gif = e.gif), e.height !== void 0 && (this.height = e.height), e.name !== void 0 && (this.name = e.name), e.replaceColor !== void 0 && (this.replaceColor = e.replaceColor), e.src !== void 0 && (this.src = e.src), e.width !== void 0 && (this.width = e.width));
	}
}, Fs = class {
	constructor(e) {
		this.id = "imagePreloader", this._engine = e;
	}
	async getPlugin() {
		return await Promise.resolve(), {};
	}
	loadOptions(e, t) {
		if (!t?.preload) return;
		e.preload ||= [];
		let n = e.preload;
		for (let e of t.preload) {
			let t = n.find((t) => t.name === e.name || t.src === e.src);
			if (t) t.load(e);
			else {
				let t = new Ps();
				t.load(e), n.push(t);
			}
		}
	}
	needsPlugin() {
		return !0;
	}
}, Is = 3;
function Ls(e) {
	e.loadImage ||= async (t) => {
		if (!t.name && !t.src) throw Error(`${se} no image source provided`);
		if (e.images ||= [], !e.images.find((e) => e.name === t.name || e.source === t.src)) try {
			let n = {
				gif: t.gif ?? !1,
				name: t.name ?? t.src,
				source: t.src,
				type: t.src.substring(t.src.length - Is),
				error: !1,
				loading: !0,
				replaceColor: t.replaceColor,
				ratio: t.width && t.height ? t.width / t.height : void 0
			};
			e.images.push(n);
			let r;
			r = t.gif ? Os : t.replaceColor ? cs : ss, await r(n);
		} catch {
			throw Error(`${se} ${t.name ?? t.src} not found`);
		}
	};
}
async function Rs(e, t = !0) {
	e.checkVersion("3.9.1"), Ls(e);
	let n = new Fs(e);
	await e.addPlugin(n, t), await e.addShape(new Ns(e), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-life/browser/Options/Classes/LifeDelay.js
var zs = class extends Vn {
	constructor() {
		super(), this.sync = !1;
	}
	load(e) {
		E(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
	}
}, Bs = class extends Vn {
	constructor() {
		super(), this.sync = !1;
	}
	load(e) {
		E(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
	}
}, Vs = class {
	constructor() {
		this.count = 0, this.delay = new zs(), this.duration = new Bs();
	}
	load(e) {
		E(e) || (e.count !== void 0 && (this.count = e.count), this.delay.load(e.delay), this.duration.load(e.duration));
	}
}, Hs = 0, Us = -1, Ws = 0, Gs = 0;
function Ks(e, t, n) {
	if (!e.life) return;
	let r = e.life, i = !1;
	if (e.spawning) {
		if (r.delayTime += t.value, r.delayTime >= e.life.delay) i = !0, e.spawning = !1, r.delayTime = Hs, r.time = Hs;
		else return;
	}
	if (r.duration === Us || e.spawning || (i ? r.time = Hs : r.time += t.value, r.time < r.duration)) return;
	if (r.time = Hs, e.life.count > Ws && e.life.count--, e.life.count === Ws) {
		e.destroy();
		return;
	}
	let a = A(Gs, n.width), o = A(Gs, n.width);
	e.position.x = Me(a), e.position.y = Me(o), e.spawning = !0, r.delayTime = Hs, r.time = Hs, e.reset();
	let s = e.options.life;
	s && (r.delay = k(s.delay.value) * le, r.duration = k(s.duration.value) * le);
}
//#endregion
//#region node_modules/@tsparticles/updater-life/browser/LifeUpdater.js
var qs = 0, Js = 1, Ys = -1, Xs = class {
	constructor(e) {
		this.container = e;
	}
	init(e) {
		let t = this.container, n = e.options.life;
		n && (e.life = {
			delay: t.retina.reduceFactor ? k(n.delay.value) * (n.delay.sync ? Js : O()) / t.retina.reduceFactor * le : qs,
			delayTime: qs,
			duration: t.retina.reduceFactor ? k(n.duration.value) * (n.duration.sync ? Js : O()) / t.retina.reduceFactor * le : qs,
			time: qs,
			count: n.count
		}, e.life.duration <= qs && (e.life.duration = Ys), e.life.count <= qs && (e.life.count = Ys), e.life && (e.spawning = e.life.delay > qs));
	}
	isEnabled(e) {
		return !e.destroyed;
	}
	loadOptions(e, ...t) {
		e.life ||= new Vs();
		for (let n of t) e.life.load(n?.life);
	}
	update(e, t) {
		this.isEnabled(e) && e.life && Ks(e, t, this.container.canvas.size);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-life/browser/index.js
async function Zs(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("life", async (e) => Promise.resolve(new Xs(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-line/browser/Utils.js
function Qs(e) {
	let { context: t, particle: n, radius: r } = e, i = n.shapeData;
	t.moveTo(-r, 0), t.lineTo(r, 0), t.lineCap = i?.cap ?? "butt";
}
//#endregion
//#region node_modules/@tsparticles/shape-line/browser/LineDrawer.js
var $s = 1, ec = class {
	constructor() {
		this.validTypes = ["line"];
	}
	draw(e) {
		Qs(e);
	}
	getSidesCount() {
		return $s;
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-line/browser/index.js
async function tc(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new ec(), t);
}
//#endregion
//#region node_modules/@tsparticles/move-parallax/browser/ParallaxMover.js
var nc = .5, rc = class {
	init() {}
	isEnabled(e) {
		return !$e() && !e.destroyed && e.container.actualOptions.interactivity.events.onHover.parallax.enable;
	}
	move(e) {
		let t = e.container, n = t.actualOptions.interactivity.events.onHover.parallax;
		if ($e() || !n.enable) return;
		let r = n.force, i = t.interactivity.mouse.position;
		if (!i) return;
		let a = t.canvas.size, o = {
			x: a.width * nc,
			y: a.height * nc
		}, s = n.smooth, c = e.getRadius() / r, l = {
			x: (i.x - o.x) * c,
			y: (i.y - o.y) * c
		}, { offset: u } = e;
		u.x += (l.x - u.x) / s, u.y += (l.y - u.y) / s;
	}
};
//#endregion
//#region node_modules/@tsparticles/move-parallax/browser/index.js
async function ic(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addMover("parallax", () => Promise.resolve(new rc()), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-attract/browser/Attractor.js
var ac = 1e3, oc = 1, sc = class extends Yr {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {}
	interact(e) {
		let t = this.container;
		e.attractDistance === void 0 && (e.attractDistance = k(e.options.move.attract.distance) * t.retina.pixelRatio);
		let n = e.attractDistance, r = e.getPosition(), i = t.particles.quadTree.queryCircle(r, n);
		for (let t of i) {
			if (e === t || !t.options.move.attract.enable || t.destroyed || t.spawning) continue;
			let { dx: n, dy: i } = Fe(r, t.getPosition()), a = e.options.move.attract.rotate, o = n / (a.x * ac), s = i / (a.y * ac), c = t.size.value / e.size.value, l = oc / c;
			e.velocity.x -= o * c, e.velocity.y -= s * c, t.velocity.x += o * l, t.velocity.y += s * l;
		}
	}
	isEnabled(e) {
		return e.options.move.attract.enable;
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-attract/browser/index.js
async function cc(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("particlesAttract", (e) => Promise.resolve(new sc(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Absorb.js
var lc = .5, uc = 10, dc = 0;
function fc(e, t, n, r, i, a) {
	let o = Ae(e.options.collisions.absorb.speed * i.factor / uc, dc, r);
	e.size.value += o * lc, n.size.value -= o, r <= a && (n.size.value = 0, n.destroy());
}
function pc(e, t, n, r) {
	let i = e.getRadius(), a = t.getRadius();
	i === void 0 && a !== void 0 ? e.destroy() : i !== void 0 && a === void 0 ? t.destroy() : i !== void 0 && a !== void 0 && (i >= a ? fc(e, i, t, a, n, r) : fc(t, a, e, i, n, r));
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Bounce.js
var mc = (e) => {
	e.collisionMaxSpeed === void 0 && (e.collisionMaxSpeed = k(e.options.collisions.maxSpeed)), e.velocity.length > e.collisionMaxSpeed && (e.velocity.length = e.collisionMaxSpeed);
};
function hc(e, t) {
	gt(ht(e), ht(t)), mc(e), mc(t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Destroy.js
function gc(e, t) {
	!e.unbreakable && !t.unbreakable && hc(e, t), e.getRadius() === void 0 && t.getRadius() !== void 0 ? e.destroy() : e.getRadius() !== void 0 && t.getRadius() === void 0 ? t.destroy() : e.getRadius() !== void 0 && t.getRadius() !== void 0 && (e.getRadius() >= t.getRadius() ? t : e).destroy();
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/ResolveCollision.js
function _c(e, t, n, r) {
	switch (e.options.collisions.mode) {
		case Rn.absorb:
			pc(e, t, n, r);
			break;
		case Rn.bounce:
			hc(e, t);
			break;
		case Rn.destroy: gc(e, t);
	}
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Collider.js
var vc = 2, yc = class extends Yr {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {}
	interact(e, t) {
		if (e.destroyed || e.spawning) return;
		let n = this.container, r = e.getPosition(), i = e.getRadius(), a = n.particles.quadTree.queryCircle(r, i * vc);
		for (let o of a) {
			if (e === o || !o.options.collisions.enable || e.options.collisions.mode !== o.options.collisions.mode || o.destroyed || o.spawning) continue;
			let a = o.getPosition(), s = o.getRadius();
			Math.abs(Math.round(r.z) - Math.round(a.z)) > i + s || Ie(r, a) > i + s || _c(e, o, t, n.retina.pixelRatio);
		}
	}
	isEnabled(e) {
		return e.options.collisions.enable;
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/index.js
async function bc(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("particlesCollisions", (e) => Promise.resolve(new yc(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/CircleWarp.js
var xc = 2, Sc = class extends jr {
	constructor(e, t, n, r) {
		super(e, t, n), this.canvasSize = r, this.canvasSize = { ...r };
	}
	contains(e) {
		let { width: t, height: n } = this.canvasSize, { x: r, y: i } = e;
		return super.contains(e) || super.contains({
			x: r - t,
			y: i
		}) || super.contains({
			x: r - t,
			y: i - n
		}) || super.contains({
			x: r,
			y: i - n
		});
	}
	intersects(e) {
		if (super.intersects(e)) return !0;
		let t = e, n = e, r = {
			x: e.position.x - this.canvasSize.width,
			y: e.position.y - this.canvasSize.height
		};
		if (n.radius !== void 0) {
			let e = new jr(r.x, r.y, n.radius * xc);
			return super.intersects(e);
		}
		if (t.size !== void 0) {
			let e = new Mr(r.x, r.y, t.size.width * xc, t.size.height * xc);
			return super.intersects(e);
		}
		return !1;
	}
}, Cc = class {
	constructor() {
		this.blur = 5, this.color = new pn(), this.color.value = "#000", this.enable = !1;
	}
	load(e) {
		E(e) || (e.blur !== void 0 && (this.blur = e.blur), this.color = pn.create(this.color, e.color), e.enable !== void 0 && (this.enable = e.enable));
	}
}, wc = class {
	constructor() {
		this.enable = !1, this.frequency = 1;
	}
	load(e) {
		E(e) || (e.color !== void 0 && (this.color = pn.create(this.color, e.color)), e.enable !== void 0 && (this.enable = e.enable), e.frequency !== void 0 && (this.frequency = e.frequency), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, Tc = class {
	constructor() {
		this.blink = !1, this.color = new pn(), this.color.value = "#fff", this.consent = !1, this.distance = 100, this.enable = !1, this.frequency = 1, this.opacity = 1, this.shadow = new Cc(), this.triangles = new wc(), this.width = 1, this.warp = !1;
	}
	load(e) {
		E(e) || (e.id !== void 0 && (this.id = e.id), e.blink !== void 0 && (this.blink = e.blink), this.color = pn.create(this.color, e.color), e.consent !== void 0 && (this.consent = e.consent), e.distance !== void 0 && (this.distance = e.distance), e.enable !== void 0 && (this.enable = e.enable), e.frequency !== void 0 && (this.frequency = e.frequency), e.opacity !== void 0 && (this.opacity = e.opacity), this.shadow.load(e.shadow), this.triangles.load(e.triangles), e.width !== void 0 && (this.width = e.width), e.warp !== void 0 && (this.warp = e.warp));
	}
}, Ec = 2, Dc = 1, Oc = {
	x: 0,
	y: 0
}, kc = 0;
function Ac(e, t, n, r, i) {
	let { dx: a, dy: o, distance: s } = Fe(e, t);
	if (!i || s <= n) return s;
	let c = {
		x: Math.abs(a),
		y: Math.abs(o)
	}, l = {
		x: Math.min(c.x, r.width - c.x),
		y: Math.min(c.y, r.height - c.y)
	};
	return Math.sqrt(l.x ** Ec + l.y ** Ec);
}
var jc = class extends Yr {
	constructor(e, t) {
		super(e), this._setColor = (e) => {
			if (!e.options.links) return;
			let t = this._linkContainer, n = e.options.links, r = n.id === void 0 ? t.particles.linksColor : t.particles.linksColors.get(n.id);
			if (r) return;
			let i = n.color;
			r = Ut(this._engine, i, n.blink, n.consent), n.id === void 0 ? t.particles.linksColor = r : t.particles.linksColors.set(n.id, r);
		}, this._linkContainer = e, this._engine = t;
	}
	clear() {}
	init() {
		this._linkContainer.particles.linksColor = void 0, this._linkContainer.particles.linksColors = /* @__PURE__ */ new Map();
	}
	interact(e) {
		if (!e.options.links) return;
		e.links = [];
		let t = e.getPosition(), n = this.container, r = n.canvas.size;
		if (t.x < Oc.x || t.y < Oc.y || t.x > r.width || t.y > r.height) return;
		let i = e.options.links, a = i.opacity, o = e.retina.linksDistance ?? kc, s = i.warp, c;
		c = s ? new Sc(t.x, t.y, o, r) : new jr(t.x, t.y, o);
		let l = n.particles.quadTree.query(c);
		for (let n of l) {
			let c = n.options.links;
			if (e === n || !c?.enable || i.id !== c.id || n.spawning || n.destroyed || !n.links || e.links.some((e) => e.destination === n) || n.links.some((t) => t.destination === e)) continue;
			let l = n.getPosition();
			if (l.x < Oc.x || l.y < Oc.y || l.x > r.width || l.y > r.height) continue;
			let u = Ac(t, l, o, r, s && c.warp);
			if (u > o) continue;
			let d = (Dc - u / o) * a;
			this._setColor(e), e.links.push({
				destination: n,
				opacity: d
			});
		}
	}
	isEnabled(e) {
		return !!e.options.links?.enable;
	}
	loadParticlesOptions(e, ...t) {
		e.links ||= new Tc();
		for (let n of t) e.links.load(n?.links);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/interaction.js
async function Mc(e, t = !0) {
	await e.addInteractor("particlesLinks", async (t) => Promise.resolve(new jc(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/Utils.js
function Nc(e, t, n, r) {
	e.beginPath(), e.moveTo(t.x, t.y), e.lineTo(n.x, n.y), e.lineTo(r.x, r.y), e.closePath();
}
function Pc(e) {
	let t = !1, { begin: n, end: r, engine: i, maxDistance: a, context: o, canvasSize: s, width: c, backgroundMask: l, colorLine: u, opacity: d, links: f } = e;
	if (Ie(n, r) <= a) Yt(o, n, r), t = !0;
	else if (f.warp) {
		let e, i, c = Fe(n, {
			x: r.x - s.width,
			y: r.y
		});
		if (c.distance <= a) {
			let t = n.y - c.dy / c.dx * n.x;
			e = {
				x: 0,
				y: t
			}, i = {
				x: s.width,
				y: t
			};
		} else {
			let t = Fe(n, {
				x: r.x,
				y: r.y - s.height
			});
			if (t.distance <= a) {
				let r = -(n.y - t.dy / t.dx * n.x) / (t.dy / t.dx);
				e = {
					x: r,
					y: 0
				}, i = {
					x: r,
					y: s.height
				};
			} else {
				let t = Fe(n, {
					x: r.x - s.width,
					y: r.y - s.height
				});
				if (t.distance <= a) {
					let r = n.y - t.dy / t.dx * n.x;
					e = {
						x: -r / (t.dy / t.dx),
						y: r
					}, i = {
						x: e.x + s.width,
						y: e.y + s.height
					};
				}
			}
		}
		e && i && (Yt(o, n, e), Yt(o, r, i), t = !0);
	}
	if (!t) return;
	o.lineWidth = c, l.enable && (o.globalCompositeOperation = l.composite), o.strokeStyle = zt(u, d);
	let { shadow: p } = f;
	if (p.enable) {
		let e = jt(i, p.color);
		e && (o.shadowBlur = p.blur, o.shadowColor = zt(e));
	}
	o.stroke();
}
function Fc(e) {
	let { context: t, pos1: n, pos2: r, pos3: i, backgroundMask: a, colorTriangle: o, opacityTriangle: s } = e;
	Nc(t, n, r, i), a.enable && (t.globalCompositeOperation = a.composite), t.fillStyle = zt(o, s), t.fill();
}
function Ic(e) {
	return e.sort((e, t) => e - t), e.join("_");
}
function Lc(e, t) {
	let n = Ic(e.map((e) => e.id)), r = t.get(n);
	return r === void 0 && (r = O(), t.set(n, r)), r;
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/LinkInstance.js
var Rc = 0, zc = 0, Bc = 0, Vc = .5, Hc = 1, Uc = class {
	constructor(e, t) {
		this._drawLinkLine = (e, t) => {
			let n = e.options.links;
			if (!n?.enable) return;
			let r = this._container, i = r.actualOptions, a = t.destination, o = e.getPosition(), s = a.getPosition(), c = t.opacity;
			r.canvas.draw((t) => {
				let l, u = e.options.twinkle?.lines;
				if (u?.enable) {
					let e = u.frequency, t = jt(this._engine, u.color);
					O() < e && t && (l = t, c = k(u.opacity));
				}
				if (!l) {
					let t = n.id === void 0 ? r.particles.linksColor : r.particles.linksColors.get(n.id);
					l = Ht(e, a, t);
				}
				if (!l) return;
				let d = e.retina.linksWidth ?? zc, f = e.retina.linksDistance ?? Bc, { backgroundMask: p } = i;
				Pc({
					context: t,
					width: d,
					begin: o,
					end: s,
					engine: this._engine,
					maxDistance: f,
					canvasSize: r.canvas.size,
					links: n,
					backgroundMask: p,
					colorLine: l,
					opacity: c
				});
			});
		}, this._drawLinkTriangle = (e, t, n) => {
			let r = e.options.links;
			if (!r?.enable) return;
			let i = r.triangles;
			if (!i.enable) return;
			let a = this._container, o = a.actualOptions, s = t.destination, c = n.destination, l = i.opacity ?? (t.opacity + n.opacity) * Vc;
			l <= Rc || a.canvas.draw((t) => {
				let n = e.getPosition(), u = s.getPosition(), d = c.getPosition(), f = e.retina.linksDistance ?? Bc;
				if (Ie(n, u) > f || Ie(d, u) > f || Ie(d, n) > f) return;
				let p = jt(this._engine, i.color);
				if (!p) {
					let t = r.id === void 0 ? a.particles.linksColor : a.particles.linksColors.get(r.id);
					p = Ht(e, s, t);
				}
				p && Fc({
					context: t,
					pos1: n,
					pos2: u,
					pos3: d,
					backgroundMask: o.backgroundMask,
					colorTriangle: p,
					opacityTriangle: l
				});
			});
		}, this._drawTriangles = (e, t, n, r) => {
			let i = n.destination;
			if (!(e.links?.triangles.enable && i.options.links?.triangles.enable)) return;
			let a = i.links?.filter((e) => {
				let t = this._getLinkFrequency(i, e.destination);
				return i.options.links && t <= i.options.links.frequency && r.findIndex((t) => t.destination === e.destination) >= 0;
			});
			if (a?.length) for (let r of a) {
				let a = r.destination;
				this._getTriangleFrequency(t, i, a) > e.links.triangles.frequency || this._drawLinkTriangle(t, n, r);
			}
		}, this._getLinkFrequency = (e, t) => Lc([e, t], this._freqs.links), this._getTriangleFrequency = (e, t, n) => Lc([
			e,
			t,
			n
		], this._freqs.triangles), this._container = e, this._engine = t, this._freqs = {
			links: /* @__PURE__ */ new Map(),
			triangles: /* @__PURE__ */ new Map()
		};
	}
	drawParticle(e, t) {
		let { links: n, options: r } = t;
		if (!n?.length) return;
		let i = n.filter((e) => r.links && (r.links.frequency >= Hc || this._getLinkFrequency(t, e.destination) <= r.links.frequency));
		for (let e of i) this._drawTriangles(r, t, e, i), e.opacity > Rc && (t.retina.linksWidth ?? zc) > zc && this._drawLinkLine(t, e);
	}
	async init() {
		this._freqs.links = /* @__PURE__ */ new Map(), this._freqs.triangles = /* @__PURE__ */ new Map(), await Promise.resolve();
	}
	particleCreated(e) {
		if (e.links = [], !e.options.links) return;
		let t = this._container.retina.pixelRatio, { retina: n } = e, { distance: r, width: i } = e.options.links;
		n.linksDistance = r * t, n.linksWidth = i * t;
	}
	particleDestroyed(e) {
		e.links = [];
	}
}, Wc = class {
	constructor(e) {
		this.id = "links", this._engine = e;
	}
	getPlugin(e) {
		return Promise.resolve(new Uc(e, this._engine));
	}
	loadOptions() {}
	needsPlugin() {
		return !0;
	}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/plugin.js
async function Gc(e, t = !0) {
	let n = new Wc(e);
	await e.addPlugin(n, t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/index.js
async function Kc(e, t = !0) {
	e.checkVersion("3.9.1"), await Mc(e, t), await Gc(e, t);
}
//#endregion
//#region node_modules/@tsparticles/shape-polygon/browser/Utils.js
var qc = 180, Jc = {
	x: 0,
	y: 0
}, Yc = 2;
function Xc(e, t, n) {
	let { context: r } = e, i = n.count.numerator * n.count.denominator, a = n.count.numerator / n.count.denominator, o = qc * (a - Yc) / a, s = Math.PI - Le(o);
	if (r) {
		r.beginPath(), r.translate(t.x, t.y), r.moveTo(Jc.x, Jc.y);
		for (let e = 0; e < i; e++) r.lineTo(n.length, Jc.y), r.translate(n.length, Jc.y), r.rotate(s);
	}
}
//#endregion
//#region node_modules/@tsparticles/shape-polygon/browser/PolygonDrawerBase.js
var Zc = 5, Qc = class {
	draw(e) {
		let { particle: t, radius: n } = e;
		Xc(e, this.getCenter(t, n), this.getSidesData(t, n));
	}
	getSidesCount(e) {
		let t = e.shapeData;
		return Math.round(k(t?.sides ?? Zc));
	}
}, $c = 3.5, el = 2.66, tl = 3, nl = class extends Qc {
	constructor() {
		super(...arguments), this.validTypes = ["polygon"];
	}
	getCenter(e, t) {
		return {
			x: -t / (e.sides / $c),
			y: -t / (el / $c)
		};
	}
	getSidesData(e, t) {
		let n = e.sides;
		return {
			count: {
				denominator: 1,
				numerator: n
			},
			length: t * el / (n / tl)
		};
	}
}, rl = 1.66, il = 3, al = 2, ol = class extends Qc {
	constructor() {
		super(...arguments), this.validTypes = ["triangle"];
	}
	getCenter(e, t) {
		return {
			x: -t,
			y: t / rl
		};
	}
	getSidesCount() {
		return il;
	}
	getSidesData(e, t) {
		return {
			count: {
				denominator: 2,
				numerator: 3
			},
			length: t * al
		};
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-polygon/browser/index.js
async function sl(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new nl(), t);
}
async function cl(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new ol(), t);
}
async function ll(e, t = !0) {
	e.checkVersion("3.9.1"), await sl(e, t), await cl(e, t);
}
//#endregion
//#region node_modules/@tsparticles/updater-rotate/browser/Options/Classes/RotateAnimation.js
var ul = class {
	constructor() {
		this.enable = !1, this.speed = 0, this.decay = 0, this.sync = !1;
	}
	load(e) {
		E(e) || (e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = A(e.speed)), e.decay !== void 0 && (this.decay = A(e.decay)), e.sync !== void 0 && (this.sync = e.sync));
	}
}, dl = class extends Vn {
	constructor() {
		super(), this.animation = new ul(), this.direction = Xr.clockwise, this.path = !1, this.value = 0;
	}
	load(e) {
		E(e) || (super.load(e), e.direction !== void 0 && (this.direction = e.direction), this.animation.load(e.animation), e.path !== void 0 && (this.path = e.path));
	}
}, fl = 2, pl = Math.PI * fl, ml = 1, hl = 360, gl = class {
	constructor(e) {
		this.container = e;
	}
	init(e) {
		let t = e.options.rotate;
		if (!t) return;
		e.rotate = {
			enable: t.animation.enable,
			value: Le(k(t.value)),
			min: 0,
			max: pl
		}, e.pathRotation = t.path;
		let n = t.direction;
		switch (n === Xr.random && (n = Math.floor(O() * fl) > 0 ? Xr.counterClockwise : Xr.clockwise), n) {
			case Xr.counterClockwise:
			case "counterClockwise":
				e.rotate.status = We.decreasing;
				break;
			case Xr.clockwise: e.rotate.status = We.increasing;
		}
		let r = t.animation;
		r.enable && (e.rotate.decay = ml - k(r.decay), e.rotate.velocity = k(r.speed) / hl * this.container.retina.reduceFactor, r.sync || (e.rotate.velocity *= O())), e.rotation = e.rotate.value;
	}
	isEnabled(e) {
		let t = e.options.rotate;
		return t ? !e.destroyed && !e.spawning && (!!t.value || t.animation.enable || t.path) : !1;
	}
	loadOptions(e, ...t) {
		e.rotate ||= new dl();
		for (let n of t) e.rotate.load(n?.rotate);
	}
	update(e, t) {
		this.isEnabled(e) && (e.isRotating = !!e.rotate, e.rotate && (Tt(e, e.rotate, !1, Ge.none, t), e.rotation = e.rotate.value));
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-rotate/browser/index.js
async function _l(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("rotate", (e) => Promise.resolve(new gl(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-square/browser/Utils.js
var vl = Math.sqrt(2), yl = 2;
function bl(e) {
	let { context: t, radius: n } = e, r = n / vl, i = r * yl;
	t.rect(-r, -r, i, i);
}
//#endregion
//#region node_modules/@tsparticles/shape-square/browser/SquareDrawer.js
var xl = 4, Sl = class {
	constructor() {
		this.validTypes = ["edge", "square"];
	}
	draw(e) {
		bl(e);
	}
	getSidesCount() {
		return xl;
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-square/browser/index.js
async function Cl(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new Sl(), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-star/browser/Utils.js
var wl = 2, Tl = {
	x: 0,
	y: 0
};
function El(e) {
	let { context: t, particle: n, radius: r } = e, i = n.sides, a = n.starInset ?? wl;
	t.moveTo(Tl.x, Tl.y - r);
	for (let e = 0; e < i; e++) t.rotate(Math.PI / i), t.lineTo(Tl.x, Tl.y - r * a), t.rotate(Math.PI / i), t.lineTo(Tl.x, Tl.y - r);
}
//#endregion
//#region node_modules/@tsparticles/shape-star/browser/StarDrawer.js
var Dl = 2, Ol = 5, kl = class {
	constructor() {
		this.validTypes = ["star"];
	}
	draw(e) {
		El(e);
	}
	getSidesCount(e) {
		let t = e.shapeData;
		return Math.round(k(t?.sides ?? Ol));
	}
	particleInit(e, t) {
		let n = t.shapeData;
		t.starInset = k(n?.inset ?? Dl);
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-star/browser/index.js
async function Al(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new kl(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-stroke-color/browser/StrokeColorUpdater.js
var jl = 1, Ml = class {
	constructor(e, t) {
		this._container = e, this._engine = t;
	}
	init(e) {
		let t = this._container, n = e.options, r = yt(n.stroke, e.id, n.reduceDuplicates);
		e.strokeWidth = k(r.width) * t.retina.pixelRatio, e.strokeOpacity = k(r.opacity ?? jl), e.strokeAnimation = r.color?.animation;
		let i = Nt(this._engine, r.color) ?? e.getFillColor();
		i && (e.strokeColor = Gt(i, e.strokeAnimation, t.retina.reduceFactor));
	}
	isEnabled(e) {
		let t = e.strokeAnimation, { strokeColor: n } = e;
		return !e.destroyed && !e.spawning && !!t && (n?.h.value !== void 0 && n.h.enable || n?.s.value !== void 0 && n.s.enable || n?.l.value !== void 0 && n.l.enable);
	}
	update(e, t) {
		this.isEnabled(e) && Jt(e.strokeColor, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-stroke-color/browser/index.js
async function Nl(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("strokeColor", (t) => Promise.resolve(new Ml(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/slim/browser/index.js
async function Pl(e, t = !0) {
	e.checkVersion("3.9.1"), await ic(e, !1), await Ea(e, !1), await Ba(e, !1), await ro(e, !1), await _o(e, !1), await Do(e, !1), await Ao(e, !1), await Fo(e, !1), await zo(e, !1), await Zo(e, !1), await ns(e, !1), await cc(e, !1), await bc(e, !1), await Kc(e, !1), await da(e, !1), await ga(e, !1), await Rs(e, !1), await tc(e, !1), await ll(e, !1), await Cl(e, !1), await Al(e, !1), await Zs(e, !1), await _l(e, !1), await Nl(e, !1), await ua(e, t);
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Fl(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Fl(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Il() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Fl(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/tailwind-merge/dist/bundle-mjs.mjs
var Ll = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Rl = (e, t) => ({
	classGroupId: e,
	validator: t
}), zl = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Bl = "-", Vl = [], Hl = "arbitrary..", Ul = (e) => {
	let t = Kl(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return Gl(e);
			let n = e.split(Bl);
			return Wl(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Ll(i, t) : t : i || Vl;
			}
			return n[e] || Vl;
		}
	};
}, Wl = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Wl(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Bl) : e.slice(t).join(Bl), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, Gl = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Hl + r : void 0;
})(), Kl = (e) => {
	let { theme: t, classGroups: n } = e;
	return ql(n, t);
}, ql = (e, t) => {
	let n = zl();
	for (let r in e) {
		let i = e[r];
		Jl(i, n, r, t);
	}
	return n;
}, Jl = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		Yl(i, t, n, r);
	}
}, Yl = (e, t, n, r) => {
	if (typeof e == "string") {
		Xl(e, t, n);
		return;
	}
	if (typeof e == "function") {
		Zl(e, t, n, r);
		return;
	}
	Ql(e, t, n, r);
}, Xl = (e, t, n) => {
	let r = e === "" ? t : $l(t, e);
	r.classGroupId = n;
}, Zl = (e, t, n, r) => {
	if (eu(e)) {
		Jl(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(Rl(n, e));
}, Ql = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		Jl(o, $l(t, a), n, r);
	}
}, $l = (e, t) => {
	let n = e, r = t.split(Bl), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = zl(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, eu = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, tu = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, nu = "!", ru = ":", iu = [], au = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), ou = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === ru) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(nu) ? (c = s.slice(0, -1), l = !0) : s.startsWith(nu) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return au(t, l, c, u);
	};
	if (t) {
		let e = t + ru, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : au(iu, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, su = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, cu = (e) => ({
	cache: tu(e.cacheSize),
	parseClassName: ou(e),
	sortModifiers: su(e),
	postfixLookupClassGroupIds: lu(e),
	...Ul(e)
}), lu = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, uu = /\s+/, z = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(uu), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			if (g = r(p), !g) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + nu : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, du = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = fu(n)) && (i && (i += " "), i += r);
	return i;
}, fu = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = fu(e[r])) && (n && (n += " "), n += t);
	return n;
}, pu = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = cu(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = z(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(du(...e));
}, mu = [], B = (e) => {
	let t = (t) => t[e] || mu;
	return t.isThemeGetter = !0, t.themeKey = e, t;
}, hu = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, gu = /^\((?:(\w[\w-]*):)?(.+)\)$/i, _u = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, vu = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, yu = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, bu = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, xu = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Su = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Cu = (e) => _u.test(e), V = (e) => !!e && !Number.isNaN(Number(e)), H = (e) => !!e && Number.isInteger(Number(e)), wu = (e) => e.endsWith("%") && V(e.slice(0, -1)), Tu = (e) => vu.test(e), Eu = () => !0, Du = (e) => yu.test(e) && !bu.test(e), Ou = () => !1, ku = (e) => xu.test(e), Au = (e) => Su.test(e), ju = (e) => !U(e) && !W(e), Mu = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Nu = (e) => Ju(e, Qu, Ou), U = (e) => hu.test(e), Pu = (e) => Ju(e, $u, Du), Fu = (e) => Ju(e, ed, V), Iu = (e) => Ju(e, td, Eu), Lu = (e) => Ju(e, G, Ou), Ru = (e) => Ju(e, Xu, Ou), zu = (e) => Ju(e, Zu, Au), Bu = (e) => Ju(e, K, ku), W = (e) => gu.test(e), Vu = (e) => Yu(e, $u), Hu = (e) => Yu(e, G), Uu = (e) => Yu(e, Xu), Wu = (e) => Yu(e, Qu), Gu = (e) => Yu(e, Zu), Ku = (e) => Yu(e, K, !0), qu = (e) => Yu(e, td, !0), Ju = (e, t, n) => {
	let r = hu.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, Yu = (e, t, n = !1) => {
	let r = gu.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, Xu = (e) => e === "position" || e === "percentage", Zu = (e) => e === "image" || e === "url", Qu = (e) => e === "length" || e === "size" || e === "bg-size", $u = (e) => e === "length", ed = (e) => e === "number", G = (e) => e === "family-name", td = (e) => e === "number" || e === "weight", K = (e) => e === "shadow", q = /*#__PURE__*/ pu(() => {
	let e = B("color"), t = B("font"), n = B("text"), r = B("font-weight"), i = B("tracking"), a = B("leading"), o = B("breakpoint"), s = B("container"), c = B("spacing"), l = B("radius"), u = B("shadow"), d = B("inset-shadow"), f = B("text-shadow"), p = B("drop-shadow"), m = B("blur"), h = B("perspective"), g = B("aspect"), _ = B("ease"), v = B("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], ee = () => [
		...b(),
		W,
		U
	], te = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], ne = () => [
		"auto",
		"contain",
		"none"
	], x = () => [
		W,
		U,
		c
	], S = () => [
		Cu,
		"full",
		"auto",
		...x()
	], re = () => [
		H,
		"none",
		"subgrid",
		W,
		U
	], C = () => [
		"auto",
		{ span: [
			"full",
			H,
			W,
			U
		] },
		H,
		W,
		U
	], ie = () => [
		H,
		"auto",
		W,
		U
	], ae = () => [
		"auto",
		"min",
		"max",
		"fr",
		W,
		U
	], oe = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], se = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], ce = () => ["auto", ...x()], le = () => [
		Cu,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...x()
	], ue = () => [
		s,
		Cu,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...x()
	], de = () => [
		Cu,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...x()
	], w = () => [
		e,
		W,
		U
	], fe = () => [
		...b(),
		Uu,
		Ru,
		{ position: [W, U] }
	], pe = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], me = () => [
		"auto",
		"cover",
		"contain",
		Wu,
		Nu,
		{ size: [W, U] }
	], he = () => [
		wu,
		Vu,
		Pu
	], ge = () => [
		"",
		"none",
		"full",
		l,
		W,
		U
	], _e = () => [
		"",
		V,
		Vu,
		Pu
	], ve = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ye = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], T = () => [
		V,
		wu,
		Uu,
		Ru
	], be = () => [
		"",
		"none",
		m,
		W,
		U
	], xe = () => [
		"none",
		V,
		W,
		U
	], Se = () => [
		"none",
		V,
		W,
		U
	], Ce = () => [
		V,
		W,
		U
	], we = () => [
		Cu,
		"full",
		...x()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [Tu],
			breakpoint: [Tu],
			color: [Eu],
			container: [Tu],
			"drop-shadow": [Tu],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [ju],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [Tu],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [Tu],
			shadow: [Tu],
			spacing: ["px", V],
			text: [Tu],
			"text-shadow": [Tu],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				Cu,
				U,
				W,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				W,
				U
			] }],
			"container-named": [Mu],
			columns: [{ columns: [
				V,
				"auto",
				U,
				W,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: ee() }],
			overflow: [{ overflow: te() }],
			"overflow-x": [{ "overflow-x": te() }],
			"overflow-y": [{ "overflow-y": te() }],
			overscroll: [{ overscroll: ne() }],
			"overscroll-x": [{ "overscroll-x": ne() }],
			"overscroll-y": [{ "overscroll-y": ne() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: S() }],
			"inset-x": [{ "inset-x": S() }],
			"inset-y": [{ "inset-y": S() }],
			start: [{
				"inset-s": S(),
				start: S()
			}],
			end: [{
				"inset-e": S(),
				end: S()
			}],
			"inset-bs": [{ "inset-bs": S() }],
			"inset-be": [{ "inset-be": S() }],
			top: [{ top: S() }],
			right: [{ right: S() }],
			bottom: [{ bottom: S() }],
			left: [{ left: S() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				H,
				"auto",
				W,
				U
			] }],
			basis: [{ basis: [
				Cu,
				"full",
				"auto",
				s,
				...x()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				V,
				Cu,
				"auto",
				"initial",
				"none",
				U
			] }],
			grow: [{ grow: [
				"",
				V,
				W,
				U
			] }],
			shrink: [{ shrink: [
				"",
				V,
				W,
				U
			] }],
			order: [{ order: [
				H,
				"first",
				"last",
				"none",
				W,
				U
			] }],
			"grid-cols": [{ "grid-cols": re() }],
			"col-start-end": [{ col: C() }],
			"col-start": [{ "col-start": ie() }],
			"col-end": [{ "col-end": ie() }],
			"grid-rows": [{ "grid-rows": re() }],
			"row-start-end": [{ row: C() }],
			"row-start": [{ "row-start": ie() }],
			"row-end": [{ "row-end": ie() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": ae() }],
			"auto-rows": [{ "auto-rows": ae() }],
			gap: [{ gap: x() }],
			"gap-x": [{ "gap-x": x() }],
			"gap-y": [{ "gap-y": x() }],
			"justify-content": [{ justify: [...oe(), "normal"] }],
			"justify-items": [{ "justify-items": [...se(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...se()] }],
			"align-content": [{ content: ["normal", ...oe()] }],
			"align-items": [{ items: [...se(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...se(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": oe() }],
			"place-items": [{ "place-items": [...se(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...se()] }],
			p: [{ p: x() }],
			px: [{ px: x() }],
			py: [{ py: x() }],
			ps: [{ ps: x() }],
			pe: [{ pe: x() }],
			pbs: [{ pbs: x() }],
			pbe: [{ pbe: x() }],
			pt: [{ pt: x() }],
			pr: [{ pr: x() }],
			pb: [{ pb: x() }],
			pl: [{ pl: x() }],
			m: [{ m: ce() }],
			mx: [{ mx: ce() }],
			my: [{ my: ce() }],
			ms: [{ ms: ce() }],
			me: [{ me: ce() }],
			mbs: [{ mbs: ce() }],
			mbe: [{ mbe: ce() }],
			mt: [{ mt: ce() }],
			mr: [{ mr: ce() }],
			mb: [{ mb: ce() }],
			ml: [{ ml: ce() }],
			"space-x": [{ "space-x": x() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": x() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: le() }],
			"inline-size": [{ inline: ["auto", ...ue()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...ue()] }],
			"max-inline-size": [{ "max-inline": ["none", ...ue()] }],
			"block-size": [{ block: ["auto", ...de()] }],
			"min-block-size": [{ "min-block": ["auto", ...de()] }],
			"max-block-size": [{ "max-block": ["none", ...de()] }],
			w: [{ w: [
				s,
				"screen",
				...le()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...le()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...le()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...le()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...le()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				"none",
				...le()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Vu,
				Pu
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				qu,
				Iu
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				wu,
				U
			] }],
			"font-family": [{ font: [
				Hu,
				Lu,
				t
			] }],
			"font-features": [{ "font-features": [U] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				W,
				U
			] }],
			"line-clamp": [{ "line-clamp": [
				V,
				"none",
				W,
				Fu
			] }],
			leading: [{ leading: [
				"none",
				a,
				...x()
			] }],
			"list-image": [{ "list-image": [
				"none",
				W,
				U
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				W,
				U
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: w() }],
			"text-color": [{ text: w() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...ve(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				V,
				"from-font",
				"auto",
				W,
				Pu
			] }],
			"text-decoration-color": [{ decoration: w() }],
			"underline-offset": [{ "underline-offset": [
				V,
				"auto",
				W,
				U
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: x() }],
			"tab-size": [{ tab: [
				H,
				W,
				U
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				W,
				U
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				W,
				U
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: fe() }],
			"bg-repeat": [{ bg: pe() }],
			"bg-size": [{ bg: me() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						H,
						W,
						U
					],
					radial: [
						"",
						W,
						U
					],
					conic: [
						"",
						H,
						W,
						U
					]
				},
				Gu,
				zu
			] }],
			"bg-color": [{ bg: w() }],
			"gradient-from-pos": [{ from: he() }],
			"gradient-via-pos": [{ via: he() }],
			"gradient-to-pos": [{ to: he() }],
			"gradient-from": [{ from: w() }],
			"gradient-via": [{ via: w() }],
			"gradient-to": [{ to: w() }],
			rounded: [{ rounded: ge() }],
			"rounded-s": [{ "rounded-s": ge() }],
			"rounded-e": [{ "rounded-e": ge() }],
			"rounded-t": [{ "rounded-t": ge() }],
			"rounded-r": [{ "rounded-r": ge() }],
			"rounded-b": [{ "rounded-b": ge() }],
			"rounded-l": [{ "rounded-l": ge() }],
			"rounded-ss": [{ "rounded-ss": ge() }],
			"rounded-se": [{ "rounded-se": ge() }],
			"rounded-ee": [{ "rounded-ee": ge() }],
			"rounded-es": [{ "rounded-es": ge() }],
			"rounded-tl": [{ "rounded-tl": ge() }],
			"rounded-tr": [{ "rounded-tr": ge() }],
			"rounded-br": [{ "rounded-br": ge() }],
			"rounded-bl": [{ "rounded-bl": ge() }],
			"border-w": [{ border: _e() }],
			"border-w-x": [{ "border-x": _e() }],
			"border-w-y": [{ "border-y": _e() }],
			"border-w-s": [{ "border-s": _e() }],
			"border-w-e": [{ "border-e": _e() }],
			"border-w-bs": [{ "border-bs": _e() }],
			"border-w-be": [{ "border-be": _e() }],
			"border-w-t": [{ "border-t": _e() }],
			"border-w-r": [{ "border-r": _e() }],
			"border-w-b": [{ "border-b": _e() }],
			"border-w-l": [{ "border-l": _e() }],
			"divide-x": [{ "divide-x": _e() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": _e() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...ve(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...ve(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: w() }],
			"border-color-x": [{ "border-x": w() }],
			"border-color-y": [{ "border-y": w() }],
			"border-color-s": [{ "border-s": w() }],
			"border-color-e": [{ "border-e": w() }],
			"border-color-bs": [{ "border-bs": w() }],
			"border-color-be": [{ "border-be": w() }],
			"border-color-t": [{ "border-t": w() }],
			"border-color-r": [{ "border-r": w() }],
			"border-color-b": [{ "border-b": w() }],
			"border-color-l": [{ "border-l": w() }],
			"divide-color": [{ divide: w() }],
			"outline-style": [{ outline: [
				...ve(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				V,
				W,
				U
			] }],
			"outline-w": [{ outline: [
				"",
				V,
				Vu,
				Pu
			] }],
			"outline-color": [{ outline: w() }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				u,
				Ku,
				Bu
			] }],
			"shadow-color": [{ shadow: w() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				Ku,
				Bu
			] }],
			"inset-shadow-color": [{ "inset-shadow": w() }],
			"ring-w": [{ ring: _e() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: w() }],
			"ring-offset-w": [{ "ring-offset": [V, Pu] }],
			"ring-offset-color": [{ "ring-offset": w() }],
			"inset-ring-w": [{ "inset-ring": _e() }],
			"inset-ring-color": [{ "inset-ring": w() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				Ku,
				Bu
			] }],
			"text-shadow-color": [{ "text-shadow": w() }],
			opacity: [{ opacity: [
				V,
				W,
				U
			] }],
			"mix-blend": [{ "mix-blend": [
				...ye(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ye() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [V] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": T() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": T() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": w() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": w() }],
			"mask-image-t-from-pos": [{ "mask-t-from": T() }],
			"mask-image-t-to-pos": [{ "mask-t-to": T() }],
			"mask-image-t-from-color": [{ "mask-t-from": w() }],
			"mask-image-t-to-color": [{ "mask-t-to": w() }],
			"mask-image-r-from-pos": [{ "mask-r-from": T() }],
			"mask-image-r-to-pos": [{ "mask-r-to": T() }],
			"mask-image-r-from-color": [{ "mask-r-from": w() }],
			"mask-image-r-to-color": [{ "mask-r-to": w() }],
			"mask-image-b-from-pos": [{ "mask-b-from": T() }],
			"mask-image-b-to-pos": [{ "mask-b-to": T() }],
			"mask-image-b-from-color": [{ "mask-b-from": w() }],
			"mask-image-b-to-color": [{ "mask-b-to": w() }],
			"mask-image-l-from-pos": [{ "mask-l-from": T() }],
			"mask-image-l-to-pos": [{ "mask-l-to": T() }],
			"mask-image-l-from-color": [{ "mask-l-from": w() }],
			"mask-image-l-to-color": [{ "mask-l-to": w() }],
			"mask-image-x-from-pos": [{ "mask-x-from": T() }],
			"mask-image-x-to-pos": [{ "mask-x-to": T() }],
			"mask-image-x-from-color": [{ "mask-x-from": w() }],
			"mask-image-x-to-color": [{ "mask-x-to": w() }],
			"mask-image-y-from-pos": [{ "mask-y-from": T() }],
			"mask-image-y-to-pos": [{ "mask-y-to": T() }],
			"mask-image-y-from-color": [{ "mask-y-from": w() }],
			"mask-image-y-to-color": [{ "mask-y-to": w() }],
			"mask-image-radial": [{ "mask-radial": [W, U] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": T() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": T() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": w() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": w() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [V] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": T() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": T() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": w() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": w() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: fe() }],
			"mask-repeat": [{ mask: pe() }],
			"mask-size": [{ mask: me() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				W,
				U
			] }],
			filter: [{ filter: [
				"",
				"none",
				W,
				U
			] }],
			blur: [{ blur: be() }],
			brightness: [{ brightness: [
				V,
				W,
				U
			] }],
			contrast: [{ contrast: [
				V,
				W,
				U
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				Ku,
				Bu
			] }],
			"drop-shadow-color": [{ "drop-shadow": w() }],
			grayscale: [{ grayscale: [
				"",
				V,
				W,
				U
			] }],
			"hue-rotate": [{ "hue-rotate": [
				V,
				W,
				U
			] }],
			invert: [{ invert: [
				"",
				V,
				W,
				U
			] }],
			saturate: [{ saturate: [
				V,
				W,
				U
			] }],
			sepia: [{ sepia: [
				"",
				V,
				W,
				U
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				W,
				U
			] }],
			"backdrop-blur": [{ "backdrop-blur": be() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				V,
				W,
				U
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				V,
				W,
				U
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				V,
				W,
				U
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				V,
				W,
				U
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				V,
				W,
				U
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				V,
				W,
				U
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				V,
				W,
				U
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				V,
				W,
				U
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": x() }],
			"border-spacing-x": [{ "border-spacing-x": x() }],
			"border-spacing-y": [{ "border-spacing-y": x() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				W,
				U
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				V,
				"initial",
				W,
				U
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				W,
				U
			] }],
			delay: [{ delay: [
				V,
				W,
				U
			] }],
			animate: [{ animate: [
				"none",
				v,
				W,
				U
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				W,
				U
			] }],
			"perspective-origin": [{ "perspective-origin": ee() }],
			rotate: [{ rotate: xe() }],
			"rotate-x": [{ "rotate-x": xe() }],
			"rotate-y": [{ "rotate-y": xe() }],
			"rotate-z": [{ "rotate-z": xe() }],
			scale: [{ scale: Se() }],
			"scale-x": [{ "scale-x": Se() }],
			"scale-y": [{ "scale-y": Se() }],
			"scale-z": [{ "scale-z": Se() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: Ce() }],
			"skew-x": [{ "skew-x": Ce() }],
			"skew-y": [{ "skew-y": Ce() }],
			transform: [{ transform: [
				W,
				U,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: ee() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: we() }],
			"translate-x": [{ "translate-x": we() }],
			"translate-y": [{ "translate-y": we() }],
			"translate-z": [{ "translate-z": we() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				H,
				W,
				U
			] }],
			accent: [{ accent: w() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: w() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				W,
				U
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": w() }],
			"scrollbar-track-color": [{ "scrollbar-track": w() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": x() }],
			"scroll-mx": [{ "scroll-mx": x() }],
			"scroll-my": [{ "scroll-my": x() }],
			"scroll-ms": [{ "scroll-ms": x() }],
			"scroll-me": [{ "scroll-me": x() }],
			"scroll-mbs": [{ "scroll-mbs": x() }],
			"scroll-mbe": [{ "scroll-mbe": x() }],
			"scroll-mt": [{ "scroll-mt": x() }],
			"scroll-mr": [{ "scroll-mr": x() }],
			"scroll-mb": [{ "scroll-mb": x() }],
			"scroll-ml": [{ "scroll-ml": x() }],
			"scroll-p": [{ "scroll-p": x() }],
			"scroll-px": [{ "scroll-px": x() }],
			"scroll-py": [{ "scroll-py": x() }],
			"scroll-ps": [{ "scroll-ps": x() }],
			"scroll-pe": [{ "scroll-pe": x() }],
			"scroll-pbs": [{ "scroll-pbs": x() }],
			"scroll-pbe": [{ "scroll-pbe": x() }],
			"scroll-pt": [{ "scroll-pt": x() }],
			"scroll-pr": [{ "scroll-pr": x() }],
			"scroll-pb": [{ "scroll-pb": x() }],
			"scroll-pl": [{ "scroll-pl": x() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				W,
				U
			] }],
			fill: [{ fill: ["none", ...w()] }],
			"stroke-w": [{ stroke: [
				V,
				Vu,
				Pu,
				Fu
			] }],
			stroke: [{ stroke: ["none", ...w()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": [
				"start",
				"end",
				"right",
				"left"
			],
			"inset-y": [
				"inset-bs",
				"inset-be",
				"top",
				"bottom"
			],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: [
				"ps",
				"pe",
				"pr",
				"pl"
			],
			py: [
				"pbs",
				"pbe",
				"pt",
				"pb"
			],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: [
				"ms",
				"me",
				"mr",
				"ml"
			],
			my: [
				"mbs",
				"mbe",
				"mt",
				"mb"
			],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": [
				"border-w-s",
				"border-w-e",
				"border-w-r",
				"border-w-l"
			],
			"border-w-y": [
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-b"
			],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": [
				"border-color-s",
				"border-color-e",
				"border-color-r",
				"border-color-l"
			],
			"border-color-y": [
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-b"
			],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": [
				"scroll-ms",
				"scroll-me",
				"scroll-mr",
				"scroll-ml"
			],
			"scroll-my": [
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mb"
			],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": [
				"scroll-ps",
				"scroll-pe",
				"scroll-pr",
				"scroll-pl"
			],
			"scroll-py": [
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pb"
			],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
//#endregion
//#region src/lib/utils.ts
function J(...e) {
	return q(Il(e));
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var nd = (0, _.createContext)({});
//#endregion
//#region node_modules/framer-motion/dist/es/utils/use-constant.mjs
function rd(e) {
	let t = (0, _.useRef)(null);
	return t.current === null && (t.current = e()), t.current;
}
//#endregion
//#region node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var id = typeof window < "u" ? _.useLayoutEffect : _.useEffect, ad = /* @__PURE__ */ (0, _.createContext)(null);
//#endregion
//#region node_modules/motion-utils/dist/es/array.mjs
function od(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function sd(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
//#endregion
//#region node_modules/motion-utils/dist/es/clamp.mjs
var cd = (e, t, n) => n > t ? t : n < e ? e : n, ld = {}, ud = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), dd = (e) => typeof e == "object" && !!e, fd = (e) => /^0[^.\s]+$/u.test(e);
//#endregion
//#region node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function pd(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
//#endregion
//#region node_modules/motion-utils/dist/es/noop.mjs
var md = /* @__NO_SIDE_EFFECTS__ */ (e) => e, hd = (...e) => e.reduce((e, t) => (n) => t(e(n))), gd = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, _d = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return od(this.subscriptions, e), () => this.remove(e);
	}
	remove(e) {
		sd(this.subscriptions, e);
	}
	notify(e, t, n) {
		let r = this.subscriptions.length;
		if (r) {
			if (r === 1) this.subscriptions[0](e, t, n);
			else for (let i = 0; i < r; i++) {
				let r = this.subscriptions[i];
				r && r(e, t, n);
			}
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
}, vd = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, yd = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, bd = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, xd = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e, Sd = 1e-7, Cd = 12;
function wd(e, t, n, r, i) {
	let a, o, s = 0;
	do
		o = t + (n - t) / 2, a = xd(o, r, i) - e, a > 0 ? n = o : t = o;
	while (Math.abs(a) > Sd && ++s < Cd);
	return o;
}
/*#__NO_SIDE_EFFECTS__*/
function Td(e, t, n, r) {
	if (e === t && n === r) return md;
	let i = (t) => wd(t, 0, 1, e, n);
	return (e) => e === 0 || e === 1 ? e : xd(i(e), t, r);
}
//#endregion
//#region node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var Ed = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Dd = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), Od = /*@__PURE__*/ Td(.33, 1.53, .69, .99), kd = /*@__PURE__*/ Dd(Od), Ad = /*@__PURE__*/ Ed(kd), jd = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * kd(e) : .5 * (2 - 2 ** (-10 * (e - 1))), Md = (e) => 1 - Math.sin(Math.acos(e)), Nd = /* @__PURE__ */ Dd(Md), Pd = /* @__PURE__ */ Ed(Md), Fd = /*@__PURE__*/ Td(.42, 0, 1, 1), Id = /*@__PURE__*/ Td(0, 0, .58, 1), Ld = /*@__PURE__*/ Td(.42, 0, .58, 1), Rd = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", zd = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", Bd = {
	linear: md,
	easeIn: Fd,
	easeInOut: Ld,
	easeOut: Id,
	circIn: Md,
	circInOut: Pd,
	circOut: Nd,
	backIn: kd,
	backInOut: Ad,
	backOut: Od,
	anticipate: jd
}, Vd = (e) => typeof e == "string", Hd = (e) => {
	if (/* @__PURE__ */ zd(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ Td(t, n, r, i);
	}
	return Vd(e) ? (Bd[e], `${e}`, Bd[e]) : e;
}, Ud = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, Wd;
function Gd() {
	Wd = void 0;
}
var Kd = {
	now: () => (Wd === void 0 && Kd.set(Ud.isProcessing || ld.useManualTiming ? Ud.timestamp : performance.now()), Wd),
	set: (e) => {
		Wd = e, queueMicrotask(Gd);
	}
}, qd = (e) => Math.round(e * 1e5) / 1e5, Jd = (e) => (t) => typeof t == "string" && t.startsWith(e), Yd = /*@__PURE__*/ Jd("--"), Xd = /*@__PURE__*/ Jd("var(--"), Zd = (e) => Xd(e) ? Qd.test(e.split("/*")[0].trim()) : !1, Qd = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function $d(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var ef = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, tf = {
	...ef,
	transform: (e) => cd(0, 1, e)
}, nf = {
	...ef,
	default: 1
}, rf = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function af(e) {
	return e == null;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var of = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, sf = (e, t) => (n) => !!(typeof n == "string" && of.test(n) && n.startsWith(e) || t && !af(n) && Object.prototype.hasOwnProperty.call(n, t)), cf = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(rf);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, lf = (e) => cd(0, 255, e), uf = {
	...ef,
	transform: (e) => Math.round(lf(e))
}, df = {
	test: /*@__PURE__*/ sf("rgb", "red"),
	parse: /*@__PURE__*/ cf("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + uf.transform(e) + ", " + uf.transform(t) + ", " + uf.transform(n) + ", " + qd(tf.transform(r)) + ")"
};
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function ff(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var pf = {
	test: /*@__PURE__*/ sf("#"),
	parse: ff,
	transform: df.transform
}, mf = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), hf = /*@__PURE__*/ mf("deg"), Y = /*@__PURE__*/ mf("%"), X = /*@__PURE__*/ mf("px"), gf = /*@__PURE__*/ mf("vh"), _f = /*@__PURE__*/ mf("vw"), vf = {
	...Y,
	parse: (e) => Y.parse(e) / 100,
	transform: (e) => Y.transform(e * 100)
}, yf = {
	test: /*@__PURE__*/ sf("hsl", "hue"),
	parse: /*@__PURE__*/ cf("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Y.transform(qd(t)) + ", " + Y.transform(qd(n)) + ", " + qd(tf.transform(r)) + ")"
}, bf = {
	test: (e) => df.test(e) || pf.test(e) || yf.test(e),
	parse: (e) => df.test(e) ? df.parse(e) : yf.test(e) ? yf.parse(e) : pf.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? df.transform(e) : yf.transform(e),
	getAnimatableNone: (e) => {
		let t = bf.parse(e);
		return t.alpha = 0, bf.transform(t);
	}
}, xf = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, Sf = /*@__PURE__*/ new RegExp(rf.source), Cf = /*@__PURE__*/ new RegExp(xf.source, "i");
function wf(e) {
	return isNaN(e) && typeof e == "string" && (Sf.test(e) || Cf.test(e));
}
var Tf = "number", Ef = "color", Df = "var", Of = "var(", kf = "${}", Af = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function jf(e) {
	let t = e.toString();
	return Sf.test(t) || Cf.test(t);
}
function Mf(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(Af, (e) => (bf.test(e) ? (r.color.push(a), i.push(Ef), n.push(bf.parse(e))) : e.startsWith(Of) ? (r.var.push(a), i.push(Df), n.push(e)) : (r.number.push(a), i.push(Tf), n.push(parseFloat(e))), ++a, kf)).split(kf),
		indexes: r,
		types: i
	};
}
function Nf(e) {
	return Mf(e).values;
}
function Pf({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === Tf ? qd(r[a]) : e === Ef ? bf.transform(r[a]) : r[a];
		}
		return i;
	};
}
function Ff(e) {
	return Pf(Mf(e));
}
var If = (e) => typeof e == "number" ? 0 : bf.test(e) ? bf.getAnimatableNone(e) : e, Lf = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : If(e);
function Rf(e) {
	let t = Mf(e);
	return Pf(t)(t.values.map((e, n) => Lf(e, t.split[n])));
}
var zf = {
	test: wf,
	parse: Nf,
	createTransformer: Ff,
	getAnimatableNone: Rf
};
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function Bf(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function Vf({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = Bf(s, r, e + 1 / 3), a = Bf(s, r, e), o = Bf(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function Hf(e, t) {
	return (n) => n > 0 ? t : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/number.mjs
var Z = (e, t, n) => e + (t - e) * n, Uf = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, Wf = [
	pf,
	df,
	yf
], Gf = (e) => Wf.find((t) => t.test(e));
function Kf(e) {
	let t = Gf(e);
	if (!t) return `${e}`, !1;
	let n = t.parse(e);
	return t === yf && (n = Vf(n)), n;
}
var qf = (e, t) => {
	let n = Kf(e), r = Kf(t);
	if (!n || !r) return Hf(e, t);
	let i = { ...n };
	return (e) => (i.red = Uf(n.red, r.red, e), i.green = Uf(n.green, r.green, e), i.blue = Uf(n.blue, r.blue, e), i.alpha = Z(n.alpha, r.alpha, e), df.transform(i));
}, Jf = /* @__PURE__ */ new Set(["none", "hidden"]);
function Yf(e, t) {
	return Jf.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function Xf(e, t) {
	return (n) => Z(e, t, n);
}
function Zf(e) {
	return typeof e == "number" ? Xf : typeof e == "string" ? Zd(e) ? Hf : bf.test(e) ? qf : tp : Array.isArray(e) ? Qf : typeof e == "object" ? bf.test(e) ? qf : $f : Hf;
}
function Qf(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => Zf(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function $f(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = Zf(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function ep(e, t) {
	let n = [], r = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < t.values.length; i++) {
		let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
		n[i] = s, r[a]++;
	}
	return n;
}
var tp = (e, t) => {
	let n = zf.createTransformer(t), r = Mf(e), i = Mf(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? Jf.has(e) && !i.values.length || Jf.has(t) && !r.values.length ? Yf(e, t) : hd(Qf(ep(r, i), i.values), n) : (`${e}${t}`, Hf(e, t));
}, Q = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function np(e, t) {
	let n = Q.exec(e);
	if (!n) return;
	let r = Q.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => qd(Z(a, o, e)) + i;
}
function rp(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return Z(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = np(e, t);
		if (n) return n;
	}
	return Zf(e)(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/order.mjs
var ip = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function ap(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1, a = /* @__PURE__ */ new Set(), o = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	};
	function s(t) {
		a.has(t) && (n.add(t), e()), t(o);
	}
	let c = {
		schedule: (e, i = !1, o = !1) => {
			let s = o && r ? t : n;
			return i && a.add(e), s.add(e), e;
		},
		cancel: (e) => {
			n.delete(e), a.delete(e);
		},
		process: (e) => {
			if (o = e, r) {
				i = !0;
				return;
			}
			r = !0;
			let a = t;
			t = n, n = a, t.forEach(s), t.clear(), r = !1, i && (i = !1, c.process(e));
		}
	};
	return c;
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var op = 40;
function sp(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = ip.reduce((e, t) => (e[t] = ap(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = ld.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, op), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: ip.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < ip.length; t++) o[ip[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: $, cancel: cp, steps: lp } = /* @__PURE__ */ sp(typeof requestAnimationFrame < "u" ? requestAnimationFrame : md, !0, Ud), up = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => $.update(t, e),
		stop: () => cp(t),
		now: () => Ud.isProcessing ? Ud.timestamp : Kd.now()
	};
}, dp = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, fp = 2e4;
function pp(e, t = 50, n = fp, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function mp(e, t = 100, n) {
	let r = n({
		...e,
		keyframes: [0, t]
	}), i = Math.min(pp(r), fp);
	return {
		type: "keyframes",
		ease: (e) => r.next(i * e).value / t,
		duration: /* @__PURE__ */ yd(i)
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var hp = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	duration: 800,
	bounce: .3,
	visualDuration: .3,
	restSpeed: {
		granular: .01,
		default: 2
	},
	restDelta: {
		granular: .005,
		default: .5
	},
	minDuration: .01,
	maxDuration: 10,
	minDamping: .05
}, gp = (e) => e < 0 ? 1 / Math.max(1 + e, hp.minDamping) : Math.max(1 - e, hp.minDamping);
function _p(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return bp((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function vp(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var yp = 12;
function bp(e, t, n) {
	let r = n;
	for (let n = 1; n < yp; n++) r -= e(r) / t(r);
	return r;
}
var xp = .001;
function Sp({ duration: e = hp.duration, bounce: t = hp.bounce }) {
	let n, r;
	hp.maxDuration;
	let i = gp(t);
	e = cd(hp.minDuration, hp.maxDuration, /* @__PURE__ */ yd(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = vp(t, i), o = Math.exp(-r);
		return xp - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = vp(t * t, i);
		return (-n(t) + xp > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = bp(n, r, a), s = o * _p(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ vd(e)
	};
}
var Cp = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function wp(e, t) {
	if (Cp(e, t)) return e;
}
function Tp(e) {
	let t = wp(e.stiffness), n = wp(e.damping, !0), r = wp(e.mass), i = {
		...e,
		stiffness: t ?? hp.stiffness,
		damping: n ?? hp.damping,
		mass: r ?? hp.mass,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = gp(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * _p(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, Sp(i)), i.isResolvedFromDuration = !0;
		(!Cp(i.stiffness) || !Cp(i.damping, !0)) && (i.stiffness = hp.stiffness, i.damping = hp.damping);
	}
	return i;
}
function Ep(e = hp.visualDuration, t = hp.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = Tp({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ yd(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ yd(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? hp.restSpeed.granular : hp.restSpeed.default), g.restDelta = n.restDelta || (e ? hp.restDelta.granular : hp.restDelta.default);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = vp(m, p), t = {
			A: 0,
			sinC: 0,
			cosC: 0,
			t: -1,
			env: 0,
			sin: 0,
			cos: 0
		};
		b = () => {
			t.A = (g.velocity + h * g.delta) / e, t.sinC = h * t.A + g.delta * e, t.cosC = h * g.delta - t.A * e;
		};
		let n = (n) => {
			n !== t.t && (t.t = n, t.env = Math.exp(-h * n), t.sin = Math.sin(e * n), t.cos = Math.cos(e * n));
		};
		v = (e) => (n(e), g.target - t.env * (t.A * t.sin + g.delta * t.cos)), y = (e) => (n(e), t.env * (t.sinC * t.sin + t.cosC * t.cos));
	} else if (p === 1) {
		v = (e) => g.target - Math.exp(-m * e) * (g.delta + (g.velocity + m * g.delta) * e);
		let e = { C: 0 };
		b = () => {
			e.C = g.velocity + m * g.delta;
		}, y = (t) => Math.exp(-m * t) * (m * e.C * t - g.velocity);
	} else {
		let e = m * Math.sqrt(p * p - 1), t = h - e, n = h + e, r = d ? Infinity : 300 / e, i = (e, t) => Math.exp(t > r ? -e * r - h * (t - r) : -e * t), a = {
			S: 0,
			F: 0
		};
		b = () => {
			let t = (g.velocity + h * g.delta) / e;
			a.S = (g.delta + t) / 2, a.F = (g.delta - t) / 2;
		}, v = (e) => g.target - a.S * i(t, e) - a.F * i(n, e), y = (e) => t * a.S * i(t, e) + n * a.F * i(n, e);
	}
	b();
	let ee = u && l || null, te = {
		calculatedDuration: ee,
		retarget: (e, t) => {
			g.target = e[e.length - 1], g.delta = g.target - e[0], g.velocity = f(t), n.restSpeed && n.restDelta || _(), te.calculatedDuration = ee, a.done = !1, b();
		},
		velocity: (e) => /* @__PURE__ */ vd(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ vd(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(pp(te), fp), t = dp((t) => te.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return te;
}
Ep.applyToOptions = (e) => {
	let t = mp(e, 100, Ep);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ vd(t.duration), e.type = "keyframes", e;
};
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function Dp({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : _ + t;
	}, b, ee, te = (e) => {
		p(f.value) && (b = e, ee = Ep({
			keyframes: [f.value, m(f.value)],
			velocity: -v(e) / r * 1e3,
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return te(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !ee && b === void 0 && (t = !0, y(e), te(e)), b !== void 0 && e >= b ? ee.next(e - b) : (!t && y(e), f);
		}
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/interpolate.mjs
function Op(e, t, n) {
	let r = [], i = n || ld.mix || rp, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = hd(Array.isArray(t) ? t[n] || md : t, a)), r.push(a);
	}
	return r;
}
function kp(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = Op(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ gd(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(cd(e[0], e[a - 1], t)) : l;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function Ap(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ gd(0, t, r);
		e.push(Z(n, 1, i));
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function jp(e) {
	let t = [0];
	return Ap(t, e.length - 1), t;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function Mp(e, t) {
	return e.map((e) => e * t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function Np(e, t) {
	return e.map(() => t || Ld).splice(0, e.length - 1);
}
function Pp({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ Rd(r) ? r.map(Hd) : Hd(r) || Ld, a = {
		done: !1,
		value: t[0]
	};
	if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
		let [n, r] = t, o = n === r ? void 0 : (ld.mix || rp)(n, r);
		return {
			calculatedDuration: e,
			next: (t) => (a.value = o ? o(i(e > 0 ? cd(0, 1, t / e) : 1)) : r, a.done = t >= e, a)
		};
	}
	let o = kp(Mp(n && n.length === t.length ? n : jp(t), e), t, { ease: Array.isArray(i) ? i : Np(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var Fp = 5;
function Ip(e, t, n) {
	let r = Math.max(t - Fp, 0);
	return /* @__PURE__ */ bd(n - e(r), t - r);
}
function Lp(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : Ip((t) => e.next(t).value, t, e.next(t).value);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var Rp = (e) => e !== null;
function zp(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(Rp), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var Bp = {
	decay: Dp,
	inertia: Dp,
	tween: Pp,
	keyframes: Pp,
	spring: Ep
};
function Vp(e) {
	typeof e.type == "string" && (e.type = Bp[e.type]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function Hp(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: Kd.now(),
		frameTimestamp: Ud.timestamp,
		frameIsProcessing: Ud.isProcessing
	};
}
function Up(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...Hp("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function Wp(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			...Hp("layout-animation-start", e),
			node: t
		});
	} catch {}
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var Gp = class {
	constructor() {
		this.isResolved = !1;
	}
	get finished() {
		return this._finished ||= this.isResolved ? Promise.resolve() : new Promise((e) => {
			this._resolve = e;
		}), this._finished;
	}
	updateFinished() {
		this._finished = this._resolve = void 0, this.isResolved = !1;
	}
	notifyFinished() {
		this.isResolved = !0, this._resolve?.();
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
}, Kp = (e) => e / 100, qp = class extends Gp {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== Kd.now() && this.tick(Kd.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), Up(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		Vp(e);
		let { type: t = Pp, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || Pp;
		s !== Pp && typeof o[0] != "number" && (this.mixKeyframes = hd(Kp, rp(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = pp(c));
		let { calculatedDuration: l } = c;
		this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c;
	}
	updateTime(e) {
		let t = Math.round(e - this.startTime) * this.playbackSpeed;
		this.currentTime = this.holdTime === null ? t : this.holdTime;
	}
	tick(e, t = !1) {
		let { generator: n, totalDuration: r, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o, calculatedDuration: s } = this;
		if (this.startTime === null) return n.next(0);
		let { delay: c = 0, keyframes: l, repeat: u, repeatType: d, repeatDelay: f, type: p, onUpdate: m, finalKeyframe: h } = this.options;
		this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let g = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1), _ = this.playbackSpeed >= 0 ? g < 0 : g > r;
		this.currentTime = Math.max(g, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let v = this.currentTime, y = n;
		if (u) {
			let e = Math.min(this.currentTime, r) / o, t = Math.floor(e), n = e % 1;
			!n && e >= 1 && (n = 1), n === 1 && t--, t = Math.min(t, u + 1), t % 2 && (d === "reverse" ? (n = 1 - n, f && (n -= f / o)) : d === "mirror" && (y = a)), v = cd(0, 1, n) * o;
		}
		let b;
		_ ? (this.delayState.value = l[0], b = this.delayState) : b = y.next(v), i && !_ && (b.value = i(b.value));
		let { done: ee } = b;
		!_ && s !== null && (ee = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let te = this.holdTime === null && (this.state === "finished" || this.state === "running" && ee);
		return te && p !== Dp && (b.value = zp(l, this.options, h, this.speed)), m && m(b.value), te && this.finish(), b;
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
	get duration() {
		return /* @__PURE__ */ yd(this.calculatedDuration);
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ yd(e);
	}
	get time() {
		return /* @__PURE__ */ yd(this.currentTime);
	}
	set time(e) {
		e = /* @__PURE__ */ vd(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return Lp(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(Kd.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ yd(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = up, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? n : this.startTime = n - this.holdTime, this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(Kd.now()), this.holdTime = this.currentTime;
	}
	complete() {
		this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
	}
	finish() {
		this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
	}
	stopDriver() {
		this.driver &&= (this.driver.stop(), void 0);
	}
	sample(e) {
		return this.startTime = 0, this.tick(e, !0);
	}
	attachTimeline(e) {
		return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
	}
}, Jp = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function Yp(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(rf) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!Jp.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Xp = /\b([a-z-]*)\(.*?\)/gu, Zp = {
	...zf,
	getAnimatableNone: (e) => {
		let t = e.match(Xp);
		return t ? t.map(Yp).join(" ") : e;
	}
}, Qp = {
	...zf,
	getAnimatableNone: (e) => {
		let t = zf.parse(e);
		return zf.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, $p = {
	...ef,
	transform: Math.round
}, em = {
	borderWidth: X,
	borderTopWidth: X,
	borderRightWidth: X,
	borderBottomWidth: X,
	borderLeftWidth: X,
	borderRadius: X,
	borderTopLeftRadius: X,
	borderTopRightRadius: X,
	borderBottomRightRadius: X,
	borderBottomLeftRadius: X,
	width: X,
	maxWidth: X,
	height: X,
	maxHeight: X,
	top: X,
	right: X,
	bottom: X,
	left: X,
	inset: X,
	insetBlock: X,
	insetBlockStart: X,
	insetBlockEnd: X,
	insetInline: X,
	insetInlineStart: X,
	insetInlineEnd: X,
	padding: X,
	paddingTop: X,
	paddingRight: X,
	paddingBottom: X,
	paddingLeft: X,
	paddingBlock: X,
	paddingBlockStart: X,
	paddingBlockEnd: X,
	paddingInline: X,
	paddingInlineStart: X,
	paddingInlineEnd: X,
	margin: X,
	marginTop: X,
	marginRight: X,
	marginBottom: X,
	marginLeft: X,
	marginBlock: X,
	marginBlockStart: X,
	marginBlockEnd: X,
	marginInline: X,
	marginInlineStart: X,
	marginInlineEnd: X,
	fontSize: X,
	backgroundPositionX: X,
	backgroundPositionY: X,
	rotate: hf,
	pathRotation: hf,
	rotateX: hf,
	rotateY: hf,
	rotateZ: hf,
	scale: nf,
	scaleX: nf,
	scaleY: nf,
	scaleZ: nf,
	skew: hf,
	skewX: hf,
	skewY: hf,
	distance: X,
	translateX: X,
	translateY: X,
	translateZ: X,
	x: X,
	y: X,
	z: X,
	perspective: X,
	transformPerspective: X,
	opacity: tf,
	originX: vf,
	originY: vf,
	originZ: X,
	zIndex: $p,
	fillOpacity: tf,
	strokeOpacity: tf,
	numOctaves: $p
}, tm = {
	...em,
	color: bf,
	backgroundColor: bf,
	outlineColor: bf,
	fill: bf,
	stroke: bf,
	borderColor: bf,
	borderTopColor: bf,
	borderRightColor: bf,
	borderBottomColor: bf,
	borderLeftColor: bf,
	filter: Zp,
	WebkitFilter: Zp,
	mask: Qp,
	WebkitMask: Qp
}, nm = (e) => tm[e], rm = /*@__PURE__*/ new Set([Zp, Qp]);
function im(e, t) {
	let n = nm(e);
	return rm.has(n) || (n = zf), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function am(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var om = (e) => e * 180 / Math.PI, sm = (e) => lm(om(Math.atan2(e[1], e[0]))), cm = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: sm,
	rotateZ: sm,
	skewX: (e) => om(Math.atan(e[1])),
	skewY: (e) => om(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, lm = (e) => (e %= 360, e < 0 && (e += 360), e), um = sm, dm = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), fm = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), pm = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: dm,
	scaleY: fm,
	scale: (e) => (dm(e) + fm(e)) / 2,
	rotateX: (e) => lm(om(Math.atan2(e[6], e[5]))),
	rotateY: (e) => lm(om(Math.atan2(-e[2], e[0]))),
	rotateZ: um,
	rotate: um,
	skewX: (e) => om(Math.atan(e[4])),
	skewY: (e) => om(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function mm(e) {
	return +!!e.includes("scale");
}
function hm(e, t) {
	if (!e || e === "none") return mm(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = pm, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = cm, i = t;
	}
	if (!i) return mm(t);
	let a = r[t], o = i[1].split(",").map(_m);
	return typeof a == "function" ? a(o) : o[a];
}
var gm = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return hm(n, t);
};
function _m(e) {
	return parseFloat(e.trim());
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var vm = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
], ym = /* @__PURE__ */ new Set([...vm, "pathRotation"]), bm = (e) => e === ef || e === X, xm = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), Sm = vm.filter((e) => !xm.has(e));
function Cm(e) {
	let t = [];
	return Sm.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var wm = /* @__PURE__ */ new Set(["bottom", "right"]);
function Tm(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var Em = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => Tm(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => Tm(e, i, "y", t, n, r),
	top: ({ top: e }) => parseFloat(e),
	left: ({ left: e }) => parseFloat(e),
	bottom: ({ top: e }, t) => {
		let { y: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	right: ({ left: e }, t) => {
		let { x: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	x: ({ transform: e }) => hm(e, "x"),
	y: ({ transform: e }) => hm(e, "y")
};
Em.translateX = Em.x, Em.translateY = Em.y;
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
var Dm = /* @__PURE__ */ new Set(), Om = !1, km = !1, Am = !1;
function jm() {
	if (km) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		Dm.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), wm.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = Cm(e);
			t.length && (r.set(e, t), e.render());
		}), e.forEach((e) => e.measureInitialState()), t.forEach((e) => {
			e.render();
			let t = r.get(e);
			t && t.forEach(([t, n]) => {
				e.getValue(t)?.set(n);
			});
		}), e.forEach((e) => e.measureEndState()), e.forEach((e) => {
			e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
		});
	}
	km = !1, Om = !1, Dm.forEach((e) => e.complete(Am)), Dm.clear();
}
function Mm() {
	Dm.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (km = !0);
	});
}
function Nm() {
	Am = !0, Mm(), jm(), Am = !1;
}
function Pm(e, t, n) {
	if (typeof e == "string") {
		if (ud(e) || fd(e)) return parseFloat(e);
		if (!zf.test(e) && zf.test(n)) return im(t, n);
	}
	return e ?? void 0;
}
var Fm = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (Dm.add(this), Om || (Om = !0, $.read(Mm), $.resolveKeyframes(jm))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = Pm(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		am(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), Dm.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (Dm.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, Im = (e) => e.startsWith("--");
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function Lm(e, t, n) {
	Im(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var Rm = {};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function zm(e, t) {
	let n = /* @__PURE__ */ pd(e);
	return () => Rm[t] ?? n();
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var Bm = /* @__PURE__ */ zm(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Vm = /*@__PURE__*/ zm(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), Hm = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Um = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ Hm([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ Hm([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ Hm([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ Hm([
		.33,
		1.53,
		.69,
		.99
	])
};
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Wm(e, t) {
	if (e) return typeof e == "function" ? Vm() ? dp(e, t) : "ease-out" : /* @__PURE__ */ zd(e) ? Hm(e) : Array.isArray(e) ? e.map((e) => Wm(e, t) || Um.easeOut) : Um[e];
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Gm(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Wm(s, i);
	Array.isArray(d) && (u.easing = d);
	let f = {
		delay: r,
		duration: i,
		easing: Array.isArray(d) ? "linear" : d,
		fill: "both",
		iterations: a + 1,
		direction: o === "reverse" ? "alternate" : "normal"
	};
	return l && (f.pseudoElement = l), e.animate(u, f);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function Km(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function qm({ type: e, ...t }) {
	return Km(e) && Vm() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Jm = class extends Gp {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = qm(e);
		this.animation = Gm(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = zp(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), Lm(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, Up(this, e, c);
	}
	play() {
		this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.finish?.();
	}
	cancel() {
		try {
			this.animation.cancel();
		} catch {}
	}
	stop() {
		if (this.isStopped) return;
		this.isStopped = !0;
		let { state: e } = this;
		e !== "idle" && e !== "finished" && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
	}
	commitStyles() {
		let e = this.options?.element;
		!this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
	}
	get duration() {
		let e = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ yd(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ yd(e);
	}
	get time() {
		return /* @__PURE__ */ yd(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ vd(e), t && this.animation.pause();
	}
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(e) {
		e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
	}
	get state() {
		return this.finishedTime === null ? this.animation.playState : "finished";
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(e) {
		this.manualStartTime = this.animation.startTime = e;
	}
	attachTimeline({ timeline: e, onAttach: t, observe: n }) {
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && Bm() ? (this.animation.timeline = e, t?.(this.animation), md) : n(this);
	}
}, Ym = {
	anticipate: jd,
	backInOut: Ad,
	circInOut: Pd
};
function Xm(e) {
	return e in Ym;
}
function Zm(e) {
	typeof e.ease == "string" && Xm(e.ease) && (e.ease = Ym[e.ease]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
var Qm = 10, $m = class extends Jm {
	constructor(e) {
		Zm(e), Vp(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	updateMotionValue(e) {
		let { motionValue: t, onUpdate: n, onComplete: r, element: i, ...a } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let o = new qp({
			...a,
			autoplay: !1
		}), s = Math.max(Qm, Kd.now() - this.startTime), c = cd(0, Qm, s - Qm), l = o.sample(s).value, { name: u } = this.options;
		i && u && Lm(i, u, l), t.setWithVelocity(o.sample(Math.max(0, s - c)).value, l, c), o.stop();
	}
}, eh = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (zf.test(e) || e === "0") && !e.startsWith("url("));
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function th(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function nh(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = eh(i, t), s = eh(a, t);
	return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1) : th(e) || (n === "spring" || Km(n)) && r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function rh(e) {
	e.duration = 0, e.type = "keyframes";
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var ih = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), ah = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function oh(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && ah.test(e[t])) return !0;
	return !1;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var sh = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]), ch = /*@__PURE__*/ pd(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function lh(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(ih.has(n) || sh.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return ch() && (ih.has(n) || sh.has(n) && oh(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var uh = 40, dh = class extends Gp {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = Kd.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || Fm;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = Kd.now();
		let u = !0;
		nh(e, i, a, o) || (u = !1, (ld.instantAnimations || !s) && l?.(zp(e, n, t)), e[0] = e[e.length - 1], rh(n), n.repeat = 0);
		let d = r ? this.resolvedAt && this.resolvedAt - this.createdAt > uh ? this.resolvedAt : this.createdAt : void 0, { onComplete: f } = n;
		n.startTime ??= d, n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			f?.(), this.notifyFinished();
		};
		let p = u && !c && lh(n), m;
		if (p) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new $m(n);
			} catch {
				m = new qp(n);
			}
		} else m = new qp(n);
		this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), Nm()), this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(e) {
		this.animation.time = e;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(e) {
		this.animation.speed = e;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(e) {
		return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
	}
};
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/calc-child-stagger.mjs
function fh(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/index.mjs
var ph = 30, mh = (e) => !isNaN(parseFloat(e)), hh = { current: void 0 }, gh = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = Kd.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.notifyChange(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = Kd.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = mh(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new _d())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new _d(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		$.read(() => {
			!this.changeSubscriber && !this.events.change?.getSize() && this.stop();
		});
	}
	clearListeners() {
		this.changeSubscriber = void 0;
		for (let e in this.events) this.events[e].clear();
	}
	attach(e, t) {
		this.passiveEffect = e, this.stopPassiveEffect = t;
	}
	set(e) {
		this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
	}
	setWithVelocity(e, t, n) {
		this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
	}
	jump(e, t = !0) {
		this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, t && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
	dirty() {
		this.notifyChange();
	}
	notifyChange() {
		let { current: e, changeSubscriber: t } = this;
		t ? t(e) : this.events.change?.notify(e);
	}
	addDependent(e) {
		this.dependents ||= /* @__PURE__ */ new Set(), this.dependents.add(e);
	}
	removeDependent(e) {
		this.dependents && this.dependents.delete(e);
	}
	get() {
		return hh.current && hh.current.push(this), this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = Kd.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > ph) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, ph);
		return /* @__PURE__ */ bd(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
	}
	start(e) {
		return this.stop(), new Promise((t) => {
			this.hasAnimated = !0;
			let n = !1, r;
			r = e(() => {
				n = !0, this.events.animationComplete?.notify(), this.animation === r && this.clearAnimation(), t();
			}), n || (this.animation = r), this.events.animationStart?.notify();
		});
	}
	stop() {
		this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
	}
	isAnimating() {
		return !!this.animation;
	}
	clearAnimation() {
		this.animation = void 0;
	}
	destroy() {
		this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
};
function _h(e, t) {
	return new gh(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function vh(e, t) {
	if (e?.inherit && t) {
		let { inherit: n, ...r } = e;
		return {
			...t,
			...r
		};
	}
	return e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function yh(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : vh(n, e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var bh = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, xh = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), Sh = {
	type: "keyframes",
	duration: .8
}, Ch = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, wh = (e, { keyframes: t }) => t.length > 2 ? Sh : ym.has(e) ? e.startsWith("scale") ? xh(t[1]) : bh : Ch, Th = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed"
]);
function Eh(e) {
	for (let t in e) if (!Th.has(t)) return !0;
	return !1;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var Dh = (e, t, n, r = {}, i, a) => (o) => {
	let s = yh(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ vd(c);
	let u = {
		keyframes: Array.isArray(n) ? n : [null, n],
		ease: "easeOut",
		velocity: t.getVelocity(),
		...s,
		delay: -l,
		onUpdate: (e) => {
			t.set(e), s.onUpdate && s.onUpdate(e);
		},
		onComplete: () => {
			o(), s.onComplete && s.onComplete();
		},
		name: e,
		motionValue: t,
		element: a ? void 0 : i
	};
	Eh(s) || Object.assign(u, wh(e, u)), u.duration &&= /* @__PURE__ */ vd(u.duration), u.repeatDelay &&= /* @__PURE__ */ vd(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (rh(u), u.delay === 0 && (d = !0)), (ld.instantAnimations || ld.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, rh(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = zp(u.keyframes, s);
		if (e !== void 0) {
			$.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new qp(u) : new dh(u);
}, Oh = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function kh(e) {
	let t = Oh.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function Ah(e, t, n = 1) {
	`${e}`;
	let [r, i] = kh(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return ud(e) ? parseFloat(e) : e;
	}
	return Zd(i) ? Ah(i, t, n + 1) : i;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function jh(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function Mh(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...jh(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function Nh(e, t, n) {
	return Mh(e.getProps(), t, n, e);
}
var Ph = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, Fh = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...vm
]), Ih = (e) => Array.isArray(e);
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/setters.mjs
function Lh(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, _h(n));
}
function Rh(e) {
	return Ih(e) ? e[e.length - 1] || 0 : e;
}
function zh(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = Nh(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) Lh(e, t, Rh(i[t]));
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var Bh = (e) => !!(e && e.getVelocity);
//#endregion
//#region node_modules/motion-dom/dist/es/value/will-change/is.mjs
function Vh(e) {
	return !!(Bh(e) && e.add);
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function Hh(e, t) {
	let n = e.getValue("willChange");
	if (Vh(n)) return n.add(t);
	if (!n && ld.WillChange) {
		let n = new ld.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function Uh(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
var Wh = "data-" + Uh("framerAppearId");
//#endregion
//#region node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function Gh(e) {
	return e.props[Wh];
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var Kh = typeof window < "u";
function qh({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function Jh(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? vh(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && p.animateVisualElement(e, s, a, n, d);
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && qh(f, t)) continue;
		let o = {
			delay: n,
			...yh(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			$.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (Kh && window.MotionHandoffAnimation) {
			let n = Gh(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, $);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		Hh(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start(Dh(t, r, i, m && Fh.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => $.update(() => {
			o && zh(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function Yh(e, t, n = {}) {
	let r = Nh(e, t, Ph(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? Jh(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(Yh(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + fh(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function Xh(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => Yh(e, t, n))) : typeof t == "string" ? Yh(e, t, n) : Promise.all(Jh(e, Nh(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/auto.mjs
var Zh = {
	test: (e) => e === "auto",
	parse: (e) => e
}, Qh = (e) => (t) => t.test(e), $h = [
	ef,
	X,
	Y,
	hf,
	_f,
	gf,
	Zh
], eg = (e) => $h.find(Qh(e));
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function tg(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || fd(e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var ng = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function rg(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !ng.has(t) && jf(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = im(n, i));
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var ig = class extends Fm {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), Zd(r))) {
				let i = Ah(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !Fh.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = eg(r), o = eg(i);
		if ($d(r) !== $d(i) && Em[n]) {
			this.needsMeasurement = !0;
			return;
		}
		if (a !== o) {
			if (bm(a) && bm(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else Em[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || tg(e[t])) && n.push(t);
		n.length && rg(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return Em[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
	}
	measureInitialState() {
		let { element: e, unresolvedKeyframes: t, name: n } = this;
		if (!e || !e.current) return;
		n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), t[0] = this.measuredOrigin;
		let r = t[t.length - 1];
		r !== void 0 && this.motionValue?.jump(r, !1);
	}
	measureEndState() {
		let { element: e, unresolvedKeyframes: t } = this;
		if (!e || !e.current) return;
		this.motionValue?.jump(this.measuredOrigin, !1);
		let n = t.length - 1, r = t[n];
		t[n] = this.measure(), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms?.length && this.removedTransforms.forEach(([t, n]) => {
			e.getValue(t).set(n);
		}), this.resolveNoneKeyframes();
	}
}, ag = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function og(e) {
	return dd(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function sg(e) {
	return dd(e) && "ownerSVGElement" in e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var cg = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
//#endregion
//#region node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function lg(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = document;
		t && (r = t.current);
		let i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
var ug = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, dg = vm.length;
function fg(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < dg; a++) {
		let o = vm[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = cg(s, em[o]);
			if (!c) {
				i = !1;
				let t = ug[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${cg(a, em.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function pg(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (ym.has(e)) {
			o = !0;
			continue;
		}
		if (Yd(e)) {
			i[e] = n;
			continue;
		}
		{
			let t = cg(n, em[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = fg(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var mg = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, hg = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function gg(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? mg : hg;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var _g = [
	"transform",
	"opacity",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function vg(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (pg(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of _g) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && gg(d, i, a, o, !1);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function yg({ top: e, left: t, right: n, bottom: r }) {
	return {
		x: {
			min: t,
			max: n
		},
		y: {
			min: e,
			max: r
		}
	};
}
function bg({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function xg(e, t) {
	if (!t) return e;
	let n = t({
		x: e.left,
		y: e.top
	}), r = t({
		x: e.right,
		y: e.bottom
	});
	return {
		top: n.y,
		left: n.x,
		bottom: r.y,
		right: r.x
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function Sg(e) {
	return e === void 0 || e === 1;
}
function Cg({ scale: e, scaleX: t, scaleY: n }) {
	return !Sg(e) || !Sg(t) || !Sg(n);
}
function wg(e) {
	return Cg(e) || Tg(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function Tg(e) {
	return Eg(e.x) || Eg(e.y);
}
function Eg(e) {
	return e && e !== "0%";
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function Dg(e, t, n) {
	return n + t * (e - n);
}
function Og(e, t, n, r, i) {
	return i !== void 0 && (e = Dg(e, i, r)), Dg(e, n, r) + t;
}
function kg(e, t = 0, n = 1, r, i) {
	e.min = Og(e.min, t, n, r, i), e.max = Og(e.max, t, n, r, i);
}
function Ag(e, { x: t, y: n }) {
	kg(e.x, t.translate, t.scale, t.originPoint), kg(e.y, n.translate, n.scale, n.originPoint);
}
var jg = .999999999999, Mg = 1.0000000000001;
function Ng(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (Pg(e.x, -a.scroll.offset.x), Pg(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, Ag(e, o)), r && wg(a.latestValues) && Lg(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < Mg && t.x > jg && (t.x = 1), t.y < Mg && t.y > jg && (t.y = 1);
}
function Pg(e, t) {
	e.min += t, e.max += t;
}
function Fg(e, t, n, r, i = .5) {
	kg(e, t, n, Z(e.min, e.max, i), r);
}
function Ig(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function Lg(e, t, n) {
	let r = n ?? e;
	Fg(e.x, Ig(t.x, r.x), t.scaleX, t.scale, t.originX), Fg(e.y, Ig(t.y, r.y), t.scaleY, t.scale, t.originY);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function Rg(e, t) {
	return yg(xg(e.getBoundingClientRect(), t));
}
function zg(e, t, n) {
	let r = Rg(e, n), { scroll: i } = t;
	return i && (Pg(r.x, i.offset.x), Pg(r.y, i.offset.y)), r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: Bg, cancel: Vg } = /* @__PURE__ */ sp(queueMicrotask, !1), Hg = {
	x: !1,
	y: !1
};
function Ug() {
	return Hg.x || Hg.y;
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function Wg(e) {
	return e === "x" || e === "y" ? Hg[e] ? null : (Hg[e] = !0, () => {
		Hg[e] = !1;
	}) : Hg.x || Hg.y ? null : (Hg.x = Hg.y = !0, () => {
		Hg.x = Hg.y = !1;
	});
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function Gg(e, t) {
	let n = lg(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		() => r.abort()
	];
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/hover.mjs
function Kg(e) {
	return !(e.pointerType === "touch" || Ug());
}
function qg(e, t, n = {}) {
	let [r, i, a] = Gg(e, n);
	return r.forEach((e) => {
		let n = !1, r = !1, a, o = () => {
			e.removeEventListener("pointerleave", u);
		}, s = (e) => {
			a &&= (a(e), void 0), o();
		}, c = (e) => {
			n = !1, window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), r && (r = !1, s(e));
		}, l = () => {
			n = !0, window.addEventListener("pointerup", c, i), window.addEventListener("pointercancel", c, i);
		}, u = (e) => {
			if (e.pointerType !== "touch") {
				if (n) {
					r = !0;
					return;
				}
				s(e);
			}
		};
		e.addEventListener("pointerenter", (n) => {
			if (!Kg(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Jg = (e, t) => t ? e === t || Jg(e, t.parentElement) : !1, Yg = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, Xg = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function Zg(e) {
	return Xg.has(e.tagName) || e.isContentEditable === !0;
}
var Qg = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function $g(e) {
	return Qg.has(e.tagName) || e.isContentEditable === !0;
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/press/utils/state.mjs
var e_ = /* @__PURE__ */ new WeakSet();
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function t_(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function n_(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var r_ = (e, t) => {
	let n = e.currentTarget;
	if (!n) return;
	let r = t_(() => {
		if (e_.has(n)) return;
		n_(n, "down");
		let e = t_(() => {
			n_(n, "up");
		});
		n.addEventListener("keyup", e, t), n.addEventListener("blur", () => n_(n, "cancel"), t);
	});
	n.addEventListener("keydown", r, t), n.addEventListener("blur", () => n.removeEventListener("keydown", r), t);
};
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/press/index.mjs
function i_(e) {
	return Yg(e) && !Ug();
}
var a_ = /* @__PURE__ */ new WeakSet();
function o_(e, t, n = {}) {
	let [r, i, a] = Gg(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!i_(e) || a_.has(e)) return;
		e_.add(r), n.stopPropagation && a_.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), e_.has(r) && e_.delete(r), i_(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Jg(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), og(e) && (e.addEventListener("focus", (e) => r_(e, i)), !Zg(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
//#endregion
//#region node_modules/motion-dom/dist/es/resize/handle-element.mjs
var s_ = /* @__PURE__ */ new WeakMap(), c_, l_ = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : sg(r) && "getBBox" in r ? r.getBBox()[t] : r[n], u_ = /*@__PURE__*/ l_("inline", "width", "offsetWidth"), d_ = /*@__PURE__*/ l_("block", "height", "offsetHeight");
function f_({ target: e, borderBoxSize: t }) {
	s_.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return u_(e, t);
			},
			get height() {
				return d_(e, t);
			}
		});
	});
}
function p_(e) {
	e.forEach(f_);
}
function m_() {
	typeof ResizeObserver < "u" && (c_ = new ResizeObserver(p_));
}
function h_(e, t) {
	c_ || m_();
	let n = lg(e);
	return n.forEach((e) => {
		let n = s_.get(e);
		n || (n = /* @__PURE__ */ new Set(), s_.set(e, n)), n.add(t), c_?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = s_.get(e);
			n?.delete(t), n?.size || c_?.unobserve(e);
		});
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/resize/handle-window.mjs
var g_ = /* @__PURE__ */ new Set(), __;
function v_() {
	__ = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		g_.forEach((t) => t(e));
	}, window.addEventListener("resize", __);
}
function y_(e) {
	return g_.add(e), __ || v_(), () => {
		g_.delete(e), !g_.size && typeof __ == "function" && (window.removeEventListener("resize", __), __ = void 0);
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/resize/index.mjs
function b_(e, t) {
	return typeof e == "function" ? y_(e) : h_(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/stats/buffer.mjs
var x_ = {
	value: null,
	addProjectionMetrics: null
};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function S_(e) {
	return sg(e) && e.tagName === "svg";
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var C_ = (e) => typeof e == "number" ? e : parseFloat(e), w_ = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), T_ = () => ({
	x: w_(),
	y: w_()
}), E_ = () => ({
	min: 0,
	max: 0
}), D_ = () => ({
	x: E_(),
	y: E_()
}), O_ = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function k_(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function A_(e) {
	return typeof e == "string" || Array.isArray(e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var j_ = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], M_ = ["initial", ...j_];
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function N_(e) {
	if (k_(e.animate)) return !0;
	for (let t = 0; t < M_.length; t++) if (A_(e[M_[t]])) return !0;
	return !1;
}
function P_(e) {
	return !!(N_(e) || e.variants);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function F_(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (Bh(i)) e.addValue(r, i);
		else if (Bh(a)) e.addValue(r, _h(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, _h(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var I_ = { current: null }, L_ = { current: !1 }, R_ = typeof window < "u";
function z_() {
	if (L_.current = !0, R_) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => I_.current = e.matches;
			e.addEventListener("change", t), t();
		} else I_.current = !1;
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/VisualElement.mjs
var B_ = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], V_ = {};
function H_(e) {
	V_ = e;
}
function U_() {
	return V_;
}
var W_ = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Fm, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = Kd.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, $.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = N_(t), this.isVariantNode = P_(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && Bh(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, O_.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (L_.current || z_(), this.shouldReduceMotion = I_.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), cp(this.notifyUpdate), cp(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
		for (let e in this.events) this.events[e].clear();
		for (let e in this.features) {
			let t = this.features[e];
			t && (t.unmount(), t.isMounted = !1);
		}
		this.current = null;
	}
	addChild(e) {
		this.children.add(e), this.enteringChildren ??= /* @__PURE__ */ new Set(), this.enteringChildren.add(e);
	}
	removeChild(e) {
		this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
	}
	bindToMotionValue(e, t) {
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && ih.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new Jm({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ vd(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = ym.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && $.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
		}), i;
		typeof window < "u" && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)), this.valueSubscriptions.set(e, () => {
			r(), i && i();
		});
	}
	sortNodePosition(e) {
		return !this.current || !e.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
	}
	updateFeatures() {
		let e = "animation";
		for (e in V_) {
			let t = V_[e];
			if (!t) continue;
			let { isEnabled: n, Feature: r } = t;
			if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)), this.features[e]) {
				let t = this.features[e];
				t.isMounted ? t.update() : (t.mount(), t.isMounted = !0);
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : D_();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		(e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < B_.length; t++) {
			let n = B_[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = F_(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
	}
	getProps() {
		return this.props;
	}
	getVariant(e) {
		return this.props.variants ? this.props.variants[e] : void 0;
	}
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	addValue(e, t) {
		let n = this.values.get(e);
		if (t !== n) {
			n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t);
			let r = t.get();
			r !== void 0 && (this.latestValues[e] = r);
		}
	}
	removeValue(e) {
		this.values.delete(e);
		let t = this.valueSubscriptions.get(e);
		t && (t(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
	}
	hasValue(e) {
		return this.values.has(e);
	}
	getValue(e, t) {
		if (this.props.values && this.props.values[e]) return this.props.values[e];
		let n = this.values.get(e);
		return n === void 0 && t !== void 0 && (n = _h(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (ud(n) || fd(n)) ? n = parseFloat(n) : typeof n != "number" && !zf.test(n) && zf.test(t) && (n = im(e, t)), this.setBaseTarget(e, Bh(n) ? n.get() : n)), Bh(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = new _d()), this.events[e].add(t);
	}
	notify(e, ...t) {
		this.events[e] && this.events[e].notify(...t);
	}
	scheduleRenderMicrotask() {
		Bg.render(this.render);
	}
}, G_ = class extends W_ {
	constructor() {
		super(...arguments), this.KeyframeResolver = ig;
	}
	sortInstanceNodePosition(e, t) {
		return e.compareDocumentPosition(t) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(e, t) {
		let n = e.style;
		return n ? n[t] : void 0;
	}
	removeValueFromRenderState(e, { vars: t, style: n }) {
		delete t[e], delete n[e];
	}
	handleChildMotionValue() {
		this.childSubscription && (this.childSubscription(), delete this.childSubscription);
		let { children: e } = this.props;
		Bh(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
}, K_ = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
};
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function q_(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var J_ = {};
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Y_(e, { layout: t, layoutId: n }) {
	return ym.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!J_[e] || e === "opacity");
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function X_(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (Bh(r[t]) || i && Bh(i[t]) || Y_(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function Z_(e) {
	return window.getComputedStyle(e);
}
var Q_ = class extends G_ {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = q_;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (ym.has(t)) return this.projection?.isProjecting ? mm(t) : gm(e, t);
		{
			let n = Z_(e), r = (Yd(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return Rg(e, t);
	}
	build(e, t, n) {
		pg(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return X_(e, t, n);
	}
}, $_ = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]), ev = (e) => typeof e == "string" && e.toLowerCase() === "svg";
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function tv(e, t, n, r) {
	q_(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute($_.has(n) ? n : Uh(n), t.attrs[n]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function nv(e, t, n) {
	let r = X_(e, t, n);
	for (let n in e) if (Bh(e[n]) || Bh(t[n])) {
		let t = vm.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var rv = class extends G_ {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = D_;
	}
	getBaseTargetFromProps(e, t) {
		return ym.has(t) ? super.getBaseTargetFromProps(e, t) ?? mm(t) : e[t];
	}
	getDefaultValue(e) {
		return ym.has(e) ? this.latestValues[e] ?? mm(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (ym.has(t)) {
			let e = nm(t);
			return e && e.default || 0;
		}
		if (_g.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = $_.has(t) ? t : Uh(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return nv(e, t, n);
	}
	build(e, t, n) {
		vg(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		tv(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = ev(e.tagName), super.mount(e);
	}
};
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function iv(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var av = [...j_].reverse();
function ov(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => Xh(e, t, n))), n = cv(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f = {}, p = Infinity, m = e;
		do
			m = m.props.inherit !== !1 && m.parent;
		while (m && !m.isControllingVariants);
		if (av.forEach((t, r) => {
			let i = n[t], h = o[t], g = m && m.props[t], _ = h === void 0 ? A_(g) || g === !1 ? g : void 0 : h, v = A_(_), y = t === a ? i.isActive : null;
			y === !1 && (p = r);
			let b = v && h === void 0 && !(l && c);
			if (i.protectedKeys = { ...f }, !i.isActive && y === null || !_ && !i.prevProp || k_(_) || typeof _ == "boolean") return;
			if (t === "exit" && i.isActive && y !== !0) {
				f = {
					...f,
					...i.prevResolvedValues
				};
				return;
			}
			let ee = sv(i.prevProp, _), te = ee || v && (y && !b || r > p), ne = !1, x = Array.isArray(_) ? _ : [_], S = {};
			if (y !== !1) for (let n of x) {
				let { transition: r, transitionEnd: i, ...a } = Nh(e, n, Ph(e, t)) || {};
				S = {
					...S,
					...a,
					...i
				};
			}
			let { prevResolvedValues: re } = i;
			for (let t in {
				...re,
				...S
			}) {
				if (t in f) continue;
				let n = S[t], r = re[t], a = Array.isArray(n) && Array.isArray(r) ? !iv(n, r) || ee : n !== r;
				if (a && n == null) d.add(t);
				else if (a || n !== void 0 && d.has(t)) {
					te = !0, d.delete(t) && (ne = !0), i.needsAnimating[t] = !0;
					let n = e.getValue(t);
					n && (n.liveStyle = !1);
				} else i.protectedKeys[t] = !0;
			}
			if (i.prevProp = _, i.prevResolvedValues = S, i.isActive && (f = {
				...f,
				...S
			}), te && (!(b && ee) || ne)) for (let n of x) {
				let r = { type: t };
				if (typeof n == "string" && l && c && s?.enteringChildren) {
					let t = Nh(s, n)?.transition?.delayChildren;
					r.delay = fh(s.enteringChildren, e, t);
				}
				u.push({
					animation: n,
					options: r
				});
			}
		}), d.size) {
			let { initial: t } = o, n = {}, r = typeof t != "boolean" && Nh(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
			r && r.transition && (n.transition = r.transition), d.forEach((i) => {
				let a = e.getValue(i);
				a && (a.liveStyle = !0);
				let s = r && !Array.isArray(t) ? r[i] : void 0, c = e.getBaseTargetFromProps(o, i);
				n[i] = (s === void 0 ? c !== void 0 && !Bh(c) ? c : e.initialValues[i] === void 0 ? e.baseTarget[i] : void 0 : s) ?? null;
			}), u.push({ animation: n });
		}
		let h = l && e.blockInitialAnimation || r && !c && (o.initial === !1 || o.initial === o.animate);
		return r = i = !1, !h && u.length ? t(u) : Promise.resolve();
	}
	function o(t, r) {
		if (n[t].isActive === r) return Promise.resolve();
		e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)), n[t].isActive = r;
		let i = a(t);
		for (let e in n) n[e].protectedKeys = {};
		return i;
	}
	return {
		animateChanges: a,
		setActive: o,
		setAnimateFunction: (n) => {
			t = n(e);
		},
		getState: () => n,
		reset: () => {
			n = cv(), i = !0;
		}
	};
}
function sv(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !iv(t, e) : !1;
}
function cv() {
	let e = {};
	for (let t of j_) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
	return e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function lv(e, t) {
	e.min = t.min, e.max = t.max;
}
function uv(e, t) {
	lv(e.x, t.x), lv(e.y, t.y);
}
function dv(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var fv = .9999, pv = 1.0001, mv = -.01, hv = .01;
function gv(e) {
	return e.max - e.min;
}
function _v(e, t, n) {
	return Math.abs(e - t) <= n;
}
function vv(e, t, n, r = .5) {
	e.origin = r, e.originPoint = Z(t.min, t.max, e.origin), e.scale = gv(n) / gv(t), e.translate = Z(n.min, n.max, e.origin) - e.originPoint, (e.scale >= fv && e.scale <= pv || isNaN(e.scale)) && (e.scale = 1), (e.translate >= mv && e.translate <= hv || isNaN(e.translate)) && (e.translate = 0);
}
function yv(e, t, n, r) {
	vv(e.x, t.x, n.x, r ? r.originX : void 0), vv(e.y, t.y, n.y, r ? r.originY : void 0);
}
function bv(e, t, n, r = 0) {
	e.min = (r ? Z(n.min, n.max, r) : n.min) + t.min, e.max = e.min + gv(t);
}
function xv(e, t, n, r) {
	bv(e.x, t.x, n.x, r?.x), bv(e.y, t.y, n.y, r?.y);
}
function Sv(e, t, n, r = 0) {
	let i = r ? Z(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + gv(t);
}
function Cv(e, t, n, r) {
	Sv(e.x, t.x, n.x, r?.x), Sv(e.y, t.y, n.y, r?.y);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function wv(e, t, n, r, i) {
	return e -= t, e = Dg(e, 1 / n, r), i !== void 0 && (e = Dg(e, 1 / i, r)), e;
}
function Tv(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (Y.test(t) && (t = parseFloat(t), t = Z(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = Z(a.min, a.max, r);
	e === a && (s -= t), e.min = wv(e.min, t, n, s, i), e.max = wv(e.max, t, n, s, i);
}
function Ev(e, t, [n, r, i], a, o) {
	Tv(e, t[n], t[r], t[i], t.scale, a, o);
}
var Dv = [
	"x",
	"scaleX",
	"originX"
], Ov = [
	"y",
	"scaleY",
	"originY"
];
function kv(e, t, n, r) {
	Ev(e.x, t, Dv, n ? n.x : void 0, r ? r.x : void 0), Ev(e.y, t, Ov, n ? n.y : void 0, r ? r.y : void 0);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function Av(e) {
	return e.translate === 0 && e.scale === 1;
}
function jv(e) {
	return Av(e.x) && Av(e.y);
}
function Mv(e, t) {
	return e.min === t.min && e.max === t.max;
}
function Nv(e, t) {
	return Mv(e.x, t.x) && Mv(e.y, t.y);
}
function Pv(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Fv(e, t) {
	return Pv(e.x, t.x) && Pv(e.y, t.y);
}
function Iv(e) {
	return gv(e.x) / gv(e.y);
}
function Lv(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function Rv(e) {
	return [e("x"), e("y")];
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function zv(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var Bv = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (X.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${zv(e, t.target.x)}% ${zv(e, t.target.y)}%`;
} }, Vv = { correct: (e, { treeScale: t, projectionDelta: n }) => {
	let r = e, i = zf.parse(e);
	if (i.length > 5) return r;
	let a = zf.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
	i[0 + o] /= s, i[1 + o] /= c;
	let l = Z(s, c, .5);
	return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
} };
//#endregion
//#region node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function Hv(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
		let { transformPerspective: e, rotate: t, pathRotation: i, rotateX: a, rotateY: o, skewX: s, skewY: c } = n;
		e && (r = `perspective(${e}px) ${r}`), t && (r += `rotate(${t}deg) `), i && (r += `rotate(${i}deg) `), a && (r += `rotateX(${a}deg) `), o && (r += `rotateY(${o}deg) `), s && (r += `skewX(${s}deg) `), c && (r += `skewY(${c}deg) `);
	}
	let s = e.x.scale * t.x, c = e.y.scale * t.y;
	return (s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || "none";
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/animation/mix-values.mjs
var Uv = ag.length, Wv = (e) => typeof e == "number" || X.test(e);
function Gv(e, t, n, r, i, a) {
	i ? (e.opacity = Z(0, n.opacity ?? 1, qv(r)), e.opacityExit = Z(t.opacity ?? 1, 0, Jv(r))) : a && (e.opacity = Z(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < Uv; i++) {
		let a = ag[i], o = Kv(t, a), s = Kv(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || Wv(o) === Wv(s) ? (e[a] = Math.max(Z(C_(o), C_(s), r), 0), (Y.test(s) || Y.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	(t.rotate || n.rotate) && (e.rotate = Z(t.rotate || 0, n.rotate || 0, r));
}
function Kv(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var qv = /*@__PURE__*/ Yv(0, .5, Nd), Jv = /*@__PURE__*/ Yv(.5, .95, md);
function Yv(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ gd(e, t, r));
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function Xv(e, t, n) {
	let r = Bh(e) ? e : _h(e);
	return r.start(Dh("", r, t, n)), r.animation;
}
//#endregion
//#region node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function Zv(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var Qv = (e, t) => e.depth - t.depth, $v = class {
	constructor() {
		this.children = [], this.isDirty = !1;
	}
	add(e) {
		od(this.children, e), this.isDirty = !0;
	}
	remove(e) {
		sd(this.children, e), this.isDirty = !0;
	}
	forEach(e) {
		this.isDirty && this.children.sort(Qv), this.isDirty = !1, this.children.forEach(e);
	}
};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/delay.mjs
function ey(e, t) {
	let n = Kd.now(), r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (cp(r), e(a - t));
	};
	return $.setup(r, !0), () => cp(r);
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function ty(e) {
	return Bh(e) ? e.get() : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var ny = class {
	constructor() {
		this.members = [];
	}
	add(e) {
		od(this.members, e);
		for (let t = this.members.length - 1; t >= 0; t--) {
			let n = this.members[t];
			if (n === e || n === this.lead || n === this.prevLead) continue;
			let r = n.instance;
			(!r || r.isConnected === !1) && !n.snapshot && (sd(this.members, n), n.unmount());
		}
		e.scheduleRender();
	}
	remove(e) {
		if (sd(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
			let e = this.members[this.members.length - 1];
			e && this.promote(e);
		}
	}
	relegate(e) {
		for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
			let e = this.members[t];
			if (e.isPresent !== !1 && e.instance?.isConnected !== !1) return this.promote(e), !0;
		}
		return !1;
	}
	promote(e, t) {
		let n = this.lead;
		if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
			n.updateSnapshot(), e.scheduleRender();
			let { layoutDependency: r } = n.options, { layoutDependency: i } = e.options;
			(r === void 0 || r !== i) && (e.resumeFrom = n, t && (n.preserveOpacity = !0), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root?.isUpdating && (e.isLayoutDirty = !0)), e.options.crossfade === !1 && n.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((e) => {
			e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.();
		});
	}
	scheduleRender() {
		this.members.forEach((e) => e.instance && e.scheduleRender(!1));
	}
	removeLeadSnapshot() {
		this.lead?.snapshot && (this.lead.snapshot = void 0);
	}
}, ry = {
	borderRadius: {
		...Bv,
		applyTo: [...ag]
	},
	borderTopLeftRadius: Bv,
	borderTopRightRadius: Bv,
	borderBottomLeftRadius: Bv,
	borderBottomRightRadius: Bv,
	boxShadow: Vv
}, iy = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
};
//#endregion
//#region node_modules/motion-dom/dist/es/projection/node/create-projection-node.mjs
Object.assign(J_, {
	...ry,
	...J_
});
var ay = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, oy = [
	"",
	"X",
	"Y",
	"Z"
], sy = 1e3, cy = 0;
function ly(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
function uy(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = Gh(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", $, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && uy(r);
}
function dy({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return class {
		constructor(e = {}, n = t?.()) {
			this.id = cy++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, x_.value && (ay.nodes = ay.calculatedTargetDeltas = ay.calculatedProjections = 0), this.nodes.forEach(my), this.nodes.forEach(wy), this.nodes.forEach(Ty), this.nodes.forEach(hy), x_.addProjectionMetrics && x_.addProjectionMetrics(ay);
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new $v());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new _d()), this.eventHandlers.get(e).add(t);
		}
		notifyListeners(e, ...t) {
			let n = this.eventHandlers.get(e);
			n && n.notify(...t);
		}
		hasListeners(e) {
			return this.eventHandlers.has(e);
		}
		mount(t) {
			if (this.instance) return;
			this.isSVG = sg(t) && !S_(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				$.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = ey(i, 250), iy.hasAnimatedSinceResize && (iy.hasAnimatedSinceResize = !1, this.nodes.forEach(Cy)));
				});
			}
			n && this.root.registerSharedNode(n, this), this.options.animate !== !1 && i && (n || r) && this.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: n, layout: r }) => {
				if (this.isTreeAnimationBlocked()) {
					this.target = void 0, this.relativeTarget = void 0;
					return;
				}
				let a = this.options.transition || i.getDefaultTransition() || My, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = i.getProps(), c = !this.targetLayout || !Fv(this.targetLayout, r), l = !t && n;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...yh(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(i.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || Cy(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = r;
			});
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), cp(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = !0;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = !1;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		isTreeAnimationBlocked() {
			return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
		}
		startUpdate() {
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Ey), this.animationId++);
		}
		getTransformTemplate() {
			let { visualElement: e } = this.options;
			return e && e.getProps().transformTemplate;
		}
		willUpdate(e = !0) {
			if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return;
			}
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && uy(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(vy), this.nodes.forEach(_y);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(yy);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(by), this.nodes.forEach(xy), this.nodes.forEach(Sy), this.nodes.forEach(fy), this.nodes.forEach(py)) : this.nodes.forEach(yy), this.clearAllSnapshots();
			let e = Kd.now();
			Ud.delta = cd(0, 1e3 / 60, e - Ud.timestamp), Ud.timestamp = e, Ud.isProcessing = !0, lp.update.process(Ud), lp.preRender.process(Ud), lp.render.process(Ud), Ud.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, Bg.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(gy), this.sharedNodes.forEach(Dy);
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, $.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			$.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !gv(this.snapshot.measuredBox.x) && !gv(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= D_(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
			let { visualElement: t } = this.options;
			t && t.notify("LayoutMeasure", this.layout.layoutBox, e ? e.layoutBox : void 0);
		}
		updateScroll(e = "measure") {
			let t = !!(this.options.layoutScroll && this.instance);
			if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e && (t = !1), t && this.instance) {
				let t = r(this.instance);
				this.scroll = {
					animationId: this.root.animationId,
					phase: e,
					isRoot: t,
					offset: n(this.instance),
					wasRoot: this.scroll ? this.scroll.isRoot : t
				};
			}
		}
		resetTransform() {
			if (!i) return;
			let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, t = this.projectionDelta && !jv(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || wg(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), Iy(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return D_();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(Ry))) {
				let { scroll: e } = this.root;
				e && (Pg(t.x, e.offset.x), Pg(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = D_();
			if (uv(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && uv(t, e), Pg(t.x, i.offset.x), Pg(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n) {
			let r = n || D_();
			uv(r, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (Pg(r.x, -n.scroll.offset.x), Pg(r.y, -n.scroll.offset.y)), wg(n.latestValues) && Lg(r, n.latestValues, n.layout?.layoutBox);
			}
			return wg(this.latestValues) && Lg(r, this.latestValues, this.layout?.layoutBox), r;
		}
		removeTransform(e) {
			let t = D_();
			uv(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!wg(n.latestValues)) continue;
				let r;
				n.instance && (Cg(n.latestValues) && n.updateSnapshot(), r = D_(), uv(r, n.measurePageBox())), kv(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return wg(this.latestValues) && kv(t, this.latestValues), t;
		}
		setTargetDelta(e) {
			this.targetDelta = e, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
		}
		setOptions(e) {
			this.options = {
				...this.options,
				...e,
				crossfade: e.crossfade === void 0 || e.crossfade
			};
		}
		clearMeasurements() {
			this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
		}
		forceRelativeParentToResolveTarget() {
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Ud.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = Ud.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = D_(), this.targetWithTransforms = D_()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), xv(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : uv(this.target, this.layout.layoutBox), Ag(this.target, this.targetDelta)) : uv(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), x_.value && ay.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || Cg(this.parent.latestValues) || Tg(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = D_(), this.relativeTargetOrigin = D_(), Cv(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), uv(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === Ud.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			uv(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			Ng(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = D_());
			let { target: s } = e;
			if (!s) {
				this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
				return;
			}
			!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (dv(this.prevProjectionDelta.x, this.projectionDelta.x), dv(this.prevProjectionDelta.y, this.projectionDelta.y)), yv(this.projectionDelta, this.layoutCorrected, s, this.latestValues), (this.treeScale.x !== a || this.treeScale.y !== o || !Lv(this.projectionDelta.x, this.prevProjectionDelta.x) || !Lv(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), x_.value && ay.calculatedProjections++;
		}
		hide() {
			this.isVisible = !1;
		}
		show() {
			this.isVisible = !0;
		}
		scheduleRender(e = !0) {
			if (this.options.visualElement?.scheduleRender(), e) {
				let e = this.getStack();
				e && e.scheduleRender();
			}
			this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = T_(), this.projectionDelta = T_(), this.projectionDeltaWithTransform = T_();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = T_();
			(!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = D_(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(jy));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = Z(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = Z(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (Oy(o.x, e.x, n), Oy(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Cv(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), Ay(this.relativeTarget, this.relativeTargetOrigin, s, n), f && Nv(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= D_(), uv(f, this.relativeTarget)), c && (this.animationValues = a, Gv(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (cp(this.pendingAnimation), void 0), this.pendingAnimation = $.update(() => {
				iy.hasAnimatedSinceResize = !0, this.motionValue ||= _h(0), this.motionValue.jump(0, !1), this.currentAnimation = Xv(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), Wp(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(sy), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && Ly(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					i = this.target || D_();
					let t = gv(this.layout.layoutBox.x);
					i.x.min = e.target.x.min, i.x.max = i.x.min + t;
					let n = gv(this.layout.layoutBox.y);
					i.y.min = e.target.y.min, i.y.max = i.y.min + n;
				}
				uv(t, i), Lg(t, r), yv(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new ny()), this.sharedNodes.get(e).add(t);
			let n = t.options.initialPromotionConfig;
			t.promote({
				transition: n ? n.transition : void 0,
				preserveFollowOpacity: n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0
			});
		}
		isLead() {
			let e = this.getStack();
			return !e || e.lead === this;
		}
		getLead() {
			let { layoutId: e } = this.options;
			return e && this.getStack()?.lead || this;
		}
		getPrevLead() {
			let { layoutId: e } = this.options;
			return e ? this.getStack()?.prevLead : void 0;
		}
		getStack() {
			let { layoutId: e } = this.options;
			if (e) return this.root.sharedNodes.get(e);
		}
		promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
			let r = this.getStack();
			r && r.promote(this, n), e && (this.projectionDelta = void 0, this.needsReset = !0), t && this.setOptions({ transition: t });
		}
		relegate() {
			let e = this.getStack();
			return e ? e.relegate(this) : !1;
		}
		resetSkewAndRotation() {
			let { visualElement: e } = this.options;
			if (!e) return;
			let t = !1, { latestValues: n } = e;
			if ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) && (t = !0), !t) return;
			let r = {};
			n.z && ly("z", e, r, this.animationValues);
			for (let t = 0; t < oy.length; t++) ly(`rotate${oy[t]}`, e, r, this.animationValues), ly(`skew${oy[t]}`, e, r, this.animationValues);
			e.render();
			for (let t in r) e.setStaticValue(t, r[t]), this.animationValues && (this.animationValues[t] = r[t]);
			e.scheduleRender();
		}
		applyProjectionStyles(e, t) {
			if (!this.instance || this.isSVG) return;
			if (!this.isVisible) {
				e.visibility = "hidden";
				return;
			}
			let n = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = ty(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = ty(t?.pointerEvents) || ""), this.hasProjected && !wg(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = Hv(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in J_) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = J_[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? ty(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(_y), this.root.sharedNodes.clear();
		}
	};
}
function fy(e) {
	e.updateLayout();
}
function py(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") Rv((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = gv(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			lv(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else Ly(i, t.layoutBox, n) && Rv((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = gv(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = T_();
		yv(o, n, t.layoutBox);
		let s = T_();
		a ? yv(s, e.applyTransform(r, !0), t.measuredBox) : yv(s, n, t.layoutBox);
		let c = !jv(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = D_();
					Cv(s, t.layoutBox, i.layoutBox, o);
					let c = D_();
					Cv(c, n, a.layoutBox, o), Fv(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
				}
			}
		}
		e.notifyListeners("didUpdate", {
			layout: n,
			snapshot: t,
			delta: s,
			layoutDelta: o,
			hasLayoutChanged: c,
			hasRelativeLayoutChanged: l
		});
	} else if (e.isLead()) {
		let { onExitComplete: t } = e.options;
		t && t();
	}
	e.options.transition = void 0;
}
function my(e) {
	x_.value && ay.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function hy(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function gy(e) {
	e.clearSnapshot();
}
function _y(e) {
	e.clearMeasurements();
}
function vy(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function yy(e) {
	e.isLayoutDirty = !1;
}
function by(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.layout, e.isLayoutDirty = !0);
}
function xy(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function Sy(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Cy(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function wy(e) {
	e.resolveTargetDelta();
}
function Ty(e) {
	e.calcProjection();
}
function Ey(e) {
	e.resetSkewAndRotation();
}
function Dy(e) {
	e.removeLeadSnapshot();
}
function Oy(e, t, n) {
	e.translate = Z(t.translate, 0, n), e.scale = Z(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function ky(e, t, n, r) {
	e.min = Z(t.min, n.min, r), e.max = Z(t.max, n.max, r);
}
function Ay(e, t, n, r) {
	ky(e.x, t.x, n.x, r), ky(e.y, t.y, n.y, r);
}
function jy(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var My = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, Ny = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Py = Ny("applewebkit/") && !Ny("chrome/") ? Math.round : md;
function Fy(e) {
	e.min = Py(e.min), e.max = Py(e.max);
}
function Iy(e) {
	Fy(e.x), Fy(e.y);
}
function Ly(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !_v(Iv(t), Iv(n), .2);
}
function Ry(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var zy = dy({
	attachResizeListener: (e, t) => Zv(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), By = { current: void 0 }, Vy = dy({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!By.current) {
			let e = new zy({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), By.current = e;
		}
		return By.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), Hy = (0, _.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
//#endregion
//#region node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function Uy(e = !0) {
	let t = (0, _.useContext)(ad);
	if (t === null) return [!0, null];
	let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, _.useId)();
	(0, _.useEffect)(() => {
		if (e) return i(a);
	}, [e]);
	let o = (0, _.useCallback)(() => e && r && r(a), [
		a,
		r,
		e
	]);
	return !n && r ? [!1, o] : [!0];
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/LazyContext.mjs
var Wy = (0, _.createContext)({ strict: !1 }), Gy = {
	animation: [
		"animate",
		"variants",
		"whileHover",
		"whileTap",
		"exit",
		"whileInView",
		"whileFocus",
		"whileDrag"
	],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: [
		"whileHover",
		"onHoverStart",
		"onHoverEnd"
	],
	tap: [
		"whileTap",
		"onTap",
		"onTapStart",
		"onTapCancel"
	],
	pan: [
		"onPan",
		"onPanStart",
		"onPanSessionStart",
		"onPanEnd"
	],
	inView: [
		"whileInView",
		"onViewportEnter",
		"onViewportLeave"
	],
	layout: ["layout", "layoutId"]
}, Ky = !1;
function qy() {
	if (Ky) return;
	let e = {};
	for (let t in Gy) e[t] = { isEnabled: (e) => Gy[t].some((t) => !!e[t]) };
	H_(e), Ky = !0;
}
function Jy() {
	return qy(), U_();
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function Yy(e) {
	let t = Jy();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	H_(t);
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var Xy = /* @__PURE__ */ (0, _.createContext)({});
//#endregion
//#region node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function Zy(e, t) {
	if (N_(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || A_(t) ? t : void 0,
			animate: A_(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function Qy(e) {
	let { initial: t, animate: n } = Zy(e, (0, _.useContext)(Xy));
	return (0, _.useMemo)(() => ({
		initial: t,
		animate: n
	}), [$y(t), $y(n)]);
}
function $y(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var eb = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
//#endregion
//#region node_modules/framer-motion/dist/es/render/html/use-props.mjs
function tb(e, t, n) {
	for (let r in t) !Bh(t[r]) && !Y_(r, n) && (e[r] = t[r]);
}
function nb({ transformTemplate: e }, t) {
	return (0, _.useMemo)(() => {
		let n = eb();
		return pg(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function rb(e, t) {
	let n = e.style || {}, r = {};
	return tb(r, n, e), Object.assign(r, nb(e, t)), r;
}
function ib(e, t) {
	let n = {}, r = rb(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var ab = () => ({
	...eb(),
	attrs: {}
});
//#endregion
//#region node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function ob(e, t, n, r) {
	let i = (0, _.useMemo)(() => {
		let n = ab();
		return vg(n, t, ev(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		tb(t, e.style, e), i.style = {
			...t,
			...i.style
		};
	}
	return i;
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var sb = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function cb(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || sb.has(e);
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function lb(e, t) {
	return e.startsWith("on") ? !cb(e) : t?.(e) ?? !cb(e);
}
function ub(e, t, n, r) {
	let i = {};
	for (let a in e) (a !== "values" || typeof e.values != "object") && (Bh(e[a]) || (lb(a, r) || n === !0 && cb(a) || !t && !cb(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]));
	return i;
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var db = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"switch",
	"symbol",
	"svg",
	"text",
	"tspan",
	"use",
	"view"
];
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function fb(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(db.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function pb(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? fb(e) ? ob : ib)(t, r, i, e), l = ub(t, typeof e == "string", a, s), u = e === _.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, _.useMemo)(() => Bh(d) ? d.get() : d, [d]);
	return (0, _.createElement)(e, {
		...u,
		children: f
	});
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function mb({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: hb(n, r, i, e),
		renderState: t()
	};
}
function hb(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = ty(a[e]);
	let { initial: o, animate: s } = e, c = N_(e), l = P_(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !k_(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = Mh(e, t[n]);
			if (r) {
				let { transitionEnd: e, transition: t, ...n } = r;
				for (let e in n) {
					let t = n[e];
					if (Array.isArray(t)) {
						let e = u ? t.length - 1 : 0;
						t = t[e];
					}
					t !== null && (i[e] = t);
				}
				for (let t in e) i[t] = e[t];
			}
		}
	}
	return i;
}
var gb = (e) => (t, n) => {
	let r = (0, _.useContext)(Xy), i = (0, _.useContext)(ad), a = () => mb(e, t, r, i);
	return n ? a() : rd(a);
}, _b = /*@__PURE__*/ gb({
	scrapeMotionValuesFromProps: X_,
	createRenderState: eb
}), vb = /*@__PURE__*/ gb({
	scrapeMotionValuesFromProps: nv,
	createRenderState: ab
}), yb = Symbol.for("motionComponentSymbol");
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function bb(e, t, n) {
	let r = (0, _.useRef)(n);
	(0, _.useInsertionEffect)(() => {
		r.current = n;
	});
	let i = (0, _.useRef)(null);
	return (0, _.useCallback)((n) => {
		n && e.onMount?.(n), t && (n ? t.mount(n) : t.unmount());
		let a = r.current;
		if (typeof a == "function") {
			if (n) {
				let e = a(n);
				typeof e == "function" && (i.current = e);
			} else i.current ? (i.current(), i.current = null) : a(n);
		} else a && (a.current = n);
	}, [t]);
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var xb = (0, _.createContext)({});
//#endregion
//#region node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function Sb(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function Cb(e, t, n, r, i, a) {
	let { visualElement: o } = (0, _.useContext)(Xy), s = (0, _.useContext)(Wy), c = (0, _.useContext)(ad), l = (0, _.useContext)(Hy), u = l.reducedMotion, d = l.skipAnimations, f = (0, _.useRef)(null), p = (0, _.useRef)(!1);
	r ||= s.renderer, !f.current && r && (f.current = r(e, {
		visualState: t,
		parent: o,
		props: n,
		presenceContext: c,
		blockInitialAnimation: c ? c.initial === !1 : !1,
		reducedMotionConfig: u,
		skipAnimations: d,
		isSVG: a
	}), p.current && f.current && (f.current.manuallyAnimateOnMount = !0));
	let m = f.current, h = (0, _.useContext)(xb);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && wb(f.current, n, i, h);
	let g = (0, _.useRef)(!1);
	(0, _.useInsertionEffect)(() => {
		m && g.current && m.update(n, c);
	});
	let v = n[Wh], y = (0, _.useRef)(!!v && typeof window < "u" && !window.MotionHandoffIsComplete?.(v) && window.MotionHasOptimisedAnimation?.(v));
	return id(() => {
		p.current && m && (m.animationState?.animateChanges(), m.enteringChildren = void 0);
	}, []), id(() => {
		p.current = !0, m && (g.current = !0, window.MotionIsMounted = !0, m.updateFeatures(), m.scheduleRenderMicrotask(), y.current && m.animationState && m.animationState.animateChanges());
	}), (0, _.useEffect)(() => {
		m && (!y.current && m.animationState && m.animationState.animateChanges(), y.current &&= (queueMicrotask(() => {
			window.MotionHandoffMarkAsComplete?.(v);
		}), !1), m.enteringChildren = void 0);
	}), m;
}
function wb(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t;
	e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : Tb(e.parent)), e.projection.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && Sb(s),
		visualElement: e,
		animationType: typeof a == "string" ? a : "both",
		initialPromotionConfig: r,
		crossfade: d,
		layoutScroll: c,
		layoutRoot: l,
		layoutAnchor: u
	});
}
function Tb(e) {
	if (e) return e.options.allowProjection === !1 ? Tb(e.parent) : e.projection;
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/index.mjs
function Eb(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && Yy(r);
	let a = n ? n === "svg" : fb(e), o = a ? vb : _b;
	function s(n, s) {
		let c, l = {
			...(0, _.useContext)(Hy),
			...n,
			layoutId: Db(n)
		}, { isStatic: u, isValidProp: d } = l, f = Qy(n), p = o(n, u);
		if (!u && typeof window < "u") {
			Ob(l, r);
			let t = kb(l);
			c = t.MeasureLayout, f.visualElement = Cb(e, p, l, i, t.ProjectionNode, a);
		}
		return (0, P.jsxs)(Xy.Provider, {
			value: f,
			children: [c && f.visualElement ? (0, P.jsx)(c, {
				visualElement: f.visualElement,
				...l
			}) : null, pb(e, n, bb(p, f.visualElement, s), p, u, t, a, d)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, _.forwardRef)(s);
	return c[yb] = e, c;
}
function Db({ layoutId: e }) {
	let t = (0, _.useContext)(nd).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function Ob(e, t) {
	(0, _.useContext)(Wy).strict;
}
function kb(e) {
	let { drag: t, layout: n } = Jy();
	if (!t && !n) return {};
	let r = {
		...t,
		...n
	};
	return {
		MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
		ProjectionNode: r.ProjectionNode
	};
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function Ab(e, t) {
	if (typeof Proxy > "u") return Eb;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => Eb(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, Eb(a, void 0, e, t)), n.get(a)) });
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var jb = (e, t) => t.isSVG ?? fb(e) ? new rv(t) : new Q_(t, { allowProjection: e !== _.Fragment }), Mb = class extends K_ {
	constructor(e) {
		super(e), e.animationState ||= ov(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		k_(e) && (this.unmountControls = e.subscribe(this.node));
	}
	mount() {
		this.updateAnimationControlsSubscription();
	}
	update() {
		let { animate: e } = this.node.getProps(), { animate: t } = this.node.prevProps || {};
		e !== t && this.updateAnimationControlsSubscription();
	}
	unmount() {
		this.node.animationState.reset(), this.unmountControls?.();
	}
}, Nb = 0, Pb = {
	animation: { Feature: Mb },
	exit: { Feature: class extends K_ {
		constructor() {
			super(...arguments), this.id = Nb++;
		}
		update() {
			let { presenceContext: e, prevPresenceContext: t, animationState: n } = this.node;
			if (!e || !n) return;
			let { isPresent: r, onExitComplete: i } = e, a = t?.isPresent;
			if (r === a) return;
			if (r && a === !1) {
				if (this.exit === !0) {
					let { initial: e } = this.node.getProps();
					if (e && !Array.isArray(e)) {
						let { transition: t, transitionEnd: n, ...r } = Nh(this.node, e) || {};
						for (let e in r) this.node.getValue(e)?.jump(r[e]);
					}
					this.node.blockInitialAnimation = !1, n.reset(), n.animateChanges();
				} else n.setActive("exit", !1);
				this.exit = void 0;
				return;
			}
			let o = this.exit = n.setActive("exit", !r);
			i && !r && o.then(() => {
				this.exit === o && (this.exit = !0, i(this.id));
			});
		}
		mount() {
			let { register: e, onExitComplete: t } = this.node.presenceContext || {};
			t && t(this.id), e && (this.unmount = e(this.id));
		}
		unmount() {}
	} }
};
//#endregion
//#region node_modules/framer-motion/dist/es/events/event-info.mjs
function Fb(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var Ib = (e) => (t) => Yg(t) && e(t, Fb(t));
//#endregion
//#region node_modules/framer-motion/dist/es/events/add-pointer-event.mjs
function Lb(e, t, n, r) {
	return Zv(e, t, Ib(n), r);
}
//#endregion
//#region node_modules/framer-motion/dist/es/utils/get-context-window.mjs
var Rb = ({ current: e }) => e ? e.ownerDocument.defaultView : null, zb = (e, t) => Math.abs(e - t);
function Bb(e, t) {
	let n = zb(e.x, t.x), r = zb(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs
var Vb = /*#__PURE__*/ new Set(["auto", "scroll"]), Hb = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Ub(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = Gb(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = Bb(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: Kd.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i && i(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a && a(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = Ub(t, this.transformPagePoint), this.hasPendingMove = !0, $.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = Gb(e.type === "pointercancel" ? this.lastMoveEventInfo : Ub(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !Yg(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = Ub(Fb(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = Ud;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, Gb(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = hd(Lb(this.contextWindow, "pointermove", this.handlePointerMove, d), Lb(this.contextWindow, "pointerup", this.handlePointerUp, d), Lb(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(Vb.has(e.overflowX) || Vb.has(e.overflowY)) && this.scrollPositions.set(t, {
				x: t.scrollLeft,
				y: t.scrollTop
			}), t = t.parentElement;
		}
		this.scrollPositions.set(window, {
			x: window.scrollX,
			y: window.scrollY
		}), window.addEventListener("scroll", this.onElementScroll, { capture: !0 }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
			window.removeEventListener("scroll", this.onElementScroll, { capture: !0 }), window.removeEventListener("scroll", this.onWindowScroll);
		};
	}
	handleScroll(e) {
		let t = this.scrollPositions.get(e);
		if (!t) return;
		let n = e === window, r = n ? {
			x: window.scrollX,
			y: window.scrollY
		} : {
			x: e.scrollLeft,
			y: e.scrollTop
		}, i = {
			x: r.x - t.x,
			y: r.y - t.y
		};
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), $.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), cp(this.updatePoint);
	}
};
function Ub(e, t) {
	return t ? { point: t(e.point) } : e;
}
function Wb(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function Gb({ point: e }, t) {
	return {
		point: e,
		delta: Wb(e, qb(t)),
		offset: Wb(e, Kb(t)),
		velocity: Jb(t, .1)
	};
}
function Kb(e) {
	return e[0];
}
function qb(e) {
	return e[e.length - 1];
}
function Jb(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = qb(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ vd(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ vd(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ yd(i.timestamp - r.timestamp);
	if (a === 0) return {
		x: 0,
		y: 0
	};
	let o = {
		x: (i.x - r.x) / a,
		y: (i.y - r.y) / a
	};
	return o.x === Infinity && (o.x = 0), o.y === Infinity && (o.y = 0), o;
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs
function Yb(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? Z(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? Z(n, e, r.max) : Math.min(e, n)), e;
}
function Xb(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function Zb(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: Xb(e.x, n, i),
		y: Xb(e.y, t, r)
	};
}
function Qb(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function $b(e, t) {
	return {
		x: Qb(e.x, t.x),
		y: Qb(e.y, t.y)
	};
}
function ex(e, t) {
	let n = .5, r = gv(e), i = gv(t);
	return i > r ? n = /* @__PURE__ */ gd(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ gd(e.min, e.max - i, t.min)), cd(0, 1, n);
}
function tx(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var nx = .35;
function rx(e = nx) {
	return e === !1 ? e = 0 : e === !0 && (e = nx), {
		x: ix(e, "left", "right"),
		y: ix(e, "top", "bottom")
	};
}
function ix(e, t, n) {
	return {
		min: ax(e, t),
		max: ax(e, n)
	};
}
function ax(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs
var ox = /* @__PURE__ */ new WeakMap(), sx = class {
	constructor(e) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = D_(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(e), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = Wg(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Rv((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (Y.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = gv(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && $.update(() => i(e, t), !1, !0), Hh(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				this.currentDirection = dx(o), this.currentDirection !== null && i && i(this.currentDirection);
				return;
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && $.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new Hb(e, {
			onSessionStart: i,
			onStart: a,
			onMove: o,
			onSessionEnd: s,
			resumeAnimation: c
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: l,
			distanceThreshold: n,
			contextWindow: Rb(this.visualElement),
			element: this.visualElement.current
		});
	}
	stop(e, t) {
		let n = e || this.latestPointerEvent, r = t || this.latestPanInfo, i = this.isDragging;
		if (this.cancel(), !i || !r || !n) return;
		let { velocity: a } = r;
		this.startAnimation(a);
		let { onDragEnd: o } = this.getProps();
		o && $.postRender(() => o(n, r));
	}
	cancel() {
		this.isDragging = !1;
		let { projection: e, animationState: t } = this.visualElement;
		e && (e.isAnimationBlocked = !1), this.endPanSession();
		let { dragPropagation: n } = this.getProps();
		!n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), t && t.setActive("whileDrag", !1);
	}
	endPanSession() {
		this.panSession && this.panSession.end(), this.panSession = void 0;
	}
	updateAxis(e, t, n) {
		let { drag: r } = this.getProps();
		if (!n || !ux(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = Yb(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		e && Sb(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? Zb(n.layoutBox, e) : !1, this.elastic = rx(t), r !== this.constraints && !Sb(e) && n && this.constraints && !this.hasMutatedConstraints && Rv((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = tx(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!e || !Sb(e)) return !1;
		let n = e.current, { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = zg(n, r.root, this.visualElement.getTransformPagePoint()), a = $b(r.layout.layoutBox, i);
		if (t) {
			let e = t(bg(a));
			this.hasMutatedConstraints = !!e, e && (a = yg(e));
		}
		return a;
	}
	startAnimation(e) {
		let { drag: t, dragMomentum: n, dragElastic: r, dragTransition: i, dragSnapToOrigin: a, onDragTransitionEnd: o } = this.getProps(), s = this.constraints || {}, c = Rv((o) => {
			if (!ux(o, t, this.currentDirection)) return;
			let c = s && s[o] || {};
			(a === !0 || a === o) && (c = {
				min: 0,
				max: 0
			});
			let l = r ? 200 : 1e6, u = r ? 40 : 1e7, d = {
				type: "inertia",
				velocity: n ? e[o] : 0,
				bounceStiffness: l,
				bounceDamping: u,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...i,
				...c
			};
			return this.startAxisValueAnimation(o, d);
		});
		return Promise.all(c).then(o);
	}
	startAxisValueAnimation(e, t) {
		let n = this.getAxisMotionValue(e);
		return Hh(this.visualElement, e), n.start(Dh(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		Rv((e) => this.getAxisMotionValue(e).stop());
	}
	getAxisMotionValue(e) {
		let t = `_drag${e.toUpperCase()}`;
		return this.visualElement.getProps()[t] || this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0);
	}
	snapToCursor({ clientX: e, clientY: t }) {
		let { drag: n } = this.getProps(), r = {
			x: e,
			y: t
		}, i = this.visualElement.getTransformPagePoint()?.(r) || r, a = this.visualElement.measureViewportBox();
		Rv((e) => {
			if (!ux(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - Z(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Sb(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		Rv((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = ex({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), Rv((t) => {
			let n = this.getAxisMotionValue(t);
			if (!ux(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(Z(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		ox.set(this.visualElement, this);
		let e = this.visualElement.current, t = Lb(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && $g(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps();
			Sb(t) && t.current && (this.constraints = this.resolveRefConstraints(), n ||= lx(e, t.current, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), $.read(r);
		let o = Zv(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (Rv((t) => {
				let n = this.getAxisMotionValue(t);
				n && (this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate));
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.visualElement.getProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = nx, dragMomentum: o = !0 } = e;
		return {
			...e,
			drag: t,
			dragDirectionLock: n,
			dragPropagation: r,
			dragConstraints: i,
			dragElastic: a,
			dragMomentum: o
		};
	}
};
function cx(e) {
	let t = !0;
	return () => {
		if (t) {
			t = !1;
			return;
		}
		e();
	};
}
function lx(e, t, n) {
	let r = b_(e, cx(n)), i = b_(t, cx(n));
	return () => {
		r(), i();
	};
}
function ux(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function dx(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/drag/index.mjs
var fx = class extends K_ {
	constructor(e) {
		super(e), this.removeGroupControls = md, this.removeListeners = md, this.controls = new sx(e);
	}
	mount() {
		let { dragControls: e } = this.node.getProps();
		e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || md;
	}
	update() {
		let { dragControls: e } = this.node.getProps(), { dragControls: t } = this.node.prevProps || {};
		e !== t && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls)));
	}
	unmount() {
		this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
	}
}, px = (e) => (t, n) => {
	e && $.update(() => e(t, n), !1, !0);
}, mx = class extends K_ {
	constructor() {
		super(...arguments), this.removePointerDownListener = md;
	}
	onPointerDown(e) {
		this.session = new Hb(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: Rb(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: px(e),
			onStart: px(t),
			onMove: px(n),
			onEnd: (e, t) => {
				delete this.session, r && $.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Lb(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, hx = !1, gx = class extends _.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), hx && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			layoutDependency: this.props.layoutDependency,
			onExitComplete: () => this.safeToRemove()
		})), iy.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layoutDependency: t, visualElement: n, drag: r, isPresent: i } = this.props, { projection: a } = n;
		return a ? (a.isPresent = i, e.layoutDependency !== t && a.setOptions({
			...a.options,
			layoutDependency: t
		}), hx = !0, r || e.layoutDependency !== t || t === void 0 || e.isPresent !== i ? a.willUpdate() : this.safeToRemove(), e.isPresent !== i && (i ? a.promote() : a.relegate() || $.postRender(() => {
			let e = a.getStack();
			(!e || !e.members.length) && this.safeToRemove();
		})), null) : null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), Bg.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		hx = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function _x(e) {
	let [t, n] = Uy(), r = (0, _.useContext)(nd);
	return (0, P.jsx)(gx, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, _.useContext)(xb),
		isPresent: t,
		safeToRemove: n
	});
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/drag.mjs
var vx = {
	pan: { Feature: mx },
	drag: {
		Feature: fx,
		ProjectionNode: Vy,
		MeasureLayout: _x
	}
};
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/hover.mjs
function yx(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && $.postRender(() => i(t, Fb(t)));
}
var bx = class extends K_ {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = qg(e, (e, t) => (yx(this.node, t, "Start"), (e) => yx(this.node, e, "End"))));
	}
	unmount() {}
}, xx = class extends K_ {
	constructor() {
		super(...arguments), this.isActive = !1;
	}
	onFocus() {
		let e = !1;
		try {
			e = this.node.current.matches(":focus-visible");
		} catch {
			e = !0;
		}
		e && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
	}
	onBlur() {
		this.isActive && this.node.animationState && (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
	}
	mount() {
		this.unmount = hd(Zv(this.node.current, "focus", () => this.onFocus()), Zv(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/press.mjs
function Sx(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && $.postRender(() => i(t, Fb(t)));
}
var Cx = class extends K_ {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = o_(e, (e, t) => (Sx(this.node, t, "Start"), (e, { success: t }) => Sx(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, wx = /* @__PURE__ */ new WeakMap(), Tx = /* @__PURE__ */ new WeakMap(), Ex = (e) => {
	let t = wx.get(e.target);
	t && t(e);
}, Dx = (e) => {
	e.forEach(Ex);
};
function Ox({ root: e, ...t }) {
	let n = e || document;
	Tx.has(n) || Tx.set(n, {});
	let r = Tx.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(Dx, {
		root: e,
		...t
	})), r[i];
}
function kx(e, t, n) {
	let r = Ox(t);
	return wx.set(e, n), r.observe(e), () => {
		wx.delete(e), r.unobserve(e);
	};
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var Ax = {
	some: 0,
	all: 1
}, jx = class extends K_ {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : Ax[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = kx(this.node.current, a, o);
	}
	mount() {
		this.startObserver();
	}
	update() {
		if (typeof IntersectionObserver > "u") return;
		let { props: e, prevProps: t } = this.node;
		[
			"amount",
			"margin",
			"root"
		].some(Mx(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function Mx({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/gestures.mjs
var Nx = {
	inView: { Feature: jx },
	tap: { Feature: Cx },
	focus: { Feature: xx },
	hover: { Feature: bx }
}, Px = { layout: {
	ProjectionNode: Vy,
	MeasureLayout: _x
} }, Fx = /*@__PURE__*/ Ab({
	...Pb,
	...Nx,
	...vx,
	...Px
}, jb);
//#endregion
//#region node_modules/framer-motion/dist/es/animation/hooks/animation-controls.mjs
function Ix(e) {
	e.values.forEach((e) => e.stop());
}
function Lx(e, t) {
	[...t].reverse().forEach((n) => {
		let r = e.getVariant(n);
		r && zh(e, r), e.variantChildren && e.variantChildren.forEach((e) => {
			Lx(e, t);
		});
	});
}
function Rx(e, t) {
	if (Array.isArray(t)) return Lx(e, t);
	if (typeof t == "string") return Lx(e, [t]);
	zh(e, t);
}
function zx() {
	let e = /* @__PURE__ */ new Set(), t = {
		subscribe(t) {
			return e.add(t), () => void e.delete(t);
		},
		start(t, n) {
			let r = [];
			return e.forEach((e) => {
				r.push(Xh(e, t, { transitionOverride: n }));
			}), Promise.all(r);
		},
		set(t) {
			return e.forEach((e) => {
				Rx(e, t);
			});
		},
		stop() {
			e.forEach((e) => {
				Ix(e);
			});
		},
		mount() {
			return () => {
				t.stop();
			};
		}
	};
	return t;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/hooks/use-animation.mjs
function Bx() {
	let e = rd(zx);
	return id(e.mount, []), e;
}
var Vx = Bx, Hx = (e) => {
	let { id: t, className: n, background: r, minSize: i, maxSize: a, speed: o, particleColor: s, particleDensity: c } = e, [l, u] = (0, _.useState)(!1);
	(0, _.useEffect)(() => {
		ti(async (e) => {
			await Pl(e);
		}).then(() => {
			u(!0);
		});
	}, []);
	let d = Vx(), f = async (e) => {
		e && d.start({
			opacity: 1,
			transition: { duration: 1 }
		});
	}, p = (0, _.useId)();
	return /* @__PURE__ */ (0, P.jsx)(Fx.div, {
		animate: d,
		className: J("opacity-0", n),
		children: l && /* @__PURE__ */ (0, P.jsx)(ei, {
			id: t || p,
			className: J("h-full w-full"),
			particlesLoaded: f,
			options: {
				background: { color: { value: r || "#0d47a1" } },
				fullScreen: {
					enable: !1,
					zIndex: 1
				},
				fpsLimit: 120,
				interactivity: {
					events: {
						onClick: {
							enable: !0,
							mode: "push"
						},
						onHover: {
							enable: !1,
							mode: "repulse"
						},
						resize: !0
					},
					modes: {
						push: { quantity: 4 },
						repulse: {
							distance: 200,
							duration: .4
						}
					}
				},
				particles: {
					bounce: {
						horizontal: { value: 1 },
						vertical: { value: 1 }
					},
					collisions: {
						absorb: { speed: 2 },
						bounce: {
							horizontal: { value: 1 },
							vertical: { value: 1 }
						},
						enable: !1,
						maxSpeed: 50,
						mode: "bounce",
						overlap: {
							enable: !0,
							retries: 0
						}
					},
					color: {
						value: s || "#ffffff",
						animation: {
							h: {
								count: 0,
								enable: !1,
								speed: 1,
								decay: 0,
								delay: 0,
								sync: !0,
								offset: 0
							},
							s: {
								count: 0,
								enable: !1,
								speed: 1,
								decay: 0,
								delay: 0,
								sync: !0,
								offset: 0
							},
							l: {
								count: 0,
								enable: !1,
								speed: 1,
								decay: 0,
								delay: 0,
								sync: !0,
								offset: 0
							}
						}
					},
					effect: {
						close: !0,
						fill: !0,
						options: {},
						type: {}
					},
					groups: {},
					move: {
						angle: {
							offset: 0,
							value: 90
						},
						attract: {
							distance: 200,
							enable: !1,
							rotate: {
								x: 3e3,
								y: 3e3
							}
						},
						center: {
							x: 50,
							y: 50,
							mode: "percent",
							radius: 0
						},
						decay: 0,
						distance: {},
						direction: "none",
						drift: 0,
						enable: !0,
						gravity: {
							acceleration: 9.81,
							enable: !1,
							inverse: !1,
							maxSpeed: 50
						},
						path: {
							clamp: !0,
							delay: { value: 0 },
							enable: !1,
							options: {}
						},
						outModes: { default: "out" },
						random: !1,
						size: !1,
						speed: {
							min: .1,
							max: 1
						},
						spin: {
							acceleration: 0,
							enable: !1
						},
						straight: !1,
						trail: {
							enable: !1,
							length: 10,
							fill: {}
						},
						vibrate: !1,
						warp: !1
					},
					number: {
						density: {
							enable: !0,
							width: 400,
							height: 400
						},
						limit: {
							mode: "delete",
							value: 0
						},
						value: c || 120
					},
					opacity: {
						value: {
							min: .1,
							max: 1
						},
						animation: {
							count: 0,
							enable: !0,
							speed: o || 4,
							decay: 0,
							delay: 0,
							sync: !1,
							mode: "auto",
							startValue: "random",
							destroy: "none"
						}
					},
					reduceDuplicates: !1,
					shadow: {
						blur: 0,
						color: { value: "#000" },
						enable: !1,
						offset: {
							x: 0,
							y: 0
						}
					},
					shape: {
						close: !0,
						fill: !0,
						options: {},
						type: "circle"
					},
					size: {
						value: {
							min: i || 1,
							max: a || 3
						},
						animation: {
							count: 0,
							enable: !1,
							speed: 5,
							decay: 0,
							delay: 0,
							sync: !1,
							mode: "auto",
							startValue: "random",
							destroy: "none"
						}
					},
					stroke: { width: 0 },
					zIndex: {
						value: 0,
						opacityRate: 1,
						sizeRate: 1,
						velocityRate: 1
					},
					destroy: {
						bounds: {},
						mode: "none",
						split: {
							count: 1,
							factor: { value: 3 },
							rate: { value: {
								min: 4,
								max: 9
							} },
							sizeOffset: !0
						}
					},
					roll: {
						darken: {
							enable: !1,
							value: 0
						},
						enable: !1,
						enlighten: {
							enable: !1,
							value: 0
						},
						mode: "vertical",
						speed: 25
					},
					tilt: {
						value: 0,
						animation: {
							enable: !1,
							speed: 0,
							decay: 0,
							sync: !1
						},
						direction: "clockwise",
						enable: !1
					},
					twinkle: {
						lines: {
							enable: !1,
							frequency: .05,
							opacity: 1
						},
						particles: {
							enable: !1,
							frequency: .05,
							opacity: 1
						}
					},
					wobble: {
						distance: 5,
						enable: !1,
						speed: {
							angle: 50,
							move: 10
						}
					},
					life: {
						count: 0,
						delay: {
							value: 0,
							sync: !1
						},
						duration: {
							value: 0,
							sync: !1
						}
					},
					rotate: {
						value: 0,
						animation: {
							enable: !1,
							speed: 0,
							decay: 0,
							sync: !1
						},
						direction: "clockwise",
						path: !1
					},
					orbit: {
						animation: {
							count: 0,
							enable: !1,
							speed: 1,
							decay: 0,
							delay: 0,
							sync: !1
						},
						enable: !1,
						opacity: 1,
						rotation: { value: 45 },
						width: 1
					},
					links: {
						blink: !1,
						color: { value: "#fff" },
						consent: !1,
						distance: 100,
						enable: !1,
						frequency: 1,
						opacity: 1,
						shadow: {
							blur: 5,
							color: { value: "#000" },
							enable: !1
						},
						triangles: {
							enable: !1,
							frequency: 1
						},
						width: 1,
						warp: !1
					},
					repulse: {
						value: 0,
						enabled: !1,
						distance: 1,
						duration: 1,
						factor: 1,
						speed: 1
					}
				},
				detectRetina: !0
			}
		})
	});
}, Ux = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function Wx(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: Ux(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var Gx = (e) => {
	let t = "", n = !1;
	for (let r of e) {
		if (r === "-" || r === "_" || r <= " ") {
			n = t.length > 0;
			continue;
		}
		t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1;
	}
	return t;
}, Kx = (e) => {
	let t = Gx(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, qx = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Jx = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function Yx(e) {
	return e != null;
}
function Xx(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? Jx.width, a = e.size ?? e.height ?? Jx.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? qx(...c) : qx("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? Jx["stroke-width"]) * Number(e.size ?? e.width ?? Jx.width) / Number(t.size ?? t.width ?? Jx.width) : t.strokeWidth ?? Jx["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(Jx).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && Yx(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && Yx(t.width) && { [r("width")]: t.width },
			..."height" in t && Yx(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function Zx(e, t = {}) {
	return Xx(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var Qx = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, $x = (0, _.createContext)({}), eS = () => (0, _.useContext)($x), tS = (0, _.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: v = "currentColor", className: y = "" } = eS() ?? {}, b = !!c || Qx(d), [ee, te, ne = []] = Zx(u, {
		color: e ?? v,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: qx(y, s),
		hasA11yProp: b,
		attributes: d
	});
	return (0, _.createElement)(ee, {
		ref: f,
		...te
	}, [...ne.map(([e, t]) => (0, _.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
//#endregion
//#region node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function nS(e, t = [], n = []) {
	let r = typeof e == "string" ? Wx(e, t, n) : e, i = (0, _.forwardRef)(({ className: e, ...t }, n) => (0, _.createElement)(tS, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = Kx(r.name)), i;
}
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/arrow-right.mjs
var rS = {
	name: "arrow-right",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "m12 5 7 7-7 7",
		key: "xquz4c"
	}]]
};
rS.node;
var iS = nS(rS), aS = {
	name: "bot",
	size: 24,
	node: [
		["path", {
			d: "M12 8V4H8",
			key: "hb8ula"
		}],
		["rect", {
			width: "16",
			height: "12",
			x: "4",
			y: "8",
			rx: "2",
			key: "enze0r"
		}],
		["path", {
			d: "M2 14h2",
			key: "vft8re"
		}],
		["path", {
			d: "M20 14h2",
			key: "4cs60a"
		}],
		["path", {
			d: "M15 13v2",
			key: "1xurst"
		}],
		["path", {
			d: "M9 13v2",
			key: "rq6x2g"
		}]
	]
};
aS.node;
var oS = nS(aS), sS = {
	name: "cpu",
	size: 24,
	node: [
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M17 20v2",
			key: "1rnc9c"
		}],
		["path", {
			d: "M17 2v2",
			key: "11trls"
		}],
		["path", {
			d: "M2 12h2",
			key: "1t8f8n"
		}],
		["path", {
			d: "M2 17h2",
			key: "7oei6x"
		}],
		["path", {
			d: "M2 7h2",
			key: "asdhe0"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}],
		["path", {
			d: "M20 17h2",
			key: "1fpfkl"
		}],
		["path", {
			d: "M20 7h2",
			key: "1o8tra"
		}],
		["path", {
			d: "M7 20v2",
			key: "4gnj0m"
		}],
		["path", {
			d: "M7 2v2",
			key: "1i4yhu"
		}],
		["rect", {
			x: "4",
			y: "4",
			width: "16",
			height: "16",
			rx: "2",
			key: "1vbyd7"
		}],
		["rect", {
			x: "8",
			y: "8",
			width: "8",
			height: "8",
			rx: "1",
			key: "z9xiuo"
		}]
	]
};
sS.node;
var cS = nS(sS), lS = {
	name: "loader-circle",
	size: 24,
	node: [["path", {
		d: "M21 12a9 9 0 1 1-6.219-8.56",
		key: "13zald"
	}]],
	aliases: ["loader-2"]
};
lS.node;
var uS = nS(lS), dS = {
	name: "sparkles",
	size: 24,
	node: [
		["path", {
			d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
			key: "1s2grr"
		}],
		["path", {
			d: "M20 2v4",
			key: "1rf3ol"
		}],
		["path", {
			d: "M22 4h-4",
			key: "gwowj6"
		}],
		["circle", {
			cx: "4",
			cy: "20",
			r: "2",
			key: "6kqj1y"
		}]
	],
	aliases: ["stars"]
};
dS.node;
var fS = nS(dS), pS = {
	name: "zap",
	size: 24,
	node: [["path", {
		d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
		key: "1v7up4"
	}]]
};
pS.node;
var mS = nS(pS), hS = ({ onComplete: e, onSkip: t, autoAdvanceDelay: n = 0, className: r = "", showSkipButton: i = !1 }) => {
	let [a, o] = (0, _.useState)(!1), [s, c] = (0, _.useState)(800), l = (0, _.useRef)(!1);
	(0, _.useEffect)(() => {
		let e = () => {
			if (typeof window > "u") return;
			let e = window.innerWidth;
			c(e < 640 ? 320 : e < 1024 ? 600 : 950);
		};
		return e(), window.addEventListener("resize", e, { passive: !0 }), () => window.removeEventListener("resize", e);
	}, []);
	let u = (0, _.useCallback)(() => {
		l.current || (l.current = !0, o(!0), setTimeout(() => {
			typeof e == "function" ? e() : window.location.href = "/login";
		}, 450));
	}, [e]);
	return (0, _.useCallback)(() => {
		l.current || (l.current = !0, typeof t == "function" ? t() : typeof e == "function" ? e() : window.location.href = "/login");
	}, [t, e]), (0, _.useEffect)(() => {
		if (n && n > 0) {
			let e = setTimeout(() => {
				u();
			}, n);
			return () => clearTimeout(e);
		}
	}, [n, u]), /* @__PURE__ */ (0, P.jsxs)("div", {
		className: `epic-think-intro-root relative h-[100dvh] min-h-[100dvh] w-full bg-black text-white flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto sm:overflow-hidden selection:bg-indigo-500 selection:text-white ${r}`,
		role: "region",
		"aria-label": "Epic Think AI Intro",
		children: [
			/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[350px] md:h-[420px] bg-indigo-600/15 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" }),
			/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[380px] md:w-[450px] h-[150px] sm:h-[220px] md:h-[250px] bg-sky-500/15 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none" }),
			/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[420px] md:w-[500px] h-[140px] sm:h-[180px] md:h-[200px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" }),
			/* @__PURE__ */ (0, P.jsxs)("main", {
				className: "relative z-20 flex flex-col items-center justify-center px-4 py-3 sm:py-6 w-full max-w-4xl mx-auto text-center my-auto",
				children: [
					/* @__PURE__ */ (0, P.jsx)("h1", {
						className: "text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight relative z-20 select-none animate-text-chroma transition-all duration-300 pb-1 sm:pb-2 leading-tight",
						children: "Epic Think"
					}),
					/* @__PURE__ */ (0, P.jsxs)("div", {
						className: "w-full max-w-[280px] xs:max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-24 xs:h-28 sm:h-36 md:h-40 relative my-1 sm:my-2",
						children: [
							/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 xs:w-28 sm:w-44 md:w-56 h-[2px] sm:h-[3px] bg-white blur-[0.5px] rounded-full z-10 animate-beam-pulse shadow-[0_0_15px_#fff]" }),
							/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-cyan-300 to-transparent h-[1.5px] w-3/4 animate-beam-pulse" }),
							/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2.5px] sm:h-[3px] w-3/4 blur-[1.5px]" }),
							/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent h-[3px] sm:h-[4px] w-1/3 blur-sm opacity-80" }),
							/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-sky-300 to-transparent h-px w-1/4" }),
							/* @__PURE__ */ (0, P.jsx)(Hx, {
								background: "transparent",
								minSize: .4,
								maxSize: 1.2,
								particleDensity: s,
								className: "w-full h-full",
								particleColor: "#FFFFFF",
								speed: 1.5
							}),
							/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] pointer-events-none" })
						]
					}),
					/* @__PURE__ */ (0, P.jsxs)("p", {
						className: "max-w-xl text-xs xs:text-sm sm:text-base md:text-lg text-neutral-300 font-normal mt-1 sm:mt-2 mb-3 sm:mb-5 leading-relaxed tracking-wide drop-shadow-sm px-2",
						children: [
							"The next-generation",
							" ",
							/* @__PURE__ */ (0, P.jsx)("span", {
								className: "text-white font-semibold underline decoration-cyan-400 decoration-2 underline-offset-4",
								children: "autonomous AI agent"
							}),
							" ",
							"built for deep cognitive reasoning, instant execution, and superhuman workflow automation."
						]
					}),
					/* @__PURE__ */ (0, P.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-4 sm:mb-6 text-[10px] xs:text-[11px] sm:text-xs text-neutral-400",
						children: [
							/* @__PURE__ */ (0, P.jsxs)("div", {
								className: "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800",
								children: [/* @__PURE__ */ (0, P.jsx)(cS, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400" }), /* @__PURE__ */ (0, P.jsx)("span", { children: "Deep Cognitive Logic" })]
							}),
							/* @__PURE__ */ (0, P.jsxs)("div", {
								className: "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800",
								children: [/* @__PURE__ */ (0, P.jsx)(mS, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" }), /* @__PURE__ */ (0, P.jsx)("span", { children: "Instant Execution" })]
							}),
							/* @__PURE__ */ (0, P.jsxs)("div", {
								className: "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800",
								children: [/* @__PURE__ */ (0, P.jsx)(oS, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-400" }), /* @__PURE__ */ (0, P.jsx)("span", { children: "Autonomous Decision Engine" })]
							})
						]
					}),
					/* @__PURE__ */ (0, P.jsxs)("div", {
						className: "relative group z-30 inline-block",
						children: [/* @__PURE__ */ (0, P.jsx)("div", { className: "absolute -inset-1 rounded-full blur-xl opacity-80 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-button-chroma" }), /* @__PURE__ */ (0, P.jsx)("div", {
							className: "relative p-[2px] rounded-full animate-button-chroma shadow-2xl",
							children: /* @__PURE__ */ (0, P.jsx)("button", {
								onClick: u,
								disabled: a,
								className: "relative flex items-center gap-2 xs:gap-2.5 sm:gap-3 px-6 py-2.5 xs:px-8 xs:py-3 sm:px-10 sm:py-3.5 rounded-full bg-black/85 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group-hover:bg-black/60 active:scale-95 cursor-pointer border border-white/25 hover:border-white/50 disabled:opacity-80",
								"aria-label": "Get Started with Epic Think AI",
								children: a ? /* @__PURE__ */ (0, P.jsxs)(P.Fragment, { children: [/* @__PURE__ */ (0, P.jsx)(uS, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-cyan-300" }), /* @__PURE__ */ (0, P.jsx)("span", {
									className: "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]",
									children: "Connecting to Agent..."
								})] }) : /* @__PURE__ */ (0, P.jsxs)(P.Fragment, { children: [
									/* @__PURE__ */ (0, P.jsx)(fS, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-300 animate-pulse" }),
									/* @__PURE__ */ (0, P.jsx)("span", {
										className: "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]",
										children: "Get Started"
									}),
									/* @__PURE__ */ (0, P.jsx)(iS, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-300" })
								] })
							})
						})]
					})
				]
			})
		]
	});
}, gS = null;
function _S(e, t = {}) {
	if (gS) {
		try {
			gS.unmount();
		} catch {}
		gS = null;
	}
	let n = v.createRoot(e);
	gS = n, n.render(/* @__PURE__ */ (0, P.jsx)(hS, { ...t }));
}
function vS() {
	if (gS) {
		try {
			gS.unmount();
		} catch {}
		gS = null;
	}
}
typeof window < "u" && (window.EpicThinkIntro = {
	Component: hS,
	mount: _S,
	unmount: vS
});
//#endregion
export { hS as EpicThinkIntro, _S as mountEpicThinkIntro, vS as unmountEpicThinkIntro };
