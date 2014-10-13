/** vmg-helpers/rqst */
'use strict';

exports.send = function(httpMethod, url, opts, next) {
  opts.type = httpMethod;
  if (!opts.contentType) {
    opts.contentType = 'application/json; charset=utf-8';
  }

  console.log('rqst', opts);
  $.ajax(url, opts).done(function(r) {
    next(null, r);
  }).fail(function(e) {
    next(e);
  });
};

module.exports = exports;
