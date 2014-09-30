// todo #22! js docs
// all API endpoints
// definitions for all data schemes
var vmgSpec = require('vmg-spec');
var workspace = require('./workspace');
var dhr = require('./dom-helper');
//require('../../bower_components/modernizr/modernizr');
// Build API from vmgSpec?
console.log(vmgSpec);

var vwjs = require('./vwjs.js');

// when project is already loaded
// load a mainObj
// exclude secured data
// try without JQuery
function onReady() {
  // add all bindings from view to js functions
  vwjs.run();
  // need to define a path before page is loaded
  // if it's a protected page - redirect -> but its actually for static multipage sites

  // define an url path when whole DOM is ready
  var route = dhr.getRoute();
  console.log(route);

  // load list of AuthIssuer
  workspace.init();

  var googBtnName = 'auth-no__auth-button_social_goog';
  // add event during showing element -> if an user is not auth, or after logoff event (one time)
  dhr.addEvent(googBtnName, 'click', function() {
    dhr.alert('hello');
    console.log(this);
  });
}

onReady();
