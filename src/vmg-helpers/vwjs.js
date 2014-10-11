/** @module viewjs-helper */

var dhr = require('../vmg-helpers/dom');
var userSessionService = require('../vmg-services/user-session');
var shr = require('../vmg-helpers/shr');
var config = require('../vmg-helpers/config');

exports.run = function(app, bem) {
  app.turnPopup = function(elem, e, popupName) {
    var targetElems = dhr.getElems('.' + popupName);
    if (dhr.isElems(targetElems, ':visible')) {
      dhr.hideElems(targetElems, 'fast');
    } else {
      dhr.showElems(targetElems, 'fast');
    }
  };

  app.hidePopupByEscape = function(elem, e, popupName) {
    if (e.keyCode === 27) {
      dhr.hideElems('.' + popupName, 'fast');
    }
  };

  app.hidePopupIfOut = function(elem, e, popupName) {
    if (e.currentTarget === e.target.parentElement) {
      dhr.hideElems('.' + popupName, 'fast');
    }
  };

  var handleUserSession = function(authNoBlockName, authProfileBlockName, err, r) {
    if (err) {
      alert(err.message);
      return;
    }

    shr.setItem(config.AUTH_STORAGE_KEY, r.id); // set again
    dhr.hideElems('.' + authNoBlockName);
    // hide auth no block // if visible
    // if r with error (sid not found) set visible block
    // apply display_name to the block
    console.log('asdfads', authNoBlockName, authProfileBlockName, err, r);
    dhr.impl(bem, authProfileBlockName, 'social_profile', [{
      display_name: r.social_profile_item.display_name
    }]);

    dhr.showElems('.' + authProfileBlockName);
  };

  window.googAsyncInit = function() {
    console.log('goog is loaded');
    var body = window.document.body;
    var googBtnName = body.getAttribute('data-goog-btn');
    dhr.showElems('.' + googBtnName);
  };

  window.fbAsyncInit = function() {
    window.FB.init({
      appId: config.FB_CLIENT_ID,
      cookie: false, // enable cookies to allow the server to access 
      // the session
      xfbml: true, // parse social plugins on this page
      version: 'v2.1' // use version 2.1
    });

    dhr.showElems('.' + window.document.body.getAttribute('data-fb-btn'));
    // other events
    console.log('fb is loaded');
  };

  app.fireAuth = function() {
    var body = window.document.body;

    var authNoBlockName = body.getAttribute('data-auth-no');
    console.log('authNoBlockName', authNoBlockName);
    var authProfileBlockName = body.getAttribute('data-auth-profile');

    var sid = shr.getItem(config.AUTH_STORAGE_KEY);
    if (!sid) {
      // load Goog lib
      dhr.loadGoogLib('googAsyncInit');
      dhr.loadFbLib(); // fbAsyncInit by default    
      dhr.showElems('.' + authNoBlockName);
    } else {
      console.log('we have sid', sid);
      userSessionService.getUserSession(sid, handleUserSession.bind(null, authNoBlockName, authProfileBlockName));
    }
    // check isAuth in cookies? if no cookie - show buttons for auth if a cookie - send a request to check it and get name
    //  
    // get auth cookie (or from storage)
    // if not exists - show auth buttons
    // if exists
    // send a req to check auth
    // if wrong - show auth buttons
    // else show name, returned from API
    //    dhr.alert('hello world from ' + elem.innerHTML);
  };

  var handleGoogSignIn = function(authNoBlockName, authProfileBlockName, authResult) {
    if (authResult['status']['signed_in']) {
      // http://stackoverflow.com/questions/23020733/google-login-hitting-twice
      if (authResult['status']['method'] === 'PROMPT') {
        userSessionService.postUserSession('goog', authResult.access_token,
          handleUserSession.bind(null, authNoBlockName, authProfileBlockName));
        // send to our server authResult.access_token
        // 
        console.log(authResult);

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
    }
  };

  // When Google lib is already loaded - run SingIn method
  var googSignIn = function(authNoBlockName, authProfileBlockName) {

    if (!window.gapi || !window.gapi.auth) {
      alert('Auth provider error. Try later (few seconds)');
      return;
    }

    //    console.log('gapi', window.gapi);
    console.log('gapiauth', window.gapi.auth);

    window.gapi.auth.signIn({
      clientid: config.GOOG_CLIENT_ID,
      scope: 'profile',
      cookiepolicy: 'none',
      callback: handleGoogSignIn.bind(null, authNoBlockName, authProfileBlockName)
    });
  };

  var handleFbLoginStatus = function(authNoBlockName, authProfileBlockName, response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log(response.authResponse);
      var authResult = response.authResponse;
      userSessionService.postUserSession('fb', authResult.accessToken,
        handleUserSession.bind(null, authNoBlockName, authProfileBlockName));
    } else {
      console.log(response);
      alert(response.status);
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

  var fbSignIn = function(authNoBlockName, authProfileBlockName) {
    console.log('signin');
    window.FB.getLoginStatus(handleFbLoginStatus.bind(null, authNoBlockName, authProfileBlockName));
  };

  //  https://developers.google.com/+/web/signin/javascript-flow
  app.startAuth = function(elem) {
    // todo: #42! disable it for prevent double-click events
    var authType = elem.getAttribute('data-bind');
    var body = window.document.body;
    var authNoBlockName = body.getAttribute('data-auth-no');
    var authProfileBlockName = body.getAttribute('data-auth-profile');
    console.log(authType);

    if (authType === 'goog') {
      googSignIn(authNoBlockName, authProfileBlockName);
    } else if (authType === 'fb') {
      fbSignIn(authNoBlockName, authProfileBlockName);
    }
  };

  app.logout = function() {
    var sid = shr.getItem(config.AUTH_STORAGE_KEY);
    shr.removeItem(config.AUTH_STORAGE_KEY);
    userSessionService.deleteUserSession(sid, function() {
      // no callbask: if err - expired sessions will be removed automatically from db
    });
    window.location.reload();
  };
  // add event during showing element -> if an user is not auth, or after logoff event (one time)
};

module.exports = exports;
