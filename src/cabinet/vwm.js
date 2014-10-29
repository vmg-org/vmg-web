/** @module */

var dhr = require('../vmg-helpers/dom');
var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
var ahr = require('../vmg-helpers/app');

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

  // addt fields
  this.bidInfo.episode_template_item.movie_template_item.url_to_view = './template.html?t=' +
    this.bidInfo.episode_template_item.movie_template_item.id;

  console.log('bidInfo', bidInfo);
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

var handleOpenedMovieTemplates = function(next, err, arr) {
  if (err) {
    this.openedMovieTemplatesErr = err;
    next();
    return;
  }

  //addt fields
  ahr.each(arr, function(item) {
    item.finished_str = 'till ' + ahr.getTimeStr(item.finished, 'DD-MMM');
    item.link_to_watch = './template.html?t=' + item.id;
  });

  this.openedMovieTemplates = arr;
  console.log('opened', arr);
  next();
};

exports.loadOpenedMovieTemplates = function(next) {
  // non-active (old) templates
  srv.r1012(handleOpenedMovieTemplates.bind(this, next));
};

var handleReadyEpisodeBids = function(nxt, err, arrEbd) {
  if (err) {
    this.readyEpisodeBidsErr = err;
    nxt();
    lgr.error(err);
    return;
  }

  this.readyEpisodeBids = arrEbd;
  nxt();
  lgr.info({
    arrEbd: arrEbd
  });
};

exports.loadReadyEpisodeBids = function(nxt) {
  srv.r1014(handleReadyEpisodeBids.bind(this, nxt));
};

module.exports = exports;
