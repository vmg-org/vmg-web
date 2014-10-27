/** 
 * If user is player (if not an owner of a movie template)
 *     Show buttons: upload now, later if not played already
 * @module
 */
'use strict';
var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var episodeBidService = require('../vmg-services/episode-bid');

var handlePostBid = function(next, err, episodeBid) {
  if (err) {
    alert(err.message);
    return;
  }

  next(null, episodeBid);
};

var postBid = function(idOfEpisodeTemplate, next) {
  var dto = {
    id_of_episode_template: idOfEpisodeTemplate,
    media_spec_item: {

    }
  };

  episodeBidService.postItem(dto, handlePostBid.bind(this, next));
};

var afterUploadLater = function() {
  alert('uploaded later');
};

var handleUploadLater = function(idOfEpisodeTemplate) {
  //  alert('later ' + orderInMovie + ' ' + idOfEpisodeTemplate);

  postBid.apply(this, [idOfEpisodeTemplate, afterUploadLater]);
  // generate an empty bid -> 
  //   - reload a page
  //   - redirect to cabinet
};

var afterUploadNow = function() {
  alert('uploaded now');
};

var handleUploadNow = function(idOfEpisodeTemplate) {
  //alert('now ' + orderInMovie + ' ' + idOfEpisodeTemplate);
  // generate an empty bid -> 
  //   - redirect to upload.html?media_spec=123

  postBid.apply(this, [idOfEpisodeTemplate, afterUploadNow]);
};

var eachElemUploadLater = function(elm) {
  var orderInMovie = ahr.toInt(elm.getAttribute('data-order'));
  var idOfEpisodeTemplate = ahr.toInt(elm.getAttribute('data-id'));
  dhr.on(elm, 'click', handleUploadLater.bind(this, idOfEpisodeTemplate, orderInMovie));
};

var eachElemUploadNow = function(elm) {
  var orderInMovie = ahr.toInt(elm.getAttribute('data-order'));
  var idOfEpisodeTemplate = ahr.toInt(elm.getAttribute('data-id'));
  dhr.on(elm, 'click', handleUploadNow.bind(this, idOfEpisodeTemplate, orderInMovie));
};

var fillUserBids = function(next) {
  if (this.nonReadyEpisodeBids.length > 0) {
    dhr.html('.' + this.cls.notif, 'You have a non-uploaded episode already. Please upload a video or cancel it. <a href="./cabinet.html">Go to my cabinet</a>');
    dhr.showElems('.' + this.cls.notif);
    next();
    return;
  }
  // The same - as upper checking
  //  if (this.isUserAlreadyInBids === true) {
  //    next();
  //    return;
  //  }


  var elemsUploadLater = dhr.getElems('.' + this.cls.fncUploadLater); // 'shw-episode__fnc-upload-later',
  var elemsUploadNow = dhr.getElems('.' + this.cls.fncUploadNow); //    fncUploadNow: 'shw-episode__fnc-upload-now'

  ahr.each(elemsUploadLater, eachElemUploadLater.bind(this));
  ahr.each(elemsUploadNow, eachElemUploadNow.bind(this));


  //  if (this.isUserAlreadyInBids === true) {
  //    dhr.disable(elemUploadLater);
  //    dhr.disable(elemUploadNow);
  //  }

  dhr.showElems(elemsUploadLater);
  dhr.showElems(elemsUploadNow);

  next();
};
// One bid per movie template for one user
var handleUserEpisodeBids = function(next, err, episodeBidArr) {
  if (err) {
    dhr.html('.' + this.cls.notif, 'Server error: retrieving users\' bids');
    dhr.showElems('.' + this.cls.notif);
    return;
  }

  this.isUserAlreadyInBids = episodeBidArr.length > 0 ? true : false;

  // attach episode-bids to this.episodeTemplates
  ahr.each(this.episodeTemplates, function(etm) {
    var asdf = ahr.filter(episodeBidArr, function(ebd) {
      return ebd.id_of_episode_template === etm.id;
    });

    etm.episode_bid_arr_user = asdf;
  });

  console.log('episodeBidArr', this.episodeTemplates);

  next();
};

var checkLocalEpisodeBids = function(next) {
  var idOfEpisodeTemplateArr = ahr.map(this.episodeTemplates, function(item) {
    return item.id;
  });

  srv.r1010(idOfEpisodeTemplateArr.join(','), handleUserEpisodeBids.bind(this, next));
};

var handleNonReadyEpisodeBids = function(next, err, episodeBidArr) {
  if (err) {
    dhr.html('.' + this.cls.notif, 'Server error: retrieving users\' bids');
    dhr.showElems('.' + this.cls.notif);
    return;
  }

  this.nonReadyEpisodeBids = episodeBidArr;
  next();
};

var checkNonReadyEpisodeBids = function(next) {
  srv.r1011(handleNonReadyEpisodeBids.bind(this, next));
};

exports.run = function(next) {
  if (this.isUserOwner !== false) {
    next();
    return;
  }

  var playerFlow = checkLocalEpisodeBids.bind(this,
    checkNonReadyEpisodeBids.bind(this,
      fillUserBids.bind(this, next)));

  playerFlow();

  // check: Whether the user plays in episodes already
  // --> id_of_movie_template
  // SELECT * FROM
  // If false
  // show gray buttons
  // else
  // show active buttons
  // player fncs
};

module.exports = exports;
