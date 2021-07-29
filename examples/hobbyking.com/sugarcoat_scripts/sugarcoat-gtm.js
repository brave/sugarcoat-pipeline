var oroGTM;
{
    const $___mock_84ce84cc49362916 = {};
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
    })($___mock_84ce84cc49362916);
    (function () {
        var $___var_956765246037219c = Class.create();
        oroGTM = $___var_956765246037219c;
        oroGTM.prototype = {
            initialize: function (type, options) {
                this.type = type;
                this.options = options || {};
                this.debug = 'debug' in options && options.debug || false;
                this.timeout = this.options.timeout || 2000;
                this.loaded = false;
                this.sent = false;
                this.products = {};
                this.clicks = [];
                this.promos = {};
                this.events = [];
                this.gtmLayer = {};
                this.storage = false;
                if (this.type == 'gtm')
                    this.initGtm(false);
                else if (this.type == 'ga')
                    this.initGa();
                else
                    return;
                this.initStorageEvents();
                Event.observe(document, 'dom:loaded', this.docLoadEvent.bind(this));
            },
            initStorageEvents: function () {
                const $___old_06bcb7c882f4c940 = {}.constructor.getOwnPropertyDescriptor(window, 'localStorage');
                try {
                    if ($___old_06bcb7c882f4c940)
                        ({}.constructor.defineProperty(window, 'localStorage', $___mock_84ce84cc49362916.localStorage));
                    return function () {
                        var storageName = 'localStorage';
                        try {
                            if (storageName in window && window[storageName])
                                this.storage = window[storageName];
                        } catch (e) {
                            return;
                        }
                        var items = this.getStorageItems(true);
                        if (items.length == 0)
                            return;
                        for (var i in items) {
                            var item = items[i];
                            if (item.hasOwnProperty('event')) {
                                console.log(item);
                                var event = item.event;
                                if (event == 'GAEvent')
                                    this._sendEvent(item);
                                else if (event == 'productClick')
                                    this._productClick(item);
                                else if (event == 'promoClick')
                                    this._promoClick(item);
                            }
                        }
                    }.apply(this, arguments);
                } finally {
                    if ($___old_06bcb7c882f4c940)
                        ({}.constructor.defineProperty(window, 'localStorage', $___old_06bcb7c882f4c940));
                }
            },
            addStorageItem: function (item) {
                var key = 'oro_gmt_event';
                var data = this.getStorageItems(true);
                data.push(item);
                this.storage.setItem(key, JSON.stringify(data));
            },
            getStorageItems: function (clear) {
                var key = 'oro_gmt_event';
                var data = this.storage.getItem(key) || '[]';
                data = JSON.parse(data);
                if (clear == true)
                    this.storage.removeItem(key);
                return data;
            },
            getCurrentCurrencyCode: function () {
                var currencyCode = 'USD';
                if ('currency' in this.options)
                    currencyCode = this.options['currency'];
                return currencyCode;
            },
            docLoadEvent: function () {
                this.loaded = true;
                this.events.map(function (e) {
                    this.observeEvent(e);
                }.bind(this));
                this.observeDataEvents();
                this.clicks.map(function (c) {
                    if (c.type == 'product')
                        this.observeProductClick(c.product, c.selector);
                    if (c.type == 'promo')
                        this.observePromoClick(c.promo, c.selector);
                }.bind(this));
                if (typeof algoliaConfig === 'undefined')
                    this.send();
                else if (!$j('.catalogsearch-result-index').length && !$j('.catalog-category-view').length)
                    this.send();
                else ;
                this._debug('document has loaded');
            },
            regProduct: function (id, data) {
                this.products[id] = data;
                this._debug('product has registered', id);
            },
            regPromo: function (id, data) {
                this.promos[id] = data;
                this._debug('promo has registered', id);
            },
            regEvent: function (selector, event, category, action, label, value) {
                var e = {
                    'selector': selector,
                    'event': event,
                    'category': category,
                    'action': action,
                    'label': label,
                    'value': value
                };
                if (this.loaded)
                    this.observeEvent(e);
                else
                    this.events.push(e);
                this._debug('event has registered', e);
            },
            observeEvent: function (event) {
                var element = $$(event.selector).first();
                if (element) {
                    Event.observe(element, event.event, this.sendEvent.bind(this, event, element));
                    this._debug('event has observed', event);
                } else
                    this._debug('event has not observed', event);
            },
            observeDataEvents: function () {
                $$('[data-event-name]').map(function (element) {
                    var event = {
                        'event': element.readAttribute('data-event-name'),
                        'category': element.readAttribute('data-event-category'),
                        'action': element.readAttribute('data-event-action'),
                        'label': element.readAttribute('data-event-label') || undefined,
                        'value': element.readAttribute('data-event-value') || undefined
                    };
                    Event.observe(element, event.event, this.sendEvent.bind(this, event, element));
                }.bind(this));
            },
            sendEvent: function (data, element, event) {
                var label = typeof data.label == 'function' ? data.label(element, event) : data.label;
                var value = typeof data.value == 'function' ? data.value(element, event) : data.value;
                var proxy = {
                    'event': 'GAEvent',
                    'category': data.category,
                    'action': data.action,
                    'label': label,
                    'value': value
                };
                if (this.storage)
                    this.addStorageItem(proxy);
                else
                    this._sendEvent(proxy);
                this._debug('event has sent', data);
                return false;
            },
            _sendEvent: function (proxy) {
                if (this.type == 'gtm')
                    dataLayer.push({
                        'event': proxy.event,
                        'eventCategory': proxy.category,
                        'eventAction': proxy.action,
                        'eventLabel': proxy.label,
                        'eventValue': proxy.value
                    });
                else if (this.type == 'ga')
                    ga('send', 'event', {
                        'eventCategory': proxy.category,
                        'eventAction': proxy.action,
                        'eventLabel': proxy.label,
                        'eventValue': proxy.value
                    });
            },
            isDataLayerObjectNotEmpty: function (object) {
                var count = 0;
                for (var k in object['ecommerce']) {
                    if (k == 'currencyCode')
                        continue;
                    if (object['ecommerce'].hasOwnProperty(k))
                        count++;
                }
                return count > 0;
            },
            send: function () {
                if (this.sent)
                    return;
                this.sent = true;
                if (this.type == 'gtm') {
                    if (this.isDataLayerObjectNotEmpty(this.gtmLayer)) {
                        var ecommerceImpressions = this.gtmLayer['ecommerce']['impressions'];
                        if (ecommerceImpressions != undefined) {
                            var productIds = [];
                            for (obj in ecommerceImpressions)
                                if (ecommerceImpressions[obj].hasOwnProperty('id')) {
                                    var value = ecommerceImpressions[obj];
                                    productIds[value.id] = value;
                                }
                            var newProductIds = Object.keys(productIds).map(function (key) {
                                return productIds[key];
                            });
                            this._debug('Removed Duplicate Impressions', newProductIds);
                            this.gtmLayer['ecommerce']['impressions'] = newProductIds;
                        }
                        dataLayer.push(this.gtmLayer);
                    }
                    this.sendGtm();
                    this.initGtm(true);
                } else if (this.type == 'ga')
                    this.sendGa();
                this._debug('Data has sent');
            },
            addProductImpression: function (id, list, position) {
                if (false == id in this.products)
                    return;
                var impression = this.products[id];
                impression['list'] = list;
                impression['position'] = position;
                if (this.type == 'gtm') {
                    if (false == 'impressions' in this.gtmLayer['ecommerce'])
                        this.gtmLayer['ecommerce']['impressions'] = [];
                    this.gtmLayer['ecommerce']['impressions'].push(impression);
                } else if (this.type == 'ga')
                    ga('ec:addImpression', impression);
                this._debug('product has added to impression', impression);
            },
            regProductClick: function (id, list, position, selector) {
                if (false == id in this.products)
                    return;
                var product = this.products[id];
                product['list'] = list;
                product['position'] = position;
                if (this.loaded)
                    this.observeProductClick(product, selector);
                else
                    this.clicks.push({
                        'type': 'product',
                        'product': product,
                        'selector': selector
                    });
                this._debug('product click has registered', product, selector);
            },
            observeProductClick: function (product, selector) {
                var count = 0;
                $$(selector).map(function (element) {
                    count++;
                    Event.observe(element, 'click', function (product, element, event) {
                        Mage.Cookies.set('oro_analytics_list', product['list']);
                        this._debug('set product list', product['list']);
                        var proxy = {
                            'event': 'productClick',
                            'product': product
                        };
                        this.storage = false;
                        if (this.storage)
                            this.addStorageItem(proxy);
                        else
                            this._productClick(proxy);
                        this._debug('product has clicked', product, event);
                    }.bind(this, product, element));
                    this._debug('product click has observed', product, element);
                }.bind(this));
                if (count === 0)
                    this._debug('product click has not observed', product, selector);
            },
            _productClick: function (proxy) {
                if (this.type == 'gtm')
                    dataLayer.push({
                        'event': proxy.event,
                        'ecommerce': {
                            'click': {
                                'actionField': { 'list': proxy.product.list },
                                'products': [proxy.product]
                            }
                        }
                    });
                else if (this.type == 'ga') {
                    ga('ec:addProduct', proxy.product);
                    ga('ec:setAction', 'click', { 'list': proxy.product.list });
                    ga('send', 'event', 'UX', 'click', {});
                }
            },
            setProductView: function (id, defaultList) {
                if (false == id in this.products)
                    return;
                var product = this.products[id];
                var list = Mage.Cookies.get('oro_analytics_list') || defaultList;
                this._debug('product list is', list);
                if (this.type == 'gtm')
                    this.gtmLayer['ecommerce']['detail'] = {
                        'actionField': { 'list': list },
                        'products': [product]
                    };
                else if (this.type == 'ga') {
                    ga('ec:addProduct', product);
                    ga('ec:setAction', 'detail');
                }
                this._debug('product view has sent', product);
            },
            addProductToCart: function (id, qty, price) {
                if (false == id in this.products)
                    return;
                var product = this.products[id];
                product['quantity'] = qty;
                if (price)
                    product['price'] = price;
                var currencyCode = this.getCurrentCurrencyCode();
                if (this.type == 'gtm')
                    dataLayer.push({
                        'event': 'addToCart',
                        'ecommerce': {
                            'currencyCode': currencyCode,
                            'add': { 'products': [product] }
                        }
                    });
                else if (this.type == 'ga') {
                    ga('ec:addProduct', product);
                    ga('ec:setAction', 'add');
                    ga('send', 'event', 'UX', 'click', 'add to cart', {});
                }
                this._debug('product has added to cart', product);
            },
            removeProductFromCart: function (id, qty, price) {
                if (false == id in this.products)
                    return;
                var product = this.products[id];
                product['quantity'] = qty;
                if (price)
                    product['price'] = price;
                var currencyCode = this.getCurrentCurrencyCode();
                if (this.type == 'gtm')
                    dataLayer.push({
                        'event': 'removeFromCart',
                        'ecommerce': {
                            'currencyCode': currencyCode,
                            'remove': { 'products': [product] }
                        }
                    });
                else if (this.type == 'ga') {
                    ga('ec:addProduct', product);
                    ga('ec:setAction', 'remove');
                    ga('send', 'event', 'UX', 'click', 'remove from cart', {});
                }
                this._debug('product has removed from cart', product);
            },
            promoView: function (id, position) {
                if (false == id in this.promos)
                    return;
                var promo = this.promos[id];
                promo['position'] = position;
                if (this.type == 'gtm') {
                    if (false == 'promoView' in this.gtmLayer['ecommerce'])
                        this.gtmLayer['ecommerce']['promoView'] = { 'promotions': [] };
                    this.gtmLayer['ecommerce']['promoView']['promotions'].push(promo);
                } else if (this.type == 'ga')
                    ga('ec:addPromo', promo);
                this._debug('promo has displayed', promo);
            },
            regPromoClick: function (id, position, selector) {
                if (false == id in this.promos)
                    return;
                var promo = this.promos[id];
                promo['position'] = position;
                if (this.loaded)
                    this.observePromoClick(promo, selector);
                else
                    this.clicks.push({
                        'type': 'promo',
                        'promo': promo,
                        'selector': selector
                    });
            },
            observePromoClick: function (promo, selector) {
                var element = $$(selector).first();
                if (element) {
                    Event.observe(element, 'click', function (promo, element, event) {
                        var proxy = {
                            'event': 'promotionClick',
                            'promo': promo
                        };
                        if (this.storage)
                            this.addStorageItem(proxy);
                        else
                            this._promoClick(proxy);
                        this._debug('promo has clicked', promo, event);
                        Event.stop(event);
                        return false;
                    }.bind(this, promo, element));
                    this._debug('promo click has observed', promo, element);
                } else
                    this._debug('promo click has not observed', promo, selector);
            },
            _promoClick: function (proxy) {
                if (this.type == 'gtm') {
                    dataLayer.push({
                        'event': proxy.event,
                        'ecommerce': { 'promoClick': { 'promotions': [proxy.promo] } }
                    });
                    this._debug('promo has clicked', proxy.promo, proxy.event);
                } else if (this.type == 'ga') {
                    ga('ec:addPromo', proxy.promo);
                    ga('ec:setAction', 'promo_click');
                    ga('send', 'event', 'Internal Promotions', 'click', proxy.promo.name, {});
                }
            },
            initCheckout: function (products, step, stepName) {
                if (this.type == 'gtm') {
                    var checkoutData = {};
                    checkoutData.actionField = { 'step': step };
                    if (products.length)
                        checkoutData.products = products;
                    dataLayer.push({
                        'event': 'checkout',
                        'stepName': stepName,
                        'ecommerce': { 'checkout': checkoutData }
                    });
                } else if (this.type == 'ga') {
                    products.map(function (product) {
                        ga('ec:addProduct', product);
                    });
                    ga('ec:setAction', 'checkout', { 'step': step });
                }
                this._debug('checkout has initialized', step);
                Event.observe(document, 'dom:loaded', this.observeOnePageCheckout.bind(this));
            },
            observeOnePageCheckout: function () {
                if (typeof Checkout == 'undefined')
                    return;
                (function (openSection, oro_gtm) {
                    Accordion.prototype.openSection = function (section) {
                        var sectionPoint = $(section);
                        if (sectionPoint.id != this.currentSection && Element.hasClassName(section, 'allow')) {
                            var sectionPointName = sectionPoint.id.replace(/opc-/g, '');
                            oro_gtm._debug('checkout', sectionPointName);
                            try {
                                var step, option = '', stepName = '';
                                switch (sectionPointName) {
                                case 'login':
                                    stepName = 'Checkout Method';
                                    step = 2;
                                    break;
                                case 'billing':
                                    stepName = 'Billing Address';
                                    step = 3;
                                    break;
                                case 'shipping':
                                    stepName = 'Shipping Address';
                                    step = 4;
                                    break;
                                case 'shipping_method':
                                    stepName = 'Shipping Method';
                                    step = 5;
                                    break;
                                case 'payment':
                                    stepName = 'Payment Method';
                                    step = 6;
                                    break;
                                case 'review':
                                    stepName = 'Order Review';
                                    step = 7;
                                    break;
                                }
                                if (step)
                                    oro_gtm.setCheckoutStep(step, stepName);
                            } catch (e) {
                            }
                            return openSection.call(this, section);
                        }
                    };
                }(Accordion.prototype.openSection, this));
            },
            setCheckoutStep: function (step, stepName) {
                if (this.type == 'gtm')
                    dataLayer.push({
                        'event': 'checkout',
                        'stepName': stepName,
                        'ecommerce': { 'checkout': { 'actionField': { 'step': step } } }
                    });
                this._debug('checkout step', step);
            },
            setCheckoutOption: function (step, option) {
                if (this.type == 'gtm')
                    dataLayer.push({
                        'event': 'checkoutOption',
                        'ecommerce': {
                            'checkout_option': {
                                'actionField': {
                                    'step': step,
                                    'option': option
                                }
                            }
                        }
                    });
                this._debug('checkout option', step, option);
            },
            purchase: function (transaction, products) {
                if (this.type == 'gtm')
                    dataLayer.push({
                        'ecommerce': {
                            'purchase': {
                                'actionField': transaction,
                                'products': products
                            }
                        }
                    });
                else if (this.type == 'ga') {
                    products.map(function (product) {
                        ga('ec:addProduct', product);
                    });
                    ga('ec:setAction', 'purchase', transaction);
                }
                this._debug('purchase has complete', transaction, products);
            },
            ajaxCallback: function (json) {
                if ('oro_gtm' in json && json['oro_gtm'].length > 0) {
                    var count = 0;
                    try {
                        json['oro_gtm'].each(function (action) {
                            if ('method' in action) {
                                count++;
                                this[action['method']].apply(this, action['params'] || []);
                            }
                        }.bind(this));
                        if (count > 0 && this.sent) {
                            if (this.type == 'gtm')
                                if (this.isDataLayerObjectNotEmpty(this.gtmLayer)) {
                                    this.gtmLayer['event'] = 'ajaxCallback';
                                    dataLayer.push(this.gtmLayer);
                                    this.initGtm(true);
                                }
                            if (this.type == 'ga')
                                ga('send', 'event', 'UX', 'internal', 'ajaxCallback', {});
                        }
                    } catch (e) {
                    }
                }
            },
            initGtm: function (reset) {
                if (reset == false)
                    window['dataLayer'] = [];
                this.gtmLayer = { 'ecommerce': {} };
                if ('currency' in this.options)
                    this.gtmLayer['ecommerce']['currencyCode'] = this.options['currency'];
                this._debug('GTM has initialized');
            },
            sendGtm: function () {
                (function (w, d, s, l, i) {
                    w[l] = w[l] || [];
                    w[l].push({
                        'gtm.start': new Date().getTime(),
                        event: 'gtm.js'
                    });
                    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                    j.async = true;
                    j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                    f.parentNode.insertBefore(j, f);
                }(window, document, 'script', 'dataLayer', this.options.id));
                this._debug('GTM has sent');
            },
            initGa: function () {
                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }, i[r].l = 1 * new Date();
                    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m);
                }(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'));
                ga('create', this.options.id, 'auto');
                ga('require', 'displayfeatures');
                ga('require', 'ec');
                if ('currency' in this.options)
                    ga('set', '&cu', this.options['currency']);
                this._debug('GA has initialized');
            },
            sendGa: function () {
                ga('send', 'pageview');
                this._debug('GA has sent');
            },
            _debug: function () {
                if (this.debug)
                    console.log(arguments);
            },
            addClickTrack: function (category, action, label) {
                dataLayer.push({
                    'event': 'gaClick',
                    'eventCategory': category,
                    'eventAction': action,
                    'eventLabel': label
                });
            }
        };
        (function ($) {
            $(document).ready(function () {
                if (typeof oro_gtm !== 'undefined') {
                    var $promoBanners = $('.promotion-banner-home');
                    if ($promoBanners.length)
                        $promoBanners.each(function (index) {
                            var promotionDataJson = $(this).attr('data-promotion');
                            console.log(promotionDataJson);
                            if (typeof promotionDataJson !== 'undefined')
                                try {
                                    promotionDataJson = promotionDataJson.replace(/'/g, '"');
                                    var promotionData = $.parseJSON(promotionDataJson);
                                    oro_gtm.regPromo(index, promotionData);
                                    oro_gtm.promoView(index, index);
                                    $(this).on('click', function (promoElement) {
                                        var currentPromotionDataJson = $(this).attr('data-promotion');
                                        currentPromotionDataJson = currentPromotionDataJson.replace(/'/g, '"');
                                        var currentPromotionData = $.parseJSON(promotionDataJson);
                                        var proxy = {
                                            'event': 'promotionClick',
                                            'promo': currentPromotionData
                                        };
                                        oro_gtm._promoClick(proxy);
                                    });
                                } catch (e) {
                                    console.log('Invalid data for promotion');
                                }
                        });
                    $('.btn-remove').on('click', function (e) {
                        try {
                            var productRemoveId = $(this).id;
                            var productId = productRemoveId.replace(/remove-product-id-/g, '');
                            if (productId in oro_gtm.products) {
                                var productObject = oro_gtm.products[productId];
                                oro_gtm.removeProductFromCart(productId, productObject.quantity, '');
                            }
                        } catch (e$0) {
                            console.log('\'Qty update\' selectors were not processed.');
                        }
                    });
                    if (typeof payment !== 'undefined') {
                        var _oldPaymentOnSave = payment.nextStep;
                        payment.onSave = function (event) {
                            if (typeof oro_gtm !== 'undefined')
                                try {
                                    var step = 6;
                                    oro_gtm.setCheckoutOption(step, payment.currentMethod);
                                } catch (e) {
                                    console.log('Cannot set checkout option');
                                }
                            _oldPaymentOnSave.apply(this, arguments);
                        };
                    }
                    var $t = $('[data-event="ev"]');
                    $t.on('click', function () {
                        var evCat = $(this).data('category') ? $(this).data('category') : '', evAct = $(this).data('action') ? $(this).data('action') : '', evLab = $(this).data('label') ? $(this).data('label') : '';
                        try {
                            dataLayer.push({
                                'event': 'gaClick',
                                'eventCategory': evCat,
                                'eventAction': evAct,
                                'eventLabel': evLab
                            });
                            console.log('pushed');
                        } catch (e) {
                            console.log(e);
                        }
                    });
                    if (typeof algoliaConfig === 'undefined')
                        oro_gtm.send();
                    else if (!$j('.catalogsearch-result-index').length && !$j('.catalog-category-view').length)
                        oro_gtm.send();
                    else ;
                }
            });
        }(jQuery));
    }())
}