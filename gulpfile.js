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
// 2. Utility Functions
// ===================================================

// 2.1 - Clean dist folder
// ---------------------------------------------------
function clean() {
    return del(dist);
};
exports.clean = clean;


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
        .pipe(gulp.dest(framework.dist))
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
        styleguideAssets,
        styleguideStyles,
        styleguideTemplates
    )
);

// 3.6 - Run Server
// ---------------------------------------------------
gulp.task('styleguideServer', () => liveServer());


// ===================================================
// 4. Demo / wwww
// ===================================================

// 4.1 - Paths 
// ---------------------------------------------------
const demo = new function () {
    this.folder = app + 'demo/'
    this.dist = dist + 'demo/';
    this.assets = this.folder + 'assets/**/*.*';
    this.templates = this.folder + '*.hbs';
    this.partials = this.folder + 'partials';
    this.all = this.folder + all;
};

// 4.2 - Assets
// ---------------------------------------------------
function demoAssets() {
    return gulp.src(demo.assets)
        .pipe(gulp.dest(demo.dist + 'assets/'));
};
exports.demoAssets = demoAssets;


// 4.3 - Styles
// ---------------------------------------------------
function demoStyles() {
    return gulp.src(framework.dist + all)
        .pipe(gulp.dest(demo.dist + 'assets/css/'));
};
exports.demoStyles = demoStyles;


// 4.4 - Templates
// ---------------------------------------------------
function demoTemplates() {
    var templateData = {},
        options = {
            ignorePartials: true,
            batch: [demo.partials]
        }
    return gulp.src(demo.templates)
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(demo.dist))
};
exports.demoTemplates = demoTemplates;

// 4.5 - Build
// ---------------------------------------------------
gulp.task('demoBuild', 
    gulp.series(
        demoAssets,
        demoStyles,
        demoTemplates
    )
);

// 3.6 - Run Server
// ---------------------------------------------------
gulp.task('demoServer', () => liveServer(demo.dist));


// ===================================================
// 5. Live Server
// ===================================================

// 5.1 - Start server
function liveServer(base) {
    let path = base ? base : styleguide.dist;
    browserSync.init({
        server: {
            baseDir: path
        }
    });
    gulp.watch(framework.all).on('change', gulp.series('build', liveReload));
    gulp.watch(styleguide.all).on('change', gulp.series('build', liveReload));
};

// 5.2 - Reload page
// ---------------------------------------------------
function liveReload() {
    browserSync.reload();
};


// ===================================================
// 6. Gulp Tasks
// ===================================================
gulp.task('build', gulp.series(clean, frameworkBuild, 'styleguideBuild', 'demoBuild'));
gulp.task('demo', gulp.series('build', 'demoServer'));
gulp.task('default', gulp.series('build', 'styleguideServer'));
