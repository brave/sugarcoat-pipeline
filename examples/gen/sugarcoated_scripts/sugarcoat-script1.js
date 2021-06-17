{
    const $___mock_bcca7c586f8ff8ed = {};
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
    })($___mock_bcca7c586f8ff8ed);
    (function () {
        window.onload = () => {
            const $___old_5d9fcafec45bae1d = {}.constructor.getOwnPropertyDescriptor(window, 'localStorage');
            try {
                if ($___old_5d9fcafec45bae1d)
                    ({}.constructor.defineProperty(window, 'localStorage', $___mock_bcca7c586f8ff8ed.localStorage));
                return function () {
                    console.log(navigator.userAgent);
                    console.log(window.localStorage);
                    console.log(window.performance);
                }.apply(this, arguments);
            } finally {
                if ($___old_5d9fcafec45bae1d)
                    ({}.constructor.defineProperty(window, 'localStorage', $___old_5d9fcafec45bae1d));
            }
        };
    }())
}