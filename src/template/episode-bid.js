/** @module */

var srv = require('../vmg-services/srv');
var dhr = require('../vmg-helpers/dom');


var Mdl = function(data, episodeTemplate, ind) {
  this.episodeTemplate = episodeTemplate;
  // todo
  this.prntPlayer = null;
  this.id_of_media_spec = data.id_of_media_spec;
  this.created = data.created;
  this.id_of_episode_template = data.id_of_episode_template;
  this.moder_rating = data.moder_rating;
  this.moder_rating_str = 'superbooper';
  this.media_spec_item = data.media_spec_item;
  this.fileCutArr = null;

  this.fnc_play = 'app.tmpBids[' + ind + '].playVideo(this)';

  this.blockId = 'att-info';
  this.bem = this.episodeTemplate.movieTemplate.root.bem;
  this.blockSchema = dhr.getBlockSchema(this.bem, this.blockId);
};

Mdl.prototype.buildHtml = function() {
  return dhr.htmlBemBlock(this.blockSchema, this);
};

Mdl.prototype.handleLoadFileCut = function(cbkFlow, err, fileCutArr) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }

  this.fileCutArr = fileCutArr;
  //  this.episodeTemplates
  cbkFlow();
  //  console.log('filecutarr', fileCutArr);
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
      type: fileCut.media_file.id_of_container_format
    };
  });

  this.prntPlayer.src(srcArr);
};

Mdl.prototype.playVideo = function(elem) {
  console.log('played vide', elem);

  //  $(elem).hide();

  // load file_cut for this media_spec
  console.log('play', this.id_of_media_spec);
  var flow = this.loadFileCutArr.bind(this, this.fillPlayer);
  flow();
};

exports.init = function(data, episodeTemplate, ind) {
  return new Mdl(data, episodeTemplate, ind);
};

module.exports = exports;
