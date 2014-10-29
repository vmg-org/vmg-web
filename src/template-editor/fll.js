/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');
var hpr = require('./hpr');
var ahr = require('../vmg-helpers/app');

/**
 * Show blocks for creating
 *     after load all limits
 *     after load a movie_template (if edit)
 */
exports.showCrtBlocks = function(next) {
  dhr.showElems('.' + this.cls.movieScope);
  dhr.showElems('.' + this.cls.episodeScope);
  dhr.showElems('.' + this.cls.savingScope);

  // show or hide exclamation sign (after checking limits);
  $('input:text').trigger('keyup');
  $('textarea').trigger('keyup');
  $('select').trigger('change');

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

// Fill genre tags and other movie info, like movie name and duration, and photo
exports.fillGenreTags = function(next) {
  dhr.impl(this.bem, this.cls.movieGenres, 'genre_tag', this.genreTags);

  if (this.prevMovieTemplate) {
    if (this.prevMovieTemplate.movie_genre_item) {
      var gid = this.prevMovieTemplate.movie_genre_item.id_of_genre_tag;
      console.log('gid', gid);
      $('.' + this.cls.movieGenresChecker + ':input[value="' + gid + '"]').trigger('click');
      //.prop('checked', true);
    }

    dhr.setVal('.' + this.cls.inpMovieName, this.prevMovieTemplate.name);
    dhr.setVal('.' + this.cls.inpDuration, ahr.toInt(this.prevMovieTemplate.duration_of_episodes));
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

  // add default data if edit
  if (this.prevMovieTemplate) {
    // TODO: #33! Sort episodes
    ahr.each(this.prevMovieTemplate.episode_template_arr, function(prevEpisode, ind) {
      data[ind].story = prevEpisode.story || '';
      data[ind].name = prevEpisode.name || '';
      data[ind].conds = prevEpisode.conds || '';
    });
  }

  var mdlName = 'crt_episode';
  dhr.impl(this.bem, targetName, mdlName, data);


  next();
};

exports.checkBidsExistence = function(nxt) {
  if (!this.prevMovieTemplate) {
    nxt();
    return;
  }

  var isExists = (this.prevMovieTemplate.episode_template_arr.filter(function(item) {
    return item.episode_bid_count > 0;
  })).length > 0;

  if (isExists) {
    dhr.html('.' + this.cls.notif, 'There are bids in the template already. An edit feature is not allowed');
    dhr.showElems('.' + this.cls.notif);
    return;
    // NO nxt()
  }

  nxt();
};

module.exports = exports;
