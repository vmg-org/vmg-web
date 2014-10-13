/**
 * AWS S3
 * @module vmg-helpers/s3h
 */

var rqst = require('./rqst');

var S3Upload = function(options) {
  options = options || {};

  for (var option in options) {
    this[option] = options[option];
  }

  //this.handleFileSelect(document.getElementById(this.file_dom_selector));
};


//S3Upload.prototype.s3_object_name = 'default_name';

//S3Upload.prototype.s3_sign_put_url = '/signS3put';

//S3Upload.prototype.file_dom_selector = 'file_upload';

S3Upload.prototype.onFinishS3Put = function(public_url) {
  return console.log('base.onFinishS3Put()', public_url);
};

S3Upload.prototype.onProgress = function(percent, status) {
  return console.log('base.onProgress()', percent, status);
};

S3Upload.prototype.onError = function(status) {
  return console.log('base.onError()', status);
};

S3Upload.prototype.run = function(files) {
  this.onProgress(0, 'Upload started.');
  var _results = [];

  for (var _i = 0, _len = files.length; _i < _len; _i++) {
    _results.push(this.uploadFile(files[_i]));
  }
  return _results;
};

//S3Upload.prototype.handleFileSelect = function(file_element) {
//  var f, files, output, _i, _len, _results;
//  this.onProgress(0, 'Upload started.');
//  files = file_element.files;
//  output = [];
//  _results = [];
//  for (_i = 0, _len = files.length; _i < _len; _i++) {
//    f = files[_i];
//    _results.push(this.uploadFile(f));
//  }
//  return _results;
//};

S3Upload.prototype.createCORSRequest = function(method, url) {
  var xhr;
  xhr = new XMLHttpRequest();
  if (xhr.withCredentials != null) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

S3Upload.prototype.executeOnSignedUrl = function(file, callback) {
  var opts = {};

  var episodeVariant = {
    "id_of_episode_template": 4444,
    "id_of_media_spec": null,
    "id_of_user_profile": 123456789, // get from auth (demo)
    "created": null, // auto-gen
    "is_ready": null, // auto-gen to false
    "moder_rating": 0, // 0 - not checked yet
    "media_spec_item": {
      "id": null,
      "name": null, // from episode name or empty
      "created": null, //autogen
      "preview_img_url": null, // later
      "media_file_arr": [{
        "id": null,
        "id_of_media_spec": null,
        "id_of_container_format": file.type, // required
        "url": null,
        "url_to_upload": null,
        "size": null,
        "duration": null,
        "progress_creation": null,
        "progress_cutting": null,
        "cutting_start": null,
        "cutting_stop": null,
        "is_original": true // required
      }]
    }
  };

  opts.data = JSON.stringify(episodeVariant);

  rqst.send('POST', this.s3_sign_put_url, opts, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }

    var mediaFile = result.media_spec_item.media_file_arr[0];
    console.log('myresult', result);

    return callback(decodeURIComponent(mediaFile.url_to_upload), mediaFile.url);
  });


  //  var this_s3upload, xhr;
  //  this_s3upload = this;
  //  xhr = new XMLHttpRequest();
  //  console.log({
  //    file: file
  //  });
  //  xhr.open('GET', this.s3_sign_put_url + '?s3_object_type=' + file.type + '&s3_object_name=' + this.s3_object_name, true);
  //  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  //  xhr.onreadystatechange = function(e) {
  //    var result;
  //    if (this.readyState === 4 && this.status === 200) {
  //      try {
  //        result = JSON.parse(this.responseText);
  //      } catch (error) {
  //        this_s3upload.onError('Signing server returned some ugly/empty JSON: "' + this.responseText + '"');
  //        return false;
  //      }
  //      return callback(decodeURIComponent(result.signed_request), result.url);
  //    } else if (this.readyState === 4 && this.status !== 200) {
  //      console.log(e);
  //      return this_s3upload.onError('Could not contact request signing server. Status = ' + this.status);
  //    }
  //  };
  //  return xhr.send();
};

S3Upload.prototype.uploadToS3 = function(file, url, public_url) {
  //  var fd = new FormData();
  //  var ths = this;
  //  fd.append('body', file);
  //  rqst.send('PUT', url, {
  //    data: fd,
  //    processData: false,
  //    contentType: file.type
  //    headers: {
  //      'x-amz-acl': 'public-read'
  //    }
  //    //    xhr: function() {
  //    //      var xhr = new window.XMLHttpRequest();
  //    //      //Download progress
  //    //      xhr.addEventListener("progress", function(evt) {
  //    //        console.log(evt.lengthComputable); // false
  //    //        if (evt.lengthComputable) {
  //    //          var percentComplete = evt.loaded / evt.total;
  //    //          console.log(Math.round(percentComplete * 100) + "%");
  //    //        }
  //    //      }, false);
  //    //    }
  //  }, function(err, result) {
  //    if (err) {
  //      console.log('uploadToS3Error', err);
  //      alert('Error: ' + err.message);
  //      return;
  //    }
  //    window.alert('Uploaded successfuly');
  //    //    console.log('s3upload done');
  //
  //    return ths.onFinishS3Put(public_url);
  //  });

  var this_s3upload, xhr;
  this_s3upload = this;
  xhr = this.createCORSRequest('PUT', url);
  if (!xhr) {
    this.onError('CORS not supported');
  } else {
    xhr.onload = function() {
      if (xhr.status === 200) {
        this_s3upload.onProgress(100, 'Upload completed.');
        return this_s3upload.onFinishS3Put(public_url);
      } else {
        return this_s3upload.onError('Upload error: ' + xhr.status);
      }
    };
    xhr.onerror = function() {
      return this_s3upload.onError('XHR error.');
    };
//    xhr.upload.onprogress = function(e) {
//      var percentLoaded;
//      if (e.lengthComputable) {
//        percentLoaded = Math.round((e.loaded / e.total) * 100);
//        return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
//      }
//    };
  }
  xhr.setRequestHeader('Content-Type', file.type);
  xhr.setRequestHeader('x-amz-acl', 'public-read');
  return xhr.send(file);
};

S3Upload.prototype.uploadFile = function(file) {
  var this_s3upload;
  this_s3upload = this;
  return this.executeOnSignedUrl(file, function(signedURL, publicURL) {
    return this_s3upload.uploadToS3(file, signedURL, publicURL);
  });
};


//(function() {
//  window.S3Upload = (function() {
//
//    function S3Upload(options) {
//    }
//
//
//    return S3Upload;
//
//  })();
//
//}).call(this);

exports.S3Upload = S3Upload;

module.exports = exports;
