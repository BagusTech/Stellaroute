const gulp = require('gulp');
const filter = require('gulp-filter');
const debug = require('gulp-debug');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minifyCss = require('gulp-minify-css');
const bless = require('gulp-bless');
//const browserSync = require('browser-sync');
const errorHandler = require('./errorHandler');

module.exports = function (project, args) {
    const developmentBuild = args.developmentBuild;
    return gulp.src(project.lessFilePath)
               .pipe(errorHandler(args))
               .pipe(gulpif(args.debug, debug({ title: project.name + '-css:' })))
               .pipe(gulpif(developmentBuild, sourcemaps.init()))
               .pipe(less())
               .pipe(postcss([autoprefixer({ browsers: ['last 2 version', 'ie >= 8'] })]))
               .pipe(gulpif(!developmentBuild, minifyCss({ compatibility: 'ie8' })))
               .pipe(gulpif(developmentBuild, sourcemaps.write('.')))
               .pipe(gulpif(!developmentBuild, bless()))
               .pipe(gulp.dest(project.stylesOutputDirPath));
               //.pipe(filter('**/*.css')) // don't pass source-map files to browser sync
               //.pipe(gulpif(developmentBuild, browserSync.reload({ stream: true })));
};