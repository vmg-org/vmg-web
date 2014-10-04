var vwjs = require('../vmg-helpers/vwjs');

var prvJsvw = require('./jsvw');

var onReady = function() {
  console.log('hello');
  // add all bindings from view to js functions
  vwjs.run();

  prvJsvw.fillComments();
};

$(document).ready(onReady);
