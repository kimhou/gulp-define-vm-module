var gulp = require('gulp');
var defineVMModule = require('gulp-define-vm-module');

gulp.task('default', function () {
    gulp.src('src/index.js')
        .pipe(defineVMModule({
            moduleName: 'moduleName'
        }))
        .pipe(gulp.dest('dest'));
})
