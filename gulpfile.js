// Gulp modules
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename');

// Paths
const src = './src/';
const dist = './dist/';
const all = '**/*.*';

const source = new function () {
    this.root = src;
    this.all = this.root + all;
    this.dist = dist;
    this.sass = this.root + '**/*.scss';
};
const styleguide = new function () {
    this.root = './styleguide/';
    this.dist = dist;
    this.all = this.root + all;
    this.templates = this.root + 'templates/';
    this.partials = this.templates + 'partials/';
};


// ===================================================
// 1. Source
// ===================================================

// 1.1 - Compile SASS and minify CSS
function styles() {
    return gulp
        .src(source.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(source.dist))
        .pipe(browserSync.stream());
};
exports.styles = styles

// ===================================================
// 2. Styleguide
// ===================================================

function templates() {
    var templateData = {},
        options = {
            ignorePartials: true,
            batch: [styleguide.partials]
        }
    return gulp.src(styleguide.templates + '*.handlebars')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(styleguide.dist))
        .pipe(browserSync.stream());
};
exports.templates = templates;


// ===================================================
// **. Live Server
// ===================================================
function liveReload() {
    browserSync.reload();
};

function liveServer() {
    browserSync.init({
        server: {
            baseDir: dist
        }
    });
    gulp.watch(source.sass).on('change', styles);
    gulp.watch(styleguide.all).on('change', templates);
    gulp.watch(source.all).on('change', liveReload);
};

// ===================================================
// **. Build
// ===================================================

function clean(path = source.dist) {
    return del(path);
};
const cleanDist = gulp.series(() => clean());
const build = gulp.series(cleanDist, templates, styles);


// ===================================================
// **. Gulp Main Tasks
// ===================================================
gulp.task('clean', cleanDist);
gulp.task('develop', gulp.series(build, liveServer));
gulp.task('build', build);