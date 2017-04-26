'use strict';

var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var globbing      = require('gulp-css-globbing');
var duration      = require('gulp-duration');
var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var csswring      = require('csswring');

var paths = {
  app:  'app',
  scss: 'app/scss',
  css:  'app/css'
};

gulp.task('browser-sync', function() {
  //browserSync.init({
  //  proxy: "localhost/gsp-project-template/app"
  //});
  browserSync.init({
    server: {
      baseDir: "./app/"
    }
  });
});

gulp.task('sass-dev', function() {
    var processors = [
      autoprefixer({browsers: ['last 10 versions', 'ie 9']})
    ];
    return gulp.src(paths.scss + '/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(globbing({ extensions: ['.scss'] }))
      //.pipe(sass.sync().on('error', sass.logError))
      .pipe(sass.sync().on('error', function(err) {
        console.error(err.message);
        browserSync.notify(err.message, 3000);
        this.emit('end');
      }))
      .pipe(duration('SASS compilation finished'))
      .pipe(postcss(processors))
      .pipe(duration('postCSS finished'))
      .pipe(sourcemaps.write('./map'))
      .pipe(duration('created sourcemap files'))
      .pipe(gulp.dest(paths.css))
      .pipe(browserSync.reload({stream: true}))
      ;
});

gulp.task('sass-prod', function () {
  var processors = [
    autoprefixer({browsers: ['last 10 versions', 'ie 9']}),
    csswring
  ];
  gulp.src(paths.scss + '/**/*.scss')
    .pipe(globbing({ extensions: ['.scss'] }))
    .pipe(sass.sync().on('error', sass.logError).on('error', process.exit.bind(process, 1)))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.css))
    ;
});

gulp.task('watch', ['sass-dev', 'browser-sync'], function() {
  gulp.watch(paths.scss + "/**/*.scss", ['sass-dev']);
  gulp.watch(paths.app + '/*.html').on('change', browserSync.reload);
});

/* Default task */
gulp.task('default', ['watch']);
