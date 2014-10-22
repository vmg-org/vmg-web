/** @module */
'use strict';

var vwmHelper = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template.bemjson');

var ctx = {
  idOfMovieTemplate: 1234,
  doc: document,
  movieTemplate: null,
  cls: {
    movieTemplateScope: 'shw-movie-templates',
    genreTagScope: 'shw-genre-tags',
    episodeTemplateScope: 'shw-episodes'
  },
  sid: null,
  bem: bem
};

var qwe = vwmHelper.loadMovieTemplate.bind(ctx,
  vwmHelper.handleMovieTemplate.bind(ctx,
    vwmHelper.waitDocReady.bind(ctx,
      popupHelper.addEvents.bind(ctx,
        vwmHelper.fillMovieTemplate.bind(ctx,
          authHelper.loadSid.bind(ctx,
            authHelper.buildCls.bind(ctx,
              authHelper.handleSid.bind(ctx,
                // two flows - auth=yes and auth=no
                authHelper.handleUserSession.bind(ctx)
              ))))))));

qwe();
