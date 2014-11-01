/**
 * Operations with DOM, using JQuery
 *     JQuery only here for future replacement to usual functions and don't load JQuery
 * @module dom-helper
 */

/**
 * Jquery is self-loaded (from dns or local)
 */

var bhLib = require('bh');
var bh = new(bhLib.BH); // jshint ignore:line
var ahr = require('../vmg-helpers/app');

function replacer(dataItem, match, p1) {
  var arrDot = p1.split('__'); // "ab.cd" 
  var val = dataItem[arrDot[0]];

  for (var ind = 1; ind < arrDot.length; ind += 1) {
    if (typeof val !== 'undefined') {
      // only for JSON objects
      val = val[arrDot[ind]];
    }
  }

  // TODO: #41! dev checking: remove on production
  //  var val = dataItem[p1];


  if (val === null) {
    val = '';
    console.log('replacer: null: ', p1, val);
  }
  if (typeof val === 'undefined') {
    val = '';
    console.log('replacer: undefined: ', p1, val);
  }

  //  if (ahr.isJson(val)){
  //var arrDot = 
  //  }
  // with $1 object doesnt works
  // todo #31! or throw an error
  return '"' + val + '"';
}

/*
 * Map it
 * @param {Object} sampleSchema - { block: 'asdf', content: []}
 * @param {Object} dataItem - {name: 'asdfasdfa' }
 */
var mapSampleItem = function(sampleSchema, dataItem) {
  // find in schema - object where mdl = mdlName
  // var mdlObj = ahr.findJsonMatch(sampleSchema, 'mdl', mdlName);

  // all content of this object - with movie_record context
  // change all matches with our data: @@name - dataItem.name
  // stringify it or recurse?

  var strSchema = ahr.stringify(sampleSchema);

  // change every key in dataItem

  //  ahr.each(Object.keys(dataItem), ementEachData
  //  console.log(strSchema);
  //  var allMatches = strSchema.match(/"@@\w+"/g);
  //  console.log(allMatches);
  //var matches = strSchema.match(/@@(\w+/g);
  //  if (ahr.isJson(dataItem)) {

  var genSchema = strSchema.replace(/"@@(\w+)"/g, replacer.bind(null, dataItem));
  return ahr.parseJson(genSchema);
};

exports.getBlockSchema = function(bem, elemName) {
  // block with retry and demo keys
  return ahr.extractJsonMatch(bem, 'block', elemName);
  // first inner schema
};

// Fill schema and html it
exports.htmlBemBlock = function(blockSchema, dataItem) {
  var filledSchema = mapSampleItem(blockSchema, dataItem);
  return bh.apply(filledSchema);
  //  var fullArr = ahr.map(data, mapSampleItem.bind(null, sampleSchema));
};

exports.hfb = function(bem, elemName, mdlName, data) {
  // get an object where block == key
  // get content of this object
  // get first item of array (of content)
  // create markup from this item
  // put the data to the markup
  // add it to the our elem
  // 
  // get object instead link
  var result = exports.getBlockSchema(bem, elemName);

  var sampleSchema = result.content[0];

  // insert data to schema (only one level)
  var fullArr = ahr.map(data, mapSampleItem.bind(null, sampleSchema));

  result.content = fullArr;
  var readyHtml = bh.apply(result);
  return readyHtml;
};

exports.impl = function(bem, elemName, mdlName, data, isEffect) {
  var readyHtml = exports.hfb(bem, elemName, mdlName, data);
  // bh can't generate html without a parent block
  //   without parent block - their elements with wrong names
  //   but we need only elements markup
  var jqrNewElems = $(readyHtml).children();
  var lists = $('.' + elemName); // may be few lists with movie-records in a page (retry logic)
  //  } else {
  //    // Link to  Element - elemName
  //    lists = $(elemName);
  //    console.log('lists', lists);
  //  }

  if (isEffect) {
    jqrNewElems.hide();
  }
  $(lists).append(jqrNewElems);
  if (isEffect) {
    jqrNewElems.slideDown();
  }
};

exports.alert = function(msg) {
  window.alert(msg);
};

var getElems = function(className) {
  return $(className);
};

exports.getElems = getElems;

var getElem = function(className) {
  return getElems(className)[0];
};

exports.getElem = getElem;

exports.on = function(elem, eventName, cbk) {
  $(elem).on(eventName, cbk);
};

exports.off = function(elem, eventName) {
  $(elem).off(eventName);
};

exports.trigger = function(elems, eventName) {
  $(elems).trigger(eventName);
};

exports.isElems = function(elems, prop) {
  //jqrTargetElems.is(':visible') 
  return $(elems).is(prop);
};
// elem - className or dom elem
exports.addClass = function(elem, className) {
  $(elem).addClass(className);
};

exports.removeClass = function(elem, className) {
  $(elem).removeClass(className);
};

exports.showElems = function(elems, effectName) {
  $(elems).show(effectName);
};

exports.hideElems = function(elems, effectName) {
  $(elems).hide(effectName);
};

exports.div = function(optClass) {
  var div = document.createElement('div');
  if (optClass) {
    $(div).addClass(optClass);
  }
  return div;
};

exports.html = function(elem, htmlStr) {
  $(elem).html(htmlStr);
};

exports.getVal = function(elem) {
  return $(elem).val();
};

exports.setVal = function(elem, val) {
  $(elem).val(val);
};

/**
 * Load Google lib for SignIn and other methods
 */
exports.loadGoogLib = function(fname) {
  var po = document.createElement('script');
  po.type = 'text/javascript';
  po.async = true;
  po.defer = true;

  // onload doesn't work right after. gapi.auth and gapi.client is undefined
  //  po.src = 'https://plus.google.com/js/client:plusone.js';
  //  po.onload = next;
  //    script src="https://apis.google.com/js/client:platform.js" async defer></script>
  // po.src = "https://apis.google.com/js/client:plusone.js";
  po.src = "https://apis.google.com/js/client:platform.js?onload=" + fname;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
};

/**
 * Load FB with default callback: window.fbAsyncInit
 */
exports.loadFbLib = function() {
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};

exports.setError = function(elem) {
  exports.html(elem, '<span style="color:orangered">error retrieving information</span>');
};

exports.disable = function(elems) {
  $(elems).prop("disabled", true);
};

module.exports = exports;
