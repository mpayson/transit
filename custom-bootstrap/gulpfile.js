// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('sass', function() {
    gulp.src('*.scss')
        .pipe(sass())
        .on('error', onError)
        .pipe(gulp.dest('./build'));

});

gulp.task('default', ['sass'], function() {
    gulp.watch('*.scss', ['sass'])
    .on('error', onError);
})