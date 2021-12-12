! function(e) {
    var n = {};

    function __webpack_require__(r) {
        if (n[r]) return n[r].exports;
        var t = n[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(t.exports, t, t.exports, __webpack_require__), t.l = !0, t.exports
    }
    __webpack_require__.m = e, __webpack_require__.c = n, __webpack_require__.d = function(e, n, r) {
        __webpack_require__.o(e, n) || Object.defineProperty(e, n, {
            enumerable: !0,
            get: r
        })
    }, __webpack_require__.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, __webpack_require__.t = function(e, n) {
        if (1 & n && (e = __webpack_require__(e)), 8 & n) return e;
        if (4 & n && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (__webpack_require__.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & n && "string" != typeof e)
            for (var t in e) __webpack_require__.d(r, t, (function(n) {
                return e[n]
            }).bind(null, t));
        return r
    }, __webpack_require__.n = function(e) {
        var n = e && e.__esModule ? function getDefault() {
            return e.default
        } : function getModuleExports() {
            return e
        };
        return __webpack_require__.d(n, "a", n), n
    }, __webpack_require__.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n)
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 241)
}({
    0: function(e, n, r) {
        var t = r(2);
        r.d(n, "e", (function() {
            return t.c
        })), r.d(n, "d", (function() {
            return t.b
        }));
        var o = r(10);
        r.d(n, "c", (function() {
            return o.a
        }));
        var a = r(26);
        r.d(n, "a", (function() {
            return a.a
        }));
        var u = r(39);
        r.d(n, "b", (function() {
            return u.a
        }))
    },
    10: function(e, n, r) {
        var t = r(2);
        r.d(n, "a", (function() {
            return t.a
        }))
    },
    12: function(e, n, r) {
        r(22), r(18);
        var t = r(0);
        r.d(n, "a", (function() {
            return t.c
        })), r.d(n, "b", (function() {
            return t.e
        }));
        r(23)
    },
    14: function(e, n, r) {
        r.d(n, "a", (function() {
            return u
        }));
        r(22);

        function _toConsumableArray(e) {
            return function _arrayWithoutHoles(e) {
                if (Array.isArray(e)) return _arrayLikeToArray(e)
            }(e) || function _iterableToArray(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || function _unsupportedIterableToArray(e, n) {
                if (!e) return;
                if ("string" == typeof e) return _arrayLikeToArray(e, n);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return _arrayLikeToArray(e, n)
            }(e) || function _nonIterableSpread() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function _arrayLikeToArray(e, n) {
            (null == n || n > e.length) && (n = e.length);
            for (var r = 0, t = new Array(n); r < n; r++) t[r] = e[r];
            return t
        }

        function _typeof(e) {
            return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(e) {
                return typeof e
            } : function _typeof(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        var t, o = r(56).v4,
            a = r(57),
            u = {
                debounce: function debounce(e, n, r) {
                    var t;
                    return function() {
                        var o = this,
                            a = arguments,
                            u = function later() {
                                t = null, r || e.apply(o, a)
                            },
                            s = r && !t;
                        clearTimeout(t), t = setTimeout(u, n), s && e.apply(o, a)
                    }
                },
                getURLParam: function getURLParam(e, n) {
                    return this.safe((function() {
                        return new URL(e).searchParams.get(n)
                    }))
                },
                throttle: function throttle(e, n, r) {
                    var t, o, a, u, s = 0;
                    r || (r = {});
                    var c = function later() {
                            s = !1 === r.leading ? 0 : (new Date).getTime(), t = null, u = e.apply(o, a), t || (o = a = null)
                        },
                        l = function throttled() {
                            var l = (new Date).getTime();
                            s || !1 !== r.leading || (s = l);
                            var m = n - (l - s);
                            return o = this, a = arguments, m <= 0 || m > n ? (t && (clearTimeout(t), t = null), s = l, u = e.apply(o, a), t || (o = a = null)) : t || !1 === r.trailing || (t = setTimeout(c, m)), u
                        };
                    return l.cancel = function() {
                        clearTimeout(t), s = 0, t = o = a = null
                    }, l
                },
                serialize: function serialize(e) {
                    if (e) {
                        if ("string" == typeof e) return encodeURIComponent(e);
                        if ("object" === _typeof(e)) {
                            var n = "";
                            for (var r in e) e.hasOwnProperty(r) && void 0 !== e[r] && (n && (n += "&"), n += encodeURIComponent(r) + "=" + encodeURIComponent(e[r]));
                            return n
                        }
                        throw "Unsupported object type"
                    }
                    return ""
                },
                isNotEmptyArray: function isNotEmptyArray(e) {
                    return Array.isArray(e) && !!e.length
                },
                map: function map(e, n) {
                    if (!e || !e.length) return {};
                    var r = {};
                    return e.forEach((function(e) {
                        return r["string" == typeof n ? e[n] : n(e)] = e
                    })), r
                },
                formatDate: function formatDate(e) {
                    var n = e ? new Date(e) : new Date,
                        r = n.getDate();
                    return n.getMonth() + 1 + "/" + r + "/" + n.getFullYear()
                },
                formatLocalDate: function formatLocalDate(e) {
                    var n = new Date(e),
                        r = 6e4 * n.getTimezoneOffset();
                    return new Date(n - r).toISOString().substring(0, 10)
                },
                deleteParams: function deleteParams(e) {
                    var n = e.indexOf("?");
                    return n > 0 && (e = e.substring(0, n)), e
                },
                left: function left(e, n) {
                    if (!e || !n) return e;
                    var r = e.indexOf(n);
                    return r >= 0 ? e.substring(0, r) : e
                },
                containsOne: function containsOne(e) {
                    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++) r[t - 1] = arguments[t];
                    if (!e || !r || 0 == r.length) return !1;
                    for (var o = 0, a = r; o < a.length; o++) {
                        var u = a[o];
                        if (e.indexOf(u) >= 0) return !0
                    }
                    return !1
                },
                containsAll: function containsAll(e) {
                    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++) r[t - 1] = arguments[t];
                    if (!e || !r || 0 == r.length) return !1;
                    for (var o = 0, a = r; o < a.length; o++) {
                        var u = a[o];
                        if (e.indexOf(u) < 0) return !1
                    }
                    return !0
                },
                getParameter: function getParameter(e) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.location.href;
                    if (e && n) {
                        var r = ((n = new URL(n.startsWith("/") ? "https://www.amazon.com" + n : n)).searchParams || new URLSearchParams(n.search.substr(1))).get(e);
                        return r || void 0
                    }
                },
                getAmazonQueryParameter: function getAmazonQueryParameter(e) {
                    return this.getParameter("field-keywords", e) || this.getParameter("k", e)
                },
                getAmazonCategoryParameter: function getAmazonCategoryParameter(e) {
                    return this.getParameter("i", e)
                },
                getAmazonFilterParameter: function getAmazonFilterParameter(e) {
                    return this.getParameter("rh", e)
                },
                hasParam: function hasParam(e, n) {
                    var r = this;
                    return !!n.first((function(e) {
                        return r.getParameter(e)
                    }))
                },
                array: function array(e) {
                    for (var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function(e) {
                            return e
                        }, r = [], t = 0; t < e; ++t) r.push(n(t));
                    return r
                },
                objectToArray: function objectToArray(e, n) {
                    return e && n ? Object.keys(e).map((function(r) {
                        return n(r, e[r])
                    })) : []
                },
                objectToString: function objectToString(e, n, r) {
                    return this.objectToArray(e, n).join(r)
                },
                arrayToObject: function arrayToObject(e, n, r) {
                    if (!n || !e || !e.length) return {};
                    r || (r = function valueMapper(e) {
                        return e
                    });
                    var t = {};
                    return e.forEach((function(e) {
                        var o = n(e);
                        t[o] = r(e)
                    })), t
                },
                repeat: function repeat(e, n, r) {
                    var t = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
                        o = this;
                    return r <= 0 ? Promise.reject() : new Promise((function(a, u) {
                        function schedule() {
                            setTimeout((function() {
                                return o.repeat(e, n, r - 1).then(a, u)
                            }), n)
                        }
                        if (t) try {
                            e().then(a, schedule)
                        } catch (s) {
                            u(s)
                        } else schedule()
                    }))
                },
                md5: function md5(e) {
                    return a(e)
                },
                updateParameter: function updateParameter(e, n, r) {
                    var t = new RegExp("([?&])" + n + "=.*?(&|$)", "i"),
                        o = -1 !== e.indexOf("?") ? "&" : "?";
                    return e.match(t) ? e.replace(t, "$1" + n + "=" + r + "$2") : e + o + n + "=" + r
                },
                escapeHTML: function escapeHTML(e) {
                    return e ? e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
                },
                safe: function safe(e, n) {
                    var r;
                    try {
                        r = e()
                    } catch (t) {
                        r = n
                    }
                    return r
                },
                number: function number(e) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                    return isNaN(e) ? n : Number(e)
                },
                isEmpty: function isEmpty(e) {
                    return "number" == typeof e ? isNaN(e) : !Boolean(e)
                },
                toNumber: function toNumber(e) {
                    if (!e) return Number.NaN;
                    for (var n, r, t = 0; t < e.length; ++t) {
                        var o = e[e.length - t - 1];
                        if (isNaN(parseInt(o))) {
                            if (t >= 3) {
                                r = o;
                                break
                            }
                            n = o
                        }
                    }
                    return r && (e = e.replace(new RegExp("\\" + r, "g"), "")), n && (e = e.replace(n, ".")), Number(e)
                },
                last: function last(e) {
                    return e && e.length ? e[e.length - 1] : null
                },
                unique: function unique(e, n) {
                    if (!e || !e.length || !n) return e;
                    for (var r = new Map, t = 0; t < e.length; ++t) {
                        var o = e[t];
                        if (o) {
                            var a = n ? o[n] : o;
                            r.has(a) || r.set(a, o)
                        }
                    }
                    return Array.from(r.values())
                },
                parseUrlParams: function parseUrlParams(e) {
                    if (!e) return null;
                    var n = {},
                        r = e.indexOf("?");
                    return (r >= 0 ? e.substring(r + 1) : e).split("&").forEach((function(e) {
                        var r = e.split("=");
                        n[r[0]] = decodeURIComponent(r[1])
                    })), n
                },
                sum: function sum(e) {
                    return e ? "number" == typeof e ? e : Object.keys(e).map((function(n) {
                        return e[n]
                    })).filter((function(e) {
                        return !isNaN(e)
                    })).map((function(e) {
                        return Number(e)
                    })).reduce((function(e, n) {
                        return e + n
                    }), null) : null
                },
                clone: function clone(e) {
                    if (null == e || "object" !== _typeof(e)) return e;
                    var n = e.constructor();
                    for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
                    return n
                },
                copy: function copy(e, n) {
                    if (null == e || "object" !== _typeof(e)) return e;
                    var copy = e.constructor();
                    for (var r in e) e.hasOwnProperty(r) && n.indexOf(r) >= 0 && (copy[r] = e[r]);
                    return copy
                },
                exclude: function exclude(e) {
                    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++) r[t - 1] = arguments[t];
                    return Object.keys(e).forEach((function(n) {
                        return r.indexOf(n) >= 0 && delete e[n]
                    })), e
                },
                minmax: function minmax(e, n, r) {
                    return this.min(this.max(e, r), n)
                },
                min: function min() {
                    var e = arguments;
                    return this.safe((function() {
                        return Array.prototype.slice.call(e).filter((function(e) {
                            return null != e
                        })).reduce((function(e, n) {
                            return e < n ? e : n
                        }))
                    }))
                },
                max: function max() {
                    var e = arguments;
                    return this.safe((function() {
                        return Array.prototype.slice.call(e).filter((function(e) {
                            return null != e
                        })).reduce((function(e, n) {
                            return e > n ? e : n
                        }))
                    }))
                },
                toCamelCase: function toCamelCase(e) {
                    for (var n = 0, r = "", t = 0; t < e.length; ++t) {
                        var o = e[t];
                        switch (n) {
                            case 0:
                                this.isLatinLetter(o) || this.isDigit(o) ? r += o : n = 1;
                                break;
                            case 1:
                                (this.isLatinLetter(o) || this.isDigit(o)) && (r += o.toUpperCase(), n = 0)
                        }
                    }
                    return r
                },
                rand: function rand(e, n) {
                    return Math.round(Math.random() * (n - e) + e)
                },
                randomElement: function randomElement(e) {
                    return e && e.length > 0 ? e[this.rand(0, e.length - 1)] : null
                },
                randomElements: function randomElements(e, n) {
                    var r = null == e ? 0 : e.length;
                    if (!r || n < 1) return [];
                    n = n > r ? r : n;
                    for (var t = -1, o = e.slice(); ++t < n;) {
                        var a = t + Math.floor(Math.random() * (r - t)),
                            u = o[a];
                        o[a] = o[t], o[t] = u
                    }
                    return o.slice(0, n)
                },
                replace: function replace(e, n) {
                    return Object.keys(n).forEach((function(r) {
                        return e = e.replace(r, n[r])
                    })), e
                },
                cookies: function cookies(e, n) {
                    var r = (e || "").split(";").map((function(e) {
                        return e.trim()
                    }));
                    return this.arrayToObject(n ? r.filter(n) : r, (function(e) {
                        return e.substring(0, e.indexOf("="))
                    }), (function(e) {
                        return e.substring(e.indexOf("=") + 1)
                    }))
                },
                isPromise: function isPromise(e) {
                    return null != e && "function" == typeof e.then
                },
                cookie: function cookie(e) {
                    return this.cookies(document.cookie)[e]
                },
                setCookie: function setCookie(e, n, r) {
                    var t = (r = r || {}).expires;
                    if ("number" == typeof t && t) {
                        var o = new Date;
                        o.setTime(o.getTime() + 1e3 * t), t = r.expires = o
                    }
                    t && t.toUTCString && (r.expires = t.toUTCString()), console.log(r.expires);
                    var a = e + "=" + (n = encodeURIComponent(n));
                    for (var u in r) {
                        a += "; " + u;
                        var s = r[u];
                        !0 !== s && (a += "=" + s)
                    }
                    document.cookie = a
                },
                randomCode: function randomCode(e) {
                    var n = this,
                        r = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    return this.array(e).map((function() {
                        return r[n.rand(0, r.length - 1)]
                    })).join("")
                },
                uuid: (t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), function(e, n) {
                    var r = t,
                        o = [];
                    if (n = n || r.length, e)
                        for (var a = 0; a < e; a++) o[a] = r[0 | Math.random() * n];
                    else {
                        var u;
                        o[8] = o[13] = o[18] = o[23] = "-", o[14] = "4";
                        for (var s = 0; s < 36; s++) o[s] || (u = 0 | 16 * Math.random(), o[s] = r[19 == s ? 3 & u | 8 : u])
                    }
                    return o.join("")
                }),
                uuidv4: function uuidv4() {
                    return o()
                },
                isLatinLetter: function isLatinLetter(e) {
                    return e >= "a" && e <= "z" || e >= "A" && e <= "Z"
                },
                isDigit: function isDigit(e) {
                    return e >= "0" && e <= "9"
                },
                filter: function filter(e) {
                    var n = this,
                        filter = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function(e) {
                            return n.nonEmpty(e)
                        };
                    return Array.isArray(e) ? e.filter(filter) : Object.keys(e).filter((function(n) {
                        return filter(e[n], n)
                    })).toObject((function(e) {
                        return e
                    }), (function(n) {
                        return e[n]
                    }))
                },
                empty: function empty(e) {
                    return null == e || void 0 !== e.length && 0 === e.length || "object" === _typeof(e) && 0 === Object.keys(e).length
                },
                nonEmpty: function nonEmpty(e) {
                    return !this.empty(e)
                },
                money: function money(e) {
                    return isNaN(e) ? void 0 : Math.ceil(100 * e - .001) / 100
                },
                isAmazonCategoryUrl: function isAmazonCategoryUrl(e) {
                    return /https?:\/\/(www|smile)\.amazon\.[\w.]+\/([\w\d\-%]+\/)?b[/?]/.test(e)
                },
                isAmazonAuthorUrl: function isAmazonAuthorUrl(e) {
                    return this.isAmazonUrl(e) && /\/e\/((:?B[A-Z\d]{9})|(:?\d{9}[A-Z\d]))($|\/|\?)/.test(e)
                },
                isAmazonDealsUrl: function isAmazonDealsUrl(e) {
                    return /https?:\/\/(www|smile)\.amazon\.[\w.]+\/sales-deals-[\w\d\-%]+($|\/|\?)/i.test(e)
                },
                isAmazonGoldBoxUrl: function isAmazonGoldBoxUrl(e) {
                    return /https?:\/\/(www|smile)\.amazon\.[\w.]+\/gp\/goldbox($|\/|\?)/i.test(e)
                },
                isAmazonSearchUrl: function isAmazonSearchUrl(e) {
                    return this.isAmazonUrl(e) && (/\/s[\/?]/.test(e) || /\/search\//.test(e))
                },
                replaceAmazonImages: function replaceAmazonImages(e) {
                    return e && e.replace(/src=("https:\/\/(m.)?(images|media)[\w\d\-.]+amazon.[\w.]+\/images\/[\w\d+\-%&.,_/]+")/gi, "_src=$1")
                },
                isAmazonAbsoluteUrl: function isAmazonAbsoluteUrl(e) {
                    return /https?:\/\/(www|smile)\.amazon\.[\w.]+/.test(e)
                },
                getAmazonHost: function getAmazonHost(e) {
                    var n = e.match(/https?:\/\/(www|smile)\.amazon\.[\w.]+/);
                    return n ? n[0] : ""
                },
                isAmazonUrl: function isAmazonUrl(e) {
                    return /^https?:\/\/(www|smile)\.amazon\.[\w.]{2,6}\//.test(e.trim())
                },
                isAmazonShopURL: function isAmazonShopURL(e) {
                    return e && this.isAmazonUrl(e) && /\/l\/\d{8,16}(\/|\?|$)/.test(e)
                },
                isMostWishedURL: function isMostWishedURL(e) {
                    return e && this.isAmazonUrl(e) && /\/most-wished-for\/|\/most-gifted\//.test(e)
                },
                isAmazonProductUrl: function isAmazonProductUrl(e) {
                    return this.isAmazonUrl(e) && !/\/stores\/node\//.test(e) && !this.isAmazonShopURL(e) && !this.isMostWishedURL(e) && !this.isAmazonBestSellersUrl(e) && /(\/((B[A-Z\d]{9})|(\d{9}[A-Z\d]))($|\/|\?))|(\/dp\/((B[A-Z\d]{9})|(\d{9}[A-Z\d])))/.test(e)
                },
                getASIN: function getASIN(e) {
                    return this.safe((function() {
                        return e.match(/\/((:?B[A-Z\d]{9})|(:?\d{9}[A-Z\d]))($|\/|\?)/)[1]
                    }))
                },
                isAmazonBestSellersUrl: function isAmazonBestSellersUrl(e) {
                    return this.isAmazonUrl(e) && /\/(best-sellers|bestsellers)/i.test(e)
                },
                getSearchUrl: function getSearchUrl(e) {
                    return "https://".concat(document.location.hostname, "/s?field-keywords=").concat(encodeURIComponent(e))
                },
                getProductUrl: function getProductUrl(e) {
                    return "https://www.amazon.".concat(e.domain.toLowerCase().replace("_", "."), "/dp/").concat(e.asin)
                },
                getOfferListingUrl: function getOfferListingUrl(e) {
                    return "https://www.amazon.".concat(e.domain.toLowerCase().replace("_", "."), "/gp/offer-listing/").concat(e.asin)
                },
                isAsin: function isAsin(e) {
                    return /^(B[A-Z\d]{9})|(\d{9}[A-Z\d])/.test(e)
                },
                getAmazonDomainEnum: function getAmazonDomainEnum(e) {
                    if (!e) return "";
                    var n = e.match(/amazon\.([\w.]+)/);
                    if (!n || !n[1]) return "";
                    var r = n[1].replace(/\./g, "_").toUpperCase();
                    return "_" === r[r.length - 1] ? r.slice(0, -1) : r
                },
                getAmazonHostByEnum: function getAmazonHostByEnum(e) {
                    return "https://www.amazon." + e.toLowerCase().replace("_", ".")
                },
                getAmazonTLD: function getAmazonTLD(e) {
                    return e.match(/(?:www|smile).amazon(?:\.\w+)?\.(\w+)/)[1]
                },
                parse: function parse(e) {
                    return (new DOMParser).parseFromString(e, "text/html")
                },
                eval: function _eval(e, n) {
                    return new Function("(function() {" + e + "}).call(this)").call(n)
                },
                merge: function merge(e, n) {
                    return e || n ? e ? n ? (Object.keys(n).forEach((function(r) {
                        void 0 !== n[r] && null != n[r] && (e[r] = n[r])
                    })), e) : e : n : null
                },
                watch: function watch(e, n, r) {
                    var t = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 200;

                    function run() {
                        var t = e();
                        r !== t && (r = t, n())
                    }
                    return setInterval(run, t)
                },
                level: function level(e, n) {
                    return this.safe((function() {
                        return e.map((function(r, t) {
                            return r >= n || t === e.length - 1 ? t + 1 : -1
                        })).filter((function(e) {
                            return e > 0
                        }))[0]
                    }))
                },
                hashCode: function hashCode(e) {
                    if (!e) return 0;
                    for (var n = 0, r = 0; n < e.length; n++) r = Math.imul(31, r) + e.charCodeAt(n) | 0;
                    return h
                },
                throwDice: function throwDice(e) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
                    if (!e) return !1;
                    if ("string" == typeof e) e = this.hashCode(e);
                    else if ("number" != typeof e) throw "Unsupported object type";
                    return e % n == 0
                },
                preloadImage: function preloadImage(e) {
                    return e ? new Promise((function(n, r) {
                        var t = new Image;
                        t.onload = n, t.onerror = r, t.src = e
                    })) : Promise.reject()
                },
                getUILanguage: function getUILanguage() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                        n = localStorage.getItem("AMZlocaleLang");
                    return n || (n = chrome.i18n.getUILanguage()), n && n.length >= 2 ? e ? n : n.substr(0, 2) : navigator.language
                },
                daysBetween: function daysBetween(e, n) {
                    if (!e || !n) return -1;
                    var r = e < n ? n - e : e - n;
                    return Math.floor(r / 864e5)
                },
                between: function between(e, n, r) {
                    return void 0 !== e && void 0 !== n && void 0 !== r && e >= n && e < r
                },
                msToTimeObject: function msToTimeObject(e) {
                    var n = function pad(e) {
                            return ("0" + e).slice(-2)
                        },
                        r = e % 1e3,
                        t = (e = (e - r) / 1e3) % 60,
                        o = (e = (e - t) / 60) % 60,
                        a = (e - o) / 60;
                    return !(e < 0 || o < 0 || a < 0 || r < 0) && {
                        h1: n(a)[0],
                        h2: n(a)[1],
                        m1: n(o)[0],
                        m2: n(o)[1],
                        s1: n(t)[0],
                        s2: n(t)[1]
                    }
                },
                addDays: function addDays(e, n) {
                    var r = new Date(e);
                    return r.setDate(r.getDate() + n), r
                },
                extsrc: function extsrc(e) {
                    return "chrome-extension://".concat(chrome.runtime.id, "/").concat(e)
                },
                remove: function remove(e, n) {
                    Object.keys(e).forEach((function(r) {
                        n(r) || delete e[r]
                    }))
                },
                getPageKey: function getPageKey() {
                    for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.location.href, n = this.getParameter("field-keywords", e) || this.getParameter("k", e) || this.getParameter("i", e) || this.getParameter("node", e), r = a(n), t = 0, o = 0; o < r.length; ++o) t += r.charCodeAt(o);
                    return t
                },
                loadIFrame: function loadIFrame(e, n) {
                    e.style.display = "none", e.onerror = e.onabort = function() {
                        return e.src = ""
                    }, e.src = n, document.body.append(e);
                    try {
                        return e.contentWindow
                    } catch (r) {
                        return e.contentWindow
                    }
                },
                formatTld: function formatTld(e) {
                    return {
                        uk: "co_uk",
                        jp: "co_jp",
                        mx: "com_mx",
                        au: "com_au",
                        br: "com_br"
                    } [e] || e
                },
                addScriptToDOM: function addScriptToDOM(e, n) {
                    var r = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                        t = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : document.head;
                    return document.getElementById(n) ? Promise.resolve() : new Promise((function(o) {
                        var a = document.createElement("script");
                        a.src = e, a.id = n, a.async = r, a.onload = o, t.appendChild(a)
                    }))
                },
                avgByWeight: function avgByWeight(e) {
                    var n = e.filter((function(e) {
                        return void 0 !== e
                    }));
                    return n.map((function(e) {
                        return e.value * e.weight
                    })).sum() / n.map((function(e) {
                        return e.weight
                    })).sum()
                },
                countPersentGrow: function countPersentGrow(e, n) {
                    return (e - n) / n * 100
                },
                getDominantCategoryName: function getDominantCategoryName(e) {
                    for (var n, r = e.filter((function(e) {
                            return e.categories && e.categories.length
                        })).map((function(e) {
                            return e.categories[e.categories.length - 1].name
                        })), t = _toConsumableArray(new Set(r)).map((function(e) {
                            return [e, r.join("").split(e).length - 1]
                        })), o = 0, a = 0; a < t.length; a++) t[a][1] > o && (o = t[a][1], n = t[a][0]);
                    return n
                },
                getIdByName: function getIdByName(e) {
                    return {
                        CALC_EXT: "dkgjopcolgcafhnicdahjemapkniikeh",
                        SCOUT_EXT_PRO: "njopapoodmifmcogpingplfphojnfeea",
                        QUICK_VIEW_EXT: "pggamokfileohlopdonjmelbbghhnlah",
                        STOCK_STATS_EXT: "liobflkelkokkacdemhmgkbpefgaekkm",
                        KW_TRACKER_EXT: "fgkhimnkbaccbhigaeoggfbmggdidjjj",
                        OA_EXT: "edkgpjhfpfpgkohafpaliolcfnijnibh"
                    } [e] || void 0
                },
                hasExtension: function hasExtension(e, n, r) {
                    var t = new Image;
                    t.src = "chrome-extension://" + e + "/" + n, t.onload = function() {
                        return r(1)
                    }, t.onerror = function() {
                        return r(0)
                    }
                },
                getToolsList: function getToolsList() {
                    return ["OA_EXT", "KW_TRACKER_EXT", "STOCK_STATS_EXT", "QUICK_VIEW_EXT", "CALC_EXT", "SCOUT_EXT_PRO"]
                },
                getToolWeight: function getToolWeight(e) {
                    return this.getToolsList().indexOf(e)
                },
                getImagePath: function getImagePath(e) {
                    return {
                        CALC_EXT: "img/16.png",
                        SCOUT_EXT_PRO: "images/38.png",
                        QUICK_VIEW_EXT: "images/logo/16.png",
                        STOCK_STATS_EXT: "img/48.png",
                        KW_TRACKER_EXT: "images/16.png",
                        OA_EXT: "images/logo/16.png"
                    } [e] || void 0
                },
                canShowAds: function canShowAds(e) {
                    var n = this,
                        r = this.getToolsList() || [],
                        t = [],
                        o = 0;
                    return r.forEach((function(e) {
                        var r = n.getIdByName(e),
                            a = new Promise((function(t) {
                                var a = n.getImagePath(e);
                                n.hasExtension(r, a, (function(r) {
                                    if (r) {
                                        var a = n.getToolWeight(e);
                                        o = o < a ? a : o
                                    }
                                    t()
                                }))
                            }));
                        t.push(a)
                    })), Promise.wait(t).then((function() {
                        return n.getToolWeight(e) >= o
                    }))
                },
                getBrowser: function getBrowser() {
                    var e = "other",
                        n = window.navigator.userAgent.toLowerCase();
                    return n.indexOf("edge") > -1 || n.indexOf("edg") > -1 ? e = "edge" : n.indexOf("opr") > -1 && window.opr ? e = "opera" : n.indexOf("chrome") > -1 && window.chrome ? e = "chrome" : n.indexOf("trident") > -1 ? e = "ie" : n.indexOf("firefox") > -1 ? e = "firefox" : n.indexOf("safari") > -1 && (e = "safari"), e
                },
                normalizeUrlAfterHelium: function normalizeUrlAfterHelium(e) {
                    if (-1 !== e.indexOf('"id""') && (e = e.replace(/{"id""/g, "").replace(/}/g, "").replace(/"/g, "")), -1 !== e.indexOf(",linkParameters")) {
                        var n = e.split(",");
                        e = n[0]
                    }
                    return e
                }
            }
    },
    17: function(e, n, r) {
        var t = r(7);
        n.a = function parse(e) {
            if (!Object(t.a)(e)) throw TypeError("Invalid UUID");
            var n, r = new Uint8Array(16);
            return r[0] = (n = parseInt(e.slice(0, 8), 16)) >>> 24, r[1] = n >>> 16 & 255, r[2] = n >>> 8 & 255, r[3] = 255 & n, r[4] = (n = parseInt(e.slice(9, 13), 16)) >>> 8, r[5] = 255 & n, r[6] = (n = parseInt(e.slice(14, 18), 16)) >>> 8, r[7] = 255 & n, r[8] = (n = parseInt(e.slice(19, 23), 16)) >>> 8, r[9] = 255 & n, r[10] = (n = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, r[11] = n / 4294967296 & 255, r[12] = n >>> 24 & 255, r[13] = n >>> 16 & 255, r[14] = n >>> 8 & 255, r[15] = 255 & n, r
        }
    },
    18: function(e, n, r) {
        r.d(n, "a", (function() {
            return t
        }));
        var t = {
            SEND_PRODUCTS: 17,
            REQUEST_PERMISSIONS: 20,
            GET_DOC: 31,
            PAYMENT_SUCCESS: 40,
            PRODUCT_CHANGED: 200,
            NEW_KWT_DATA: 201,
            LOAD_STAT: 202,
            INSTALL: 203,
            PING: 300,
            SIGN_OUT: 301,
            ABORT_PARSER: 302,
            SETUP_MINDBOX: 31
        }
    },
    19: function(e, n, r) {
        var t;
        r.d(n, "a", (function() {
            return rng
        }));
        var o = new Uint8Array(16);

        function rng() {
            if (!t && !(t = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
            return t(o)
        }
    },
    2: function(e, n, r) {
        r(22);
        var t = r(14);
        r.d(n, "c", (function() {
            return t.a
        }));
        var o = r(37);
        r.d(n, "b", (function() {
            return o.a
        }));
        var a = r(38);
        r.d(n, "a", (function() {
            return a.a
        }))
    },
    20: function(e, n, r) {
        var t = r(6),
            o = r(17);
        n.a = function(e, n, r) {
            function generateUUID(e, a, u, s) {
                if ("string" == typeof e && (e = function stringToBytes(e) {
                        e = unescape(encodeURIComponent(e));
                        for (var n = [], r = 0; r < e.length; ++r) n.push(e.charCodeAt(r));
                        return n
                    }(e)), "string" == typeof a && (a = Object(o.a)(a)), 16 !== a.length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
                var c = new Uint8Array(16 + e.length);
                if (c.set(a), c.set(e, a.length), (c = r(c))[6] = 15 & c[6] | n, c[8] = 63 & c[8] | 128, u) {
                    s = s || 0;
                    for (var l = 0; l < 16; ++l) u[s + l] = c[l];
                    return u
                }
                return Object(t.a)(c)
            }
            try {
                generateUUID.name = e
            } catch (a) {}
            return generateUUID.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", generateUUID.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", generateUUID
        }
    },
    22: function(e, n, r) {
        r(51), r(52), r(53), r(54), r(55)
    },
    23: function(e, n, r) {
        r.d(n, "a", (function() {
            return t
        }));
        var t = ["pggamokfileohlopdonjmelbbghhnlah", "njopapoodmifmcogpingplfphojnfeea", "edkgpjhfpfpgkohafpaliolcfnijnibh"]
    },
    241: function(e, n, r) {
        r.r(n);
        r(242);
        var t = r(12);
        var o = !1,
            a = chrome.storage.local,
            u = ["com", "ca", "co.uk", "com.mx", "de", "it", "es", "fr", "in", "co.jp", "com.au"],
            s = "https://www.amazon.com/dp/B08CXQR6CM";
        chrome.tabs.query({
            currentWindow: !0,
            active: !0
        }, (function(e) {
            c("query", e[0])
        })), chrome.tabs.onActivated.addListener((function(e) {
            var n = e.tabId;
            chrome.tabs.get(n, (function(e) {
                c("onActivated", e)
            }))
        }));
        var c = function reactToEvent(e, n) {
                n && n.url && (/(www|smile)\.amazon\.[a-z.]+/i.test(n.url) ? chrome.browserAction.setPopup({
                    popup: "splash.html"
                }) : (chrome.browserAction.setPopup({
                    popup: ""
                }), !o && l(), o = !0))
            },
            l = function addEventListeneronClicked() {
                chrome.browserAction.onClicked.addListener((function(e) {
                    m(e.url, e), chrome.browserAction.setPopup({
                        popup: "splash.html"
                    })
                }))
            },
            m = function openExt(e, n) {
                var r = "";
                t.b.isAmazonUrl(e) ? a.get(["ready"], (function(o) {
                    if (t.b.getASIN(e)) {
                        var s = e.match(/www\.amazon\.([\w.]+)/)[1].toLowerCase();
                        u.includes(s) ? (a.set(function _defineProperty(e, n, r) {
                            return n in e ? Object.defineProperty(e, n, {
                                value: r,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }) : e[n] = r, e
                        }({}, "lastPageUrl", e)), o.ready ? chrome.tabs.sendMessage(n.id, {
                            name: "CALC_EXT",
                            action: "popup:open"
                        }) : a.set({
                            open: !0
                        }), chrome.runtime.sendMessage({
                            action: "close"
                        })) : (r = function i(e) {
                            return chrome.i18n.getMessage(e)
                        }("unsupportedDomainErr"), chrome.runtime.sendMessage({
                            message: r,
                            action: "error"
                        }))
                    } else d(n.id, void 0)
                })) : d(n.id, void 0)
            },
            h = function openPage(e, n) {
                var r = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                a.set({
                    open: r
                }), Object(t.a)(n, "GET", {}).then((function(e) {
                    chrome.tabs.create({
                        url: n
                    })
                })).catch((function(e) {
                    404 === e.status && chrome.tabs.create({
                        url: s
                    })
                }))
            },
            d = function openLastPage(e) {
                var n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                a.get(["lastPageUrl"], (function(r) {
                    r.lastPageUrl ? h(e, r.lastPageUrl, n) : h(e, s, n)
                }))
            };
        chrome.runtime.onMessage.addListener((function(e) {
            var n = e.url,
                r = e.tab,
                t = e.action;
            t && "openExt" === t ? m(n, r) : t && "buy" === t ? d(r.id, t) : t && "popup:buy" === t && chrome.tabs.sendMessage(r.id, {
                name: "CALC_EXT",
                action: t
            })
        }))
    },
    242: function(e, n, r) {},
    26: function(e, n, r) {
        n.a = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 36e5,
                n = [],
                r = {};

            function cleanup() {
                for (var t = Date.now(), o = 0, a = n[o]; o < n.length && a.time + e < t; ++o) {
                    var u = r[a.key];
                    u && (1 === u.count ? delete r[a.key] : --u.count)
                }
                o > 0 && n.splice(0, o)
            }
            this.get = function(e, n) {
                var t = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                if (cleanup(), t && n) return this.set(e, n());
                var o = r[e];
                return o && o.value || n && this.set(e, n())
            }, this.set = function(e, t) {
                var o = Date.now(),
                    a = r[e] || (r[e] = {
                        value: t,
                        count: 0
                    });
                return n.push({
                    key: e,
                    time: o
                }), ++a.count, t
            }
        }
    },
    30: function(e, n, r) {
        var t, o, a = r(19),
            u = r(6),
            s = 0,
            c = 0;
        n.a = function v1(e, n, r) {
            var l = n && r || 0,
                m = n || new Array(16),
                h = (e = e || {}).node || t,
                d = void 0 !== e.clockseq ? e.clockseq : o;
            if (null == h || null == d) {
                var p = e.random || (e.rng || a.a)();
                null == h && (h = t = [1 | p[0], p[1], p[2], p[3], p[4], p[5]]), null == d && (d = o = 16383 & (p[6] << 8 | p[7]))
            }
            var g = void 0 !== e.msecs ? e.msecs : Date.now(),
                y = void 0 !== e.nsecs ? e.nsecs : c + 1,
                b = g - s + (y - c) / 1e4;
            if (b < 0 && void 0 === e.clockseq && (d = d + 1 & 16383), (b < 0 || g > s) && void 0 === e.nsecs && (y = 0), y >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            s = g, c = y, o = d;
            var v = (1e4 * (268435455 & (g += 122192928e5)) + y) % 4294967296;
            m[l++] = v >>> 24 & 255, m[l++] = v >>> 16 & 255, m[l++] = v >>> 8 & 255, m[l++] = 255 & v;
            var w = g / 4294967296 * 1e4 & 268435455;
            m[l++] = w >>> 8 & 255, m[l++] = 255 & w, m[l++] = w >>> 24 & 15 | 16, m[l++] = w >>> 16 & 255, m[l++] = d >>> 8 | 128, m[l++] = 255 & d;
            for (var k = 0; k < 6; ++k) m[l + k] = h[k];
            return n || Object(u.a)(m)
        }
    },
    31: function(e, n, r) {
        var t = r(20),
            o = r(41),
            a = Object(t.a)("v3", 48, o.a);
        n.a = a
    },
    32: function(e, n, r) {
        var t = r(19),
            o = r(6);
        n.a = function v4(e, n, r) {
            var a = (e = e || {}).random || (e.rng || t.a)();
            if (a[6] = 15 & a[6] | 64, a[8] = 63 & a[8] | 128, n) {
                r = r || 0;
                for (var u = 0; u < 16; ++u) n[r + u] = a[u];
                return n
            }
            return Object(o.a)(a)
        }
    },
    33: function(e, n, r) {
        var t = r(20),
            o = r(42),
            a = Object(t.a)("v5", 80, o.a);
        n.a = a
    },
    34: function(e, n, r) {
        n.a = "00000000-0000-0000-0000-000000000000"
    },
    35: function(e, n, r) {
        var t = r(7);
        n.a = function version(e) {
            if (!Object(t.a)(e)) throw TypeError("Invalid UUID");
            return parseInt(e.substr(14, 1), 16)
        }
    },
    36: function(e, n) {
        var r = {
            utf8: {
                stringToBytes: function(e) {
                    return r.bin.stringToBytes(unescape(encodeURIComponent(e)))
                },
                bytesToString: function(e) {
                    return decodeURIComponent(escape(r.bin.bytesToString(e)))
                }
            },
            bin: {
                stringToBytes: function(e) {
                    for (var n = [], r = 0; r < e.length; r++) n.push(255 & e.charCodeAt(r));
                    return n
                },
                bytesToString: function(e) {
                    for (var n = [], r = 0; r < e.length; r++) n.push(String.fromCharCode(e[r]));
                    return n.join("")
                }
            }
        };
        e.exports = r
    },
    37: function(e, n, r) {
        function _typeof(e) {
            return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(e) {
                return typeof e
            } : function _typeof(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        var t = {
                kilograms: "KG",
                kg: "KG",
                g: "GR",
                grams: "GR",
                grammes: "GR",
                grammi: "GR",
                pounds: "POUND",
                lbs: "POUND",
                oz: "OUNCE",
                ounces: "OUNCE"
            },
            o = {
                KG: 2.204622622,
                POUND: 1,
                OUNCE: .0625,
                GR: .002204622622
            },
            a = {
                cm: "CM",
                centimeter: "CM",
                centimeters: "CM",
                millimeter: "MM",
                millimeters: "MM",
                in: "INCH",
                inch: "INCH",
                inches: "INCH"
            },
            u = {
                CM: .393701,
                MM: .0393701,
                MILLIMETERS: .0393701,
                INCH: 1
            };
        n.a = new function() {
            var e = this;
            this.parseWeightUnit = function(e) {
                return e ? t[e.toLowerCase()] : e
            }, this.parseSizeUnit = function(e) {
                return e ? a[e.toLowerCase()] : e
            }, this.convertWeight = function(e, n, r) {
                return n === r ? e : e * o[n] / o[r]
            }, this.toPounds = function(n, r) {
                return e.convertWeight(n, r, "POUND")
            }, this.convertSize = function(e, n, r) {
                return n === r ? e : e * u[n] / u[r]
            }, this.convertSizeObject = function(n, r) {
                return n.unit === r ? n : {
                    width: e.convertSize(n.width, n.unit, r),
                    height: e.convertSize(n.height, n.unit, r),
                    depth: e.convertSize(n.depth, n.unit, r),
                    unit: r
                }
            }, this.toInches = function(n, r) {
                return "object" === _typeof(n) ? e.convertSizeObject(n, "INCH") : e.convertSize(n, r, "INCH")
            }
        }
    },
    38: function(e, n, r) {
        r.d(n, "a", (function() {
            return ajax
        }));
        var t = r(14);

        function _typeof(e) {
            return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(e) {
                return typeof e
            } : function _typeof(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        var o = "application/json",
            a = "application/x-www-form-urlencoded",
            u = {
                "application/json": function applicationJson(e) {
                    return JSON.stringify(e)
                },
                "application/x-www-form-urlencoded": function applicationXWwwFormUrlencoded(e) {
                    return t.a.serialize(e)
                }
            };

        function ajax(e) {
            var n = arguments,
                r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GET",
                s = arguments.length > 2 ? arguments[2] : void 0,
                c = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
                l = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "cors",
                m = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "follow";
            if (e = t.a.normalizeUrlAfterHelium(e), s && "object" === _typeof(s))
                if ("GET" === r) {
                    var h = u[a](s);
                    e += (-1 === e.indexOf("?") ? "?" : "&") + h, s = null
                } else {
                    var d = c["Content-Type"] = c["Content-Type"] || o,
                        p = u[d];
                    s = p(s)
                } return new RegExp("amzscout.net").test(e) && (c["X-Origin"] = "CALC_EXT"), new Promise((function(t, a) {
                fetch(e, {
                    method: r,
                    mode: l,
                    redirect: m,
                    body: s && "object" === _typeof(s) ? JSON.stringify(s) : s,
                    headers: c || {
                        "Content-Type": o
                    },
                    credentials: "include"
                }).then((function(e) {
                    var n, r = e.headers.get("Content-Type");
                    n = r && -1 !== r.indexOf(o) ? e.json() : e.text().then((function(e) {
                        return Promise.resolve(e.startsWith("{") && e.endsWith("}") ? JSON.parse(e) : e)
                    })), e.ok ? n.then(t) : n.then((function(n) {
                        return a({
                            status: e.status,
                            cause: n
                        })
                    }))
                }), (function(e) {
                    console.log(n), a("NETWORK")
                })).catch((function(e) {
                    console.log(e), a(e)
                }))
            }))
        }
    },
    39: function(e, n, r) {
        r.d(n, "a", (function() {
            return t
        }));
        var t = ["samsung", "apple", "sony", "nestle", "panasonic", "lg", "nike", "chanel", "adidas", "coca-cola", "gucci", "canon", "google", "johnson & johnson", "lotte", "toshiba", "philips", "meiji", "sony play station", "microsoft", "sharp", "facebook", "calvin klein", "hewlett-packard", "l'oreal", "honda", "dove", "hitachi", "shiseido", "christian dior", "cadbury", "armani", "maggi", "nivea", "amazon", "yamaha", "nintendo", "nescafe", "colgate", "yahoo", "mentos", "louis vuitton", "watsons", "mitsubishi motors", "shell", "pampers", "lipton", "rolex", "dell", "haagen-dazs", "huggies", "quaker", "bridgestone", "pedigree", "heineken", "olay", "lancome", "toyota", "prada", "burberry", "microsoft", "estee lauder", "bmw", "michelin", "epson", "kellogg's", "lenovo", "nissin", "sk-ii", "tiffany & co.", "johnnie walker", "panadol", "kao", "nikon", "ralph lauren", "intel", "bvlgari", "morinaga", "pringles", "lazada", "cartier", "milo", "pocari sweat", "pepsi", "doublemint", "asus", "heinz", "acer", "sanyo", "daikin", "pond's men", "suntory", "zara", "mamy poko", "del monte", "tropicana", "uni-president", "casio", "pioneer", "lay's", "minute maid", "bose", "whirlpool", "lux", "red bull", "amul", "gatorade", "evian", "goodyear", "mercedes-benz", "dumex", "siemens", "reebok", "cerelac", "tesco", "carrefour", "hugo boss", "levi's", "electrolux", "puma", "whiskas", "pantene", "ferrero rocher", "dunlop", "sensodyne", "apollo", "hennessy", "aeon", "swarovski", "head & shoulders", "sprite", "100 plus", "oral b", "ibm", "instagram", "gillette", "dutch lady", "h&m", "mead johnson", "clinique", "garnier", "haier", "chivas", "baskin robbins", "mentholatum", "hush puppies", "sunkist", "uniqlo", "wyeth", "wrigley's arrow", "fujitsu", "maybelline", "guess", "vaseline", "ntuc fairprice", "kenwood", "guardian", "magnolia", "carlsberg", "orion", "jack daniel", "nongshim", "wall's", "calbee", "huawei", "biore", "ariel", "seiko", "clarks", "darlie", "hershey", "tylenol", "lion", "giant", "xiaomi", "sunsilk", "attack", "dettol", "neutrogena", "harley davidson", "caltex", "hermes", "breeze", "friskies", "budweiser", "extra", "closeup", "big bazaar", "timberland", "boots", "bata", "line", "royal canin", "sugus", "decolgen", "suzuki", "tide", "gatsby", "wikipedia", "chupa chups", "twinings", "godiva", "bosch", "walmart", "7-up", "esso", "yves saint laurent", "yokohama", "anlene", "clear", "kawasaki", "surf", "crocodile", "lifebuoy", "namyang", "omo", "indomie", "naver", "woolworths", "jvc", "audi", "the body shop", "jimmy choo", "alpo", "nestum", "aquarius", "zalora", "jack'n jill", "schweppes", "tiger beer", "purina", "palmolive", "carrier", "asahi", "perrier", "marigold", "fanta", "masterkong", "fitbit", "dynamo", "brother", "cesar", "nokia", "guinness", "tag heuer", "rolls royce", "abc", "mac", "san miguel", "aquafina", "haitai", "ducati", "rakuten", "remy martin", "ferrari", "big c", "revlon", "giordano", "avon", "coles", "powerade", "maeil", "boss", "halls", "lacoste", "twisties", "pepsodent", "lindt", "f&n", "singtel", "vidal sassoon", "biotherm", "gerber", "toblerone", "fisher & paykel", "fernleaf", "ajinomoto", "old town white coffee", "matsumoto kiyoshi", "m&m's", "pokka", "wei chuan", "yahoo shopping", "meiji", "rejoice", "petron", "porsche", "olympus", "martell", "pigeon", "dove", "g2000", "google home", "fuji xerox", "ballantine's", "new balance", "sega", "smirnoff", "big babol", "hyundai (motors)", "telstra", "mercury drug", "royal", "australian football league", "china mobile", "versace", "mobil", "bear brand", "shokubutsu", "samyang", "donna karen (dkny)", "chilsung cider", "salvatore ferragamo", "mama", "mister potato", "sapporo", "cj cheil jedang", "my dog", "mango (mng)", "nine west", "tsingtao", "fruit tree", "nestle dairy farm", "petronas", "mr.muscle", "kingfisher", "s 26", "vodafone", "charles & keith", "safeguard", "arnott's", "rinso", "ben & jerry's", "chunghwa telecom (cht)", "patek philippe", "alaska", "citizen", "continental", "hankook", "nippon professional baseball", "dentyne", "foremost", "adobe", "dairy milk", "tissot", "gs caltex", "lucky me", "indian premier league", "summit", "airwaves", "seoul milk", "hill's", "e mart", "drypers", "nissan", "pertamina", "tipco", "beat", "swatch", "baidu", "xerox", "peel fresh", "ice mountain", "merries", "spritzer", "axe", "royce' / royce", "ministop", "care pet", "ford", "swensen's", "scholl", "takeda", "bacardi", "shinramyun", "westinghouse", "linkedin", "ais", "tresemme", "wilkins", "telkomsel", "lactogen", "bang & olufsen (b&o)", "priceline", "dairy farmers", "flipkart", "nurofen", "absolut", "coco pops", "maxwell house", "danone", "hypermart", "honey star (nestle)", "indofood", "mr. juicy", "dairy queen", "circle k", "sulwhasoo", "lakme", "chemist warehouse", "pirelli", "minere", "ricoh", "chungjungwon", "taiwan beer", "chow tai fook", "kumho", "softbank", "kirin", "mei ri c", "national rugby league", "qoo10", "sk (jewellery)", "volvic", "sponsor", "mcdowell's", "cpc (china)", "moccona", "yum yum", "la vie", "glico", "eukanuba", "starhub", "golden mountain", "bubble yum", "sina", "myojo", "top", "horlicks", "dilmah", "cold stone", "cpc (taiwan)", "cosmed", "ptt", "daily juice", "garmin", "white rabbit", "trident", "sm supermarket", "doggyman", "dtac", "samsung pay", "bally", "kymco", "top ramen", "babylove", "kumkang", "kissan", "sariwangi", "groupon", "mazda", "bangchak", "viettel", "dolce & gabbana (d&g)", "poh kong", "aura", "elizabeth arden", "sosro", "y.e.s mineral water", "sym", "selecta", "kimia farma", "chiclet", "petrolimex", "malee", "kodak", "airtel", "vinamilk", "bing", "moutai", "gs 25", "masterfood", "red horse", "jusco", "habib jewels", "nespray", "campina", "nongfu shan quan", "koikeya", "hao hao", "qq", "ito-en", "post", "applepay", "manning's", "pxmart", "tanishq", "linux", "blue moon", "gree", "coach", "mr. brown", "mie sedap", "ucc", "asics", "daphne", "longines", "taj mahal (tea)", "goon", "esprit", "lawson", "kapal api", "chin-su", "htc", "maxis", "ades", "golden circle", "aldi", "hero honda", "ntt", "snow brand", "british petroleum (bp)", "me-o", "arrow", "volkswagen", "enfa", "kuang-chuan", "advance info service (ais)", "van houten", "indian oil corporation (iocl)", "berri", "regency", "mirinda", "center fresh", "china mengniu dairy", "frisian flag", "northface", "bisleri", "haldiram", "nippon oil corporation (noc", "jim beam", "hui yuan", "ranbaxy", "amway", "compaq", "formosa petrochemical", "daum", "cu", "lexus", "chow sang sang", "kagome", "smiths", "amazon payments", "wantwant", "msn", "wei lih", "fossil group, inc", "the generics pharmacy", "park n shop", "fuji", "alfamart", "boryung pharmacist", "norton", "indosat", "wai wai", "clairol herbal essences", "mobifone", "harry winston", "fab", "boh", "dreyer's", "firestone", "michael hill", "hai tian", "oksusu tea", "tata tea", "pro sweat", "kaspersky", "moony", "kopiko", "yili", "homeplus", "oracle", "kose", "kwality", "ktf", "tang", "protex", "nec", "perioe", "cold storage", "mount franklin", "allen's", "esquire", "onnuri", "kimball", "barista lavazza (india)", "pro plan", "indomaret", "kinley", "timex", "unity pharmacy", "rado", "truemove", "columbia", "c.c. lemon", "mamee", "maruchan", "mother dairy", "hacks", "volvo", "raymond", "chang beer", "frooti", "wuliangye", "mizuno", "wanjashan", "aso", "unicharm", "amore pacific", "bharat petroleum corporation limited (bpcl)", "birdy", "uncle toby", "belle", "wakodo", "11st.co", "fair & lovely", "singha", "xu fu ji", "vita", "benq", "toyo tire", "supermie", "costco", "cha li won", "it", "caring pharmacy", "crest", "kimlan", "sanitarium", "ghana", "m-sport", "titan", "nikka", "sk", "kanebo", "robinson's", "digi", "mandom", "sunstar", "buick regal", "top man / top shop", "gopro", "eskinol", "max factor", "extra joss", "kenzo", "anna sui", "optus", "woodland", "maidong", "heaven & earth", "gmarket", "j.d", "hipp", "m-150", "eq", "silverstone", "hl", "saewookkang", "reliance (ril)", "natural confectionary company", "fantastic", "boomer", "kewpie", "k-24", "valve steam machine", "kelvinator", "kinmen kao liang", "csl/chinese super league", "nutri grain", "amoy", "york", "peters", "idemitsu", "bonaqua", "miwon", "happy bath", "puregold", "applesidra", "nexen tire", "streets", "uha mikakuto", "paos", "p/s", "florsheim", "fountain", "21st century healthcare", "hoe garden", "d-mart", "shoppers stop", "nhl / national hockey league", "revive isotonic", "weet-bix", "leo", "iriver", "kowloon dairy", "midea", "auction.co", "lucozade", "pauls", "jk tyre", "caring", "3", "amcal", "piaggio", "moto 360", "mydin", "wacoal", "lao feng xiang", "datu puti", "real", "pet pet", "parle", "playjam estick", "aekyung 2080", "klim", "hubba bubba", "gum", "dentiste", "snugglers", "devondale", "superbubble", "tata", "iga", "capico", "amazon echo", "ceat", "asience", "ochaen", "greenmax", "blue girl", "sugi", "p.c. chandra", "taster's choice", "creative", "voltas", "lao bai xin", "super coffee mix", "liby", "pears", "wahaha", "farex", "swipe", "motorola", "hindustan", "morewater", "bajaj", "jianlibao", "clinic", "aquafresh", "pal", "bonia", "shanghaojia", "iams", "simpson", "teco", "kia motors", "chum", "bosomi", "csl", "m1", "otsuka seiyaku", "amazon.com", "apple", "google", "samsung", "facebook", "at&t", "microsoft", "verizon", "walmart", "icbc", "alibaba", "china mobile", "wells fargo", "mercedes-benz", "toyota", "bmw", "state grid", "ntt group", "tencent", "t (deutsche telekom)", "shell", "chase", "huawei", "agricultural bank of china", "the home depot", "volkswagen", "disney", "ibm", "starbucks", "ge", "petrochina", "citi", "marlboro", "coca-cola", "oracle", "nike", "xfinity", "youtube", "mitsubishi", "china state construction", "mcdonald's", "ikea", "sinopec", "wechat", "pwc", "orange", "honda", "intel", "ups", "siemens", "moutai", "baidu", "total", "deloitte", "visa", " cvs", "allianz", "pepsi", "boeing", "jd.com", "bp", "cisco", "nissan", "nestlé", "bosch", "porsche", "h&m", "softbank", "vodafone", "united healthcare", "hsbc", "fedex", "chevron", "hyundai", "johnson's", "jp morgan", "zara", "ford", "ey", "sap", "fox", "accenture", "lg group", "uber", "au", "dell", "evergrande real estate", "santander", "walgreens", "american express", "audi", "nbc", "wuliangye", "mufg", "adidas", "tata", "lowe's", "rbc", "hitachi group", "bnp paribas", "target", "spectrum", "sk group", "exxonmobil", "axa", "chevrolet", "td", "kpmg", "telstra", "costco", "renault", "universal", "sony", "land rover", "country garden", "bbva", "petronas", "bt", "movistar", "hermès", "bell", "dhl", "carrefour", "eni", "louis vuitton", "cbs", "abc", "netflix", "aia", "crec", "scotiabank", "canon", "warner bros.", "sky", "anthem", "tesco", "edf", "cartier", "ing", "l'oréal", "aetna", "goldman sachs", "aldi", "danone", "panasonic", "johnson & johnson", "humana inc", "lexus", "philips", "ubs", "hp", "cpic", "delta", "tim", "o2", "enel", "gucci", "lidl", "mitsui group", "optumhealth", "nokia", "engie", "pemex", "lockheed martin", "anz", "abb", "adobe", "statoil", "ebay", "metlife", "uniqlo", "subway", "subaru", "kfc", "itaú", "michelin", "medtronic", "rogers", "union pacific", "nintendo", "tsmc", "morgan stanley", "yanghe", "cognizant", "etisalat", "telus", "allstate", "red bull", "lego", "gillette", "sam's club", "sprint", "basf", "bud light", "3 mobile", "yahoo", "picc", "zurich", "vinci", "woolworths group", "china vanke", "cibc", "valero", "budweiser", "centurylink", "honeywell", "united", "bridgestone", "midea", "cigna", "sumitomo mitsui financial group", "telenor", "qualcomm", "haval", "brookfield", "credit suisse", "airtel", "stc", "crrc", "neutrogena", "coles", "geico", "dow", "ferrari", "publix", "dbs", "natwest", "schlumberger", "generali", "fresenius", "nivea", "roche", "asda", "lloyds", "prudential(us)", "pnc", "rolex", "nordea", "pampers", "hilton", "activision blizzard", "coach", "marubeni", "victoria's secret", "yili", "heineken", "claro", "infosys", "dxc technology", "pall mall", "l&m", "geely", "lic", "playstation", "camel", "t.j. maxx", "chanel", "daiwa house industry", "westpac", "sfr", "mcc", "crédit agricole", "purina", "mizuho", "bouygues (conglomerate)", "rabobank", "tesla motors", "travelers", "tyson", "standard chartered", "bbc", "bradesco", "bayer", "newport", "poly real estate", "kellogg's", "sainsbury's", "aig", "enterprise", "saint gobain", "espn", "emirates airlines", "nescafé", "guerlain", "southwest", "thomson reuters", "kt", "mobil", "cnooc", "caterpillar", "kroger", "hynix", "petrobras", "bhp", "chubb", "20th century fox", "clinique", "korea electric power corporation", "pantene", "tim hortons", "mckinsey", "chow tai fook", "huggies", "aviva", "gatorade", "ptt", "sysco", "macy's", "kraft", "colgate", "lukoil", "dove", "domino's pizza", "poste italiane", "randstad", "wrigley's", "enbridge", "haier", "continental", "thermo fisher scientific", "longfor properties", "esso", "schneider electric", "exxon", "tiffany & co.", "ee", "garnier", "e leclerc", "general dynamics", "fubon life", "progressive", "adp", "kia motors", "conocophillips", "kb financial group", "john deere", "burberry", "hcl technologies", "toshiba", "swiss re", "ericsson", "capgemini", "cccc", "discover", "northrop grumman", "china cinda-h", "sodexo", "texas instruments", "prudential(uk)", "estée lauder", "cnrl", "electronic arts (ea)", "sprite", "cn", "suning", "wolseley", "lotte group", "unilever", "hikvision", "denso", "sherwin-williams", "nationwide building society", "safran", "crédit mutuel", "johnnie walker", "suzuki", "deutsche post", "nordstrom", "linkedin", "express scripts", "hbo", "qnb", "kbc", "indian oil", "clarins", "shiseido", "kohl's", "emerson", "banco do brasil", "doosan (group)", "el corte ingles", "cummins", "autozone", "pfizer", "fis", "lenovo", "innogy", "cj group", "china southern airlines", "repsol", "micron technology", "reliance industries", "christian dior", "carmax", "maybelline", "gree", "csx", "fujitsu", "bloomberg", "polo ralph lauren", "xiaomi", "aflac", "optus", "sun hung kai properties", "gs group", "nvidia", "isuzu", "atos", "cathay life insurance co", "larsen & toubro", "ecopetrol", "china res land", "munich re", "iberdrola", "rolls-royce", "heinz", "s-26", "prada", "bdo international", "winston", "royal caribbean cruises", "luzhou laojiao", "china eastern airlines", "whole foods", "centene corporation", "marks & spencer", "applied materials", "zalando", "under armour", "abn amro", "uob", "adecco", "mccain foods", "cerner corp", "vmware", "sabic", "la poste", "brahma", "daikin", "glencore", "acuvue", "abbott", "bae systems", "raytheon", "blackrock"]
    },
    40: function(e, n, r) {
        n.a = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
    },
    41: function(e, n, r) {
        function getOutputLength(e) {
            return 14 + (e + 64 >>> 9 << 4) + 1
        }

        function safeAdd(e, n) {
            var r = (65535 & e) + (65535 & n);
            return (e >> 16) + (n >> 16) + (r >> 16) << 16 | 65535 & r
        }

        function md5cmn(e, n, r, t, o, a) {
            return safeAdd(function bitRotateLeft(e, n) {
                return e << n | e >>> 32 - n
            }(safeAdd(safeAdd(n, e), safeAdd(t, a)), o), r)
        }

        function md5ff(e, n, r, t, o, a, u) {
            return md5cmn(n & r | ~n & t, e, n, o, a, u)
        }

        function md5gg(e, n, r, t, o, a, u) {
            return md5cmn(n & t | r & ~t, e, n, o, a, u)
        }

        function md5hh(e, n, r, t, o, a, u) {
            return md5cmn(n ^ r ^ t, e, n, o, a, u)
        }

        function md5ii(e, n, r, t, o, a, u) {
            return md5cmn(r ^ (n | ~t), e, n, o, a, u)
        }
        n.a = function md5(e) {
            if ("string" == typeof e) {
                var n = unescape(encodeURIComponent(e));
                e = new Uint8Array(n.length);
                for (var r = 0; r < n.length; ++r) e[r] = n.charCodeAt(r)
            }
            return function md5ToHexEncodedArray(e) {
                for (var n = [], r = 32 * e.length, t = 0; t < r; t += 8) {
                    var o = e[t >> 5] >>> t % 32 & 255,
                        a = parseInt("0123456789abcdef".charAt(o >>> 4 & 15) + "0123456789abcdef".charAt(15 & o), 16);
                    n.push(a)
                }
                return n
            }(function wordsToMd5(e, n) {
                e[n >> 5] |= 128 << n % 32, e[getOutputLength(n) - 1] = n;
                for (var r = 1732584193, t = -271733879, o = -1732584194, a = 271733878, u = 0; u < e.length; u += 16) {
                    var s = r,
                        c = t,
                        l = o,
                        m = a;
                    r = md5ff(r, t, o, a, e[u], 7, -680876936), a = md5ff(a, r, t, o, e[u + 1], 12, -389564586), o = md5ff(o, a, r, t, e[u + 2], 17, 606105819), t = md5ff(t, o, a, r, e[u + 3], 22, -1044525330), r = md5ff(r, t, o, a, e[u + 4], 7, -176418897), a = md5ff(a, r, t, o, e[u + 5], 12, 1200080426), o = md5ff(o, a, r, t, e[u + 6], 17, -1473231341), t = md5ff(t, o, a, r, e[u + 7], 22, -45705983), r = md5ff(r, t, o, a, e[u + 8], 7, 1770035416), a = md5ff(a, r, t, o, e[u + 9], 12, -1958414417), o = md5ff(o, a, r, t, e[u + 10], 17, -42063), t = md5ff(t, o, a, r, e[u + 11], 22, -1990404162), r = md5ff(r, t, o, a, e[u + 12], 7, 1804603682), a = md5ff(a, r, t, o, e[u + 13], 12, -40341101), o = md5ff(o, a, r, t, e[u + 14], 17, -1502002290), t = md5ff(t, o, a, r, e[u + 15], 22, 1236535329), r = md5gg(r, t, o, a, e[u + 1], 5, -165796510), a = md5gg(a, r, t, o, e[u + 6], 9, -1069501632), o = md5gg(o, a, r, t, e[u + 11], 14, 643717713), t = md5gg(t, o, a, r, e[u], 20, -373897302), r = md5gg(r, t, o, a, e[u + 5], 5, -701558691), a = md5gg(a, r, t, o, e[u + 10], 9, 38016083), o = md5gg(o, a, r, t, e[u + 15], 14, -660478335), t = md5gg(t, o, a, r, e[u + 4], 20, -405537848), r = md5gg(r, t, o, a, e[u + 9], 5, 568446438), a = md5gg(a, r, t, o, e[u + 14], 9, -1019803690), o = md5gg(o, a, r, t, e[u + 3], 14, -187363961), t = md5gg(t, o, a, r, e[u + 8], 20, 1163531501), r = md5gg(r, t, o, a, e[u + 13], 5, -1444681467), a = md5gg(a, r, t, o, e[u + 2], 9, -51403784), o = md5gg(o, a, r, t, e[u + 7], 14, 1735328473), t = md5gg(t, o, a, r, e[u + 12], 20, -1926607734), r = md5hh(r, t, o, a, e[u + 5], 4, -378558), a = md5hh(a, r, t, o, e[u + 8], 11, -2022574463), o = md5hh(o, a, r, t, e[u + 11], 16, 1839030562), t = md5hh(t, o, a, r, e[u + 14], 23, -35309556), r = md5hh(r, t, o, a, e[u + 1], 4, -1530992060), a = md5hh(a, r, t, o, e[u + 4], 11, 1272893353), o = md5hh(o, a, r, t, e[u + 7], 16, -155497632), t = md5hh(t, o, a, r, e[u + 10], 23, -1094730640), r = md5hh(r, t, o, a, e[u + 13], 4, 681279174), a = md5hh(a, r, t, o, e[u], 11, -358537222), o = md5hh(o, a, r, t, e[u + 3], 16, -722521979), t = md5hh(t, o, a, r, e[u + 6], 23, 76029189), r = md5hh(r, t, o, a, e[u + 9], 4, -640364487), a = md5hh(a, r, t, o, e[u + 12], 11, -421815835), o = md5hh(o, a, r, t, e[u + 15], 16, 530742520), t = md5hh(t, o, a, r, e[u + 2], 23, -995338651), r = md5ii(r, t, o, a, e[u], 6, -198630844), a = md5ii(a, r, t, o, e[u + 7], 10, 1126891415), o = md5ii(o, a, r, t, e[u + 14], 15, -1416354905), t = md5ii(t, o, a, r, e[u + 5], 21, -57434055), r = md5ii(r, t, o, a, e[u + 12], 6, 1700485571), a = md5ii(a, r, t, o, e[u + 3], 10, -1894986606), o = md5ii(o, a, r, t, e[u + 10], 15, -1051523), t = md5ii(t, o, a, r, e[u + 1], 21, -2054922799), r = md5ii(r, t, o, a, e[u + 8], 6, 1873313359), a = md5ii(a, r, t, o, e[u + 15], 10, -30611744), o = md5ii(o, a, r, t, e[u + 6], 15, -1560198380), t = md5ii(t, o, a, r, e[u + 13], 21, 1309151649), r = md5ii(r, t, o, a, e[u + 4], 6, -145523070), a = md5ii(a, r, t, o, e[u + 11], 10, -1120210379), o = md5ii(o, a, r, t, e[u + 2], 15, 718787259), t = md5ii(t, o, a, r, e[u + 9], 21, -343485551), r = safeAdd(r, s), t = safeAdd(t, c), o = safeAdd(o, l), a = safeAdd(a, m)
                }
                return [r, t, o, a]
            }(function bytesToWords(e) {
                if (0 === e.length) return [];
                for (var n = 8 * e.length, r = new Uint32Array(getOutputLength(n)), t = 0; t < n; t += 8) r[t >> 5] |= (255 & e[t / 8]) << t % 32;
                return r
            }(e), 8 * e.length))
        }
    },
    42: function(e, n, r) {
        function f(e, n, r, t) {
            switch (e) {
                case 0:
                    return n & r ^ ~n & t;
                case 1:
                    return n ^ r ^ t;
                case 2:
                    return n & r ^ n & t ^ r & t;
                case 3:
                    return n ^ r ^ t
            }
        }

        function ROTL(e, n) {
            return e << n | e >>> 32 - n
        }
        n.a = function sha1(e) {
            var n = [1518500249, 1859775393, 2400959708, 3395469782],
                r = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
            if ("string" == typeof e) {
                var t = unescape(encodeURIComponent(e));
                e = [];
                for (var o = 0; o < t.length; ++o) e.push(t.charCodeAt(o))
            } else Array.isArray(e) || (e = Array.prototype.slice.call(e));
            e.push(128);
            for (var a = e.length / 4 + 2, u = Math.ceil(a / 16), s = new Array(u), c = 0; c < u; ++c) {
                for (var l = new Uint32Array(16), m = 0; m < 16; ++m) l[m] = e[64 * c + 4 * m] << 24 | e[64 * c + 4 * m + 1] << 16 | e[64 * c + 4 * m + 2] << 8 | e[64 * c + 4 * m + 3];
                s[c] = l
            }
            s[u - 1][14] = 8 * (e.length - 1) / Math.pow(2, 32), s[u - 1][14] = Math.floor(s[u - 1][14]), s[u - 1][15] = 8 * (e.length - 1) & 4294967295;
            for (var h = 0; h < u; ++h) {
                for (var d = new Uint32Array(80), p = 0; p < 16; ++p) d[p] = s[h][p];
                for (var g = 16; g < 80; ++g) d[g] = ROTL(d[g - 3] ^ d[g - 8] ^ d[g - 14] ^ d[g - 16], 1);
                for (var y = r[0], b = r[1], v = r[2], w = r[3], k = r[4], A = 0; A < 80; ++A) {
                    var _ = Math.floor(A / 20),
                        T = ROTL(y, 5) + f(_, b, v, w) + k + n[_] + d[A] >>> 0;
                    k = w, w = v, v = ROTL(b, 30) >>> 0, b = y, y = T
                }
                r[0] = r[0] + y >>> 0, r[1] = r[1] + b >>> 0, r[2] = r[2] + v >>> 0, r[3] = r[3] + w >>> 0, r[4] = r[4] + k >>> 0
            }
            return [r[0] >> 24 & 255, r[0] >> 16 & 255, r[0] >> 8 & 255, 255 & r[0], r[1] >> 24 & 255, r[1] >> 16 & 255, r[1] >> 8 & 255, 255 & r[1], r[2] >> 24 & 255, r[2] >> 16 & 255, r[2] >> 8 & 255, 255 & r[2], r[3] >> 24 & 255, r[3] >> 16 & 255, r[3] >> 8 & 255, 255 & r[3], r[4] >> 24 & 255, r[4] >> 16 & 255, r[4] >> 8 & 255, 255 & r[4]]
        }
    },
    51: function(e, n) {
        Element && !Element.prototype.prepend && (Element.prototype.prepend = function(e) {
            return Element.prototype.insertBefore.call(this, e, this.childNodes[0])
        })
    },
    52: function(e, n) {
        String.prototype.contains = function(e) {
            return e && this.indexOf(e) >= 0
        }, String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1)
        }
    },
    53: function(e, n) {
        Array.prototype.avg = function() {
            if (this.length) {
                var e = this.filter((function(e) {
                        return !isNaN(e) && null !== e
                    })),
                    n = e.length;
                return 0 == n ? 0 : e.reduce((function(e, n) {
                    return e + n
                })) / n
            }
        }, Array.prototype.sum = function() {
            return this.filter((function(e) {
                return !isNaN(e) && null !== e
            })).reduce((function(e, n) {
                return e + n
            }), 0)
        }, Array.prototype.min = function() {
            return this.length ? this.filter((function(e) {
                return !isNaN(e) && null !== e
            })).reduce((function(e, n) {
                return Math.min(e, n)
            })) : void 0
        }, Array.prototype.max = function() {
            return this.length ? this.filter((function(e) {
                return !isNaN(e) && null !== e
            })).reduce((function(e, n) {
                return Math.max(e, n)
            })) : void 0
        }, Array.prototype.count = function(e) {
            return this.filter(e).length
        }, Array.prototype.first = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function(e) {
                return void 0 !== e
            };
            if ("function" != typeof e) return this[0];
            for (var n = 0; n < this.length; ++n) {
                var r = this[n];
                if (e(r)) return r
            }
        }, Array.prototype.unique = function(e) {
            var n;
            if (e && "function" == typeof e) {
                var r = new Set;
                n = this.filter((function(n) {
                    var t = e(n),
                        o = r.has(t);
                    return o || r.add(t), !o
                }))
            } else n = Array.from(new Set(this));
            return n
        }, Array.prototype.queue = function(e) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
                r = [],
                t = this.map((function(e) {
                    return new Promise((function(n, t) {
                        return r.push({
                            a: e,
                            resolve: n,
                            reject: t
                        })
                    }))
                })),
                o = 0,
                a = 0,
                u = function process() {
                    for (; a < n;) {
                        var t = r[o++];
                        if (void 0 === t) break;
                        a += 1, e(t.a).then(t.resolve, t.reject).finally((function() {
                            return --a || process()
                        }))
                    }
                };
            return u(), t
        }, Array.prototype.toObject = function(e, n) {
            if (!e || !this.length) return {};
            n || (n = function valueMapper(e) {
                return e
            });
            var r = {};
            return this.forEach((function(t) {
                if (t) {
                    var o = e(t);
                    r[o] = n(t)
                }
            })), r
        }, Array.prototype.group = function(e) {
            if (!e || !this.length) return {};
            var n = {};
            return this.forEach((function(r) {
                if (r) {
                    var t = e(r);
                    (n[t] || (n[t] = [])).push(r)
                }
            })), n
        }, Array.prototype.flat = function() {
            return this.length ? this.reduce((function(e, n) {
                return e.concat(n)
            }), []) : []
        }
    },
    54: function(e, n) {
        function _toConsumableArray(e) {
            return function _arrayWithoutHoles(e) {
                if (Array.isArray(e)) return _arrayLikeToArray(e)
            }(e) || function _iterableToArray(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || function _unsupportedIterableToArray(e, n) {
                if (!e) return;
                if ("string" == typeof e) return _arrayLikeToArray(e, n);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return _arrayLikeToArray(e, n)
            }(e) || function _nonIterableSpread() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function _arrayLikeToArray(e, n) {
            (null == n || n > e.length) && (n = e.length);
            for (var r = 0, t = new Array(n); r < n; r++) t[r] = e[r];
            return t
        }
        Promise.prototype.finally = function(e) {
            return Promise.prototype.then.call(this, e, e).catch((function() {
                return e()
            }))
        }, Promise.prototype.always = Promise.prototype.finally, Promise.wire = function() {
            for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
            return new Promise((function(e) {
                var r = n.length;
                ! function executor(t) {
                    try {
                        var o = n[t]();
                        o && o.then ? o.catch((function(e) {
                            return console.log(e)
                        })).finally((function() {
                            return t + 1 == r ? e() : executor(t + 1)
                        })) : t >= r ? e() : executor(t + 1)
                    } catch (a) {
                        t + 1 == r ? e() : executor(t + 1)
                    }
                }(0)
            }))
        }, Promise.wait = function() {
            var e = 1 == arguments.length && arguments[0].length ? arguments[0] : arguments;
            return Array.isArray(e) || (e = _toConsumableArray(e)), 0 == e.length ? Promise.resolve([]) : new Promise((function(n) {
                var r = e.length,
                    t = [],
                    o = 0;
                e.forEach((function(e, a) {
                    e && e.then ? e.then((function(e) {
                        t[a] = e, ++o == r && n(t)
                    }), (function() {
                        t[a] = void 0, ++o == r && n(t)
                    })).catch((function() {
                        t[a] = void 0, ++o == r && n(t)
                    })) : ++o == r && n(t)
                }))
            }))
        }
    },
    55: function(e, n) {
        Number.prototype.toFixedNumber = function(e) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
                r = Math.pow(n, e);
            return Math.round(this * r) / r
        }
    },
    56: function(e, n, r) {
        r.r(n);
        var t = r(30);
        r.d(n, "v1", (function() {
            return t.a
        }));
        var o = r(31);
        r.d(n, "v3", (function() {
            return o.a
        }));
        var a = r(32);
        r.d(n, "v4", (function() {
            return a.a
        }));
        var u = r(33);
        r.d(n, "v5", (function() {
            return u.a
        }));
        var s = r(34);
        r.d(n, "NIL", (function() {
            return s.a
        }));
        var c = r(35);
        r.d(n, "version", (function() {
            return c.a
        }));
        var l = r(7);
        r.d(n, "validate", (function() {
            return l.a
        }));
        var m = r(6);
        r.d(n, "stringify", (function() {
            return m.a
        }));
        var h = r(17);
        r.d(n, "parse", (function() {
            return h.a
        }))
    },
    57: function(e, n, r) {
        var t, o, a, u, s;
        t = r(58), o = r(36).utf8, a = r(59), u = r(36).bin, (s = function(e, n) {
            e.constructor == String ? e = n && "binary" === n.encoding ? u.stringToBytes(e) : o.stringToBytes(e) : a(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || e.constructor === Uint8Array || (e = e.toString());
            for (var r = t.bytesToWords(e), c = 8 * e.length, l = 1732584193, m = -271733879, h = -1732584194, d = 271733878, p = 0; p < r.length; p++) r[p] = 16711935 & (r[p] << 8 | r[p] >>> 24) | 4278255360 & (r[p] << 24 | r[p] >>> 8);
            r[c >>> 5] |= 128 << c % 32, r[14 + (c + 64 >>> 9 << 4)] = c;
            var g = s._ff,
                y = s._gg,
                b = s._hh,
                v = s._ii;
            for (p = 0; p < r.length; p += 16) {
                var w = l,
                    k = m,
                    A = h,
                    _ = d;
                l = g(l, m, h, d, r[p + 0], 7, -680876936), d = g(d, l, m, h, r[p + 1], 12, -389564586), h = g(h, d, l, m, r[p + 2], 17, 606105819), m = g(m, h, d, l, r[p + 3], 22, -1044525330), l = g(l, m, h, d, r[p + 4], 7, -176418897), d = g(d, l, m, h, r[p + 5], 12, 1200080426), h = g(h, d, l, m, r[p + 6], 17, -1473231341), m = g(m, h, d, l, r[p + 7], 22, -45705983), l = g(l, m, h, d, r[p + 8], 7, 1770035416), d = g(d, l, m, h, r[p + 9], 12, -1958414417), h = g(h, d, l, m, r[p + 10], 17, -42063), m = g(m, h, d, l, r[p + 11], 22, -1990404162), l = g(l, m, h, d, r[p + 12], 7, 1804603682), d = g(d, l, m, h, r[p + 13], 12, -40341101), h = g(h, d, l, m, r[p + 14], 17, -1502002290), l = y(l, m = g(m, h, d, l, r[p + 15], 22, 1236535329), h, d, r[p + 1], 5, -165796510), d = y(d, l, m, h, r[p + 6], 9, -1069501632), h = y(h, d, l, m, r[p + 11], 14, 643717713), m = y(m, h, d, l, r[p + 0], 20, -373897302), l = y(l, m, h, d, r[p + 5], 5, -701558691), d = y(d, l, m, h, r[p + 10], 9, 38016083), h = y(h, d, l, m, r[p + 15], 14, -660478335), m = y(m, h, d, l, r[p + 4], 20, -405537848), l = y(l, m, h, d, r[p + 9], 5, 568446438), d = y(d, l, m, h, r[p + 14], 9, -1019803690), h = y(h, d, l, m, r[p + 3], 14, -187363961), m = y(m, h, d, l, r[p + 8], 20, 1163531501), l = y(l, m, h, d, r[p + 13], 5, -1444681467), d = y(d, l, m, h, r[p + 2], 9, -51403784), h = y(h, d, l, m, r[p + 7], 14, 1735328473), l = b(l, m = y(m, h, d, l, r[p + 12], 20, -1926607734), h, d, r[p + 5], 4, -378558), d = b(d, l, m, h, r[p + 8], 11, -2022574463), h = b(h, d, l, m, r[p + 11], 16, 1839030562), m = b(m, h, d, l, r[p + 14], 23, -35309556), l = b(l, m, h, d, r[p + 1], 4, -1530992060), d = b(d, l, m, h, r[p + 4], 11, 1272893353), h = b(h, d, l, m, r[p + 7], 16, -155497632), m = b(m, h, d, l, r[p + 10], 23, -1094730640), l = b(l, m, h, d, r[p + 13], 4, 681279174), d = b(d, l, m, h, r[p + 0], 11, -358537222), h = b(h, d, l, m, r[p + 3], 16, -722521979), m = b(m, h, d, l, r[p + 6], 23, 76029189), l = b(l, m, h, d, r[p + 9], 4, -640364487), d = b(d, l, m, h, r[p + 12], 11, -421815835), h = b(h, d, l, m, r[p + 15], 16, 530742520), l = v(l, m = b(m, h, d, l, r[p + 2], 23, -995338651), h, d, r[p + 0], 6, -198630844), d = v(d, l, m, h, r[p + 7], 10, 1126891415), h = v(h, d, l, m, r[p + 14], 15, -1416354905), m = v(m, h, d, l, r[p + 5], 21, -57434055), l = v(l, m, h, d, r[p + 12], 6, 1700485571), d = v(d, l, m, h, r[p + 3], 10, -1894986606), h = v(h, d, l, m, r[p + 10], 15, -1051523), m = v(m, h, d, l, r[p + 1], 21, -2054922799), l = v(l, m, h, d, r[p + 8], 6, 1873313359), d = v(d, l, m, h, r[p + 15], 10, -30611744), h = v(h, d, l, m, r[p + 6], 15, -1560198380), m = v(m, h, d, l, r[p + 13], 21, 1309151649), l = v(l, m, h, d, r[p + 4], 6, -145523070), d = v(d, l, m, h, r[p + 11], 10, -1120210379), h = v(h, d, l, m, r[p + 2], 15, 718787259), m = v(m, h, d, l, r[p + 9], 21, -343485551), l = l + w >>> 0, m = m + k >>> 0, h = h + A >>> 0, d = d + _ >>> 0
            }
            return t.endian([l, m, h, d])
        })._ff = function(e, n, r, t, o, a, u) {
            var s = e + (n & r | ~n & t) + (o >>> 0) + u;
            return (s << a | s >>> 32 - a) + n
        }, s._gg = function(e, n, r, t, o, a, u) {
            var s = e + (n & t | r & ~t) + (o >>> 0) + u;
            return (s << a | s >>> 32 - a) + n
        }, s._hh = function(e, n, r, t, o, a, u) {
            var s = e + (n ^ r ^ t) + (o >>> 0) + u;
            return (s << a | s >>> 32 - a) + n
        }, s._ii = function(e, n, r, t, o, a, u) {
            var s = e + (r ^ (n | ~t)) + (o >>> 0) + u;
            return (s << a | s >>> 32 - a) + n
        }, s._blocksize = 16, s._digestsize = 16, e.exports = function(e, n) {
            if (null == e) throw new Error("Illegal argument " + e);
            var r = t.wordsToBytes(s(e, n));
            return n && n.asBytes ? r : n && n.asString ? u.bytesToString(r) : t.bytesToHex(r)
        }
    },
    58: function(e, n) {
        var r, t;
        r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = {
            rotl: function(e, n) {
                return e << n | e >>> 32 - n
            },
            rotr: function(e, n) {
                return e << 32 - n | e >>> n
            },
            endian: function(e) {
                if (e.constructor == Number) return 16711935 & t.rotl(e, 8) | 4278255360 & t.rotl(e, 24);
                for (var n = 0; n < e.length; n++) e[n] = t.endian(e[n]);
                return e
            },
            randomBytes: function(e) {
                for (var n = []; e > 0; e--) n.push(Math.floor(256 * Math.random()));
                return n
            },
            bytesToWords: function(e) {
                for (var n = [], r = 0, t = 0; r < e.length; r++, t += 8) n[t >>> 5] |= e[r] << 24 - t % 32;
                return n
            },
            wordsToBytes: function(e) {
                for (var n = [], r = 0; r < 32 * e.length; r += 8) n.push(e[r >>> 5] >>> 24 - r % 32 & 255);
                return n
            },
            bytesToHex: function(e) {
                for (var n = [], r = 0; r < e.length; r++) n.push((e[r] >>> 4).toString(16)), n.push((15 & e[r]).toString(16));
                return n.join("")
            },
            hexToBytes: function(e) {
                for (var n = [], r = 0; r < e.length; r += 2) n.push(parseInt(e.substr(r, 2), 16));
                return n
            },
            bytesToBase64: function(e) {
                for (var n = [], t = 0; t < e.length; t += 3)
                    for (var o = e[t] << 16 | e[t + 1] << 8 | e[t + 2], a = 0; a < 4; a++) 8 * t + 6 * a <= 8 * e.length ? n.push(r.charAt(o >>> 6 * (3 - a) & 63)) : n.push("=");
                return n.join("")
            },
            base64ToBytes: function(e) {
                e = e.replace(/[^A-Z0-9+\/]/gi, "");
                for (var n = [], t = 0, o = 0; t < e.length; o = ++t % 4) 0 != o && n.push((r.indexOf(e.charAt(t - 1)) & Math.pow(2, -2 * o + 8) - 1) << 2 * o | r.indexOf(e.charAt(t)) >>> 6 - 2 * o);
                return n
            }
        }, e.exports = t
    },
    59: function(e, n) {
        function isBuffer(e) {
            return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
        }
        e.exports = function(e) {
            return null != e && (isBuffer(e) || function isSlowBuffer(e) {
                return "function" == typeof e.readFloatLE && "function" == typeof e.slice && isBuffer(e.slice(0, 0))
            }(e) || !!e._isBuffer)
        }
    },
    6: function(e, n, r) {
        for (var t = r(7), o = [], a = 0; a < 256; ++a) o.push((a + 256).toString(16).substr(1));
        n.a = function stringify(e) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                r = (o[e[n + 0]] + o[e[n + 1]] + o[e[n + 2]] + o[e[n + 3]] + "-" + o[e[n + 4]] + o[e[n + 5]] + "-" + o[e[n + 6]] + o[e[n + 7]] + "-" + o[e[n + 8]] + o[e[n + 9]] + "-" + o[e[n + 10]] + o[e[n + 11]] + o[e[n + 12]] + o[e[n + 13]] + o[e[n + 14]] + o[e[n + 15]]).toLowerCase();
            if (!Object(t.a)(r)) throw TypeError("Stringified UUID is invalid");
            return r
        }
    },
    7: function(e, n, r) {
        var t = r(40);
        n.a = function validate(e) {
            return "string" == typeof e && t.a.test(e)
        }
    }
});