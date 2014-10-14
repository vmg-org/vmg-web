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
};

S3Upload.prototype.onProgress = function(percent, status) {
  return console.log('base.onProgress()', percent, status);
};

S3Upload.prototype.onError = function(status) {
  return console.log('base.onError()', status);
};

S3Upload.prototype.run = function(files, bidMedia) {
  this.onProgress(0, 'Upload started.');
  var _results = [];

  for (var _i = 0, _len = files.length; _i < _len; _i++) {
    _results.push(this.uploadFile(files[_i], bidMedia));
  }
  return _results;
};

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

S3Upload.prototype.executeOnSignedUrl = function(file, bidMedia, callback) {
  var opts = {};
  opts.data = JSON.stringify(bidMedia);
  rqst.send('POST', this.s3_sign_put_url, opts, callback);


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

S3Upload.prototype.uploadToS3 = function(file, url, public_url, bidMedia) {
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
        return this_s3upload.onFinishS3Put(bidMedia);
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

S3Upload.prototype.handleSignedUrl = function(file, err, result) {
  if (err) {
    return this.onError(err.responseText);
  }

  var mediaFile = result.media_spec_item.media_file_arr[0];
  console.log('myresult', result);

  var signedURL = decodeURIComponent(mediaFile.url_to_upload);
  var publicURL = mediaFile.url;
  return this.uploadToS3(file, signedURL, publicURL, result); 
};

S3Upload.prototype.uploadFile = function(file, bidMedia) {
  return this.executeOnSignedUrl(file, bidMedia, this.handleSignedUrl.bind(this, file));
};

exports.S3Upload = S3Upload;

module.exports = exports;
