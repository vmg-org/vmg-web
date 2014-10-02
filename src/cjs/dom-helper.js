/**
 * Operations with DOM, using JQuery
 *     JQuery only here for future replacement to usual functions and don't load JQuery
 * @module dom-helper
 */

/**
 * Jquery is self-loaded (from dns or local)
 */

exports.alert = function(msg) {
  window.alert(msg);
};

var getElems = function(className) {
  return $(className);
};

exports.getElems = getElems;

var getElem = function(className) {
  return getElems(className)[0];
};

exports.getElem = getElem;

exports.on = function(elem, eventName, cbk) {
  $(elem).on(eventName, cbk);
};

// elem - className or dom elem
exports.addClass = function(elem, className) {
  $(elem).addClass(className);
};

exports.removeClass = function(elem, className) {
  $(elem).removeClass(className);
};

exports.div = function(optClass) {
  var div = document.createElement('div');
  if (optClass) {
    $(div).addClass(optClass);
  }
  return div;
};

exports.html = function(elem, htmlStr) {
  $(elem).html(htmlStr);
};

module.exports = exports;
