/** @module */

var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
//var lgr = require('../vmg-helpers/lgr');
var mdlMovieTemplate = require('./movie-template');

// show a block with loaders
// load bids, if no bids - show notif
// load file_cut for id_of_media_spec - show a video
// when loaded
//      plusButton - PUT episode-bid moder_rating - plus
//      bestButton - PUT epis moder_rating - best
// for template author - button: join best videos: send 3 ids of bids

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

  //  dhr.on(elemProlongTemplate, 'click', handleFncProlongTemplate.bind(this));
  dhr.showElems(elemProlongTemplate);

  //  dhr.on(elemEditTemplate, 'click', handleFncEditTemplate.bind(this)); // write when impl
  dhr.showElems(elemEditTemplate);

  //dhr.on(elemsShowAttachments, 'click', handleFncShowAttachments.bind(this));
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
  this.movieTemplate.fillMovieTemplate(next);
  //  next();
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
