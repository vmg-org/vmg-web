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

exports.addClass = function(elem, className) {
  $('.' + elem).addClass(className);
};

exports.removeClass = function(elem, className) {
  $('.' + elem).removeClass(className);
};

module.exports = exports;
