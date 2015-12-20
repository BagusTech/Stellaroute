/*jshint node:false */
const gulp = require('gulp');
const runSequence = require('run-sequence');
//const browserSync = require('browser-sync');
const path = require('path');
const glob = require('glob');
const ignore = require('ignore');

const Project = require('./gulp/Project');
const doCssTask = require('./gulp/css-task');
const doJsTask = require('./gulp/js-task');
const doImagesTask = require('./gulp/images-task');
//const doBuildTask = require('./gulp/build-task');
//const doPackageTask = require('./gulp/package-task');
const options = require('./gulp/options').loadOptions();

const argsOptions = {
    string: ['env', 'nantPath', 'url'],
    "boolean": ['verbose', 'debug', 'withoutBrowserSync'],
    "default": {
        env: process.env.NODE_ENV || 'development',
        nantPath: '',
        url: 'stellaroute.local'
    }
};
Object.assign(argsOptions.default, options);
const args = require('minimist')(process.argv.slice(2), argsOptions);
args.developmentBuild = args.env !== 'production';

const gitignoreFilter = ignore().addIgnoreFile('.gitignore').createFilter();
//const moduleProjects = glob.sync('Website/DesktopModules/*/')
//                           .filter(gitignoreFilter)
//                           .map((moduleFolder) => {
//                                const moduleProject = new Project(
//                                    path.basename(moduleFolder) + '-module', 
//                                    moduleFolder, 
//                                    { 
//                                        lessFilePath: path.join(moduleFolder, '**/module.less'), 
//                                        stylesDirPath: moduleFolder 
//                                    });
//                                moduleProject.javaScriptFilesGlobs.push('!' + path.join(moduleFolder, '*.Tests/Scripts/**/*.js'));
//                                moduleProject.javaScriptFilesGlobs.push('!' + path.join(moduleFolder, 'packages/**/*.js'));
//                                return moduleProject;
//                           }); */
const themeProjects = glob.sync('website/public/*/')
                          .filter(gitignoreFilter)
                          .map((themeFolder) => new Project(
                              path.basename(themeFolder) + '-theme', 
                              themeFolder,
                              {
                                  stylesDirPath: path.join(themeFolder, 'styles/'),
                                  stylesOutputDirPath: path.join(themeFolder, 'styles/'),
                                  lessFilePath: path.join(themeFolder, '/styles.less'),
                              }));

//const projects = moduleProjects.concat(themeProjects);
const project = new Project(
        'stellaroute',
        'website/public/',
        {
            stylesDirPath: 'website/public/styles/',
            stylesOutputDirPath: 'website/public/styles/',
            lessFilePath: 'website/public/styles//styles.less',
        }
    );

const projects = [project]

if (args.verbose) {
    console.log('args', args);
    console.log('projects', projects);
}

projects.forEach((project) => {
    console.log(project.name);
    gulp.task('css:' + project.name, () => doCssTask(project, args));
    gulp.task('js:' + project.name, () => doJsTask(project, args));
    gulp.task('images:' + project.name, () => doImagesTask(project, args));
    //gulp.task('build:' + project.name, () => doBuildTask(project, args));
    //gulp.task('package:' + project.name, [project.name, 'build:' + project.name], () => doPackageTask(project, args));
    gulp.task(project.name, ['css:' + project.name, 'js:' + project.name, 'images:' + project.name]);
});

function runTasksInSequence(tasks) {
    return function (done) {
        tasks.push(done);
        runSequence.apply(null, tasks);
    };
}

//gulp.task('build', runTasksInSequence(projects.map((p) => 'build:' + p.name)));
//gulp.task('package', runTasksInSequence(moduleProjects.map((p) => 'package:' + p.name).concat(['package:themes'])));

const themeTasks = themeProjects.map((project) => project.name);
gulp.task('themes', themeTasks);
gulp.task('css:themes', themeTasks.map((taskName) => 'css:' + taskName));
gulp.task('js:themes', themeTasks.map((taskName) => 'js:' + taskName));
gulp.task('images:themes', themeTasks.map((taskName) => 'images:' + taskName));
//const themeBuildTasks = themeTasks.map((taskName) => 'build:' + taskName);
//gulp.task('pre-package:themes', runTasksInSequence([themeTasks].concat(themeBuildTasks)));
//gulp.task('package:themes', ['pre-package:themes'], () => doPackageTask(new Project('themes', 'Website/Portals/_default'), args));

//const moduleTasks = moduleProjects.map((project) => project.name);
//gulp.task('modules', moduleTasks);
//gulp.task('css:modules', moduleTasks.map((taskName) => 'css:' + taskName));
//gulp.task('js:modules', moduleTasks.map((taskName) => 'js:' + taskName));
//gulp.task('images:modules', moduleTasks.map((taskName) => 'images:' + taskName));

gulp.task('watch', ['default'], function(done) {
    projects.forEach((project) => {
        gulp.watch(project.lessFilesGlobs, ['css:' + project.name]);
        gulp.watch(project.javaScriptFilesGlobs, ['js:' + project.name]);
    });
    
    //if (args.withoutBrowserSync) {
    //    done();
    //    return;
    //}
    
    //browserSync({
    //    proxy: args.url
    //});

    //// gulp.watch('Website/bin/*.dll', browserSync.reload);
    //// projects.forEach(function(project) {
    ////     gulp.watch(project.viewFilesGlobs, browserSync.reload);
    //// });
    
    done();
});

gulp.task('test', function() {
    console.warn('Testing is not yet implemented');
});

const defaultDependencies = projects.map((p) => p.name);
gulp.task('default', defaultDependencies);
