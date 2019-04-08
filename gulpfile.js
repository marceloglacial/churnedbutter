// ===================================================
// 1. Setup
// ===================================================

// 1.1 - Gulp modules
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename');

// 1.2 - Project Paths
const src = './src/';
const dist = './dist/';
const all = '**/*.*';

const source = new function () {
    this.root = src;
    this.all = this.root + all;
    this.dist = dist;
    this.sass = this.root + '**/*.scss';
    this.js = this.root + '**/*.js';
};
const styleguide = new function () {
    this.root = './styleguide/';
    this.dist = dist;
    this.all = this.root + all;
    this.templates = this.root + 'templates/';
    this.partials = this.templates + 'partials/';
    this.js = this.root + 'js/';
};


// ===================================================
// 2. Source
// ===================================================

// 2.1 - Compile SASS and minify CSS
function styles() {
    return gulp
        .src(source.sass)
        // .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        // .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(source.dist))
        .pipe(browserSync.stream());
};
exports.styles = styles

// 2.2  - Minify JS 
// Minify JavaScript
function scripts() {
    return (
        gulp
        .src(source.js, {
            sourcemaps: true
        })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(source.dist))
    );
}
exports.scripts = scripts


// ===================================================
// 3. Styleguide
// ===================================================

// 3.1 - Copy Scripts to dist 
function styleguideJsToDist() {
    return gulp.src(styleguide.js + all)
        .pipe(gulp.dest(styleguide.dist + 'assets/js/'))
}
exports.styleguideJsToDist = styleguideJsToDist

// 3.2 - Generate HTML from Handlebars templates
function templates() {

    styleguideJsToDist();

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
// 4. Live Server
// ===================================================

// 4.1 - Reload page
function liveReload() {
    browserSync.reload();
};

// 4.2 - Start server and watch files
function liveServer() {
    browserSync.init({
        server: {
            baseDir: dist
        }
    });
    gulp.watch(styleguide.all).on('change', gulp.series(build, liveReload));
    gulp.watch(source.all).on('change',  gulp.series(build, liveReload));
};

// ===================================================
// 5. Build
// ===================================================

// 5.1 - Clean build folder 
function clean(path = source.dist) {
    return del(path);
};
const cleanDist = gulp.series(() => clean());
const build = gulp.series(cleanDist, templates, styles);


// ===================================================
// 6. Gulp Main Tasks
// ===================================================

// 6.1 - Clean dist folder
gulp.task('clean', cleanDist);

// 6.2 - First build and start server
gulp.task('develop', gulp.series(build, liveServer));

// 6.3 - Build project 
gulp.task('build', build);

// 6.4 - Default task
gulp.task('default', gulp.series('develop'));