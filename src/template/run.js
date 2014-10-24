/** @module */
'use strict';

var vwmHelper = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
var bem = require('../../../vmg-bem/bems/template.bemjson');

var ctx = {
  doc: document,
  idOfMovieTemplate: null,
  movieTemplate: null,
  cls: {
    movieTemplateScope: 'shw-movie-templates',
    genreTagScope: 'shw-genre-tags',
    episodeTemplateScope: 'shw-episodes'
  },
  sid: null,
  bem: bem
};

var last = function() {
  console.log('last func');
};

var qwe = vwmHelper.loadIdOfMovieTemplate.bind(ctx,
  vwmHelper.loadMovieTemplate.bind(ctx,
    vwmHelper.handleMovieTemplate.bind(ctx,
      vwmHelper.waitDocReady.bind(ctx,
        popupHelper.addEvents.bind(ctx,
          vwmHelper.fillMovieTemplate.bind(ctx,
            authHelper.loadSid.bind(ctx,
              authHelper.buildCls.bind(ctx,
                // two flows - auth=yes and auth=no
                authHelper.handleSid.bind(ctx,
                  last
                )))))))));

qwe();
