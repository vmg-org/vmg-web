/**
 * @module vmg-helpers/rqst
 */
'use strict';

var lgr = require('../vmg-helpers/lgr');

var handleFail = function(next, e) {
  // TODO: #34! handle all errors, like 422 and other
  var err = new Error(e.responseText);
  if (e.status === 422) {
    next(err);
    return;
  }

  next(err);
  lgr.error(err);
};

exports.send = function(httpMethod, url, opts, next) {
  opts.type = httpMethod;
  if (!opts.contentType) {
    opts.contentType = 'application/json; charset=utf-8';
  }

  $.ajax(url, opts).done(function(r) {
    next(null, r);
  }).fail(handleFail.bind(null, next));
};

module.exports = exports;
