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

var srv = require('../vmg-services/srv');
var mdlAuthIssuer = require('./auth-issuer');
//var config = require('../config');
var dhr = require('../vmg-helpers/dom');

/**
 * Inherited from auth-issuer
 */
var Mdl = function(dto, root, zpath) {
  mdlAuthIssuer.inhProps(this, [dto, root, zpath]);


};

mdlAuthIssuer.inhMethods(Mdl);


// https://developers.facebook.com/docs/reference/javascript/FB.login/v2.2
Mdl.prototype.handleLogin = function(response) {
  console.log(response);
  if (response.authResponse) {
    alert('welcome');
  } else {
    alert('error');
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
    srv.w2001({
      id_of_auth_issuer: 'fb',
      social_token: authResult.accessToken
    }, this.root.afterLogin.bind(this.root));
  } else if (response.status === 'unknown') {
    this.authLib.login(this.handleLogin.bind(this));
  } else {
    this.root.afterLogin(new Error(response.status));
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

Mdl.prototype.startAuth = function() {
  console.log('fb signin');
  this.authLib.getLoginStatus(this.handleLoginStatus.bind(this));
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

  this.activate();
};

/**
 * Load a lib: async query - build scripts
 */
Mdl.prototype.loadAuthLib = function() {
  window.fbAsyncInit = this.handleAuthLib.bind(this);
  dhr.loadFbLib(); // fbAsyncInit by default    ;
};

exports.init = function(dto, root, zpath) {
  return new Mdl(dto, root, zpath);
};

module.exports = exports;
