const gulp = require('gulp');
const debug = require('gulp-debug');
const gulpif = require('gulp-if');
const shell = require('gulp-shell');
const imagemin = require('gulp-imagemin');
const errorHandler = require('./errorHandler');

module.exports = function (project, args) {
    const developmentBuild = args.developmentBuild;
    return gulp.src(project.imageFileGlobs)
               .pipe(errorHandler(args))
               .pipe(gulpif(args.debug, debug({ title: project.name + '-images:' })))
               .pipe(shell(['attrib -r "<%= file.path %>"'])) // remove readonly attribute
               .pipe(imagemin({
                   optimizationLevel: developmentBuild ? 0 : 7,
                   progressive: true,
                   interlaced: true,
                   svgoPlugins: [{ removeViewBox: false }, { removeUselessDefs: false }]
               }))
               .pipe(gulp.dest(project.path));
};