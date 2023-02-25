!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e():"function"==typeof define&&define.amd?define(e):e()}(this,function(){"use strict";function t(t){var e=this.constructor;return this.then(function(n){return e.resolve(t()).then(function(){return n})},function(n){return e.resolve(t()).then(function(){return e.reject(n)})})}function e(t){return new this(function(e,n){if(!(t&&void 0!==t.length))return n(TypeError(typeof t+" "+t+" is not iterable(cannot read property Symbol(Symbol.iterator))"));var o=Array.prototype.slice.call(t);if(0===o.length)return e([]);var r=o.length;function i(t,n){if(n&&("object"==typeof n||"function"==typeof n)){var f=n.then;if("function"==typeof f){f.call(n,function(e){i(t,e)},function(n){o[t]={status:"rejected",reason:n},0==--r&&e(o)});return}}o[t]={status:"fulfilled",value:n},0==--r&&e(o)}for(var f=0;f<o.length;f++)i(f,o[f])})}var n=setTimeout;function o(t){return Boolean(t&&void 0!==t.length)}function r(){}function i(t){if(!(this instanceof i))throw TypeError("Promises must be constructed via new");if("function"!=typeof t)throw TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(t,this)}function f(t,e){for(;3===t._state;)t=t._value;if(0===t._state){t._deferreds.push(e);return}t._handled=!0,i._immediateFn(function(){var n,o=1===t._state?e.onFulfilled:e.onRejected;if(null===o){(1===t._state?u:c)(e.promise,t._value);return}try{n=o(t._value)}catch(r){c(e.promise,r);return}u(e.promise,n)})}function u(t,e){try{if(e===t)throw TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n,o,r=e.then;if(e instanceof i){t._state=3,t._value=e,a(t);return}if("function"==typeof r){s((n=r,o=e,function(){n.apply(o,arguments)}),t);return}}t._state=1,t._value=e,a(t)}catch(f){c(t,f)}}function c(t,e){t._state=2,t._value=e,a(t)}function a(t){2===t._state&&0===t._deferreds.length&&i._immediateFn(function(){t._handled||i._unhandledRejectionFn(t._value)});for(var e=0,n=t._deferreds.length;e<n;e++)f(t,t._deferreds[e]);t._deferreds=null}function l(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}function s(t,e){var n=!1;try{t(function(t){n||(n=!0,u(e,t))},function(t){n||(n=!0,c(e,t))})}catch(o){if(n)return;n=!0,c(e,o)}}i.prototype.catch=function(t){return this.then(null,t)},i.prototype.then=function(t,e){var n=new this.constructor(r);return f(this,new l(t,e,n)),n},i.prototype.finally=t,i.all=function(t){return new i(function(e,n){if(!o(t))return n(TypeError("Promise.all accepts an array"));var r=Array.prototype.slice.call(t);if(0===r.length)return e([]);var i=r.length;function f(t,o){try{if(o&&("object"==typeof o||"function"==typeof o)){var u=o.then;if("function"==typeof u){u.call(o,function(e){f(t,e)},n);return}}r[t]=o,0==--i&&e(r)}catch(c){n(c)}}for(var u=0;u<r.length;u++)f(u,r[u])})},i.allSettled=e,i.resolve=function(t){return t&&"object"==typeof t&&t.constructor===i?t:new i(function(e){e(t)})},i.reject=function(t){return new i(function(e,n){n(t)})},i.race=function(t){return new i(function(e,n){if(!o(t))return n(TypeError("Promise.race accepts an array"));for(var r=0,f=t.length;r<f;r++)i.resolve(t[r]).then(e,n)})},i._immediateFn="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){n(t,0)},i._unhandledRejectionFn=function t(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var d=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"function"!=typeof d.Promise?d.Promise=i:(d.Promise.prototype.finally||(d.Promise.prototype.finally=t),d.Promise.allSettled||(d.Promise.allSettled=e))});