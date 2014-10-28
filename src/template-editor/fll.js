/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');
var hpr = require('./hpr');
var ehr = require('./ehr');

exports.fillGenreTags = function(next) {
  dhr.impl(this.bem, this.cls.movieGenres, 'genre_tag', this.genreTags);
  dhr.showElems('.' + this.cls.movieScope);

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
  dhr.showElems('.' + targetName);
  dhr.showElems('.' + this.cls.savingScope);

  next();
};

module.exports = exports;
