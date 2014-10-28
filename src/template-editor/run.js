// todo #33! js docs
//* @todo #44! If a user wants to change order of episodes

var bem = require('../../../vmg-bem/bems/template-editor.bemjson');
var vwmHelper = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');
var fllHelper = require('./fll');

var commonCls = require('../common/cls');
var cls = require('./cls');

$.extend(cls, commonCls);

var ctx = {
  doc: document,
  cls: cls,
  sid: null,
  bem: bem,
  genreTags: null,
  prevMovieTemplate: null,
  prevMovieTemplateErr: null,
  crtScope: {
    name_of_movie: '',
    duration_of_episodes: 15, // by default
    genre_of_movie: '',
    episodes: [{
      name: '',
      story: '',
      conds: '',
      order_in_movie: 1,
      guide_photo_url: ''
    }, {
      name: '',
      story: '',
      conds: '',
      order_in_movie: 2,
      guide_photo_url: ''
    }, {
      name: '',
      story: '',
      conds: '',
      order_in_movie: 3,
      guide_photo_url: ''
    }]
  },
  inpLimit: {
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
  }
};

window.app = ctx;

var last = function() {
  console.log('last func');
};

var afterAuthFlow =
  authHelper.showAuth.bind(ctx,
    vwmHelper.loadGenreTags.bind(ctx,
      vwmHelper.loadTemplateIfEdit.bind(ctx,
        fllHelper.fillPrevMovieTemplate.bind(ctx,
          fllHelper.fillGenreTags.bind(ctx,
            fllHelper.fillEpisodes.bind(ctx,
              fllHelper.showCrtBlocks.bind(ctx,
                last
              )))))));

var authNoFlow =
  authHelper.showNoAuthWarning.bind(ctx,
    authHelper.waitUserLogin.bind(ctx,
      afterAuthFlow
    ));

var authFlowSelector = function() {
  if (this.userSession) {
    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow
    authNoFlow();
  }
};

var appFlow =
  vwmHelper.waitDocReady.bind(ctx,
    popupHelper.addEvents.bind(ctx,
      authHelper.loadSid.bind(ctx,
        // two flows - auth=yes and auth=no
        authHelper.handleSid.bind(ctx,
          authFlowSelector.bind(ctx)
        ))));

appFlow();
//  var demoTemplate = {
//    name: 'Russian life',
//    guide_photo_url: './img.png',
//    count_of_episodes: 3,
//    duration_of_episodes: 15, // or 30
//    episode_templates: [{
//      order_in_movie: 1,
//      name: 'Drink a vodka',
//      story: [
//        'Vasya drinks seven days per week, drinks without a break and have no hopes to save the world',
//        'A vodka gives him a magic power, and Vasya stops to drink and starts to dance'
//      ],
//      condition: 'Russian vodka'
//    }, {
//      order_in_movie: 2,
//      name: 'Play on balalayka',
//      story: [
//        'Vasya likes computer games. He plays seven days per week and have no hopes to save the world',
//        'But he do not know about balalayka'
//      ],
//      condition: 'Russian vodka and no hopes'
//    }, {
//      order_in_movie: 3,
//      name: 'Fight with a bear',
//      story: [
//        'Vasya have a bear. They play in chess seven days per week, and have no hopes to save the world',
//        'When vodka is over, they starts to fight. Balalayka'
//      ],
//      condition: 'A bear from Siberia'
//    }]
//  };
//
//  console.log(demoTemplate);
//};
