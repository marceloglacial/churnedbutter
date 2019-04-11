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
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename');

// 1.2 - Project Paths
const root = './src/';
const dist = './dist/';
const all = '**/*.*';

const src = new function () {
    this.all = root + all;
    this.root = root;
    this.dist = dist;
    this.styles = this.root + 'styles/**/*.scss';
    this.assets = 'websites/assets/**/*.*';
    this.templates = this.root + 'templates/';
    this.partials = this.templates + 'partials/';
    this.components = this.partials + 'components/**/*.*';
}

// ===================================================
// 2. Styles Framweork
// ===================================================

// 2.1 - Compile SASS and minify CSS
// ---------------------------------------------------
function styles() {
    return gulp
        .src(src.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(src.dist + 'css/'))
    // .pipe(browserSync.stream());
};
exports.styles = styles

// 2.2 - Handlebars templates
// ---------------------------------------------------
function templates() {
    var templateData = {},
        options = {
            ignorePartials: true,
            batch: [src.partials]
        }
    return gulp.src(src.templates + '*.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(src.dist))
    // .pipe(browserSync.stream());
};
exports.templates = templates;

// 2.2 - Assets
// ---------------------------------------------------
function assets() {
    return gulp.src(src.assets)
        .pipe(gulp.dest(dist + '/assets/'))
};
exports.assets = assets;

// 2.3 - Reload page
// ---------------------------------------------------
function liveReload() {
    browserSync.reload();
};

// 2.4 - Start server and watch files
// ---------------------------------------------------
function liveServer() {
    browserSync.init({
        server: {
            baseDir: dist
        }
    });
    gulp.watch(src.all).on('change', gulp.series(build, liveReload));
};

// 2.5 - Build
// ---------------------------------------------------
function clean(path = dist) {
    return del(path);
};
const cleanDist = gulp.series(() => clean());
const build = gulp.series(cleanDist, templates, styles, assets);

// ===================================================
// 2. Styleguide
// ===================================================

// 2.1 - Paths 
// ---------------------------------------------------
const styleguide = new function () {
    this.folder = 'styleguide/';
    this.all = this.folder + all;
    this.root = this.folder;
    this.dist = this.folder + 'build/';
    this.styles = this.root + 'styles/**/*.scss';
    this.assets = this.root + 'assets/**/*.*';
    this.templatesAll = this.root + 'templates/**/*.hbs';
    this.templates = this.root + 'templates/*.hbs';
    this.partials = this.root + 'templates/partials/';
    this.components = this.root + 'templates/components/';
}

// 2.2 - Handlebars templates
// ---------------------------------------------------
function copyComponents() {
    return gulp.src(src.components)
        .pipe(gulp.dest(styleguide.components))
}
exports.copyComponents = copyComponents

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
    // .pipe(browserSync.stream());
};
exports.styleguideTemplates = styleguideTemplates;

// 2.2 - SASS Files
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
    // .pipe(browserSync.stream());
};
exports.styleguideStyles = styleguideStyles


// 2.3 - Assets
// ---------------------------------------------------
function styleguideAssets() {
    return gulp.src(styleguide.assets)
        .pipe(gulp.dest(styleguide.dist + 'assets/'))
};
exports.styleguideAssets = styleguideAssets;

// 2.4 - Cleand Build
const styleguideClean = gulp.series(() => clean(styleguide.dist),() => clean(styleguide.components));
gulp.task('styleguideClean', styleguideClean);

// 2.5 - Live Server
// ---------------------------------------------------
function styleguideLiveServer() {
    browserSync.init({
        server: {
            baseDir: styleguide.dist
        }
    });
    gulp.watch(styleguide.styles).on('change', gulp.series(styleguideBuild, liveReload));
    gulp.watch(styleguide.templates).on('change', gulp.series(styleguideBuild, liveReload));
    gulp.watch(styleguide.partials + all).on('change', gulp.series(styleguideBuild, liveReload));
    gulp.watch(styleguide.assets).on('change', gulp.series(styleguideBuild, liveReload));
};

// 2.6 - Build
// ---------------------------------------------------
const styleguideBuild = gulp.series(
    styleguideClean,
    copyComponents,
    styleguideAssets,
    styleguideTemplates,
    styleguideStyles
);

// ===================================================
// 3. Gulp Main Tasks
// ===================================================

gulp.task('clean', gulp.series(cleanDist, styleguideClean));
gulp.task('develop', gulp.series(build, liveServer));
gulp.task('build', build);
gulp.task('default', gulp.series('develop'));
gulp.task('styleguideBuild', styleguideBuild);
gulp.task('styleguideStart', gulp.series(
    styleguideBuild,
    styleguideLiveServer
));
