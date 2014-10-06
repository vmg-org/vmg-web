/** 
 * @module template-editor/vwjs
 * @todo #44! If a user wants to change order of episodes
 */
'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template-editor.bemjson');

var dhr = require('../vmg-helpers/dom');

exports.run = function(app) {
  app.crtScope = {
    name_of_movie: '',
    genre_of_movie: '',
    episodes: [{
        name: '',
        story: '',
        conditions: ''
      }]
      // todo #31! add others
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

  app.checkInputNameOfTemplate = function(elem) {
    // how to get it?
    // This data stores on model with other props, like name, story
    // a radio button list sends a value to the function (it is like id)
    var maxLength = 50;
    var minLength = 3;
    //    var required = true;
    //    var rgx = /\w+/g;
    //    var defaultValue = 'Best movie in the world'; // put to default or placeholder
    if ((elem.value.length > maxLength) || (elem.value.length < minLength)) {
      // todo #44! show popup with limits
    } else {
      // hide popup
    }

    app.crtScope.name_of_movie = elem.value;
  };

  app.checkInputNameOfEpisode = function(elem, e, helpElemName) {
    var maxLength = 30,
      minLength = 3;


    var orderNumber = parseInt(elem.getAttribute('data-bind'));
    console.log(orderNumber);
    var helpElems = $('.' + helpElemName);
    //var helpElem = $('.' + helpElemName + ':eq(1)');
    console.log('helpElem', helpElems);

    if ((elem.value.length > maxLength) || (elem.value.length < minLength)) {
      helpElems.show();
      // change colors - ? no
      // show ex sign with onhover(onclick) event with hover box with description
      // todo #44! show popup with limits
      // show this sign by default
    } else {
      helpElems.hide();
      // hide this sign (icon)
      // hide popup
    }

    //    app.crtScope.episodes[orderNumber - 1].name = elem.value;
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

  app.loadCrtEpisodes = function(elem, e, targetName) {
    console.log('load episodes', targetName);
    var data = [{
      order: '1',
      name_order: 'First episode',
      ph_name: 'Episode name',
      ph_story: 'Episode story',
      ph_conds: 'Episode conditions'
    }, {
      order: '2',
      name_order: 'Second episode',
      ph_name: 'Episode name',
      ph_story: 'Episode story',
      ph_conds: 'Episode conditions'
    }];

    var mdlName = 'crt_episode';
    dhr.impl(bem, targetName, mdlName, data);
  };
};

module.exports = exports;
