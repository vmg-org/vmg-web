var vwjs = require('../vmg-helpers/vwjs');

var prvJsvw = require('./jsvw');

var onReady = function() {
  console.log('hello');
  // add all bindings from view to js functions
  vwjs.run();

  var demoData = [{
    author_name: 'Rave',
    comment_text: 'Super video'
  }, {

    author_name: 'Rave',
    comment_text: 'Super video'
  }];

  prvJsvw.fillComments(demoData);

  var movieRecordData = [{
    movie_title: 'Big rabbit',
    movie_description: 'eat a cucumber',
    video_url: './demo.webm'
  }];

  prvJsvw.fillMovieRecord(movieRecordData);
  prvJsvw.fillVideo(movieRecordData);

  var demoData2 = [{
    author_name: 'Other',
    comment_text: 'Super video'
  }, {
    author_name: 'Other',
    comment_text: ' video'
  }];

  setTimeout(function() {
    prvJsvw.addComments(demoData2);
  }, 3000);
};

$(document).ready(onReady);
