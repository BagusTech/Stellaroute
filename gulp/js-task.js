const gulp = require('gulp');
const debug = require('gulp-debug');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const errorHandler = require('./errorHandler');

module.exports = function (project, args) {
    const developmentBuild = args.developmentBuild;
    var inputStream = gulp.src(project.javaScriptFilesGlobs)
                          .pipe(errorHandler(args))
                          .pipe(gulpif(args.debug, debug({ title: project.name + '-js:' })))
                          .pipe(gulpif(developmentBuild, sourcemaps.init()));

    if (developmentBuild) {
        inputStream = inputStream
                                 //.pipe(jscs({ esnext: true, configPath: '.jscsrc' }))
                                 //.pipe(jshint())
                                 //.pipe(jshint.reporter('jshint-stylish'))
                                 //.pipe(jshint.reporter('fail'))
                                 .pipe(eslint())
                                 .pipe(eslint.format())
                                 .pipe(eslint.failOnError());
    }

    return inputStream.pipe(babel())
                      .pipe(uglify())
                      .pipe(rename({ suffix: '.min' }))
                      .pipe(gulpif(developmentBuild, sourcemaps.write('.')))
                      .pipe(gulp.dest(project.path));
};