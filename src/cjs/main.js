// todo #22! js docs
// all API endpoints
// definitions for all data schemes
var vmgSpec = require('vmg-spec');
var workspace = require('./workspace');
//require('../../bower_components/modernizr/modernizr');
// Build API from vmgSpec?
console.log(vmgSpec);
var vwjs = require('./vwjs.js');
var jsvw = require('./jsvw.js');
// when project is already loaded
// load a mainObj
// exclude secured data
// try without JQuery
function onReady() {
  // add all bindings from view to js functions
  vwjs.run();
  // need to define a path before page is loaded
  // if it's a protected page - redirect -> but its actually for static multipage sites

  // load list of AuthIssuer
  workspace.init();


  var demoData = [{
    name: 'requiem about dream'
  }, {
    name: 'hard oreshek'
  }, {
    name: 'Hatiko'
  }];

  jsvw.fillMovieRecords(demoData);
}

$(document).ready(onReady);
