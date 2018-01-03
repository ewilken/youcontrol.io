var gulp        = require('gulp');
var pug         = require('gulp-pug');
var sass        = require('gulp-sass');
var browserify  = require('gulp-browserify');
var browserSync = require('browser-sync').create();

gulp.task('default', ['pug', 'sass', 'browserify', 'copy']);

gulp.task('dev', ['pug', 'sass', 'browserify', 'copy', 'browserSync'], () => {
  gulp.watch('./src/**/*.pug', ['pug']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./src/src/app.js', ['browserify']);
  gulp.watch('./src/img/', ['copy']);
  gulp.watch('./dist/*.html', browserSync.reload);
  gulp.watch('./dist/*.js', browserSync.reload);
  gulp.watch('./dist/css/*.css', browserSync.reload);
});

gulp.task('pug', () => {
  return gulp.src("./src/**/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("./dist/"));
});

gulp.task('sass', () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('browserify', () => {
  return gulp.src('src/app.js')
    .pipe(browserify({
        insertGlobals: true,
        debug: false
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy', () => {
  gulp.src('./src/img/**')
    .pipe(gulp.dest('./dist/img'));

  gulp.src('./node_modules/mdi/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));

  gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));

  gulp.src('./node_modules/font-mfizz/dist/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  });
});
