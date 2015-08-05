define("moduleName", function(require, exports, module) { 

var mod = (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_MODREQ,module,exports){
var jq = require('jquery');
var mod1 = _MODREQ('./mod1');
var mod2 = _MODREQ('./mod2');

var curMod = {};
module.exports = curMod;
},{"./mod1":2,"./mod2":3}],2:[function(_MODREQ,module,exports){
module.exports = function () {
    console.log('mod1');
}
},{}],3:[function(_MODREQ,module,exports){
module.exports = function () {
    console.log('mod2');
}
},{}]},{},[1]); 
return mod("1");
});