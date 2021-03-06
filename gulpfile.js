var gulp = require('gulp');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var gcmq = require('gulp-group-css-media-queries');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var purgecss = require('gulp-purgecss');

var sources = {
  html: 'src/*.html',
  scss: 'src/scss/main.scss',
  js: 'src/js/*'
};

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'src/'
    },
    notify: false,
    online: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task('html', function () {
  return gulp.src(sources.html)
    .pipe(browserSync.reload({ stream: true })); // Reload browser on HTML change
});

gulp.task('styles', function () {
  return gulp.src(sources.scss)
    .pipe(sourcemaps.init()) // Start sourcemaps
    .pipe(sass().on('error', notify.onError())) // Compile SCSS into CSS. If error occurs, notify
    /* .pipe(purgecss({
      content: [sources.html, sources.js]
    })) // Remove unused CSS */
    .pipe(gcmq()) // Group CSS media queries
    .pipe(autoprefixer()) // Prefix CSS styles. Gets browserslist from package.json
    .pipe(csso()) // Minify CSS
    .pipe(sourcemaps.write('/')) // Create and write the map file
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream()); // Reload page
});

gulp.task('watch', function () {
  gulp.watch(sources.html, gulp.parallel('html'));
  gulp.watch(sources.scss, gulp.parallel('styles'));
});

gulp.task('default', gulp.parallel('watch', 'styles', 'browser-sync'));

gulp.task('build-html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('build-styles', function () {
  return gulp.src(sources.scss)
    .pipe(sourcemaps.init()) // Start sourcemaps
    .pipe(sass().on('error', notify.onError())) // Compile SCSS into CSS. If error occurs, notify
    .pipe(purgecss({
      content: [sources.html, sources.js]
    })) // Remove unused CSS
    .pipe(gcmq()) // Group CSS media queries
    .pipe(autoprefixer()) // Prefix CSS styles. Gets browserslist from package.json
    .pipe(csso()) // Minify CSS
    .pipe(sourcemaps.write('/')) // Create and write the map file
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build-fonts', function () {
  return gulp.src('src/fonts')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', gulp.parallel('build-html', 'build-styles', 'build-fonts'));
