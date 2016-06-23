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
    // In this case, we're going to consider the 'id' the subscription URL
    // itself.  e.g.
    // https://api.github.com/notifications/threads/120422548/subscription
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.$.ajax({
        url: id,
        method: 'GET',
        headers: _this.get('headers'),
        dataType: 'json',
        success: function(data) {
          Ember.run(null, resolve, data);
        },
        error: function() {
          // There's a weird case where a user may or may not be "subscribed"
          // to a thread initially (even though it shows up as a notification).
          // In this case, we pretend we're subscribed to this thread and move
          // on. If the user later chooses to mute the thread, that will take
          // precedence.
          var data = {
            subscribed: true,
            ignored: false,
            reason: null,
            url: id
          };
          Ember.run(null, resolve, data);
        }
      });
    });
  },

  updateRecord: function(store, type, snapshot) {
    // In this case, we're going to consider the 'id' the subscription URL
    // itself.  e.g.
    // https://api.github.com/notifications/threads/120422548/subscription
    var data = {
      subscribed: snapshot.subscribed,
      ignored: snapshot.ignored
    };
    var id = snapshot.id;
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url: id,
        method: 'PUT',
        headers: _this.get('headers'),
        contentType: 'application/json',
        data: {subscribed: data.subscribed, ignored: data.ignored},
        success: function(data) {
          Ember.run(null, resolve, data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var msg = `Error occurred while attempting to update ${id}`;
          console.error(msg);
          console.error(`Status: ${textStatus}`);
          console.error(`Message: ${errorThrown}`);
          Ember.run(null, reject, msg);
        }
      });
    });
  }
});
