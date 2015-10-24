const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifyCSS = require('gulp-minify-css');
const minifyHTML = require('gulp-minify-html');
const minifyInline = require('gulp-minify-inline');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const browserifyEntryPath = 'client/scripts/index.js';
const publicPath = 'public';

gulp.task('connect', () => connect.server({
  livereload: true,
  root: publicPath,
}));

gulp.task('clean', () => del('public/scripts/index*'));

gulp.task('styles', () => gulp.src('client/styles/index.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 Firefox versions', 'last 2 Chrome versions'],
    cascade: false,
  }))
  .pipe(minifyCSS())
  .pipe(gulp.dest(publicPath + '/styles'))
  .pipe(connect.reload()));

gulp.task('html', () => gulp.src('client/index.html')
  .pipe(plumber())
  .pipe(minifyInline())
  .pipe(minifyHTML())
  .pipe(gulp.dest(publicPath))
  .pipe(connect.reload()));

gulp.task('scriptsDev', () => watchify(browserify(browserifyEntryPath, {...watchify.args, debug: true}))
  .transform(babelify, {stage: 0})
  .bundle()
  .pipe(plumber())
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(publicPath + '/scripts'))
  .pipe(connect.reload()));

gulp.task('scriptsProd', () => browserify(browserifyEntryPath)
  .transform(babelify, {stage: 0})
  .bundle()
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(publicPath + '/scripts')));

gulp.task('lint', () => gulp.src('client/scripts/**/*')
  .pipe(eslint())
  .pipe(eslint.formatEach()));

gulp.task('watch', () => {
  gulp.watch('client/index.html', () => runSequence('html'));
  gulp.watch('client/styles/**/*', () => runSequence('styles'));
  gulp.watch('client/scripts/**/*', () => runSequence(['scriptsDev', 'lint']));
});

gulp.task('build',
          () => runSequence('clean', ['styles', 'html', 'scriptsProd', 'lint']));

gulp.task('default',
          () => runSequence('clean', ['styles', 'html', 'scriptsDev', 'lint', 'watch'], 'connect'));
