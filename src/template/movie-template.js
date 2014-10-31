/** @module */
'use strict';

var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var lgr = require('../vmg-helpers/lgr');
var mdlEpisodeTemplate = require('./episode-template');
var dhr = require('../vmg-helpers/dom');

var mapEpisodeTemplate = function(etm) {
  return mdlEpisodeTemplate.init(etm);
};
var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data, prnt) {
  this.prnt = prnt;
  Object.keys(data).forEach(mapKeys.bind(this, data));
  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  this.duration_of_episodes_str = this.duration_of_episodes + ' seconds';
  this.created_str = ahr.getTimeStr(this.created, 'lll');
  this.finished_str = ahr.getTimeStr(this.finished, 'lll');
  // as solution: no genre in a movie. But in most cases - it is exists
  if (this.movie_genre_item) {
    if (this.movie_genre_item.genre_tag_item) {
      this.movie_genre_item.genre_tag_item.style = 'color: ' + this.movie_genre_item.genre_tag_item.color;
    }
  }
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });

};

Mdl.prototype.handleEpisodeTemplates = function(next, err, arrEtm) {
  if (err) {
    this.episodeTemplatesErr = err;
    next();
    lgr.error(err, {
      fnc: 'handleEpisodeTemplates'
    });
    return;
  }

  // addt fields for Template view
  //  ahr.each(arrEtm, function(item) {
  //    item.episode_bid_count_non_ready = ahr.toInt(item.episode_bid_count) - ahr.toInt(item.episode_bid_count_ready);
  //  });

  this.episodeTemplates = arrEtm.map(mapEpisodeTemplate); // arrEtm;
  next();
};

Mdl.prototype.loadEpisodeTemplates = function(cbkFlow) {
  srv.r1009(this.id, this.handleEpisodeTemplates.bind(this, cbkFlow));
};

var handlePlayerReady = function(vjs, etm) {
  etm.vjs = vjs;
  //  console.log('player is ready', vjs, etm);
  //  window.app.etmPlayer[etm.id] = vjs;
  //      this.src({
  //        type: 'video/mp4',
  //        src: 'https://s3.amazonaws.com/vmg-bucket/converted/966808401-web.mp4'
  //      });
};

var buildEtmPlayer = function(etm) {
  var videoElem = document.createElement('video');
  // for flash data-tag is not sufficient to apply a new source of video
  //    $(videoElem).attr('data-id', this.episodeTemplates[ind].id);
  $(videoElem).addClass('video-js vjs-default-skin');
  $('.att-player[data-id=' + etm.id + ']').html(videoElem);
  // Player builds using videojs and inserted a link
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true
  }, function() {
    // this = player
    handlePlayerReady(this, etm);
  });
};

Mdl.prototype.fillEpisodeTemplates = function(next) {
  if (this.episodeTemplatesErr) {
    dhr.setError('.' + this.prnt.cls.episodeTemplateScope);
    next();
    return;
  }

  dhr.impl(this.prnt.bem, this.prnt.cls.episodeTemplateScope, 'episode_template', this.episodeTemplates);

  this.episodeTemplates.forEach(buildEtmPlayer);

  // take this, only if uploaded files exists: potentially - update bids dynamically - init players here
  next();
  return;
};

exports.init = function(data, prnt) {
  return new Mdl(data, prnt);
};

module.exports = exports;
