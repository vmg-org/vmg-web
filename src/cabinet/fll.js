/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');

exports.fillOpenedMovieTemplates = function(next) {
  if (this.openedMovieTemplatesErr) {
    dhr.html('.' + this.cls.openedTemplateScope, 'Error to retrieving information');
    dhr.showElems('.' + this.cls.openedTemplateScope);
    next();
    return;
  }

  dhr.impl(this.bem, this.cls.openedTemplateScope, 'movie_template', this.openedMovieTemplates);
  console.log('filled opened');
  next();
};

exports.fillReadyEpisodeBids = function(nxt) {
  if (this.readyEpisodeBidsErr) {
    dhr.html('.' + this.cls.readyBidScope, 'error retrieving info');
    nxt();
    return;
  }

  if (this.readyEpisodeBids.length === 0) {
    dhr.html('.' + this.cls.readyBidScope, 'No uploaded videos');
    nxt();
    return;
  }

  dhr.impl(this.bem, this.cls.readyBidScope, 'episode_bid', this.readyEpisodeBids);
  nxt();
};

module.exports = exports;
