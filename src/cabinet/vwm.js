/** @module */

var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
var ahr = require('../vmg-helpers/app');

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

  ahr.each(arrEbd, function(item) {
    item.created_str = ahr.getTimeStr(item.created, 'DD-MMM');
    item.link_to_template = './template.html?t=' + item.episode_template_item.movie_template_item.id;
  });

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
