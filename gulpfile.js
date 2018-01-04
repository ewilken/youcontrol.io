var gulp        = require('gulp');
var git         = require('gulp-git');
var rename      = require('gulp-rename');
var pug         = require('gulp-pug');
var sass        = require('gulp-sass');
var sassVars    = require('gulp-sass-variables');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var version = '';

function task_tag(ex) {
  git.exec({args : 'describe --tags'}, function done(err, stdout) {
    version = stdout.trim();
    console.log(version);
    ex();
  });
};

function task_pug() {
  return gulp.src("./src/*.pug")
    .pipe(pug({
      locals: {
        version: version
      }
    }))
    .pipe(gulp.dest("./dist/"));
}

function task_sass() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sassVars({
      $version: version
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix : '-' + version,
    }))
    .pipe(gulp.dest('./dist/css'));
}

function task_browserify() {
  return gulp.src('src/app.js')
    .pipe(browserify({
        insertGlobals: true,
        debug: false
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix : '-' + version,
    }))
    .pipe(gulp.dest('dist/'));
}

function task_copy() {
  return gulp.parallel(
    function copy_images() {
      return gulp.src('./src/img/*')
        .pipe(rename({
          suffix : '-' + version,
        }))
        .pipe(gulp.dest('./dist/img'));
    },
    function copy_mdi() {
      return gulp.src('./node_modules/mdi/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
    },
    function copy_fa() {
      return gulp.src('./node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
    },
    function copy_mfizz() {
      return gulp.src('./node_modules/font-mfizz/dist/*')
        .pipe(gulp.dest('./dist/fonts'));
    }
  );
}

function task_browsersync() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  });
}

gulp.task('default', gulp.series(task_tag, task_pug, task_sass, task_browserify, task_copy()));

gulp.task('dev', gulp.series(task_tag, task_pug, task_sass, task_browserify, task_copy(), task_browsersync), () => {
  gulp.watch('./src/**/*.pug', gulp.series(task_tag, task_pug));
  gulp.watch('./src/sass/**/*.scss', gulp.series(task_tag, task_sass));
  gulp.watch('./src/src/app.js', gulp.series(task_tag, task_browserify));
  gulp.watch('./src/img/', gulp.series(task_tag, task_copy));
  gulp.watch('./dist/*.html', browserSync.reload);
  gulp.watch('./dist/*.js', browserSync.reload);
  gulp.watch('./dist/css/*.css', browserSync.reload);
});
