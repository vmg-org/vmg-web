/** @module app-helper */

'use strict';

var moment = require('moment');

var ahr = {};

/**
 * Required for NodeList and old browser without forEach method
 */
ahr.each = function(arr, cbk) {
  for (var i = 0, lim = arr.length; i < lim; i += 1) {
    // can be passed index and full arr as required (as 2-nd and 3-rd element) like in forEach
    cbk(arr[i], i);
  }
};

ahr.filter = function(arr, cbk) {
  return arr.filter(cbk);
};

// convert only strings (or numbers)
ahr.toInt = function(val) {
  if (val === 0) {
    return 0;
  }

  // Skip NaN, undefined, empty strings
  if (!val) {
    return null;
  }

  if (typeof val === 'number') {
    return parseInt(val, 10); // get off from decimal
  }

  // Convert only strings - only valid strings (exclude 3254las2323
  if (typeof val === 'string') {
    // skip invalid strings
    var result = +val;
    // 0 - checked before
    if (result || result === 0) {
      return parseInt(result, 10);
    }
  }
  // May be some additional checking
  return null;
};

ahr.map = function(arr, cbk) {
  return arr.map(cbk);
};

ahr.stringify = function(obj) {
  return JSON.stringify(obj);
};

ahr.parseJson = function(str) {
  return JSON.parse(str);
};

ahr.isArray = function(obj) {
  return Array.isArray(obj);
};

var jsonConstructor = {}.constructor;

ahr.isJson = function(obj) {
  return ((obj !== null) && (obj.constructor === jsonConstructor));
};

var handleItem = function(result, obj, reqName, reqValue, curName) {
  var curValue = obj[curName];

  //  if (typeof curValue === 'string') {
  //    console.log(curName, curValue);
  //  }

  if (curName === reqName && curValue === reqValue) {
    console.log('hoora');
    result.push(obj);
    return;
  }

  if (ahr.isJson(curValue)) {
    // once again
    ahr.each(Object.keys(curValue), handleItem.bind(null, result, curValue, reqName, reqValue));
  } else if (ahr.isArray(curValue)) {
    // for every - once again
    //
    ahr.each(curValue, function(someItem) {
      if (ahr.isJson(someItem)) {
        ahr.each(Object.keys(someItem), handleItem.bind(null, result, someItem, reqName, reqValue));
      }
    });
  }
};


/**
 * Get (only one) object where keyName == keyValue
 * @param {Object} obj - N-level object, where need to looking for
 * @param {String} keyName - Any string for key: left side
 * @param {String} keyValue - Any string for value: right side
 */
ahr.extractJsonMatch = function(obj, reqName, reqValue) {
  var result = [];
  ahr.each(Object.keys(obj), handleItem.bind(null, result, obj, reqName, reqValue));
  // only first match (if exists)
  if (result.length === 0) {
    // simple null instead a link
    return null;
  } else {
    // cloned object instead a link
    return $.extend({}, result[0]);
  }
};

ahr.getTimeStr = function(unixTimeStamp, timeFormat) {
  return moment.unix(unixTimeStamp).format(timeFormat);
};

ahr.getQueryParam = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Inherit the prototype methods from one constructor into another.
 * @example
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   goog.base(this, a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked as
 * follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // Other code here.
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
ahr.inherits = function(childCtor, parentCtor) {
  function TempCtor() {}
  TempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new TempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
};

module.exports = ahr;
