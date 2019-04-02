// Required Plugins
var gulp = require('gulp'),
  clean = require('gulp-clean'),
  notify = require('gulp-notify'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  jshint = require('gulp-jshint'),
  changed = require('gulp-changed'),
  concat = require('gulp-concat'),
  // cache =                 require('gulp-cache'),
  // filter =                require('gulp-filter'),
  // imagemin =              require('gulp-imagemin'),
  // inject =                require('gulp-inject'),
  // util =                  require('gulp-util'),
  // handlebars =            require('gulp-compile-handlebars'),
  // directoryMap =          require('gulp-directory-map'),
  // runSequence =           require('run-sequence'),
  // imageResize =           require('gulp-image-resize'),
  // promise =               require("gulp-stream-to-promise"),

  // Define default  folders
  source = 'src/',
  styleguide = 'styleguide/',
  dest = 'dist/',
  tmp = '.tmp/';

// Config
var paths = {
    scss: source + '**/*.scss',
    js: source + '**/*.js',
    template: styleguide + 'templates/*'
  },
  dests = {
    css: dest + 'css/',
  },
  options = {
    autoprefix: 'last 3 version',
    jshint: '',
    jshint_reporter: 'default',
    scss: {
      style: 'compressed',
      compass: true
    },
    uglify: {
      mangle: false
    },
    clean: {
      read: false,
      allowEmpty: true
    }
  };

// Clean
gulp.task('clean', function () {
  return gulp.src([
      dest, tmp
    ], options.clean)
    .pipe(clean())
    .pipe(notify({
      message: 'Clean task complete.'
    }))
});

// CSS
gulp.task('css', function () {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(autoprefixer(options.autoprefix))
    .pipe(gulp.dest(dests.css))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(dest))
    .pipe(notify({
      message: 'CSS task complete.'
    }))
});

// // JS
// gulp.task('js', function () {
//   return gulp.src(paths.js)
//     .pipe(changed(dests.js))
//     .pipe(babel({
//       presets: ['env']
//     }))
//     .pipe(jshint(options.jshint))
//     .pipe(jshint.reporter(options.jshint_reporter))
//     .pipe(gulp.dest(dests.js))
//     .pipe(uglify(options.uglify))
//     .pipe(concat('all.min.js'))
//     .pipe(gulp.dest(dests.js))
//     .pipe(notify({
//       message: 'Scripts task complete.'
//     }))
// });



// gulp.task('portfolio_generator_tmp', function() {
//   var portfolioSrc = 'assets/portfolio_generator/';
//   var tasks = []
//   var pages =  require('./'+source+portfolioSrc+'config.json');
//   for(var j=0; j<pages.length; j++) {
//     var mainPageObj = pages[j];
//     var mainPageUrl = mainPageObj.page+'/';
//     var projects = mainPageObj.projects;
//     for(var i=0; i<projects.length; i++) {
//         // create projects
//         var project = projects[i],
//             projectName = projects[i].projectUrl.replace(/ +/g, '-').toLowerCase();
//         // get json of all images for each project cat and write to .tmp folder
//         var stream = gulp.src(dest+mainPageUrl+projectName+'/**/*.jpg')
//             .pipe(directoryMap({
//              filename: 'images.json'
//             }))
//             .pipe(gulp.dest('./'+tmp+mainPageUrl+projectName+'/'));
//         var prom = promise(stream);
//         tasks.push(prom);
//     }
//   }
//   return Promise.all(tasks);
// });
// gulp.task('portfolio_generator', function() {
//   var portfolioSrc = 'assets/portfolio_generator/';
//   var pages =  require('./'+source+portfolioSrc+'config.json');
//   for(var j=0; j<pages.length; j++) {
//     pages[j].projectList=[];
//     var mainPageObj = pages[j];
//     var mainPageUrl = mainPageObj.page+'/';
//     var projects = mainPageObj.projects;
//     for(var i=0; i<projects.length; i++) {
//         // create projects
//         var project = projects[i],
//             projectName = projects[i].projectUrl.replace(/ +/g, '-').toLowerCase();
//         pages[j].projectList[i]={};
//         pages[j].projectList[i].name=projects[i].name;
//         pages[j].projectList[i].url=projects[i].projectUrl;
//         pages[j].projectList[i].projects=pages[j].projectList[i].projects||[];
//         // create each project pages
//         var imagesJson = require('./'+tmp+mainPageUrl+projectName+'/images.json');
//         // reformat the json file with proper structure
//         var images = {};
//         for (var proj in imagesJson) {
//           var details = require('./'+source+portfolioSrc+mainPageUrl+projectName+'/'+proj+'/details.json');
//           // add the project to the object to further generate page
//           pages[j].projectList[i].projects.push({'name':details.name,'url':proj});
//           images[proj]=Object.assign({}, details);
//           // add name
//           images[proj].projectName = projects[i].name;
//           images[proj].projectUrl = projects[i].projectUrl;
//           images[proj].categoryUrl = mainPageObj.page;
//           images[proj].categoryName = mainPageObj.name;
//           // add details for each project
//           // add images
//           images[proj].illustrations=[];
//           for (var image in imagesJson[proj]){
//             if (image.toLowerCase().indexOf('thumbnail.jpg')!=-1){
//               images[proj]['thumbnail']=image;
//             }
//             else if (image.toLowerCase().indexOf('building.jpg')!=-1){
//               images[proj]['building']=image;
//             }
//             else if (image.toLowerCase().indexOf('_1.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_2.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_3.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_4.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_5.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_6.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_7.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_8.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_9.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('_10.jpg')!=-1){
//               images[proj].illustrations.push(image);
//             }
//             else if (image.toLowerCase().indexOf('before.jpg')!=-1){
//               images[proj]['before']=image;
//             }
//             else if (image.toLowerCase().indexOf('after.jpg')!=-1){
//               images[proj]['after']=image;
//             }
//           }
//           images[proj].illustrations_isMmultiple = (images[proj].illustrations.length>1)?'yes':0;
//         }
//         for (var proj in images) {
//           gulp.src(paths.portfolio_template.pages)
//               .pipe(handlebars(images[proj]))
//               .pipe(rename(proj + "/index.php"))
//               .pipe(gulp.dest(dests.php+'/'+mainPageUrl+projectName));
//         }
//     }
//     for(var p=0; p<pages.length; p++) {
//       gulp.src(paths.portfolio_template.home)
//         .pipe(handlebars(pages[p]))
//         .pipe(rename(pages[p].page + "/index.php"))
//         .pipe(gulp.dest(dests.php));
//     }
// }
// });

// Watch
// gulp.task('watch', function () {
//     gulp.watch( paths.scss, ['css'] );
//     gulp.watch( paths.js, ['js'] );
//     //gulp.watch( paths.js, ['deps'] );
//     //  gulp.watch( paths.php, ['phpunit'] );
//     gulp.watch( paths.php, ['php'] );
//     gulp.watch( paths.images, ['images'] );
// });


//
//
// gulp.task('default', function (callback) {
//   runSequence('clean',
//     'portfolio_generator_images',
//     'portfolio_generator_tmp',
//     ['php','fonts','css','js'],
//     'deps',
//     'inject-deps',
//     ['images','contentimages'],
//     'portfolio_generator',
//     'watch'
//   );
// });