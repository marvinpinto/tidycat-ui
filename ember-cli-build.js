var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    hinting: false,
    'ember-font-awesome': {
      useScss: true
    },
    sassOptions: {
      precision: 10
    }
  });
  app.import('bower_components/jquery-mockjax/dist/jquery.mockjax.js');
  app.import('bower_components/select2/dist/js/select2.full.js');
  return app.toTree();
};
