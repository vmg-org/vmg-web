// all API endpoints
// definitions for all data schemes
var vmgSpec = require('vmg-spec/dst/full');
var workspace = require('./workspace');
// Build API from vmgSpec?
console.log(vmgSpec);

// when project is already loaded
// load a mainObj
// exclude secured data
// try without JQuery
function onReady() {
  // load list of AuthIssuer
  workspace.init();
}

onReady();
