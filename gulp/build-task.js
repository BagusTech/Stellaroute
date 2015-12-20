/* jshint node:true */
const gulp = require('gulp');
const debug = require('gulp-debug');
const gulpif = require('gulp-if');
const msbuild = require('gulp-msbuild');
const errorHandler = require('./errorHandler');

module.exports = function (project, args) {
    const developmentBuild = args.developmentBuild;
    return gulp.src(project.solutionFilesGlobs)
               .pipe(errorHandler(args))
               .pipe(gulpif(args.debug, debug({ title: project.name + '-build:' })))
               .pipe(msbuild({
                   errorOnFail: true,
                   stdout: true,
                   verbosity: args.verbose ? 'detailed' : 'minimal',
                   targets: ['Build'],
                   toolsVersion: 14.0,
                   configuration: developmentBuild ? 'Debug' : 'Release',
               }));
};