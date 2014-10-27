/**
 * Init
 * @todo: #33! Add notification with upload limits: duration > 15, 30 second, < 1 min
 * @todo: #43! Touch events for mobile devices for drag and drop feature
 */
var bem = require('../../../vmg-bem/bems/upload.bemjson');
var vwm = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
var commonCls = require('../common/cls');
var cls = require('./cls');

$.extend(cls, commonCls);

// https://github.com/mailru/FileAPI
window.FileAPI = {
  staticPath: './libs/file-api/',
  cors: true
};

var ctx = {
  doc: document,
  cls: cls,
  sid: null,
  bem: bem,
  idOfMediaSpec: null
};

var last = function() {
  console.log('last func');
};

var afterAuthFlow =
  authHelper.showAuth.bind(ctx,
    vwm.attachUploadEvents.bind(ctx,
      vwm.attachSelectorEvents.bind(ctx, last)));

var authNoFlow =
  authHelper.showNoAuthWarning.bind(ctx,
    authHelper.waitUserLogin.bind(ctx,
      afterAuthFlow
    ));

var authFlowSelector = function() {
  if (this.userSession) {
    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow
    authNoFlow();
  }
};

// load a movie details
var appFlow =
  vwm.loadIdOfMediaSpec.bind(ctx,
    authHelper.loadSid.bind(ctx,
      authHelper.handleSid.bind(ctx,
        vwm.waitDocReady.bind(ctx,
          popupHelper.addEvents.bind(ctx,
            // two flows - auth=yes and auth=no
            authFlowSelector.bind(ctx)
          )))));

appFlow();
