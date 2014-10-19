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
      conds: ''
    }, {
      name: '',
      story: '',
      conds: ''
    }, {
      name: '',
      story: '',
      conds: ''
    }]
  };

  var inpLimit = {
    name_of_movie: {
      max_length: 50,
      min_length: 3,
      required: true
    },
    name_of_episode: {
      max_length: 100,
      min_length: 5,
      required: true
    },
    story_of_episode: {
      max_length: 400,
      min_length: 100,
      required: true
    },
    conds_of_episode: {
      max_length: 100
    }
  };


  app.onSelectGenre = function(elem, e, heroScopeName, animalScopeName) {
    if (elem.value === 'hero') {
      dhr.showElems('.' + heroScopeName, 'slow');
    } else if (elem.value === 'animal') {
      dhr.showElems('.' + animalScopeName, 'slow');
    } else {
      dhr.hideElems('.' + animalScopeName);
      dhr.hideElems('.' + heroScopeName);
    }

    app.crtScope.genre_of_movie = elem.value;
  };

  app.createTemplate = function(elem, e, notifName) {
    var scope = app.crtScope;

    var arrErr = [];
    if (!scope.genre_of_movie) {
      arrErr.push('Genre (type of movie) - required');
    }

    arrErr = arrErr.concat(propErr(inpLimit.name_of_movie, scope.name_of_movie, 'Movie name'));

    scope.episodes.forEach(function(eps, ind) {
      arrErr = arrErr.concat(propErr(inpLimit.name_of_episode, eps.name, 'Episode ' + (ind + 1) + ' name'));
      arrErr = arrErr.concat(propErr(inpLimit.story_of_episode, eps.story, 'Episode ' + (ind + 1) + ' story'));
      arrErr = arrErr.concat(propErr(inpLimit.conds_of_episode, eps.conds, 'Episode ' + (ind + 1) + ' conditions'));
    });


    if (arrErr.length > 0) {
      $('.' + notifName).html(arrErr.join('<br>')).show();
      window.scrollTo(0, 0);
      return false;
    }
    // app.crtScope = {
    //   name_of_movie: '',
    //   genre_of_movie: '',
    //   episodes: [{
    //     name: '',
    //     story: '',
    //     conds: ''
    //   }, {
    //     name: '',
    //     story: '',
    //     conds: ''
    //   }, {
    //     name: '',
    //     story: '',
    //     conds: ''
    //   }]
    // };

    // It might be few buttons with this function
    // Store all fields in every button - extra
    //
    // Every input control - saves his value to some specific place in global namespace. app.crtTemplate
    // this button just check this place!!!!!!!
    //    console.log('template is published', elem);
    alert('Created! (demo)');
  };

  var propErr = function(lim, value, propName) {
    var arrErr = [];
    if (lim.max_length) {
      if (value.length > lim.max_length) {
        arrErr.push(propName + ' - max length: ' + lim.max_length);
      }
    }

    if (lim.min_length) {
      if (value.length < lim.min_length) {
        arrErr.push(propName + ' - min length: ' + lim.min_length);
      }
    }

    if (lim.required) {
      if (!value) {
        arrErr.push(propName + ' - required');
      }
    }

    return arrErr;
  };

  app.checkInputNameOfTemplate = function(elem, e, targetName) {
    // how to get it?
    // This data stores on model with other props, like name, story
    // a radio button list sends a value to the function (it is like id)
    //    var maxLength = 50;
    //    var minLength = 3;
    //    var required = true;
    //    var rgx = /\w+/g;
    //    var defaultValue = 'Best movie in the world'; // put to default or placeholder
    if (propErr(inpLimit.name_of_movie, elem.value).length > 0) {
      $('.' + targetName).show();
    } else {
      $('.' + targetName).hide();
    }

    app.crtScope.name_of_movie = elem.value;
  };

  app.showTipNameOfTemplate = function(elem, e, targetName) {
    $('.' + targetName).show().delay(1500).hide('fast');
  };

  app.showTipNameOfEpisode = function(elem, e, targetName) {
    $('.' + targetName + ':eq(' + (parseInt(elem.getAttribute('data-bind')) - 1) + ')').show().delay(1500).hide('fast');
  };

  app.showTipStoryOfEpisode = function(elem, e, targetName) {
    $('.' + targetName + ':eq(' + (parseInt(elem.getAttribute('data-bind')) - 1) + ')').show().delay(1500).hide('fast');
  };

  app.showTipCondsOfEpisode = function(elem, e, targetName) {
    $('.' + targetName + ':eq(' + (parseInt(elem.getAttribute('data-bind')) - 1) + ')').show().delay(1500).hide('fast');
  };

  app.checkInputNameOfEpisode = function(elem, e, helpElemName) {
    var orderNumber = parseInt(elem.getAttribute('data-bind'));
    var helpElems = $('.' + helpElemName + ':eq(' + (orderNumber - 1) + ')');

    if ((elem.value.length > inpLimit.name_of_episode.max_length) || (elem.value.length < inpLimit.name_of_episode.min_length)) {
      helpElems.show();
    } else {
      helpElems.hide();
    }

    app.crtScope.episodes[orderNumber - 1].name = elem.value;
  };

  app.checkInputStoryOfEpisode = function(elem, e, helpElemName) {
    var orderNumber = parseInt(elem.getAttribute('data-bind'));
    var helpElems = $('.' + helpElemName + ':eq(' + (orderNumber - 1) + ')');
    if ((elem.value.length > inpLimit.story_of_episode.max_length) || (elem.value.length < inpLimit.story_of_episode.min_length)) {
      helpElems.show();
    } else {
      helpElems.hide();
    }

    app.crtScope.episodes[orderNumber - 1].story = elem.value;
  };

  app.checkInputCondsOfEpisode = function(elem, e, helpElemName) {
    var orderNumber = parseInt(elem.getAttribute('data-bind'));
    var helpElems = $('.' + helpElemName + ':eq(' + (orderNumber - 1) + ')');
    if ((elem.value.length > inpLimit.conds_of_episode.max_length)) {
      helpElems.show();
    } else {
      helpElems.hide();
    }

    app.crtScope.episodes[orderNumber - 1].conds = elem.value;
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

  var constructTip = function(limitKey) {
    var a = inpLimit[limitKey];

    var arrStr = [];

    if (a.max_length) {
      arrStr.push('Max length: ' + a.max_length);
    }
    if (a.min_length) {
      arrStr.push('Min length: ' + a.min_length);
    }

    if (a.required) {
      arrStr.push('Required field');
    }

    return arrStr.join('<br>');
  };

  app.loadCrtEpisodes = function(elem, e, targetName) {
    // for these items all props can be different
    var data = [{
      order: '1',
      name_order: 'First episode',
      ph_name: 'Episode name',
      ph_story: 'Episode story',
      ph_conds: 'Episode conditions',
      tooltip_name: constructTip('name_of_episode'),
      tooltip_story: constructTip('story_of_episode'),
      tooltip_conds: constructTip('conds_of_episode')
    }, {
      order: '2',
      name_order: 'Second episode',
      ph_name: 'Episode name',
      ph_story: 'Episode story',
      ph_conds: 'Episode conditions',
      tooltip_name: constructTip('name_of_episode'),
      tooltip_story: constructTip('story_of_episode'),
      tooltip_conds: constructTip('conds_of_episode')
    }, {
      order: '3',
      name_order: 'Third episode',
      ph_name: 'Episode name',
      ph_story: 'Episode story',
      ph_conds: 'Episode conditions',
      tooltip_name: constructTip('name_of_episode'),
      tooltip_story: constructTip('story_of_episode'),
      tooltip_conds: constructTip('conds_of_episode')
    }];

    var mdlName = 'crt_episode';
    dhr.impl(bem, targetName, mdlName, data);
  };
};

module.exports = exports;
