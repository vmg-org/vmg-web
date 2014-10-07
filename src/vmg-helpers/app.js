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
    cbk(arr[i]);
  }
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

ahr.getTimeStr = function(unixTimeStamp, timeFormat){
  return moment.unix(unixTimeStamp).format(timeFormat);
};

module.exports = ahr;
