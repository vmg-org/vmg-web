/** 
 * Root viewmodel for this page
 * @module
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var cls = require('./cls');
var fllHelper = require('./fll');
var mdlMovieTemplate = require('./movie-template');
var markups = require('./markups');
var bem = require('../../../vmg-bem/bems/watch.bemjson');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.bem = bem;
  this.idOfMovieTemplate = null;
  this.movieTemplate = null;
  this.markups = markups;
};

ahr.inherits(Mdl, pblWorkspace);

/**
 * Load with info, genre, creator
 *      check existence and status
 *      after: create a model; load urls of best videos
 */
Mdl.prototype.loadMovieTemplate = function(next) {
  // imitation : TODO: #33! of movie loading
  this.movieTemplate = mdlMovieTemplate.init({
    id: this.idOfMovieTemplate
  }, this, this.zpath + '.movieTemplate');

  //  console.log(this.movieTemplate);
  this.movieTemplate.loadEpisodeTemplates();
  next();
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

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    this.userSession.showAuth(this.last);
  } else {
    // show message and apply events and login buttons with authFlow
    this.waitUserLogin(function() {
      window.location.reload();
    });
  }
};


Mdl.prototype.startFlow = function() {
  var appFlow =
    this.loadIdOfMovieTemplate.bind(this,
      this.loadMovieTemplate.bind(this,
        this.waitDocReady.bind(this,
          //          fllHelper.fillMovie.bind(this,
          this.addEvents.bind(this,
            fllHelper.fillComments.bind(this,
              fllHelper.updateCommentsByInterval.bind(this,
                this.loadSid.bind(this,
                  // two flows - auth=yes and auth=no
                  this.handleSid.bind(this,
                    this.authFlowSelector.bind(this)
                  ))))))));

  appFlow();
};

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
