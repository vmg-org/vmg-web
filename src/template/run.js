/** @module */
'use strict';

var vwmHelper = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
var bem = require('../../../vmg-bem/bems/template.bemjson');
var commonCls = require('../common/cls');
var playerHandler = require('./player-handler');
var cls = require('./cls');

$.extend(cls, commonCls);

var ctx = {
  doc: document,
  idOfMovieTemplate: null,
  movieTemplate: null, // contains episodeTemplates
  cls: cls,
  sid: null,
  bem: bem,
  userSession: null, // is authenticated
  isUserOwner: null, // autenticated and owner of movie template
  isUserAlreadyInBids: null,
  nonReadyEpisodeBids: null, // All bids of current user with is_ready = false (usually - one or none)
  episodeBid: null // created episode bid (to redirect to upload)
};

window.app = ctx;

var last = function() {
  console.log('last func');
};

var afterAuthFlow =
  authHelper.showAuth.bind(ctx,
    vwmHelper.handleUserRights.bind(ctx,
      playerHandler.run.bind(ctx, // show buttons for usual user
        vwmHelper.handleOwner.bind(ctx, // show button for owner of a movie
          last))));

var authNoFlow =
  authHelper.waitUserLogin.bind(ctx,
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

var appFlow = vwmHelper.loadIdOfMovieTemplate.bind(ctx,
  vwmHelper.waitDocReady.bind(ctx,
    popupHelper.addEvents.bind(ctx,
      vwmHelper.loadMovieTemplate.bind(ctx,
        authHelper.loadSid.bind(ctx,
          // two flows - auth=yes and auth=no
          authHelper.handleSid.bind(ctx,
            authFlowSelector.bind(ctx)
          ))))));

appFlow();
