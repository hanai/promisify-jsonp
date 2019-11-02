(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pjsonp", [], factory);
	else if(typeof exports === 'object')
		exports["pjsonp"] = factory();
	else
		root["pjsonp"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crossOriginValues = ['anonymous', 'use-credentials', ''];

function now() {
    return +new Date();
}

function genCallbackName(prefix, acc) {
    acc = acc || 0;
    var cbName = prefix + now() + '_' + acc;
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

module.exports = pjsonp;
module.exports.default = pjsonp;

/***/ })
/******/ ]);
});
//# sourceMappingURL=pjsonp.map