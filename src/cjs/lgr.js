/**
 * Logger helper
 * @module lgr
 */

'use strict';

exports.info = function(obj) {
  console.log(JSON.stringify(obj));
};

exports.error = function(err, obj) {
  console.log(err);
  if (obj) {
    console.log(JSON.stringify(obj));
  }
};

module.exports = exports;
