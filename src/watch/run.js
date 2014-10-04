var vwjs = require('../vmg-helpers/vwjs');

var prvJsvw = require('./jsvw');

var onReady = function() {
  console.log('hello');
  // add all bindings from view to js functions
  vwjs.run();

  var demoData = [{
    author_name: 'Rave',
    comment_text: 'Super video'
  },{
	  
    author_name: 'Rave',
    comment_text: 'Super video'
  }];

  prvJsvw.fillComments(demoData);
};

$(document).ready(onReady);
