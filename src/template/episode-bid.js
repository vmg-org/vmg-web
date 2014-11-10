/** @module */

var hbrs = require('../vmg-helpers/hbrs');
var srv = require('../vmg-services/srv');
var mdlMediaSpec = require('./media-spec');
var mdlBidCheck = require('./bid-check');

var Mdl = function(data, episodeTemplate, ind) {
  this.episodeTemplate = episodeTemplate;
  this.zpath = this.episodeTemplate.zpath + '.episodeBids[' + ind + ']';
  // todo
  this.prntPlayer = null;
  this.id_of_media_spec = data.id_of_media_spec;
  this.created = data.created;
  this.id_of_episode_template = data.id_of_episode_template;
  this.moder_rating = data.moder_rating;
  this.fileCutArr = null;

  if (data.bid_check_item) {
    this.bidCheck = mdlBidCheck.init(data.bid_check_item, this);
  } else {
    this.bidCheck = null;
  }

  this.media_spec_item = mdlMediaSpec.init(data.media_spec_item, this);
  this.root = this.episodeTemplate.movieTemplate.root;
  this.markup0 = hbrs.compile(this.root.markups.attInfo0);
  this.markupDeclined = hbrs.compile(this.root.markups.attInfo1);
  this.markupApproved = hbrs.compile(this.root.markups.attInfo2);
  this.markup4 = hbrs.compile(this.root.markups.attInfo4);

  this.calcProps();
};

// after init or changing
Mdl.prototype.calcProps = function() {
  if (this.bidCheck) {
    if (this.bidCheck.is_approved === true) {
      this.moder_rating_str = 'Accepted';
    } else if (this.bidCheck.is_approved === false) {
      this.moder_rating_str = 'Rejected';
    }
  } else {
    var rates = {
      0: 'Not rated',
      4: 'Best'
    };

    this.moder_rating_str = rates[this.moder_rating];
  }

  this.fnc_play = this.zpath + '.playVideo(this)';
  this.fnc_rate_good = this.zpath + '.rateGood(this);';
  this.fnc_rate_bad = this.zpath + '.rateBad(this);';
  this.fnc_rate_best = this.zpath + '.rateBest(this);';
  this.fnc_rate_none = this.zpath + '.rateNone(this);';
};

Mdl.prototype.buildHtml = function() {
  if (this.moder_rating === 4) {
    return this['markup' + this.moder_rating](this);
  }

  if (this.bidCheck) {
    if (this.bidCheck.is_approved === true) {
      return this.markupApproved(this);
    }
    if (this.bidCheck.is_approved === false) {
      return this.markupDeclined(this);
    }
  }

  return this.markup0(this);
};

Mdl.prototype.handleLoadFileCut = function(cbkFlow, err, fileCutArr) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }

  this.fileCutArr = fileCutArr;
  cbkFlow();
};

Mdl.prototype.loadFileCutArr = function(cbkFlow) {
  srv.r1004(this.id_of_media_spec, this.handleLoadFileCut.bind(this, cbkFlow));
};

Mdl.prototype.fillPlayer = function() {
  //  var mediaFile = this.fileCutArr[0].media_file_item; // only one at this moment
  //  mediaFile.play():
  // send all media file with all formats to the player as arr
  var srcArr = this.fileCutArr.map(function(fileCut) {
    return {
      src: fileCut.media_file_item.url,
      type: fileCut.media_file_item.id_of_container_format
    };
  });

  this.episodeTemplate.vjs.src(srcArr);
  console.log('srcArr', srcArr);
};

Mdl.prototype.playVideo = function() {
  //  $(elem).hide();

  // load file_cut for this media_spec
  console.log('play', this.id_of_media_spec);
  var flow = this.loadFileCutArr.bind(this, this.fillPlayer.bind(this));
  flow();
};

Mdl.prototype.toDto = function() {
  return {
    id_of_media_spec: this.id_of_media_spec,
    id_of_episode_template: this.id_of_episode_template,
    created: this.created,
    moder_rating: this.moder_rating
  };
};

Mdl.prototype.handleChanging = function(err, data) {
  console.log('changed', err, data);
  this.calcProps();
  this.episodeTemplate.fillBids();
};

Mdl.prototype.changeRating = function(ratingVal) {
  this.moder_rating = ratingVal;
  srv.w2006(this.toDto(), this.handleChanging.bind(this));
  //  console.log(this.buildHtml());
};

Mdl.prototype.rateNone = function() {
  this.addBidCheck(null);
};

Mdl.prototype.handleAddBidCheck = function(err, data) {
  if (err) {
    return alert(err.message || 'server error');
  }

  if (!data) {
    console.log('bid check - removed');
    this.bidCheck = null;
  } else {
    this.bidCheck = mdlBidCheck.init(data, this);
  }
  this.calcProps();
  this.episodeTemplate.fillBids();
};

Mdl.prototype.addBidCheck = function(isApproved) {
  var bidCheck = {
    id_of_media_spec: this.id_of_media_spec,
    is_approved: isApproved,
    description: ''
  };

  srv.w2007(bidCheck, this.handleAddBidCheck.bind(this));
};

Mdl.prototype.rateGood = function() {
  this.addBidCheck(true);
};

Mdl.prototype.rateBad = function() {
  this.addBidCheck(false);
};

Mdl.prototype.rateBest = function() {
  // check other states - it is client logic - to one best
  if (this.episodeTemplate.isBestBidExists()) {
    alert('Best bid exists already');
    return;
  }
  // TODO: #33! hide other BEST buttons | or show notif, when clicked by its
  this.changeRating(4);
};

exports.init = function(data, episodeTemplate, ind) {
  return new Mdl(data, episodeTemplate, ind);
};

module.exports = exports;
