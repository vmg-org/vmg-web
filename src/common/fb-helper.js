/** @module */

var dhr = require('../vmg-helpers/dom');
var userSessionService = require('../vmg-services/user-session');
var config = require('../config');

var handleFbLoginStatus = function(next, response) {
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    console.log(response.authResponse);
    var authResult = response.authResponse;
    userSessionService.postUserSession('fb', authResult.accessToken, next);
  } else {
    next(new Error(response.status));
    console.log(response);
    //    alert(response.status);
  }
  //    } else if (response.status === 'not_authorized') {
  //      // The person is logged into Facebook, but not your app.
  //      document.getElementById('status').innerHTML = '';
  //      //	    'Please log ' +     'into this app.';
  //    } else {
  //      // The person is not logged into Facebook, so we're not sure if
  //      // they are logged into this app or not.
  //      document.getElementById('status').innerHTML = '';
  //      //'Please log ' + 'into Facebook.';
  //    }
};

var fbSignIn = function(next) {
  console.log('fb signin');
  this.libFb.getLoginStatus(handleFbLoginStatus.bind(this, next));
};

exports.init = function(next) {
  window.FB.init({
    appId: config.FB_CLIENT_ID,
    cookie: false, // enable cookies to allow the server to access 
    // the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.1' // use version 2.1
  });

  this.libFb = window.FB;

  var btn = dhr.getElem('.' + this.authCls.fncFb);
  dhr.off(btn, 'click');
  dhr.on(btn, 'click', fbSignIn.bind(this, next));
  dhr.showElems(btn);
  console.log('fb is loaded');
};

module.exports = exports;
