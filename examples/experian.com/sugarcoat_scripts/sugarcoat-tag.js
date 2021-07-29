var CJApi, cjApi;
{
    const $___mock_83c72d4a1fbf0fb7 = {};
    (exports => {
        'use strict';
        const xhrUnsent = 0;
        const xhrOpened = 1;
        const xhrHeadersReceived = 2;
        const xhrLoading = 3;
        const xhrDone = 4;
        const xhrDeferredHandleSymbol = Symbol('deferredHandle');
        const xhrOnLoadStartSymbol = Symbol('onloadstart');
        const xhrOnProgressSymbol = Symbol('onprogress');
        const xhrOnAbortSymbol = Symbol('onabort');
        const xhrOnErrorSymbol = Symbol('onerror');
        const xhrOnLoadSymbol = Symbol('onload');
        const xhrOnTimeoutSymbol = Symbol('ontimeout');
        const xhrOnLoadEndSymbol = Symbol('onloadend');
        const xhrOnReadyStateChangeSymbol = Symbol('onreadystatechange');
        const xhrReadyStateSymbol = Symbol('readyState');
        const xhrTimeoutSymbol = Symbol('timeout');
        const xhrWithCredentialsSymbol = Symbol('withCredentials');
        const xhrUploadSymbol = Symbol('upload');
        const xhrResponseTypeSymbol = Symbol('responseType');
        const defineEvent = (obj, symbol) => {
            const type = symbol.description.substring(2);
            Object.defineProperty(obj, symbol, {
                configurable: false,
                enumerable: false,
                value: null,
                writable: true
            });
            obj.addEventListener(type, function (event) {
                const handler = this[symbol];
                if (handler) {
                    handler.call(this, event);
                }
            });
        };
        const changeReadyState = (xhr, readyState) => {
            xhr[xhrReadyStateSymbol] = readyState;
            xhr.dispatchEvent(new Event('readystatechange'));
        };
        let isSealed = true;
        class XMLHttpRequestEventTarget extends EventTarget {
            constructor() {
                super();
                if (!(this instanceof XMLHttpRequest) && !(this instanceof XMLHttpRequestUpload)) {
                    throw new TypeError('Illegal constructor');
                }
                defineEvent(this, xhrOnLoadStartSymbol);
                defineEvent(this, xhrOnProgressSymbol);
                defineEvent(this, xhrOnAbortSymbol);
                defineEvent(this, xhrOnErrorSymbol);
                defineEvent(this, xhrOnLoadSymbol);
                defineEvent(this, xhrOnTimeoutSymbol);
                defineEvent(this, xhrOnLoadEndSymbol);
            }
            get onloadstart() {
                return this[xhrOnLoadStartSymbol];
            }
            set onloadstart(value) {
                this[xhrOnLoadStartSymbol] = value;
            }
            get onprogress() {
                return this[xhrOnProgressSymbol];
            }
            set onprogress(value) {
                this[xhrOnProgressSymbol] = value;
            }
            get onabort() {
                return this[xhrOnAbortSymbol];
            }
            set onabort(value) {
                this[xhrOnAbortSymbol] = value;
            }
            get onerror() {
                return this[xhrOnErrorSymbol];
            }
            set onerror(value) {
                this[xhrOnErrorSymbol] = value;
            }
            get ontimeout() {
                return this[xhrOnTimeoutSymbol];
            }
            set ontimeout(value) {
                this[xhrOnTimeoutSymbol] = value;
            }
            get onloadend() {
                return this[xhrOnLoadEndSymbol];
            }
            set onloadend(value) {
                this[xhrOnLoadEndSymbol] = value;
            }
        }
        exports.XMLHttpRequestEventTarget = {
            configurable: true,
            enumerable: true,
            value: XMLHttpRequestEventTarget,
            writable: true
        };
        class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
            constructor() {
                if (isSealed) {
                    throw new TypeError('Illegal constructor');
                }
                super();
            }
        }
        exports.XMLHttpRequestUpload = {
            configurable: true,
            enumerable: true,
            value: XMLHttpRequestUpload,
            writable: true
        };
        class XMLHttpRequest extends XMLHttpRequestEventTarget {
            constructor() {
                super();
                isSealed = false;
                const xhrUpload = new XMLHttpRequestUpload();
                isSealed = true;
                Object.defineProperty(this, xhrDeferredHandleSymbol, {
                    configurable: false,
                    enumerable: false,
                    value: null,
                    writable: true
                });
                defineEvent(this, xhrOnReadyStateChangeSymbol);
                Object.defineProperty(this, xhrReadyStateSymbol, {
                    configurable: false,
                    enumerable: false,
                    value: xhrUnsent,
                    writable: true
                });
                Object.defineProperty(this, xhrTimeoutSymbol, {
                    configurable: false,
                    enumerable: false,
                    value: 0,
                    writable: true
                });
                Object.defineProperty(this, xhrWithCredentialsSymbol, {
                    configurable: false,
                    enumerable: false,
                    value: false,
                    writable: true
                });
                Object.defineProperty(this, xhrUploadSymbol, {
                    configurable: false,
                    enumerable: false,
                    value: xhrUpload,
                    writable: false
                });
                Object.defineProperty(this, xhrResponseTypeSymbol, {
                    configurable: false,
                    enumerable: false,
                    value: '',
                    writable: true
                });
            }
            get onreadystatechange() {
                return this[xhrOnReadyStateChangeSymbol];
            }
            set onreadystatechange(value) {
                this[xhrOnReadyStateChangeSymbol] = value;
            }
            get readyState() {
                return this[xhrReadyStateSymbol];
            }
            open(method, url) {
                switch (this[xhrReadyStateSymbol]) {
                case xhrUnsent:
                case xhrDone: {
                        changeReadyState(this, xhrOpened);
                        break;
                    }
                }
            }
            setRequestHeader(name, value) {
            }
            setTrustToken(trustToken) {
            }
            get timeout() {
                return this[xhrTimeoutSymbol];
            }
            set timeout(value) {
                this[xhrTimeoutSymbol] = value;
            }
            get withCredentials() {
                return this[xhrWithCredentialsSymbol];
            }
            set withCredentials(value) {
                switch (this[xhrReadyStateSymbol]) {
                case xhrUnsent:
                case xhrOpened: {
                        break;
                    }
                default: {
                        throw new DOMException('Failed to set the \'withCredentials\' property on \'XMLHttpRequest\': The value may only be set if the object\'s state is UNSENT or OPENED.');
                    }
                }
                this[xhrWithCredentialsSymbol] = !!value;
            }
            get upload() {
                return this[xhrUploadSymbol];
            }
            send() {
                if (this[xhrReadyStateSymbol] === xhrOpened && this[xhrDeferredHandleSymbol] === null) {
                    this[xhrDeferredHandleSymbol] = setTimeout(() => {
                        this[xhrDeferredHandleSymbol] = null;
                        changeReadyState(this, xhrDone);
                        this.dispatchEvent(new ProgressEvent('error'));
                        this.dispatchEvent(new ProgressEvent('loadend'));
                    }, 0);
                } else {
                    throw new DOMException('Failed to execute \'send\' on \'XMLHttpRequest\': The object\'s state must be OPENED.');
                }
            }
            abort() {
                if (this[xhrReadyStateSymbol] === xhrOpened && this[xhrDeferredHandleSymbol] !== null) {
                    clearTimeout(this[xhrDeferredHandleSymbol]);
                    this[xhrDeferredHandleSymbol] = null;
                    changeReadyState(this, xhrUnsent);
                    this.dispatchEvent(new ProgressEvent('abort'));
                    this.dispatchEvent(new ProgressEvent('loadend'));
                }
            }
            get responseURL() {
                return '';
            }
            get status() {
                return 0;
            }
            get statusText() {
                return '';
            }
            getResponseHeader(name) {
                return null;
            }
            overrideMimeType(mime) {
            }
            get responseType() {
                return this[xhrResponseTypeSymbol];
            }
            set responseType(value) {
                switch (this[xhrReadyStateSymbol]) {
                case xhrDone: {
                        throw new DOMException('Failed to set the \'responseType\' property on \'XMLHttpRequest\': The response type cannot be set if the object\'s state is LOADING or DONE.');
                    }
                }
                switch (value) {
                case '':
                case 'arraybuffer':
                case 'blob':
                case 'document':
                case 'json':
                case 'text': {
                        this[xhrResponseTypeSymbol] = value;
                        break;
                    }
                }
            }
            get response() {
                const responseType = this[xhrResponseTypeSymbol];
                return responseType === '' || responseType === 'text' ? '' : null;
            }
            get responseText() {
                const responseType = this[xhrResponseTypeSymbol];
                if (responseType === '' || responseType === 'text') {
                    return '';
                } else {
                    throw new DOMException('Failed to read the \'responseText\' property from \'XMLHttpRequest\': The value is only accessible if the object\'s \'responseType\' is \'\' or \'text\' (was \'arraybuffer\').');
                }
            }
            get responseXML() {
                return null;
            }
        }
        Object.defineProperty(XMLHttpRequest, 'UNSENT', {
            configurable: false,
            enumerable: true,
            value: xhrUnsent
        });
        Object.defineProperty(XMLHttpRequest, 'OPENED', {
            configurable: false,
            enumerable: true,
            value: xhrOpened
        });
        Object.defineProperty(XMLHttpRequest, 'HEADERS_RECEIVED', {
            configurable: false,
            enumerable: true,
            value: xhrHeadersReceived
        });
        Object.defineProperty(XMLHttpRequest, 'LOADING', {
            configurable: false,
            enumerable: true,
            value: xhrLoading
        });
        Object.defineProperty(XMLHttpRequest, 'DONE', {
            configurable: false,
            enumerable: true,
            value: xhrDone
        });
        exports.XMLHttpRequest = {
            configurable: true,
            enumerable: true,
            value: XMLHttpRequest,
            writable: true
        };
    })($___mock_83c72d4a1fbf0fb7);
    const $___mock_233f3bc61d9f5629 = {};
    (exports => {
        'use strict';
        let isSealed = false;
        class Storage {
            constructor() {
                if (isSealed) {
                    throw new TypeError('Illegal constructor');
                }
            }
            get length() {
                return Object.keys(this).length;
            }
            key(index) {
                const keys = Object.keys(this);
                if (index < 0 || index >= keys.length) {
                    return null;
                }
                return keys[index];
            }
            getItem(key) {
                return Object.prototype.hasOwnProperty.call(this, key) ? this[key] : null;
            }
            setItem(key, value) {
                this[key] = String(value);
            }
            removeItem(key) {
                delete this[key];
            }
            clear() {
                const keys = Object.keys(this);
                for (const key of keys) {
                    delete this[key];
                }
            }
        }
        exports.Storage = {
            configurable: true,
            enumerable: true,
            value: Storage,
            writable: true
        };
        const localStorage = new Storage();
        exports.localStorage = {
            configurable: true,
            enumerable: true,
            get() {
                return localStorage;
            }
        };
        const sessionStorage = new Storage();
        exports.sessionStorage = {
            configurable: true,
            enumerable: true,
            get() {
                return sessionStorage;
            }
        };
        isSealed = true;
    })($___mock_233f3bc61d9f5629);
    (function () {
        var $___var_fff1ac581d2c9fe4 = function (e) {
            var t = {};
            function n(o) {
                if (t[o])
                    return t[o].exports;
                var r = t[o] = {
                    i: o,
                    l: !1,
                    exports: {}
                };
                return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports;
            }
            return n.m = e, n.c = t, n.d = function (e, t, o) {
                n.o(e, t) || Object.defineProperty(e, t, {
                    enumerable: !0,
                    get: o
                });
            }, n.r = function (e) {
                'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
            }, n.t = function (e, t) {
                if (1 & t && (e = n(e)), 8 & t)
                    return e;
                if (4 & t && 'object' == typeof e && e && e.__esModule)
                    return e;
                var o = Object.create(null);
                if (n.r(o), Object.defineProperty(o, 'default', {
                        enumerable: !0,
                        value: e
                    }), 2 & t && 'string' != typeof e)
                    for (var r in e)
                        n.d(o, r, function (t) {
                            return e[t];
                        }.bind(null, r));
                return o;
            }, n.n = function (e) {
                var t = e && e.__esModule ? function () {
                    return e.default;
                } : function () {
                    return e;
                };
                return n.d(t, 'a', t), t;
            }, n.o = function (e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }, n.p = '', n(n.s = 2);
        }([
            function (e, t, n) {
                'use strict';
                t.__esModule = !0, t.getCookieDomain = t.createCookie = t.setCookie = t.findCookie = t.getCookie = t.twoLevelDomains = t.COOKIE_LIFETIME_MILLIS = void 0;
                var o = n(1);
                t.COOKIE_LIFETIME_MILLIS = 34128000000, t.twoLevelDomains = [
                    'co.uk',
                    'co.jp',
                    'com.au',
                    'com.hk',
                    'com.br',
                    'co.th',
                    'co.in',
                    'com.sg',
                    'co.kr',
                    'com.tw',
                    'com.my',
                    'co.nz',
                    'com.cn',
                    'com.gr',
                    'com.tr',
                    'co.za',
                    'com.ph',
                    'com.vn',
                    'co.id',
                    'com.mx',
                    'com.ar',
                    'co.hu',
                    'com.co',
                    'org.uk',
                    'com.pl',
                    'com.pe',
                    'com.pk',
                    'co.li',
                    'com.ua',
                    'net.pl',
                    'com.sh',
                    'com.mk',
                    'co.at',
                    'co.ke'
                ], t.getCookie = function (e, n) {
                    return t.findCookie(e, n.cookie);
                }, t.findCookie = function (e, t) {
                    for (var n = e + '=', r = decodeURIComponent(t).split('; '), i = 0; i < r.length; i++) {
                        var c = r[i];
                        if (o.startsWith(n, c))
                            return c.substring(n.length, c.length);
                    }
                }, t.setCookie = function (e, t) {
                    e.cookie = t;
                }, t.createCookie = function (e, n, o, r, i) {
                    var c = t.getCookieDomain(e), u = o + '=' + r + ';' + ('expires=' + new Date(n.getTime() + t.COOKIE_LIFETIME_MILLIS).toUTCString()) + ';path=/';
                    return 'https:' === i && (u += ';secure'), '' !== c && (u += ';domain=' + c), u;
                }, t.getCookieDomain = function (e) {
                    if ('localhost' === e)
                        return e;
                    var n = e.split('.'), r = n.splice(-2).join('.');
                    return o.includes(r, t.twoLevelDomains) && (r = (n = e.split('.')).splice(-3).join('.')), '.' + r;
                };
            },
            function (e, t, n) {
                'use strict';
                t.__esModule = !0, t.isObject = t.values = t.startsWith = t.isEmpty = t.isDefined = t.includes = t.getValueFromQueryString = void 0, t.getValueFromQueryString = function (e, n) {
                    for (var o = (t.startsWith('?', e) ? e.substring(1) : e).split('&'), r = n.toLowerCase(), i = 0, c = o; i < c.length; i++) {
                        var u = c[i].split('=');
                        if (u[0].toLowerCase() === r)
                            return u[1];
                    }
                }, t.includes = function (e, t) {
                    for (var n in t)
                        if (t[n] === e)
                            return !0;
                    return !1;
                }, t.isDefined = function (e) {
                    return void 0 !== e;
                }, t.isEmpty = function (e) {
                    for (var t in e)
                        if (e.hasOwnProperty(t))
                            return !1;
                    return !0;
                }, t.startsWith = function (e, t) {
                    return t.substring(0, e.length) === e;
                }, t.values = function (e) {
                    var t = [];
                    for (var n in e)
                        e.hasOwnProperty(n) && t.push(e[n]);
                    return t;
                }, t.isObject = function (e) {
                    return 'object' == typeof e && null !== e;
                }, 'function' != typeof Object.assign && Object.defineProperty(Object, 'assign', {
                    value: function (e, t) {
                        if (null == e)
                            throw new TypeError('Cannot convert undefined or null to object');
                        for (var n = Object(e), o = 1; o < arguments.length; o++) {
                            var r = arguments[o];
                            if (null != r)
                                for (var i in r)
                                    Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i]);
                        }
                        return n;
                    },
                    writable: !0,
                    configurable: !0
                });
            },
            function (e, t, n) {
                'use strict';
                var o = this && this.__assign || function () {
                    return (o = Object.assign || function (e) {
                        for (var t, n = 1, o = arguments.length; n < o; n++)
                            for (var r in t = arguments[n])
                                Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                        return e;
                    }).apply(this, arguments);
                };
                t.__esModule = !0;
                var r = n(3), i = n(6), c = n(9), u = n(1), a = n(0), s = {
                        path: '',
                        consentTimeout: 1000
                    }, l = { isDeviceAccessGranted: !1 };
                t.default = function (e) {
                    if (void 0 !== e.win) {
                        var t = (e = o(o({}, s), e)).win, n = e.date, c = e.consentTimeout, u = r(), a = t.location.search, d = j(t), v = !1, p = setTimeout(function () {
                                v = !0, f(d, a, e, u, l);
                            }, c);
                        return i.consentForAdvertiser(t, n, function (t) {
                            clearTimeout(p), v || f(d, a, e, u, t);
                        }, O(a) || d.cjdata), { sendOrder: m(e, u) };
                    }
                };
                var f = function (e, t, n, o, r) {
                        var i = I(t) || e.cjevent;
                        !function (e, t, n, o) {
                            var r, i, u = e.win, s = e.date, l = e.setCookieUrl, f = e.path, d = e.tagId, v = e.integrationDomain, p = e.integrationType;
                            S(n, o) && function (e, t, n) {
                                a.setCookie(e.document, a.createCookie(e.location.hostname, t, c.CjEventKeys.DocumentCookie, n, e.location.protocol)), c.setStorageItem(c.CjEventKeys.LocalStorage, n, e.localStorage), c.setStorageItem(c.CjEventKeys.SessionStorage, n, e.sessionStorage);
                            }(u, s, o);
                            w(p, o, n.encodedCjConsent, l) && function (e, t, n, o, r, i) {
                                n ? E(o, n, t, e) : b(o, r, t, i, e);
                            }(n, o, l, u, f, d);
                            var m = null === (r = u.cj) || void 0 === r ? void 0 : r.order, g = y(u, n, m, o, v, p, t), h = null === (i = u.cj) || void 0 === i ? void 0 : i.orders;
                            null == h || h.forEach(function (e) {
                                return y(u, n, e, o, v, p, t);
                            }), function (e, t, n, o, r, i, c) {
                                var u = [
                                        [
                                            'id',
                                            e
                                        ],
                                        [
                                            'tagId',
                                            t
                                        ],
                                        [
                                            'payload',
                                            JSON.stringify(r)
                                        ],
                                        [
                                            'cjeventls',
                                            i.localStorage
                                        ],
                                        [
                                            'cjeventss',
                                            i.sessionStorage
                                        ],
                                        [
                                            'cjeventq',
                                            i.cjeventQueryString
                                        ],
                                        [
                                            'isDeviceAccessGranted',
                                            c
                                        ]
                                    ].filter(function (e) {
                                        return null !== e[1] && void 0 !== e[1];
                                    }).map(function (e) {
                                        return e.map(encodeURIComponent).join('=');
                                    }).join('&'), a = new Blob([u], { type: 'application/x-www-form-urlencoded' });
                                !function (e, t) {
                                    const $___old_4f600e282f9e7eb8 = {}.constructor.getOwnPropertyDescriptor(window, 'XMLHttpRequest'), $___old_d56aa6ede68d5f7a = {}.constructor.getOwnPropertyDescriptor(window, 'XMLHttpRequest');
                                    try {
                                        if ($___old_4f600e282f9e7eb8)
                                            ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___mock_83c72d4a1fbf0fb7.XMLHttpRequest));
                                        if ($___old_d56aa6ede68d5f7a)
                                            ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___mock_83c72d4a1fbf0fb7.XMLHttpRequest));
                                        return function () {
                                            try {
                                                var n = new XMLHttpRequest();
                                                n.open('POST', e, !1), n.onerror = function () {
                                                }, n.setRequestHeader('Accept', '*/*'), 'string' == typeof t ? n.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8') : '[object Blob]' === Object.prototype.toString.call(t) && t.type && n.setRequestHeader('Content-Type', t.type), n.send(t);
                                            } catch (e) {
                                                return !1;
                                            }
                                        }.apply(this, arguments);
                                    } finally {
                                        if ($___old_4f600e282f9e7eb8)
                                            ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___old_4f600e282f9e7eb8));
                                        if ($___old_d56aa6ede68d5f7a)
                                            ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___old_d56aa6ede68d5f7a));
                                    }
                                }(function (e, t, n) {
                                    return C(e) + _(t) + '/' + n + '/pageInfo';
                                }(n, o, t), a);
                            }(t, d, u, f, u.cj, g, n.isDeviceAccessGranted);
                        }(n, o, r, i), v = r, p = i, d = !0;
                    }, d = !1, v = null, p = null, m = function (e, t) {
                        return function (n) {
                            if (d) {
                                var o = e.integrationDomain, r = e.integrationType, i = e.win, c = k(i, v, n, p);
                                h(o, r, t, i, n, c);
                            } else
                                setTimeout(function () {
                                    return m(e, t);
                                }, 500);
                        };
                    };
                function y(e, t, n, o, r, i, c) {
                    var u = k(e, t, n, o);
                    return n && h(r, i, c, e, n, u), u;
                }
                function g(e, t) {
                    var n = e.document.createElement('img');
                    n.id = 'cjSetEventIdPixel', n.alt = '', n.style.display = 'none', n.height = 1, n.width = 1, n.src = t, e.document.body.appendChild(n);
                }
                function h(e, t, n, r, i, c) {
                    var a = function (e) {
                        var t, n, o = [];
                        for (t in e)
                            e.hasOwnProperty(t) && (n = e[t] + '' || '', o.push(encodeURIComponent(t) + '=' + encodeURIComponent(n)));
                        return o.join('&');
                    }(function (e, t) {
                        var n = o({}, e);
                        if (u.isEmpty(t) || u.isEmpty(n))
                            return n;
                        for (var r in t)
                            t.hasOwnProperty(r) && T(r, t[r], n);
                        return n;
                    }(function (e, t, n, r) {
                        var i = function (e) {
                                var t = {}, n = '';
                                M.forEach(function (o) {
                                    var r = o.key, i = o.type, c = e[i];
                                    c && (n && n !== c && (t[r] = c), n = n || c);
                                }), n && (t.cjevent = n);
                                return t;
                            }(r), c = function (e, t) {
                                var n, o = e || 0;
                                return M.forEach(function (e) {
                                    var n = e.value, r = e.type;
                                    t[r] && (o += n);
                                }), (n = {})['custom.stats'] = o, n;
                            }(e, r), a = function (e) {
                                var t = {};
                                return function e(t, o, r) {
                                    if (u.isEmpty(t))
                                        return;
                                    for (var i in t)
                                        if (t.hasOwnProperty(i)) {
                                            var c = t[i];
                                            if (u.isDefined(c)) {
                                                var a = D(i, r);
                                                Array.isArray(c) ? n(c, o, a) : u.isObject(c) ? e(c, o, a) : o[a] = c;
                                            }
                                        }
                                }(e, t, ''), t;
                                function n(e, t, n) {
                                    for (var o = 0; o < e.length; o++) {
                                        var r = e[o];
                                        if (u.isDefined(r) && !u.isEmpty(r))
                                            for (var i in r)
                                                if (r.hasOwnProperty(i)) {
                                                    var c = D(i + (o + 1), n);
                                                    u.includes(i, x) || (t[c] = r[i]);
                                                }
                                    }
                                }
                            }(n);
                        return o(o(o(o({}, i), a), c), { tagUuid: t });
                    }(t, n, i, c), R));
                    !function (e, t) {
                        var n = e.document.createElement('img');
                        n.style.display = 'none', n.height = 1, n.width = 1, n.src = t, e.document.body.appendChild(n);
                    }(r, A(e, a));
                }
                function C(e) {
                    var t = e.document.getElementById('cjapitag');
                    return function (e, t) {
                        var n = e.document.createElement('a');
                        return n.href = t, n.origin || n.protocol + '//' + n.hostname;
                    }(e, t.src);
                }
                var j = function (e) {
                        var t;
                        return !(null === (t = null == e ? void 0 : e.CJClientApi) || void 0 === t ? void 0 : t.tagData) || O(e.location.search) && I(e.location.search) ? {} : e.CJClientApi.tagData;
                    }, E = function (e, t, n, o) {
                        var r = [];
                        o.isDeviceAccessGranted && n && r.push('cje=' + n), o.encodedCjConsent && r.push('cjConsent=' + o.encodedCjConsent), g(e, t + '?' + r.join('&'));
                    }, b = function (e, t, n, o, r) {
                        var i = ['hasConsent=' + r.isDeviceAccessGranted];
                        r.encodedCjConsent && i.push('cjConsent=' + r.encodedCjConsent), g(e, '' + C(e) + _(t) + '/tags/images/' + n + '/' + o + '/seteventid.png?' + i.join('&'));
                    }, S = function (e, t) {
                        return e.isDeviceAccessGranted && !!t;
                    }, w = function (e, t, n, o) {
                        var r = t || n, i = L(e) || o;
                        return !(!r || !i);
                    };
                function k(e, t, n, o) {
                    const $___old_c69396fab25f9675 = {}.constructor.getOwnPropertyDescriptor(window, 'localStorage'), $___old_57218ca1951be718 = {}.constructor.getOwnPropertyDescriptor(window, 'sessionStorage');
                    try {
                        if ($___old_c69396fab25f9675)
                            ({}.constructor.defineProperty(window, 'localStorage', $___mock_233f3bc61d9f5629.localStorage));
                        if ($___old_57218ca1951be718)
                            ({}.constructor.defineProperty(window, 'sessionStorage', $___mock_233f3bc61d9f5629.sessionStorage));
                        return function () {
                            var r = {
                                    cjeventOrder: n ? n.cjeventOrder : void 0,
                                    cjeventQueryString: o
                                }, i = t.isDeviceAccessGranted ? c.getPersistedCjEvents(e.document, e.localStorage, e.sessionStorage) : {};
                            return Object.assign(r, i);
                        }.apply(this, arguments);
                    } finally {
                        if ($___old_c69396fab25f9675)
                            ({}.constructor.defineProperty(window, 'localStorage', $___old_c69396fab25f9675));
                        if ($___old_57218ca1951be718)
                            ({}.constructor.defineProperty(window, 'sessionStorage', $___old_57218ca1951be718));
                    }
                }
                function I(e) {
                    return u.getValueFromQueryString(e, 'cjevent');
                }
                function O(e) {
                    return u.getValueFromQueryString(e, 'cjData');
                }
                function T(e, t, n) {
                    var o = e.toLowerCase();
                    for (var r in n)
                        if (n.hasOwnProperty(r)) {
                            var i = r.toLowerCase();
                            if (u.startsWith(o, i))
                                n[i.replace(o, t)] = n[r], delete n[r];
                        }
                }
                function _(e) {
                    if (0 === e.length)
                        return e;
                    var t = e;
                    return '/' != t.charAt(0) && (t = '/' + t), '/' === t.charAt(t.length - 1) && (t = t.slice(0, t.length - 1)), t;
                }
                var D = function (e, t) {
                        return t ? t + '.' + e : e;
                    }, P = 2, L = function (e) {
                        return e == P;
                    }, A = function (e, t) {
                        return 'https://' + e + '/u?method=img&' + t;
                    }, M = [
                        {
                            key: 'cjeventOrder',
                            value: 3276800,
                            type: 'cjeventOrder'
                        },
                        {
                            key: 'cjevent',
                            value: 65536,
                            type: 'serverSetCookie'
                        },
                        {
                            key: 'cjevent_adv',
                            value: 1441792,
                            type: 'clientServerCookie'
                        },
                        {
                            key: 'cjeventc',
                            value: 131072,
                            type: 'documentCookie'
                        },
                        {
                            key: 'cjeventl',
                            value: 262144,
                            type: 'localStorage'
                        },
                        {
                            key: 'cjevents',
                            value: 524288,
                            type: 'sessionStorage'
                        },
                        {
                            key: 'cjeventq',
                            value: 6553600,
                            type: 'cjeventQueryString'
                        }
                    ], R = {
                        'items.itemId': 'item',
                        'items.unitPrice': 'amt',
                        'items.quantity': 'qty',
                        'items.discount': 'dcnt',
                        'bypassChannel.name': 'channel',
                        'bypassChannel.timestamp': 'channel_ts',
                        'items.': '',
                        actionTrackerId: 'type',
                        enterpriseId: 'cid',
                        orderId: 'oid'
                    }, x = u.values(R);
            },
            function (e, t, n) {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }), t.default = void 0;
                var o = i(n(4)), r = i(n(5));
                function i(e) {
                    return e && e.__esModule ? e : { default: e };
                }
                var c = function (e, t, n) {
                    var i = t && n || 0;
                    'string' == typeof e && (t = 'binary' === e ? new Array(16) : null, e = null);
                    var c = (e = e || {}).random || (e.rng || o.default)();
                    if (c[6] = 15 & c[6] | 64, c[8] = 63 & c[8] | 128, t)
                        for (var u = 0; u < 16; ++u)
                            t[i + u] = c[u];
                    return t || (0, r.default)(c);
                };
                t.default = c, e.exports = t.default;
            },
            function (e, t, n) {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }), t.default = function () {
                    if (!o)
                        throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
                    return o(r);
                };
                var o = 'undefined' != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || 'undefined' != typeof msCrypto && 'function' == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto), r = new Uint8Array(16);
                e.exports = t.default;
            },
            function (e, t, n) {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }), t.default = void 0;
                for (var o = [], r = 0; r < 256; ++r)
                    o[r] = (r + 256).toString(16).substr(1);
                var i = function (e, t) {
                    var n = t || 0, r = o;
                    return [
                        r[e[n++]],
                        r[e[n++]],
                        r[e[n++]],
                        r[e[n++]],
                        '-',
                        r[e[n++]],
                        r[e[n++]],
                        '-',
                        r[e[n++]],
                        r[e[n++]],
                        '-',
                        r[e[n++]],
                        r[e[n++]],
                        '-',
                        r[e[n++]],
                        r[e[n++]],
                        r[e[n++]],
                        r[e[n++]],
                        r[e[n++]],
                        r[e[n++]]
                    ].join('');
                };
                t.default = i, e.exports = t.default;
            },
            function (e, t, n) {
                'use strict';
                t.__esModule = !0, t.consentForAdvertiser = void 0;
                var o, r = n(7), i = n(0);
                !function (e) {
                    e.CONFIRMED = 'Y', e.DECLINED = 'N', e.NEVER_ASKED = '0';
                }(o || (o = {}));
                var c = function (e) {
                        var t = function (e) {
                            return e ? 'Y' : 'N';
                        };
                        return e.version + '|' + t(e.isInGdprZone) + '|' + e.dtmConsent.toString() + '|' + t(e.isInterimPeriod) + '|' + e.loyaltyExpiration;
                    }, u = function (e) {
                        var t = function (e) {
                            return 'Y' == e;
                        };
                        if (new RegExp('\\d+\\|[YN]\\|[YN0]\\|[YN]\\|\\d+').test(e)) {
                            var n = e.split('|');
                            return {
                                version: n[0],
                                isInGdprZone: t(n[1]),
                                dtmConsent: n[2],
                                isInterimPeriod: t(n[3]),
                                loyaltyExpiration: n[4]
                            };
                        }
                    }, a = function (e) {
                        return atob(decodeURIComponent(e));
                    }, s = function (e) {
                        return i.getCookie('cjConsent', e);
                    }, l = function (e, t, n) {
                        var o = i.createCookie(e.location.hostname, n, 'cjConsent', t, e.location.protocol);
                        i.setCookie(e.document, o);
                    }, f = function (e, t) {
                        return !e.isInGdprZone || (!!function (e, t) {
                            var n = Number(e);
                            return !isNaN(n) && (0 !== n && n > t.getTime());
                        }(e.loyaltyExpiration, t) || (e.dtmConsent == o.CONFIRMED || e.dtmConsent != o.DECLINED && e.isInterimPeriod));
                    };
                t.consentForAdvertiser = function (e, t, n, o) {
                    var i, m = o ? u(a(o)) : void 0;
                    if (m ? function (e, t, n) {
                            var o = c(e), r = encodeURI(btoa(o));
                            l(t, r, n);
                        }(m, e, t) : m = function (e) {
                            var t = s(e.document);
                            return t ? u(a(t)) : void 0;
                        }(e), m) {
                        i = f(m, t), o = encodeURI(btoa(c(m)));
                        var y = p(i, o);
                        n(y);
                    } else
                        try {
                            r.fetchPolicy(function (o) {
                                v(n, o, t, e);
                            }, function () {
                                d(n);
                            });
                        } catch (e) {
                            d(n);
                        }
                };
                var d = function (e) {
                        e(p(!1));
                    }, v = function (e, t, n, r) {
                        var i = !t.cjPolicyEnforcement, u = function (e) {
                                return encodeURI(btoa(c({
                                    version: '0',
                                    isInGdprZone: e.cjPolicyEnforcement,
                                    dtmConsent: o.NEVER_ASKED,
                                    isInterimPeriod: !1,
                                    loyaltyExpiration: '0'
                                })));
                            }(t);
                        l(r, u, n), e(p(i, u));
                    }, p = function (e, t) {
                        return {
                            isDeviceAccessGranted: e,
                            encodedCjConsent: t
                        };
                    };
            },
            function (e, t, n) {
                'use strict';
                (function (e) {
                    var n;
                    t.__esModule = !0, t.fetchPolicy = void 0;
                    var o = 'dev' === (null === (n = null == e ? void 0 : e.env) || void 0 === n ? void 0 : n.ENVIRONMENT) ? 'https://onetag-sjwoe.t.cjpowered.com/policy' : 'https://www.sjwoe.com/policy';
                    t.fetchPolicy = function (e, t) {
                        const $___old_d4ada941a7169e08 = {}.constructor.getOwnPropertyDescriptor(window, 'XMLHttpRequest'), $___old_33c6018a78e01eff = {}.constructor.getOwnPropertyDescriptor(window, 'XMLHttpRequest');
                        try {
                            if ($___old_d4ada941a7169e08)
                                ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___mock_83c72d4a1fbf0fb7.XMLHttpRequest));
                            if ($___old_33c6018a78e01eff)
                                ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___mock_83c72d4a1fbf0fb7.XMLHttpRequest));
                            return function () {
                                var n = new XMLHttpRequest();
                                n.addEventListener('load', function () {
                                    return e(JSON.parse(n.response));
                                }), n.addEventListener('error', function () {
                                    return t();
                                }), n.open('GET', o), n.send();
                            }.apply(this, arguments);
                        } finally {
                            if ($___old_d4ada941a7169e08)
                                ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___old_d4ada941a7169e08));
                            if ($___old_33c6018a78e01eff)
                                ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___old_33c6018a78e01eff));
                        }
                    };
                }.call(this, n(8)));
            },
            function (e, t) {
                var n, o, r = e.exports = {};
                function i() {
                    throw new Error('setTimeout has not been defined');
                }
                function c() {
                    throw new Error('clearTimeout has not been defined');
                }
                function u(e) {
                    if (n === setTimeout)
                        return setTimeout(e, 0);
                    if ((n === i || !n) && setTimeout)
                        return n = setTimeout, setTimeout(e, 0);
                    try {
                        return n(e, 0);
                    } catch (t) {
                        try {
                            return n.call(null, e, 0);
                        } catch (t) {
                            return n.call(this, e, 0);
                        }
                    }
                }
                !function () {
                    try {
                        n = 'function' == typeof setTimeout ? setTimeout : i;
                    } catch (e) {
                        n = i;
                    }
                    try {
                        o = 'function' == typeof clearTimeout ? clearTimeout : c;
                    } catch (e) {
                        o = c;
                    }
                }();
                var a, s = [], l = !1, f = -1;
                function d() {
                    l && a && (l = !1, a.length ? s = a.concat(s) : f = -1, s.length && v());
                }
                function v() {
                    if (!l) {
                        var e = u(d);
                        l = !0;
                        for (var t = s.length; t;) {
                            for (a = s, s = []; ++f < t;)
                                a && a[f].run();
                            f = -1, t = s.length;
                        }
                        a = null, l = !1, function (e) {
                            if (o === clearTimeout)
                                return clearTimeout(e);
                            if ((o === c || !o) && clearTimeout)
                                return o = clearTimeout, clearTimeout(e);
                            try {
                                o(e);
                            } catch (t) {
                                try {
                                    return o.call(null, e);
                                } catch (t) {
                                    return o.call(this, e);
                                }
                            }
                        }(e);
                    }
                }
                function p(e, t) {
                    this.fun = e, this.array = t;
                }
                function m() {
                }
                r.nextTick = function (e) {
                    var t = new Array(arguments.length - 1);
                    if (arguments.length > 1)
                        for (var n = 1; n < arguments.length; n++)
                            t[n - 1] = arguments[n];
                    s.push(new p(e, t)), 1 !== s.length || l || u(v);
                }, p.prototype.run = function () {
                    this.fun.apply(null, this.array);
                }, r.title = 'browser', r.browser = !0, r.env = {}, r.argv = [], r.version = '', r.versions = {}, r.on = m, r.addListener = m, r.once = m, r.off = m, r.removeListener = m, r.removeAllListeners = m, r.emit = m, r.prependListener = m, r.prependOnceListener = m, r.listeners = function (e) {
                    return [];
                }, r.binding = function (e) {
                    throw new Error('process.binding is not supported');
                }, r.cwd = function () {
                    return '/';
                }, r.chdir = function (e) {
                    throw new Error('process.chdir is not supported');
                }, r.umask = function () {
                    return 0;
                };
            },
            function (e, t, n) {
                'use strict';
                t.__esModule = !0, t.setStorageItem = t.getStorageItem = t.getPersistedCjEvents = t.CjEventKeys = void 0;
                var o, r = n(0);
                function i(e, t) {
                    return t && t.getItem(e);
                }
                !function (e) {
                    e.DocumentCookie = 'cjevent_dc', e.SetCookie = 'cjevent_sc', e.LocalStorage = 'cjevent', e.SessionStorage = 'cjevent', e.ClientServerCookie = 'cje';
                }(o = t.CjEventKeys || (t.CjEventKeys = {})), t.getPersistedCjEvents = function (e, t, n) {
                    return {
                        clientServerCookie: r.findCookie(o.ClientServerCookie, e.cookie),
                        documentCookie: r.findCookie(o.DocumentCookie, e.cookie),
                        serverSetCookie: r.findCookie(o.SetCookie, e.cookie),
                        localStorage: i(o.LocalStorage, t),
                        sessionStorage: i(o.SessionStorage, n)
                    };
                }, t.getStorageItem = i, t.setStorageItem = function (e, t, n) {
                    return n && n.setItem(e, t);
                };
            }
        ]);
        CJApi = $___var_fff1ac581d2c9fe4;
        var $___var_c0aacd67210c260d = CJApi.default({
            win: this.window,
            date: new Date(),
            integrationDomain: 'www.emjcd.com',
            integrationType: 1,
            tagId: '11746',
            path: '',
            setCookieUrl: undefined
        });
        cjApi = $___var_c0aacd67210c260d;
    }())
}