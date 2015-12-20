/* jshint node:true */
const gulp = require('gulp');
const debug = require('gulp-debug');
const gulpif = require('gulp-if');
const path = require('path');
const shell = require('gulp-shell');
const errorHandler = require('./errorHandler');

module.exports = function (project, args) {
    const nant = '"' + path.join(args.nantPath, 'nant') + '"';
    if (args.verbose) {
        console.log(project.name + ':nant', nant, project.buildFilesGlobs);
    }

    return gulp.src(project.buildFilesGlobs)
               .pipe(errorHandler(args))
               .pipe(gulpif(args.debug, debug({ title: project.name + '-package:' })))
               .pipe(shell([nant + ' -buildfile:"<%= file.path %>" -D:testBuild=false']));
};