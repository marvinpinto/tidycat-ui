import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default DS.JSONAPIAdapter.extend({
  session: Ember.inject.service(),
  namespace: config['github-api'].namespace,
  host: config['github-api'].host,

  headers: Ember.computed('session.data.authenticated.token', function() {
    var jwt = JWT.create();
    var data = jwt.getTokenData(this.get('session.data.authenticated.token'));
    return {
      Authorization: 'Bearer ' + data.github_token,
      Accept: 'application/json'
    };
  }),

  pathForType: function() {
    return "notifications/threads";
  }

});
