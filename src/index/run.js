// todo #22! js docs
// all API endpoints
// definitions for all data schemes
//var vmgSpec = require('vmg-spec');
//var workspace = require('./workspace');
// Build API from vmgSpec?
//console.log(vmgSpec);

//var indexBem = require('../../bower_components/vmg-bem/bems/index.bemjson');
var bem = require('../../../vmg-bem/bems/index.bemjson');

var commonVwjs = require('../vmg-helpers/vwjs.js');
var vwjs = require('./vwjs');


window.app = {};

commonVwjs.run(window.app, bem);
vwjs.run(window.app, bem);
// when project is already loaded
// load a mainObj
// exclude secured data
// try without JQuery
// need to define a path before page is loaded
// if it's a protected page - redirect -> but its actually for static multipage sites

// load list of AuthIssuer
//workspace.init();
