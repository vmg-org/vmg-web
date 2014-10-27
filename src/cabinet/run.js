// todo #33! js docs

var bem = require('../../../vmg-bem/bems/cabinet.bemjson');
var vwmHelper = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
var fllHelper = require('./fll');

var commonCls = require('../common/cls');
var cls = require('./cls');

$.extend(cls, commonCls);

var ctx = {
  doc: document,
  cls: cls,
  sid: null,
  bem: bem,
  nonReadyEpisodeBid: null // A bid of current user with is_ready = false (usually - one or none)
};

var last = function() {
  console.log('last func');
};

var afterAuthFlow =
  authHelper.showAuth.bind(ctx,
    vwmHelper.loadNonReadyEpisodeBids.bind(ctx,
      vwmHelper.loadBidInfo.bind(ctx,
        fllHelper.fillBidInfo.bind(ctx, last)
      )
    )
  );

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

var appFlow =
  vwmHelper.waitDocReady.bind(ctx,
    popupHelper.addEvents.bind(ctx,
      authHelper.loadSid.bind(ctx,
        // two flows - auth=yes and auth=no
        authHelper.handleSid.bind(ctx,
          authFlowSelector.bind(ctx)
        ))));

appFlow();
