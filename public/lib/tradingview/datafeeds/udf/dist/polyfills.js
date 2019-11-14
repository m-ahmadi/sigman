! function() {
	"use strict";

	function n() {}

	function i(t) {
		if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
		if ("function" != typeof t) throw new TypeError("not a function");
		this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], h(t, this)
	}

	function o(r, n) {
		for (; 3 === r._state;) r = r._value;
		0 !== r._state ? (r._handled = !0, i._immediateFn(function() {
			var t = 1 === r._state ? n.onFulfilled : n.onRejected;
			if (null !== t) {
				var e;
				try {
					e = t(r._value)
				} catch (t) {
					return void a(n.promise, t)
				}
				s(n.promise, e)
			} else(1 === r._state ? s : a)(n.promise, r._value)
		})) : r._deferreds.push(n)
	}

	function s(e, t) {
		try {
			if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
			if (t && ("object" == typeof t || "function" == typeof t)) {
				var r = t.then;
				if (t instanceof i) return e._state = 3, e._value = t, void u(e);
				if ("function" == typeof r) return void h(function(t, e) {
					return function() {
						t.apply(e, arguments)
					}
				}(r, t), e)
			}
			e._state = 1, e._value = t, u(e)
		} catch (t) {
			a(e, t)
		}
	}

	function a(t, e) {
		t._state = 2, t._value = e, u(t)
	}

	function u(t) {
		2 === t._state && 0 === t._deferreds.length && i._immediateFn(function() {
			t._handled || i._unhandledRejectionFn(t._value)
		});
		for (var e = 0, r = t._deferreds.length; e < r; e++) o(t, t._deferreds[e]);
		t._deferreds = null
	}

	function f(t, e, r) {
		this.onFulfilled = "function" == typeof t ? t : null, this.onRejected = "function" == typeof e ? e : null, this.promise = r
	}

	function h(t, e) {
		var r = !1;
		try {
			t(function(t) {
				r || (r = !0, s(e, t))
			}, function(t) {
				r || (r = !0, a(e, t))
			})
		} catch (t) {
			if (r) return;
			r = !0, a(e, t)
		}
	}
	var t, e;
	t = window, e = setTimeout, i.prototype.catch = function(t) {
			return this.then(null, t)
		}, i.prototype.then = function(t, e) {
			var r = new this.constructor(n);
			return o(this, new f(t, e, r)), r
		}, i.all = function(t) {
			var a = Array.prototype.slice.call(t);
			return new i(function(n, o) {
				if (0 === a.length) return n([]);
				var i = a.length;

				function s(e, t) {
					try {
						if (t && ("object" == typeof t || "function" == typeof t)) {
							var r = t.then;
							if ("function" == typeof r) return void r.call(t, function(t) {
								s(e, t)
							}, o)
						}
						a[e] = t, 0 == --i && n(a)
					} catch (t) {
						o(t)
					}
				}
				for (var t = 0; t < a.length; t++) s(t, a[t])
			})
		}, i.resolve = function(e) {
			return e && "object" == typeof e && e.constructor === i ? e : new i(function(t) {
				t(e)
			})
		}, i.reject = function(r) {
			return new i(function(t, e) {
				e(r)
			})
		}, i.race = function(o) {
			return new i(function(t, e) {
				for (var r = 0, n = o.length; r < n; r++) o[r].then(t, e)
			})
		}, i._immediateFn = "function" == typeof setImmediate && function(t) {
			setImmediate(t)
		} || function(t) {
			e(t, 0)
		}, i._unhandledRejectionFn = function(t) {
			"undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t)
		}, i._setImmediateFn = function(t) {
			i._immediateFn = t
		}, i._setUnhandledRejectionFn = function(t) {
			i._unhandledRejectionFn = t
		}, "undefined" != typeof module && module.exports ? module.exports = i : t.Promise || (t.Promise = i),
		function(t) {
			if (!t.fetch) {
				var e = "URLSearchParams" in t,
					r = "Symbol" in t && "iterator" in Symbol,
					s = "FileReader" in t && "Blob" in t && function() {
						try {
							return new Blob, !0
						} catch (t) {
							return !1
						}
					}(),
					n = "FormData" in t,
					o = "ArrayBuffer" in t;
				if (o) var i = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
					a = function(t) {
						return t && DataView.prototype.isPrototypeOf(t)
					},
					u = ArrayBuffer.isView || function(t) {
						return t && -1 < i.indexOf(Object.prototype.toString.call(t))
					};
				y.prototype.append = function(t, e) {
					t = c(t), e = d(e);
					var r = this.map[t];
					this.map[t] = r ? r + "," + e : e
				}, y.prototype.delete = function(t) {
					delete this.map[c(t)]
				}, y.prototype.get = function(t) {
					return t = c(t), this.has(t) ? this.map[t] : null
				}, y.prototype.has = function(t) {
					return this.map.hasOwnProperty(c(t))
				}, y.prototype.set = function(t, e) {
					this.map[c(t)] = d(e)
				}, y.prototype.forEach = function(t, e) {
					for (var r in this.map) this.map.hasOwnProperty(r) && t.call(e, this.map[r], r, this)
				}, y.prototype.keys = function() {
					var r = [];
					return this.forEach(function(t, e) {
						r.push(e)
					}), l(r)
				}, y.prototype.values = function() {
					var e = [];
					return this.forEach(function(t) {
						e.push(t)
					}), l(e)
				}, y.prototype.entries = function() {
					var r = [];
					return this.forEach(function(t, e) {
						r.push([e, t])
					}), l(r)
				}, r && (y.prototype[Symbol.iterator] = y.prototype.entries);
				var f = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
				v.prototype.clone = function() {
					return new v(this, {
						body: this._bodyInit
					})
				}, _.call(v.prototype), _.call(T.prototype), T.prototype.clone = function() {
					return new T(this._bodyInit, {
						status: this.status,
						statusText: this.statusText,
						headers: new y(this.headers),
						url: this.url
					})
				}, T.error = function() {
					var t = new T(null, {
						status: 0,
						statusText: ""
					});
					return t.type = "error", t
				};
				var h = [301, 302, 303, 307, 308];
				T.redirect = function(t, e) {
					if (-1 === h.indexOf(e)) throw new RangeError("Invalid status code");
					return new T(null, {
						status: e,
						headers: {
							location: t
						}
					})
				}, t.Headers = y, t.Request = v, t.Response = T, t.fetch = function(o, i) {
					return new Promise(function(r, t) {
						var e = new v(o, i),
							n = new XMLHttpRequest;
						n.onload = function() {
							var t = {
								status: n.status,
								statusText: n.statusText,
								headers: function(t) {
									var o = new y;
									return t.split(/\r?\n/).forEach(function(t) {
										var e = t.split(":"),
											r = e.shift().trim();
										if (r) {
											var n = e.join(":").trim();
											o.append(r, n)
										}
									}), o
								}(n.getAllResponseHeaders() || "")
							};
							t.url = "responseURL" in n ? n.responseURL : t.headers.get("X-Request-URL");
							var e = "response" in n ? n.response : n.responseText;
							r(new T(e, t))
						}, n.onerror = function() {
							t(new TypeError("Network request failed"))
						}, n.ontimeout = function() {
							t(new TypeError("Network request failed"))
						}, n.open(e.method, e.url, !0), "include" === e.credentials && (n.withCredentials = !0), "responseType" in n && s && (n.responseType = "blob"), e.headers.forEach(function(t, e) {
							n.setRequestHeader(e, t)
						}), n.send(void 0 === e._bodyInit ? null : e._bodyInit)
					})
				}, t.fetch.polyfill = !0
			}

			function c(t) {
				if ("string" != typeof t && (t = String(t)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t)) throw new TypeError("Invalid character in header field name");
				return t.toLowerCase()
			}

			function d(t) {
				return "string" != typeof t && (t = String(t)), t
			}

			function l(e) {
				var t = {
					next: function() {
						var t = e.shift();
						return {
							done: void 0 === t,
							value: t
						}
					}
				};
				return r && (t[Symbol.iterator] = function() {
					return t
				}), t
			}

			function y(e) {
				this.map = {}, e instanceof y ? e.forEach(function(t, e) {
					this.append(e, t)
				}, this) : Array.isArray(e) ? e.forEach(function(t) {
					this.append(t[0], t[1])
				}, this) : e && Object.getOwnPropertyNames(e).forEach(function(t) {
					this.append(t, e[t])
				}, this)
			}

			function p(t) {
				if (t.bodyUsed) return Promise.reject(new TypeError("Already read"));
				t.bodyUsed = !0
			}

			function b(r) {
				return new Promise(function(t, e) {
					r.onload = function() {
						t(r.result)
					}, r.onerror = function() {
						e(r.error)
					}
				})
			}

			function m(t) {
				var e = new FileReader,
					r = b(e);
				return e.readAsArrayBuffer(t), r
			}

			function w(t) {
				if (t.slice) return t.slice(0);
				var e = new Uint8Array(t.byteLength);
				return e.set(new Uint8Array(t)), e.buffer
			}

			function _() {
				return this.bodyUsed = !1, this._initBody = function(t) {
					if (this._bodyInit = t)
						if ("string" == typeof t) this._bodyText = t;
						else if (s && Blob.prototype.isPrototypeOf(t)) this._bodyBlob = t;
					else if (n && FormData.prototype.isPrototypeOf(t)) this._bodyFormData = t;
					else if (e && URLSearchParams.prototype.isPrototypeOf(t)) this._bodyText = t.toString();
					else if (o && s && a(t)) this._bodyArrayBuffer = w(t.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer]);
					else {
						if (!o || !ArrayBuffer.prototype.isPrototypeOf(t) && !u(t)) throw new Error("unsupported BodyInit type");
						this._bodyArrayBuffer = w(t)
					} else this._bodyText = "";
					this.headers.get("content-type") || ("string" == typeof t ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : e && URLSearchParams.prototype.isPrototypeOf(t) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
				}, s && (this.blob = function() {
					var t = p(this);
					if (t) return t;
					if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
					if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
					if (this._bodyFormData) throw new Error("could not read FormData body as blob");
					return Promise.resolve(new Blob([this._bodyText]))
				}, this.arrayBuffer = function() {
					return this._bodyArrayBuffer ? p(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(m)
				}), this.text = function() {
					var t = p(this);
					if (t) return t;
					if (this._bodyBlob) return function(t) {
						var e = new FileReader,
							r = b(e);
						return e.readAsText(t), r
					}(this._bodyBlob);
					if (this._bodyArrayBuffer) return Promise.resolve(function(t) {
						for (var e = new Uint8Array(t), r = new Array(e.length), n = 0; n < e.length; n++) r[n] = String.fromCharCode(e[n]);
						return r.join("")
					}(this._bodyArrayBuffer));
					if (this._bodyFormData) throw new Error("could not read FormData body as text");
					return Promise.resolve(this._bodyText)
				}, n && (this.formData = function() {
					return this.text().then(A)
				}), this.json = function() {
					return this.text().then(JSON.parse)
				}, this
			}

			function v(t, e) {
				var r = (e = e || {}).body;
				if (t instanceof v) {
					if (t.bodyUsed) throw new TypeError("Already read");
					this.url = t.url, this.credentials = t.credentials, e.headers || (this.headers = new y(t.headers)), this.method = t.method, this.mode = t.mode, r || null == t._bodyInit || (r = t._bodyInit, t.bodyUsed = !0)
				} else this.url = String(t);
				if (this.credentials = e.credentials || this.credentials || "omit", !e.headers && this.headers || (this.headers = new y(e.headers)), this.method = function(t) {
						var e = t.toUpperCase();
						return -1 < f.indexOf(e) ? e : t
					}(e.method || this.method || "GET"), this.mode = e.mode || this.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && r) throw new TypeError("Body not allowed for GET or HEAD requests");
				this._initBody(r)
			}

			function A(t) {
				var o = new FormData;
				return t.trim().split("&").forEach(function(t) {
					if (t) {
						var e = t.split("="),
							r = e.shift().replace(/\+/g, " "),
							n = e.join("=").replace(/\+/g, " ");
						o.append(decodeURIComponent(r), decodeURIComponent(n))
					}
				}), o
			}

			function T(t, e) {
				e = e || {}, this.type = "default", this.status = "status" in e ? e.status : 200, this.ok = 200 <= this.status && this.status < 300, this.statusText = "statusText" in e ? e.statusText : "OK", this.headers = new y(e.headers), this.url = e.url || "", this._initBody(t)
			}
		}("undefined" != typeof self ? self : window)
}();