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
const root = './src/';
const dist = './dist/';
const all = '**/*.*';

const src = new function () {
    this.all = root + all;
    this.root = root;
    this.dist = dist;
    this.styles = this.root + 'styles/**/*.scss';
    this.templates = this.root + 'templates/';
    this.partials = this.templates + 'partials/';
    this.fonts = this.root + 'fonts/**/*.*';
    this.fontsDist = this.dist + 'fonts/';
}

// ===================================================
// 2. src - Websites
// ===================================================

// 2.1 - Compile SASS and minify CSS
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
        .pipe(gulp.dest(src.dist))
    // .pipe(browserSync.stream());
};
exports.styles = styles


// 2.2 - Handlebars templates
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

// 2.2 - Fonts
function fonts() {
    return gulp.src(src.fonts)
        .pipe(gulp.dest(src.fontsDist))
};
exports.fonts = fonts;


// ===================================================
// 3. Templares
// ===================================================

// 3.1  - Minify JS 
function scripts() {
    return (
        gulp
        .src(src.scripts, {
            sourcemaps: true
        })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(src.dist + 'assets/js'))
    );
}
exports.scripts = scripts

// 3.2 - Minify Images
function images() {
    return (
        gulp
        .src(src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(src.dist + 'assets/img'))
    )
};
exports.images = images

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
    gulp.watch(src.all).on('change', gulp.series(build, liveReload));
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