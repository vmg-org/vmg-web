/** 
 * Root viewmodel for this page
 * @module
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var bem = require('../../../vmg-bem/bems/cabinet.bemjson');
var vwmHelper = require('./vwm');
var fllHelper = require('./fll');
var cls = require('./cls');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.bem = bem;
  this.readyEpisodeBids = null; // Uploaded bids, with media_spec_item, episode_template_item, movie_template_item
  this.nonReadyEpisodeBid = null; // A bid of current user with is_ready = false (usually - one or none)
  this.openedMovieTemplates = null;
  this.openedMovieTemplatesErr = null;
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    var afterAuthFlow =
      this.userSession.showAuth.bind(this.userSession,
        vwmHelper.loadNonReadyEpisodeBids.bind(this,
          vwmHelper.loadBidInfo.bind(this,
            fllHelper.fillBidInfo.bind(this,
              vwmHelper.loadReadyEpisodeBids.bind(this,
                fllHelper.fillReadyEpisodeBids.bind(this,
                  vwmHelper.loadOpenedMovieTemplates.bind(this,
                    fllHelper.fillOpenedMovieTemplates.bind(this,
                      this.last)
                  )))))));
    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow

    this.waitUserLogin(function() {
      window.location.reload();
    });
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
