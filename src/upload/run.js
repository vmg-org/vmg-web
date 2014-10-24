/**
 * Init
 * @todo: #33! Add notification with upload limits: duration > 15, 30 second, < 1 min
 * @todo: #43! Touch events for mobile devices for drag and drop feature
 */
var bem = require('../../../vmg-bem/bems/upload.bemjson');
var demoBid = require('./demo-bid');
var vwm = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
//var commonVwjs = require('../vmg-helpers/vwjs.js');
//var vwjs = require('./vwjs');

// https://github.com/mailru/FileAPI
window.FileAPI = {
  staticPath: './libs/file-api/',
  cors: true
};

var ctx = {
  doc: document,
  cls: {
    selector: 'upl-selector',
    selectorInput: 'upl-selector__file-input',
    loader: 'upl-loader',
    notif: 'notif-wrap__notif',
    opener: 'upl-selector__file-opener'
  },
  sid: null,
  bem: bem
};

var last = function() {
  console.log('last func');
};

// load a movie details
var qwe = demoBid.run.bind(ctx,
  vwm.waitDocReady.bind(ctx,
    popupHelper.addEvents.bind(ctx,
      authHelper.loadSid.bind(ctx,
        authHelper.buildCls.bind(ctx,
          // two flows - auth=yes and auth=no
          authHelper.handleSid.bind(ctx,
            vwm.attachUploadEvents.bind(ctx,
              vwm.attachSelectorEvents.bind(ctx,
                last
              ))))))));

qwe();
