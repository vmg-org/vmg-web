/** @module */
'use strict';
var bem = require('../../../vmg-bem/bems/template-editor.bemjson');
var vwmHelper = require('./vwm');
var fllHelper = require('./fll');
var cls = require('./cls');
var markups = {};
var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls, markups, zpath]);
  this.bem = bem;
  this.genreTags = null;
  this.prevMovieTemplate = null;
  this.prevMovieTemplateErr = null;
  this.crtScope = {
    name_of_movie: '',
    duration_of_episodes: 15, // by default
    genre_of_movie: '',
    episodes: [{
      name: '',
      story: '',
      conds: '',
      order_in_movie: 1,
      guide_photo_url: ''
    }, {
      name: '',
      story: '',
      conds: '',
      order_in_movie: 2,
      guide_photo_url: ''
    }, {
      name: '',
      story: '',
      conds: '',
      order_in_movie: 3,
      guide_photo_url: ''
    }]
  };

  this.inpLimit = {
    name_of_movie: {
      max_length: 50,
      min_length: 3,
      required: true
    },
    name_of_episode: {
      max_length: 100,
      min_length: 5,
      required: true
    },
    story_of_episode: {
      max_length: 400,
      min_length: 100,
      required: true
    },
    conds_of_episode: {
      max_length: 100
    }
  };
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    var afterAuthFlow =
      this.userSession.showAuth.bind(this.userSession,
        vwmHelper.loadGenreTags.bind(this,
          vwmHelper.loadTemplateIfEdit.bind(this,
            vwmHelper.loadEpisodesIfEdit.bind(this,
              fllHelper.checkBidsExistence.bind(this,
                fllHelper.fillPrevMovieTemplate.bind(this,
                  fllHelper.fillGenreTags.bind(this,
                    fllHelper.fillEpisodes.bind(this,
                      fllHelper.showCrtBlocks.bind(this,
                        this.last
                      )))))))));

    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow
    var authNoFlow =
      this.showNoAuthWarning.bind(this,
        this.waitUserLogin.bind(this));
    authNoFlow();
  }
};

Mdl.prototype.startFlow = function() {
  var appFlow =
    this.waitDocReady.bind(this,
      this.addEvents.bind(this,
        this.loadSid.bind(this,
          // two flows - auth=yes and auth=no
          this.handleSid.bind(this,
            this.authFlowSelector.bind(this)
          ))));

  appFlow();
};

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
