// todo #22! js docs
// all API endpoints
// definitions for all data schemes
var vmgSpec = require('vmg-spec');
var workspace = require('./workspace');
// Build API from vmgSpec?
console.log(vmgSpec);

var vwjs = require('../vmg-scripts/vwjs.js');
var jsvw = require('../vmg-scripts/jsvw.js');
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
    name: 'requiem about dream',
    upper_name: 'REQUIEM FOR A DREAM',
    img_preview_url: './css/img/movie-black.png',
    url: './watch.html?v=requiem'
  }, {
    name: 'hard die',
    upper_name: 'DIE HARD',
    img_preview_url: './css/img/movie-black.png',
    url: './watch.html?v=die-hard'
  }, {
    name: 'Hatiko',
    upper_name: 'HATIKO',
    img_preview_url: './css/img/movie-black.png',
    url: './watch.html?v=hatiko'
  }];

  jsvw.fillMovieRecords(demoData);
}

$(document).ready(onReady);
