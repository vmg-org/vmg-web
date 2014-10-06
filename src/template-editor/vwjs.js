/** @module template-editor/vwjs */
'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template-editor.bemjson');

var dhr = require('../vmg-helpers/dom');

exports.run = function(app) {
  app.crtScope = {
    genre_of_movie: ''
  };

  app.onSelectGenre = function(elem, e, heroScopeName, animalScopeName) {
    console.log('app invoked', elem);
    if (elem.value === 'hero') {
      console.log('hero');
      dhr.showElems('.' + heroScopeName, 'slow');
    } else if (elem.value === 'animal') {
      console.log('animal');
      dhr.showElems('.' + animalScopeName, 'slow');
    } else {
      dhr.hideElems('.' + animalScopeName);
      dhr.hideElems('.' + heroScopeName);
    }

    app.crtScope.genre_of_movie = elem.value;
  };

  app.publishTemplate = function(elem) {
    var scope = app.crtScope;
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

  app.checkInput = function(elem) {
    if (elem.value.length > 50 || elem.value.length < 3) {
      $(elem).addClass('crt-movie-template__inp-name_state_warning');
      // todo #44! show popup with limits
    } else {
      $(elem).removeClass('crt-movie-template__inp-name_state_warning');
      // hide popup
    }
  };

  app.loadGenresOfMovie = function(elem, e, targetName) {

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

    var mdlName = 'movie_template'; // get from data
    dhr.impl(bem, targetName, mdlName, tags);
  };
};

module.exports = exports;
