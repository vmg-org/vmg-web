/** @module */

var dhr = require('../vmg-helpers/dom');
var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
//var ahr = require('../vmg-helpers/app');

var handleError = function(clsNotif, err) {
  dhr.html('.' + clsNotif, err.message || '%=serverError=%');
  dhr.showElems('.' + clsNotif);
  lgr.error(err);
};

var handleBidInfo = function(next, err, bidInfo) {
  if (err) {
    handleError(this.cls.notif, err);
    return;
  }

  this.bidInfo = bidInfo;
  console.log('bidinfo', bidInfo);
  next();
};

/**
 * Load an episode template and movie template info
 */
exports.loadBidInfo = function(next) {
  if (!this.nonReadyEpisodeBid) {
    next();
    return;
  }
  srv.r1008(this.nonReadyEpisodeBid.id_of_media_spec, handleBidInfo.bind(this, next));
};

var handleNonReadyEpisodeBids = function(next, err, result) {
  if (err) {
    handleError(this.cls.notif, err);
    return;
  }

  if (result || result.length > 0) {
    this.nonReadyEpisodeBid = result[0];
  }

  console.log(result);
  next();
};

exports.loadNonReadyEpisodeBids = function(next) {
  // is_ready = false
  srv.r1011(handleNonReadyEpisodeBids.bind(this, next));
};

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

module.exports = exports;
