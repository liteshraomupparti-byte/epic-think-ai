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
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var ee = Array.isArray;
	function C() {}
	var w = {
		H: null,
		A: null,
		T: null,
		S: null
	}, te = Object.prototype.hasOwnProperty;
	function T(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ne(e, t) {
		return T(e.type, t, e.props);
	}
	function E(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function re(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ie = /\/+/g;
	function ae(e, t) {
		return typeof e == "object" && e && e.key != null ? re("" + e.key) : t.toString(36);
	}
	function oe(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(C, C) : (e.status = "pending", e.then(function(t) {
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
	function se(e, r, i, a, o) {
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
				case d: return c = e._init, se(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ae(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(ie, "$&/") + "/"), se(o, r, i, "", function(e) {
			return e;
		})) : o != null && (E(o) && (o = ne(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ie, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ae(a, u), c += se(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ae(a, u++), c += se(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return se(oe(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function D(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return se(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function O(e) {
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
	var ce = typeof reportError == "function" ? reportError : function(e) {
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
	function le(e) {
		var t = w.T, n = {};
		n.types = t === null ? null : t.types, w.T = n;
		try {
			var r = e(), i = w.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, ce);
		} catch (e) {
			ce(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), w.T = t;
		}
	}
	function k(e) {
		var t = w.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else le(k.bind(null, e));
	}
	var ue = {
		map: D,
		forEach: function(e, t, n) {
			D(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return D(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return D(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!E(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ue, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return w.H.useMemoCache(e);
		}
	}, e.addTransitionType = k, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !te.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return T(e.type, i, r);
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
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) te.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return T(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = E, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: O
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = le, e.unstable_useCacheRefresh = function() {
		return w.H.useCacheRefresh();
	}, e.use = function(e) {
		return w.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return w.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return w.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return w.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return w.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return w.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return w.H.useEffectEvent(e);
	}, e.useId = function() {
		return w.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return w.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return w.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return w.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return w.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return w.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return w.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return w.H.useRef(e);
	}, e.useState = function(e) {
		return w.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return w.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return w.H.useTransition();
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
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, ne());
			else {
				var t = n(l);
				t !== null && ie(x, t.startTime - e);
			}
		}
	}
	var S = !1, ee = -1, C = 5, w = -1;
	function te() {
		return g ? !0 : !(e.unstable_now() - w < C);
	}
	function T() {
		if (g = !1, S) {
			var t = e.unstable_now();
			w = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(ee), ee = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && te());) {
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
								u !== null && ie(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ne() : S = !1;
			}
		}
	}
	var ne;
	if (typeof y == "function") ne = function() {
		y(T);
	};
	else if (typeof MessageChannel < "u") {
		var E = new MessageChannel(), re = E.port2;
		E.port1.onmessage = T, ne = function() {
			re.postMessage(null);
		};
	} else ne = function() {
		_(T, 0);
	};
	function ie(t, n) {
		ee = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : C = 0 < e ? Math.floor(1e3 / e) : 5;
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(ee), ee = -1) : h = !0, ie(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, ne()))), r;
	}, e.unstable_shouldYield = te, e.unstable_wrapCallback = function(e) {
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
	var x = null, S = null;
	function ee(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function C(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function w(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function te(e, t, n) {
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
	var T = Object.assign, ne = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), re = Symbol.for("react.portal"), ie = Symbol.for("react.fragment"), ae = Symbol.for("react.strict_mode"), oe = Symbol.for("react.profiler"), se = Symbol.for("react.consumer"), D = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), ce = Symbol.for("react.suspense"), le = Symbol.for("react.suspense_list"), k = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), A = Symbol.for("react.activity"), de = Symbol.for("react.legacy_hidden"), fe = Symbol.for("react.memo_cache_sentinel"), pe = Symbol.for("react.view_transition"), me = Symbol.for("react.recoverable"), he = Symbol.iterator;
	function ge(e) {
		return typeof e != "object" || !e ? null : (e = he && e[he] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var _e = Symbol.for("react.client.reference");
	function ve(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === _e ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case ie: return "Fragment";
			case oe: return "Profiler";
			case ae: return "StrictMode";
			case ce: return "Suspense";
			case le: return "SuspenseList";
			case A: return "Activity";
			case pe: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case re: return "Portal";
			case D: return e.displayName || "Context";
			case se: return (e._context.displayName || "Context") + ".Consumer";
			case O:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case k: return t = e.displayName || null, t === null ? ve(e.type) || "Memo" : t;
			case ue:
				t = e._payload, e = e._init;
				try {
					return ve(e(t));
				} catch {}
		}
		return null;
	}
	var ye = Array.isArray, j = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, M = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, be = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, xe = [], Se = -1;
	function Ce(e) {
		return { current: e };
	}
	function we(e) {
		0 > Se || (e.current = xe[Se], xe[Se] = null, Se--);
	}
	function Te(e, t) {
		Se++, xe[Se] = e.current, e.current = t;
	}
	var Ee = Ce(null), De = Ce(null), Oe = Ce(null), ke = Ce(null);
	function Ae(e, t) {
		switch (Te(Oe, t), Te(De, e), Te(Ee, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? dp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = dp(t), e = fp(t, e);
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
		we(Ee), Te(Ee, e);
	}
	function je() {
		we(Ee), we(De), we(Oe);
	}
	function Me(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, Te(ke, e)), t = Ee.current;
		var n = fp(t, e.type);
		t !== n && (Te(De, e), Te(Ee, n));
	}
	function Ne(e) {
		De.current === e && (we(Ee), we(De)), ke.current === e && (we(ke), sh._currentValue = be);
	}
	var Pe, Fe;
	function Ie(e) {
		if (Pe === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Pe = t && t[1] || "", Fe = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Pe + e + Fe;
	}
	var Le = !1;
	function Re(e, t) {
		if (!e || Le) return "";
		Le = !0;
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
			Le = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ie(n) : "";
	}
	function ze(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ie(e.type);
			case 16: return Ie("Lazy");
			case 13: return e.child !== t && t !== null ? Ie("Suspense Fallback") : Ie("Suspense");
			case 19: return Ie("SuspenseList");
			case 0:
			case 15: return Re(e.type, !1);
			case 11: return Re(e.type.render, !1);
			case 1: return Re(e.type, !0);
			case 31: return Ie("Activity");
			case 30: return Ie("ViewTransition");
			default: return "";
		}
	}
	function Be(e) {
		try {
			var t = "", n = null;
			do
				t += ze(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ve = Object.prototype.hasOwnProperty, He = t.unstable_scheduleCallback, Ue = t.unstable_cancelCallback, We = t.unstable_shouldYield, Ge = t.unstable_requestPaint, Ke = t.unstable_now, qe = t.unstable_getCurrentPriorityLevel, Je = t.unstable_ImmediatePriority, Ye = t.unstable_UserBlockingPriority, Xe = t.unstable_NormalPriority, Ze = t.unstable_LowPriority, Qe = t.unstable_IdlePriority, $e = t.log, et = t.unstable_setDisableYieldValue, tt = null, nt = null;
	function rt(e) {
		if (typeof $e == "function" && et(e), nt && typeof nt.setStrictMode == "function") try {
			nt.setStrictMode(tt, e);
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
	function N(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - it(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function xt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : St(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function St(e) {
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
	function Ct(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function wt() {
		var e = M.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function Tt(e, t) {
		var n = M.p;
		try {
			return M.p = e, t();
		} finally {
			M.p = n;
		}
	}
	var Et = Math.random().toString(36).slice(2), Dt = "__reactFiber$" + Et, Ot = "__reactProps$" + Et, kt = "__reactContainer$" + Et, At = "__reactEvents$" + Et, P = "__reactListeners$" + Et, jt = "__reactHandles$" + Et, Mt = "__reactResources$" + Et, F = "__reactMarker$" + Et, Nt = "__reactLoad$" + Et;
	function Pt(e) {
		delete e[Dt], delete e[Ot], delete e[P], delete e[jt];
	}
	function Ft(e) {
		var t;
		if (t = e[Dt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[kt] || n[Dt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[Dt]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function It(e) {
		if (e = e[Dt] || e[kt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Lt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Rt(e) {
		var t = e[Mt];
		return t ||= e[Mt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function zt(e) {
		e[F] = !0;
	}
	function Bt(e) {
		e[Nt] = void 0;
	}
	var Vt = /* @__PURE__ */ new Set(), Ht = {};
	function Ut(e, t) {
		I(e, t), I(e + "Capture", t);
	}
	function I(e, t) {
		for (Ht[e] = t, e = 0; e < t.length; e++) Vt.add(t[e]);
	}
	var Wt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Gt = {}, Kt = {};
	function qt(e) {
		return Ve.call(Kt, e) ? !0 : Ve.call(Gt, e) ? !1 : Wt.test(e) ? Kt[e] = !0 : (Gt[e] = !0, !1);
	}
	var L = !1;
	function Jt() {
		var e = L;
		return L = !1, e;
	}
	function Yt(e, t, n) {
		if (qt(t)) {
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
	function Xt(e, t, n) {
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
	function Zt(e, t, n, r) {
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
	function Qt(e) {
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
	function $t(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function en(e, t, n) {
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
	function tn(e) {
		if (!e._valueTracker) {
			var t = $t(e) ? "checked" : "value";
			e._valueTracker = en(e, t, "" + e[t]);
		}
	}
	function nn(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = $t(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var rn = /[\n"\\]/g;
	function an(e) {
		return e.replace(rn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function on(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Qt(t)) : e.value !== "" + Qt(t) && (e.value = "" + Qt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : cn(e, Qt(n)) : o === "number" && e.value == t ? cn(e, Qt(e.value)) : cn(e, Qt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Qt(s) : e.removeAttribute("name");
	}
	function sn(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				tn(e);
				return;
			}
			n = n == null ? "" : "" + Qt(n), t = t == null ? n : "" + Qt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), tn(e);
	}
	function cn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function ln(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Qt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function un(e, t, n) {
		if (t != null && (t = "" + Qt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Qt(n);
	}
	function dn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (ye(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Qt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), tn(e);
	}
	function fn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var pn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function mn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || pn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function hn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", L = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (mn(e, a, r), L = !0);
		} else for (var o in t) t.hasOwnProperty(o) && mn(e, o, t[o]);
	}
	function gn(e) {
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
	var _n = /* @__PURE__ */ new Map([
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
	]), vn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function yn(e) {
		return vn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function bn() {}
	var xn = null;
	function Sn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Cn = null, wn = null;
	function Tn(e) {
		var t = It(e);
		if (t && (e = t.stateNode)) {
			var n = e[Ot] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (on(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + an("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[Ot] || null;
								if (!a) throw Error(i(90));
								on(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && nn(r);
					}
					break a;
				case "textarea":
					un(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && ln(e, !!n.multiple, t, !1);
			}
		}
	}
	var En = !1;
	function Dn(e, t, n) {
		if (En) return e(t, n);
		En = !0;
		try {
			return e(t);
		} finally {
			if (En = !1, (Cn !== null || wn !== null) && (Bd(), Cn && (t = Cn, e = wn, wn = Cn = null, Tn(t), e))) for (t = 0; t < e.length; t++) Tn(e[t]);
		}
	}
	function On(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Ot] || null;
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
	var kn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, An = !1;
	if (kn) try {
		var jn = {};
		Object.defineProperty(jn, "passive", { get: function() {
			An = !0;
		} }), window.addEventListener("test", jn, jn), window.removeEventListener("test", jn, jn);
	} catch {
		An = !1;
	}
	var Mn = null, Nn = null, Pn = null;
	function Fn() {
		if (Pn) return Pn;
		var e, t = Nn, n = t.length, r, i = "value" in Mn ? Mn.value : Mn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Pn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function In(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Ln() {
		return !0;
	}
	function Rn() {
		return !1;
	}
	function zn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Ln : Rn, this.isPropagationStopped = Rn, this;
		}
		return T(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Ln);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Ln);
			},
			persist: function() {},
			isPersistent: Ln
		}), t;
	}
	var Bn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Vn = zn(Bn), Hn = T({}, Bn, {
		view: 0,
		detail: 0
	}), Un = zn(Hn), Wn, Gn, Kn, qn = T({}, Hn, {
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
		getModifierState: ir,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Kn && (Kn && e.type === "mousemove" ? (Wn = e.screenX - Kn.screenX, Gn = e.screenY - Kn.screenY) : Gn = Wn = 0, Kn = e), Wn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Gn;
		}
	}), Jn = zn(qn), Yn = zn(T({}, qn, { dataTransfer: 0 })), Xn = zn(T({}, Hn, { relatedTarget: 0 })), Zn = zn(T({}, Bn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Qn = zn(T({}, Bn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), $n = zn(T({}, Bn, { data: 0 })), er = {
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
	}, tr = {
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
	}, nr = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function rr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = nr[e]) ? !!t[e] : !1;
	}
	function ir() {
		return rr;
	}
	var ar = zn(T({}, Hn, {
		key: function(e) {
			if (e.key) {
				var t = er[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = In(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? tr[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: ir,
		charCode: function(e) {
			return e.type === "keypress" ? In(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? In(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), or = zn(T({}, qn, {
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
	})), sr = zn(T({}, Bn, { submitter: 0 })), cr = zn(T({}, Hn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: ir
	})), lr = zn(T({}, Bn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), ur = zn(T({}, qn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), dr = zn(T({}, Bn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), fr = [
		9,
		13,
		27,
		32
	], pr = kn && "CompositionEvent" in window, mr = null;
	kn && "documentMode" in document && (mr = document.documentMode);
	var hr = kn && "TextEvent" in window && !mr, gr = kn && (!pr || mr && 8 < mr && 11 >= mr), _r = " ", vr = !1;
	function yr(e, t) {
		switch (e) {
			case "keyup": return fr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function br(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var xr = !1;
	function Sr(e, t) {
		switch (e) {
			case "compositionend": return br(t);
			case "keypress": return t.which === 32 ? (vr = !0, _r) : null;
			case "textInput": return e = t.data, e === _r && vr ? null : e;
			default: return null;
		}
	}
	function Cr(e, t) {
		if (xr) return e === "compositionend" || !pr && yr(e, t) ? (e = Fn(), Pn = Nn = Mn = null, xr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return gr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var wr = {
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
	function Tr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!wr[e.type] : t === "textarea";
	}
	function Er(e, t, n, r) {
		Cn ? wn ? wn.push(r) : wn = [r] : Cn = r, t = Yf(t, "onChange"), 0 < t.length && (n = new Vn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Dr = null, Or = null;
	function kr(e) {
		Hf(e, 0);
	}
	function Ar(e) {
		if (nn(Lt(e))) return e;
	}
	function jr(e, t) {
		if (e === "change") return t;
	}
	var Mr = !1;
	if (kn) {
		var Nr;
		if (kn) {
			var Pr = "oninput" in document;
			if (!Pr) {
				var Fr = document.createElement("div");
				Fr.setAttribute("oninput", "return;"), Pr = typeof Fr.oninput == "function";
			}
			Nr = Pr;
		} else Nr = !1;
		Mr = Nr && (!document.documentMode || 9 < document.documentMode);
	}
	function Ir() {
		Dr && (Dr.detachEvent("onpropertychange", Lr), Or = Dr = null);
	}
	function Lr(e) {
		if (e.propertyName === "value" && Ar(Or)) {
			var t = [];
			Er(t, Or, e, Sn(e)), Dn(kr, t);
		}
	}
	function Rr(e, t, n) {
		e === "focusin" ? (Ir(), Dr = t, Or = n, Dr.attachEvent("onpropertychange", Lr)) : e === "focusout" && Ir();
	}
	function zr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ar(Or);
	}
	function Br(e, t) {
		if (e === "click") return Ar(t);
	}
	function Vr(e, t) {
		if (e === "input" || e === "change") return Ar(t);
	}
	function Hr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Ur = typeof Object.is == "function" ? Object.is : Hr;
	function Wr(e, t) {
		if (Ur(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ve.call(t, i) || !Ur(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Gr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Kr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function qr(e, t) {
		var n = Kr(e);
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
			n = Kr(n);
		}
	}
	function Jr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Jr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Yr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Gr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Gr(e.document);
		}
		return t;
	}
	function Xr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Zr = kn && "documentMode" in document && 11 >= document.documentMode, Qr = null, $r = null, ei = null, ti = !1;
	function ni(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ti || Qr == null || Qr !== Gr(r) || (r = Qr, "selectionStart" in r && Xr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), ei && Wr(ei, r) || (ei = r, r = Yf($r, "onSelect"), 0 < r.length && (t = new Vn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Qr)));
	}
	function ri(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ii = {
		animationend: ri("Animation", "AnimationEnd"),
		animationiteration: ri("Animation", "AnimationIteration"),
		animationstart: ri("Animation", "AnimationStart"),
		transitionrun: ri("Transition", "TransitionRun"),
		transitionstart: ri("Transition", "TransitionStart"),
		transitioncancel: ri("Transition", "TransitionCancel"),
		transitionend: ri("Transition", "TransitionEnd")
	}, ai = {}, oi = {};
	kn && (oi = document.createElement("div").style, "AnimationEvent" in window || (delete ii.animationend.animation, delete ii.animationiteration.animation, delete ii.animationstart.animation), "TransitionEvent" in window || delete ii.transitionend.transition);
	function si(e) {
		if (ai[e]) return ai[e];
		if (!ii[e]) return e;
		var t = ii[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in oi) return ai[e] = t[n];
		return e;
	}
	var ci = si("animationend"), li = si("animationiteration"), ui = si("animationstart"), di = si("transitionrun"), fi = si("transitionstart"), pi = si("transitioncancel"), mi = si("transitionend"), hi = /* @__PURE__ */ new Map(), gi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	gi.push("scrollEnd");
	function _i(e, t) {
		hi.set(e, t), Ut(t, [e]);
	}
	var vi = 0;
	function yi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = Cd.identifierPrefix;
		var n = vi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function bi(e) {
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
	function xi(e, t) {
		return e = bi(e), t = bi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var Si = typeof reportError == "function" ? reportError : function(e) {
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
	}, Ci = [], wi = 0, Ti = 0;
	function Ei() {
		for (var e = wi, t = Ti = wi = 0; t < e;) {
			var n = Ci[t];
			Ci[t++] = null;
			var r = Ci[t];
			Ci[t++] = null;
			var i = Ci[t];
			Ci[t++] = null;
			var a = Ci[t];
			if (Ci[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ai(n, i, a);
		}
	}
	function Di(e, t, n, r) {
		Ci[wi++] = e, Ci[wi++] = t, Ci[wi++] = n, Ci[wi++] = r, Ti |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Oi(e, t, n, r) {
		return Di(e, t, n, r), ji(e);
	}
	function ki(e, t) {
		return Di(e, null, null, t), ji(e);
	}
	function Ai(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - it(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ji(e) {
		if (50 < jd) throw jd = 0, Md = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Mi = {};
	function Ni(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Pi(e, t, n, r) {
		return new Ni(e, t, n, r);
	}
	function Fi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function R(e, t) {
		var n = e.alternate;
		return n === null ? (n = Pi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ii(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Li(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Fi(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Ee.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case A: return e = Pi(31, n, t, a), e.elementType = A, e.lanes = o, e;
			case ie: return Ri(n.children, a, o, t);
			case ae:
				s = 8, a |= 24;
				break;
			case oe: return e = Pi(12, n, t, a | 2), e.elementType = oe, e.lanes = o, e;
			case ce: return e = Pi(13, n, t, a), e.elementType = ce, e.lanes = o, e;
			case le: return e = Pi(19, n, t, a), e.elementType = le, e.lanes = o, e;
			case de:
			case pe: return e = a | 32, e = Pi(30, n, t, e), e.elementType = pe, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case D:
						s = 10;
						break a;
					case se:
						s = 9;
						break a;
					case O:
						s = 11;
						break a;
					case k:
						s = 14;
						break a;
					case ue:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Pi(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ri(e, t, n, r) {
		return e = Pi(7, e, r, t), e.lanes = n, e;
	}
	function zi(e, t, n) {
		return e = Pi(6, e, null, t), e.lanes = n, e;
	}
	function Bi(e) {
		var t = Pi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Vi(e, t, n) {
		return t = Pi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Hi = /* @__PURE__ */ new WeakMap();
	function Ui(e, t) {
		if (typeof e == "object" && e) {
			var n = Hi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Be(t)
			}, Hi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Be(t)
		};
	}
	var Wi = [], Gi = 0, Ki = null, qi = 0, Ji = [], Yi = 0, Xi = null, Zi = 1, Qi = "";
	function $i(e, t) {
		Wi[Gi++] = qi, Wi[Gi++] = Ki, Ki = e, qi = t;
	}
	function ea(e, t, n) {
		Ji[Yi++] = Zi, Ji[Yi++] = Qi, Ji[Yi++] = Xi, Xi = e;
		var r = Zi;
		e = Qi;
		var i = 32 - it(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - it(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Zi = 1 << 32 - it(t) + i | n << i | r, Qi = a + e;
		} else Zi = 1 << a | n << i | r, Qi = e;
	}
	function ta(e) {
		e.return !== null && ($i(e, 1), ea(e, 1, 0));
	}
	function na(e) {
		for (; e === Ki;) Ki = Wi[--Gi], Wi[Gi] = null, qi = Wi[--Gi], Wi[Gi] = null;
		for (; e === Xi;) Xi = Ji[--Yi], Ji[Yi] = null, Qi = Ji[--Yi], Ji[Yi] = null, Zi = Ji[--Yi], Ji[Yi] = null;
	}
	function ra(e, t) {
		Ji[Yi++] = Zi, Ji[Yi++] = Qi, Ji[Yi++] = Xi, Zi = t.id, Qi = t.overflow, Xi = e;
	}
	var ia = null, aa = null, z = !1, oa = null, sa = !1, ca = Error(i(519));
	function la(e) {
		throw ha(Ui(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ca;
	}
	function ua(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Dt] = e, t[Ot] = r, n) {
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
				Z("invalid", t), sn(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Z("invalid", t);
				break;
			case "textarea": Z("invalid", t), dn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || tp(t.textContent, n) ? (r.popover != null && (Z("beforetoggle", t), Z("toggle", t)), r.onScroll != null && Z("scroll", t), r.onScrollEnd != null && Z("scrollend", t), r.onClick != null && (t.onclick = bn), t = !0) : t = !1, t || la(e, !0);
	}
	function da(e) {
		for (ia = e.return; ia;) switch (ia.tag) {
			case 5:
			case 31:
			case 13:
				sa = !1;
				return;
			case 27:
			case 3:
				sa = !0;
				return;
			default: ia = ia.return;
		}
	}
	function fa(e) {
		if (e !== ia) return !1;
		if (!z) return da(e), z = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || $(e.type, e.memoizedProps)), n = !n), n && aa && la(e), da(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			aa = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			aa = dm(e);
		} else t === 27 ? (t = aa, Sp(e.type) ? (e = um, um = null, aa = e) : aa = t) : aa = ia ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function pa() {
		aa = ia = null, z = !1;
	}
	function ma() {
		var e = oa;
		return e !== null && (gd === null ? gd = e : gd.push.apply(gd, e), oa = null), e;
	}
	function ha(e) {
		oa === null ? oa = [e] : oa.push(e);
	}
	var ga = Ce(null), _a = null, va = null;
	function ya(e, t, n) {
		Te(ga, t._currentValue), t._currentValue = n;
	}
	function ba(e) {
		e._currentValue = ga.current, we(ga);
	}
	function xa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Sa(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), xa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), xa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), xa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
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
	function Ca(e, t, n, r) {
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
					Ur(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ke.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && Sa(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function wa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Ur(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ta(e) {
		_a = e, va = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ea(e) {
		return Oa(_a, e);
	}
	function Da(e, t) {
		return _a === null && Ta(e), Oa(e, t);
	}
	function Oa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, va === null) {
			if (e === null) throw Error(i(308));
			va = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else va = va.next = t;
		return n;
	}
	var ka = typeof AbortController < "u" ? AbortController : function() {
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
	}, Aa = t.unstable_scheduleCallback, ja = t.unstable_NormalPriority, Ma = {
		$$typeof: D,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Na() {
		return {
			controller: new ka(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Pa(e) {
		e.refCount--, e.refCount === 0 && Aa(ja, function() {
			e.controller.abort();
		});
	}
	function Fa(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Ia = null;
	function La(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Ra = null, za = 0, Ba = 0, Va = null;
	function Ha(e, t) {
		if (Ra === null) {
			var n = Ra = [];
			za = 0, Ba = Ff(), Va = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return za++, t.then(Ua, Ua), t;
	}
	function Ua() {
		if (--za === 0 && (Ia = null, Ra !== null)) {
			Va !== null && (Va.status = "fulfilled");
			var e = Ra;
			Ra = null, Ba = 0, Va = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Wa(e, t) {
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
	var Ga = j.S;
	j.S = function(e, t) {
		if (q = Ke(), typeof t == "object" && t && typeof t.then == "function" && Ha(e, t), Ia !== null) for (var n = xf; n !== null;) Fa(n, Ia), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = xf; r !== null;) Fa(r, n), r = r.next;
			if (Ba !== 0) {
				r = Ia, r === null && (r = Ia = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ga !== null && Ga(e, t);
	};
	var Ka = Ce(null);
	function qa() {
		var e = Ka.current;
		return e === null ? rd.pooledCache : e;
	}
	function Ja(e, t) {
		t === null ? Te(Ka, Ka.current) : Te(Ka, t.pool);
	}
	function Ya() {
		var e = qa();
		return e === null ? null : {
			parent: Ma._currentValue,
			pool: e
		};
	}
	var Xa = Error(i(460)), Za = Error(i(474)), Qa = Error(i(542)), $a = { then: function() {} };
	function eo(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function to(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(bn, bn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, ao(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(bn, bn);
				else {
					if (e = rd, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, ao(e), e;
				}
				throw ro = t, Xa;
		}
	}
	function no(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (ro = e, Xa) : e;
		}
	}
	var ro = null;
	function io() {
		if (ro === null) throw Error(i(459));
		var e = ro;
		return ro = null, e;
	}
	function ao(e) {
		if (e === Xa || e === Qa) throw Error(i(483));
	}
	var oo = null, so = 0;
	function co(e) {
		var t = so;
		return so += 1, oo === null && (oo = []), to(oo, e, t);
	}
	function lo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function uo(e, t) {
		throw t.$$typeof === ne ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function fo(e) {
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
			return e = R(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = zi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === ie ? (e = d(e, t, n.props.children, r, n.key), lo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ue && no(i) === t.type) ? (t = a(t, n.props), lo(t, n), t.return = e, t) : (t = Li(n.type, n.key, n.props, null, e.mode, r), lo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Vi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Ri(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = zi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case E: return n = Li(t.type, t.key, t.props, null, e.mode, n), lo(n, t), n.return = e, n;
					case re: return t = Vi(t, e.mode, n), t.return = e, t;
					case ue: return t = no(t), f(e, t, n);
				}
				if (ye(t) || ge(t)) return t = Ri(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, co(t), n);
				if (t.$$typeof === D) return f(e, Da(e, t), n);
				uo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case E: return n.key === i ? l(e, t, n, r) : null;
					case re: return n.key === i ? u(e, t, n, r) : null;
					case ue: return n = no(n), p(e, t, n, r);
				}
				if (ye(n) || ge(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, co(n), r);
				if (n.$$typeof === D) return p(e, t, Da(e, n), r);
				uo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case E: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case re: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ue: return r = no(r), m(e, t, n, r, i);
				}
				if (ye(r) || ge(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, co(r), i);
				if (r.$$typeof === D) return m(e, t, n, Da(t, r), i);
				uo(t, r);
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
			if (h === s.length) return n(i, d), z && $i(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return z && $i(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), z && $i(i, h), l;
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
			if (v.done) return n(a, h), z && $i(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return z && $i(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), z && $i(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === ie && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case E:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === ie) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), lo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ue && no(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), lo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === ie ? (c = Ri(o.props.children, e.mode, c, o.key), lo(c, o), c.return = e, e = c) : (c = Li(o.type, o.key, o.props, null, e.mode, c), lo(c, o), c.return = e, e = c);
						}
						return s(e);
					case re:
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
							c = Vi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ue: return o = no(o), _(e, r, o, c);
				}
				if (ye(o)) return h(e, r, o, c);
				if (ge(o)) {
					if (l = ge(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, co(o), c);
				if (o.$$typeof === D) return _(e, r, Da(e, o), c);
				uo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = zi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				so = 0;
				var i = _(e, t, n, r);
				return oo = null, i;
			} catch (t) {
				if (t === Xa || t === Qa) throw t;
				var a = Pi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var po = fo(!0), mo = fo(!1), ho = !1;
	function go(e) {
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
	function _o(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function vo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function yo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, U & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ji(e), Ai(e, null, n), t;
		}
		return Di(e, r, t, n), ji(e);
	}
	function bo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, N(e, n);
		}
	}
	function xo(e, t) {
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
	var So = !1;
	function Co() {
		if (So) {
			var e = Va;
			if (e !== null) throw e;
		}
	}
	function wo(e, t, n, r) {
		So = !1;
		var i = e.updateQueue;
		ho = !1;
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
				if (p ? (G & f) === f : (r & f) === f) {
					f !== 0 && f === Ba && (So = !0), u !== null && (u = u.next = {
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
								d = T({}, d, f);
								break a;
							case 2: ho = !0;
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
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), ud |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function To(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Eo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) To(n[e], t);
	}
	var Do = Ce(null), Oo = Ce(0);
	function ko(e, t) {
		e = ld, Te(Oo, e), Te(Do, t), ld = e | t.baseLanes;
	}
	function Ao() {
		Te(Oo, ld), Te(Do, Do.current);
	}
	function jo() {
		ld = Oo.current, we(Do), we(Oo);
	}
	var Mo = Ce(null), No = null;
	function Po(e) {
		var t = e.alternate;
		Te(zo, zo.current & 1), Te(Mo, e), No === null && (t === null || Do.current !== null || t.memoizedState !== null) && (No = e);
	}
	function Fo(e) {
		Te(zo, zo.current), Te(Mo, e), No === null && (No = e);
	}
	function Io(e) {
		e.tag === 22 ? (Te(zo, zo.current), Te(Mo, e), No === null && (No = e)) : Lo();
	}
	function Lo() {
		Te(zo, zo.current), Te(Mo, Mo.current);
	}
	function Ro(e) {
		we(Mo), No === e && (No = null), we(zo);
	}
	var zo = Ce(0);
	function Bo(e, t) {
		Te(Mo, Mo.current), Te(zo, t);
	}
	function Vo(e) {
		we(zo), we(Mo), No === e && (No = null);
	}
	function Ho(e) {
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
	var Uo = 0, B = null, V = null, Wo = null, Go = !1, Ko = !1, qo = !1, Jo = 0, Yo = 0, Xo = null, Zo = 0;
	function Qo() {
		throw Error(i(321));
	}
	function $o(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Ur(e[n], t[n])) return !1;
		return !0;
	}
	function es(e, t, n, r, i, a) {
		return Uo = a, B = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, j.H = e === null || e.memoizedState === null ? _c : vc, qo = !1, a = n(r, i), qo = !1, Ko && (a = ns(t, n, r, i)), ts(e), a;
	}
	function ts(e) {
		j.H = gc;
		var t = V !== null && V.next !== null;
		if (Uo = 0, Wo = V = B = null, Go = !1, Yo = 0, Xo = null, t) throw Error(i(300));
		e === null || Fc || (e = e.dependencies, e !== null && wa(e) && (Fc = !0));
	}
	function ns(e, t, n, r) {
		B = e;
		var a = 0;
		do {
			if (Ko && (Xo = null), Yo = 0, Ko = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Wo = V = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			j.H = yc, o = t(n, r);
		} while (Ko);
		return o;
	}
	function rs() {
		var e = j.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? us(t) : t, e = e.useState()[0], (V === null ? null : V.memoizedState) !== e && (B.flags |= 1024), t;
	}
	function is() {
		var e = Jo !== 0;
		return Jo = 0, e;
	}
	function as(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function os(e) {
		if (Go) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Go = !1;
		}
		Uo = 0, Wo = V = B = null, Ko = !1, Yo = Jo = 0, Xo = null;
	}
	function ss() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Wo === null ? B.memoizedState = Wo = e : Wo = Wo.next = e, Wo;
	}
	function cs() {
		if (V === null) {
			var e = B.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = V.next;
		var t = Wo === null ? B.memoizedState : Wo.next;
		if (t !== null) Wo = t, V = e;
		else {
			if (e === null) throw B.alternate === null ? Error(i(467)) : Error(i(310));
			V = e, e = {
				memoizedState: V.memoizedState,
				baseState: V.baseState,
				baseQueue: V.baseQueue,
				queue: V.queue,
				next: null
			}, Wo === null ? B.memoizedState = Wo = e : Wo = Wo.next = e;
		}
		return Wo;
	}
	function ls() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function us(e) {
		var t = Yo;
		return Yo += 1, Xo === null && (Xo = []), e = to(Xo, e, t), t = B, (Wo === null ? t.memoizedState : Wo.next) === null && (t = t.alternate, j.H = t === null || t.memoizedState === null ? _c : vc), e;
	}
	function ds(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return us(e);
			if (e.$$typeof === me) return;
			if (e.$$typeof === D) return Ea(e);
		}
		throw Error(i(438, String(e)));
	}
	function fs(e) {
		var t = null, n = B.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = B.alternate;
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
		}, n === null && (n = ls(), B.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = fe;
		return t.index++, n;
	}
	function ps(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ms(e) {
		return hs(cs(), V, e);
	}
	function hs(e, t, n) {
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
				if (f === u.lane ? (Uo & f) === f : (G & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ba && (d = !0);
					else if ((Uo & p) === p) {
						u = u.next, p === Ba && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, B.lanes |= p, ud |= p;
					f = u.action, qo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, B.lanes |= f, ud |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Ur(o, e.memoizedState) && (Fc = !0, d && (n = Va, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function gs(e) {
		var t = cs(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Ur(o, t.memoizedState) || (Fc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function _s(e, t, n) {
		var r = B, a = cs(), o = z;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Ur((V || a).memoizedState, n);
		if (s && (a.memoizedState = n, Fc = !0), a = a.queue, Hs(bs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Wo !== null && !!(Wo.memoizedState.tag & 1), Ls(e ? 9 : 8, { destroy: void 0 }, ys.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, rd === null) throw Error(i(349));
			o || Uo & 127 || vs(r, t, n);
		}
		return n;
	}
	function vs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = B.updateQueue, t === null ? (t = ls(), B.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function ys(e, t, n, r) {
		t.value = n, t.getSnapshot = r, xs(t) && Ss(e);
	}
	function bs(e, t, n) {
		return n(function() {
			xs(t) && Ss(e);
		});
	}
	function xs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Ur(e, n);
		} catch {
			return !0;
		}
	}
	function Ss(e) {
		var t = ki(e, 2);
		t !== null && Id(t, e, 2);
	}
	function Cs(e) {
		var t = ss();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), qo) {
				rt(!0);
				try {
					n();
				} finally {
					rt(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ps,
			lastRenderedState: e
		}, t;
	}
	function ws(e, t, n, r) {
		return e.baseState = n, hs(e, V, typeof r == "function" ? r : ps);
	}
	function Ts(e, t, n, r, a) {
		if (pc(e)) throw Error(i(485));
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
			j.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Es(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Es(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = j.T, o = {};
			o.types = a === null ? null : a.types, j.T = o;
			try {
				var s = n(i, r), c = j.S;
				c !== null && c(o, s), Ds(e, t, s);
			} catch (n) {
				ks(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), j.T = a;
			}
		} else try {
			a = n(i, r), Ds(e, t, a);
		} catch (n) {
			ks(e, t, n);
		}
	}
	function Ds(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Os(e, t, n);
		}, function(n) {
			return ks(e, t, n);
		}) : Os(e, t, n);
	}
	function Os(e, t, n) {
		t.status = "fulfilled", t.value = n, As(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Es(e, n)));
	}
	function ks(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, As(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function As(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function js(e, t) {
		return t;
	}
	function Ms(e, t) {
		if (z) {
			var n = rd.formState;
			if (n !== null) {
				a: {
					var r = B;
					if (z) {
						if (aa) {
							b: {
								for (var i = aa, a = sa; i.nodeType !== 8;) {
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
								aa = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						la(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = ss(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: js,
			lastRenderedState: t
		}, n.queue = r, n = uc.bind(null, B, r), r.dispatch = n, r = Cs(!1), a = fc.bind(null, B, !1, r.queue), r = ss(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ts.bind(null, B, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Ns(e) {
		return Ps(cs(), V, e);
	}
	function Ps(e, t, n) {
		if (t = hs(e, t, js)[0], e = ms(ps)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = us(t);
		} catch (e) {
			throw e === Xa ? Qa : e;
		}
		else r = t;
		t = cs();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (B.flags |= 2048, Ls(9, { destroy: void 0 }, Fs.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Fs(e, t) {
		e.action = t;
	}
	function Is(e) {
		var t = cs(), n = V;
		if (n !== null) return Ps(t, n, e);
		cs(), t = t.memoizedState, n = cs();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ls(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = B.updateQueue, t === null && (t = ls(), B.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Rs() {
		return cs().memoizedState;
	}
	function zs(e, t, n, r) {
		var i = ss();
		B.flags |= e, i.memoizedState = Ls(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Bs(e, t, n, r) {
		var i = cs();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		V !== null && r !== null && $o(r, V.memoizedState.deps) ? i.memoizedState = Ls(t, a, n, r) : (B.flags |= e, i.memoizedState = Ls(1 | t, a, n, r));
	}
	function Vs(e, t) {
		zs(8390656, 8, e, t);
	}
	function Hs(e, t) {
		Bs(2048, 8, e, t);
	}
	function Us(e) {
		B.flags |= 4;
		var t = B.updateQueue;
		if (t === null) t = ls(), B.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Ws(e) {
		var t = cs().memoizedState;
		return Us({
			ref: t,
			nextImpl: e
		}), function() {
			if (U & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Gs(e, t) {
		return Bs(4, 2, e, t);
	}
	function Ks(e, t) {
		return Bs(4, 4, e, t);
	}
	function qs(e, t) {
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
	function Js(e, t, n) {
		n = n == null ? null : n.concat([e]), Bs(4, 4, qs.bind(null, t, e), n);
	}
	function Ys() {}
	function Xs(e, t) {
		var n = cs();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && $o(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Zs(e, t) {
		var n = cs();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && $o(t, r[1])) return r[0];
		if (r = e(), qo) {
			rt(!0);
			try {
				e();
			} finally {
				rt(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Qs(e, t, n) {
		return n === void 0 || Uo & 1073741824 && !(G & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Pd(), B.lanes |= e, ud |= e, n);
	}
	function $s(e, t, n, r) {
		return Ur(n, t) ? n : Do.current === null ? !(Uo & 106) || Uo & 1073741824 && !(G & 261930) ? (Fc = !0, e.memoizedState = n) : (e = Pd(), B.lanes |= e, ud |= e, t) : (e = Qs(e, n, r), Ur(e, t) || (Fc = !0), e);
	}
	function ec(e, t, n, r, i) {
		var a = M.p;
		M.p = a !== 0 && 8 > a ? a : 8;
		var o = j.T, s = {};
		s.types = o === null ? null : o.types, j.T = s, fc(e, !1, t, n);
		try {
			var c = i(), l = j.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? dc(e, t, Wa(c, r), Nd(e)) : dc(e, t, r, Nd(e));
		} catch (n) {
			dc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Nd());
		} finally {
			M.p = a, o !== null && s.types !== null && (o.types = s.types), j.T = o;
		}
	}
	function tc() {}
	function nc(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = rc(e).queue;
		ec(e, a, t, be, n === null ? tc : function() {
			return ic(e), n(r);
		});
	}
	function rc(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: be,
			baseState: be,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ps,
				lastRenderedState: be
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
				lastRenderedReducer: ps,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function ic(e) {
		var t = rc(e);
		t.next === null && (t = e.alternate.memoizedState), dc(e, t.next.queue, {}, Nd());
	}
	function ac() {
		return Ea(sh);
	}
	function oc() {
		return cs().memoizedState;
	}
	function sc() {
		return cs().memoizedState;
	}
	function cc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Nd();
					e = vo(n);
					var r = yo(t, e, n);
					r !== null && (Id(r, t, n), bo(r, t, n)), t = { cache: Na() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function lc(e, t, n) {
		var r = Nd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, pc(e) ? mc(t, n) : (n = Oi(e, t, n, r), n !== null && (Id(n, e, r), hc(n, t, r)));
	}
	function uc(e, t, n) {
		dc(e, t, n, Nd());
	}
	function dc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (pc(e)) mc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Ur(s, o)) return Di(e, t, i, 0), rd === null && Ei(), !1;
			} catch {}
			if (n = Oi(e, t, i, r), n !== null) return Id(n, e, r), hc(n, t, r), !0;
		}
		return !1;
	}
	function fc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Ff(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, pc(e)) {
			if (t) throw Error(i(479));
		} else t = Oi(e, n, r, 2), t !== null && Id(t, e, 2);
	}
	function pc(e) {
		var t = e.alternate;
		return e === B || t !== null && t === B;
	}
	function mc(e, t) {
		Ko = Go = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function hc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, N(e, n);
		}
	}
	var gc = {
		readContext: Ea,
		use: ds,
		useCallback: Qo,
		useContext: Qo,
		useEffect: Qo,
		useImperativeHandle: Qo,
		useLayoutEffect: Qo,
		useInsertionEffect: Qo,
		useMemo: Qo,
		useReducer: Qo,
		useRef: Qo,
		useState: Qo,
		useDebugValue: Qo,
		useDeferredValue: Qo,
		useTransition: Qo,
		useSyncExternalStore: Qo,
		useId: Qo,
		useHostTransitionStatus: Qo,
		useFormState: Qo,
		useActionState: Qo,
		useOptimistic: Qo,
		useMemoCache: Qo,
		useCacheRefresh: Qo,
		useEffectEvent: Qo
	}, _c = {
		readContext: Ea,
		use: ds,
		useCallback: function(e, t) {
			return ss().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ea,
		useEffect: Vs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), zs(4194308, 4, qs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return zs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			zs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = ss();
			t = t === void 0 ? null : t;
			var r = e();
			if (qo) {
				rt(!0);
				try {
					e();
				} finally {
					rt(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = ss();
			if (n !== void 0) {
				var i = n(t);
				if (qo) {
					rt(!0);
					try {
						n(t);
					} finally {
						rt(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = lc.bind(null, B, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = ss();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Cs(e);
			var t = e.queue, n = uc.bind(null, B, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ys,
		useDeferredValue: function(e, t) {
			return Qs(ss(), e, t);
		},
		useTransition: function() {
			var e = Cs(!1);
			return e = ec.bind(null, B, e.queue, !0, !1), ss().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = B, a = ss();
			if (z) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), rd === null) throw Error(i(349));
				G & 127 || vs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Vs(bs.bind(null, r, o, e), [e]), r.flags |= 2048, Ls(9, { destroy: void 0 }, ys.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = ss(), t = rd.identifierPrefix;
			if (z) {
				var n = Qi, r = Zi;
				n = (r & ~(1 << 32 - it(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Jo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Zo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: ac,
		useFormState: Ms,
		useActionState: Ms,
		useOptimistic: function(e) {
			var t = ss();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = fc.bind(null, B, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: fs,
		useCacheRefresh: function() {
			return ss().memoizedState = cc.bind(null, B);
		},
		useEffectEvent: function(e) {
			var t = ss(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (U & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, vc = {
		readContext: Ea,
		use: ds,
		useCallback: Xs,
		useContext: Ea,
		useEffect: Hs,
		useImperativeHandle: Js,
		useInsertionEffect: Gs,
		useLayoutEffect: Ks,
		useMemo: Zs,
		useReducer: ms,
		useRef: Rs,
		useState: function() {
			return ms(ps);
		},
		useDebugValue: Ys,
		useDeferredValue: function(e, t) {
			return $s(cs(), V.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ms(ps)[0], t = cs().memoizedState;
			return [typeof e == "boolean" ? e : us(e), t];
		},
		useSyncExternalStore: _s,
		useId: oc,
		useHostTransitionStatus: ac,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e, t) {
			return ws(cs(), V, e, t);
		},
		useMemoCache: fs,
		useCacheRefresh: sc,
		useEffectEvent: Ws
	}, yc = {
		readContext: Ea,
		use: ds,
		useCallback: Xs,
		useContext: Ea,
		useEffect: Hs,
		useImperativeHandle: Js,
		useInsertionEffect: Gs,
		useLayoutEffect: Ks,
		useMemo: Zs,
		useReducer: gs,
		useRef: Rs,
		useState: function() {
			return gs(ps);
		},
		useDebugValue: Ys,
		useDeferredValue: function(e, t) {
			var n = cs();
			return V === null ? Qs(n, e, t) : $s(n, V.memoizedState, e, t);
		},
		useTransition: function() {
			var e = gs(ps)[0], t = cs().memoizedState;
			return [typeof e == "boolean" ? e : us(e), t];
		},
		useSyncExternalStore: _s,
		useId: oc,
		useHostTransitionStatus: ac,
		useFormState: Is,
		useActionState: Is,
		useOptimistic: function(e, t) {
			var n = cs();
			return V === null ? (n.baseState = e, [e, n.queue.dispatch]) : ws(n, V, e, t);
		},
		useMemoCache: fs,
		useCacheRefresh: sc,
		useEffectEvent: Ws
	};
	function bc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : T({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var xc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Nd(), i = vo(r);
			i.payload = t, n != null && (i.callback = n), t = yo(e, i, r), t !== null && (Id(t, e, r), bo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Nd(), i = vo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = yo(e, i, r), t !== null && (Id(t, e, r), bo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Nd(), r = vo(n);
			r.tag = 2, t != null && (r.callback = t), t = yo(e, r, n), t !== null && (Id(t, e, n), bo(t, e, n));
		}
	};
	function Sc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Wr(n, r) || !Wr(i, a) : !0;
	}
	function Cc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && xc.enqueueReplaceState(t, t.state, null);
	}
	function wc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = T({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Tc(e) {
		Si(e);
	}
	function Ec(e) {
		console.error(e);
	}
	function Dc(e) {
		Si(e);
	}
	function Oc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function kc(e, t, n) {
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
	function Ac(e, t, n) {
		return n = vo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Oc(e, t);
		}, n;
	}
	function jc(e) {
		return e = vo(e), e.tag = 3, e;
	}
	function Mc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				kc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			kc(t, n, r), typeof i != "function" && (xd === null ? xd = /* @__PURE__ */ new Set([this]) : xd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Nc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Ca(t, n, a, !0), n = Mo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return No === null ? qd() : n.alternate === null && K === 0 && (K = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === $a ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), hf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === $a ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), hf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return hf(e, r, a), qd(), !1;
		}
		if (z) return t = Mo.current, t === null ? (r !== ca && (t = Error(i(423), { cause: r }), ha(Ui(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Ui(r, n), a = Ac(e.stateNode, r, a), xo(e, a), K !== 4 && (K = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ca && (e = Error(i(422), { cause: r }), ha(Ui(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Ui(o, n), hd === null ? hd = [o] : hd.push(o), K !== 4 && (K = 2), t === null) return !0;
		r = Ui(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Ac(n.stateNode, r, e), xo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (xd === null || !xd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = jc(a), Mc(a, e, n, r), xo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Pc = Error(i(461)), Fc = !1;
	function Ic(e, t, n, r) {
		t.child = e === null ? mo(t, null, n, r) : po(t, e.child, n, r);
	}
	function Lc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ta(t), r = es(e, t, n, o, a, i), s = is(), e !== null && !Fc ? (as(e, t, i), dl(e, t, i)) : (z && s && ta(t), t.flags |= 1, Ic(e, t, r, i), t.child);
	}
	function Rc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Fi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, zc(e, t, a, r, i)) : (e = Li(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !fl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Wr : n, n(o, r) && e.ref === t.ref) return dl(e, t, i);
		}
		return t.flags |= 1, e = R(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function zc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Wr(a, r) && e.ref === t.ref) {
				if (Fc = !1, t.pendingProps = r = a, fl(e, i)) e.flags & 131072 && (Fc = !0);
				else return t.lanes = e.lanes, dl(e, t, i);
			}
		}
		return qc(e, t, n, r, i);
	}
	function Bc(e, t, n, r) {
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
				return Hc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ja(t, a === null ? null : a.cachePool), a === null ? Ao() : ko(t, a), Io(t);
			else return r = t.lanes = 536870912, Hc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ja(t, null), Ao(), Lo()) : (Ja(t, a.cachePool), ko(t, a), Lo(), t.memoizedState = null);
		return Ic(e, t, i, n), t.child;
	}
	function Vc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Hc(e, t, n, r, i) {
		var a = qa();
		return a = a === null ? null : {
			parent: Ma._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ja(t, null), Ao(), Io(t), e !== null && Ca(e, t, r, !0), t.childLanes = i, null;
	}
	function Uc(e, t) {
		return t = nl({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Wc(e, t, n) {
		return po(t, e.child, null, n), e = Uc(t, t.pendingProps), e.flags |= 2, Ro(t), t.memoizedState = null, e;
	}
	function Gc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (z) {
				if (r.mode === "hidden") return e = Uc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Vc(null, e);
				if (Fo(t), (e = aa) ? (e = am(e, sa), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Xi === null ? null : {
						id: Zi,
						overflow: Qi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Bi(e), n.return = t, t.child = n, ia = t, aa = null)) : e = null, e === null) throw la(t);
				return t.lanes = 536870912, null;
			}
			return Uc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Fo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Wc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Fc || Ca(e, t, n, !1), a = (n & e.childLanes) !== 0, Fc || a) {
				if (Do.current === null) {
					if (r = rd, r !== null && (s = xt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ki(e, s), Id(r, e, s), Pc;
					qd();
				}
				t = Wc(e, t, n);
			} else e = o.treeContext, aa = lm(s.nextSibling), ia = t, z = !0, oa = null, sa = !1, e !== null && ra(t, e), t = Uc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = R(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Kc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function qc(e, t, n, r, i) {
		return Ta(t), n = es(e, t, n, r, void 0, i), r = is(), e !== null && !Fc ? (as(e, t, i), dl(e, t, i)) : (z && r && ta(t), t.flags |= 1, Ic(e, t, n, i), t.child);
	}
	function Jc(e, t, n, r, i, a) {
		return Ta(t), t.updateQueue = null, n = ns(t, r, n, i), ts(e), r = is(), e !== null && !Fc ? (as(e, t, a), dl(e, t, a)) : (z && r && ta(t), t.flags |= 1, Ic(e, t, n, a), t.child);
	}
	function Yc(e, t, n, r, i) {
		if (Ta(t), t.stateNode === null) {
			var a = Mi, o = n.contextType;
			typeof o == "object" && o && (a = Ea(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = xc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, go(t), o = n.contextType, a.context = typeof o == "object" && o ? Ea(o) : Mi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (bc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && xc.enqueueReplaceState(a, a.state, null), wo(t, r, a, i), Co(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = wc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Mi, typeof u == "object" && u && (o = Ea(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Cc(t, a, r, o), ho = !1;
			var f = t.memoizedState;
			a.state = f, wo(t, r, a, i), Co(), l = t.memoizedState, s || f !== l || ho ? (typeof d == "function" && (bc(t, n, d, r), l = t.memoizedState), (c = ho || Sc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, _o(e, t), o = t.memoizedProps, u = wc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Mi, typeof l == "object" && l && (c = Ea(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Cc(t, a, r, c), ho = !1, f = t.memoizedState, a.state = f, wo(t, r, a, i), Co();
			var p = t.memoizedState;
			o !== d || f !== p || ho || e !== null && e.dependencies !== null && wa(e.dependencies) ? (typeof s == "function" && (bc(t, n, s, r), p = t.memoizedState), (u = ho || Sc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && wa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Kc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = po(t, e.child, null, i), t.child = po(t, null, n, i)) : Ic(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = dl(e, t, i), e;
	}
	function Xc(e, t, n, r) {
		return pa(), t.flags |= 256, Ic(e, t, n, r), t.child;
	}
	var Zc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Qc(e) {
		return {
			baseLanes: e,
			cachePool: Ya()
		};
	}
	function $c(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= pd), e;
	}
	function el(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(zo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (z) {
				if (i ? Po(t) : Lo(), (e = aa) ? (e = am(e, sa), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Xi === null ? null : {
						id: Zi,
						overflow: Qi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Bi(e), n.return = t, t.child = n, ia = t, aa = null)) : e = null, e === null) throw la(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Lo(), i = t.mode, a = nl({
				mode: "hidden",
				children: a
			}, i), r = Ri(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Qc(n), r.childLanes = $c(e, o, n), t.memoizedState = Zc, Vc(null, r)) : (Po(t), tl(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return il(e, t, a, o, r, c, s, n);
		}
		return i ? (Lo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = R(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Ri(i, a, n, null), i.flags |= 2) : i = R(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Vc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Qc(n) : (a = i.cachePool, a === null ? a = Ya() : (s = Ma._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = $c(e, o, n), t.memoizedState = Zc, Vc(e.child, r)) : (Po(t), n = e.child, e = n.sibling, n = R(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function tl(e, t) {
		return t = nl({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function nl(e, t) {
		return e = Pi(22, e, null, t), e.lanes = 0, e;
	}
	function rl(e, t, n) {
		return po(t, e.child, null, n), e = tl(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function il(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Po(t), t.flags &= -257, rl(e, t, c)) : t.memoizedState === null ? (Lo(), o = a.fallback, s = t.mode, a = nl({
			mode: "visible",
			children: a.children
		}, s), o = Ri(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, po(t, e.child, null, c), a = t.child, a.memoizedState = Qc(c), a.childLanes = $c(e, r, c), t.memoizedState = Zc, Vc(null, a)) : (Lo(), t.child = e.child, t.flags |= 128, null);
		if (Po(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, ha({
				value: a,
				source: null,
				stack: null
			})), rl(e, t, c);
		}
		if (Fc || Ca(e, t, c, !1), r = (c & e.childLanes) !== 0, Fc || r) {
			if (Do.current !== null) return rl(e, t, c);
			if (r = rd, r !== null && (a = xt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, ki(e, a), Id(r, e, a), Pc;
			return om(o) || qd(), rl(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, aa = lm(o.nextSibling), ia = t, z = !0, oa = null, sa = !1, e !== null && ra(t, e), t = tl(t, a.children), t.flags |= 134221824, t);
	}
	function al(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), xa(e.return, t, n);
	}
	function ol(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Ho(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function sl(e, t, n, r, i, a) {
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
	function cl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ll(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = zo.current;
		if (t.flags & 128) return Bo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Bo(t, o), i === "backwards" && e !== null ? (cl(e), Ic(e, t, r, n), cl(e)) : Ic(e, t, r, n), r = z ? qi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && al(e, n, t);
			else if (e.tag === 19) al(e, n, t);
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
				n = ol(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, cl(t)), sl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Ho(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				sl(t, !0, n, null, a, r);
				break;
			case "together":
				sl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = ol(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), sl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function ul(e, t, n) {
		var r = t.pendingProps;
		return ya(t, t.type, r.value), Ic(e, t, r.children, n), t.child;
	}
	function dl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), ud |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Ca(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = R(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = R(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function fl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && wa(e)));
	}
	function pl(e, t, n) {
		switch (t.tag) {
			case 3:
				Ae(t, t.stateNode.containerInfo), ya(t, Ma, e.memoizedState.cache), pa();
				break;
			case 27:
			case 5:
				Me(t);
				break;
			case 4:
				Ae(t, t.stateNode.containerInfo);
				break;
			case 10:
				ya(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Fo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Po(t), t.flags |= 128, null;
					r = Ca(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? el(e, t, n) : (Po(t), e = dl(e, t, n), e === null ? null : e.sibling);
				}
				Po(t);
				break;
			case 19:
				if (t.flags & 128) return ll(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (Ca(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ll(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Bo(t, zo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Bc(e, t, n, t.pendingProps);
			case 24: ya(t, Ma, e.memoizedState.cache);
		}
		return dl(e, t, n);
	}
	function ml(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Fc = !0;
			else {
				if (!fl(e, n) && !(t.flags & 128)) return Fc = !1, pl(e, t, n);
				Fc = !!(e.flags & 131072);
			}
		} else Fc = !1, z && t.flags & 1048576 && ea(t, qi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = no(t.elementType), t.type = e, typeof e == "function") Fi(e) ? (r = wc(e, r), t.tag = 1, t = Yc(null, t, e, r, n)) : (t.tag = 0, t = qc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === O) {
								t.tag = 11, t = Lc(null, t, e, r, n);
								break a;
							}
							if (a === k) {
								t.tag = 14, t = Rc(null, t, e, r, n);
								break a;
							}
							if (a === D) {
								t.tag = 10, t.type = e, t = ul(null, t, n);
								break a;
							}
						}
						throw t = ve(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return qc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = wc(r, t.pendingProps), Yc(e, t, r, a, n);
			case 3:
				a: {
					if (Ae(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, _o(e, t), wo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ya(t, Ma, r), r !== o.cache && Sa(t, [Ma], n, !0), Co(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Xc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Ui(Error(i(424)), t), ha(a), t = Xc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (aa = lm(e.firstChild), ia = t, z = !0, oa = null, sa = !0, n = mo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (pa(), r === a) {
							t = dl(e, t, n);
							break a;
						}
						Ic(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Kc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : z || (t.stateNode = pp(t.type, t.pendingProps, Oe.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Me(t), e === null && z && (r = t.stateNode = hm(t.type, t.pendingProps, Oe.current), ia = t, sa = !0, a = aa, Sp(t.type) ? (um = a, aa = lm(r.firstChild)) : aa = a), Ic(e, t, t.pendingProps.children, n), Kc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && z && ((a = r = aa) && (r = rm(r, t.type, t.pendingProps, sa), r === null ? a = !1 : (t.stateNode = r, ia = t, aa = lm(r.firstChild), sa = !1, a = !0)), a || la(t)), Me(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, $(a, o) ? r = null : s !== null && $(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = es(e, t, rs, null, null, n), sh._currentValue = a), Kc(e, t), Ic(e, t, r, n), t.child;
			case 6: return e === null && z && ((e = n = aa) && (n = im(n, t.pendingProps, sa), n === null ? e = !1 : (t.stateNode = n, ia = t, aa = null, e = !0)), e || la(t)), null;
			case 13: return el(e, t, n);
			case 4: return Ae(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = po(t, null, r, n) : Ic(e, t, r, n), t.child;
			case 11: return Lc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Kc(e, t), Ic(e, t, r, n), t.child;
			case 8: return Ic(e, t, t.pendingProps.children, n), t.child;
			case 12: return Ic(e, t, t.pendingProps.children, n), t.child;
			case 10: return ul(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Ta(t), a = Ea(a), r = r(a), t.flags |= 1, Ic(e, t, r, n), t.child;
			case 14: return Rc(e, t, t.type, t.pendingProps, n);
			case 15: return zc(e, t, t.type, t.pendingProps, n);
			case 19: return ll(e, t, n);
			case 31: return Gc(e, t, n);
			case 22: return Bc(e, t, n, t.pendingProps);
			case 24: return Ta(t), r = Ea(Ma), e === null ? (a = qa(), a === null && (a = rd, o = Na(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, go(t), ya(t, Ma, a)) : ((e.lanes & n) !== 0 && (_o(e, t), wo(t, null, null, n), Co()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ya(t, Ma, r), r !== a.cache && Sa(t, [Ma], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ya(t, Ma, r))), Ic(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : z && ta(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Kc(e, t), Ic(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function hl(e) {
		e.flags |= 4;
	}
	function gl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Wd()) e.flags |= 8192;
				else throw ro = $a, Za;
			}
		} else e.flags &= -16777217;
	}
	function _l(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Wd()) e.flags |= 8192;
			else throw ro = $a, Za;
		}
	}
	function vl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : gt(), e.lanes |= t, md |= t);
	}
	function yl(e, t) {
		if (!z) switch (e.tailMode) {
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
	function bl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function xl(e, t, n) {
		var r = t.pendingProps;
		switch (na(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return bl(t), null;
			case 1: return bl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ba(Ma), je(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (fa(t) ? hl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, ma())), bl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (hl(t), o === null ? (bl(t), gl(t, a, null, r, n)) : (bl(t), _l(t, o))) : o ? o === e.memoizedState ? (bl(t), t.flags &= -16777217) : (hl(t), bl(t), _l(t, o)) : (e = e.memoizedProps, e !== r && hl(t), bl(t), gl(t, a, e, r, n)), null;
			case 27:
				if (Ne(t), n = Oe.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && hl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return bl(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ee.current, fa(t) ? ua(t, e) : (e = hm(a, r, n), t.stateNode = e, hl(t));
				}
				return bl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Ne(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && hl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return bl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ee.current, fa(t)) ua(t, o);
					else {
						var s = up(Oe.current);
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
						o[Dt] = t, o[Ot] = r;
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
						r && hl(t);
					}
				}
				return bl(t), t.subtreeFlags &= -33554433, gl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && hl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Oe.current, fa(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ia, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Dt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || tp(e.nodeValue, n)), e || la(t, !0);
					} else e = up(e).createTextNode(r), e[Dt] = t, t.stateNode = e;
				}
				return bl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = fa(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Dt] = t;
						} else pa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						bl(t), e = !1;
					} else n = ma(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Ro(t), t) : (Ro(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return bl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = fa(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Dt] = t;
						} else pa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						bl(t), a = !1;
					} else a = ma(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Ro(t), t) : (Ro(t), null);
				}
				return Ro(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), vl(t, t.updateQueue), bl(t), null);
			case 4: return je(), e === null && Gf(t.stateNode.containerInfo), t.flags |= 67108864, bl(t), null;
			case 10: return ba(t.type), bl(t), null;
			case 19:
				if (Vo(t), r = t.memoizedState, r === null) return bl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) yl(r, !1);
					else {
						if (K !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Ho(e), o !== null) {
								for (t.flags |= 128, yl(r, !1), e = o.updateQueue, t.updateQueue = e, vl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ii(n, e), n = n.sibling;
								return Bo(t, zo.current & 1 | 2), z && $i(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Ke() > yd && (t.flags |= 128, a = !0, yl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Ho(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, vl(t, e), yl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !z) return bl(t), null;
						} else 2 * Ke() - r.renderingStartTime > yd && n !== 536870912 && (t.flags |= 128, a = !0, yl(r, !1), t.lanes = 4194304);
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
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ke(), e.sibling = null, o = zo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || z ? Bo(t, o) : (n = o, Te(Mo, t), Te(zo, n), No === null && (No = t)), z && $i(t, r.treeForkCount), e;
				}
				return bl(t), null;
			case 22:
			case 23: return Ro(t), jo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (bl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : bl(t), n = t.updateQueue, n !== null && vl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && we(Ka), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ba(Ma), bl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, bl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function Sl(e, t) {
		switch (na(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return ba(Ma), je(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Ne(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Ro(t), t.alternate === null) throw Error(i(340));
					pa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Ro(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					pa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Vo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return je(), null;
			case 10: return ba(t.type), null;
			case 22:
			case 23: return Ro(t), jo(), e !== null && we(Ka), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return ba(Ma), null;
			case 25: return null;
			default: return null;
		}
	}
	function Cl(e, t) {
		switch (na(t), t.tag) {
			case 3:
				ba(Ma), je();
				break;
			case 26:
			case 27:
			case 5:
				Ne(t);
				break;
			case 4:
				je();
				break;
			case 31:
				t.memoizedState !== null && Ro(t);
				break;
			case 13:
				Ro(t);
				break;
			case 19:
				Vo(t);
				break;
			case 10:
				ba(t.type);
				break;
			case 22:
			case 23:
				Ro(t), jo(), e !== null && we(Ka);
				break;
			case 24: ba(Ma);
		}
	}
	function wl(e, t) {
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
			X(t, t.return, e);
		}
	}
	function Tl(e, t, n) {
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
								X(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			X(t, t.return, e);
		}
	}
	function El(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Eo(t, n);
			} catch (t) {
				X(e, e.return, t);
			}
		}
	}
	function Dl(e, t, n) {
		n.props = wc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			X(e, t, n);
		}
	}
	function Ol(e, t) {
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
						var i = e.stateNode, a = yi(e.memoizedProps, i);
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
			X(e, t, n);
		}
	}
	function kl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				X(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				X(e, t, n);
			}
			else n.current = null;
		}
	}
	function Al(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function jl(e) {
		for (var t = e.return; t !== null && (Pl(t) && em(e.stateNode, t.stateNode), !Nl(t));) t = t.return;
	}
	function Ml(e) {
		for (var t = e.return; t !== null && (Pl(t) && tm(e.stateNode, t.stateNode), !Nl(t));) t = t.return;
	}
	function Nl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Pl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Fl(e) {
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
			X(e, e.return, t);
		}
	}
	function Il(e, t, n) {
		try {
			var r = e.stateNode;
			ap(r, e.type, n, t), r[Ot] = t;
		} catch (t) {
			X(e, e.return, t);
		}
	}
	function Ll(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Rl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Ll(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function zl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = bn)), Al(e, r), L = !0;
		else if (i !== 4 && (i === 27 && (Al(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (zl(e, t, n, r), e = e.sibling; e !== null;) zl(e, t, n, r), e = e.sibling;
	}
	function Bl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Al(e, r), L = !0;
		else if (i !== 4 && (i === 27 && (Al(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Bl(e, t, n, r), e = e.sibling; e !== null;) Bl(e, t, n, r), e = e.sibling;
	}
	function Vl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			rp(t, r, n), t[Dt] = e, t[Ot] = n;
		} catch (t) {
			X(e, e.return, t);
		}
	}
	var Hl = !1, Ul = null;
	function Wl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Hl = !0);
	}
	var Gl = null;
	function Kl() {
		var e = Gl;
		return Gl = null, e;
	}
	var ql = 0;
	function Jl(e, t, n, r, i) {
		return ql = 0, Yl(e.child, t, n, r, i);
	}
	function Yl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Hl = !0, Tp(o, ql === 0 ? t : t + "_" + ql, n), ql++;
			} else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && i || Yl(e.child, t, n, r, i) && (a = !0));
			e = e.sibling;
		}
		return a;
	}
	function Xl(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || Xl(e.child, t)), e = e.sibling;
	}
	function Zl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Zl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = xi(t.default, t.share), t !== "none" && (Jl(e, n, t, null, !1) || Xl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Ql(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = yi(r, n), a = xi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Zl(e) : Jl(e, i, a, null, !1) ? (Zl(e), n.paired || t || Fd(e, r.onEnter)) : Xl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Ql(e, t), e = e.sibling;
		else Zl(e);
	}
	function $l(e) {
		if (Ul !== null && Ul.size !== 0) {
			var t = Ul;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = xi(n.default, n.share);
								if (a !== "none" && (Jl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Fd(e, n.onShare)) : Xl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					$l(e);
				}
				e = e.sibling;
			}
		}
	}
	function eu(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = yi(t, e.stateNode), r = Ul === null ? void 0 : Ul.get(n), i = xi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Jl(e, n, i, null, !1) ? r === void 0 ? Fd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Ul.delete(n), Fd(e, t.onShare)) : Xl(e.child, !1)), Ul !== null && $l(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else Ul !== null && $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = yi(t, e.stateNode);
				t = xi(t.default, t.update), e.flags &= -5, t !== "none" && Jl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && tu(e);
			e = e.sibling;
		}
	}
	function nu(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Xl(e.child, !1));
				}
				nu(e);
			}
			e = e.sibling;
		}
	}
	function ru(e) {
		if (e.tag === 30) e.stateNode.paired = null, Xl(e.child, !1), nu(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ru(e), e = e.sibling;
		else nu(e);
	}
	function iu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Xl(e.child, !1) : e.subtreeFlags & 33554432 && iu(e), e = e.sibling;
	}
	function au(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && ql < a.length) {
					var l = a[ql], u = Op(c);
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
				e.flags & 4 && Tp(c, ql === 0 ? n : n + "_" + ql, i), s && e.flags & 4 || (Gl === null && (Gl = []), Gl.push(c, ql === 0 ? r : r + "_" + ql, t.memoizedProps)), ql++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : au(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ou(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = yi(n, r), a = xi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				ql = 0, i = au(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Fd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ou(e, t);
			e = e.sibling;
		}
	}
	var su = !1, H = !1, cu = !1, lu = !1, uu = typeof WeakSet == "function" ? WeakSet : Set, du = null, fu = !1, pu = !1, mu = !1, hu = !1;
	function gu(e, t, n) {
		if (e = e.containerInfo, cp = gh, e = Yr(e), Xr(e)) {
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
		for (lp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, du = t, t = n ? 9270 : 1024; du !== null;) {
			if (e = du, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && eu(r[a]);
			if (e.alternate === null && e.flags & 2) n && Wl(e), _u(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && eu(r), _u(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Wl(e), _u(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, du = r) : (n && tu(e), _u(n));
			}
		}
		Ul = null;
	}
	function _u(e) {
		for (; du !== null;) {
			var t = du, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = wc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							X(t, t.return, e);
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
					n && r !== null && (n = yi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = xi(a.default, a.update), a !== "none" && Jl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, du = r;
				break;
			}
			du = t.return;
		}
	}
	function vu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Ru(e, n), r & 4 && wl(5, n);
				break;
			case 1:
				if (Ru(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						X(n, n.return, e);
					}
					else {
						var i = wc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							X(n, n.return, e);
						}
					}
				}
				r & 64 && El(n), r & 512 && Ol(n, n.return);
				break;
			case 3:
				if (Ru(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Eo(e, t);
					} catch (e) {
						X(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Vl(n);
			case 26:
			case 5:
				Ru(e, n), t === null && r & 4 && Fl(n), r & 512 && Ol(n, n.return);
				break;
			case 12:
				Ru(e, n);
				break;
			case 31:
				Ru(e, n), r & 4 && Du(e, n);
				break;
			case 13:
				Ru(e, n), r & 4 && Ou(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = vf.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || su, !r) {
					var a = t !== null && t.memoizedState !== null || H;
					t = su, i = H, su = r, (H = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Bu(e, n, r)) : Ru(e, n), su = t, H = i;
				}
				break;
			case 30:
				Ru(e, n), r & 512 && Ol(n, n.return);
				break;
			case 7: r & 512 && Ol(n, n.return);
			default: Ru(e, n);
		}
	}
	function yu(e, t) {
		for (e = e.child; e !== null;) bu(e, t), e = e.sibling;
	}
	function bu(e, t) {
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
					X(e, e.return, t);
				}
				xu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, L = !0;
				} catch (t) {
					X(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					X(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && yu(e, t);
				break;
			default: yu(e, t);
		}
	}
	function xu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						bu(n, r);
						break a;
					case 22:
						n.memoizedState === null && xu(n, r);
						break a;
					default: xu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function Su(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, Su(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Pt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var Cu = null, wu = !1;
	function Tu(e, t, n) {
		for (n = n.child; n !== null;) Eu(e, t, n), n = n.sibling;
	}
	function Eu(e, t, n) {
		if (nt && typeof nt.onCommitFiberUnmount == "function") try {
			nt.onCommitFiberUnmount(tt, n);
		} catch {}
		switch (n.tag) {
			case 26:
				H || kl(n, t), Tu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !H && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				H || kl(n, t), Ml(n);
				var r = Cu, i = wu;
				Sp(n.type) && (Cu = n.stateNode, wu = !1), Tu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), Cu = r, wu = i;
				break;
			case 5: H || kl(n, t), Ml(n);
			case 6:
				if (n.tag === 6 && Ml(n), r = Cu, i = wu, Cu = null, Tu(e, t, n), Cu = r, wu = i, Cu !== null) {
					if (wu) try {
						(Cu.nodeType === 9 ? Cu.body : Cu.nodeName === "HTML" ? Cu.ownerDocument.body : Cu).removeChild(n.stateNode), L = !0;
					} catch (e) {
						X(n, t, e);
					}
					else try {
						Cu.removeChild(n.stateNode), L = !0;
					} catch (e) {
						X(n, t, e);
					}
				}
				break;
			case 18:
				Cu !== null && (wu ? (e = Cu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(Cu, n.stateNode));
				break;
			case 4:
				r = Cu, i = wu, Cu = n.stateNode.containerInfo, wu = !0, Tu(e, t, n), Cu = r, wu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Tl(2, n, t), H || Tl(4, n, t), Tu(e, t, n);
				break;
			case 1:
				H || (kl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Dl(n, t, r)), Tu(e, t, n);
				break;
			case 21:
				Tu(e, t, n);
				break;
			case 22:
				H = (r = H) || n.memoizedState !== null, Tu(e, t, n), H = r;
				break;
			case 30:
				kl(n, t), Tu(e, t, n);
				break;
			case 7:
				H || kl(n, t), Tu(e, t, n);
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
				X(t, t.return, e);
			}
		}
	}
	function Ou(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			X(t, t.return, e);
		}
	}
	function ku(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new uu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new uu()), t;
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
							Cu = l.stateNode, wu = !1;
							break a;
						}
						break;
					case 5:
						Cu = l.stateNode, wu = !1;
						break a;
					case 3:
					case 4:
						Cu = l.stateNode.containerInfo, wu = !0;
						break a;
				}
				l = l.return;
			}
			if (Cu === null) throw Error(i(160));
			Eu(s, c, o), Cu = null, wu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
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
				ju(t, e, n), Pu(e), a & 4 && (Tl(3, e, e.return), wl(3, e), Tl(5, e, e.return));
				break;
			case 1:
				ju(t, e, n), Pu(e), a & 512 && (H || r === null || kl(r, r.return)), a & 64 && su && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Mu, ju(t, e, n), Pu(e), a & 512 && (H || r === null || kl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (su) e.stateNode = pp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[F] || r[Dt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), rp(r, t, n), r[Dt] = e, zt(r), t = r;
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
										r[Dt] = e, zt(r), t = r;
									}
									e.stateNode = t;
								}
							} else su || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Il(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || H || t.parentNode.removeChild(t)) : a.count--, n === null ? su || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				ju(t, e, n), Pu(e), a & 512 && (H || r === null || kl(r, r.return)), r !== null && a & 4 && Il(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = cu, cu = !1, ju(t, e, n), cu = o, Pu(e), a & 512 && (H || r === null || kl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						fn(t, ""), L = !0;
					} catch (t) {
						X(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Il(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (lu = !0);
				break;
			case 6:
				if (ju(t, e, n), Pu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, L = !0;
					} catch (t) {
						X(e, e.return, t);
					}
				}
				break;
			case 3:
				if (L = !1, Wm = null, o = Mu, Mu = bm(t.containerInfo), ju(t, e, n), Mu = o, Pu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					X(e, e.return, t);
				}
				lu && (lu = !1, Fu(e)), L = !1;
				break;
			case 4:
				a = cu, cu = su, r = Jt(), o = Mu, Mu = bm(e.stateNode.containerInfo), ju(t, e, n), Pu(e), Mu = o, L && pu && (mu = !0), L = r, cu = a;
				break;
			case 12:
				ju(t, e, n), Pu(e);
				break;
			case 31:
				ju(t, e, n), Pu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 13:
				ju(t, e, n), Pu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (vd = Ke()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = su, l = H, u = cu;
				su = c || o, cu = u || o, H = l || s, ju(t, e, n), H = l, cu = u, su = c, Pu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || su || H || (t = s || H, n = su, r = H, su = o || su, H = t, zu(e, 2), su = n, H = r), !o && cu || yu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Au(e, n))));
				break;
			case 19:
				ju(t, e, n), Pu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 30:
				a & 512 && (H || r === null || kl(r, r.return)), a = Jt(), o = pu, s = (n & 335544064) === n, c = e.memoizedProps, pu = s && xi(c.default, c.update) !== "none", ju(t, e, n), Pu(e), s && r !== null && L && (e.flags |= 4), pu = o, L = a;
				break;
			case 21: break;
			case 7: a & 512 && (H || r === null || kl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: ju(t, e, n), Pu(e);
		}
	}
	function Pu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Ll(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Pl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Nl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Bl(e, Rl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (fn(l, ""), n.flags &= -33), Bl(e, Rl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						zl(e, Rl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				X(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Fu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Fu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Iu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Lu(t, e), t = t.sibling;
		else ou(t, !1);
	}
	function Lu(e, t) {
		var n = e.alternate;
		if (n === null) Ql(e, !1);
		else switch (e.tag) {
			case 3:
				if (hu = fu = !1, Kl(), Iu(t, e), !fu && !mu) {
					if (e = Gl, e !== null) for (var r = 0; r < e.length; r += 3) {
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
					})), hu = !0;
				}
				Gl = null;
				break;
			case 5:
				Iu(t, e);
				break;
			case 4:
				r = fu, fu = !1, Iu(t, e), fu && (mu = !0), fu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Iu(t, e) : Ql(e, !1));
				break;
			case 30:
				r = fu, i = Kl(), fu = !1, Iu(t, e), fu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = yi(a, o), o = yi(n.memoizedProps, o);
				var s = xi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, ql = 0, t = au(e, n, t, o, s, a, !0), ql !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Fd(e, e.memoizedProps.onUpdate), Gl = i) : i !== null && (i.push.apply(i, Gl), Gl = i), fu = e.flags & 32 ? !0 : r;
				break;
			default: Iu(t, e);
		}
	}
	function Ru(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) vu(e, t.alternate, t), t = t.sibling;
	}
	function zu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Tl(4, n, n.return), zu(n, r);
					break;
				case 1:
					kl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Dl(n, n.return, i), zu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					kl(n, n.return), n.tag !== 5 && n.tag !== 27 || Ml(n), zu(n, r);
					break;
				case 6:
					Ml(n);
					break;
				case 26:
					kl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || H || i.parentNode.removeChild(i), zu(n, r);
					break;
				case 22:
					n.memoizedState === null && zu(n, r);
					break;
				case 30:
					kl(n, n.return), zu(n, r);
					break;
				case 7: kl(n, n.return);
				default: zu(n, r);
			}
			e = e.sibling;
		}
	}
	function Bu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Bu(i, a, n), wl(4, a);
					break;
				case 1:
					if (Bu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						X(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) To(l[i], c);
						} catch (e) {
							X(r, r.return, e);
						}
					}
					s && o & 64 && El(a), Ol(a, a.return);
					break;
				case 27: n & 2 && Vl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || jl(a), Bu(i, a, n), s && r === null && o & 4 && Fl(a), Ol(a, a.return);
					break;
				case 6:
					jl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || su || Km(bm(c.ownerDocument), a.type, c), Bu(i, a, n), s && r === null && o & 4 && Fl(a), Ol(a, a.return);
					break;
				case 12:
					Bu(i, a, n);
					break;
				case 31:
					Bu(i, a, n), s && o & 4 && Du(i, a);
					break;
				case 13:
					Bu(i, a, n), s && o & 4 && Ou(i, a);
					break;
				case 22:
					a.memoizedState === null && Bu(i, a, n), Ol(a, a.return);
					break;
				case 30:
					Bu(i, a, n), Ol(a, a.return);
					break;
				case 7: Ol(a, a.return);
				default: Bu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Vu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Pa(n));
	}
	function Hu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Pa(e));
	}
	function Uu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Wu(e, t, n, r), t = t.sibling;
		else i && iu(t);
	}
	function Wu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && ru(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Uu(e, t, n, r), a & 2048 && wl(9, t);
				break;
			case 1:
				Uu(e, t, n, r);
				break;
			case 3:
				Uu(e, t, n, r), i && hu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Pa(a)));
				break;
			case 12:
				if (a & 2048) {
					Uu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						X(t, t.return, e);
					}
				} else Uu(e, t, n, r);
				break;
			case 31:
				Uu(e, t, n, r);
				break;
			case 13:
				Uu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && ru(t), o._visibility & 2 ? Uu(e, t, n, r) : (o._visibility |= 2, Gu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && ru(s), o._visibility & 2 ? Uu(e, t, n, r) : Ku(e, t)), a & 2048 && Vu(s, t);
				break;
			case 24:
				Uu(e, t, n, r), a & 2048 && Hu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Xl(a.child, !0), Xl(t.child, !0))), Uu(e, t, n, r);
				break;
			default: Uu(e, t, n, r);
		}
	}
	function Gu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Gu(a, o, s, c, i), wl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Gu(a, o, s, c, i)) : u._visibility & 2 ? Gu(a, o, s, c, i) : Ku(a, o), i && l & 2048 && Vu(o.alternate, o);
					break;
				case 24:
					Gu(a, o, s, c, i), i && l & 2048 && Hu(o.alternate, o);
					break;
				default: Gu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Ku(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Ku(n, r), i & 2048 && Vu(r.alternate, r);
					break;
				case 24:
					Ku(n, r), i & 2048 && Hu(r.alternate, r);
					break;
				default: Ku(n, r);
			}
			t = t.sibling;
		}
	}
	var qu = 8192;
	function Ju(e, t, n) {
		if (e.subtreeFlags & qu) for (e = e.child; e !== null;) Yu(e, t, n), e = e.sibling;
	}
	function Yu(e, t, n) {
		switch (e.tag) {
			case 26:
				Ju(e, t, n), e.flags & qu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, Mu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Ju(e, t, n), e.flags & qu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = Mu;
				Mu = bm(e.stateNode.containerInfo), Ju(e, t, n), Mu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = qu, qu = 16777216, Ju(e, t, n), qu = r) : Ju(e, t, n));
				break;
			case 30:
				if ((e.flags & qu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Ul === null && (Ul = /* @__PURE__ */ new Map()), Ul.set(r, i);
				}
				Ju(e, t, n);
				break;
			default: Ju(e, t, n);
		}
	}
	function Xu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Zu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				du = r, ed(r, e);
			}
			Xu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Qu(e), e = e.sibling;
	}
	function Qu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Zu(e), e.flags & 2048 && Tl(9, e, e.return);
				break;
			case 3:
				Zu(e);
				break;
			case 12:
				Zu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, $u(e)) : Zu(e);
				break;
			default: Zu(e);
		}
	}
	function $u(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				du = r, ed(r, e);
			}
			Xu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Tl(8, t, t.return), $u(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, $u(t));
					break;
				default: $u(t);
			}
			e = e.sibling;
		}
	}
	function ed(e, t) {
		for (; du !== null;) {
			var n = du;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Tl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Pa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, du = r;
			else a: for (n = e; du !== null;) {
				r = du;
				var i = r.sibling, a = r.return;
				if (Su(r), r === n) {
					du = null;
					break a;
				}
				if (i !== null) {
					i.return = a, du = i;
					break a;
				}
				du = a;
			}
		}
	}
	var td = {
		getCacheForType: function(e) {
			var t = Ea(Ma), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ea(Ma).controller.signal;
		}
	}, nd = typeof WeakMap == "function" ? WeakMap : Map, U = 0, rd = null, W = null, G = 0, id = 0, ad = null, od = !1, sd = !1, cd = !1, ld = 0, K = 0, ud = 0, dd = 0, fd = 0, pd = 0, md = 0, hd = null, gd = null, _d = !1, vd = 0, q = 0, yd = Infinity, bd = null, xd = null, Sd = 0, Cd = null, wd = null, Td = 0, Ed = 0, Dd = null, Od = null, kd = null, J = null, Ad = null, jd = 0, Md = null;
	function Nd() {
		return U & 2 && G !== 0 ? G & -G : j.T === null ? wt() : Ff();
	}
	function Pd() {
		if (pd === 0) {
			if (!(G & 536870912) || z) {
				var e = lt;
				lt <<= 1, !(lt & 3932160) && (lt = 262144), pd = e;
			} else pd = 536870912;
		}
		return e = Mo.current, e !== null && (e.flags |= 32), pd;
	}
	function Fd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(yi(e.memoizedProps, n))), J === null && (J = []), J.push(t.bind(null, r));
		}
	}
	function Id(e, t, n) {
		(e === rd && (id === 2 || id === 9) || e.cancelPendingCommit !== null) && (Hd(e, 0), zd(e, G, pd, !1)), vt(e, n), (!(U & 2) || e !== rd) && (e === rd && (!(U & 2) && (dd |= n), K === 4 && zd(e, G, pd, !1)), Df(e));
	}
	function Y(e, t, n) {
		if (U & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || pt(e, t), a = r ? Xd(e, t) : Jd(e, t, !0), o = r;
		do {
			if (a === 0) {
				sd && !r && zd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Rd(n)) {
				a = Jd(e, t, !1), o = !1;
				continue;
			}
			if (a === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						a = hd;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (Hd(c, s).flags |= 256), s = Jd(c, s, !1), s !== 2 && s !== 6) {
							if (cd && !l) {
								c.errorRecoveryDisabledLanes |= o, dd |= o, a = 4;
								break a;
							}
							o = gd, gd = a, o !== null && (gd === null ? gd = o : gd.push.apply(gd, o));
						}
						a = s;
					}
					if (o = !1, a !== 2) continue;
				}
			}
			if (a === 1) {
				Hd(e, 0), zd(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = a, o) {
					case 0:
					case 1: throw Error(i(345));
					case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
					case 6:
						zd(r, t, pd, !od);
						break a;
					case 2:
						gd = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(i(329));
				}
				if ((t & 62914560) === t && (a = vd + 300 - Ke(), 10 < a)) {
					if (zd(r, t, pd, !od), ft(r, 0, !0) !== 0) break a;
					Td = t, r.timeoutHandle = gp(Ld.bind(null, r, n, gd, bd, _d, t, pd, dd, md, od, o, "Throttled", -0, 0), a);
					break a;
				}
				Ld(r, n, gd, bd, _d, t, pd, dd, md, od, o, null, -0, 0);
			}
			break;
		} while (1);
		Df(e);
	}
	function Ld(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
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
			unsuspend: bn
		}, Ul = null, Yu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? vd - Ke() : (a & 4194048) === a ? q - Ke() : 0, m = eh(d, m), m !== null)) {
			Td = a, e.cancelPendingCommit = m(rf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), zd(e, a, o, !l);
			return;
		}
		rf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Rd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Ur(a(), i)) return !1;
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
	function zd(e, t, n, r) {
		t = mt(e, t), t &= ~fd, t &= ~dd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - it(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && bt(e, n, t);
	}
	function Bd() {
		return U & 6 ? !0 : (Of(0, !1), !1);
	}
	function Vd() {
		if (W !== null) {
			if (id === 0) var e = W.return;
			else e = W, va = _a = null, os(e), oo = null, so = 0, e = W;
			for (; e !== null;) Cl(e.alternate, e), e = e.return;
			W = null;
		}
	}
	function Hd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Td = 0, Vd(), rd = e, W = n = R(e.current, null), G = t, id = 0, ad = null, od = !1, sd = pt(e, t), cd = !1, md = pd = fd = dd = ud = K = 0, gd = hd = null, _d = !1, ld = mt(e, t), Ei(), n;
	}
	function Ud(e, t) {
		B = null, j.H = gc, t === Xa || t === Qa ? (t = io(), id = 3) : t === Za ? (t = io(), id = 4) : id = t === Pc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ad = t, W === null && (K = 1, Oc(e, Ui(t, e.current)));
	}
	function Wd() {
		var e = Mo.current;
		return e === null ? !0 : (G & 4194048) === G ? No === null : (G & 62914560) === G || G & 536870912 ? e === No : !1;
	}
	function Gd() {
		var e = j.H;
		return j.H = gc, e === null ? gc : e;
	}
	function Kd() {
		var e = j.A;
		return j.A = td, e;
	}
	function qd() {
		K = 4, od || (G & 4194048) !== G && Mo.current !== null || (sd = !0), !(ud & 134217727) && !(dd & 134217727) || rd === null || zd(rd, G, pd, !1);
	}
	function Jd(e, t, n) {
		var r = U;
		U |= 2;
		var i = Gd(), a = Kd();
		(rd !== e || G !== t) && (bd = null, Hd(e, t)), t = !1;
		var o = K;
		a: do
			try {
				if (id !== 0 && W !== null) {
					var s = W, c = ad;
					switch (id) {
						case 8:
							Vd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Mo.current === null && (t = !0);
							var l = id;
							if (id = 0, ad = null, ef(e, s, c, l), n && sd) {
								o = 0;
								break a;
							}
							break;
						default: l = id, id = 0, ad = null, ef(e, s, c, l);
					}
				}
				Yd(), o = K;
				break;
			} catch (t) {
				Ud(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, va = _a = null, U = r, j.H = i, j.A = a, W === null && (rd = null, G = 0, Ei()), o;
	}
	function Yd() {
		for (; W !== null;) Qd(W);
	}
	function Xd(e, t) {
		var n = U;
		U |= 2;
		var r = Gd(), a = Kd();
		rd !== e || G !== t ? (bd = null, yd = Ke() + 500, Hd(e, t)) : sd = pt(e, t);
		a: do
			try {
				if (id !== 0 && W !== null) {
					t = W;
					var o = ad;
					b: switch (id) {
						case 1:
							id = 0, ad = null, ef(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (eo(o)) {
								id = 0, ad = null, $d(t);
								break;
							}
							t = function() {
								id !== 2 && id !== 9 || rd !== e || (id = 7), Df(e);
							}, o.then(t, t);
							break a;
						case 3:
							id = 7;
							break a;
						case 4:
							id = 5;
							break a;
						case 7:
							eo(o) ? (id = 0, ad = null, $d(t)) : (id = 0, ad = null, ef(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (W.tag) {
								case 26: s = W.memoizedState;
								case 5:
								case 27:
									var c = W;
									if (s ? Ym(s) : c.stateNode.complete) {
										id = 0, ad = null;
										var l = c.sibling;
										if (l !== null) W = l;
										else {
											var u = c.return;
											u === null ? W = null : (W = u, tf(u));
										}
										break b;
									}
							}
							id = 0, ad = null, ef(e, t, o, 5);
							break;
						case 6:
							id = 0, ad = null, ef(e, t, o, 6);
							break;
						case 8:
							Vd(), K = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Zd();
				break;
			} catch (t) {
				Ud(e, t);
			}
		while (1);
		return va = _a = null, j.H = r, j.A = a, U = n, W === null ? (rd = null, G = 0, Ei(), K) : 0;
	}
	function Zd() {
		for (; W !== null && !We();) Qd(W);
	}
	function Qd(e) {
		var t = ml(e.alternate, e, ld);
		e.memoizedProps = e.pendingProps, t === null ? tf(e) : W = t;
	}
	function $d(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Jc(n, t, t.pendingProps, t.type, void 0, G);
				break;
			case 11:
				t = Jc(n, t, t.pendingProps, t.type.render, t.ref, G);
				break;
			case 5:
				os(t);
				var r = t;
				r === ia && (z ? (da(r), r.tag === 5 && r.stateNode != null && (aa = r.stateNode)) : (da(r), z = !0));
			default: Cl(n, t), t = W = Ii(t, ld), t = ml(n, t, ld);
		}
		e.memoizedProps = e.pendingProps, t === null ? tf(e) : W = t;
	}
	function ef(e, t, n, r) {
		va = _a = null, os(t), oo = null, so = 0;
		var i = t.return;
		try {
			if (Nc(e, i, t, n, G)) {
				K = 1, Oc(e, Ui(n, e.current)), W = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw W = i, t;
			K = 1, Oc(e, Ui(n, e.current)), W = null;
			return;
		}
		t.flags & 32768 ? (z || r === 1 ? e = !0 : sd || G & 536870912 ? e = !1 : (od = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Mo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), nf(t, e)) : tf(t);
	}
	function tf(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				nf(t, od);
				return;
			}
			e = t.return;
			var n = xl(t.alternate, t, ld);
			if (n !== null) {
				W = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				W = t;
				return;
			}
			W = t = e;
		} while (t !== null);
		K === 0 && (K = 5);
	}
	function nf(e, t) {
		do {
			var n = Sl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, W = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				W = e;
				return;
			}
			W = e = n;
		} while (e !== null);
		K = 6, W = null;
	}
	function rf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			ff();
		while (Sd !== 0);
		if (U & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === rd && (W = rd = null, G = 0), wd = t, Cd = e, Td = n, Dd = a, Od = r, af(e, t, n, s, c, l, f);
		}
	}
	function af(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Ed = s, s |= Ti, yt(e, n, s, r, i, a), J = null, (n & 335544064) === n ? (Ad = La(e), r = 10262) : (Ad = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, bf(Xe, function() {
			return pf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Hl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = j.T, j.T = null, i = M.p, M.p = 2, a = U, U |= 4;
			try {
				gu(e, t, n);
			} finally {
				U = a, M.p = i, j.T = r;
			}
		}
		Sd = 1, Hl ? kd = Mp(o, e.containerInfo, Ad, cf, lf, sf, uf, pf, of, null, null) : (cf(), lf(), uf());
	}
	function of(e) {
		if (Sd !== 0) {
			var t = Cd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function sf() {
		Sd === 3 && (Sd = 0, Lu(wd, Cd), Sd = 4);
	}
	function cf() {
		if (Sd === 1) {
			Sd = 0;
			var e = Cd, t = wd, n = Td, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = j.T, j.T = null;
				var i = M.p;
				M.p = 2;
				var a = U;
				U |= 4;
				try {
					pu = mu = !1, Nu(t, e, n), n = lp;
					var o = Yr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Jr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Xr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = qr(s, h), v = qr(s, g);
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
					gh = !!cp, lp = cp = null;
				} finally {
					U = a, M.p = i, j.T = r;
				}
			}
			e.current = t, Sd = 2;
		}
	}
	function lf() {
		if (Sd === 2) {
			Sd = 0;
			var e = Cd, t = wd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = j.T, j.T = null;
				var r = M.p;
				M.p = 2;
				var i = U;
				U |= 4;
				try {
					vu(e, t.alternate, t);
				} finally {
					U = i, M.p = r, j.T = n;
				}
			}
			Sd = 3;
		}
	}
	function uf() {
		if (Sd === 4 || Sd === 3) {
			Sd = 0;
			var e = kd;
			kd = null, Ge();
			var t = Cd, n = wd, r = Td, i = Od, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? Sd = 5 : (Sd = 0, wd = Cd = null, df(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (xd = null), Ct(r), n = n.stateNode, nt && typeof nt.onCommitFiberRoot == "function") try {
				nt.onCommitFiberRoot(tt, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = j.T, a = M.p, M.p = 2, j.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					j.T = n, M.p = a;
				}
			}
			if (i = J, o = Ad, Ad = null, i !== null && (J = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Td & 3 && ff(), Df(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Md ? jd++ : (jd = 0, Md = t) : (jd = 0, Md = null), Of(0, !1);
		}
	}
	function df(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Pa(t)));
	}
	function ff() {
		return kd !== null && (kd.skipTransition(), kd = null), cf(), lf(), uf(), pf();
	}
	function pf() {
		if (Sd !== 5) return !1;
		var e = Cd, t = Ed;
		Ed = 0;
		var n = Ct(Td), r = j.T, a = M.p;
		try {
			M.p = 32 > n ? 32 : n, j.T = null, n = Dd, Dd = null;
			var o = Cd, s = Td;
			if (Sd = 0, wd = Cd = null, Td = 0, U & 6) throw Error(i(331));
			var c = U;
			if (U |= 4, Qu(o.current), Wu(o, o.current, s, n), U = c, Of(0, !1), nt && typeof nt.onPostCommitFiberRoot == "function") try {
				nt.onPostCommitFiberRoot(tt, o);
			} catch {}
			return !0;
		} finally {
			M.p = a, j.T = r, df(e, t);
		}
	}
	function mf(e, t, n) {
		t = Ui(n, t), t = Ac(e.stateNode, t, 2), e = yo(e, t, 2), e !== null && (vt(e, 2), Df(e));
	}
	function X(e, t, n) {
		if (e.tag === 3) mf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				mf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (xd === null || !xd.has(r))) {
					e = Ui(n, e), n = jc(2), r = yo(t, n, 2), r !== null && (Mc(n, r, t, e), vt(r, 2), Df(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new nd();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (cd = !0, i.add(n), e = gf.bind(null, e, t, n), t.then(e, e));
	}
	function gf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, rd === e && (G & n) === n && (K === 4 || K === 3 && (G & 62914560) === G && 300 > Ke() - vd ? U & 2 ? fd |= n : Hd(e, 0) : fd |= n, md === G && (md = 0)), Df(e);
	}
	function _f(e, t) {
		t === 0 && (t = gt()), e = ki(e, t), e !== null && (vt(e, t), Df(e));
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
		return He(e, t);
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
						} else a = G, a = ft(r, r === rd ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || pt(r, a) || (n = !0, Nf(r, a));
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
		for (var t = Ke(), n = null, r = xf; r !== null;) {
			var i = r.next, a = jf(r, t);
			a === 0 ? (r.next = null, n === null ? xf = i : n.next = i, i === null && (Sf = n)) : (n = r, (e !== 0 || a & 3) && (wf = !0)), r = i;
		}
		Sd !== 0 && Sd !== 5 || Of(e, !1), Ef !== 0 && (Ef = 0);
	}
	function jf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - it(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ht(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = rd, n = G, n = ft(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (id === 2 || id === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ue(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || pt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ue(r), Ct(n)) {
				case 2:
				case 8:
					n = Ye;
					break;
				case 32:
					n = Xe;
					break;
				case 268435456:
					n = Qe;
					break;
				default: n = Xe;
			}
			return r = Mf.bind(null, e), n = He(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ue(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Mf(e, t) {
		if (Sd !== 0 && Sd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (ff() && e.callbackNode !== n) return null;
		var r = G;
		return r = ft(e, e === rd ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Y(e, r, t), jf(e, Ke()), e.callbackNode != null && e.callbackNode === n ? Mf.bind(null, e) : null);
	}
	function Nf(e, t) {
		if (ff()) return null;
		Y(e, t, !0);
	}
	function Pf() {
		bp(function() {
			U & 6 ? He(Je, kf) : Af();
		});
	}
	function Ff() {
		if (Ef === 0) {
			var e = Ba;
			e === 0 && (e = ct, ct <<= 1, !(ct & 261888) && (ct = 256)), Ef = e;
		}
		return Ef;
	}
	function If(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : yn(e);
	}
	function Lf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = If((i[Ot] || null).action), o = r.submitter;
			o && (t = (t = o[Ot] || null) ? If(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Vn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Ef !== 0) {
								var e = new FormData(i, o);
								nc(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), nc(n, {
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
	for (var Rf = 0; Rf < gi.length; Rf++) {
		var zf = gi[Rf];
		_i(zf.toLowerCase(), "on" + (zf[0].toUpperCase() + zf.slice(1)));
	}
	_i(ci, "onAnimationEnd"), _i(li, "onAnimationIteration"), _i(ui, "onAnimationStart"), _i("dblclick", "onDoubleClick"), _i("focusin", "onFocus"), _i("focusout", "onBlur"), _i(di, "onTransitionRun"), _i(fi, "onTransitionStart"), _i(pi, "onTransitionCancel"), _i(mi, "onTransitionEnd"), I("onMouseEnter", ["mouseout", "mouseover"]), I("onMouseLeave", ["mouseout", "mouseover"]), I("onPointerEnter", ["pointerout", "pointerover"]), I("onPointerLeave", ["pointerout", "pointerover"]), Ut("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ut("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ut("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Ut("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ut("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ut("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						Si(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Si(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Z(e, t) {
		var n = t[At];
		n === void 0 && (n = t[At] = /* @__PURE__ */ new Set());
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
			e[Wf] = !0, Vt.forEach(function(t) {
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
		n = i.bind(null, t, n, e), i = void 0, !An || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
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
					if (s = Ft(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Dn(function() {
			var r = a, i = Sn(n), s = [];
			a: {
				var c = hi.get(e);
				if (c !== void 0) {
					var l = Vn, u = e;
					switch (e) {
						case "keypress": if (In(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = ar;
							break;
						case "focusin":
							u = "focus", l = Xn;
							break;
						case "focusout":
							u = "blur", l = Xn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Xn;
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
							l = Jn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Yn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = cr;
							break;
						case ci:
						case li:
						case ui:
							l = Zn;
							break;
						case mi:
							l = lr;
							break;
						case "scroll":
						case "scrollend":
							l = Un;
							break;
						case "wheel":
							l = ur;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Qn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = or;
							break;
						case "submit":
							l = sr;
							break;
						case "toggle":
						case "beforetoggle": l = dr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = On(m, p), g != null && d.push(Jf(m, g, h))), f) break;
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
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== xn && (u = n.relatedTarget || n.fromElement) && (Ft(u) || u[kt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ft(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Jn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = or, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Lt(c), h = l == null ? u : Lt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Ft(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? te(c, l, Xf) : null, c !== null && Zf(s, u, c, d, !1), l !== null && f !== null && Zf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Lt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = jr;
					else if (Tr(c)) {
						if (Mr) _ = Vr;
						else {
							_ = zr;
							var v = Rr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && gn(r.elementType) && (_ = jr) : _ = Br;
					if (_ &&= _(e, r)) {
						Er(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Lt(r) : window, e) {
					case "focusin":
						(Tr(v) || v.contentEditable === "true") && (Qr = v, $r = r, ei = null);
						break;
					case "focusout":
						ei = $r = Qr = null;
						break;
					case "mousedown":
						ti = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ti = !1, ni(s, n, i);
						break;
					case "selectionchange": if (Zr) break;
					case "keydown":
					case "keyup": ni(s, n, i);
				}
				var y;
				if (pr) b: {
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
				else xr ? yr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (gr && n.locale !== "ko" && (xr || b !== "onCompositionStart" ? b === "onCompositionEnd" && xr && (y = Fn()) : (Mn = i, Nn = "value" in Mn ? Mn.value : Mn.textContent, xr = !0)), v = Yf(r, b), 0 < v.length && (b = new $n(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = br(n), y !== null && (b.data = y)))), (y = hr ? Sr(e, n) : Cr(e, n)) && (b = Yf(r, "onBeforeInput"), 0 < b.length && (v = new $n("onBeforeInput", "beforeinput", null, n, i), s.push({
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
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = On(e, n), i != null && r.unshift(Jf(e, i, a)), i = On(e, t), i != null && r.push(Jf(e, i, a))), e.tag === 3) return r;
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
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = On(n, a), l != null && o.unshift(Jf(n, l, c))) : i || (l = On(n, a), l != null && o.push(Jf(n, l, c)))), n = n.return;
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
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || fn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && fn(e, "" + r);
				else return;
				break;
			case "className":
				Xt(e, "class", r);
				break;
			case "tabIndex":
				Xt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Xt(e, n, r);
				break;
			case "style":
				hn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Xt(e, "data", r);
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
				r = yn(r), e.setAttribute(n, r);
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
				r = yn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = bn);
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
				n = yn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				Z("beforetoggle", e), Z("toggle", e), Yt(e, "popover", r);
				break;
			case "xlinkActuate":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Yt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = _n.get(n) || n, Yt(e, n, r);
			else return;
		}
		L = !0;
	}
	function np(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				hn(e, r, o);
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
				if (typeof r == "string") fn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") fn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = bn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Ht.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[Ot] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					L = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Yt(e, n, r);
				}
				return;
		}
		L = !0;
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
				sn(e, o, c, l, u, s, a, !1);
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
				t = o, n = s, e.multiple = !!r, t == null ? n != null && ln(e, !!r, n, !0) : ln(e, !!r, t, !1);
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
				dn(e, r, a, o);
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
			default: if (gn(t)) {
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
							m !== f && (L = !0), o = m;
							break;
						case "name":
							m !== f && (L = !0), a = m;
							break;
						case "checked":
							m !== f && (L = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (L = !0), d = m;
							break;
						case "value":
							m !== f && (L = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (L = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Q(e, t, p, m, r, f);
					}
				}
				on(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Q(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (L = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (L = !0), c = o;
						break;
					case "multiple": o !== l && (L = !0), s = o;
					default: o !== l && Q(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? ln(e, !!n, n ? [] : "", !1) : ln(e, !!n, t, !0)) : ln(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Q(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (L = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (L = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Q(e, t, s, a, r, o);
				}
				un(e, p, m);
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
						p !== m && (L = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
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
			default: if (gn(t)) {
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
	var cp = null, lp = null;
	function up(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function dp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function fp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function pp(e, t, n, r) {
		return n = up(n).createElement(e), n[Dt] = r, n[Ot] = t, rp(n, e, t), zt(n), n;
	}
	function $(e, t) {
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
						a[F] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
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
		return t = typeof t == "number" ? { duration: t } : T({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
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
		e !== null && (e = b(e), e = up(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
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
		var a = Ft(i);
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
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = te(n, a, w), t === null ? t = !1 : (h(t, !0, ee, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = te(r, a, w), t === null ? t = !1 : (h(t, !0, C, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
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
					nm(n), Pt(n);
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
			} else if (!e[F]) switch (t) {
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
		switch (t = up(n), e) {
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
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === bn && (e.onclick = null), Pt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Pt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = M.d;
	M.d = {
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
		var e = xm.f(), t = Bd();
		return e || t;
	}
	function Cm(e) {
		var t = It(e);
		t !== null && t.tag === 5 && t.type === "form" ? ic(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = an(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), rp(t, "link", e), zt(t), r.head.appendChild(t)));
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
			var i = "link[rel=\"preload\"][as=\"" + an(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + an(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + an(n.imageSizes) + "\"]")) : i += "[href=\"" + an(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = T({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				rp(o, "link", e), t === "style" && (o[Nt] = !0, o.onload = o.onerror = function() {
					Bt(o);
				}), zt(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + an(r) + "\"][href=\"" + an(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = T({
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
				r = n.createElement("link"), rp(r, "link", e), zt(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Rt(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = T({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					zt(c), rp(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = Rt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = T({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), zt(a), rp(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = Rt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = T({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), zt(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Oe.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Rt(a).hoistableStyles, r = t.get(n), r || (r = {
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
					var o = Rt(a).hoistableStyles, s = o.get(e);
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
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Rt(a).hoistableScripts, r = t.get(n), r || (r = {
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
		return "href=\"" + an(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return T({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Nt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Nt] = !0, t.onload = t.onerror = Bt.bind(null, t), rp(t, "link", n), zt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + an(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + an(n.href) + "\"]");
				if (r) return t.instance = r, zt(r), r;
				var a = T({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), zt(r), rp(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, zt(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), zt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), rp(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, zt(a), a) : (r = n, (a = vm.get(o)) && (r = T({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), zt(a), rp(a, "link", r), e.head.appendChild(a), t.instance = a);
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
			if (!(a[F] || a[Dt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, zt(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), zt(a);
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
		$$typeof: D,
		Provider: null,
		Consumer: null,
		_currentValue: be,
		_currentValue2: be,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = _t(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = _t(0), this.hiddenUpdates = _t(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Pi(3, null, null, t), e.current = a, a.stateNode = e, t = Na(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, go(a), e;
	}
	function uh(e) {
		return e ? (e = Mi, e) : Mi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = vo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = yo(e, r, t), n !== null && (Id(n, e, t), bo(n, e, t));
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
			var t = ki(e, 67108864);
			t !== null && Id(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Nd();
			t = St(t);
			var n = ki(e, t);
			n !== null && Id(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = j.T;
		j.T = null;
		var a = M.p;
		try {
			M.p = 2, yh(e, t, n, r);
		} finally {
			M.p = a, j.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = j.T;
		j.T = null;
		var a = M.p;
		try {
			M.p = 8, yh(e, t, n, r);
		} finally {
			M.p = a, j.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) qf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = It(i);
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
									Df(a), !(U & 6) && (yd = Ke() + 500, Of(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ki(a, 2), s !== null && Id(s, a, 2), Bd(), ph(a, 2);
					}
					if (a = bh(r), a === null && qf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else qf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = Sn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Ft(e), e !== null) {
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
			case "message": switch (qe()) {
				case Je: return 2;
				case Ye: return 8;
				case Xe:
				case Ze: return 32;
				case Qe: return 268435456;
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
		}, t !== null && (t = It(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = Ft(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, Tt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, Tt(e.priority, function() {
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
				xn = r, n.target.dispatchEvent(r), xn = null;
			} else return t = It(n), t !== null && mh(t), e.blockedOn = n, !1;
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
				var a = It(n);
				a !== null && (e.splice(t, 3), t -= 3, nc(a, {
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
			var i = n[r], a = n[r + 1], o = i[Ot] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Ot] || null) s = o.formAction;
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
			dh(e.current, 2, null, e, null, null), Bd(), t[kt] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = wt();
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
	M.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.0",
		rendererPackageName: "react-dom",
		currentDispatcherRef: j,
		reconcilerVersion: "19.3.0"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			tt = Jh.inject(qh), nt = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Tc, s = Ec, c = Dc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[kt] = t.current, Gf(e), new Wh(t);
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
})), _ = /* @__PURE__ */ o(((e) => {
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
})), v = /* @__PURE__ */ o(((e, t) => {
	t.exports = _();
})), y = /* @__PURE__ */ c(g(), 1), b = /* @__PURE__ */ c(u(), 1), x = v(), S = {
	placeholder: "Ask anything…",
	labels: [
		"Thinking",
		"Searching",
		"Analyzing",
		"Composing"
	],
	done: "Done",
	answerTitle: "Answer",
	answerBody: "The answer goes here",
	reset: "New question",
	send: "Send"
}, ee = 60, C = 60, w = 132, te = 66, T = 220, ne = 108, E = 138, re = () => Math.min(560, window.innerWidth - 32), ie = () => Math.min(320, window.innerWidth - 32), ae = () => window.innerHeight * .54 - 96, oe = (e) => e < 0 ? 0 : e > 1 ? 1 : e, se = (e, t, n) => e + (t - e) * n, D = (e) => String(Math.round(e * 1e4) / 1e4), O = Math.PI * 2;
function ce(e) {
	return function() {
		e |= 0, e = e + 1831565813 | 0;
		let t = Math.imul(e ^ e >>> 15, 1 | e);
		return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function le(e, t, n, r) {
	let i = 3 * e, a = 3 * (n - e) - i, o = 1 - i - a, s = 3 * t, c = 3 * (r - t) - s, l = 1 - s - c, u = (e) => ((o * e + a) * e + i) * e, d = (e) => ((l * e + c) * e + s) * e, f = (e) => (3 * o * e + 2 * a) * e + i, p = (e) => {
		let t = e;
		for (let n = 0; n < 8; n++) {
			let n = u(t) - e;
			if (Math.abs(n) < 1e-6) return t;
			let r = f(t);
			if (Math.abs(r) < 1e-6) break;
			t -= n / r;
		}
		let n = 0, r = 1;
		t = e;
		for (let i = 0; i < 40; i++) {
			let i = u(t);
			if (Math.abs(i - e) < 1e-6) break;
			e > i ? n = t : r = t, t = (r - n) / 2 + n;
		}
		return t;
	};
	return (e) => e <= 0 ? 0 : e >= 1 ? 1 : d(p(e));
}
var k = {
	out: le(.22, 1, .36, 1),
	io: le(.65, 0, .35, 1),
	in: le(.4, 0, 1, 1),
	fly: le(.5, 0, .1, 1),
	grow: le(.3, 0, .2, 1),
	vortex: le(.6, 0, .2, 1),
	spring: le(.34, 1.4, .64, 1),
	card: le(.65, 0, .2, 1),
	lin: (e) => e
}, ue = (e, t, n, r) => (1 - e) * (1 - e) * t + 2 * (1 - e) * e * n + e * e * r, A = (e, t, n, r, i, a = k.io) => ({
	ch: e,
	from: t,
	to: n,
	t0: r,
	t1: i,
	ease: a
}), de = (e) => [
	A("w", e.pw, e.pw - 12, 0, 100, k.out),
	A("oInput", 1, 0, 0, 160, k.in),
	A("inScale", 1, .6, 0, 160, k.in),
	A("oGlow", 1, 0, 0, 300, k.out),
	A("oAur", 1, 0, 0, 300, k.out),
	A("w", e.pw - 12, C, 100, 560, k.io),
	A("h", ee, 66, 380, 500, k.out),
	A("h", 66, C, 500, 620, k.out),
	A("oPill", 1, 0, 300, 560, k.out),
	A("oBall", 0, 1, 300, 560, k.out),
	A("u", 0, 1, 620, 1500, k.fly),
	A("w", C, E, 620, 1300, k.grow),
	A("h", C, E, 620, 1300, k.grow),
	A("w", E, w, 1300, 1500, k.out),
	A("h", E, w, 1300, 1500, k.out),
	A("cHalo", 0, .6, 620, 1500, k.out),
	A("trail", 0, 1, 700, 800, k.out),
	A("trail", 1, 0, 1300, 1500, k.in)
], fe = [
	A("oRing", 1, 0, 0, 300, k.out),
	A("oBall", 1, 0, 0, 260, k.out),
	A("orb.k", 0, 1, 0, 800, k.out),
	A("orb.alpha", 0, 1, 0, 800, k.out),
	A("orb.spin", 0, .9, 0, 800, k.out),
	A("orb.pop", 1, 1.05, 0, 420, k.out),
	A("orb.pop", 1.05, 1, 420, 800, k.io),
	A("sOp", 0, 1, 300, 620, k.out),
	A("sTy", 6, 0, 300, 620, k.out)
], pe = [
	A("orb.sweep", 0, 1, 0, 700, k.io),
	A("orb.spin", .9, .3, 0, 700, k.out),
	A("orb.gain", 1, 0, 0, 700, k.out),
	A("orb.floor", 0, .95, 400, 900, k.out),
	A("orb.rad", 0, .15, 400, 900, k.out),
	A("orb.pop", 1, 1.04, 600, 800, k.out),
	A("orb.pop", 1.04, 1, 800, 900, k.out)
], me = [
	A("orb.pop", 1, 1.06, 0, 120, k.out),
	A("sOp", 1, 0, 0, 160, k.in),
	A("sTy", 0, -6, 0, 160, k.in),
	A("orb.k", 1, 0, 120, 640, k.vortex),
	A("orb.vortex", 0, 1.6, 120, 640, k.vortex),
	A("oGreen", 0, 1, 260, 700, k.spring),
	A("gs", .55, 1, 260, 700, k.spring),
	A("pulse", 0, 1, 320, 760, k.out),
	A("oHalo", 0, .35, 380, 700, k.out),
	A("orb.alpha", 1, 0, 500, 800, k.out)
], he = (e, t) => [
	A("w", w, 124, 0, 90, k.in),
	A("h", w, 124, 0, 90, k.in),
	A("w", 124, e.cw, 90, 700, k.card),
	A("h", 124, ne, 90, 700, k.out),
	A("r", w / 2, 20, 90, 700, k.io),
	A("oGreen", 1, 0, 200, 560, k.out),
	A("oCard", 0, 1, 200, 560, k.out),
	A("oHalo", .35, 0, 300, 700, k.out),
	A("cHalo", .6, .22, 300, 700, k.out),
	A("hOp", 0, 1, 520, 840, k.out),
	A("dotS", 0, 1, 520, 840, k.spring),
	A("wp", 0, 1, 600, 600 + t, k.lin),
	A("bloom", 1, .625, 700, 1200, k.io)
], ge = [
	A("oInput", 1, 0, 0, 140, k.out),
	A("oPill", 1, 0, 0, 200, k.out),
	A("oGlow", 1, 0, 0, 200, k.out),
	A("oAur", 1, 0, 0, 200, k.out),
	A("oRing", 1, 0, 0, 200, k.out)
], _e = [
	A("orb.alpha", 0, 1, 0, 200, k.out),
	A("sOp", 0, 1, 0, 200, k.out),
	A("cHalo", 0, .6, 0, 200, k.out)
], ve = [A("orb.sweep", 0, 1, 0, 250, k.io), A("orb.floor", 0, .95, 0, 250, k.out)], ye = [
	A("oGreen", 0, 1, 0, 250, k.out),
	A("orb.alpha", 1, 0, 0, 250, k.out),
	A("sOp", 1, 0, 0, 250, k.out)
], j = [A("oGreen", 1, 0, 0, 120, k.out)], M = (e) => [
	A("oCard", 0, 1, 0, 250, k.out),
	A("hOp", 0, 1, 0, 250, k.out),
	A("wp", 0, 1, 0, e, k.lin),
	A("bloom", 1, .625, 0, 250, k.out)
], be = [
	"oGlow",
	"oAur",
	"oPill",
	"oBall",
	"oGreen",
	"oCard",
	"oRing",
	"oInput",
	"oHalo",
	"sOp",
	"orb.alpha",
	"trail"
], xe = {
	h: ee,
	r: 999,
	oGlow: 1,
	oHalo: 0,
	oPill: 1,
	oBall: 0,
	oGreen: 0,
	oCard: 0,
	oRing: 1,
	oInput: 1,
	inScale: 1,
	oAur: 1,
	gs: .55,
	cs: 1,
	hOp: 0,
	dotS: 0,
	bloom: 1,
	u: 0,
	yOff: 0,
	trail: 0,
	pulse: -1,
	sOp: 0,
	sTy: 6,
	cHalo: 0,
	wp: 0,
	"orb.k": 0,
	"orb.alpha": 0,
	"orb.spin": 0,
	"orb.pop": 1,
	"orb.sweep": 0,
	"orb.vortex": 0,
	"orb.gain": 1,
	"orb.floor": 0,
	"orb.rad": 0
}, Se = Symbol("abort");
function Ce(e, t) {
	return new Promise((n) => {
		if (t.aborted) return n();
		let r = 0, i = () => {
			window.clearTimeout(r), n();
		};
		r = window.setTimeout(() => {
			t.removeEventListener("abort", i), n();
		}, Math.max(0, e)), t.addEventListener("abort", i, { once: !0 });
	});
}
function we(e, t) {
	return new Promise((n) => {
		if (t.aborted) return n(void 0);
		let r = () => n(void 0);
		t.addEventListener("abort", r, { once: !0 }), e.then((e) => {
			t.removeEventListener("abort", r), n(e);
		}, () => {
			t.removeEventListener("abort", r), n(void 0);
		});
	});
}
var Te = 16, Ee = (() => {
	let e = ce(7), t = [];
	for (let n = 0; n < Te; n++) {
		let r = 1 - (n + .5) / Te * 2, i = Math.sqrt(1 - r * r), a = Math.max(4, Math.round(30 * i));
		for (let o = 0; o < a; o++) {
			let s = o / a * O + n * .35;
			t.push({
				x: Math.cos(s) * i,
				y: r,
				z: Math.sin(s) * i,
				u: (1 - r) / 2,
				seed: e() * 6.283
			});
		}
	}
	return t;
})(), De = Ee.length, Oe = Float32Array.from(Ee, (e) => e.x), ke = Float32Array.from(Ee, (e) => e.y), Ae = Float32Array.from(Ee, (e) => e.z), je = Float32Array.from(Ee, (e) => e.u), Me = Float32Array.from(Ee, (e) => e.seed), Ne = 24, Pe = 48, Fe = (() => {
	let e = [];
	for (let t = 0; t <= Ne; t++) {
		let n = t / Ne, r = Math.round(se(235, 52, n)), i = Math.round(se(235, 211, n)), a = Math.round(se(235, 153, n));
		for (let t = 0; t <= Pe; t++) e.push(`rgba(${r},${i},${a},${(t / Pe).toFixed(3)})`);
	}
	return e;
})(), Ie = [
	"k",
	"alpha",
	"spin",
	"sweep",
	"pop",
	"vortex",
	"gain",
	"floor",
	"rad"
];
function Le(e, t, n) {
	let r = {
		k: 0,
		alpha: 0,
		spin: 0,
		rot: 0,
		sweep: 0,
		pop: 1,
		vortex: 0,
		gain: 1,
		floor: 0,
		rad: 0,
		prog: 0
	}, i = e.getContext("2d"), a = new Float32Array(De), o = new Float32Array(De), s = new Float32Array(De), c = new Float32Array(De), l = new Float32Array(De), u = new Int16Array(De), d = [
		1,
		0,
		0,
		0
	], f = 0, p = 0, m = 0, h = !1, g = () => {
		r.k = 0, r.alpha = 0, r.spin = 0, r.rot = 0, r.sweep = 0, r.pop = 1, r.vortex = 0, r.gain = 1, r.floor = 0, r.rad = 0, r.prog = 0, a.fill(0), d[0] = 1, d[1] = 0, d[2] = 0, d[3] = 0, f = n() ? 1.2 : 0;
	};
	if (g(), !i) return {
		P: r,
		ensure() {},
		reset: g,
		destroy() {}
	};
	let _ = Math.min(2, window.devicePixelRatio || 1);
	e.width = Math.round(T * _), e.height = Math.round(T * _), i.setTransform(_, 0, 0, _, 0, 0);
	let v = Math.cos(.35), y = Math.sin(.35), b = T / 2, x = (e) => {
		i.clearRect(0, 0, T, T), f += e, r.rot += r.spin * e;
		let t = r.rot + r.vortex, n = Math.cos(t), p = Math.sin(t), m = e / .35;
		for (let e = 0; e < 4; e++) {
			let t = +(e === r.prog) - d[e];
			d[e] += Math.abs(t) <= m ? t : t > 0 ? m : -m;
		}
		let h = Math.exp(-e / .5), g = f * 300 % De, _ = f * 480 % De, x = f * .8, S = Math.sin(f * .5) * .9, ee = Math.cos(S) * Math.cos(x), C = Math.sin(S), w = Math.cos(S) * Math.sin(x), ne = f * .55 + 2.1, E = Math.cos(f * .42) * .9, re = Math.cos(E) * Math.cos(ne), ie = Math.sin(E), ae = Math.cos(E) * Math.sin(ne), se = Math.sin(f * 2.2), D = r.vortex * 1.5;
		for (let e = 0; e < De; e++) {
			let t = Oe[e], i = ke[e], m = Ae[e], x = je[e], S = 0;
			if (d[0] > .001) {
				let t = Math.abs(e - g);
				t > De - t && (t = De - t);
				let n = Math.max(0, 1 - t / 16);
				S = Math.max(S, n * n * d[0]);
			}
			if (d[1] > .001) {
				let e = Math.max(0, (t * ee + i * C + m * w - .72) / .28), n = Math.max(0, (t * re + i * ie + m * ae - .72) / .28), r = Math.max(e, n);
				S = Math.max(S, r * r * d[1]);
			}
			if (d[2] > .001) {
				let e = i - se, t = Math.max(0, 1 - e * e / .02);
				S = Math.max(S, t * t * d[2]);
			}
			if (d[3] > .001) {
				let t = Math.abs(e - _);
				t > De - t && (t = De - t);
				let n = Math.max(0, 1 - t / 22);
				S = Math.max(S, n * n * d[3]);
			}
			let T = Math.max(a[e] * h, S * r.gain);
			a[e] = T;
			let ne = oe(r.k * 1.6 - .6 * x);
			if (ne <= .001) {
				u[e] = -1;
				continue;
			}
			let E = k.out(ne), O = E * r.pop, ce = t * n + m * p, le = -t * p + m * n, ue = i * v - le * y, A = i * y + le * v, de = 2.8 / (2.8 - A), fe = (A + 1) / 2, pe = ce * te * O * de, me = -ue * te * O * de;
			if (D > .001) {
				let e = (1 - ne) * D, t = Math.cos(e), n = Math.sin(e), r = pe * t - me * n;
				me = pe * n + me * t, pe = r;
			}
			let he = oe((r.sweep * 1.4 - x) / .4), ge = .1 + .035 * Math.sin(Me[e] + f * 1.6) * (1 - he) + .32 * fe * fe + .75 * T * (1 - he) + he * (.55 + .4 * fe) + 2 * he * (1 - he);
			ge = Math.max(ge, r.floor * (.7 + .3 * fe)), ge > 1 && (ge = 1), ge *= E * r.alpha, o[e] = b + pe, s[e] = b + me, l[e] = fe, c[e] = (1.15 * (.45 + .75 * fe) * de + .9 * T + he * .25) * (1 + r.rad) * (.4 + .6 * E);
			let _e = Math.round(ge * Pe), ve = Math.round(he * Ne);
			u[e] = _e <= 0 ? -1 : ve * 49 + _e;
		}
		for (let e = 0; e < 2; e++) for (let t = 0; t < De; t++) {
			let n = u[t];
			n < 0 || l[t] >= .5 == (e === 1) && (i.fillStyle = Fe[n], i.beginPath(), i.arc(o[t], s[t], c[t], 0, O), i.fill());
		}
	}, S = (e) => {
		if (p = 0, h) return;
		let a = n() ? 0 : Math.max(0, Math.min(.05, (e - m) / 1e3)) * t();
		m = e, x(a), r.alpha > .002 ? p = requestAnimationFrame(S) : i.clearRect(0, 0, T, T);
	};
	return {
		P: r,
		ensure: () => {
			p || h || r.alpha <= .002 || (m = performance.now(), p = requestAnimationFrame(S));
		},
		reset: g,
		destroy: () => {
			h = !0, p && cancelAnimationFrame(p), p = 0;
		}
	};
}
function Re(e, t, n) {
	let r = e.length, i = (e) => {
		n.x = e.x, n.y = e.y, n.d = e.d;
	};
	if (r === 0) {
		n.x = 0, n.y = 0, n.d = 0;
		return;
	}
	if (t <= e[0].t) return i(e[0]);
	for (let a = r - 1; a > 0; a--) {
		let r = e[a - 1], o = e[a];
		if (t >= r.t) {
			if (t >= o.t) return i(o);
			let e = (t - r.t) / (o.t - r.t || 1);
			n.x = se(r.x, o.x, e), n.y = se(r.y, o.y, e), n.d = se(r.d, o.d, e);
			return;
		}
	}
	i(e[r - 1]);
}
function ze(e) {
	let { actor: t, mover: n, root: r, status: i, pulse: a, ghosts: o, form: s } = e, c = new AbortController(), l = {
		pw: re(),
		cw: ie(),
		H: ae(),
		dir: -1
	}, u = Le(e.canvas, e.getSpeed, e.isReduced), d = {}, f = /* @__PURE__ */ new Set(), p = {}, m = null, h = null, g = !1, _ = !1, v = 0, y = 0, b = 0, x = C, ee = 0, te = !1, T = 45, E = 320, se = [], O = {
		t: 0,
		x: 0,
		y: 0,
		d: 0
	}, ce = () => {
		let e = new AbortController();
		return c.signal.aborted ? e.abort() : c.signal.addEventListener("abort", () => e.abort(), { once: !0 }), e;
	}, le = () => {
		if (ee <= .001) {
			te &&= (o.forEach((e) => e.style.opacity = "0"), !1);
			return;
		}
		te = !0;
		let e = performance.now();
		for (let t = 0; t < o.length; t++) {
			Re(se, e - (t + 1) * 45, O);
			let n = O.d * (1 - .08 * (t + 1)) / 100, r = o[t];
			r.style.transform = `translate3d(${(O.x - y).toFixed(2)}px,${(O.y - b).toFixed(2)}px,0) translate(-50%,-50%) scale(${n.toFixed(3)})`, r.style.opacity = (.28 * (1 - t / 6) ** 1.5 * ee).toFixed(3);
		}
	}, Te = () => {
		let e = d.u ?? 0, t = l.H;
		y = ue(e, 0, l.dir * .3 * t, 0), b = ue(e, t, .6 * t, 0) + (d.yOff ?? 0), n.style.transform = `translate3d(${y.toFixed(2)}px,${b.toFixed(2)}px,0)`;
		let r = performance.now();
		for (se.push({
			t: r,
			x: y,
			y: b,
			d: x
		}); se.length > 2 && se[0].t < r - 500;) se.shift();
		le();
	};
	[
		"oGlow",
		"oHalo",
		"oPill",
		"oBall",
		"oGreen",
		"oCard",
		"oRing",
		"oInput",
		"oAur",
		"gs",
		"cs",
		"hOp",
		"dotS",
		"bloom"
	].forEach((e) => {
		p[e] = (n) => t.style.setProperty("--" + e, D(n));
	}), [
		"w",
		"h",
		"r"
	].forEach((e) => {
		p[e] = (n) => {
			t.style.setProperty("--" + e, D(n) + "px"), e === "w" && (x = n);
		};
	}), p.inScale = (e) => {
		t.style.setProperty("--inScale", D(e)), s.style.filter = e >= .999 ? "none" : `blur(${D((1 - e) * 15)}px)`;
	}, p.sOp = (e) => i.style.setProperty("--sOp", D(e)), p.sTy = (e) => i.style.setProperty("--sTy", D(e)), p.cHalo = (e) => r.style.setProperty("--oCenter", D(e)), p.u = () => Te(), p.yOff = () => Te(), p.trail = (e) => {
		ee = e, le();
	}, p.pulse = (e) => {
		if (e < 0) {
			a.style.opacity = "0";
			return;
		}
		a.style.opacity = D(.5 * (1 - e)), a.style.transform = `scale(${D(1 + e)})`;
	}, p.wp = (t) => {
		let n = e.getBody();
		if (!n) return;
		let r = n.querySelectorAll(".mo-w"), i = t * ((r.length - 1) * T + E), a = e.isReduced();
		r.forEach((e, t) => {
			let n = k.out(oe((i - t * T) / E));
			e.style.opacity = D(n), e.style.transform = n >= .999 || a ? "none" : `translateY(${D((1 - n) * 4)}px)`, e.style.filter = n >= .999 || a ? "none" : `blur(${D((1 - n) * 4)}px)`;
		});
	}, Ie.forEach((e) => {
		p["orb." + e] = (t) => {
			u.P[e] = t, e === "alpha" && u.ensure();
		};
	});
	let Ee = (e, t) => {
		d[e] = t, f.add(e);
	}, De = () => {
		f.forEach((e) => p[e]?.(d[e])), f.clear();
	}, Oe = (e, t) => {
		d[e] = t, p[e]?.(t);
	}, ke = () => {
		Oe("w", l.pw);
		for (let e of Object.keys(xe)) Oe(e, xe[e]);
	}, Ae = (t, n) => new Promise((r) => {
		if (n.aborted) return r();
		let i = t.reduce((e, t) => Math.max(e, t.t1), 0), a = /* @__PURE__ */ new Set(), o = 0, s = 0, c = performance.now(), l = () => {
			cancelAnimationFrame(o), r();
		}, u = () => {
			n.removeEventListener("abort", l), r();
		}, d = (n) => {
			let r = Math.max(0, Math.min(100, n - c));
			c = n, s += r * e.getSpeed();
			for (let e of t) {
				if (a.has(e) || s < e.t0) continue;
				let t = Math.min(1, (s - e.t0) / Math.max(1, e.t1 - e.t0));
				Ee(e.ch, e.from + (e.to - e.from) * (e.ease ?? k.io)(t)), t === 1 && a.add(e);
			}
			De(), s >= i ? u() : o = requestAnimationFrame(d);
		};
		n.addEventListener("abort", l, { once: !0 }), o = requestAnimationFrame(d);
	}), je = async (t, n) => {
		let r = 0;
		for (;;) {
			if (await Ce(1150 / e.getSpeed(), t), t.aborted || n.stop) return;
			r = (r + 1) % S.labels.length, u.P.prog = r % 4, e.ui.swapLabel(S.labels[r]);
		}
	}, Me = async (t, n, r) => {
		let i = e.isReduced(), a = async (e) => {
			if (await Ae(e, n), n.aborted) throw Se;
		};
		try {
			e.ui.setPhase("launch"), se.length = 0, i ? (await a(ge), Oe("u", 1), Oe("w", w), Oe("h", w), Oe("r", w / 2), Oe("sTy", 0), Oe("orb.k", 1), Oe("orb.spin", 0), e.ui.setPhase("assemble"), await a(_e)) : (await a(de(l)), Oe("r", w / 2), e.ui.setPhase("assemble"), await a(fe)), e.ui.setPhase("think"), e.ui.live(S.labels[0]);
			let o = { stop: !1 };
			je(n, o);
			let s = performance.now(), c = await we(Promise.resolve().then(() => r.onSubmit(t)).then((e) => typeof e == "string" && e.trim() ? e : S.answerBody, () => S.answerBody), n);
			if (n.aborted) throw Se;
			let u = c ?? S.answerBody;
			if (await Ce(r.minThink / e.getSpeed() - (performance.now() - s), n), o.stop = !0, n.aborted) throw Se;
			let d = u.split(/\s+/).filter(Boolean), f = Math.max(1, d.length);
			if (!i) e.ui.setPhase("resolve"), e.ui.swapLabel(S.done), await a(pe), e.ui.setPhase("condense"), await a(me), e.ui.setPhase("unfold"), E = 320, T = f > 1 ? Math.min(45, 280 / (f - 1)) : 0, e.ui.setAnswer(u), await a(he(l, (f - 1) * T + E));
			else {
				if (e.ui.setPhase("resolve"), e.ui.swapLabel(S.done), await a(ve), await Ce(350 / e.getSpeed(), n), n.aborted) throw Se;
				e.ui.setPhase("condense"), Oe("gs", 1), await a(ye), e.ui.setPhase("unfold"), E = 250, T = 0, e.ui.setAnswer(u), await a(j), Oe("w", l.cw), Oe("h", ne), Oe("r", 20), Oe("dotS", 1), await a(M(E));
			}
			e.ui.setPhase("answered"), e.ui.live("Answer ready: " + u), e.ui.focusAnswer();
		} catch (e) {
			if (e === Se) return;
			Pe();
		}
	}, Ne = async (t) => {
		if (_) return;
		_ = !0;
		let n = ++v, r = ce();
		h = r;
		let i = r.signal, a = t === "reset" ? 240 : 200, o = t === "reset" ? 420 : 200;
		e.ui.setPhase("reset");
		let s = [A("cHalo", d.cHalo ?? 0, 0, 0, a, k.out)];
		for (let e of be) {
			let t = d[e] ?? 0;
			t > .001 && s.push(A(e, t, 0, 0, a, k.out));
		}
		if (t === "reset" && s.push(A("cs", 1, .98, 0, a, k.out)), await Ae(s, i), i.aborted || n !== v) return;
		Oe("pulse", -1), e.ui.setAnswer(""), e.ui.resetLabel(), e.ui.clearInput(), u.reset(), se.length = 0, l.pw = re(), l.cw = ie(), l.H = ae(), ke();
		let c = [
			"oPill",
			"oInput",
			"oGlow",
			"oAur",
			"oRing"
		];
		c.forEach((e) => Oe(e, 0)), Oe("yOff", t === "reset" ? 8 : 0);
		let f = c.map((e) => A(e, 0, 1, 0, o, k.out));
		t === "reset" && f.push(A("yOff", 8, 0, 0, o, k.out)), await Ae(f, i), !(i.aborted || n !== v) && (ke(), m = null, h = null, g = !1, _ = !1, e.ui.lock(!1), e.ui.setPhase("idle"), e.ui.idleReady());
	};
	function Pe() {
		v++, m?.abort(), m = null, h?.abort(), h = null, u.reset(), se.length = 0, e.ui.setAnswer(""), e.ui.resetLabel(), l.pw = re(), l.cw = ie(), l.H = ae(), ke(), Oe("pulse", -1), g = !1, _ = !1, e.ui.lock(!1), e.ui.setPhase("idle"), e.ui.idleReady();
	}
	return ke(), {
		start(t, n) {
			if (g) return !1;
			g = !0, l.pw = re(), l.cw = ie(), l.H = ae(), l.dir = -l.dir, u.reset(), Oe("u", 0);
			let r = ce();
			return m = r, e.ui.lock(!0), Me(t, r.signal, n), !0;
		},
		escape() {
			g && !_ && (m?.abort(), Ne("esc"));
		},
		reset() {
			g && !_ && Ne("reset");
		},
		hard: Pe,
		home() {
			g || (l.pw = re(), l.cw = ie(), l.H = ae(), Oe("w", l.pw), Oe("u", 0));
		},
		busy: () => g,
		destroy() {
			c.abort(), u.destroy();
		}
	};
}
var Be = typeof window < "u" ? b.useLayoutEffect : b.useEffect;
function Ve(e) {
	let [t, n] = (0, b.useState)("idle"), [r, i] = (0, b.useState)(""), [a, o] = (0, b.useState)({
		cur: S.labels[0],
		prev: null,
		n: 0
	}), [s, c] = (0, b.useState)(""), [l, u] = (0, b.useState)(1), [d] = (0, b.useState)(() => typeof window < "u" && /[?&]debug(?:[=&]|$)/.test(window.location.search)), f = (0, b.useRef)(null), p = (0, b.useRef)(null), m = (0, b.useRef)(null), h = (0, b.useRef)(null), g = (0, b.useRef)(null), _ = (0, b.useRef)(null), v = (0, b.useRef)(null), y = (0, b.useRef)(null), ee = (0, b.useRef)(null), C = (0, b.useRef)(null), w = (0, b.useRef)(null), te = (0, b.useRef)([]), T = (0, b.useRef)(e);
	T.current = e;
	let ne = (0, b.useRef)(1);
	ne.current = Math.max(.05, (e.speed ?? 1) * l);
	let E = (0, b.useRef)("idle"), re = (0, b.useRef)(!1), ie = (0, b.useRef)(null), ae = (0, b.useRef)(""), oe = (0, b.useRef)({});
	Be(() => {
		let e = f.current, t = p.current, r = m.current, a = _.current, s = v.current, l = y.current, u = h.current, d = te.current.filter((e) => !!e);
		if (!e || !t || !r || !a || !s || !l || !u) return;
		let b = window.matchMedia("(prefers-reduced-motion: reduce)");
		re.current = b.matches;
		let x = (e) => {
			re.current = e.matches;
		};
		b.addEventListener("change", x);
		let T = ze({
			root: e,
			mover: t,
			actor: r,
			form: u,
			ghosts: d,
			canvas: a,
			pulse: s,
			status: l,
			getBody: () => C.current,
			getSpeed: () => ne.current,
			isReduced: () => re.current,
			ui: {
				setPhase: (e) => {
					E.current = e, n(e);
				},
				swapLabel: (e) => o((t) => t.cur === e ? t : {
					cur: e,
					prev: t.cur,
					n: t.n + 1
				}),
				resetLabel: () => o((e) => ({
					cur: S.labels[0],
					prev: null,
					n: e.n + 1
				})),
				setAnswer: (e) => c(e),
				clearInput: () => i(""),
				live: (e) => {
					w.current && (w.current.textContent = e);
				},
				lock: (e) => {
					u.toggleAttribute("inert", e);
				},
				idleReady: () => {
					g.current?.focus({ preventScroll: !0 });
				},
				focusAnswer: () => {
					ee.current?.focus({ preventScroll: !0 });
				}
			}
		});
		ie.current = T;
		let ae = (e) => {
			e.key === "Escape" && E.current !== "idle" && E.current !== "reset" && (e.preventDefault(), T.escape());
		}, se = () => {
			E.current === "idle" && !T.busy() && T.home();
		};
		return window.addEventListener("keydown", ae), window.addEventListener("resize", se), g.current?.focus({ preventScroll: !0 }), () => {
			window.removeEventListener("keydown", ae), window.removeEventListener("resize", se), b.removeEventListener("change", x), window.clearTimeout(oe.current.typing), window.clearTimeout(oe.current.shake), window.clearTimeout(oe.current.flash), T.destroy(), ie.current = null;
		};
	}, []);
	let se = () => new Promise((e) => {
		window.setTimeout(() => e(S.answerBody), 4600 / ne.current);
	}), D = () => ({
		onSubmit: T.current.onSubmit ?? se,
		minThink: T.current.minThinkMs ?? 3450
	}), O = () => {
		let e = m.current;
		e && (e.removeAttribute("data-shake"), e.offsetWidth, e.setAttribute("data-shake", ""), e.setAttribute("data-flash", ""), window.clearTimeout(oe.current.shake), window.clearTimeout(oe.current.flash), oe.current.shake = window.setTimeout(() => e.removeAttribute("data-shake"), 260), oe.current.flash = window.setTimeout(() => e.removeAttribute("data-flash"), 200));
	}, ce = (e) => {
		i(e.target.value);
		let t = m.current;
		t && (t.setAttribute("data-typing", ""), window.clearTimeout(oe.current.typing), oe.current.typing = window.setTimeout(() => t.removeAttribute("data-typing"), 300));
	}, le = (e) => {
		e.key === "Enter" && (e.shiftKey || e.nativeEvent.isComposing) && e.preventDefault();
	}, k = (e) => {
		e.preventDefault();
		let t = ie.current;
		if (!t || t.busy() || E.current !== "idle") return;
		let n = r.trim();
		if (!n) {
			O();
			return;
		}
		ae.current = n, t.start(n, D());
	}, ue = () => {
		E.current === "answered" && ie.current?.reset();
	}, A = () => {
		let e = ie.current;
		if (!e) return;
		let t = ae.current || "hello";
		ae.current = t, e.hard(), i(t), window.requestAnimationFrame(() => {
			e.start(t, D());
		});
	}, de = r.trim().length > 0, fe = s.split(/\s+/).filter(Boolean), pe = (e) => e === S.done ? /* @__PURE__ */ (0, x.jsx)("span", {
		className: "mo-lab-done",
		children: e
	}) : /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [/* @__PURE__ */ (0, x.jsx)("span", {
		className: "mo-lab-t",
		children: e
	}), /* @__PURE__ */ (0, x.jsxs)("span", {
		className: "mo-dots",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, x.jsx)("i", {}),
			/* @__PURE__ */ (0, x.jsx)("i", {}),
			/* @__PURE__ */ (0, x.jsx)("i", {})
		]
	})] });
	return /* @__PURE__ */ (0, x.jsxs)("div", {
		className: "mo-root",
		"data-phase": t,
		ref: f,
		children: [
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: "mo-bg",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: "mo-halo",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "mo-mover",
				ref: p,
				children: [Array.from({ length: 6 }).map((e, t) => /* @__PURE__ */ (0, x.jsx)("span", {
					className: "mo-trail",
					"aria-hidden": "true",
					ref: (e) => {
						te.current[t] = e;
					}
				}, t)), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "mo-actor",
					ref: m,
					children: [
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-underglow",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-halo-green",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-surface",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, x.jsxs)("div", {
								className: "mo-aurora",
								children: [
									/* @__PURE__ */ (0, x.jsx)("i", {}),
									/* @__PURE__ */ (0, x.jsx)("i", {}),
									/* @__PURE__ */ (0, x.jsx)("i", {}),
									/* @__PURE__ */ (0, x.jsx)("i", {})
								]
							})
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-ball",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-green",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-card",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-ring",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsxs)("form", {
							className: "mo-input",
							ref: h,
							onSubmit: k,
							autoComplete: "off",
							children: [
								/* @__PURE__ */ (0, x.jsxs)("svg", {
									className: "mo-spark",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									"aria-hidden": "true",
									children: [/* @__PURE__ */ (0, x.jsx)("path", { d: "M10 3.5l1.7 4.8 4.8 1.7-4.8 1.7L10 16.5l-1.7-4.8L3.5 10l4.8-1.7L10 3.5z" }), /* @__PURE__ */ (0, x.jsx)("path", { d: "M18 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" })]
								}),
								/* @__PURE__ */ (0, x.jsx)("input", {
									ref: g,
									className: "mo-field",
									type: "text",
									value: r,
									maxLength: 200,
									placeholder: S.placeholder,
									"aria-label": "Ask anything",
									spellCheck: !1,
									onChange: ce,
									onKeyDown: le
								}),
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "submit",
									className: "mo-send",
									"aria-label": S.send,
									"data-ready": de ? "" : void 0,
									children: /* @__PURE__ */ (0, x.jsxs)("svg", {
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "1.5",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										"aria-hidden": "true",
										children: [/* @__PURE__ */ (0, x.jsx)("path", { d: "M12 19V5" }), /* @__PURE__ */ (0, x.jsx)("path", { d: "M5.5 11.5L12 5l6.5 6.5" })]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, x.jsx)("canvas", {
							className: "mo-orb",
							ref: _,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "mo-pulse",
							ref: v,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "mo-answer",
							ref: ee,
							tabIndex: -1,
							role: "group",
							"aria-label": S.answerTitle,
							children: [/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "mo-a-head",
								children: [/* @__PURE__ */ (0, x.jsx)("i", {
									className: "mo-a-dot",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, x.jsx)("span", { children: S.answerTitle })]
							}), /* @__PURE__ */ (0, x.jsx)("p", {
								className: "mo-a-body",
								ref: C,
								children: fe.map((e, t) => /* @__PURE__ */ (0, x.jsxs)(b.Fragment, { children: [/* @__PURE__ */ (0, x.jsx)("span", {
									className: "mo-w",
									children: e
								}), " "] }, t))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "mo-status",
				ref: y,
				"aria-hidden": "true",
				children: [a.prev !== null && /* @__PURE__ */ (0, x.jsx)("span", {
					className: "mo-lab mo-out",
					children: pe(a.prev)
				}, "p" + a.n), /* @__PURE__ */ (0, x.jsx)("span", {
					className: "mo-lab mo-in",
					children: pe(a.cur)
				}, "c" + a.n)]
			}),
			/* @__PURE__ */ (0, x.jsx)("button", {
				type: "button",
				className: "mo-reset",
				onClick: ue,
				children: S.reset
			}),
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: "mo-live",
				ref: w,
				role: "status",
				"aria-live": "polite"
			}),
			d && /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "mo-debug",
				children: [
					/* @__PURE__ */ (0, x.jsx)("span", {
						className: "mo-chip",
						children: t
					}),
					/* @__PURE__ */ (0, x.jsxs)("label", { children: [/* @__PURE__ */ (0, x.jsxs)("span", { children: [l.toFixed(2), "×"] }), /* @__PURE__ */ (0, x.jsx)("input", {
						type: "range",
						min: .25,
						max: 2,
						step: .05,
						value: l,
						"aria-label": "Speed",
						onChange: (e) => u(parseFloat(e.target.value))
					})] }),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: A,
						children: "Replay"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/ui/demo.tsx
function He() {
	return /* @__PURE__ */ (0, x.jsx)("div", {
		className: "flex min-h-[450px] w-full items-center justify-center p-4",
		children: /* @__PURE__ */ (0, x.jsx)(Ve, {})
	});
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/Constants.js
var Ue = "generated", We = "pointerdown", Ge = "pointerup", Ke = "pointerleave", qe = "pointerout", Je = "pointermove", Ye = "touchstart", Xe = "touchend", Ze = "touchmove", Qe = "touchcancel", $e = "resize", et = "visibilitychange", tt = "tsParticles - Error", nt = .5, rt = 1e3, it = {
	x: 0,
	y: 0,
	z: 0
}, at = {
	a: 1,
	b: 0,
	c: 0,
	d: 1
}, ot = "random", st = Math.PI * 2, ct = "true", lt = "false", ut = "canvas", dt = .25, ft = .75, pt = -.25, mt = 1.5, ht;
(function(e) {
	e.bottom = "bottom", e.bottomLeft = "bottom-left", e.bottomRight = "bottom-right", e.left = "left", e.none = "none", e.right = "right", e.top = "top", e.topLeft = "top-left", e.topRight = "top-right", e.outside = "outside", e.inside = "inside";
})(ht ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/TypeUtils.js
function gt(e) {
	return typeof e == "boolean";
}
function _t(e) {
	return typeof e == "string";
}
function vt(e) {
	return typeof e == "number";
}
function yt(e) {
	return typeof e == "object" && !!e;
}
function bt(e) {
	return Array.isArray(e);
}
function N(e) {
	return e == null;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/Vectors.js
var xt = class e {
	constructor(e, t, n) {
		if (this._updateFromAngle = (e, t) => {
			this.x = Math.cos(e) * t, this.y = Math.sin(e) * t;
		}, !vt(e) && e) {
			this.x = e.x, this.y = e.y;
			let t = e;
			this.z = t.z ? t.z : it.z;
		} else if (e !== void 0 && t !== void 0) this.x = e, this.y = t, this.z = n ?? it.z;
		else throw Error(`${tt} Vector3d not initialized correctly`);
	}
	static get origin() {
		return e.create(it.x, it.y, it.z);
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
		return e.create(this.x * Math.cos(t) - this.y * Math.sin(t), this.x * Math.sin(t) + this.y * Math.cos(t), it.z);
	}
	setTo(e) {
		this.x = e.x, this.y = e.y;
		let t = e;
		this.z = t.z ? t.z : it.z;
	}
	sub(t) {
		return e.create(this.x - t.x, this.y - t.y, this.z - t.z);
	}
	subFrom(e) {
		this.x -= e.x, this.y -= e.y, this.z -= e.z;
	}
}, St = class e extends xt {
	constructor(e, t) {
		super(e, t, it.z);
	}
	static get origin() {
		return e.create(it.x, it.y);
	}
	static clone(t) {
		return e.create(t.x, t.y);
	}
	static create(t, n) {
		return new e(t, n);
	}
}, Ct = Math.random, wt = {
	nextFrame: (e) => requestAnimationFrame(e),
	cancel: (e) => cancelAnimationFrame(e)
};
function Tt() {
	return Ot(Ct(), 0, 1 - 2 ** -52);
}
function Et(e) {
	return wt.nextFrame(e);
}
function Dt(e) {
	wt.cancel(e);
}
function Ot(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function kt(e, t, n, r) {
	return Math.floor((e * n + t * r) / (n + r));
}
function At(e) {
	let t = Mt(e), n = jt(e);
	return t === n && (n = 0), Tt() * (t - n) + n;
}
function P(e) {
	return vt(e) ? e : At(e);
}
function jt(e) {
	return vt(e) ? e : e.min;
}
function Mt(e) {
	return vt(e) ? e : e.max;
}
function F(e, t) {
	if (e === t || t === void 0 && vt(e)) return e;
	let n = jt(e), r = Mt(e);
	return t === void 0 ? F(n, r) : {
		min: Math.min(n, t),
		max: Math.max(r, t)
	};
}
function Nt(e, t) {
	let n = e.x - t.x, r = e.y - t.y;
	return {
		dx: n,
		dy: r,
		distance: Math.sqrt(n ** 2 + r ** 2)
	};
}
function Pt(e, t) {
	return Nt(e, t).distance;
}
function Ft(e) {
	return e * Math.PI / 180;
}
function It(e, t, n) {
	if (vt(e)) return Ft(e);
	switch (e) {
		case ht.top: return -Math.PI * nt;
		case ht.topRight: return -Math.PI * dt;
		case ht.right: return 0;
		case ht.bottomRight: return Math.PI * dt;
		case ht.bottom: return Math.PI * nt;
		case ht.bottomLeft: return Math.PI * ft;
		case ht.left: return Math.PI;
		case ht.topLeft: return -Math.PI * ft;
		case ht.inside: return Math.atan2(n.y - t.y, n.x - t.x);
		case ht.outside: return Math.atan2(t.y - n.y, t.x - n.x);
		default: return Tt() * st;
	}
}
function Lt(e) {
	let t = St.origin;
	return t.length = 1, t.angle = e, t;
}
function Rt(e, t, n, r) {
	return St.create(e.x * (n - r) / (n + r) + t.x * 2 * r / (n + r), e.y);
}
function zt(e) {
	return {
		x: e.position?.x ?? Tt() * e.size.width,
		y: e.position?.y ?? Tt() * e.size.height
	};
}
function Bt(e) {
	return e ? e.endsWith("%") ? parseFloat(e) / 100 : parseFloat(e) : 1;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Modes/AnimationMode.js
var Vt;
(function(e) {
	e.auto = "auto", e.increase = "increase", e.decrease = "decrease", e.random = "random";
})(Vt ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/AnimationStatus.js
var Ht;
(function(e) {
	e.increasing = "increasing", e.decreasing = "decreasing";
})(Ht ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/DestroyType.js
var Ut;
(function(e) {
	e.none = "none", e.max = "max", e.min = "min";
})(Ut ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Directions/OutModeDirection.js
var I;
(function(e) {
	e.bottom = "bottom", e.left = "left", e.right = "right", e.top = "top";
})(I ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Modes/PixelMode.js
var Wt;
(function(e) {
	e.precise = "precise", e.percent = "percent";
})(Wt ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/StartValueType.js
var Gt;
(function(e) {
	e.max = "max", e.min = "min", e.random = "random";
})(Gt ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/Utils.js
var Kt = {
	debug: console.debug,
	error: console.error,
	info: console.info,
	log: console.log,
	verbose: console.log,
	warning: console.warn
};
function qt() {
	return Kt;
}
function L(e) {
	let t = /* @__PURE__ */ new Map();
	return (...n) => {
		let r = JSON.stringify(n);
		if (t.has(r)) return t.get(r);
		let i = e(...n);
		return t.set(r, i), i;
	};
}
function Jt(e) {
	let t = { bounced: !1 }, { pSide: n, pOtherSide: r, rectSide: i, rectOtherSide: a, velocity: o, factor: s } = e;
	return r.min < a.min || r.min > a.max || r.max < a.min || r.max > a.max || (n.max >= i.min && n.max <= (i.max + i.min) * .5 && o > 0 || n.min <= i.max && n.min > (i.max + i.min) * .5 && o < 0) && (t.velocity = o * -s, t.bounced = !0), t;
}
function Yt(e, t) {
	let n = _n(t, (t) => e.matches(t));
	return bt(n) ? n.some((e) => e) : n;
}
function Xt() {
	return typeof window > "u" || !window || window.document === void 0 || !window.document;
}
function Zt() {
	return !Xt() && typeof matchMedia < "u";
}
function Qt(e) {
	if (Zt()) return matchMedia(e);
}
function $t(e) {
	if (!(Xt() || typeof IntersectionObserver > "u")) return new IntersectionObserver(e);
}
function en(e) {
	if (!(Xt() || typeof MutationObserver > "u")) return new MutationObserver(e);
}
function tn(e, t) {
	return e === t || bt(t) && t.indexOf(e) > -1;
}
async function nn(e, t) {
	try {
		await document.fonts.load(`${t ?? "400"} 36px '${e ?? "Verdana"}'`);
	} catch {}
}
function rn(e) {
	return Math.floor(Tt() * e.length);
}
function an(e, t, n = !0) {
	return e[t !== void 0 && n ? t % e.length : rn(e)];
}
function on(e, t, n, r, i) {
	return sn(cn(e, r ?? 0), t, n, i);
}
function sn(e, t, n, r) {
	let i = !0;
	return (!r || r === I.bottom) && (i = e.top < t.height + n.x), i && (!r || r === I.left) && (i = e.right > n.x), i && (!r || r === I.right) && (i = e.left < t.width + n.y), i && (!r || r === I.top) && (i = e.bottom > n.y), i;
}
function cn(e, t) {
	return {
		bottom: e.y + t,
		left: e.x - t,
		right: e.x + t,
		top: e.y - t
	};
}
function ln(e, ...t) {
	for (let n of t) {
		if (n == null) continue;
		if (!yt(n)) {
			e = n;
			continue;
		}
		let t = Array.isArray(n);
		t && (yt(e) || !e || !Array.isArray(e)) ? e = [] : !t && (yt(e) || !e || Array.isArray(e)) && (e = {});
		for (let t in n) {
			if (t === "__proto__") continue;
			let r = n[t], i = e;
			i[t] = yt(r) && Array.isArray(r) ? r.map((e) => ln(i[t], e)) : ln(i[t], r);
		}
	}
	return e;
}
function un(e, t) {
	return !!yn(t, (t) => t.enable && tn(e, t.mode));
}
function dn(e, t, n) {
	_n(t, (t) => {
		let r = t.mode;
		t.enable && tn(e, r) && fn(t, n);
	});
}
function fn(e, t) {
	let n = e.selectors;
	_n(n, (n) => {
		t(n, e);
	});
}
function pn(e, t) {
	if (t && e) return yn(e, (e) => Yt(t, e.selectors));
}
function mn(e) {
	return {
		position: e.getPosition(),
		radius: e.getRadius(),
		mass: e.getMass(),
		velocity: e.velocity,
		factor: St.create(P(e.options.bounce.horizontal.value), P(e.options.bounce.vertical.value))
	};
}
function hn(e, t) {
	let { x: n, y: r } = e.velocity.sub(t.velocity), [i, a] = [e.position, t.position], { dx: o, dy: s } = Nt(a, i);
	if (n * o + r * s < 0) return;
	let c = -Math.atan2(s, o), l = e.mass, u = t.mass, d = e.velocity.rotate(c), f = t.velocity.rotate(c), p = Rt(d, f, l, u), m = Rt(f, d, l, u), h = p.rotate(-c), g = m.rotate(-c);
	e.velocity.x = h.x * e.factor.x, e.velocity.y = h.y * e.factor.y, t.velocity.x = g.x * t.factor.x, t.velocity.y = g.y * t.factor.y;
}
function gn(e, t) {
	let n = cn(e.getPosition(), e.getRadius()), r = e.options.bounce, i = Jt({
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
		factor: P(r.horizontal.value)
	});
	i.bounced && (i.velocity !== void 0 && (e.velocity.x = i.velocity), i.position !== void 0 && (e.position.x = i.position));
	let a = Jt({
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
		factor: P(r.vertical.value)
	});
	a.bounced && (a.velocity !== void 0 && (e.velocity.y = a.velocity), a.position !== void 0 && (e.position.y = a.position));
}
function _n(e, t) {
	return bt(e) ? e.map((e, n) => t(e, n)) : t(e, 0);
}
function vn(e, t, n) {
	return bt(e) ? an(e, t, n) : e;
}
function yn(e, t) {
	return bt(e) ? e.find((e, n) => t(e, n)) : t(e, 0) ? e : void 0;
}
function bn(e, t) {
	let n = e.value, r = e.animation, i = {
		delayTime: P(r.delay) * rt,
		enable: r.enable,
		value: P(e.value) * t,
		max: Mt(n) * t,
		min: jt(n) * t,
		loops: 0,
		maxLoops: P(r.count),
		time: 0
	};
	if (r.enable) {
		switch (i.decay = 1 - P(r.decay), r.mode) {
			case Vt.increase:
				i.status = Ht.increasing;
				break;
			case Vt.decrease:
				i.status = Ht.decreasing;
				break;
			case Vt.random: i.status = Tt() >= .5 ? Ht.increasing : Ht.decreasing;
		}
		let e = r.mode === Vt.auto;
		switch (r.startValue) {
			case Gt.min:
				i.value = i.min, e && (i.status = Ht.increasing);
				break;
			case Gt.max:
				i.value = i.max, e && (i.status = Ht.decreasing);
				break;
			case Gt.random:
			default: i.value = At(i), e && (i.status = Tt() >= .5 ? Ht.increasing : Ht.decreasing);
		}
	}
	return i.initialValue = i.value, i;
}
function xn(e, t) {
	if (e.mode !== Wt.percent) {
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
function Sn(e, t) {
	return xn(e, t);
}
function Cn(e, t, n, r, i) {
	switch (t) {
		case Ut.max:
			n >= i && e.destroy();
			break;
		case Ut.min: n <= r && e.destroy();
	}
}
function wn(e, t, n, r, i) {
	if (e.destroyed || !t || !t.enable || (t.maxLoops ?? 0) > 0 && (t.loops ?? 0) > (t.maxLoops ?? 0)) return;
	let a = (t.velocity ?? 0) * i.factor, o = t.min, s = t.max, c = t.decay ?? 1;
	if (t.time ||= 0, (t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0) && (t.time += i.value), !((t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0))) {
		switch (t.status) {
			case Ht.increasing:
				t.value >= s ? (n ? t.status = Ht.decreasing : t.value -= s, t.loops ||= 0, t.loops++) : t.value += a;
				break;
			case Ht.decreasing: t.value <= o ? (n ? t.status = Ht.increasing : t.value += s, t.loops ||= 0, t.loops++) : t.value -= a;
		}
		t.velocity && c !== 1 && (t.velocity *= c), Cn(e, r, t.value, o, s), e.destroyed || (t.value = Ot(t.value, o, s));
	}
}
function Tn(e) {
	let t = document.createElement("div").style;
	if (!e) return t;
	for (let n in e) {
		let r = e[n];
		if (!Object.prototype.hasOwnProperty.call(e, n) || N(r)) continue;
		let i = e.getPropertyValue?.(r);
		if (!i) continue;
		let a = e.getPropertyPriority?.(r);
		a ? t.setProperty?.(r, i, a) : t.setProperty?.(r, i);
	}
	return t;
}
function En(e) {
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
var Dn = L(En), On;
(function(e) {
	e.darken = "darken", e.enlighten = "enlighten";
})(On ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/ColorUtils.js
function kn(e, t) {
	if (t) {
		for (let n of e.colorManagers.values()) if (t.startsWith(n.stringPrefix)) return n.parseString(t);
	}
}
function An(e, t, n, r = !0) {
	if (!t) return;
	let i = _t(t) ? { value: t } : t;
	if (_t(i.value)) return jn(e, i.value, n, r);
	if (bt(i.value)) return An(e, { value: an(i.value, n, r) });
	for (let t of e.colorManagers.values()) {
		let e = t.handleRangeColor(i);
		if (e) return e;
	}
}
function jn(e, t, n, r = !0) {
	if (!t) return;
	let i = _t(t) ? { value: t } : t;
	if (_t(i.value)) return i.value === "random" ? Ln() : Pn(e, i.value);
	if (bt(i.value)) return jn(e, { value: an(i.value, n, r) });
	for (let t of e.colorManagers.values()) {
		let e = t.handleColor(i);
		if (e) return e;
	}
}
function Mn(e, t, n, r = !0) {
	let i = An(e, t, n, r);
	return i ? Nn(i) : void 0;
}
function Nn(e) {
	let t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.max(t, n, r), a = Math.min(t, n, r), o = {
		h: 0,
		l: (i + a) * nt,
		s: 0
	};
	return i !== a && (o.s = o.l < .5 ? (i - a) / (i + a) : (i - a) / (2 - i - a), o.h = t === i ? (n - r) / (i - a) : o.h = n === i ? 2 + (r - t) / (i - a) : 4 + (t - n) / (i - a)), o.l *= 100, o.s *= 100, o.h *= 60, o.h < 0 && (o.h += 360), o.h >= 360 && (o.h -= 360), o;
}
function Pn(e, t) {
	return kn(e, t);
}
function Fn(e) {
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
function In(e) {
	let t = Fn(e);
	return {
		a: e.a,
		b: t.b,
		g: t.g,
		r: t.r
	};
}
function Ln(e) {
	let t = e ?? 0;
	return {
		b: Math.floor(At(F(t, 256))),
		g: Math.floor(At(F(t, 256))),
		r: Math.floor(At(F(t, 256)))
	};
}
function Rn(e, t) {
	return `rgba(${e.r}, ${e.g}, ${e.b}, ${t ?? 1})`;
}
function zn(e, t) {
	return `hsla(${e.h}, ${e.s}%, ${e.l}%, ${t ?? 1})`;
}
function Bn(e, t, n, r) {
	let i = e, a = t;
	return i.r === void 0 && (i = Fn(e)), a.r === void 0 && (a = Fn(t)), {
		b: kt(i.b, a.b, n, r),
		g: kt(i.g, a.g, n, r),
		r: kt(i.r, a.r, n, r)
	};
}
function Vn(e, t, n) {
	if (n === "random") return Ln();
	if (n === "mid") {
		let n = e.getFillColor() ?? e.getStrokeColor(), r = t?.getFillColor() ?? t?.getStrokeColor();
		if (n && r && t) return Bn(n, r, e.getRadius(), t.getRadius());
		{
			let e = n ?? r;
			if (e) return Fn(e);
		}
	} else return n;
}
function Hn(e, t, n, r) {
	let i = _t(t) ? t : t.value;
	return i === "random" ? r ? An(e, { value: i }) : n ? ot : "mid" : i === "mid" ? "mid" : An(e, { value: i });
}
function Un(e) {
	return e === void 0 ? void 0 : {
		h: e.h.value,
		s: e.s.value,
		l: e.l.value
	};
}
function Wn(e, t, n) {
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
	return t && (Gn(r.h, t.h, n), Gn(r.s, t.s, n), Gn(r.l, t.l, n)), r;
}
function Gn(e, t, n) {
	e.enable = t.enable, e.enable ? (e.velocity = P(t.speed) / 100 * n, e.decay = 1 - P(t.decay), e.status = Ht.increasing, e.loops = 0, e.maxLoops = P(t.count), e.time = 0, e.delayTime = P(t.delay) * rt, t.sync || (e.velocity *= Tt(), e.value *= Tt()), e.initialValue = e.value, e.offset = F(t.offset)) : e.velocity = 0;
}
function Kn(e, t, n, r) {
	if (!e || !e.enable || (e.maxLoops ?? 0) > 0 && (e.loops ?? 0) > (e.maxLoops ?? 0) || (e.time ||= 0, (e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0) && (e.time += r.value), (e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0))) return;
	let i = e.offset ? At(e.offset) : 0, a = (e.velocity ?? 0) * r.factor + i * 3.6, o = e.decay ?? 1, s = Mt(t), c = jt(t);
	!n || e.status === Ht.increasing ? (e.value += a, e.value > s && (e.loops ||= 0, e.loops++, n ? e.status = Ht.decreasing : e.value -= s)) : (e.value -= a, e.value < 0 && (e.loops ||= 0, e.loops++, e.status = Ht.increasing)), e.velocity && o !== 1 && (e.velocity *= o), e.value = Ot(e.value, c, s);
}
function qn(e, t) {
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
	n && Kn(n, a.h, !1, t), r && Kn(r, a.s, !0, t), i && Kn(i, a.l, !0, t);
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/CanvasUtils.js
function Jn(e, t, n) {
	e.beginPath(), e.moveTo(t.x, t.y), e.lineTo(n.x, n.y), e.closePath();
}
function Yn(e, t, n) {
	e.fillStyle = n ?? "rgba(0,0,0,0)", e.fillRect(it.x, it.y, t.width, t.height);
}
function Xn(e, t, n, r) {
	n && (e.globalAlpha = r, e.drawImage(n, it.x, it.y, t.width, t.height), e.globalAlpha = 1);
}
function Zn(e, t) {
	e.clearRect(it.x, it.y, t.width, t.height);
}
function Qn(e) {
	let { container: t, context: n, particle: r, delta: i, colorStyles: a, backgroundMask: o, composite: s, radius: c, opacity: l, shadow: u, transform: d } = e, f = r.getPosition(), p = r.rotation + (r.pathRotation ? r.velocity.angle : 0), m = {
		sin: Math.sin(p),
		cos: Math.cos(p)
	}, h = !!p, g = {
		a: m.cos * (d.a ?? at.a),
		b: h ? m.sin * (d.b ?? 1) : d.b ?? at.b,
		c: h ? -m.sin * (d.c ?? 1) : d.c ?? at.c,
		d: m.cos * (d.d ?? at.d)
	};
	n.setTransform(g.a, g.b, g.c, g.d, f.x, f.y), o && (n.globalCompositeOperation = s);
	let _ = r.shadowColor;
	u.enable && _ && (n.shadowBlur = u.blur, n.shadowColor = Rn(_), n.shadowOffsetX = u.offset.x, n.shadowOffsetY = u.offset.y), a.fill && (n.fillStyle = a.fill);
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
	er(y), tr(y), $n(y), n.globalCompositeOperation = "source-over", n.resetTransform();
}
function $n(e) {
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
function er(e) {
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
function tr(e) {
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
function nr(e, t, n) {
	t.draw && t.draw(e, n);
}
function rr(e, t, n, r) {
	t.drawParticle && t.drawParticle(e, n, r);
}
function ir(e, t, n) {
	return {
		h: e.h,
		s: e.s,
		l: e.l + (t === On.darken ? -1 : 1) * n
	};
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Canvas.js
function ar(e, t, n) {
	let r = t[n];
	r !== void 0 && (e[n] = (e[n] ?? 1) * r);
}
function or(e, t, n = !1) {
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
var sr = class {
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
					for (let t in e) ar(a, e, t);
				}
				o.beforeDraw?.(t);
			}
		}, this._applyResizePlugins = () => {
			for (let e of this._resizePlugins) e.resize?.();
		}, this._getPluginParticleColors = (e) => {
			let t, n;
			for (let r of this._colorPlugins) if (!t && r.particleFillColor && (t = Mn(this._engine, r.particleFillColor(e))), !n && r.particleStrokeColor && (n = Mn(this._engine, r.particleStrokeColor(e))), t && n) break;
			return [t, n];
		}, this._initCover = async () => {
			let e = this.container.actualOptions.backgroundMask.cover, t = e.color;
			if (t) {
				let n = An(this._engine, t);
				if (n) {
					let t = {
						...n,
						a: e.opacity
					};
					this._coverColorStyle = Rn(t, t.a);
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
				let e = An(this._engine, t.color);
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
			this.draw((t) => Yn(t, this.size, e));
		}, this._paintImage = (e, t) => {
			this.draw((n) => Xn(n, this.size, e, t));
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
			e && t && or(e, t, !0);
		}, this._safeMutationObserver = (e) => {
			this._mutationObserver && e(this._mutationObserver);
		}, this._setFullScreenStyle = () => {
			let e = this.element;
			e && or(e, Dn(this.container.actualOptions.fullScreen.zIndex), !0);
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
		e.backgroundMask.enable ? this.paint() : t.enable && t.length > 0 && n ? n.color ? this._paintBase(Rn(n.color, n.opacity)) : n.image && this._paintImage(n.image, n.opacity) : e.clear && this.draw((e) => {
			Zn(e, this.size);
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
			let i = this.container, s = i.actualOptions, c = e.options.zIndex, l = 1 - e.zIndexFactor, u = l ** c.opacityRate, d = e.bubble.opacity ?? e.opacity?.value ?? 1, f = e.strokeOpacity ?? d, p = d * u, m = f * u, h = {}, g = { fill: a ? zn(a, p) : void 0 };
			g.stroke = o ? zn(o, m) : g.fill, this._applyPreDrawUpdaters(r, e, n, p, g, h), Qn({
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
		this.draw((r) => rr(r, e, t, n));
	}
	drawPlugin(e, t) {
		this.draw((n) => nr(n, e, t));
	}
	async init() {
		this._safeMutationObserver((e) => e.disconnect()), this._mutationObserver = en((e) => {
			for (let t of e) t.type === "attributes" && t.attributeName === "style" && this._repairStyle();
		}), this.resize(), this._initStyle(), await this._initCover();
		try {
			await this._initTrail();
		} catch (e) {
			qt().error(e);
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
				let t = An(this._engine, e.color);
				n.backgroundColor = t ? Rn(t, e.opacity) : "";
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
		this._generated && this.element && this.element.remove(), this._generated = e.dataset && "generated" in e.dataset ? e.dataset[Ue] === "true" : this._generated, this.element = e, this.element.ariaHidden = "true", this._originalStyle = Tn(this.element.style);
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
			e.backgroundMask.enable && e.backgroundMask.cover ? (Zn(t, this.size), this._coverImage ? this._paintImage(this._coverImage.image, this._coverImage.opacity) : this._coverColorStyle ? this._paintBase(this._coverColorStyle) : this._paintBase()) : this._paintBase();
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
		this._safeMutationObserver((e) => e.disconnect()), this._mutationObserver = void 0, this.draw((e) => Zn(e, this.size));
	}
	async windowResize() {
		if (!this.element || !this.resize()) return;
		let e = this.container, t = e.updateActualOptions();
		e.particles.setDensity(), this._applyResizePlugins(), t && await e.refresh();
	}
}, cr;
(function(e) {
	e.canvas = "canvas", e.parent = "parent", e.window = "window";
})(cr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/EventListeners.js
function lr(e, t, n, r, i) {
	if (r) {
		let r = { passive: !0 };
		gt(i) ? r.capture = i : i !== void 0 && (r = i), e.addEventListener(t, n, r);
	} else {
		let r = i;
		e.removeEventListener(t, n, r);
	}
}
var ur = class {
	constructor(e) {
		this.container = e, this._doMouseTouchClick = (e) => {
			let t = this.container, n = t.actualOptions;
			if (this._canPush) {
				let e = t.interactivity.mouse, r = e.position;
				if (!r) return;
				e.clickPosition = { ...r }, e.clickTime = (/* @__PURE__ */ new Date()).getTime();
				let i = n.interactivity.events.onClick;
				_n(i.mode, (e) => this.container.handleClickMode(e));
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
			this._resizeTimeout = setTimeout(() => void e(), this.container.actualOptions.interactivity.events.resize.delay * rt);
		}, this._manageInteractivityListeners = (e, t) => {
			let n = this._handlers, r = this.container, i = r.actualOptions, a = r.interactivity.element;
			if (!a) return;
			let o = a, s = r.canvas;
			s.setPointerEvents(o === s.element ? "initial" : "none"), (i.interactivity.events.onHover.enable || i.interactivity.events.onClick.enable) && (lr(a, Je, n.mouseMove, t), lr(a, Ye, n.touchStart, t), lr(a, Ze, n.touchMove, t), i.interactivity.events.onClick.enable ? (lr(a, Xe, n.touchEndClick, t), lr(a, Ge, n.mouseUp, t), lr(a, We, n.mouseDown, t)) : lr(a, Xe, n.touchEnd, t), lr(a, e, n.mouseLeave, t), lr(a, Qe, n.touchCancel, t));
		}, this._manageListeners = (e) => {
			let t = this._handlers, n = this.container, r = n.actualOptions.interactivity.detectsOn, i = n.canvas.element, a = Ke;
			r === cr.window ? (n.interactivity.element = window, a = qe) : r === cr.parent && i ? n.interactivity.element = i.parentElement ?? i.parentNode : n.interactivity.element = i, this._manageMediaMatch(e), this._manageResize(e), this._manageInteractivityListeners(a, e), document && lr(document, et, t.visibilityChange, e, !1);
		}, this._manageMediaMatch = (e) => {
			let t = this._handlers, n = Qt("(prefers-color-scheme: dark)");
			if (n) {
				if (n.addEventListener !== void 0) {
					lr(n, "change", t.themeChange, e);
					return;
				}
				n.addListener !== void 0 && (e ? n.addListener(t.oldThemeChange) : n.removeListener(t.oldThemeChange));
			}
		}, this._manageResize = (e) => {
			let t = this._handlers, n = this.container;
			if (!n.actualOptions.interactivity.events.resize) return;
			if (typeof ResizeObserver > "u") {
				lr(window, $e, t.resize, e);
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
			delete t.position, delete t.clickPosition, delete t.downPosition, e.status = Ke, t.inside = !1, t.clicking = !1;
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
				} else if (n.interactivity.detectsOn === cr.parent) {
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
			a && (a.x *= o, a.y *= o), r.mouse.position = a, r.status = Je;
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
}, dr;
(function(e) {
	e.configAdded = "configAdded", e.containerInit = "containerInit", e.particlesSetup = "particlesSetup", e.containerStarted = "containerStarted", e.containerStopped = "containerStopped", e.containerDestroyed = "containerDestroyed", e.containerPaused = "containerPaused", e.containerPlay = "containerPlay", e.containerBuilt = "containerBuilt", e.particleAdded = "particleAdded", e.particleDestroyed = "particleDestroyed", e.particleRemoved = "particleRemoved";
})(dr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/OptionsColor.js
var fr = class e {
	constructor() {
		this.value = "";
	}
	static create(t, n) {
		let r = new e();
		return r.load(t), n !== void 0 && (_t(n) || bt(n) ? r.load({ value: n }) : r.load(n)), r;
	}
	load(e) {
		N(e) || N(e.value) || (this.value = e.value);
	}
}, pr = class {
	constructor() {
		this.color = new fr(), this.color.value = "", this.image = "", this.position = "", this.repeat = "", this.size = "", this.opacity = 1;
	}
	load(e) {
		N(e) || (e.color !== void 0 && (this.color = fr.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.position !== void 0 && (this.position = e.position), e.repeat !== void 0 && (this.repeat = e.repeat), e.size !== void 0 && (this.size = e.size), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, mr = class {
	constructor() {
		this.opacity = 1;
	}
	load(e) {
		N(e) || (e.color !== void 0 && (this.color = fr.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, hr = class {
	constructor() {
		this.composite = "destination-out", this.cover = new mr(), this.enable = !1;
	}
	load(e) {
		if (!N(e)) {
			if (e.composite !== void 0 && (this.composite = e.composite), e.cover !== void 0) {
				let t = e.cover, n = _t(e.cover) ? { color: e.cover } : e.cover;
				this.cover.load(t.color !== void 0 || t.image !== void 0 ? t : { color: n });
			}
			e.enable !== void 0 && (this.enable = e.enable);
		}
	}
}, gr = class {
	constructor() {
		this.enable = !0, this.zIndex = 0;
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.zIndex !== void 0 && (this.zIndex = e.zIndex));
	}
}, _r = class {
	constructor() {
		this.enable = !1, this.mode = [];
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode));
	}
}, vr;
(function(e) {
	e.circle = "circle", e.rectangle = "rectangle";
})(vr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Interactivity/Events/DivEvent.js
var yr = class {
	constructor() {
		this.selectors = [], this.enable = !1, this.mode = [], this.type = vr.circle;
	}
	load(e) {
		N(e) || (e.selectors !== void 0 && (this.selectors = e.selectors), e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), e.type !== void 0 && (this.type = e.type));
	}
}, br = class {
	constructor() {
		this.enable = !1, this.force = 2, this.smooth = 10;
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.force !== void 0 && (this.force = e.force), e.smooth !== void 0 && (this.smooth = e.smooth));
	}
}, xr = class {
	constructor() {
		this.enable = !1, this.mode = [], this.parallax = new br();
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), this.parallax.load(e.parallax));
	}
}, Sr = class {
	constructor() {
		this.delay = .5, this.enable = !0;
	}
	load(e) {
		N(e) || (e.delay !== void 0 && (this.delay = e.delay), e.enable !== void 0 && (this.enable = e.enable));
	}
}, Cr = class {
	constructor() {
		this.onClick = new _r(), this.onDiv = new yr(), this.onHover = new xr(), this.resize = new Sr();
	}
	load(e) {
		if (N(e)) return;
		this.onClick.load(e.onClick);
		let t = e.onDiv;
		t !== void 0 && (this.onDiv = _n(t, (e) => {
			let t = new yr();
			return t.load(e), t;
		})), this.onHover.load(e.onHover), this.resize.load(e.resize);
	}
}, wr = class {
	constructor(e, t) {
		this._engine = e, this._container = t;
	}
	load(e) {
		if (N(e) || !this._container) return;
		let t = this._engine.interactors.get(this._container);
		if (t) for (let n of t) n.loadModeOptions && n.loadModeOptions(this, e);
	}
}, Tr = class {
	constructor(e, t) {
		this.detectsOn = cr.window, this.events = new Cr(), this.modes = new wr(e, t);
	}
	load(e) {
		if (N(e)) return;
		let t = e.detectsOn;
		t !== void 0 && (this.detectsOn = t), this.events.load(e.events), this.modes.load(e.modes);
	}
}, Er = class {
	load(e) {
		N(e) || (e.position && (this.position = {
			x: e.position.x ?? 50,
			y: e.position.y ?? 50,
			mode: e.position.mode ?? Wt.percent
		}), e.options && (this.options = ln({}, e.options)));
	}
}, Dr;
(function(e) {
	e.screen = "screen", e.canvas = "canvas";
})(Dr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Responsive.js
var Or = class {
	constructor() {
		this.maxWidth = Infinity, this.options = {}, this.mode = Dr.canvas;
	}
	load(e) {
		N(e) || (N(e.maxWidth) || (this.maxWidth = e.maxWidth), N(e.mode) || (this.mode = e.mode === Dr.screen ? Dr.screen : Dr.canvas), N(e.options) || (this.options = ln({}, e.options)));
	}
}, kr;
(function(e) {
	e.any = "any", e.dark = "dark", e.light = "light";
})(kr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Theme/ThemeDefault.js
var Ar = class {
	constructor() {
		this.auto = !1, this.mode = kr.any, this.value = !1;
	}
	load(e) {
		N(e) || (e.auto !== void 0 && (this.auto = e.auto), e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
	}
}, jr = class {
	constructor() {
		this.name = "", this.default = new Ar();
	}
	load(e) {
		N(e) || (e.name !== void 0 && (this.name = e.name), this.default.load(e.default), e.options !== void 0 && (this.options = ln({}, e.options)));
	}
}, Mr = class {
	constructor() {
		this.count = 0, this.enable = !1, this.speed = 1, this.decay = 0, this.delay = 0, this.sync = !1;
	}
	load(e) {
		N(e) || (e.count !== void 0 && (this.count = F(e.count)), e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = F(e.speed)), e.decay !== void 0 && (this.decay = F(e.decay)), e.delay !== void 0 && (this.delay = F(e.delay)), e.sync !== void 0 && (this.sync = e.sync));
	}
}, Nr = class extends Mr {
	constructor() {
		super(), this.mode = Vt.auto, this.startValue = Gt.random;
	}
	load(e) {
		super.load(e), !N(e) && (e.mode !== void 0 && (this.mode = e.mode), e.startValue !== void 0 && (this.startValue = e.startValue));
	}
}, Pr = class extends Mr {
	constructor() {
		super(), this.offset = 0, this.sync = !0;
	}
	load(e) {
		super.load(e), !N(e) && e.offset !== void 0 && (this.offset = F(e.offset));
	}
}, Fr = class {
	constructor() {
		this.h = new Pr(), this.s = new Pr(), this.l = new Pr();
	}
	load(e) {
		N(e) || (this.h.load(e.h), this.s.load(e.s), this.l.load(e.l));
	}
}, Ir = class e extends fr {
	constructor() {
		super(), this.animation = new Fr();
	}
	static create(t, n) {
		let r = new e();
		return r.load(t), n !== void 0 && (_t(n) || bt(n) ? r.load({ value: n }) : r.load(n)), r;
	}
	load(e) {
		if (super.load(e), N(e)) return;
		let t = e.animation;
		t !== void 0 && (t.enable === void 0 ? this.animation.load(e.animation) : this.animation.h.load(t));
	}
}, Lr;
(function(e) {
	e.absorb = "absorb", e.bounce = "bounce", e.destroy = "destroy";
})(Lr ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Particles/Collisions/CollisionsAbsorb.js
var Rr = class {
	constructor() {
		this.speed = 2;
	}
	load(e) {
		N(e) || e.speed !== void 0 && (this.speed = e.speed);
	}
}, zr = class {
	constructor() {
		this.enable = !0, this.retries = 0;
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.retries !== void 0 && (this.retries = e.retries));
	}
}, Br = class {
	constructor() {
		this.value = 0;
	}
	load(e) {
		N(e) || N(e.value) || (this.value = F(e.value));
	}
}, Vr = class extends Br {
	constructor() {
		super(), this.animation = new Mr();
	}
	load(e) {
		if (super.load(e), N(e)) return;
		let t = e.animation;
		t !== void 0 && this.animation.load(t);
	}
}, Hr = class extends Vr {
	constructor() {
		super(), this.animation = new Nr();
	}
	load(e) {
		super.load(e);
	}
}, Ur = class extends Br {
	constructor() {
		super(), this.value = 1;
	}
}, Wr = class {
	constructor() {
		this.horizontal = new Ur(), this.vertical = new Ur();
	}
	load(e) {
		N(e) || (this.horizontal.load(e.horizontal), this.vertical.load(e.vertical));
	}
}, Gr = class {
	constructor() {
		this.absorb = new Rr(), this.bounce = new Wr(), this.enable = !1, this.maxSpeed = 50, this.mode = Lr.bounce, this.overlap = new zr();
	}
	load(e) {
		N(e) || (this.absorb.load(e.absorb), this.bounce.load(e.bounce), e.enable !== void 0 && (this.enable = e.enable), e.maxSpeed !== void 0 && (this.maxSpeed = F(e.maxSpeed)), e.mode !== void 0 && (this.mode = e.mode), this.overlap.load(e.overlap));
	}
}, Kr = class {
	constructor() {
		this.close = !0, this.fill = !0, this.options = {}, this.type = [];
	}
	load(e) {
		if (N(e)) return;
		let t = e.options;
		if (t !== void 0) for (let e in t) {
			let n = t[e];
			n && (this.options[e] = ln(this.options[e] ?? {}, n));
		}
		e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
	}
}, qr = class {
	constructor() {
		this.offset = 0, this.value = 90;
	}
	load(e) {
		N(e) || (e.offset !== void 0 && (this.offset = F(e.offset)), e.value !== void 0 && (this.value = F(e.value)));
	}
}, Jr = class {
	constructor() {
		this.distance = 200, this.enable = !1, this.rotate = {
			x: 3e3,
			y: 3e3
		};
	}
	load(e) {
		if (!N(e) && (e.distance !== void 0 && (this.distance = F(e.distance)), e.enable !== void 0 && (this.enable = e.enable), e.rotate)) {
			let t = e.rotate.x;
			t !== void 0 && (this.rotate.x = t);
			let n = e.rotate.y;
			n !== void 0 && (this.rotate.y = n);
		}
	}
}, Yr = class {
	constructor() {
		this.x = 50, this.y = 50, this.mode = Wt.percent, this.radius = 0;
	}
	load(e) {
		N(e) || (e.x !== void 0 && (this.x = e.x), e.y !== void 0 && (this.y = e.y), e.mode !== void 0 && (this.mode = e.mode), e.radius !== void 0 && (this.radius = e.radius));
	}
}, Xr = class {
	constructor() {
		this.acceleration = 9.81, this.enable = !1, this.inverse = !1, this.maxSpeed = 50;
	}
	load(e) {
		N(e) || (e.acceleration !== void 0 && (this.acceleration = F(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.inverse !== void 0 && (this.inverse = e.inverse), e.maxSpeed !== void 0 && (this.maxSpeed = F(e.maxSpeed)));
	}
}, Zr = class {
	constructor() {
		this.clamp = !0, this.delay = new Br(), this.enable = !1, this.options = {};
	}
	load(e) {
		N(e) || (e.clamp !== void 0 && (this.clamp = e.clamp), this.delay.load(e.delay), e.enable !== void 0 && (this.enable = e.enable), this.generator = e.generator, e.options && (this.options = ln(this.options, e.options)));
	}
}, Qr = class {
	load(e) {
		N(e) || (e.color !== void 0 && (this.color = fr.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image));
	}
}, $r = class {
	constructor() {
		this.enable = !1, this.length = 10, this.fill = new Qr();
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.fill !== void 0 && this.fill.load(e.fill), e.length !== void 0 && (this.length = e.length));
	}
}, ei;
(function(e) {
	e.bounce = "bounce", e.none = "none", e.out = "out", e.destroy = "destroy", e.split = "split";
})(ei ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Particles/Move/OutModes.js
var ti = class {
	constructor() {
		this.default = ei.out;
	}
	load(e) {
		N(e) || (e.default !== void 0 && (this.default = e.default), this.bottom = e.bottom ?? e.default, this.left = e.left ?? e.default, this.right = e.right ?? e.default, this.top = e.top ?? e.default);
	}
}, ni = class {
	constructor() {
		this.acceleration = 0, this.enable = !1;
	}
	load(e) {
		N(e) || (e.acceleration !== void 0 && (this.acceleration = F(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.position && (this.position = ln({}, e.position)));
	}
}, ri = class {
	constructor() {
		this.angle = new qr(), this.attract = new Jr(), this.center = new Yr(), this.decay = 0, this.distance = {}, this.direction = ht.none, this.drift = 0, this.enable = !1, this.gravity = new Xr(), this.path = new Zr(), this.outModes = new ti(), this.random = !1, this.size = !1, this.speed = 2, this.spin = new ni(), this.straight = !1, this.trail = new $r(), this.vibrate = !1, this.warp = !1;
	}
	load(e) {
		if (N(e)) return;
		this.angle.load(vt(e.angle) ? { value: e.angle } : e.angle), this.attract.load(e.attract), this.center.load(e.center), e.decay !== void 0 && (this.decay = F(e.decay)), e.direction !== void 0 && (this.direction = e.direction), e.distance !== void 0 && (this.distance = vt(e.distance) ? {
			horizontal: e.distance,
			vertical: e.distance
		} : { ...e.distance }), e.drift !== void 0 && (this.drift = F(e.drift)), e.enable !== void 0 && (this.enable = e.enable), this.gravity.load(e.gravity);
		let t = e.outModes;
		t !== void 0 && (yt(t) ? this.outModes.load(t) : this.outModes.load({ default: t })), this.path.load(e.path), e.random !== void 0 && (this.random = e.random), e.size !== void 0 && (this.size = e.size), e.speed !== void 0 && (this.speed = F(e.speed)), this.spin.load(e.spin), e.straight !== void 0 && (this.straight = e.straight), this.trail.load(e.trail), e.vibrate !== void 0 && (this.vibrate = e.vibrate), e.warp !== void 0 && (this.warp = e.warp);
	}
}, ii = class extends Nr {
	constructor() {
		super(), this.destroy = Ut.none, this.speed = 2;
	}
	load(e) {
		super.load(e), !N(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
	}
}, ai = class extends Hr {
	constructor() {
		super(), this.animation = new ii(), this.value = 1;
	}
	load(e) {
		if (N(e)) return;
		super.load(e);
		let t = e.animation;
		t !== void 0 && this.animation.load(t);
	}
}, oi = class {
	constructor() {
		this.enable = !1, this.width = 1920, this.height = 1080;
	}
	load(e) {
		if (N(e)) return;
		e.enable !== void 0 && (this.enable = e.enable);
		let t = e.width;
		t !== void 0 && (this.width = t);
		let n = e.height;
		n !== void 0 && (this.height = n);
	}
}, si;
(function(e) {
	e.delete = "delete", e.wait = "wait";
})(si ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Particles/Number/ParticlesNumberLimit.js
var ci = class {
	constructor() {
		this.mode = si.delete, this.value = 0;
	}
	load(e) {
		N(e) || (e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
	}
}, li = class {
	constructor() {
		this.density = new oi(), this.limit = new ci(), this.value = 0;
	}
	load(e) {
		N(e) || (this.density.load(e.density), this.limit.load(e.limit), e.value !== void 0 && (this.value = e.value));
	}
}, ui = class {
	constructor() {
		this.blur = 0, this.color = new fr(), this.enable = !1, this.offset = {
			x: 0,
			y: 0
		}, this.color.value = "#000";
	}
	load(e) {
		N(e) || (e.blur !== void 0 && (this.blur = e.blur), this.color = fr.create(this.color, e.color), e.enable !== void 0 && (this.enable = e.enable), e.offset !== void 0 && (e.offset.x !== void 0 && (this.offset.x = e.offset.x), e.offset.y !== void 0 && (this.offset.y = e.offset.y)));
	}
}, di = class {
	constructor() {
		this.close = !0, this.fill = !0, this.options = {}, this.type = "circle";
	}
	load(e) {
		if (N(e)) return;
		let t = e.options;
		if (t !== void 0) for (let e in t) {
			let n = t[e];
			n && (this.options[e] = ln(this.options[e] ?? {}, n));
		}
		e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
	}
}, fi = class extends Nr {
	constructor() {
		super(), this.destroy = Ut.none, this.speed = 5;
	}
	load(e) {
		super.load(e), !N(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
	}
}, pi = class extends Hr {
	constructor() {
		super(), this.animation = new fi(), this.value = 3;
	}
	load(e) {
		if (super.load(e), N(e)) return;
		let t = e.animation;
		t !== void 0 && this.animation.load(t);
	}
}, mi = class {
	constructor() {
		this.width = 0;
	}
	load(e) {
		N(e) || (e.color !== void 0 && (this.color = Ir.create(this.color, e.color)), e.width !== void 0 && (this.width = F(e.width)), e.opacity !== void 0 && (this.opacity = F(e.opacity)));
	}
}, hi = class extends Br {
	constructor() {
		super(), this.opacityRate = 1, this.sizeRate = 1, this.velocityRate = 1;
	}
	load(e) {
		super.load(e), !N(e) && (e.opacityRate !== void 0 && (this.opacityRate = e.opacityRate), e.sizeRate !== void 0 && (this.sizeRate = e.sizeRate), e.velocityRate !== void 0 && (this.velocityRate = e.velocityRate));
	}
}, gi = class {
	constructor(e, t) {
		this._engine = e, this._container = t, this.bounce = new Wr(), this.collisions = new Gr(), this.color = new Ir(), this.color.value = "#fff", this.effect = new Kr(), this.groups = {}, this.move = new ri(), this.number = new li(), this.opacity = new ai(), this.reduceDuplicates = !1, this.shadow = new ui(), this.shape = new di(), this.size = new pi(), this.stroke = new mi(), this.zIndex = new hi();
	}
	load(e) {
		if (N(e)) return;
		if (e.groups !== void 0) for (let t of Object.keys(e.groups)) {
			if (!Object.hasOwn(e.groups, t)) continue;
			let n = e.groups[t];
			n !== void 0 && (this.groups[t] = ln(this.groups[t] ?? {}, n));
		}
		e.reduceDuplicates !== void 0 && (this.reduceDuplicates = e.reduceDuplicates), this.bounce.load(e.bounce), this.color.load(Ir.create(this.color, e.color)), this.effect.load(e.effect), this.move.load(e.move), this.number.load(e.number), this.opacity.load(e.opacity), this.shape.load(e.shape), this.size.load(e.size), this.shadow.load(e.shadow), this.zIndex.load(e.zIndex), this.collisions.load(e.collisions), e.interactivity !== void 0 && (this.interactivity = ln({}, e.interactivity));
		let t = e.stroke;
		if (t && (this.stroke = _n(t, (e) => {
			let t = new mi();
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
function _i(e, ...t) {
	for (let n of t) e.load(n);
}
function vi(e, t, ...n) {
	let r = new gi(e, t);
	return _i(r, ...n), r;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Options/Classes/Options.js
var yi = class {
	constructor(e, t) {
		this._findDefaultTheme = (e) => this.themes.find((t) => t.default.value && t.default.mode === e) ?? this.themes.find((e) => e.default.value && e.default.mode === kr.any), this._importPreset = (e) => {
			this.load(this._engine.getPreset(e));
		}, this._engine = e, this._container = t, this.autoPlay = !0, this.background = new pr(), this.backgroundMask = new hr(), this.clear = !0, this.defaultThemes = {}, this.delay = 0, this.fullScreen = new gr(), this.detectRetina = !0, this.duration = 0, this.fpsLimit = 120, this.interactivity = new Tr(e, t), this.manualParticles = [], this.particles = vi(this._engine, this._container), this.pauseOnBlur = !0, this.pauseOnOutsideViewport = !0, this.responsive = [], this.smooth = !1, this.style = {}, this.themes = [], this.zLayers = 100;
	}
	load(e) {
		if (N(e)) return;
		e.preset !== void 0 && _n(e.preset, (e) => this._importPreset(e)), e.autoPlay !== void 0 && (this.autoPlay = e.autoPlay), e.clear !== void 0 && (this.clear = e.clear), e.key !== void 0 && (this.key = e.key), e.name !== void 0 && (this.name = e.name), e.delay !== void 0 && (this.delay = F(e.delay));
		let t = e.detectRetina;
		t !== void 0 && (this.detectRetina = t), e.duration !== void 0 && (this.duration = F(e.duration));
		let n = e.fpsLimit;
		n !== void 0 && (this.fpsLimit = n), e.pauseOnBlur !== void 0 && (this.pauseOnBlur = e.pauseOnBlur), e.pauseOnOutsideViewport !== void 0 && (this.pauseOnOutsideViewport = e.pauseOnOutsideViewport), e.zLayers !== void 0 && (this.zLayers = e.zLayers), this.background.load(e.background);
		let r = e.fullScreen;
		gt(r) ? this.fullScreen.enable = r : this.fullScreen.load(r), this.backgroundMask.load(e.backgroundMask), this.interactivity.load(e.interactivity), e.manualParticles && (this.manualParticles = e.manualParticles.map((e) => {
			let t = new Er();
			return t.load(e), t;
		})), this.particles.load(e.particles), this.style = ln(this.style, e.style), this._engine.loadOptions(this, e), e.smooth !== void 0 && (this.smooth = e.smooth);
		let i = this._engine.interactors.get(this._container);
		if (i) for (let t of i) t.loadOptions && t.loadOptions(this, e);
		if (e.responsive !== void 0) for (let t of e.responsive) {
			let e = new Or();
			e.load(t), this.responsive.push(e);
		}
		if (this.responsive.sort((e, t) => e.maxWidth - t.maxWidth), e.themes !== void 0) for (let t of e.themes) {
			let e = this.themes.find((e) => e.name === t.name);
			if (e) e.load(t);
			else {
				let e = new jr();
				e.load(t), this.themes.push(e);
			}
		}
		this.defaultThemes.dark = this._findDefaultTheme(kr.dark)?.name, this.defaultThemes.light = this._findDefaultTheme(kr.light)?.name;
	}
	setResponsive(e, t, n) {
		this.load(n);
		let r = this.responsive.find((n) => n.mode === Dr.screen && screen ? n.maxWidth > screen.availWidth : n.maxWidth * t > e);
		return this.load(r?.options), r?.maxWidth;
	}
	setTheme(e) {
		if (e) {
			let t = this.themes.find((t) => t.name === e);
			t && this.load(t.options);
		} else {
			let e = Qt("(prefers-color-scheme: dark)")?.matches, t = this._findDefaultTheme(e ? kr.dark : kr.light);
			t && this.load(t.options);
		}
	}
}, bi;
(function(e) {
	e.external = "external", e.particles = "particles";
})(bi ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/InteractionManager.js
var xi = class {
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
				case bi.external:
					this._externalInteractors.push(e);
					break;
				case bi.particles: this._particleInteractors.push(e);
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
}, Si;
(function(e) {
	e.normal = "normal", e.inside = "inside", e.outside = "outside";
})(Si ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Particle.js
function Ci(e, t, n, r) {
	let i = t.options[e];
	if (i) return ln({
		close: t.close,
		fill: t.fill
	}, vn(i, n, r));
}
function wi(e, t, n, r) {
	let i = t.options[e];
	if (i) return ln({
		close: t.close,
		fill: t.fill
	}, vn(i, n, r));
}
function Ti(e) {
	if (!tn(e.outMode, e.checkModes)) return;
	let t = e.radius * 2;
	e.coord > e.maxCoord - t ? e.setCb(-e.radius) : e.coord < t && e.setCb(e.radius);
}
var Ei = class {
	constructor(e, t) {
		this.container = t, this._calcPosition = (e, t, n, r = 0) => {
			for (let r of e.plugins.values()) {
				let e = r.particlePosition === void 0 ? void 0 : r.particlePosition(t, this);
				if (e) return xt.create(e.x, e.y, n);
			}
			let i = e.canvas.size, a = zt({
				size: i,
				position: t
			}), o = xt.create(a.x, a.y, n), s = this.getRadius(), c = this.options.move.outModes, l = (t) => {
				Ti({
					outMode: t,
					checkModes: [ei.bounce],
					coord: o.x,
					maxCoord: e.canvas.size.width,
					setCb: (e) => o.x += e,
					radius: s
				});
			}, u = (t) => {
				Ti({
					outMode: t,
					checkModes: [ei.bounce],
					coord: o.y,
					maxCoord: e.canvas.size.height,
					setCb: (e) => o.y += e,
					radius: s
				});
			};
			return l(c.left ?? c.default), l(c.right ?? c.default), u(c.top ?? c.default), u(c.bottom ?? c.default), this._checkOverlap(o, r) ? this._calcPosition(e, void 0, n, r + 1) : o;
		}, this._calculateVelocity = () => {
			let e = Lt(this.direction).copy(), t = this.options.move;
			if (t.direction === ht.inside || t.direction === ht.outside) return e;
			let n = Ft(P(t.angle.value)), r = Ft(P(t.angle.offset)), i = {
				left: r - n * nt,
				right: r + n * nt
			};
			return t.straight || (e.angle += At(F(i.left, i.right))), t.random && typeof t.speed == "number" && (e.length *= Tt()), e;
		}, this._checkOverlap = (e, t = 0) => {
			let n = this.options.collisions, r = this.getRadius();
			if (!n.enable) return !1;
			let i = n.overlap;
			if (i.enable) return !1;
			let a = i.retries;
			if (a >= 0 && t > a) throw Error(`${tt} particle is overlapping and can't be placed`);
			return !!this.container.particles.find((t) => Pt(e, t.position) < r + t.getRadius());
		}, this._getRollColor = (e) => {
			if (!e || !this.roll || !this.backColor && !this.roll.alter) return e;
			let t = this.roll.horizontal && this.roll.vertical ? 2 : 1, n = this.roll.horizontal ? Math.PI * nt : 0;
			return Math.floor(((this.roll.angle ?? 0) + n) / (Math.PI / t)) % 2 ? this.backColor ? this.backColor : this.roll.alter ? ir(e, this.roll.alter.type, this.roll.alter.value) : e : e;
		}, this._initPosition = (e) => {
			let t = this.container, n = P(this.options.zIndex.value);
			this.position = this._calcPosition(t, e, Ot(n, 0, t.zLayers)), this.initialPosition = this.position.copy();
			let r = t.canvas.size;
			switch (this.moveCenter = {
				...Sn(this.options.move.center, r),
				radius: this.options.move.center.radius ?? 0,
				mode: this.options.move.center.mode ?? Wt.percent
			}, this.direction = It(this.options.move.direction, this.position, this.moveCenter), this.options.move.direction) {
				case ht.inside:
					this.outType = Si.inside;
					break;
				case ht.outside: this.outType = Si.outside;
			}
			this.offset = St.origin;
		}, this._engine = e;
	}
	destroy(e) {
		if (this.unbreakable || this.destroyed) return;
		this.destroyed = !0, this.bubble.inRange = !1, this.slow.inRange = !1;
		let t = this.container, n = this.pathGenerator;
		t.shapeDrawers.get(this.shape)?.particleDestroy?.(this);
		for (let n of t.plugins.values()) n.particleDestroyed?.(this, e);
		for (let n of t.particles.updaters) n.particleDestroyed?.(this, e);
		n?.reset(this), this._engine.dispatchEvent(dr.particleDestroyed, {
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
		return this._getRollColor(this.bubble.color ?? Un(this.color));
	}
	getMass() {
		return this.getRadius() ** 2 * Math.PI * nt;
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
		return this._getRollColor(this.bubble.color ?? Un(this.strokeColor));
	}
	init(e, t, n, r) {
		let i = this.container, a = this._engine;
		this.id = e, this.group = r, this.effectClose = !0, this.effectFill = !0, this.shapeClose = !0, this.shapeFill = !0, this.pathRotation = !1, this.lastPathTime = 0, this.destroyed = !1, this.unbreakable = !1, this.isRotating = !1, this.rotation = 0, this.misplaced = !1, this.retina = { maxDistance: {} }, this.outType = Si.normal, this.ignoresResizeRatio = !0;
		let o = i.retina.pixelRatio, s = i.actualOptions, c = vi(this._engine, i, s.particles), { reduceDuplicates: l } = c, u = c.effect.type, d = c.shape.type;
		this.effect = vn(u, this.id, l), this.shape = vn(d, this.id, l);
		let f = c.effect, p = c.shape;
		if (n) {
			if (n.effect?.type) {
				let e = n.effect.type, t = vn(e, this.id, l);
				t && (this.effect = t, f.load(n.effect));
			}
			if (n.shape?.type) {
				let e = n.shape.type, t = vn(e, this.id, l);
				t && (this.shape = t, p.load(n.shape));
			}
		}
		if (this.effect === "random") {
			let e = [...this.container.effectDrawers.keys()];
			this.effect = e[Math.floor(Tt() * e.length)];
		}
		if (this.shape === "random") {
			let e = [...this.container.shapeDrawers.keys()];
			this.shape = e[Math.floor(Tt() * e.length)];
		}
		this.effectData = Ci(this.effect, f, this.id, l), this.shapeData = wi(this.shape, p, this.id, l), c.load(n);
		let m = this.effectData;
		m && c.load(m.particles);
		let h = this.shapeData;
		h && c.load(h.particles);
		let g = new Tr(a, i);
		g.load(i.actualOptions.interactivity), g.load(c.interactivity), this.interactivity = g, this.effectFill = m?.fill ?? c.effect.fill, this.effectClose = m?.close ?? c.effect.close, this.shapeFill = h?.fill ?? c.shape.fill, this.shapeClose = h?.close ?? c.shape.close, this.options = c;
		let _ = this.options.move.path;
		this.pathDelay = P(_.delay.value) * rt, _.generator && (this.pathGenerator = this._engine.getPathGenerator(_.generator), this.pathGenerator && i.addPath(_.generator, this.pathGenerator) && this.pathGenerator.init(i)), i.retina.initParticle(this), this.size = bn(this.options.size, o), this.bubble = { inRange: !1 }, this.slow = {
			inRange: !1,
			factor: 1
		}, this._initPosition(t), this.initialVelocity = this._calculateVelocity(), this.velocity = this.initialVelocity.copy(), this.moveDecay = 1 - P(this.options.move.decay);
		let v = i.particles;
		v.setLastZIndex(this.position.z), this.zIndexFactor = this.position.z / i.zLayers, this.sides = 24;
		let y = i.effectDrawers.get(this.effect);
		y || (y = this._engine.getEffectDrawer(this.effect), y && i.effectDrawers.set(this.effect, y)), y?.loadEffect && y.loadEffect(this);
		let b = i.shapeDrawers.get(this.shape);
		b || (b = this._engine.getShapeDrawer(this.shape), b && i.shapeDrawers.set(this.shape, b)), b?.loadShape && b.loadShape(this);
		let x = b?.getSidesCount;
		x && (this.sides = x(this)), this.spawning = !1, this.shadowColor = An(this._engine, this.options.shadow.color);
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
}, Di = class {
	constructor(e, t) {
		this.position = e, this.particle = t;
	}
}, Oi;
(function(e) {
	e.circle = "circle", e.rectangle = "rectangle";
})(Oi ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/Ranges.js
var ki = class {
	constructor(e, t, n) {
		this.position = {
			x: e,
			y: t
		}, this.type = n;
	}
}, Ai = class e extends ki {
	constructor(e, t, n) {
		super(e, t, Oi.circle), this.radius = n;
	}
	contains(e) {
		return Pt(e, this.position) <= this.radius;
	}
	intersects(t) {
		let n = this.position, r = t.position, i = {
			x: Math.abs(r.x - n.x),
			y: Math.abs(r.y - n.y)
		}, a = this.radius;
		if (t instanceof e || t.type === Oi.circle) return a + t.radius > Math.sqrt(i.x ** 2 + i.y ** 2);
		if (t instanceof ji || t.type === Oi.rectangle) {
			let { width: e, height: n } = t.size;
			return (i.x - e) ** 2 + (i.y - n) ** 2 <= a ** 2 || i.x <= a + e && i.y <= a + n || i.x <= e || i.y <= n;
		}
		return !1;
	}
}, ji = class e extends ki {
	constructor(e, t, n, r) {
		super(e, t, Oi.rectangle), this.size = {
			height: r,
			width: n
		};
	}
	contains(e) {
		let t = this.size.width, n = this.size.height, r = this.position;
		return e.x >= r.x && e.x <= r.x + t && e.y >= r.y && e.y <= r.y + n;
	}
	intersects(t) {
		if (t instanceof Ai) return t.intersects(this);
		let n = this.size.width, r = this.size.height, i = this.position, a = t.position, o = t instanceof e ? t.size : {
			width: 0,
			height: 0
		}, s = o.width, c = o.height;
		return a.x < i.x + n && a.x + s > i.x && a.y < i.y + r && a.y + c > i.y;
	}
}, Mi = class e {
	constructor(t, n) {
		this.rectangle = t, this.capacity = n, this._subdivide = () => {
			let { x: t, y: n } = this.rectangle.position, { width: r, height: i } = this.rectangle.size, { capacity: a } = this;
			for (let o = 0; o < 4; o++) {
				let s = o % 2;
				this._subs.push(new e(new ji(t + r * nt * s, n + i * nt * (Math.round(o * nt) - s), r * nt, i * nt), a));
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
		for (let r of this._points) !e.contains(r.position) && Pt(e.position, r.position) > r.particle.getRadius() && (!t || t(r.particle)) || n.push(r.particle);
		if (this._divided) for (let r of this._subs) n.push(...r.query(e, t));
		return n;
	}
	queryCircle(e, t, n) {
		return this.query(new Ai(e.x, e.y, t), n);
	}
	queryRectangle(e, t, n) {
		return this.query(new ji(e.x, e.y, t.width, t.height), n);
	}
}, Ni = (e) => {
	let { height: t, width: n } = e;
	return new ji(pt * n, pt * t, mt * n, mt * t);
}, Pi = class {
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
				i ||= new Ei(this._engine, this._container), i.init(this._nextId, e, t, n);
				let a = !0;
				return r && (a = r(i)), a ? (this._array.push(i), this._zArray.push(i), this._nextId++, this._engine.dispatchEvent(dr.particleAdded, {
					container: this._container,
					data: { particle: i }
				}), i) : void 0;
			} catch (e) {
				qt().warning(`${tt} adding particle: ${e}`);
			}
		}, this._removeParticle = (e, t, n) => {
			let r = this._array[e];
			if (!r || r.group !== t) return !1;
			let i = this._zArray.indexOf(r);
			return this._array.splice(e, 1), this._zArray.splice(i, 1), r.destroy(n), this._engine.dispatchEvent(dr.particleRemoved, {
				container: this._container,
				data: { particle: r }
			}), this._addToPool(r), !0;
		}, this._engine = e, this._container = t, this._nextId = 0, this._array = [], this._zArray = [], this._pool = [], this._limit = 0, this._groupLimits = /* @__PURE__ */ new Map(), this._needsSort = !1, this._lastZIndex = 0, this._interactionManager = new xi(e, t), this._pluginsInitialized = !1;
		let n = t.canvas.size;
		this.quadTree = new Mi(Ni(n), 4), this.movers = [], this.updaters = [];
	}
	get count() {
		return this._array.length;
	}
	addManualParticles() {
		let e = this._container;
		e.actualOptions.manualParticles.forEach((t) => this.addParticle(t.position ? Sn(t.position, e.canvas.size) : void 0, t.options));
	}
	addParticle(e, t, n, r) {
		let i = this._container.actualOptions.particles.number.limit.mode, a = n === void 0 ? this._limit : this._groupLimits.get(n) ?? this._limit, o = this.count;
		if (a > 0) switch (i) {
			case si.delete: {
				let e = o + 1 - a;
				e > 0 && this.removeQuantity(e);
				break;
			}
			case si.wait: if (o >= a) return;
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
		this.quadTree = new Mi(Ni(t.canvas.size), 4);
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
			this.quadTree.insert(new Di(t.getPosition(), t));
		}
		if (n.size) {
			let e = (e) => !n.has(e);
			this._array = this.filter(e), this._zArray = this._zArray.filter(e);
			for (let e of n) this._engine.dispatchEvent(dr.particleRemoved, {
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
}, Fi = class {
	constructor(e) {
		this.container = e, this.pixelRatio = 1, this.reduceFactor = 1;
	}
	init() {
		let e = this.container, t = e.actualOptions;
		this.pixelRatio = !t.detectRetina || Xt() ? 1 : devicePixelRatio, this.reduceFactor = 1;
		let n = this.pixelRatio, r = e.canvas;
		if (r.element) {
			let e = r.element;
			r.size.width = e.offsetWidth * n, r.size.height = e.offsetHeight * n;
		}
		let i = t.particles, a = i.move;
		this.maxSpeed = P(a.gravity.maxSpeed) * n, this.sizeAnimationSpeed = P(i.size.animation.speed) * n;
	}
	initParticle(e) {
		let t = e.options, n = this.pixelRatio, r = t.move, i = r.distance, a = e.retina;
		a.moveDrift = P(r.drift) * n, a.moveSpeed = P(r.speed) * n, a.sizeAnimationSpeed = P(t.size.animation.speed) * n;
		let o = a.maxDistance;
		o.horizontal = i.horizontal === void 0 ? void 0 : i.horizontal * n, o.vertical = i.vertical === void 0 ? void 0 : i.vertical * n, a.maxSpeed = P(r.gravity.maxSpeed) * n;
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Container.js
function R(e) {
	return e && !e.destroyed;
}
function Ii(e, t = 60, n = !1) {
	return {
		value: e,
		factor: n ? 60 / t : 60 * e / rt
	};
}
function Li(e, t, ...n) {
	let r = new yi(e, t);
	return _i(r, ...n), r;
}
var Ri = class {
	constructor(e, t, n) {
		this._intersectionManager = (e) => {
			if (R(this) && this.actualOptions.pauseOnOutsideViewport) for (let t of e) t.target === this.interactivity.element && (t.isIntersecting ? this.play() : this.pause());
		}, this._nextFrame = (e) => {
			try {
				if (!this._smooth && this._lastFrameTime !== void 0 && e < this._lastFrameTime + 1e3 / this.fpsLimit) {
					this.draw(!1);
					return;
				}
				this._lastFrameTime ??= e;
				let t = Ii(e - this._lastFrameTime, this.fpsLimit, this._smooth);
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
				qt().error(`${tt} in animation loop`, e);
			}
		}, this._engine = e, this.id = Symbol(t), this.fpsLimit = 120, this._smooth = !1, this._delay = 0, this._duration = 0, this._lifeTime = 0, this._firstStart = !0, this.started = !1, this.destroyed = !1, this._paused = !0, this._lastFrameTime = 0, this.zLayers = 100, this.pageHidden = !1, this._clickHandlers = /* @__PURE__ */ new Map(), this._sourceOptions = n, this._initialSourceOptions = n, this.retina = new Fi(this), this.canvas = new sr(this, this._engine), this.particles = new Pi(this._engine, this), this.pathGenerators = /* @__PURE__ */ new Map(), this.interactivity = { mouse: {
			clicking: !1,
			inside: !1
		} }, this.plugins = /* @__PURE__ */ new Map(), this.effectDrawers = /* @__PURE__ */ new Map(), this.shapeDrawers = /* @__PURE__ */ new Map(), this._options = Li(this._engine, this), this.actualOptions = Li(this._engine, this), this._eventListeners = new ur(this), this._intersectionObserver = $t((e) => this._intersectionManager(e)), this._engine.dispatchEvent(dr.containerBuilt, { container: this });
	}
	get animationStatus() {
		return !this._paused && !this.pageHidden && R(this);
	}
	get options() {
		return this._options;
	}
	get sourceOptions() {
		return this._sourceOptions;
	}
	addClickHandler(e) {
		if (!R(this)) return;
		let t = this.interactivity.element;
		if (!t) return;
		let n = (t, n, r) => {
			if (!R(this)) return;
			let i = this.retina.pixelRatio, a = {
				x: n.x * i,
				y: n.y * i
			};
			e(t, this.particles.quadTree.queryCircle(a, r * i));
		}, r = (e) => {
			if (!R(this)) return;
			let t = e, r = {
				x: t.offsetX || t.clientX,
				y: t.offsetY || t.clientY
			};
			n(e, r, 1);
		}, i = () => {
			R(this) && (c = !0, l = !1);
		}, a = () => {
			R(this) && (l = !0);
		}, o = (e) => {
			if (R(this)) {
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
			R(this) && (c = !1, l = !1);
		}, c = !1, l = !1;
		this._clickHandlers.set("click", r), this._clickHandlers.set("touchstart", i), this._clickHandlers.set("touchmove", a), this._clickHandlers.set("touchend", o), this._clickHandlers.set("touchcancel", s);
		for (let [e, n] of this._clickHandlers) t.addEventListener(e, n);
	}
	addLifeTime(e) {
		this._lifeTime += e;
	}
	addPath(e, t, n = !1) {
		return !R(this) || !n && this.pathGenerators.has(e) ? !1 : (this.pathGenerators.set(e, t), !0);
	}
	alive() {
		return !this._duration || this._lifeTime <= this._duration;
	}
	clearClickHandlers() {
		if (R(this)) {
			for (let [e, t] of this._clickHandlers) this.interactivity.element?.removeEventListener(e, t);
			this._clickHandlers.clear();
		}
	}
	destroy(e = !0) {
		if (R(this)) {
			this.stop(), this.clearClickHandlers(), this.particles.destroy(), this.canvas.destroy();
			for (let e of this.effectDrawers.values()) e.destroy?.(this);
			for (let e of this.shapeDrawers.values()) e.destroy?.(this);
			for (let e of this.effectDrawers.keys()) this.effectDrawers.delete(e);
			for (let e of this.shapeDrawers.keys()) this.shapeDrawers.delete(e);
			if (this._engine.clearPlugins(this), this.destroyed = !0, e) {
				let e = this._engine.items, t = e.findIndex((e) => e === this);
				t >= 0 && e.splice(t, 1);
			}
			this._engine.dispatchEvent(dr.containerDestroyed, { container: this });
		}
	}
	draw(e) {
		if (!R(this)) return;
		let t = e, n = (e) => {
			t &&= (this._lastFrameTime = void 0, !1), this._nextFrame(e);
		};
		this._drawAnimationFrame = Et((e) => n(e));
	}
	async export(e, t = {}) {
		for (let n of this.plugins.values()) {
			if (!n.export) continue;
			let r = await n.export(e, t);
			if (r.supported) return r.blob;
		}
		qt().error(`${tt} - Export plugin with type ${e} not found`);
	}
	handleClickMode(e) {
		if (R(this)) {
			this.particles.handleClickMode(e);
			for (let t of this.plugins.values()) t.handleClickMode?.(e);
		}
	}
	async init() {
		if (!R(this)) return;
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
		await this.particles.initPlugins(), this._options = Li(this._engine, this, this._initialSourceOptions, this.sourceOptions), this.actualOptions = Li(this._engine, this, this._options);
		let n = await this._engine.getAvailablePlugins(this);
		for (let [e, t] of n) this.plugins.set(e, t);
		this.retina.init(), await this.canvas.init(), this.updateActualOptions(), this.canvas.initBackground(), this.canvas.resize();
		let { zLayers: r, duration: i, delay: a, fpsLimit: o, smooth: s } = this.actualOptions;
		this.zLayers = r, this._duration = P(i) * rt, this._delay = P(a) * rt, this._lifeTime = 0, this.fpsLimit = o > 0 ? o : 120, this._smooth = s;
		for (let e of this.effectDrawers.values()) await e.init?.(this);
		for (let e of this.shapeDrawers.values()) await e.init?.(this);
		for (let e of this.plugins.values()) await e.init?.();
		this._engine.dispatchEvent(dr.containerInit, { container: this }), await this.particles.init(), this.particles.setDensity();
		for (let e of this.plugins.values()) e.particlesSetup?.();
		this._engine.dispatchEvent(dr.particlesSetup, { container: this });
	}
	async loadTheme(e) {
		R(this) && (this._currentTheme = e, await this.refresh());
	}
	pause() {
		if (R(this) && (this._drawAnimationFrame !== void 0 && (Dt(this._drawAnimationFrame), delete this._drawAnimationFrame), !this._paused)) {
			for (let e of this.plugins.values()) e.pause?.();
			this.pageHidden || (this._paused = !0), this._engine.dispatchEvent(dr.containerPaused, { container: this });
		}
	}
	play(e) {
		if (!R(this)) return;
		let t = this._paused || e;
		if (this._firstStart && !this.actualOptions.autoPlay) {
			this._firstStart = !1;
			return;
		}
		if (this._paused &&= !1, t) for (let e of this.plugins.values()) e.play && e.play();
		this._engine.dispatchEvent(dr.containerPlay, { container: this }), this.draw(t ?? !1);
	}
	async refresh() {
		if (R(this)) return this.stop(), this.start();
	}
	async reset(e) {
		if (R(this)) return this._initialSourceOptions = e, this._sourceOptions = e, this._options = Li(this._engine, this, this._initialSourceOptions, this.sourceOptions), this.actualOptions = Li(this._engine, this, this._options), this.refresh();
	}
	async start() {
		R(this) && !this.started && (await this.init(), this.started = !0, await new Promise((e) => {
			let t = async () => {
				this._eventListeners.addListeners(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.observe(this.interactivity.element);
				for (let e of this.plugins.values()) await e.start?.();
				this._engine.dispatchEvent(dr.containerStarted, { container: this }), this.play(), e();
			};
			this._delayTimeout = setTimeout(() => void t(), this._delay);
		}));
	}
	stop() {
		if (R(this) && this.started) {
			this._delayTimeout && (clearTimeout(this._delayTimeout), delete this._delayTimeout), this._firstStart = !0, this.started = !1, this._eventListeners.removeListeners(), this.pause(), this.particles.clear(), this.canvas.stop(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.unobserve(this.interactivity.element);
			for (let e of this.plugins.values()) e.stop?.();
			for (let e of this.plugins.keys()) this.plugins.delete(e);
			this._sourceOptions = this._options, this._engine.dispatchEvent(dr.containerStopped, { container: this });
		}
	}
	updateActualOptions() {
		this.actualOptions.responsive = [];
		let e = this.actualOptions.setResponsive(this.canvas.size.width, this.retina.pixelRatio, this._options);
		return this.actualOptions.setTheme(this._currentTheme), this._responsiveMaxWidth !== e && (this._responsiveMaxWidth = e, !0);
	}
}, zi = class {
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
async function Bi(e, t, n, r = !1) {
	let i = t.get(e);
	return (!i || r) && (i = await Promise.all([...n.values()].map((t) => t(e))), t.set(e, i)), i;
}
async function Vi(e) {
	let t = vn(e.url, e.index);
	if (!t) return e.fallback;
	let n = await fetch(t);
	return n.ok ? await n.json() : (qt().error(`${tt} ${n.status} while retrieving config file`), e.fallback);
}
var Hi = (e) => {
	let t;
	if (e instanceof HTMLCanvasElement || e.tagName.toLowerCase() === "canvas") t = e, t.dataset.generated || (t.dataset[Ue] = lt);
	else {
		let n = e.getElementsByTagName(ut);
		n.length ? (t = n[0], t.dataset[Ue] = lt) : (t = document.createElement(ut), t.dataset[Ue] = ct, e.appendChild(t));
	}
	let n = "100%";
	return t.style.width || (t.style.width = n), t.style.height || (t.style.height = n), t;
}, Ui = (e, t) => {
	let n = t ?? document.getElementById(e);
	return n || (n = document.createElement("div"), n.id = e, n.dataset[Ue] = ct, document.body.append(n), n);
}, Wi = class {
	constructor() {
		this._configs = /* @__PURE__ */ new Map(), this._domArray = [], this._eventDispatcher = new zi(), this._initialized = !1, this.plugins = [], this.colorManagers = /* @__PURE__ */ new Map(), this.easingFunctions = /* @__PURE__ */ new Map(), this._initializers = {
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
		this._configs.set(t, e), this._eventDispatcher.dispatchEvent(dr.configAdded, { data: {
			name: t,
			config: e
		} });
	}
	async addEasing(e, t, n = !0) {
		this.getEasing(e) || (this.easingFunctions.set(e, t), await this.refresh(n));
	}
	async addEffect(e, t, n = !0) {
		_n(e, (e) => {
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
		return Bi(e, this.interactors, this._initializers.interactors, t);
	}
	async getMovers(e, t = !1) {
		return Bi(e, this.movers, this._initializers.movers, t);
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
		return Bi(e, this.updaters, this._initializers.updaters, t);
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
		let t = e.id ?? e.element?.id ?? `tsparticles${Math.floor(Tt() * 1e4)}`, { index: n, url: r } = e, i = vn(r ? await Vi({
			fallback: e.options,
			url: r,
			index: n
		}) : e.options, n), { items: a } = this, o = a.findIndex((e) => e.id.description === t), s = new Ri(this, t, i);
		if (o >= 0) {
			let e = this.item(o), t = +!!e;
			e && !e.destroyed && e.destroy(!1), a.splice(o, t, s);
		} else a.push(s);
		let c = Hi(Ui(t, e.element));
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
		if (!t.length) throw Error(`${tt} can only set click handlers after calling tsParticles.load()`);
		t.forEach((t) => t.addClickHandler(e));
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/init.js
function Gi() {
	let e = new Wi();
	return e.init(), e;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/ExternalInteractorBase.js
var Ki = class {
	constructor(e) {
		this.type = bi.external, this.container = e;
	}
}, qi = class {
	constructor(e) {
		this.type = bi.particles, this.container = e;
	}
}, Ji;
(function(e) {
	e.clockwise = "clockwise", e.counterClockwise = "counter-clockwise", e.random = "random";
})(Ji ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/EasingType.js
var Yi;
(function(e) {
	e.easeInBack = "ease-in-back", e.easeInCirc = "ease-in-circ", e.easeInCubic = "ease-in-cubic", e.easeInLinear = "ease-in-linear", e.easeInQuad = "ease-in-quad", e.easeInQuart = "ease-in-quart", e.easeInQuint = "ease-in-quint", e.easeInExpo = "ease-in-expo", e.easeInSine = "ease-in-sine", e.easeOutBack = "ease-out-back", e.easeOutCirc = "ease-out-circ", e.easeOutCubic = "ease-out-cubic", e.easeOutLinear = "ease-out-linear", e.easeOutQuad = "ease-out-quad", e.easeOutQuart = "ease-out-quart", e.easeOutQuint = "ease-out-quint", e.easeOutExpo = "ease-out-expo", e.easeOutSine = "ease-out-sine", e.easeInOutBack = "ease-in-out-back", e.easeInOutCirc = "ease-in-out-circ", e.easeInOutCubic = "ease-in-out-cubic", e.easeInOutLinear = "ease-in-out-linear", e.easeInOutQuad = "ease-in-out-quad", e.easeInOutQuart = "ease-in-out-quart", e.easeInOutQuint = "ease-in-out-quint", e.easeInOutExpo = "ease-in-out-expo", e.easeInOutSine = "ease-in-out-sine";
})(Yi ||= {});
//#endregion
//#region node_modules/@tsparticles/engine/browser/index.js
var Xi = Gi();
Xt() || (window.tsParticles = Xi);
//#endregion
//#region node_modules/@tsparticles/react/dist/Particles.js
var Zi = (e) => {
	let t = e.id ?? "tsparticles";
	return (0, b.useEffect)(() => {
		let n;
		return Xi.load({
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
	]), /* @__PURE__ */ (0, x.jsx)("div", {
		id: t,
		className: e.className
	});
};
//#endregion
//#region node_modules/@tsparticles/react/dist/index.js
async function Qi(e) {
	await e(Xi);
}
//#endregion
//#region node_modules/@tsparticles/move-base/browser/Utils.js
var $i = .5, ea = 2, ta = 0, na = 1, ra = 60, ia = 0, aa = .01, z = Math.PI * ea;
function oa(e) {
	let t = e.initialPosition, { dx: n, dy: r } = Nt(t, e.position), i = Math.abs(n), a = Math.abs(r), { maxDistance: o } = e.retina, s = o.horizontal, c = o.vertical;
	if (s || c) {
		if ((((s && i >= s) ?? !1) || ((c && a >= c) ?? !1)) && !e.misplaced) e.misplaced = !!s && i > s || !!c && a > c, s && (e.velocity.x = e.velocity.y * $i - e.velocity.x), c && (e.velocity.y = e.velocity.x * $i - e.velocity.y);
		else if ((!s || i < s) && (!c || a < c) && e.misplaced) e.misplaced = !1;
		else if (e.misplaced) {
			let n = e.position, r = e.velocity;
			s && (n.x < t.x && r.x < ta || n.x > t.x && r.x > ta) && (r.x *= -Tt()), c && (n.y < t.y && r.y < ta || n.y > t.y && r.y > ta) && (r.y *= -Tt());
		}
	}
}
function sa(e, t, n, r, i, a, o) {
	la(e, o);
	let s = e.gravity, c = s?.enable && s.inverse ? -1 : na;
	i && n && (e.velocity.x += i * o.factor / (ra * n)), s?.enable && n && (e.velocity.y += c * (s.acceleration * o.factor) / (ra * n));
	let l = e.moveDecay;
	e.velocity.multTo(l);
	let u = e.velocity.mult(n);
	s?.enable && r > ta && (!s.inverse && u.y >= ta && u.y >= r || s.inverse && u.y <= ta && u.y <= -r) && (u.y = c * r, n && (e.velocity.y = u.y / n));
	let d = e.options.zIndex, f = (na - e.zIndexFactor) ** d.velocityRate;
	u.multTo(f), u.multTo(a);
	let { position: p } = e;
	p.addTo(u), t.vibrate && (p.x += Math.sin(p.x * Math.cos(p.y)) * a, p.y += Math.cos(p.y * Math.sin(p.x)) * a);
}
function ca(e, t, n) {
	let r = e.container;
	if (!e.spin) return;
	let i = e.spin.direction === Ji.clockwise, a = {
		x: i ? Math.cos : Math.sin,
		y: i ? Math.sin : Math.cos
	};
	e.position.x = e.spin.center.x + e.spin.radius * a.x(e.spin.angle) * n, e.position.y = e.spin.center.y + e.spin.radius * a.y(e.spin.angle) * n, e.spin.radius += e.spin.acceleration * n;
	let o = Math.max(r.canvas.size.width, r.canvas.size.height), s = o * $i;
	e.spin.radius > s ? (e.spin.radius = s, e.spin.acceleration *= -1) : e.spin.radius < ia && (e.spin.radius = ia, e.spin.acceleration *= -1), e.spin.angle += t * aa * (na - e.spin.radius / o);
}
function la(e, t) {
	let n = e.options.move.path;
	if (!n.enable) return;
	if (e.lastPathTime <= e.pathDelay) {
		e.lastPathTime += t.value;
		return;
	}
	let r = e.pathGenerator?.generate(e, t);
	r && e.velocity.addTo(r), n.clamp && (e.velocity.x = Ot(e.velocity.x, -1, na), e.velocity.y = Ot(e.velocity.y, -1, na)), e.lastPathTime -= e.pathDelay;
}
function ua(e) {
	return e.slow.inRange ? e.slow.factor : na;
}
function da(e) {
	let t = e.container, n = e.options.move.spin;
	if (!n.enable) return;
	let r = n.position ?? {
		x: 50,
		y: 50
	}, i = .01, a = {
		x: r.x * i * t.canvas.size.width,
		y: r.y * i * t.canvas.size.height
	}, o = Pt(e.getPosition(), a), s = P(n.acceleration);
	e.retina.spinAcceleration = s * t.retina.pixelRatio, e.spin = {
		center: a,
		direction: e.velocity.x >= ta ? Ji.clockwise : Ji.counterClockwise,
		angle: Tt() * z,
		radius: o,
		acceleration: e.retina.spinAcceleration
	};
}
//#endregion
//#region node_modules/@tsparticles/move-base/browser/BaseMover.js
var fa = 2, pa = 1, ma = 1, ha = class {
	init(e) {
		let t = e.options.move.gravity;
		e.gravity = {
			enable: t.enable,
			acceleration: P(t.acceleration),
			inverse: t.inverse
		}, da(e);
	}
	isEnabled(e) {
		return !e.destroyed && e.options.move.enable;
	}
	move(e, t) {
		let n = e.options, r = n.move;
		if (!r.enable) return;
		let i = e.container, a = i.retina.pixelRatio;
		e.retina.moveSpeed ??= P(r.speed) * a, e.retina.moveDrift ??= P(e.options.move.drift) * a;
		let o = ua(e), s = i.retina.reduceFactor, c = e.retina.moveSpeed, l = e.retina.moveDrift, u = Mt(n.size.value) * a, d = r.size ? e.getRadius() / u : pa, f = t.factor || ma, p = c * d * o * f / fa, m = e.retina.maxSpeed ?? i.retina.maxSpeed;
		r.spin.enable ? ca(e, p, s) : sa(e, r, p, m, l, s, t), oa(e);
	}
};
//#endregion
//#region node_modules/@tsparticles/move-base/browser/index.js
async function ga(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addMover("base", () => Promise.resolve(new ha()), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-circle/browser/Utils.js
var _a = Math.PI * 2, va = 0, ya = {
	x: 0,
	y: 0
};
function ba(e) {
	let { context: t, particle: n, radius: r } = e;
	n.circleRange ||= {
		min: va,
		max: _a
	};
	let i = n.circleRange;
	t.arc(ya.x, ya.y, r, i.min, i.max, !1);
}
//#endregion
//#region node_modules/@tsparticles/shape-circle/browser/CircleDrawer.js
var xa = 12, Sa = 360, Ca = 0, wa = class {
	constructor() {
		this.validTypes = ["circle"];
	}
	draw(e) {
		ba(e);
	}
	getSidesCount() {
		return xa;
	}
	particleInit(e, t) {
		let n = t.shapeData?.angle ?? {
			max: Sa,
			min: Ca
		};
		t.circleRange = yt(n) ? {
			min: Ft(n.min),
			max: Ft(n.max)
		} : {
			min: Ca,
			max: Ft(n)
		};
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-circle/browser/index.js
async function Ta(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new wa(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-color/browser/ColorUpdater.js
var Ea = class {
	constructor(e, t) {
		this._container = e, this._engine = t;
	}
	init(e) {
		let t = Mn(this._engine, e.options.color, e.id, e.options.reduceDuplicates);
		t && (e.color = Wn(t, e.options.color.animation, this._container.retina.reduceFactor));
	}
	isEnabled(e) {
		let { h: t, s: n, l: r } = e.options.color.animation, { color: i } = e;
		return !e.destroyed && !e.spawning && (i?.h.value !== void 0 && t.enable || i?.s.value !== void 0 && n.enable || i?.l.value !== void 0 && r.enable);
	}
	update(e, t) {
		qn(e.color, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-color/browser/index.js
async function Da(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("color", (t) => Promise.resolve(new Ea(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-hex-color/browser/HexColorManager.js
var Oa;
(function(e) {
	e[e.r = 1] = "r", e[e.g = 2] = "g", e[e.b = 3] = "b", e[e.a = 4] = "a";
})(Oa ||= {});
var ka = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i, Aa = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i, ja = 16, Ma = 1, Na = 255, Pa = class {
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
		let t = e.replace(ka, (e, t, n, r, i) => t + t + n + n + r + r + (i === void 0 ? "" : i + i)), n = Aa.exec(t);
		return n ? {
			a: n[Oa.a] === void 0 ? Ma : parseInt(n[Oa.a], ja) / Na,
			b: parseInt(n[Oa.b], ja),
			g: parseInt(n[Oa.g], ja),
			r: parseInt(n[Oa.r], ja)
		} : void 0;
	}
};
//#endregion
//#region node_modules/@tsparticles/plugin-hex-color/browser/index.js
async function Fa(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addColorManager(new Pa(), t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-hsl-color/browser/HslColorManager.js
var Ia;
(function(e) {
	e[e.h = 1] = "h", e[e.s = 2] = "s", e[e.l = 3] = "l", e[e.a = 5] = "a";
})(Ia ||= {});
var La = class {
	constructor() {
		this.key = "hsl", this.stringPrefix = "hsl";
	}
	handleColor(e) {
		let t = e.value.hsl ?? e.value;
		if (t.h !== void 0 && t.s !== void 0 && t.l !== void 0) return Fn(t);
	}
	handleRangeColor(e) {
		let t = e.value.hsl ?? e.value;
		if (t.h !== void 0 && t.l !== void 0) return Fn({
			h: P(t.h),
			l: P(t.l),
			s: P(t.s)
		});
	}
	parseString(e) {
		if (!e.startsWith("hsl")) return;
		let t = /hsla?\(\s*(\d+)\s*[\s,]\s*(\d+)%\s*[\s,]\s*(\d+)%\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i.exec(e);
		return t ? In({
			a: t.length > 4 ? Bt(t[Ia.a]) : 1,
			h: parseInt(t[Ia.h], 10),
			l: parseInt(t[Ia.l], 10),
			s: parseInt(t[Ia.s], 10)
		}) : void 0;
	}
};
//#endregion
//#region node_modules/@tsparticles/plugin-hsl-color/browser/index.js
async function Ra(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addColorManager(new La(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-opacity/browser/OpacityUpdater.js
var za = class {
	constructor(e) {
		this.container = e;
	}
	init(e) {
		let t = e.options.opacity;
		e.opacity = bn(t, 1);
		let n = t.animation;
		n.enable && (e.opacity.velocity = P(n.speed) / 100 * this.container.retina.reduceFactor, n.sync || (e.opacity.velocity *= Tt()));
	}
	isEnabled(e) {
		return !e.destroyed && !e.spawning && !!e.opacity && e.opacity.enable && ((e.opacity.maxLoops ?? 0) <= 0 || (e.opacity.maxLoops ?? 0) > 0 && (e.opacity.loops ?? 0) < (e.opacity.maxLoops ?? 0));
	}
	reset(e) {
		e.opacity && (e.opacity.time = 0, e.opacity.loops = 0);
	}
	update(e, t) {
		this.isEnabled(e) && e.opacity && wn(e, e.opacity, !0, e.options.opacity.animation.destroy, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-opacity/browser/index.js
async function Ba(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("opacity", (e) => Promise.resolve(new za(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-out-modes/browser/Utils.js
var Va = 0, Ha = 0;
function Ua(e) {
	if (e.outMode !== ei.bounce && e.outMode !== ei.split || e.direction !== I.left && e.direction !== I.right) return;
	e.bounds.right < Ha && e.direction === I.left ? e.particle.position.x = e.size + e.offset.x : e.bounds.left > e.canvasSize.width && e.direction === I.right && (e.particle.position.x = e.canvasSize.width - e.size - e.offset.x);
	let t = e.particle.velocity.x, n = !1;
	if (e.direction === I.right && e.bounds.right >= e.canvasSize.width && t > Va || e.direction === I.left && e.bounds.left <= Ha && t < Va) {
		let t = P(e.particle.options.bounce.horizontal.value);
		e.particle.velocity.x *= -t, n = !0;
	}
	if (!n) return;
	let r = e.offset.x + e.size;
	e.bounds.right >= e.canvasSize.width && e.direction === I.right ? e.particle.position.x = e.canvasSize.width - r : e.bounds.left <= Ha && e.direction === I.left && (e.particle.position.x = r), e.outMode === ei.split && e.particle.destroy();
}
function Wa(e) {
	if (e.outMode !== ei.bounce && e.outMode !== ei.split || e.direction !== I.bottom && e.direction !== I.top) return;
	e.bounds.bottom < Ha && e.direction === I.top ? e.particle.position.y = e.size + e.offset.y : e.bounds.top > e.canvasSize.height && e.direction === I.bottom && (e.particle.position.y = e.canvasSize.height - e.size - e.offset.y);
	let t = e.particle.velocity.y, n = !1;
	if (e.direction === I.bottom && e.bounds.bottom >= e.canvasSize.height && t > Va || e.direction === I.top && e.bounds.top <= Ha && t < Va) {
		let t = P(e.particle.options.bounce.vertical.value);
		e.particle.velocity.y *= -t, n = !0;
	}
	if (!n) return;
	let r = e.offset.y + e.size;
	e.bounds.bottom >= e.canvasSize.height && e.direction === I.bottom ? e.particle.position.y = e.canvasSize.height - r : e.bounds.top <= Ha && e.direction === I.top && (e.particle.position.y = r), e.outMode === ei.split && e.particle.destroy();
}
//#endregion
//#region node_modules/@tsparticles/updater-out-modes/browser/BounceOutMode.js
var Ga = class {
	constructor(e) {
		this.container = e, this.modes = [ei.bounce, ei.split];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r)) return;
		let i = this.container, a = !1;
		for (let r of i.plugins.values()) if (r.particleBounce !== void 0 && (a = r.particleBounce(e, n, t)), a) break;
		if (a) return;
		let o = e.getPosition(), s = e.offset, c = e.getRadius(), l = cn(o, c), u = i.canvas.size;
		Ua({
			particle: e,
			outMode: r,
			direction: t,
			bounds: l,
			canvasSize: u,
			offset: s,
			size: c
		}), Wa({
			particle: e,
			outMode: r,
			direction: t,
			bounds: l,
			canvasSize: u,
			offset: s,
			size: c
		});
	}
}, Ka = 0, qa = class {
	constructor(e) {
		this.container = e, this.modes = [ei.destroy];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r)) return;
		let i = this.container;
		switch (e.outType) {
			case Si.normal:
			case Si.outside:
				if (on(e.position, i.canvas.size, St.origin, e.getRadius(), t)) return;
				break;
			case Si.inside: {
				let { dx: t, dy: n } = Nt(e.position, e.moveCenter), { x: r, y: i } = e.velocity;
				if (r < Ka && t > e.moveCenter.radius || i < Ka && n > e.moveCenter.radius || r >= Ka && t < -e.moveCenter.radius || i >= Ka && n < -e.moveCenter.radius) return;
				break;
			}
		}
		i.particles.remove(e, e.group, !0);
	}
}, Ja = 0, Ya = class {
	constructor(e) {
		this.container = e, this.modes = [ei.none];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r) || ((e.options.move.distance.horizontal && (t === I.left || t === I.right)) ?? (e.options.move.distance.vertical && (t === I.top || t === I.bottom)))) return;
		let i = e.options.move.gravity, a = this.container, o = a.canvas.size, s = e.getRadius();
		if (i.enable) {
			let n = e.position;
			(!i.inverse && n.y > o.height + s && t === I.bottom || i.inverse && n.y < -s && t === I.top) && a.particles.remove(e);
		} else {
			if (e.velocity.y > Ja && e.position.y <= o.height + s || e.velocity.y < Ja && e.position.y >= -s || e.velocity.x > Ja && e.position.x <= o.width + s || e.velocity.x < Ja && e.position.x >= -s) return;
			on(e.position, a.canvas.size, St.origin, s, t) || a.particles.remove(e);
		}
	}
}, Xa = 0, Za = 0, Qa = class {
	constructor(e) {
		this.container = e, this.modes = [ei.out];
	}
	update(e, t, n, r) {
		if (!this.modes.includes(r)) return;
		let i = this.container;
		switch (e.outType) {
			case Si.inside: {
				let { x: t, y: n } = e.velocity, r = St.origin;
				r.length = e.moveCenter.radius, r.angle = e.velocity.angle + Math.PI, r.addTo(St.create(e.moveCenter));
				let { dx: a, dy: o } = Nt(e.position, r);
				if (t <= Xa && a >= Za || n <= Xa && o >= Za || t >= Xa && a <= Za || n >= Xa && o <= Za) return;
				e.position.x = Math.floor(At({
					min: 0,
					max: i.canvas.size.width
				})), e.position.y = Math.floor(At({
					min: 0,
					max: i.canvas.size.height
				}));
				let { dx: s, dy: c } = Nt(e.position, e.moveCenter);
				e.direction = Math.atan2(-c, -s), e.velocity.angle = e.direction;
				break;
			}
			default:
				if (on(e.position, i.canvas.size, St.origin, e.getRadius(), t)) return;
				switch (e.outType) {
					case Si.outside: {
						e.position.x = Math.floor(At({
							min: -e.moveCenter.radius,
							max: e.moveCenter.radius
						})) + e.moveCenter.x, e.position.y = Math.floor(At({
							min: -e.moveCenter.radius,
							max: e.moveCenter.radius
						})) + e.moveCenter.y;
						let { dx: t, dy: n } = Nt(e.position, e.moveCenter);
						e.moveCenter.radius && (e.direction = Math.atan2(n, t), e.velocity.angle = e.direction);
						break;
					}
					case Si.normal: {
						let n = e.options.move.warp, r = i.canvas.size, a = {
							bottom: r.height + e.getRadius() + e.offset.y,
							left: -e.getRadius() - e.offset.x,
							right: r.width + e.getRadius() + e.offset.x,
							top: -e.getRadius() - e.offset.y
						}, o = e.getRadius(), s = cn(e.position, o);
						t === I.right && s.left > r.width + e.offset.x ? (e.position.x = a.left, e.initialPosition.x = e.position.x, n || (e.position.y = Tt() * r.height, e.initialPosition.y = e.position.y)) : t === I.left && s.right < -e.offset.x && (e.position.x = a.right, e.initialPosition.x = e.position.x, n || (e.position.y = Tt() * r.height, e.initialPosition.y = e.position.y)), t === I.bottom && s.top > r.height + e.offset.y ? (n || (e.position.x = Tt() * r.width, e.initialPosition.x = e.position.x), e.position.y = a.top, e.initialPosition.y = e.position.y) : t === I.top && s.bottom < -e.offset.y && (n || (e.position.x = Tt() * r.width, e.initialPosition.x = e.position.x), e.position.y = a.bottom, e.initialPosition.y = e.position.y);
						break;
					}
				}
		}
	}
}, $a = (e, t) => e.default === t || e.bottom === t || e.left === t || e.right === t || e.top === t, eo = class {
	constructor(e) {
		this._addUpdaterIfMissing = (e, t, n) => {
			let r = e.options.move.outModes;
			!this.updaters.has(t) && $a(r, t) && this.updaters.set(t, n(this.container));
		}, this._updateOutMode = (e, t, n, r) => {
			for (let i of this.updaters.values()) i.update(e, r, t, n);
		}, this.container = e, this.updaters = /* @__PURE__ */ new Map();
	}
	init(e) {
		this._addUpdaterIfMissing(e, ei.bounce, (e) => new Ga(e)), this._addUpdaterIfMissing(e, ei.out, (e) => new Qa(e)), this._addUpdaterIfMissing(e, ei.destroy, (e) => new qa(e)), this._addUpdaterIfMissing(e, ei.none, (e) => new Ya(e));
	}
	isEnabled(e) {
		return !e.destroyed && !e.spawning;
	}
	update(e, t) {
		let n = e.options.move.outModes;
		this._updateOutMode(e, t, n.bottom ?? n.default, I.bottom), this._updateOutMode(e, t, n.left ?? n.default, I.left), this._updateOutMode(e, t, n.right ?? n.default, I.right), this._updateOutMode(e, t, n.top ?? n.default, I.top);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-out-modes/browser/index.js
async function to(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("outModes", (e) => Promise.resolve(new eo(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-rgb-color/browser/RgbColorManager.js
var no;
(function(e) {
	e[e.r = 1] = "r", e[e.g = 2] = "g", e[e.b = 3] = "b", e[e.a = 5] = "a";
})(no ||= {});
var ro = class {
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
			r: P(t.r),
			g: P(t.g),
			b: P(t.b)
		};
	}
	parseString(e) {
		if (!e.startsWith(this.stringPrefix)) return;
		let t = /rgba?\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i.exec(e);
		return t ? {
			a: t.length > 4 ? Bt(t[no.a]) : 1,
			b: parseInt(t[no.b], 10),
			g: parseInt(t[no.g], 10),
			r: parseInt(t[no.r], 10)
		} : void 0;
	}
};
//#endregion
//#region node_modules/@tsparticles/plugin-rgb-color/browser/index.js
async function io(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addColorManager(new ro(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-size/browser/SizeUpdater.js
var ao = 0, oo = class {
	init(e) {
		let t = e.container, n = e.options.size.animation;
		n.enable && (e.size.velocity = (e.retina.sizeAnimationSpeed ?? t.retina.sizeAnimationSpeed) / 100 * t.retina.reduceFactor, n.sync || (e.size.velocity *= Tt()));
	}
	isEnabled(e) {
		return !e.destroyed && !e.spawning && e.size.enable && ((e.size.maxLoops ?? ao) <= ao || (e.size.maxLoops ?? ao) > ao && (e.size.loops ?? ao) < (e.size.maxLoops ?? ao));
	}
	reset(e) {
		e.size.loops = ao;
	}
	update(e, t) {
		this.isEnabled(e) && wn(e, e.size, !0, e.options.size.animation.destroy, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-size/browser/index.js
async function so(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("size", () => Promise.resolve(new oo()), t);
}
//#endregion
//#region node_modules/@tsparticles/basic/browser/index.js
async function co(e, t = !0) {
	e.checkVersion("3.9.1"), await Fa(e, !1), await Ra(e, !1), await io(e, !1), await ga(e, !1), await Ta(e, !1), await Da(e, !1), await Ba(e, !1), await to(e, !1), await so(e, !1), await e.refresh(t);
}
//#endregion
//#region node_modules/@tsparticles/plugin-easing-quad/browser/index.js
async function lo(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addEasing(Yi.easeInQuad, (e) => e ** 2, !1), await e.addEasing(Yi.easeOutQuad, (e) => 1 - (1 - e) ** 2, !1), await e.addEasing(Yi.easeInOutQuad, (e) => e < .5 ? 2 * e ** 2 : 1 - (-2 * e + 2) ** 2 / 2, !1), await e.refresh(t);
}
//#endregion
//#region node_modules/@tsparticles/shape-emoji/browser/Utils.js
function uo(e, t) {
	let { context: n, opacity: r } = e, i = n.globalAlpha;
	if (!t) return;
	let a = t.width, o = a * .5;
	n.globalAlpha = r, n.drawImage(t, -o, -o, a, a), n.globalAlpha = i;
}
//#endregion
//#region node_modules/@tsparticles/shape-emoji/browser/EmojiDrawer.js
var fo = "\"Twemoji Mozilla\", Apple Color Emoji, \"Segoe UI Emoji\", \"Noto Color Emoji\", \"EmojiOne Color\"", po = 0, mo = class {
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
		n && uo(e, n);
	}
	async init(e) {
		let t = e.actualOptions, { validTypes: n } = this;
		if (!n.find((e) => tn(e, t.particles.shape.type))) return;
		let r = [nn(fo)], i = n.map((e) => t.particles.shape.options[e]).find((e) => !!e);
		i && _n(i, (e) => {
			e.font && r.push(nn(e.font));
		}), await Promise.all(r);
	}
	particleDestroy(e) {
		e.emojiDataKey = void 0;
	}
	particleInit(e, t) {
		let n = t.shapeData;
		if (!n?.value) return;
		let r = vn(n.value, t.randomIndexData);
		if (!r) return;
		let i = typeof r == "string" ? {
			font: n.font ?? fo,
			padding: n.padding ?? po,
			value: r
		} : {
			font: fo,
			padding: po,
			...n,
			...r
		}, a = i.font, o = i.value, s = `${o}_${a}`;
		if (this._emojiShapeDict.has(s)) {
			t.emojiDataKey = s;
			return;
		}
		let c = i.padding * 2, l = Mt(t.size.value), u = l + c, d = u * 2, f;
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
async function ho(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new mo(), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-attract/browser/Utils.js
var go = 1, _o = 1, vo = 0;
function yo(e, t, n, r, i, a) {
	let o = t.actualOptions.interactivity.modes.attract;
	if (!o) return;
	let s = t.particles.quadTree.query(i, a);
	for (let t of s) {
		let { dx: i, dy: a, distance: s } = Nt(t.position, n), c = o.speed * o.factor, l = Ot(e.getEasing(o.easing)(_o - s / r) * c, go, o.maxSpeed), u = St.create(s ? i / s * l : c, s ? a / s * l : c);
		t.position.subFrom(u);
	}
}
function bo(e, t, n) {
	t.attract ||= { particles: [] };
	let { attract: r } = t;
	if (r.finish || (r.count ||= 0, r.count++, r.count === t.particles.count && (r.finish = !0)), r.clicking) {
		let r = t.interactivity.mouse.clickPosition, i = t.retina.attractModeDistance;
		if (!i || i < vo || !r) return;
		yo(e, t, r, i, new Ai(r.x, r.y, i), (e) => n(e));
	} else r.clicking === !1 && (r.particles = []);
}
function xo(e, t, n) {
	let r = t.interactivity.mouse.position, i = t.retina.attractModeDistance;
	!i || i < vo || !r || yo(e, t, r, i, new Ai(r.x, r.y, i), (e) => n(e));
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-attract/browser/Options/Classes/Attract.js
var So = class {
	constructor() {
		this.distance = 200, this.duration = .4, this.easing = Yi.easeOutQuad, this.factor = 1, this.maxSpeed = 50, this.speed = 1;
	}
	load(e) {
		N(e) || (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.easing !== void 0 && (this.easing = e.easing), e.factor !== void 0 && (this.factor = e.factor), e.maxSpeed !== void 0 && (this.maxSpeed = e.maxSpeed), e.speed !== void 0 && (this.speed = e.speed));
	}
}, Co = "attract", wo = class extends Ki {
	constructor(e, t) {
		super(t), this._engine = e, t.attract ||= { particles: [] }, this.handleClickMode = (e) => {
			let n = this.container.actualOptions.interactivity.modes.attract;
			if (n && e === Co) {
				t.attract ||= { particles: [] }, t.attract.clicking = !0, t.attract.count = 0;
				for (let e of t.attract.particles) this.isEnabled(e) && e.velocity.setTo(e.initialVelocity);
				t.attract.particles = [], t.attract.finish = !1, setTimeout(() => {
					t.destroyed || (t.attract ||= { particles: [] }, t.attract.clicking = !1);
				}, n.duration * rt);
			}
		};
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.attract;
		t && (e.retina.attractModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions, n = e.interactivity.status === Je, r = t.interactivity.events, { enable: i, mode: a } = r.onHover, { enable: o, mode: s } = r.onClick;
		n && i && tn(Co, a) ? xo(this._engine, this.container, (e) => this.isEnabled(e)) : o && tn(Co, s) && bo(this._engine, this.container, (e) => this.isEnabled(e));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, i = (e?.interactivity ?? n.interactivity).events;
		if ((!r.position || !i.onHover.enable) && (!r.clickPosition || !i.onClick.enable)) return !1;
		let a = i.onHover.mode, o = i.onClick.mode;
		return tn(Co, a) || tn(Co, o);
	}
	loadModeOptions(e, ...t) {
		e.attract ||= new So();
		for (let n of t) e.attract.load(n?.attract);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-attract/browser/index.js
async function To(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalAttract", (t) => Promise.resolve(new wo(e, t)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bounce/browser/Utils.js
var Eo = 2, Do = .5, Oo = Math.PI * Do, ko = 2, Ao = 10, jo = 0;
function Mo(e, t, n, r, i) {
	let a = e.particles.quadTree.query(r, i);
	for (let e of a) r instanceof Ai ? hn(mn(e), {
		position: t,
		radius: n,
		mass: n ** Eo * Oo,
		velocity: St.origin,
		factor: St.origin
	}) : r instanceof ji && gn(e, cn(t, n));
}
function No(e, t, n, r) {
	let i = document.querySelectorAll(t);
	i.length && i.forEach((t) => {
		let i = t, a = e.retina.pixelRatio, o = {
			x: (i.offsetLeft + i.offsetWidth * Do) * a,
			y: (i.offsetTop + i.offsetHeight * Do) * a
		}, s = i.offsetWidth * Do * a, c = Ao * a;
		r(o, s, n.type === vr.circle ? new Ai(o.x, o.y, s + c) : new ji(i.offsetLeft * a - c, i.offsetTop * a - c, i.offsetWidth * a + c * ko, i.offsetHeight * a + c * ko));
	});
}
function Po(e, t, n, r) {
	dn(n, t, (t, n) => No(e, t, n, (t, n, i) => Mo(e, t, n, i, r)));
}
function Fo(e, t) {
	let n = Ao * e.retina.pixelRatio, r = e.interactivity.mouse.position, i = e.retina.bounceModeDistance;
	!i || i < jo || !r || Mo(e, r, i, new Ai(r.x, r.y, i + n), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bounce/browser/Options/Classes/Bounce.js
var Io = class {
	constructor() {
		this.distance = 200;
	}
	load(e) {
		N(e) || e.distance !== void 0 && (this.distance = e.distance);
	}
}, Lo = "bounce", Ro = class extends Ki {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.bounce;
		t && (e.retina.bounceModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions.interactivity.events, n = e.interactivity.status === Je, r = t.onHover.enable, i = t.onHover.mode, a = t.onDiv;
		n && r && tn(Lo, i) ? Fo(this.container, (e) => this.isEnabled(e)) : Po(this.container, a, Lo, (e) => this.isEnabled(e));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, i = (e?.interactivity ?? n.interactivity).events, a = i.onDiv;
		return !!r.position && i.onHover.enable && tn(Lo, i.onHover.mode) || un(Lo, a);
	}
	loadModeOptions(e, ...t) {
		e.bounce ||= new Io();
		for (let n of t) e.bounce.load(n?.bounce);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-bounce/browser/index.js
async function zo(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalBounce", (e) => Promise.resolve(new Ro(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/Options/Classes/BubbleBase.js
var Bo = class {
	constructor() {
		this.distance = 200, this.duration = .4, this.mix = !1;
	}
	load(e) {
		if (!N(e)) {
			if (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.mix !== void 0 && (this.mix = e.mix), e.opacity !== void 0 && (this.opacity = e.opacity), e.color !== void 0) {
				let t = bt(this.color) ? void 0 : this.color;
				this.color = _n(e.color, (e) => fr.create(t, e));
			}
			e.size !== void 0 && (this.size = e.size);
		}
	}
}, Vo = class extends Bo {
	constructor() {
		super(), this.selectors = [];
	}
	load(e) {
		super.load(e), !N(e) && e.selectors !== void 0 && (this.selectors = e.selectors);
	}
}, Ho = class extends Bo {
	load(e) {
		super.load(e), !N(e) && (this.divs = _n(e.divs, (e) => {
			let t = new Vo();
			return t.load(e), t;
		}));
	}
}, Uo;
(function(e) {
	e.color = "color", e.opacity = "opacity", e.size = "size";
})(Uo ||= {});
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/Utils.js
function B(e, t, n, r) {
	if (t >= n) return Ot(e + (t - n) * r, e, t);
	if (t < n) return Ot(e - (n - t) * r, t, e);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/Bubbler.js
var V = "bubble", Wo = 0, Go = 0, Ko = 2, qo = 1, Jo = 1, Yo = 0, Xo = 0, Zo = .5, Qo = 1, $o = class extends Ki {
	constructor(e, t) {
		super(e), this._clickBubble = () => {
			let e = this.container, t = e.actualOptions, n = e.interactivity.mouse.clickPosition, r = t.interactivity.modes.bubble;
			if (!r || !n) return;
			e.bubble ||= {};
			let i = e.retina.bubbleModeDistance;
			if (!i || i < Wo) return;
			let a = e.particles.quadTree.queryCircle(n, i, (e) => this.isEnabled(e)), { bubble: o } = e;
			for (let t of a) {
				if (!o.clicking) continue;
				t.bubble.inRange = !o.durationEnd;
				let a = Pt(t.getPosition(), n), s = ((/* @__PURE__ */ new Date()).getTime() - (e.interactivity.mouse.clickTime ?? Go)) / rt;
				s > r.duration && (o.durationEnd = !0), s > r.duration * Ko && (o.clicking = !1, o.durationEnd = !1);
				let c = {
					bubbleObj: {
						optValue: e.retina.bubbleModeSize,
						value: t.bubble.radius
					},
					particlesObj: {
						optValue: Mt(t.options.size.value) * e.retina.pixelRatio,
						value: t.size.value
					},
					type: Uo.size
				};
				this._process(t, a, s, c);
				let l = {
					bubbleObj: {
						optValue: r.opacity,
						value: t.bubble.opacity
					},
					particlesObj: {
						optValue: Mt(t.options.opacity.value),
						value: t.opacity?.value ?? qo
					},
					type: Uo.opacity
				};
				this._process(t, a, s, l), !o.durationEnd && a <= i ? this._hoverBubbleColor(t, a) : delete t.bubble.color;
			}
		}, this._hoverBubble = () => {
			let e = this.container, t = e.interactivity.mouse.position, n = e.retina.bubbleModeDistance;
			if (!n || n < Wo || !t) return;
			let r = e.particles.quadTree.queryCircle(t, n, (e) => this.isEnabled(e));
			for (let i of r) {
				i.bubble.inRange = !0;
				let r = Pt(i.getPosition(), t), a = Jo - r / n;
				r <= n ? a >= Xo && e.interactivity.status === "pointermove" && (this._hoverBubbleSize(i, a), this._hoverBubbleOpacity(i, a), this._hoverBubbleColor(i, a)) : this.reset(i), e.interactivity.status === "pointerleave" && this.reset(i);
			}
		}, this._hoverBubbleColor = (e, t, n) => {
			let r = this.container.actualOptions, i = n ?? r.interactivity.modes.bubble;
			if (i) {
				if (!e.bubble.finalColor) {
					let t = i.color;
					if (!t) return;
					let n = vn(t);
					e.bubble.finalColor = Mn(this._engine, n);
				}
				if (e.bubble.finalColor) {
					if (i.mix) {
						e.bubble.color = void 0;
						let n = e.getFillColor();
						e.bubble.color = n ? Nn(Bn(n, e.bubble.finalColor, Jo - t, t)) : e.bubble.finalColor;
					} else e.bubble.color = e.bubble.finalColor;
				}
			}
		}, this._hoverBubbleOpacity = (e, t, n) => {
			let r = this.container.actualOptions, i = n?.opacity ?? r.interactivity.modes.bubble?.opacity;
			if (!i) return;
			let a = e.options.opacity.value, o = B(e.opacity?.value ?? qo, i, Mt(a), t);
			o !== void 0 && (e.bubble.opacity = o);
		}, this._hoverBubbleSize = (e, t, n) => {
			let r = this.container, i = n?.size ? n.size * r.retina.pixelRatio : r.retina.bubbleModeSize;
			if (i === void 0) return;
			let a = Mt(e.options.size.value) * r.retina.pixelRatio, o = e.size.value, s = B(o, i, a, t);
			s !== void 0 && (e.bubble.radius = s);
		}, this._process = (e, t, n, r) => {
			let i = this.container, a = r.bubbleObj.optValue, o = i.actualOptions.interactivity.modes.bubble;
			if (!o || a === void 0) return;
			let s = o.duration, c = i.retina.bubbleModeDistance, l = r.particlesObj.optValue, u = r.bubbleObj.value, d = r.particlesObj.value ?? Yo, f = r.type;
			if (!(!c || c < Wo || a === l)) {
				if (i.bubble ||= {}, i.bubble.durationEnd) u && (f === Uo.size && delete e.bubble.radius, f === Uo.opacity && delete e.bubble.opacity);
				else if (t <= c) {
					if ((u ?? d) !== a) {
						let t = d - n * (d - a) / s;
						f === Uo.size && (e.bubble.radius = t), f === Uo.opacity && (e.bubble.opacity = t);
					}
				} else f === Uo.size && delete e.bubble.radius, f === Uo.opacity && delete e.bubble.opacity;
			}
		}, this._singleSelectorHover = (e, t, n) => {
			let r = this.container, i = document.querySelectorAll(t), a = r.actualOptions.interactivity.modes.bubble;
			a && i.length && i.forEach((t) => {
				let i = t, o = r.retina.pixelRatio, s = {
					x: (i.offsetLeft + i.offsetWidth * Zo) * o,
					y: (i.offsetTop + i.offsetHeight * Zo) * o
				}, c = i.offsetWidth * Zo * o, l = n.type === vr.circle ? new Ai(s.x, s.y, c) : new ji(i.offsetLeft * o, i.offsetTop * o, i.offsetWidth * o, i.offsetHeight * o), u = r.particles.quadTree.query(l, (e) => this.isEnabled(e));
				for (let t of u) {
					if (!l.contains(t.getPosition())) continue;
					t.bubble.inRange = !0;
					let n = a.divs, r = pn(n, i);
					(!t.bubble.div || t.bubble.div !== i) && (this.clear(t, e, !0), t.bubble.div = i), this._hoverBubbleSize(t, Qo, r), this._hoverBubbleOpacity(t, Qo, r), this._hoverBubbleColor(t, Qo, r);
				}
			});
		}, this._engine = t, e.bubble ||= {}, this.handleClickMode = (t) => {
			t === V && (e.bubble ||= {}, e.bubble.clicking = !0);
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
		i && tn(V, a) ? this._hoverBubble() : o && tn(V, s) ? this._clickBubble() : dn(V, c, (t, n) => this._singleSelectorHover(e, t, n));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, { onClick: i, onDiv: a, onHover: o } = (e?.interactivity ?? n.interactivity).events, s = un(V, a);
		return s || o.enable && r.position || i.enable && r.clickPosition ? tn(V, o.mode) || tn(V, i.mode) || s : !1;
	}
	loadModeOptions(e, ...t) {
		e.bubble ||= new Ho();
		for (let n of t) e.bubble.load(n?.bubble);
	}
	reset(e) {
		e.bubble.inRange = !1;
	}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-bubble/browser/index.js
async function es(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalBubble", (t) => Promise.resolve(new $o(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-connect/browser/Options/Classes/ConnectLinks.js
var ts = class {
	constructor() {
		this.opacity = .5;
	}
	load(e) {
		N(e) || e.opacity !== void 0 && (this.opacity = e.opacity);
	}
}, ns = class {
	constructor() {
		this.distance = 80, this.links = new ts(), this.radius = 60;
	}
	load(e) {
		N(e) || (e.distance !== void 0 && (this.distance = e.distance), this.links.load(e.links), e.radius !== void 0 && (this.radius = e.radius));
	}
}, rs = 0, is = 1, as = 0;
function os(e, t, n, r) {
	let i = Math.floor(n.getRadius() / t.getRadius()), a = t.getFillColor(), o = n.getFillColor();
	if (!a || !o) return;
	let s = t.getPosition(), c = n.getPosition(), l = Bn(a, o, t.getRadius(), n.getRadius()), u = e.createLinearGradient(s.x, s.y, c.x, c.y);
	return u.addColorStop(rs, zn(a, r)), u.addColorStop(Ot(i, rs, is), Rn(l, r)), u.addColorStop(is, zn(o, r)), u;
}
function ss(e, t, n, r, i) {
	Jn(e, r, i), e.lineWidth = t, e.strokeStyle = n, e.stroke();
}
function cs(e, t, n, r) {
	let i = e.actualOptions.interactivity.modes.connect;
	if (i) return os(t, n, r, i.links.opacity);
}
function ls(e, t, n) {
	e.canvas.draw((r) => {
		let i = cs(e, r, t, n);
		if (!i) return;
		let a = t.getPosition(), o = n.getPosition();
		ss(r, t.retina.linksWidth ?? as, i, a, o);
	});
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-connect/browser/Connector.js
var us = "connect", ds = 0, fs = class extends Ki {
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
			if (!n || n < ds || !r || r < ds || !t) return;
			let i = Math.abs(r), a = e.particles.quadTree.queryCircle(t, i, (e) => this.isEnabled(e));
			a.forEach((t, r) => {
				let i = t.getPosition();
				for (let o of a.slice(r + 1)) {
					let r = o.getPosition(), a = Math.abs(n), s = Math.abs(i.x - r.x), c = Math.abs(i.y - r.y);
					s < a && c < a && ls(e, t, o);
				}
			});
		}
	}
	isEnabled(e) {
		let t = this.container, n = t.interactivity.mouse, r = (e?.interactivity ?? t.actualOptions.interactivity).events;
		return r.onHover.enable && n.position ? tn(us, r.onHover.mode) : !1;
	}
	loadModeOptions(e, ...t) {
		e.connect ||= new ns();
		for (let n of t) e.connect.load(n?.connect);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-connect/browser/index.js
async function ps(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalConnect", (e) => Promise.resolve(new fs(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-grab/browser/Options/Classes/GrabLinks.js
var ms = class {
	constructor() {
		this.blink = !1, this.consent = !1, this.opacity = 1;
	}
	load(e) {
		N(e) || (e.blink !== void 0 && (this.blink = e.blink), e.color !== void 0 && (this.color = fr.create(this.color, e.color)), e.consent !== void 0 && (this.consent = e.consent), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, hs = class {
	constructor() {
		this.distance = 100, this.links = new ms();
	}
	load(e) {
		N(e) || (e.distance !== void 0 && (this.distance = e.distance), this.links.load(e.links));
	}
}, gs = 0;
function _s(e, t, n, r, i, a) {
	Jn(e, n, r), e.strokeStyle = Rn(i, a), e.lineWidth = t, e.stroke();
}
function vs(e, t, n, r, i) {
	e.canvas.draw((e) => {
		let a = t.getPosition();
		_s(e, t.retina.linksWidth ?? gs, a, i, n, r);
	});
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-grab/browser/Grabber.js
var ys = "grab", bs = 0, xs = 0, Ss = class extends Ki {
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
		if (!r || r < bs) return;
		let i = e.particles.quadTree.queryCircle(n, r, (e) => this.isEnabled(e));
		for (let a of i) {
			let i = Pt(a.getPosition(), n);
			if (i > r) continue;
			let o = t.modes.grab.links, s = o.opacity, c = s - i * s / r;
			if (c <= xs) continue;
			let l = o.color ?? a.options.links?.color;
			if (!e.particles.grabLineColor && l) {
				let n = t.modes.grab.links;
				e.particles.grabLineColor = Hn(this._engine, l, n.blink, n.consent);
			}
			let u = Vn(a, void 0, e.particles.grabLineColor);
			u && vs(e, a, u, c, n);
		}
	}
	isEnabled(e) {
		let t = this.container, n = t.interactivity.mouse, r = (e?.interactivity ?? t.actualOptions.interactivity).events;
		return r.onHover.enable && !!n.position && tn(ys, r.onHover.mode);
	}
	loadModeOptions(e, ...t) {
		e.grab ||= new hs();
		for (let n of t) e.grab.load(n?.grab);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-grab/browser/index.js
async function Cs(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalGrab", (t) => Promise.resolve(new Ss(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-pause/browser/Pauser.js
var ws = "pause", Ts = class extends Ki {
	constructor(e) {
		super(e), this.handleClickMode = (e) => {
			if (e !== ws) return;
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
async function Es(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalPause", (e) => Promise.resolve(new Ts(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-push/browser/Options/Classes/Push.js
var Ds = class {
	constructor() {
		this.default = !0, this.groups = [], this.quantity = 4;
	}
	load(e) {
		if (N(e)) return;
		e.default !== void 0 && (this.default = e.default), e.groups !== void 0 && (this.groups = e.groups.map((e) => e)), this.groups.length || (this.default = !0);
		let t = e.quantity;
		t !== void 0 && (this.quantity = F(t)), this.particles = _n(e.particles, (e) => ln({}, e));
	}
}, Os = "push", ks = 0, As = class extends Ki {
	constructor(e) {
		super(e), this.handleClickMode = (e) => {
			if (e !== Os) return;
			let t = this.container, n = t.actualOptions.interactivity.modes.push;
			if (!n) return;
			let r = P(n.quantity);
			if (r <= ks) return;
			let i = an([void 0, ...n.groups]), a = ln(i === void 0 ? void 0 : t.actualOptions.particles.groups[i], vn(n.particles));
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
		e.push ||= new Ds();
		for (let n of t) e.push.load(n?.push);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-push/browser/index.js
async function js(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalPush", (e) => Promise.resolve(new As(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-remove/browser/Options/Classes/Remove.js
var Ms = class {
	constructor() {
		this.quantity = 2;
	}
	load(e) {
		if (N(e)) return;
		let t = e.quantity;
		t !== void 0 && (this.quantity = F(t));
	}
}, Ns = "remove", Ps = class extends Ki {
	constructor(e) {
		super(e), this.handleClickMode = (e) => {
			let t = this.container, n = t.actualOptions;
			if (!n.interactivity.modes.remove || e !== Ns) return;
			let r = P(n.interactivity.modes.remove.quantity);
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
		e.remove ||= new Ms();
		for (let n of t) e.remove.load(n?.remove);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-remove/browser/index.js
async function Fs(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalRemove", (e) => Promise.resolve(new Ps(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-repulse/browser/Options/Classes/RepulseBase.js
var Is = class {
	constructor() {
		this.distance = 200, this.duration = .4, this.factor = 100, this.speed = 1, this.maxSpeed = 50, this.easing = Yi.easeOutQuad;
	}
	load(e) {
		N(e) || (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.easing !== void 0 && (this.easing = e.easing), e.factor !== void 0 && (this.factor = e.factor), e.speed !== void 0 && (this.speed = e.speed), e.maxSpeed !== void 0 && (this.maxSpeed = e.maxSpeed));
	}
}, Ls = class extends Is {
	constructor() {
		super(), this.selectors = [];
	}
	load(e) {
		super.load(e), !N(e) && e.selectors !== void 0 && (this.selectors = e.selectors);
	}
}, Rs = class extends Is {
	load(e) {
		super.load(e), !N(e) && (this.divs = _n(e.divs, (e) => {
			let t = new Ls();
			return t.load(e), t;
		}));
	}
}, zs = "repulse", Bs = 0, Vs = 6, Hs = 3, Us = 2, Ws = 0, Gs = 0, Ks = 1, qs = .5, Js = class extends Ki {
	constructor(e, t) {
		super(t), this._clickRepulse = () => {
			let e = this.container, t = e.actualOptions.interactivity.modes.repulse;
			if (!t) return;
			let n = e.repulse ?? { particles: [] };
			if (n.finish || (n.count ||= 0, n.count++, n.count === e.particles.count && (n.finish = !0)), n.clicking) {
				let r = e.retina.repulseModeDistance;
				if (!r || r < Bs) return;
				let i = (r / Vs) ** +Hs, a = e.interactivity.mouse.clickPosition;
				if (a === void 0) return;
				let o = new Ai(a.x, a.y, i), s = e.particles.quadTree.query(o, (e) => this.isEnabled(e));
				for (let e of s) {
					let { dx: r, dy: o, distance: s } = Nt(a, e.position), c = s ** Us, l = t.speed, u = -i * l / c;
					if (c <= i) {
						n.particles.push(e);
						let t = St.create(r, o);
						t.length = u, e.velocity.setTo(t);
					}
				}
			} else if (n.clicking === !1) {
				for (let e of n.particles) e.velocity.setTo(e.initialVelocity);
				n.particles = [];
			}
		}, this._hoverRepulse = () => {
			let e = this.container, t = e.interactivity.mouse.position, n = e.retina.repulseModeDistance;
			!n || n < Ws || !t || this._processRepulse(t, n, new Ai(t.x, t.y, n));
		}, this._processRepulse = (e, t, n, r) => {
			let i = this.container, a = i.particles.quadTree.query(n, (e) => this.isEnabled(e)), o = i.actualOptions.interactivity.modes.repulse;
			if (!o) return;
			let { easing: s, speed: c, factor: l, maxSpeed: u } = o, d = this._engine.getEasing(s), f = (r?.speed ?? c) * l;
			for (let n of a) {
				let { dx: r, dy: i, distance: a } = Nt(n.position, e), o = Ot(d(Ks - a / t) * f, Gs, u), s = St.create(a ? r / a * o : f, a ? i / a * o : f);
				n.position.addTo(s);
			}
		}, this._singleSelectorRepulse = (e, t) => {
			let n = this.container, r = n.actualOptions.interactivity.modes.repulse;
			if (!r) return;
			let i = document.querySelectorAll(e);
			i.length && i.forEach((e) => {
				let i = e, a = n.retina.pixelRatio, o = {
					x: (i.offsetLeft + i.offsetWidth * qs) * a,
					y: (i.offsetTop + i.offsetHeight * qs) * a
				}, s = i.offsetWidth * qs * a, c = t.type === vr.circle ? new Ai(o.x, o.y, s) : new ji(i.offsetLeft * a, i.offsetTop * a, i.offsetWidth * a, i.offsetHeight * a), l = r.divs, u = pn(l, i);
				this._processRepulse(o, s, c, u);
			});
		}, this._engine = e, t.repulse ||= { particles: [] }, this.handleClickMode = (e) => {
			let n = this.container.actualOptions.interactivity.modes.repulse;
			if (!n || e !== zs) return;
			t.repulse ||= { particles: [] };
			let r = t.repulse;
			r.clicking = !0, r.count = 0;
			for (let e of t.repulse.particles) this.isEnabled(e) && e.velocity.setTo(e.initialVelocity);
			r.particles = [], r.finish = !1, setTimeout(() => {
				t.destroyed || (r.clicking = !1);
			}, n.duration * rt);
		};
	}
	clear() {}
	init() {
		let e = this.container, t = e.actualOptions.interactivity.modes.repulse;
		t && (e.retina.repulseModeDistance = t.distance * e.retina.pixelRatio);
	}
	interact() {
		let e = this.container, t = e.actualOptions, n = e.interactivity.status === Je, r = t.interactivity.events, i = r.onHover, a = i.enable, o = i.mode, s = r.onClick, c = s.enable, l = s.mode, u = r.onDiv;
		n && a && tn(zs, o) ? this._hoverRepulse() : c && tn(zs, l) ? this._clickRepulse() : dn(zs, u, (e, t) => this._singleSelectorRepulse(e, t));
	}
	isEnabled(e) {
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse, i = (e?.interactivity ?? n.interactivity).events, a = i.onDiv, o = i.onHover, s = i.onClick, c = un(zs, a);
		if (!(c || o.enable && r.position || s.enable && r.clickPosition)) return !1;
		let l = o.mode, u = s.mode;
		return tn(zs, l) || tn(zs, u) || c;
	}
	loadModeOptions(e, ...t) {
		e.repulse ||= new Rs();
		for (let n of t) e.repulse.load(n?.repulse);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-repulse/browser/index.js
async function Ys(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalRepulse", (t) => Promise.resolve(new Js(e, t)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-external-slow/browser/Options/Classes/Slow.js
var Xs = class {
	constructor() {
		this.factor = 3, this.radius = 200;
	}
	load(e) {
		N(e) || (e.factor !== void 0 && (this.factor = e.factor), e.radius !== void 0 && (this.radius = e.radius));
	}
}, Zs = "slow", Qs = 0, $s = class extends Ki {
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
		return r.onHover.enable && !!n.position && tn(Zs, r.onHover.mode);
	}
	loadModeOptions(e, ...t) {
		e.slow ||= new Xs();
		for (let n of t) e.slow.load(n?.slow);
	}
	reset(e) {
		e.slow.inRange = !1;
		let t = this.container, n = t.actualOptions, r = t.interactivity.mouse.position, i = t.retina.slowModeRadius, a = n.interactivity.modes.slow;
		if (!a || !i || i < Qs || !r) return;
		let o = Pt(r, e.getPosition()), s = o / i, c = a.factor, { slow: l } = e;
		o > i || (l.inRange = !0, l.factor = s / c);
	}
};
//#endregion
//#region node_modules/@tsparticles/interaction-external-slow/browser/index.js
async function ec(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("externalSlow", (e) => Promise.resolve(new $s(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/Utils.js
var tc = 0, nc = 1, rc = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))|currentcolor/gi;
function ic(e, t, n) {
	let { svgData: r } = e;
	if (!r) return "";
	let i = zn(t, n);
	if (r.includes("fill")) return r.replace(rc, () => i);
	let a = r.indexOf(">");
	return `${r.substring(tc, a)} fill="${i}"${r.substring(a)}`;
}
async function ac(e) {
	return new Promise((t) => {
		e.loading = !0;
		let n = new Image();
		e.element = n, n.addEventListener("load", () => {
			e.loading = !1, t();
		}), n.addEventListener("error", () => {
			e.element = void 0, e.error = !0, e.loading = !1, qt().error(`${tt} loading image: ${e.source}`), t();
		}), n.src = e.source;
	});
}
async function oc(e) {
	if (e.type !== "svg") {
		await ac(e);
		return;
	}
	e.loading = !0;
	let t = await fetch(e.source);
	t.ok ? e.svgData = await t.text() : (qt().error(`${tt} Image not found`), e.error = !0), e.loading = !1;
}
function sc(e, t, n, r) {
	let i = ic(e, n, r.opacity?.value ?? nc), a = {
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
			await ac(n), a.loaded = !0, a.element = n.element, t(a);
		};
		s.addEventListener("error", () => void c()), s.src = o;
	});
}
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/GifUtils/Constants.js
var cc = [
	0,
	4,
	2,
	1
], lc = [
	8,
	8,
	4,
	2
], uc = class {
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
}, dc;
(function(e) {
	e[e.Replace = 0] = "Replace", e[e.Combine = 1] = "Combine", e[e.RestoreBackground = 2] = "RestoreBackground", e[e.RestorePrevious = 3] = "RestorePrevious", e[e.UndefinedA = 4] = "UndefinedA", e[e.UndefinedB = 5] = "UndefinedB", e[e.UndefinedC = 6] = "UndefinedC", e[e.UndefinedD = 7] = "UndefinedD";
})(dc ||= {});
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/GifUtils/Types/GIFDataHeaders.js
var fc;
(function(e) {
	e[e.Extension = 33] = "Extension", e[e.ApplicationExtension = 255] = "ApplicationExtension", e[e.GraphicsControlExtension = 249] = "GraphicsControlExtension", e[e.PlainTextExtension = 1] = "PlainTextExtension", e[e.CommentExtension = 254] = "CommentExtension", e[e.Image = 44] = "Image", e[e.EndOfFile = 59] = "EndOfFile";
})(fc ||= {});
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/GifUtils/Utils.js
var pc = {
	x: 0,
	y: 0
}, mc = 0, hc = .5, gc = 0, _c = 0, vc = 0;
function yc(e, t) {
	let n = [];
	for (let r = 0; r < t; r++) n.push({
		r: e.data[e.pos],
		g: e.data[e.pos + 1],
		b: e.data[e.pos + 2]
	}), e.pos += 3;
	return n;
}
function bc(e, t, n, r) {
	switch (e.nextByte()) {
		case fc.GraphicsControlExtension: {
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
		case fc.ApplicationExtension: {
			e.pos++;
			let n = {
				identifier: e.getString(8),
				authenticationCode: e.getString(3),
				data: e.readSubBlocksBin()
			};
			t.applicationExtensions.push(n);
			break;
		}
		case fc.CommentExtension:
			t.comments.push([n(!1), e.readSubBlocks()]);
			break;
		case fc.PlainTextExtension:
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
async function xc(e, t, n, r, i, a) {
	let o = t.frames[r(!0)];
	o.left = e.nextTwoBytes(), o.top = e.nextTwoBytes(), o.width = e.nextTwoBytes(), o.height = e.nextTwoBytes();
	let s = e.nextByte(), c = (s & 128) == 128, l = (s & 64) == 64;
	o.sortFlag = (s & 32) == 32, o.reserved = (s & 24) >>> 3;
	let u = 1 << (s & 7) + 1;
	c && (o.localColorTable = yc(e, u));
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
			if (cc[l] < o.height) {
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
							], cc[l] * o.width + lc[l] * t + e % (o.width * 4)), e += 4;
						}
						c.length === 1 << i && i < 12 && i++;
					}
					e === o.width * 4 * (t + 1) && (t++, cc[l] + lc[l] * t >= o.height && (r = !0));
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
async function Sc(e, t, n, r, i, a) {
	switch (e.nextByte()) {
		case fc.EndOfFile: return !0;
		case fc.Image:
			await xc(e, t, n, r, i, a);
			break;
		case fc.Extension:
			bc(e, t, r, i);
			break;
		default: throw EvalError("undefined block found");
	}
	return !1;
}
function Cc(e) {
	for (let t of e.applicationExtensions) if (t.identifier + t.authenticationCode === "NETSCAPE2.0") return t.data[1] + (t.data[2] << 8);
	return NaN;
}
async function wc(e, t, n) {
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
	}, o = new uc(new Uint8ClampedArray(i));
	if (o.getString(6) !== "GIF89a") throw Error("not a supported GIF file");
	a.width = o.nextTwoBytes(), a.height = o.nextTwoBytes();
	let s = o.nextByte(), c = (s & 128) == 128;
	a.colorRes = (s & 112) >>> 4, a.sortFlag = (s & 8) == 8;
	let l = 1 << (s & 7) + 1, u = o.nextByte();
	a.pixelAspectRatio = o.nextByte(), a.pixelAspectRatio !== 0 && (a.pixelAspectRatio = (a.pixelAspectRatio + 15) / 64), c && (a.globalColorTable = yc(o, l));
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
				disposalMethod: dc.Replace,
				image: new ImageData(1, 1, { colorSpace: "srgb" }),
				plainTextData: null,
				userInputDelayFlag: !1,
				delayTime: 0,
				sortFlag: !1,
				localColorTable: [],
				reserved: 0,
				GCreserved: 0
			}), h++, _ = -1, !1);
		while (!await Sc(o, a, n, v, y, t));
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
function Tc(e) {
	let { context: t, radius: n, particle: r, delta: i } = e, a = r.image;
	if (!a?.gifData || !a.gif) return;
	let o = new OffscreenCanvas(a.gifData.width, a.gifData.height), s = o.getContext("2d");
	if (!s) throw Error("could not create offscreen canvas context");
	s.imageSmoothingQuality = "low", s.imageSmoothingEnabled = !1, s.clearRect(pc.x, pc.y, o.width, o.height), r.gifLoopCount === void 0 && (r.gifLoopCount = a.gifLoopCount ?? vc);
	let c = r.gifFrame ?? mc, l = {
		x: -a.gifData.width * hc,
		y: -a.gifData.height * hc
	}, u = a.gifData.frames[c];
	if (r.gifTime === void 0 && (r.gifTime = gc), u.bitmap) {
		switch (t.scale(n / a.gifData.width, n / a.gifData.height), u.disposalMethod) {
			case dc.UndefinedA:
			case dc.UndefinedB:
			case dc.UndefinedC:
			case dc.UndefinedD:
			case dc.Replace:
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y), s.clearRect(pc.x, pc.y, o.width, o.height);
				break;
			case dc.Combine:
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y);
				break;
			case dc.RestoreBackground:
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y), s.clearRect(pc.x, pc.y, o.width, o.height), a.gifData.globalColorTable.length ? s.putImageData(a.gifData.backgroundImage, l.x, l.y) : s.putImageData(a.gifData.frames[_c].image, l.x + u.left, l.y + u.top);
				break;
			case dc.RestorePrevious: {
				let e = s.getImageData(pc.x, pc.y, o.width, o.height);
				s.drawImage(u.bitmap, u.left, u.top), t.drawImage(o, l.x, l.y), s.clearRect(pc.x, pc.y, o.width, o.height), s.putImageData(e, pc.x, pc.y);
			}
		}
		if (r.gifTime += i.value, r.gifTime > u.delayTime) {
			if (r.gifTime -= u.delayTime, ++c >= a.gifData.frames.length) {
				if (--r.gifLoopCount <= vc) return;
				c = _c, s.clearRect(pc.x, pc.y, o.width, o.height);
			}
			r.gifFrame = c;
		}
		t.scale(a.gifData.width / n, a.gifData.height / n);
	}
}
async function Ec(e) {
	if (e.type !== "gif") {
		await ac(e);
		return;
	}
	e.loading = !0;
	try {
		e.gifData = await wc(e.source), e.gifLoopCount = Cc(e.gifData) ?? vc, e.gifLoopCount ||= Infinity;
	} catch {
		e.error = !0;
	}
	e.loading = !1;
}
//#endregion
//#region node_modules/@tsparticles/shape-image/browser/ImageDrawer.js
var Dc = 2, Oc = 1, kc = 12, Ac = 1, jc = class {
	constructor(e) {
		this.validTypes = ["image", "images"], this.loadImageShape = async (e) => {
			if (!this._engine.loadImage) throw Error(`${tt} image shape not initialized`);
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
			if (t.globalAlpha = i, a.gif && a.gifData) Tc(e);
			else if (o) {
				let e = a.ratio, r = {
					x: -n,
					y: -n
				}, i = n * Dc;
				t.drawImage(o, r.x, r.y, i, i / e);
			}
			t.globalAlpha = Oc;
		}
	}
	getSidesCount() {
		return kc;
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
			e = a.svgData && i ? await sc(a, r, i, t) : {
				color: i,
				data: a,
				element: a.element,
				gif: a.gif,
				gifData: a.gifData,
				gifLoopCount: a.gifLoopCount,
				loaded: !0,
				ratio: r.width && r.height ? r.width / r.height : a.ratio ?? Ac,
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
}, Mc = class {
	constructor() {
		this.src = "", this.gif = !1;
	}
	load(e) {
		N(e) || (e.gif !== void 0 && (this.gif = e.gif), e.height !== void 0 && (this.height = e.height), e.name !== void 0 && (this.name = e.name), e.replaceColor !== void 0 && (this.replaceColor = e.replaceColor), e.src !== void 0 && (this.src = e.src), e.width !== void 0 && (this.width = e.width));
	}
}, Nc = class {
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
				let t = new Mc();
				t.load(e), n.push(t);
			}
		}
	}
	needsPlugin() {
		return !0;
	}
}, Pc = 3;
function Fc(e) {
	e.loadImage ||= async (t) => {
		if (!t.name && !t.src) throw Error(`${tt} no image source provided`);
		if (e.images ||= [], !e.images.find((e) => e.name === t.name || e.source === t.src)) try {
			let n = {
				gif: t.gif ?? !1,
				name: t.name ?? t.src,
				source: t.src,
				type: t.src.substring(t.src.length - Pc),
				error: !1,
				loading: !0,
				replaceColor: t.replaceColor,
				ratio: t.width && t.height ? t.width / t.height : void 0
			};
			e.images.push(n);
			let r;
			r = t.gif ? Ec : t.replaceColor ? oc : ac, await r(n);
		} catch {
			throw Error(`${tt} ${t.name ?? t.src} not found`);
		}
	};
}
async function Ic(e, t = !0) {
	e.checkVersion("3.9.1"), Fc(e);
	let n = new Nc(e);
	await e.addPlugin(n, t), await e.addShape(new jc(e), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-life/browser/Options/Classes/LifeDelay.js
var Lc = class extends Br {
	constructor() {
		super(), this.sync = !1;
	}
	load(e) {
		N(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
	}
}, Rc = class extends Br {
	constructor() {
		super(), this.sync = !1;
	}
	load(e) {
		N(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
	}
}, zc = class {
	constructor() {
		this.count = 0, this.delay = new Lc(), this.duration = new Rc();
	}
	load(e) {
		N(e) || (e.count !== void 0 && (this.count = e.count), this.delay.load(e.delay), this.duration.load(e.duration));
	}
}, Bc = 0, Vc = -1, Hc = 0, Uc = 0;
function Wc(e, t, n) {
	if (!e.life) return;
	let r = e.life, i = !1;
	if (e.spawning) {
		if (r.delayTime += t.value, r.delayTime >= e.life.delay) i = !0, e.spawning = !1, r.delayTime = Bc, r.time = Bc;
		else return;
	}
	if (r.duration === Vc || e.spawning || (i ? r.time = Bc : r.time += t.value, r.time < r.duration)) return;
	if (r.time = Bc, e.life.count > Hc && e.life.count--, e.life.count === Hc) {
		e.destroy();
		return;
	}
	let a = F(Uc, n.width), o = F(Uc, n.width);
	e.position.x = At(a), e.position.y = At(o), e.spawning = !0, r.delayTime = Bc, r.time = Bc, e.reset();
	let s = e.options.life;
	s && (r.delay = P(s.delay.value) * rt, r.duration = P(s.duration.value) * rt);
}
//#endregion
//#region node_modules/@tsparticles/updater-life/browser/LifeUpdater.js
var Gc = 0, Kc = 1, qc = -1, Jc = class {
	constructor(e) {
		this.container = e;
	}
	init(e) {
		let t = this.container, n = e.options.life;
		n && (e.life = {
			delay: t.retina.reduceFactor ? P(n.delay.value) * (n.delay.sync ? Kc : Tt()) / t.retina.reduceFactor * rt : Gc,
			delayTime: Gc,
			duration: t.retina.reduceFactor ? P(n.duration.value) * (n.duration.sync ? Kc : Tt()) / t.retina.reduceFactor * rt : Gc,
			time: Gc,
			count: n.count
		}, e.life.duration <= Gc && (e.life.duration = qc), e.life.count <= Gc && (e.life.count = qc), e.life && (e.spawning = e.life.delay > Gc));
	}
	isEnabled(e) {
		return !e.destroyed;
	}
	loadOptions(e, ...t) {
		e.life ||= new zc();
		for (let n of t) e.life.load(n?.life);
	}
	update(e, t) {
		this.isEnabled(e) && e.life && Wc(e, t, this.container.canvas.size);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-life/browser/index.js
async function Yc(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("life", async (e) => Promise.resolve(new Jc(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-line/browser/Utils.js
function Xc(e) {
	let { context: t, particle: n, radius: r } = e, i = n.shapeData;
	t.moveTo(-r, 0), t.lineTo(r, 0), t.lineCap = i?.cap ?? "butt";
}
//#endregion
//#region node_modules/@tsparticles/shape-line/browser/LineDrawer.js
var Zc = 1, Qc = class {
	constructor() {
		this.validTypes = ["line"];
	}
	draw(e) {
		Xc(e);
	}
	getSidesCount() {
		return Zc;
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-line/browser/index.js
async function $c(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new Qc(), t);
}
//#endregion
//#region node_modules/@tsparticles/move-parallax/browser/ParallaxMover.js
var el = .5, tl = class {
	init() {}
	isEnabled(e) {
		return !Xt() && !e.destroyed && e.container.actualOptions.interactivity.events.onHover.parallax.enable;
	}
	move(e) {
		let t = e.container, n = t.actualOptions.interactivity.events.onHover.parallax;
		if (Xt() || !n.enable) return;
		let r = n.force, i = t.interactivity.mouse.position;
		if (!i) return;
		let a = t.canvas.size, o = {
			x: a.width * el,
			y: a.height * el
		}, s = n.smooth, c = e.getRadius() / r, l = {
			x: (i.x - o.x) * c,
			y: (i.y - o.y) * c
		}, { offset: u } = e;
		u.x += (l.x - u.x) / s, u.y += (l.y - u.y) / s;
	}
};
//#endregion
//#region node_modules/@tsparticles/move-parallax/browser/index.js
async function nl(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addMover("parallax", () => Promise.resolve(new tl()), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-attract/browser/Attractor.js
var rl = 1e3, il = 1, al = class extends qi {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {}
	interact(e) {
		let t = this.container;
		e.attractDistance === void 0 && (e.attractDistance = P(e.options.move.attract.distance) * t.retina.pixelRatio);
		let n = e.attractDistance, r = e.getPosition(), i = t.particles.quadTree.queryCircle(r, n);
		for (let t of i) {
			if (e === t || !t.options.move.attract.enable || t.destroyed || t.spawning) continue;
			let { dx: n, dy: i } = Nt(r, t.getPosition()), a = e.options.move.attract.rotate, o = n / (a.x * rl), s = i / (a.y * rl), c = t.size.value / e.size.value, l = il / c;
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
async function ol(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("particlesAttract", (e) => Promise.resolve(new al(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Absorb.js
var sl = .5, cl = 10, ll = 0;
function ul(e, t, n, r, i, a) {
	let o = Ot(e.options.collisions.absorb.speed * i.factor / cl, ll, r);
	e.size.value += o * sl, n.size.value -= o, r <= a && (n.size.value = 0, n.destroy());
}
function dl(e, t, n, r) {
	let i = e.getRadius(), a = t.getRadius();
	i === void 0 && a !== void 0 ? e.destroy() : i !== void 0 && a === void 0 ? t.destroy() : i !== void 0 && a !== void 0 && (i >= a ? ul(e, i, t, a, n, r) : ul(t, a, e, i, n, r));
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Bounce.js
var fl = (e) => {
	e.collisionMaxSpeed === void 0 && (e.collisionMaxSpeed = P(e.options.collisions.maxSpeed)), e.velocity.length > e.collisionMaxSpeed && (e.velocity.length = e.collisionMaxSpeed);
};
function pl(e, t) {
	hn(mn(e), mn(t)), fl(e), fl(t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Destroy.js
function ml(e, t) {
	!e.unbreakable && !t.unbreakable && pl(e, t), e.getRadius() === void 0 && t.getRadius() !== void 0 ? e.destroy() : e.getRadius() !== void 0 && t.getRadius() === void 0 ? t.destroy() : e.getRadius() !== void 0 && t.getRadius() !== void 0 && (e.getRadius() >= t.getRadius() ? t : e).destroy();
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/ResolveCollision.js
function hl(e, t, n, r) {
	switch (e.options.collisions.mode) {
		case Lr.absorb:
			dl(e, t, n, r);
			break;
		case Lr.bounce:
			pl(e, t);
			break;
		case Lr.destroy: ml(e, t);
	}
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/Collider.js
var gl = 2, _l = class extends qi {
	constructor(e) {
		super(e);
	}
	clear() {}
	init() {}
	interact(e, t) {
		if (e.destroyed || e.spawning) return;
		let n = this.container, r = e.getPosition(), i = e.getRadius(), a = n.particles.quadTree.queryCircle(r, i * gl);
		for (let o of a) {
			if (e === o || !o.options.collisions.enable || e.options.collisions.mode !== o.options.collisions.mode || o.destroyed || o.spawning) continue;
			let a = o.getPosition(), s = o.getRadius();
			Math.abs(Math.round(r.z) - Math.round(a.z)) > i + s || Pt(r, a) > i + s || hl(e, o, t, n.retina.pixelRatio);
		}
	}
	isEnabled(e) {
		return e.options.collisions.enable;
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-collisions/browser/index.js
async function vl(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addInteractor("particlesCollisions", (e) => Promise.resolve(new _l(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/CircleWarp.js
var yl = 2, bl = class extends Ai {
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
			let e = new Ai(r.x, r.y, n.radius * yl);
			return super.intersects(e);
		}
		if (t.size !== void 0) {
			let e = new ji(r.x, r.y, t.size.width * yl, t.size.height * yl);
			return super.intersects(e);
		}
		return !1;
	}
}, xl = class {
	constructor() {
		this.blur = 5, this.color = new fr(), this.color.value = "#000", this.enable = !1;
	}
	load(e) {
		N(e) || (e.blur !== void 0 && (this.blur = e.blur), this.color = fr.create(this.color, e.color), e.enable !== void 0 && (this.enable = e.enable));
	}
}, Sl = class {
	constructor() {
		this.enable = !1, this.frequency = 1;
	}
	load(e) {
		N(e) || (e.color !== void 0 && (this.color = fr.create(this.color, e.color)), e.enable !== void 0 && (this.enable = e.enable), e.frequency !== void 0 && (this.frequency = e.frequency), e.opacity !== void 0 && (this.opacity = e.opacity));
	}
}, Cl = class {
	constructor() {
		this.blink = !1, this.color = new fr(), this.color.value = "#fff", this.consent = !1, this.distance = 100, this.enable = !1, this.frequency = 1, this.opacity = 1, this.shadow = new xl(), this.triangles = new Sl(), this.width = 1, this.warp = !1;
	}
	load(e) {
		N(e) || (e.id !== void 0 && (this.id = e.id), e.blink !== void 0 && (this.blink = e.blink), this.color = fr.create(this.color, e.color), e.consent !== void 0 && (this.consent = e.consent), e.distance !== void 0 && (this.distance = e.distance), e.enable !== void 0 && (this.enable = e.enable), e.frequency !== void 0 && (this.frequency = e.frequency), e.opacity !== void 0 && (this.opacity = e.opacity), this.shadow.load(e.shadow), this.triangles.load(e.triangles), e.width !== void 0 && (this.width = e.width), e.warp !== void 0 && (this.warp = e.warp));
	}
}, wl = 2, Tl = 1, El = {
	x: 0,
	y: 0
}, Dl = 0;
function Ol(e, t, n, r, i) {
	let { dx: a, dy: o, distance: s } = Nt(e, t);
	if (!i || s <= n) return s;
	let c = {
		x: Math.abs(a),
		y: Math.abs(o)
	}, l = {
		x: Math.min(c.x, r.width - c.x),
		y: Math.min(c.y, r.height - c.y)
	};
	return Math.sqrt(l.x ** wl + l.y ** wl);
}
var kl = class extends qi {
	constructor(e, t) {
		super(e), this._setColor = (e) => {
			if (!e.options.links) return;
			let t = this._linkContainer, n = e.options.links, r = n.id === void 0 ? t.particles.linksColor : t.particles.linksColors.get(n.id);
			if (r) return;
			let i = n.color;
			r = Hn(this._engine, i, n.blink, n.consent), n.id === void 0 ? t.particles.linksColor = r : t.particles.linksColors.set(n.id, r);
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
		if (t.x < El.x || t.y < El.y || t.x > r.width || t.y > r.height) return;
		let i = e.options.links, a = i.opacity, o = e.retina.linksDistance ?? Dl, s = i.warp, c;
		c = s ? new bl(t.x, t.y, o, r) : new Ai(t.x, t.y, o);
		let l = n.particles.quadTree.query(c);
		for (let n of l) {
			let c = n.options.links;
			if (e === n || !c?.enable || i.id !== c.id || n.spawning || n.destroyed || !n.links || e.links.some((e) => e.destination === n) || n.links.some((t) => t.destination === e)) continue;
			let l = n.getPosition();
			if (l.x < El.x || l.y < El.y || l.x > r.width || l.y > r.height) continue;
			let u = Ol(t, l, o, r, s && c.warp);
			if (u > o) continue;
			let d = (Tl - u / o) * a;
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
		e.links ||= new Cl();
		for (let n of t) e.links.load(n?.links);
	}
	reset() {}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/interaction.js
async function Al(e, t = !0) {
	await e.addInteractor("particlesLinks", async (t) => Promise.resolve(new kl(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/Utils.js
function jl(e, t, n, r) {
	e.beginPath(), e.moveTo(t.x, t.y), e.lineTo(n.x, n.y), e.lineTo(r.x, r.y), e.closePath();
}
function Ml(e) {
	let t = !1, { begin: n, end: r, engine: i, maxDistance: a, context: o, canvasSize: s, width: c, backgroundMask: l, colorLine: u, opacity: d, links: f } = e;
	if (Pt(n, r) <= a) Jn(o, n, r), t = !0;
	else if (f.warp) {
		let e, i, c = Nt(n, {
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
			let t = Nt(n, {
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
				let t = Nt(n, {
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
		e && i && (Jn(o, n, e), Jn(o, r, i), t = !0);
	}
	if (!t) return;
	o.lineWidth = c, l.enable && (o.globalCompositeOperation = l.composite), o.strokeStyle = Rn(u, d);
	let { shadow: p } = f;
	if (p.enable) {
		let e = An(i, p.color);
		e && (o.shadowBlur = p.blur, o.shadowColor = Rn(e));
	}
	o.stroke();
}
function Nl(e) {
	let { context: t, pos1: n, pos2: r, pos3: i, backgroundMask: a, colorTriangle: o, opacityTriangle: s } = e;
	jl(t, n, r, i), a.enable && (t.globalCompositeOperation = a.composite), t.fillStyle = Rn(o, s), t.fill();
}
function Pl(e) {
	return e.sort((e, t) => e - t), e.join("_");
}
function Fl(e, t) {
	let n = Pl(e.map((e) => e.id)), r = t.get(n);
	return r === void 0 && (r = Tt(), t.set(n, r)), r;
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/LinkInstance.js
var Il = 0, Ll = 0, Rl = 0, zl = .5, Bl = 1, Vl = class {
	constructor(e, t) {
		this._drawLinkLine = (e, t) => {
			let n = e.options.links;
			if (!n?.enable) return;
			let r = this._container, i = r.actualOptions, a = t.destination, o = e.getPosition(), s = a.getPosition(), c = t.opacity;
			r.canvas.draw((t) => {
				let l, u = e.options.twinkle?.lines;
				if (u?.enable) {
					let e = u.frequency, t = An(this._engine, u.color);
					Tt() < e && t && (l = t, c = P(u.opacity));
				}
				if (!l) {
					let t = n.id === void 0 ? r.particles.linksColor : r.particles.linksColors.get(n.id);
					l = Vn(e, a, t);
				}
				if (!l) return;
				let d = e.retina.linksWidth ?? Ll, f = e.retina.linksDistance ?? Rl, { backgroundMask: p } = i;
				Ml({
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
			let a = this._container, o = a.actualOptions, s = t.destination, c = n.destination, l = i.opacity ?? (t.opacity + n.opacity) * zl;
			l <= Il || a.canvas.draw((t) => {
				let n = e.getPosition(), u = s.getPosition(), d = c.getPosition(), f = e.retina.linksDistance ?? Rl;
				if (Pt(n, u) > f || Pt(d, u) > f || Pt(d, n) > f) return;
				let p = An(this._engine, i.color);
				if (!p) {
					let t = r.id === void 0 ? a.particles.linksColor : a.particles.linksColors.get(r.id);
					p = Vn(e, s, t);
				}
				p && Nl({
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
		}, this._getLinkFrequency = (e, t) => Fl([e, t], this._freqs.links), this._getTriangleFrequency = (e, t, n) => Fl([
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
		let i = n.filter((e) => r.links && (r.links.frequency >= Bl || this._getLinkFrequency(t, e.destination) <= r.links.frequency));
		for (let e of i) this._drawTriangles(r, t, e, i), e.opacity > Il && (t.retina.linksWidth ?? Ll) > Ll && this._drawLinkLine(t, e);
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
}, Hl = class {
	constructor(e) {
		this.id = "links", this._engine = e;
	}
	getPlugin(e) {
		return Promise.resolve(new Vl(e, this._engine));
	}
	loadOptions() {}
	needsPlugin() {
		return !0;
	}
};
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/plugin.js
async function Ul(e, t = !0) {
	let n = new Hl(e);
	await e.addPlugin(n, t);
}
//#endregion
//#region node_modules/@tsparticles/interaction-particles-links/browser/index.js
async function Wl(e, t = !0) {
	e.checkVersion("3.9.1"), await Al(e, t), await Ul(e, t);
}
//#endregion
//#region node_modules/@tsparticles/shape-polygon/browser/Utils.js
var Gl = 180, Kl = {
	x: 0,
	y: 0
}, ql = 2;
function Jl(e, t, n) {
	let { context: r } = e, i = n.count.numerator * n.count.denominator, a = n.count.numerator / n.count.denominator, o = Gl * (a - ql) / a, s = Math.PI - Ft(o);
	if (r) {
		r.beginPath(), r.translate(t.x, t.y), r.moveTo(Kl.x, Kl.y);
		for (let e = 0; e < i; e++) r.lineTo(n.length, Kl.y), r.translate(n.length, Kl.y), r.rotate(s);
	}
}
//#endregion
//#region node_modules/@tsparticles/shape-polygon/browser/PolygonDrawerBase.js
var Yl = 5, Xl = class {
	draw(e) {
		let { particle: t, radius: n } = e;
		Jl(e, this.getCenter(t, n), this.getSidesData(t, n));
	}
	getSidesCount(e) {
		let t = e.shapeData;
		return Math.round(P(t?.sides ?? Yl));
	}
}, Zl = 3.5, Ql = 2.66, $l = 3, eu = class extends Xl {
	constructor() {
		super(...arguments), this.validTypes = ["polygon"];
	}
	getCenter(e, t) {
		return {
			x: -t / (e.sides / Zl),
			y: -t / (Ql / Zl)
		};
	}
	getSidesData(e, t) {
		let n = e.sides;
		return {
			count: {
				denominator: 1,
				numerator: n
			},
			length: t * Ql / (n / $l)
		};
	}
}, tu = 1.66, nu = 3, ru = 2, iu = class extends Xl {
	constructor() {
		super(...arguments), this.validTypes = ["triangle"];
	}
	getCenter(e, t) {
		return {
			x: -t,
			y: t / tu
		};
	}
	getSidesCount() {
		return nu;
	}
	getSidesData(e, t) {
		return {
			count: {
				denominator: 2,
				numerator: 3
			},
			length: t * ru
		};
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-polygon/browser/index.js
async function au(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new eu(), t);
}
async function ou(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new iu(), t);
}
async function su(e, t = !0) {
	e.checkVersion("3.9.1"), await au(e, t), await ou(e, t);
}
//#endregion
//#region node_modules/@tsparticles/updater-rotate/browser/Options/Classes/RotateAnimation.js
var H = class {
	constructor() {
		this.enable = !1, this.speed = 0, this.decay = 0, this.sync = !1;
	}
	load(e) {
		N(e) || (e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = F(e.speed)), e.decay !== void 0 && (this.decay = F(e.decay)), e.sync !== void 0 && (this.sync = e.sync));
	}
}, cu = class extends Br {
	constructor() {
		super(), this.animation = new H(), this.direction = Ji.clockwise, this.path = !1, this.value = 0;
	}
	load(e) {
		N(e) || (super.load(e), e.direction !== void 0 && (this.direction = e.direction), this.animation.load(e.animation), e.path !== void 0 && (this.path = e.path));
	}
}, lu = 2, uu = Math.PI * lu, du = 1, fu = 360, pu = class {
	constructor(e) {
		this.container = e;
	}
	init(e) {
		let t = e.options.rotate;
		if (!t) return;
		e.rotate = {
			enable: t.animation.enable,
			value: Ft(P(t.value)),
			min: 0,
			max: uu
		}, e.pathRotation = t.path;
		let n = t.direction;
		switch (n === Ji.random && (n = Math.floor(Tt() * lu) > 0 ? Ji.counterClockwise : Ji.clockwise), n) {
			case Ji.counterClockwise:
			case "counterClockwise":
				e.rotate.status = Ht.decreasing;
				break;
			case Ji.clockwise: e.rotate.status = Ht.increasing;
		}
		let r = t.animation;
		r.enable && (e.rotate.decay = du - P(r.decay), e.rotate.velocity = P(r.speed) / fu * this.container.retina.reduceFactor, r.sync || (e.rotate.velocity *= Tt())), e.rotation = e.rotate.value;
	}
	isEnabled(e) {
		let t = e.options.rotate;
		return t ? !e.destroyed && !e.spawning && (!!t.value || t.animation.enable || t.path) : !1;
	}
	loadOptions(e, ...t) {
		e.rotate ||= new cu();
		for (let n of t) e.rotate.load(n?.rotate);
	}
	update(e, t) {
		this.isEnabled(e) && (e.isRotating = !!e.rotate, e.rotate && (wn(e, e.rotate, !1, Ut.none, t), e.rotation = e.rotate.value));
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-rotate/browser/index.js
async function mu(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("rotate", (e) => Promise.resolve(new pu(e)), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-square/browser/Utils.js
var hu = Math.sqrt(2), gu = 2;
function _u(e) {
	let { context: t, radius: n } = e, r = n / hu, i = r * gu;
	t.rect(-r, -r, i, i);
}
//#endregion
//#region node_modules/@tsparticles/shape-square/browser/SquareDrawer.js
var vu = 4, yu = class {
	constructor() {
		this.validTypes = ["edge", "square"];
	}
	draw(e) {
		_u(e);
	}
	getSidesCount() {
		return vu;
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-square/browser/index.js
async function bu(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new yu(), t);
}
//#endregion
//#region node_modules/@tsparticles/shape-star/browser/Utils.js
var xu = 2, Su = {
	x: 0,
	y: 0
};
function Cu(e) {
	let { context: t, particle: n, radius: r } = e, i = n.sides, a = n.starInset ?? xu;
	t.moveTo(Su.x, Su.y - r);
	for (let e = 0; e < i; e++) t.rotate(Math.PI / i), t.lineTo(Su.x, Su.y - r * a), t.rotate(Math.PI / i), t.lineTo(Su.x, Su.y - r);
}
//#endregion
//#region node_modules/@tsparticles/shape-star/browser/StarDrawer.js
var wu = 2, Tu = 5, Eu = class {
	constructor() {
		this.validTypes = ["star"];
	}
	draw(e) {
		Cu(e);
	}
	getSidesCount(e) {
		let t = e.shapeData;
		return Math.round(P(t?.sides ?? Tu));
	}
	particleInit(e, t) {
		let n = t.shapeData;
		t.starInset = P(n?.inset ?? wu);
	}
};
//#endregion
//#region node_modules/@tsparticles/shape-star/browser/index.js
async function Du(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addShape(new Eu(), t);
}
//#endregion
//#region node_modules/@tsparticles/updater-stroke-color/browser/StrokeColorUpdater.js
var Ou = 1, ku = class {
	constructor(e, t) {
		this._container = e, this._engine = t;
	}
	init(e) {
		let t = this._container, n = e.options, r = vn(n.stroke, e.id, n.reduceDuplicates);
		e.strokeWidth = P(r.width) * t.retina.pixelRatio, e.strokeOpacity = P(r.opacity ?? Ou), e.strokeAnimation = r.color?.animation;
		let i = Mn(this._engine, r.color) ?? e.getFillColor();
		i && (e.strokeColor = Wn(i, e.strokeAnimation, t.retina.reduceFactor));
	}
	isEnabled(e) {
		let t = e.strokeAnimation, { strokeColor: n } = e;
		return !e.destroyed && !e.spawning && !!t && (n?.h.value !== void 0 && n.h.enable || n?.s.value !== void 0 && n.s.enable || n?.l.value !== void 0 && n.l.enable);
	}
	update(e, t) {
		this.isEnabled(e) && qn(e.strokeColor, t);
	}
};
//#endregion
//#region node_modules/@tsparticles/updater-stroke-color/browser/index.js
async function Au(e, t = !0) {
	e.checkVersion("3.9.1"), await e.addParticleUpdater("strokeColor", (t) => Promise.resolve(new ku(t, e)), t);
}
//#endregion
//#region node_modules/@tsparticles/slim/browser/index.js
async function ju(e, t = !0) {
	e.checkVersion("3.9.1"), await nl(e, !1), await To(e, !1), await zo(e, !1), await es(e, !1), await ps(e, !1), await Cs(e, !1), await Es(e, !1), await js(e, !1), await Fs(e, !1), await Ys(e, !1), await ec(e, !1), await ol(e, !1), await vl(e, !1), await Wl(e, !1), await lo(e, !1), await ho(e, !1), await Ic(e, !1), await $c(e, !1), await su(e, !1), await bu(e, !1), await Du(e, !1), await Yc(e, !1), await mu(e, !1), await Au(e, !1), await co(e, t);
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Mu(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Mu(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Nu() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Mu(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/tailwind-merge/dist/bundle-mjs.mjs
var Pu = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Fu = (e, t) => ({
	classGroupId: e,
	validator: t
}), Iu = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Lu = "-", Ru = [], zu = "arbitrary..", Bu = (e) => {
	let t = Uu(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return Hu(e);
			let n = e.split(Lu);
			return Vu(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Pu(i, t) : t : i || Ru;
			}
			return n[e] || Ru;
		}
	};
}, Vu = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Vu(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Lu) : e.slice(t).join(Lu), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, Hu = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? zu + r : void 0;
})(), Uu = (e) => {
	let { theme: t, classGroups: n } = e;
	return Wu(n, t);
}, Wu = (e, t) => {
	let n = Iu();
	for (let r in e) {
		let i = e[r];
		Gu(i, n, r, t);
	}
	return n;
}, Gu = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		Ku(i, t, n, r);
	}
}, Ku = (e, t, n, r) => {
	if (typeof e == "string") {
		qu(e, t, n);
		return;
	}
	if (typeof e == "function") {
		Ju(e, t, n, r);
		return;
	}
	Yu(e, t, n, r);
}, qu = (e, t, n) => {
	let r = e === "" ? t : Xu(t, e);
	r.classGroupId = n;
}, Ju = (e, t, n, r) => {
	if (Zu(e)) {
		Gu(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(Fu(n, e));
}, Yu = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		Gu(o, Xu(t, a), n, r);
	}
}, Xu = (e, t) => {
	let n = e, r = t.split(Lu), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Iu(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, Zu = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Qu = (e) => {
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
}, $u = "!", ed = ":", td = [], nd = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), U = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === ed) {
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
		s.endsWith($u) ? (c = s.slice(0, -1), l = !0) : s.startsWith($u) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return nd(t, l, c, u);
	};
	if (t) {
		let e = t + ed, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : nd(td, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, rd = (e) => {
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
}, W = (e) => ({
	cache: Qu(e.cacheSize),
	parseClassName: U(e),
	sortModifiers: rd(e),
	postfixLookupClassGroupIds: G(e),
	...Bu(e)
}), G = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, id = /\s+/, ad = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(id), l = "";
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
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + $u : _, y = v + g;
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
}, od = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = sd(n)) && (i && (i += " "), i += r);
	return i;
}, sd = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = sd(e[r])) && (n && (n += " "), n += t);
	return n;
}, cd = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = W(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = ad(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(od(...e));
}, ld = [], K = (e) => {
	let t = (t) => t[e] || ld;
	return t.isThemeGetter = !0, t.themeKey = e, t;
}, ud = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, dd = /^\((?:(\w[\w-]*):)?(.+)\)$/i, fd = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, pd = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, md = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, hd = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, gd = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, _d = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, vd = (e) => fd.test(e), q = (e) => !!e && !Number.isNaN(Number(e)), yd = (e) => !!e && Number.isInteger(Number(e)), bd = (e) => e.endsWith("%") && q(e.slice(0, -1)), xd = (e) => pd.test(e), Sd = () => !0, Cd = (e) => md.test(e) && !hd.test(e), wd = () => !1, Td = (e) => gd.test(e), Ed = (e) => _d.test(e), Dd = (e) => !J(e) && !Y(e), Od = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), kd = (e) => Wd(e, Jd, wd), J = (e) => ud.test(e), Ad = (e) => Wd(e, Yd, Cd), jd = (e) => Wd(e, Xd, q), Md = (e) => Wd(e, Qd, Sd), Nd = (e) => Wd(e, Zd, wd), Pd = (e) => Wd(e, Kd, wd), Fd = (e) => Wd(e, qd, Ed), Id = (e) => Wd(e, $d, Td), Y = (e) => dd.test(e), Ld = (e) => Gd(e, Yd), Rd = (e) => Gd(e, Zd), zd = (e) => Gd(e, Kd), Bd = (e) => Gd(e, Jd), Vd = (e) => Gd(e, qd), Hd = (e) => Gd(e, $d, !0), Ud = (e) => Gd(e, Qd, !0), Wd = (e, t, n) => {
	let r = ud.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, Gd = (e, t, n = !1) => {
	let r = dd.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, Kd = (e) => e === "position" || e === "percentage", qd = (e) => e === "image" || e === "url", Jd = (e) => e === "length" || e === "size" || e === "bg-size", Yd = (e) => e === "length", Xd = (e) => e === "number", Zd = (e) => e === "family-name", Qd = (e) => e === "number" || e === "weight", $d = (e) => e === "shadow", ef = /*#__PURE__*/ cd(() => {
	let e = K("color"), t = K("font"), n = K("text"), r = K("font-weight"), i = K("tracking"), a = K("leading"), o = K("breakpoint"), s = K("container"), c = K("spacing"), l = K("radius"), u = K("shadow"), d = K("inset-shadow"), f = K("text-shadow"), p = K("drop-shadow"), m = K("blur"), h = K("perspective"), g = K("aspect"), _ = K("ease"), v = K("animate"), y = () => [
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
	], x = () => [
		...b(),
		Y,
		J
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], ee = () => [
		"auto",
		"contain",
		"none"
	], C = () => [
		Y,
		J,
		c
	], w = () => [
		vd,
		"full",
		"auto",
		...C()
	], te = () => [
		yd,
		"none",
		"subgrid",
		Y,
		J
	], T = () => [
		"auto",
		{ span: [
			"full",
			yd,
			Y,
			J
		] },
		yd,
		Y,
		J
	], ne = () => [
		yd,
		"auto",
		Y,
		J
	], E = () => [
		"auto",
		"min",
		"max",
		"fr",
		Y,
		J
	], re = () => [
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
	], ie = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], ae = () => ["auto", ...C()], oe = () => [
		vd,
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
		...C()
	], se = () => [
		s,
		vd,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...C()
	], D = () => [
		vd,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...C()
	], O = () => [
		e,
		Y,
		J
	], ce = () => [
		...b(),
		zd,
		Pd,
		{ position: [Y, J] }
	], le = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], k = () => [
		"auto",
		"cover",
		"contain",
		Bd,
		kd,
		{ size: [Y, J] }
	], ue = () => [
		bd,
		Ld,
		Ad
	], A = () => [
		"",
		"none",
		"full",
		l,
		Y,
		J
	], de = () => [
		"",
		q,
		Ld,
		Ad
	], fe = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], pe = () => [
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
	], me = () => [
		q,
		bd,
		zd,
		Pd
	], he = () => [
		"",
		"none",
		m,
		Y,
		J
	], ge = () => [
		"none",
		q,
		Y,
		J
	], _e = () => [
		"none",
		q,
		Y,
		J
	], ve = () => [
		q,
		Y,
		J
	], ye = () => [
		vd,
		"full",
		...C()
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
			blur: [xd],
			breakpoint: [xd],
			color: [Sd],
			container: [xd],
			"drop-shadow": [xd],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Dd],
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
			"inset-shadow": [xd],
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
			radius: [xd],
			shadow: [xd],
			spacing: ["px", q],
			text: [xd],
			"text-shadow": [xd],
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
				vd,
				J,
				Y,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				Y,
				J
			] }],
			"container-named": [Od],
			columns: [{ columns: [
				q,
				"auto",
				J,
				Y,
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
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: ee() }],
			"overscroll-x": [{ "overscroll-x": ee() }],
			"overscroll-y": [{ "overscroll-y": ee() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: w() }],
			"inset-x": [{ "inset-x": w() }],
			"inset-y": [{ "inset-y": w() }],
			start: [{
				"inset-s": w(),
				start: w()
			}],
			end: [{
				"inset-e": w(),
				end: w()
			}],
			"inset-bs": [{ "inset-bs": w() }],
			"inset-be": [{ "inset-be": w() }],
			top: [{ top: w() }],
			right: [{ right: w() }],
			bottom: [{ bottom: w() }],
			left: [{ left: w() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				yd,
				"auto",
				Y,
				J
			] }],
			basis: [{ basis: [
				vd,
				"full",
				"auto",
				s,
				...C()
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
				q,
				vd,
				"auto",
				"initial",
				"none",
				J
			] }],
			grow: [{ grow: [
				"",
				q,
				Y,
				J
			] }],
			shrink: [{ shrink: [
				"",
				q,
				Y,
				J
			] }],
			order: [{ order: [
				yd,
				"first",
				"last",
				"none",
				Y,
				J
			] }],
			"grid-cols": [{ "grid-cols": te() }],
			"col-start-end": [{ col: T() }],
			"col-start": [{ "col-start": ne() }],
			"col-end": [{ "col-end": ne() }],
			"grid-rows": [{ "grid-rows": te() }],
			"row-start-end": [{ row: T() }],
			"row-start": [{ "row-start": ne() }],
			"row-end": [{ "row-end": ne() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": E() }],
			"auto-rows": [{ "auto-rows": E() }],
			gap: [{ gap: C() }],
			"gap-x": [{ "gap-x": C() }],
			"gap-y": [{ "gap-y": C() }],
			"justify-content": [{ justify: [...re(), "normal"] }],
			"justify-items": [{ "justify-items": [...ie(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...ie()] }],
			"align-content": [{ content: ["normal", ...re()] }],
			"align-items": [{ items: [...ie(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...ie(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": re() }],
			"place-items": [{ "place-items": [...ie(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...ie()] }],
			p: [{ p: C() }],
			px: [{ px: C() }],
			py: [{ py: C() }],
			ps: [{ ps: C() }],
			pe: [{ pe: C() }],
			pbs: [{ pbs: C() }],
			pbe: [{ pbe: C() }],
			pt: [{ pt: C() }],
			pr: [{ pr: C() }],
			pb: [{ pb: C() }],
			pl: [{ pl: C() }],
			m: [{ m: ae() }],
			mx: [{ mx: ae() }],
			my: [{ my: ae() }],
			ms: [{ ms: ae() }],
			me: [{ me: ae() }],
			mbs: [{ mbs: ae() }],
			mbe: [{ mbe: ae() }],
			mt: [{ mt: ae() }],
			mr: [{ mr: ae() }],
			mb: [{ mb: ae() }],
			ml: [{ ml: ae() }],
			"space-x": [{ "space-x": C() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": C() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: oe() }],
			"inline-size": [{ inline: ["auto", ...se()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...se()] }],
			"max-inline-size": [{ "max-inline": ["none", ...se()] }],
			"block-size": [{ block: ["auto", ...D()] }],
			"min-block-size": [{ "min-block": ["auto", ...D()] }],
			"max-block-size": [{ "max-block": ["none", ...D()] }],
			w: [{ w: [
				s,
				"screen",
				...oe()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...oe()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...oe()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...oe()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...oe()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				"none",
				...oe()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Ld,
				Ad
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Ud,
				Md
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
				bd,
				J
			] }],
			"font-family": [{ font: [
				Rd,
				Nd,
				t
			] }],
			"font-features": [{ "font-features": [J] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				Y,
				J
			] }],
			"line-clamp": [{ "line-clamp": [
				q,
				"none",
				Y,
				jd
			] }],
			leading: [{ leading: [
				"none",
				a,
				...C()
			] }],
			"list-image": [{ "list-image": [
				"none",
				Y,
				J
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				Y,
				J
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: O() }],
			"text-color": [{ text: O() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...fe(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				q,
				"from-font",
				"auto",
				Y,
				Ad
			] }],
			"text-decoration-color": [{ decoration: O() }],
			"underline-offset": [{ "underline-offset": [
				q,
				"auto",
				Y,
				J
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
			indent: [{ indent: C() }],
			"tab-size": [{ tab: [
				yd,
				Y,
				J
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
				Y,
				J
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
				Y,
				J
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
			"bg-position": [{ bg: ce() }],
			"bg-repeat": [{ bg: le() }],
			"bg-size": [{ bg: k() }],
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
						yd,
						Y,
						J
					],
					radial: [
						"",
						Y,
						J
					],
					conic: [
						"",
						yd,
						Y,
						J
					]
				},
				Vd,
				Fd
			] }],
			"bg-color": [{ bg: O() }],
			"gradient-from-pos": [{ from: ue() }],
			"gradient-via-pos": [{ via: ue() }],
			"gradient-to-pos": [{ to: ue() }],
			"gradient-from": [{ from: O() }],
			"gradient-via": [{ via: O() }],
			"gradient-to": [{ to: O() }],
			rounded: [{ rounded: A() }],
			"rounded-s": [{ "rounded-s": A() }],
			"rounded-e": [{ "rounded-e": A() }],
			"rounded-t": [{ "rounded-t": A() }],
			"rounded-r": [{ "rounded-r": A() }],
			"rounded-b": [{ "rounded-b": A() }],
			"rounded-l": [{ "rounded-l": A() }],
			"rounded-ss": [{ "rounded-ss": A() }],
			"rounded-se": [{ "rounded-se": A() }],
			"rounded-ee": [{ "rounded-ee": A() }],
			"rounded-es": [{ "rounded-es": A() }],
			"rounded-tl": [{ "rounded-tl": A() }],
			"rounded-tr": [{ "rounded-tr": A() }],
			"rounded-br": [{ "rounded-br": A() }],
			"rounded-bl": [{ "rounded-bl": A() }],
			"border-w": [{ border: de() }],
			"border-w-x": [{ "border-x": de() }],
			"border-w-y": [{ "border-y": de() }],
			"border-w-s": [{ "border-s": de() }],
			"border-w-e": [{ "border-e": de() }],
			"border-w-bs": [{ "border-bs": de() }],
			"border-w-be": [{ "border-be": de() }],
			"border-w-t": [{ "border-t": de() }],
			"border-w-r": [{ "border-r": de() }],
			"border-w-b": [{ "border-b": de() }],
			"border-w-l": [{ "border-l": de() }],
			"divide-x": [{ "divide-x": de() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": de() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...fe(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...fe(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: O() }],
			"border-color-x": [{ "border-x": O() }],
			"border-color-y": [{ "border-y": O() }],
			"border-color-s": [{ "border-s": O() }],
			"border-color-e": [{ "border-e": O() }],
			"border-color-bs": [{ "border-bs": O() }],
			"border-color-be": [{ "border-be": O() }],
			"border-color-t": [{ "border-t": O() }],
			"border-color-r": [{ "border-r": O() }],
			"border-color-b": [{ "border-b": O() }],
			"border-color-l": [{ "border-l": O() }],
			"divide-color": [{ divide: O() }],
			"outline-style": [{ outline: [
				...fe(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				q,
				Y,
				J
			] }],
			"outline-w": [{ outline: [
				"",
				q,
				Ld,
				Ad
			] }],
			"outline-color": [{ outline: O() }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				u,
				Hd,
				Id
			] }],
			"shadow-color": [{ shadow: O() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				Hd,
				Id
			] }],
			"inset-shadow-color": [{ "inset-shadow": O() }],
			"ring-w": [{ ring: de() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: O() }],
			"ring-offset-w": [{ "ring-offset": [q, Ad] }],
			"ring-offset-color": [{ "ring-offset": O() }],
			"inset-ring-w": [{ "inset-ring": de() }],
			"inset-ring-color": [{ "inset-ring": O() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				Hd,
				Id
			] }],
			"text-shadow-color": [{ "text-shadow": O() }],
			opacity: [{ opacity: [
				q,
				Y,
				J
			] }],
			"mix-blend": [{ "mix-blend": [
				...pe(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": pe() }],
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
			"mask-image-linear-pos": [{ "mask-linear": [q] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": me() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": me() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": O() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": O() }],
			"mask-image-t-from-pos": [{ "mask-t-from": me() }],
			"mask-image-t-to-pos": [{ "mask-t-to": me() }],
			"mask-image-t-from-color": [{ "mask-t-from": O() }],
			"mask-image-t-to-color": [{ "mask-t-to": O() }],
			"mask-image-r-from-pos": [{ "mask-r-from": me() }],
			"mask-image-r-to-pos": [{ "mask-r-to": me() }],
			"mask-image-r-from-color": [{ "mask-r-from": O() }],
			"mask-image-r-to-color": [{ "mask-r-to": O() }],
			"mask-image-b-from-pos": [{ "mask-b-from": me() }],
			"mask-image-b-to-pos": [{ "mask-b-to": me() }],
			"mask-image-b-from-color": [{ "mask-b-from": O() }],
			"mask-image-b-to-color": [{ "mask-b-to": O() }],
			"mask-image-l-from-pos": [{ "mask-l-from": me() }],
			"mask-image-l-to-pos": [{ "mask-l-to": me() }],
			"mask-image-l-from-color": [{ "mask-l-from": O() }],
			"mask-image-l-to-color": [{ "mask-l-to": O() }],
			"mask-image-x-from-pos": [{ "mask-x-from": me() }],
			"mask-image-x-to-pos": [{ "mask-x-to": me() }],
			"mask-image-x-from-color": [{ "mask-x-from": O() }],
			"mask-image-x-to-color": [{ "mask-x-to": O() }],
			"mask-image-y-from-pos": [{ "mask-y-from": me() }],
			"mask-image-y-to-pos": [{ "mask-y-to": me() }],
			"mask-image-y-from-color": [{ "mask-y-from": O() }],
			"mask-image-y-to-color": [{ "mask-y-to": O() }],
			"mask-image-radial": [{ "mask-radial": [Y, J] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": me() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": me() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": O() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": O() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [q] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": me() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": me() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": O() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": O() }],
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
			"mask-position": [{ mask: ce() }],
			"mask-repeat": [{ mask: le() }],
			"mask-size": [{ mask: k() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				Y,
				J
			] }],
			filter: [{ filter: [
				"",
				"none",
				Y,
				J
			] }],
			blur: [{ blur: he() }],
			brightness: [{ brightness: [
				q,
				Y,
				J
			] }],
			contrast: [{ contrast: [
				q,
				Y,
				J
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				Hd,
				Id
			] }],
			"drop-shadow-color": [{ "drop-shadow": O() }],
			grayscale: [{ grayscale: [
				"",
				q,
				Y,
				J
			] }],
			"hue-rotate": [{ "hue-rotate": [
				q,
				Y,
				J
			] }],
			invert: [{ invert: [
				"",
				q,
				Y,
				J
			] }],
			saturate: [{ saturate: [
				q,
				Y,
				J
			] }],
			sepia: [{ sepia: [
				"",
				q,
				Y,
				J
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				Y,
				J
			] }],
			"backdrop-blur": [{ "backdrop-blur": he() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				q,
				Y,
				J
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				q,
				Y,
				J
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				q,
				Y,
				J
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				q,
				Y,
				J
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				q,
				Y,
				J
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				q,
				Y,
				J
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				q,
				Y,
				J
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				q,
				Y,
				J
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": C() }],
			"border-spacing-x": [{ "border-spacing-x": C() }],
			"border-spacing-y": [{ "border-spacing-y": C() }],
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
				Y,
				J
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				q,
				"initial",
				Y,
				J
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				Y,
				J
			] }],
			delay: [{ delay: [
				q,
				Y,
				J
			] }],
			animate: [{ animate: [
				"none",
				v,
				Y,
				J
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				Y,
				J
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: ge() }],
			"rotate-x": [{ "rotate-x": ge() }],
			"rotate-y": [{ "rotate-y": ge() }],
			"rotate-z": [{ "rotate-z": ge() }],
			scale: [{ scale: _e() }],
			"scale-x": [{ "scale-x": _e() }],
			"scale-y": [{ "scale-y": _e() }],
			"scale-z": [{ "scale-z": _e() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ve() }],
			"skew-x": [{ "skew-x": ve() }],
			"skew-y": [{ "skew-y": ve() }],
			transform: [{ transform: [
				Y,
				J,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: ye() }],
			"translate-x": [{ "translate-x": ye() }],
			"translate-y": [{ "translate-y": ye() }],
			"translate-z": [{ "translate-z": ye() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				yd,
				Y,
				J
			] }],
			accent: [{ accent: O() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: O() }],
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
				Y,
				J
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
			"scrollbar-thumb-color": [{ "scrollbar-thumb": O() }],
			"scrollbar-track-color": [{ "scrollbar-track": O() }],
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
			"scroll-m": [{ "scroll-m": C() }],
			"scroll-mx": [{ "scroll-mx": C() }],
			"scroll-my": [{ "scroll-my": C() }],
			"scroll-ms": [{ "scroll-ms": C() }],
			"scroll-me": [{ "scroll-me": C() }],
			"scroll-mbs": [{ "scroll-mbs": C() }],
			"scroll-mbe": [{ "scroll-mbe": C() }],
			"scroll-mt": [{ "scroll-mt": C() }],
			"scroll-mr": [{ "scroll-mr": C() }],
			"scroll-mb": [{ "scroll-mb": C() }],
			"scroll-ml": [{ "scroll-ml": C() }],
			"scroll-p": [{ "scroll-p": C() }],
			"scroll-px": [{ "scroll-px": C() }],
			"scroll-py": [{ "scroll-py": C() }],
			"scroll-ps": [{ "scroll-ps": C() }],
			"scroll-pe": [{ "scroll-pe": C() }],
			"scroll-pbs": [{ "scroll-pbs": C() }],
			"scroll-pbe": [{ "scroll-pbe": C() }],
			"scroll-pt": [{ "scroll-pt": C() }],
			"scroll-pr": [{ "scroll-pr": C() }],
			"scroll-pb": [{ "scroll-pb": C() }],
			"scroll-pl": [{ "scroll-pl": C() }],
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
				Y,
				J
			] }],
			fill: [{ fill: ["none", ...O()] }],
			"stroke-w": [{ stroke: [
				q,
				Ld,
				Ad,
				jd
			] }],
			stroke: [{ stroke: ["none", ...O()] }],
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
function tf(...e) {
	return ef(Nu(e));
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var nf = (0, b.createContext)({});
//#endregion
//#region node_modules/framer-motion/dist/es/utils/use-constant.mjs
function rf(e) {
	let t = (0, b.useRef)(null);
	return t.current === null && (t.current = e()), t.current;
}
//#endregion
//#region node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var af = typeof window < "u" ? b.useLayoutEffect : b.useEffect, of = /* @__PURE__ */ (0, b.createContext)(null);
//#endregion
//#region node_modules/motion-utils/dist/es/array.mjs
function sf(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function cf(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
//#endregion
//#region node_modules/motion-utils/dist/es/clamp.mjs
var lf = (e, t, n) => n > t ? t : n < e ? e : n, uf = {}, df = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), ff = (e) => typeof e == "object" && !!e, pf = (e) => /^0[^.\s]+$/u.test(e);
//#endregion
//#region node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function mf(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
//#endregion
//#region node_modules/motion-utils/dist/es/noop.mjs
var X = /* @__NO_SIDE_EFFECTS__ */ (e) => e, hf = (...e) => e.reduce((e, t) => (n) => t(e(n))), gf = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, _f = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return sf(this.subscriptions, e), () => this.remove(e);
	}
	remove(e) {
		cf(this.subscriptions, e);
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
}, vf = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, yf = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, bf = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, xf = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e, Sf = 1e-7, Cf = 12;
function wf(e, t, n, r, i) {
	let a, o, s = 0;
	do
		o = t + (n - t) / 2, a = xf(o, r, i) - e, a > 0 ? n = o : t = o;
	while (Math.abs(a) > Sf && ++s < Cf);
	return o;
}
/*#__NO_SIDE_EFFECTS__*/
function Tf(e, t, n, r) {
	if (e === t && n === r) return X;
	let i = (t) => wf(t, 0, 1, e, n);
	return (e) => e === 0 || e === 1 ? e : xf(i(e), t, r);
}
//#endregion
//#region node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var Ef = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Df = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), Of = /*@__PURE__*/ Tf(.33, 1.53, .69, .99), kf = /*@__PURE__*/ Df(Of), Af = /*@__PURE__*/ Ef(kf), jf = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * kf(e) : .5 * (2 - 2 ** (-10 * (e - 1))), Mf = (e) => 1 - Math.sin(Math.acos(e)), Nf = /* @__PURE__ */ Df(Mf), Pf = /* @__PURE__ */ Ef(Mf), Ff = /*@__PURE__*/ Tf(.42, 0, 1, 1), If = /*@__PURE__*/ Tf(0, 0, .58, 1), Lf = /*@__PURE__*/ Tf(.42, 0, .58, 1), Rf = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", zf = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", Bf = {
	linear: X,
	easeIn: Ff,
	easeInOut: Lf,
	easeOut: If,
	circIn: Mf,
	circInOut: Pf,
	circOut: Nf,
	backIn: kf,
	backInOut: Af,
	backOut: Of,
	anticipate: jf
}, Vf = (e) => typeof e == "string", Hf = (e) => {
	if (/* @__PURE__ */ zf(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ Tf(t, n, r, i);
	}
	return Vf(e) ? (Bf[e], `${e}`, Bf[e]) : e;
}, Z = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, Uf;
function Wf() {
	Uf = void 0;
}
var Gf = {
	now: () => (Uf === void 0 && Gf.set(Z.isProcessing || uf.useManualTiming ? Z.timestamp : performance.now()), Uf),
	set: (e) => {
		Uf = e, queueMicrotask(Wf);
	}
}, Kf = (e) => Math.round(e * 1e5) / 1e5, qf = (e) => (t) => typeof t == "string" && t.startsWith(e), Jf = /*@__PURE__*/ qf("--"), Yf = /*@__PURE__*/ qf("var(--"), Xf = (e) => Yf(e) ? Zf.test(e.split("/*")[0].trim()) : !1, Zf = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Qf(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var $f = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, ep = {
	...$f,
	transform: (e) => lf(0, 1, e)
}, tp = {
	...$f,
	default: 1
}, Q = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function np(e) {
	return e == null;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var rp = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, ip = (e, t) => (n) => !!(typeof n == "string" && rp.test(n) && n.startsWith(e) || t && !np(n) && Object.prototype.hasOwnProperty.call(n, t)), ap = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(Q);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, op = (e) => lf(0, 255, e), sp = {
	...$f,
	transform: (e) => Math.round(op(e))
}, cp = {
	test: /*@__PURE__*/ ip("rgb", "red"),
	parse: /*@__PURE__*/ ap("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + sp.transform(e) + ", " + sp.transform(t) + ", " + sp.transform(n) + ", " + Kf(ep.transform(r)) + ")"
};
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function lp(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var up = {
	test: /*@__PURE__*/ ip("#"),
	parse: lp,
	transform: cp.transform
}, dp = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), fp = /*@__PURE__*/ dp("deg"), pp = /*@__PURE__*/ dp("%"), $ = /*@__PURE__*/ dp("px"), mp = /*@__PURE__*/ dp("vh"), hp = /*@__PURE__*/ dp("vw"), gp = {
	...pp,
	parse: (e) => pp.parse(e) / 100,
	transform: (e) => pp.transform(e * 100)
}, _p = {
	test: /*@__PURE__*/ ip("hsl", "hue"),
	parse: /*@__PURE__*/ ap("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + pp.transform(Kf(t)) + ", " + pp.transform(Kf(n)) + ", " + Kf(ep.transform(r)) + ")"
}, vp = {
	test: (e) => cp.test(e) || up.test(e) || _p.test(e),
	parse: (e) => cp.test(e) ? cp.parse(e) : _p.test(e) ? _p.parse(e) : up.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? cp.transform(e) : _p.transform(e),
	getAnimatableNone: (e) => {
		let t = vp.parse(e);
		return t.alpha = 0, vp.transform(t);
	}
}, yp = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, bp = /*@__PURE__*/ new RegExp(Q.source), xp = /*@__PURE__*/ new RegExp(yp.source, "i");
function Sp(e) {
	return isNaN(e) && typeof e == "string" && (bp.test(e) || xp.test(e));
}
var Cp = "number", wp = "color", Tp = "var", Ep = "var(", Dp = "${}", Op = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function kp(e) {
	let t = e.toString();
	return bp.test(t) || xp.test(t);
}
function Ap(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(Op, (e) => (vp.test(e) ? (r.color.push(a), i.push(wp), n.push(vp.parse(e))) : e.startsWith(Ep) ? (r.var.push(a), i.push(Tp), n.push(e)) : (r.number.push(a), i.push(Cp), n.push(parseFloat(e))), ++a, Dp)).split(Dp),
		indexes: r,
		types: i
	};
}
function jp(e) {
	return Ap(e).values;
}
function Mp({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === Cp ? Kf(r[a]) : e === wp ? vp.transform(r[a]) : r[a];
		}
		return i;
	};
}
function Np(e) {
	return Mp(Ap(e));
}
var Pp = (e) => typeof e == "number" ? 0 : vp.test(e) ? vp.getAnimatableNone(e) : e, Fp = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : Pp(e);
function Ip(e) {
	let t = Ap(e);
	return Mp(t)(t.values.map((e, n) => Fp(e, t.split[n])));
}
var Lp = {
	test: Sp,
	parse: jp,
	createTransformer: Np,
	getAnimatableNone: Ip
};
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function Rp(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function zp({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = Rp(s, r, e + 1 / 3), a = Rp(s, r, e), o = Rp(s, r, e - 1 / 3);
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
function Bp(e, t) {
	return (n) => n > 0 ? t : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/number.mjs
var Vp = (e, t, n) => e + (t - e) * n, Hp = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, Up = [
	up,
	cp,
	_p
], Wp = (e) => Up.find((t) => t.test(e));
function Gp(e) {
	let t = Wp(e);
	if (!t) return `${e}`, !1;
	let n = t.parse(e);
	return t === _p && (n = zp(n)), n;
}
var Kp = (e, t) => {
	let n = Gp(e), r = Gp(t);
	if (!n || !r) return Bp(e, t);
	let i = { ...n };
	return (e) => (i.red = Hp(n.red, r.red, e), i.green = Hp(n.green, r.green, e), i.blue = Hp(n.blue, r.blue, e), i.alpha = Vp(n.alpha, r.alpha, e), cp.transform(i));
}, qp = /* @__PURE__ */ new Set(["none", "hidden"]);
function Jp(e, t) {
	return qp.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function Yp(e, t) {
	return (n) => Vp(e, t, n);
}
function Xp(e) {
	return typeof e == "number" ? Yp : typeof e == "string" ? Xf(e) ? Bp : vp.test(e) ? Kp : em : Array.isArray(e) ? Zp : typeof e == "object" ? vp.test(e) ? Kp : Qp : Bp;
}
function Zp(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => Xp(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function Qp(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = Xp(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function $p(e, t) {
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
var em = (e, t) => {
	let n = Lp.createTransformer(t), r = Ap(e), i = Ap(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? qp.has(e) && !i.values.length || qp.has(t) && !r.values.length ? Jp(e, t) : hf(Zp($p(r, i), i.values), n) : (`${e}${t}`, Bp(e, t));
}, tm = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function nm(e, t) {
	let n = tm.exec(e);
	if (!n) return;
	let r = tm.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => Kf(Vp(a, o, e)) + i;
}
function rm(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return Vp(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = nm(e, t);
		if (n) return n;
	}
	return Xp(e)(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/order.mjs
var im = [
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
function am(e) {
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
var om = 40;
function sm(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = im.reduce((e, t) => (e[t] = am(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = uf.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, om), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: im.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < im.length; t++) o[im[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: cm, cancel: lm, steps: um } = /* @__PURE__ */ sm(typeof requestAnimationFrame < "u" ? requestAnimationFrame : X, !0, Z), dm = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => cm.update(t, e),
		stop: () => lm(t),
		now: () => Z.isProcessing ? Z.timestamp : Gf.now()
	};
}, fm = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, pm = 2e4;
function mm(e, t = 50, n = pm, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function hm(e, t = 100, n) {
	let r = n({
		...e,
		keyframes: [0, t]
	}), i = Math.min(mm(r), pm);
	return {
		type: "keyframes",
		ease: (e) => r.next(i * e).value / t,
		duration: /* @__PURE__ */ yf(i)
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var gm = {
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
}, _m = (e) => e < 0 ? 1 / Math.max(1 + e, gm.minDamping) : Math.max(1 - e, gm.minDamping);
function vm(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return xm((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function ym(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var bm = 12;
function xm(e, t, n) {
	let r = n;
	for (let n = 1; n < bm; n++) r -= e(r) / t(r);
	return r;
}
var Sm = .001;
function Cm({ duration: e = gm.duration, bounce: t = gm.bounce }) {
	let n, r;
	gm.maxDuration;
	let i = _m(t);
	e = lf(gm.minDuration, gm.maxDuration, /* @__PURE__ */ yf(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = ym(t, i), o = Math.exp(-r);
		return Sm - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = ym(t * t, i);
		return (-n(t) + Sm > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = xm(n, r, a), s = o * vm(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ vf(e)
	};
}
var wm = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function Tm(e, t) {
	if (wm(e, t)) return e;
}
function Em(e) {
	let t = Tm(e.stiffness), n = Tm(e.damping, !0), r = Tm(e.mass), i = {
		...e,
		stiffness: t ?? gm.stiffness,
		damping: n ?? gm.damping,
		mass: r ?? gm.mass,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = _m(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * vm(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, Cm(i)), i.isResolvedFromDuration = !0;
		(!wm(i.stiffness) || !wm(i.damping, !0)) && (i.stiffness = gm.stiffness, i.damping = gm.damping);
	}
	return i;
}
function Dm(e = gm.visualDuration, t = gm.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = Em({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ yf(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ yf(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? gm.restSpeed.granular : gm.restSpeed.default), g.restDelta = n.restDelta || (e ? gm.restDelta.granular : gm.restDelta.default);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = ym(m, p), t = {
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
	let x = u && l || null, S = {
		calculatedDuration: x,
		retarget: (e, t) => {
			g.target = e[e.length - 1], g.delta = g.target - e[0], g.velocity = f(t), n.restSpeed && n.restDelta || _(), S.calculatedDuration = x, a.done = !1, b();
		},
		velocity: (e) => /* @__PURE__ */ vf(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ vf(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(mm(S), pm), t = fm((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return S;
}
Dm.applyToOptions = (e) => {
	let t = hm(e, 100, Dm);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ vf(t.duration), e.type = "keyframes", e;
};
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function Om({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : _ + t;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = Dm({
			keyframes: [f.value, m(f.value)],
			velocity: -v(e) / r * 1e3,
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return S(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !x && b === void 0 && (t = !0, y(e), S(e)), b !== void 0 && e >= b ? x.next(e - b) : (!t && y(e), f);
		}
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/interpolate.mjs
function km(e, t, n) {
	let r = [], i = n || uf.mix || rm, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = hf(Array.isArray(t) ? t[n] || X : t, a)), r.push(a);
	}
	return r;
}
function Am(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = km(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ gf(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(lf(e[0], e[a - 1], t)) : l;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function jm(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ gf(0, t, r);
		e.push(Vp(n, 1, i));
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function Mm(e) {
	let t = [0];
	return jm(t, e.length - 1), t;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function Nm(e, t) {
	return e.map((e) => e * t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function Pm(e, t) {
	return e.map(() => t || Lf).splice(0, e.length - 1);
}
function Fm({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ Rf(r) ? r.map(Hf) : Hf(r) || Lf, a = {
		done: !1,
		value: t[0]
	};
	if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
		let [n, r] = t, o = n === r ? void 0 : (uf.mix || rm)(n, r);
		return {
			calculatedDuration: e,
			next: (t) => (a.value = o ? o(i(e > 0 ? lf(0, 1, t / e) : 1)) : r, a.done = t >= e, a)
		};
	}
	let o = Am(Nm(n && n.length === t.length ? n : Mm(t), e), t, { ease: Array.isArray(i) ? i : Pm(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var Im = 5;
function Lm(e, t, n) {
	let r = Math.max(t - Im, 0);
	return /* @__PURE__ */ bf(n - e(r), t - r);
}
function Rm(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : Lm((t) => e.next(t).value, t, e.next(t).value);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var zm = (e) => e !== null;
function Bm(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(zm), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var Vm = {
	decay: Om,
	inertia: Om,
	tween: Fm,
	keyframes: Fm,
	spring: Dm
};
function Hm(e) {
	typeof e.type == "string" && (e.type = Vm[e.type]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function Um(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: Gf.now(),
		frameTimestamp: Z.timestamp,
		frameIsProcessing: Z.isProcessing
	};
}
function Wm(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...Um("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function Gm(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			...Um("layout-animation-start", e),
			node: t
		});
	} catch {}
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var Km = class {
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
}, qm = (e) => e / 100, Jm = class extends Km {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== Gf.now() && this.tick(Gf.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), Wm(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		Hm(e);
		let { type: t = Fm, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || Fm;
		s !== Fm && typeof o[0] != "number" && (this.mixKeyframes = hf(qm, rm(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = mm(c));
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
			!n && e >= 1 && (n = 1), n === 1 && t--, t = Math.min(t, u + 1), t % 2 && (d === "reverse" ? (n = 1 - n, f && (n -= f / o)) : d === "mirror" && (y = a)), v = lf(0, 1, n) * o;
		}
		let b;
		_ ? (this.delayState.value = l[0], b = this.delayState) : b = y.next(v), i && !_ && (b.value = i(b.value));
		let { done: x } = b;
		!_ && s !== null && (x = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let S = this.holdTime === null && (this.state === "finished" || this.state === "running" && x);
		return S && p !== Om && (b.value = Bm(l, this.options, h, this.speed)), m && m(b.value), S && this.finish(), b;
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
	get duration() {
		return /* @__PURE__ */ yf(this.calculatedDuration);
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ yf(e);
	}
	get time() {
		return /* @__PURE__ */ yf(this.currentTime);
	}
	set time(e) {
		e = /* @__PURE__ */ vf(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return Rm(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(Gf.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ yf(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = dm, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? n : this.startTime = n - this.holdTime, this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(Gf.now()), this.holdTime = this.currentTime;
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
}, Ym = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function Xm(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(Q) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!Ym.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Zm = /\b([a-z-]*)\(.*?\)/gu, Qm = {
	...Lp,
	getAnimatableNone: (e) => {
		let t = e.match(Zm);
		return t ? t.map(Xm).join(" ") : e;
	}
}, $m = {
	...Lp,
	getAnimatableNone: (e) => {
		let t = Lp.parse(e);
		return Lp.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, eh = {
	...$f,
	transform: Math.round
}, th = {
	borderWidth: $,
	borderTopWidth: $,
	borderRightWidth: $,
	borderBottomWidth: $,
	borderLeftWidth: $,
	borderRadius: $,
	borderTopLeftRadius: $,
	borderTopRightRadius: $,
	borderBottomRightRadius: $,
	borderBottomLeftRadius: $,
	width: $,
	maxWidth: $,
	height: $,
	maxHeight: $,
	top: $,
	right: $,
	bottom: $,
	left: $,
	inset: $,
	insetBlock: $,
	insetBlockStart: $,
	insetBlockEnd: $,
	insetInline: $,
	insetInlineStart: $,
	insetInlineEnd: $,
	padding: $,
	paddingTop: $,
	paddingRight: $,
	paddingBottom: $,
	paddingLeft: $,
	paddingBlock: $,
	paddingBlockStart: $,
	paddingBlockEnd: $,
	paddingInline: $,
	paddingInlineStart: $,
	paddingInlineEnd: $,
	margin: $,
	marginTop: $,
	marginRight: $,
	marginBottom: $,
	marginLeft: $,
	marginBlock: $,
	marginBlockStart: $,
	marginBlockEnd: $,
	marginInline: $,
	marginInlineStart: $,
	marginInlineEnd: $,
	fontSize: $,
	backgroundPositionX: $,
	backgroundPositionY: $,
	rotate: fp,
	pathRotation: fp,
	rotateX: fp,
	rotateY: fp,
	rotateZ: fp,
	scale: tp,
	scaleX: tp,
	scaleY: tp,
	scaleZ: tp,
	skew: fp,
	skewX: fp,
	skewY: fp,
	distance: $,
	translateX: $,
	translateY: $,
	translateZ: $,
	x: $,
	y: $,
	z: $,
	perspective: $,
	transformPerspective: $,
	opacity: ep,
	originX: gp,
	originY: gp,
	originZ: $,
	zIndex: eh,
	fillOpacity: ep,
	strokeOpacity: ep,
	numOctaves: eh
}, nh = {
	...th,
	color: vp,
	backgroundColor: vp,
	outlineColor: vp,
	fill: vp,
	stroke: vp,
	borderColor: vp,
	borderTopColor: vp,
	borderRightColor: vp,
	borderBottomColor: vp,
	borderLeftColor: vp,
	filter: Qm,
	WebkitFilter: Qm,
	mask: $m,
	WebkitMask: $m
}, rh = (e) => nh[e], ih = /*@__PURE__*/ new Set([Qm, $m]);
function ah(e, t) {
	let n = rh(e);
	return ih.has(n) || (n = Lp), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function oh(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var sh = (e) => e * 180 / Math.PI, ch = (e) => uh(sh(Math.atan2(e[1], e[0]))), lh = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: ch,
	rotateZ: ch,
	skewX: (e) => sh(Math.atan(e[1])),
	skewY: (e) => sh(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, uh = (e) => (e %= 360, e < 0 && (e += 360), e), dh = ch, fh = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), ph = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), mh = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: fh,
	scaleY: ph,
	scale: (e) => (fh(e) + ph(e)) / 2,
	rotateX: (e) => uh(sh(Math.atan2(e[6], e[5]))),
	rotateY: (e) => uh(sh(Math.atan2(-e[2], e[0]))),
	rotateZ: dh,
	rotate: dh,
	skewX: (e) => sh(Math.atan(e[4])),
	skewY: (e) => sh(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function hh(e) {
	return +!!e.includes("scale");
}
function gh(e, t) {
	if (!e || e === "none") return hh(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = mh, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = lh, i = t;
	}
	if (!i) return hh(t);
	let a = r[t], o = i[1].split(",").map(vh);
	return typeof a == "function" ? a(o) : o[a];
}
var _h = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return gh(n, t);
};
function vh(e) {
	return parseFloat(e.trim());
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var yh = [
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
], bh = /* @__PURE__ */ new Set([...yh, "pathRotation"]), xh = (e) => e === $f || e === $, Sh = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), Ch = yh.filter((e) => !Sh.has(e));
function wh(e) {
	let t = [];
	return Ch.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var Th = /* @__PURE__ */ new Set(["bottom", "right"]);
function Eh(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var Dh = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => Eh(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => Eh(e, i, "y", t, n, r),
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
	x: ({ transform: e }) => gh(e, "x"),
	y: ({ transform: e }) => gh(e, "y")
};
Dh.translateX = Dh.x, Dh.translateY = Dh.y;
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
var Oh = /* @__PURE__ */ new Set(), kh = !1, Ah = !1, jh = !1;
function Mh() {
	if (Ah) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		Oh.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), Th.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = wh(e);
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
	Ah = !1, kh = !1, Oh.forEach((e) => e.complete(jh)), Oh.clear();
}
function Nh() {
	Oh.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (Ah = !0);
	});
}
function Ph() {
	jh = !0, Nh(), Mh(), jh = !1;
}
function Fh(e, t, n) {
	if (typeof e == "string") {
		if (df(e) || pf(e)) return parseFloat(e);
		if (!Lp.test(e) && Lp.test(n)) return ah(t, n);
	}
	return e ?? void 0;
}
var Ih = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (Oh.add(this), kh || (kh = !0, cm.read(Nh), cm.resolveKeyframes(Mh))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = Fh(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		oh(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), Oh.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (Oh.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, Lh = (e) => e.startsWith("--");
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function Rh(e, t, n) {
	Lh(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var zh = {};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function Bh(e, t) {
	let n = /* @__PURE__ */ mf(e);
	return () => zh[t] ?? n();
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var Vh = /* @__PURE__ */ Bh(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Hh = /*@__PURE__*/ Bh(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), Uh = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Wh = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ Uh([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ Uh([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ Uh([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ Uh([
		.33,
		1.53,
		.69,
		.99
	])
};
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Gh(e, t) {
	if (e) return typeof e == "function" ? Hh() ? fm(e, t) : "ease-out" : /* @__PURE__ */ zf(e) ? Uh(e) : Array.isArray(e) ? e.map((e) => Gh(e, t) || Wh.easeOut) : Wh[e];
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Kh(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Gh(s, i);
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
function qh(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function Jh({ type: e, ...t }) {
	return qh(e) && Hh() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Yh = class extends Km {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = Jh(e);
		this.animation = Kh(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = Bm(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), Rh(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, Wm(this, e, c);
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
		return /* @__PURE__ */ yf(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ yf(e);
	}
	get time() {
		return /* @__PURE__ */ yf(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ vf(e), t && this.animation.pause();
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
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && Vh() ? (this.animation.timeline = e, t?.(this.animation), X) : n(this);
	}
}, Xh = {
	anticipate: jf,
	backInOut: Af,
	circInOut: Pf
};
function Zh(e) {
	return e in Xh;
}
function Qh(e) {
	typeof e.ease == "string" && Zh(e.ease) && (e.ease = Xh[e.ease]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
var $h = 10, eg = class extends Yh {
	constructor(e) {
		Qh(e), Hm(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	updateMotionValue(e) {
		let { motionValue: t, onUpdate: n, onComplete: r, element: i, ...a } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let o = new Jm({
			...a,
			autoplay: !1
		}), s = Math.max($h, Gf.now() - this.startTime), c = lf(0, $h, s - $h), l = o.sample(s).value, { name: u } = this.options;
		i && u && Rh(i, u, l), t.setWithVelocity(o.sample(Math.max(0, s - c)).value, l, c), o.stop();
	}
}, tg = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (Lp.test(e) || e === "0") && !e.startsWith("url("));
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function ng(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function rg(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = tg(i, t), s = tg(a, t);
	return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1) : ng(e) || (n === "spring" || qh(n)) && r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function ig(e) {
	e.duration = 0, e.type = "keyframes";
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var ag = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), og = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function sg(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && og.test(e[t])) return !0;
	return !1;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var cg = /* @__PURE__ */ new Set([
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
]), lg = /*@__PURE__*/ mf(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function ug(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(ag.has(n) || cg.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return lg() && (ag.has(n) || cg.has(n) && sg(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var dg = 40, fg = class extends Km {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = Gf.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || Ih;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = Gf.now();
		let u = !0;
		rg(e, i, a, o) || (u = !1, (uf.instantAnimations || !s) && l?.(Bm(e, n, t)), e[0] = e[e.length - 1], ig(n), n.repeat = 0);
		let d = r ? this.resolvedAt && this.resolvedAt - this.createdAt > dg ? this.resolvedAt : this.createdAt : void 0, { onComplete: f } = n;
		n.startTime ??= d, n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			f?.(), this.notifyFinished();
		};
		let p = u && !c && ug(n), m;
		if (p) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new eg(n);
			} catch {
				m = new Jm(n);
			}
		} else m = new Jm(n);
		this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), Ph()), this._animation;
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
function pg(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/index.mjs
var mg = 30, hg = (e) => !isNaN(parseFloat(e)), gg = { current: void 0 }, _g = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = Gf.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.notifyChange(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = Gf.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = hg(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new _f())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new _f(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		cm.read(() => {
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
		return gg.current && gg.current.push(this), this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = Gf.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > mg) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, mg);
		return /* @__PURE__ */ bf(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
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
function vg(e, t) {
	return new _g(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function yg(e, t) {
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
function bg(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : yg(n, e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var xg = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, Sg = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), Cg = {
	type: "keyframes",
	duration: .8
}, wg = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, Tg = (e, { keyframes: t }) => t.length > 2 ? Cg : bh.has(e) ? e.startsWith("scale") ? Sg(t[1]) : xg : wg, Eg = /* @__PURE__ */ new Set([
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
function Dg(e) {
	for (let t in e) if (!Eg.has(t)) return !0;
	return !1;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var Og = (e, t, n, r = {}, i, a) => (o) => {
	let s = bg(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ vf(c);
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
	Dg(s) || Object.assign(u, Tg(e, u)), u.duration &&= /* @__PURE__ */ vf(u.duration), u.repeatDelay &&= /* @__PURE__ */ vf(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (ig(u), u.delay === 0 && (d = !0)), (uf.instantAnimations || uf.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, ig(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = Bm(u.keyframes, s);
		if (e !== void 0) {
			cm.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new Jm(u) : new fg(u);
}, kg = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Ag(e) {
	let t = kg.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function jg(e, t, n = 1) {
	`${e}`;
	let [r, i] = Ag(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return df(e) ? parseFloat(e) : e;
	}
	return Xf(i) ? jg(i, t, n + 1) : i;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function Mg(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function Ng(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...Mg(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function Pg(e, t, n) {
	return Ng(e.getProps(), t, n, e);
}
var Fg = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, Ig = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...yh
]), Lg = (e) => Array.isArray(e);
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/setters.mjs
function Rg(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, vg(n));
}
function zg(e) {
	return Lg(e) ? e[e.length - 1] || 0 : e;
}
function Bg(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = Pg(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) Rg(e, t, zg(i[t]));
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var Vg = (e) => !!(e && e.getVelocity);
//#endregion
//#region node_modules/motion-dom/dist/es/value/will-change/is.mjs
function Hg(e) {
	return !!(Vg(e) && e.add);
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function Ug(e, t) {
	let n = e.getValue("willChange");
	if (Hg(n)) return n.add(t);
	if (!n && uf.WillChange) {
		let n = new uf.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function Wg(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
var Gg = "data-" + Wg("framerAppearId");
//#endregion
//#region node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function Kg(e) {
	return e.props[Gg];
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var qg = typeof window < "u";
function Jg({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function Yg(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? yg(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && p.animateVisualElement(e, s, a, n, d);
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && Jg(f, t)) continue;
		let o = {
			delay: n,
			...bg(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			cm.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (qg && window.MotionHandoffAnimation) {
			let n = Kg(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, cm);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		Ug(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start(Og(t, r, i, m && Ig.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => cm.update(() => {
			o && Bg(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function Xg(e, t, n = {}) {
	let r = Pg(e, t, Fg(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? Yg(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(Xg(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + pg(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function Zg(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => Xg(e, t, n))) : typeof t == "string" ? Xg(e, t, n) : Promise.all(Yg(e, Pg(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/auto.mjs
var Qg = {
	test: (e) => e === "auto",
	parse: (e) => e
}, $g = (e) => (t) => t.test(e), e_ = [
	$f,
	$,
	pp,
	fp,
	hp,
	mp,
	Qg
], t_ = (e) => e_.find($g(e));
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function n_(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || pf(e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var r_ = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function i_(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !r_.has(t) && kp(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = ah(n, i));
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var a_ = class extends Ih {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), Xf(r))) {
				let i = jg(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !Ig.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = t_(r), o = t_(i);
		if (Qf(r) !== Qf(i) && Dh[n]) {
			this.needsMeasurement = !0;
			return;
		}
		if (a !== o) {
			if (xh(a) && xh(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else Dh[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || n_(e[t])) && n.push(t);
		n.length && i_(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return Dh[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
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
}, o_ = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function s_(e) {
	return ff(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function c_(e) {
	return ff(e) && "ownerSVGElement" in e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var l_ = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
//#endregion
//#region node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function u_(e, t, n) {
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
var d_ = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, f_ = yh.length;
function p_(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < f_; a++) {
		let o = yh[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = l_(s, th[o]);
			if (!c) {
				i = !1;
				let t = d_[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${l_(a, th.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function m_(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (bh.has(e)) {
			o = !0;
			continue;
		}
		if (Jf(e)) {
			i[e] = n;
			continue;
		}
		{
			let t = l_(n, th[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = p_(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var h_ = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, g_ = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function __(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? h_ : g_;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var v_ = [
	"transform",
	"opacity",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function y_(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (m_(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of v_) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && __(d, i, a, o, !1);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function b_({ top: e, left: t, right: n, bottom: r }) {
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
function x_({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function S_(e, t) {
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
function C_(e) {
	return e === void 0 || e === 1;
}
function w_({ scale: e, scaleX: t, scaleY: n }) {
	return !C_(e) || !C_(t) || !C_(n);
}
function T_(e) {
	return w_(e) || E_(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function E_(e) {
	return D_(e.x) || D_(e.y);
}
function D_(e) {
	return e && e !== "0%";
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function O_(e, t, n) {
	return n + t * (e - n);
}
function k_(e, t, n, r, i) {
	return i !== void 0 && (e = O_(e, i, r)), O_(e, n, r) + t;
}
function A_(e, t = 0, n = 1, r, i) {
	e.min = k_(e.min, t, n, r, i), e.max = k_(e.max, t, n, r, i);
}
function j_(e, { x: t, y: n }) {
	A_(e.x, t.translate, t.scale, t.originPoint), A_(e.y, n.translate, n.scale, n.originPoint);
}
var M_ = .999999999999, N_ = 1.0000000000001;
function P_(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (F_(e.x, -a.scroll.offset.x), F_(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, j_(e, o)), r && T_(a.latestValues) && R_(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < N_ && t.x > M_ && (t.x = 1), t.y < N_ && t.y > M_ && (t.y = 1);
}
function F_(e, t) {
	e.min += t, e.max += t;
}
function I_(e, t, n, r, i = .5) {
	A_(e, t, n, Vp(e.min, e.max, i), r);
}
function L_(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function R_(e, t, n) {
	let r = n ?? e;
	I_(e.x, L_(t.x, r.x), t.scaleX, t.scale, t.originX), I_(e.y, L_(t.y, r.y), t.scaleY, t.scale, t.originY);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function z_(e, t) {
	return b_(S_(e.getBoundingClientRect(), t));
}
function B_(e, t, n) {
	let r = z_(e, n), { scroll: i } = t;
	return i && (F_(r.x, i.offset.x), F_(r.y, i.offset.y)), r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: V_, cancel: H_ } = /* @__PURE__ */ sm(queueMicrotask, !1), U_ = {
	x: !1,
	y: !1
};
function W_() {
	return U_.x || U_.y;
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function G_(e) {
	return e === "x" || e === "y" ? U_[e] ? null : (U_[e] = !0, () => {
		U_[e] = !1;
	}) : U_.x || U_.y ? null : (U_.x = U_.y = !0, () => {
		U_.x = U_.y = !1;
	});
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function K_(e, t) {
	let n = u_(e), r = new AbortController();
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
function q_(e) {
	return !(e.pointerType === "touch" || W_());
}
function J_(e, t, n = {}) {
	let [r, i, a] = K_(e, n);
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
			if (!q_(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Y_ = (e, t) => t ? e === t || Y_(e, t.parentElement) : !1, X_ = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, Z_ = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function Q_(e) {
	return Z_.has(e.tagName) || e.isContentEditable === !0;
}
var $_ = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function ev(e) {
	return $_.has(e.tagName) || e.isContentEditable === !0;
}
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/press/utils/state.mjs
var tv = /* @__PURE__ */ new WeakSet();
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function nv(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function rv(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var iv = (e, t) => {
	let n = e.currentTarget;
	if (!n) return;
	let r = nv(() => {
		if (tv.has(n)) return;
		rv(n, "down");
		let e = nv(() => {
			rv(n, "up");
		});
		n.addEventListener("keyup", e, t), n.addEventListener("blur", () => rv(n, "cancel"), t);
	});
	n.addEventListener("keydown", r, t), n.addEventListener("blur", () => n.removeEventListener("keydown", r), t);
};
//#endregion
//#region node_modules/motion-dom/dist/es/gestures/press/index.mjs
function av(e) {
	return X_(e) && !W_();
}
var ov = /* @__PURE__ */ new WeakSet();
function sv(e, t, n = {}) {
	let [r, i, a] = K_(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!av(e) || ov.has(e)) return;
		tv.add(r), n.stopPropagation && ov.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), tv.has(r) && tv.delete(r), av(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Y_(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), s_(e) && (e.addEventListener("focus", (e) => iv(e, i)), !Q_(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
//#endregion
//#region node_modules/motion-dom/dist/es/resize/handle-element.mjs
var cv = /* @__PURE__ */ new WeakMap(), lv, uv = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : c_(r) && "getBBox" in r ? r.getBBox()[t] : r[n], dv = /*@__PURE__*/ uv("inline", "width", "offsetWidth"), fv = /*@__PURE__*/ uv("block", "height", "offsetHeight");
function pv({ target: e, borderBoxSize: t }) {
	cv.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return dv(e, t);
			},
			get height() {
				return fv(e, t);
			}
		});
	});
}
function mv(e) {
	e.forEach(pv);
}
function hv() {
	typeof ResizeObserver < "u" && (lv = new ResizeObserver(mv));
}
function gv(e, t) {
	lv || hv();
	let n = u_(e);
	return n.forEach((e) => {
		let n = cv.get(e);
		n || (n = /* @__PURE__ */ new Set(), cv.set(e, n)), n.add(t), lv?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = cv.get(e);
			n?.delete(t), n?.size || lv?.unobserve(e);
		});
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/resize/handle-window.mjs
var _v = /* @__PURE__ */ new Set(), vv;
function yv() {
	vv = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		_v.forEach((t) => t(e));
	}, window.addEventListener("resize", vv);
}
function bv(e) {
	return _v.add(e), vv || yv(), () => {
		_v.delete(e), !_v.size && typeof vv == "function" && (window.removeEventListener("resize", vv), vv = void 0);
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/resize/index.mjs
function xv(e, t) {
	return typeof e == "function" ? bv(e) : gv(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/stats/buffer.mjs
var Sv = {
	value: null,
	addProjectionMetrics: null
};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function Cv(e) {
	return c_(e) && e.tagName === "svg";
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var wv = (e) => typeof e == "number" ? e : parseFloat(e), Tv = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), Ev = () => ({
	x: Tv(),
	y: Tv()
}), Dv = () => ({
	min: 0,
	max: 0
}), Ov = () => ({
	x: Dv(),
	y: Dv()
}), kv = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function Av(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function jv(e) {
	return typeof e == "string" || Array.isArray(e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var Mv = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], Nv = ["initial", ...Mv];
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function Pv(e) {
	if (Av(e.animate)) return !0;
	for (let t = 0; t < Nv.length; t++) if (jv(e[Nv[t]])) return !0;
	return !1;
}
function Fv(e) {
	return !!(Pv(e) || e.variants);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function Iv(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (Vg(i)) e.addValue(r, i);
		else if (Vg(a)) e.addValue(r, vg(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, vg(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var Lv = { current: null }, Rv = { current: !1 }, zv = typeof window < "u";
function Bv() {
	if (Rv.current = !0, zv) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => Lv.current = e.matches;
			e.addEventListener("change", t), t();
		} else Lv.current = !1;
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/VisualElement.mjs
var Vv = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], Hv = {};
function Uv(e) {
	Hv = e;
}
function Wv() {
	return Hv;
}
var Gv = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Ih, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = Gf.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, cm.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = Pv(t), this.isVariantNode = Fv(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && Vg(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, kv.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Rv.current || Bv(), this.shouldReduceMotion = Lv.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), lm(this.notifyUpdate), lm(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
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
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && ag.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new Yh({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ vf(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = bh.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && cm.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
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
		for (e in Hv) {
			let t = Hv[e];
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
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Ov();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		(e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < Vv.length; t++) {
			let n = Vv[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = Iv(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
		return n === void 0 && t !== void 0 && (n = vg(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (df(n) || pf(n)) ? n = parseFloat(n) : typeof n != "number" && !Lp.test(n) && Lp.test(t) && (n = ah(e, t)), this.setBaseTarget(e, Vg(n) ? n.get() : n)), Vg(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = new _f()), this.events[e].add(t);
	}
	notify(e, ...t) {
		this.events[e] && this.events[e].notify(...t);
	}
	scheduleRenderMicrotask() {
		V_.render(this.render);
	}
}, Kv = class extends Gv {
	constructor() {
		super(...arguments), this.KeyframeResolver = a_;
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
		Vg(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
}, qv = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
};
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function Jv(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var Yv = {};
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Xv(e, { layout: t, layoutId: n }) {
	return bh.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!Yv[e] || e === "opacity");
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function Zv(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (Vg(r[t]) || i && Vg(i[t]) || Xv(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function Qv(e) {
	return window.getComputedStyle(e);
}
var $v = class extends Kv {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = Jv;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (bh.has(t)) return this.projection?.isProjecting ? hh(t) : _h(e, t);
		{
			let n = Qv(e), r = (Jf(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return z_(e, t);
	}
	build(e, t, n) {
		m_(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return Zv(e, t, n);
	}
}, ey = /* @__PURE__ */ new Set([
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
]), ty = (e) => typeof e == "string" && e.toLowerCase() === "svg";
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function ny(e, t, n, r) {
	Jv(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(ey.has(n) ? n : Wg(n), t.attrs[n]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function ry(e, t, n) {
	let r = Zv(e, t, n);
	for (let n in e) if (Vg(e[n]) || Vg(t[n])) {
		let t = yh.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var iy = class extends Kv {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Ov;
	}
	getBaseTargetFromProps(e, t) {
		return bh.has(t) ? super.getBaseTargetFromProps(e, t) ?? hh(t) : e[t];
	}
	getDefaultValue(e) {
		return bh.has(e) ? this.latestValues[e] ?? hh(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (bh.has(t)) {
			let e = rh(t);
			return e && e.default || 0;
		}
		if (v_.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = ey.has(t) ? t : Wg(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return ry(e, t, n);
	}
	build(e, t, n) {
		y_(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		ny(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = ty(e.tagName), super.mount(e);
	}
};
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function ay(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var oy = [...Mv].reverse();
function sy(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => Zg(e, t, n))), n = ly(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f = {}, p = Infinity, m = e;
		do
			m = m.props.inherit !== !1 && m.parent;
		while (m && !m.isControllingVariants);
		if (oy.forEach((t, r) => {
			let i = n[t], h = o[t], g = m && m.props[t], _ = h === void 0 ? jv(g) || g === !1 ? g : void 0 : h, v = jv(_), y = t === a ? i.isActive : null;
			y === !1 && (p = r);
			let b = v && h === void 0 && !(l && c);
			if (i.protectedKeys = { ...f }, !i.isActive && y === null || !_ && !i.prevProp || Av(_) || typeof _ == "boolean") return;
			if (t === "exit" && i.isActive && y !== !0) {
				f = {
					...f,
					...i.prevResolvedValues
				};
				return;
			}
			let x = cy(i.prevProp, _), S = x || v && (y && !b || r > p), ee = !1, C = Array.isArray(_) ? _ : [_], w = {};
			if (y !== !1) for (let n of C) {
				let { transition: r, transitionEnd: i, ...a } = Pg(e, n, Fg(e, t)) || {};
				w = {
					...w,
					...a,
					...i
				};
			}
			let { prevResolvedValues: te } = i;
			for (let t in {
				...te,
				...w
			}) {
				if (t in f) continue;
				let n = w[t], r = te[t], a = Array.isArray(n) && Array.isArray(r) ? !ay(n, r) || x : n !== r;
				if (a && n == null) d.add(t);
				else if (a || n !== void 0 && d.has(t)) {
					S = !0, d.delete(t) && (ee = !0), i.needsAnimating[t] = !0;
					let n = e.getValue(t);
					n && (n.liveStyle = !1);
				} else i.protectedKeys[t] = !0;
			}
			if (i.prevProp = _, i.prevResolvedValues = w, i.isActive && (f = {
				...f,
				...w
			}), S && (!(b && x) || ee)) for (let n of C) {
				let r = { type: t };
				if (typeof n == "string" && l && c && s?.enteringChildren) {
					let t = Pg(s, n)?.transition?.delayChildren;
					r.delay = pg(s.enteringChildren, e, t);
				}
				u.push({
					animation: n,
					options: r
				});
			}
		}), d.size) {
			let { initial: t } = o, n = {}, r = typeof t != "boolean" && Pg(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
			r && r.transition && (n.transition = r.transition), d.forEach((i) => {
				let a = e.getValue(i);
				a && (a.liveStyle = !0);
				let s = r && !Array.isArray(t) ? r[i] : void 0, c = e.getBaseTargetFromProps(o, i);
				n[i] = (s === void 0 ? c !== void 0 && !Vg(c) ? c : e.initialValues[i] === void 0 ? e.baseTarget[i] : void 0 : s) ?? null;
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
			n = ly(), i = !0;
		}
	};
}
function cy(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !ay(t, e) : !1;
}
function ly() {
	let e = {};
	for (let t of Mv) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
	return e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function uy(e, t) {
	e.min = t.min, e.max = t.max;
}
function dy(e, t) {
	uy(e.x, t.x), uy(e.y, t.y);
}
function fy(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var py = .9999, my = 1.0001, hy = -.01, gy = .01;
function _y(e) {
	return e.max - e.min;
}
function vy(e, t, n) {
	return Math.abs(e - t) <= n;
}
function yy(e, t, n, r = .5) {
	e.origin = r, e.originPoint = Vp(t.min, t.max, e.origin), e.scale = _y(n) / _y(t), e.translate = Vp(n.min, n.max, e.origin) - e.originPoint, (e.scale >= py && e.scale <= my || isNaN(e.scale)) && (e.scale = 1), (e.translate >= hy && e.translate <= gy || isNaN(e.translate)) && (e.translate = 0);
}
function by(e, t, n, r) {
	yy(e.x, t.x, n.x, r ? r.originX : void 0), yy(e.y, t.y, n.y, r ? r.originY : void 0);
}
function xy(e, t, n, r = 0) {
	e.min = (r ? Vp(n.min, n.max, r) : n.min) + t.min, e.max = e.min + _y(t);
}
function Sy(e, t, n, r) {
	xy(e.x, t.x, n.x, r?.x), xy(e.y, t.y, n.y, r?.y);
}
function Cy(e, t, n, r = 0) {
	let i = r ? Vp(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + _y(t);
}
function wy(e, t, n, r) {
	Cy(e.x, t.x, n.x, r?.x), Cy(e.y, t.y, n.y, r?.y);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function Ty(e, t, n, r, i) {
	return e -= t, e = O_(e, 1 / n, r), i !== void 0 && (e = O_(e, 1 / i, r)), e;
}
function Ey(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (pp.test(t) && (t = parseFloat(t), t = Vp(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = Vp(a.min, a.max, r);
	e === a && (s -= t), e.min = Ty(e.min, t, n, s, i), e.max = Ty(e.max, t, n, s, i);
}
function Dy(e, t, [n, r, i], a, o) {
	Ey(e, t[n], t[r], t[i], t.scale, a, o);
}
var Oy = [
	"x",
	"scaleX",
	"originX"
], ky = [
	"y",
	"scaleY",
	"originY"
];
function Ay(e, t, n, r) {
	Dy(e.x, t, Oy, n ? n.x : void 0, r ? r.x : void 0), Dy(e.y, t, ky, n ? n.y : void 0, r ? r.y : void 0);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function jy(e) {
	return e.translate === 0 && e.scale === 1;
}
function My(e) {
	return jy(e.x) && jy(e.y);
}
function Ny(e, t) {
	return e.min === t.min && e.max === t.max;
}
function Py(e, t) {
	return Ny(e.x, t.x) && Ny(e.y, t.y);
}
function Fy(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Iy(e, t) {
	return Fy(e.x, t.x) && Fy(e.y, t.y);
}
function Ly(e) {
	return _y(e.x) / _y(e.y);
}
function Ry(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function zy(e) {
	return [e("x"), e("y")];
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function By(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var Vy = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if ($.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${By(e, t.target.x)}% ${By(e, t.target.y)}%`;
} }, Hy = { correct: (e, { treeScale: t, projectionDelta: n }) => {
	let r = e, i = Lp.parse(e);
	if (i.length > 5) return r;
	let a = Lp.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
	i[0 + o] /= s, i[1 + o] /= c;
	let l = Vp(s, c, .5);
	return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
} };
//#endregion
//#region node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function Uy(e, t, n) {
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
var Wy = o_.length, Gy = (e) => typeof e == "number" || $.test(e);
function Ky(e, t, n, r, i, a) {
	i ? (e.opacity = Vp(0, n.opacity ?? 1, Jy(r)), e.opacityExit = Vp(t.opacity ?? 1, 0, Yy(r))) : a && (e.opacity = Vp(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < Wy; i++) {
		let a = o_[i], o = qy(t, a), s = qy(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || Gy(o) === Gy(s) ? (e[a] = Math.max(Vp(wv(o), wv(s), r), 0), (pp.test(s) || pp.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	(t.rotate || n.rotate) && (e.rotate = Vp(t.rotate || 0, n.rotate || 0, r));
}
function qy(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var Jy = /*@__PURE__*/ Xy(0, .5, Nf), Yy = /*@__PURE__*/ Xy(.5, .95, X);
function Xy(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ gf(e, t, r));
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function Zy(e, t, n) {
	let r = Vg(e) ? e : vg(e);
	return r.start(Og("", r, t, n)), r.animation;
}
//#endregion
//#region node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function Qy(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var $y = (e, t) => e.depth - t.depth, eb = class {
	constructor() {
		this.children = [], this.isDirty = !1;
	}
	add(e) {
		sf(this.children, e), this.isDirty = !0;
	}
	remove(e) {
		cf(this.children, e), this.isDirty = !0;
	}
	forEach(e) {
		this.isDirty && this.children.sort($y), this.isDirty = !1, this.children.forEach(e);
	}
};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/delay.mjs
function tb(e, t) {
	let n = Gf.now(), r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (lm(r), e(a - t));
	};
	return cm.setup(r, !0), () => lm(r);
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function nb(e) {
	return Vg(e) ? e.get() : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var rb = class {
	constructor() {
		this.members = [];
	}
	add(e) {
		sf(this.members, e);
		for (let t = this.members.length - 1; t >= 0; t--) {
			let n = this.members[t];
			if (n === e || n === this.lead || n === this.prevLead) continue;
			let r = n.instance;
			(!r || r.isConnected === !1) && !n.snapshot && (cf(this.members, n), n.unmount());
		}
		e.scheduleRender();
	}
	remove(e) {
		if (cf(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
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
}, ib = {
	borderRadius: {
		...Vy,
		applyTo: [...o_]
	},
	borderTopLeftRadius: Vy,
	borderTopRightRadius: Vy,
	borderBottomLeftRadius: Vy,
	borderBottomRightRadius: Vy,
	boxShadow: Hy
}, ab = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
};
//#endregion
//#region node_modules/motion-dom/dist/es/projection/node/create-projection-node.mjs
Object.assign(Yv, {
	...ib,
	...Yv
});
var ob = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, sb = [
	"",
	"X",
	"Y",
	"Z"
], cb = 1e3, lb = 0;
function ub(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
function db(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = Kg(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", cm, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && db(r);
}
function fb({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return class {
		constructor(e = {}, n = t?.()) {
			this.id = lb++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, Sv.value && (ob.nodes = ob.calculatedTargetDeltas = ob.calculatedProjections = 0), this.nodes.forEach(hb), this.nodes.forEach(Tb), this.nodes.forEach(Eb), this.nodes.forEach(gb), Sv.addProjectionMetrics && Sv.addProjectionMetrics(ob);
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new eb());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new _f()), this.eventHandlers.get(e).add(t);
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
			this.isSVG = c_(t) && !Cv(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				cm.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = tb(i, 250), ab.hasAnimatedSinceResize && (ab.hasAnimatedSinceResize = !1, this.nodes.forEach(wb)));
				});
			}
			n && this.root.registerSharedNode(n, this), this.options.animate !== !1 && i && (n || r) && this.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: n, layout: r }) => {
				if (this.isTreeAnimationBlocked()) {
					this.target = void 0, this.relativeTarget = void 0;
					return;
				}
				let a = this.options.transition || i.getDefaultTransition() || Nb, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = i.getProps(), c = !this.targetLayout || !Iy(this.targetLayout, r), l = !t && n;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...bg(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(i.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || wb(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = r;
			});
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), lm(this.updateProjection);
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
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Db), this.animationId++);
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
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && db(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
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
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(yb), this.nodes.forEach(vb);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(bb);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(xb), this.nodes.forEach(Sb), this.nodes.forEach(Cb), this.nodes.forEach(pb), this.nodes.forEach(mb)) : this.nodes.forEach(bb), this.clearAllSnapshots();
			let e = Gf.now();
			Z.delta = lf(0, 1e3 / 60, e - Z.timestamp), Z.timestamp = e, Z.isProcessing = !0, um.update.process(Z), um.preRender.process(Z), um.render.process(Z), Z.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, V_.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(_b), this.sharedNodes.forEach(Ob);
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, cm.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			cm.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !_y(this.snapshot.measuredBox.x) && !_y(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= Ov(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
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
			let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, t = this.projectionDelta && !My(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || T_(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), Lb(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return Ov();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(zb))) {
				let { scroll: e } = this.root;
				e && (F_(t.x, e.offset.x), F_(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = Ov();
			if (dy(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && dy(t, e), F_(t.x, i.offset.x), F_(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n) {
			let r = n || Ov();
			dy(r, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (F_(r.x, -n.scroll.offset.x), F_(r.y, -n.scroll.offset.y)), T_(n.latestValues) && R_(r, n.latestValues, n.layout?.layoutBox);
			}
			return T_(this.latestValues) && R_(r, this.latestValues, this.layout?.layoutBox), r;
		}
		removeTransform(e) {
			let t = Ov();
			dy(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!T_(n.latestValues)) continue;
				let r;
				n.instance && (w_(n.latestValues) && n.updateSnapshot(), r = Ov(), dy(r, n.measurePageBox())), Ay(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return T_(this.latestValues) && Ay(t, this.latestValues), t;
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
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Z.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = Z.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = Ov(), this.targetWithTransforms = Ov()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Sy(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : dy(this.target, this.layout.layoutBox), j_(this.target, this.targetDelta)) : dy(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), Sv.value && ob.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || w_(this.parent.latestValues) || E_(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Ov(), this.relativeTargetOrigin = Ov(), wy(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), dy(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === Z.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			dy(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			P_(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = Ov());
			let { target: s } = e;
			if (!s) {
				this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
				return;
			}
			!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (fy(this.prevProjectionDelta.x, this.projectionDelta.x), fy(this.prevProjectionDelta.y, this.projectionDelta.y)), by(this.projectionDelta, this.layoutCorrected, s, this.latestValues), (this.treeScale.x !== a || this.treeScale.y !== o || !Ry(this.projectionDelta.x, this.prevProjectionDelta.x) || !Ry(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), Sv.value && ob.calculatedProjections++;
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
			this.prevProjectionDelta = Ev(), this.projectionDelta = Ev(), this.projectionDeltaWithTransform = Ev();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = Ev();
			(!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = Ov(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(Mb));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = Vp(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = Vp(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (kb(o.x, e.x, n), kb(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (wy(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), jb(this.relativeTarget, this.relativeTargetOrigin, s, n), f && Py(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= Ov(), dy(f, this.relativeTarget)), c && (this.animationValues = a, Ky(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (lm(this.pendingAnimation), void 0), this.pendingAnimation = cm.update(() => {
				ab.hasAnimatedSinceResize = !0, this.motionValue ||= vg(0), this.motionValue.jump(0, !1), this.currentAnimation = Zy(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), Gm(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(cb), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && Rb(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					i = this.target || Ov();
					let t = _y(this.layout.layoutBox.x);
					i.x.min = e.target.x.min, i.x.max = i.x.min + t;
					let n = _y(this.layout.layoutBox.y);
					i.y.min = e.target.y.min, i.y.max = i.y.min + n;
				}
				dy(t, i), R_(t, r), by(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new rb()), this.sharedNodes.get(e).add(t);
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
			n.z && ub("z", e, r, this.animationValues);
			for (let t = 0; t < sb.length; t++) ub(`rotate${sb[t]}`, e, r, this.animationValues), ub(`skew${sb[t]}`, e, r, this.animationValues);
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
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = nb(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = nb(t?.pointerEvents) || ""), this.hasProjected && !T_(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = Uy(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in Yv) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = Yv[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? nb(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(vb), this.root.sharedNodes.clear();
		}
	};
}
function pb(e) {
	e.updateLayout();
}
function mb(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") zy((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = _y(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			uy(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else Rb(i, t.layoutBox, n) && zy((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = _y(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = Ev();
		by(o, n, t.layoutBox);
		let s = Ev();
		a ? by(s, e.applyTransform(r, !0), t.measuredBox) : by(s, n, t.layoutBox);
		let c = !My(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = Ov();
					wy(s, t.layoutBox, i.layoutBox, o);
					let c = Ov();
					wy(c, n, a.layoutBox, o), Iy(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
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
function hb(e) {
	Sv.value && ob.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function gb(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function _b(e) {
	e.clearSnapshot();
}
function vb(e) {
	e.clearMeasurements();
}
function yb(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function bb(e) {
	e.isLayoutDirty = !1;
}
function xb(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.layout, e.isLayoutDirty = !0);
}
function Sb(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function Cb(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function wb(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function Tb(e) {
	e.resolveTargetDelta();
}
function Eb(e) {
	e.calcProjection();
}
function Db(e) {
	e.resetSkewAndRotation();
}
function Ob(e) {
	e.removeLeadSnapshot();
}
function kb(e, t, n) {
	e.translate = Vp(t.translate, 0, n), e.scale = Vp(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function Ab(e, t, n, r) {
	e.min = Vp(t.min, n.min, r), e.max = Vp(t.max, n.max, r);
}
function jb(e, t, n, r) {
	Ab(e.x, t.x, n.x, r), Ab(e.y, t.y, n.y, r);
}
function Mb(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var Nb = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, Pb = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Fb = Pb("applewebkit/") && !Pb("chrome/") ? Math.round : X;
function Ib(e) {
	e.min = Fb(e.min), e.max = Fb(e.max);
}
function Lb(e) {
	Ib(e.x), Ib(e.y);
}
function Rb(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !vy(Ly(t), Ly(n), .2);
}
function zb(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var Bb = fb({
	attachResizeListener: (e, t) => Qy(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), Vb = { current: void 0 }, Hb = fb({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!Vb.current) {
			let e = new Bb({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), Vb.current = e;
		}
		return Vb.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), Ub = (0, b.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
//#endregion
//#region node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function Wb(e = !0) {
	let t = (0, b.useContext)(of);
	if (t === null) return [!0, null];
	let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, b.useId)();
	(0, b.useEffect)(() => {
		if (e) return i(a);
	}, [e]);
	let o = (0, b.useCallback)(() => e && r && r(a), [
		a,
		r,
		e
	]);
	return !n && r ? [!1, o] : [!0];
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/LazyContext.mjs
var Gb = (0, b.createContext)({ strict: !1 }), Kb = {
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
}, qb = !1;
function Jb() {
	if (qb) return;
	let e = {};
	for (let t in Kb) e[t] = { isEnabled: (e) => Kb[t].some((t) => !!e[t]) };
	Uv(e), qb = !0;
}
function Yb() {
	return Jb(), Wv();
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function Xb(e) {
	let t = Yb();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	Uv(t);
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var Zb = /* @__PURE__ */ (0, b.createContext)({});
//#endregion
//#region node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function Qb(e, t) {
	if (Pv(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || jv(t) ? t : void 0,
			animate: jv(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function $b(e) {
	let { initial: t, animate: n } = Qb(e, (0, b.useContext)(Zb));
	return (0, b.useMemo)(() => ({
		initial: t,
		animate: n
	}), [ex(t), ex(n)]);
}
function ex(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var tx = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
//#endregion
//#region node_modules/framer-motion/dist/es/render/html/use-props.mjs
function nx(e, t, n) {
	for (let r in t) !Vg(t[r]) && !Xv(r, n) && (e[r] = t[r]);
}
function rx({ transformTemplate: e }, t) {
	return (0, b.useMemo)(() => {
		let n = tx();
		return m_(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function ix(e, t) {
	let n = e.style || {}, r = {};
	return nx(r, n, e), Object.assign(r, rx(e, t)), r;
}
function ax(e, t) {
	let n = {}, r = ix(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var ox = () => ({
	...tx(),
	attrs: {}
});
//#endregion
//#region node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function sx(e, t, n, r) {
	let i = (0, b.useMemo)(() => {
		let n = ox();
		return y_(n, t, ty(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		nx(t, e.style, e), i.style = {
			...t,
			...i.style
		};
	}
	return i;
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var cx = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function lx(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || cx.has(e);
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function ux(e, t) {
	return e.startsWith("on") ? !lx(e) : t?.(e) ?? !lx(e);
}
function dx(e, t, n, r) {
	let i = {};
	for (let a in e) (a !== "values" || typeof e.values != "object") && (Vg(e[a]) || (ux(a, r) || n === !0 && lx(a) || !t && !lx(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]));
	return i;
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var fx = [
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
function px(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(fx.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function mx(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? px(e) ? sx : ax)(t, r, i, e), l = dx(t, typeof e == "string", a, s), u = e === b.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, b.useMemo)(() => Vg(d) ? d.get() : d, [d]);
	return (0, b.createElement)(e, {
		...u,
		children: f
	});
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function hx({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: gx(n, r, i, e),
		renderState: t()
	};
}
function gx(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = nb(a[e]);
	let { initial: o, animate: s } = e, c = Pv(e), l = Fv(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !Av(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = Ng(e, t[n]);
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
var _x = (e) => (t, n) => {
	let r = (0, b.useContext)(Zb), i = (0, b.useContext)(of), a = () => hx(e, t, r, i);
	return n ? a() : rf(a);
}, vx = /*@__PURE__*/ _x({
	scrapeMotionValuesFromProps: Zv,
	createRenderState: tx
}), yx = /*@__PURE__*/ _x({
	scrapeMotionValuesFromProps: ry,
	createRenderState: ox
}), bx = Symbol.for("motionComponentSymbol");
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function xx(e, t, n) {
	let r = (0, b.useRef)(n);
	(0, b.useInsertionEffect)(() => {
		r.current = n;
	});
	let i = (0, b.useRef)(null);
	return (0, b.useCallback)((n) => {
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
var Sx = (0, b.createContext)({});
//#endregion
//#region node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function Cx(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function wx(e, t, n, r, i, a) {
	let { visualElement: o } = (0, b.useContext)(Zb), s = (0, b.useContext)(Gb), c = (0, b.useContext)(of), l = (0, b.useContext)(Ub), u = l.reducedMotion, d = l.skipAnimations, f = (0, b.useRef)(null), p = (0, b.useRef)(!1);
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
	let m = f.current, h = (0, b.useContext)(Sx);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && Tx(f.current, n, i, h);
	let g = (0, b.useRef)(!1);
	(0, b.useInsertionEffect)(() => {
		m && g.current && m.update(n, c);
	});
	let _ = n[Gg], v = (0, b.useRef)(!!_ && typeof window < "u" && !window.MotionHandoffIsComplete?.(_) && window.MotionHasOptimisedAnimation?.(_));
	return af(() => {
		p.current && m && (m.animationState?.animateChanges(), m.enteringChildren = void 0);
	}, []), af(() => {
		p.current = !0, m && (g.current = !0, window.MotionIsMounted = !0, m.updateFeatures(), m.scheduleRenderMicrotask(), v.current && m.animationState && m.animationState.animateChanges());
	}), (0, b.useEffect)(() => {
		m && (!v.current && m.animationState && m.animationState.animateChanges(), v.current &&= (queueMicrotask(() => {
			window.MotionHandoffMarkAsComplete?.(_);
		}), !1), m.enteringChildren = void 0);
	}), m;
}
function Tx(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t;
	e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : Ex(e.parent)), e.projection.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && Cx(s),
		visualElement: e,
		animationType: typeof a == "string" ? a : "both",
		initialPromotionConfig: r,
		crossfade: d,
		layoutScroll: c,
		layoutRoot: l,
		layoutAnchor: u
	});
}
function Ex(e) {
	if (e) return e.options.allowProjection === !1 ? Ex(e.parent) : e.projection;
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/index.mjs
function Dx(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && Xb(r);
	let a = n ? n === "svg" : px(e), o = a ? yx : vx;
	function s(n, s) {
		let c, l = {
			...(0, b.useContext)(Ub),
			...n,
			layoutId: Ox(n)
		}, { isStatic: u, isValidProp: d } = l, f = $b(n), p = o(n, u);
		if (!u && typeof window < "u") {
			kx(l, r);
			let t = Ax(l);
			c = t.MeasureLayout, f.visualElement = wx(e, p, l, i, t.ProjectionNode, a);
		}
		return (0, x.jsxs)(Zb.Provider, {
			value: f,
			children: [c && f.visualElement ? (0, x.jsx)(c, {
				visualElement: f.visualElement,
				...l
			}) : null, mx(e, n, xx(p, f.visualElement, s), p, u, t, a, d)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, b.forwardRef)(s);
	return c[bx] = e, c;
}
function Ox({ layoutId: e }) {
	let t = (0, b.useContext)(nf).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function kx(e, t) {
	(0, b.useContext)(Gb).strict;
}
function Ax(e) {
	let { drag: t, layout: n } = Yb();
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
function jx(e, t) {
	if (typeof Proxy > "u") return Dx;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => Dx(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, Dx(a, void 0, e, t)), n.get(a)) });
}
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var Mx = (e, t) => t.isSVG ?? px(e) ? new iy(t) : new $v(t, { allowProjection: e !== b.Fragment }), Nx = class extends qv {
	constructor(e) {
		super(e), e.animationState ||= sy(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		Av(e) && (this.unmountControls = e.subscribe(this.node));
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
}, Px = 0, Fx = {
	animation: { Feature: Nx },
	exit: { Feature: class extends qv {
		constructor() {
			super(...arguments), this.id = Px++;
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
						let { transition: t, transitionEnd: n, ...r } = Pg(this.node, e) || {};
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
function Ix(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var Lx = (e) => (t) => X_(t) && e(t, Ix(t));
//#endregion
//#region node_modules/framer-motion/dist/es/events/add-pointer-event.mjs
function Rx(e, t, n, r) {
	return Qy(e, t, Lx(n), r);
}
//#endregion
//#region node_modules/framer-motion/dist/es/utils/get-context-window.mjs
var zx = ({ current: e }) => e ? e.ownerDocument.defaultView : null, Bx = (e, t) => Math.abs(e - t);
function Vx(e, t) {
	let n = Bx(e.x, t.x), r = Bx(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs
var Hx = /*#__PURE__*/ new Set(["auto", "scroll"]), Ux = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Wx(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = Kx(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = Vx(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: Gf.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i && i(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a && a(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = Wx(t, this.transformPagePoint), this.hasPendingMove = !0, cm.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = Kx(e.type === "pointercancel" ? this.lastMoveEventInfo : Wx(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !X_(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = Wx(Ix(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = Z;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, Kx(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = hf(Rx(this.contextWindow, "pointermove", this.handlePointerMove, d), Rx(this.contextWindow, "pointerup", this.handlePointerUp, d), Rx(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(Hx.has(e.overflowX) || Hx.has(e.overflowY)) && this.scrollPositions.set(t, {
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
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), cm.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), lm(this.updatePoint);
	}
};
function Wx(e, t) {
	return t ? { point: t(e.point) } : e;
}
function Gx(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function Kx({ point: e }, t) {
	return {
		point: e,
		delta: Gx(e, Jx(t)),
		offset: Gx(e, qx(t)),
		velocity: Yx(t, .1)
	};
}
function qx(e) {
	return e[0];
}
function Jx(e) {
	return e[e.length - 1];
}
function Yx(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = Jx(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ vf(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ vf(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ yf(i.timestamp - r.timestamp);
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
function Xx(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? Vp(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? Vp(n, e, r.max) : Math.min(e, n)), e;
}
function Zx(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function Qx(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: Zx(e.x, n, i),
		y: Zx(e.y, t, r)
	};
}
function $x(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function eS(e, t) {
	return {
		x: $x(e.x, t.x),
		y: $x(e.y, t.y)
	};
}
function tS(e, t) {
	let n = .5, r = _y(e), i = _y(t);
	return i > r ? n = /* @__PURE__ */ gf(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ gf(e.min, e.max - i, t.min)), lf(0, 1, n);
}
function nS(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var rS = .35;
function iS(e = rS) {
	return e === !1 ? e = 0 : e === !0 && (e = rS), {
		x: aS(e, "left", "right"),
		y: aS(e, "top", "bottom")
	};
}
function aS(e, t, n) {
	return {
		min: oS(e, t),
		max: oS(e, n)
	};
}
function oS(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs
var sS = /* @__PURE__ */ new WeakMap(), cS = class {
	constructor(e) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Ov(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(e), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = G_(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), zy((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (pp.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = _y(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && cm.update(() => i(e, t), !1, !0), Ug(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				this.currentDirection = fS(o), this.currentDirection !== null && i && i(this.currentDirection);
				return;
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && cm.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new Ux(e, {
			onSessionStart: i,
			onStart: a,
			onMove: o,
			onSessionEnd: s,
			resumeAnimation: c
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: l,
			distanceThreshold: n,
			contextWindow: zx(this.visualElement),
			element: this.visualElement.current
		});
	}
	stop(e, t) {
		let n = e || this.latestPointerEvent, r = t || this.latestPanInfo, i = this.isDragging;
		if (this.cancel(), !i || !r || !n) return;
		let { velocity: a } = r;
		this.startAnimation(a);
		let { onDragEnd: o } = this.getProps();
		o && cm.postRender(() => o(n, r));
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
		if (!n || !dS(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = Xx(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		e && Cx(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? Qx(n.layoutBox, e) : !1, this.elastic = iS(t), r !== this.constraints && !Cx(e) && n && this.constraints && !this.hasMutatedConstraints && zy((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = nS(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!e || !Cx(e)) return !1;
		let n = e.current, { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = B_(n, r.root, this.visualElement.getTransformPagePoint()), a = eS(r.layout.layoutBox, i);
		if (t) {
			let e = t(x_(a));
			this.hasMutatedConstraints = !!e, e && (a = b_(e));
		}
		return a;
	}
	startAnimation(e) {
		let { drag: t, dragMomentum: n, dragElastic: r, dragTransition: i, dragSnapToOrigin: a, onDragTransitionEnd: o } = this.getProps(), s = this.constraints || {}, c = zy((o) => {
			if (!dS(o, t, this.currentDirection)) return;
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
		return Ug(this.visualElement, e), n.start(Og(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		zy((e) => this.getAxisMotionValue(e).stop());
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
		zy((e) => {
			if (!dS(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - Vp(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Cx(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		zy((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = tS({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), zy((t) => {
			let n = this.getAxisMotionValue(t);
			if (!dS(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(Vp(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		sS.set(this.visualElement, this);
		let e = this.visualElement.current, t = Rx(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && ev(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps();
			Cx(t) && t.current && (this.constraints = this.resolveRefConstraints(), n ||= uS(e, t.current, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), cm.read(r);
		let o = Qy(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (zy((t) => {
				let n = this.getAxisMotionValue(t);
				n && (this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate));
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.visualElement.getProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = rS, dragMomentum: o = !0 } = e;
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
function lS(e) {
	let t = !0;
	return () => {
		if (t) {
			t = !1;
			return;
		}
		e();
	};
}
function uS(e, t, n) {
	let r = xv(e, lS(n)), i = xv(t, lS(n));
	return () => {
		r(), i();
	};
}
function dS(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function fS(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/drag/index.mjs
var pS = class extends qv {
	constructor(e) {
		super(e), this.removeGroupControls = X, this.removeListeners = X, this.controls = new cS(e);
	}
	mount() {
		let { dragControls: e } = this.node.getProps();
		e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || X;
	}
	update() {
		let { dragControls: e } = this.node.getProps(), { dragControls: t } = this.node.prevProps || {};
		e !== t && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls)));
	}
	unmount() {
		this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
	}
}, mS = (e) => (t, n) => {
	e && cm.update(() => e(t, n), !1, !0);
}, hS = class extends qv {
	constructor() {
		super(...arguments), this.removePointerDownListener = X;
	}
	onPointerDown(e) {
		this.session = new Ux(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: zx(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: mS(e),
			onStart: mS(t),
			onMove: mS(n),
			onEnd: (e, t) => {
				delete this.session, r && cm.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Rx(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, gS = !1, _S = class extends b.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), gS && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			layoutDependency: this.props.layoutDependency,
			onExitComplete: () => this.safeToRemove()
		})), ab.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layoutDependency: t, visualElement: n, drag: r, isPresent: i } = this.props, { projection: a } = n;
		return a ? (a.isPresent = i, e.layoutDependency !== t && a.setOptions({
			...a.options,
			layoutDependency: t
		}), gS = !0, r || e.layoutDependency !== t || t === void 0 || e.isPresent !== i ? a.willUpdate() : this.safeToRemove(), e.isPresent !== i && (i ? a.promote() : a.relegate() || cm.postRender(() => {
			let e = a.getStack();
			(!e || !e.members.length) && this.safeToRemove();
		})), null) : null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), V_.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		gS = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function vS(e) {
	let [t, n] = Wb(), r = (0, b.useContext)(nf);
	return (0, x.jsx)(_S, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, b.useContext)(Sx),
		isPresent: t,
		safeToRemove: n
	});
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/drag.mjs
var yS = {
	pan: { Feature: hS },
	drag: {
		Feature: pS,
		ProjectionNode: Hb,
		MeasureLayout: vS
	}
};
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/hover.mjs
function bS(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && cm.postRender(() => i(t, Ix(t)));
}
var xS = class extends qv {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = J_(e, (e, t) => (bS(this.node, t, "Start"), (e) => bS(this.node, e, "End"))));
	}
	unmount() {}
}, SS = class extends qv {
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
		this.unmount = hf(Qy(this.node.current, "focus", () => this.onFocus()), Qy(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
//#endregion
//#region node_modules/framer-motion/dist/es/gestures/press.mjs
function CS(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && cm.postRender(() => i(t, Ix(t)));
}
var wS = class extends qv {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = sv(e, (e, t) => (CS(this.node, t, "Start"), (e, { success: t }) => CS(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, TS = /* @__PURE__ */ new WeakMap(), ES = /* @__PURE__ */ new WeakMap(), DS = (e) => {
	let t = TS.get(e.target);
	t && t(e);
}, OS = (e) => {
	e.forEach(DS);
};
function kS({ root: e, ...t }) {
	let n = e || document;
	ES.has(n) || ES.set(n, {});
	let r = ES.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(OS, {
		root: e,
		...t
	})), r[i];
}
function AS(e, t, n) {
	let r = kS(t);
	return TS.set(e, n), r.observe(e), () => {
		TS.delete(e), r.unobserve(e);
	};
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var jS = {
	some: 0,
	all: 1
}, MS = class extends qv {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : jS[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = AS(this.node.current, a, o);
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
		].some(NS(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function NS({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
//#endregion
//#region node_modules/framer-motion/dist/es/motion/features/gestures.mjs
var PS = {
	inView: { Feature: MS },
	tap: { Feature: wS },
	focus: { Feature: SS },
	hover: { Feature: xS }
}, FS = { layout: {
	ProjectionNode: Hb,
	MeasureLayout: vS
} }, IS = /*@__PURE__*/ jx({
	...Fx,
	...PS,
	...yS,
	...FS
}, Mx);
//#endregion
//#region node_modules/framer-motion/dist/es/animation/hooks/animation-controls.mjs
function LS(e) {
	e.values.forEach((e) => e.stop());
}
function RS(e, t) {
	[...t].reverse().forEach((n) => {
		let r = e.getVariant(n);
		r && Bg(e, r), e.variantChildren && e.variantChildren.forEach((e) => {
			RS(e, t);
		});
	});
}
function zS(e, t) {
	if (Array.isArray(t)) return RS(e, t);
	if (typeof t == "string") return RS(e, [t]);
	Bg(e, t);
}
function BS() {
	let e = /* @__PURE__ */ new Set(), t = {
		subscribe(t) {
			return e.add(t), () => void e.delete(t);
		},
		start(t, n) {
			let r = [];
			return e.forEach((e) => {
				r.push(Zg(e, t, { transitionOverride: n }));
			}), Promise.all(r);
		},
		set(t) {
			return e.forEach((e) => {
				zS(e, t);
			});
		},
		stop() {
			e.forEach((e) => {
				LS(e);
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
function VS() {
	let e = rf(BS);
	return af(e.mount, []), e;
}
var HS = VS, US = (e) => {
	let { id: t, className: n, background: r, minSize: i, maxSize: a, speed: o, particleColor: s, particleDensity: c } = e, [l, u] = (0, b.useState)(!1);
	(0, b.useEffect)(() => {
		Qi(async (e) => {
			await ju(e);
		}).then(() => {
			u(!0);
		});
	}, []);
	let d = HS(), f = async (e) => {
		e && d.start({
			opacity: 1,
			transition: { duration: 1 }
		});
	}, p = (0, b.useId)();
	return /* @__PURE__ */ (0, x.jsx)(IS.div, {
		animate: d,
		className: tf("opacity-0", n),
		children: l && /* @__PURE__ */ (0, x.jsx)(Zi, {
			id: t || p,
			className: tf("h-full w-full"),
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
}, WS = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function GS(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: WS(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var KS = (e) => {
	let t = "", n = !1;
	for (let r of e) {
		if (r === "-" || r === "_" || r <= " ") {
			n = t.length > 0;
			continue;
		}
		t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1;
	}
	return t;
}, qS = (e) => {
	let t = KS(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, JS = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), YS = {
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
function XS(e) {
	return e != null;
}
function ZS(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? YS.width, a = e.size ?? e.height ?? YS.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? JS(...c) : JS("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? YS["stroke-width"]) * Number(e.size ?? e.width ?? YS.width) / Number(t.size ?? t.width ?? YS.width) : t.strokeWidth ?? YS["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(YS).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && XS(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && XS(t.width) && { [r("width")]: t.width },
			..."height" in t && XS(t.height) && { [r("height")]: t.height },
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
function QS(e, t = {}) {
	return ZS(e, {
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
var $S = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, eC = (0, b.createContext)({}), tC = () => (0, b.useContext)(eC), nC = (0, b.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = tC() ?? {}, y = !!c || $S(d), [x, S, ee = []] = QS(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: JS(v, s),
		hasA11yProp: y,
		attributes: d
	});
	return (0, b.createElement)(x, {
		ref: f,
		...S
	}, [...ee.map(([e, t]) => (0, b.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
//#endregion
//#region node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function rC(e, t = [], n = []) {
	let r = typeof e == "string" ? GS(e, t, n) : e, i = (0, b.forwardRef)(({ className: e, ...t }, n) => (0, b.createElement)(nC, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = qS(r.name)), i;
}
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/arrow-right.mjs
var iC = {
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
iC.node;
var aC = rC(iC), oC = {
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
oC.node;
var sC = rC(oC), cC = {
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
cC.node;
var lC = rC(cC), uC = {
	name: "loader-circle",
	size: 24,
	node: [["path", {
		d: "M21 12a9 9 0 1 1-6.219-8.56",
		key: "13zald"
	}]],
	aliases: ["loader-2"]
};
uC.node;
var dC = rC(uC), fC = {
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
fC.node;
var pC = rC(fC), mC = {
	name: "zap",
	size: 24,
	node: [["path", {
		d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
		key: "1v7up4"
	}]]
};
mC.node;
var hC = rC(mC), gC = ({ onComplete: e, onSkip: t, autoAdvanceDelay: n = 0, className: r = "", showSkipButton: i = !1 }) => {
	let [a, o] = (0, b.useState)(!1), [s, c] = (0, b.useState)(800), l = (0, b.useRef)(!1);
	(0, b.useEffect)(() => {
		let e = () => {
			if (typeof window > "u") return;
			let e = window.innerWidth;
			c(e < 640 ? 320 : e < 1024 ? 600 : 950);
		};
		return e(), window.addEventListener("resize", e, { passive: !0 }), () => window.removeEventListener("resize", e);
	}, []);
	let u = (0, b.useCallback)(() => {
		l.current || (l.current = !0, o(!0), setTimeout(() => {
			typeof e == "function" ? e() : window.location.href = "/login";
		}, 450));
	}, [e]);
	return (0, b.useCallback)(() => {
		l.current || (l.current = !0, typeof t == "function" ? t() : typeof e == "function" ? e() : window.location.href = "/login");
	}, [t, e]), (0, b.useEffect)(() => {
		if (n && n > 0) {
			let e = setTimeout(() => {
				u();
			}, n);
			return () => clearTimeout(e);
		}
	}, [n, u]), /* @__PURE__ */ (0, x.jsxs)("div", {
		className: `epic-think-intro-root relative h-[100dvh] min-h-[100dvh] w-full bg-black text-white flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto sm:overflow-hidden selection:bg-indigo-500 selection:text-white ${r}`,
		role: "region",
		"aria-label": "Epic Think AI Intro",
		children: [
			/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[350px] md:h-[420px] bg-indigo-600/15 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" }),
			/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[380px] md:w-[450px] h-[150px] sm:h-[220px] md:h-[250px] bg-sky-500/15 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none" }),
			/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[420px] md:w-[500px] h-[140px] sm:h-[180px] md:h-[200px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" }),
			/* @__PURE__ */ (0, x.jsxs)("main", {
				className: "relative z-20 flex flex-col items-center justify-center px-4 py-3 sm:py-6 w-full max-w-4xl mx-auto text-center my-auto",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h1", {
						className: "text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight relative z-20 select-none animate-text-chroma transition-all duration-300 pb-1 sm:pb-2 leading-tight",
						children: "Epic Think"
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "w-full max-w-[280px] xs:max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-24 xs:h-28 sm:h-36 md:h-40 relative my-1 sm:my-2",
						children: [
							/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 xs:w-28 sm:w-44 md:w-56 h-[2px] sm:h-[3px] bg-white blur-[0.5px] rounded-full z-10 animate-beam-pulse shadow-[0_0_15px_#fff]" }),
							/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-cyan-300 to-transparent h-[1.5px] w-3/4 animate-beam-pulse" }),
							/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2.5px] sm:h-[3px] w-3/4 blur-[1.5px]" }),
							/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent h-[3px] sm:h-[4px] w-1/3 blur-sm opacity-80" }),
							/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-sky-300 to-transparent h-px w-1/4" }),
							/* @__PURE__ */ (0, x.jsx)(US, {
								background: "transparent",
								minSize: .4,
								maxSize: 1.2,
								particleDensity: s,
								className: "w-full h-full",
								particleColor: "#FFFFFF",
								speed: 1.5
							}),
							/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] pointer-events-none" })
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("p", {
						className: "max-w-xl text-xs xs:text-sm sm:text-base md:text-lg text-neutral-300 font-normal mt-1 sm:mt-2 mb-3 sm:mb-5 leading-relaxed tracking-wide drop-shadow-sm px-2",
						children: [
							"The next-generation",
							" ",
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "text-white font-semibold underline decoration-cyan-400 decoration-2 underline-offset-4",
								children: "autonomous AI agent"
							}),
							" ",
							"built for deep cognitive reasoning, instant execution, and superhuman workflow automation."
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-4 sm:mb-6 text-[10px] xs:text-[11px] sm:text-xs text-neutral-400",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800",
								children: [/* @__PURE__ */ (0, x.jsx)(lC, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "Deep Cognitive Logic" })]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800",
								children: [/* @__PURE__ */ (0, x.jsx)(hC, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "Instant Execution" })]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800",
								children: [/* @__PURE__ */ (0, x.jsx)(sC, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-400" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "Autonomous Decision Engine" })]
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "relative group z-30 inline-block",
						children: [/* @__PURE__ */ (0, x.jsx)("div", { className: "absolute -inset-1 rounded-full blur-xl opacity-80 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-button-chroma" }), /* @__PURE__ */ (0, x.jsx)("div", {
							className: "relative p-[2px] rounded-full animate-button-chroma shadow-2xl",
							children: /* @__PURE__ */ (0, x.jsx)("button", {
								onClick: u,
								disabled: a,
								className: "relative flex items-center gap-2 xs:gap-2.5 sm:gap-3 px-6 py-2.5 xs:px-8 xs:py-3 sm:px-10 sm:py-3.5 rounded-full bg-black/85 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group-hover:bg-black/60 active:scale-95 cursor-pointer border border-white/25 hover:border-white/50 disabled:opacity-80",
								"aria-label": "Get Started with Epic Think AI",
								children: a ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [/* @__PURE__ */ (0, x.jsx)(dC, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-cyan-300" }), /* @__PURE__ */ (0, x.jsx)("span", {
									className: "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]",
									children: "Connecting to Agent..."
								})] }) : /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
									/* @__PURE__ */ (0, x.jsx)(pC, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-300 animate-pulse" }),
									/* @__PURE__ */ (0, x.jsx)("span", {
										className: "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]",
										children: "Get Started"
									}),
									/* @__PURE__ */ (0, x.jsx)(aC, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-300" })
								] })
							})
						})]
					})
				]
			})
		]
	});
}, _C = null;
function vC(e, t = {}) {
	if (_C) {
		try {
			_C.unmount();
		} catch {}
		_C = null;
	}
	let n = y.createRoot(e);
	_C = n, n.render(/* @__PURE__ */ (0, x.jsx)(gC, { ...t }));
}
function yC() {
	if (_C) {
		try {
			_C.unmount();
		} catch {}
		_C = null;
	}
}
typeof window < "u" && (window.EpicThinkIntro = {
	Component: gC,
	mount: vC,
	unmount: yC
});
//#endregion
//#region src/introEntry.ts
function bC(e, t = {}) {
	let n = y.createRoot(e);
	return n.render(b.createElement(Ve, t)), () => n.unmount();
}
//#endregion
export { He as DemoOne, gC as EpicThinkIntro, Ve as MorphOrb, vC as mountEpicThinkIntro, bC as mountMorphOrb, yC as unmountEpicThinkIntro };
