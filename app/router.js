import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

/* eslint array-callback-return: 0 */
Router.map(function() {
  this.route('notifications');
  this.route('login', {path: '/'});
});

export default Router;
