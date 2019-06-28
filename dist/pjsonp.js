(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['promisify-jsonp'] = factory());
}(this, function () { 'use strict';

    var crossOriginValues = ['anonymous', 'use-credentials', ''];

    function genCallbackName(prefix, acc) {
        acc = acc || 0;
        var cbName = prefix + +new Date() + '_' + acc;
        if (typeof window[cbName] === 'undefined') {
            window[cbName] = null;
            return cbName;
        } else {
            return genCallbackName(prefix, acc + 1);
        }
    }

    function insertScript(script) {
        var target = document.getElementsByTagName('script')[0];
        if (target) {
            target.parentNode.insertBefore(script, target);
        } else {
            document.head.appendChild(script);
        }
    }

    function isType(match) {
        return function (obj) {
            return Object.prototype.toString.call(obj) === '[object ' + match + ']';
        };
    }

    var isString = isType('String');
    var isBoolean = isType('Boolean');

    var enc = window.encodeURIComponent;
    var has = Object.prototype.hasOwnProperty;

    function isNonEmptyString(obj) {
        return isString(obj) && obj.length > 0;
    }

    function pjsonp(url, opts) {
        if (!opts) opts = {};

        var callbackNamePrefix = isNonEmptyString(opts.callbackNamePrefix) ? opts.callbackNamePrefix : '__jp';
        var callbackName = isNonEmptyString(opts.callbackName) ? opts.callbackName : genCallbackName(callbackNamePrefix);
        var callbackParamName = isNonEmptyString(opts.callbackParamName) ? opts.callbackParamName : 'callback';
        var timeout = opts.timeout || 0;
        var params = opts.params || {};
        var encode = isBoolean(opts.encode) ? opts.encode : true;

        var key;
        var onWindowError;
        var script = document.createElement('script');
        var timer;

        if (opts.crossOrigin != null) {
            if (
                isString(opts.crossOrigin) &&
                crossOriginValues.indexOf(opts.crossOrigin) > -1
            ) {
                script.crossOrigin = opts.crossOrigin;
            } else {
                return Promise.reject(
                    new Error('Invalid crossOrigin value: ' + opts.crossOrigin)
                );
            }
        }

        function cleanup() {
            if (timer) clearTimeout(timer);
            if (script.parentNode) script.parentNode.removeChild(script);
            window[callbackName] = undefined;
            if (onWindowError) window.removeEventListener('error', onWindowError);
        }

        var queryArray = [];
        queryArray.push(callbackParamName + '=' + callbackName);
        for (key in params) {
            if (has.call(params, key)) {
                queryArray.push((encode ? enc(key) : key) + '=' + (encode ? enc(params[key]) : params[key]));
            }
        }

        url += (~url.indexOf('?') ? '&' : '?') + queryArray.join('&');
        url = url.replace('?&', '?');

        script.src = url;

        return new Promise(function (resolve, reject) {
            if (timeout) {
                timer = setTimeout(function () {
                    cleanup();
                    reject(new Error('Timeout'));
                }, timeout);
            }

            onWindowError = function (event) {
                var filename = event.filename;
                var error = event.error;
                if (filename === url) {
                    cleanup();
                    reject(error);
                }
            };

            window.addEventListener('error', onWindowError);

            script.onerror = function () {
                cleanup();
                reject(new Error('Script error'));
            };

            window[callbackName] = function (data) {
                cleanup();
                resolve(data);
            };

            insertScript(script);
        });
    }

    var pjsonp_1 = pjsonp;
    var default_1 = pjsonp;
    pjsonp_1.default = default_1;

    return pjsonp_1;

}));
