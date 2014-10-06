// todo #22! js docs
// all API endpoints
// definitions for all data schemes
//var vmgSpec = require('vmg-spec');
//var workspace = require('./workspace');
// Build API from vmgSpec?
//console.log(vmgSpec);

var commonVwjs = require('../vmg-helpers/vwjs.js');
var vwjs = require('./vwjs');
window.app = {};

commonVwjs.run(window.app);
vwjs.run(window.app);
// when project is already loaded
// load a mainObj
// exclude secured data
// try without JQuery
// need to define a path before page is loaded
// if it's a protected page - redirect -> but its actually for static multipage sites

// load list of AuthIssuer
//workspace.init();
