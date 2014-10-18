/**
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
//var indexBem = require('../../bower_components/vmg-bem/bems/upload.bemjson');
var bem = require('../../../vmg-bem/bems/enhance.bemjson');
var commonVwjs = require('../vmg-helpers/vwjs.js');
var vwjs = require('./vwjs');
var ahr = require('../vmg-helpers/app');

var idOfMediaSpec = ahr.toInt(ahr.getQueryParam('v'));

if (!idOfMediaSpec) {
  // redirect to error page
  window.location.href = './error.html?msg=wrong-params';
  return;
}

window.app = {};
commonVwjs.run(window.app, bem);
vwjs.run(window.app, bem, idOfMediaSpec);
