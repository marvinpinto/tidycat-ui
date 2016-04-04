import {module} from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import Ember from 'ember';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
      Ember.$.mockjaxSettings.logging = false;
      Ember.$.mockjaxSettings.responseTime = 1;
    },

    afterEach() {
      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }
      destroyApp(this.application);
      Ember.$.mockjax.clear();
    }
  });
}
