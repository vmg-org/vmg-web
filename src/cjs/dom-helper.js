/**
 * By default: find by className (no ids principle)
 * @module dom-helper
 * */

/**
 * Jquery is self-loaded (from dns or local)
 */

exports.alert = function(msg) {
  window.alert(msg);
};

var getElems = function(className) {
  return $('.' + className);
};

exports.getElems = getElems;

var getElem = function(className) {
  return getElems(className)[0];
};

exports.getElem = getElem;

exports.addEvent = function(className, eventName, cbk) {
  var elem = getElem(className);
  if (!elem) {
    throw new Error('noElem:' + className);
  }
  $(elem).on(eventName, cbk);
};

/** It is choose of a browser where to store routes (in simple hash # or in !# or in cookies etc.) */
exports.getRoute = function() {
  return document.location.hash.substr(1);
};

exports.hidePopup = function(className) {
  $('.' + className).addClass('hidden');
};

exports.showPopup = function(className) {
  $('.' + className).removeClass('hidden');
};

module.exports = exports;
