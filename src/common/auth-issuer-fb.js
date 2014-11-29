/** 
 * FB Oauth
 *   https://developers.facebook.com/docs/facebook-login/login-flow-for-web/v2.2
 *   Asking for Permissions
 *   One of the most important parts of launching the Login Dialog is choosing what data your app would like access to. These examples have all used the scope parameter, which is how you ask for access to someone's data. These are all called Permissions.
 *   Permissions are covered in depth in our permissions guide. However, there are a few things to remember when dealing with permissions and the login dialog:
 *  You ask for permissions when the dialog is created. The resulting set of permissions is tied to the access token that's returned.
 * Other platforms may have a different set of permissions. For example, on iOS you can ask for places a person's been tagged, while in the web version of your app that permission is not required for the experience.
 *  You can add permissions later when you need more capabilities. When you need a new permission, you simply add the permission you need to the list you've already granted, re-launch the Login Dialog and it will ask for the new permission.
 *  The Login Dialog lets people decline to share certain permissions with your app that you ask for. Your app should handle this case. Learn more about this in our permissions dialog.
 *  Apps that ask for more than public_profile, email and user_friends must be reviewed by Facebook before they can be made available to the general public. Learn more in our documentation for login review and our general review guidelines.
 * @module
 */

var mdlAuthIssuer = require('./auth-issuer');
var dhr = require('../vmg-helpers/dom');

/**
 * Auth issuer for FB
 * @constructor
 * @augments module:common/auth-issuer~Mdl
 */
var Mdl = function() {
  mdlAuthIssuer.inhProps(this, arguments);
};

mdlAuthIssuer.inhMethods(Mdl);

/**
 * If an user is not logged on a provider
 *    https://developers.facebook.com/docs/reference/javascript/FB.login/v2.2
 */
Mdl.prototype.handleLogin = function(response) {
  console.log(response);
  if (response.status === 'connected') {
    this.social_token = response.authResponse.accessToken;
    this.postLoginToApi();
  } else {
    alert('Error during authentication');
  }
};

/**
 * Handle login status
 *    this = workspace
 */
Mdl.prototype.handleLoginStatus = function(response) {

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    console.log(response.authResponse);
    var authResult = response.authResponse;
    this.social_token = authResult.accessToken;
  } else if (response.status === 'unknown') {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    //'Please log ' + 'into Facebook.';
    //    this.authLib.login(this.handleLogin.bind(this));
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    //	    'Please log ' +     'into this app.';
  } else {
    // OR simply not activate this button
    console.log('FB auth error: ', response.status);
    return;
  }
  this.activate();
};

/**
 * Start FB auth
 */
Mdl.prototype.startAuth = function(elem) {
  dhr.disable(elem);  
  if (this.social_token) {
    this.postLoginToApi();
  } else {
    //required a click event (block popup window - if not a click)
    this.authLib.login(this.handleLogin.bind(this));
  }
};

// https://developers.facebook.com/docs/javascript/reference/FB.init/v2.2
/**
 * Set event to the button to login with FB
 *    1. Check login status:
 *    1.1 If auth-ed: add PostSession to the button
 *    1.2 If unknown (not in FB) or other: add Login event to the button
 */
Mdl.prototype.handleAuthLib = function() {
  window.FB.init({
    appId: this.app_id, // FB_CLIENT_ID, // config.FB_CLIENT_ID,
    cookie: false, // enable cookies to allow the server to access the session
    xfbml: false, // http://www.tutorialarena.com/blog/what-is-xfbml.php
    status: false,
    version: 'v2.2' // use version 2.2
  });

  this.authLib = window.FB;
  this.authLib.getLoginStatus(this.handleLoginStatus.bind(this));
};

/**
 * Load a lib: async query - build scripts
 */
Mdl.prototype.loadAuthLib = function() {
  window.fbAsyncInit = this.handleAuthLib.bind(this);
  dhr.loadFbLib(); // fbAsyncInit by default    ;
};

/**
 * Creates an obj
 */
exports.init = function() {
  // add methods
  var obj = Object.create(Mdl.prototype);
  // add props
  Mdl.apply(obj, arguments);
  // return created object
  return obj;
};

module.exports = exports;
