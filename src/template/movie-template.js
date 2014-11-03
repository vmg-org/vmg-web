/** @module */
'use strict';

var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var lgr = require('../vmg-helpers/lgr');
var mdlEpisodeTemplate = require('./episode-template');
var mdlMovieGenre = require('./movie-genre');
var dhr = require('../vmg-helpers/dom');
var hbrs = require('../vmg-helpers/hbrs');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data, root) {
  this.root = root;

  this.zpath = this.root.zpath + '.movieTemplate';
  Object.keys(data).forEach(mapKeys.bind(this, data));
  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  this.duration_of_episodes_str = this.duration_of_episodes + ' seconds';
  this.created_str = ahr.getTimeStr(this.created, 'lll');
  this.finished_str = ahr.getTimeStr(this.finished, 'lll');
  // as solution: no genre in a movie. But in most cases - it is exists

  this.isUserOwner = null; // true or false only for auth users

  this.fnc_move_to_edit = this.zpath + '.moveToEdit()';
  this.fnc_prolong = this.zpath + '.prolong()';
  this.fnc_remove = this.zpath + '.remove()';
  this.fnc_merge_best = this.zpath + '.mergeBest()';
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });
  if (this.movie_genre_item) {
    this.movie_genre_item = mdlMovieGenre.init(this.movie_genre_item, this);
  }
  this.markupUsual = hbrs.compile(this.root.markups.shwMovieUsual);
  this.markupAuthor = hbrs.compile(this.root.markups.shwMovieAuthor);
};

Mdl.prototype.buildHtml = function() {
  if (this.isUserOwner) {
    return this.markupAuthor(this);
  } else {
    return this.markupUsual(this);
  }
};

Mdl.prototype.mapEpisodeTemplate = function(etm, ind) {
  return mdlEpisodeTemplate.init(etm, this, ind);
};

Mdl.prototype.handleEpisodeTemplates = function(next, err, arrEtm) {
  if (err) {
    this.episodeTemplatesErr = err;
    next();
    lgr.error(err, {
      fnc: 'handleEpisodeTemplates'
    });
    return;
  }

  // addt fields for Template view
  //  ahr.each(arrEtm, function(item) {
  //    item.episode_bid_count_non_ready = ahr.toInt(item.episode_bid_count) - ahr.toInt(item.episode_bid_count_ready);
  //  });

  this.episodeTemplates = arrEtm.map(this.mapEpisodeTemplate.bind(this)); // arrEtm;
  next();
};

Mdl.prototype.loadEpisodeTemplates = function(cbkFlow) {
  srv.r1009(this.id, this.handleEpisodeTemplates.bind(this, cbkFlow));
};


Mdl.prototype.fillEpisodeTemplates = function(next) {
  if (this.episodeTemplatesErr) {
    dhr.setError('.' + this.root.cls.episodeTemplateScope);
    next();
    return;
  }

  var arrHtml = this.episodeTemplates.map(function(etmItem) {
    return etmItem.buildHtml();
  });

  dhr.html('.' + this.root.cls.episodeTemplateScope, arrHtml.join(''));

  this.episodeTemplates.forEach(function(etm) {
    etm.buildEtmPlayer();
  });

  // take this, only if uploaded files exists: potentially - update bids dynamically - init players here
  next();
  return;
};

Mdl.prototype.fillMovieInfo = function() {
  dhr.html('.' + this.root.cls.movieTemplateScope, this.buildHtml());
};

Mdl.prototype.fillMovieTemplate = function(next) {
  this.fillMovieInfo();


  // if genre exists - show this block
  if (this.movie_genre_item) {
    dhr.html('.' + this.root.cls.movieGenreScope, this.movie_genre_item.buildHtml());
    dhr.showElems('.' + this.root.cls.movieGenreScope);
  }

  var flow = this.loadEpisodeTemplates.bind(this,
    this.fillEpisodeTemplates.bind(this, next));
  flow();
};

Mdl.prototype.moveToEdit = function() {
  // show notif - you cannot change if there are bids
  //
  var isBidsExist = false;

  // addt fields for Template view
  ahr.each(this.episodeTemplates, function(item) {
    if (ahr.toInt(item.episode_bid_count) > 0) {
      isBidsExist = true;
    }
  });

  if (isBidsExist === true) {
    alert('There are bids in the template already. An edit function is not allowed');
    return;
  } else {
    window.location.href = './template-editor.html?t=' + this.id;
  }
};

Mdl.prototype.prolong = function() {
  alert('under construction');
};

Mdl.prototype.remove = function() {
  alert('under construction');
};
Mdl.prototype.mergeBest = function() {
  // - check all best videos? - load all bids? -it is not necessary (check on a server)
  // - send a command POST: job_merge
  // - check this job by some interval
  // - 
  alert('under construction');
};

// One bid per movie template for one user
Mdl.prototype.handleUserEpisodeBids = function(next, err, episodeBidArr) {
  if (err) {
    dhr.html('.' + this.root.cls.notif, 'Server error: retrieving users\' bids');
    dhr.showElems('.' + this.root.cls.notif);
    return;
  }

  this.root.isUserAlreadyInBids = episodeBidArr.length > 0 ? true : false;

  // attach episode-bids to this.episodeTemplates
  ahr.each(this.episodeTemplates, function(etm) {
    var asdf = ahr.filter(episodeBidArr, function(ebd) {
      return ebd.id_of_episode_template === etm.id;
    });

    etm.episode_bid_arr_user = asdf;
  });

  //  console.log('episodeBidArr', this.episodeTemplates);

  next();
};

Mdl.prototype.checkLocalEpisodeBids = function(next) {
  var idOfEpisodeTemplateArr = ahr.map(this.episodeTemplates, function(item) {
    return item.id;
  });

  srv.r1010(idOfEpisodeTemplateArr.join(','), this.handleUserEpisodeBids.bind(this, next));
};

// Whether the user is owner of movie?
Mdl.prototype.handleUserRights = function(next) {
  if (this.root.userSession) {
    console.log('authenticated');
    if (this.movie_creator_item) {
      console.log('movie has owner');
      if (this.root.userSession.social_profile_item.id_of_user_profile === this.movie_creator_item.id_of_user_profile) {
        this.isUserOwner = true;
        this.fillMovieInfo();
      } else {
        this.isUserOwner = false;
      }
    } else {
      this.isUserOwner = false;
    }
  }

  next();
};

Mdl.prototype.handleOwner = function(next) {
  if (this.isUserOwner !== true) {
    next();
    return;
  }

  // show and add events to admin buttons
  console.log('user is owner of movie template');

  var elemProlongTemplate = dhr.getElems('.' + this.root.cls.fncProlongTemplate);
  var elemEditTemplate = dhr.getElems('.' + this.root.cls.fncEditTemplate);
  //    var elemRemoveTemplate = dhr.getElem('.' + this.cls.fncRemoveTemplate);
  //    var elemTweetStory = dhr.getElem('.' + this.cls.fncTweetStory);
  var elemsShowAttachments = dhr.getElems('.' + this.root.cls.fncShowAttachments);

  //  dhr.on(elemProlongTemplate, 'click', handleFncProlongTemplate.bind(this));
  dhr.showElems(elemProlongTemplate);

  //  dhr.on(elemEditTemplate, 'click', handleFncEditTemplate.bind(this)); // write when impl
  dhr.showElems(elemEditTemplate);

  //dhr.on(elemsShowAttachments, 'click', handleFncShowAttachments.bind(this));
  dhr.showElems(elemsShowAttachments);

  next();
};

Mdl.prototype.handlePlayer = function(next) {
  if (this.isUserOwner !== false) {
    next();
    return;
  }

  var playerFlow = this.checkLocalEpisodeBids.bind(this,
    this.root.checkNonReadyEpisodeBids.bind(this.root,
      this.root.fillUserBids.bind(this.root, next)));

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

Mdl.prototype.startFlow = function(next) {
  var flow = this.handleUserRights.bind(this,
    this.handlePlayer.bind(this, // show buttons for usual user
      this.handleOwner.bind(this, // show button for owner of a movie
        next)));
  flow();
};

exports.init = function(data, root) {
  return new Mdl(data, root);
};

module.exports = exports;
