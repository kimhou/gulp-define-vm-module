'use strict';
var through = require('through');
var path = require('path');
var gutil = require('gulp-util');
var _ = require('lodash');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var derequire = require('gulp-derequire');
var throughpipe = require('through-pipes');

function makeCMD(path, moduleContents, opts) {
  var splite = '\\';
  if(path.indexOf('/') != -1 && path.indexOf(splite) == -1){
    splite = '/';
  }
  var arr = path.split(splite);
  var name = opts.moduleName ? opts.moduleName : (arr && arr.length > 1 && arr[arr.length - 2]);

  if(!name){
    throw (new Error('module name error!!'));
  }

  moduleContents = moduleContents.replace(/window\[('|")require('|")\]/g, 'require');
  var exportModule = moduleContents.split(/\[|\]/);
  exportModule = exportModule && exportModule.length > 1 && exportModule[exportModule.length - 2] || 0;

  return 'define(' + (name && name.length ? '"' + name + '", ' : '') +
      'function(require, exports, module) { \r\n' +
      '\r\nvar mod = ' + moduleContents + '; \r\nreturn mod("' + exportModule + '");\r\n});';
}

function rename(path, moduleName){
  var splite = '\\';
  if(path.indexOf('/') != -1 && path.indexOf(splite) == -1){
    splite = '/';
  }
  var arr = path.split(splite);
  var name = moduleName ? moduleName : arr && arr.length > 1 && arr[arr.length - 2];

  var p = arr.splice(0, arr.length - 2);

  p.push(name + '.js');
  p.join(splite);
  return p.join(splite);;
}

function makeVMModule(options){
  return through(function(file) {
    if (file.isNull()) { return this.queue(file); } // pass along
    if (file.isStream()) { return this.emit('error', new gutil.PluginError('gulp-define-vm-module', 'Streaming not supported')); }

    var opts = _.defaults({}, options, file.defineModuleOptions);
    opts.context = _([file.defineModuleOptions, options])
        .filter(_.identity).pluck('context')
        .filter(_.identity).value();
    opts.require = _.merge.apply(null, _([file.defineModuleOptions, options, { require: {} }])
        .filter(_.identity).pluck('require')
        .filter(_.identity).value());

    var contents = file.contents.toString();
    var name = path.basename(file.path, path.extname(file.path));
    var context = {
      name: name,
      file: file,
      contents: contents
    };
    if (opts.wrapper) {
      opts.context.forEach(function(extensions) {
        if (!extensions) { return; }
        if (typeof extensions === 'function') {
          extensions = extensions(context);
        }
        _.merge(context, _(extensions).map(function(value, key) {
          return [key, _.template(value)(context)];
        }).object().value());
      });

      contents = _.template(opts.wrapper)(context);
    }

    opts.moduleName = options.moduleName;
    contents = makeCMD(file.path, contents, opts);

    file.path = gutil.replaceExtension(file.path, '.js');
    file.path = rename(file.path, options.moduleName);
    file.contents = new Buffer(contents);
    this.queue(file);
  });
}

module.exports = function(options) {
  return throughpipe(function (readable) {
    return readable.pipe(browserify())
        .on('error', function (err) {
          console.log(err)
        })
        .pipe(derequire([{
          from: 'require',
          to: '_MODREQ'
        }]))
        .on('error', function (err) {
          console.log(err)
        })
        .pipe(makeVMModule(options))
        .on('error', function (err) {
          console.log(err)
        });
  });
};
