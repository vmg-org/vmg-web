/** @module */
'use strict';

var vwjs = require('../vmg-helpers/vwjs');
var prvVwjs = require('./vwjs');
var prvJsvw = require('./jsvw');

var onReady = function() {
  vwjs.run();

  var tags = [{
    genre_id: 'nature',
    genre_name: 'Nature',
    genre_color: 'green',
    genre_icon_style: 'color: green'
  }, {
    genre_id: 'hero',
    genre_name: 'Hero',
    genre_color: 'red',
    genre_icon_style: 'color: red'
  }, {
    genre_id: 'city',
    genre_name: 'City',
    genre_color: 'gray',
    genre_icon_style: 'color: brown'
  }, {
    genre_id: 'animal',
    genre_name: 'Animals',
    genre_color: 'yellow',
    genre_icon_style: 'color: yellow'
  }, {
    genre_id: 'hollywood',
    genre_name: 'Hollywood',
    genre_color: 'purple',
    genre_icon_style: 'color: purple'
  }];

  prvJsvw.fillTags(tags);

  // set events for tags after filling tags
  prvVwjs.run();

  var demoTemplate = {
    name: 'Russian life',
    guide_photo_url: './img.png',
    count_of_episodes: 3,
    duration_of_episodes: 15, // or 30
    episode_templates: [{
      order_in_movie: 1,
      name: 'Drink a vodka',
      story: [
        'Vasya drinks seven days per week, drinks without a break and have no hopes to save the world',
        'A vodka gives him a magic power, and Vasya stops to drink and starts to dance'
      ],
      condition: 'Russian vodka'
    }, {
      order_in_movie: 2,
      name: 'Play on balalayka',
      story: [
        'Vasya likes computer games. He plays seven days per week and have no hopes to save the world',
        'But he do not know about balalayka'
      ],
      condition: 'Russian vodka and no hopes'
    }, {
      order_in_movie: 3,
      name: 'Fight with a bear',
      story: [
        'Vasya have a bear. They play in chess seven days per week, and have no hopes to save the world',
        'When vodka is over, they starts to fight. Balalayka'
      ],
      condition: 'A bear from Siberia'
    }]
  };

  console.log(demoTemplate);
};

$(document).ready(onReady);
