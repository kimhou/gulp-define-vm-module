'use strict';
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var derequire = require('gulp-derequire');
var throughpipe = require('through-pipes');
var rename = require('gulp-rename');

function makeVMModule(options) {
    return through.obj(function (file, encoding, cb) {
        var name = options.moduleName;
        name = (name && name.length ? '"' + name + '", ' : '');
        var moduleContents = file.contents.toString().replace(/window\[('|")require('|")\]/g, 'require');
        var exportModule = moduleContents.split(/\[|\]/);
        exportModule = exportModule && exportModule.length > 1 && exportModule[exportModule.length - 2] || 0;

        file.contents = new Buffer([
            '/**',
            ' * compiled by gulp-define-vm-module',
            ' */',
            '',
            'define(' + name + 'function(require, exports, module) { ',
            '   var mod = ' + moduleContents + '; ',
            '   return mod("' + exportModule + '");',
            '});'
        ].join('\r\n'), 'utf-8');
        this.push(file);
        cb();
    });
}

module.exports = function (options) {
    options = options || {};

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
            })
            .pipe(rename(function (path) {
                path.basename = options.moduleName;
                path.extname = ".js";
            }));
    });
};
