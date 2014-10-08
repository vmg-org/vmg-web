'use strict';

var ahr = require('../vmg-helpers/app');

exports.getListOfMovieTemplate = function(next) {
  next(null, ['asdfasd']);
};

exports.getMovieTemplateWithEpisodes = function(idOfMovieTemplate, next) {
  var data = {
    id: idOfMovieTemplate,
    name: 'Russian life',
    preview_img_url: './img.png',
    count_of_episodes: 3,
    duration_of_episodes: 15, // or 30
    created: parseInt(new Date().getTime() / 1000),
    finished: parseInt(new Date().getTime() / 1000 + 3600),
    genre_tag: {
      id: 'nature',
      name: 'Nature',
      color: 'green',
      color_scheme: 'Some colors for tag'
    },
    episode_templates: [{
      order_in_movie: 1,
      name: 'Drink a vodka',
      story: [
        'Vasya drinks seven days per week, drinks without a break and have no hopes to save the world',
        'A vodka gives him a magic power, and Vasya stops to drink and starts to dance'
      ],
      count_of_bids: 5, // calc on server side (in cache memory)
      count_of_variants: 25, // calc on server
      conds: 'Russian vodka'
    }, {
      order_in_movie: 2,
      name: 'Play on balalayka',
      story: [
        'Vasya likes computer games. He plays seven days per week and have no hopes to save the world',
        'But he do not know about balalayka'
      ],
      count_of_bids: 5, // calc on server side (in cache memory)
      count_of_variants: 25, // calc on server
      conds: 'Russian vodka and no hopes'
    }, {
      order_in_movie: 3,
      name: 'Fight with a bear',
      story: [
        'Vasya have a bear. They play in chess seven days per week, and have no hopes to save the world',
        'When vodka is over, they starts to fight. Balalayka'
      ],
      count_of_bids: 5, // calc on server side (in cache memory)
      count_of_variants: 25, // calc on server
      conds: 'A bear from Siberia'
    }]
  };

  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  data.duration_of_episodes_str = data.duration_of_episodes + ' seconds';
  data.created_str = ahr.getTimeStr(data.created, 'lll');
  data.finished_str = ahr.getTimeStr(data.finished, 'lll');
  data.genre_tag.style = 'color: ' + data.genre_tag.color;
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });

  next(null, data);
};

module.exports = exports;
