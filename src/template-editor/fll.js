/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');
var hpr = require('./hpr');
var ehr = require('./ehr');

/**
 * Show blocks for creating
 *     after load all limits
 *     after load a movie_template (if edit)
 */
exports.showCrtBlocks = function(next) {
  dhr.showElems('.' + this.cls.movieScope);
  dhr.showElems('.' + this.cls.episodeScope);
  dhr.showElems('.' + this.cls.savingScope);

  next();
};

exports.fillPrevMovieTemplate = function(nxt) {
  if (this.prevMovieTemplateErr) {
    dhr.html('.' + this.cls.notif, 'Error to retrieving this movie template');
    dhr.showElems('.' + this.cls.notif);
    // end of flow
    return;
  }

  if (!this.prevMovieTemplate) {
    //    dhr.html('.' + this.cls.notif, 'Movie template is not found');
    //    dhr.showElems('.' + this.cls.notif);
    //    return;
    nxt();
    // if a movie template is not found - create a new one
    return;
  }

  console.log('fill a prev template');



  nxt();
};

exports.fillGenreTags = function(next) {
  dhr.impl(this.bem, this.cls.movieGenres, 'genre_tag', this.genreTags);

  if (this.prevMovieTemplate) {
    if (this.prevMovieTemplate.movie_genre_item) {
      var gid = this.prevMovieTemplate.movie_genre_item.id_of_genre_tag;
      console.log('gid', gid);
      $('.' + this.cls.movieGenresChecker + ':input[value="' + gid + '"]').prop('checked', true);
    }
  }

  next();
};

exports.fillEpisodes = function(next) {
  var targetName = this.cls.episodeScope;
  // for these items all props can be different
  var data = [{
    order: '1',
    name_order: 'First episode',
    ph_name: 'Episode name',
    ph_story: 'Episode story',
    ph_conds: 'Episode conditions',
    tooltip_name: hpr.constructTip('name_of_episode', this.inpLimit),
    tooltip_story: hpr.constructTip('story_of_episode', this.inpLimit),
    tooltip_conds: hpr.constructTip('conds_of_episode', this.inpLimit)
  }, {
    order: '2',
    name_order: 'Second episode',
    ph_name: 'Episode name',
    ph_story: 'Episode story',
    ph_conds: 'Episode conditions',
    tooltip_name: hpr.constructTip('name_of_episode', this.inpLimit),
    tooltip_story: hpr.constructTip('story_of_episode', this.inpLimit),
    tooltip_conds: hpr.constructTip('conds_of_episode', this.inpLimit)
  }, {
    order: '3',
    name_order: 'Third episode',
    ph_name: 'Episode name',
    ph_story: 'Episode story',
    ph_conds: 'Episode conditions',
    tooltip_name: hpr.constructTip('name_of_episode', this.inpLimit),
    tooltip_story: hpr.constructTip('story_of_episode', this.inpLimit),
    tooltip_conds: hpr.constructTip('conds_of_episode', this.inpLimit)
  }];

  var mdlName = 'crt_episode';
  dhr.impl(this.bem, targetName, mdlName, data);

  $.extend(window.app, ehr);

  next();
};

module.exports = exports;
