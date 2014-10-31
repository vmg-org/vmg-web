/** @module */

var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
//var lgr = require('../vmg-helpers/lgr');
var att = require('./att');
var mdlMovieTemplate = require('./movie-template');

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
  } else {
    window.location.href = './template-editor.html?t=' + this.movieTemplate.id;
  }
};

var handleFncShowAttachments = function(e) {
  var idOfEpisodeTemplate = e.target.getAttribute('data-id');
  var jqrContainer = $('.' + this.cls.attContainer + '[data-id="' + idOfEpisodeTemplate + '"]');

  if (dhr.isElems(jqrContainer, ':visible')) {
    jqrContainer.hide('slow');
  } else {
    jqrContainer.show('slow');
    var attRow = dhr.getElems('.' + this.cls.attRow);
    att.run.apply(this, [idOfEpisodeTemplate, jqrContainer, attRow]);
  }

  //  console.log(idOfEpisodeTemplate);

  //  $('.' + this.cls.attContainer
  // number or id of episode

  // att.run.apply(this);
  // show or hide this one
  //alert('under construction');
  // show a block with loaders
  // load bids, if no bids - show notif
  // load file_cut for id_of_media_spec - show a video
  // when loaded
  //      plusButton - PUT episode-bid moder_rating - plus
  //      bestButton - PUT epis moder_rating - best
  // for template author - button: join best videos: send 3 ids of bids
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
  var elemsShowAttachments = dhr.getElems('.' + this.cls.fncShowAttachments);

  dhr.on(elemProlongTemplate, 'click', handleFncProlongTemplate.bind(this));
  dhr.showElems(elemProlongTemplate);

  dhr.on(elemEditTemplate, 'click', handleFncEditTemplate.bind(this));
  dhr.showElems(elemEditTemplate);

  dhr.on(elemsShowAttachments, 'click', handleFncShowAttachments.bind(this));
  dhr.showElems(elemsShowAttachments);

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




exports.fillMovieTemplate = function(next) {
  dhr.impl(this.bem, this.cls.movieTemplateScope, 'movie_template', [this.movieTemplate]);

  // if genre exists - show this block
  if (this.movieTemplate.movie_genre_item) {
    dhr.impl(this.bem, this.cls.genreTagScope, 'genre_tag', [this.movieTemplate.movie_genre_item.genre_tag_item]);
    dhr.showElems('.' + this.cls.genreTagScope);
  }


  var flow = this.movieTemplate.loadEpisodeTemplates.bind(this.movieTemplate,
    this.movieTemplate.fillEpisodeTemplates.bind(this.movieTemplate, next));
  // TODO: #33! episodes - later in next request
  //  dhr.impl(this.bem, this.cls.episodeTemplateScope, 'episode_template', this.movieTemplate.episode_template_arr);
  flow();
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


  this.movieTemplate = mdlMovieTemplate.init(data, this);
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
