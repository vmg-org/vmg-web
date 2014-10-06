/** @module */
'use strict';

var vwjs = require('../vmg-helpers/vwjs');
//var prvVwjs = require('./vwjs');
var prvJsvw = require('./jsvw');

window.app = {};

window.app.crtScope = {
  genre_of_movie: ''
};

window.app.onSelectGenre = function(elem) {
  console.log('app invoked', elem);
  if (elem.value === 'hero') {
    console.log('hero');
    prvJsvw.showHeroScope();
  } else if (elem.value === 'animal') {
    console.log('animal');
    prvJsvw.showAnimalScope();
  } else {
    prvJsvw.hideHeroScope();
    prvJsvw.hideAnimalScope();
  }

  window.app.crtScope.genre_of_movie = elem.value;
};

window.app.publishTemplate = function(elem) {
  var scope = window.app.crtScope;
  if (!scope.genre_of_movie) {
    alert('Genre is required');
    return false;
  }


  // It might be few buttons with this function
  // Store all fields in every button - extra
  //
  // Every input control - saves his value to some specific place in global namespace. app.crtTemplate
  //
  // this button just check this place!!!!!!!
  //
  //todo: #45! think about jsvw system without direct class names
  //
  // get name of movie ?
  // get names of episodes ?
  // radio button state (genre) ?
  console.log('template is published', elem);
};

window.app.checkInput = function(elem) {
  if (elem.value.length > 50 || elem.value.length < 3) {
    $(elem).addClass('crt-movie-template__inp-name_state_warning');
    // todo #44! show popup with limits
  } else {
    $(elem).removeClass('crt-movie-template__inp-name_state_warning');
    // hide popup
  }
};

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
  //prvVwjs.run();

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
