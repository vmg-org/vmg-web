/**
 * Event helper
 * @module
 */
'use strict';
var dhr = require('../vmg-helpers/dom');
var hpr = require('./hpr');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');

var checkBeforeCreate = function() {
  var scope = this.crtScope;
  var lim = this.inpLimit;
  var arrErr = [];
  if (!scope.genre_of_movie) {
    arrErr.push('Genre (type of movie) - required');
  }

  arrErr = arrErr.concat(hpr.propErr(lim.name_of_movie, scope.name_of_movie, 'Movie name'));

  scope.episodes.forEach(function(eps, ind) {
    arrErr = arrErr.concat(hpr.propErr(lim.name_of_episode, eps.name, 'Episode ' + (ind + 1) + ' name'));
    arrErr = arrErr.concat(hpr.propErr(lim.story_of_episode, eps.story, 'Episode ' + (ind + 1) + ' story'));
    arrErr = arrErr.concat(hpr.propErr(lim.conds_of_episode, eps.conds, 'Episode ' + (ind + 1) + ' conditions'));
  });

  return arrErr;
};

var handlePostMovietemplate = function(movieTemplate, err, createdMovieTemplate) {
  if (err) {
    dhr.html('.' + this.cls.notif, err.message || '%=serverError=%');
    dhr.showElems('.' + this.cls.notif);
    return;
  }

  // TODO: #33! redirect to watch a template
  window.location.href = './template.html?t=' + (createdMovieTemplate ? createdMovieTemplate.id : movieTemplate.id);
};

exports.createTemplate = function(elem, e, notifName) {
  var arrErr = checkBeforeCreate.apply(this);

  if (arrErr.length > 0) {
    dhr.html('.' + notifName, arrErr.join('<br>'));
    dhr.showElems('.' + notifName);
    window.scrollTo(0, 0);
    return false;
  }

  var scp = this.crtScope;

  var movieTemplate = {
    name: scp.name_of_movie,
    duration_of_episodes: scp.duration_of_episodes,
    preview_img_url: '',
    movie_genre_item: {
      id_of_genre_tag: scp.genre_of_movie,
      color_schema: 'no schema'
    },
    episode_template_arr: scp.episodes
  };

  var prevMovieTemplate = this.prevMovieTemplate;
  if (prevMovieTemplate) {
    // Edit
    movieTemplate.id = prevMovieTemplate.id;
    ahr.each(movieTemplate.episode_template_arr, function(etm, ind) {
      etm.id = prevMovieTemplate.episode_template_arr[ind].id;
    });
  }

  srv.w2000(movieTemplate, handlePostMovietemplate.bind(this, movieTemplate));

  // It might be few buttons with this function
  // Store all fields in every button - extra
  //
  // Every input control - saves his value to some specific place in global namespace. crtTemplate
  // this button just check this place!!!!!!!
  //    console.log('template is published', elem);
  //  alert('Created! (demo)');
};

exports.onSelectGenre = function(elem, e, heroScopeName, animalScopeName) {
  if (elem.value === 'hero') {
    dhr.showElems('.' + heroScopeName, 'slow');
  } else if (elem.value === 'animal') {
    dhr.showElems('.' + animalScopeName, 'slow');
  } else {
    dhr.hideElems('.' + animalScopeName);
    dhr.hideElems('.' + heroScopeName);
  }

  this.crtScope.genre_of_movie = elem.value;
};

exports.checkInputNameOfTemplate = function(elem, e, targetName) {
  // how to get it?
  // This data stores on model with other props, like name, story
  // a radio button list sends a value to the function (it is like id)
  //    var maxLength = 50;
  //    var minLength = 3;
  //    var required = true;
  //    var rgx = /\w+/g;
  //    var defaultValue = 'Best movie in the world'; // put to default or placeholder
  if (hpr.propErr(this.inpLimit.name_of_movie, elem.value).length > 0) {
    $('.' + targetName).show();
  } else {
    $('.' + targetName).hide();
  }

  this.crtScope.name_of_movie = elem.value;
};

exports.showTipNameOfTemplate = function(elem, e, targetName) {
  $('.' + targetName).show().delay(1500).hide('fast');
};

exports.showTipNameOfEpisode = function(elem, e, targetName) {
  $('.' + targetName + ':eq(' + (parseInt(elem.getAttribute('data-bind')) - 1) + ')').show().delay(1500).hide('fast');
};

exports.showTipStoryOfEpisode = function(elem, e, targetName) {
  $('.' + targetName + ':eq(' + (parseInt(elem.getAttribute('data-bind')) - 1) + ')').show().delay(1500).hide('fast');
};

exports.showTipCondsOfEpisod = function(elem, e, targetName) {
  $('.' + targetName + ':eq(' + (parseInt(elem.getAttribute('data-bind')) - 1) + ')').show().delay(1500).hide('fast');
};

exports.checkInputNameOfEpisode = function(elem, e, helpElemName) {
  var orderNumber = parseInt(elem.getAttribute('data-bind'));
  var helpElems = $('.' + helpElemName + ':eq(' + (orderNumber - 1) + ')');

  if ((elem.value.length > this.inpLimit.name_of_episode.max_length) || (elem.value.length < this.inpLimit.name_of_episode.min_length)) {
    helpElems.show();
  } else {
    helpElems.hide();
  }

  this.crtScope.episodes[orderNumber - 1].name = elem.value;
};

exports.checkInputStoryOfEpisode = function(elem, e, helpElemName) {
  var orderNumber = parseInt(elem.getAttribute('data-bind'));
  var helpElems = $('.' + helpElemName + ':eq(' + (orderNumber - 1) + ')');
  if ((elem.value.length > this.inpLimit.story_of_episode.max_length) || (elem.value.length < this.inpLimit.story_of_episode.min_length)) {
    helpElems.show();
  } else {
    helpElems.hide();
  }

  this.crtScope.episodes[orderNumber - 1].story = elem.value;
};

exports.checkInputCondsOfEpisode = function(elem, e, helpElemName) {
  var orderNumber = parseInt(elem.getAttribute('data-bind'));
  var helpElems = $('.' + helpElemName + ':eq(' + (orderNumber - 1) + ')');
  if ((elem.value.length > this.inpLimit.conds_of_episode.max_length)) {
    helpElems.show();
  } else {
    helpElems.hide();
  }

  this.crtScope.episodes[orderNumber - 1].conds = elem.value;
};

exports.onChangeDurationOfEpisodes = function(elem) {
  this.crtScope.duration_of_episodes = ahr.toInt(elem.options[elem.selectedIndex].value);
};

module.exports = exports;
