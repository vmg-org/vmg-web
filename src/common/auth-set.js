/**
 * Set of auth-issuers plus addt elems
 * @module
 */

var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var mdlFbIssuer = require('./auth-issuer-fb');
var mdlGoogIssuer = require('./auth-issuer-goog');
var mdlDevIssuer = require('./auth-issuer-dev');

/**
 * Auth set
 * @constructor
 */
var Mdl = function(data){
  this.handleAuthResult = data.handleAuthResult;
  this.zpath = data.zpath;
  
  this.authIssuers = null;
  this.loadAuthIssuers();
  console.log(this.authIssuers);
};

Mdl.prototype.initAuthIssuer = function(item, ind) {
  var mdlIssuer;
  if (item.id === 'fb') {
    mdlIssuer = mdlFbIssuer;
  } else if (item.id === 'goog') {
    mdlIssuer = mdlGoogIssuer;
  } else if (item.id === 'dev') {
    mdlIssuer = mdlDevIssuer;
  } else {
    // nothing
    throw new Error('nosuchissuer');
  }
  var obj = mdlIssuer.init(item, this, this.zpath + '.authIssuers[' + ind + ']', this.handleAuthResult);
  return obj;
};

Mdl.prototype.loadAuthIssuers = function() {

  var issData = [{
    id: 'fb',
    app_id: config.FB_CLIENT_ID,
    icon_key: 'b'
  }, {
    id: 'goog',
    app_id: config.GOOG_CLIENT_ID,
    icon_key: 'c'
  }, {
    id: 'dev',
    app_id: '',
    icon_key: 'i'
  }];

  this.authIssuers = issData.map(this.initAuthIssuer.bind(this));
};

/**
 * Show login choice
 *    now - in a popup window (open a popup with this action)
 */
Mdl.prototype.showLoginChoice = function() {
//  this.authPopWin.showPopup();

  // start load libs for buttons
  // load only once per page: isLoadStarted
  this.authIssuers.forEach(function(issItem) {
    if (!issItem.isLoadStarted) {
      issItem.isLoadStarted = true;
      issItem.loadAuthLib();
    }
  });

  // draw pre or ready buttons
  this.buildAuthButtons();
};

Mdl.prototype.buildAuthButtons = function() {
  var htmlButtons = this.authIssuers.map(function(issItem) {
    return issItem.buildHtml();
  }).join('');

  // authButtons places in auth-popup window
  // but can be moved as separate module on the page
  dhr.html('.' + this.cls.authButtons, htmlButtons);
};

exports.init = function(){
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;

