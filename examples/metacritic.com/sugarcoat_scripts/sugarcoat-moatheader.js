{
    const $___mock_6bf28fdad6c63137 = {};
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
    })($___mock_6bf28fdad6c63137);
    (function () {
        try {
            (function (z, w) {
                function ya() {
                    v.k.a.sxaz('trackingReady', { callback: ya });
                    pa = q.h;
                    q.h++;
                    q.i[pa] = !1;
                    var a = {};
                    v.ao.b(a);
                    v.f.al(a);
                    v.x.l();
                    v.l.e(v.j.e, 100);
                    v.ak.b();
                    v.k.a.azsx('adInitialized', v.ax.a);
                    v.c.ax.c || (v.c.ax.c = !0, q.dcsx && (q.dcsx.ynds(window, 'unload', 'unload-' + v.c.ax.a, 'unloadFn' + v.c.ax.a), q.dcsx.ynds(window, 'beforeunload', 'unload-' + v.c.ax.a, 'beforeunloadFn' + v.c.ax.a)));
                    q.swde.azsx('unload-' + v.c.ax.a, qa, { once: !0 });
                    v.k.a.azsx('allLocalAdsKilled', function () {
                        q.swde.sxaz('unload-' + v.c.ax.a, { callback: qa });
                    }, { once: !0 });
                    v.ay.c();
                    v.ay.d();
                }
                var v = {};
                w.floor(w.random() * w.pow(10, 12));
                var T, ra, la, pa = 0, ma = {}, M = {}, C = {}, U = [], B = {}, ha = !1, sa = {
                        15: '',
                        12: '',
                        6: '',
                        7: ''
                    }, za = function () {
                        for (var a in M)
                            M.hasOwnProperty && M.hasOwnProperty(a) && M[a] && v.a.a(M[a]);
                        for (a = 0; a < U.length; a++)
                            v.a.b(U[a]);
                        for (var k in C)
                            C.hasOwnProperty && C.hasOwnProperty(k) && C[k] && (v.a.a(C[k].tid), C[k] = !1);
                        M = {};
                        U = [];
                        N = null;
                        v.b = null;
                        v.c.a = null;
                    }, Aa = function () {
                        v.d.a(null, 0) || v.d.b();
                        za();
                    };
                v.e = Aa;
                (function (a) {
                    function k(b) {
                        return (b = a.a.c.toString.call(b)) && ('[object Array]' === b || '[object Array Iterator]' === b);
                    }
                    a.a = {};
                    a.a.c = {};
                    for (var g = [
                                [
                                    1,
                                    25
                                ],
                                [
                                    7,
                                    1
                                ],
                                [
                                    1,
                                    25
                                ],
                                [
                                    -74,
                                    1
                                ],
                                [
                                    1,
                                    9
                                ],
                                [
                                    -24,
                                    1
                                ],
                                [
                                    2,
                                    1
                                ],
                                [
                                    1,
                                    3
                                ],
                                [
                                    2,
                                    1
                                ],
                                [
                                    1,
                                    4
                                ],
                                [
                                    2,
                                    1
                                ],
                                [
                                    1,
                                    1
                                ],
                                [
                                    11,
                                    1
                                ],
                                [
                                    1,
                                    6
                                ],
                                [
                                    27,
                                    1
                                ],
                                [
                                    2,
                                    1
                                ],
                                [
                                    1,
                                    3
                                ],
                                [
                                    27,
                                    1
                                ],
                                [
                                    1,
                                    3
                                ],
                                [
                                    -92,
                                    1
                                ]
                            ], e = 65, c = '', d = 0, d = 0; d < g.length; d++)
                        for (var b = 0; b < g[d][1]; b++)
                            c += String.fromCharCode(e), e += g[d][0];
                    c += String.fromCharCode(e);
                    a.a.d = c;
                    a.a.e = function (a) {
                        for (var h = '', l = 0; l < a.length; l++)
                            a.hasOwnProperty(l) && (h += c[a[l]]);
                        return h;
                    };
                    a.a.f = k;
                    a.a.g = function (b) {
                        return !!(b && b.document && b.location && b[a.f.a([
                            26,
                            37,
                            30,
                            43,
                            45
                        ])] && b[a.f.a([
                            44,
                            30,
                            45,
                            8,
                            39,
                            45,
                            30,
                            43,
                            47,
                            26,
                            37
                        ])]);
                    };
                    a.a.h = function (b) {
                        if (null == b || a.a.g(b))
                            return !1;
                        var h = b.length;
                        return 1 === b.nodeType && h ? !0 : 'string' === typeof b || k(b) || 0 === h || 'number' === typeof h && 0 < h && h - 1 in b;
                    };
                    a.a.forEach = function (b, h, l, x) {
                        var c, d = typeof b;
                        if (b)
                            if ('function' === d)
                                for (c in b) {
                                    if ('prototype' != c && 'length' != c && 'name' != c && (x || !b.hasOwnProperty || b.hasOwnProperty(c)) && (d = h.call(l, b[c], c), 'boolean' === typeof d && !d))
                                        break;
                                }
                            else if ('number' === d)
                                for (c = 0; c < b && (d = h.call(l, b, c), 'boolean' !== typeof d || d); c++);
                            else if ('function' === typeof b.every)
                                b.every(function (a, b, x) {
                                    a = h.call(l, a, b);
                                    return !('boolean' === typeof a && !a);
                                });
                            else if (a.a.h(b))
                                for (c = 0; c < b.length && (d = h.call(l, b[c], c), 'boolean' !== typeof d || d); c++);
                            else
                                for (c in b)
                                    if (x || b.hasOwnProperty(c))
                                        if (d = h.call(l, b[c], c), 'boolean' === typeof d && !d)
                                            break;
                        return b;
                    };
                    a.a.i = function (b) {
                        if (!b)
                            return !1;
                        var h;
                        if (b !== Object(b))
                            h = b;
                        else if (a.a.h(b)) {
                            h = [];
                            for (var l = 0, x = b.length; l < x; l++)
                                h[l] = b[l];
                        } else
                            for (l in (h = {}, b))
                                h[l] = b[l];
                        return h;
                    };
                    a.a.j = function (b, h) {
                        if (!b || 'function' !== typeof b)
                            return !1;
                        var l = !1;
                        0 <= String(b).indexOf('[native code]') ? l = !0 : a.c.b || b === Function.prototype.toString || (l = !0);
                        l && h && (l = b.toString && b.toString === Function.prototype.toString);
                        return l;
                    };
                    a.a.k = function () {
                        try {
                            return navigator.userAgent;
                        } catch (a) {
                            return '';
                        }
                    };
                    a.a.l = function (b) {
                        b = b || a.a.k();
                        return !(!/iPad|iPhone|iPod|Silk|Kindle|Android|BlackBerry|PlayBook|BB10|Windows Phone|SpreadTrum|MAUI/.exec(b) && !a.a.m(b));
                    };
                    a.a.n = function (b) {
                        b = b || a.a.k();
                        return !!/Android/.exec(b);
                    };
                    a.a.m = function (a, h) {
                        var l = h || document;
                        return !!(/Macintosh/.exec(a) && 'ontouchend' in l);
                    };
                    a.a.o = function (b) {
                        b = b || a.a.k();
                        var h = /Safari|CriOS/i;
                        return !(!/iPhone|iPod|iPad/.exec(b) && !a.a.m(b) || h.exec(b));
                    };
                    a.a.p = function () {
                        return !1;
                    };
                    a.a.q = function (b) {
                        b = b || a.a.k();
                        return a.a.n(b) ? !!/Version/.exec(b) : !1;
                    };
                    a.a.r = function (b) {
                        if (!navigator)
                            return null;
                        b = b || a.a.k();
                        return b ? (b = b.match(/Edge\/(\d{1,}(.\d{1,})?)/)) ? parseFloat(b[1]) : null : null;
                    };
                    a.a.s = function () {
                        if (!navigator)
                            return null;
                        var b;
                        b = a.a.k();
                        return 'Microsoft Internet Explorer' == navigator.appName ? parseInt(b.replace(/^.*MSIE (\d+).*$/, '$1'), 10) : 'Netscape' == navigator.appName && (b = b.match(/(?:Trident\/.*rv:|MSIE )(\d+)/)) ? parseInt(b[1], 10) : null;
                    };
                    a.a.t = function () {
                        return null != a.a.s();
                    };
                    a.a.u = function (b, h) {
                        function l(h, b) {
                            if (b >= x || h !== Object(h))
                                return !1;
                            'function' === typeof h.toString && h.toString();
                            var c = Object.getPrototypeOf(h);
                            c && 'function' === typeof c.toString && c.toString();
                            b < x && a.a.forEach(h, function (a) {
                                l(a, b + 1);
                            });
                            return !1;
                        }
                        var x = w.min(10, h || 2);
                        try {
                            return l(b, 0);
                        } catch (c) {
                            return !0;
                        }
                    };
                }(v));
                (function (a) {
                    function k(a) {
                        var l = new RegExp('(^| )' + a + '($| )');
                        return function (a) {
                            return a && a.className && a.className.match(l);
                        };
                    }
                    function g(a) {
                        var l = {}, b;
                        for (b in a)
                            'number' === typeof a[b] && (l[b] = w.round(a[b]));
                        return l;
                    }
                    function e() {
                        return !1;
                    }
                    a.a.v = 2500;
                    a.a.w = 1000;
                    a.a.x = !1;
                    a.a.y = !1;
                    a.a.z = function () {
                        var h = /Firefox\/(\d+)/.exec(a.a.k());
                        return h ? (h = parseInt(h[1], 10), 21 > h && 14 < h) : !1;
                    }();
                    a.a.aa = function () {
                        var h, l = /^(?:[a-z]+:\/\/|:?\/?\/)?(?:www\.)?([^\/:]*)/i;
                        a.c.c || (h = a.a.ab(), !h && a.c.d && (h = a.c.d));
                        h || (h = a.c.e.location.hostname);
                        return (h = h && h.match && h.match(l)) && h[1] || a.c.e.location.hostname;
                    };
                    a.a.ac = function () {
                        var h = a.a.ad();
                        if (h && h.url)
                            return h;
                        var h = a.g.a(), l = a.a.ab(), b = a.a.ae(h, l);
                        return b && b.url || (b = a.a.af(h)) && b.url ? b : (l = a.a.ag(l)) && l.url ? l : (h = a.a.ah(h)) ? h : a.a.ai();
                    };
                    a.a.ai = function () {
                        a.c.f(10);
                        return {
                            url: '',
                            isCorrect: !1
                        };
                    };
                    a.a.ad = function () {
                        if (!a.c.c)
                            return !1;
                        var h = window.top && window.top.location && window.top.location.href;
                        if (h)
                            return a.c.f(4), {
                                url: h,
                                isCorrect: !0
                            };
                    };
                    a.a.ag = function (h) {
                        h = h || a.a.ab();
                        if (!h)
                            return !1;
                        a.c.f(2);
                        return {
                            url: h,
                            isCorrect: !1
                        };
                    };
                    a.a.ah = function (h) {
                        h = h && h.document && h.document.referrer;
                        if (!h)
                            return !1;
                        a.c.f(3);
                        return {
                            url: h,
                            isCorrect: !1
                        };
                    };
                    a.a.af = function (h) {
                        h = a.a.aj(h);
                        if (!h)
                            return !1;
                        h.parentIsTop ? a.c.f(3) : a.c.f(9);
                        return {
                            url: h.url,
                            isCorrect: !1
                        };
                    };
                    a.a.aj = function (h, l, b, c) {
                        l = a.c.c;
                        if (!h || l)
                            return !1;
                        l = h.document && h.document.referrer;
                        if (!l || !a.a.ak(l))
                            return !1;
                        if (h.parent === h.top)
                            return {
                                url: l,
                                parentIsTop: !0
                            };
                        h = location && location.ancestorOrigins;
                        b = location && location.origin;
                        if (!h || 0 === h.length || !b)
                            return !1;
                        c = !1;
                        for (var f, d = 0; d < h.length; d++)
                            if (f = h[d], b !== f) {
                                if (c)
                                    return !1;
                                c = !0;
                                b = f;
                            }
                        return c && 0 === l.search(h[h.length - 1]) ? {
                            url: l,
                            parentIsTop: !1
                        } : !1;
                    };
                    a.a.ae = function (h, l) {
                        l = l || a.a.ab();
                        if (!l)
                            return !1;
                        var b = a.a.al(h, l);
                        if (a.a.ak(b))
                            return a.c.f(6), {
                                url: b,
                                isCorrect: !1
                            };
                    };
                    a.a.al = function (a, l) {
                        var b;
                        b = a && a.location && a.location.hostname;
                        b = 'string' !== typeof b ? !1 : b.match(/^([^\.]+\.)*(googlesyndication\.com|doubleclick\.net|adnxs\.com)$/) && a.location.href;
                        if (!b || !l)
                            return !1;
                        var c = encodeURIComponent(l).replace(/[.*+^${}()|[\]\\]/g, '\\$&');
                        return (b = b.match(new RegExp('[?&](?:url|referrer)=(' + c + '(?:%2F[^&]*|$))'))) ? decodeURIComponent(b[1]) : !1;
                    };
                    a.a.am = function () {
                        if ('string' === typeof a.c.g)
                            return a.c.g;
                        var h = !1, l, b = /^https?:\/\/(.*?)\/([^?#]*)/;
                        a.c.c ? (h = window.location.hostname.replace('www.', ''), h += window.location.pathname) : (l = a.g.a(), l.parent === window.top && (h = l.document.referrer) && (l = b.exec(h)) && (h = l[1].replace('www.', '') + '/' + l[2]));
                        'string' === typeof h && '/' === h.charAt(h.length - 1) && (h = h.substr(0, h.length - 1));
                        return h;
                    };
                    a.a.an = function () {
                        var h;
                        a.c.c ? h = 2 : (h = a.g.a(), h = h.parent === window.top ? 2 : location && location.ancestorOrigins ? 1 : 0);
                        return h;
                    };
                    a.a.ab = function () {
                        var a = location && location.ancestorOrigins;
                        return a ? 0 === a.length ? !1 : a[a.length - 1] : !1;
                    };
                    a.a.ao = function () {
                        var h, l = a.a.aa(), b = l && l.split('.'), c = b && b.length;
                        3 <= c ? h = 'co' === b[c - 2] || 'com' === b[c - 2] ? b[c - 3] + '.' + b[c - 2] + '.' + b[c - 1] : b[c - 2] + '.' + b[c - 1] : 2 == c && (h = b[c - 2] + '.' + b[c - 1]);
                        return h && decodeURIComponent(h) || decodeURIComponent(l);
                    };
                    a.a.ap = function (a) {
                        if ('string' !== typeof a)
                            return '';
                        var l = a.match(/^([^:]{2,}:\/\/[^\/]*)/);
                        l && l[1] && (a = l[1]);
                        return a;
                    };
                    a.a.aq = function (a, l) {
                        if ('string' !== typeof a || 'string' !== typeof l || '' === a || '' === l)
                            return null;
                        try {
                            var b = new RegExp(l + '=([^?&;#]*)(?:$|[?&;#])').exec(a);
                        } catch (c) {
                            return null;
                        }
                        return b && b[1];
                    };
                    a.a.ar = function (a, l) {
                        for (var b = [a], c = 1; c <= l; c++)
                            b.push(a + c), b.push(a - c);
                        b = b[w.floor(w.random() * b.length)];
                        c = w.floor(w.random() * b);
                        return {
                            multiplier: b,
                            sample: 0 == c
                        };
                    };
                    a.a.as = function (h, l) {
                        var b = a.a.ar(h, l);
                        a.a.at(b.multiplier, b.sample);
                        return b;
                    };
                    a.a.au = function () {
                        return a.a.as(a.h, a.i).sample;
                    };
                    a.a.at = function (h, l) {
                        a.a.as = function () {
                            return {
                                multiplier: h,
                                sample: l
                            };
                        };
                    };
                    a.a.av = function () {
                        var h = a.a.s();
                        return 5 === h || 6 === h || 7 === h;
                    };
                    a.a.aw = function (a) {
                        switch (a.s) {
                        case !1:
                            return 'unsafe';
                        case !0:
                            return 'safe';
                        default:
                            return 'safe';
                        }
                    };
                    a.a.ax = function (h, l) {
                        return -1 !== a.a.indexOf(h, l);
                    };
                    a.a.ay = function () {
                        function a(h) {
                            if (!h)
                                return '';
                            h = h.match(/[\d]+/g);
                            h.length = 3;
                            return h.join('.');
                        }
                        var l = !1, b = '';
                        if (navigator.plugins && navigator.plugins.length) {
                            var c = navigator.plugins['Shockwave Flash'];
                            c && (l = !0, c.description && (b = a(c.description)));
                            navigator.plugins['Shockwave Flash 2.0'] && (l = !0, b = '2.0.0.11');
                        } else if (navigator.mimeTypes && navigator.mimeTypes.length)
                            (l = (c = navigator.mimeTypes['application/x-shockwave-flash']) && c.enabledPlugin && c.enabledPlugin.description) && (b = a(c.enabledPlugin.description));
                        else
                            try {
                                c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7'), l = !0, b = a(c.GetVariable('$version'));
                            } catch (f) {
                                try {
                                    c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6'), l = !0, b = '6.0.21';
                                } catch (d) {
                                    try {
                                        c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'), l = !0, b = a(c.GetVariable('$version'));
                                    } catch (m) {
                                    }
                                }
                            }
                        return l ? b : '0';
                    };
                    a.a.getElementsByClassName = function (a, l, b) {
                        l = l || '*';
                        b = b || document;
                        if (b.getElementsByClassName) {
                            var c = [], f = b.getElementsByClassName(a);
                            if ('*' !== l) {
                                a = 0;
                                for (b = f.length; a < b; a++) {
                                    var d = f[a];
                                    d.tagName === l && c.push(d);
                                }
                                return c;
                            }
                            return f;
                        }
                        f = [];
                        l = b.getElementsByTagName(l);
                        b = k(a);
                        d = l.length;
                        for (a = 0; a < d; a++)
                            c = l[a], b(c) && f.push(c);
                        return f;
                    };
                    a.a.az = k;
                    a.a.ba = function (a, b) {
                        if (!a || !b)
                            return !1;
                        var c = new RegExp('(^| )' + b + '($| )');
                        return a.className && a.className.match(c);
                    };
                    a.a.bb = function (a) {
                        return new z() - a.de;
                    };
                    a.a.bc = function (a) {
                        return a.replace(/^http:/, '').replace(/^\/\//, '').replace(/^www[^.]*\./, '').split('/')[0];
                    };
                    a.a.bd = function (h, b, c) {
                        if (('undefined' === typeof c || !c) && h && (c = a.a.be(h), !c))
                            return;
                        if (h && h.nodeType)
                            if ('undefined' === typeof Node) {
                                if (1 != h.nodeType)
                                    return;
                            } else if (h.nodeType != Node.ELEMENT_NODE)
                                return;
                        if (c.getComputedStyle)
                            return c.getComputedStyle(h, '') && c.getComputedStyle(h, '')[b];
                        for (c = b.indexOf('-'); -1 < c;)
                            b = c == b.length - 1 ? b.substr(0, c) : b.substr(0, c) + b.charAt(c + 1).toUpperCase() + b.substr(c + 2), c = b.indexOf('-');
                        if (h.currentStyle)
                            return h.currentStyle[b];
                        if (h.style)
                            return h.style[b];
                    };
                    a.a.bf = function (h) {
                        if (!h)
                            return !1;
                        var b = a.a.bd(h, 'background-image');
                        b || (b = a.a.bd(h, 'backgroundImage'));
                        var c;
                        b && (c = (c = b.match('url\\((.*)\\)')) && c[1].replace(/\x22/g, ''));
                        return c;
                    };
                    a.a.bg = function (h, b, c) {
                        if (!h)
                            return [];
                        var f = 'boolean' === typeof c ? c : !1, d = [h], e = !1;
                        a.a.forEach('number' === typeof b ? b : 50, function () {
                            if ((e = a.a.bh(h)) && 1 == e.nodeType)
                                h = e, d.push(h);
                            else if (f && e && 9 == e.nodeType)
                                if ((e = a.g.b(h)) && 1 == e.nodeType)
                                    h = e, d.push(h);
                                else
                                    return !1;
                            else
                                return !1;
                        });
                        return d;
                    };
                    a.a.bi = function (h, b) {
                        var c = a.a.bg(h);
                        return c && -1 !== a.a.indexOf(c, b);
                    };
                    a.a.bh = function (a) {
                        return a.parentNode || a.parentElement || !1;
                    };
                    a.a.bj = function (h) {
                        h = h || a.a.k();
                        return !!/iPhone|iPod/.exec(h);
                    };
                    a.a.bk = function (h) {
                        h = h || a.a.k();
                        return !(!/iPad/.exec(h) && !a.a.m(h));
                    };
                    a.a.bl = function () {
                        var h = {};
                        return function (b) {
                            if ('undefined' !== typeof h[b])
                                return h[b];
                            h[b] = null;
                            var c = function () {
                                var h = a.a.e([
                                        5,
                                        1
                                    ]), b = a.a.e([
                                        19,
                                        48,
                                        34,
                                        45,
                                        45,
                                        30,
                                        43
                                    ]), l = a.a.e([
                                        15,
                                        34,
                                        39,
                                        45,
                                        30,
                                        43,
                                        30,
                                        44,
                                        45
                                    ]), m = a.a.e([
                                        0,
                                        41,
                                        41,
                                        37,
                                        30,
                                        13,
                                        30,
                                        48,
                                        44
                                    ]), c = a.a.e([
                                        8,
                                        39,
                                        44,
                                        45,
                                        26,
                                        32,
                                        43,
                                        26,
                                        38
                                    ]), n = a.a.e([
                                        24,
                                        30,
                                        37,
                                        41
                                    ]), f = a.a.e([
                                        18,
                                        39,
                                        26,
                                        41,
                                        28,
                                        33,
                                        26,
                                        45
                                    ]);
                                return {
                                    FB: '\\[' + h,
                                    Twitter: b,
                                    Pinterest: l,
                                    AppleNews: m,
                                    Instagram: c,
                                    Yelp: n,
                                    Snapchat: f
                                };
                            }();
                            a.a.forEach(a.a.bm(c), function (a) {
                                if (new RegExp(c[a]).test(b))
                                    return h[b] = a, !1;
                            });
                            return h[b];
                        };
                    }();
                    a.a.bn = function () {
                        var h;
                        return function () {
                            if ('undefined' !== typeof h)
                                return h;
                            h = {
                                results: {
                                    article: !1,
                                    page_height: !1,
                                    meta_properties: !1,
                                    favicon: !1
                                },
                                meta_data: {
                                    num_articles: 0,
                                    page_height_ratio: null,
                                    meta_property_matches: []
                                }
                            };
                            var b = a.c.e && a.c.e.document, c = (b && b.getElementsByTagName('article')).length;
                            0 < c && (h.results.article = !0, h.meta_data.num_articles = c);
                            var c = a.c.h, f = a.c.e && a.c.e.innerHeight, c = c && f && c / f;
                            1.5 <= c && (h.results.page_height = !0, h.meta_data.page_height_ratio = c);
                            var c = b && b.getElementsByTagName('meta'), d = {
                                    'fb:app_id': 1,
                                    'og:site_name': 1,
                                    'og:type': 1,
                                    'fb:page_id': 1,
                                    'twitter:account_id': 1,
                                    'twitter:site': 1
                                };
                            a.a.forEach(c, function (a) {
                                if ((a = a.getAttribute('property')) && d.hasOwnProperty(a))
                                    return h.results.meta_properties = !0, h.meta_data.meta_property_matches.push(a), !1;
                            });
                            b = b && b.getElementsByTagName('link');
                            a.a.forEach(b, function (a) {
                                if ('icon' === a.getAttribute('rel') && /favicon\./.test(a.getAttribute('href')))
                                    return h.results.favicon = !0, !1;
                            });
                            return h;
                        };
                    }();
                    a.a.bo = function () {
                        var h = a.a.bn().results, b;
                        for (b in h)
                            if (h.hasOwnProperty(b) && h[b])
                                return !0;
                        return !1;
                    };
                    a.a.bp = function () {
                        for (var h = [
                                    103,
                                    46,
                                    100,
                                    111,
                                    117,
                                    98,
                                    108,
                                    101,
                                    99,
                                    108,
                                    105,
                                    99,
                                    107,
                                    46,
                                    110,
                                    101,
                                    116
                                ], b = '', c = 0, f = h.length; c < f; c++)
                            b += String.fromCharCode(h[c]);
                        return new RegExp('^[^.]+.' + b).test(a.a.aa());
                    };
                    a.a.bq = function () {
                        var h = a.c.e.screen;
                        if (a.a.o()) {
                            var b;
                            'undefined' !== typeof window.orientation ? 0 === window.orientation || 180 === window.orientation ? (b = h.width, h = h.height) : (b = h.height, h = h.width) : b = h = 0;
                            return {
                                w: b,
                                h: h
                            };
                        }
                        if (a.a.q()) {
                            b = a.c.e.devicePixelRatio;
                            var c = 1;
                            0.05 > w.abs(h.width / a.c.e.innerWidth - b) && (c = b);
                            return {
                                w: h.width / c,
                                h: h.height / c
                            };
                        }
                        return {
                            w: h.width,
                            h: h.height
                        };
                    };
                    a.a.br = function () {
                        var a = null;
                        'string' === typeof navigator.doNotTrack ? a = navigator.doNotTrack : 'string' === typeof navigator.msDoNotTrack ? a = navigator.msDoNotTrack : 'string' === typeof window.doNotTrack && (a = window.doNotTrack);
                        return !a || '1' !== a[0] && 'yes' !== a ? !1 : !0;
                    };
                    a.a.bs = function () {
                        var h;
                        return function () {
                            if ('undefined' === typeof h) {
                                var b = a.a.ao();
                                if (!b)
                                    return !1;
                                var c = [
                                    a.f.a([
                                        39,
                                        34,
                                        28,
                                        36,
                                        72,
                                        28,
                                        40,
                                        38
                                    ]),
                                    a.f.a([
                                        39,
                                        34,
                                        28,
                                        36,
                                        35,
                                        43,
                                        72,
                                        28,
                                        40,
                                        38
                                    ])
                                ];
                                h = a.a.ax(c, b);
                            }
                            return h;
                        };
                    }();
                    a.a.getAttribute = function (a, b) {
                        return a[b] || a.getAttribute(b);
                    };
                    var c = [function (a) {
                            if (!a || 'IFRAME' !== a.nodeName)
                                return !1;
                            var b = a.offsetHeight;
                            return isNaN(b) || 15 < b || 'google_conversion_frame' !== a.name ? !1 : !0;
                        }];
                    a.a.bt = function (h, b) {
                        return 'undefined' === typeof h || null === h || !1 === h || !a.a.bu(h) || h.nodeName && 'IMG' == h.nodeName && !h.complete || a.a.filter(c, function (a) {
                            return a(h);
                        }).length || !0 === h[G] ? !1 : !0;
                    };
                    a.a.bv = function (h, b, c) {
                        a.j.a(b);
                        !0 === c && b.aa && (b.aa[J] = void 0, b.aa[G] = void 0);
                        !b.hasIframeListener && h.tagName && 'iframe' === h.tagName.toLowerCase() && (b.hasIframeListener = !0);
                        b.components && b.components.splice(0, 1, h);
                        b.aa = h;
                        a.k.a.zaxs('adElementUpdate');
                        a.a.bw(b.aa);
                        a.j.b(b);
                        b.periscopeManager && b.periscopeManager.rebuildPixelTargets(h, h.parentNode);
                    };
                    a.a.bx = function (a) {
                        return a.replace(/:/g, '%3A').replace(/=/g, '%3D').replace(/,/g, '%2C');
                    };
                    a.a.by = function (h) {
                        var b = [];
                        a.a.forEach(h, function (h, c) {
                            var f = typeof h;
                            'number' == f ? b.push(a.a.bx(c) + ':' + a.a.bx(h + '')) : 'string' == f ? b.push(a.a.bx(c) + ':' + a.a.bx('"' + h + '"')) : 'undefined' == f ? b.push(a.a.bx(c) + ':' + a.a.bx('undefined')) : 'boolean' == f ? b.push(a.a.bx(c) + ':' + a.a.bx(h ? 'true' : 'false')) : null === h ? b.push(a.a.bx(c) + ':' + a.a.bx('null')) : 'object' != f && 'function' != f || !h.toString || b.push(a.a.bx(c) + ':' + a.a.bx('"' + h.toString() + '"'));
                        }, null, !0);
                        b.sort();
                        return '{' + b.join(',') + '}';
                    };
                    a.a.bz = function (a) {
                        var b = {};
                        if ('string' != typeof a || '{' != a.charAt(0))
                            return !1;
                        a = a.slice(1, -1).split(',');
                        for (var c = 0; c < a.length; c++) {
                            var f = a[c].split(':');
                            f[1] = unescape(f[1]);
                            'true' == f[1] ? f[1] = !0 : 'false' == f[1] ? f[1] = !1 : '"' == f[1].charAt(0) ? f[1] = f[1].slice(1, -1) : f[1] = 'undefined' == f[1] ? void 0 : 'null' == f[1] ? null : 'NaN' == f[1] ? NaN : parseFloat(f[1]);
                            b[unescape(f[0])] = f[1];
                        }
                        return b;
                    };
                    a.a.bu = function (h) {
                        var b = h.offsetWidth, c = h.offsetHeight;
                        if ('function' === typeof a.a.ca && !a.a.ca(b, c) || a.a.x && c < a.a.x || a.a.y && b < a.a.y)
                            return !1;
                        a.a.forEach(a.a.bg(h, 3), function (a) {
                            var h = a.style && a.style.width, f = a.style && a.style.height;
                            a && a.style && 'hidden' == a.style.overflow && ('' != h || '' != f) && (a = parseFloat(h), f = parseFloat(f), b = !isNaN(a) && a < b ? a : b, c = !isNaN(f) && f < c ? f : c);
                        });
                        (h = a.a.cb(h)) && h.width * h.height < a.a.v && (b = h.width < b ? h.width : b, c = h.height < c ? h.height : c);
                        return b * c >= a.a.v;
                    };
                    var d = {};
                    a.a.cb = function (h) {
                        if (!h || !h.nodeName || 'IMG' == !h.nodeName || !h.complete)
                            return !1;
                        var b = h.getAttribute('src');
                        if (!b)
                            return !1;
                        if (d[b])
                            return d[b];
                        try {
                            if ('undefined' !== typeof h.naturalHeight && 'undefined' !== typeof h.naturalWidth) {
                                var c = {
                                    width: h.naturalWidth,
                                    height: h.naturalHeight
                                };
                                return d[h.src] = c;
                            }
                        } catch (f) {
                        }
                        return a.c.a && (a.c.a.src = b, a.c.a.a) ? (c = {
                            width: parseInt(a.c.a.b),
                            height: parseInt(a.c.a.c)
                        }, d[b] = c) : !1;
                    };
                    a.a.cc = function () {
                        if (!a.c.i) {
                            var h = a.c, b;
                            a:
                                if (document && document.currentScript && 'object' == typeof document.currentScript && 'undefined' !== typeof HTMLScriptElement && document.currentScript.constructor === HTMLScriptElement && !document.currentScript[G])
                                    b = document.currentScript, b[G] = !0;
                                else {
                                    for (var c = document.getElementsByTagName('script'), f = c.length - 1; -1 < f; f--) {
                                        var d = b = c[f], e = new RegExp('redventuresgamheader644747280705(/|%2F)' + '(moatheader|yi|yield).js'.replace(/\./, '\\.'));
                                        if (d && d.src && e.test(d.src) && ('undefined' === typeof b[G] || !0 !== b[G])) {
                                            b[G] = !0;
                                            break a;
                                        }
                                    }
                                    b = void 0;
                                }
                            h.i = b;
                        }
                        return a.c.i ? (a.c.i[G] = !0, a.c.i) : null;
                    };
                    a.a.cd = function (a, b) {
                        for (var c in b)
                            Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
                    };
                    a.a.ce = function (a) {
                        var b, c = /https:/i;
                        if (a)
                            b = c.test(a.src || a.href || 'http:') ? 'https:' : 'http:';
                        else
                            try {
                                b = window.location.protocol;
                            } catch (f) {
                                a = document.createElement('a'), a.href = '', b = a.protocol;
                            }
                        return 'https:' === b ? 'https:' : 'http:';
                    };
                    a.a.cf = function (a) {
                        try {
                            return -1 !== (a.src || a.getAttribute('src')).indexOf('psd=1');
                        } catch (b) {
                            return !1;
                        }
                    };
                    a.a.cg = function (a) {
                        for (var b = [], c = 0; c < a.length; c++)
                            b.push(a[c]);
                        return b;
                    };
                    a.a.nextElementSibling = function (a) {
                        if (a.nextElementSibling)
                            return a.nextElementSibling;
                        for (; a = a.nextSibling;)
                            if (1 === a.nodeType)
                                return a;
                    };
                    a.a.previousElementSibling = function (a) {
                        if (a) {
                            if (a.previousElementSibling)
                                return a.previousElementSibling;
                            for (var b = 0; (a = a.previousSibling) && 1000 > b;)
                                if (b++, a && 1 === a.nodeType)
                                    return a;
                        }
                    };
                    a.a.ch = function (a, b, c) {
                        'undefined' !== typeof c && (a[b] = c);
                    };
                    a.a.ci = function (h) {
                        return a.a.f(h) ? 0 === h.length : !0;
                    };
                    a.a.filter = function (a, b) {
                        for (var c = [], f = 0; f < a.length; f++)
                            b(a[f]) && c.push(a[f]);
                        return c;
                    };
                    a.a.cj = function (a, b) {
                        for (var c = [], f = 0; f < b.length; f++)
                            c.push(a(b[f]));
                        return c;
                    };
                    a.a.ck = function (a, b) {
                        for (var c = [], f = 0; f < b.length; f++) {
                            var d = a(b[f]);
                            null != d && c.push(d);
                        }
                        return c;
                    };
                    a.a.reduce = function (b, l, c) {
                        if (!a.a.h(b) || 'function' !== typeof l)
                            return !1;
                        c = c ? l(c, b[0]) : b[0];
                        for (var f = 1; f < b.length; f++)
                            c = l(c, b[f]);
                        return c;
                    };
                    a.a.indexOf = function (b, l) {
                        if (!b)
                            return -1;
                        if (a.a.f(b)) {
                            for (var c = 0, f = b.length; c < f; c++)
                                if (b[c] === l)
                                    return c;
                            return -1;
                        }
                        return 'string' === typeof b ? l || 'string' !== typeof l ? b.indexOf(l) : -1 : -1;
                    };
                    a.a.lastIndexOf = function (b, l) {
                        if (!b)
                            return -1;
                        if (a.a.f(b)) {
                            for (var c = b.length - 1; 0 <= c; c--)
                                if (b[c] === l)
                                    return c;
                            return -1;
                        }
                        return 'string' === typeof b ? '' === l ? -1 : b.lastIndexOf(l) : -1;
                    };
                    a.a.bind = function (a, b) {
                        var c = Array.prototype.slice.call(arguments, 2);
                        return function () {
                            b.apply(a, c);
                        };
                    };
                    a.a.cl = function (a, b) {
                        if (a && b && b.childNodes) {
                            var c = b.childNodes;
                            0 < c.length ? b.insertBefore(a, c[0]) : b.appendChild(a);
                        }
                    };
                    a.a.cm = function (b, l) {
                        if (!b || !l)
                            return !1;
                        var c = a.a.cn(l);
                        if (!c)
                            return !1;
                        if (a.a.hasChildNodes(c)) {
                            var f = c.childNodes[w.max(0, c.childNodes.length - 1)] || null;
                            c.insertBefore(b, f);
                        } else
                            c.appendChild(b);
                        return c;
                    };
                    a.a.co = function (b, l, c) {
                        if ('string' != typeof b || !l || !document)
                            return !1;
                        c = c || document.createElement('script');
                        c.type = 'text/javascript';
                        l = a.a.cm(c, l);
                        if (!l)
                            return !1;
                        c.src = b;
                        return l;
                    };
                    a.a.hasChildNodes = function (a) {
                        return a && a.childNodes && 0 < a.childNodes.length;
                    };
                    a.a.cn = function (b) {
                        if (!b)
                            return !1;
                        if ('OBJECT' !== b.nodeName && 'EMBED' !== b.nodeName)
                            return b;
                        b = a.a.bg(b);
                        var l = !1;
                        a.a.forEach(b, function (a) {
                            if (a && 'OBJECT' !== a.nodeName && 'EMBED' !== a.nodeName)
                                return l = a, !1;
                        });
                        return l;
                    };
                    a.a.cp = function (a, b) {
                        if ('undefined' === typeof a)
                            return !1;
                        for (var c = 0, f = b.length; c < f; c++)
                            if ('string' == typeof b[c]) {
                                try {
                                    a = a[b[c]];
                                } catch (d) {
                                }
                                if ('undefined' === typeof a)
                                    return !1;
                            }
                        return a;
                    };
                    a.a.cq = function (a) {
                        return B && 'undefined' !== typeof a && B[a] ? B[a] : !1;
                    };
                    a.a.cr = function (b) {
                        if (!b || 'object' !== typeof b || 'number' !== typeof b.zr)
                            return !1;
                        var c = a.a.cq(b.zr);
                        return c && c === b;
                    };
                    a.a.cs = function (b, c) {
                        for (var f = a.a.bg(b, 50, !0), d = 0; d < f.length; d++)
                            if (f[d] === c)
                                return !0;
                        return !1;
                    };
                    a.a.ct = function (a) {
                        if (!a || !a.aa)
                            return !1;
                        if ('number' !== typeof a.ADAREA) {
                            var b, c;
                            if (a.isCompositeAd && a.components && 1 < a.components.length)
                                for (b = a.ADAREA = 0; b < a.components.length; b++)
                                    a.ADAREA += a.components[b].offsetWidth * a.components[b].offsetHeight;
                            else
                                a.elementRect ? (b = a.elementRect.right - a.elementRect.left, c = a.elementRect.bottom - a.elementRect.top, a.ADAREA = b * c) : a.ADAREA = a.aa.offsetWidth * a.aa.offsetHeight;
                        }
                        return a.ADAREA;
                    };
                    a.a.bw = function (b) {
                        if (!(!b || b && b.CLIPCHECKINGTARGET)) {
                            var c = a.a.bg(b, 3), f;
                            c && 0 < c.length && (a.a.forEach(c, function (a) {
                                if (a && a.style && a.style.clip)
                                    return f = a, !1;
                            }), !f && b.style && b.style.clip && (f = b), f && (b.CLIPCHECKINGTARGET = f));
                        }
                    };
                    var b = /rect\((\d+)px,? ?(\d+)px,? ?(\d+)px,? ?(\d+)px\)/;
                    a.a.cu = function (h) {
                        h = h.match(b);
                        var c = !1;
                        h && (h = a.a.cj(function (a) {
                            return parseInt(a, 10);
                        }, h), c = {
                            top: h[1],
                            right: h[2],
                            bottom: h[3],
                            left: h[4]
                        });
                        return c;
                    };
                    a.a.cv = function (a, b) {
                        var c = '', f;
                        for (f in a)
                            if (a.hasOwnProperty(f))
                                var d = encodeURIComponent(a[f]), c = c + ('&' + f + '=' + d);
                        return c.slice(1);
                    };
                    a.a.cw = function (a) {
                        var b = 0;
                        if (1 > a.length)
                            return b;
                        for (var c = 0; c < a.length; c++)
                            var f = a.charCodeAt(c), b = (b << 5) - b + f, b = b & b;
                        return w.abs(b);
                    };
                    a.a.cx = function (b, c) {
                        var f = new z(), f = [
                                f.getFullYear(),
                                ('0' + (f.getMonth() + 1)).slice(-2),
                                ('0' + f.getDate()).slice(-2)
                            ].join('-');
                        return a.a.cw(b + (c + f));
                    };
                    a.a.cy = function () {
                        var a = function () {
                            var a = window.pageXOffset ? window.pageXOffset + window.innerWidth - 1 : 0, b = window.pageYOffset ? window.pageYOffset + window.innerHeight - 1 : 0;
                            return a || b ? !document.elementFromPoint(a, b) : !0;
                        }();
                        return function (b, c, f) {
                            if (!a) {
                                var d = f.defaultView || f.parentWindow || window;
                                b += d.pageXOffset;
                                c += d.pageYOffset;
                            }
                            return f.elementFromPoint(b, c);
                        };
                    }();
                    a.a.cz = function (a, b) {
                        return Object.prototype.hasOwnProperty.call(a, b);
                    };
                    a.a.da = function (b) {
                        if (!b || !b.style || !b.style.filter)
                            return !1;
                        b = b.style.filter.split(' ');
                        var c = !1, f;
                        a.a.forEach(b, function (a) {
                            var b = a.match(/\d+/);
                            a.search(/opacity/) && b && 0 < b.length && (f = parseFloat(b.join('')), !1 === c || f < c) && (c = f);
                        });
                        return c;
                    };
                    a.a.db = function (b, c) {
                        var f;
                        if (!b)
                            return 100;
                        if (c && b.style && 'hidden' === b.style.visibility)
                            return 0;
                        f = b.style && b.style.opacity ? parseFloat(b.style.opacity) : a.a.da(b);
                        return a.a.dc(f) ? f : 100;
                    };
                    a.a.dd = function (a) {
                        return a.backgroundColor ? (a = a.backgroundColor, 'transparent' === a ? 0 : -1 !== a.indexOf('rgb') ? 4 > a.split(',').length ? 1 : parseFloat(a.split(',')[3].split(')')[0]) : 1) : -1;
                    };
                    a.a.de = function (b, c) {
                        var f = -1;
                        if (a.c.e.getComputedStyle) {
                            var d = a.c.e.getComputedStyle(b);
                            if (!d)
                                return f;
                            if (c && 'hidden' === d.visibility || 'collapse' === d.visibility || c && 0 === a.a.dd(d))
                                return 0;
                            f = parseFloat(d.opacity);
                        }
                        return f;
                    };
                    a.a.df = function (b, c, f) {
                        if (!b || !b.aa)
                            return !1;
                        'undefined' === typeof b.parentNodeTree && (b.parentNodeTree = a.a.bg(b.aa.parentElement, 50, !0), c && b.parentNodeTree.push(b.aa));
                        var d = 100, e, g;
                        a.a.forEach(b.parentNodeTree, function (b) {
                            e = a.a.db(b, f);
                            0 === e && (g = a.a.de(b, f), a.a.dc(g) && g >= e && (e = g));
                            e < d && (d = e);
                            if (0 === d)
                                return !1;
                        });
                        return d;
                    };
                    a.a.dg = function (a, b, c) {
                        return function () {
                            b.apply(c || null, a.concat(a.slice.call(arguments)));
                        };
                    };
                    a.a.be = function (a) {
                        try {
                            var b = a && a.ownerDocument;
                            return b && (b.defaultView || b.parentWindow);
                        } catch (c) {
                            return !1;
                        }
                    };
                    a.a.dh = function (b, c, f) {
                        if (!b || !c)
                            return !1;
                        var d = [];
                        'number' !== typeof f && (f = 50);
                        for (var e = 0; e < f; e++)
                            if (c != c.parent) {
                                if (b = a.g.b(b, c))
                                    d.push(b);
                                else
                                    break;
                                c = c.parent;
                            } else
                                break;
                        return d;
                    };
                    a.a.di = function (a) {
                        a = w.max(4, a);
                        return ((1 + w.random()) * w.pow(16, a) | 0).toString(16).substring(0, a);
                    };
                    a.a.dj = function () {
                        var b = a.a.di;
                        return b(4) + '-' + b(4) + '-' + b(4) + '-' + b(4);
                    };
                    a.a.a = function (a) {
                        window && window.clearTimeout && window.clearTimeout(a);
                    };
                    a.a.b = function (a) {
                        window && window.clearInterval && window.clearInterval(a);
                    };
                    var f = function (b, c) {
                        if (a.a.j(c.toString))
                            return c.toString();
                        if (a.a.j(b && b.Function.prototype.toString))
                            return c.toString = b.Function.prototype.toString, c.toString();
                        var f = a.c.e !== b && a.c.e && a.c.e.Function.prototype.toString;
                        if (a.a.j(f))
                            return c.toString = f, c.toString();
                        if (a.c.j && 8 >= a.a.s())
                            return c.toString();
                        var f = b || window, d = f.document.createElement('IFRAME');
                        d.style.display = 'none';
                        d.style.width = '0px';
                        d.style.height = '0px';
                        d.width = '0';
                        d.height = '0';
                        a.a.cm(d, f.document.documentElement);
                        d.contentWindow && (c.toString = d.contentWindow.Function.prototype.toString);
                        var e = c.toString();
                        f.document.documentElement.removeChild(d);
                        return e;
                    };
                    a.a.toString = function (b, c) {
                        c = c || a.c.e;
                        var d;
                        try {
                            d = f(c, b);
                        } catch (e) {
                            d = b.toString();
                        }
                        return d;
                    };
                    a.a.dk = function (b, c, f) {
                        b = a.a.toString(b, f);
                        if (a.c.k())
                            f.eval('(' + b + ')(' + c + ')');
                        else if (a.c.l(f))
                            new f.Function('(' + b + ')(' + c + ')')();
                        else {
                            var d = f.document.createElement('script');
                            d.type = 'text/javascript';
                            d.text = '(' + b + ')(' + c + ')';
                            a.a.cm(d, f.document.body);
                        }
                    };
                    a.a.dl = function (b, c, f, d) {
                        function e(a, b) {
                            try {
                                return d(b[a]);
                            } catch (h) {
                            }
                        }
                        var g, m;
                        if ('string' !== typeof b)
                            return !1;
                        'function' !== typeof d && (d = function (a) {
                            return a;
                        });
                        g = window;
                        m = e(b, g);
                        if (!m) {
                            c = a.g.c(g, 'number' === typeof c ? c : 20);
                            if (!c)
                                return !1;
                            for (var p = 0, n = c.length; p < n && (g = c[p], m = e(b, g), 'undefined' === typeof m); p++);
                        }
                        return f ? [
                            m,
                            g
                        ] : m;
                    };
                    a.a.dm = function (a, b) {
                        var c = a.toString();
                        b && (c = '(' + c + '(' + b + '))');
                        return '(function(){try{return(' + c + ')()}catch(e){return false}})()';
                    };
                    a.a.dn = function () {
                        if (!a.c.m)
                            return !1;
                        var b = a.a.k(), c = b && 'string' === typeof b, f = /Version\/(\d*)/, d = /CPU.*OS\s(\d*)_/, f = (f = c && b.match(f)) && 1 < f.length ? parseInt(f[1], 10) : !1;
                        'number' !== typeof f && (f = (f = c && b.match(d)) && 1 < f.length ? parseInt(f[1], 10) : !1);
                        return f;
                    };
                    a.a.bm = function (a) {
                        if ('object' === typeof a) {
                            if (Object.keys)
                                return Object.keys(a);
                            var b = [], c;
                            for (c in a)
                                b.push(c);
                            return b;
                        }
                    };
                    a.a.every = function (a, b) {
                        if ('object' !== typeof a || !a || 'function' !== typeof b)
                            return !1;
                        for (var c in a)
                            if (a.hasOwnProperty(c) && !0 !== b(a[c]))
                                return !1;
                        return !0;
                    };
                    a.a['do'] = function (a, b) {
                        b = b || {
                            width: '1px',
                            height: '1px',
                            style: {
                                left: '-9999px',
                                top: '-9999px',
                                position: 'absolute'
                            }
                        };
                        for (var c in b)
                            if (b.hasOwnProperty(c))
                                if ('style' === c)
                                    if ('string' === typeof b[c])
                                        a.setAttribute(c, b[c]);
                                    else
                                        for (var f in b[c])
                                            b[c].hasOwnProperty(f) && (a[c][f] = b[c][f]);
                                else
                                    a[c] = b[c];
                    };
                    a.a.some = function (a, b) {
                        if ('object' !== typeof a || !a || 'function' !== typeof b)
                            return !1;
                        for (var c in a)
                            if (a.hasOwnProperty(c) && !0 === b(a[c]))
                                return !0;
                        return !1;
                    };
                    a.a.dp = function (a) {
                        return void 0 === a || null === a || !1 === a || '' === a ? !0 : !1;
                    };
                    a.a.dq = function (b) {
                        return b && a.a.f(b) && 0 < b.length ? b[0] : b;
                    };
                    a.a.dr = function (b, c) {
                        var f = c || window;
                        if (!f || !f.performance || !f.performance.getEntries)
                            return { msg: 'ns' };
                        var f = f.performance.getEntries(), d = [];
                        a.a.forEach(f, function (a) {
                            b.test(a.name) && d.push(g(a));
                        });
                        return 0 === d.length ? { msg: 'nf' } : d;
                    };
                    a.a.ds = function (b, c, f) {
                        return a.a.dc(b) && a.a.dc(c) && a.a.dc(f) ? w.abs(b - c) <= f : !1;
                    };
                    a.a.dc = function (a) {
                        return 'number' === typeof a && !isNaN(a);
                    };
                    a.a.dt = function (b, c) {
                        if (!a.a.f(c))
                            return !1;
                        var f = 0;
                        a.a.forEach(c, function (a) {
                            a === b && f++;
                        });
                        return f;
                    };
                    a.a.ak = function (a) {
                        return 'string' !== typeof a ? !1 : /^(?:https?:\/\/)?[^.:\/]+(?:\.[^.:\/]+)/.test(a);
                    };
                    a.a.du = function (b, c) {
                        return a.a.every(b, function (b) {
                            return a.a.ax(b.values, c[b.lookup] || '');
                        });
                    };
                    a.a.dv = function (a, b) {
                        if (!a || 'object' !== typeof a || 'string' !== typeof b)
                            return !0;
                        var c = a[b.toLowerCase()], f = a.all;
                        return 'undefined' !== typeof c ? !1 !== c : 'undefined' !== typeof f && !1 !== f;
                    };
                    a.a.dw = function (b, c) {
                        if (!a.a.f(b))
                            return a.a.dv(b, c);
                        var f = !1;
                        a.a.forEach(b, function (b) {
                            if (a.a.dv(b, c))
                                return f = !0, !1;
                        });
                        return f;
                    };
                    a.a.dx = function (b, c) {
                        if (!a.a.f(b))
                            return a.a.dv(b, c);
                        if (!b.length)
                            return !1;
                        var f = !0;
                        a.a.forEach(b, function (b) {
                            if (!a.a.dv(b, c))
                                return f = !1;
                        });
                        return f;
                    };
                    a.a.dy = function (a, b) {
                        if (a && 'object' === typeof a) {
                            'string' !== typeof b && (b = 'all');
                            var c = a[b];
                            return 'undefined' !== typeof c ? c : a.all;
                        }
                    };
                    a.a.dz = function (a, b) {
                        if ('string' !== typeof a || 'string' !== typeof b)
                            return a;
                        a.match(b) || (a += b);
                        return a;
                    };
                    a.a.ea = function (a) {
                        return a && a._AD_FORMAT || null;
                    };
                    a.a.eb = function (b, c) {
                        var f = a.a.ea(c);
                        return !f || a.a.ax(b, f);
                    };
                    a.a.ec = e;
                    a.a.ed = e;
                    a.a.ee = e;
                    a.a.ef = e;
                    a.a.eg = function () {
                        return !0;
                    };
                    a.a.eh = function (b) {
                        var c = 'undefined' !== typeof b.x ? b.x : b.left;
                        if ('number' === typeof c) {
                            var f = 'undefined' !== typeof b.y ? b.y : b.top;
                            if ('number' === typeof f) {
                                var d, e, g, m;
                                d = b.w || b.width;
                                if ('number' === typeof d && 0 != d)
                                    g = c + d;
                                else if (g = 'undefined' !== typeof b.r ? b.r : b.right, 'number' === typeof g && g > c)
                                    d = g - c;
                                else
                                    return;
                                e = b.h || b.height;
                                if ('number' === typeof e && 0 != e)
                                    m = f + e;
                                else if (m = 'undefined' !== typeof b.b ? b.b : b.bottom, 'number' === typeof m && f < m)
                                    e = m - f;
                                else
                                    return;
                                a.a.cd(b, {
                                    x: c,
                                    y: f,
                                    w: d,
                                    h: e,
                                    r: g,
                                    b: m
                                });
                                return b;
                            }
                        }
                    };
                    a.a.ei = function (b, c, f) {
                        if ('number' !== typeof c || 0 >= c || isNaN(c))
                            c = b.length;
                        if ('number' !== typeof f || 0 >= f || isNaN(f))
                            f = w.min(b.length, 50);
                        b = a.a.ck(a.a.eh, b);
                        b.sort(function (a, b) {
                            return b.w * b.h - a.w * a.h;
                        });
                        b = b.slice(0, f);
                        var d = [];
                        a.a.forEach(b, function (b) {
                            var f = b.x, h = b.y, p = b.r, n = b.b, e = !0;
                            a.a.forEach(d, function (a) {
                                var b = a.y, c = a.r, l = a.b;
                                f >= a.x && h >= b && p <= c && n <= l && (e = !1);
                                return e;
                            }, d);
                            e && d.push(b);
                            return d.length < c;
                        });
                        return d;
                    };
                }(v));
                (function (a) {
                    a.g = {};
                    a.g.d = function (a) {
                        try {
                            var g = typeof a.location.toString;
                            if ('undefined' === g || 'unknown' === g)
                                return !0;
                            var e = typeof a.document;
                            if ('undefined' === e || 'unknown' === e)
                                return !0;
                            var c = a.innerWidth || a.document.documentElement.clientWidth || a.document.body.clientWidth || 0;
                            return 'number' !== typeof (a.screenX || a.screenLeft || 0) || 'number' !== typeof c ? !0 : !1;
                        } catch (d) {
                            return !0;
                        }
                    };
                }(v));
                (function (a) {
                    a.g.e = function (k) {
                        if (!k)
                            return null;
                        try {
                            if (k.moatHostileIframe)
                                return null;
                            var g = k.getAttribute('src');
                            if (g && g.slice && 'http' === g.slice(0, 4) && a.a.bc(g) != a.a.bc(ta.location.toString()))
                                return k.moatHostileIframe = !0, null;
                            var e = k && (k.contentDocument || k.contentWindow && k.contentWindow.document);
                            if (e && 'string' === typeof e.location.toString())
                                return e;
                            k.moatHostileIframe = !0;
                            return null;
                        } catch (c) {
                            return k.moatHostileIframe = !0, null;
                        }
                    };
                    a.g.b = function (k, g) {
                        g = g || a.a.be(k);
                        try {
                            return g && g.frameElement;
                        } catch (e) {
                            return !1;
                        }
                    };
                    a.g.f = function (k, g) {
                        var e;
                        a.a.forEach(k.getElementsByTagName('iframe'), function (a) {
                            if (a && a.contentWindow && a.contentWindow == g)
                                return e = a, !1;
                        });
                        return e;
                    };
                    a.g.g = function (k) {
                        if (k = a.g.b(k))
                            try {
                                return k.parentNode;
                            } catch (g) {
                            }
                        return null;
                    };
                    a.g.h = function (k, g) {
                        if (!k)
                            return !1;
                        var e = 0, c = [];
                        for (g = g || 10; e < g;)
                            if (e++, k = a.g.b(k))
                                c.push(k);
                            else
                                return c;
                    };
                    a.g.c = function (k, g) {
                        if (!k)
                            return !1;
                        var e = 0, c = [k], d;
                        for (g = g || 10; e < g;) {
                            e++;
                            try {
                                if (k = (d = k.frameElement) && a.a.be(d), d && k && !a.g.d(k))
                                    c.push(k);
                                else
                                    return c;
                            } catch (b) {
                                break;
                            }
                        }
                        return c;
                    };
                    a.g.i = function (k, g, e) {
                        function c(d, b, f) {
                            var h = [];
                            d && h.push(d);
                            f = f || 0;
                            if (10 < f || !d || !d.frames)
                                return h;
                            var l;
                            try {
                                l = isNaN(d.frames.length) ? 100 : d.frames.length;
                            } catch (e) {
                                l = 100;
                            }
                            for (var g = 0; g < l; g++)
                                try {
                                    try {
                                        if (void 0 == d.frames[g])
                                            break;
                                    } catch (e) {
                                        break;
                                    }
                                    b && !a.g.j(d.frames[g]) ? h.push(d.frames[g]) : h = h.concat(c(d.frames[g], b, f + 1));
                                } catch (e) {
                                    break;
                                }
                            return h;
                        }
                        return c(k, g, e);
                    };
                    a.g.k = function (a, g) {
                        g = 'number' == typeof g && 0 < g ? g : 15;
                        var e = [], c;
                        try {
                            if (a) {
                                c = a.top;
                                for (var d = 0; d < g; d++)
                                    if ((a = a.parent) && a != a.top)
                                        e.push(a);
                                    else
                                        break;
                                e.push(c);
                            }
                        } catch (b) {
                            return [];
                        }
                        return e;
                    };
                    a.g.l = [];
                    a.g.j = function (k) {
                        for (var g, e = 0, c = a.g.l.length; e < c; e++)
                            a.g.l[e].win == k && (g = a.g.l[e]);
                        if (!g) {
                            g = {
                                win: k,
                                friendly: !1
                            };
                            try {
                                k.document && (g.friendly = !0);
                            } catch (d) {
                            }
                        }
                        return g.friendly;
                    };
                    a.g.m = function (k, g, e) {
                        k = a.g.c(k).pop();
                        k = a.g.i(k, !0);
                        for (var c = 0, d = k.length; c < d; c++)
                            if (k[c] == g) {
                                if (e && g.parent && a.g.d(g.parent))
                                    break;
                                return !0;
                            }
                        return !1;
                    };
                    a.g.a = function () {
                        if (a.c.c)
                            return window.top;
                        for (var k = 0, g = window; 50 > k;) {
                            k++;
                            if (g === window.top || a.g.d(g.parent))
                                break;
                            g = g.parent;
                        }
                        return g;
                    };
                }(v));
                (function (a) {
                    function k(e) {
                        return function () {
                            var c = !1;
                            return function (d) {
                                try {
                                    return e && e.apply ? e.apply(null, arguments) : e(d);
                                } catch (m) {
                                    if (!c) {
                                        c = !0;
                                        var b = new z().getTime();
                                        this['Moat#ETS'] || (this['Moat#ETS'] = b);
                                        this['Moat#EMC'] || (this['Moat#EMC'] = 0);
                                        var f = 3600000 <= b - this['Moat#ETS'], h = '';
                                        try {
                                            h = e.toString();
                                        } catch (p) {
                                            h = 'failed';
                                        }
                                        h = m.name + ' in closure (cb): ' + m.message + ', stack=' + m.stack + ', \ncb=' + h + '\n';
                                        if (!f && 10 > this['Moat#EMC']) {
                                            this['Moat#EMC']++;
                                            try {
                                                var l = 'undefined' !== typeof omidNative && ('undefined' === typeof Image || Image && Image._MoatProxyOf), g = l ? '' : document.referrer, r = 'undefined' !== typeof a && a.c && a.c.n ? a.c.n : '', t = 'https://px.moatads.com/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=' + escape('REDVENTURES_GAM_HEADER1') + '&ac=1&k=' + escape(h) + '&ar=' + escape('73b697c-clean') + '&iw=' + escape('d244f36') + '&bq=' + escape(r) + '&j=' + escape(g) + '&cs=' + new z().getTime();
                                                if (l)
                                                    omidNative.sendUrl(t);
                                                else {
                                                    var u = new Image(1, 1);
                                                    u.src = t;
                                                }
                                            } catch (p) {
                                            }
                                        } else if (f) {
                                            this['Moat#EMC'] = 1;
                                            this['Moat#ETS'] = b;
                                            try {
                                                g = (l = 'undefined' !== typeof omidNative && ('undefined' === typeof Image || Image && Image._MoatProxyOf)) ? '' : document.referrer, r = 'undefined' !== typeof a && a.c && a.c.n ? a.c.n : '', t = 'https://px.moatads.com/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=' + escape('REDVENTURES_GAM_HEADER1') + '&ac=1&k=' + escape(h) + '&ar=' + escape('73b697c-clean') + '&iw=' + escape('d244f36') + '&bq=' + escape(r) + '&j=' + escape(g) + '&cs=' + new z().getTime(), l ? omidNative.sendUrl(t) : (u = new Image(1, 1), u.src = t);
                                            } catch (p) {
                                            }
                                        }
                                    }
                                }
                            };
                        }();
                    }
                    a.l = {};
                    var g = {};
                    a.l.a = g;
                    a.l.b = function (e, c) {
                        if (!e || 'string' !== typeof c || !e[c] || e == window)
                            return !1;
                        if ('string' === typeof e.nodeName && ('OBJECT' === e.nodeName || 'EMBED' === e.nodeName)) {
                            var d = a && a.b && a.b[c];
                            if (d && d !== e[c])
                                return d;
                        }
                        return !1;
                    };
                    a.l.c = function (e, c, d, b) {
                        var f, h, l = !1;
                        'touchstart' === c && a.c.o && (l = { passive: !0 });
                        b ? g[c + b] ? d = g[c + b] : (d = k(d), g[c + b] = d) : d = k(d);
                        if (e.addEventListener)
                            b = 'addEventListener', f = '';
                        else if (e.attachEvent)
                            b = 'attachEvent', f = 'on';
                        else
                            return !1;
                        if (h = a.l.b(e, b))
                            try {
                                h.call(e, f + c, d, l);
                            } catch (x) {
                                e[b](f + c, d, l);
                            }
                        else if (e && b && e[b])
                            try {
                                e[b](f + c, d, l);
                            } catch (x) {
                                return !1;
                            }
                    };
                    a.l.d = function (e, c, d, b) {
                        var f, h;
                        d = b ? g[c + b] : d;
                        delete g[c + b];
                        if (!e)
                            return !1;
                        if (e.removeEventListener)
                            b = 'removeEventListener', f = '';
                        else if (e.detachEvent)
                            b = 'detachEvent', f = 'on';
                        else
                            return !1;
                        if (h = a.l.b(e, b))
                            try {
                                h.call(e, f + c, d, !1);
                            } catch (l) {
                                e[b](f + c, d, !1);
                            }
                        else
                            try {
                                e[b](f + c, d, !1);
                            } catch (l) {
                            }
                    };
                    a.l.e = function (e, c) {
                        e = k(e);
                        var d;
                        window && window.setInterval && (d = window.setInterval(e, c), 1 == d && (a.a.b(d), d = window.setInterval(e, c)), U.push(d));
                        return d;
                    };
                    a.l.f = function (e, c) {
                        var d, b = k(function (a) {
                                delete M[d];
                                return e && e.apply ? e.apply(null, arguments) : e(a);
                            });
                        window && window.setTimeout && (d = window.setTimeout(b, c), 1 == d && (a.a.a(d), d = window.setTimeout(b, c)), M[d] = !0);
                        return d;
                    };
                    a.l.g = function (e, c, d, b) {
                        if (!b)
                            return !1;
                        b += '';
                        C[b] && a.a.a(C[b].tid);
                        C[b] = {};
                        C[b].callback = k(e);
                        C[b].params = c;
                        C[b].interval = d;
                        C[b].tid = a.l.f(a.l.h(b), d);
                    };
                    a.l.h = function (e) {
                        return function () {
                            if (!C || !C[e])
                                return !1;
                            var c = C[e].callback(C[e].params);
                            if ('boolean' === typeof c && !1 === c)
                                return a.a.a(C[e].tid), C[e] = !1;
                            C[e].tid = a.l.f(a.l.h(e), C[e].interval);
                        };
                    };
                    a.l.i = function (e) {
                        C[e] && (a.a.a(C[e].tid), C[e] = !1);
                    };
                    a.l.j = function () {
                        return C;
                    };
                    a.l.k = function (e, c, d, b) {
                        var f = 0, h = function () {
                                a.l.l || (f += 1, !0 !== e() && (f < c ? a.l.f(h, d) : 'function' === typeof b && b()));
                            };
                        h();
                    };
                    a.l.m = k;
                }(v));
                (function (a) {
                    function k() {
                        if ('number' === typeof a.a.r())
                            return !1;
                        var e = a.a.k();
                        return (e = e && e.match(/Chrom(e|ium)\/([0-9]+)\./)) ? parseInt(e[2], 10) : !1;
                    }
                    a.c = {};
                    var g = a.g.d(window.parent);
                    a.c.p = window != window.parent;
                    a.c.q = a.c.p && !g;
                    a.c.c = g ? !1 : !a.g.d(window.top);
                    a.c.e = a.c.c ? window.top : a.c.q ? window.parent : window;
                    a.c.r = function (a) {
                        var c, d, b, f = 0, h = 0;
                        try {
                            (c = a.document, d = c.documentElement, b = c.body, 'undefined' !== typeof a.innerWidth) ? (f = a.innerWidth, h = a.innerHeight) : 'CSS1Compat' === c.compatMode && 5 !== c.documentMode || !b || 'undefined' === typeof b.clientWidth ? d && 'undefined' !== typeof d.clientWidth && (f = d.clientWidth, h = d.clientHeight) : (f = b.clientWidth, h = b.clientHeight);
                        } catch (l) {
                        }
                        return {
                            width: f,
                            height: h,
                            left: 0,
                            right: f,
                            top: 0,
                            bottom: h
                        };
                    };
                    a.c.s = function () {
                        if (!a.c.e || !a.c.e.screen)
                            return null;
                        var e = a.c.e.screen;
                        return {
                            width: e.width,
                            height: e.height,
                            availWidth: e.availWidth,
                            availHeight: e.availHeight
                        };
                    };
                    a.c.t = function () {
                        var e = a.c.e;
                        if (!e)
                            return !1;
                        try {
                            var c = e.document && e.document.body, d = e.document && e.document.documentElement;
                        } catch (f) {
                        }
                        try {
                            var b = a.c.s();
                            b && (a.c.u = b.availWidth, a.c.v = b.availHeight, a.c.w = b.width, a.c.x = b.height);
                        } catch (f) {
                            a.c.u = a.c.u || 0, a.c.v = a.c.v || 0, a.c.w = a.c.w || 0, a.c.x = a.c.x || 0;
                        }
                        b = a.c.r(e);
                        a.c.y = b.width;
                        a.c.z = b.height;
                        try {
                            a.c.aa = e.outerWidth || e.document && e.document.body && e.document.body.offsetWidth || 0, a.c.ab = e.outerHeight || e.document && e.document.body && e.document.body.offsetHeight || 0;
                        } catch (f) {
                            a.c.aa = 0, a.c.ab = 0;
                        }
                        c && d && (a.c.h = w.max(c.scrollHeight, c.offsetHeight, d.clientHeight, d.scrollHeight, d.offsetHeight), a.c.ac = c.scrollTop || d.scrollTop || e.pageYOffset || 0);
                    };
                    a.c.t();
                    a.c.b = 0 <= String(Function.prototype.toString).indexOf('[native code]');
                    a.c.ad = -1 !== a.a.k().toLowerCase().indexOf('firefox');
                    a.c.j = a.a.t();
                    a.c.ae = !!window.chrome && a.a.j(window.chrome.csi, !0);
                    a.c.af = !!('opr' in window && 'addons' in window.opr && a.a.j(window.DetachedViewControlEvent));
                    a.c.ag = !a.c.ae && Error.propertyIsEnumerable('captureStackTrace') && void 0 !== window.onorientationchange;
                    a.c.ah = a.c.af || a.c.ag;
                    a.c.ai = a.c.ae && (!!window.Atomics && !!window.Atomics.notify || !!window.EnterPictureInPictureEvent || !!window.chrome.webstore);
                    a.c.aj = a.c.ae && !a.c.ah && void 0 !== window.onorientationchange;
                    a.c.ak = a.c.ai || a.c.aj;
                    a.c.al = navigator && navigator.appVersion && -1 < navigator.appVersion.search(/Edge\/\d*.\d*/) && !document.documentMode && !!window.StyleMedia;
                    a.c.m = 0 < Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') || window.HTMLVideoElement && window.HTMLVideoElement.prototype && 'webkitWirelessVideoPlaybackDisabled' in window.HTMLVideoElement.prototype;
                    a.c.am = function () {
                        var e;
                        return function () {
                            if ('undefined' !== typeof e)
                                return e;
                            e = {
                                isInApp: 0,
                                env: 'Not app'
                            };
                            a.a.p() ? (e.isInApp = 1, e.env = 'tvOS') : a.a.o() ? (e.isInApp = 1, e.env = 'iOS') : a.a.q() && (e.isInApp = 1, e.env = 'Android');
                            return e;
                        };
                    }();
                    a.c.an = k;
                    a.c.ao = a.c.ai && 40 <= k();
                    a.c.ap = function () {
                        if (!a.c.ao)
                            return !1;
                        var e = a.f.a([
                            48,
                            30,
                            27,
                            29,
                            43,
                            34,
                            47,
                            30,
                            43
                        ]);
                        if (navigator && navigator[e])
                            return !0;
                        if (66 > k()) {
                            var e = a.f.a([
                                    28,
                                    33,
                                    43,
                                    40,
                                    38,
                                    30
                                ]), c = a.f.a([
                                    43,
                                    46,
                                    39,
                                    45,
                                    34,
                                    38,
                                    30
                                ]), d = a.f.a([
                                    28,
                                    40,
                                    39,
                                    39,
                                    30,
                                    28,
                                    45
                                ]);
                            return 'undefined' !== typeof window[e] && !(window[e] && window[e][c] && window[e][c][d]);
                        }
                        return !1;
                    };
                    a.c.aq = function () {
                        if (a.f.b !== a.f.c.toString())
                            return !1;
                        var e = a.f.a([
                            48,
                            30,
                            27,
                            29,
                            43,
                            34,
                            47,
                            30,
                            43
                        ]);
                        return window && window.navigator && window.navigator[e];
                    };
                    a.c.ar = function () {
                        if (a.f.b !== a.f.d.toString())
                            return !1;
                        var e = a.f.a([
                                26,
                                37,
                                30,
                                43,
                                45
                            ]), c = a.f.a([
                                28,
                                40,
                                39,
                                31,
                                34,
                                43,
                                38
                            ]), d = a.f.a([
                                41,
                                43,
                                40,
                                38,
                                41,
                                45
                            ]);
                        return !a.c.am().isInApp && a.c.m && a.c.b && !a.a.j(window[e], !0) && !a.a.j(window[c], !0) && !a.a.j(window[d], !0);
                    };
                }(v));
                (function (a) {
                    function k() {
                        return !1;
                    }
                    a.c.as = '26';
                    a.c.at = 'MoatSuperV';
                    a.c.au = '-';
                    a.c.f = function (b) {
                        'string' !== typeof a.c.g && (a.c.au = b);
                    };
                    a.c.av = {};
                    a.c.aw = a.c.at + a.c.as;
                    a.c.n = 11;
                    a.c.ax = window && window['Moat#G' + a.c.as] || {};
                    a.c.ay = 'Moat#G' + a.c.as;
                    window[a.c.ay] = a.c.ax;
                    a.c.ax.a || (a.c.ax.a = w.floor(w.random() * w.pow(10, 12)));
                    a.c.az = w.floor(w.random() * w.pow(10, 12));
                    var g = a.a.ac();
                    a.c.ba = g.url;
                    a.c.bb = g.isCorrect;
                    g = a.l.m(function () {
                        return navigator.userAgent;
                    });
                    a.c.bc = g();
                    'string' !== typeof a.c.bc && (a.c.bc = '');
                    a.c.bd = function () {
                        return function () {
                        };
                    }();
                    a.c.be = function () {
                        return !!window.omid3p && 'undefined' !== typeof window.omid3p.customNative;
                    };
                    a.c.bf = function () {
                        return !1;
                    };
                    a.c.bg = function () {
                        var b = a.c.bf() || a.c.be();
                        return function () {
                            return b;
                        };
                    }();
                    a.c.bh = function () {
                        return function () {
                        };
                    }();
                    a.c.bi = function () {
                        return function () {
                            return !1;
                        };
                    }();
                    a.c.bj = new z().getTime();
                    a.c.bk = !0;
                    a.c.bl = !0;
                    a.c.bm = !1;
                    a.c.bm = !0;
                    a.c.bn = function (a, b) {
                        a = a.split('.');
                        b = b.split('.');
                        for (var c = 0; 3 > c; c++) {
                            var f = parseInt(a[c]), d = parseInt(b[c]);
                            if (f && isNaN(d))
                                return 1;
                            if (d && isNaN(f))
                                return 0;
                            if (f > d)
                                return 1;
                            if (d > f)
                                return 0;
                        }
                        return 2;
                    };
                    a.c.bo = k;
                    a.c.bp = k;
                    a.c.bq = k;
                    a.c.br = k;
                    a.c.bs = k;
                    a.c.bt = k;
                    a.c.bu = k;
                    a.c.bv = k;
                    var e = function () {
                        var b = function (b) {
                                if (a.c.am().isInApp)
                                    return !1;
                                var c = a.m && a.m.a();
                                if (a.c.bw || c || a.c.bx())
                                    return a.c.bw || c || a.c.bx(), !1;
                                b = a.a.cp(b, ['$sf']);
                                if (!b)
                                    return !1;
                                var f = b.ext;
                                b = f && f.geom;
                                var c = [
                                        [
                                            'exp',
                                            'b',
                                            't',
                                            'l',
                                            'r'
                                        ],
                                        'self b t l r h w xiv yiv'.split(' ')
                                    ], n, h = !1;
                                if (f && b && 'function' === typeof b)
                                    try {
                                        if ((b = b()) && b.win) {
                                            if (a.a.forEach(b.win, function (a) {
                                                    if (a && ('number' === typeof a || 'string' === typeof a) && 0 !== parseFloat(a, 10))
                                                        return h = !0, !1;
                                                }), !h)
                                                return !1;
                                        } else
                                            return !1;
                                        if (b.par)
                                            return !0;
                                        for (var f = 0, l = c.length; f < l; f++) {
                                            n = c[f][0];
                                            for (var d = 1, e = c[f].length; d < e; d++)
                                                if ('undefined' === typeof b[n][c[f][d]])
                                                    return !1;
                                        }
                                        return !0;
                                    } catch (g) {
                                    }
                                return !1;
                            }, c, f, d, e;
                        a.c.by = function () {
                            if (e)
                                return !0;
                            c = window;
                            f = document;
                            e = b(c);
                            d = !(!e && !c.$sf);
                            if (!e && a.c.q)
                                for (var g = 0; 20 > g && !e; g++) {
                                    var m = a.g.b(f.body);
                                    if (!1 !== m && !m)
                                        break;
                                    f = (c = a.a.be(m)) && c.document;
                                    e = e || b(c);
                                    d = d || e || c.$sf;
                                }
                            return e;
                        };
                        a.c.bz = function () {
                            return a.c.by() && c;
                        };
                        a.c.ca = function () {
                            'undefined' === typeof e && a.c.by();
                            return d;
                        };
                    };
                    a.c.cb = !1;
                    a.c.cc = !1;
                    a.c.cd = null;
                    a.c.bz = function () {
                        e();
                        return a.c.bz();
                    };
                    a.c.ca = function () {
                        e();
                        return a.c.ca();
                    };
                    a.c.by = function () {
                        e();
                        return a.c.by();
                    };
                    var c = function () {
                        var b = function (b) {
                                return a.c.ce() ? !1 : a.a.cp(b, [
                                    'context',
                                    'observeIntersection'
                                ]) ? !0 : !1;
                            }, c = window, f = document, d = b(c), e = !(!d && !c.context);
                        if (!d && a.c.q)
                            for (var g = 0; 20 > g && !d; g++) {
                                f = a.g.b(f.body);
                                if (!1 !== f && !f)
                                    break;
                                f = (c = a.a.be(f)) && c.document;
                                d = d || b(c);
                                e = e || d || c.context;
                            }
                        a.c.cf = function () {
                            return d && c;
                        };
                        a.c.cg = function (a) {
                            'boolean' === typeof a && (d = a);
                            return d;
                        };
                        a.c.ch = function () {
                            return e;
                        };
                    };
                    a.c.cf = function () {
                        c();
                        return a.c.cf();
                    };
                    a.c.ch = function () {
                        c();
                        return a.c.ch();
                    };
                    a.c.cg = function () {
                        c();
                        return a.c.cg();
                    };
                    a.c.ci = function () {
                        var b = a.a.dl('context');
                        if (b && a.a.cp(b, ['observeIntersection']))
                            return b;
                        b = a.a.dl('AMP_CONTEXT_DATA');
                        if (a.a.cp(b, ['initialIntersection']))
                            return b;
                    };
                    var d = function () {
                        var b, c = function (c) {
                                return (b = a.a.cp(c, ['amazonmobileadsviewablebridge'])) && 'function' === typeof b.addEventListener && 'function' === typeof b.getVersion ? !0 : b = !1;
                            }, f = document, d = window, e = c(d), g = b && 1.1 <= b.getVersion();
                        if (!e && a.c.q)
                            for (var m = 0; 20 > m && !e; m++) {
                                f = a.g.b(f.body);
                                if (!1 !== f && !f)
                                    break;
                                f = (d = a.a.be(f)) && d.document;
                                e = e || c(d);
                                g = g || b && 1.1 <= b.getVersion();
                            }
                        a.c.cj = function () {
                            return e && d;
                        };
                        a.c.ck = function () {
                            return e;
                        };
                        a.c.cl = function () {
                            return g;
                        };
                        a.c.cm = function () {
                            return b;
                        };
                    };
                    a.c.cj = function () {
                        d();
                        return a.c.cj();
                    };
                    a.c.ck = function () {
                        d();
                        return a.c.ck();
                    };
                    a.c.cl = function () {
                        d();
                        return a.c.cl();
                    };
                    a.c.cm = function () {
                        d();
                        return a.c.cm();
                    };
                    a.c.cn = function () {
                        return a.c.ck() && a.c.cl();
                    };
                    a.c.o = function () {
                        var a = !1;
                        try {
                            var b = Object.defineProperty({}, 'passive', {
                                get: function () {
                                    a = !0;
                                }
                            });
                            window.addEventListener('test', null, b);
                            window.removeEventListener('test', null, b);
                        } catch (c) {
                        }
                        return a;
                    }();
                    a.c.co = function () {
                        var b;
                        return function () {
                            if ('undefined' !== typeof b)
                                return b;
                            var c = a.c.e, f = a.a.bq();
                            if (a.c.e.navigator.standalone)
                                b = !0;
                            else {
                                var d = c.innerWidth / f.w, c = c.innerHeight / f.h, d = !isNaN(d) && isFinite(d) && 0.9 <= d && 1.1 >= d, c = !isNaN(c) && isFinite(c) && 0.75 <= c && 1.1 >= c;
                                b = d && c;
                            }
                            a.c.e.MoatMAK ? a.c.e.MoatMAK.namespace && (b = !1) : (d = a.c.e) && d.imraid && 'function' === typeof d.imraid.getVendorName && 'inmobi' === d.imraid.getVendorName() && (b = !1);
                            return b;
                        };
                    }();
                    a.c.cp = function () {
                        var b = a.c.am().isInApp ? 0 : void 0;
                        a.c.ce() ? b = 3 : a.c.cq() && (b = 1);
                        return b;
                    };
                    a.c.cq = function () {
                        var b = a.c.co(), c = a.a.ao(), f = a.c.bo(), d = window.location && ('applewebdata:' === window.location.protocol || 'data:' === window.location.protocol);
                        return '-' === c || '' === c.replace(/^\s+|\s+$/gm, '') || f || d ? !1 : b || a.a.bl(a.c.bc) ? !0 : !1;
                    };
                    a.c.ce = function () {
                        var b;
                        return function () {
                            if ('undefined' !== typeof b)
                                return b;
                            var c = a.a.q() || a.a.o();
                            return b = a.c.cr() || c && a.c.bg() || a.c.bi() ? !0 : a.c.cq() ? !1 : c;
                        };
                    }();
                    a.c.cs = function () {
                        return a.c.e.webkit && a.c.e.webkit.messageHandlers && a.c.e.webkit.messageHandlers.__z_moat_bridge__;
                    };
                    a.c.cr = function () {
                        return !1;
                    };
                    a.c.ct = function () {
                        return !1;
                    };
                    a.c.cu = function (b) {
                        return a.n && a.n.a(b);
                    };
                    a.c.cv = function () {
                        return !1;
                    };
                    a.c.cw = function () {
                        return !1;
                    };
                    a.c.cx = function () {
                        return !1;
                    };
                    a.c.cy = function () {
                        return !1;
                    };
                    a.c.cz = function () {
                        if (a.c.cx() || a.c.cy())
                            return !0;
                        var b = !1;
                        return a.c.c || a.c.cc ? b = b || a.c.cc || a.c.cq() || a.c.br() || a.c.cn() : b;
                    };
                    a.c.protocol = a.a.ce();
                    a.c.da = a.a.l();
                    a.c.db = !a.c.c;
                    a.c.dc = function (b) {
                        var c = 0;
                        b = b || window;
                        try {
                            if (!a.c.c) {
                                var f;
                                for (f = 0; 20 > f && b != window.top; f++)
                                    b = b.parent;
                                c = f;
                            }
                        } catch (d) {
                        }
                        return c;
                    };
                    a.c.c || a.a.ab() || 1 == a.c.dc(a.g.a()) ? a.c.dd = 1 : a.c.dd = 0;
                    a.c.e[a.c.ay] || (a.c.e[a.c.ay] = new a.c.e.Object());
                    a.c.am().isInApp && a.c.c && (a.c.c = a.c.cz() || a.c.ce());
                    a.c.de = function () {
                        return !1;
                    };
                    a.c.df = function () {
                        return !1;
                    };
                    a.c.d = a.c.e.document.referrer || '';
                    try {
                        a.c.dg = a.c.e.history && a.c.e.history.length;
                    } catch (h) {
                    }
                    a.c.dh = function () {
                        if (B)
                            for (var a in B)
                                if (B.hasOwnProperty(a))
                                    return !0;
                        return !1;
                    };
                    a.c.di = function (b) {
                        var c = !0;
                        a.a.forEach(b && b.parentNode && b.parentNode.childNodes, function (b) {
                            if (a.a.ax([
                                    'DIV',
                                    'IFRAME',
                                    'A',
                                    'EMBED',
                                    'OBJECT'
                                ], b.nodeName))
                                return c = !1;
                        });
                        return c;
                    };
                    a.c.dj = function () {
                        for (var a in B)
                            if (B.hasOwnProperty(a)) {
                                var b = B[a];
                                if (b && b.aa && b.aa[G])
                                    return !0;
                            }
                        return !1;
                    };
                    a.c.dk = function () {
                        return a.c.am().isInApp ? a.c.cq() ? !a.c.bx() && a.c.c : a.c.cz() : !a.c.bx() && a.c.c;
                    };
                    a.c.bx = function () {
                        return a.c.dl && a.c.dl();
                    };
                    a.c.dm = function () {
                        return a.c.cb;
                    };
                    a.c.dn = function () {
                        return a.c.by && a.c.by();
                    };
                    a.c['do'] = function () {
                        return a.c.cg && a.c.cg();
                    };
                    a.c.dp = function () {
                        return a.m && a.m.a();
                    };
                    a.c.dq = function (b) {
                        var c = !1;
                        a.o && a.o.a && (b && b.periscopeManager ? b.periscopeManager.measurable && (c = !0) : c = !0);
                        return c;
                    };
                    a.c.dr = function (b) {
                        return a.c.dp() || a.c.dq(b);
                    };
                    a.c.ds = function (b, c) {
                        return !b || b && b.isMeasurabilityDisabled() || a.d.c() && !c ? !1 : a.c.dk() || a.c.dt() || void 0;
                    };
                    a.c.du = function (b) {
                        if (!b || b && b.isMeasurabilityDisabled() || a.d.c())
                            return !1;
                        var c = !1;
                        a.m && a.m.a() ? c = !0 : a.o && a.o.a && b.periscopeManager && b.periscopeManager.fullyMeasurable && b.ao && 1 != b.ao.skin && (c = !0);
                        return a.c.dk() || a.c.dt() || c;
                    };
                    a.c.dv = function () {
                        a.c.bk = !1;
                        a.c.bl = !0;
                        a.c.bm = !0;
                    };
                    a.c.dw = !0;
                    a.c.dx = !0;
                    'mlb.com' === a.a.ao() && (a.a.bj() || a.a.bk()) && (a.c.dx = !1);
                    a.c.dy = function () {
                        return !1;
                    };
                    a.c.dz = function () {
                        a.c.ce();
                        return !1;
                    };
                    a.c.ea = function () {
                        return !1;
                    };
                    a.c.eb = function () {
                        return !1;
                    };
                    a.c.ec = function () {
                        var b = a.c.bc;
                        return (b = b && b.match(/Firefox\/([0-9]+)\./)) ? parseInt(b[1], 10) : !1;
                    };
                    a.c.bw = !1;
                    a.c.ed = !1;
                    a.c.a = new a.c.e.Image();
                    a.c.k = function () {
                        if ('undefined' !== typeof a.c.e['Moat#EVA'])
                            return !0;
                        try {
                            if ('undefined' !== typeof a.c.e.eval && (a.c.e.eval('(function(win){ win[\'Moat#EVA\'] = true; })(window)'), 'undefined' !== typeof a.c.e['Moat#EVA']))
                                return !0;
                        } catch (b) {
                        }
                        return !1;
                    };
                    a.c.l = function (a) {
                        try {
                            return new a.Function(''), !0;
                        } catch (b) {
                            return !1;
                        }
                    };
                    a.c.ee = function () {
                        var a = navigator && navigator.appVersion && navigator.appVersion.match(/Windows NT (\d\d{0,1}\.\d)/);
                        return a ? parseFloat(a[1]) : -1;
                    };
                    a.c.ef = function () {
                        return 6.1 === a.c.ee();
                    };
                    a.c.eg = function () {
                        var b = a.c.e;
                        return b.navigator && 'function' === typeof b.navigator.getBattery;
                    };
                    a.c.dt = function () {
                        return !1;
                    };
                    a.c.eh = function () {
                        return !1;
                    };
                    a.c.ei = a.a.br();
                    a.c.ej = function (b) {
                        return b = (b = a.c.ei) || a.a.bs();
                    };
                    var b = {
                            a: 'a',
                            b: 'b',
                            c: 'c',
                            d: 'd',
                            e: 'e',
                            f: 'f'
                        }, f = {
                            a: 'waiting',
                            b: 'noHistData',
                            c: 'dataAvailable',
                            d: 'slotWaiting',
                            e: 'slotNoHistData',
                            f: 'slotNoSlotData'
                        };
                    a.c.ek = function () {
                        var c = {};
                        a.a.forEach(b, function (a, b) {
                            c[a] = f[b];
                        });
                        a.a.forEach(f, function (a, b) {
                            c[a] = a;
                        });
                        return c;
                    }();
                    a.c.el = f;
                }(v));
                (function (a) {
                    function k(a, e, c) {
                        function d(a, b) {
                            for (var c in a)
                                a.hasOwnProperty(c) && b.call(null, a[c], c);
                        }
                        function b(a) {
                            var b = [];
                            d(a, function (a, c) {
                                b.push(c);
                            });
                            return b;
                        }
                        a = e[a];
                        a && a.xa.sode || (a.xa.sode = function () {
                            this.desw = {};
                            this.xfgf = [];
                            this.publishing_ = !1;
                            this.xkcd = {};
                            this.edws = [];
                        }, a.xa.sode.prototype.uxin = function () {
                            var a = function (a) {
                                a = c.max(4, a);
                                return ((1 + c.random()) * c.pow(16, a) | 0).toString(16).substring(0, a);
                            };
                            return function (b) {
                                return a(4) + '-' + a(4) + '-' + a(4) + '-' + a(4);
                            };
                        }(), a.xa.sode.prototype.xsza = function (a) {
                            this.desw[a] || (this.desw[a] = {});
                            return this.desw[a];
                        }, a.xa.sode.prototype.esgf = function (a, b) {
                            this.publishing_ ? this.xfgf.push(arguments) : this.zaxs.apply(this, arguments);
                        }, a.xa.sode.prototype.kswa = function (a, b) {
                            for (var c = this.xkcd[a] || [], d = c && c.length, e = 0; e < d; e++)
                                if (c[e] === b)
                                    return !1;
                            c.push(b);
                            c.sort(function (a, b) {
                                return a - b;
                            });
                            this.xkcd[a] = c;
                        }, a.xa.sode.prototype.aksw = function (a, b) {
                            if (!this.xkcd[a])
                                return !1;
                            for (var c = this.xkcd[a], d = -1, e = c && c.length, g = 0; g < e; g++)
                                if (c[g] === b) {
                                    d = g;
                                    break;
                                }
                            -1 != d && c.splice(d, 1);
                            this.xkcd[a] = c;
                        }, a.xa.sode.prototype._getEventPriorities_ = function (a) {
                            return this.xkcd[a] || [];
                        }, a.xa.sode.prototype.azsx = function (a, b, c) {
                            c = c || {};
                            var d = c.id || this.uxin(), e;
                            e = c.priority;
                            e = !isNaN(e) && isFinite(e) ? parseInt(e, 10) : 10;
                            for (var g = this.xsza(a), k = 0; g[d] && !c.id && 10 > k;)
                                k++, d = this.uxin();
                            g[e] || (g[e] = {});
                            this.kswa(a, e);
                            c.priority = e;
                            g[e][d] = {
                                cb: b,
                                options: c
                            };
                            return d;
                        }, a.xa.sode.prototype.zaxs = function (a, b) {
                            if (!this.desw[a])
                                return !1;
                            this.publishing_ = !0;
                            for (var c = this.edws.slice.call(arguments, 1), d = this._getEventPriorities_(a).slice(0), e = 0, g = d.length; e < g; e++) {
                                var k = this.desw[a][d[e]], m;
                                for (m in k)
                                    if (k.hasOwnProperty(m)) {
                                        var p = k[m];
                                        if (p) {
                                            var n;
                                            n = p.options && p.options.includeId ? [m].concat(c) : c;
                                            if (!p.options || !p.options.condition || p.options.condition && p.options.condition.apply(null, n))
                                                p.options && p.options.once && 'undefined' !== typeof p.options.priority && this.sxaz(a, {
                                                    id: m,
                                                    priority: p.options.priority
                                                }), p.cb.apply(null, n);
                                        }
                                    }
                            }
                            this.publishing_ = !1;
                            for (c = 0; 0 < this.xfgf.length && 500 > c; c++)
                                this.zaxs.apply(this, this.xfgf.pop());
                        }, a.xa.sode.prototype.swaq = function (a, c, d) {
                            var e = !1;
                            if (this.desw[a] && this.desw[a][d])
                                try {
                                    delete this.desw[a][d][c], e = !0;
                                } catch (g) {
                                }
                            0 === b(this.desw[a][d]).length && this.aksw(a, d);
                            return e;
                        }, a.xa.sode.prototype.sxaz = function (a, b) {
                            if (!b || 'object' != typeof b || !this.desw[a])
                                return !1;
                            if (b.id && void 0 !== b.priority)
                                return this.swaq(a, b.id, b.priority);
                            if (b.id || b.callback)
                                for (var c = this._getEventPriorities_(a), d = 0, e = c.length; d < e; d++) {
                                    var g = c[d];
                                    if (b.id && b.callback) {
                                        if (this.desw[a][g][b.id] && this.desw[a][g][b.id].cb == b.callback)
                                            return this.swaq(a, b.id, g);
                                    } else if (b.id) {
                                        if (this.desw[a][g][b.id])
                                            return this.swaq(a, b.id, g);
                                    } else
                                        for (var k in this.desw[a][g])
                                            if (this.desw[a][g][k] && this.desw[a][g][k].cb == b.callback)
                                                return this.swaq(a, k, g);
                                }
                            return !1;
                        }, a.xa.sode.prototype.ugin = function (a) {
                            if ('string' === typeof a)
                                if (this.desw[a])
                                    delete this.desw[a];
                                else
                                    return !1;
                            else
                                this.desw = {};
                            return !0;
                        });
                    }
                    a.k = {};
                    a.k.b = function (g) {
                        g.xa.sode || (g.xb == window ? k(a.c.aw, window, w) : a.a.dk(k, '\'' + a.c.aw + '\',window, Math', g.xb));
                        a.k.a = new g.xa.sode();
                    };
                }(v));
                (function (a) {
                    function k(a, e) {
                        function c(a) {
                            var b = f.xb.Math.pow, c = f.xb.Math.random;
                            a = (0, f.xb.Math.max)(4, a);
                            return ((1 + c()) * b(16, a) | 0).toString(16).substring(0, a);
                        }
                        function d(a) {
                            return function (b) {
                                return a(b);
                            };
                        }
                        function b(a, b) {
                            if (!a || 'string' !== typeof b || !a[b] || a == window)
                                return !1;
                            if ('string' === typeof a.nodeName && ('OBJECT' === a.nodeName || 'EMBED' === a.nodeName)) {
                                var c = document && document.body && document.body[b];
                                if (c && c !== a[b])
                                    return c;
                            }
                            return !1;
                        }
                        e[a] = e[a] || {
                            zs: !1,
                            zr: 0,
                            yf: {},
                            h: 0,
                            m: 0,
                            i: {},
                            xa: {},
                            xb: e,
                            xc: {},
                            xyds: {}
                        };
                        var f = e[a], h = {}, l = function () {
                                var a = !1;
                                try {
                                    var b = Object.defineProperty({}, 'passive', {
                                        get: function () {
                                            a = !0;
                                        }
                                    });
                                    window.addEventListener('test', null, b);
                                    window.removeEventListener('test', null, b);
                                } catch (c) {
                                }
                                return a;
                            }();
                        f.xc.dowg = function (a, b) {
                            f && (f.xyds || (f.xyds = {}), f && f.xyds && (f.xyds[b] ? f.xyds[b].push(a) : f.xyds[b] = [a]));
                        };
                        f.xc.hsxk = function () {
                            f.dcsx && f.dcsx.dcwn();
                            'undefined' !== typeof a && a && f.xc.esde(a);
                            var a;
                            f.xc.exde(f.xc.hsxk, 1000);
                        };
                        f.xc.esde = function (a) {
                            window && window.clearTimeout && window.clearTimeout(a);
                        };
                        f.xc.ynds = function (a, c, f, e) {
                            var m, p, n = !1;
                            'touchstart' === c && l && (n = { passive: !0 });
                            e ? h[c + e] ? f = h[c + e] : (f = d(f), h[c + e] = f) : f = d(f);
                            if (a.addEventListener)
                                e = 'addEventListener', m = '';
                            else if (a.attachEvent)
                                e = 'attachEvent', m = 'on';
                            else
                                return !1;
                            if (p = b(a, e))
                                try {
                                    p.call(a, m + c, f, n);
                                } catch (g) {
                                    a[e](m + c, f, n);
                                }
                            else if (a && e && a[e])
                                try {
                                    a[e](m + c, f, n);
                                } catch (g) {
                                    return !1;
                                }
                        };
                        f.xc.engn = function (a, c, f, d) {
                            var m, e = c + d, n;
                            if (!a)
                                return delete h[e], !1;
                            f = !1 !== d ? h[e] : f;
                            if (a.removeEventListener)
                                d = 'removeEventListener', m = '';
                            else if (a.detachEvent)
                                d = 'detachEvent', m = 'on';
                            else
                                return delete h[e], !1;
                            if (n = b(a, d))
                                try {
                                    n.call(a, m + c, f, !1);
                                } catch (l) {
                                    a[d](m + c, f, !1);
                                }
                            else
                                try {
                                    a[d](m + c, f, !1);
                                } catch (l) {
                                }
                            delete h[e];
                        };
                        f.xc.exde = function (a, b) {
                            a = d(a);
                            var c;
                            window && window.setTimeout && (c = window.setTimeout(a, b));
                            return c;
                        };
                        f.xc.exae = function (a, b, c) {
                            return function () {
                                b.apply(c || null, a.concat(a.slice.call(arguments)));
                            };
                        };
                        f.xc.uxin = function () {
                            return c(4) + '-' + c(4) + '-' + c(4) + '-' + c(4);
                        };
                        f.xc.twer = function (a, b) {
                            f && (f.yf || (f.yf = {}), f && f.yf && (f.yf[b] ? f.yf[b].push(a) : f.yf[b] = [a]));
                        };
                    }
                    a.p = {};
                    a.p.a = function (g) {
                        var e = a.p.b(g), c = !1;
                        e || (e = a.p.c(g), c = !0, e.xc.exde(e.xc.hsxk, 1000));
                        window[a.c.aw] = e;
                        a.k.b(e);
                        c && (e.swde = new e.xa.sode());
                        a.k.a.azsx('adKilled', a.p.d);
                        a.k.a.azsx('allLocalAdsKilled', a.p.e, { once: !0 });
                        return e;
                    };
                    a.p.e = function () {
                        a.k.a.sxaz('adKilled', { callback: a.p.d });
                        a.p.f(q);
                    };
                    a.p.d = function (g) {
                        a.c.i = null;
                        if (q) {
                            try {
                                var e = q.yf[a.c.ax.a];
                                if (e) {
                                    var c = a.a.indexOf(e, g.yg);
                                    -1 < c && e.splice(c, 1);
                                }
                                a.p.g(a.c.ax.a, g.TAGID);
                            } catch (d) {
                            }
                            a.p.f(q);
                        }
                    };
                    a.p.h = function (g, e) {
                        var c = a.p.b(a.c.e);
                        c && c.xc.twer(g, e);
                    };
                    a.p.i = function (g, e) {
                        var c = a.p.b(a.c.e);
                        c && c.xc.dowg(e, g);
                    };
                    a.p.g = function (g, e) {
                        var c = q.xyds[g];
                        if (c) {
                            var d = a.a.indexOf(c, e);
                            -1 < d && c.splice(d, 1);
                        }
                    };
                    a.p.f = function (g) {
                        var e = !1, c = !1, d = 0, b = 0;
                        try {
                            g.yf[a.c.ax.a] && (c = 0 === g.yf[a.c.ax.a].length), a.a.forEach(g.yf, function (a) {
                                0 < a.length && d++;
                            }), a.p.g(a.c.ax.a, a.c.az), a.a.forEach(g.xyds, function (a) {
                                0 < a.length && (b += a.length);
                            }), g.xyds[a.c.ax.a] && 0 != g.xyds[a.c.ax.a].length || (c = !0), 0 === b && 0 === d && (e = !0);
                        } catch (f) {
                        }
                        c && g.swde.esgf('allAdsInWindowKilled', a.c.ax.a);
                        e && (a.k.a.sxaz('adKilled', { callback: a.p.d }), a.k.a.sxaz('allLocalAdsKilled', { callback: a.p.e }), g.swde.esgf('allAdsKilled'));
                    };
                    a.p.c = function (g) {
                        g == window ? k(a.c.aw, window) : a.a.dk(k, '\'' + a.c.aw + '\',window', g);
                        return a.p.b(g);
                    };
                    a.p.b = function (g) {
                        try {
                            return g = g || a.c.e, g[a.c.aw];
                        } catch (e) {
                            return null;
                        }
                    };
                    a.p.j = function (g) {
                        try {
                            var e = [];
                            g = g || a.c.e;
                            if (!g)
                                return !1;
                            var c = a.c.at;
                            if (!c)
                                return !1;
                            var d = new RegExp('^' + c);
                            if (!d)
                                return !1;
                            a.a.forEach(g, function (a, c) {
                                -1 < c.search(d) && a && 'number' === typeof a.zr && e.push(a);
                            });
                            return e;
                        } catch (b) {
                            return !1;
                        }
                    };
                    a.p.k = function (g) {
                        try {
                            var e = [];
                            g = g || a.c.e;
                            return g ? (e = a.p.j(g)) ? 0 < e.length ? !0 : !1 : !1 : !1;
                        } catch (c) {
                            return !1;
                        }
                    };
                    a.p.l = function (g) {
                        var e = a.p.b();
                        e && (e.i[g] = !0);
                    };
                }(v));
                var q = v.p.a(v.c.e), ia = v.c.c, R = v.a.l(), P = v.c.bj, ta = v.c.e;
                (function (a) {
                    function k(a, e, c) {
                        var d = e[a];
                        d && d.xa.txae || (d.xa.txae = function (a, c) {
                            this.sxdc = d.xc.uxin();
                            this.cdxs = a;
                            this.xscd = {};
                            this.swde = c;
                            var h = this, e = this.swde.azsx('allAdsInWindowKilled', function (a) {
                                    d.dcsx.engn({ listenerName: 'unloadFn' + a });
                                    d.dcsx.engn({ listenerName: 'beforeunloadFn' + a });
                                });
                            this.swde.azsx('allAdsKilled', function () {
                                h.swde.sxaz('allAdsInWindowKilled', { id: e });
                                d.dcsx && (d.dcsx.aqsw(), d.zs = !1, d.xz = !1, d.dcsx = !1);
                            }, { once: !0 });
                        }, d.xa.txae.prototype.wsed = function (a, c, h, e, g) {
                            this.xscd[e] || (this.xscd[e] = {});
                            this.xscd[e].evt = c;
                            this.xscd[e].target = a;
                            this.xscd[e].periodic = !0;
                            var r;
                            r = d.xc.exae([this], function (k, u) {
                                d.xc.engn(a, c, null, e);
                                if (k.xscd[e]) {
                                    k.xscd[e].tid && d.xc.esde(k.xscd[e].tid);
                                    k.xscd[e].tid = d.xc.exde(function () {
                                        k.xscd[e].tid = null;
                                        d.xc.ynds(a, c, r, e);
                                    }, g);
                                    try {
                                        k.swde.zaxs(h, u);
                                    } catch (m) {
                                    }
                                }
                            });
                            d.xc.ynds(a, c, r, e);
                        }, d.xa.txae.prototype.wsqa = function (a) {
                            this.xscd[a] && (d.xc.esde(this.xscd[a].tid), d.xc.engn(this.xscd[a].target, this.xscd[a].evt, null, a), delete this.xscd[a]);
                        }, d.xa.txae.prototype.qaws = function () {
                            this.wsed(this.cdxs, 'scroll', 'scroll', 'globalScrollevent' + this.sxdc, 1000);
                            var a = this.cdxs.document.documentElement;
                            this.wsed(a, 'mousedown', 'mouseEvent', 'globalMouseDown' + this.sxdc, 1000);
                            this.wsed(a, 'mouseover', 'mouseEvent', 'globalMouseOver' + this.sxdc, 1000);
                            this.wsed(a, 'mousemove', 'mouseEvent', 'globalMouseMove' + this.sxdc, 5000);
                            this.wsed(this.cdxs, 'mousewheel', 'mouseEvent', 'globalMouseWheel' + this.sxdc, 5000);
                            this.wsed(this.cdxs, 'DOMMouseScroll', 'mouseEvent', 'globalMouseScroll' + this.sxdc, 5000);
                            this.wsed(a, 'touchstart', 'mouseEvent', 'globalTouchStartEvent' + this.sxdc, 1000);
                            this.wsed(a, 'keydown', 'keyboardEvent', 'globalKeyboardEvent' + this.sxdc, 1000);
                        }, d.xa.txae.prototype.aqsw = function () {
                            for (var a in this.xscd)
                                this.engn({ listenerName: a });
                        }, d.xa.txae.prototype.ynds = function (a, c, h, e) {
                            if (!this.xscd[e]) {
                                this.xscd[e] = {};
                                this.xscd[e].evt = c;
                                this.xscd[e].target = a;
                                this.xscd[e].publishEvt = h;
                                var g;
                                g = d.xc.exae([this], function (a, b) {
                                    a.xscd[e] && a.swde.zaxs(h, b);
                                });
                                d.xc.ynds(a, c, g, e);
                            }
                        }, d.xa.txae.prototype.engn = function (a) {
                            function c(a, b) {
                                a.xscd[b].periodic ? a.wsqa(b) : (d.xc.engn(a.xscd[b].target, a.xscd[b].evt, null, b), delete a.xscd[b]);
                            }
                            var h = a.target && a.evt, e = a.target && !a.evt, g = a.all;
                            if (a.listenerName)
                                this.xscd[a.listenerName] && c(this, a.listenerName);
                            else if (h)
                                for (var r in this.xscd)
                                    (h = this.xscd[r]) && h.evt == a.evt && h.target == a.target && c(this, r);
                            else if (e)
                                for (r in this.xscd)
                                    (h = this.xscd[r]) && h.target == a.target && c(this, r);
                            else if (g)
                                for (r in this.xscd)
                                    (h = this.xscd[r]) && c(this, r);
                        }, d.xa.txae.prototype.kdmw = function (a) {
                            d.swde.esgf(a.publishEvt);
                        }, d.xa.txae.prototype.dcwn = function () {
                            var a = this.xscd, c;
                            for (c in a) {
                                var d = a[c];
                                'unload' === d.evt && d.target && d.target.closed && this.kdmw(d);
                            }
                        });
                    }
                    a.q = {};
                    a.q.a = function (g) {
                        g && (g.xa.txae || (g.xb == window ? k(a.c.aw, window, w) : a.a.dk(k, '\'' + a.c.aw + '\',window, Math', g.xb)), g.zs || (g.dcsx = new g.xa.txae(a.c.e, g.swde), g.zs = !0));
                    };
                    a.k.a.azsx('modulesReady', a.q.a, { once: !0 });
                    a.k.a.azsx('startAdTracking', function (g) {
                        q && q.zs && !q.xz && (q.dcsx ? (q.xz = !0, q.dcsx.qaws()) : a.q.a(q), a.focus.setFocusListeners());
                    });
                }(v));
                (function (a) {
                    function k(a, b, c) {
                        a.IR5.MIN[c] = w.min(b, a.IR5.MIN[c]) || b || 1;
                        a.IR5.MAX[c] = w.max(b, a.IR5.MAX[c]) || b;
                    }
                    function g(b) {
                        if (t)
                            return !0;
                        var c = q.swde.azsx('focusStateChange', function (c) {
                            var n = { type: 'blur' };
                            c || (a.r.g(n, b), a.r.h(n, b));
                        });
                        a.k.a.azsx('adKilled', function () {
                            q.swde.sxaz('focusStateChange', { id: c });
                        }, {
                            once: !0,
                            condition: function (a) {
                                return b.zr == a.zr;
                            }
                        });
                        t = !0;
                    }
                    function e(a, b) {
                        b.be = w.max('undefined' !== typeof b.be ? b.be : 0, a - b.bf);
                        'undefined' === typeof b.by && 500 <= b.be && (b.by = b.bk);
                    }
                    function c(b) {
                        b.az === a.r.a.d.a ? b.az = a.r.a.d.b : b.az === a.r.a.d.b && (b.az = a.r.a.d.a);
                    }
                    function d(b) {
                        b.ba === a.r.a.d.a ? b.ba = a.r.a.d.b : b.ba === a.r.a.d.b && (b.ba = a.r.a.d.a);
                    }
                    function b(b) {
                        b.ax === a.r.a.b.a ? b.ax = a.r.a.b.b : b.ax === a.r.a.b.b && (b.ax = a.r.a.b.a);
                    }
                    function f(b) {
                        b.ay === a.r.a.c.a ? b.ay = a.r.a.c.b : b.ay === a.r.a.c.b && (b.ay = a.r.a.c.a);
                    }
                    function h(a, b) {
                        'undefined' === typeof b.bk && (b.bk = 0);
                        b.bk += a - b.bo;
                        b.bo = a;
                    }
                    function l(a, b) {
                        'undefined' === typeof b.bl && (b.bl = 0);
                        b.bl += a - b.bp;
                        b.bp = a;
                    }
                    function x(a, b) {
                        'undefined' === typeof b.bg && (b.bg = 0);
                        'undefined' === typeof b.bc && (b.bc = 0);
                        b.bu = a - b.bs;
                        b.bu > b.bc && (b.bc = b.bu);
                        b.bg += a - b.bq;
                        500 <= b.bc && 'undefined' === typeof b.bw && (b.bk += a - b.bo, b.bw = b.bk);
                        b.bq = a;
                    }
                    function r(a, b) {
                        'undefined' === typeof b.bh && (b.bh = 0);
                        'undefined' === typeof b.bd && (b.bd = 0);
                        b.bv = a - b.bt;
                        b.bv > b.bd && (b.bd = b.bv);
                        b.bh += a - b.br;
                        500 <= b.bd && 'undefined' === typeof b.bx && (b.bl += a - b.bp, b.bx = b.bl);
                        b.br = a;
                    }
                    a.r = {};
                    var t = !1;
                    a.r.a = {};
                    a.r.a.a = {};
                    a.r.a.a.a = 0;
                    a.r.a.a.b = 1;
                    a.r.a.b = {};
                    a.r.a.b.a = 0;
                    a.r.a.b.b = 1;
                    a.r.a.c = {};
                    a.r.a.c.a = 0;
                    a.r.a.c.b = 1;
                    a.r.a.d = {};
                    a.r.a.d.a = 0;
                    a.r.a.d.b = 1;
                    a.r.a.e = {};
                    a.r.a.e.a = 0;
                    a.r.a.e.b = 1;
                    a.r.a.f = {};
                    a.r.a.f.a = 0;
                    a.r.a.f.b = 1;
                    a.r.a.f.c = 2;
                    a.r.b = function (a) {
                        k(a, a.aj, 'x');
                        k(a, a.ak, 'y');
                        a.IR5.AREA = (a.IR5.MAX.x - a.IR5.MIN.x) * (a.IR5.MAX.y - a.IR5.MIN.y);
                    };
                    a.r.c = function (b) {
                        function c() {
                            500 <= new z().getTime() - ra && (a.r.d({ type: 'park' }, b), clearInterval(n), b.au = a.r.a.a.a);
                        }
                        var f = b.au;
                        if (f === a.r.a.a.a) {
                            ra = new z().getTime();
                            var n = a.l.e(c, 50);
                            b.au = a.r.a.a.b;
                        } else
                            f === a.r.a.a.b && (ra = new z().getTime());
                    };
                    a.r.e = function (b) {
                        function c() {
                            3000 <= new z().getTime() - la && (a.r.f({ type: 'park' }, b), clearInterval(n), b.av = a.r.a.a.a);
                        }
                        var f = b.av;
                        if (f === a.r.a.a.a) {
                            la = new z().getTime();
                            var n = a.l.e(c, 50);
                            b.av = a.r.a.a.b;
                        } else
                            f === a.r.a.a.b && (la = new z().getTime());
                    };
                    a.r.g = function (b, f) {
                        var d = b.type;
                        g(f);
                        if (f.az === a.r.a.d.a) {
                            if ('mouseover' === d || 'mousemove' === d)
                                f.bo = new z().getTime(), c(f);
                        } else if (f.az === a.r.a.d.b) {
                            'mousemove' === d && h(new z().getTime(), f);
                            if ('mouseout' === d || 'blur' === d)
                                h(new z().getTime(), f), c(f);
                            'scooper' === d && h(new z().getTime(), f);
                        }
                    };
                    a.r.h = function (b, c) {
                        var f = b.type;
                        g(c);
                        if (c.ba === a.r.a.d.a) {
                            if ('mouseover' === f || 'mousemove' === f)
                                c.bp = new z().getTime(), d(c);
                        } else if (c.ba === a.r.a.d.b) {
                            'mousemove' === f && l(new z().getTime(), c);
                            if ('mouseout' === f || 'blur' === f)
                                l(new z().getTime(), c), d(c);
                            'scooper' === f && l(new z().getTime(), c);
                        }
                    };
                    a.r.d = function (c, f) {
                        if (2 != f.an) {
                            var d = c.type;
                            if (f.ax === a.r.a.b.a) {
                                if ('mouseover' === d || 'mousemove' === d)
                                    f.bq = new z().getTime(), f.bs = new z().getTime(), b(f);
                            } else
                                f.ax === a.r.a.b.b && ('mousemove' !== d && 'mouseout' !== d || x(new z().getTime(), f), 'park' === d && x(new z().getTime() - 500, f), 'mouseout' !== d && 'park' !== d || b(f));
                        }
                    };
                    a.r.f = function (b, c) {
                        if (2 != c.an) {
                            var d = b.type;
                            if (c.ay === a.r.a.c.a) {
                                if ('mouseover' === d || 'mousemove' === d)
                                    c.br = new z().getTime(), c.bt = new z().getTime(), f(c);
                            } else
                                c.ay === a.r.a.c.b && ('mousemove' !== d && 'mouseout' !== d || r(new z().getTime(), c), 'park' === d && r(new z().getTime() - 3000, c), 'mouseout' !== d && 'park' !== d || f(c));
                        }
                    };
                    a.r.i = function (b, c) {
                        var f = b.type;
                        if (c.bb == a.r.a.e.a) {
                            if ('mouseover' == f || 'mousemove' == f)
                                c.bf = new z().getTime(), c.bb = a.r.a.e.b;
                        } else
                            c.bb == a.r.a.e.b && ('mouseout' == f ? (e(new z().getTime(), c), c.bb = a.r.a.e.a) : 'mousemove' != f && 'scooper' != f || e(new z().getTime(), c));
                    };
                }(v));
                (function (a) {
                    function k(b) {
                        a.focus.pageIsPrerendered() || (a.k.a.zaxs('noLongerPreRendered'), a.l.d(document, x, k, 'pr'));
                    }
                    function g(a) {
                        'undefined' == typeof f && (f = a);
                    }
                    a.focus = {};
                    var e = !1, c = a.c.bc, c = -1 < c.indexOf('Safari') && -1 == c.indexOf('Chrome') && -1 == c.indexOf('Chromium') && !a.a.l(), d = a.a.t() && !a.a.l(), b = 'undefined' !== typeof document.hasFocus, f, h = {
                            visible: 0,
                            hidden: 1,
                            prerender: 2
                        }, l, x, r, t;
                    'undefined' !== typeof document.hidden ? (l = 'hidden', x = 'visibilitychange') : 'undefined' !== typeof document.mozHidden ? (l = 'mozHidden', x = 'mozvisibilitychange') : 'undefined' !== typeof document.msHidden ? (l = 'msHidden', x = 'msvisibilitychange') : 'undefined' !== typeof document.webkitHidden && (l = 'webkitHidden', x = 'webkitvisibilitychange');
                    for (var u = [
                                'v',
                                'mozV',
                                'msV',
                                'webkitV'
                            ], m = 0; m < u.length; m++) {
                        var p = u[m] + 'isibilityState';
                        if ('undefined' !== typeof document[p] && null !== document[p]) {
                            r = p;
                            break;
                        }
                    }
                    t = 'undefined' !== typeof l;
                    var n, I;
                    'undefined' !== typeof window.requestAnimationFrame ? n = 'requestAnimationFrame' : 'undefined' !== typeof window.webkitRequestAnimationFrame && (n = 'webkitRequestAnimationFrame');
                    I = c && 'string' == typeof n && !t;
                    var K = new z().getTime();
                    I && function E() {
                        K = new z().getTime();
                        if (!e)
                            window[n](E);
                    }();
                    a.focus.focusStartTime = !1;
                    var F = q.swde.azsx('focusStateChange', function (b) {
                        b && (a.focus.focusStartTime = new z().getTime(), q.swde.sxaz('focusStateChange', {
                            id: F,
                            priority: 1
                        }));
                    }, { priority: 1 });
                    a.focus.getFocusMethod = function () {
                        return f;
                    };
                    a.focus.visibilitychange = x;
                    a.focus.setFocusListeners = function () {
                    };
                    a.focus.getQueryString = function (a) {
                        a = {};
                        a.em = f;
                        D && (a.eo = 1);
                        'undefined' != typeof r && (a.en = h[document[r]]);
                        return a;
                    };
                    a.focus.supportsPageVisAPI = function () {
                        return t;
                    };
                    a.focus.checkFocus = function () {
                        if (a.focus.supportsPageVisAPI())
                            return g(0), !document[l];
                        if (I)
                            return g(1), 100 > new z().getTime() - K;
                        if (d && b)
                            return g(2), document.hasFocus();
                        g(3);
                        return !0;
                    };
                    var y = !1;
                    a.focus.pageIsVisible = function () {
                        var b = a.focus.checkFocus();
                        if (y != b && q && q.swde)
                            try {
                                q.swde.zaxs('focusStateChange', b);
                            } catch (c) {
                            }
                        return y = b;
                    };
                    a.focus.pageIsPrerendered = function () {
                        return 'undefined' !== typeof r ? 'prerender' == document[r] : !1;
                    };
                    a.focus.pageIsVisible();
                    var H = !1;
                    a.k.a.azsx('allLocalAdsKilled', function () {
                        H && a.l.d(document, x, k, 'pr');
                        e = !0;
                    }, { once: !0 });
                    a.focus.pageIsPrerendered() && (a.l.c(document, x, k, 'pr'), H = !0);
                    var D = a.focus.pageIsPrerendered();
                }(v));
                (function (a) {
                    function k(b, c, n, f, d) {
                        ('remove' === d ? a.l.d : a.l.c)(b, c, function (c) {
                            c = c || this.event;
                            var f = c.currentTarget || b;
                            try {
                                var d = f[J];
                            } catch (h) {
                                d = f[J];
                            }
                            if (d = B[d]) {
                                var e;
                                e = c;
                                var l = f.getBoundingClientRect();
                                e = -1 != e.type.indexOf('touch') && e.changedTouches && 0 < e.changedTouches.length ? {
                                    x: parseInt(e.changedTouches[0].clientX - l.left, 10),
                                    y: parseInt(e.changedTouches[0].clientY - l.top, 10)
                                } : {
                                    x: parseInt(e.clientX - l.left, 10),
                                    y: parseInt(e.clientY - l.top, 10)
                                };
                                d.aj = e.x;
                                d.ak = e.y;
                                d.dm || (d.cb = 2 == a.focus.getFocusMethod() ? d.counters.laxDwell.tCur : d.counters.strictDwell.tCur, d.dm = 1);
                                n.call(b, c, f, d);
                            }
                        }, 'genmouse');
                    }
                    function g(b, f, n) {
                        k(b, 'click', r, f, n);
                        k(b, 'mousedown', c, f, n);
                        R ? a.c.dx && k(b, 'touchstart', d, f, n) : (k(b, 'mousemove', e, f, n), k(b, 'mouseover', l, f, n), k(b, 'mouseout', x, f, n));
                    }
                    function e(b, c, n) {
                        a.k.a.zaxs('mouseEventOnAd', n);
                        if (!R && (n.aj !== n.al || n.ak !== n.am)) {
                            a.r.d(b, n);
                            a.r.f(b, n);
                            a.r.g(b, n);
                            a.r.i(b, n);
                            a.r.h(b, n);
                            a.r.b(n);
                            a.r.c(n);
                            a.r.e(n);
                            0 === n.ar.length && (n.ai = u(n));
                            if (100 > n.ar.length || 100 > n.as.length || 100 > n.at.length)
                                n.ar.push(n.aj), n.as.push(n.ak), n.at.push(a.a.bb(n));
                            n.al = n.aj;
                            n.am = n.ak;
                        }
                        n.ai !== u(n) && 1 < n.ar.length && t(n, 'onMouseMove');
                    }
                    function c(b, c, n) {
                        a.k.a.zaxs('mouseEventOnAd', n);
                        b = { e: 2 };
                        b.q = n.aq[2]++;
                        b.x = n.aj;
                        b.y = n.ak;
                        a.s.a(n, b);
                    }
                    function d(b, c, n) {
                        a.k.a.zaxs('mouseEvent', n);
                        a.k.a.zaxs('mouseEventOnAd', n);
                        b = { e: 23 };
                        b.q = n.aq[23]++;
                        b.x = n.aj;
                        b.y = n.ak;
                        c = new z().getTime();
                        if ('undefined' === typeof n.ct)
                            n.ct = c;
                        else {
                            var f = c - n.ct;
                            n.ct = c;
                            n.cu = w.min(n.cu, f) || f;
                        }
                        b.bz = void 0;
                        a.s.a(n, b);
                    }
                    function b(b, c, n) {
                        var d;
                        if (2 == b.an || b.hasIframeListener)
                            d = !0;
                        if (d) {
                            d = c.e;
                            var e = b.ck;
                            e == a.r.a.f.a && 6 === d ? (f(b, 0), b.cl = a.a.bb(b), b.ck = a.r.a.f.b) : e == a.r.a.f.b ? 22 === d ? (h(b, c), f(b, n), b.cl = a.a.bb(b)) : 7 === d && (1000 < a.a.bb(b) - b.cl ? (clearTimeout(b.cm), c.e = 22, h(b, c), b.cn = 0, b.ck = a.r.a.f.a) : b.ck = a.r.a.f.c) : e == a.r.a.f.c && (6 == d ? (1000 < a.a.bb(b) - b.cl && (clearTimeout(b.cm), b.cn = 0, b.cl = a.a.bb(b), f(b, 0)), b.ck = a.r.a.f.b) : 22 == d && (h(b, c), b.ck = a.r.a.f.a, b.cn = 0));
                        }
                    }
                    function f(c, f) {
                        if (a.focus.checkFocus()) {
                            var n = 5 > c.cn ? 1000 : 2 * f, d = { e: 22 };
                            c.cm = a.l.f(function () {
                                b(c, d, n);
                            }, n);
                        } else
                            b(c, { e: 7 }, 0);
                    }
                    function h(b, c) {
                        c.q = b.aq[c.e]++;
                        c.m = a.a.bb(b);
                        b.cl = c.m;
                        a.s.a(b, c);
                        b.cn++;
                    }
                    function l(c, f, n) {
                        a.k.a.zaxs('mouseEvent', n);
                        a.k.a.zaxs('mouseEventOnAd', n);
                        a.r.d(c, n);
                        a.r.f(c, n);
                        a.r.g(c, n);
                        a.r.i(c, n);
                        a.r.h(c, n);
                        b(n, { e: 6 }, 0);
                    }
                    function x(c, f, n) {
                        a.k.a.zaxs('mouseEventOnAd', n);
                        a.r.d(c, n);
                        a.r.f(c, n);
                        a.r.g(c, n);
                        a.r.i(c, n);
                        a.r.h(c, n);
                        b(n, { e: 7 }, 0);
                    }
                    function r(b, c, n) {
                        a.k.a.zaxs('mouseEvent', n);
                        a.k.a.zaxs('mouseEventOnAd', n);
                        b = { e: 3 };
                        b.q = n.aq[3]++;
                        b.x = n.aj;
                        b.y = n.ak;
                        a.s.a(n, b);
                    }
                    function t(b, c) {
                        b.ai = u(b);
                        var n = { e: 1 };
                        n.q = b.aq[1]++;
                        n.x = b.ar.join('a');
                        n.y = b.as.join('a');
                        for (var f = a.a.bb(b), d = b.at, h = [], e = 0; e < d.length; e++)
                            isNaN(d[e]) || h.push(w.abs(d[e] - f));
                        n.c = h.join('a');
                        n.m = f;
                        a.s.a(b, n);
                        b.ar = [];
                        b.as = [];
                        b.at = [];
                    }
                    function u(b) {
                        return w.floor(a.a.bb(b) / 1000);
                    }
                    a.j = {};
                    a.j.c = function (b) {
                        if (a.c.dw) {
                            a.k.a.azsx('adKilled', a.j.d, {
                                once: !0,
                                condition: function (a) {
                                    return b.zr == a.zr;
                                }
                            });
                            b.mouseEventElements || (b.mouseEventElements = []);
                            var c = b.aa;
                            a.j.b(b, c);
                            b.mouseEventElements.push(c);
                        }
                    };
                    a.j.b = function (a, b) {
                        if (a) {
                            var c = b || a.aa;
                            c && g(c, a.zr);
                        }
                    };
                    a.j.a = function (a, b) {
                        if (a) {
                            var c = b || a.aa;
                            c && g(c, a.zr, 'remove');
                        }
                    };
                    a.j.e = function (b) {
                        for (var c in B)
                            B.hasOwnProperty(c) && (b = B[c]) && (a.r.g({ type: 'scooper' }, b), a.r.i({ type: 'scooper' }, b), a.r.h({ type: 'scooper' }, b), 1 < b.ar.length && b.ai !== u(b) && t(b, 'scooper'));
                    };
                    a.j.f = function (b, c) {
                        if (!c || !b || 'number' === typeof c[J])
                            return !1;
                        !b.hasIframeListener && c.tagName && 'iframe' === c.tagName.toLowerCase() && (b.hasIframeListener = !0);
                        !b.hasNonIframeListener && c.tagName && 'iframe' !== c.tagName.toLowerCase() && (b.hasNonIframeListener = !0, b.an = a.d.d(c));
                        c[J] = b.zr;
                        a.j.b(b, c);
                        b.mouseEventElements || (b.mouseEventElements = []);
                        b.mouseEventElements.push(c);
                        return b.proxyTrackingEnabled = !0;
                    };
                    a.j.d = function (b) {
                        a.a.forEach(b.mouseEventElements, function (c) {
                            try {
                                a.j.a(b, c), c[J] = null;
                            } catch (n) {
                            }
                        });
                    };
                }(v));
                (function (a) {
                    function k(b, c, n) {
                        return n ? new a.t.j(b.parentNode, c) : new a.t.j(b, c);
                    }
                    function g(a, b) {
                        if (!a)
                            return !1;
                        var n = 'number' == typeof a.zr, f, d;
                        n ? (f = a.aa, d = a._calcVideoBasedOnContainer) : f = a;
                        f = k(f, b, d);
                        d = f.height;
                        var h = f.width;
                        n && (a.AD_RECT = f);
                        n = f.calcArea();
                        if (0 === n)
                            return {
                                area: n,
                                visibleArea: 0,
                                percv: 0
                            };
                        var e = c(f), l = e.visibleRect.calcArea(), g = l / n, r;
                        a: {
                            var x = e.cumulRect, t = e.cumulRect.getViewportRect();
                            if (0 > x.top && 0 < x.bottom)
                                r = -x.top;
                            else if (0 <= x.top && x.top <= t.height)
                                r = 0;
                            else {
                                r = {
                                    yMin: -1,
                                    yMax: -1
                                };
                                break a;
                            }
                            if (0 <= x.bottom && x.bottom <= t.height)
                                x = x.height;
                            else if (x.bottom > t.height && x.top < t.height)
                                x = x.height - (x.bottom - t.height);
                            else {
                                r = {
                                    yMin: -1,
                                    yMax: -1
                                };
                                break a;
                            }
                            r = {
                                yMin: r,
                                yMax: x
                            };
                        }
                        return {
                            area: n,
                            visibleArea: l,
                            visibleRect: e.visibleRect,
                            cumulRect: e.cumulRect,
                            percv: g,
                            yMinMax: r,
                            elGeo: {
                                elHeight: d,
                                elWidth: h,
                                foldTop: e.cumulRect.top,
                                totalArea: e.parentArea
                            },
                            rect: f.rect
                        };
                    }
                    function e(a, b) {
                        for (var c = [], f = 0; f < b.length; f++)
                            c.push(a(b[f]));
                        return c;
                    }
                    function c(b) {
                        var c, n = [], f = a.a.dh(b.el, b.win, b && b.el && b.el._moatParentCount);
                        f && (n = e(function (b) {
                            return new a.t.j(b);
                        }, f));
                        n.unshift(b);
                        f = n.length;
                        b = new a.t.j(b.el, a.c.e);
                        for (var d = 0; d < f; d++) {
                            var h = n[d];
                            0 === d ? c = h : (c.changeReferenceFrame(h), b.changeReferenceFrame(h));
                            h = h.getViewportRect(d < f - 1 ? n[d + 1] : !1);
                            c = a.t.m(c, h);
                        }
                        return {
                            visibleRect: c,
                            cumulRect: b,
                            parentArea: n[n.length - 1].calcArea()
                        };
                    }
                    function d(a, b, c, f) {
                        a = w.max(a, c);
                        b = w.min(b, f);
                        return b > a ? [
                            a,
                            b
                        ] : [
                            0,
                            0
                        ];
                    }
                    function b(b) {
                        function c(a, b) {
                            return {
                                top: w.max(a.top, b.top),
                                right: w.max(a.right, b.right),
                                bottom: w.min(a.bottom, b.bottom),
                                left: w.min(a.left, b.left)
                            };
                        }
                        var n, f, d;
                        n = [];
                        f = [];
                        if (!a.a.f(b) || 0 === b.length)
                            return !1;
                        a.a.forEach(b, function (a) {
                            a.cumulRect && a.visibleRect && (f.push(a.cumulRect), n.push(a.visibleRect));
                        });
                        b = a.a.reduce(f, c);
                        d = a.a.reduce(n, c);
                        return {
                            elRect: b,
                            visibleRect: d
                        };
                    }
                    function f(b) {
                        return b && b.nodeName && 'map' === b.nodeName.toLowerCase() ? !0 : (b = a.a.cb(b)) && (1 >= b.width || 1 >= b.height) ? !0 : !1;
                    }
                    function h(b) {
                        return b ? 0 === a.a.df({ aa: b }, !0, !0) ? !0 : 0 === a.a.de(b, !0) : !1;
                    }
                    function l(b, c, n, d, e) {
                        function l(a) {
                            return (a = a.cumulRect) ? 100 <= a.width && 50 <= a.height : !1;
                        }
                        var r = {
                                IFRAME: !0,
                                VIDEO: !0,
                                OBJECT: !0,
                                EMBED: !0,
                                IMG: !0
                            }, x = g(b);
                        if (h(b) || !l(x))
                            return !1;
                        var k = [], t = B[e];
                        n.elementsFromPoint && !t.elementsFromPointCache ? (c = n.elementsFromPoint(c.m[0], c.m[1]) || [], t.elementsFromPointCache = c, k = k.concat(Array.prototype.slice.call(c))) : (c = a.a.cy(c.m[0], c.m[1], n), t.elementsFromPointCache && (k = k.concat(Array.prototype.slice.call(t.elementsFromPointCache))), c && (k = [c].concat(k)));
                        t = k.indexOf(b);
                        if (-1 == t)
                            return !1;
                        k = k.slice(0, t);
                        for (t = 0; t < k.length; t++)
                            if ((n = (c = k[t]) && c !== d && c[J] !== e && r[c.nodeName] && !a.a.cs(c, b) && !a.a.cs(b, c) && !f(c) && !h(c)) && (c = g(c)) && l(c) && x && c && 0.5 <= a.t.q(x.cumulRect, c.cumulRect))
                                return !0;
                        return !1;
                    }
                    function x(a) {
                        var b = 0.01 * a.width, c = 0.01 * a.height;
                        return {
                            tl: [
                                a.left + b,
                                a.top + c
                            ],
                            m: [
                                a.left + (a.right - a.left) / 2,
                                a.top + (a.bottom - a.top) / 2
                            ],
                            br: [
                                a.right - b,
                                a.bottom - c
                            ]
                        };
                    }
                    function r(b, f) {
                        var n = [], d = a.g.h(b);
                        d && (n = e(function (n) {
                            var f = c(new a.t.j(b)).visibleRect;
                            new a.t.j(n);
                            return {
                                rect: f,
                                frame: n,
                                doc: n.ownerDocument
                            };
                        }, d));
                        n.unshift({
                            rect: c(new a.t.j(b)).visibleRect,
                            frame: b,
                            doc: b.ownerDocument
                        });
                        for (d = 0; d < n.length; d++) {
                            var h = x(n[d].rect), g = !1;
                            if (0 != h.tl[0] || 0 != h.tl[1] || 0 != h.br[0] || 0 != h.br[1])
                                g = !0;
                            if (g && l(b, h, n[d].doc, n[d].frame, f))
                                return !0;
                        }
                        return !1;
                    }
                    a.t = {};
                    var t = a.c.c, u = {};
                    a.t.a = 0.5;
                    a.t.b = 0.3;
                    a.t.c = 0.98;
                    a.t.d = void 0;
                    a.t.e = function (b, c) {
                        c = c || !1;
                        return function (n, f) {
                            var d = n.ao.skin ? a.t.f(n, f) : g(n, f);
                            d.isVisible = c ? d.percv > b : d.percv >= b;
                            d.elGeo && (d.elGeo.threshold = b);
                            return d;
                        };
                    };
                    a.t.f = function (c, f) {
                        function n() {
                            if (c.isMultipartAd && c.multipartComponents && 0 < c.multipartComponents.length) {
                                for (var a, b = 0, n = 0; n < c.multipartComponents.length; n++) {
                                    var d = g(c.multipartComponents[n], f);
                                    d.visibleArea >= b && (b = d.visibleArea, a = c.multipartComponents[n]);
                                }
                                return g(a, f);
                            }
                        }
                        function d() {
                            if (c.isCompositeAd && c.components && 1 < c.components.length) {
                                for (var n = {
                                            area: 0,
                                            visibleArea: 0,
                                            percv: 0,
                                            visibleRect: !1,
                                            cumulRect: !1,
                                            yMinMax: !1,
                                            elGeo: !1,
                                            rect: !1,
                                            componentResults: []
                                        }, h, e = 0; e < c.components.length; e++)
                                    h = g(c.components[e], f), n.area += h.area, n.visibleArea += h.visibleArea, n.componentResults.push(h);
                                n.percv = n.visibleArea / n.area;
                                c.compositeAdAreaPx = n.area;
                                (h = b(n.componentResults)) && 'strict' === a.u.a(c.zr) && a.k.a.zaxs('rectsAvailable', c.zr, h.elRect, h.visibleRect);
                            } else
                                n = g(c, f);
                            return n;
                        }
                        c.viewabilityMethod.strict || (c.viewabilityMethod.strict = 1);
                        var h = c.isMultipartAd ? n(c, f) : c.isCompositeAd ? d(c, f) : g(c, f);
                        'strict' === a.u.a(c.zr) && a.c.c && !a.c.ce() && a.k.a.zaxs('rectsAvailable', c.zr, h.cumulRect, h.visibleRect);
                        var e = a.t.g(h, c), l = a.t.c;
                        h.isVisible = h.percv >= e;
                        h.isFullyVisible = h.percv >= l;
                        h.elGeo && (h.elGeo.threshold = e);
                        c.videoIsFullscreen && 0 < h.percv && (h.isVisible = !0);
                        0.8 <= h.percv && (h.isDentsuVisible = !0);
                        a.t.d ? h.percv > a.t.d && (a.t.d = h.percv) : a.t.d = h.percv;
                        c.AD_RECT = h && h.rect;
                        return h;
                    };
                    a.t.g = function (b, c) {
                        return a.v.a(b.area) ? (c.viewstats || (c.viewstats = {}), c.viewstats.isBigAd = !0, a.t.b) : a.t.a;
                    };
                    a.t.h = function () {
                        return t;
                    };
                    a.t.i = g;
                    a.t.k = k;
                    a.t.l = a.c.r;
                    a.t.j = function (b, c, n, f) {
                        try {
                            this.rect = n || b.getBoundingClientRect && b.getBoundingClientRect() || {};
                        } catch (d) {
                            this.rect = n || b && {
                                top: b.offsetTop,
                                left: b.offsetLeft,
                                width: b.offsetWidth,
                                height: b.offsetHeight,
                                bottom: b.offsetTop + b.offsetHeight,
                                right: b.offsetLeft + b.offsetWidth
                            } || {};
                        }
                        n = 'left right top bottom width height'.split(' ');
                        for (f = 0; f < n.length; f++) {
                            var h = n[f];
                            this[h] = this.rect[h];
                        }
                        b && b.CLIPCHECKINGTARGET && b.CLIPCHECKINGTARGET.style && 'absolute' === b.CLIPCHECKINGTARGET.style.position && (n = a.a.cu(b.CLIPCHECKINGTARGET.style.clip)) && (this.right = this.left + n.right, this.left += n.left, this.bottom = this.top + n.bottom, this.top += n.top);
                        this.width = this.right - this.left;
                        this.height = this.bottom - this.top;
                        this.el = b;
                        this.win = c || b && a.a.be(b);
                        this.changeReferenceFrame = function (a) {
                            this.left += a.left;
                            this.right += a.left;
                            this.top += a.top;
                            this.bottom += a.top;
                        };
                        this.calcArea = function () {
                            return (this.right - this.left) * (this.bottom - this.top);
                        };
                        this.getViewportRect = function (b) {
                            var c = a.c.r(this.win);
                            b && (b.width < c.width && (c.width = b.width, c.right = c.left + c.width), b.height < c.height && (c.height = b.height, c.bottom = c.top + c.height));
                            return c;
                        };
                    };
                    a.t.n = function (a, b, c) {
                        return 'undefined' === typeof a ? !1 : {
                            left: Number(b) + Number(a.left),
                            right: Number(b) + Number(a.right),
                            top: Number(c) + Number(a.top),
                            bottom: Number(c) + Number(a.bottom)
                        };
                    };
                    a.t.m = function (b, c) {
                        if ('undefined' === typeof b || 'undefined' === typeof c)
                            return !1;
                        var n = d(b.left, b.right, c.left, c.right), f = d(b.top, b.bottom, c.top, c.bottom);
                        return new a.t.j(void 0, void 0, {
                            left: n[0],
                            right: n[1],
                            top: f[0],
                            bottom: f[1]
                        });
                    };
                    a.t.o = function (b, c, n, f) {
                        if (!b || !c || !n)
                            return !1;
                        b = a.t.i(b);
                        if (!b)
                            return !1;
                        n = f || a.t.m(c, n);
                        if (!n)
                            return !1;
                        f = a.t.n(b.visibleRect, c.left, c.top);
                        return f ? (n = a.t.m(f, n)) ? {
                            elementRect: a.t.n(b.cumulRect, c.left, c.top),
                            visibleRect: n,
                            area: b.area,
                            calcVisiblePercv: function () {
                                return (this.visibleRect.right - this.visibleRect.left) * (this.visibleRect.bottom - this.visibleRect.top) / this.area;
                            }
                        } : !1 : !1;
                    };
                    a.t.p = function (a, b) {
                        b || (b = window);
                        try {
                            var c = b.document.documentElement, f = b.document.body;
                            return 'left' === a ? b.pageXOffset || c && c.scrollLeft || f && f.scrollLeft : b.pageYOffset || c && c.scrollTop || f && f.scrollTop;
                        } catch (d) {
                            return !1;
                        }
                    };
                    a.t.i = g;
                    a.t.r = function (b) {
                        var f = b.aa;
                        b = b.zr;
                        if (f) {
                            if (a.c.q)
                                f = r(f, b);
                            else
                                var n = c(new a.t.j(f)).visibleRect, n = x(n), f = l(f, n, a.c.e.document, null, b);
                            return f;
                        }
                    };
                    a.t.s = function (a) {
                        return a ? (a.right - a.left) * (a.bottom - a.top) : !1;
                    };
                    a.t.t = function (b) {
                        function c(b) {
                            return a.a.dc(b) || 'string' === typeof b;
                        }
                        return 'object' === typeof b && c(b.left) && c(b.right) && c(b.top) && c(b.bottom) ? !0 : !1;
                    };
                    a.t.q = function (b, c) {
                        if (!a.t.t(b) || !a.t.t(c))
                            return !1;
                        var f = a.t.m(b, c);
                        if (!f)
                            return !1;
                        var d = a.t.s(b);
                        return f.calcArea() / d;
                    };
                    a.k.a.azsx('adKilled', function (a) {
                        a && !a.ep && delete u[a.zr];
                    });
                }(v));
                (function (a) {
                    function k(a) {
                        var c = 0, d;
                        return function () {
                            var e = new z().getTime();
                            150 < e - c && (d = a.apply(this, arguments), c = e);
                            return d;
                        };
                    }
                    function g(b) {
                        function c(a) {
                            'undefined' !== typeof b.overrideViewMethod && (a.viewabilityMethod[u] = b.overrideViewMethod);
                            return n(a);
                        }
                        var d = b.isVisibleFn, l = b.isMeasurableFn, g = b.pauseCheckingFn, r = b.careFoc, k = b.qsKeys, u = b.counterLabel, m = u;
                        a.c.am();
                        var p = [], n = d, I = 0, K = 0, F = 0, y = 0, H = 0, D = 0, O = 0, E = 0;
                        new z().getTime();
                        var A = !1, q = !1, v = !1, na = !1, ua, ba, B, Ca, ja = 0, C = 0, G = !1, J = !1, va = 0, M = 0, N = 0, P = !1, Ia = !1, ca = !1, R = a.c.c, ka, wa;
                        if (0 === k)
                            var V = 'as', W = 'ag', L = 'an', X = 'ck', da = 'kw', S = 'ah', ea = 'aj', T = 'pg', U = 'pf', fa = 'gi', Y = 'gf', Z = 'ix', ga = 'gg', aa = 'ez', G = !0;
                        else
                            1 === k ? (V = 'cc', W = 'bw', L = 'bx', X = 'ci', da = 'jz', S = 'bu', ea = 'dj') : 2 === k ? (V = 'cg', W = 'ce', L = 'cf', X = 'cj', da = 'ts', S = 'ah', ea = 'dk', fa = 'gj', Y = 'gb', Z = 'ig', ga = 'ge', aa = 'ez') : 3 === k ? (V = 'cg', W = 'ce', L = 'cf', X = 'cj', da = 'ts', S = 'ah', ea = 'dk', fa = 'gi', Y = 'gf', Z = 'ix', ga = 'gg', aa = 'ez') : 5 === k ? (V = 'aa', W = 'ad', L = 'cn', X = 'co', da = 'cp', S = 'ah', ea = 'cq', fa = 'gn', Y = 'gk', Z = 'ik', ga = 'gl', aa = 'ez') : 6 === ('number' === typeof k ? k : k.type) && (V = k.otsKey, W = k.ivtKey, L = k.lastivtKey, X = k.ivtAtOtsKey, da = k.timeToViewSendKey, S = k.timeToViewAskKey, ea = k.visOnLoadKey, fa = k.fullyIvtOtsKey, Y = k.fullyIvtKey, Z = k.maxfullyIvtKey, ga = k.lastFullyIvtKey, aa = k.wasPartiallyInviewKey);
                        this.getLabel = function () {
                            return m;
                        };
                        this.addListener = function (b) {
                            var c = !1;
                            a.a.forEach(p, function (a) {
                                if (a === b)
                                    return c = !0, !1;
                            });
                            c || p.push(b);
                        };
                        this.removeListener = function (a) {
                            for (var b, c = p.length; b < c; b++) {
                                var f = !1, n = !1, d;
                                for (d in p[b])
                                    if (n || (n = !0), p[b][d] !== a[d]) {
                                        f = !0;
                                        break;
                                    }
                                n && !f && p.splice(b, 1);
                            }
                        };
                        this.hadOTS = function () {
                            return v;
                        };
                        this.hadFullOTS = function () {
                            return na;
                        };
                        this.hadFIT = function () {
                            return 0 < K;
                        };
                        this.hadVideo2SecOTS = function () {
                            return 'undefined' != typeof _hadVideo2SecOts && _hadVideo2SecOts;
                        };
                        this.hadDentsuVideoOTS = function () {
                            return !1;
                        };
                        this.hadDentsuDisplayOTS = function () {
                            return P;
                        };
                        this.getInViewTime = function () {
                            return I;
                        };
                        this.getFullyInViewThreshold = function () {
                            return 0.98;
                        };
                        this.getLastInviewPercent = function () {
                            return va;
                        };
                        this.getLastInviewPercentWithThresholdCap = function () {
                            return 0.98 <= va ? 1 : va;
                        };
                        this.getCareAboutFocus = function () {
                            return r;
                        };
                        this.getPauseCheckingFn = function () {
                            return g;
                        };
                        this.visible = function () {
                            return A;
                        };
                        this.fullyVisible = function () {
                            return q;
                        };
                        this.wasPartiallyInview = function () {
                            return J;
                        };
                        this.getFullInviewTimeTotal = function () {
                            return K;
                        };
                        this.getMaximumContinuousInViewTime = function () {
                            return w.max(H, D);
                        };
                        this.getMaximumContinuousFullyInViewTime = function () {
                            return w.max(E, O);
                        };
                        this.getDentsuInViewTime = function () {
                            return M;
                        };
                        this.getDentsuAudibleAndVisibleTime = function () {
                            return 0;
                        };
                        this.isAdMeasurable = function (a) {
                            var b = 'function' === typeof l && l(a);
                            a && a.isMeasurabilityDisabled() && (b = !1);
                            return b;
                        };
                        this.adStartedOnScreen = function () {
                            return Ca;
                        };
                        this.update = function (b, n, d) {
                            if (wa === d)
                                return !1;
                            wa = d;
                            d = 'function' === typeof l && l(b);
                            b && b.isMeasurabilityDisabled() && (d = !1);
                            if (!d)
                                return !1;
                            var h = I || 0, y = K || 0;
                            d = !1;
                            var F = c(b);
                            F.rect && (b.elementRect = F.rect, b.currentWidth = b.elementRect.right - b.elementRect.left, b.currentHeight = b.elementRect.bottom - b.elementRect.top);
                            b.viewabilityPercent[m] = a.a.dc(F.percv) ? w.round(100 * F.percv) : '-';
                            'number' === typeof F.area && (b.ADAREA = F.area);
                            var u = F.isVisible, z = F.isFullyVisible, C = F.isDentsuVisible, L = F.percv && 0 < F.percv;
                            va = F.percv;
                            !h && F.percv && a.k.a.zaxs('adEntersView', b);
                            var Q = g(b), Q = (!r || a.x.e(b)) && !Q;
                            a.k.a.zaxs('adCheckingState', b, m, Q);
                            u = u && Q;
                            z = z && Q;
                            L = L && Q;
                            z && a.k.a.zaxs('adFullyVisible', b, m);
                            ca = C && Q;
                            !J && L && (J = !0);
                            if (u && A)
                                I += n, H += n;
                            else if (u || A)
                                C = w.round(n / 2), I += C, H += C;
                            if (z && q)
                                K += n, O += n;
                            else if (z || q)
                                C = w.round(n / 2), K += C, O += C;
                            if (ca && Ia)
                                M += n, N += n;
                            else if (ca || Ia)
                                C = w.round(n / 2), M += C, N += C;
                            !v && 1000 <= H && (d = v = !0, this.timeToView = ua = b.counters.query()[S], ba = I);
                            !na && 1000 <= O && (na = !0, a.k.a.zaxs('fullOtsReached', b, m));
                            'undefined' === typeof B && (C = b.counters.query().bu, 1000 >= C ? u && (B = !0) : B = !1);
                            'undefined' === typeof Ca && (C = b.counters.query().bu, 1000 >= C ? L && (Ca = !0) : Ca = !1);
                            (b.el = R) && 'undefined' === typeof ka && 2 !== k && 3 !== k && F.elGeo && (C = e().y + F.elGeo.foldTop, Q = F.elGeo.threshold * F.elGeo.elHeight, C = C > a.u.b() - Q, 0 < F.elGeo.totalArea && (ka = C, b.dn = ka));
                            G && L && (ja = w.min(w.max(va, ja), 1));
                            D < H && (D = H);
                            E < O && (E = O);
                            u || (H = 0);
                            z || (O = 0);
                            A = u;
                            q = z;
                            1000 <= N && (P = !0);
                            ca || (N = 0);
                            Ia = ca;
                            a.a.forEach(p, function (a) {
                                var b = F && F.percv, b = 'number' === typeof b && 100 * b;
                                if (a.onInViewTimeCount)
                                    a.onInViewTimeCount(n, I - h, b, m);
                                if (a.onFullyInViewTimeCount) {
                                    var c = w.max(K - y, 0);
                                    a.onFullyInViewTimeCount(n, c, b, m);
                                }
                            });
                            return d;
                        };
                        this.getQS = function (a, b, c) {
                            F > I && (F = I);
                            y > K && (y = K);
                            a[V] = Number(v);
                            a[W] = I;
                            a[L] = F;
                            if (0 === k || 2 === k || 3 === k || 5 === k || ('number' === typeof k ? k : k.type))
                                na && fa && (a[fa] = 1), b = 0 === k && c && 'sframe' === c, Y && !b && (a[Y] = K, a[ga] = y, b = this.getMaximumContinuousFullyInViewTime(), a[Z] = b, m === c && (a.ic = b)), J && aa && (a[aa] = 1);
                            'undefined' !== typeof ba && (a[X] = ba);
                            'undefined' !== typeof ua && (a[da] = ua);
                            'undefined' !== typeof B && (a[ea] = Number(B));
                            !0 === G && (c = w.round(100 * ja), b = w.round(100 * C), a[T] = c, a[U] = b, C = ja);
                            'undefined' !== typeof ka && (a.ib = Number(ka));
                            F = I;
                            y = K;
                        };
                    }
                    function e() {
                        var b = a.c.e, c = b.document;
                        return { y: void 0 !== b.pageYOffset ? b.pageYOffset : (c.documentElement || c.body.parentNode || c.body).scrollTop };
                    }
                    a.u = {};
                    var c = {}, d = {};
                    a.u.b = function () {
                        return R ? a.c.r(a.c.e).height : 750;
                    };
                    a.u.c = function (b) {
                        var f = b.zr;
                        a.k.a.azsx('adKilled', a.u.d, {
                            once: !0,
                            condition: function (a) {
                                return a.zr == b.zr;
                            }
                        });
                        c[f] = c[f] || {};
                        b.viewstats = { isBigAd: !1 };
                        if (b && b.isMeasurabilityDisabled())
                            return !1;
                        if (a.c.dk() || a.c.am().isInApp && a.c.c) {
                            var h = k(a.t.f), e;
                            a.c.ce() || a.w && a.w.a() ? a.c.cx() || a.c.cw() && a.c.am() : e = new g({
                                isVisibleFn: h,
                                isMeasurableFn: a.c.dk,
                                pauseCheckingFn: a.x.a,
                                careFoc: !0,
                                qsKeys: 0,
                                counterLabel: 'strict'
                            });
                            e && (c[f].strict = e);
                            h = new g({
                                isVisibleFn: h,
                                isMeasurableFn: a.c.dk,
                                pauseCheckingFn: a.x.a,
                                careFoc: !1,
                                qsKeys: 1,
                                counterLabel: 'lax'
                            });
                            c[f].lax = h;
                        } else
                            !0 !== b.isSkin && a.m && a.m.a() && (h = new g({
                                isVisibleFn: a.m.b,
                                isMeasurableFn: a.c.dp,
                                pauseCheckingFn: a.x.a,
                                careFoc: !0,
                                qsKeys: 3,
                                counterLabel: 'pscope'
                            }), c[f].pscope = h);
                        a.o && a.o.b() && !c[f].pscope && (h = new g({
                            isVisibleFn: a.o.c,
                            isMeasurableFn: a.c.dq,
                            pauseCheckingFn: a.x.a,
                            careFoc: !0,
                            qsKeys: 2,
                            counterLabel: 'pscope'
                        }), c[f].pscope = h);
                        f = a.k.a.azsx('view:tick', a.a.dg([b], a.u.e), { priority: 5 });
                        d[b.zr] = f;
                        a.k.a.zaxs('viewCounterStarted', b);
                    };
                    a.u.f = function (b, c, d) {
                        return b && c && d ? (b = a.u.g(b.zr, c)) && 'function' == typeof b[d] && b[d]() : !1;
                    };
                    a.u.h = function (b, f) {
                        if (b && f) {
                            var d = a.c.eh(), e;
                            !f.sframe && d && (e = d.measurableFn, d = d.name, c[b.zr].sframe = new g({
                                isVisibleFn: a.y.a,
                                isMeasurableFn: e,
                                pauseCheckingFn: a.x.a,
                                viewabilityApiName: d,
                                careFoc: !0,
                                qsKeys: 5,
                                counterLabel: 'sframe'
                            }), a.k.a.zaxs('viewCounterStarted', b));
                        }
                    };
                    a.u.e = function (b, f, d) {
                        if (a.a.cr(b)) {
                            var e = c[b.zr], g;
                            a.u.h(b, e);
                            for (var k in e)
                                e.hasOwnProperty(k) && e[k].update(b, f, d) && (g = !0);
                            b.fireFullViewEvent = !1;
                            a.a.forEach(b.secondaryCounters, function (a) {
                                a.update(b, f, d);
                            });
                            b.fireFullViewEvent && (a.x.b(b), b.fireFullViewEvent = !1);
                            g && a.x.c(b);
                            a.v.b(b);
                            a.d.e(b) && a.x.d(b);
                        }
                    };
                    a.u.i = function (b, c) {
                        return a.u.j(b) >= c;
                    };
                    a.u.j = function (b) {
                        var c = 0;
                        (b = b && 'undefined' !== typeof b.zr && a.u && a.u.k(b.zr)) && (c = b.getInViewTime());
                        return c;
                    };
                    a.u.l = function () {
                        return 'hadOTS';
                    };
                    a.u.m = function (b, c) {
                        var d = a.u.l();
                        return b && b && 'undefined' != typeof b.zr ? c ? a.u.f(b, c, d) : a.u.f(b, a.u.a(b.zr), d) : null;
                    };
                    a.u.n = function (b, c) {
                        var d = a.u.o(b.zr);
                        return a.o && a.o.a && d && d.pscope && d.pscope[c ? 'hadVideo2SecOTS' : 'hadOTS']();
                    };
                    a.u.p = function (b, c) {
                        var d = a.u.o(b.zr);
                        return a.o && a.o.a && d && d.pscope && d.pscope[c ? 'hadDentsuVideoOTS' : 'hadDentsuDisplayOTS']();
                    };
                    a.u.q = function (b, c) {
                        var d = a.u && a.u.o(b.zr);
                        return a.o && a.o.a && d && d.pscope && d.pscope.getFullInviewTimeTotal() >= c;
                    };
                    a.u.r = function (b) {
                        var c = 0;
                        (b = b && 'undefined' !== typeof b.zr && a.u && a.u.k(b.zr)) && (c = b.getFullInviewTimeTotal());
                        return c;
                    };
                    a.u.s = function (b, c) {
                        return a.u.r(b) >= c;
                    };
                    a.u.d = function (b) {
                        delete c[b.zr];
                        d.hasOwnProperty(b.zr) && a.k.a.sxaz('view:tick', { id: d[b.zr] });
                    };
                    a.u.o = function (a) {
                        var f;
                        c[a] ? f = c[a] : c[a] = f = {};
                        return f;
                    };
                    a.u.g = function (b, c) {
                        var d = a.u.o(b);
                        return d && d[c];
                    };
                    a.u.t = function (b) {
                        var c, d, e;
                        if (!b || !b.strict)
                            return !1;
                        b = a.c.am().isInApp;
                        c = a.c.cq();
                        d = a.c.cv();
                        e = a.c.ct();
                        c = c && a.c.c || d;
                        return b && c || !(b || e);
                    };
                    a.u.a = function () {
                        var b;
                        return function (f, d) {
                            var e = null, g = c[f];
                            a.u.t(g) ? e = 'strict' : g && g.sframe ? e = 'sframe' : g && g.pscope && (e = 'pscope');
                            (g = 'undefined' !== typeof B && B[f]) && g.isMeasurabilityDisabled() && (e = null);
                            a.d.c() && !d && (e = null);
                            b != e && (b = e, a.k.a.esgf('preferredViewCounterUpdate', B[f]));
                            return e;
                        };
                    }();
                    a.u.k = function (b, f) {
                        var d = 'undefined' !== typeof B && B[b];
                        if (!d || !d.isMeasurabilityDisabled()) {
                            var d = a.u.a(b, f), e = c[b];
                            if (!a.d.c() || f)
                                return e && d && e[d];
                        }
                    };
                    a.u.u = function (b, f) {
                        var d = {}, e = c[b], g = a.u.a(b), k;
                        for (k in e)
                            e.hasOwnProperty(k) && e[k].getQS(d, f, g);
                        a.v.c(b, d);
                        a.z.a(b, d);
                        a.u.k(b) && a.u.k(b).hadDentsuDisplayOTS() && (d.nb = 1);
                        (e = B[b]) && e.viewstats && e.viewstats.isBigAd && (d.el = 1);
                        return d;
                    };
                }(v));
                (function (a) {
                    a.aa = {};
                    a.aa.a = function (a, g) {
                        var e;
                        g.outerHTML ? e = g.outerHTML : (e = document.createElement('div'), e.appendChild(g.cloneNode(!0)), e = e.innerHTML);
                        e = [
                            /flashvars\s*=\s*(".*?"|'.*?')/i.exec(e),
                            /name\s*=\s*["']flashvars["']\s*value\s*=\s*(".*?"|'.*?')/i.exec(e),
                            /value\s*=\s*(".*?"|'.*?')\s*name\s*=\s*["']flashvars["']/i.exec(e),
                            a
                        ];
                        for (var c, d, b = {}, f = 0; f < e.length; f++) {
                            if ((c = e[f]) && 'object' === typeof c && c[1])
                                c = c[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/^"/g, '').replace(/"$/g, '').replace(/^'/g, '').replace(/'$/g, '');
                            else if ('string' === typeof c)
                                c = c.split('?')[1];
                            else
                                continue;
                            if (c) {
                                c = c.split('&');
                                for (var h = 0; h < c.length; h++)
                                    d = c[h].split('='), 2 > d.length || 'function' == d[0].slice(0, 8) || (b[d[0]] = [d[1]]);
                            }
                        }
                        return b;
                    };
                }(v));
                (function (a) {
                    function k(a) {
                        return a = w.min(300000, a);
                    }
                    function g(b, c) {
                        var f = B[b];
                        return function () {
                            var b = a.ab.k(f, [[
                                    'https://redventuresgamdisplay60805146916.s.moatpixel.com/pixel.gif?',
                                    !1,
                                    'V2'
                                ]]);
                            b && a.ab.q(f, b, c, !0, !0);
                        };
                    }
                    function e(b, c, f, d) {
                        r.hasOwnProperty(b) ? r[b][c] && a.a.f(r[b][c]) ? r[b][c].push(f) : r[b][c] = [f] : (r[b] = {}, r[b][c] = [f]);
                    }
                    function c(b, c, f) {
                        if (!b)
                            return function () {
                            };
                        f || (f = t.TPP);
                        return function (d) {
                            if (c) {
                                var e = {};
                                e[a.f.g.a] = !0;
                                e[a.f.g.b] = f;
                                a.f.h(b, e, d.zr);
                            } else
                                (pixelWasFired = a.f.i(b)) && a.ab.a.a(d.zr, f);
                        };
                    }
                    function d(a) {
                        return 500 <= (2 === a.an ? a.be : a.bd);
                    }
                    function b(b, c) {
                        try {
                            return a.ab.d(b) >= c;
                        } catch (f) {
                            return !1;
                        }
                    }
                    function f(a, b) {
                        try {
                            return a.counters.laxDwell.tCur >= b;
                        } catch (c) {
                            return !1;
                        }
                    }
                    function h(a, b) {
                        return d(a) ? x(a) >= b : !1;
                    }
                    function l(b, c) {
                        try {
                            var f;
                            if (a.c.c && b.activetime) {
                                var d = a.u.a(b.zr), e = a.ad.a(b.activetime.counters, d);
                                f = e && e.get('activeInviewTime');
                            } else
                                f = !1;
                            return f >= c;
                        } catch (h) {
                            return !1;
                        }
                    }
                    function x(a) {
                        return 'undefined' !== typeof a.bk && d(a) ? k(a.bk) : 0;
                    }
                    a.ab = {};
                    var r = {};
                    a.ab.a = {};
                    var t = {
                        TPP: 'TPP',
                        LLD: 'LLD',
                        OneTag: 'OneTag',
                        Nielsen: 'Nielsen',
                        WhiteOps: 'WhiteOps',
                        DSP: 'DSP'
                    };
                    (function () {
                        var b = {
                            OneTagEnabled: !1,
                            TPPFired: {},
                            LLDFired: {},
                            OneTagFired: {},
                            LLDEnabled: !0
                        };
                        a.ab.a.a = function (a, c) {
                            keyName = c + 'Fired';
                            b[keyName] && (++b[keyName][a] || (b[keyName][a] = 1));
                        };
                        a.ab.a.b = function (a) {
                            return null == a ? {
                                OneTag: b.OneTagEnabled && -1,
                                LLD: b.LLDEnabled && -1,
                                TPP: -1
                            } : {
                                OneTag: b.OneTagEnabled && (b.OneTagFired[a] || -1),
                                LLD: b.LLDEnabled && (b.LLDFired[a] || -1),
                                TPP: b.TPPFired[a] || -1
                            };
                        };
                    }());
                    var u = function (a) {
                            return !!a.el && a.dn;
                        }, m = function (a) {
                            return !!a.el && !a.dn;
                        };
                    (function () {
                        var b = 0;
                        return function () {
                            var c = a.c.e, f = c.document, d = f.body, c = (d.scrollTop || f.documentElement.scrollTop || c.pageYOffset || 0) / d.offsetHeight;
                            c > b && (b = c);
                            return b;
                        };
                    }());
                    var p = {
                        load: function (a) {
                            return a && a.video && !a.video.started ? !1 : !0;
                        },
                        adimpression: function (a) {
                            return !1;
                        },
                        measurable: function (b) {
                            return b && b.video && !b.video.started ? !1 : a.c.ds(b);
                        },
                        'full-measurable': function (b) {
                            return b && b.video && !b.video.started ? !1 : a.c.du(b);
                        },
                        'full-inViewX': function (b, c) {
                            return a.u.s(b, c);
                        },
                        'full-inView': function (b) {
                            return a.u.s(b, 1);
                        },
                        'full-inView2': function (b) {
                            return a.u.s(b, 2000);
                        },
                        nhtReady: function (b) {
                            return b && b.video && !b.video.started ? !1 : a && a.f && a.f.e;
                        },
                        brandSafeReady: function (a) {
                            return a && a.video && !a.video.started ? !1 : q && q.jsonp && q.jsonp.BrandSafetyNados;
                        },
                        customInView: function (a) {
                            return 'Feature Not Enabled';
                        },
                        inViewX: function (b, c) {
                            return a.u.i(b, c);
                        },
                        inView100: function (b) {
                            return a.u.i(b, 100000);
                        },
                        inView60: function (b) {
                            return a.u.i(b, 60000);
                        },
                        inView45: function (b) {
                            return a.u.i(b, 45000);
                        },
                        inView40: function (b) {
                            return a.u.i(b, 40000);
                        },
                        inView35: function (b) {
                            return a.u.i(b, 35000);
                        },
                        inView30: function (b) {
                            return a.u.i(b, 30000);
                        },
                        inView25: function (b) {
                            return a.u.i(b, 25000);
                        },
                        inView20: function (b) {
                            return a.u.i(b, 20000);
                        },
                        inView15: function (b) {
                            return a.u.i(b, 15000);
                        },
                        inView10: function (b) {
                            return a.u.i(b, 10000);
                        },
                        inView9: function (b) {
                            return a.u.i(b, 9000);
                        },
                        inView8: function (b) {
                            return a.u.i(b, 8000);
                        },
                        inView7: function (b) {
                            return a.u.i(b, 7000);
                        },
                        inView6: function (b) {
                            return a.u.i(b, 6000);
                        },
                        inView5: function (b) {
                            return a.u.i(b, 5000);
                        },
                        inView4: function (b) {
                            return a.u.i(b, 4000);
                        },
                        inView3: function (b) {
                            return a.u.i(b, 3000);
                        },
                        inView2: function (b) {
                            return a.u.i(b, 2000);
                        },
                        inView1: function (b) {
                            return a.u.i(b, 1000);
                        },
                        inView05: function (b) {
                            return a.u.i(b, 500);
                        },
                        anyPercentVisible: function (b) {
                            return (b = b && a.u.k(b.zr)) && b.wasPartiallyInview();
                        },
                        activeInViewTimeX: function (a, b) {
                            return l(a, b);
                        },
                        activeInViewTime05: function (a) {
                            return l(a, 500);
                        },
                        activeInViewTime1: function (a) {
                            return l(a, 1000);
                        },
                        activeInViewTime2: function (a) {
                            return l(a, 2000);
                        },
                        activeInViewTime3: function (a) {
                            return l(a, 3000);
                        },
                        activeInViewTime4: function (a) {
                            return l(a, 4000);
                        },
                        activeInViewTime5: function (a) {
                            return l(a, 5000);
                        },
                        activeInViewTime6: function (a) {
                            return l(a, 6000);
                        },
                        activeInViewTime7: function (a) {
                            return l(a, 7000);
                        },
                        activeInViewTime8: function (a) {
                            return l(a, 8000);
                        },
                        activeInViewTime10: function (a) {
                            return l(a, 10000);
                        },
                        activeInViewTime15: function (a) {
                            return l(a, 15000);
                        },
                        activeInViewTime20: function (a) {
                            return l(a, 20000);
                        },
                        activeInViewTime25: function (a) {
                            return l(a, 25000);
                        },
                        activeInViewTime30: function (a) {
                            return l(a, 30000);
                        },
                        activeInViewTime60: function (a) {
                            return l(a, 60000);
                        },
                        activeInViewTime90: function (a) {
                            return l(a, 90000);
                        },
                        activeInViewTime120: function (a) {
                            return l(a, 120000);
                        },
                        activeInViewTime180: function (a) {
                            return l(a, 180000);
                        },
                        activeInViewTime240: function (a) {
                            return l(a, 240000);
                        },
                        activeInViewTime300: function (a) {
                            return l(a, 300000);
                        },
                        fullInView05: function (b) {
                            return a.u.s(b, 500);
                        },
                        fullInView1: function (b) {
                            return a.u.s(b, 1000);
                        },
                        fullInView2: function (b) {
                            return a.u.s(b, 2000);
                        },
                        fullInView3: function (b) {
                            return a.u.s(b, 3000);
                        },
                        fullInView15: function (b) {
                            return a.u.s(b, 15000);
                        },
                        full_inview_05: function (b) {
                            return 600 <= b.INITIAL_HEIGHT && a.u.s(b, 500);
                        },
                        full_inview_1: function (b) {
                            return 600 <= b.INITIAL_HEIGHT && a.u.s(b, 1000);
                        },
                        full_inview_5: function (b) {
                            return 600 <= b.INITIAL_HEIGHT && a.u.s(b, 5000);
                        },
                        full_inview_10: function (b) {
                            return 600 <= b.INITIAL_HEIGHT && a.u.s(b, 10000);
                        },
                        passthrough: function (b) {
                            return a.v.d(b.zr);
                        },
                        groupmV3: function (a) {
                            return a.groupmV3.checkMilestoneReached();
                        },
                        fullViewInteraction: function (a) {
                            return this.interactionX(a, 1000) && this.full_inview_1(a);
                        },
                        inner_height_X: function (b, c) {
                            return a.c.z >= c;
                        },
                        inner_height_1000: function (b) {
                            return 1000 <= a.c.z;
                        },
                        inner_height_1200: function (b) {
                            return 1200 <= a.c.z;
                        },
                        inner_height_1300: function (b) {
                            return 1300 <= a.c.z;
                        },
                        inner_height_1400: function (b) {
                            return 1400 <= a.c.z;
                        },
                        inner_height_1000_1400: function (b) {
                            return 1000 <= a.c.z && 1400 >= a.c.z;
                        },
                        inner_height_1100_1400: function (b) {
                            return 1100 <= a.c.z && 1400 >= a.c.z;
                        },
                        audibleFullVisibleHalfDuration: function (b) {
                            if (!(b && b.video && b.video.durationMeasurable))
                                return !1;
                            var c = 98 * b.ao.duration / 100, f = b && a.u.k(b.zr);
                            return (b = f && b.video && b.video.getCounter(f.getLabel())) && b.get('groupmAudibleFullyVisIvt') >= 0.5 * c;
                        },
                        groupmAudVisHumanCap15: function (b) {
                            if (!(a && a.f && a.f.e && b && b.video && b.ao))
                                return !1;
                            var c = !1;
                            'number' == typeof b.ao.duration && !isNaN(b.ao.duration) && 0 < b.ao.duration && (c = w.min(15000, 0.5 * b.ao.duration));
                            var f = b && a.u.k(b.zr), f = f && b.video.getCounter(f.getLabel());
                            b = a.f.f(b.zr);
                            return c && f && f.get('groupmAudibleFullyVisIvt') > c && b;
                        },
                        scroll_measurable: function (b) {
                            return a.c.c;
                        },
                        scroll: function (a) {
                            return 'undefined' !== typeof q.z;
                        },
                        scrollfirstX: function (a, b) {
                            return q.z > b;
                        },
                        scrollfirst1: function (a) {
                            return 1000 < q.z;
                        },
                        scrollfirst2: function (a) {
                            return 2000 < q.z;
                        },
                        scrollfirst2btf: function (a) {
                            return 2000 < q.z && u(a);
                        },
                        scrollfirst3: function (a) {
                            return 3000 < q.z;
                        },
                        scrollfirst5: function (a) {
                            return 5000 < q.z;
                        },
                        scroll_interaction: function (a) {
                            return this.scroll(a) && this.interaction(a);
                        },
                        hover: function (a) {
                            return a.dm;
                        },
                        mobileTouch: function (b) {
                            return a.c.da && b.dm;
                        },
                        laxOts: function (b) {
                            return a.u.m(b, 'lax');
                        },
                        strictOts: function (b) {
                            return a.u.m(b);
                        },
                        everOutOfFocus: function (b) {
                            return !a.focus.pageIsVisible();
                        },
                        interaction_measurable: function (b) {
                            return !a.a.l() || d(b);
                        },
                        interaction: function (a) {
                            return d(a);
                        },
                        btf: function (a) {
                            return u(a);
                        },
                        btf_strictOts: function (a) {
                            return this.strictOts(a) && u(a);
                        },
                        btf_interaction: function (a) {
                            return d(a) && u(a);
                        },
                        btf_inViewX: function (b, c) {
                            return a.u.i(b, c) && u(b);
                        },
                        btf_inView5: function (b) {
                            return a.u.i(b, 5000) && u(b);
                        },
                        btf_inView15: function (b) {
                            return a.u.i(b, 15000) && u(b);
                        },
                        atf: function (a) {
                            return m(a);
                        },
                        atf_inViewX: function (b, c) {
                            return a.u.i(b, c) && m(b);
                        },
                        atf_970_728_inview20: function (b) {
                            return (970 == b.INITIAL_WIDTH || 728 == b.INITIAL_WIDTH) && m(b) && a.u.i(b, 20000);
                        },
                        atf_300x250_inview20: function (b) {
                            return 300 == b.INITIAL_WIDTH && 250 == b.INITIAL_HEIGHT && m(b) && a.u.i(b, 20000);
                        },
                        atf_300x600_inview20: function (b) {
                            return 300 == b.INITIAL_WIDTH && 600 == b.INITIAL_HEIGHT && m(b) && a.u.i(b, 20000);
                        },
                        btf_300_inview20: function (b) {
                            return 300 == b.INITIAL_WIDTH && u(b) && a.u.i(b, 20000);
                        },
                        btf_300_inview30: function (b) {
                            return 300 == b.INITIAL_WIDTH && u(b) && a.u.i(b, 30000);
                        },
                        btf_300_inview40: function (b) {
                            return 300 == b.INITIAL_WIDTH && u(b) && a.u.i(b, 40000);
                        },
                        interactionX: function (a, b) {
                            return h(a, b);
                        },
                        interactionAny: function (a) {
                            return h(a, 10);
                        },
                        interaction05: function (a) {
                            return h(a, 500);
                        },
                        interaction1: function (a) {
                            return h(a, 1000);
                        },
                        interaction2: function (a) {
                            return h(a, 2000);
                        },
                        interaction3: function (a) {
                            return h(a, 3000);
                        },
                        interaction4: function (a) {
                            return h(a, 4000);
                        },
                        interaction5: function (a) {
                            return h(a, 5000);
                        },
                        interaction6: function (a) {
                            return h(a, 6000);
                        },
                        interaction7_2: function (a) {
                            return h(a, 7200);
                        },
                        interaction8: function (a) {
                            return h(a, 8000);
                        },
                        interaction10: function (a) {
                            return h(a, 10000);
                        },
                        interaction13: function (a) {
                            return h(a, 13000);
                        },
                        interaction15: function (a) {
                            return h(a, 15000);
                        },
                        interaction20: function (a) {
                            return h(a, 20000);
                        },
                        interaction30: function (a) {
                            return h(a, 30000);
                        },
                        interaction60: function (a) {
                            return h(a, 60000);
                        },
                        pageX: function (a, c) {
                            return b(a, c);
                        },
                        page1: function (a) {
                            return b(a, 1000);
                        },
                        page2: function (a) {
                            return b(a, 2000);
                        },
                        page3: function (a) {
                            return b(a, 3000);
                        },
                        page5: function (a) {
                            return b(a, 5000);
                        },
                        page7: function (a) {
                            return b(a, 7000);
                        },
                        page10: function (a) {
                            return b(a, 10000);
                        },
                        page15: function (a) {
                            return b(a, 15000);
                        },
                        page20: function (a) {
                            return b(a, 20000);
                        },
                        page30: function (a) {
                            return b(a, 30000);
                        },
                        page45: function (a) {
                            return b(a, 45000);
                        },
                        page60: function (a) {
                            return b(a, 60000);
                        },
                        page120: function (a) {
                            return b(a, 120000);
                        },
                        page180: function (a) {
                            return b(a, 180000);
                        },
                        page240: function (a) {
                            return b(a, 240000);
                        },
                        page7_2: function (a) {
                            return b(a, 7200);
                        },
                        notmeasurableX: function (a, b) {
                            return f(a, b) && !this.measurable(a);
                        },
                        notmeasurable1: function (a) {
                            return f(a, 1000) && !this.measurable(a);
                        },
                        sessionX: function (a, b) {
                            return f(a, b);
                        },
                        strictOtsAndSession5: function (a) {
                            return this.strictOts(a) && f(a, 5000);
                        },
                        inView5AndInteraction2: function (b) {
                            return a.u.i(b, 5000) && 2000 <= b.bg;
                        },
                        inView5AndInteraction1: function (b) {
                            return a.u.i(b, 5000) && 1000 <= b.bg;
                        },
                        MoatScoreA: function (a) {
                            return f(a, 10000) && !this.strictOts(a);
                        },
                        MoatScoreB: function (a) {
                            return this.strictOts(a);
                        },
                        MoatScoreC: function (b) {
                            return a.u.i(b, 15000);
                        },
                        MoatScoreD: function (b) {
                            return a.u.i(b, 25000) && this.scroll(b);
                        },
                        MoatScoreE: function (b) {
                            return a.u.i(b, 30000) && h(b, 500) && this.scroll(b);
                        },
                        inView2AndScrollAndPage10: function (a) {
                            return this.inViewX(a, 2000) && this.pageX(a, 10000) && this.scroll(a);
                        },
                        page5AndScroll: function (a) {
                            return this.pageX(a, 5000) && this.scroll(a);
                        },
                        page10AndScroll: function (a) {
                            return this.pageX(a, 10000) && this.scroll(a);
                        },
                        scroll5Page15: function (a) {
                            return this.pageX(a, 15000) || this.scrollfirstX(a, 5000);
                        },
                        strictOtsAndInteraction5: function (a) {
                            return this.strictOts(a) && this.interactionX(a, 5000);
                        },
                        click: function (a) {
                            return 0 < a.aq[2] || 0 < a.aq[3];
                        },
                        inView10AndScroll: function (a) {
                            return this.scroll(a) && this.inViewX(a, 10000);
                        },
                        inView10AndScrollAndClick: function (a) {
                            return this.scroll(a) && this.inViewX(a, 10000) && this.click(a);
                        },
                        page90_btf: function (a) {
                            return b(a, 90000) && u(a);
                        },
                        moatA: function (a) {
                            return f(a, 15000) && this.inViewX(a, 10000);
                        },
                        moatB: function (a) {
                            return f(a, 60000) && this.scroll(a) && this.inViewX(a, 15000);
                        },
                        moatC: function (a) {
                            return f(a, 150000) && this.scroll(a) && this.inViewX(a, 20000);
                        },
                        adNotHidden: function (b) {
                            return !1 === a.ac.a(b.zr);
                        }
                    };
                    a.ab.b = function (b) {
                        return a.d.c() ? {
                            totalInviewTime: 0,
                            fullyInviewTime: 0,
                            ots: 0
                        } : {
                            totalInviewTime: k(a.u.j(b)),
                            fullyInviewTime: k(a.u.r(b)),
                            ots: a.u.m(b)
                        };
                    };
                    a.ab.c = function (b) {
                        if (!a.c.c || !b.activetime)
                            return !1;
                        var c = a.u.a(b.zr);
                        return (b = a.ad.a(b.activetime.counters, c)) && b.get('activeInviewTime');
                    };
                    a.ab.d = function (a) {
                        return a && a.counters && a.counters.strictDwell && a.counters.strictDwell.tCur ? k(a.counters.strictDwell.tCur) : !1;
                    };
                    a.ab.e = function (b) {
                        return !a.d.c() && b && b.counters && b.counters.laxPlayTime && b.counters.laxPlayTime.tCur ? k(b.counters.laxPlayTime.tCur) : !1;
                    };
                    a.ab.f = function (b, c, f) {
                        var e = a.a.aa(), h = a.ab.g(b), l = a.ab.h(b), g = a.ab.i(b), m = a.ab.b(b), p = b && a.u.k(b.zr);
                        if ('V2' === f || 'V3' === f)
                            var r = {
                                m: a.c.ds(b),
                                iv: m.ots,
                                tuv: m.ots ? g : -1,
                                tet: m.totalInviewTime,
                                fi: 1 <= m.fullyInviewTime,
                                apd: a.ab.d(b),
                                ui: d(b),
                                uit: x(b),
                                h: !!b.cb,
                                th: b.cb ? k(b.cb) : -1,
                                s: a.c.c ? !!q.z : -1,
                                ts: a.c.c && q.z ? k(q.z) : -1,
                                bfa: b.el ? b.dn ? !0 : !1 : -1,
                                d: encodeURIComponent(e),
                                L1id: l.moatClientLevel1,
                                L2id: l.moatClientLevel2,
                                L3id: l.moatClientLevel3,
                                L4id: l.moatClientLevel4,
                                S1id: l.moatClientSlicer1,
                                S2id: l.moatClientSlicer2,
                                ord: h,
                                r: b.RAND,
                                t: c ? c : 'unload',
                                os: p && p.wasPartiallyInview(),
                                fi2: 2000 <= m.fullyInviewTime,
                                div1: p && 1000 <= p.getDentsuInViewTime(),
                                ait: a.ab.c(b)
                            };
                        else
                            'V1' === f && (r = {
                                m: a.c.ds(b),
                                iv: m.ots,
                                tuv: m.ots ? g : -1,
                                tet: m.totalInviewTime,
                                fi: 1 <= m.fullyInviewTime,
                                apd: a.ab.d(b),
                                ui: d(b),
                                uit: x(b),
                                h: !!b.cb,
                                th: b.cb ? k(b.cb) : -1,
                                s: a.c.c ? !!q.z : -1,
                                ts: a.c.c && q.z ? k(q.z) : -1,
                                bfa: b.el ? b.dn ? !0 : !1 : -1,
                                d: encodeURIComponent(e),
                                L1id: l.moatClientLevel1,
                                L2id: l.moatClientLevel2,
                                L3id: l.moatClientLevel3,
                                L4id: l.moatClientLevel4,
                                S1id: l.moatClientSlicer1,
                                S2id: l.moatClientSlicer2,
                                ord: h,
                                r: b.RAND,
                                t: c ? c : 'unload'
                            });
                        if (!r)
                            return null;
                        a.a.forEach([
                            'zMoatVGUID',
                            'zMoatCURL',
                            'zMoatPS',
                            'zMoatPT'
                        ], function (c) {
                            'url' === c ? r[c] = encodeURIComponent(La) : 'mobile' === c ? r[c] = a.a.l() : 'avoc' === c ? r[c] = b && b.reachedAvoc : 'click' === c ? r[c] = 0 < b.aq[3] || 0 < b.aq[2] : 'viewPercBuckets' === c ? r[c] = 'Feature Not Enabled' : 'customInView' === c ? r[c] = 'Feature Not Enabled' : 'quartileData' === c ? r[c] = 'Feature Not Enabled' : 'mvs' !== c && ('initWidth' === c ? r.initW = b.get_width() || '-1' : 'initHeight' === c ? r.initH = b.get_height() || '-1' : 'initSRE' === c ? r.initSRE = b.getScreenRealEstate() || '-1' : r[c] = l[c]);
                        });
                        return r;
                    };
                    a.ab.j = function (b, c) {
                        a.a.aa();
                        a.ab.g(b);
                        a.ab.h(b);
                        a.ab.i(b);
                        a.ab.b(b);
                        a.u.k(b.zr);
                    };
                    a.ab.h = function (a) {
                        return a.ao.origLevels ? a.ao.origLevels : a.ao;
                    };
                    a.ab.i = function (b) {
                        if (a.d.c())
                            return !1;
                        b = a.u.o(b.zr);
                        return k(b.strict && 'undefined' !== typeof b.strict.timeToView ? b.strict.timeToView : b.sframe && 'undefined' !== typeof b.sframe.timeToView ? b.sframe.timeToView : b.pscope && 'undefined' !== typeof b.pscope.timeToView ? b.pscope.timeToView : -1);
                    };
                    a.ab.k = function (b, c) {
                        var f = a.ab.h(b), d = [], e = function (a) {
                                return 'string' !== typeof a ? !0 : -1 === a.indexOf('moatpixel.com') && -1 === a.indexOf('moatads.com');
                            };
                        try {
                            if (a.a.f(c))
                                a.a.forEach(c, function (b) {
                                    if (a.a.f(b)) {
                                        var c = {};
                                        c.src = b[0];
                                        if (!a.c.ej() || !e(c.src)) {
                                            c.customQueryParams = b[1] || !1;
                                            c.opt = b[2] || !1;
                                            var h = b[3];
                                            if (h) {
                                                if (b = b[4], 'string' === typeof h && b && a.a.ax(b, f && f[h] || !1) && d.push(c), 'object' === typeof h && !a.a.f(h)) {
                                                    b = !1;
                                                    var l = {}, g;
                                                    for (g in h)
                                                        l[f && f[g]] = h[g];
                                                    for (var n in l)
                                                        if (a.a.ax(l[n], n)) {
                                                            b = !0;
                                                            break;
                                                        }
                                                    b && d.push(c);
                                                }
                                            } else
                                                d.push(c);
                                        }
                                    } else
                                        'string' === typeof b && (c = {}, c.src = b, a.c.ej() && e(c.src) || (c.customQueryParams = !1, c.opt = !1, d.push(c)));
                                });
                            else if ('string' === typeof c) {
                                var h = {};
                                h.src = c;
                                if (a.c.ej() && e(h.src))
                                    return;
                                d.push(h);
                            }
                        } catch (l) {
                        }
                        return d;
                    };
                    a.ab.l = function (b, c) {
                        c && a.a.forEach(c, function (a, c) {
                            b[c] = a;
                        });
                        return b;
                    };
                    a.ab.m = function (a, b) {
                        var c = '', f = 0, d = !0;
                        b && (d = !1);
                        if (a && 'nosend' !== a) {
                            for (var e in a)
                                a.hasOwnProperty(e) && (f++, !0 === a[e] ? a[e] = '1' : !1 === a[e] ? a[e] = '0' : 'undefined' === typeof a[e] && (a[e] = 0), d && (a[e] = encodeURIComponent(a[e])), c += (1 < f ? '&' : '') + e + '=' + a[e]);
                            d && (c += '&bedc=1');
                        } else
                            c = 'nosend';
                        return c;
                    };
                    a.ab.n = function (a) {
                        'number' != typeof a.aq.NHTDIRECTSEQUENCE ? a.aq.NHTDIRECTSEQUENCE = 1 : a.aq.NHTDIRECTSEQUENCE++;
                        return a.aq.NHTDIRECTSEQUENCE;
                    };
                    a.ab.o = function (a) {
                        'number' != typeof a.aq.TTPSEQUENCE ? a.aq.TTPSEQUENCE = 1 : a.aq.TTPSEQUENCE++;
                        return a.aq.TTPSEQUENCE;
                    };
                    a.ab.p = function (b, c, f) {
                        a.ab.h(b);
                        (f = a.ab.k(b, [[
                                'https://redventuresgamdisplay60805146916.s.moatpixel.com/pixel.gif?',
                                !1,
                                'V2'
                            ]])) && a.ab.q(b, f, c, !0, !0);
                        if (a.c.ej())
                            return !1;
                    };
                    a.ab.q = function (b, f, d, e, h, l) {
                        'string' == typeof f ? c(f, !1, t.LLD)(b) : a.a.forEach(f, function (f) {
                            var g = f.src, m = f.opt, p, k, I, r;
                            r = !1;
                            k = 'V3';
                            m && (a.a.ax(m, 'V1') ? k = 'V1' : a.a.ax(m, 'V2') ? k = 'V2' : a.a.ax(m, 'V3') && (k = 'V3'), a.a.ax(m, 'disableEncoding') && (r = !0));
                            k = m && a.a.ax(m, 'xaxis') ? a.ab.m(a.ab.r(b, d), r) : a.ab.m(a.ab.f(b, d, k), r);
                            f.customQueryParams && (I = a.ab.m(a.ab.j(b, d), r));
                            I && m && a.a.ax(m, 'addCustom') ? 'nosend' !== k && (p = k + '&' + I) : p = f.customQueryParams ? I : k;
                            0 !== g.indexOf('http') && (g = a.c.protocol + g);
                            p && 'nosend' !== p && (e && (p = p + '&q=' + a.ab.o(b)), a.a.ax(m, 'dfp') ? (f = a.ab.g(b), g = g + 'u=' + p + ';sz=1x1;ord=' + f + '?') : g += p, l ? a.ab.s(g, h, b) : h ? m && a.a.ax(m, 'xaxis') ? c(g, !0, t.DSP)(b) : c(g, !0, t.LLD)(b) : m && a.a.ax(m, 'xaxis') ? c(g, !1, t.DSP)(b) : c(g, !1, t.LLD)(b));
                        });
                    };
                    a.ab.t = function (b, c) {
                        e(b, 'strictOts', function (b, f) {
                            var d = a.c.e, e = d.document.getElementsByTagName('script')[0], d = d.document.createElement('img');
                            d.src = c;
                            e.parentNode.insertBefore(d, e);
                            b.viewableOcrPixelFired = 1;
                        });
                    };
                    a.ab.u = function (b, c) {
                        e(b, 'measurable', g(b, 'meas'));
                        e(b, 'strictOts', g(b, 'iv'));
                        e(b, 'adNotHidden', g(b, 'hdn'));
                        e(b, 'full-inView', g(b, 'fv'));
                        e(b, 'nhtReady', g(b, 'nht'));
                        if (a.c.ej())
                            return !1;
                    };
                    a.ab.v = function () {
                        for (var b in B)
                            if (B.hasOwnProperty(b)) {
                                var f = B[b], d = r[b], e;
                                for (e in d)
                                    d.hasOwnProperty(e) && p[e](f) && (a.a.forEach(d[e], function (b, h) {
                                        var l = typeof b;
                                        if ('string' === l) {
                                            var l = b, g = a.ab.g(f), g = -1 < a.a.indexOf(l, '?') ? '&ord=' + g : '?ord=' + g;
                                            c(l + g, !1, t.TPP)(f);
                                        } else if ('function' === l)
                                            try {
                                                b(f);
                                            } catch (m) {
                                                d[e][h] = !1;
                                            }
                                    }), delete d[e]);
                            }
                    };
                    a.ab.w = function (a, b) {
                        if (r.hasOwnProperty(a) && r[a].hasOwnProperty(b))
                            return !0;
                    };
                    a.ab.x = function (a, b) {
                        r.hasOwnProperty(a) && r[a].hasOwnProperty(b) && delete r[a][b];
                    };
                    a.ab.g = function (b) {
                        var c;
                        b.Ord ? c = b.Ord : (c = b.ao.startTime || a.c.bj || new z().getTime(), b.Ord = c);
                        return c;
                    };
                    a.ab.y = e;
                    a.ab.z = function (b, c, f) {
                        if (!b)
                            return function () {
                            };
                        f || (f = t.TPP);
                        return function (d) {
                            var e = {};
                            e[a.f.g.c] = !0;
                            e[a.f.g.d] = !0;
                            c && (e[a.f.g.a] = !0);
                            e[a.f.g.b] = f;
                            a.f.h(b, e, d.zr);
                        };
                    };
                    a.ab.aa = g;
                    a.ab.ab = d;
                    a.ab.ac = x;
                    a.ab.ad = k;
                    a.ab.ae = p;
                    a.ab.af = function (b, c, f) {
                        if (!b)
                            return function () {
                            };
                        f || (f = t.TPP);
                        return function (d) {
                            var e = {};
                            e[a.f.g.e] = !0;
                            c && (e[a.f.g.a] = !0);
                            e[a.f.g.b] = f;
                            a.f.h(b, e, d.zr);
                        };
                    };
                    a.ab.ag = c;
                    a.ab.ah = l;
                }(v));
                (function (a) {
                    function k() {
                        var a = 19 .toString(2).length - 1, d = 1;
                        return function () {
                            d <<= 1;
                            0 != d >> a && (d ^= 19);
                            return d;
                        };
                    }
                    function g(a) {
                        return 9 === a ? 30 : 10 === a ? 31 : a;
                    }
                    a.f = {};
                    a.f.j = 0;
                    a.f.c = 1;
                    a.f.k = 2;
                    a.f.d = 3;
                    a.f.l = 4;
                    var e = a.a.d;
                    a.f.m = function (a) {
                        for (var d = '', b = 0; b < a.length; b++)
                            var f = a.charCodeAt(b) ^ 85, d = d + String.fromCharCode(f);
                        a = d;
                        for (var d = '', f = b = 0, h, l, g, k = 0; k < a.length; ++k)
                            for (g = a.charCodeAt(k), l = 255 < g ? 0 : 1; 2 > l; ++l)
                                b = 0 === l ? b | (g & 65280) / 256 << f : b | (g & 255) << f, f += 8, 13 < f && (h = b & 8191, 88 < h ? (b >>= 13, f -= 13) : (h = b & 16383, b >>= 14, f -= 14), d += e.charAt(h % 91), d += e.charAt(h / 91 | 0));
                        0 < f && (d += e.charAt(b % 91), 7 < f || 90 < b) && (d += e.charAt(b / 91 | 0));
                        return d;
                    };
                    a.f.n = function (a) {
                        var d = [];
                        if ('undefined' !== typeof a)
                            for (var b = 0; b < a.length; b++) {
                                var f = a.charCodeAt(b);
                                128 > f ? d.push(f) : 2048 > f ? d.push(192 | f >> 6, 128 | f & 63) : 55296 > f || 57344 <= f ? d.push(224 | f >> 12, 128 | f >> 6 & 63, 128 | f & 63) : b < a.length - 1 && (b++, f = 65536 + ((f & 1023) << 10 | a.charCodeAt(b) & 1023), d.push(240 | f >> 18, 128 | f >> 12 & 63, 128 | f >> 6 & 63, 128 | f & 63));
                            }
                        b = w.floor(1000 * w.random()) % 251;
                        a = [40 * b % 251];
                        for (f = 0; f < d.length; f++)
                            b = (b * b + (f + 1)) % 251, a.push(d[f] ^ b);
                        if ('function' !== typeof window.btoa)
                            d = '';
                        else {
                            d = [];
                            for (b = 0; b < a.length; b++)
                                d.push(String.fromCharCode(a[b]));
                            d = btoa(d.join(''));
                        }
                        return d;
                    };
                    a.f.o = function (a) {
                        for (var d = '', b = k(), f = 0; f < a.length; f++) {
                            var e;
                            e = g(a.charCodeAt(f));
                            var l = 0 === f % 2 ? b() : -1 * b();
                            e = 0 === l ? e : 126 < e + l ? 30 + (l - (126 - e) - 1) : 30 > e + l ? 126 + (l + (e - 30) + 1) : e + l;
                            d += String.fromCharCode(30 === e ? 9 : 31 === e ? 10 : e);
                        }
                        return d;
                    };
                    a.f.p = function (a) {
                        for (var d = '', b = k(), f = 0; f < a.length; f++) {
                            var e = b(), l;
                            l = g(a[f].charCodeAt(0));
                            e = 0 === f % 2 ? e : -1 * e;
                            l = 0 === e ? l : 30 > l - e ? 126 - (e - (l - 30) - 1) : 126 < l - e ? 30 - (e + (126 - l) + 1) : l - e;
                            d += String.fromCharCode(30 === l ? 9 : 31 === l ? 10 : l);
                        }
                        return d;
                    };
                    a.f.q = function (c, d) {
                        var b = [];
                        a.a.forEach(c, function (a, c) {
                            if (void 0 !== a && ('string' === typeof (d ? a[d] : a) || 'number' === typeof (d ? a[d] : a) || 'boolean' === typeof (d ? a[d] : a))) {
                                var e = String(d ? a[d] : a).split('&').join('%26').split('=').join('%3D');
                                b.push(('number' === typeof c ? '' : c + '=') + e);
                            }
                        }, null, !0);
                        b.sort();
                        return b.join('&');
                    };
                    a.f.a = a.a.e;
                    a.f.r = function () {
                        var c = document && document.documentElement && document.documentElement.style || {};
                        a.f.s = [
                            !0 === (!!window.chrome && (!!window.Atomics && !!window.Atomics.notify || !!window.EnterPictureInPictureEvent || !!window.chrome.webstore)) ? 1 : 0,
                            !0 === ('undefined' !== typeof InstallTrigger || 'MozAppearance' in c) ? 1 : 0,
                            !0 === !!window.opera ? 1 : 0,
                            !0 === a.c.m ? 1 : 0,
                            !0 === (!+'\x0B1' || !!document.documentMode || !!window.ActiveXObject || '-ms-scroll-limit' in c && '-ms-ime-align' in c) ? 1 : 0
                        ];
                        for (var c = !1, d = 0; d < a.f.s.length; d++)
                            if (1 === a.f.s[d]) {
                                c = d;
                                break;
                            }
                        !1 !== c && (a.f.b = c);
                        return a.f.b;
                    };
                    a.f.b = a.f.r();
                }(v));
                (function (a) {
                    a.ae = {};
                    var k = [];
                    a.ae.a = function (a, e) {
                        k.push({
                            query: a,
                            callback: e
                        });
                        return !1;
                    };
                }(v));
                (function (a) {
                    function k() {
                        function b(c) {
                            for (var f = ''; 0 < c;)
                                f += a.f.a([c % 62]), c = w.floor(c / 62);
                            return f;
                        }
                        function c(a) {
                            return {
                                propertyMethods: [
                                    function (b, c) {
                                        try {
                                            var f = c.split('.'), d = a, e = f[0];
                                            1 < f.length && (d = f[0], e = f[1]);
                                            return a[d].hasOwnProperty(e).toString();
                                        } catch (h) {
                                            return (!1).toString();
                                        }
                                    },
                                    function (b, c) {
                                        try {
                                            var f = c.split('.'), d = a, e = f[0];
                                            1 < f.length && (d = f[0], e = f[1]);
                                            return a.Object.getOwnPropertyDescriptors(a[d])[e].get.toString();
                                        } catch (h) {
                                            return '';
                                        }
                                    },
                                    function (b, c) {
                                        try {
                                            var f = c.split('.'), d = a, e = f[0];
                                            1 < f.length && (d = f[0], e = f[1]);
                                            return a.Object.getOwnPropertyDescriptors(a[d])[e].get.toString.toString();
                                        } catch (h) {
                                            return '';
                                        }
                                    }
                                ],
                                functionMethods: [
                                    function (a, b) {
                                        return a.name;
                                    },
                                    function (a, b) {
                                        try {
                                            return new a.toString();
                                        } catch (c) {
                                            return c.toString();
                                        }
                                    },
                                    function (b, c) {
                                        return a.Function.prototype.toString.call(b);
                                    },
                                    function (b, c) {
                                        return a.Function.prototype.toString.call(b.toString);
                                    },
                                    function (a, b) {
                                        try {
                                            return ('prototype' in a).toString();
                                        } catch (c) {
                                            return (!1).toString();
                                        }
                                    }
                                ]
                            };
                        }
                        var f = [
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    47,
                                    34,
                                    44,
                                    34,
                                    27,
                                    34,
                                    37,
                                    34,
                                    45,
                                    50,
                                    18,
                                    45,
                                    26,
                                    45,
                                    30
                                ]),
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    33,
                                    34,
                                    29,
                                    29,
                                    30,
                                    39
                                ]),
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    38,
                                    40,
                                    51,
                                    7,
                                    34,
                                    29,
                                    29,
                                    30,
                                    39
                                ]),
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    38,
                                    44,
                                    7,
                                    34,
                                    29,
                                    29,
                                    30,
                                    39
                                ]),
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    48,
                                    30,
                                    27,
                                    36,
                                    34,
                                    45,
                                    7,
                                    34,
                                    29,
                                    29,
                                    30,
                                    39
                                ]),
                                a.f.a([
                                    39,
                                    26,
                                    47,
                                    34,
                                    32,
                                    26,
                                    45,
                                    40,
                                    43,
                                    72,
                                    48,
                                    30,
                                    27,
                                    29,
                                    43,
                                    34,
                                    47,
                                    30,
                                    43
                                ]),
                                a.f.a([
                                    39,
                                    26,
                                    47,
                                    34,
                                    32,
                                    26,
                                    45,
                                    40,
                                    43,
                                    72,
                                    46,
                                    44,
                                    30,
                                    43,
                                    0,
                                    32,
                                    30,
                                    39,
                                    45
                                ]),
                                a.f.a([
                                    39,
                                    26,
                                    47,
                                    34,
                                    32,
                                    26,
                                    45,
                                    40,
                                    43,
                                    72,
                                    26,
                                    41,
                                    41,
                                    13,
                                    26,
                                    38,
                                    30
                                ]),
                                a.f.a([
                                    44,
                                    28,
                                    43,
                                    30,
                                    30,
                                    39,
                                    23
                                ]),
                                a.f.a([
                                    44,
                                    28,
                                    43,
                                    30,
                                    30,
                                    39,
                                    24
                                ]),
                                a.f.a([
                                    44,
                                    28,
                                    43,
                                    30,
                                    30,
                                    39,
                                    19,
                                    40,
                                    41
                                ]),
                                a.f.a([
                                    44,
                                    28,
                                    43,
                                    30,
                                    30,
                                    39,
                                    11,
                                    30,
                                    31,
                                    45
                                ]),
                                a.f.a([
                                    44,
                                    28,
                                    43,
                                    30,
                                    30,
                                    39,
                                    72,
                                    26,
                                    47,
                                    26,
                                    34,
                                    37,
                                    22,
                                    34,
                                    29,
                                    45,
                                    33
                                ]),
                                a.f.a([
                                    44,
                                    28,
                                    43,
                                    30,
                                    30,
                                    39,
                                    72,
                                    26,
                                    47,
                                    26,
                                    34,
                                    37,
                                    7,
                                    30,
                                    34,
                                    32,
                                    33,
                                    45
                                ])
                            ], d = [
                                a.f.a([
                                    3,
                                    26,
                                    45,
                                    30
                                ]),
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    33,
                                    26,
                                    44,
                                    5,
                                    40,
                                    28,
                                    46,
                                    44
                                ]),
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    30,
                                    37,
                                    30,
                                    38,
                                    30,
                                    39,
                                    45,
                                    5,
                                    43,
                                    40,
                                    38,
                                    15,
                                    40,
                                    34,
                                    39,
                                    45
                                ]),
                                a.f.a([
                                    5,
                                    46,
                                    39,
                                    28,
                                    45,
                                    34,
                                    40,
                                    39,
                                    72,
                                    41,
                                    43,
                                    40,
                                    45,
                                    40,
                                    45,
                                    50,
                                    41,
                                    30,
                                    72,
                                    45,
                                    40,
                                    18,
                                    45,
                                    43,
                                    34,
                                    39,
                                    32
                                ]),
                                a.f.a([
                                    43,
                                    30,
                                    42,
                                    46,
                                    30,
                                    44,
                                    45,
                                    0,
                                    39,
                                    34,
                                    38,
                                    26,
                                    45,
                                    34,
                                    40,
                                    39,
                                    5,
                                    43,
                                    26,
                                    38,
                                    30
                                ]),
                                a.f.a([
                                    44,
                                    30,
                                    45,
                                    8,
                                    39,
                                    45,
                                    30,
                                    43,
                                    47,
                                    26,
                                    37
                                ]),
                                a.f.a([
                                    44,
                                    30,
                                    45,
                                    19,
                                    34,
                                    38,
                                    30,
                                    40,
                                    46,
                                    45
                                ]),
                                a.f.a([
                                    13,
                                    40,
                                    45,
                                    34,
                                    31,
                                    34,
                                    28,
                                    26,
                                    45,
                                    34,
                                    40,
                                    39
                                ]),
                                a.f.a([
                                    22,
                                    30,
                                    27,
                                    6,
                                    11,
                                    17,
                                    30,
                                    39,
                                    29,
                                    30,
                                    43,
                                    34,
                                    39,
                                    32,
                                    2,
                                    40,
                                    39,
                                    45,
                                    30,
                                    49,
                                    45,
                                    72,
                                    41,
                                    43,
                                    40,
                                    45,
                                    40,
                                    45,
                                    50,
                                    41,
                                    30,
                                    72,
                                    32,
                                    30,
                                    45,
                                    18,
                                    46,
                                    41,
                                    41,
                                    40,
                                    43,
                                    45,
                                    30,
                                    29,
                                    4,
                                    49,
                                    45,
                                    30,
                                    39,
                                    44,
                                    34,
                                    40,
                                    39,
                                    44
                                ])
                            ], e = [
                                a.f.a([
                                    29,
                                    40,
                                    28,
                                    46,
                                    38,
                                    30,
                                    39,
                                    45,
                                    72,
                                    33,
                                    26,
                                    44,
                                    5,
                                    40,
                                    28,
                                    46,
                                    44
                                ]),
                                a.f.a([
                                    39,
                                    26,
                                    47,
                                    34,
                                    32,
                                    26,
                                    45,
                                    40,
                                    43,
                                    72,
                                    48,
                                    30,
                                    27,
                                    29,
                                    43,
                                    34,
                                    47,
                                    30,
                                    43
                                ])
                            ];
                        return '1_' + function (a) {
                            for (var b = '', c = f.concat(d), e = 0; e < c.length; e++) {
                                var h = c[e];
                                if (a.hasOwnProperty(h))
                                    for (var h = a[h], l = 0; l < h.length; l++)
                                        b += h[l] + '-';
                            }
                            return b;
                        }(function () {
                            for (var a = {}, d = c(window), h = {}, l = 0; l < f.length; l++)
                                h[f[l]] = !0;
                            for (l = 0; l < e.length; l++) {
                                var k = e[l];
                                a[k] = [];
                                var y = d.functionMethods;
                                h.hasOwnProperty(k) && (y = d.propertyMethods);
                                try {
                                    for (var u, D = window, O = k.split('.'), E = 0; E < O.length; E++)
                                        D = D[O[E]];
                                    u = D;
                                    for (D = 0; D < y.length; D++) {
                                        var A = y[D];
                                        try {
                                            a[k].push(b(g(A(u, k).replace(/\-/g, '%2D').replace(/\s*/g, ''))));
                                        } catch (q) {
                                            a[k].push('');
                                        }
                                    }
                                } catch (q) {
                                    a[k].push('E');
                                }
                            }
                            return a;
                        }());
                    }
                    function g(a) {
                        var b = 0, c = a.length, f, d;
                        if (0 == c)
                            return b;
                        for (f = 0; f < c; f++)
                            d = a.charCodeAt(f), b = (b << 5) - b + d, b &= b;
                        return b >>> 0;
                    }
                    function e() {
                        var b = [];
                        if (!a.g.d(window.top)) {
                            var c = [], f = a.f.a([
                                    28,
                                    33,
                                    43,
                                    40,
                                    38,
                                    30
                                ]), d = a.f.a([
                                    30,
                                    49,
                                    45,
                                    30,
                                    39,
                                    44,
                                    34,
                                    40,
                                    39
                                ]), e = '\'' + f + '-' + d + '://\']';
                            window.top.document && 'function' === typeof window.top.document.querySelectorAll && (c = window.top.document.querySelectorAll('[src^=' + e + ',[data^=' + e + ',[href^=' + e));
                            0 !== c.length && window.String && 'function' === typeof window.String.prototype.match && a.a.forEach(c, function (a) {
                                (a = a.outerHTML.match('[a-z]+="' + f + '-' + d + '://([a-z]+)')) && 1 < a.length && -1 === b.indexOf(a[1]) && b.push(a[1]);
                            });
                        }
                        c = b.join(',');
                        window.String && window.String.prototype.slice && (c = c.slice(0, 150));
                        return a.f.n(c);
                    }
                    function c(a, c) {
                        const $___old_b3b982086d8d1bc5 = {}.constructor.getOwnPropertyDescriptor(window, 'XMLHttpRequest');
                        try {
                            if ($___old_b3b982086d8d1bc5)
                                ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___mock_6bf28fdad6c63137.XMLHttpRequest));
                            return function () {
                                try {
                                    var d = a.split(h), e = c || window, l, p;
                                    for (p = 0; p < d.length; p++) {
                                        l = d[p];
                                        if (null === e || typeof e === b)
                                            return 1;
                                        e = e[l];
                                    }
                                    return typeof e === b ? 2 : null === e ? 3 : 4 + g(a + f + e.toString()) % 58;
                                } catch (n) {
                                    return 0;
                                }
                            }.apply(this, arguments);
                        } finally {
                            if ($___old_b3b982086d8d1bc5)
                                ({}.constructor.defineProperty(window, 'XMLHttpRequest', $___old_b3b982086d8d1bc5));
                        }
                    }
                    function d() {
                        var a, b = [
                                function () {
                                    return 'c$$b' !== 'cab'.replace('a', function () {
                                        return '$$';
                                    });
                                },
                                function () {
                                    return eval('class A { constructor(pp) { this.pp = pp; }\n call() { return this.pp; }\n }\n class B extends A { tS(a) { return super.call(); }\n tT(a){ return this.call(); } }\n  const obj = new B("cab");  (obj.tS() !== obj.tT()); ');
                                },
                                function () {
                                    return eval('\'\\\n\r\'');
                                },
                                function () {
                                    return eval('((new Date("1300-02-28T21:11:11.000Z")).toISOString() !== "1300-02-28T21:11:11.000Z")');
                                },
                                function () {
                                    return eval('(new Date("2835")).toISOString() !== "2835-01-01T00:00:00.000Z"');
                                },
                                function () {
                                    return -1 !== '22'.localeCompare('122', 'de', { numeric: !0 });
                                },
                                function () {
                                    return 'p' === window.atob('cab==');
                                },
                                function () {
                                    return 'cab' !== 'cab'.split(/\b/).pop();
                                },
                                function () {
                                    return void 0 === Array.prototype.find;
                                },
                                function () {
                                    return Number.isNaN('MAX_SAFE_INTEGER');
                                },
                                function () {
                                    return /(G)+|(X)+X/.test('X ');
                                },
                                function () {
                                    return 'bec' != 'cabecab'.match('.?e.?');
                                },
                                function () {
                                    var a = {};
                                    [
                                        'cab',
                                        'cab'
                                    ].sort(a, a);
                                    return !0;
                                },
                                function () {
                                    var a = new Proxy([
                                        3,
                                        444
                                    ], {});
                                    return [
                                        12,
                                        444
                                    ].concat(a)[3];
                                },
                                function () {
                                    return eval('let x = (e) => { let e = true;};');
                                },
                                function () {
                                    return 0 === new ArrayBuffer(5).slice(3, 4394878398).byteLength;
                                }
                            ];
                        a = '1-';
                        for (var c = 0; c < b.length; c++) {
                            var f;
                            try {
                                f = (0, b[c])() ? '1' : '0';
                            } catch (d) {
                                f = '2';
                            }
                            a += f;
                        }
                        return a;
                    }
                    a.af = {};
                    var b = a.f.a([
                            46,
                            39,
                            29,
                            30,
                            31,
                            34,
                            39,
                            30,
                            29
                        ]), f = a.f.a([77]), h = a.f.a([72]), l;
                    a.af.a = function (b) {
                        if (void 0 !== l)
                            return a.a.i(l);
                        l = {};
                        var f = a.c.e;
                        try {
                            var h = f.document, u = h.body, m = f.innerWidth || h.documentElement.clientWidth || u.clientWidth, p = f.innerHeight || h.documentElement.clientHeight || u.clientHeight, n = f.outerWidth || u.offsetWidth, I = f.outerHeight || u.offsetHeight;
                        } catch (q) {
                        }
                        try {
                            var K = f.screenX || f.screenLeft || f.screenX, F = f.screenY || f.screenTop || f.screenY;
                        } catch (q) {
                        }
                        var y = new z().getTimezoneOffset(), H;
                        if (document && document.body) {
                            var D = document.createElement(a.f.a([
                                34,
                                31,
                                43,
                                26,
                                38,
                                30
                            ]));
                            D.width = a.f.a([
                                53,
                                41,
                                49
                            ]);
                            D.height = a.f.a([
                                53,
                                41,
                                49
                            ]);
                            D.style.left = '-' + a.f.a([
                                61,
                                61,
                                61,
                                61,
                                41,
                                49
                            ]);
                            D.style.top = '-' + a.f.a([
                                61,
                                61,
                                61,
                                61,
                                41,
                                49
                            ]);
                            D.style.position = a.f.a([
                                26,
                                27,
                                44,
                                40,
                                37,
                                46,
                                45,
                                30
                            ]);
                            document.body.appendChild(D);
                            H = D;
                        } else
                            H = void 0;
                        var O = a.f.a([
                                84,
                                41,
                                33,
                                26,
                                39,
                                45,
                                40,
                                38
                            ]), E = a.f.a([
                                28,
                                26,
                                37,
                                37,
                                15,
                                33,
                                26,
                                39,
                                45,
                                40,
                                38
                            ]), A = !0 === ('undefined' != typeof f[O] || 'undefined' != typeof f[E]) ? 1 : 0, v, w = H, na = /(?:Mac OS X )(\d{2}_\d{2})(?:.*Version\/)(\d{2})/, ua = a.f.a([
                                64,
                                28,
                                29,
                                28,
                                84,
                                26,
                                44,
                                29,
                                35,
                                31,
                                37,
                                26,
                                44,
                                46,
                                45,
                                40,
                                41,
                                31,
                                33,
                                47,
                                28,
                                25,
                                11,
                                38,
                                28,
                                31,
                                37,
                                84
                            ]), ba = a.f.a([
                                28,
                                33,
                                43,
                                40,
                                38,
                                30
                            ]), B = a.f.a([
                                43,
                                46,
                                39,
                                45,
                                34,
                                38,
                                30
                            ]), C = a.f.a([
                                41,
                                37,
                                46,
                                32,
                                34,
                                39,
                                44
                            ]), ja = a.f.a([
                                15,
                                37,
                                46,
                                32,
                                34,
                                39,
                                0,
                                43,
                                43,
                                26,
                                50
                            ]), G = a.f.a([
                                38,
                                34,
                                38,
                                30,
                                19,
                                50,
                                41,
                                30,
                                44
                            ]), J = a.f.a([
                                38,
                                26,
                                49,
                                19,
                                40,
                                46,
                                28,
                                33,
                                15,
                                40,
                                34,
                                39,
                                45,
                                44
                            ]), M, N, P, R, T, U = 2, ca = 2, ha = 2, ka = f.document && f.document[ua] ? 1 : 0, wa, V, W, L, X = a.f.a([
                                34,
                                45,
                                30,
                                38
                            ]), da = a.f.a([
                                45,
                                30,
                                44,
                                45
                            ]);
                        if (window.String && window.String.prototype.match) {
                            var S = navigator.userAgent.match(na);
                            M = null != S && '10_12' == S[1] && '10' == S[2];
                        } else
                            M = !1;
                        if (!M) {
                            var ea = a.f.a([
                                    47,
                                    34,
                                    29,
                                    30,
                                    40,
                                    73,
                                    38,
                                    41,
                                    56,
                                    75
                                ]) + ' ' + a.f.a([
                                    28,
                                    40,
                                    29,
                                    30,
                                    28,
                                    44,
                                    77,
                                    90,
                                    26,
                                    47,
                                    28,
                                    53,
                                    72,
                                    58,
                                    56,
                                    52,
                                    52,
                                    53,
                                    4,
                                    71
                                ]) + ' ' + a.f.a([
                                    38,
                                    41,
                                    56,
                                    26,
                                    72,
                                    56,
                                    52,
                                    72,
                                    54,
                                    90
                                ]), pa = a.f.a([
                                    26,
                                    46,
                                    29,
                                    34,
                                    40,
                                    73,
                                    38,
                                    41,
                                    56,
                                    75
                                ]) + ' ' + a.f.a([
                                    28,
                                    40,
                                    29,
                                    30,
                                    28,
                                    44,
                                    77,
                                    90,
                                    38,
                                    41,
                                    56,
                                    26,
                                    72,
                                    56,
                                    52,
                                    72,
                                    54,
                                    90
                                ]), ra = document.createElement('video'), fa = document.createElement('audio');
                            try {
                                N = ra.canPlayType(ea);
                            } catch (q) {
                                N = 'E';
                            }
                            try {
                                P = fa.canPlayType(pa);
                            } catch (q) {
                                P = 'E';
                            }
                        }
                        var Y = [], Z, ga;
                        if (window.navigator) {
                            V = (wa = window.navigator[J]) && Object.getOwnPropertyDescriptors && void 0 !== Object.getOwnPropertyDescriptors(navigator)[J];
                            if (window.navigator[C]) {
                                ga = window[ja] && window[ja].prototype === navigator[C].__proto__;
                                var aa = window.navigator[C];
                                Z = aa.length;
                                Object.getOwnPropertyDescriptors && Object.getOwnPropertyDescriptors(window.navigator)[C] && (R = !0);
                                for (var Ba = 0; Ba < Z && 10 > Ba; Ba++)
                                    Y.push(aa[Ba].name);
                                W = g(Y.join('*'));
                                if (window.navigator[C][X])
                                    try {
                                        L = window.navigator[C][X](da) ? 0 : 1;
                                    } catch (q) {
                                        L = 3;
                                    }
                                else
                                    L = 2;
                            }
                            T = window.navigator[G] && window.navigator[G].length;
                        }
                        a.g.d(window.top) || (ha = window[ba] && 'object' === typeof window[ba][B] ? 1 : 0);
                        if (w)
                            var la = w.contentWindow, U = (ca = 'object' === typeof la[ba] ? 1 : 0) && 'object' === typeof la[ba][B] ? 1 : 0;
                        v = [
                            ha,
                            ca,
                            U,
                            Z,
                            W,
                            ga ? 1 : 0,
                            T,
                            R ? 1 : 0,
                            P,
                            N,
                            ka,
                            wa,
                            V ? 1 : 0,
                            L
                        ];
                        for (var ma = [], ia = 0; 10 > ia; ia++)
                            ma.push(v[ia]);
                        var ya = l, qa, sa = window.location && window.location.ancestorOrigins && Array.from && Array.from(window.location.ancestorOrigins);
                        qa = g(sa ? sa.join(',') : '');
                        ya.ol = qa;
                        var za = l, Ja;
                        try {
                            for (var Ka = [
                                        a.f.a([
                                            33,
                                            26,
                                            43,
                                            29,
                                            48,
                                            26,
                                            43,
                                            30,
                                            2,
                                            40,
                                            39,
                                            28,
                                            46,
                                            43,
                                            43,
                                            30,
                                            39,
                                            28,
                                            50
                                        ]),
                                        a.f.a([
                                            47,
                                            30,
                                            39,
                                            29,
                                            40,
                                            43
                                        ]),
                                        a.f.a([
                                            41,
                                            37,
                                            26,
                                            45,
                                            31,
                                            40,
                                            43,
                                            38
                                        ]),
                                        a.f.a([
                                            46,
                                            44,
                                            30,
                                            43,
                                            0,
                                            32,
                                            30,
                                            39,
                                            45
                                        ]),
                                        a.f.a([
                                            48,
                                            30,
                                            27,
                                            29,
                                            43,
                                            34,
                                            47,
                                            30,
                                            43
                                        ])
                                    ], Q = {}, Da = 0; Da < Ka.length; Da++)
                                Q[Ka[Da]] = window.navigator[Ka[Da]];
                            Ja = a.f.m(a.f.q(Q));
                        } catch (q) {
                            Ja = '';
                        }
                        za.qn = Ja;
                        l.tf = k();
                        var Aa = l, ta, xa = 'toolbar scrollbars locationbar menubar personalbar statusbar'.split(' '), oa = [], Ea, Fa;
                        for (Fa = 0; Fa < xa.length; Fa++)
                            try {
                                Ea = xa[Fa], !0 === window[Ea].visible ? oa.push(1) : !1 === window[Ea].visible ? oa.push(0) : void 0 === window[Ea].visible ? oa.push(2) : oa.push(3);
                            } catch (q) {
                                oa.push(4);
                            }
                        ta = oa.join('');
                        Aa.vi = ta;
                        l.rc = ma.join(',');
                        l.rb = '1-' + a.f.n(v.join(','));
                        var La = l, Qa;
                        Qa = 'isSecureContext' in window ? window.isSecureContext ? 1 : 0 : 2;
                        La.sc = Qa;
                        l.os = '1-' + e();
                        l.qp = a.f.s.join('');
                        var ab = l, Ma;
                        var Ra = H;
                        if (Ra) {
                            var Sa = a.f.p('&]xoul#)k]mdrcfaxgum:hm_mfR_jru*UchYqnL^:vwjdmqh1M$bges5{T|r0hmkmhs\'.c T|dq,YKHY\\GTN`QUB[^GO>\\ICYAYK[2[:F]G@H=WH1{qerbvo0evfzG#hlhz2\npoaMlhlmith5`p`n+&f{`ua{)yp|d;cflklk&Mcnchfxbw-p]ub25{kvbqR `plGYfbq#N:S7;4yonek^z]ziMZqYr%VLG9FBQ917{a|\\lr0a\n`nUybo\'|Rz\\-?xgpcoh3i{a X7mcim)Ghzhs\\ \n#Xlc2dhhsim"Hf"e7SGT\\\\TCO@6:!e\t%mcr_wb86zZpa=_nmipp)Giody\'|Rz\\-?ylr]{bublft8{qqnMskb\t)LNP3Y@OEcHK;_:18lX~enKq]lB|Yyo8go^r#Ccjgu_acqehVTinmv*KEGBR@6;zfrkpmx`U_ydy[N3cGMdu_zfvhzm8go^r#Cjy]wi{imHl_~gnFCP\\Pkf `|\'zV{^uf0;G;`6X[jfxbw-navdz\\7>]L<\\Uq/jifjnt!HIZ  XphupmoVfzkok!j;cflklk&OHX9vg}gnqUp ikF\ngo\'Y6f=S?Q=VY^JQ;35bFLnwj|bxG\ttv^`fy\\/QYHSI^IXUYG[85BUONlthQ\\m^`fy\\/LEEHM\\6H;fDd?N+EO[Dxc\nksguC!cf,JGQNk;F9LQaHUD.?[POa{j|m`fy\\/IIQILMBJIfDd?N+EO[Hkmqmkfsd_lmc2>RH`TK7J7nE^KG(KPY?pt h\nUcXmsi&o_z\\y^35bFV`vdU^~"y\\w^:4`JOsq]uco6whhk=_nmipp)IG^Kk`sC!cf,WL\\FQTWKS7;6\\RRnqjohtqoOo]!\\/AWKb?YH19ZEbg!kgOpbkh9gogueu#Dfejd]\nZw:hfp!MNEQUBTHjKYLWEVFO]TJH=Q9NDN\tR_rdppZbih9ikfs~Pcjnfgdlp#sWtW;6uhr^w^xXPqog!\nNK`REJJ?`!HbpbqbjqfA~bth9>KIbF_@OEcHK;_:19s[\tUx`t`Mskb\t)N;Z4Y@DI0;oc|WtWyVXgnl0hmkmhs\'Mh"_ Hvcyaqa_iwW{Wvl7mcim)Ifp_og!Znc/jifjnt!HhlVta}hch6kgap\'Mn e|dFtifw(W:^FY7bF5CQIZbihWd}m<]rehrl$GIYHjj{Sq_nSqgmkR]~o8go^r#E_xYWlmcx\\ldXgnl0jijk O\\~ZbcnetdijLnqbQ_zf=ajlg(Lbhir)}^!?|eVqijFipZJnjW\tgrnpo4AuW\nhog!\nQFDSQ=QNkI^FLQ]BMD.@w`{api~?\nRtdflx&SL[8JIZ;]:hHPO\\O[7_DYGm?\\;F*HgfoyZsjMdpZvdpp6QKL_ZXHR69;payehh\nI~fl RBVLGJ\\\\TCO@6>zVz\\or2;G;`6dIL5c<XMaJWAK Pgofs_ @orijq[xh3dh_t\nNmvazMoW\tp|^W_]`dryjh?!Zsj55PC]TTEVDeDS<]>:6{kfpTafn gj?uBxV}ttaMskb\t)XH\\69<spsjHpqcy$HFnGJQIA\\)KjlgOk\n`\t%mcr_wb8:{[ufbb~qea6@RC^@N%TZy\\Fpvgu(]JTJHQTKLDG@MAe9]M6?w]rJzqx]p@uaj;uf l7mcim)Lc}hNZ!RRmflx&F;\\IZHP@VRYGCOM)Lc}hNZ!RRmflx&q[yZ1=h_tcjcGrmkz"N<ZMcCVEH]T@DMQ!LWtW\tTmGcl|fi5no\tZ!`\t%mcr_wb8<jesarT}hqjXly]\tdygSc\tfs,rYp_8=YCS3{_Lnnhm`z]zi8go^r#IRQDP[~fz[l7{Xvdpp6ikbror%VEZCQgglxlq:q[tW}g7kgjoqn SOWEa]|kFjiehh\n#q[uY"[5GVITQxUnfOes^reu,PGD>Q91?K4Rh{rqn6kgap\'S=P<rpS_r_h(xd|[y4~hwc0hmkmhs\'S=PGritgsfFbmcl[Lhta}-OK]PKAZQO%WIPV3.9W3-D)5-8%E):/90A/:"N\\xK"_;ebki$L^xZI[hV{\\wd0hmkmhs\'SfoXr%o_q]/Cziq$Ug|UnqHkzjgh9n\ti~`\tkfbPgf[xZxEm {Xwfvd4Fthw)\\^zR `wcXap_Rdwchf=_nmipp)Ob\tg8oF3\t\\biMlhlmith5e#cyntpmaRcn\\v^ @s%mcr_wb8@joLhta}-FKU\\\\?jNOIOCNKPP0ChsQkjd{ SBV^XGgTOBjJOFm2aKO*O]|\\{VwZLhta}-FKU\\\\?j>SKQFZ=MC\\$N_$WtWyVTinmv*LLSSaFi>:<rpcmejg?!Zsj56^@hUM[N.7 V`"[}R\t[Ftifw(PDRU]=n9:4.Gmvhclmn>#V{k/BSEbPWTSKTBP7B+Ma _uU}_Oos_ %EMQWYEkI1CP6X4lbgo{+tUx`6FW5VFvrtmwGme3dh_t\nVHFEXlxh9gogueu#NQQYqc|jqW{[~aNugj|+SGjHKGWAbCBRMGQY_IFJLQ_ENRGHM@Z XNW^rZnBfwIjui~#RIf?T7R@aGMVKF]ZNH[2VE-Kelk(ubzb5`p`n+Oalfg8pqs\\s:{]p,rYp_8BjZpSZX!Lgo{^mYPqog!\nP8QRYJLHSTU>HET\nVdfeiHkm~)v^|X _-Ki\\l[YZyWkS"T7kgjoqn X`nbo>rkbbeld(zVr[3?tWr`Ua|qobrn\\Z|Xr%o_q]/GqYnWZa#eld0jijk X`nboD if_q=y_zi3bl`vgq+Pklb47O<^:mDR:UGSFbH[9J"UasX7CQ?]JKB_ZZHa:a@PLc>RFXD\\?U9;Axcg*XOU7PN]B\\8l@OQXJX=`>TDf@^7N+Pk|fl]n\\~b}_;ebki$R\\vZhj5YtgYqqpwq\tdpJp\'|Rz\\-Mj^v]~ZjdJS}ijr0hmkmhs\'Y_tdpifcr;dh!Vx$uS|X5Nxaz`ub~o|Zw_r[Fpvgu(xZs]{Z;CjxoavqOb~o|n{V{kt,rYp_8EfotW}g[dsqmpzI{_kms6"\\or2:X<NANDNQ_;JRG(X^\tapi~Ksb!\\trYhg[\nZJll`"!WNPA4Mkfqj|fo_p\\Fjiehh\nIncp`v!w`oa4Mkfqj|fo_p\\ScwgxloZY_t[}Z7kgjoqn [jsg!V\t<wcrl1QQ7P?[QUB[BG[IQe:ZMM>m>\\LTCc<RQZ!Uez["\\xm0jijk [mols_ Xugsf1fqcljo\t_enrgj|^z]ziMh|_rZugsfDpm^qWi^t8\tdpp6KUBP\'Zksdreu_xarhOdsdlU"\\xmEhwpk9 `xm<?\\EF*TjhmqcyW{[~aLnpjm`z]ziVb e;ebki$Sl{ejh{k]bmdNe{q4blho%^focjaO]|=~Zi[ufxTu-ko]pkfa`|btjvehNpYw`{gr7|fwXwsk_iqufLqkbzRocf,p]qa\n]1F|ewF~au_zfvhtjx\'|Rz\\-NykkM WxYy[\tgrnpKxqocyn8es_tki*VLF>`BKJv`t6q`pcmB|Yyo8<]?aIPJcEDMW!WJJ6pgjBj]vkk`Pqog!\n[FOC0JW=Piqi[dpa|oqn|+tUx`6Kb4VZfRvYqm|dwj5`p`n+TPKMkY}>yg|Vpkjmr&o_z\\y^3Dc6[sr?wkzft]\tmw_tJpsv[h(zVr[3Dc6[srOmkjY})v^|X _-PiYg[najI{dtTv-p]ub2Fp\\nZp]rJupiYp>q[fksfaXjcgn6kgap\'\\^t]rZu,h]o_\nZUhvbte}x0jijk ]`pesT %flyehlmij$sW}Z}g.NmcrYno8b 6$kflwaefq#sWtW;Enenakq4gpo8es_tki*V]pi\nZUbhkqTlj0hmkmhs\'\\^~`\tkjlkGemqg{[y }Tvd.Nmpvcyno\'zV{^uf0KYAMcnchftW]qcj{cufxGsl!\ny\\oex`/Mb<K;I^tamDnaubth9N`@m7R9MCR<bG[9JUK;U9NQGJKB2GaBP>Tf{ZHCp]p_zi3bl`vgq+UROCub\tAk\\sF\t`Fjiehh\n#q[uY"[5RXCU^y_Pgofs_ %TTKWXHUIdJ`BTR^RGN[MG7PJXNa69JWETYwb_Zl$W3c;\\DI[UL\\9_JiKS=9JWETYwb_Zl7yUPU|-R=\\EY9RZWHd6aF`PID/Mb<UW{ZbXp@t_Zbr"[<^Aa6TVVLOFRQZ!XLNBpgqRgcKiugpKkmv\n]8UFW=JYMGHUH4b\n\\UILiqnGpbMn\ngrkpOyYglminYHT!!w`oa4P\\;[\\~aaVtCjlilrLqa3FHFWFNFaHQKKHZZ\\>Z~`MHNelkMq\\Q_uW"b_dtpq`g`L]}\'|Rz\\-QZ?S[\n]X[n>xansqRmoz]n\\vKs];GBRLKHAk8QEZ7_4]G.O^DVU\tc]^u=vju,p]qa\n]1Ild$\\ldYkzhkf9gogueu#Tfejh^MgwW\n4#Yodt*qp\\]pr8es_tki*W`dlqYFhyS\'5~ehaz+rYyb~a:DuXsch9ulmnGkmXte7mcim)Y\\lmo]e`\tbfp2dhhsim"Zf~ejfgIikg[pm8es_tki*Wlucz\\3chfr[7mcim)Yh}dx`<d}cjr2fdgq!Xjy[}Z7steu+rYyb~a:D pmcW`h_\nAni{ {Xwfvd4Qkl\tO|Zq\\PlfJmkw(xZs]{Z;GrlgNikmY~)xZ{V9Kpsg`1fqcljo\tcejbmA~bth9>KIbF_@OEcHK;_:1Jyg!gncVuxby"tn]\\\nZ}kVPP&q[yZ1Jyg!gncWNT+rYyb~a:F?=/MX@HLk:WHVD;HRDxavq4APOKX[2`B-SVAHl~dw$sW}Z}g.QZFKf}j|\' enZlRvYf_X^r_{\tdFKHukkexcyj\tlW_aiblw^hl^Zxksf=ajlg(]pkfL^~b#R `pl2fdgq![J[DtZrnp*tbt[\tc6OwUrfUpe[nFuhy$sW}Z}g.SM?M@j^yf~crjtchWw_#izhlQ!&}b0?WJVFPN]>RP_>C?cK6NOTIN[%n8aS.Sm_Gg~`w[zj;:pktao_Qgwey !gjbmPz^iYWdwb!~d\\c?wkhgna~$Yg}grlgAzouf9gogueu#Xcf9vmqbgb\n $Tuhf]|b4blho%eVo>M0Ggpj ijHl`sX{hpcKlthps~\'OE\\DJAc;ROZIJHf4d9ODT[QKJ9c\'a^p8Y)DmqhxnqGjdkW \\wfEkvqkl\t)MH^JlIF?HWEOR;JHf4XAMHPC4TkVRG<<}^}lucV]q^qgndn5~a}dzp6BR9X@XMm2_IBWc:X@R:WUI;]7RMI(_bh;W-Mh{a!kfPifg_~^s]Ja}gnwv*NOGAP=_?T6_#Xcf?O,Odrf|ftEnmfazft[Njxmsi %N?\\WVBM9JHfEcB[@IAg?RCNFiLWKR#Xcf?O,Odrf|ftEnmfazft[Njxmsi %N?\\WWLMCX<VD\\RODG@J>I?jDXMSCY<BTI<b=[BUEU7]G\\+YajDR&]`x]scvehAsfw_#i3;S7\\8WSa=ZOGMj=_?T6_#Xcf?O,^ZsZldxapBqj|b~h9A\\:[6OLGDIJb;`IF9O?TA]^INMBTS^Dd>:HrYHJ6JhhpZw_uYRbwsgt|+S5cZ]>`GRI`UEAWY`>R;VGc\n`ddCT/XYy_okw_t:plx]{n:INCLAdGhDZLQOK87Ro[U=?Iflh]ucz\\Heuftk}-WJQCUFXZLE]4XVBAXAY?kJS?MAa@hHP@Q@KG7Ro[U=?Iflh]ucz\\Heuftk}-WJQCUFXZLNT7RI`@MFGCZ<1MlTV?;Qgjlbx]ybMh|erou,YFVCSCJ:f;]G5Vg^OI8Fpin^\nZ{^Dmrlhr\n#q[uY"[5Vg^OIXYy_okw_t:plx]{n:7TESQe8L1.Sm_M@]`x]scvehAsfw_#i3BP@T4[+YajDRFpin^\nZ{^Dmrlhr\n#TDLQ\\<WTU[KLTG_<XMm4\\CPP0Oh\\SAW[uVtermi?wkzY"o8I]=f>PLcGI@_:YU\\@XG\\+YajDRFpin^\nZ{^Dmrlhr\n#W=I3C\n`ddCTOkbo`|b|XPforipw(_6RFS7n6XUGNIDK b`lDweNejkelliz:{[uf=>NXWL4TkVVd~:|ZzXugsfHpqcy$uS|X5Vg^Sfz7^NU^&W\tXncwJxfq#sWtW;JnaMe|@YGX\\~kwi;]smq>oimi8(Hd T!-navdz\\7Ro[YZ Ks_rklnuds;}W}g7@V[\\>X;PO6PsSX`uRvYqmuineu7$Xws0IWRY9OMK@:HrYLgxLu[zhnjpa}8\tdpp6ikbror%eVoJpao]w(OATIP@V\n`ddOw`qY\t)xZ{V9NsgxYefqHyhlS|7necqtq]ftook<_ndf*\\EOB\niuHlc#X|s0HW>J=YB6Qa=aGsmg]vm{g3dh_t\njorhq`ghtjx<oTu\\/GHDH&meubpUpgrnp?i`nY9PZ=OERIF?HQ/[|eq_jS"\\xmE]kek"xj#:rU;ebki$dj|anYhfxbwBc_pb4g!\\z<oTu\\/jifjnt!ffw^xVjskkv@gWs`8n~Unkf,rYp_8Wwe~eteRmvazcgWp)Nb RocfBvYjO|atWk {Xwfvd4`gWs`}\'rVy\\uc2dhhsim"jSr[nr0dip4blho%qRp_fq2edno]3bl`vgq+e]kekg9jz^|\ny\\oex`/]tgtcl rfr-navdz\\7^rk}^r%dqm&q[yZ1Yod~`n-il}?kbncwZ\n\\veh,gjdmt<ukWd~Vnru*tbt[\tc6\\vc|df,pgd^`^r[z {Xwfvd4`nfzho\'|e})429&j_\nDw_n[}TuFwelbVUr`8es_tki*g`uiyZ3mlT!gxqg*qkyhlgv\'zV{^uf0[kl{bj$~Wqf}nta6lt8zrxe}RqGsmkjhm\t#fZkD#_nr0hmkmhs\'ma\n`z\\/uiZvn{gj$v`Sb\nmnkiaVfzb|^ d;[jqtYw]t#q[uY"[5bjnwjk"!`ll!`\t\\/mr<rqzatWkB bpqgo{+j]~kkmqY;ebki$fb~dr[5itU|sqnm+ubOj gz`n[Qps_u_\th3]lfahudu*tbt[\tc6\\vc|df,{]em\ndw[5a}7xvphw^jD}jqksd\n%i_wDlm\nZs[y {Xwfvd4`nfzho\'$Vojumv]1iz9tmu^~TmOtkookg~)|^{`"\\Mgwlhhqg3bl`vgq+ehqmhclmn=oen%epshH`rZhj3U~a|nna6akV\nb8es_tki*ggqm{aj$ld b{-navdz\\7^yg `y\\/evgxj:cfcl\trbwrqhm+mfzpz<}]yXqqi\\1fqcljo\trbwrqhm+rcr)v^|X _-asfvixZ3chdzGrlghqkk"w`x`!Y9Zplwgo_:hhhlW}fqnv*tbt[\tc6\\}_\nfmc2llgq#q[uY"[5bqj{lrY9osfsD Xnn2dhhsim"jd\'c}n0o}_z`p)n^qc%gu,rYp_8Xwowf~!|tdptb4Yy^|r~e;cflklk&og~f{a=f~avhm+mYy`|Z!VX\\z,rYp_8Ym-nSF_qhjh6tx]\t`vg<_ndf*havjmih^Lhta}-p]ub2Y"ook|Ry%BbhKh[~XmFya$\\mdt*tbt[\tc6^%erio_p&Lm_ZfhjZ_exuk`moOb~okezVq%upgLkl{iybl "elAkjl+sY\tcy]wkr#gcx[k(zVr[3X#_uRenmbt s0v^s_Bk4h9&zluij$uS|X5gko|lxm9ayk$R\t[/jifjnt!m_zf~e!-taxigWpN~Z!V;cflklk&uci[\tWs7K+kjlb~Yo?L\'rR Xc_w]v(xZs]{Z;\\|Rg_}ok7zi~^%e9bq/6n9sme9_5i \\}dnj6ikbror%z[n.kdhnf]:lw_{W{a7kgjoqn x\\!<}_{\\drmgqm\\ZwIld$X{+oavrhU})\nb Zocf*qg}L`8X[zexbwCgokood\tdyg<_ndf*rYycsVyey pcyMcim)tU dqZ!`\t%dmscl_QcfXsWs\nw`xeo^zc})mksUreugedv(~ZvkpdtH|dtImaoU\tdyg<]rehrl$q[!^lW{a !rrRnwquWzgRZ|Uy\\sPi_lm\nZw[k }Tvd.jiso[loyk<^\nDbvXgx]tEt_uf!\nw`xeo^zc})z^\n^vjtgsfv(}jjh\n }Tvd.jiso[loyk<a|`orijHhmWq[k\t}T\thi]|lx"}`{nsd DfbmYN_$H~i{W|4lbgo{+tUx`6gogv^brsj1mqg{_jWfb{jgn6`ub\tmyezV\t%plijui~!sW}[vT}nt*{bxjt^oP}cx\\s,ggqn~dqbld=bwrv]|bi\\liq^:_nmjeelrl:hjh}[rX`ntgmo4g\t\\|m[V\njbeik1fqcljo\t~cnm0hmkmhs\'yis_QXu_fYv_:cfcl\t~ekhvqu?xc!nok<gritgsf/i~^jd{S"\\xm.lmolc}hkgqV;ZmcejP_mhzhle=ajlg(xbxZzmwZ|Tr%o_zaj[\n^td5f~=\\NP*tbt[\tc6iscsfskeff_:cflpYpgrnp*|vvY7k|b|e;ebki$sl{buj5`p`n+u]up{br<|\'qR{Jim{&q[yZ1ijd~_uA{*tbt[\tc6lqc|cmRs&o_z\\y^3etg]hoawrz"w`x`!Y9jfrXap_{jy$uS|X5rram`nG#i~asdvj/aeff_x#q[uY"[5rram`nG#i~asdvj/eilYiuXji5^tapsj({mkYnc]r|eu\\tgw&s_zYndn\t$\\|tch^fkk{j|m<Yr`hfx$yc\tjfb][tjyntp6mg[pGo_!~"`tsedYcqlueyf=jrcvd4tkVLkz\'sb!Xmq2fdgq!|[i]xgL`p_miGbthkmw`{=s_q]1hmbj"~Wq^rsTayrkg\tAsesD%jucq&o_z\\y^3itUthvNmpu` `VhqRy=jjiK|m\nZrKY>=_nmipp)}Ymfsmaar\\dfKjdgyVw$sW}Z}g.sm_q]\tNz^sTuIfas_qc\n^tdLd b{-p]ub2kp]ub!D}\\falJh]{\\s_{[~aNugj|+I5[O_KW?TVQFEKH&$VsZlj=c~anekCkU\tp|^<Ur]bsplEl{lx[yB bvovE{>r`zro]<_ndf*}Yq^qm3f|T{\\lEg]|rxY9bomW^n^fQmrh(xZs]{Z;ljmfa\n+vimgs\\TVnkvpi&lmPZkW|^"5{nyomo4`piqmv~%Xobip1j Wq_j8tT}tta6fyG\t\\~b evZtCrYefqY3dh_t').split(a.f.a([71])), bb = Sa.length, Ga, Ta = [];
                            for (Ga = 0; Ga < bb; Ga++)
                                Ta.push(c(Sa[Ga], Ra.contentWindow));
                            Ma = a.f.a(Ta);
                        } else
                            Ma = '';
                        ab.is = Ma;
                        l.iv = 8;
                        l.qt = A;
                        l.gz = a.c.ap() ? 1 : 0;
                        l.hh = a.c.aq() ? 1 : 0;
                        l.hn = a.c.ar() ? 1 : 0;
                        var cb = l, Na;
                        try {
                            Na = !a.g.d(window.top) && window.top.name ? a.f.m(window.top.name.substring(0, 50 > window.top.name.length ? window.top.name.length : 50)) : '';
                        } catch (q) {
                            Na = '';
                        }
                        cb.tw = Na;
                        void 0 !== K && (l.qc = K);
                        void 0 !== F && (l.qd = F);
                        l.qf = m;
                        l.qe = p;
                        l.qh = n;
                        l.qg = I;
                        l.qm = y;
                        l.qa = a.c.w;
                        l.qb = a.c.x;
                        l.qi = a.c.u;
                        l.qj = a.c.v;
                        var db = l, Ua, Ha = [];
                        try {
                            var eb = a.f.a([
                                    47,
                                    40,
                                    34,
                                    28,
                                    30,
                                    44,
                                    84,
                                    34,
                                    39,
                                    34,
                                    45,
                                    30,
                                    29,
                                    84
                                ]), fb = a.f.a([
                                    17,
                                    46,
                                    39,
                                    19,
                                    26,
                                    44,
                                    36
                                ]), gb = a.f.a([
                                    2,
                                    26,
                                    39,
                                    28,
                                    30,
                                    37,
                                    19,
                                    26,
                                    44,
                                    36
                                ]), hb = 'undefined' !== typeof window[fb], ib = 'undefined' !== typeof window[gb];
                            Ha.push('undefined' !== typeof window[eb] ? 1 : 0);
                            Ha.push(hb ? 1 : 0);
                            Ha.push(ib ? 1 : 0);
                        } catch (q) {
                        }
                        Ua = Ha.join('');
                        db.to = Ua;
                        l.po = d();
                        var jb = l, Va, kb = a.f.a([
                                28,
                                26,
                                39,
                                47,
                                26,
                                44
                            ]), Wa = a.f.a([
                                48,
                                30,
                                27,
                                32,
                                37
                            ]), lb = a.f.a([
                                30,
                                49,
                                41,
                                30,
                                43,
                                34,
                                38,
                                30,
                                39,
                                45,
                                26,
                                37
                            ]), mb = a.f.a([
                                22,
                                4,
                                1,
                                6,
                                11,
                                84,
                                29,
                                30,
                                27,
                                46,
                                32,
                                84,
                                43,
                                30,
                                39,
                                29,
                                30,
                                43,
                                30,
                                43,
                                84,
                                34,
                                39,
                                31,
                                40
                            ]), nb = a.f.a([
                                20,
                                13,
                                12,
                                0,
                                18,
                                10,
                                4,
                                3,
                                84,
                                21,
                                4,
                                13,
                                3,
                                14,
                                17,
                                84,
                                22,
                                4,
                                1,
                                6,
                                11
                            ]), ob = a.f.a([
                                20,
                                13,
                                12,
                                0,
                                18,
                                10,
                                4,
                                3,
                                84,
                                17,
                                4,
                                13,
                                3,
                                4,
                                17,
                                4,
                                17,
                                84,
                                22,
                                4,
                                1,
                                6,
                                11
                            ]), pb = a.f.a([
                                47,
                                30,
                                39,
                                29,
                                40,
                                43
                            ]), qb = a.f.a([
                                43,
                                30,
                                39,
                                29,
                                30,
                                43,
                                30,
                                43
                            ]), rb = a.f.a([
                                28,
                                43,
                                30,
                                26,
                                45,
                                30,
                                4,
                                37,
                                30,
                                38,
                                30,
                                39,
                                45
                            ]), Xa = a.f.a([
                                32,
                                30,
                                45,
                                2,
                                40,
                                39,
                                45,
                                30,
                                49,
                                45
                            ]), sb = a.f.a([
                                32,
                                30,
                                45,
                                4,
                                49,
                                45,
                                30,
                                39,
                                44,
                                34,
                                40,
                                39
                            ]), Ya = a.f.a([
                                32,
                                30,
                                45,
                                15,
                                26,
                                43,
                                26,
                                38,
                                30,
                                45,
                                30,
                                43
                            ]), Oa = {};
                        try {
                            var Za = document[rb](kb), Pa = Za[Xa](Wa) || Za[Xa](lb + '-' + Wa), $a = Pa[sb](mb);
                            Oa[pb] = Pa[Ya]($a[nb]);
                            Oa[qb] = Pa[Ya]($a[ob]);
                        } catch (q) {
                        }
                        Va = a.f.m(a.f.q(Oa));
                        jb.vy = Va;
                        b && (l.mst = b);
                        if (H)
                            try {
                                document.body.removeChild(H);
                            } catch (q) {
                            }
                        return a.a.i(l);
                    };
                }(v));
                (function (a) {
                    function k(b) {
                        var c = a.f.v(!0);
                        (b = a.s.b(35, b, c, !1, !0)) && b.res && a.ag.a('DOMlessLLD', q[a.f.af], 'https://geo.moatads.com/n.js?' + b.res.querystring);
                    }
                    function g(b) {
                        var c = a.f.v(!0);
                        b = 'https://geo.moatads.com/n.js?' + a.s.b(35, b, c, !1, !0).res.querystring;
                        a.ag.b('data', 'MoatDataJsonpRequest', b);
                    }
                    a.f.t = !1;
                    a.f.u = [];
                    a.f.g = {};
                    a.f.g.a = 'appendSpecifics';
                    a.f.g.f = 'appendManual';
                    a.f.g.c = 'onlyHooman';
                    a.f.g.e = 'onlyBot';
                    a.f.g.d = 'onlyNonHiddenAd';
                    a.f.g.b = 'pixelType';
                    var e = {};
                    (function () {
                        a.c.eg() && a.l.e(function () {
                            try {
                                a.c.e.navigator.getBattery().then(function (a) {
                                    e.charging = a.charging;
                                    e.level = a.level;
                                })['catch'](function (a) {
                                });
                            } catch (b) {
                            }
                        }, 1000);
                    }());
                    a.f.v = function (b) {
                        var c;
                        try {
                            q._c && !a.a.u(q._c, 1) ? c = q._c : (c = a.af.a(), q._c = c);
                        } catch (f) {
                            c = a.af.a();
                        }
                        if (void 0 === b || !1 === b)
                            c.ql = a.f.w, c.qo = a.f.x;
                        c.qr = a.f.y();
                        e && 'undefined' !== typeof e.charging && a.a.dc(e.level) && (c.vf = e.charging ? 1 : 0, c.vg = 100 * e.level);
                        return c;
                    };
                    var c = a.f.a([
                            48,
                            30,
                            27,
                            29,
                            43,
                            34,
                            47,
                            30,
                            43
                        ]), d = a.f.a([
                            30,
                            47,
                            26,
                            37,
                            46,
                            26,
                            45,
                            30
                        ]), b = a.f.a([
                            43,
                            30,
                            44,
                            41,
                            40,
                            39,
                            44,
                            30
                        ]), f = [
                            c,
                            d
                        ].join('-'), h = [
                            f,
                            b
                        ].join('-');
                    try {
                        a.f.w = a.f.m(a.f.q(a.c.e.navigator.plugins, 'name'));
                    } catch (r) {
                    }
                    a.f.y = function () {
                        return 0;
                    };
                    a.f.x = 0;
                    a.f.z = function () {
                    };
                    var l = 'nu ib dc ob oh lt ab n nm sp pt'.split(' ');
                    a.f.aa = function (b, c, f) {
                        if ((a.f.g.a in c || a.f.g.f in c) && void 0 === a.f.e)
                            return !1;
                        var d = a.a.i(a.f.e);
                        void 0 === d.n && a.ac.a(f) && (d.n = 1);
                        a.f.g.a in c ? a.a.forEach(l, function (a, c) {
                            b = a in d ? b + ('&' + a + '=1') : b + ('&' + a + '=0');
                        }) : a.f.g.f in c && a.a.forEach(l, function (c, f) {
                            a.a.ax(a.f.g.f, c) && (b = c in d ? b + ('&' + c + '=1') : b + ('&' + c + '=0'));
                        });
                        return a.f.g.c in c && a.f.g.d in c ? a.f.f(f) ? a.f.i(b) : !1 : a.f.g.c in c ? 0 === a.f.ab ? a.f.i(b) : !1 : a.f.g.e in c ? 1 === a.f.ab ? a.f.i(b) : !1 : a.f.i(b);
                    };
                    a.f.i = function (b) {
                        new a.c.e.Image().src = b;
                        return !0;
                    };
                    a.f.ac = function (b, c) {
                        b(a.f.ab);
                    };
                    a.f.h = function (a, b, c) {
                        x.add(a, b, c);
                    };
                    a.f.ad = function (b, c) {
                        if (void 0 === a.f.ab)
                            return a.f.u.push({
                                callback: b,
                                opts: c
                            });
                        a.f.ac(b, c);
                    };
                    a.f.ae = function () {
                        for (var b = 0; b < a.f.u.length; b++)
                            if (a.f.u.hasOwnProperty(b)) {
                                var c = a.f.u[b];
                                a.f.ac(c.callback, c.opts);
                            }
                    };
                    a.f.ag = function (b) {
                        if (q) {
                            a.f.af = 'gna' + w.floor(1000000 * w.random());
                            var c;
                            q[a.f.af] = function (b) {
                                a.f.ah = new z() - a.f.ai;
                                c = b;
                                q[a.f.af] = null;
                                delete q[a.f.af];
                                c && (a.f.e = c, q.jsonpcache = c, a.f.ab = 'n' in a.f.e ? 1 : 0, x.checkPixels(), a.f.ae());
                            };
                            a.f.ai = new z();
                            a.l.f(function () {
                                a.f.aj = new z() - a.f.ai;
                            }, 0);
                            if (q.jsonpcache)
                                q[a.f.af](q.jsonpcache);
                            else
                                k(b);
                        }
                    };
                    a.f.ak = function (b, c) {
                        var f = a.f.v();
                        a.ah && a.ah.a && a.ah.a.imaSDK ? b.moatClientLevel3 && a.s.b(34, b, f, !1, !0) : a.s.b(34, b, f, !1, !0);
                    };
                    a.f.al = function (b) {
                        var c = a.a.ea(b);
                        if (!0 !== a.f.am) {
                            a.f.am = !0;
                            a.f.ak(b);
                            a.f.ag(b);
                            a.f.z();
                            a.a.dv({ all: !0 }, c) && g(b);
                            var d = function () {
                                    var c = {};
                                    c.qr = a.f.y();
                                    c.qo = a.f.x;
                                    a.s.b(36, b, c);
                                }, e = a.c.e.document;
                            a.l.c(e, f, function (b) {
                                a.l.d(e, f, null, 'mswe');
                                a.f.y = function () {
                                    return 1;
                                };
                                d();
                            }, 'mswe');
                            a.l.c(e, h, function (b) {
                                a.l.d(e, h, null, 'mswer');
                                a.f.y = function () {
                                    return 1;
                                };
                                d();
                            }, 'mswer');
                        }
                    };
                    a.f.an = function () {
                        var b = a.c.e.document;
                        a.l.d(b, f, null, 'mswe');
                        a.l.d(b, h, null, 'mswer');
                    };
                    a.f.f = function (b) {
                        return 0 == a.f.ab && !1 === a.ac.a(b);
                    };
                    a.f.ao = function (a) {
                        return a && 'object' === typeof a && 'n' in a;
                    };
                    a.f.ap = function () {
                        var a;
                        a = w && w.sinh ? 10000000000 * (w.sinh(w.sinh(w.sinh(w.sinh(1)))) - 3.81278003) : -2;
                        a = a.toString();
                        return 0 === a.indexOf('7.600') ? a.substring(5) : -1;
                    };
                    var x = function () {
                        function b(a, c, f) {
                            this.pixel = a;
                            this.opts = c;
                            this.adNum = f;
                        }
                        function c() {
                            a.a.forEach(f, function (b, c) {
                                a.f.aa(b.pixel, b.opts, b.adNum) && (a.ab.a.a(b.adNum, b.opts.pixelType), delete f[c]);
                            });
                        }
                        var f = {};
                        a.k.a.azsx('hiddenAds:updated', c);
                        return {
                            add: function (d, e, h) {
                                d = new b(d, e, h);
                                e = a.a.dj();
                                f[e] = d;
                                c();
                            },
                            checkPixels: c
                        };
                    }();
                    a.k.a.azsx('allLocalAdsKilled', a.f.an, { once: !0 });
                }(v));
                (function (a) {
                    function k(b) {
                        var c = {
                            window: 0,
                            transparent: 1,
                            opaque: 2,
                            direct: 3,
                            gpu: 4
                        };
                        if ('EMBED' === b.tagName)
                            var d = a.a.getAttribute(b, 'wmode');
                        else if ('OBJECT' === b.tagName) {
                            b = b.getElementsByTagName('param');
                            for (var e = 0; e < b.length; e++) {
                                var g = b[e], k = a.a.getAttribute(g, 'name'), g = a.a.getAttribute(g, 'value');
                                if ('wmode' === k) {
                                    d = g;
                                    break;
                                }
                            }
                        }
                        return d && c[d.toLowerCase()] || 5;
                    }
                    function g(b) {
                        try {
                            if (!b)
                                return !1;
                            var c = b, d;
                            if ('DIV' === c.tagName || 'A' === c.tagName)
                                (c = b.getElementsByTagName('EMBED')[0]) || (c = b.getElementsByTagName('OBJECT')[0]), c || (c = b.getElementsByTagName('IMG')[0]), c || (c = b);
                            1 === c.nodeType && 'IMG' !== c.nodeName && 'EMBED' !== c.nodeName && 'OBJECT' !== c.nodeName && (c = b.getElementsByTagName('EMBED')[0] || b.getElementsByTagName('OBJECT')[0] || b.getElementsByTagName('IMG')[0] || b);
                            if ('OBJECT' === c.tagName) {
                                for (var e = 0; e < c.children.length; e++)
                                    if ('movie' === c.children[e].name || 'Movie' === c.children[e].name)
                                        d = c.children[e].value;
                                c.object && c.object.Movie ? d = c.object.Movie : c.data && -1 !== c.data.indexOf('swf') && (d = c.data);
                            }
                            'EMBED' !== c.tagName && 'IMG' !== c.tagName || !c.src || (d = c.src);
                            d || (d = a.a.bf(c));
                            var g = a.aa.a(d, c);
                            if (!d)
                                for (var k = a.d.f.a, c = 0; c < k.length; c++) {
                                    var t = k[c](b);
                                    t && (d = t);
                                }
                            return {
                                adURL: d,
                                flashVars: g
                            };
                        } catch (u) {
                            return !1;
                        }
                    }
                    function e(b) {
                        var c = b.el, d = b.url, e = b.flashVars, x = b.adIds, r = a.a.ea(x);
                        this.getFormat = function () {
                            return r;
                        };
                        new z().getTime();
                        this.ao = x;
                        this.FIND_AD_TRIES = x.numTries || 0;
                        var t = g(c);
                        if (t && t.adURL && e)
                            for (var u in t.flashVars)
                                t.flashVars.hasOwnProperty(u) && (e[u] = t.flashVars[u]);
                        t && t.flashVars && (e = t.flashVars);
                        if ('string' !== typeof d || 'div' === d.toLowerCase() || 'a' === d.toLowerCase())
                            d = t && t.adURL || '-';
                        d && 0 !== d.toLowerCase().indexOf('http:') && 0 !== d.toLowerCase().indexOf('https:') && ('//' === d.substring(0, 2) ? d = window.location.protocol + d : '/' === d[0] ? d = window.location.protocol + '//' + window.location.host + d : (t = window.location.pathname.split('/').slice(0, -1).join('/'), d = window.location.protocol + '//' + window.location.host + '/' + t + (t ? '/' : '') + d));
                        'IFRAME' !== c.tagName && 'IMG' !== c.tagName && -1 === d.indexOf('googlesyndication') && (d = d.split('?')[0]);
                        this.zr = x.adNum;
                        this.MMAK_ID = x.mmakAdKey ? x.mmakAdKey : 'm' + this.zr;
                        this.yg = a.a.dj();
                        this.TAGID = a.c.az;
                        a.p.h(this.yg, a.c.ax.a);
                        B[this.zr] = this;
                        a.d.i(this.zr, [c]);
                        this.ae = d;
                        this.aa = c;
                        a.k.a.zaxs('adElementUpdate');
                        this.isInIframe = (this.WINDOW = d = a.a.be(this.aa)) && d != d.parent;
                        this.proxyTrackingEnabled = this.isSREMeasurable = !1;
                        this.debugData = {
                            version: '3',
                            trueVisiblePercent: null,
                            update: function (a) {
                                this.trueVisiblePercent = a;
                            },
                            getValue: function () {
                                var a;
                                a = 'number' === typeof this.trueVisiblePercent ? w.round(100 * this.trueVisiblePercent) : '-';
                                return this.version + ':' + a;
                            }
                        };
                        this.setDimensions = function () {
                            var b;
                            b = new a.t.j(c);
                            this.INITIAL_WIDTH = parseInt(b.width);
                            this.INITIAL_HEIGHT = parseInt(b.height);
                        };
                        this.setDimensions();
                        'undefined' === typeof e && (e = {});
                        a.p.l(pa);
                        this.eg = [];
                        this.ee = {};
                        a.v.e.a(this);
                        a.v.f.a(this);
                        a.z.b(this);
                        this.DfpSlot = x.trackedFromDfpHeaderTag && x.slotMappingId ? a.al.a()[x.slotMappingId] : a.al.b();
                        a.a.dv({ all: 30 }, r) && a.am.a(this);
                        this.get_width = function () {
                            return x.initWidth ? x.initWidth : this.INITIAL_WIDTH ? this.INITIAL_WIDTH : !1;
                        };
                        this.get_height = function () {
                            return x.initHeight ? x.initHeight : this.INITIAL_HEIGHT ? this.INITIAL_HEIGHT : !1;
                        };
                        this.getScreenRealEstate = function () {
                            var b, c, d = a.c.w, f = a.c.x;
                            b = this.INITIAL_WIDTH;
                            c = this.INITIAL_HEIGHT;
                            return d && f && b && c ? w.max(0, w.min(1, b * c / (d * f))) : 0;
                        };
                        a.x.f(this);
                        a.ab.u(this.zr, this.ao);
                        this.ag = e;
                        this.ai = 0;
                        this.an = this.am = this.al = this.ak = this.aj = void 0;
                        this.ar = [];
                        this.as = [];
                        this.at = [];
                        this.av = this.au = a.r.a.a.a;
                        this.ax = a.r.a.b.a;
                        this.ay = a.r.a.c.a;
                        this.ba = this.az = a.r.a.d.a;
                        this.bb = a.r.a.e.a;
                        this.by = this.bx = this.bw = this.bv = this.bu = this.bt = this.bs = this.br = this.bq = this.bp = this.bo = this.bm = this.bl = this.bk = this.bi = this.bh = this.bg = this.bf = this.be = this.bd = this.bc = void 0;
                        this.ca = this.bz = !1;
                        this.cb = this.cu = this.ct = void 0;
                        this.cc = +new z() + 120000;
                        this.ci = +new z();
                        this.cl = this.cm = void 0;
                        this.cn = 0;
                        this.ck = a.r.a.f.a;
                        this.cd = !1;
                        this.cy = void 0;
                        this.dt = !1;
                        this.db = void 0;
                        this.cf = this.ce = !1;
                        this.af = Number(this.ef);
                        this.eq = !1;
                        this.ds = this.ch = this.dr = this.cg = 0;
                        this.dq = this.bn = void 0;
                        this.IR5 = {
                            MIN: {
                                x: void 0,
                                y: void 0
                            },
                            MAX: {
                                x: void 0,
                                y: void 0
                            },
                            AREA: 0
                        };
                        this.dm = 0;
                        this.ep = this.dd = !1;
                        this.aq = {};
                        this.aq.g = 0;
                        this.aq[1] = 0;
                        this.aq[2] = 0;
                        this.aq[3] = 0;
                        this.aq[13] = 0;
                        this.aq[0] = 0;
                        this.aq[4] = 0;
                        this.aq[5] = 0;
                        this.aq[6] = 0;
                        this.aq[7] = 0;
                        this.aq[9] = 0;
                        this.aq[8] = 0;
                        this.aq[15] = 0;
                        this.aq[16] = 0;
                        this.aq[21] = 0;
                        this.aq[22] = 0;
                        this.aq[23] = 0;
                        this.aq[37] = 0;
                        this.aq.tc = 0;
                        this.aq[46] = 0;
                        this.es = [
                            5,
                            10,
                            15,
                            30,
                            60
                        ];
                        this.doa = [
                            5,
                            10,
                            15,
                            30,
                            60
                        ];
                        this.wasEverInView = this.isCurrentlyTransparent = this.isCurrentlyStacked = void 0;
                        this.aq[14] = 0;
                        this.an = b.adType || b.opt_props && b.opt_props.adType || a.d.d(c);
                        0 === this.an && (this.WMODE = k(c));
                        a.a.bw(this.aa);
                        b.opt_props && b.opt_props.components && (this.components = b.opt_props.components, this.isCompositeAd = !0);
                        var m = !0;
                        this.disableMeasurability = function () {
                            m = !1;
                        };
                        this.enableMeasurability = function () {
                            m = !0;
                        };
                        this.isMeasurabilityDisabled = function () {
                            return !1 === m;
                        };
                        this.viewabilityMethod = {};
                        this.viewabilityPercent = {
                            strict: '-',
                            sframe: '-',
                            pscope: '-'
                        };
                        this.isValidAdSize = function () {
                            return a.a.bu(this.aa);
                        };
                        a.k.a.zaxs('adInitialized', this);
                        a.d.h(this);
                    }
                    function c(b, c) {
                        for (var d = 0, e = c.length; d < e; d++)
                            a.j.f(b, c[d]);
                    }
                    var d = !0;
                    a.d = {};
                    a.d.f = {};
                    a.d.g = function (b, c, d, l, g, r, t) {
                        r || a.f.al(g);
                        var u;
                        u = 1 == arguments.length ? arguments[0] : {
                            el: b,
                            url: c,
                            flashVars: l,
                            adIds: g,
                            opt_props: t
                        };
                        if (r) {
                            if ('function' === typeof r)
                                return r(b, c, l, g);
                            new z();
                            r.em = !0;
                            B[r.zr] = r;
                            b[J] = r.zr;
                            b[G] = !0;
                            r.aa = b;
                            a.k.a.zaxs('adElementUpdate');
                            r.INITIAL_WIDTH = b.offsetWidth;
                            r.INITIAL_HEIGHT = b.offsetHeight;
                            r.ae = c;
                            r.an = a.d.d(b);
                            0 === r.an && (r.WMODE = k(b));
                            r.ag = l || {};
                            a.j.c(r);
                            u = { e: 0 };
                            u.q = r.aq[0]++;
                            a.s.a(r, u);
                            a.k.a.zaxs('adLoaded', r);
                            return r;
                        }
                        return B[g.adNum] ? B[g.adNum] : new e(u);
                    };
                    a.d.h = function (b) {
                        b.de = isNaN(b.ao.startTime) ? +new z() : b.ao.startTime;
                        b.RAND = b.ao.rand;
                        new z().getTime();
                        a.u.c(b);
                        a.c.c || a.ai.a.a();
                        a.j.c(b);
                        b.aa.parentNode && 'swiffycontainer' === b.aa.parentNode.id && a.aj.a(['..../../iframe ~ #clicktag'], b, b.aa.parentNode);
                        a.k.a.zaxs('startAdTracking', b);
                        b.dd = !0;
                        var c = { e: 0 };
                        c.q = b.aq[0]++;
                        a.s.a(b, c);
                        a.ak.a(b);
                        a.k.a.zaxs('adLoaded', b);
                    };
                    a.d.f.a = [];
                    a.d.b = function () {
                        var b, c;
                        for (c in B)
                            B.hasOwnProperty(c) && (b = B[c]) && !b.ep && a.x.g(b);
                    };
                    a.d.e = function (b) {
                        var c = +new z(), d = c - b.ci;
                        if (0 < b.doa.length) {
                            var e = 1000 * b.doa[0];
                            if (b.counters.laxDwell.tCur >= e) {
                                b.doa.shift();
                                var g = b.es.length ? b.es[0] : 60;
                                if (e < g)
                                    return !1;
                                if (5000 < d)
                                    return !0;
                            }
                        }
                        return 0 < b.es.length && (g = 1000 * b.es[0], a.u.i(b, g)) ? (b.es.shift(), !0) : 0 === b.doa.length && c > b.cc ? (b.cc *= 2, !0) : !1;
                    };
                    a.d.i = function (a, c) {
                        for (var d = 0; d < c.length; d++) {
                            var e = c[d];
                            e[J] = a;
                            e[G] = !0;
                        }
                    };
                    a.d.d = function (a) {
                        return 'IFRAME' === a.tagName ? 2 : 'IMG' === a.tagName ? 1 : 'EMBED' === a.tagName || 'OBJECT' === a.tagName ? 0 : 3;
                    };
                    a.d.j = function (b, c) {
                        a.a.a(c.cc);
                        a.d.k(c);
                    };
                    a.d.l = function (b, c) {
                        a.d.a(c) && a.k.a.sxaz('adNotFound', { id: b });
                    };
                    a.d.a = function (b, c) {
                        var d = 0, e;
                        for (e in B)
                            B.hasOwnProperty && B.hasOwnProperty(e) && d++;
                        return d <= (c || 0) ? (a.k.a.esgf('allLocalAdsKilled'), !0) : !1;
                    };
                    a.d.m = function (a) {
                        a.ep = !0;
                        delete B[a.zr];
                        try {
                            a.aa && (a.aa[G] = null, a.aa[J] = null, a.aa = null, a.DfpSlot = null);
                        } catch (c) {
                        }
                        a.groupmV2 = null;
                        a.groupmV3 = null;
                        a.periscopeManager = null;
                        a.secondaryCounters = null;
                        a.mouseEventElements = null;
                        a.publicis = null;
                    };
                    a.d.k = function (b) {
                        if (b && b.video && !b.video.started)
                            return !1;
                        var c = { e: 21 };
                        c.q = b.aq[21]++;
                        var d;
                        a.ab && a.ab.p && (d = a.ab.p(b, 'unload'));
                        'string' === typeof d && (c.ff = d);
                        a.s.a(b, c);
                        b.unloadPixelSent = !0;
                    };
                    a.d.n = function (a) {
                        return a && a.video;
                    };
                    a.k.a.azsx('adKilled', a.d.j, { includeId: !0 });
                    a.k.a.azsx('adNotFound', a.d.l, { includeId: !0 });
                    a.d.o = c;
                    a.d.p = function (b, d, e, g, k, r, t, u) {
                        var m = { area: 0 };
                        a.a.forEach(b, function (b) {
                            var c = new a.t.j(b);
                            c.area = c.height * c.width;
                            c && c.area >= m.area && (m = b, m.area = c.area);
                        });
                        k.adFindingMethod = 'MULTIPART_ADS';
                        if (d = a.d.g(m, d, e, g, k, r, t))
                            return d.isMultipartAd = !0, d.multipartComponents = b, a.a.h(u) && u.length === b.length ? c(d, u) : c(d, b), d;
                    };
                    a.d.q = function (b, d, e, g, k, r, t, u) {
                        t = t || {};
                        t.components = b;
                        k.adFindingMethod = 'COMPOSITE_ADS';
                        if (d = a.d.g(b[0], d, e, g, k, r, t))
                            return d.isCompositeAd = !0, d.components = b, a.a.h(u) && u.length === b.length ? c(d, u) : c(d, b), d;
                    };
                    a.d.r = function () {
                        d = !1;
                    };
                    a.d.s = function () {
                        d = !0;
                    };
                    a.d.c = function () {
                        return !1 === d;
                    };
                }(v));
                (function (a) {
                    function k(a) {
                        var c = [];
                        if ('string' !== typeof a)
                            return !1;
                        for (var e, g = !1, k = /(.*?[^\\])(?:\\\\)*\//; a;) {
                            if (d(a, '.../'))
                                e = '.../';
                            else if (d(a, '...../'))
                                e = '...../';
                            else if (d(a, '../') || d(a, '..../')) {
                                e = d(a, '../') ? '../' : '..../';
                                for (var t = e.length; d(a.substring(t), e);)
                                    t += e.length;
                                e = a.substring(0, t);
                            } else
                                d(a, '=>/') ? e = '=>/' : d(a, '-/') ? e = '-/' : d(a, '+/') ? e = '+/' : d(a, '$[') ? (e = a.length, t = b(a, ']/') + 2, e = a.substring(0, w.min(e, t))) : d(a, '^/') ? e = '^/' : d(a, 'IN_IFRAME/') ? e = 'IN_IFRAME/' : d(a, 'IN_X_FRAME/') ? e = 'IN_X_FRAME/' : (d(a, '${') ? (e = a.length, t = b(a, '}/') + 2, e = a.substring(0, w.min(e, t))) : e = (g = k.exec(a)) && g[0] ? g[0] : a, g = !0);
                            (a = a.substring(e.length)) && g && (e = e.substring(0, e.length - 1), g = !1);
                            c.push(e);
                        }
                        return c;
                    }
                    function g(b) {
                        if (!b)
                            return !1;
                        if (!a.c.j || 10 < a.a.s() || b.querySelectorAll && b.querySelector && (!b.MoatQSShimSet || b[c]))
                            return !0;
                        b.querySelector = function (a) {
                            a = this.querySelectorAll(a);
                            return a.length ? a[0] : null;
                        };
                        b.querySelectorAll = function (a) {
                            var b = [], c = this.ownerDocument || document, d = c.createElement('style');
                            (c = c.getElementsByTagName('head')[0]) && c.insertBefore(d, c.childNodes[w.max(c.childNodes.length - 1, 0)] || null);
                            d && d.styleSheet && (d.styleSheet.cssText = a + '{shimtest:bar}');
                            a = this.getElementsByTagName('*');
                            for (var c = a.length, f = 0; f < c; f++)
                                a[f].currentStyle && 'bar' === a[f].currentStyle.shimtest && (b[b.length] = a[f]);
                            d.parentNode.removeChild(d);
                            return b;
                        };
                        b.MoatQSShimSet = !0;
                        return b[c] = !0;
                    }
                    function e(b, c, e) {
                        function x(a) {
                            if (m && 0 < m.length)
                                for (var b = m.length, c = 0; c < b; c++)
                                    a = a.replace('$' + c, m[c]);
                            return a;
                        }
                        var r = function (b, c) {
                            if (!b || !c)
                                return !1;
                            if (b.matches)
                                return b.matches(c);
                            if (!g(b.parentNode))
                                return !1;
                            var d = b.parentNode.querySelectorAll(c);
                            if (!d || !d.length)
                                return !1;
                            var f = !1;
                            a.a.forEach(d, function (a) {
                                a === b && (f = !0);
                                return !f;
                            });
                            return f;
                        };
                        b = k(b);
                        if (!b)
                            return !1;
                        for (var t = c, u = 0, m = [], p = function (b) {
                                    return b && a.g.b(b);
                                }, n = function (a) {
                                    return a && a.parentElement;
                                }, I = function (b) {
                                    return b ? (b = a.g.e(b)) && b.body : !1;
                                }, K = function (a, b, c) {
                                    return a ? (a = a.getAttribute(b)) && (c = new RegExp(c).exec(a)) && c.length && 0 < c.length ? c[c.length - 1] : !1 : !1;
                                }, F = 0; F < b.length && 100 > u; F++) {
                            var y = b[F];
                            d(y, '${') && (y = y.substring(2, y.length - 1));
                            if (d(y, '../') || d(y, '..../')) {
                                var H, D;
                                d(y, '../') ? (H = '../', D = n) : (H = '..../', D = p);
                                if (0 !== y.length % H.length)
                                    return !1;
                                for (var O = 0; O < y.length / H.length; O++) {
                                    if (!t || 'HTML' === t.nodeName)
                                        return !1;
                                    t = D(t);
                                    u++;
                                }
                            } else if ('.../' === y)
                                for (y = b[F + 1] && x(b[F + 1]); 100 > u;) {
                                    if (t && r(t, y)) {
                                        F++;
                                        break;
                                    }
                                    if (!t || 'HTML' === t.nodeName)
                                        return !1;
                                    t = t.parentElement;
                                    u++;
                                }
                            else if ('...../' === y) {
                                t = a.c.e && a.c.e.document && a.c.e.document.body;
                                if (!t)
                                    return !1;
                                u++;
                            } else if ('=>/' === y) {
                                t = I(t);
                                if (!t)
                                    return !1;
                                u++;
                            } else if ('-/' === y) {
                                t = a.a.previousElementSibling(t);
                                if (!t)
                                    return !1;
                                u++;
                            } else if ('+/' === y) {
                                if (t = a.a.nextElementSibling(t), !t)
                                    return !1;
                            } else if (d(y, '$['))
                                if (y = (H = (y = y.substring(2, y.length - 2)) && y.split('|')) && H[0], H = H && H[1], y && H)
                                    if (y = K(t, y, H))
                                        m.push(y), u++;
                                    else
                                        return !1;
                                else
                                    return !1;
                            else if ('^/' === y) {
                                t = c;
                                if (!t)
                                    return !1;
                                u++;
                            } else if ('IN_IFRAME/' === y) {
                                if (!a.c.p)
                                    return !1;
                                u++;
                            } else if ('IN_X_FRAME/' === y) {
                                if (!a.c.em)
                                    return !1;
                                u++;
                            } else if (y = x(y), !r(t, y)) {
                                if (!g(t))
                                    return !1;
                                t = t.querySelectorAll(y);
                                if (e && F === b.length - 1)
                                    return t ? t : !1;
                                if (!t || 1 !== t.length)
                                    return !1;
                                t = t[0];
                            }
                        }
                        return t;
                    }
                    a.aj = {};
                    var c = 'MoatQSShimOrd_REDVENTURES_GAM_HEADER1_' + a.c.bj, d = function (a, b) {
                            return 0 === a.indexOf(b) && b;
                        }, b = function (a, b) {
                            var c = a.indexOf(b);
                            return 0 > c ? a.length + 1 : c;
                        };
                    a.aj.b = function (b, c) {
                        var d = [];
                        a.a.forEach(b, function (a) {
                            (a = e(a, c)) && d.push(a);
                        });
                        return d;
                    };
                    a.aj.c = function (b, c) {
                        var d = [];
                        a.a.forEach(b, function (a) {
                            if (a = e(a, c, !0))
                                for (var b = 0; b < a.length; b++)
                                    d.push(a[b]);
                        });
                        return d;
                    };
                    a.aj.a = function (b, c, d) {
                        b = a.aj.b(b, d);
                        a.a.forEach(b, function (b) {
                            a.j.f(c, b);
                        });
                        return !!b;
                    };
                }(v));
                (function (a) {
                    function k(b, c, d, f, e, h) {
                        h || (h = window);
                        a.an.b = b;
                        var g = a.an.e, l = a.an.f, m = a.an.g, k = 0, n = function () {
                                var e;
                                c.numTries = k++;
                                if (a.c.en && a.an.c(n, null, c) || a.c.eo && a.an.c(n, null, c) || a.g.j(h) && h.ebCfg && 43 == h.ebCfg.formatId && 1 == h.ebCfg.dlm && (a.c.ep = !0, a.an.c(n, null, c)))
                                    return !0;
                                if (!e)
                                    try {
                                        l && (e = l(b, c, d, f, null, h));
                                    } catch (m) {
                                    }
                                if (!e && (e = g(b, c, d, f, null, h), !0 === e))
                                    return !0;
                                var p;
                                (p = e && !0) && a.a.forEach(a.an.a.a, function (a) {
                                    if (a && 'function' === typeof a)
                                        try {
                                            a(e);
                                        } catch (b) {
                                        }
                                });
                                return p;
                            };
                        e = a.a.bind(null, function (b) {
                            a.s.b(11, b);
                        }, c);
                        a.l.k(n, m, 500, e);
                    }
                    function g(b, c, d, f, e) {
                        var h, g, l, m, n = a.c.e.document.getElementById('eyeDiv');
                        if (N && N.id && 0 <= N.id.indexOf('ebebDnlScript')) {
                            var k = N.id.split('_');
                            k && 3 === k.length && (l = k[1], m = k[2]);
                        }
                        l = l || e.ebAdID;
                        m = m || e.ebRand;
                        l && m && (g = l + '_' + m);
                        if (g && 'object' === typeof e.ebAds && e.ebAds[g] && (m = e.ebAds[g].visibilityMgr && e.ebAds[g].visibilityMgr._res) && a.a.bt(m) && (c.adFindingMethod = 'SIZMEKADS', h = a.d.g(m, m.nodeName, !1, void 0, c, d)))
                            return h;
                        if (h = function () {
                                var b = [], f = a.aj.b(['iframe[id*=\'header_iframe_' + g + '\']'], n)[0], e = a.aj.b(['iframe[id*=\'leftgutter_iframe_' + g + '\']'], n)[0], l = a.aj.b(['iframe[id*=\'rightgutter_iframe_' + g + '\']'], n)[0];
                                if (f)
                                    if (a.a.bt(f))
                                        b.push(f);
                                    else
                                        return !1;
                                if (e)
                                    if (a.a.bt(e))
                                        b.push(e);
                                    else
                                        return !1;
                                if (l)
                                    if (a.a.bt(l))
                                        b.push(l);
                                    else
                                        return !1;
                                if (b && 0 < b.length && (h = a.d.q(b, b[0].nodeName, !1, void 0, c, d)))
                                    return c.adFindingMethod = 'SIZMEKADS-1', h;
                            }())
                            return c.adFindingMethod = a.c.ep ? 'SIZMEKADS-Composite-PL' : 'SIZMEKADS-Composite', h;
                        if (a.c.ep)
                            return !1;
                        if (l && e.gEbBanners && a.a.f(e.gEbBanners)) {
                            var p = !1;
                            a.a.forEach(e.gEbBanners, function (a) {
                                if (a && a.adData && a.adData.nAdID == l)
                                    return p = a, !1;
                            });
                            if (p && (e = p.displayUnit && p.displayUnit.defaultPanel && p.displayUnit.defaultPanel.panelDiv) && e.nodeName && 'div' == e.nodeName.toLowerCase() && (h = u(e, c, d, f)))
                                return c.adFindingMethod = 'SIZMEKADS banner', h;
                        }
                        e = b.getElementsByTagName('div');
                        e = a.a.cg(e);
                        'DIV' === b.nodeName && e.push(b);
                        if (e && 0 < e.length) {
                            var x = [];
                            a.a.forEach(e, function (a) {
                                a && a.id && a.id.match(/ebDiv\d+/) && x.push(a);
                            });
                            if (x && 0 < x.length && a.c.e && a.c.e.document) {
                                var r;
                                a.a.forEach(x, function (b) {
                                    var c = a.c.e.document.getElementById(b.id);
                                    if (c && c !== b)
                                        return r = c, !1;
                                });
                                if (r) {
                                    if (h = u(r, c, d, f))
                                        return h;
                                    if (r && a.a.bt(r) && f(r)) {
                                        if (c.adFindingMethod = 'SIZMEKADS adDvi', h = a.d.g(r, r.nodeName, !1, void 0, c, d))
                                            return h;
                                    } else {
                                        b = r.getElementsByTagName('iframe');
                                        e = r.id.split('ebDiv')[1];
                                        var t = new RegExp('ebBannerIFrame_\\d+_' + e), q;
                                        if (b && 0 < b.length && (a.a.forEach(b, function (b) {
                                                if (b && b.id && b.id.match(t) && a.a.bt(b))
                                                    return q = b, !1;
                                            }), q && f(q) && (c.adFindingMethod = 'SIZMEKADS banner iframe', h = a.d.g(q, q.nodeName, !1, void 0, c, d))))
                                            return h;
                                    }
                                }
                            }
                        }
                        if (g && n && ((f = a.aj.b(['div[id*=\'' + g + '\']'], n)[0]) || (f = a.aj.b(['div[id^=\'eb\'][id*=\'' + g + '\']'], n)[0]), f && ((h = u(f, c, d)) || a.a.bt(f) && (c.adFindingMethod = 'SIZMEKADS-Breakout', h = a.d.g(f, f.nodeName, !1, void 0, c, d)))))
                            return h;
                    }
                    function e(b, c, d, f, e) {
                        function h(b) {
                            return b ? a.aj.b(['div.jpstage'], b)[0] || !1 : !1;
                        }
                        var g = h(b), l = a.c.e.document;
                        f && !g && (g = a.aj.b([
                            '..../../div.jpplatform_' + f,
                            '...../div[id=\'jpplatform_' + f + '\']',
                            '...../div.jpplatform_' + f
                        ], b)[0]);
                        g || (g = h(l.getElementById('jpsuperheader')));
                        g || (g = h(a.a.getElementsByClassName('jpeditorialunit', 'DIV', l.body)[0]));
                        g || (g = h(l.getElementById('jpd_adhesion')));
                        g || (b = (b = l.getElementById('jp_overlay') || f && l.getElementById('jp_overlay_' + f)) && a.a.getElementsByClassName('jppanel', 'DIV', b)) && 1 <= b.length && a.a.forEach(b, function (b) {
                            if (b && a.a.bt(b))
                                return g = b, !1;
                        });
                        g || (l = l.getElementById('jpd_expfooter'), g = h(l));
                        if (g && a.a.bt(g) && e(g) && (c.adFindingMethod = 'JETPACKDIGITALADS', ad = a.d.g(g, g.nodeName, !1, void 0, c, d)))
                            return ad;
                    }
                    function c(b, c, d, f) {
                        if ((b = a.a.getElementsByClassName('originplatform-ad', 'SCRIPT', a.c.q ? b.ownerDocument && b.ownerDocument.documentElement || b : b)[0]) && b.id && (b = b.id.match(/embed_origin_(\d+)/)) && b[1] && (b = 'OriginPlatformAdUnit-' + b[1] + '-inpage', b = document.getElementById(b) || a.c.q && a.c.e.document.getElementById(b)) && (c.adFindingMethod = 'ORIGINADS', c = a.d.g(b, b.nodeName, !1, void 0, c, d)))
                            return c;
                    }
                    function d(b, c, d, f) {
                        var e, h, g, l = b.childNodes, m = !1;
                        for (e = l.length - 1; 0 <= e; e--) {
                            var n = l[e];
                            '#comment' === n.nodeName && /undertone/i.test(n.nodeValue) ? m = !0 : 'STYLE' === n.nodeName && (n = n.innerHTML.match(/(utpga\d+).+/i)) && 2 === n.length && (g = n[1]);
                        }
                        if (m) {
                            e = a.c.q ? (e = a.g.g(b)) && e.ownerDocument ? e.ownerDocument : document : document;
                            g && (h = e.getElementById(g), !h && a.c.q && (h = document.getElementsById(g)));
                            h || (g = e.getElementsByTagName('div'), a.a.forEach(g, function (a) {
                                if (a && a.id && a.id.match('utpga'))
                                    return h = a, !1;
                            }), !h && a.c.q && (g = document.getElementsByTagName('div'), a.a.forEach(g, function (a) {
                                if (a && a.id && a.id.match('utpga'))
                                    return h = a, !1;
                            })));
                            if (h && ((g = u(h, c, d, f)) || a.a.bt(h) && f(h) && (c.adFindingMethod = 'UNDERTONE pageGrabberDiv', g = a.d.g(h, h.nodeName, !1, void 0, c, d))))
                                return g;
                            if ((g = document.getElementById('utbanner') || a.c.q && a.c.e.document.getElementById('utbanner')) && (g = a.g.e(g)) && g.body && (g = u(g.body, c, d, f)))
                                return c.adFindingMethod = 'UNDERTONE fullPageAdIframe', g;
                            if ((g = a.a.getElementsByClassName('ut_container', 'DIV')[0] || a.c.q && a.a.getElementsByClassName('ut_container', 'DIV', a.c.e.document)[0]) && a.a.bt(g) && f(g))
                                return c.adFindingMethod = 'UNDERTONE screenshift', g = a.d.g(g, g.nodeName, !1, void 0, c, d, { adType: 2 });
                            if (d = document.getElementById('eyeDiv') || a.c.q && a.c.e.document.getElementById('eyeDiv'))
                                for (d = d.getElementsByTagName('object'), e = 0; e < d.length; e++)
                                    if (g = d[e], 'fixed' == g.style.position && a.a.bt(g) && f(g))
                                        return c.adFindingMethod = 'UNDERTONE slider', g = a.d.g({
                                            el: g,
                                            adIds: c
                                        });
                        }
                    }
                    function b(b, c, d, f, e) {
                        if ((b = c.tlview_id || c.tlviewID) && (b = document.getElementById(b) || a.c.e.document.getElementById(b)) && a.a.bt(b) && (c = a.d.g(b, b.nodeName, !1, void 0, c, d)))
                            return c;
                    }
                    function f(b, c, d, f, e) {
                        if (b = a.an.k(['[tleid]'], b, c, d))
                            return b;
                    }
                    function h(b, c, d, f, e) {
                        if (e._tlCreatives && 1 === e._tlCreatives.length && e._tlCreatives[0].hook && (c = (b = e._tlCreatives[0].hook) && a.an.k(['-/[tleid]'], b, c, d)))
                            return c;
                    }
                    function l(b, c, d, f, e, h) {
                        var g, l, m, n, k = [];
                        if (g = f ? f : h.Adform && h.Adform.ADFBannerData && 'string' === typeof h.Adform.ADFBannerData.BN && h.Adform.ADFBannerData.BN) {
                            if (f = (b = h.Adform && h.Adform.adRegister) && b[g])
                                m = f.collapsedContent && f.collapsedContent._element, n = f.expandedContent && f.expandedContent._element, l = f.adBox && f.adBox._attributes && f.adBox._attributes.element;
                            l || a.a.forEach(h.Adform && h.Adform.adData, function (a) {
                                if (l = a && a.bn && a.bn == g && a.container)
                                    return !1;
                            });
                            if (m && n && (a.a.bt(m) || a.a.bt(n)) && (c.adFindingMethod = 'ADFORMADS two-element expandable', h = a.d.g(m, m.nodeName, !1, void 0, c, d, { adType: 2 })))
                                return h.adformCollapsedEl = m, h.adformExpandedEl = n, h;
                            if (n && a.a.bt(n) && (c.adFindingMethod = 'ADFORMADS Single-element expandable', h = a.d.g(n, n.nodeName, !1, void 0, c, d, { adType: 2 })))
                                return h;
                            if (l && a.a.bt(l)) {
                                b && a.a.forEach(b, function (b, c) {
                                    if (c && c.indexOf && -1 < c.indexOf(g + '#')) {
                                        var d = b && b.adBox && b.adBox._attributes && b.adBox._attributes.element;
                                        d && d !== l && a.a.bt(d) && k.push(d);
                                    }
                                });
                                if (0 < k.length && (k.unshift(l), h = a.d.q(k, k[0].nodeName, !1, void 0, c, d, { adType: 2 })))
                                    return c.adFindingMethod = 'ADFORMADS composite', h;
                                c.adFindingMethod = 'ADFORMADS-1';
                                if (h = a.d.g(l, l.nodeName, !1, void 0, c, d, { adType: 2 }))
                                    return h;
                            }
                        }
                    }
                    function x(b, c, d, f, e, h) {
                        if (e && h && (f = a.an.k(['div[id=\'ym_' + e + '\'] > iframe/=>/div[id=\'' + h + '\']'], b, c, d)))
                            return c.adFindingMethod = 'YIELDMOADS', f;
                        if (f = a.an.k([
                                '..../iframe[id$=\'_tpi\']/$[id|([0-9]*)_tpi]/../[id=\'$0\']',
                                '..../iframe[id$=\'_tpi\']/../div.ym/$[data-lf-id|([0-9]+)]/iframe/=>/[id=\'$0\']'
                            ], b, c, d))
                            return c.adFindingMethod = 'YIELDMOADS-1', f;
                        if (f = a.an.k(['div.ym/iframe/=>/body/video.video-elem'], b, c, d))
                            return c.adFindingMethod = 'YIELDMOADS-2', f;
                        if (f = a.an.k(['div.ym'], b, c, d))
                            return c.adFindingMethod = 'YIELDMOADS-3', f;
                    }
                    function r(b, c, d, f) {
                        var e = function (a, b) {
                                return a && a.moatObject && a.moatObject[b];
                            }, h = function (b) {
                                return a.aj.b(['div.moat_trackable'], b)[0];
                            }, g = function (b) {
                                return (b = (b = a.g.e(b)) && b.documentElement) && h(b);
                            }, l = function (b) {
                                var c;
                                b = a.an.j(b, a.an.n);
                                a.a.forEach(b, function (a) {
                                    if (c = g(a))
                                        return !1;
                                });
                                return c;
                            }, m = function () {
                                var b = e(n, 'adElement');
                                if (b !== k)
                                    if (a.a.bt(b)) {
                                        var d = p;
                                        k = b;
                                        k[J] = c.adNum;
                                        k[G] = !0;
                                        a.a.bv(k, d, !0);
                                        (b = e(n, 'adProxyElement')) && a.j.f(p, b);
                                    } else
                                        a.a.bu(k) || (b = k, a.x.g(p), n.removeEventListener('adLoaded', m), b[J] = void 0, b[G] = void 0, Aa());
                            };
                        f = function (b) {
                            if (b) {
                                var f = e(n, 'creativeType'), h = e(n, 'adProxyElement');
                                switch (f) {
                                case 'banner':
                                    if (a.a.bt(b)) {
                                        c.adFindingMethod = 'Creative API - Banner';
                                        var g = a.d.g(b, b.nodeName, !1, void 0, c, d);
                                    }
                                    h && a.d.o(g, [h]);
                                    return g;
                                case 'multipart':
                                    if (g = a.d.p(b, 'DIV', !1, void 0, c, d, null, h))
                                        return c.adFindingMethod = 'Creative API - Multipart', g;
                                case 'composite':
                                    if (g = a.d.q(b, 'DIV', !1, void 0, c, d, null, h))
                                        return c.adFindingMethod = 'Creative API - Composite', g;
                                case 'expandable':
                                    return a.a.bt(b) && (c.adFindingMethod = 'Creative API - Expandable', g = a.d.g(b, b.nodeName, !1, void 0, c, d), h && a.d.o(g, [h]), n.addEventListener('adLoaded', m)), g;
                                }
                            }
                        };
                        var n = function (b) {
                            if (a.c.eo)
                                return a.c.eo;
                            var c = h(b);
                            c || (c = l(b));
                            c || (a.c.p ? (c = a.g.b(b), c = g(c)) : c = void 0);
                            if (!c)
                                a: {
                                    if (a.c.q && (b = a.g.g(b))) {
                                        var c = a.a.be(b) === a.c.e, d = a.c.c && 'BODY' === b.nodeName;
                                        if (!c || !d) {
                                            c = h(b);
                                            break a;
                                        }
                                    }
                                    c = void 0;
                                }
                            c && (a.c.eo = c);
                            return c;
                        }(b);
                        if (n) {
                            if (!e(n, 'adLoaded'))
                                return !1;
                            var k = e(n, 'adElement');
                            if (!k)
                                return !1;
                            var p = f(k);
                            return p ? p : !1;
                        }
                    }
                    function t(b, c, d, f) {
                        var e = function (b) {
                            return a.aj.b([
                                'div.celtra-ad-v3',
                                'div.celtra-ad-v4'
                            ], b)[0];
                        };
                        f = function (b, c) {
                            var d, f = a.an.j(b, a.an.n);
                            a.a.forEach(f, function (b) {
                                if (b.offsetWidth * b.offsetHeight === c)
                                    return d = a.g.e(b).body, !1;
                            });
                            return d ? d : !1;
                        };
                        var h = function () {
                                var c, d = a.an.j(b, a.an.n);
                                a.a.forEach(d, function (b) {
                                    if ((b = (b = a.g.e(b)) && b.documentElement) && e(b))
                                        return c = e(b), !1;
                                });
                                return c;
                            }, g = function () {
                                if (a.c.q) {
                                    var c = a.g.g(b);
                                    if (c) {
                                        var d = a.a.be(c) === a.c.e, f = a.c.c && 'BODY' === c.nodeName;
                                        d && f || (celtraDiviInParentFrame = e(c));
                                    }
                                }
                            }, l;
                        a.c.en ? l = a.c.en : ((l = e(b)) || (l = h()), l || (l = g()));
                        var m;
                        l && (m = l && l.celtra && l.celtra.viewabilityObservee);
                        if (m && a.a.bt(m))
                            return c.adFindingMethod = 'Celtra API', c = a.d.g(m, m.nodeName, !1, void 0, c, d), d = a.a.ct(c), (m = f(m, d)) && a.j.f(c, m), c;
                        l && !m && (a.c.en = l);
                        return !1;
                    }
                    function u(b, c, d, f) {
                        f = f || function () {
                            return !0;
                        };
                        if (!b)
                            return !1;
                        var e = a.aj.b(['div.voxAdData'], b)[0];
                        if ((e = e && e.elementToTrack) && a.a.bt(e))
                            return c.adFindingMethod = 'Vox API', a.d.g(e, e.nodeName, !1, void 0, c, d);
                        var e = a.a.s(), h = null !== e && 11 > e;
                        if (!h)
                            for (var g = b.getElementsByTagName('embed'), e = 0; e < g.length; e++) {
                                var l = g[e];
                                if (!0 !== l[G] && -1 === l.id.indexOf('moatPx') && a.a.bt(l) && l.getAttribute('src') && f(l)) {
                                    var m = l.getAttribute('src');
                                    f = a.aa.a(m, l);
                                    c.adFindingMethod = 'AOL-1';
                                    return m = a.d.g(l, m, !1, f, c, d);
                                }
                            }
                        for (var n = b.getElementsByTagName('object'), e = 0; e < n.length; e++)
                            if (g = n[e], a.a.bt(g) && f(g) && ('undefined' === typeof g[G] || !0 !== g[G]) && -1 == g.id.indexOf('moatPx')) {
                                for (var k = 0; k < g.children.length; k++)
                                    if ('movie' === g.children[k].name || 'Movie' === g.children[k].name)
                                        if (m = g.children[k].value, !m || !m.match('scorecardresearch'))
                                            for (var p = 0; p < g.children.length; p++) {
                                                if (!h && 'EMBED' === g.children[p].tagName) {
                                                    l = g.children[p];
                                                    if ('undefined' !== typeof l[G] && !0 === l[G] || -1 != l.id.indexOf('moatPx'))
                                                        continue;
                                                    if (a.a.bt(l) && f(l))
                                                        return f = a.aa.a(m, l), c.adFindingMethod = 'AOL Embed', m = a.d.g(l, m, !1, f, c, d);
                                                }
                                                if ('OBJECT' === g.children[p].tagName && (l = g.children[p], a.a.bt(l) && !0 !== l[G] && -1 === l.id.indexOf('moatPx') && f(l)))
                                                    return c.adFindingMethod = 'AOL Object', m = a.d.g(l, void 0, !1, void 0, c, d);
                                            }
                                g.object && g.object.Movie ? m = g.object.Movie : g.data && (m = g.data);
                                if (!m || !m.match('scorecardresearch'))
                                    return f = a.aa.a(m, g), c.adFindingMethod = 'SWF ads', m = a.d.g(g, m, !1, f, c, d);
                            }
                        if (m = a.an.m(b, c, d, f))
                            return m;
                        m = b.getElementsByTagName('img');
                        for (e = 0; e < m.length; e++)
                            if (h = m[e], ('undefined' === typeof h[G] || !0 !== h[G]) && a.a.bt(h) && (l = h.getAttribute('src')) && '' !== l && -1 === document.location.href.indexOf(l) && f(h))
                                return c.adFindingMethod = 'Standard Image Ad finding ', a.d.g(h, l, !1, void 0, c, d);
                        if (b = (m = b.getElementsByTagName('canvas')) && m[0]) {
                            if (1 === m.length && a.a.bt(b))
                                return c.adFindingMethod = 'AKQAGAPGEN Canvas', c = a.d.g(b, b.nodeName, !1, void 0, c, d);
                            if (1 < m.length) {
                                if (f(b.parentNode) && a.a.bt(b.parentNode))
                                    return c.adFindingMethod = 'AKQAGAPGEN-1', c = a.d.g(b.parentNode, b.parentNode.nodeName, !1, void 0, c, d);
                                if (a.a.bt(b) && (c.adFindingMethod = 'AKQAGAPGEN-2', c = a.d.g(b, b.nodeName, !1, void 0, c, d)))
                                    return a.c.p ? a.aj.a(['.../body'], c, b) : a.aj.a(['../div'], c, b), c;
                            }
                        }
                        return !1;
                    }
                    function m(b, c) {
                        var d = [];
                        if (!b)
                            return d;
                        for (var f = a.a.f(b) ? b : b.getElementsByTagName('iframe'), e, h = 0; h < f.length; h++)
                            if (e = f[h], !e[G]) {
                                var g = a.g.e(e) ? !1 : !0;
                                (1 === c && g && a.a.bt(e) || 2 === c && !g) && d.push(e);
                            }
                        return d;
                    }
                    a.an = {};
                    a.an.a = {};
                    a.an.a.a = [];
                    a.an.b = void 0;
                    a.an.c = function (b, c, d) {
                        return a.c.av.adFindingTimeout ? (a.a.a(a.c.av.adFindingTimeout), a.c.av.adFindingTimeout = null, c || (c = function () {
                            a.s.b(11, d);
                        }), a.l.k(b, 9999, 500, c), !0) : !1;
                    };
                    a.an.d = function () {
                        var b = arguments;
                        a.focus.pageIsPrerendered() ? a.k.a.azsx('noLongerPreRendered', function (a) {
                            k.apply(this, b);
                        }, { once: !0 }) : k.apply(this, b);
                    };
                    a.an.m = function (b, c, d, f) {
                        f = f || function () {
                            return !0;
                        };
                        b = m(b, 1);
                        if (b[0] && a.a.bt(b[0]) && f(b[0]))
                            return c.adFindingMethod = 'findIframeAds', a.d.g(b[0], b[0].src, !1, void 0, c, d);
                    };
                    a.an.a.b = [];
                    a.an.l = function (b, c, d, f, e) {
                        var h, g;
                        f = a.an.j(f || b, a.an.n);
                        for (e = 0; e < f.length; e++) {
                            g = f[e];
                            var l = a.g.e(g);
                            if (l && l.documentElement) {
                                a: {
                                    h = b;
                                    for (var m = c, n = d, k = g, p = l, x, r = a.an.a.b, t = 0; t < r.length; t++)
                                        if (x = r[t](h, m, n, k, p)) {
                                            m.adFindingMethod = 'override file friendly iframe hooks';
                                            h = x;
                                            break a;
                                        }
                                    h = void 0;
                                }
                                if (h)
                                    return h;
                                a: {
                                    h = c;
                                    m = d;
                                    if (g.id && g.id.match('ebBannerIFrame') && a.a.bt(g) && (h.adFindingMethod = 'sizmek banner iframe', g = a.d.g(g, g.nodeName, !1, void 0, h, m))) {
                                        h = g;
                                        break a;
                                    }
                                    h = void 0;
                                }
                                if (h)
                                    return h;
                                if (h = a.an.k(['[id=\'ad\']'], l.documentElement, c, d))
                                    return c.adFindingMethod = 'ad', h;
                                if (h = u(l.documentElement, c, d))
                                    return c.adFindingMethod = 'Domsearch friendly iframe', h;
                                if (h)
                                    return h;
                                if (h = a.an.o(l.documentElement, c, d))
                                    return c.adFindingMethod = 'Domsearch again in friendly iframe', h;
                            }
                        }
                    };
                    a.an.o = function (b, c, d) {
                        var f;
                        b = a.an.j(b, a.an.n);
                        for (var e = 0; e < b.length; e++)
                            if (f = b[e], (f = a.g.e(f)) && f.documentElement && (f = u(f.documentElement, c, d)))
                                return f;
                    };
                    a.an.i = function (a, b, c) {
                        return !1;
                    };
                    a.an.p = function (b, c) {
                        if (!ha && !1 !== b.shouldKillAd) {
                            var d = new z().getTime() - c.ao.startTime;
                            !0 !== c.em && !0 !== c.preventTryFindingAdAgain && 5000 > d && (a.an.q(c), b.shouldKillAd = !1);
                        }
                    };
                    var p = a.k.a.azsx('beforeAdKilled', a.an.p);
                    a.k.a.azsx('allLocalAdsKilled', function () {
                        a.k.a.sxaz('beforeAdKilled', { id: p });
                    }, { once: !0 });
                    a.an.r = function (a) {
                    };
                    a.an.q = function (b) {
                        if (!0 !== b.em) {
                            delete B[b.zr];
                            a.a.a(b.cc);
                            b.periscopeManager && b.periscopeManager.killAllPixels();
                            var c;
                            (c = N && N.parentNode) && a.an.d(c, b.ao, b, void 0, function () {
                                a.x.g(b);
                            }, void 0);
                        }
                    };
                    a.an.k = function (b, c, d, f) {
                        b = a.aj.b(b, c);
                        var e;
                        a.a.forEach(b, function (b) {
                            if (a.a.bt(b))
                                return e = b, !1;
                        });
                        if (e)
                            return b = a.a.bf(e) || e.src || 'DIV', d.adFindingMethod = 'DOMSEARCH', a.d.g(e, b, !1, void 0, d, f);
                    };
                    var n = function (b, c, d, f, e, h) {
                        d = a.aj.b(c, d);
                        d = a.a.filter(d, a.a.bt);
                        if (d.length >= (h ? c.length : 1))
                            return c = a.a.bf(d[0]) || d[0].getAttribute('src') || 'DIV', b(d, c, !1, void 0, f, e);
                    };
                    a.an.s = function (b, c, d, f, e) {
                        return n(a.d.q, b, c, d, f, e);
                    };
                    a.an.t = function (b, c, d, f, e) {
                        return n(a.d.p, b, c, d, f, e);
                    };
                    a.an.h = u;
                    a.an.e = function (m, n, k, p, u, q) {
                        a.g.d(q) && (q = window);
                        q || (q = window);
                        u = u || function () {
                            return !0;
                        };
                        var v = a.an.h, w = a.an.i;
                        if ('undefined' === typeof m)
                            return !1;
                        if (a.c.p && 'HEAD' === m.tagName) {
                            var A = m.parentNode;
                            'HTML' === A.tagName && (A = A.getElementsByTagName('body'), 0 < A.length && (m = A[0]));
                        }
                        if (A = t(m, n, k, u))
                            return A;
                        if (a.c.en)
                            return !1;
                        if (A = r(m, n, k, u))
                            return A;
                        if (a.c.eo)
                            return !1;
                        if (A = a.an.k(['[id=\'ad\']'], m, n, k))
                            return n.adFindingMethod = 'DOM Id = ad', A;
                        if (A = a.an.k(['../body/ins[class=\'dcmads\'][data-dcm-rendering-mode=\'script\']'], m, n, k))
                            return n.adFindingMethod = 'DCM ins', A;
                        if (A = a.an.k([
                                'div.teads-player/iframe',
                                'div[id^=\'playArea\']'
                            ], m, n, k))
                            return n.adFindingMethod = 'teads', A;
                        if (A = a.an.k(['div.avalanche'], m, n, k))
                            return n.adFindingMethod = 'avalanche', A;
                        if (A = a.an.k([
                                '.bt-viewability-tag',
                                '..../../.bt-viewability-tag'
                            ], m, n, k))
                            return n.adFindingMethod = 'BidtellectAd', A;
                        if (A = g(m, n, k, u, q))
                            return A;
                        if (a.c.ep)
                            return !1;
                        if (A = n && n.ntvDomSearch)
                            return m = a.a.getElementsByClassName(A), m = a.a.filter(m, a.a.bt), 1 < m.length && (A = a.d.q(m, 'DIV', !1, void 0, n, k)) ? (n.adFindingMethod = 'NativoAds composite ads', A) : 1 === m.length && (n.adFindingMethod = 'NativoAds single ad', A = a.d.g(m[0], m[0].nodeName, !1, void 0, n, k)) ? A : !1;
                        if (A = a.an.k([
                                'div.str-adunit',
                                '[data-str-native-key]',
                                '[data-str-sibling]',
                                '..../../[data-str-native-key]'
                            ], m, n, k))
                            return n.adFindingMethod = 'Sharethrough', A;
                        if (A = a.an.k([
                                '.../[data-gg-moat]/[data-gg-moat-ifr]',
                                '.../[data-gg-moat]',
                                '[data-gg-moat]'
                            ], m, n, k))
                            return n.adFindingMethod = 'GumGum', A;
                        var A = (A = a.c.p ? m.ownerDocument.documentElement : m) && A.getElementsByTagName('script'), z = {}, B, C;
                        A && 0 < A.length && (z.jpd = /ads\.jetpackdigital\.com\/lineitems\/(\d+)\/jpd/, z.adform = /adform\.(?:com|net)\/adfscript\/?\?bn=([0-9]+)/, z.quartz = /ads\.qs\.com/, z.yieldmo = /ads\.yieldmo\.com\/.*\&p=([0-9]+).*\&lf=([0-9]+)/, z.yieldmo2 = /static\.yieldmo\.com\/ym\.[a-z0-9]{2}\.js/, a.a.forEach(A, function (a) {
                            for (var b in z)
                                if (z.hasOwnProperty(b)) {
                                    var c = a && a.getAttribute('src');
                                    if (c && (B = c.match(z[b])))
                                        return C = b, !1;
                                }
                        }));
                        a.aj.b([
                            '.../[class*=\'jpeditorialunit\']',
                            '.../[class*=\'jpbanner\']',
                            '.../[id*=\'jpplatform\']',
                            '.../[id*=\'jpd_adhesion\']'
                        ], m)[0] && (C = 'jpd');
                        if (C && 'jpd' === C && (A = e(m, n, k, B && B[1], u)) || (A = c(m, n, k, u)) || C && 'adform' === C && (A = l(m, n, k, B && B[1], u, q)))
                            return A;
                        if (A = b(m, n, k, u, q))
                            return n.adFindingMethod = 'TRIPLELIFTADS: Moat script query string logic - ' + (n.tlview_id ? 'tlview_id' : 'tlviewID'), A;
                        if (A = f(m, n, k, u, q))
                            return n.adFindingMethod = 'TRIPLELIFTADS: Domsearch tleid attribute', A;
                        if (A = h(m, n, k, u, q))
                            return n.adFindingMethod = 'TRIPLELIFTADS: Domsearch based on window', A;
                        if (A = a.an.k([
                                '[id=\'qzad\']',
                                'div#qzc-container'
                            ], m, n, k))
                            return n.adFindingMethod = 'Quartz', A;
                        p = A = '';
                        C && a.a.ax([
                            'yieldmo',
                            'yieldmo2'
                        ], C) && (A = B && B[1], p = B && B[2]);
                        if (A = x(m, n, k, u, A, p))
                            return A;
                        if (q = q.weborama_display_tag && q.weborama_display_tag.mediapath) {
                            A = /https?:\/\/([0-9a-zA-Z\.\/]+)/;
                            q = q.match && q.match(A)[1];
                            p = a.aj.c(['...../div[id^=\'scr_\'][id*=\'remotediv\']'], m);
                            for (var G = 0; G < p.length; G++)
                                if (A = a.an.k([
                                        '${[src*=\'' + q + '\']}',
                                        '+/${[src*=\'' + q + '\']}'
                                    ], p[G], n, k))
                                    return n.adFindingMethod = 'Weborama', A;
                        }
                        if ((A = w(m, n, k)) || (A = v(m, n, k, u)))
                            return A;
                        if (A = a.an.l(m, n, k))
                            return n.adFindingMethod = 'friendly iframe', A;
                        if (p = a.g.g(m))
                            if (A = a.an.l(p, n, k))
                                return n.adFindingMethod = 'find iframe parent', A;
                        if (a.c.q || p)
                            if (p = p || a.g.g(m))
                                if (q = a.a.be(p) === a.c.e, A = a.c.c && 'BODY' === p.nodeName, !q || !A) {
                                    if (A = w(p, n, k))
                                        return n.adFindingMethod = 'iframe parent expandable', A;
                                    if (A = v(p, n, k, u))
                                        return n.adFindingMethod = 'iframe parent findAd', A;
                                }
                        return (A = d(m, n, k, u)) ? (n.adFindingMethod = 'Undertone', A) : (A = a.an.k([
                            '../iframe#verve-banner',
                            '.../body/iframe#verve-expandable/=>/div.content',
                            '.../body/iframe#verve-expandable',
                            'iframe#verve-banner/=>/div.content',
                            'iframe#verve-banner'
                        ], m, n, k)) ? (n.adFindingMethod = 'Verve', A) : !1;
                    };
                    a.an.j = m;
                    a.an.u = 1;
                    a.an.n = 2;
                    a.an.v = 500;
                    a.an.g = 20;
                    a.an.w = {
                        object: 1,
                        embed: 1,
                        img: 1,
                        iframe: 1
                    };
                }(v));
                (function (a) {
                    function k(g, e, c, d) {
                        var b = {};
                        g = g.replace(/&amp;/g, '&').replace(/(^\s+|\s+$)/g, '');
                        for (var f = g.split('&'), h = 0; h < f.length; h++) {
                            var l = f[h].split('=');
                            if ('string' === typeof l[1]) {
                                l[0] && l[0].match('moatClient') && (b['rawM' + l[0].slice(1)] = l[1]);
                                var k = l, r, t = r = l[1];
                                try {
                                    for (var u = 0; 100 > u && (r = decodeURIComponent(r), t != r) && !r.match(/^http(s)?\:/); u++)
                                        t = r;
                                } catch (m) {
                                }
                                r = r.replace(/(^\s+|\s+$)/g, '');
                                k[1] = r;
                            } else
                                l[1] = '';
                            b[l[0]] = l[1];
                        }
                        a.ao.h(b);
                        a.ao.f(b, e);
                        'undefined' !== typeof c && (b.clientZone = 'undefined' !== c ? c : '');
                        a.k.a.zaxs('getAdIdentifiersFromQueryString', b, g, e, c, d);
                        return b = a.ao.i(b);
                    }
                    a.ao = {};
                    a.ao.a = {};
                    a.ao.a.a = [];
                    a.ao.b = function (g, e) {
                        if (!g)
                            return !1;
                        if ('undefined' === typeof g.startTime || e)
                            g.startTime = a.c.bj;
                        if ('undefined' === typeof g.rand || e)
                            g.rand = w.floor(w.random() * w.pow(10, 12));
                        'undefined' === typeof g.adNum && (g.adNum = q.zr, q.zr++);
                    };
                    a.ao.c = function (g, e) {
                        if (!g)
                            return !1;
                        var c = a.a.aa();
                        a.a.ao();
                        decodeURIComponent(c);
                        return g;
                    };
                    a.ao.d = function (g, e) {
                        var c = a.ao.e(g, e);
                        c && (c._AD_FORMAT = e);
                        a.k.a.azsx('adInitialized', function (c) {
                            var b = c.DfpSlot;
                            c = c.ao;
                            if (b) {
                                a.a.ea(c);
                                c.fullAdUnitPath = a.al.c(b);
                                c.dfpSlotId = a.al.d(b);
                                for (var b = a.al.e(b), f = 0; f < b.length; f++)
                                    c['dfpAdUnitLabel' + f] = b[f];
                            }
                        });
                        c && a.a.forEach(a.ao.a.a, function (a) {
                            a(c);
                        });
                        a.k.a.zaxs('getIds', c, g, e);
                        return c;
                    };
                    a.ao.e = function (a, e) {
                        try {
                            var c = a.className, d = a.getAttribute('src');
                            c.split('\n').join(' ');
                            if (-1 !== c.indexOf('moatfooter'))
                                return !1;
                            var b = d.split('?'), f = d.split('#'), c = !1;
                            1 < b.length && 1 < f.length && b[1].length < f[1].length && (c = !0);
                            if (1 == b.length || c)
                                b = f;
                            return 1 < b.length ? k(b[1], e, 'undefined') : !1;
                        } catch (h) {
                            return !1;
                        }
                    };
                    a.ao.f = function (g, e) {
                        if (e && !a.a.ax([
                                'feather',
                                'display',
                                'video'
                            ], e))
                            return g;
                        var c = a.c.e.optimizelyMoat;
                        if (a.a.f(c) && 0 < c.length) {
                            var d = function (a) {
                                    if ('undefined' !== typeof a)
                                        return a.trim().replace(/[ |]/g, '_');
                                }, c = a.a.cj(function (a) {
                                    var c = a.split(':');
                                    a = d(c[0]);
                                    c = d(c[1]);
                                    return [
                                        a,
                                        c
                                    ].join('|');
                                }, c);
                            g.zMoatOptimize = c.join(';');
                        }
                        return g;
                    };
                    a.ao.g = function (a, e) {
                        if (!a)
                            return !1;
                        var c = {};
                        try {
                            var d = a && a.className.replace('amp;', '').split('?')[1];
                            if (c = d && k(d, e))
                                c._AD_FORMAT = e;
                            return c;
                        } catch (b) {
                            return !1;
                        }
                    };
                    a.ao.h = function (g) {
                        var e = a.a.am();
                        e && (g.zMoatCURL = e);
                        a.k.a.zaxs('appendNonQsAdIds', g);
                    };
                    a.ao.i = function (a) {
                        if (a) {
                            for (var e in a)
                                a.hasOwnProperty(e) && e && e.match('moatClientLevel') && 'string' === typeof a[e] && (a[e] = a[e].replace(/\:/g, '_').replace(/%3A/gi, '_'));
                            return a;
                        }
                    };
                    a.ao.j = function (a, e) {
                        return e || {};
                    };
                    a.ao.k = function (a) {
                        a = decodeURIComponent(decodeURIComponent(a));
                        -1 < a.indexOf('anonymous.google') && (a = 'anonymous.google');
                        var e = a.match(/^(?:[^:]{1,}:\/\/)?(?::*\/?\/?)?(?:www\.)?([^\/:]*)/);
                        e && e[1] && (a = e[1]);
                        return a.split('/')[0];
                    };
                    a.ao.l = function (g) {
                        a.ao.b(g);
                        a.ao.m(g);
                        g = a.ao.f(g, 'video');
                        g = a.ao.i(g);
                        a.ao.n && a.ao.n(g);
                        return g;
                    };
                }(v));
                (function (a) {
                    function k(a) {
                        'object' === typeof a && (a.fq = 0, a.gm = 0, a.ch = 0, a.ga = 0, a.gh = 0, a.hasOwnProperty('lx') && delete a.lx, a.um = 1);
                    }
                    function g(b, c, d) {
                        d = a.a.ea(c);
                        a.a.dv({ all: !0 }, d) && (b.zGSRS = '1');
                        b.zGSRC = '1';
                        c.zMoatCHNLS && (b.gv = c.zMoatCHNLS);
                        c.zMoatGSCACHE && (b.hw = c.zMoatGSCACHE);
                    }
                    function e(b) {
                        var c = a.c.e.googletag, c = c && 'function' === typeof c.pubads && c.pubads(), d = -1;
                        if (c && 'function' === typeof c.getSlots)
                            try {
                                var f = c.getSlots(), d = a.a.f(f) ? f.length : -1;
                            } catch (e) {
                            }
                        b.vb = d;
                    }
                    function c(b, c) {
                        a.a.ak(a.c.ba) && 5000 > encodeURIComponent(a.c.ba).length && (b.gu = a.c.ba);
                        b.id = a.c.bb ? '1' : '0';
                        b.ii = a.c.au;
                    }
                    function d(a, b) {
                        a.bo = b.moatClientSlicer1;
                        a.bd = b.moatClientSlicer2;
                    }
                    function b(b, c) {
                        var d = a.ab.a.b(b);
                        d.OneTag && (c.jh = d.OneTag);
                        d.LLD && (c.jk = d.LLD);
                        d.TPP && (c.jm = d.TPP);
                    }
                    function f(b, c) {
                        if (a.c.er) {
                            var d = b.cm;
                            'number' === typeof d && (b.pc = d);
                            b.cm = 1;
                        }
                    }
                    function h(b, c) {
                        var d, f = [], e, h = a.a.av() ? 2048 : 7750, g = c || {};
                        e = {};
                        b.fs = '192985';
                        for (d in b)
                            b.hasOwnProperty(d) && (1 != b.e || 'x' !== d && 'y' !== d && 'c' !== d ? f.push(encodeURIComponent(d) + '=' + encodeURIComponent(b[d])) : e[d] = b[d].split('a'));
                        d = f.join('&');
                        var f = h - d.length, l = 0;
                        if ('undefined' !== typeof e.x) {
                            for (var k = 0, x = 0; x < e.x.length; x++)
                                if (k += e.x[x].length + (e.y[x] ? e.y[x].length : 0) + (e.c[x] ? e.c[x].length : 0), k < f)
                                    l++;
                                else
                                    break;
                            0 < l && (d += '&x=' + e.x.slice(0, l - 1).join('a'), d += '&y=' + e.y.slice(0, l - 1).join('a'), d += '&c=' + e.c.slice(0, l - 1).join('a'));
                        }
                        for (var r in g)
                            g.hasOwnProperty(r) && (e = '&' + encodeURIComponent(r) + '=' + encodeURIComponent(g[r]), e.length + d.length < h && (d += e));
                        d = d.replace(/\x27/g, '%27');
                        try {
                            d += '&na=' + a.a.cx(d, b.i);
                        } catch (t) {
                        }
                        return d;
                    }
                    function l(b, c) {
                        b.j = 25 == c ? 'string' == typeof a.c.d && a.c.d.slice(0, 500) || '' : a.a.ap(a.c.d);
                    }
                    function x(b, c) {
                        if (!a.c.c) {
                            var d = a.a.ab();
                            d && (b.lp = d);
                        }
                    }
                    function r(b, c, d) {
                        var f = a.a.ea(d), e = a.a.dv({ all: !0 }, f);
                        a.a.forEach(c, function (a) {
                            if (b[a])
                                return !0;
                            e ? d[a] && '-' !== d[a] && (b[a] = d[a]) : b[a] = d[a] || '-';
                        });
                        return b;
                    }
                    a.s = {};
                    var t = 'zGSRC zMoatPS zMoatSECT zMoatPT zMoatFT zMoatW zMoatH zMoatVGUID zMoatSN zMoatAID zMoatIMP zMoatCP zMoatCnet zMoatNotCnet zMoatSZ zMoatSZPS zMoatPTAT zMoatPTATSECT zMoatJS zMoatSL zMoatAType zMoatTest zMoatAB zMoatMMV zMoatMMV_MAX zMoatMGV zMoatMSafety zMoatMData zMoatHBB zMoatHBS'.split(' '), u = {
                            display: 1,
                            video: 2,
                            adx: 3,
                            html5: 4,
                            content: 5,
                            feather: 6,
                            ivt_only: 7
                        };
                    a.s.c = function (b, c) {
                        var d = a.a.ea(c);
                        b.hp = 1;
                        c.zMoatAdUnit1 && (b.zMoatAdUnit1 = c.zMoatAdUnit1);
                        c.zMoatAdUnit2 && (b.zMoatAdUnit2 = c.zMoatAdUnit2);
                        c.zMoatAdUnit3 && (b.zMoatAdUnit3 = c.zMoatAdUnit3);
                        c.zMoatAdUnit4 && (b.zMoatAdUnit4 = c.zMoatAdUnit4);
                        a.c.c && window.top.document && window.top.document.hasFocus && 'function' === typeof window.top.document.hasFocus && (b.wf = window.top.document.hasFocus() ? 1 : 0);
                        d = u[d];
                        'undefined' !== typeof d && (b.ra = d);
                        b.pxm = '';
                        b.sgs = 3;
                        a.k.a.zaxs('appendCommonKeys', b, c);
                    };
                    a.s.b = function (m, p, n, u, v) {
                        var w = a.a.ea(p);
                        a.ao.b(p, u);
                        var y = {};
                        y.e = m;
                        a.a.cd(y, n);
                        y.i = 'REDVENTURES_GAM_HEADER1';
                        a.s.c(y, p);
                        e(y);
                        a.h && (y.cm = a.a.as(a.h, a.i).multiplier);
                        try {
                            y.kq = a.c.e && a.c.e.devicePixelRatio;
                        } catch (z) {
                            y.kq = 1;
                        }
                        y.hq = a.c.m ? 1 : 0;
                        y.hs = a.c.j ? 1 : 0;
                        y.hu = a.c.ah ? 1 : 0;
                        y.hr = a.c.ad ? 1 : 0;
                        y.ht = a.c.ak ? 1 : 0;
                        y.dnt = a.c.ei ? 1 : 0;
                        if (11 === m) {
                            a.k.a.zaxs('adNotFound');
                            var B = [], D;
                            for (D in ma)
                                ma.hasOwnProperty(D) && B.push(D + '=' + ma[D]);
                            y.k = B.join('&').slice(0, 300);
                        }
                        if (!(y.e in sa)) {
                            y.bq = a.c.n;
                            y.f = Number(!ia);
                            a.c.db && (y.nh = 1);
                            p.IS_PAGE_LEVEL || l(y, y.e);
                            x(y, y.e);
                            y.t = p.startTime;
                            y.de = p.rand;
                            y.rx = a.c.ax.a;
                            y.m = 0;
                            y.ar = '73b697c-clean';
                            y.iw = 'd244f36';
                            a.a.ch(y, 'ai', q.z);
                            a.a.ch(y, 'wr', q.ACTIVETIMEUNTILSCROLL);
                            y.q = q.m++;
                            y.cb = R ? 1 : 0;
                            y.cu = P;
                            y.ll = a.c.dg || 0;
                            a.a.ch(y, 'lm', a.c.dc());
                            y.ln = a.c.p ? 1 : 0;
                            a.a.cd(y, a.focus.getQueryString());
                            a.ao.j(p, y);
                            'undefined' !== typeof p && (y.d = p.moatClientLevel1 + ':' + p.moatClientLevel2 + ':' + p.moatClientLevel3 + ':' + p.moatClientLevel4, B = a.a.dy({ all: 'zGSRC zMoatPS zMoatSECT zMoatPT zMoatFT zMoatW zMoatH zMoatVGUID zMoatSN zMoatAID zMoatIMP zMoatCP zMoatCnet zMoatNotCnet zMoatSZ zMoatSZPS zMoatPTAT zMoatPTATSECT zMoatJS zMoatSL zMoatAType zMoatTest zMoatAB zMoatMMV zMoatMMV_MAX zMoatMGV zMoatMSafety zMoatMData zMoatHBB zMoatHBS'.split(' ') }, w) || t, r(y, B, p), p.adFindingMethod && (y.hv = p.adFindingMethod), g(y, p, w), c(y, p), p.zMoatOptimize && (y.zMoatOptimize = p.zMoatOptimize), a.a.dv({ all: !0 }, w) && d(y, p), y.gw = 'redventuresgamheader644747280705', y.fd = '1');
                            y.ac = 1;
                            y.it = a.an.v;
                            a.c.am().isInApp && (y.lv = a.c.cp(), y.zl = a.c.dz() ? 1 : 0, a.c.cq() ? (a.a.bp() && (y.wo = 1), (w = a.a.bl(a.c.bc)) && (y.zMoatMMAKns = w)) : a.c.cz() && (y.lx = 1));
                            a.d.c() && k(y);
                            (w = a.ap.a()) && (y.pe = w);
                            b(null, y);
                            a.k.a.zaxs('dropNonAdPixel', y, m, p, n, u, v);
                            f(y, v);
                            n = h(y);
                            m = T;
                            p = a.s.d(p, n + '&cs=0', y);
                            if (!0 === v)
                                return {
                                    qs: y,
                                    res: p
                                };
                            p.shouldSendPixel && p.querystring && q.yh.yi(p.querystring, m);
                        }
                    };
                    a.s.a = function (m, p, n) {
                        if (window && window.closed || !m || !0 === m.ep)
                            return !1;
                        var u = m.getFormat();
                        a.s.c(p, m.ao);
                        e(p);
                        try {
                            p.kq = a.c.e && a.c.e.devicePixelRatio;
                        } catch (v) {
                            p.kq = 1;
                        }
                        a.an.r(m);
                        if ('undefined' !== typeof m.ao && (2 !== m.an || 1 !== p.e && 3 !== p.e) && !(p.e in sa)) {
                            p.lo = m.FIND_AD_TRIES;
                            m.proxyTrackingEnabled && (p.tr = 1);
                            p.uk = a.a.bl(a.c.bc);
                            var K = a.a.bn(), z = a.a.bm(K.results), y = {
                                    article: 'pk',
                                    page_height: 'wk',
                                    meta_properties: 'rk',
                                    favicon: 'tk'
                                };
                            a.a.forEach(z, function (a) {
                                p[y[a]] = K.results[a] ? 1 : 0;
                            });
                            m.hasNonIframeListener && (p.ni = 1);
                            var B = m.ag, z = {}, D = a.u.a(m.zr);
                            if (9 === p.e && 2 === p.q || 25 === p.e) {
                                for (var C in B)
                                    B.hasOwnProperty(C) && '' !== C && 'undefined' !== typeof B[C] && -1 === C.indexOf('dvContains') && -1 === C.indexOf('indexOf') && -1 === C.toLowerCase().indexOf('clicktag') && (z['z' + C] = B[C]);
                                p.e = 25;
                            }
                            0 === m.an && (p.dc = m.WMODE);
                            'string' !== typeof m.ae || 0 != p.e && 25 != p.e ? p.ak = '-' : (C = a.c.j ? 700 : 1200, p.ak = m.ae.length <= C ? m.ae : m.ae.slice(0, C));
                            m.bi > m.bg && (m.bg = m.bi);
                            m.bm > m.bk && (m.bk = m.bm);
                            p.i = 'REDVENTURES_GAM_HEADER1';
                            a.a.cd(p, a.f.v(!0));
                            p.bq = a.c.n;
                            p.g = m.aq.g++;
                            var E, A;
                            m.isSREMeasurable || m.setDimensions();
                            m.IS_PAGE_LEVEL || (1 === m.ao.skin ? (A = a.c.r(a.c.e), E = A.width, A = A.height) : m.compositeAdAreaPx ? (E = m.compositeAdAreaPx, A = 1) : (E = m.INITIAL_WIDTH, A = m.INITIAL_HEIGHT));
                            E = E || 0;
                            A = A || 0;
                            0 < E && 0 < A && (m.isSREMeasurable = !0);
                            p.hq = a.c.m ? 1 : 0;
                            p.hs = a.c.j ? 1 : 0;
                            p.hu = a.c.ah ? 1 : 0;
                            p.hr = a.c.ad ? 1 : 0;
                            p.ht = a.c.ak ? 1 : 0;
                            p.dnt = a.c.ei ? 1 : 0;
                            p.h = A;
                            p.w = E;
                            p.rm = m.isSREMeasurable ? 1 : 0;
                            try {
                                a.c.dk() && m && m.elementRect && (p.fy = m.elementRect.left, p.gp = m.elementRect.top);
                            } catch (v) {
                            }
                            g(p, m.ao, u);
                            c(p, m.ao);
                            a.h && (p.cm = a.a.as(a.h, a.i).multiplier);
                            p.f = Number(!ia);
                            m.IS_PAGE_LEVEL || l(p, p.e);
                            x(p, p.e);
                            p.t = m.ao.startTime;
                            p.de = m.ao.rand;
                            p.rx = a.c.ax.a;
                            p.cu = P;
                            p.m = p.m || a.a.bb(m);
                            p.ar = '73b697c-clean';
                            p.iw = 'd244f36';
                            p.cb = R ? 1 : 0;
                            a.a.ch(p, 'rd', m.refreshDecision);
                            a.a.ch(p, 'zMoatAR', m.moatAutoRefreshed);
                            a.a.ch(p, 'zMoatWDAC', m.wasDupeAutoCreative);
                            p.ll = a.c.dg || 0;
                            a.a.ch(p, 'lm', a.c.dc());
                            p.ln = a.c.p ? 1 : 0;
                            a.c.c && (p.gh = 1);
                            a.c.db && (p.nh = 1);
                            p.xx = a.c.eq + ':' + a.f.ap();
                            p.td = a.c.dd;
                            a.c.t();
                            p.qa = a.c.w;
                            p.qb = a.c.x;
                            p.qi = a.c.u;
                            p.qj = a.c.v;
                            p.qf = a.c.y;
                            p.qe = a.c.z;
                            p.qh = a.c.aa;
                            p.qg = a.c.ab;
                            try {
                                p.lk = m && m.elementRect && m.elementRect.top + a.c.ac || 'undefined';
                            } catch (v) {
                            }
                            isNaN(a.c.h) || (p.lb = a.c.h);
                            p.le = xa ? 1 : 0;
                            a.f && void 0 !== a.f.ah && (p.lf = a.f.ah);
                            a.f && void 0 !== a.f.ab && (p.lg = a.f.ab);
                            a.f && void 0 !== a.f.aj && (p.lh = a.f.aj);
                            a.c.cb && (p.fa = 1);
                            'number' !== typeof a.c.cd || isNaN(a.c.cd) || (p.zz = a.c.cd);
                            if (a.m && a.m.a())
                                p.ch = 1, p.gh = 1;
                            else if (a.o && a.o.a) {
                                a.c.bw && (p.ss = 1);
                                if (m && m.periscopeManager) {
                                    E = !a.focus.pageIsVisible() && m && m.counters && m.counters.strictDwell && 0 == m.counters.strictDwell.tCur && 21 == p.e;
                                    A = a.a.ay && '0' != a.a.ay();
                                    if (m.periscopeManager.measurable || !a.c.c && E && A)
                                        p.ch = 1;
                                    m.periscopeManager.fullyMeasurable && m.ao && 1 != m.ao.skin && (p.ga = 1);
                                } else
                                    p.ch = 1;
                                'undefined' !== typeof a.o.d && m && m.ao && m.ao.startTime && !isNaN(m.ao.startTime) && (E = a.o.d - m.ao.startTime, p.fg = 0 <= E ? E : 0);
                            } else
                                p.ch = 0;
                            p.vv = D ? m.viewabilityMethod[D] : 0;
                            E = m.viewabilityMethod;
                            p.vw = (E.strict || 0) + ':' + (E.sframe || 0) + ':' + (E.pscope || 0);
                            E = m.viewabilityPercent;
                            p.vp = E[D];
                            p.vx = E.strict + ':' + E.sframe + ':' + E.pscope;
                            (E = a.ap.a()) && (p.pe = E);
                            a.a.cd(p, a.u.u(m.zr, p));
                            a.a.cd(p, a.focus.getQueryString());
                            a.a.cd(p, a.ac.b(m.zr));
                            a.a.cd(p, a.aq.a(m.zr));
                            a.a.cd(p, m.counters.getQs());
                            m.px2 && m.px2.inSample && !m.px2.success && (p.zMoatIDF = 1);
                            m.px2 && (p.xd = (m.px2.inSample ? '1' : '0') + (m.px2.firedPixel ? '1' : '0'));
                            a.ar.a(m, p);
                            a.as.a(m, p);
                            a.a.ch(p, 'ai', q.z);
                            a.a.ch(p, 'wr', q.ACTIVETIMEUNTILSCROLL);
                            a.a.ch(p, 'ap', m.cb);
                            a.a.ch(p, 'ax', m.bg);
                            a.a.ch(p, 'ay', m.bi);
                            a.a.ch(p, 'az', m.bk);
                            a.a.ch(p, 'ba', m.bm);
                            a.a.ch(p, 'aw', m.bc);
                            a.a.ch(p, 'bg', m.bd);
                            a.a.ch(p, 'be', m.be);
                            a.a.ch(p, 'bc', m.bw);
                            a.a.ch(p, 'bf', m.by);
                            a.a.ch(p, 'bh', m.bx);
                            a.a.ch(p, 'bz', m.cu);
                            p.cl = w.round(100 * m.IR5.AREA / (p.w * p.h));
                            0 < m.aq[2] && (p.au = m.aq[2] - 1);
                            0 < m.aq[3] && (p.av = m.aq[3] - 1);
                            0 < m.aq[23] && (p.by = m.aq[23] - 1);
                            p.at = m.dm;
                            a.ao.j(m.ao, p);
                            p.d = m.ao.moatClientLevel1 + ':' + m.ao.moatClientLevel2 + ':' + m.ao.moatClientLevel3 + ':' + m.ao.moatClientLevel4;
                            m.ao.zMoatOptimize && (p.zMoatOptimize = m.ao.zMoatOptimize);
                            a.a.dv({ all: !0 }, u) && d(p, m.ao);
                            p.gw = 'redventuresgamheader644747280705';
                            u = a.a.dy({ all: 'zGSRC zMoatPS zMoatSECT zMoatPT zMoatFT zMoatW zMoatH zMoatVGUID zMoatSN zMoatAID zMoatIMP zMoatCP zMoatCnet zMoatNotCnet zMoatSZ zMoatSZPS zMoatPTAT zMoatPTATSECT zMoatJS zMoatSL zMoatAType zMoatTest zMoatAB zMoatMMV zMoatMMV_MAX zMoatMGV zMoatMSafety zMoatMData zMoatHBB zMoatHBS'.split(' ') }, u) || t;
                            E = a.a.i(m.ao);
                            r(p, u, E);
                            m.ao.adFindingMethod && (p.hv = m.ao.adFindingMethod);
                            p.ab = m.an;
                            p.ac = 1;
                            p.fd = '1';
                            p.kt = D;
                            p.it = a.an.v;
                            m.bi = m.bg;
                            m.bm = m.bk;
                            a.v.g(m) && (p.fz = 1);
                            D = a.v.d(m.zr);
                            p.oq = D ? 1 : 0;
                            'undefined' !== typeof m.zr && (p.ot = a.v.h[m.zr].stateMask.toString(16));
                            a.c.am().isInApp && (p.lv = a.c.cp(), p.zl = a.c.dz() ? 1 : 0, a.c.cq() ? (a.a.bp() && (p.wo = 1), (D = a.a.bl(a.c.bc)) && (p.zMoatMMAKns = D)) : a.c.cz() && (p.lx = 1));
                            m.debugData && (p.zMoatJS = m.debugData.getValue());
                            m && m.isMeasurabilityDisabled() && k(p);
                            a.d.c() && k(p);
                            b(m.zr, p);
                            a.a.ax([2], p.e) && m.aq.tc++;
                            p.tc = m.aq.tc;
                            a.k.a.zaxs('dropPixel', m, p, n);
                            f(p, n);
                            u = h(p, z);
                            D = T;
                            if (n)
                                return p;
                            m = a.s.d(m.ao, u + '&cs=0', p, z);
                            m.shouldSendPixel && m.querystring && q.yh.yi(m.querystring, D);
                        }
                    };
                    a.s.e = function (b, c) {
                        var f = a.a.ea(c);
                        b.zMoatSrcd = b.d;
                        b.zMoatSrcbo = b.bo;
                        b.zMoatSrcbp = b.bp;
                        b.zMoatSrcbd = b.bd;
                        b.d = (c.moatClientLevel1 || '') + ':';
                        b.d += (c.moatClientLevel2 || '') + ':';
                        b.d += (c.moatClientLevel3 || '') + ':';
                        b.d += c.moatClientLevel4 || '';
                        a.a.dv({ all: !0 }, f) && d(b, c);
                        return b;
                    };
                    a.s.f = function (b, c, d, f, e, g, l) {
                        b = 'extraPx_' + b;
                        c[b] || (c[b] = {});
                        f = a.a.i(f);
                        f.zMoatSrci = f.i;
                        f.i = d;
                        l && (f = a.s.e(f, l));
                        if (a.f.aq && !c[b].timestampsReset)
                            for (var k = 0; k < a.f.aq.length; k++) {
                                var x = a.f.aq[k];
                                x.zMoatSrci = x.i;
                                x.i = d;
                                l && (x = a.s.e(x, l));
                                x = h(x) + '&cs=0';
                                q.yh.yi(x, e);
                            }
                        c[b].timestampsReset || (c[b].timestampsReset = !0, f.lc && (f.lc = 0), f.cd && (f.cd = 0), f.sm && (f.sm = 0), f.fv && (f.fv = 0), f.pn && (f.pn = 0), f.lt && (f.lt = 0), f.ba && (f.ba = 0), f.sq && (f.sq = 0), f.gg && (f.gg = 0), f.mu && (f.mu = 0), f.si && (f.si = 0), f.mc && (f.mc = 0), f.dt && (f.dt = 0), f.gt && (f.gt = 0), f.ao && (f.ao = 0), f.mk && (f.mk = 0), f.dr && (f.dr = 0), f.ev && (f.ev = 0), f.ge && (f.ge = 0), f.mx && (f.mx = 0), f.an && (f.an = 0), f.cf && (f.cf = 0), f.gl && (f.gl = 0), f.mw && (f.mw = 0), f.xb && (f.xb = 0), f.db && (f.db = 0), f.am && (f.am = 0), f.fj && (f.fj = 0), f.my && (f.my = 0), f.mz && (f.mz = 0), f.cn && (f.cn = 0), f.es && (f.es = 0), f.sa && (f.sa = 0), f.pf && (f.pf = 0), f.ay && (f.ay = 0), f.bx && (f.bx = 0));
                        b = h(f, g);
                        q.yh.yi(b + '&cs=0', e);
                    };
                    a.s.d = function (b, c, d, f) {
                        b = !0;
                        if (a.h && (b = a.a.au(), !b)) {
                            for (var e = [
                                        1,
                                        2,
                                        3,
                                        23,
                                        25
                                    ], g = 0, l = e.length; g < l; g++)
                                if (d.e == e[g]) {
                                    b = !0;
                                    break;
                                }
                            b && (d.cm = 0, c = h(d, f), c += '&cs=0');
                        }
                        return {
                            shouldSendPixel: b,
                            querystring: c
                        };
                    };
                    a.s.g = function (a, b) {
                        if (2 !== a.an || 1 !== b.e && 3 !== b.e)
                            new Image(1, 1).src = '';
                    };
                    a.s.h = function (b) {
                        var c = a.s.i(b.data);
                        c.i = a.a.dz(c.i, b.iKeySuffix);
                        var d = h(c, b.flashVarsForQS) + '&cs=0';
                        if (b.sendNow) {
                            if (a.f.aq)
                                for (var f = 0; f < a.f.aq.length; f++) {
                                    var e = a.f.aq[f];
                                    e.i = a.a.dz(e.i, b.iKeySuffix);
                                    e = h(e) + '&cs=0';
                                    q.yh.yi(e, b.pixelURL);
                                }
                            q.yh.yi(d, b.pixelURL);
                        }
                        return c;
                    };
                    a.s.i = function (b) {
                        b = a.a.i(b);
                        for (var c = 'am an ao ay ba bx cd cf db dr dt es ev sa sq si sm mc lc pf xb ge gg cn gl pn fj lt mu mk mw mx my mz fv'.split(' '), d = 0; d < c.length; d++)
                            b[c[d]] && (b[c[d]] = 0);
                        return b;
                    };
                    a.s.j = function (a, b) {
                        return h(a, b);
                    };
                    a.s.k = function (b) {
                        var c = { e: 16 };
                        c.q = b.aq[16]++;
                        a.s.a(b, c);
                    };
                    a.s.l = function (b) {
                        var c = !1, d = !!b && b.getFormat(), f = a.s.b(8, b.ao, !1, !1, !0);
                        if (f && f.qs && f.qs.d) {
                            c = f.qs.d.split(':');
                            c = {
                                viewHash: 'REDVENTURES_GAM_HEADER1',
                                moatClientLevel1: c[0],
                                moatClientLevel2: c[1],
                                moatClientLevel3: c[2],
                                moatClientLevel4: c[3],
                                tagStartTime: a.c.bj
                            };
                            if (b && b.ao)
                                for (var e in b.ao)
                                    b.ao.hasOwnProperty(e) && -1 != e.indexOf('zMoat') && (c[e] = b.ao[e]);
                            for (e in f)
                                f.hasOwnProperty(e) && -1 != e.indexOf('zMoat') && (c[e] = f[e]);
                            a.a.dv({ all: !0 }, d) && (b = c, f = f.qs, b.moatClientSlicer1 = f.bo, b.moatClientSlicer2 = f.bd);
                        }
                        return c;
                    };
                    a.s.m = function (b) {
                        var c = { e: 8 };
                        c.q = b.aq[8]++;
                        return a.s.a(b, c, !0);
                    };
                }(v));
                (function (a) {
                    function k(c, d, b, f, e) {
                        var g = 10000;
                        a.c.am().isInApp && (g = 500);
                        new z().getTime();
                        this.tMaxContinuous = this.tContinuous = this.tLast = this.tCur = 0;
                        this.getMaxContinuous = function () {
                            return w.max(this.tContinuous, this.tMaxContinuous);
                        };
                        this.reset = function () {
                            this.tLast = this.tCur = 0;
                        };
                        this.update = function (a, b, d) {
                            c(a) ? (b = w.min(b, g), a = typeof f, b && 0 > b && (b = 0), this.tCur += b, this.tContinuous += b, 'number' === a && 0 < f ? this.tCur > f && (this.tCur = f) : 'function' === a && (b = f(), 'number' === typeof b && this.tCur > b && 0 < b && (this.tCur = b))) : (this.tMaxContinuous < this.tContinuous && (this.tMaxContinuous = this.tContinuous), this.tContinuous = 0);
                            e && e(this.tCur);
                        };
                        this.getQs = function (a) {
                            a = this.query(a);
                            this.tLast = this.tCur;
                            return a;
                        };
                        this.query = function (a) {
                            a = a || {};
                            this.tLast > this.tCur && (this.tLast = this.tCur);
                            d && b && (a[d] = this.tCur, a[b] = this.tLast);
                            return a;
                        };
                    }
                    a.x = {};
                    a.x.h = {};
                    a.x.h.a = [];
                    a.x.h.b = [];
                    var g = !1, e = {};
                    a.x.i = function () {
                        if (!g) {
                            g = !0;
                            try {
                                var c = q.swde.azsx('scroll', a.x.j);
                                a.k.a.azsx('allLocalAdsKilled', function () {
                                    q.swde.sxaz('scroll', { id: c });
                                }, { once: !0 });
                            } catch (d) {
                            }
                        }
                    };
                    a.x.k = function (c, d) {
                        try {
                            var b = c.aa, f = a.a.bg(b, 5), e = f && (6 == f.length || 1 <= f.length && 'HTML' === f[f.length - 1].nodeName);
                            d = d || c.WINDOW || a.a.be(b);
                            return !(b && d && e) || b.ownerDocument && b.ownerDocument.body && !b.ownerDocument.body.contains(b) ? !1 : !0;
                        } catch (g) {
                            return !1;
                        }
                    };
                    a.x.l = function () {
                        function c() {
                            if (!g)
                                try {
                                    g = !0, d(e), g = !1;
                                } catch (a) {
                                    throw g = !1, a;
                                }
                        }
                        function d(a) {
                            a = a.Moat;
                            a.x.m();
                            var c = new z().getTime(), d = w.max(w.min(c - b, f), 0);
                            a.k.a.zaxs('view:tick', d, c);
                            b = c;
                            a.ab.v();
                            a.am.b();
                        }
                        var b = new z().getTime(), f = 10000;
                        a.c.am().isInApp && (f = 500);
                        var e = {
                                Moat: a,
                                domNodesIdToAd: B
                            }, g = !1;
                        a.k.a.azsx('periscope:onStateChange', c);
                        a.k.a.azsx('viewCounterStarted', c);
                        var k = 'MOAT_VIEW_LOOP_ID_' + new z().getTime();
                        a.l.g(d, e, 200, k);
                        return a.a.dg([e], d);
                    }();
                    a.x.m = function () {
                        var c, d;
                        for (d in B)
                            B.hasOwnProperty(d) && (c = B[d], a.x.k(c, c.WINDOW) || a.x.g(c));
                    };
                    a.x.g = function (c) {
                        if (!0 !== c.ep) {
                            if (!ha) {
                                var d = { shouldKillAd: !0 };
                                a.k.a.zaxs('beforeAdKilled', d, c);
                                if (!d.shouldKillAd)
                                    return;
                            }
                            a.k.a.zaxs('adKilled', c);
                            a.d.m(c);
                        }
                    };
                    a.x.c = function (c) {
                        c.eq || (c.eq = !0);
                        var d = { e: 5 };
                        d.q = c.aq[5]++;
                        a.s.a(c, d);
                    };
                    a.x.b = function (c) {
                        if (!c || !c.aq || !c.aq[0])
                            return !1;
                        var d = { e: 37 };
                        d.q = c.aq[37]++;
                        a.s.a(c, d);
                    };
                    a.x.n = [];
                    a.x.o = function (c, d) {
                        var b = !1;
                        if (!c || !c.aq || !c.aq[29] || 3 > c.aq[29])
                            return !1;
                        for (var f = 0; f < d.length; f++) {
                            var e = d[f];
                            -1 === a.a.indexOf(a.x.n, e) && (b = !0, a.x.n.push(e));
                        }
                        b && (b = { e: 37 }, b.q = c.aq[37]++, a.s.a(c, b));
                    };
                    a.x.a = function (c) {
                        var d;
                        d = c.aa;
                        if (a.ac.c(c))
                            return !0;
                        c.elementRect || (c.currentWidth = d.offsetWidth, c.currentHeight = d.offsetHeight);
                        d = c.currentWidth;
                        c = c.currentHeight;
                        return 3 > d || 3 > c || !a.c.ce() && a.focus.pageIsPrerendered() ? !0 : !1;
                    };
                    a.x.e = function (c) {
                        return c ? a.focus.pageIsVisible() : !1;
                    };
                    a.x.p = function (c) {
                        var d = 1;
                        screen.deviceXDPI ? d = screen.deviceXDPI / screen.systemXDPI : c.devicePixelRatio && 'undefined' !== typeof c.mozInnerScreenX && (d = c.devicePixelRatio);
                        return (c = a.c.s()) ? {
                            w: d * c.width,
                            h: d * c.height
                        } : {
                            w: 0,
                            h: 0
                        };
                    };
                    a.x.f = function (c) {
                        c.counters = {};
                        c.counters.laxDwell = new k(function () {
                            return !a.focus.pageIsPrerendered();
                        }, 'bu', 'cd');
                        c.counters.strictDwell = new k(a.focus.pageIsVisible, 'ah', 'am');
                        c.counters.query = function () {
                            var a = {}, c;
                            for (c in this)
                                if (this.hasOwnProperty(c)) {
                                    var d = this[c];
                                    'function' === typeof d.query && d.query(a);
                                }
                            return a;
                        };
                        c.counters.getQs = function () {
                            var a = {}, c;
                            for (c in this)
                                if (this.hasOwnProperty(c)) {
                                    var d = this[c];
                                    'function' === typeof d.getQs && d.getQs(a);
                                }
                            return a;
                        };
                        c.counters.update = function (a, c, d) {
                            for (var e in this)
                                if (this.hasOwnProperty(e)) {
                                    var g = this[e];
                                    'function' === typeof g.update && !0 !== a.ep && g.update(a, c, d);
                                }
                        };
                        a.k.a.azsx('startAdTracking', a.x.i);
                        var d = a.k.a.azsx('view:tick', a.a.dg([c], c.counters.update, c.counters));
                        e[c.zr] = d;
                    };
                    a.x.q = function () {
                        q.z = void 0;
                        q.ACTIVETIMEUNTILSCROLL = void 0;
                        q.zs = !1;
                        q.xz = !1;
                        q.dcsx.wsqa('globalScrollevent' + q.dcsx.uid);
                        a.a.forEach(a.x.h.a, function (a) {
                            if (a && 'function' === typeof a)
                                try {
                                    a();
                                } catch (d) {
                                }
                        });
                    };
                    a.x.j = function (c) {
                        if (a.focus.pageIsVisible()) {
                            c = new z().getTime();
                            'undefined' === typeof q.z && (q.z = c - P);
                            if ('undefined' === typeof q.ACTIVETIMEUNTILSCROLL) {
                                var d = a.focus.focusStartTime || P;
                                d < P && (d = P);
                                q.ACTIVETIMEUNTILSCROLL = c - d;
                            }
                            a: {
                                for (var b in B)
                                    if (B.hasOwnProperty(b) && (c = B[b]) && 'undefined' !== typeof c.ao) {
                                        if (c.ce)
                                            break a;
                                        d = { e: 4 };
                                        d.q = c.aq[4]++;
                                        d.ai = q.z;
                                        d.wr = q.ACTIVETIMEUNTILSCROLL;
                                        a.s.a(c, d);
                                        c.ce = !0;
                                    }
                                try {
                                    q.dcsx.wsqa('globalScrollevent' + q.dcsx.uid), q.swde.sxaz('scroll', { callback: a.x.j });
                                } catch (f) {
                                }
                            }
                        }
                    };
                    a.x.d = function (c, d) {
                        var b = { e: 9 };
                        b.q = c.aq[9]++;
                        c.ci = +new z();
                        d && 'object' === typeof d && a.a.forEach(d, function (a, c) {
                            b[c] = a;
                        });
                        a.s.a(c, b);
                    };
                    a.k.a.azsx('adKilled', function (c) {
                        c && !c.ep && e.hasOwnProperty(c.zr) && a.k.a.sxaz('view:tick', { id: e[c.zr] });
                    });
                }(v));
                (function (a) {
                    function k(a, e) {
                        function c(a) {
                            return function () {
                                try {
                                    a.sending && (a.sending = !1, k = 0, d());
                                } catch (b) {
                                }
                            };
                        }
                        function d(a, b) {
                            if (a) {
                                var d = {
                                    qs: a,
                                    jsd: b
                                };
                                if (0 === a.indexOf('e=21&')) {
                                    f(d, !0);
                                    return;
                                }
                                l.push(d);
                            }
                            0 === k && 0 < l.length && (k++, d = l.shift(), d.sending = !0, d.uid = e.Math.floor(10000000000 * e.Math.random()), d.timeoutId = setTimeout(c(d), 2000), m[d.uid] = d, f(d));
                        }
                        function b() {
                            try {
                                return new r(1, 1);
                            } catch (a) {
                                var b = window.document.createElement('img');
                                b.height = 1;
                                b.width = 1;
                                return b;
                            }
                        }
                        function f(a, c) {
                            var d = b();
                            d.toSend = a;
                            c || (d.onerror = function () {
                                var a = this.toSend;
                                a.failedAttempts = 'number' == typeof a.failedAttempts ? a.failedAttempts + 1 : 0;
                                var b = (a.jsd + '/pixel.gif?' + a.qs).length;
                                1 > a.failedAttempts ? f(a) : n && b > q && h(a);
                            }, d.onload = function () {
                                h(this.toSend);
                            });
                            d.src = a.jsd + '/pixel.gif?' + a.qs;
                        }
                        function h(a) {
                            var b = a && a.uid && m && m[a.uid];
                            if (a && a.qs && 'tracer=' == a.qs)
                                return !1;
                            if (b) {
                                m[a.uid] = null;
                                try {
                                    delete m[a.uid];
                                } catch (c) {
                                }
                                try {
                                    clearTimeout(b.timeoutId);
                                } catch (c) {
                                }
                                if ('boolean' != typeof b.sending || b.sending)
                                    b.sending = !1;
                                else
                                    return !1;
                            }
                            0 < k && k--;
                            d();
                        }
                        var l = [], k = 0, r, t = e[a], u = e.Math.floor(10000000000 * e.Math.random()), m = {};
                        t.yh = {};
                        t = t.yh;
                        r = e.Image;
                        t.yi = function (a, b) {
                            d(a, b);
                        };
                        t.xq = function () {
                            return u;
                        };
                        var p, n, q = 2083;
                        try {
                            p = document.createElement('div'), p.innerHTML = '<!--[if IE 8]>x<![endif]-->', n = 'x' === p.innerHTML;
                        } catch (v) {
                            n = !1;
                        }
                    }
                    a.at = {};
                    a.at.a = function (g) {
                        try {
                            if (q.yh)
                                return;
                        } catch (e) {
                        }
                        a.a.dk(k, '\'' + a.c.aw + '\',window', g);
                    };
                }(v));
                (function (a) {
                    a.ad = {};
                    a.ad.b = function (k, g) {
                        var e = !0;
                        g && a.c.ds(k, !0) || (e = !1);
                        if (e) {
                            e = !0;
                            g && g.getCareAboutFocus && (e = g.getCareAboutFocus());
                            var c = a.x.a(k), e = (!e || a.x.e(k)) && !c;
                        }
                        return e;
                    };
                    a.ad.c = function (k) {
                        this.label = k;
                        this.metrics = {};
                        this.hasTickUpdateMetrics = !1;
                        this.set = function (a, e, c) {
                            this.metrics[a] = this.metrics[a] || {};
                            this.metrics[a].value = e || 0;
                            c && (this.hasTickUpdateMetrics || (this.hasTickUpdateMetrics = !0), this.metrics[a].incrementValue = c.incrementValue || 'delta', this.metrics[a].ignoreStateCheck = c.ignoreStateCheck || !1, this.metrics[a].shouldIncrementFn = c.shouldIncrementFn, this.metrics[a].postIncrementationFn = c.postIncrementationFn || !1, this.metrics[a].ignoreOmidCheck = c.ignoreOmidCheck || !1, c.useDeltaCompensation && (this.metrics[a].useDeltaCompensation = !0, this.metrics[a].incrementedLastTick = !1));
                            return this.metrics[a].value;
                        };
                        this.increment = function (a, e, c, d, b) {
                            var f = !this.metrics[a] || 'number' !== typeof this.metrics[a].value;
                            try {
                                if (d.debugData && f && 'publicis_counter' == this.label) {
                                    var h;
                                    this.metrics[a] ? this.metrics[a].value && (h = this.metrics[a].value) : h = 'NONE';
                                    var l = [
                                        e,
                                        h,
                                        b
                                    ].join('-');
                                    d.debugData.cache.push(l);
                                }
                            } catch (k) {
                            }
                            e = f ? this.set(a, e) : this.metrics[a].value += e;
                            'number' === typeof c && (e = this.cap(a, e));
                            return e;
                        };
                        this.cap = function (a, e) {
                            return this.set(a, w.min(this.get(a), e));
                        };
                        this.max = function (a, e) {
                            return this.set(a, w.max(this.get(a), e));
                        };
                        this.get = function (g, e) {
                            if (!a.d.c() || 'visOnLastCheck' === g || this.metrics[g] && this.metrics[g].ignoreOmidCheck)
                                return 'undefined' === typeof this.metrics[g] ? this.set(g, 'undefined' !== typeof e ? e : 0) : this.metrics[g].value;
                        };
                        this.update = function (g, e, c) {
                            if (g && this.hasTickUpdateMetrics) {
                                c = a.u.k(g.zr, !0);
                                var d = a.ad.b(g, c), b;
                                for (b in this.metrics)
                                    if (a.a.cz(this.metrics, b)) {
                                        var f = this.metrics[b];
                                        if (f.shouldIncrementFn) {
                                            var h = (d || !0 === f.ignoreStateCheck) && f.shouldIncrementFn(g, c);
                                            f.useDeltaCompensation ? (h && f.incrementedLastTick ? this.increment(b, e, void 0, g, 1) : (h || f.incrementedLastTick) && this.increment(b, w.round(e / 2), void 0, g, 2), f.incrementedLastTick = h) : h && ('delta' === f.incrementValue ? this.increment(b, e, void 0, g, 3) : 'addReturnValue' === f.incrementValue ? this.increment(b, h, void 0, g, 4) : 'setReturnValue' === f.incrementValue && this.set(b, h));
                                            'function' === typeof f.postIncrementationFn && f.postIncrementationFn(h);
                                        }
                                    }
                            }
                        };
                    };
                    a.ad.a = function (k, g) {
                        if (!k)
                            return !1;
                        var e;
                        k[g] ? e = k[g] : (e = new a.ad.c(g), k[g] = e);
                        return e;
                    };
                    a.ad.d = function (k, g, e) {
                        if (!g)
                            return !1;
                        g = a.ad.a(g, e);
                        k.secondaryCounters = k.secondaryCounters || [];
                        k.secondaryCounters.push(g);
                        return g;
                    };
                }(v));
                (function (a) {
                    function k(c, d, b) {
                        this.name = c;
                        this.reachedInViewTimeThreshold = !1;
                        this.alwaysInview = !0;
                        this.queryStringKey = b.queryStringKey;
                        this.timeThreshold = b.timeThreshold || 1000;
                        this.rawPercThreshold = b.percThreshold / 100 || 50;
                        this.percThreshold = w.min(b.percThreshold / 100, 0.98);
                        this.continuous = b.continuous || !1;
                        this.timePercent = b.timePercent;
                        this.capTimeThreshold = b.capTimeThreshold;
                        this.audible = b.audible || !1;
                        this.video = b.video || !1;
                        this.fullscreen = b.fullscreen || !1;
                        'undefined' !== this.timeThreshold && (this.timeThreshold = w.max(this.timeThreshold, 1));
                        this.counterState = {};
                        c = a.ad.a(this.counterState, 'customInViewCounter');
                        c.set('inViewTime', 0);
                        c.set('continuousInViewTime', 0);
                        c.set('maxContinuousInViewTime', 0);
                        c.set('visOnLastCheck', !1);
                        c.set('_tLastChecked', new z().getTime());
                    }
                    a.as = {};
                    var g = {}, e = {};
                    a.as.b = function (a, d, b) {
                        var f = d.zr;
                        g[f] || (g[f] = {});
                        if (g[f].hasOwnProperty(a) || void 0 == b.percThreshold && void 0 == b.fullscreen || void 0 == b.timeThreshold && void 0 == b.timePercent)
                            return !1;
                        b = new k(a, d, b);
                        return g[d.zr][a] = b;
                    };
                    a.as.c = function (c, d) {
                        return !a.d.c() && g[d] && g[d].hasOwnProperty(c) ? g[d][c] : !1;
                    };
                    a.as.d = function (c) {
                        if (!g[c])
                            return !0;
                        var d = !0;
                        a.a.forEach(g[c], function (a) {
                            if (!a.reachedInViewTimeThreshold)
                                return d = !1;
                        });
                        return d;
                    };
                    k.prototype.update = function (c, d, b) {
                        if (c && this.isMeasurable(c) && !this.reachedInViewTimeThreshold) {
                            var f, e = a.ad.a(this.counterState, 'customInViewCounter'), g = a.u.k(c.zr, !0);
                            if (g) {
                                var k = g.getLastInviewPercent();
                                f = (f = g.getFullyInViewThreshold()) && 'number' === typeof f ? w.min(this.percThreshold, f) : this.percThreshold;
                                e.get('_tLastChecked');
                                e.set('_tLastChecked', b);
                                b = !0;
                                g.getCareAboutFocus && (b = g.getCareAboutFocus());
                                c = g.getPauseCheckingFn ? g.getPauseCheckingFn()(c) : a.x.a(c);
                                k = k >= f;
                                g = !b || a.focus.pageIsVisible();
                                a.as.e && 'function' === typeof a.as.e && (k = a.as.e(k));
                                a.as.f && 'function' === typeof a.as.f && (g = a.as.f(g));
                                k = k && g && !c;
                                c = e.get('visOnLastCheck');
                                if (k && c)
                                    e.increment('inViewTime', d), e.increment('continuousInViewTime', d);
                                else if (k || c)
                                    d = w.round(d / 2), e.increment('inViewTime', d), e.increment('continuousInViewTime', d);
                                k || (this.alwaysInview = !1);
                                e.set('visOnLastCheck', k);
                                e.get('continuousInViewTime') > e.get('maxContinuousInViewTime') && e.set('maxContinuousInViewTime', e.get('continuousInViewTime'));
                                k || e.set('continuousInViewTime', 0);
                                this.inViewTimeReached() && (this.reachedInViewTimeThreshold = !0);
                            }
                        }
                    };
                    k.prototype.getInViewTime = function () {
                        var c = a.ad.a(this.counterState, 'customInViewCounter');
                        return this.continuous ? c.get('maxContinuousInViewTime') : c.get('inViewTime');
                    };
                    k.prototype.inViewTimeReached = function () {
                        return 'undefined' !== this.timeThreshold && this.getInViewTime() >= this.timeThreshold;
                    };
                    k.prototype.isMeasurable = function (c) {
                        if (!c)
                            return !1;
                        var d = !1;
                        'undefined' !== this.timeThreshold && ('pscope' == a.u.a(c.zr, !0) && c.custominview.periscopeThresholds ? a.a.ax(c.custominview.periscopeThresholds, this.rawPercThreshold) && a.c.ds(c) && (d = !0) : a.c.ds(c, !0) && (d = !0));
                        return d;
                    };
                    a.as.g = function (c) {
                        if (c && c.isMeasurabilityDisabled())
                            return !1;
                        a.as.b('full_vis_2_sec_continuous', c, {
                            percThreshold: 100,
                            timeThreshold: 2000,
                            video: !1,
                            continuous: !0,
                            queryStringKey: 'wb'
                        });
                    };
                    a.as.h = function (c) {
                        a.as.g(c);
                        c.custominview = {};
                        c.custominview.eventIds = {};
                        c.custominview.eventIds.viewCounterStarted = a.k.a.azsx('viewCounterStarted', a.as.i);
                        c.custominview.eventIds['periscope:onStateChange'] = a.k.a.azsx('periscope:onStateChange', a.as.i, { priority: 5 });
                        c.custominview.eventIds.adKilled = a.k.a.azsx('adKilled', a.as.j);
                        a.as.i(c);
                    };
                    a.as.i = function (c) {
                        void 0 !== c && (isNaN(c) || (c = B[c]), c && c.custominview && c.custominview.eventIds && a.c.ds(c, !0) && !c.custominview.eventIds['view:tick'] && (c.custominview.eventIds['view:tick'] = a.k.a.azsx('view:tick', a.a.dg([c], a.as.k), { priority: 6 })));
                    };
                    a.as.k = function (c, d, b) {
                        var f = c.zr;
                        if (!g[f] || c && c.isMeasurabilityDisabled())
                            return !1;
                        a.a.forEach(g[f], function (a) {
                            a.update(c, d, b);
                        });
                    };
                    a.as.j = function (c) {
                        c && c.custominview && c.custominview.eventIds && (a.k.a.sxaz('view:tick', {
                            id: c.custominview.eventIds['view:tick'],
                            priority: 6
                        }), a.k.a.sxaz('viewCounterStarted', { id: c.custominview.eventIds.viewCounterStarted }), a.k.a.sxaz('periscope:onStateChange', { id: c.custominview.eventIds['periscope:onStateChange'] }), a.k.a.sxaz('adKilled', { id: c.custominview.eventIds.adKilled }), a.k.a.sxaz('video:AdVideoComplete', { id: c.custominview.eventIds['video:AdVideoComplete'] }));
                    };
                    a.as.l = function () {
                        a.k.a.sxaz('startAdTracking', { id: e.startAdTracking });
                        a.k.a.sxaz('allLocalAdsKilled', { id: e.allLocalAdsKilled });
                    };
                    a.as.a = function (c, d) {
                        if (c)
                            return a.a.forEach(g[c.zr], function (b) {
                                'custom_inview_module_counter' === b.name ? (d.wm = 0, d.wi = 0, !a.d.c() && b.isMeasurable(c) && (d.wm = 1, b.inViewTimeReached() && (d.wi = 1))) : void 0 != b.queryStringKey && (d[b.queryStringKey] = 0, !a.d.c() && b.isMeasurable(c) && (d[b.queryStringKey] = 1, b.inViewTimeReached() && (d[b.queryStringKey] = 2)));
                            }), d;
                    };
                    a.as.m = function (c) {
                        if (!c)
                            return !1;
                        var d = !1;
                        c = c.zr;
                        if (!g[c])
                            return !1;
                        a.a.forEach(g[c], function (a) {
                            'custom_inview_module_counter' === a.name && (d = a.reachedInViewTimeThreshold);
                        });
                        return d;
                    };
                    e.startAdTracking = a.k.a.azsx('startAdTracking', a.as.h);
                    e.allLocalAdsKilled = a.k.a.azsx('allLocalAdsKilled', a.as.l);
                }(v));
                (function (a) {
                    a.ag = {};
                    a.ag.c = w.floor(100000000 * w.random());
                    a.ag.b = function (k, g, e, c) {
                        if (q && (g && (g += '_' + a.ag.c), !q.jsonp || !q.jsonp[k])) {
                            q.jsonp = q.jsonp || {};
                            q.jsonp[k] = q.jsonp[k] || { cachedResponse: !1 };
                            var d = q.xb || window, b = d.document;
                            d[g] = function (a) {
                                var b;
                                try {
                                    b = JSON.parse(a);
                                } catch (c) {
                                    b = a;
                                }
                                q.jsonp[k].cachedResponse = b;
                                q.swde.zaxs(k + 'JsonpReady', b);
                                d[g] = null;
                            };
                            var f = function (b) {
                                b = k + ' JSONP request handling failed' + (b ? b : '');
                                try {
                                    var c = 'undefined' !== typeof omidNative && ('undefined' === typeof Image || Image && Image._MoatProxyOf), d = c ? '' : document.referrer, f = 'undefined' !== typeof a && a.c && a.c.n ? a.c.n : '', e = 'https://px.moatads.com/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=' + escape('REDVENTURES_GAM_HEADER1') + '&ac=1&k=' + escape(b) + '&ar=' + escape('73b697c-clean') + '&iw=' + escape('d244f36') + '&bq=' + escape(f) + '&j=' + escape(d) + '&cs=' + new z().getTime();
                                    c ? omidNative.sendUrl(e) : new Image(1, 1).src = e;
                                } catch (h) {
                                }
                            };
                            try {
                                var h = a.c.bd(), l = function () {
                                        'undefined' === typeof c && (c = 'callback');
                                        var d = [
                                                e,
                                                '&',
                                                c,
                                                '=',
                                                g
                                            ].join(''), f = b.createElement('script'), h = b.body || b.getElementsByTagName('head')[0] || b.getElementsByTagName('script')[0];
                                        a.a.co(d, h, f);
                                    };
                                'undefined' !== typeof h ? 'function' === typeof h.downloadJavaScriptResource && h.downloadJavaScriptResource(e, d[g], f) : l();
                            } catch (x) {
                                f(x);
                            }
                        }
                    };
                    a.ag.d = function (k, g) {
                        q.jsonp && q.jsonp[k] && q.jsonp[k].cachedResponse ? a.a.dg([q.jsonp[k].cachedResponse], g)() : q.swde.azsx(k + 'JsonpReady', g, { once: !0 });
                    };
                    a.ag.a = function () {
                        var k = {}, g;
                        return function (e, c, d) {
                            k[e] ? a.ag.d(e, c || function () {
                            }) : ('string' === typeof d ? g = d : 'object' === typeof d && (g = a.ag.e(d, e)), a.ag.b(e, e + 'callback', g), c && a.ag.d(e, c), k[e] = !0);
                        };
                    }();
                    a.ag.e = function (k, g) {
                        var e;
                        a:
                            switch (g) {
                            case 'BrandSafetyNados':
                                e = '/s/v2';
                                break a;
                            case 'OneTagNados':
                                e = '/ot/v1';
                                break a;
                            default:
                                e = '';
                            }
                        var c = ['url=' + encodeURIComponent(a.c.ba)];
                        a.a.forEach(k, function (d, b) {
                            var f = b + '=' + d;
                            a.a.ax(c, f) || c.push(f);
                        });
                        return 'https://mb.moatads.com' + e + '?' + c.join('&');
                    };
                }(v));
                (function (a) {
                    function k(b, c, e) {
                        var g = a.v.h[b].stateMask;
                        if (c = d[c] * (e ? 16 : 1))
                            a.v.h[b].stateMask = g | c << 0;
                    }
                    function g(b, c, d, e) {
                        d = a.a.ds(b.x, c.x, d);
                        b = a.a.ds(b.y, c.y, e);
                        return d && b;
                    }
                    function e(b, c) {
                        a.v && a.v.h[b] && (a.v.h[b].allEdgesSeen = !0, a.a.forEach(a.v.h[b].mediatorIds, function (b, c) {
                            a.k.a.sxaz(c, { id: b });
                        }), c && (a.v.h[b].failsafe = !0), a.k.a.zaxs('passthrough'));
                    }
                    var c = {};
                    a.v = {};
                    a.v.i = 242500;
                    a.v.j = 1;
                    a.v.h = {};
                    var d = {
                        topLeft: 8,
                        topRight: 4,
                        bottomLeft: 2,
                        bottomRight: 1
                    };
                    a.v.k = function (b) {
                        return !b || b && b.isMeasurabilityDisabled() || a.d.c() ? !1 : a.c.dk() || a.c.dt() || void 0 || void 0;
                    };
                    a.v.a = function (b) {
                        return 'number' !== typeof b || a.a.l() ? !1 : 236425 <= b;
                    };
                    a.v.l = function (a) {
                        return a && a.ao ? 'slave' == a.ao.moatClientAT ? !0 : !1 : !1;
                    };
                    a.v.m = function (a) {
                        return a && a.ao ? 'cpc' == a.ao.moatClientBT ? !0 : !1 : !1;
                    };
                    a.v.n = function (a) {
                        return a && a.ao ? 'cpcv' == a.ao.moatClientBT ? !0 : !1 : !1;
                    };
                    a.v.o = function (a) {
                        return a && a.ao ? 'flatrate' == a.ao.moatClientBT ? !0 : !1 : !1;
                    };
                    a.v.p = function (a) {
                        return a && a.ao ? 'skin' == a.ao.moatClientAT || 'hpto' == a.ao.moatClientAT || 1 == a.ao.skin ? !0 : !1 : !1;
                    };
                    a.v.g = function (b) {
                        if (!b || !b.aa)
                            return !1;
                        if ('undefined' != typeof b.er)
                            return b.er;
                        b.video ? !a.v.k(b) || a.v.n(b) && !b.video.reachedComplete || (b.er = !0) : a.v.l(b) || a.v.m(b) || a.v.o(b) ? b.er = !1 : a.v.p(b) || b.isCompositeAd || a.v.a(a.a.ct(b)) ? b.er = !0 : a.v.k(b) && a.u.s(b, a.v.j, !0) && (b.er = !0);
                        return b.er || !1;
                    };
                    a.v.b = function (b) {
                        if (!b || b.SENT_FIT && b.et || !a.v.k(b))
                            return !1;
                        var c, d, e = a.u.a(b.zr);
                        b.SENT_FIT || (c = a.u.f(b, e, 'hadFIT'));
                        b.et || (d = a.u.f(b, e, 'hadFullOTS'));
                        if (c || d)
                            a.x.b(b), b.SENT_FIT = b.SENT_FIT || !!c, b.et = b.et || !!d;
                        return c || d;
                    };
                    a.v.q = function (b, c, d) {
                        var e;
                        a.a.forEach([
                            null,
                            void 0,
                            !1
                        ], function (a) {
                            if (e = c === a || d === a)
                                return !1;
                        });
                        if (!0 === e || !0 !== (a.a.dc(c.top) && a.a.dc(c.bottom) && a.a.dc(d.bottom) && a.a.dc(d.top)) || c.top === c.bottom || c.left === c.right || d.top === d.bottom || d.left === d.right)
                            return !1;
                        var k = c.right - c.left, r = c.bottom - c.top, t = k * (1 - 0.98), u = r * (1 - 0.98), m = {
                                x: c.left,
                                y: c.top
                            }, p = {
                                x: c.right,
                                y: c.top
                            }, n = {
                                x: c.left,
                                y: c.bottom
                            }, q = {
                                x: c.right,
                                y: c.bottom
                            }, v = c.left + t, z = c.top + u, y = c.right - t, B = c.top + u, D = c.left + t, C = c.bottom - u, t = c.right - t, u = c.bottom - u, E = {
                                x: d.left,
                                y: d.top
                            }, A = {
                                x: d.right,
                                y: d.top
                            }, G = {
                                x: d.left,
                                y: d.bottom
                            }, J = {
                                x: d.right,
                                y: d.bottom
                            }, k = w.ceil(0.01 * k), r = w.ceil(0.01 * r), m = g(m, E, k, r), p = g(p, A, k, r), n = g(n, G, k, r), q = g(q, J, k, r);
                        a.v.r(b, {
                            topLeft: m,
                            topRight: p,
                            bottomLeft: n,
                            bottomRight: q
                        }, {
                            topLeft: v >= d.left && z >= d.top,
                            topRight: y <= d.right && B >= d.top,
                            bottomLeft: D >= d.left && C <= d.bottom,
                            bottomRight: t <= d.right && u <= d.bottom
                        });
                    };
                    a.v.s = function (b) {
                        if ('undefined' !== typeof b && 0 <= b && !a.v.h[b]) {
                            a.v.h[b] = {};
                            a.v.h[b].allEdgesSeen = !1;
                            a.v.h[b].mediatorIds = {};
                            a.v.h[b].outer = {
                                topLeft: !1,
                                topRight: !1,
                                bottomLeft: !1,
                                bottomRight: !1
                            };
                            a.v.h[b].inner = {
                                topLeft: !1,
                                topRight: !1,
                                bottomLeft: !1,
                                bottomRight: !1
                            };
                            a.v.h[b].stateMask = 0;
                            var c = 'rectsAvailable', d = a.k.a.azsx(c, a.v.q);
                            a.v.h[b].mediatorIds[c] = d;
                            c = 'adEdgesViewStatus';
                            d = a.k.a.azsx(c, a.v.r);
                            a.v.h[b].mediatorIds[c] = d;
                            c = 'adFullyVisible';
                            d = a.k.a.azsx(c, e, {
                                condition: function (b, c) {
                                    return b && c && !a.v.d(b.zr) && a.u && a.u.a && c === a.u.a(b.zr);
                                },
                                once: !0
                            });
                            a.v.h[b].mediatorIds[c] = d;
                        }
                    };
                    a.v.t = function (b) {
                        return a.v.h[b].failsafe;
                    };
                    a.v.r = function (b, c, d) {
                        function g(l, u, m) {
                            m && (a.a.forEach([
                                'topLeft',
                                'topRight',
                                'bottomLeft',
                                'bottomRight'
                            ], function (a) {
                                !x[a] && c[a] && (x[a] = !0, k(b, a, !0));
                                !r[a] && d[a] && (r[a] = !0, k(b, a, !1));
                            }), (x.topLeft && x.topRight && r.bottomLeft && r.bottomRight || r.topLeft && r.topRight && x.bottomLeft && x.bottomRight || x.topLeft && x.bottomLeft && r.topRight && r.bottomRight || r.topLeft && r.bottomLeft && x.topRight && x.bottomRight) && e(b));
                        }
                        if (!0 !== a.v.h[b].allEdgesSeen) {
                            d && 'object' === typeof d || (d = c);
                            var x = a.v.h[b].outer, r = a.v.h[b].inner;
                            a.k.a.azsx('adCheckingState', g, {
                                once: !0,
                                condition: function (b, c) {
                                    return a.u.a(b.zr) === c;
                                }
                            });
                        }
                    };
                    a.v.d = function (b) {
                        return 'undefined' !== typeof b && b in a.v.h ? a.v.h[b].allEdgesSeen : !1;
                    };
                    (function (a) {
                        function d(a, b) {
                            return function (c) {
                                var d = a.maxContinuouslyInViewTime, e = b.get('currentContinuouslyInViewTime');
                                e > d && (a.maxContinuouslyInViewTime = e, a.checkMilestoneReached());
                                c || b.set('currentContinuouslyInViewTime', 0);
                            };
                        }
                        function e() {
                            return !1;
                        }
                        function g(c) {
                            var d = c.fixedInViewTimeRequirement;
                            this.percvRequired = c.percvRequired;
                            this.shouldConsiderLargeAds = a.a.dc(c.largeAdSize);
                            this.largeAdSize = c.largeAdSize;
                            this.largePercvRequired = c.largePercvRequired;
                            this.requiresPassthrough = c.requiresPassthrough;
                            this.qsKey = c.qsKey;
                            c.percvRequiredPassthrough && (this.percvRequiredPassthrough = c.percvRequiredPassthrough);
                            this.getInViewTimeRequirement = function (a) {
                                return d;
                            };
                        }
                        function k(c, d) {
                            return a.a.l() ? d === a.v.e.n ? a.v.e.n.b : a.v.f.m.b : d === a.v.e.n ? a.v.e.n.a : a.v.f.m.a;
                        }
                        function r(e, g, h) {
                            this.label = h;
                            this.config = g;
                            this.groupmMilestoneReached = !1;
                            this.maxContinuouslyInViewTime = 0;
                            this.ad = e;
                            this.fullViewEventPixelFired = !1;
                            var l = this;
                            h = a.ad.d(e, a.v.u, 'groupm_counter_' + e.yg + w.random());
                            var k = d(l, h);
                            if (g === a.v.f.m.a || g === a.v.f.m.b)
                                g = a.k.a.azsx('fullOtsReached', function () {
                                    l.groupmMilestoneReached = !0;
                                    l.milestoneFailsafeTriggered = !0;
                                }, {
                                    once: !0,
                                    condition: function (c, d) {
                                        var f = a.u.a(e.zr);
                                        return c.zr === e.zr && d === f;
                                    }
                                }), c[e.zr] = g;
                            this.checkMilestoneReached = function () {
                                var c;
                                c = l.maxContinuouslyInViewTime;
                                var d;
                                if (!0 === l.groupmMilestoneReached)
                                    return !0;
                                d = l.config.getInViewTimeRequirement();
                                c = l.config.requiresPassthrough(l.ad) ? a.v.d(l.ad.zr) && c >= d : c >= d;
                                l.groupmMilestoneReached = c;
                                !l.fullViewEventPixelFired && c && (l.fullViewEventPixelFired = !0, l.ad.fireFullViewEvent = !0);
                                return l.groupmMilestoneReached;
                            };
                            h.set('currentContinuouslyInViewTime', 0, {
                                useDeltaCompensation: !0,
                                shouldIncrementFn: function (c, d) {
                                    var e, f;
                                    e = d.getLastInviewPercent();
                                    var g = l.config.percvRequired, h = l.config.largePercvRequired;
                                    f = a.a.ct(c);
                                    e = l.config.requiresPassthrough(l.ad) ? e >= l.config.percvRequiredPassthrough : (f = l.config.shouldConsiderLargeAds && f >= l.config.largeAdSize) ? e >= h : e >= g;
                                    return e;
                                },
                                postIncrementationFn: k
                            });
                        }
                        a.v.u = {};
                        a.v.e = {};
                        a.v.e.b = 0.98;
                        a.v.e.c = 237650;
                        a.v.e.d = 0.5;
                        a.v.e.e = a.v.e.b;
                        a.v.e.f = 1000;
                        a.v.e.g = a.v.e.f;
                        a.v.e.h = 0.98;
                        a.v.e.i = 294000;
                        a.v.e.j = 0.8;
                        a.v.e.k = 15000;
                        a.v.e.l = 'im';
                        a.v.e.m = 'hj';
                        a.v.e.n = {};
                        a.v.e.n.a = {};
                        a.v.e.n.b = {};
                        var t = {
                            percvRequired: a.v.e.b,
                            largeAdSize: a.v.e.c,
                            largePercvRequired: a.v.e.d,
                            requiresPassthrough: e,
                            fixedInViewTimeRequirement: a.v.e.f,
                            viewTimeCap: !1,
                            qsKey: a.v.e.l
                        };
                        a.v.e.n.a = new g(t);
                        a.v.e.n.b = a.v.e.n.a;
                        a.v.f = {};
                        a.v.f.b = 0.98;
                        a.v.f.c = 237650;
                        a.v.f.d = 0.5;
                        a.v.f.e = 0.98;
                        a.v.f.f = 0.0001;
                        a.v.f.g = 1000;
                        a.v.f.h = 1000;
                        a.v.f.i = 0.98;
                        a.v.f.j = 294000;
                        a.v.f.k = 0.8;
                        a.v.f.l = 15000;
                        a.v.f.m = {};
                        a.v.f.m.a = {};
                        a.v.f.m.b = {};
                        a.v.f.n = 'in';
                        a.v.f.o = 'hj';
                        t = {
                            percvRequired: a.v.f.b,
                            largeAdSize: a.v.f.c,
                            largePercvRequired: a.v.f.d,
                            requiresPassthrough: e,
                            fixedInViewTimeRequirement: a.v.f.g,
                            viewTimeCap: !1,
                            qsKey: a.v.f.n
                        };
                        a.v.f.m.a = new g(t);
                        t = {
                            percvRequired: a.v.f.e,
                            percvRequiredPassthrough: a.v.f.f,
                            largeAdSize: !1,
                            largePercvRequired: !1,
                            requiresPassthrough: function (c) {
                                var d;
                                d = a.c.r(a.c.e);
                                var e = c.currentWidth || 0, f = c.currentHeight || 0;
                                a.c.db ? (c = a.c.w, d = a.c.x) : (c = d.width || 0, d = d.height || 0);
                                return c && d ? f > d || e > c : !1;
                            },
                            fixedInViewTimeRequirement: a.v.f.h,
                            viewTimeCap: !1,
                            qsKey: a.v.f.n
                        };
                        a.v.f.m.b = new g(t);
                        a.v.e.a = function (c) {
                            var d = k(c, a.v.e.n);
                            if (!1 !== d)
                                return a.v.s(c.zr), c.groupmV2 = c.groupmV2 || new r(c, d, 'GroupM V2'), c.groupmV2;
                        };
                        a.v.f.a = function (c) {
                            var d = k(c, a.v.f.m);
                            if (!1 !== d)
                                return a.v.s(c.zr), c.groupmV3 = c.groupmV3 || new r(c, d, 'GroupM V3'), c.groupmV3;
                        };
                        a.v.c = function (a, b) {
                            b = b || {};
                            var c = B[a];
                            if ('object' !== typeof c)
                                return b;
                            if ('object' === typeof c.groupmV2) {
                                var d = c.groupmV2.config.qsKey;
                                b[d] = c.groupmV2.checkMilestoneReached() ? 1 : 0;
                            }
                            'object' === typeof c.groupmV3 && (d = c.groupmV3.config.qsKey, b[d] = c.groupmV3.checkMilestoneReached() ? 1 : 0);
                            return b;
                        };
                    }(a));
                    a.k.a.azsx('adKilled', function (b) {
                        if (b && !b.ep && (c.hasOwnProperty(b.zr) && a.k.a.sxaz('fullOtsReached', { id: c[b.zr] }), a.v && a.v.u && 'object' === typeof a.v.u))
                            for (var d in a.v.u)
                                a.v.u.hasOwnProperty(d) && -1 < a.a.indexOf(d, 'groupm_counter_' + b.yg) && delete a.v.u[d];
                    });
                }(v));
                (function (a) {
                    function k(c, b) {
                        return function (b, e) {
                            var g, k = {
                                    large: c.config.LARGE_SIZE_REQ,
                                    normal: c.config.NORMAL_SIZE_REQ
                                }, r = e.getLastInviewPercent();
                            g = (g = a.a.ct(b) >= c.config.LARGE_AD_THRESHOLD) && r >= k.large || !g && r >= k.normal;
                            return c.fullyVisOnLastCheck = g;
                        };
                    }
                    function g(c, b) {
                        return function (e) {
                            var g = c.maxContinuouslyInViewTime, l = b.get('currentContinuouslyInViewTime');
                            l > g && (c.maxContinuouslyInViewTime = l, g = l >= c.config.TIME_THRESHOLD, a.c.ds(c.ad, !0) && !c.fullViewEventPixelFired && g && (c.fullViewEventPixelFired = !0, b.set('currentContinuouslyInViewTime', 0, {}), c.ad.fireFullViewEvent = !0));
                            e || b.set('currentContinuouslyInViewTime', 0);
                        };
                    }
                    function e(d, b) {
                        this.ad = d;
                        this.label = b;
                        this.counters = {};
                        this.config = c.config;
                        this.fullViewEventPixelFired = !1;
                        this.maxContinuouslyInViewTime = 0;
                        this.fullyVisOnLastCheck = !1;
                        var e = a.ad.d(this.ad, this.counters, 'publicis_counter_' + d.yg + w.random()), h = k(this, e), l = g(this, e);
                        e.set('currentContinuouslyInViewTime', 0, {
                            ignoreOmidCheck: !0,
                            useDeltaCompensation: !0,
                            shouldIncrementFn: h,
                            postIncrementationFn: l
                        });
                    }
                    a.z = {};
                    var c = {
                        v1: {},
                        config: {}
                    };
                    c.v1.display = {};
                    c.v1.display.LARGE_AD_THRESHOLD = 237650;
                    c.v1.display.NORMAL_SIZE_REQ = 0.98;
                    c.v1.display.LARGE_SIZE_REQ = 0.3;
                    c.v1.display.TIME_THRESHOLD = 1000;
                    c.v1.video = {};
                    c.v1.video.LARGE_AD_THRESHOLD = 237650;
                    c.v1.video.NORMAL_SIZE_REQ = 0.98;
                    c.v1.video.LARGE_SIZE_REQ = 0.5;
                    c.v1.video.TIME_THRESHOLD = 2000;
                    c.v1.display.VIEWABLE_KEY = 'pd';
                    c.v1.video.VIEWABLE_KEY = 'pv';
                    c.config = c.v1.display;
                    a.z.b = function (a) {
                        a.publicis = a.publicis || new e(a, 'Publicis V1');
                        return a.publicis;
                    };
                    a.z.a = function (a, b) {
                        b = b || {};
                        var c = B[a];
                        if ('object' !== typeof c)
                            return b;
                        c = c.publicis;
                        'object' === typeof c && (b[c.config.VIEWABLE_KEY] = c.fullViewEventPixelFired ? 1 : 0);
                        return b;
                    };
                    a.k.a.azsx('adKilled', function (c) {
                        if (c && !c.ep && c.publicis && c.publicis.counters && 'object' === typeof c.publicis.counters)
                            for (var b in c.publicis.counters)
                                c.publicis.counters.hasOwnProperty(b) && -1 < a.a.indexOf(b, 'publicis_counter_' + c.yg) && delete c.publicis.counters[b];
                    });
                }(v));
                (function (a) {
                    function k(e) {
                        return 'content' !== a.a.ea(e);
                    }
                    function g(a) {
                        return (a = a && 'function' === typeof a.getAttribute && (a.getAttribute('data-ad-name') || a.getAttribute('data-ad') || a.getAttribute('data-ad-sid') || a.getAttribute('data-ad-type'))) && 'string' === typeof a ? a : !1;
                    }
                    a.au = a.au || {};
                    a.a.ek = function (e) {
                        return e && a.c.e && a.c.e.document && 'function' === typeof a.c.e.document.getElementById ? (e = a.c.e.document.getElementById(e)) ? g(e) || g(a.a.bh(e)) : !1 : !1;
                    };
                    a.k.a.azsx('appendNonQsAdIds', function (e) {
                        a.c.e && a.c.e.utag_data && (e.zMoatAType = a.c.e.utag_data.articleType, e.zMoatTest = a.c.e.utag_data._test);
                    }, { condition: k });
                    a.k.a.azsx('adInitialized', function (e) {
                        var c = e.ao;
                        c.zMoatCURL && (e = a.al.d(e.DfpSlot), (e = a.a.ek(e)) && (c.zMoatSlotId = e));
                    }, {
                        condition: function (a) {
                            return k(a.ao);
                        }
                    });
                }(v));
                (function (a) {
                    function k(c, d) {
                        var b = c.getFormat(), e;
                        e = a.a.dy({ all: 30 }, b);
                        a.a.dc(e) || (a.a.dc(30), e = 30);
                        if (a.f.ao(d))
                            return c.refreshDecision = 1, !1;
                        c.auto = {};
                        var g;
                        a.a.ea(c.ao);
                        g = a.am.e;
                        var l;
                        a.a.dc(g) && 0 < g ? l = !0 : (a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Custom max refresh key is less than or equal to zero, or NaN; not enabling refresh'), c && (c.refreshDecision = 6), l = !1);
                        if (!l)
                            return !1;
                        c && c.DfpSlot ? l = !0 : (c && (c.refreshDecision = 7), l = !1);
                        if (!l)
                            return !1;
                        l = a.al.f(c.DfpSlot);
                        var k;
                        l && 'object' === typeof l ? k = !0 : (c && (c.refreshDecision = 8), k = !1);
                        if (!k)
                            return !1;
                        k = l.id;
                        l.getAttribute('width');
                        l.getAttribute('height');
                        a.al.d(c.DfpSlot);
                        a.al.h(c.DfpSlot);
                        q.auto_refresh = q.auto_refresh || {};
                        q.auto_refresh[k] = q.auto_refresh[k] || {
                            isBlacklisted: !1,
                            lastRefreshedByMoat: !1,
                            refreshCount: 0
                        };
                        !0 === q.auto_refresh[k].lastRefreshedByMoat && (c.moatAutoRefreshed = 1, q.auto_refresh[k].lastRefreshedByMoat = !1);
                        k && q.auto_refresh[k].refreshCount < g ? g = !0 : (a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Reached max refresh limit for ' + k + ', disabling refresh'), c && (c.refreshDecision = 9), g = !1);
                        if (!g)
                            return !1;
                        if (!a.am.f(c))
                            return q.auto_refresh[k].isBlacklisted = !0, !1;
                        g = 'Moat Inventory Intelligence:';
                        a.am && a.am.c && window.console && window.console.log && window.console.log(g, 'Adding listener to ad slot ' + k);
                        g = 'Moat Inventory Intelligence:';
                        a.am && a.am.c && window.console && window.console.log && window.console.log(g, l);
                        e *= 1000;
                        g = 'adx' === b || 'html5' === b ? 30000 : 10000;
                        if (!e || e && e < g)
                            e = g;
                        try {
                            a.am.g(c.zr, 'inview', e), a.a.dv({}, b) || (c.auto.mouseEvtId = a.k.a.azsx('mouseEventOnAd', a.a.dg([c], a.am.h))), c.refreshDecision = 0;
                        } catch (r) {
                            c && (c.refreshDecision = 20);
                        }
                    }
                    a.am = {};
                    a.am.c = !1;
                    a.am.c = '1' === a.a.aq(a.c.ba, 'moat_log');
                    a.am.d = 5000;
                    a.am.e = 5;
                    var g = {}, e = {
                            inview: function (c, d) {
                                return a.u.i(c, d, !0);
                            },
                            fullInview: function (c, d) {
                                return a.u.s(c, d, !0);
                            },
                            activeInview: function (c, d) {
                                if (!a.c.c || !c.activetime)
                                    return !1;
                                var b = a.u.a(c.zr);
                                return (b = a.ad.a(c.activetime.counters, b)) && b.get('activeInviewTime') >= d;
                            }
                        };
                    a.am.f = function (c) {
                        var d = c.ao;
                        a.al.c(c.DfpSlot);
                        a.al.e(c.DfpSlot);
                        a.al.d(c.DfpSlot);
                        var b = a.al.f(c.DfpSlot).id;
                        c.getFormat();
                        if (1 === d.skin)
                            return c.refreshDecision = 10, !1;
                        var e = q && q.auto_refresh && q.auto_refresh[b] && q.auto_refresh[b].creativeId;
                        if (e && d.moatClientLevel4 && e === d.moatClientLevel4)
                            return a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Served same creative as last impression, disabling further refreshing for ' + b), c.wasDupeAutoCreative = !0, c.refreshDecision = 13, !1;
                        var d = [
                                'zMoatSZ',
                                ['1600x1000']
                            ], e = {
                                all: [
                                    'zMoatSZ',
                                    ['1600x1000']
                                ]
                            }, g = c.getFormat();
                        a.a.dv(e, g) ? (e = a.a.dy(e, g) || d, d = e[0], e = e[1], (g = c.ao) && g[d] && a.a.ax(e, g[d]) ? (c.refreshDecision = 14, d = !0) : d = !1, d = !d) : d = !0;
                        if (!d)
                            return a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'entry in custom blocklist for ' + b + ', disabling refresh'), !1;
                        d = {};
                        a.k.a.zaxs('adShouldRefresh', d, c, b);
                        if (!1 === d.canRefresh)
                            return !1;
                        c.refreshDecision = 0;
                        return !0;
                    };
                    a.am.a = function (c) {
                        a.ag.d('data', function (d) {
                            d = a.a.dg([
                                c,
                                d
                            ], k);
                            a.al.g(d);
                        });
                    };
                    a.am.g = function (a, d, b) {
                        g.hasOwnProperty(a) || (g[a] = {});
                        g[a][d] = b;
                    };
                    a.am.h = function (c) {
                        var d = new z().getTime();
                        if (1000 <= (c.auto.lastMouseTimestamp && d - c.auto.lastMouseTimestamp || 0) || !c.auto.hadRecentMouseEvent)
                            c.auto.mouseCheckId && a.a.a(c.auto.mouseCheckId), c.auto.hadRecentMouseEvent = !0, c.auto.lastMouseTimestamp = d, a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Mouse event! Disabling refresh for ' + a.am.d + ' milliseconds'), c.auto.mouseCheckId = a.l.f(a.a.dg([c], a.am.i), a.am.d);
                    };
                    a.am.i = function (c) {
                        c.auto.hadRecentMouseEvent = !1;
                        a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Mouse sleep time over, re-enabling refresh');
                    };
                    a.am.j = function (c) {
                        function d(b, d) {
                            var e = t && t.pbjs;
                            if (e && e.requestBids && 'function' === typeof e.requestBids) {
                                var f = {
                                    bidsBackHandler: function () {
                                        e.setTargetingForGPTAsync([r]);
                                        d && (a.al.k([c.DfpSlot]), a.x.g(c));
                                    },
                                    timeout: b,
                                    adUnitCodes: [r]
                                };
                                Array.prototype.includes || 'function' !== typeof t.Array.prototype.includes || (Array.prototype.includes = t.Array.prototype.includes);
                                var g = t && t.BidBarrel;
                                if (g && g.auction && 'function' === typeof g.auction) {
                                    a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Calling CBS Bid Barrel for slot refresh');
                                    try {
                                        g.auction(t.Array.prototype.slice.call([r]));
                                    } catch (h) {
                                    }
                                    d && a.x.g(c);
                                } else
                                    e.requestBids(f);
                                return useTimeout = !0;
                            }
                        }
                        function b(b) {
                            a.am && a.am.c && window.console && window.console.log && window.console.log('Moat Inventory Intelligence:', 'Refreshing slot for ' + b);
                            a.al.k([b]);
                            a.x.g(c);
                        }
                        function e(c) {
                            var f = a.al.i();
                            if (a.a.dv({ all: !0 }, l)) {
                                var g;
                                f.cygnus_index_sendmoatrequest && 'function' === typeof f.cygnus_index_sendmoatrequest ? g = f.cygnus_index_sendmoatrequest : f.cygnus_index_sendrequest && 'function' === typeof f.cygnus_index_sendrequest ? g = f.cygnus_index_sendrequest : f.cygnus_index_start && 'function' === typeof f.cygnus_index_start && (g = f.cygnus_index_start);
                                g && g();
                            }
                            a.a.dv({ all: !0 }, l) && d(800, !1);
                            f && f.BidBarrel || a.l.f(a.a.dg([c], b), 1000);
                        }
                        if (c) {
                            var g = c.ao, l = c.getFormat(), k = a.al.f(c.DfpSlot);
                            if (k) {
                                k.getAttribute('width');
                                k.getAttribute('height');
                                var k = k.id, r = a.al.d(c.DfpSlot);
                                a.al.h(c.DfpSlot);
                                var t = a.al.i();
                                if (k && c.DfpSlot) {
                                    if (!0 === q.auto_refresh[k].isBlacklisted)
                                        return c.refreshDecision = q.auto_refresh[k].refreshDecision || 14, !1;
                                    q.auto_refresh[k].refreshCount = 1 + q.auto_refresh[k].refreshCount;
                                    q.auto_refresh[k].lastRefreshedByMoat = !0;
                                    q.auto_refresh[k].creativeId = g.moatClientLevel4;
                                    q.auto_refresh[k].refreshDecision = c.refreshDecision;
                                    a.al.j(c.DfpSlot, 'mivr', q.auto_refresh[k].refreshCount);
                                    if (a.a.dv({ all: !0 }, l))
                                        if (t && t.headertag && !0 === t.headertag.apiReady) {
                                            if (g = t.headertag.pubads && 'function' === typeof t.headertag.pubads && t.headertag.pubads(), 'function' === typeof g.refresh) {
                                                g.refresh([c.DfpSlot]);
                                                a.x.g(c);
                                                return;
                                            }
                                        } else if (t && 'undefined' !== typeof t.index_headertag_lightspeed) {
                                            var u = t.index_headertag_lightspeed, g = function (b) {
                                                    return function () {
                                                        u.set_slot_targeting([b]);
                                                        a.al.k([b]);
                                                        a.x.g(c);
                                                    };
                                                }(c.DfpSlot);
                                            u.add_session_end_hook(g, !0);
                                            u.refresh();
                                            return;
                                        }
                                    e(c.DfpSlot);
                                } else
                                    c.refreshDecision = 7;
                            } else
                                c.refreshDecision = 8;
                        }
                    };
                    a.am.b = function () {
                        for (var c in B)
                            if (B.hasOwnProperty(c)) {
                                var d = B[c];
                                if (!d.auto || !d.auto.hadRecentMouseEvent) {
                                    var b = g[c], f;
                                    for (f in b)
                                        if (b.hasOwnProperty(f) && e[f](d, b[f])) {
                                            try {
                                                a.am.j(d);
                                            } catch (h) {
                                            }
                                            delete b[f];
                                            a.k.a.sxaz('mouseEventOnAd', { id: d.auto.mouseEvtId });
                                        }
                                }
                            }
                    };
                    a.am.k = function () {
                        var c = {}, d = a.al.a();
                        if (!d)
                            return !1;
                        a.a.forEach(d, function (a) {
                            (a = (a = a.getResponseInformation()) && a.lineItemId) && (c[a] = 1 + (c[a] || 0));
                        });
                        return c;
                    };
                    a.k.a.azsx('adKilled', function (c) {
                        c && !c.ep && c.auto && c.auto.mouseEvtId && a.k.a.sxaz('mouseEventOnAd', { id: c.auto.mouseEvtId });
                    });
                }(v));
                (function (a) {
                    function k(c) {
                        if (c.version == a.av.a)
                            return !0;
                        var d = a.av.a + '-beta' === c.version, b = a.av.a === c.version + '-beta';
                        if (('moatframe' === c.type || 'addThis' === c.type) && (d || b))
                            return !0;
                    }
                    a.av = {};
                    a.av.a = '1.2';
                    a.av.prefix = 'MSFAPI';
                    a.av.b = {};
                    a.av.c = {};
                    var g = a.c.ax.a, e = a.c.az;
                    a.av.d = /([a-z]+)#([a-z0-9.-]+)#([0-9]+)#([a-z]+)#([0-9]+)#(.+)/i;
                    a.av.e = /@([a-z0-9]+)@@(.*)/i;
                    a.av.f = function (c) {
                        if (c) {
                            var d = a.av.g(c);
                            d.listening || (q.dcsx && q.dcsx.ynds(c, 'message', 'message-' + g, 'ME-' + g), d.listening = !0, q.swde.azsx('allAdsKilled', function () {
                                a.av.h(c);
                            }, { once: !0 }));
                            var b = q.swde.azsx('message-' + g, a.av.i);
                            a.k.a.azsx('allLocalAdsKilled', function () {
                                q.swde.sxaz('message-' + g, { id: b });
                            }, { once: !0 });
                        }
                    };
                    a.av.g = function (c) {
                        var d = 'Moat#PML#' + a.c.as + '#' + a.av.a;
                        c[d] || (c[d] = {
                            id: g,
                            listening: !1
                        });
                        return c[d];
                    };
                    a.av.h = function (c) {
                        var d = c && a.av.g(c);
                        a.l.d(c, 'message', a.av.i);
                        q.dcsx && q.dcsx.engn({ listenerName: 'ME-' + g });
                        q.swde.sxaz('message-' + g, { callback: a.av.i });
                        d && (d.listening = !1);
                    };
                    a.av.j = function (c) {
                        return a.av.prefix + '#' + c + '#';
                    };
                    a.av.k = function (c) {
                        var d = c.match(a.av.d);
                        c = !1;
                        d && 7 == d.length && (c = {
                            prefix: d[1],
                            version: d[2],
                            uid: d[3],
                            type: d[4],
                            request: d[5],
                            data: d[6]
                        }, (d = c.data.match(a.av.e)) && 3 == d.length && (c.cmd = d[1], c.arg = d[2]), c.version && -1 !== a.a.indexOf(c.version, '-beta') && (c.isBeta = !0));
                        return c;
                    };
                    a.av.i = function (c) {
                        if (!(c && c.origin && c.data && 'string' === typeof c.data))
                            return !1;
                        var d = a.av.k(c.data), b = d && d.uid == e.toString();
                        if (d && !b && k(d) && (c.msgData = d, d.request in a.av.c && (c.triggerCallback = function () {
                                a.av.c[d.request] && (a.av.c[d.request](c), 'addThis' !== d.type && (a.av.c[d.request] = null, delete a.av.c[d.request]));
                            }), a.av.b[d.type]))
                            for (var b = 0, f = a.av.b[d.type].length; b < f; b++)
                                a.av.b[d.type][b](c);
                    };
                    a.av.l = function (c, d) {
                        a.av.b[c] = [d];
                    };
                    a.av.m = function (c, d, b, f) {
                        'object' == typeof d && (d = a.a.by(d));
                        f = f || w.floor(10000000000 * w.random());
                        'function' == typeof b && (a.av.c[f] = b);
                        c = a.av.j(a.av.a) + e + '#' + c + '#' + f + '#' + d;
                        return {
                            request: f,
                            msg: c
                        };
                    };
                    a.av.n = function (c, d, b, e, g) {
                        'object' == typeof b && (b = a.a.by(b));
                        return a.av.m(c, '@' + d + '@@' + b, e, g);
                    };
                    a.av.o = function (c, d, b) {
                        try {
                            if (!c || !c || !c.source)
                                return !1;
                            c.source.postMessage(a.av.m(c.msgData.type, d, b, c.msgData.request).msg, '*');
                        } catch (e) {
                            return !1;
                        }
                        return !0;
                    };
                    a.av.p = function (c, d, b) {
                        try {
                            var e = a.g.i(d || window.top);
                            if (!e)
                                return a.l.f(function () {
                                    a.av.p(c, d, b);
                                }, 200);
                            for (var g = 0; g < e.length; g++)
                                b && e[g] == window || e[g].postMessage(c, '*');
                        } catch (l) {
                        }
                    };
                    a.k.a.azsx('modulesReady', a.a.dg([window], a.av.f), { once: !0 });
                    a.k.a.azsx('stopPostMessageListeners', a.a.dg([window], a.av.h), { once: !0 });
                }(v));
                (function (a) {
                    a.ai = {};
                    a.ai.b = {};
                    a.ai.b.a = 'CF';
                    a.ai.b.b = 'CNF';
                    a.ai.b.c = 'CNS';
                    a.ai.a = {};
                    a.ai.a.b = !1;
                    a.ai.a.c = [];
                    a.ai.c = {};
                    a.ai.d = {};
                    var k = !1;
                    a.ai.a.a = function () {
                        var g = a.ai.e();
                        a.ai.a.b || a.c.c || (g = a.av.n('moatframe', 'check', g, function (e) {
                            e = a.a.bz(e.msgData.data);
                            var c = 'string' === typeof a.c.g;
                            e && 'string' === typeof e.fullUrl && 'number' === typeof e.urlSrc && !c && a.a.ak(e.fullUrl) && !a.c.bb && (a.c.f(e.urlSrc), a.c.g = e.cleanUrl, a.c.et = e.fullUrl, a.c.ba = e.fullUrl, a.c.bb = !0);
                            e && e.available && !a.ai.a.b && (a.c.cb = !0, a.ai.a.b = !0, e = 'MoatFrame#geom#' + new z().getTime(), a.l.g(a.ai.a.d, null, 200, e), a.ai.a.c.push(e), a.k.a.azsx('allLocalAdsKilled', a.ai.f, { once: !0 }), a.k.a.zaxs('Moatframe:Ready', e));
                        }), a.av.p(g.msg, !1, !0));
                    };
                    a.ai.g = function () {
                        a.av.l('moatframe', a.ai.h);
                        a.av.l('addThis', a.ai.h);
                        a.av.p(a.av.m('moatframe', 'ping').msg, !1, !0);
                    };
                    a.ai.i = function (g) {
                        var e = a.ai.a.e;
                        if (!e)
                            return !1;
                        var c = a.t.i(g.aa), d = a.t.n(c.rect, e.el, e.et), b = a.t.n(c.visibleRect, e.el, e.et), b = a.t.m(b, {
                                left: e.vl,
                                right: e.vr,
                                top: e.vt,
                                bottom: e.vb
                            }), c = (b.right - b.left) * (b.bottom - b.top) / c.area, f = !1;
                        e && 'number' === typeof e.pv && !isNaN(e.pv) && (a.a.ds(c, e.pv, 0.01) && 'sframe' === a.u.a(g.zr) && (f = !0), c = w.min(c, e.pv));
                        e.m || (f = !0);
                        f && a.k.a.zaxs('rectsAvailable', g.zr, d, b);
                        e && 'boolean' === typeof e.ia && (a.c.cc = e.ia);
                        e && 'number' === typeof e.m && !isNaN(e.m) && (a.c.cd = e.m);
                        return c;
                    };
                    a.ai.j = function (g) {
                        return 'undefined' !== typeof g && a.ai.d && a.ai.d[g] ? (a.ai.d[g] = null, !0) : !1;
                    };
                    a.ai.f = function () {
                        var g = a.av.m('moatframe', 'kill', null);
                        a.av.p(g.msg, !1, !0);
                    };
                    a.ai.e = function () {
                        var g = a.c.y, e = a.c.z;
                        return g && e ? {
                            width: g,
                            height: e
                        } : !1;
                    };
                    a.ai.k = function () {
                        return a.c.c;
                    };
                    a.ai.l = function (g) {
                        var e = !1;
                        a.a.forEach(a.ai.b, function (a) {
                            if (a == g)
                                return e = !0, !1;
                        });
                        return e;
                    };
                    a.ai.h = function (g) {
                        var e = g.msgData.cmd || g.msgData.data;
                        if (e)
                            if (g.triggerCallback)
                                g.triggerCallback(g);
                            else if (a.ai.c[e])
                                a.ai.c[e](g);
                            else
                                a.ai.l(e) || a.av.o(g, a.ai.b.b);
                    };
                    a.ai.m = function (g) {
                        var e = {}, c = g.msgData.arg && a.a.bz(g.msgData.arg);
                        if (a.ai.n(window, g.source, g.msgData.uid, c) && a.ai.k()) {
                            if (e.available = !0, a.c.bb && (c = a.c.ba) && a.c.bb && a.a.ak(c)) {
                                var d = a.c.es || a.a.am();
                                a.c.es = d;
                                e.cleanUrl = d;
                                e.fullUrl = c;
                                e.urlSrc = 1;
                            }
                        } else
                            e.available = !1;
                        a.av.o(g, e);
                    };
                    a.ai.o = function (g, e) {
                        if (!g || !e)
                            return !1;
                        for (var c = a.g.c(window).pop(), d = a.g.k(g, 10), b = !1, f = !1, h = null, l = null, k, r = d.length - 1; 0 <= r; r--)
                            if (d[r] == c && (b = !0), b && !a.g.j(d[r])) {
                                l = d[r];
                                break;
                            }
                        b && l && ((h = l && l.parent && l.parent.document) && (k = a.g.f(h, l)), k && (c = k.offsetWidth, d = k.offsetHeight, c == e.width && d == e.height ? f = !0 : (c *= d, d = e.width * e.height, f = 0.98 <= w.min(c, d) / w.max(c, d))));
                        return {
                            isNested: f,
                            iframe: k,
                            iframeParentDoc: h
                        };
                    };
                    a.ai.p = function (g) {
                        return g && g.parent && a.g.f(g.parent.document, g);
                    };
                    a.ai.q = function (g) {
                        (g = 'undefined' !== typeof g && a.ai.d && a.ai.d[g]) && 'boolean' == typeof g.isWithinReach && (g.isNested && !g.iframeParentDoc && (g.isWithinReach = !1), g.isNested || g.win && !a.g.d(g.win) || (g.isWithinReach = !1));
                        return g;
                    };
                    a.ai.n = function (g, e, c, d) {
                        var b, f, h = {
                                isNested: !1,
                                iframe: null,
                                iframeParentDoc: null
                            };
                        if ((b = a.ai.q(c)) && b.isWithinReach)
                            return !0;
                        f = a.g.m(g, e, !0);
                        b && 'undefined' == typeof b.isWithinReach ? b.isWithinReach = f : (f ? e = a.ai.p(e) : (h = a.ai.o(e, d), (e = h.iframe) && (f = !0)), b = {
                            dimensions: d,
                            iframe: e,
                            iframeParentDoc: h.iframeParentDoc,
                            isNested: h.isNested,
                            isWithinReach: f,
                            win: g
                        }, a.ai.d[c] = b);
                        return b.isWithinReach;
                    };
                    a.ai.r = function (a, e, c, d, b) {
                        if (!a || !e)
                            return !1;
                        a = {
                            w: a.width,
                            h: a.height,
                            el: a.left,
                            et: a.top,
                            er: a.right,
                            eb: a.bottom,
                            vl: e.left,
                            vt: e.top,
                            vr: e.right,
                            vb: e.bottom
                        };
                        'boolean' === typeof d && (a.ia = d);
                        'number' !== typeof c || isNaN(c) || (a.m = c);
                        'number' !== typeof b || isNaN(b) || (a.pv = 1 < b ? b / 100 : b);
                        return a;
                    };
                    a.ai.s = function (g) {
                        return g ? (g = a.t.i(g)) ? a.ai.r(g.cumulRect, g.visibleRect, 0, !1) : !1 : !1;
                    };
                    a.ai.a.d = function () {
                        if (!k) {
                            k = !0;
                            var g = a.av.m('moatframe', 'geom', function (e) {
                                k = !1;
                                a.ai.l(e.msgData.data) || (a.ai.a.e = a.a.bz(e.msgData.data));
                            });
                            a.av.p(g.msg, !1, !0);
                        }
                    };
                    a.ai.c.ping = function (g) {
                        g && g.source === window || a.a.eg() && g.msgData.isBeta || !a.c.c && a.c.dh() && a.ai.a.a();
                    };
                    a.ai.c.check = function (g) {
                        if (!a.a.ef() || g.msgData.isBeta) {
                            var e = !0;
                            a.c.ce() && (e = !1);
                            e && a.ai.m(g);
                        }
                    };
                    a.ai.c.geom = function (g) {
                        if (!a.a.ef() || g.msgData.isBeta)
                            if (a.ai.n(window, g.source, g.msgData.uid) && a.ai.k()) {
                                var e = a.ai.d && a.ai.d[g.msgData.uid] && a.ai.d[g.msgData.uid].iframe;
                                if (e && (e = a.ai.s(e))) {
                                    a.av.o(g, e);
                                    return;
                                }
                                a.av.o(g, a.ai.b.a);
                            } else
                                a.av.o(g, a.ai.b.c);
                    };
                    a.ai.c.kill = function (g) {
                        a.ai.j(g.msgData.uid);
                    };
                }(v));
                (function (a) {
                    a.ar = {};
                    a.ar.b = 5000;
                    a.ar.c = function (k) {
                        if (!a.c.c)
                            return !1;
                        k.activetime = {};
                        k.activetime.counters = {};
                        a.ar.d(k);
                        a.k.a.azsx('adKilled', a.ar.e, {
                            condition: function (a) {
                                return k.zr == a.zr;
                            },
                            once: !0
                        });
                        a.ar.f(k);
                    };
                    a.ar.f = function (k) {
                        if (k.activetime) {
                            var g = a.u.o(k.zr);
                            if (k.activetime.onInViewTimeCount)
                                for (var e in g)
                                    g[e].removeListener && g[e].removeListener(k.activetime);
                            else
                                k.activetime.onInViewTimeCount = a.a.dg([k], a.ar.g);
                            (g = a.u.k(k.zr, !0)) && g.addListener(k.activetime);
                        }
                    };
                    a.ar.d = function (k) {
                        k.activetime.mouseSubId = q.swde.azsx('mouseEvent', a.a.dg([k], a.ar.h));
                        k.activetime.mouseLocalSubId = a.k.a.azsx('mouseEvent', a.a.dg([k], a.ar.h));
                        k.activetime.keyboardSubId = q.swde.azsx('keyboardEvent', a.a.dg([k], a.ar.i));
                        k.activetime.focusSubId = q.swde.azsx('focusStateChange', a.a.dg([k], a.ar.j));
                    };
                    a.ar.e = function (k) {
                        if (k.activetime && (q.swde.sxaz('mouseEvent', { id: k.activetime.mouseSubId }), a.k.a.sxaz('mouseEvent', { id: k.activetime.mouseLocalSubId }), q.swde.sxaz('keyboardEvent', { id: k.activetime.keyboardSubId }), q.swde.sxaz('focusStateChange', { id: k.activetime.focusSubId }), k.activetime && k.activetime.counters && 'object' === typeof k.activetime.counters))
                            for (var g in k.activetime.counters)
                                delete k.activetime.counters[g];
                    };
                    a.ar.k = function (k, g) {
                        a.ar.l(k, !0);
                    };
                    a.ar.h = function (k, g) {
                        a.ar.l(k, !0);
                    };
                    a.ar.i = function (k, g) {
                        a.ar.l(k, !0);
                    };
                    a.ar.j = function (k, g) {
                        g && a.ar.l(k, !0);
                    };
                    a.ar.l = function (k, g) {
                        var e = new z().getTime(), e = k.activetime.activeTS && e - k.activetime.activeTS || 0;
                        g && (1000 < e || !k.activetime.active) && (k.activetime.checkID && a.a.a(k.activetime.checkID), k.activetime.activeTS = new z().getTime(), k.activetime.checkID = a.l.f(a.a.dg([k], a.ar.m), a.ar.b));
                        k.activetime.active = g;
                    };
                    a.ar.m = function (k) {
                        if (k.activetime.active) {
                            var g = new z().getTime() - k.activetime.activeTS < a.ar.b;
                            a.ar.l(k, g);
                        }
                    };
                    a.ar.g = function (k, g, e, c, d) {
                        e = a.ad.a(k.activetime.counters, d);
                        d = a.u.g(k.zr, d);
                        d = (k = k.activetime.active) && d && d.visible && d.visible();
                        c = e.get('lastActiveVis', !1);
                        !e.get('wasEverActiveAndFocused') && k && e.set('wasEverActiveAndFocused', 1);
                        c && d ? e.increment('activeInviewTime', w.max(g, 0)) : (c || d) && e.increment('activeInviewTime', w.max(w.round(0.5 * g), 0));
                        e.set('lastActiveVis', d);
                    };
                    a.ar.a = function (k, g) {
                        if (!a.d.c()) {
                            g.rf = a.c.eu ? 1 : 0;
                            var e;
                            e = a.c.eu;
                            if (!a.c.c)
                                return e = e || a.focus.pageIsVisible() || k && k.counters && k.counters.strictDwell && k.counters.strictDwell.tCur && 0 < k.counters.strictDwell.tCur, g.re = e ? 1 : 0, g;
                            if (!k.activetime)
                                return g;
                            var c = a.u.a(k.zr), c = a.ad.a(k.activetime.counters, c);
                            e = e || c.get('wasEverActiveAndFocused');
                            g.re = e ? 1 : 0;
                            c && 0 < c.get('activeInviewTime') && (g.ft = c.get('activeInviewTime'), g.fv = c.get('lastActiveInviewTime'), g.fw = c.get('activeInviewTimeFirstDelta', c.get('activeInviewTime')), c.set('lastActiveInviewTime', c.get('activeInviewTime')));
                            return g;
                        }
                    };
                    a.k.a.azsx('viewCounterStarted', a.ar.f);
                    a.k.a.azsx('startAdTracking', a.ar.c);
                }(v));
                (function (a) {
                    function k(c) {
                        c.functionInProgress = !1;
                        return 0 < c.pendingFunctions.length ? (c = c.pendingFunctions.shift(), a.a.dg(c, a.aw.call, a.aw)(), !0) : !1;
                    }
                    function g() {
                        try {
                            a = window.__b, (0, window.__w)('INNER_FUNCTION'), window.__w = void 0, window.__b = void 0;
                        } catch (c) {
                            var d = c.name + ' in closure (moat.customIframe): ' + c.message + ', stack=' + c.stack;
                            try {
                                var b = 'undefined' !== typeof omidNative && ('undefined' === typeof Image || Image && Image._MoatProxyOf), e = b ? '' : document.referrer, g = 'undefined' !== typeof a && a.c && a.c.n ? a.c.n : '', l = 'https://px.moatads.com/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=' + escape('REDVENTURES_GAM_HEADER1') + '&ac=1&k=' + escape(d) + '&ar=' + escape('73b697c-clean') + '&iw=' + escape('d244f36') + '&bq=' + escape(g) + '&j=' + escape(e) + '&cs=' + new z().getTime();
                                b ? omidNative.sendUrl(l) : new Image(1, 1).src = l;
                            } catch (k) {
                            }
                        }
                    }
                    function e(c) {
                        if (!c)
                            return !1;
                        var b = c.iframe, e = b.contentWindow.document, h = c.innerFunction, l = c.innerFunctionCbName, q = c.preserveDom;
                        !1 !== a.c.ec() ? (q = e.createElement('script'), q.innerHTML = g.toString().replace('"INNER_FUNCTION"', h), e.body.appendChild(q)) : (h = '<html><head></head><body><script>' + g.toString().replace('"INNER_FUNCTION"', h) + '</script>', q || (h += '<script>setTimeout(function() { document.close(); }, 1);</script>'), e.write(h + '</body></html>'));
                        b.contentWindow.__b = c.Moat;
                        b.contentWindow.__w = c.wrapper;
                        b.contentWindow[g.toString().match(/function (\w+)\(\)/)[1]]();
                        l && a.c.ax[l] && (a.c.ax[l] = null);
                        if (!k(c.frameData))
                            a:
                                if (e = c.setIframeDomain, c = c.preserveDom, b) {
                                    var r;
                                    if (!e)
                                        try {
                                            r = b.contentWindow.document;
                                        } catch (t) {
                                            break a;
                                        }
                                    l = !1 === a.c.ec();
                                    c ? e ? b.src = 'javascript:document.close();' : r.close() : e ? b.src = l ? 'javascript:document.open(); document.close();' : 'javascript:document.head && (document.head.innerHTML=""); document.body && (document.body.innerHTML="");' : l ? (r.open(), r.close()) : (r.head && (r.head.innerHTML = ''), r.body && (r.body.innerHTML = ''));
                                }
                    }
                    function c(a) {
                        if ('string' !== typeof a)
                            return '';
                        var b = a.charAt(0);
                        '\'' !== b && '"' !== b && (a = '\'' + a + '\'');
                        return a;
                    }
                    a.aw = {};
                    a.aw.a = function (c, b, e, g) {
                        if (!c)
                            return !1;
                        try {
                            var l = document.createElement('iframe'), q = b || a.a.dj();
                            if (!l)
                                return !1;
                            a.a['do'](l, g);
                            var r;
                            e ? (e = a.a.cn(e), r = function () {
                                a.a.cm(l, e);
                            }) : (e = a.c.e.document.body, r = function () {
                                e.insertBefore(l, e.insertBefore[0] || null);
                            });
                            var t = {
                                id: q,
                                iframe: l,
                                functionInProgress: !1,
                                pendingFunctions: [],
                                parent: e,
                                loaded: !1
                            };
                            l.onload = function () {
                                l.contentWindow && l.contentDocument && !t.loaded && (t.loaded = !0, k(t));
                            };
                            r();
                            t.loaded = t.loaded || l.contentDocument && 'complete' === l.contentDocument.readyState;
                            c.customIframes || (c.customIframes = {});
                            c.customIframes[q] = t;
                            t.loaded && k(t);
                            a.k.a.azsx('adKilled', function (b) {
                                var c = b.customIframes, d;
                                for (d in c)
                                    c.hasOwnProperty(d) && a.aw.b(b, c[d].id);
                            }, {
                                condition: function (a) {
                                    return c.zr == a.zr;
                                },
                                once: !0
                            });
                            return q;
                        } catch (u) {
                        }
                        return !1;
                    };
                    a.aw.b = function (a, b, c) {
                        var e = a.customIframes[b];
                        c = e && e.iframe;
                        if (!e || !c)
                            return !1;
                        e = e.parent;
                        if (!e)
                            return !1;
                        try {
                            e.removeChild(c);
                        } catch (g) {
                        }
                        a.customIframes[b] = null;
                        delete a.customIframes[b];
                        return !0;
                    };
                    a.aw.call = function (d, b, f, g, l, k) {
                        if (!d || 'undefined' === typeof b)
                            return !1;
                        var r = d && d.customIframes && d.customIframes[b];
                        if (!r || !f)
                            return !1;
                        g = g && 'string' !== typeof g ? g.toString() : c(g);
                        f && 'string' !== typeof f && (f = a.a.dm(f, g));
                        l && 'function' === typeof l || (l = function () {
                        });
                        if (r.functionInProgress || !r.loaded)
                            return r.pendingFunctions.push([
                                d,
                                b,
                                f,
                                g,
                                l,
                                k
                            ]), !1;
                        d = r.iframe;
                        r.functionInProgress = !0;
                        b = !1;
                        try {
                            if (!r.iframe.contentDocument)
                                throw Error();
                        } catch (q) {
                            b = !0;
                        }
                        f = a.l.m(a.a.dg([{
                                iframe: d,
                                frameData: r,
                                Moat: a,
                                wrapper: function (a) {
                                    l(a);
                                },
                                innerFunction: f,
                                innerFunctionCbName: t,
                                setIframeDomain: b,
                                preserveDom: k
                            }], e));
                        if (b) {
                            var t;
                            do
                                t = 'Moat#iqcb' + w.floor(10000 * w.random());
                            while (a.c.ax[t]);
                            a.c.e[a.c.ay][t] = f;
                            d.src = 'javascript:document.open(); document.domain="' + document.domain + '"; window.parent["' + a.c.ay + '"]["' + t + '"]();';
                        } else
                            f();
                    };
                }(v));
                (function () {
                    function a(a) {
                        window._qs = a;
                        (a = window.__b) && a.a.co('https://z.moatads.com/px2/client.js', document.body);
                    }
                    v.ax = {};
                    v.ax.a = function (k) {
                        if (k) {
                            var g = 0 === w.floor(1000 * w.random());
                            k.px2 = {
                                inSample: !1,
                                success: !1,
                                firedPixel: !1
                            };
                            if (g && (k.px2.inSample = !0, g = v.aw.a(k, 'ivt'))) {
                                try {
                                    var e = k.customIframes && k.customIframes[g] && k.customIframes[g].iframe;
                                    e && (e.contentWindow.__PX2__ = k.px2);
                                } catch (c) {
                                }
                                e = v.f.v();
                                e = v.s.b(36, k.ao, e, !1, !0);
                                e.qs.i = v.a.dz('REDVENTURES_GAM_HEADER1', 'PX2');
                                e = v.s.j(e.qs);
                                v.aw.call(k, g, a, e, null, !0);
                                k.px2.success = !0;
                            }
                        }
                    };
                }(v));
                (function (a) {
                    function k(b) {
                        var c = { oz: !0 };
                        if (!a.c.am().isInApp || a.c.cq())
                            c.su = !0, c.of = !0;
                        if (!f[b])
                            return !1;
                        for (var d in f[b])
                            if (c[d] && f[b].hasOwnProperty(d) && !f[b][d])
                                return !1;
                        return !0;
                    }
                    function g(b) {
                        a.ac.e(b);
                        a.ac.f(b);
                        a.ac.g(b);
                        a.ac.h(b);
                        var c = k(b.zr);
                        !b.hasAdLoadedfired && c ? h = !0 : !h && c && (c = { e: 9 }, c.q = b.aq[9]++, a.s.a(b, c), h = !0);
                    }
                    function e(a) {
                        return {
                            st: !1,
                            su: !1,
                            of: !1,
                            oz: !1
                        };
                    }
                    var c = 0, d, b = B, f = {};
                    a.ac = {};
                    a.ac.c = function (a) {
                        return !1;
                    };
                    a.ac.d = function () {
                        var d = new z().getTime(), e = d - c;
                        if (c && !(1000 > e)) {
                            c = d;
                            for (var f in b)
                                b.hasOwnProperty(f) && g(b[f]);
                            a.k.a.zaxs('hiddenAds:updated');
                        }
                    };
                    var h = !1;
                    a.ac.e = function (b) {
                        f[b.zr] || (f[b.zr] = e(b));
                        if (!0 !== f[b.zr].st) {
                            var c = a.u.k(b.zr);
                            c ? (b.isCurrentlyStacked = a.t.r(b), !1 === f[b.zr].st && (f[b.zr].st = !1 === c.adStartedOnScreen() || !1 === b.isCurrentlyStacked)) : f[b.zr].st = !0;
                        }
                    };
                    a.ac.f = function (b) {
                        var c = f, d = b.zr;
                        c[d] = f[d] || e(b);
                        var g = c[d].su;
                        if (!g) {
                            var h = b.WINDOW || window, g = b.AD_RECT || a.t.k(b.aa, h, b._calcVideoBasedOnContainer), h = a.c.r(h), g = b.isInIframe ? g && h && !(g.left >= h.width || 0 >= g.right || g.top >= h.height || 0 >= g.bottom) : !0;
                            c[d].su = g;
                        }
                    };
                    a.ac.g = function (b) {
                        var c = f, d = b.zr;
                        c[d] = f[d] || e(b);
                        var g = c[d].of;
                        g || (g = a.c.r(b.WINDOW), g = b.isInIframe ? g && !(5 >= g.width || 5 >= g.height) : !0, c[d].of = g);
                    };
                    a.ac.h = function (b) {
                        var c = f[b.zr];
                        f[b.zr] = f[b.zr] || e(b);
                        if (b.aa) {
                            var d = 0 < a.a.df(b);
                            b.isCurrentlyTransparent = !d;
                            c.oz = c.oz || d;
                            return d;
                        }
                        return c.oz;
                    };
                    a.ac.b = function (a) {
                        var b = {}, c, d;
                        for (d in f[a])
                            f[a].hasOwnProperty(d) && (c = f[a][d], b[d] = c ? 1 : 0);
                        return b;
                    };
                    a.ac.a = function (b) {
                        return a.c.dz() ? !1 : !k(b);
                    };
                    a.k.a.azsx('adLoaded', function (a) {
                        a.hasAdLoadedfired = !0;
                    });
                    a.k.a.azsx('startAdTracking', function (b) {
                        g(b);
                        c = new z().getTime();
                        d || (d = new z().getTime() + 'ha', a.k.a.azsx('view:tick', function () {
                            a.ac.d();
                        }, { id: d }));
                    });
                    a.k.a.azsx('allLocalAdsKilled', function () {
                        a.k.a.sxaz('view:tick', { id: d });
                        b = null;
                    }, { once: !0 });
                    a.k.a.azsx('adEntersView', function (b) {
                        a.ac.e(b);
                    }, { once: !0 });
                    a.k.a.azsx('adKilled', function (a) {
                        a && !a.ep && (delete a.elementsFromPointCache, delete f[a.zr]);
                    });
                }(v));
                (function (a) {
                    a.al = {};
                    var k, g;
                    a.al.g = function (e) {
                        if (g)
                            e();
                        else if (k.googletag && k.googletag.apiReady && k.googletag.pubads())
                            g = k.googletag.pubads(), e();
                        else {
                            k.googletag = k.googletag || {};
                            k.googletag.cmd = k.googletag.cmd || [];
                            var c = a.l.m(e), d = function () {
                                    var a = k.googletag;
                                    (g = a && a.apiReady && a.pubads()) && c();
                                };
                            a.k.a.azsx('adKilled', function () {
                                var b = k.googletag;
                                if (b && a.a.dp(b.apiReady) && b.cmd && a.a.f(b.cmd)) {
                                    var c = b.cmd.indexOf(d);
                                    -1 !== c && b.cmd.splice(c, 1);
                                }
                            });
                            k.googletag.cmd.push(d);
                        }
                    };
                    a.al.l = function () {
                        if (g && 'function' !== typeof g.getSlots)
                            return !1;
                        try {
                            return g.getSlots();
                        } catch (a) {
                            return [];
                        }
                    };
                    a.al.a = function () {
                        if (g && 'function' === typeof g.getSlotIdMap)
                            return g.getSlotIdMap();
                    };
                    a.al.m = function (a) {
                        return g.getTargeting(a);
                    };
                    a.al.n = function () {
                        if ('function' !== typeof g.getTargetingKeys || 'function' !== typeof g.getTargeting)
                            return !1;
                        var e = g.getTargetingKeys(), c = {};
                        a.a.forEach(e, function (a) {
                            c[a] = g.getTargeting(a);
                        });
                        return c;
                    };
                    a.al.o = function (a, c) {
                        if ('function' !== typeof g.setTargeting)
                            return !1;
                        g.setTargeting(a, c);
                        return !0;
                    };
                    a.al.p = function (a) {
                        if ('function' !== typeof g.clearTargeting)
                            return !1;
                        g.clearTargeting(a);
                    };
                    a.al.q = function (a) {
                        if (a && 'function' === typeof a.getTargetingKeys)
                            return a.getTargetingKeys();
                    };
                    a.al.r = function (a, c) {
                        return a && 'function' === typeof a.getTargeting && c ? a.getTargeting(c) : !1;
                    };
                    a.al.s = function (e) {
                        var c = {}, d = a.al.q(e);
                        a.a.f(d) && a.a.forEach(d, function (b) {
                            c[b] = a.al.r(e, b);
                        });
                        return c;
                    };
                    a.al.t = function (e) {
                        if (e) {
                            e = a.al.s(e);
                            var c = a.al.n();
                            a.a.forEach(e, function (a, b) {
                                c[b] = a;
                            });
                            return c;
                        }
                    };
                    a.al.j = function (a, c, d) {
                        if (!(a && c && d && 'function' === typeof a.setTargeting))
                            return !1;
                        a.setTargeting(c, d);
                    };
                    a.al.u = function (a, c) {
                        if (!a || 'function' !== typeof a.clearTargeting)
                            return !1;
                        a.clearTargeting(c);
                    };
                    a.al.v = function (e, c) {
                        if (e && c && g && 'function' === typeof g.addEventListener) {
                            var d = a.l.m(c);
                            g.addEventListener(e, d);
                        }
                    };
                    a.al.d = function (a) {
                        if (a && 'function' === typeof a.getSlotElementId)
                            return a.getSlotElementId();
                    };
                    a.al.f = function (a) {
                        if (a && 'function' === typeof a.getSlotId && (a = a.getSlotId()) && 'function' === typeof a.getId)
                            return a = a.getId(), k.document.getElementById('google_ads_iframe_' + a);
                    };
                    a.al.c = function (a) {
                        if (a && 'function' === typeof a.getAdUnitPath)
                            return a.getAdUnitPath();
                    };
                    a.al.e = function (e) {
                        if (e = a.al.c(e)) {
                            e = e && e.split('/');
                            var c = [];
                            a.a.forEach(e, function (a) {
                                0 < a.length && c.push(a);
                            });
                            return c;
                        }
                    };
                    a.al.h = function (e) {
                        var c = [];
                        e && 'function' === typeof e.getSizes && a.a.forEach(e.getSizes(), function (a) {
                            'function' === typeof a.getWidth && 'function' === typeof a.getHeight && c.push([
                                a.getWidth(),
                                a.getHeight()
                            ]);
                        });
                        return c;
                    };
                    a.al.w = function () {
                        var a = k && k.googletag && k.googletag.sizeMapping;
                        if (a)
                            return a();
                    };
                    a.al.b = function () {
                        if (g) {
                            var e, c = document.body;
                            a.a.forEach(3, function () {
                                e = c;
                                c = a.g.b(c);
                                if (!c)
                                    return !1;
                            });
                            var d = e && e.id, b, f = !1;
                            d && -1 < d.indexOf('google_ads_iframe') && (f = !0, b = d.replace(/google_ads_iframe_?/, ''));
                            if (f) {
                                var d = g.getSlotIdMap(), h;
                                for (h in d)
                                    if (h && 'string' === typeof h && h === b)
                                        return d[h];
                            }
                        }
                    };
                    a.al.i = function () {
                        return k;
                    };
                    a.al.k = function (a, c) {
                        if (g && 'function' !== typeof g.refresh)
                            return !1;
                        g.refresh(a, c);
                    };
                    (function () {
                        k = window;
                        a.al.g(function () {
                            return !0;
                        });
                    }());
                }(v));
                (function (a) {
                    function k() {
                        if (!t && r !== h.LOADING) {
                            t = !0;
                            a.ay.a.allData = new z().getTime();
                            var b = window.moatYieldReady;
                            'function' === typeof b && a.l.m(b)();
                        }
                    }
                    function g(b) {
                        var c;
                        c = e(b) ? x.c : x.b;
                        a.al.g(function () {
                            a.al.o(l.d, c);
                            a.al.o(l.e, c);
                        });
                    }
                    function e(a) {
                        return 'object' === typeof a && !1 !== a._pbd;
                    }
                    function c() {
                        function b(a) {
                            f && console.log('>>>MOAT YIELD INTELLIGENCE/' + a);
                        }
                        function c(f) {
                            var g, h, k;
                            if (!r)
                                return b('setMoatTargetingForSlot: No Moat API response for slot level data, not setting targeting.'), a.al.j(f, l.d, x.d), a.al.j(f, l.e, x.d), !1;
                            if (!e(r))
                                return b('setMoatTargetingForSlot: No historical slot data available, not setting targeting.'), a.al.j(f, l.d, x.e), a.al.j(f, l.e, x.e), !1;
                            if (!f || 'function' !== typeof f.getSlotElementId)
                                return b('setMoatTargetingForSlot: Slot is missing, not setting targeting.'), !1;
                            h = g = f.getSlotElementId();
                            (k = a.a.ek(g)) && (h = k);
                            k = r[h] && r[h][d];
                            if (!k)
                                return b('setMoatTargetingForSlot: slotId ' + g + '; No historical data found for slotId of ' + h + ', not setting targeting.'), a.al.j(f, l.d, x.f), a.al.j(f, l.e, x.f), !1;
                            for (var p in k)
                                if (a.a.cz(k, p)) {
                                    var q = k[p];
                                    if (a.a.dc(q)) {
                                        b('setMoatTargetingForSlot: slotId ' + g + '; Setting ' + p + ' value of ' + q + '.');
                                        h = parseInt(q);
                                        q = q.toString();
                                        if ('number' === typeof h && 0 === h % 10 && 10 < h && 100 >= h)
                                            for (q = [q], h = h / 10 - 1; 0 < h; h--)
                                                q.push((10 * h).toString());
                                        a.al.j(f, p, q);
                                    }
                                }
                        }
                        var d, f = !1, g, h, k, r;
                        d = a.c.da ? 'Mobile' : 'Desktop';
                        this.slotDataAvailable = function () {
                            return e(r) ? !!r : !1;
                        };
                        this.moatHasTargetingData = function () {
                            return !!r;
                        };
                        this.pageDataAvailable = function () {
                            return !1;
                        };
                        this.safetyDataAvailable = function () {
                            return !1;
                        };
                        this.enableLogging = function () {
                            return f = !0;
                        };
                        this.disableLogging = function () {
                            f = !1;
                            return !0;
                        };
                        this.setMoatTargetingForSlot = function (b) {
                            b = a.a.dg([b], c);
                            a.al.g(b);
                        };
                        this.setMoatTargetingForAllSlots = function () {
                            a.al.g(function () {
                                var d = a.al.l();
                                if (!d)
                                    return b('setMoatTargetingForAllSlots: Failed to get slots from GPT, not setting targeting.'), !1;
                                a.a.forEach(d, function (a) {
                                    c(a);
                                }, this);
                            });
                        };
                        this.getMoatTargetingForSlot = function (c) {
                            var e, f, p;
                            switch (typeof c) {
                            case 'string':
                                var q = a.al.l();
                                if (!a.a.f(q)) {
                                    b('getMoatTargetingForSlot: No valid slot identifier provided, exiting.');
                                    return;
                                }
                                a.a.forEach(q, function (a) {
                                    if ('function' === typeof a.getSlotElementId && a.getSlotElementId() === c)
                                        return f = a, p = c, !1;
                                });
                                break;
                            case 'object':
                                if ('function' !== typeof c.getSlotElementId) {
                                    b('getMoatTargetingForSlot: No valid slot identifier provided, exiting.');
                                    return;
                                }
                                f = c;
                                p = f.getSlotElementId();
                                break;
                            default:
                                b('getMoatTargetingForSlot: No valid slot identifier provided, exiting.');
                                return;
                            }
                            'object' === typeof f && 'function' === typeof f.getTargeting ? e = p : b('getMoatTargetingForSlot: Failed to get slot targeting, GPT slot object is invalid.');
                            'string' !== typeof e && (e = '');
                            e = r && r[e] && r[e][d] || {};
                            e[l.b] = g;
                            e[l.c] = h;
                            e[l.a] = k;
                            return e;
                        };
                        this.getMoatTargetingForPage = function () {
                            var a = {};
                            a[l.b] = g;
                            a[l.c] = h;
                            a[l.a] = k;
                            return a;
                        };
                        this.__A = function (a, b) {
                            g = a;
                            h = b;
                        };
                        this.__B = function (a) {
                            k = a;
                        };
                        this.__C = function (a) {
                            r = a;
                        };
                    }
                    a.ay = {};
                    var d = w.floor(w.random() * w.pow(10, 12)), b = a.a.ao(), f = a.a.am();
                    a.ay.a = {
                        wrapper: window.moatHeaderInitTime || a.c.bj,
                        apiReady: null,
                        nadoData: null,
                        allData: null
                    };
                    a.ay.b = {
                        rendered: 0,
                        slotTargetingLoaded: 0,
                        slotTargetingSet: 0,
                        pageDataTargetingSet: 0,
                        safetyTargetingSet: 0,
                        emptySlot: 0
                    };
                    var h = {
                            LOADING: '0',
                            LOADED: '1'
                        }, l = {
                            a: 'm_data',
                            b: 'm_safety',
                            c: 'm_categories',
                            d: 'm_mv',
                            e: 'm_gv'
                        }, x = a.c.el, r = h.LOADING, t = !1;
                    a.ay.c = function () {
                        function b(a, c) {
                            var d = 'safe' === c ? 'moat_safe' : 'moat_unsafe';
                            a && -1 !== a.indexOf('moat_unsure') ? (a.splice(a.indexOf('moat_unsure'), 1), a.push(d)) : 0 === a.length && a.push(d);
                            return a;
                        }
                        var d = new c();
                        window.moatPrebidApi = d;
                        k();
                        a.ay.a.apiReady = new z().getTime();
                        a.ag.d('nado-all', function (c) {
                            var e, f, q;
                            if ('object' !== typeof c)
                                return !1;
                            q = '0';
                            c && 'n' in c && (q = '1');
                            a.al.g(function () {
                                a.al.o(l.a, q);
                            });
                            d.pageDataAvailable = function () {
                                return !0;
                            };
                            d.__B(q);
                            var t = a.a.dr(new RegExp('.*callback=' + c.callback + '.*'));
                            (t = a.a.dq(t)) && t.responseEnd && c.h && (a.ay.a.nadoResponseEnd = t.responseEnd, a.ay.a.nadoResponseExecution = w.round(c.h));
                            e = a.a.aw(c);
                            c.c && a.a.f(c.c) && (f = c.c);
                            e && a.al.g(function () {
                                a.al.o(l.b, e);
                            });
                            f && (f = b(f, e), a.al.g(function () {
                                a.al.o(l.c, f);
                            }));
                            d.safetyDataAvailable = function () {
                                return !0;
                            };
                            d.__A(e, f);
                            c = c.yi;
                            g(c);
                            d.__C(c);
                            a.ay.a.nadoData = new z().getTime();
                            r = h.LOADED;
                            k();
                        });
                    };
                    a.ay.d = function () {
                        var b = a.a.dg([
                            'slotRenderEnded',
                            function (b) {
                                if ('undefined' !== typeof b && 'undefined' !== typeof b.slot) {
                                    var c = window.moatPrebidApi, d = b.slot;
                                    if (!c)
                                        return !1;
                                    var e = {
                                        slotTargetingLoaded: !1,
                                        slotTargetingSet: !1,
                                        pageDataTargetingSet: !1,
                                        safetyTargetingSet: !1,
                                        emptySlot: !1
                                    };
                                    e.slotTargetingLoaded = c.slotDataAvailable();
                                    'undefined' !== typeof a.al.r(d, l.d)[0] && (e.slotTargetingSet = !0);
                                    b.isEmpty && (e.emptySlot = !0);
                                    'undefined' !== typeof a.al.m(l.a)[0] && (e.pageDataTargetingSet = !0);
                                    'undefined' !== typeof a.al.m(l.b)[0] && (e.safetyTargetingSet = !0);
                                    a.ay.b.rendered++;
                                    a.a.forEach(e, function (b, c) {
                                        !0 === b && a.ay.b[c]++;
                                    });
                                }
                            }
                        ], a.al.v);
                        a.al.g(b);
                    };
                    a.ay.e = function (c, e, g) {
                        g = {};
                        g.e = c;
                        g.t = a.c.bj;
                        g.de = d;
                        g.d = 'REDVENTURES_GAM_HEADER1:' + (a.c.da ? 'Mobile' : 'Desktop') + ':-:-';
                        g.i = 'YIELD_INTELLIGENCE_INTERNAL1';
                        g.sgs = 5;
                        g.ar = '73b697c-clean';
                        g.iw = 'd244f36';
                        43 === c && 'undefined' !== typeof e && (c = e.getSlotElementId(), g.zMoatDfpSlotId = c || '-');
                        g.zMoatRendered = a.ay.b.rendered;
                        g.zMoatSlotTargetingLoaded = a.ay.b.slotTargetingLoaded;
                        g.zMoatSlotTargetingSet = a.ay.b.slotTargetingSet;
                        g.zMoatPageDataTargetingSet = a.ay.b.pageDataTargetingSet;
                        g.zMoatSafetyTargetingSet = a.ay.b.safetyTargetingSet;
                        g.zMoatEmptySlot = a.ay.b.emptySlot;
                        e = a.ay.a.wrapper;
                        var h = a.ay.a.nadoData;
                        c = a.ay.a.allData;
                        g.zMoatNadoDataLoadTime = h && h - e || 'Not Loaded';
                        g.zMoatAllDataLoadTime = c && c - e || 'Not Loaded';
                        a.ay.a.nadoResponseEnd && a.ay.a.nadoResponseExecution && (g.zMoatNL = a.ay.a.nadoResponseExecution - a.ay.a.nadoResponseEnd);
                        g.bo = b;
                        g.bd = f;
                        g.ac = 1;
                        g.bq = a.c.n;
                        g.f = Number(!ia);
                        (e = window.moatPrebidApi) && 'function' === typeof e.slotDataAvailable && (g.zn = e.slotDataAvailable() ? 1 : 0);
                        c = c && c - a.c.bj;
                        a.a.dc(c) && (g['if'] = c);
                        c = a.a.cv(g, !0);
                        c += '&na=' + a.a.cx(c, g.i);
                        q.yh.yi(c + '&cs=0', T, null, !0);
                    };
                    (function () {
                        a.al.g(function () {
                            a.a.forEach(l, function (b, c) {
                                a.al.o(b, x.a);
                            });
                        });
                    }());
                    var u = a.f.v(!0);
                    u.tw = a.c.ev && a.f.ar(a.c.ev) || null;
                    u.url = a.c.ba;
                    u.pcode = 'redventuresgamheader644747280705';
                    u = a.a.cv(u, !0);
                    a.ag.b('nado-all', 'MoatNadoAllJsonpRequest', 'https://mb.moatads.com/yi/v2?' + u);
                }(v));
                (function (a) {
                    function k(c, b) {
                        var e = c.slot, g = 'function' === typeof e.getAdUnitPath && e.getAdUnitPath(), l = a.ao.d(a.a.cc(), b);
                        l || (l = {}, l._AD_FORMAT = b, a.ao.h(l));
                        l.trackedFromDfpHeaderTag = !0;
                        l.dfpAdId = e.getSlotElementId();
                        l.slotMappingId = 'function' === typeof e.getSlotId && e.getSlotId().getId();
                        l.moatClientLevel1 = c.advertiserId || '';
                        l.moatClientLevel2 = c.campaignId || '';
                        l.moatClientLevel3 = c.lineItemId || c.sourceAgnosticLineItemId || '';
                        l.moatClientLevel4 = c.creativeId || c.sourceAgnosticCreativeId || '';
                        a.a.forEach([
                            'moatClientLevel1',
                            'moatClientLevel2',
                            'moatClientLevel3',
                            'moatClientLevel4'
                        ], function (b) {
                            a.a.dc(l[b]) && (l[b] = l[b].toString());
                        });
                        'string' === typeof g && (e = '/' == g[0] ? 2 : 1, g = g.split('/').slice(e), e = g[g.length - 1], l.moatClientSlicer1 = g[0] || '', l.moatClientSlicer2 = e || '', a.a.forEach(g, function (a, b) {
                            l['zMoatAdUnit' + (b + 1)] = a;
                        }));
                        return l;
                    }
                    function g(a, b) {
                        var c = a && a[b];
                        return c && c.toString ? c.toString() : '';
                    }
                    function e(c, b, e) {
                        c = c || {};
                        c = [
                            {
                                whitelistValues: ['5024496911'],
                                id: g(c, 'advertiserId'),
                                zmoat: 'zMoatDFPAdIds'
                            },
                            {
                                id: g(c, 'sourceAgnosticLineItemId'),
                                zmoat: 'zMoatDFPLineItemIds'
                            },
                            {
                                id: g(c, 'campaignId'),
                                zmoat: 'zMoatDFPOrderIds'
                            }
                        ];
                        if (a.a.some(c, function (c) {
                                if (!c.id)
                                    return !1;
                                var d = b[c.zmoat] && b[c.zmoat].split(':') || [];
                                c.whitelistValues && c.whitelistValues.length && (d = d.concat(c.whitelistValues));
                                return a.a.ax(d, c.id);
                            }))
                            return !0;
                    }
                    function c(c) {
                        var b = c.slot;
                        if (b && !c.isEmpty) {
                            var f = k(c, 'adx');
                            if (e(c, f, b) && (a.s.b(17, f), c = (c = a.al.d(b)) && document.getElementById(c))) {
                                var b = (b = c.querySelector('iframe')) && b.contentWindow, g;
                                try {
                                    g = !a.g.d(b) && b.document && b.document.body && b.document.body.children && 0 < b.document.body.children.length && b.document.body;
                                } catch (l) {
                                }
                                g || (g = c);
                                a.an.d(g, f, void 0, void 0, void 0, b);
                            }
                        }
                    }
                    a.ak = {};
                    a.ak.b = function () {
                        a.al.g(function () {
                            a.al.v('slotRenderEnded', c);
                        });
                    };
                    a.ak.a = function (c) {
                        var b = a.a.dg([c], function (b) {
                            a.x.g(b);
                        });
                        a.l.c(c.WINDOW, 'unload', b, 'dfphead-unload');
                    };
                    a.k.a.azsx('adKilled', function (c) {
                        c && !c.ep && a.l.d(c.WINDOW, 'unload', null, 'dfphead-unload');
                    });
                }(v));
                (function (a) {
                    function k(d) {
                        d && (a.c.ax.b || (a.c.ax.b = !0, q.dcsx && q.dcsx.ynds(window, 'deviceorientation', 'deviceorientation-' + a.c.ax.a, 'deviceorientationFn' + a.c.ax.a)), h || (h = !0, q.swde.azsx('deviceorientation-' + a.c.ax.a, e)), b.hasOwnProperty(d.zr) || (b[d.zr] = new c()));
                    }
                    function g(a) {
                        a && delete b[a.zr];
                    }
                    function e(a) {
                        var c = z.now(), d = !1;
                        200 < c - f && (f = c, d = !0);
                        for (var e in B)
                            B.hasOwnProperty(e) && b.hasOwnProperty(e) && (c = b[e], 1500 > c.eventsCount && (c.eventsCount += 1, d && c.handleOrientationEvent(a)));
                    }
                    function c() {
                        this.validEventsHandledCount = this.eventsHandledCount = this.eventsCount = 0;
                        this.alpha = new d(0, 360);
                        this.beta = new d(-180, 180);
                        this.gamma = new d(-90, 90);
                    }
                    function d(a, b) {
                        this.minExpectedVal = a;
                        this.maxExpectedVal = b;
                        this.normalizedMax = w.abs(this.minExpectedVal) + this.maxExpectedVal;
                        this.rangeRight = this.rangeLeft = this.origin = null;
                    }
                    a.aq = {};
                    var b = {}, f = 0, h = !1;
                    c.prototype.isValidEvent = function (a) {
                        return !a.alpha && 0 !== a.alpha || !a.beta && 0 !== a.beta || !a.beta && 0 !== a.beta || 0 === a.alpha && 0 === a.beta && 0 == a.gamma ? !1 : !0;
                    };
                    c.prototype.handleOrientationEvent = function (a) {
                        this.eventsHandledCount += 1;
                        this.isValidEvent(a) && (this.validEventsHandledCount += 1, this.alpha.addValue(a.alpha), this.beta.addValue(a.beta), this.gamma.addValue(a.gamma));
                    };
                    d.prototype.isOutsideRange = function (a) {
                        return this.rangeLeft > this.rangeRight ? this.rangeLeft > a && a > this.rangeRight : a < this.rangeLeft || a > this.rangeRight;
                    };
                    d.prototype.extendRange = function (a) {
                        this.isOutsideRange(a) && ((a < this.rangeLeft ? this.rangeLeft - a : this.rangeLeft + this.normalizedMax - a) <= (a > this.rangeRight ? a - this.rangeRight : this.normalizedMax - this.rangeRight + a) ? this.rangeLeft = a : this.rangeRight = a);
                    };
                    d.prototype.addValue = function (a) {
                        var b = a + w.abs(this.minExpectedVal);
                        null === this.origin ? (this.origin = a.toFixed(3), this.rangeRight = this.rangeLeft = b) : this.extendRange(b);
                    };
                    d.prototype.getRangeLength = function () {
                        return null === this.origin ? -1 : this.rangeRight >= this.rangeLeft ? (this.rangeRight - this.rangeLeft).toFixed(3) : (this.normalizedMax - this.rangeLeft + this.rangeRight).toFixed(3);
                    };
                    a.aq.a = function (a) {
                        var c = {};
                        b[a] && (a = b[a], c = {
                            oe: [
                                a.eventsCount,
                                a.eventsHandledCount,
                                a.validEventsHandledCount,
                                a.alpha.origin ? a.alpha.origin : 'null',
                                a.alpha.getRangeLength(),
                                a.beta.origin ? a.beta.origin : 'null',
                                a.beta.getRangeLength(),
                                a.gamma.origin ? a.gamma.origin : 'null',
                                a.gamma.getRangeLength()
                            ].join(':')
                        });
                        return c;
                    };
                    a.c.e.DeviceOrientationEvent && (a.k.a.azsx('adInitialized', k), a.k.a.azsx('adKilled', g), a.k.a.azsx('allLocalAdsKilled', function () {
                        q && q.dcsx && q.dcsx.engn && q.dcsx.engn({ listenerName: 'deviceorientationFn' + a.c.ax.a });
                        q.swde.sxaz('deviceorientation-' + a.c.ax.a, { callback: e });
                        b = {};
                        h = a.c.ax.b = !1;
                    }));
                }(v));
                (function (a) {
                    a.ap = {};
                    a.ap.a = function () {
                        var k = a.g.a(), g = [
                                '-',
                                '-',
                                '-',
                                '-',
                                '-'
                            ];
                        if (!k || !k.performance)
                            return !1;
                        var e = k.performance;
                        if (!e || 'function' !== typeof e.getEntriesByType)
                            return !1;
                        g[0] = k === window.top ? 1 : 0;
                        for (var c = e.getEntriesByType('paint'), d = 0; d < c.length; d++)
                            k = c[d], 'first-paint' === k.name && (g[1] = w.round(k.startTime)), 'first-contentful-paint' === k.name && (g[2] = w.round(k.startTime));
                        e = e.getEntriesByType('navigation');
                        0 < e.length && (k = e[0], 'duration' in k && (g[3] = w.round(k.duration)), 'domInteractive' in k && (g[4] = w.round(k.domInteractive)));
                        return g.join(':');
                    };
                }(v));
                v.k.a.zaxs('modulesReady', q);
                var xa = v.focus.pageIsVisible();
                v.c.eu = 1 == window.history.length && !xa && (v.c.c && '' != document.referrer || !v.c.c);
                v.c.j || v.c.al || v.c.dv();
                (v.c.j && v.c.ef() || 'dummy.url' === v.a.ao()) && v.c.dv();
                var G = 'moatFoundREDVENTURES_GAM_HEADER1', J = '__moat__REDVENTURES_GAM_HEADER1';
                v.c.am().isInApp || v.ai.g();
                var N = v.a.cc();
                T = 'https://px.moatads.com';
                v.at.a(ta);
                var qa = function () {
                        q.zs && q.dcsx && (q.dcsx.engn({ listenerName: 'unloadFn' + v.c.ax.a }), q.dcsx.engn({ listenerName: 'beforeunloadFn' + v.c.ax.a }));
                        ha || (ha = !0, v.d.b());
                    }, La = v.c.ba;
                v.a.ao();
                v.ay.e(17);
                v.k.a.azsx('trackingReady', ya, { once: !0 });
                v.k.a.zaxs('trackingReady');
                v.k.a.azsx('allLocalAdsKilled', za, { once: !0 });
            }(Date, Math));
        } catch (z) {
            var ct = new Date().getTime();
            window['Moat#ETS'] || (window['Moat#ETS'] = ct);
            window['Moat#EMC'] || (window['Moat#EMC'] = 0);
            var et = ct - window['Moat#ETS'], hourElapsed = 3600000 <= et, msg = z.name + ' in closure (global): ' + z.message + ', stack=' + z.stack;
            if (!hourElapsed && 10 > window['Moat#EMC']) {
                window['Moat#EMC']++;
                try {
                    var pixelDomain = 'px.moatads.com', isDomless = 'undefined' !== typeof omidNative && ('undefined' === typeof Image || Image && Image._MoatProxyOf), documentReferrer = isDomless ? '' : document.referrer, isBeta = !1, viewHash = 'undefined' === typeof AD_VIEW_HASH ? isBeta ? 'REDVENTURES_GAM_HEADER1_BETA' : 'REDVENTURES_GAM_HEADER1' : AD_VIEW_HASH, tagType = 'undefined' !== typeof Moat && Moat.c && Moat.c.n ? Moat.c.n : '', pxSrc = 'https://' + pixelDomain + '/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=' + escape(viewHash) + '&ac=1&k=' + escape(msg) + '&ar=' + escape('73b697c-clean') + '&iw=' + escape('d244f36') + '&bq=' + escape(tagType) + '&j=' + escape(documentReferrer) + '&cs=' + new Date().getTime();
                    if (isDomless)
                        omidNative.sendUrl(pxSrc);
                    else {
                        var moat_px = new Image(1, 1);
                        moat_px.src = pxSrc;
                    }
                } catch (w) {
                }
            } else if (hourElapsed) {
                window['Moat#EMC'] = 1;
                window['Moat#ETS'] = ct;
                try {
                    pixelDomain = 'px.moatads.com', documentReferrer = (isDomless = 'undefined' !== typeof omidNative && ('undefined' === typeof Image || Image && Image._MoatProxyOf)) ? '' : document.referrer, isBeta = !1, viewHash = 'undefined' === typeof AD_VIEW_HASH ? isBeta ? 'REDVENTURES_GAM_HEADER1_BETA' : 'REDVENTURES_GAM_HEADER1' : AD_VIEW_HASH, tagType = 'undefined' !== typeof Moat && Moat.c && Moat.c.n ? Moat.c.n : '', pxSrc = 'https://' + pixelDomain + '/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=' + escape(viewHash) + '&ac=1&k=' + escape(msg) + '&ar=' + escape('73b697c-clean') + '&iw=' + escape('d244f36') + '&bq=' + escape(tagType) + '&j=' + escape(documentReferrer) + '&cs=' + new Date().getTime(), isDomless ? omidNative.sendUrl(pxSrc) : (moat_px = new Image(1, 1), moat_px.src = pxSrc);
                } catch (w) {
                }
            }
        }
        ;
    }())
}