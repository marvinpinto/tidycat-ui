/* globals blanket, module */

var options = {
  modulePrefix: 'tidycat-ui',
  filter: '//.*tidycat-ui/.*/',
  antifilter: '//.*(tests|template).*/',
  loaderExclusions: [],
  enableCoverage: true,
  branchTracking: true,
  cliOptions: {
    reporters: ['lcov'],
    autostart: true,
    lcovOptions: {
      // automatically skip missing files, relative to project's root dir
      excludeMissingFiles: true, // default false

      // provide a function to rename es6 modules to a file path
      renamer: function(moduleName) {
        // return a falsy value to skip given module
        if (moduleName === 'unwanted') {
          return;
        }

        var expression = /^tidycat-ui/;
        return moduleName.replace(expression, 'app') + '.js';
      }
    }
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
