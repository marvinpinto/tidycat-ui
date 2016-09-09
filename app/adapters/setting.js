import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  session: Ember.inject.service(),
  namespace: config['environment-api'].namespace,
  host: config['environment-api'].host,

  headers: Ember.computed('session.data.authenticated.token', function() {
    return {
      Authorization: 'Bearer ' + this.get('session.data.authenticated.token'),
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  })

});
