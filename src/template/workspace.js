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
var bem = require('../../../vmg-bem/bems/template.bemjson');
var srv = require('../vmg-services/srv');
var mdlMovieTemplate = require('./movie-template');
var pblWorkspace = require('../common/workspace');

//$.extend(cls, commonCls);

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.idOfMovieTemplate = null;
  this.movieTemplate = null; // contains episodeTemplates
  this.bem = bem;
  this.isUserAlreadyInBids = null;
  this.nonReadyEpisodeBids = null; // All bids of current user with is_ready = false (usually - one or none)
  //  this.episodeBid = null; // created episode bid (to redirect to upload)
};

ahr.inherits(Mdl, pblWorkspace);

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


Mdl.prototype.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

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

// One per user
Mdl.prototype.checkNonReadyEpisodeBids = function(next) {
  srv.r1011(handleNonReadyEpisodeBids.bind(this, next));
};

Mdl.prototype.last = function() {
  console.log('last func');
};

Mdl.prototype.authFlowSelector = function() {
  // when movie template is loaded

  if (this.userSession) {
    this.userSession.showAuth(this.last);
    this.movieTemplate.startFlow(this.last);
  } else {
    // show message and apply events and login buttons with authFlow
    this.waitUserLogin(function() {
      window.location.reload();
    });
  }
};

Mdl.prototype.start = function() {
  var appFlow =
    this.loadIdOfMovieTemplate.bind(this,
      this.waitDocReady.bind(this,
        this.addEvents.bind(this,
          this.loadMovieTemplate.bind(this,
            this.loadSid.bind(this,
              // two flows - auth=yes and auth=no
              this.handleSid.bind(this,
                this.authFlowSelector.bind(this)
              ))))));

  appFlow();
};

exports.init = function(doc, zpath) {
  return new Mdl(doc, zpath);
};

module.exports = exports;
