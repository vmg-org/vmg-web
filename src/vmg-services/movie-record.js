/** @module */
'use strict';

exports.getWelcomeList = function(next) {
  var data = [{
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

  next(null, data);
};

module.exports = exports;
