/** @module */

var srv = require('../vmg-services/srv');
var dhr = require('../vmg-helpers/dom');
var mdlMediaSpec = require('./media-spec');
var ahr = require('../vmg-helpers/app');
var hbrs = require('../vmg-helpers/hbrs');

var Mdl = function(data, episodeTemplate, ind) {
  this.episodeTemplate = episodeTemplate;
  this.zpath = this.episodeTemplate.zpath + '.episodeBids[' + ind + ']';
  // todo
  this.prntPlayer = null;
  this.id_of_media_spec = data.id_of_media_spec;
  this.created = data.created;
  this.id_of_episode_template = data.id_of_episode_template;
  this.moder_rating = data.moder_rating;
  this.moder_rating_str = 'Rating: ' + this.moder_rating;
  this.fileCutArr = null;

  this.fnc_play = this.zpath + '.playVideo(this)';
  this.fnc_rate_good = this.zpath + '.rateGood(this);';
  this.fnc_rate_bad = this.zpath + '.rateBad(this);';
  this.fnc_rate_best = this.zpath + '.rateBest(this);';
  this.media_spec_item = mdlMediaSpec.init(data.media_spec_item, this);
  this.root = this.episodeTemplate.movieTemplate.root;
  this.blockId = this.root.cls.attInfo;

  this.blockSchema = dhr.getBlockSchema(this.root.bem, this.blockId);

  // TODO: #23! copy from bem, instead json
  this.markup = hbrs.compile('<div class="att-info-0"><img class="att-info-0__preview" onclick="{{fnc_play}}" src="{{media_spec_item.preview_img_url}}"/><span class="att-info-0__moder-rating">{{moder_rating_str}}</span><button class="att-info-0__fnc-good">Accept</button><button class="att-info-0__fnc-bad">Reject</button><button class="att-info-0__fnc-best">Best</button></div>');
};

Mdl.prototype.buildHtml = function() {
  return this.markup(this);
  //  return ahr.hbrs(this.markup, this);
  //  return dhr.htmlBemBlock(this.blockSchema, this);
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

Mdl.prototype.rateGood = function() {
  alert('under construction');
};
Mdl.prototype.rateBad = function() {
  alert('under construction');
};
Mdl.prototype.rateBest = function() {
  alert('under construction');
};

exports.init = function(data, episodeTemplate, ind) {
  return new Mdl(data, episodeTemplate, ind);
};

module.exports = exports;
