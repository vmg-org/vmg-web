/** @module */
'use strict';

var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var lgr = require('../vmg-helpers/lgr');
var mdlEpisodeTemplate = require('./episode-template');
var dhr = require('../vmg-helpers/dom');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data, root) {
  this.root = root;

  this.zpath = this.root.zpath + '.movieTemplate';
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

  this.fnc_move_to_edit = this.zpath + '.moveToEdit()';
  this.fnc_prolong = this.zpath + '.prolong()';
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });
};

Mdl.prototype.mapEpisodeTemplate = function(etm, ind) {
  return mdlEpisodeTemplate.init(etm, this, ind);
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

  this.episodeTemplates = arrEtm.map(this.mapEpisodeTemplate.bind(this)); // arrEtm;
  next();
};

Mdl.prototype.loadEpisodeTemplates = function(cbkFlow) {
  srv.r1009(this.id, this.handleEpisodeTemplates.bind(this, cbkFlow));
};


Mdl.prototype.fillEpisodeTemplates = function(next) {
  if (this.episodeTemplatesErr) {
    dhr.setError('.' + this.root.cls.episodeTemplateScope);
    next();
    return;
  }

  dhr.impl(this.root.bem, this.root.cls.episodeTemplateScope, 'episode_template', this.episodeTemplates);

  this.episodeTemplates.forEach(function(etm) {
    etm.buildEtmPlayer();
  });

  // take this, only if uploaded files exists: potentially - update bids dynamically - init players here
  next();
  return;
};

Mdl.prototype.fillMovieTemplate = function(next) {
  dhr.impl(this.root.bem, this.root.cls.movieTemplateScope, 'movie_template', [this]);

  // if genre exists - show this block
  if (this.movie_genre_item) {
    dhr.impl(this.root.bem, this.root.cls.genreTagScope, 'genre_tag', [this.movie_genre_item.genre_tag_item]);
    dhr.showElems('.' + this.root.cls.genreTagScope);
  }

  var flow = this.loadEpisodeTemplates.bind(this,
    this.fillEpisodeTemplates.bind(this, next));
  // TODO: #33! episodes - later in next request
  //  dhr.impl(this.bem, this.cls.episodeTemplateScope, 'episode_template', this.movieTemplate.episode_template_arr);
  flow();
};

Mdl.prototype.moveToEdit = function() {
  // show notif - you cannot change if there are bids
  //
  var isBidsExist = false;

  // addt fields for Template view
  ahr.each(this.episodeTemplates, function(item) {
    if (ahr.toInt(item.episode_bid_count) > 0) {
      isBidsExist = true;
    }
  });

  if (isBidsExist === true) {
    alert('There are bids in the template already. An edit function is not allowed');
    return;
  } else {
    window.location.href = './template-editor.html?t=' + this.id;
  }
};

Mdl.prototype.prolong = function() {
  alert('under construction');
};

// One bid per movie template for one user
Mdl.prototype.handleUserEpisodeBids = function(next, err, episodeBidArr) {
  if (err) {
    dhr.html('.' + this.root.cls.notif, 'Server error: retrieving users\' bids');
    dhr.showElems('.' + this.root.cls.notif);
    return;
  }

  this.root.isUserAlreadyInBids = episodeBidArr.length > 0 ? true : false;

  // attach episode-bids to this.episodeTemplates
  ahr.each(this.episodeTemplates, function(etm) {
    var asdf = ahr.filter(episodeBidArr, function(ebd) {
      return ebd.id_of_episode_template === etm.id;
    });

    etm.episode_bid_arr_user = asdf;
  });

  //  console.log('episodeBidArr', this.episodeTemplates);

  next();
};

Mdl.prototype.checkLocalEpisodeBids = function(next) {
  var idOfEpisodeTemplateArr = ahr.map(this.episodeTemplates, function(item) {
    return item.id;
  });

  srv.r1010(idOfEpisodeTemplateArr.join(','), this.handleUserEpisodeBids.bind(this, next));
};

exports.init = function(data, root) {
  return new Mdl(data, root);
};

module.exports = exports;
