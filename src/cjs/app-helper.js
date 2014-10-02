/** @module app-helper */

'use strict';

/**
 * Required for NodeList and old browser without forEach method
 */
exports.each = function(arr, cbk) {
  for (var i = 0, lim = arr.length; i < lim; i += 1) {
    // can be passed index and full arr as required (as 2-nd and 3-rd element) like in forEach
    cbk(arr[i]);
  }
};

module.exports = exports;
