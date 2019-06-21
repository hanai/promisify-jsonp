'use strict';

var stringify = require('qs/lib/stringify');

function genCallbackName(prefix, acc) {
    acc = acc || 0;
    var cbName = prefix + (+new Date) + '_' + acc;
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

function pjsonp(url, opts) {
    if (!opts) opts = {};

    var callbackNamePrefix = opts.callbackNamePrefix || '__jp';
    var callbackName = opts.callbackName || genCallbackName(callbackNamePrefix);
    var callbackParamName = opts.callbackParamName || 'callback';
    var timeout = opts.timeout || 0;
    var qsOpts = opts.qsOpts || {};
    var params = opts.params || {};

    var script;
    var timer;

    function cleanup() {
        if (timer) clearTimeout(timer);
        if (script.parentNode) script.parentNode.removeChild(script);
        window[callbackName] = undefined;
    }

    var urlParams = {};
    urlParams[callbackParamName] = callbackName;
    for (var key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            urlParams[key] = params[key];
        }
    }

    url += (~url.indexOf('?') ? '&' : '?') + stringify(urlParams, qsOpts);
    url = url.replace('?&', '?');

    script = document.createElement('script');
    script.src = url;

    return new Promise(function (resolve, reject) {
        if (timeout) {
            timer = setTimeout(function () {
                cleanup();
                reject(new Error('Timeout'));
            }, timeout);
        }

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