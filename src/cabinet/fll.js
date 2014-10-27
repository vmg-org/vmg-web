/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');

exports.fillBidInfo = function(next) {
  if (!this.bidInfo) {
    next();
    console.log('no bid info to fill');
    return;
  }

  //var elsActMovieScope = dhr.getElems('.' + this.cls.actMovieScope);
  dhr.impl(this.bem, this.cls.actMovieScope, 'movie_template', [this.bidInfo.episode_template_item.movie_template_item]);
  dhr.impl(this.bem, this.cls.actEpisodeScope, 'episode_template', [this.bidInfo.episode_template_item]);
  dhr.impl(this.bem, this.cls.actBidScope, 'episode_bid', [this.bidInfo]);
  next();
  console.log('filled');
};

module.exports = exports;
