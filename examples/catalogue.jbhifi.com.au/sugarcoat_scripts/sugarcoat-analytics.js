{
    const $___mock_fa1d8ac175ddd4d9 = {};
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
    })($___mock_fa1d8ac175ddd4d9);
    (function () {
        !function (i) {
            'use strict';
            i.universalAnalytics = {
                dimensionForVersion: void 0,
                version: void 0,
                appName: void 0,
                dimensionForAdditionalLabel: void 0,
                uaIDs: [],
                nonInteraction: !0,
                multiua: function () {
                    if ('undefined' == typeof i.FBO || !i.FBO.Config.DisableViewTracking) {
                        var n = Array.prototype.slice.call(arguments);
                        if (i.universalAnalytics.uaIDs)
                            for (var a = 0, t = i.universalAnalytics.uaIDs.length; a < t; a++) {
                                var e = n.slice();
                                e[0] = 'additional' + a.toString() + '.' + e[0], i.universalAnalytics.pushApply(e);
                            }
                    }
                },
                fbua: function () {
                    if ('undefined' == typeof i.FBO || !i.FBO.Config.DisableViewTracking) {
                        var n = Array.prototype.slice.call(arguments);
                        if (i.universalAnalytics.fbIDs)
                            for (var a = 0, t = i.universalAnalytics.fbIDs.length; a < t; a++) {
                                var e = n.slice();
                                e[0] = 'additional' + a.toString() + '.' + e[0], i.universalAnalytics.pushApply(e);
                            }
                    }
                },
                lastApply: new Date().getTime(),
                timerId: void 0,
                tryApply: function () {
                    var n = new Date().getTime(), a = n - i.universalAnalytics.lastApply;
                    if (a > 40) {
                        var t = i.universalAnalytics.events.shift();
                        i.ua.apply(null, t), i.universalAnalytics.lastApply = n;
                    }
                    i.universalAnalytics.events.length > 0 ? void 0 === i.universalAnalytics.timerId && (i.universalAnalytics.timerId = setInterval(function () {
                        i.universalAnalytics.tryApply();
                    }, 40)) : (clearInterval(i.universalAnalytics.timerId), i.universalAnalytics.timerId = void 0);
                },
                pushApply: function (n) {
                    i.universalAnalytics.events.push(n), i.universalAnalytics.tryApply();
                },
                events: [],
                ip: void 0,
                generateId: function () {
                    const $___old_e8eadc8ba93b1af4 = {}.constructor.getOwnPropertyDescriptor(window, 'localStorage');
                    try {
                        if ($___old_e8eadc8ba93b1af4)
                            ({}.constructor.defineProperty(window, 'localStorage', $___mock_fa1d8ac175ddd4d9.localStorage));
                        return function () {
                            var i = 'xx-x-x-x-xxx'.replace(/[xy]/g, function () {
                                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
                            });
                            try {
                                localStorage.setItem('clientId', i);
                            } catch (n) {
                            }
                            return i;
                        }.apply(this, arguments);
                    } finally {
                        if ($___old_e8eadc8ba93b1af4)
                            ({}.constructor.defineProperty(window, 'localStorage', $___old_e8eadc8ba93b1af4));
                    }
                },
                init: function (n, a, t, e, s, l, o, r, c, u, y) {
                    const $___old_55b15102778af883 = {}.constructor.getOwnPropertyDescriptor(window, 'localStorage');
                    try {
                        if ($___old_55b15102778af883)
                            ({}.constructor.defineProperty(window, 'localStorage', $___mock_fa1d8ac175ddd4d9.localStorage));
                        return function () {
                            if ('undefined' == typeof i.FBO || !i.FBO.Config.DisableViewTracking) {
                                if ('[object Object]' === Object.prototype.toString.call(n)) {
                                    var d = n;
                                    i.universalAnalytics.platform = d.platform, i.universalAnalytics.startDate = d.startDate, i.universalAnalytics.dimensionForAdditionalLabel = d.dimensionForAdditionalLabel, i.universalAnalytics.dimensionForVersion = d.dimensionForVersion, i.universalAnalytics.version = d.version, i.universalAnalytics.appName = d.appName, i.universalAnalytics.fbIDs = d.fbUAIDs.slice(), i.universalAnalytics.uaIDs = d.fbUAIDs.concat(d.userUAIDs).slice(), i.universalAnalytics.anonymizeIp = d.anonymizeIp, i.universalAnalytics.url = null === d.url ? 'auto' : d.url, i.universalAnalytics.title = d.title;
                                } else
                                    i.universalAnalytics.platform = e, i.universalAnalytics.startDate = s, i.universalAnalytics.dimensionForAdditionalLabel = c, i.universalAnalytics.dimensionForVersion = u, i.universalAnalytics.version = l, i.universalAnalytics.appName = r, i.universalAnalytics.fbIDs = n.slice(), i.universalAnalytics.uaIDs = n.concat(a).slice(), i.universalAnalytics.anonymizeIp = o, i.universalAnalytics.url = null === t ? 'auto' : t, i.universalAnalytics.title = y;
                                i.universalAnalytics.dimensionForAdditionalLabel || (i.universalAnalytics.dimensionForAdditionalLabel = 'dimension1'), i.universalAnalytics.dimensionForVersion || (i.universalAnalytics.dimensionForVersion = 'dimension2'), function (i, n, a, t, e, s, l) {
                                    i.GoogleAnalyticsObject = e, i[e] = i[e] || function () {
                                        (i[e].q = i[e].q || []).push(arguments);
                                    }, i[e].l = 1 * new Date(), s = n.createElement(a), l = n.getElementsByTagName(a)[0], s.async = 1, s.src = t, l.parentNode.insertBefore(s, l);
                                }(i, document, 'script', '//www.google-analytics.com/analytics.js', 'ua');
                                var v;
                                if (d && d.clientId)
                                    v = d.clientId;
                                else
                                    try {
                                        v = localStorage.getItem('clientId');
                                    } catch (p) {
                                        console.log('No access to localStorage.');
                                    } finally {
                                        v = v || i.universalAnalytics.generateId();
                                    }
                                for (var A = {
                                            allowLinker: !0,
                                            storage: 'none',
                                            storeGac: !1,
                                            clientId: v
                                        }, h = 0, f = i.universalAnalytics.uaIDs.length; h < f; h++)
                                    i.ua('create', i.universalAnalytics.uaIDs[h], i.universalAnalytics.url, 'additional' + h.toString(), A);
                                i.universalAnalytics.multiua('require', 'displayfeatures'), i.universalAnalytics.anonymizeIp === !0 ? i.universalAnalytics.multiua('set', 'anonymizeIp', !0) : i.universalAnalytics.fbua('set', 'anonymizeIp', !0), i.universalAnalytics.title && i.universalAnalytics.multiua('set', 'title', i.universalAnalytics.title), void 0 !== i.universalAnalytics.dimensionForVersion && i.universalAnalytics.multiua('set', i.universalAnalytics.dimensionForVersion, i.universalAnalytics.version), i.universalAnalytics.multiua('send', 'pageview', { sessionControl: 'start' }), i.universalAnalytics.multiua('require', 'ecommerce'), i.universalAnalytics.multiua('require', 'ec');
                            }
                        }.apply(this, arguments);
                    } finally {
                        if ($___old_55b15102778af883)
                            ({}.constructor.defineProperty(window, 'localStorage', $___old_55b15102778af883));
                    }
                },
                getPlatform: function () {
                    return i.universalAnalytics.platform;
                },
                path: void 0,
                getPath: function () {
                    if (void 0 === i.universalAnalytics.path)
                        if ('undefined' != typeof i.FBO)
                            i.universalAnalytics.path = i.FBO.PreloadedPublicationModel.Publication.HashId + '/';
                        else {
                            if (i.universalAnalytics.path = i.location.pathname, 'basic' === i.universalAnalytics.platform) {
                                var n = new RegExp('files/assets/basic-html/page.*html');
                                i.universalAnalytics.path = i.universalAnalytics.path.replace(n, '');
                            }
                            i.universalAnalytics.path.length > 0 && '/' !== i.universalAnalytics.path.charAt(0) && (i.universalAnalytics.path = '/' + i.universalAnalytics.path);
                            var a = i.universalAnalytics.path.indexOf('index.html');
                            a !== -1 && a + 10 === i.universalAnalytics.path.length && (i.universalAnalytics.path = i.universalAnalytics.path.slice(0, a));
                            var a = i.universalAnalytics.path.indexOf('index.htm');
                            a !== -1 && a + 9 === i.universalAnalytics.path.length && (i.universalAnalytics.path = i.universalAnalytics.path.slice(0, a));
                        }
                    return i.universalAnalytics.path;
                },
                transactionID: void 0,
                deteleTransactionID: function () {
                    delete i.universalAnalytics.transactionID;
                },
                getTransactionID: function () {
                    return 'undefined' == typeof i.universalAnalytics.transactionID && (i.universalAnalytics.transactionID = new Date().getTime().toString(36), 'undefined' != typeof i.universalAnalytics.startDate && (i.universalAnalytics.transactionID += i.universalAnalytics.startDate.toString(36)), 'undefined' != typeof i.universalAnalytics.openedDate && (i.universalAnalytics.transactionID += i.universalAnalytics.openedDate.toString(36))), i.universalAnalytics.transactionID;
                },
                setCurrency: function (n) {
                    i.universalAnalytics.currency = n, i.universalAnalytics.multiua('set', '&cu', n);
                },
                setShopName: function (n) {
                    i.universalAnalytics.shopName = n;
                },
                addImpression: function (n, a) {
                    i.universalAnalytics.multiua('ec:addImpression', {
                        id: a,
                        name: n
                    });
                },
                addTransaction: function (n) {
                    i.universalAnalytics.multiua('ecommerce:addTransaction', {
                        id: i.universalAnalytics.getTransactionID(),
                        affiliation: i.universalAnalytics.shopName,
                        revenue: n,
                        currency: i.universalAnalytics.currency
                    });
                },
                addItem: function (n, a, t, e) {
                    i.universalAnalytics.multiua('ecommerce:addItem', {
                        id: i.universalAnalytics.getTransactionID(),
                        name: n,
                        sku: a,
                        price: t,
                        quantity: e
                    }), i.universalAnalytics.multiua('ec:addProduct', {
                        id: a,
                        name: n
                    });
                },
                purchase: function (n) {
                    i.universalAnalytics.multiua('ecommerce:send'), i.universalAnalytics.multiua('ec:setAction', 'purchase', {
                        id: i.universalAnalytics.getTransactionID(),
                        revenue: n
                    }), i.universalAnalytics.deteleTransactionID();
                },
                shareByFacebook: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Facebook', 'Share', n);
                },
                shareByGooglePlus: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Google+', 'Share', n);
                },
                shareByLinkedin: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'LinkedIn', 'Share', n);
                },
                shareByTumblr: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Tumblr', 'Share', n);
                },
                shareByVK: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'VK', 'Share', n);
                },
                shareByBlogger: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Blogger', 'Share', n);
                },
                tweet: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Twitter', 'Tweet', n);
                },
                shareByEmail: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Email', 'Mail', n);
                },
                shareByMySpace: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'MySpace', 'Share', n);
                },
                shareByClipboard: function (n) {
                    i.ua && i.universalAnalytics.multiua('send', 'social', 'Clipboard', 'Copy', n);
                },
                dispatch: function (n, a, t, e, s) {
                    var l = {};
                    void 0 !== t && (l.eventLabel = t), void 0 !== e && (l.eventValue = e), i.universalAnalytics.nonInteraction && (l.nonInteraction = !0), void 0 !== s && void 0 !== i.universalAnalytics.dimensionForAdditionalLabel && (l[i.universalAnalytics.dimensionForAdditionalLabel] = s), l.page = i.universalAnalytics.getPath(), i.universalAnalytics.anonymizeIp === !0 && (l.anonymizeIp = !0), i.ua && i.universalAnalytics.multiua('send', 'event', n, a, l);
                },
                fbDispatch: function (n, a, t, e, s) {
                    var l = {};
                    void 0 !== t && (l.eventLabel = t), void 0 !== e && (l.eventValue = e), i.universalAnalytics.nonInteraction && (l.nonInteraction = !0), void 0 !== s && void 0 !== i.universalAnalytics.dimensionForAdditionalLabel && (l[i.universalAnalytics.dimensionForAdditionalLabel] = s), l.page = i.universalAnalytics.getPath(), l.anonymizeIp = !0, i.ua && i.universalAnalytics.fbua('send', 'event', n, a, l);
                },
                zoomIn: function (n, a) {
                    i.universalAnalytics.dispatch('Zoom', 'Zoom In', a, void 0, n);
                },
                zoomOut: function (n, a) {
                    i.universalAnalytics.dispatch('Zoom', 'Zoom Out', a, void 0, n);
                },
                zoomBlock: function (n) {
                    i.universalAnalytics.dispatch('Zoom', 'Zoom Block', n);
                },
                openWindow: function (n, a) {
                    i.universalAnalytics.dispatch(n, 'Open', a);
                },
                closeWindow: function (n, a) {
                    i.universalAnalytics.dispatch(n, 'Close', a);
                },
                print: function (n, a, t) {
                    var e = t || a;
                    i.universalAnalytics.dispatch('Print', 'Print', e);
                },
                clickImage: function (n) {
                    i.universalAnalytics.dispatch('Image', 'Click', n);
                },
                imageLoaded: function (n) {
                    i.universalAnalytics.dispatch('Image', 'Loaded', n);
                },
                download: function (n, a) {
                    i.universalAnalytics.dispatch('Download', 'Download', n, void 0, a);
                },
                videoPlay: function (n, a) {
                    i.universalAnalytics.dispatch('Video', 'Play', n, void 0, a);
                },
                videoPause: function (n, a) {
                    i.universalAnalytics.dispatch('Video', 'Pause', n, void 0, a);
                },
                videoStop: function (n, a) {
                    i.universalAnalytics.dispatch('Video', 'Stop', n, void 0, a);
                },
                videoSeekTo: function (n, a) {
                    i.universalAnalytics.dispatch('Video', 'SeekTo', n, void 0, a);
                },
                fullscreenOn: function (n) {
                    i.universalAnalytics.dispatch('Fullscreen', 'On', n);
                },
                fullscreenOff: function (n) {
                    i.universalAnalytics.dispatch('Fullscreen', 'Off', n);
                },
                slideshowStart: function () {
                    i.universalAnalytics.dispatch('Slideshow', 'Start');
                },
                slideshowStop: function () {
                    i.universalAnalytics.dispatch('Slideshow', 'Stop');
                },
                soundOn: function () {
                    i.universalAnalytics.dispatch('Sound', 'On');
                },
                soundOff: function () {
                    i.universalAnalytics.dispatch('Sound', 'Off');
                },
                addBookmark: function (n, a) {
                    i.universalAnalytics.dispatch('Bookmarks', 'Add', a, void 0, n);
                },
                removeBookmark: function (n, a) {
                    i.universalAnalytics.dispatch('Bookmarks', 'Remove', a, void 0, n);
                },
                productLink: function (n, a, t) {
                    var e = 'undefined' == typeof a ? t : a;
                    i.universalAnalytics.dispatch('Link', 'Product', n, void 0, e);
                },
                externalLink: function (n, a) {
                    i.universalAnalytics.dispatch('Link', 'External', n, void 0, a);
                },
                internalLink: function (n, a) {
                    i.universalAnalytics.dispatch('Link', 'Internal', n, void 0, a);
                },
                note: function (n, a) {
                    i.universalAnalytics.dispatch('Note', n, a);
                },
                search: function (n) {
                    i.universalAnalytics.dispatch('Search', 'Search', n);
                },
                textSelect: function (n) {
                    i.universalAnalytics.dispatch('TextSelection', 'Select', n);
                },
                textCopy: function (n) {
                    i.universalAnalytics.dispatch('TextSelection', 'Copy', n);
                },
                startLoading: function () {
                    i.universalAnalytics.dispatch('Loading', 'Start', i.universalAnalytics.getPlatform());
                },
                openedDate: void 0,
                publicationOpened: function () {
                    i.universalAnalytics.openedDate = new Date().getTime(), i.universalAnalytics.dispatch('Loading', 'Open', i.universalAnalytics.getPlatform(), void 0, i.universalAnalytics.openedDate - i.universalAnalytics.startDate), i.universalAnalytics.sendApplicationTiming(i.universalAnalytics.openedDate - i.universalAnalytics.startDate), i.universalAnalytics.sendFBTiming('Application Load 2', i.universalAnalytics.openedDate - i.universalAnalytics.startDate), i.universalAnalytics.nonInteraction = !1;
                },
                preloaderLoaded: function () {
                    i.universalAnalytics.preloaderDate = new Date().getTime(), i.universalAnalytics.sendFBTiming('Preloader Load', i.universalAnalytics.preloaderDate - i.universalAnalytics.startDate);
                },
                preloaderDate: void 0,
                startFlippingBookLoad: function () {
                    i.universalAnalytics.startFlippingBookDate = new Date().getTime();
                },
                startFlippingBookDate: void 0,
                endFlippingBookLoad: function () {
                    i.universalAnalytics.endFlippingBookDate = new Date().getTime(), i.universalAnalytics.sendFBTiming('Style Load', i.universalAnalytics.endFlippingBookDate - i.universalAnalytics.startFlippingBookDate);
                },
                endFlippingBookDate: void 0,
                startStyleLoad: function () {
                    i.universalAnalytics.startStyleDate = new Date().getTime();
                },
                startStyleDate: void 0,
                endStyleLoad: function () {
                    i.universalAnalytics.endStyleDate = new Date().getTime(), i.universalAnalytics.sendFBTiming('Style Load', i.universalAnalytics.endStyleDate - i.universalAnalytics.startStyleDate);
                },
                endStyleDate: void 0,
                startPropertyLoad: function () {
                    i.universalAnalytics.startPropertyDate = new Date().getTime();
                },
                startPropertyDate: void 0,
                endPropertyLoad: function () {
                    i.universalAnalytics.endPropertyDate = new Date().getTime(), i.universalAnalytics.sendFBTiming('Property Load', i.universalAnalytics.endPropertyDate - i.universalAnalytics.startPropertyDate);
                },
                endPropertyDate: void 0,
                startStyleXmlLoad: function () {
                    i.universalAnalytics.startStyleXmlDate = new Date().getTime();
                },
                startStyleXmlDate: void 0,
                endStyleXmlLoad: function () {
                    i.universalAnalytics.endStyleXmlDate = new Date().getTime(), i.universalAnalytics.sendFBTiming('Style xml Load', i.universalAnalytics.endStyleXmlDate - i.universalAnalytics.startStyleXmlDate);
                },
                endStyleXmlDate: void 0,
                startFontLoad: function () {
                    i.universalAnalytics.startFontDate = new Date().getTime();
                },
                startFontDate: void 0,
                endFontLoad: function () {
                    i.universalAnalytics.endFontDate = new Date().getTime(), i.universalAnalytics.sendFBTiming('Font Load', i.universalAnalytics.endFontDate - i.universalAnalytics.startFontDate);
                },
                endFontDate: void 0,
                previousPage: void 0,
                previousPage2: void 0,
                pageView: function (n) {
                    var a = i.universalAnalytics.getPath(), t = 'undefined' != typeof FBO ? n : '#' + n;
                    i.ua && i.universalAnalytics.multiua('send', 'pageview', { page: a + t });
                },
                flipToLastPage: function (n) {
                    i.universalAnalytics.fbDispatch('Pages', 'Last Page', n);
                },
                flipToFirstPage: function (n) {
                    i.universalAnalytics.fbDispatch('Pages', 'First Page', n);
                },
                contentSize: function (n, a, t, e) {
                    var s = e ? e : n, l = a + 'x' + t;
                    i.universalAnalytics.fbDispatch('ContentSize', s, l);
                },
                develop: function (n, a) {
                    i.universalAnalytics.fbDispatch('Develop', n, a);
                },
                contextMenu: function (n, a) {
                    i.universalAnalytics.fbDispatch('ContextMenu', n, a);
                },
                highlight: function (n, a) {
                    i.universalAnalytics.fbDispatch('Highlight', n, a);
                },
                openInSlide: function (n, a) {
                    'Start Book' !== n && i.universalAnalytics.dispatch('Pages', 'OpenInSlide', a, void 0, n), i.universalAnalytics.previousPage !== a && i.universalAnalytics.previousPage2 !== a && (i.universalAnalytics.pageView(a), a % 2 === 0 ? i.universalAnalytics.previousPage = a : i.universalAnalytics.previousPage2 = a);
                },
                openInSpread: function (n, a, t) {
                    'Start Book' !== n && i.universalAnalytics.dispatch('Pages', 'OpenInSpread', a, void 0, n), a !== i.universalAnalytics.previousPage && a !== i.universalAnalytics.previousPage2 && i.universalAnalytics.pageView(a), t && (i.universalAnalytics.dispatch('Pages', 'OpenInSpread', t, void 0, n), t !== i.universalAnalytics.previousPage && t !== i.universalAnalytics.previousPage2 && i.universalAnalytics.pageView(t), i.universalAnalytics.previousPage2 = t), i.universalAnalytics.previousPage = a;
                },
                turned: function (n, a, t) {
                    i.universalAnalytics.dispatch('Pages', 'Turned', a, n, t);
                },
                orientation: function (n, a, t) {
                    i.universalAnalytics.dispatch('Orientation', a, n, void 0, t);
                },
                sendTiming: function (n, a, t) {
                    i.ua && i.universalAnalytics.multiua('send', 'timing', i.universalAnalytics.getPlatform(), n, a, t);
                },
                sendFBTiming: function (n, a, t) {
                    i.ua && i.universalAnalytics.fbua('send', 'timing', i.universalAnalytics.getPlatform(), n, a, t);
                },
                sendApplicationTiming: function (n) {
                    i.universalAnalytics.sendTiming('Application Load', n);
                },
                sendPageTiming: function (n, a) {
                    i.universalAnalytics.sendTiming('Page Load', n, a);
                },
                sendSlideTiming: function (n, a) {
                    i.universalAnalytics.sendTiming('Slide Load', n, a);
                },
                sendThumbnailTiming: function (n, a) {
                    i.universalAnalytics.sendTiming('Thumbnail Load', n, a);
                },
                sendFatalError: function (n, a) {
                    i.ua && i.universalAnalytics.multiua('send', 'exception', {
                        exDescription: n,
                        exFatal: !0,
                        appName: i.universalAnalytics.appName,
                        appVersion: i.universalAnalytics.version
                    }), i.universalAnalytics.dispatch('Error', 'Fatal', n, void 0, a);
                },
                sendError: function (n, a) {
                    i.ua && i.universalAnalytics.multiua('send', 'exception', {
                        exDescription: n,
                        exFatal: !1,
                        appName: i.universalAnalytics.appName,
                        appVersion: i.universalAnalytics.version
                    }), i.universalAnalytics.dispatch('Error', 'Non Fatal', n, void 0, a);
                }
            };
        }(this), function (i, n) {
            'use strict';
            'undefined' != typeof exports ? i(global, exports) : i(n, n);
        }(function (i, n) {
            'use strict';
            function a() {
                this.handlers = [
                    'init',
                    'bookStateChanged',
                    'turned',
                    'goToFirstPage',
                    'goToLastPage',
                    'zoomed',
                    'unzoomed',
                    'slideshow',
                    'link',
                    'image',
                    'video',
                    'sound',
                    'window',
                    'share',
                    'print',
                    'download',
                    'fullscreen',
                    'search',
                    'develop',
                    'contextMenu',
                    'highlight',
                    'note',
                    'orientation'
                ];
            }
            function t(i) {
                return 'function' == typeof i || !1;
            }
            function e(i) {
                return i.charAt(0).toUpperCase() + i.slice(1);
            }
            a.prototype.subscribe = function (n) {
                if (this.evt = n, i.universalAnalytics)
                    this.analytics = i.universalAnalytics, this._apiSubscribe();
                else
                    var a = this, t = setTimeout(function e() {
                            i.universalAnalytics ? (a.analytics = i.universalAnalytics, a._apiSubscribe()) : t = setTimeout(e, 200);
                        }, 200);
            }, a.prototype._apiSubscribe = function () {
                if (this.analytics && this.evt && t(this.evt.on))
                    for (var i in this.handlers)
                        if (this.handlers.hasOwnProperty(i)) {
                            var n = this.handlers[i];
                            this.evt.on(n, this[n], this);
                        }
            }, a.prototype.init = function (i) {
                this.state = i, this.oldState = i, this.develop({
                    action: 'version',
                    data: i.version
                }), this.analytics.publicationOpened();
            }, a.prototype.bookStateChanged = function (i, n) {
                this.oldState = this.state || i, this.state = i, this.state.leftPageUrl !== this.state.rightPageUrl || this.state.isSingle || (this.state.rightPageUrl = void 0), this.state.isZoomed ? this.analytics.openInSlide(n, this.state.leftPageUrl || this.state.rightPageUrl) : this.state.isSingle ? this.analytics.openInSpread(n, this.state.rightPageUrl) : this.analytics.openInSpread(n, this.state.leftPageUrl, this.state.rightPageUrl);
            }, a.prototype.turned = function (i, n, a) {
                var t = i.pageIndex + 1;
                this.analytics.turned(t, n, a);
            }, a.prototype.develop = function (i) {
                this.analytics.develop(i.action, i.data);
            }, a.prototype.goToFirstPage = function () {
                this.analytics.flipToFirstPage(void 0);
            }, a.prototype.goToLastPage = function () {
                this.analytics.flipToLastPage(void 0);
            }, a.prototype.zoomed = function (i) {
                i.isSingle ? this.analytics.zoomIn(void 0, i.rightPageUrl) : this.analytics.zoomIn(void 0, i.leftPageUrl || i.rightPageUrl);
            }, a.prototype.unzoomed = function (i) {
                i && i.isSingle ? this.analytics.zoomOut(void 0, i.rightPageUrl) : this.oldState.isZoomed ? this.analytics.zoomOut(void 0, this.oldState.leftPageUrl || this.oldState.rightPageUrl) : this.analytics.zoomOut(void 0, i.leftPageUrl || i.rightPageUrl);
            }, a.prototype.slideshow = function (i) {
                i && 'start' === i.action ? this.analytics.slideshowStart() : 'stop' === i.action && this.analytics.slideshowStop();
            }, a.prototype.link = function (i) {
                'internal' === i.type && 'page' === i.source ? this.analytics.internalLink(i.pageToUrl, i.pageUrl) : 'external' === i.type && this.analytics.externalLink(i.url, i.pageUrl, i.target);
            }, a.prototype.image = function (i) {
                'loaded' === i.action ? this.analytics.imageLoaded(i.url) : 'click' === i.action && this.analytics.clickImage(i.url);
            }, a.prototype.video = function (i) {
                'play' === i.action ? this.analytics.videoPlay(i.url, i.time) : 'pause' === i.action ? this.analytics.videoPause(i.url, i.time) : 'stop' === i.action ? this.analytics.videoStop(i.url, i.time) : 'seekTo' === i.action && this.analytics.videoSeekTo(i.url, i.time);
            }, a.prototype.sound = function (i) {
                'on' === i.action ? this.analytics.soundOn() : 'off' === i.action && this.analytics.soundOff();
            }, a.prototype.window = function (i) {
                var n = {
                        Toc: 'TOC',
                        Social: 'Share'
                    }, a = e(i.component);
                'undefined' != typeof n[a] && (a = n[a]), 'open' === i.action ? this.analytics.openWindow(a) : 'close' === i.action && this.analytics.closeWindow(a);
            }, a.prototype.share = function (i) {
                'facebook' === i.service ? this.analytics.shareByFacebook(i.url) : 'twitter' === i.service ? this.analytics.tweet(i.url) : 'linkedIn' === i.service ? this.analytics.shareByLinkedin(i.url) : 'tumblr' === i.service ? this.analytics.shareByTumblr(i.url) : 'google+' === i.service ? this.analytics.shareByGooglePlus(i.url) : 'email' === i.service ? this.analytics.shareByEmail(i.url) : 'vk' === i.service ? this.analytics.shareByVK(i.url) : 'clipboard' === i.service && this.analytics.shareByClipboard(i.url);
            }, a.prototype.print = function (i) {
                this.analytics.print(i.fileName, e(i.option), i.printPage);
            }, a.prototype.download = function (i) {
                this.analytics.download(i.fileName, e(i.option));
            }, a.prototype.contextMenu = function (i) {
                if ('open' === i.action) {
                    var n = i.page + ',' + i.elementType + ',' + i.x + ',' + i.y;
                    this.analytics.contextMenu('Open', n);
                } else
                    'select' === i.action && this.analytics.contextMenu('Select', i.selectedItem);
            }, a.prototype.highlight = function (i) {
                'on' === i.action ? this.analytics.highlight('On', i.page) : 'off' === i.action && this.analytics.highlight('Off', i.page);
            }, a.prototype.fullscreen = function (i) {
                'on' === i.action ? this.analytics.fullscreenOn() : 'off' === i.action && this.analytics.fullscreenOff();
            }, a.prototype.search = function (i) {
                this.analytics.search(i.query);
            }, a.prototype.note = function (i) {
                this.analytics.note(i.action, i.initiator);
            }, a.prototype.orientation = function (i) {
                var n = i.state.rightPageUrl || i.state.leftPageUrl;
                this.analytics.orientation(n, i.value, i.action);
            }, n.UniversalAnalytics = a;
        }, this);
    }())
}