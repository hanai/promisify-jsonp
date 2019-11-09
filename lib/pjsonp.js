'use strict';

var crossOriginValues = ['anonymous', 'use-credentials', ''];

function now() {
    return +new Date();
}

function genCallbackName(prefix, acc) {
    acc = acc || 0;
    var cbName = prefix + now() + '_' + acc;
    if (!(cbName in window)) {
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

function createParameterError(key) {
    return new Error('Invalid parameter ' + key);
}

function getQueryString(params, encode, arr) {
    var key;
    params = params || {};
    arr = arr || [];
    for (key in params) {
        if (has.call(params, key)) {
            arr.push((encode ? enc(key) : key) + '=' + (encode ? enc(params[key]) : params[key]));
        }
    }
    return arr.join('&');
}

function pjsonp(url, opts) {
    if (!opts) opts = {};

    var callbackNamePrefix = isNonEmptyString(opts.callbackNamePrefix) ? opts.callbackNamePrefix : '__jp';
    var callbackName = isNonEmptyString(opts.callbackName) ? opts.callbackName : genCallbackName(callbackNamePrefix);
    var callbackParamName = isNonEmptyString(opts.callbackParamName) ? opts.callbackParamName : 'callback';
    var timeout = opts.timeout || 0;
    var params = opts.params || {};
    var encode = isBoolean(opts.encode) ? opts.encode : true;

    var onWindowError;
    var script = document.createElement('script');
    var timer;

    if (opts.crossOrigin != null) {
        if (crossOriginValues.indexOf(opts.crossOrigin) > -1) {
            script.crossOrigin = opts.crossOrigin;
        } else {
            return Promise.reject(createParameterError('crossOrigin'));
        }
    }

    function cleanup() {
        if (timer) clearTimeout(timer);
        if (script.parentNode) script.parentNode.removeChild(script);
        delete window[callbackName];
        if (onWindowError) window.removeEventListener('error', onWindowError);
    }

    url += (~url.indexOf('?') ? '&' : '?') + getQueryString(params, encode, [callbackParamName + '=' + callbackName]);
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

module.exports = pjsonp;
module.exports.default = pjsonp;