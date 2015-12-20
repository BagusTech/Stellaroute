const path = require('path');

module.exports = function(name, projectPath, options) {
    const self = this;
    self.name = name;
    self.path = projectPath;

    options = options || {};
    self.imageExtensions = options.imageExtensions || ['jpg', 'gif', 'png', 'svg'];
    self.imageFileGlobs = self.imageExtensions.map((ext) => path.join(projectPath, '**/*.' + ext));
    self.stylesDirPath = options.stylesDirPath || path.join(projectPath, 'styles/');
    self.stylesOutputDirPath = options.stylesOutputDirPath || projectPath;
    self.lessFilePath = options.lessFilePath || path.join(self.stylesDirPath, 'styles.less');
    self.lessFilesGlobs = [path.join(self.stylesDirPath, '**/*.less')];
    self.viewFilesGlobs = [path.join(projectPath, '**/*.ascx')];
    self.buildFilesGlobs = [path.join(projectPath, '**/*.build')];
    self.solutionFilesGlobs = [path.join(projectPath, '**/*.sln')];
    self.javaScriptFilesGlobs = [path.join(projectPath, '**/*.js'), '!' + path.join(projectPath, '**/*.min.js')];
};