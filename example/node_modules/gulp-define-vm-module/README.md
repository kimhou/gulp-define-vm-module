# gulp-define-vm-module

[![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Code Climate][codeclimate-image]][codeclimate-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][david-image]][david-url] [![devDependencies][david-dev-image]][david-dev-url]

gulp-define-vm-module 此插件可以将browserify合并规则的源代码合成为CMD风格的模块化文件.

```javascript
define('moduleName', function(require, exports, module){
var mod = (browserify script);
return mod['main_module_num'];
})
```
use Example
```javascript
var defineVMModule = require('gulp-define-vm-module');
gulp.src('path/src/index.js')
            .pipe(defineVMModule({
                moduleName: moduleName
            }))
            .pipe(gulp.dest('path'));
```
## 合并规则
path 下有 index.js a.js b.js
index.js依赖a.js b.js

生成
path/moduleName.js

如果有外部依赖则在js中使用window\['require'\](moduleName)引用 (跟子模块依赖区分)
生成代码会自动转成require(moduleName), 内部模块的require会被derequire重命名


## License

This project is distributed under the MIT license.


[travis-url]: http://travis-ci.org/wbyoung/gulp-define-vm-module
[travis-image]: https://secure.travis-ci.org/wbyoung/gulp-define-vm-module.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-define-vm-module
[npm-image]: https://badge.fury.io/js/gulp-define-vm-module.png
[codeclimate-image]: https://codeclimate.com/github/wbyoung/gulp-define-vm-module.png
[codeclimate-url]: https://codeclimate.com/github/wbyoung/gulp-define-vm-module
[coverage-image]: https://coveralls.io/repos/wbyoung/gulp-define-vm-module/badge.png
[coverage-url]: https://coveralls.io/r/wbyoung/gulp-define-vm-module
[david-image]: https://david-dm.org/wbyoung/gulp-define-vm-module.png?theme=shields.io
[david-url]: https://david-dm.org/wbyoung/gulp-define-vm-module
[david-dev-image]: https://david-dm.org/wbyoung/gulp-define-vm-module/dev-status.png?theme=shields.io
[david-dev-url]: https://david-dm.org/wbyoung/gulp-define-vm-module#info=devDependencies

[gulp-define-vm-module]: https://github.com/wbyoung/gulp-define-vm-module
[gulp-handlebars]: https://github.com/lazd/gulp-handlebars
[gulp-ember-emblem]: https://github.com/wbyoung/gulp-ember-emblem
[lodash.template]: http://lodash.com/docs#template
