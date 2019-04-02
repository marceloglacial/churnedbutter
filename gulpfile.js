// Gulp modules
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

// Paths
const source = new function () {
    this.root = './src/';
    this.all = this.root + '**/*.*';
    this.dist = './dist/';
    this.sass = this.root + '**/*.scss';
};

// ===================================================
// 1. Source
// ===================================================

// 1.1 - Minify CSS with SASS
function styles() {
    return gulp
        .src(source.sass)
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(gulp.dest(source.dist))
        .pipe(browserSync.stream());
};
exports.styles = styles

// 1.5 - Live Server
function sourceReload() {
    browserSync.reload();
};

function sourceWatch() {
    browserSync.init({
        server: {
            baseDir: source.root
        }
    });
    gulp.watch(source.sass).on('change', styles);
    gulp.watch(source.all).on('change', sourceReload);
};

// 1.6 - Build
function clean(path = source.dist) {
    return del(path);
};

const cleanDist = gulp.series(() => clean());
const sourceBuild = gulp.series(() => clean(), styles);


// ===================================================
// 9. Gulp Tasks
// ===================================================
gulp.task('clean', cleanDist);
gulp.task('develop', sourceWatch);
gulp.task('build', sourceBuild);