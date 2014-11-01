/** @module */
'use strict';
// show a block with loaders
// load bids, if no bids - show notif
// load file_cut for id_of_media_spec - show a video
// when loaded
//      plusButton - PUT episode-bid moder_rating - plus
//      bestButton - PUT epis moder_rating - best
// for template author - button: join best videos: send 3 ids of bids
// If user is player (if not an owner of a movie template)
//     Show buttons: upload now, later if not played already
var ahr = require('../vmg-helpers/app');
var dhr = require('../vmg-helpers/dom');
var cls = require('./cls');
var commonCls = require('../common/cls');
var bem = require('../../../vmg-bem/bems/template.bemjson');
var srv = require('../vmg-services/srv');
//var lgr = require('../vmg-helpers/lgr');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
var mdlMovieTemplate = require('./movie-template');

$.extend(cls, commonCls);

var Mdl = function(doc, zpath) {
  this.zpath = zpath;
  this.doc = doc;
  this.idOfMovieTemplate = null;
  this.movieTemplate = null; // contains episodeTemplates
  this.cls = cls;
  this.sid = null;
  this.bem = bem;
  this.userSession = null; // is authenticated
  this.isUserOwner = null; // autenticated and owner of movie template
  this.isUserAlreadyInBids = null;
  this.nonReadyEpisodeBids = null; // All bids of current user with is_ready = false (usually - one or none)
  //  this.episodeBid = null; // created episode bid (to redirect to upload)
};

Mdl.prototype.loadIdOfMovieTemplate = function(next) {
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

Mdl.prototype.handleMovieTemplate = function(next, err, data) {
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

Mdl.prototype.loadMovieTemplate = function(next) {
  srv.r1002(this.idOfMovieTemplate,
    this.handleMovieTemplate.bind(this, next));
};

Mdl.prototype.handleOwner = function(next) {
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
Mdl.prototype.handleUserRights = function(next) {
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

Mdl.prototype.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

//var eachElemUploadLater = function(elm) {
//  var idOfEpisodeTemplate = ahr.toInt(elm.getAttribute('data-id'));
//  dhr.on(elm, 'click', handleUploadLater.bind(this, idOfEpisodeTemplate));
//};
//
//var eachElemUploadNow = function(elm) {
//  var idOfEpisodeTemplate = ahr.toInt(elm.getAttribute('data-id'));
//  dhr.on(elm, 'click', handleUploadNow.bind(this, idOfEpisodeTemplate));
//};

Mdl.prototype.fillUserBids = function(next) {
  if (this.nonReadyEpisodeBids.length > 0) {
    dhr.html('.' + this.cls.notif, 'You have a later-uploaded episode. Please upload a video or cancel it. <a href="./cabinet.html">Go to my cabinet</a>');
    dhr.showElems('.' + this.cls.notif);
    next();
    return;
  }
  // The same - as upper checking
  //  if (this.isUserAlreadyInBids === true) {
  //    next();
  //    return;
  //  }


  var elemsUploadLater = dhr.getElems('.' + this.cls.fncUploadLater); // 'shw-episode__fnc-upload-later',
  var elemsUploadNow = dhr.getElems('.' + this.cls.fncUploadNow); //    fncUploadNow: 'shw-episode__fnc-upload-now'

  // ahr.each(elemsUploadLater, eachElemUploadLater.bind(this));
  // ahr.each(elemsUploadNow, eachElemUploadNow.bind(this));


  //  if (this.isUserAlreadyInBids === true) {
  //    dhr.disable(elemUploadLater);
  //    dhr.disable(elemUploadNow);
  //  }

  dhr.showElems(elemsUploadLater);
  dhr.showElems(elemsUploadNow);

  next();
};

var handleNonReadyEpisodeBids = function(next, err, episodeBidArr) {
  if (err) {
    dhr.html('.' + this.cls.notif, 'Server error: retrieving users\' bids');
    dhr.showElems('.' + this.cls.notif);
    return;
  }

  // usuall arr - one or null (not-uploaded bid)
  this.nonReadyEpisodeBids = episodeBidArr;
  next();
};

Mdl.prototype.checkNonReadyEpisodeBids = function(next) {
  srv.r1011(handleNonReadyEpisodeBids.bind(this, next));
};

Mdl.prototype.handlePlayer = function(next) {
  if (this.isUserOwner !== false) {
    next();
    return;
  }

  var playerFlow = this.movieTemplate.checkLocalEpisodeBids.bind(this.movieTemplate,
    this.checkNonReadyEpisodeBids.bind(this,
      this.fillUserBids.bind(this, next)));

  playerFlow();

  // check: Whether the user plays in episodes already
  // --> id_of_movie_template
  // SELECT * FROM
  // If false
  // show gray buttons
  // else
  // show active buttons
  // player fncs
};

Mdl.prototype.start = function() {
  var last = function() {
    console.log('last func');
  };

  var afterAuthFlow =
    authHelper.showAuth.bind(this,
      this.handleUserRights.bind(this,
        this.handlePlayer.bind(this, // show buttons for usual user
          this.handleOwner.bind(this, // show button for owner of a movie
            last))));

  var authNoFlow =
    authHelper.waitUserLogin.bind(this,
      afterAuthFlow
    );

  var authFlowSelector = function() {
    if (this.userSession) {
      afterAuthFlow();
    } else {
      // show message and apply events and login buttons with authFlow
      authNoFlow();
    }
  };

  var appFlow = this.loadIdOfMovieTemplate.bind(this,
    this.waitDocReady.bind(this,
      popupHelper.addEvents.bind(this,
        this.loadMovieTemplate.bind(this,
          authHelper.loadSid.bind(this,
            // two flows - auth=yes and auth=no
            authHelper.handleSid.bind(this,
              authFlowSelector.bind(this)
            ))))));

  appFlow();
};

exports.init = function(doc, zpath) {
  return new Mdl(doc, zpath);
};

module.exports = exports;
