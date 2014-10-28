/** 
 * Private helper for this page
 * @module
 */
'use strict';

exports.propErr = function(lim, value, propName) {
  var arrErr = [];
  if (lim.max_length) {
    if (value.length > lim.max_length) {
      arrErr.push(propName + ' - max length: ' + lim.max_length);
    }
  }

  if (lim.min_length) {
    if (value.length < lim.min_length) {
      arrErr.push(propName + ' - min length: ' + lim.min_length);
    }
  }

  if (lim.required) {
    if (!value) {
      arrErr.push(propName + ' - required');
    }
  }

  return arrErr;
};

exports.constructTip = function(limitKey, inpLimit) {
  var a = inpLimit[limitKey];

  var arrStr = [];

  if (a.max_length) {
    arrStr.push('Max length: ' + a.max_length);
  }
  if (a.min_length) {
    arrStr.push('Min length: ' + a.min_length);
  }

  if (a.required) {
    arrStr.push('Required field');
  }

  return arrStr.join('<br>');
};
module.exports = exports;
