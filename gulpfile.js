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
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename');

// 1.2 - Project Paths
const src = './src/';
const dist = './dist/';
const all = '**/*.*';

const app = new function() {
    this. all = src + all;
    this.dirname = 'websites/';
    this.root = src + this.dirname;
    this.styles = this.root + 'styles/**/*.scss';
    this.scripts = this.root + 'assets/js/**/*.js';
    this.images = this.root + 'assets/img/**/*.*';
    this.fonts = this.root + 'assets/fonts/**/*.*';
    this.templates = this.root + 'templates/';
    this.partials = this.templates + 'partials/';
    this.dist = dist + this.dirname;
}

const styleguide = new function () {
    this.root = './styleguide/';
    this.dist = dist;
    this.all = this.root + all;
    this.templates = this.root + 'templates/';
    this.partials = this.templates + 'partials/';
    this.js = this.root + 'js/';
    this.img = this.root + 'img/';
};


// ===================================================
// 2. App - Websites
// ===================================================

// 2.1 - Compile SASS and minify CSS
function styles() {
    return gulp
        .src(app.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(app.dist + 'assets/css'))
        // .pipe(browserSync.stream());
};
exports.styles = styles

// 2.2  - Minify JS 
function scripts() {
    return (
        gulp
        .src(app.scripts, {
            sourcemaps: true
        })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(app.dist + 'assets/js'))
    );
}
exports.scripts = scripts

// / 2.3 - Minify Images
function images() {
    return (
        gulp
        .src(app.images)
        .pipe(imagemin())
        .pipe(gulp.dest(app.dist + 'assets/img'))
    )
};
exports.images = images

// 2.4 - Handlebars templates
function templates() {
    var templateData = {},
        options = {
            ignorePartials: true,
            batch: [app.partials]
        }
    return gulp.src(app.templates + '*.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(app.dist))
        // .pipe(browserSync.stream());
};
exports.templates = templates;

// 2.5 - Fonts
function fonts(){
    return gulp.src(app.fonts)
    .pipe(gulp.dest(app.dist + 'assets/fonts'))
};
exports.fonts = fonts;


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
            baseDir: dist + 'websites'
        }
    });
    gulp.watch(app.all).on('change',  gulp.series(build, liveReload));
};

// ===================================================
// 5. Build
// ===================================================

// 5.1 - Clean build folder 
function clean(path = dist) {
    return del(path);
};
const cleanDist = gulp.series(() => clean());
const build = gulp.series(cleanDist, templates, styles, scripts, images, fonts);


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