/**
 * Start script
 * @todo: #24! Get duration of video to cut; start and stop; with or without loading full video
 * @todo: #34! Load episode info
 *             movie_template.name, .duration_of_episodes,
 *             episode_template.name, story, conds, order_in_movie
 *             media_spec
 *             job_output.id_of_job_status, status_detail
 *             file_output_arr
 *             media_file.url, .size, .duration
 * @todo: #33! Show media url (when a job is ready);
 * @todo: #33! Show cutline with start, stop points
 *             After submit, send a request with start, stop points to crete job_cut
 *             Check this job every N seconds, while status = 'Complete' (set media_spec.is_ready = true)
 *             Re-load the video (with this url): cutted video already
 *
 */
var bem = require('../../../vmg-bem/bems/enhance.bemjson');
var vwmHelper = require('./vwm');
var authHelper = require('../common/auth-helper');
var popupHelper = require('../common/popup-helper');

var commonCls = require('../common/cls');
var cls = require('./cls');

$.extend(cls, commonCls);

var ctx = {
  doc: document,
  cls: cls,
  sid: null,
  bem: bem,
  idOfMediaSpec: null
};

var last = function() {
  console.log('last func');
};

var afterAuthFlow =
  authHelper.showAuth.bind(ctx,
    vwmHelper.runMachine.bind(ctx, last)
  );

var authNoFlow =
  authHelper.waitUserLogin.bind(ctx,
    afterAuthFlow
  );

var authFlowSelector = function() {
  if (this.userSession) {
    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow
    authNoFlow();
  }
};

var appFlow =
  vwmHelper.loadIdOfMediaSpec.bind(ctx,
    vwmHelper.waitDocReady.bind(ctx,
      popupHelper.addEvents.bind(ctx,
        authHelper.loadSid.bind(ctx,
          // two flows - auth=yes and auth=no
          authHelper.handleSid.bind(ctx,
            authFlowSelector.bind(ctx)
          )))));

appFlow();
