import DS from 'ember-data';
import Ember from 'ember';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default DS.JSONAPIAdapter.extend({
  session: Ember.inject.service(),

  headers: Ember.computed('session.data.authenticated.token', function() {
    var jwt = JWT.create();
    var data = jwt.getTokenData(this.get('session.data.authenticated.token'));
    return {
      Authorization: 'Bearer ' + data.github_token,
      Accept: 'application/json'
    };
  }),

  findRecord: function(store, type, id) {
    // In this case, we're going to consider the 'id' the comment URL itself.
    // e.g.
    // https://api.github.com/repos/andymccurdy/redis-py/issues/comments/221968449
    var _this = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url: id,
        method: 'GET',
        headers: _this.get('headers'),
        success: function(data) {
          resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var msg = `Error occurred while retrieving comment URL ${id}`;
          console.error(msg);
          console.error(`Status: ${textStatus}`);
          console.error(`Message: ${errorThrown}`);
          reject(msg);
        }
      });
    });
  }
});
