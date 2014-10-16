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

  // Date, when created this object to retry during 1 min only
  //  this.created = new Date();
  var curDate = new Date().getTime(); // ms

  this.retryEndTime = new Date(curDate + 20000); // add 20 sec
};

S3Upload.prototype.onProgress = function(percent, status) {
  return console.log('base.onProgress()', percent, status);
};

S3Upload.prototype.onError = function(status) {
  return console.log('base.onError()', status);
};


S3Upload.prototype.createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();

  if (xhr.withCredentials != null) {
    console.log('xml http request');
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    console.log('x domain request');
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

S3Upload.prototype.executeOnSignedUrl = function(file, jobSource, callback) {
  var opts = {};
  opts.data = JSON.stringify(jobSource);
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

S3Upload.prototype.handleSuccessOfUploading = function(xhr, jobSource) {
  if (xhr.status === 200) {
    this.onProgress(100, 'Upload completed.');
    return this.onFinishS3Put(jobSource);
  } else {
    return this.onError('Upload error: ' + xhr.status);
  }
};

S3Upload.prototype.handleErrorOfUploading = function(file, url, publicUrl, jobSource, e) {
  // second arg - undefined
  //	e - XMLHttpRequestProgressEvent
  //	e.currentTarget - XMLHttpRequest
  //	e.target, e.srcElement
  //	e.total = 0
  //	e.totalSize = 0
  //	e.type = 'error'
  //	e.timeStamp = 1413413044900
  //	e.position = 0
  //	e.loaded = 0
  //	xhr.readyState = 4
  //
  if (e.target.status === 0) { // not 403 or other
    if (new Date() < this.retryEndTime) {
      console.log('retry');
      //    retry again
      this.uploadToS3(file, url, publicUrl, jobSource);
      return;
    }
  }

  console.log('handleErrorOfUploading', e);
  return this.onError('XHR error.');
};

S3Upload.prototype.uploadToS3 = function(file, url, publicUrl, jobSource) {
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

  var xhr = this.createCORSRequest('PUT', url);

  if (!xhr) {
    return this.onError('CORS not supported');
  }

  xhr.onload = this.handleSuccessOfUploading.bind(this, xhr, jobSource);

  xhr.onerror = this.handleErrorOfUploading.bind(this, file, url, publicUrl, jobSource);
  //    xhr.upload.onprogress = function(e) {
  //      var percentLoaded;
  //      if (e.lengthComputable) {
  //        percentLoaded = Math.round((e.loaded / e.total) * 100);
  //        return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
  //      }
  //    };

  xhr.setRequestHeader('Content-Type', file.type);
  //  xhr.setRequestHeader('Content-Length', file.size); // unsafe header
  xhr.setRequestHeader('x-amz-acl', 'public-read');
  // return xhr.sendAsBinary(file); - mozilla only
  // var formData = new FormData();
  // formData.append(file.name, file);
  return xhr.send(file);
};

S3Upload.prototype.handleSignedUrl = function(file, err, result) {
  if (err) {
    return this.onError(err.responseText);
  }

  console.log('myresult', result);

  var signedURL = decodeURIComponent(result.url_to_upload);
  var publicURL = result.url_to_read;
  return this.uploadToS3(file, signedURL, publicURL, result);
};

S3Upload.prototype.uploadFile = function(file, jobSource) {
  return this.executeOnSignedUrl(file, jobSource, this.handleSignedUrl.bind(this, file));
};

S3Upload.prototype.run = function(files, jobSource) {
  this.onProgress(0, 'Upload started.');
  var _results = [];

  for (var _i = 0, _len = files.length; _i < _len; _i++) {
    _results.push(this.uploadFile(files[_i], jobSource));
  }
  return _results;
};

exports.S3Upload = S3Upload;

module.exports = exports;
