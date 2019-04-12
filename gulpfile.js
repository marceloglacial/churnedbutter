// ===================================================
// 1. Project Setup
// ===================================================

// 1.1 - Gulp modules
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename');

// 1.2 - Project Paths
const app = './src/';
const dist = './dist/';
const all = '**/*.*';
const folders = '**/*';


// ===================================================
// 2. General Functions
// ===================================================

// 2.1 - Clean dist folder
// ---------------------------------------------------
function clean() {
    return del(dist);
};
exports.clean = clean;

// 2.2 - Reload page
// ---------------------------------------------------
function liveReload() {
    browserSync.reload();
};


// ===================================================
// 3. Framework
// ===================================================

// 3.1 - Paths
// ---------------------------------------------------
const framework = new function () {
    this.folder = app + 'framework/'
    this.dist = dist + 'framework/';
    this.styles = this.folder + '**/*.scss';
    this.all = this.folder + all;
};

// 2.2 - Build (compile SASS)
// ---------------------------------------------------
function frameworkBuild() {
    return gulp
        .src(framework.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(framework.dist + 'css/'))
};
exports.frameworkBuild = frameworkBuild;


// ===================================================
// 3. Styleguide
// ===================================================

// 3.1 - Paths 
// ---------------------------------------------------
const styleguide = new function () {
    this.folder = app + 'styleguide/'
    this.dist = dist + 'styleguide/';
    this.assets = this.folder + 'assets/**/*.*';
    this.styles = this.folder + 'styles/*.scss';
    this.templates = this.folder + 'templates/*.hbs';
    this.partials = this.folder + 'templates/partials';
    this.all = this.folder + all;
};

// 3.2 - Assets
// ---------------------------------------------------
function styleguideAssets() {
    return gulp.src(styleguide.assets)
        .pipe(gulp.dest(styleguide.dist + 'assets/'));
};
exports.styleguideAssets = styleguideAssets;

// 3.3 - Styles
// ---------------------------------------------------
function styleguideStyles() {
    return gulp
        .src(styleguide.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(styleguide.dist + 'assets/css/'))
};
exports.styleguideStyles = styleguideStyles


// 3.4 - Templates
// ---------------------------------------------------
function styleguideTemplates() {
    var templateData = {},
        options = {
            ignorePartials: true,
            batch: [styleguide.partials]
        }
    return gulp.src(styleguide.templates)
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(styleguide.dist))
};
exports.styleguideTemplates = styleguideTemplates;

// 3.5 - Build
// ---------------------------------------------------
gulp.task('styleguideBuild', 
    gulp.series(
        clean,
        styleguideAssets,
        styleguideStyles,
        styleguideTemplates
    )
);

// 3.5 - Live Server
// ---------------------------------------------------
function styleguideLiveServer() {
    browserSync.init({
        server: {
            baseDir: styleguide.dist
        }
    });
    gulp.watch(framework.all).on('change', gulp.series('frameworkBuild', liveReload));
    gulp.watch(styleguide.all).on('change', gulp.series('styleguideBuild', liveReload));
};
exports.styleguideLiveServer = styleguideLiveServer;


// ===================================================
// 4. Demo / wwww
// ===================================================


// ===================================================
// 5. Gulp Tasks
// ===================================================
gulp.task('default', gulp.series(styleguideLiveServer));
gulp.task('build', gulp.series(frameworkBuild));
