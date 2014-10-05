/** @module template-editor/vwjs */
'use strict';

var prvJsvw = require('./jsvw');

exports.run = function() {

  $('.movie-genres__checker').on('click', function() {
    if (this.value === 'hero') {
      console.log('hero');
      prvJsvw.showHeroScope();
    } else if (this.value === 'animal') {
      console.log('animal');
      prvJsvw.showAnimalScope();
    } else {
      prvJsvw.hideHeroScope();
      prvJsvw.hideAnimalScope();
    }
  });

  //  var radios = document.getElementsByClassName('movie-genres__checker');
  //
  //  for (var i = 0, length = radios.length; i < length; i += 1) {
  //    if (radios[i].checked) {
  //      // do whatever you want with the checked radio
  //      alert(radios[i].value);
  //
  //      // only one radio can be logically checked, don't check the rest
  //      break;
  //    }
  //  }

  $('.crt-movie-template__inp-name').on('keyup', function() {
    if (this.value.length > 50 || this.value.length < 3) {
      $(this).addClass('crt-movie-template__inp-name_state_warning');
      // todo #44! show popup with limits
    } else {
      $(this).removeClass('crt-movie-template__inp-name_state_warning');
      // hide popup
    }
  });
};

module.exports = exports;
