// ==============================================================
// 1. Project Setup
// ==============================================================

// 1.1 - Gulp modules
// -------------------------------------
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename');

// 1.2 - Project Paths
// -------------------------------------
const app = './src/';
const dist = './dist/';
const all = '**/*.*';
const folders = '**/*';


// ==============================================================
// 2. Functions
// ==============================================================


// 2.1 - Clean dist folder
// -------------------------------------
function clean() {
    return del(dist);
};
exports.clean = clean;


// 2.2 - Complie SASS
// -------------------------------------
function styles(src, dest) {
    return gulp
        .src(src)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest))
};


// 2.3 - Complie Handlebars templates
// -------------------------------------
function templates(templates, partials, dest) {
    var templateData = {},
        options = {
            ignorePartials: true,
            batch: [partials]
        }
    return gulp.src(templates)
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(dest))
};


// 2.2 - Copy
// -------------------------------------
function copy(src, dest) {
    return gulp.src(src)
        .pipe(gulp.dest(dest));
};


// 2.3 - Start server
// -------------------------------------
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


// 2.4 - Reload page
// -------------------------------------
function liveReload() {
    browserSync.reload();
};



// ==============================================================
// 3. Framework
// ==============================================================


// 3.1 - Paths
// -------------------------------------
const framework = new function () {
    this.folder = app + 'framework/'
    this.dist = dist + 'framework/';
    this.styles = this.folder + '**/*.scss';
    this.all = this.folder + all;
};

// 2.2 - Build (compile SASS)
// -------------------------------------
gulp.task('frameworkBuild', () => styles(framework.styles, framework.dist));


// ==============================================================
// 3. Styleguide
// ==============================================================


// 3.1 - Paths 
// -------------------------------------
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
// -------------------------------------
gulp.task('styleguideAssets', () => copy(styleguide.assets, styleguide.dist + 'assets/'));


// 3.3 - Styles
// -------------------------------------
gulp.task('styleguideStyles', () => styles(styleguide.styles, styleguide.dist + 'assets/css/'));


// 3.4 - Templates
// -------------------------------------
gulp.task('styleguideTemplates', () => templates(styleguide.templates, styleguide.partials, styleguide.dist));


// 3.5 - Build
// -------------------------------------
gulp.task('styleguideBuild', gulp.series('styleguideAssets', 'styleguideStyles', 'styleguideTemplates'));


// 3.6 - Run Server
// -------------------------------------
gulp.task('styleguideServer', () => liveServer());


// ==============================================================
// 4. Demo / wwww
// ==============================================================


// 4.1 - Paths 
// -------------------------------------
const demo = new function () {
    this.folder = app + 'demo/'
    this.dist = dist + 'demo/';
    this.assets = this.folder + 'assets/**/*.*';
    this.templates = this.folder + '*.hbs';
    this.partials = this.folder + 'partials';
    this.all = this.folder + all;
};

// 4.2 - Assets
// -------------------------------------
gulp.task('demoAssets', () => copy(demo.assets, demo.dist + 'assets/'));


// 4.3 - Styles
// -------------------------------------
gulp.task('demoStyles', () => copy(framework.dist + all, demo.dist + 'assets/css/'));


// 4.4 - Templates
// -------------------------------------
gulp.task('demoTemplates', () => templates(demo.templates, demo.partials, demo.dist));


// 4.5 - Build
// -------------------------------------
gulp.task('demoBuild', gulp.series('demoAssets', 'demoStyles', 'demoTemplates'));

// 4.5 - Run Server
// -------------------------------------
gulp.task('demoServer', () => liveServer(demo.dist));


// ==============================================================
// 6. Gulp Main Tasks
// ==============================================================


gulp.task('build', gulp.series(clean, 'frameworkBuild', 'styleguideBuild', 'demoBuild'));
gulp.task('demo', gulp.series('build', 'demoServer'));
gulp.task('default', gulp.series('build', 'styleguideServer'));
