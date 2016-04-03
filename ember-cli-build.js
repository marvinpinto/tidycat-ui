var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    hinting: false,
    'ember-font-awesome': {
      useScss: true
    }
  });
  app.import('bower_components/jquery-mockjax/dist/jquery.mockjax.js');
  return app.toTree();
};
