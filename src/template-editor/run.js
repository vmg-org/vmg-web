/** @module */
'use strict';

var onReady = function() {
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
