/** @module */

/**
 * Get this tags from db (imitation)
 */
exports.run = function(next) {

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

  next(null, tags);
};

module.exports = exports;
