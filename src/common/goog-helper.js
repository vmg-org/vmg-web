/** @module */

var dhr = require('../vmg-helpers/dom');
var config = require('../config');
var srv = require('../vmg-services/srv');

var handleGoogSignIn = function(next, authResult) {
  if (authResult['status']['signed_in']) {
    // http://stackoverflow.com/questions/23020733/google-login-hitting-twice
    if (authResult['status']['method'] === 'PROMPT') {

      srv.w2001({
        id_of_auth_issuer: 'goog',
        social_token: authResult.access_token
      }, next);
      // send to our server authResult.access_token
      // 
      console.log('authResult', authResult);
    }

    // send to our server
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    //      $('.logon-wrap').hide();
    //    $('.logoff-wrap').show();
    //  $('#status').html('Welcome');
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
    next(new Error(authResult.error));
  }
};

//  https://developers.google.com/+/web/signin/javascript-flow
// When Google lib is already loaded - run SingIn method
var googSignIn = function(next) {
  console.log('goog signin');
  //    console.log('gapi', window.gapi);
  // console.log('gapiauth', window.gapi.auth);

  this.libGoog.auth.signIn({
    clientid: config.GOOG_CLIENT_ID,
    scope: 'profile',
    cookiepolicy: 'none',
    callback: handleGoogSignIn.bind(this, next)
  });
};

exports.init = function(next) {
  if (!window.gapi || !window.gapi.auth) {
    alert('Auth provider error. Try later (few seconds)');
    return;
  }
  this.libGoog = window.gapi;
  var btn = dhr.getElem('.' + this.cls.fncGoog);
  dhr.off(btn, 'click');
  dhr.on(btn, 'click', googSignIn.bind(this, next));
  dhr.showElems(btn);
  console.log('goog is loaded');
};

module.exports = exports;
