const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

module.exports = function (args) {
    const plumberConfig = args.developmentBuild ? { errorHandler: notify.onError({ title: '<%= error.plugin %> Error', message: '<%= error.message %>' }) } : {};
    return plumber(plumberConfig);
}