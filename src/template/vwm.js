/** @module */

var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var lgr = require('../vmg-helpers/lgr');

var handleFncProlongTemplate = function() {
  alert('under construction');
};

var handleFncEditTemplate = function() {
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
  }
  alert('under construction');
};

var handleFncShowAttachments = function() {
  alert('under construction');
};

exports.handleOwner = function(next) {
  if (this.isUserOwner !== true) {
    next();
    return;
  }

  // show and add events to admin buttons
  console.log('user is owner of movie template');

  //    fncProlongTemplate: 'shw-movie-template__prolong-fnc',
  //    fncEditTemplate: 'shw-movie-template__edit-fnc',
  //    fncRemoveTemplate: 'shw-movie-template__remove-fnc',
  //    fncTweetStory: 'shw-episode__fnc-tweet-story',
  //    fncShowAttachments: 'shw-episode__fnc-show-attachments',
  var elemProlongTemplate = dhr.getElems('.' + this.cls.fncProlongTemplate);
  var elemEditTemplate = dhr.getElems('.' + this.cls.fncEditTemplate);
  //    var elemRemoveTemplate = dhr.getElem('.' + this.cls.fncRemoveTemplate);
  //    var elemTweetStory = dhr.getElem('.' + this.cls.fncTweetStory);
  var elemShowAttachments = dhr.getElems('.' + this.cls.fncShowAttachments);

  dhr.on(elemProlongTemplate, 'click', handleFncProlongTemplate.bind(this));
  dhr.showElems(elemProlongTemplate);

  dhr.on(elemEditTemplate, 'click', handleFncEditTemplate.bind(this));
  dhr.showElems(elemEditTemplate);

  dhr.on(elemShowAttachments, 'click', handleFncShowAttachments.bind(this));
  dhr.showElems(elemShowAttachments);

  next();
};

// Whether the user is owner of movie?
exports.handleUserRights = function(next) {
  if (this.userSession) {
    console.log('authenticated');
    if (this.movieTemplate.movie_creator_item) {
      console.log('movie has owner');
      if (this.userSession.social_profile_item.id_of_user_profile === this.movieTemplate.movie_creator_item.id_of_user_profile) {
        this.isUserOwner = true;
      } else {
        this.isUserOwner = false;
      }
    } else {
      this.isUserOwner = false;
    }
  }

  next();
};

var handleEpisodeTemplates = function(next, err, arrEtm) {
  if (err) {
    this.episodeTemplatesErr = err;
    next();
    lgr.error(err, {
      fnc: 'handleEpisodeTemplates'
    });
    return;
  }

  // addt fields for Template view
  ahr.each(arrEtm, function(item) {
    item.episode_bid_count_non_ready = ahr.toInt(item.episode_bid_count) - ahr.toInt(item.episode_bid_count_ready);
  });

  this.episodeTemplates = arrEtm;
  next();
  return;
};

exports.loadEpisodeTemplates = function(next) {
  srv.r1009(this.idOfMovieTemplate, handleEpisodeTemplates.bind(this, next));
};

exports.fillEpisodeTemplates = function(next) {
  if (this.episodeTemplatesErr) {
    dhr.setError('.' + this.cls.episodeTemplateScope);
    next();
    return;
  }

  dhr.impl(this.bem, this.cls.episodeTemplateScope, 'episode_template', this.episodeTemplates);
  next();
  return;
};

exports.fillMovieTemplate = function(next) {
  dhr.impl(this.bem, this.cls.movieTemplateScope, 'movie_template', [this.movieTemplate]);

  // if genre exists - show this block
  if (this.movieTemplate.movie_genre_item) {
    dhr.impl(this.bem, this.cls.genreTagScope, 'genre_tag', [this.movieTemplate.movie_genre_item.genre_tag_item]);
    dhr.showElems('.' + this.cls.genreTagScope);
  }
  // TODO: #33! episodes - later in next request
  //  dhr.impl(this.bem, this.cls.episodeTemplateScope, 'episode_template', this.movieTemplate.episode_template_arr);
  next();
};

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

var handleMovieTemplate = function(next, err, data) {
  if (err) {
    alert(err.message);
    //	  locHelper.moveToError(this.doc, msg);
    //    this.doc.location.href = 'error.html';
    // redirect to error page
    return;
  }

  if (!data) {
    alert('Template is not found');
    return;
  }

  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  data.duration_of_episodes_str = data.duration_of_episodes + ' seconds';
  data.created_str = ahr.getTimeStr(data.created, 'lll');
  data.finished_str = ahr.getTimeStr(data.finished, 'lll');
  // as solution: no genre in a movie. But in most cases - it is exists
  if (data.movie_genre_item) {
    if (data.movie_genre_item.genre_tag_item) {
      data.movie_genre_item.genre_tag_item.style = 'color: ' + data.movie_genre_item.genre_tag_item.color;
    }
  }
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });

  this.movieTemplate = data;
  next();
};

exports.loadMovieTemplate = function(next) {
  srv.r1002(this.idOfMovieTemplate,
    handleMovieTemplate.bind(this, next));
};

exports.loadIdOfMovieTemplate = function(next) {
  var paramT = ahr.getQueryParam('t');
  if (!paramT) {
    return alert('required: "?t=123" param in url: id of movie template');
  }

  paramT = ahr.toInt(paramT);

  if (!paramT) {
    return alert('required: "?t=123" param in url: id of movie template (integer)');
  }

  this.idOfMovieTemplate = paramT;

  next();
};

module.exports = exports;
