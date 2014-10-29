/** @module */

//var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
var ahr = require('../vmg-helpers/app');

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

var handleGenreTags = function(next, err, genreTags) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }

  this.genreTags = genreTags;
  console.log('tags', this.genreTags);
  next();
};

exports.loadGenreTags = function(next) {
  srv.getGenreTags(handleGenreTags.bind(this, next));
};

var handleLoadTemplate = function(nxt, err, movieTemplate) {
  if (err) {
    this.prevMovieTemplateErr = err;
    nxt();
    return;
  }

  this.prevMovieTemplate = movieTemplate;
  nxt();
};

exports.loadTemplateIfEdit = function(nxt) {
  var tParam = ahr.getQueryParam('t');
  tParam = ahr.toInt(tParam);
  if (!tParam) {
    nxt();
    // continue as New record
    return;
  }

  srv.r1002(tParam, handleLoadTemplate.bind(this, nxt));
};

var handleLoadEpisodesIfEdit = function(nxt, err, arrEtm) {
  if (err) {
    alert('%=serverError=%');
    return;
  }

  // if there bids already - you cannot change 
  //var isBidExists = false;

  this.prevMovieTemplate.episode_template_arr = arrEtm;
  nxt();
};

exports.loadEpisodesIfEdit = function(nxt) {
  if (!this.prevMovieTemplate) {
    nxt();
    return;
  }

  srv.r1009(this.prevMovieTemplate.id, handleLoadEpisodesIfEdit.bind(this, nxt));
};

module.exports = exports;
