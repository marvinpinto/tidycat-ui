import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  pollingInterval: 2000,
  bearerToken: null,
  notificationsSince: undefined,

  apiUrl: Ember.computed('config.github-api', function() {
    var url = [];
    url.push(config['github-api'].host);
    if (config['github-api'].namespace) {
      url.push(config['github-api'].namespace);
    }
    var baseUrl = url.join('/');
    return baseUrl + "/notifications";
  }),

  initialize: function(bearerToken) {
    this.set('bearerToken', bearerToken);
    this.scheduleNextNotificationCheck();
  },

  scheduleNextNotificationCheck: function() {
    var _this = this;
    if (this.get('pollingInterval')) {
      Ember.run.later((function() {
        _this.getNewNotifications();
      }), this.get('pollingInterval'));
    }
  },

  markAllNotificationsRead: function(_this) {
    var d = new Date();
    Ember.$.ajax({
      url: _this.get('apiUrl'),
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({last_read_at: d.toISOString()}),  // eslint-disable-line camelcase
      headers: {
        Authorization: `Bearer ${_this.get('bearerToken')}`
      },
      success: function() {
        console.debug('Successfully marked all notifications as read');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error marking notifications as read');
        console.error(`Status: ${textStatus}`);
        console.error(`Message: ${errorThrown}`);
      }
    });
  },

  getNewNotifications: function() {
    var today = new Date();
    var _this = this;
    var twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    var _since = this.get('notificationsSince');

    Ember.$.ajax({
      url: _this.get('apiUrl'),
      method: 'GET',

      data: {
        all: true,
        since: (_since === undefined ? twoWeeksAgo.toISOString() : _since)
      },

      headers: {
        Authorization: `Bearer ${_this.get('bearerToken')}`
      },

      success: function(data) {
        Ember.$.each(data, function(index, value) {
          Ember.run(function() {
            var thread = value.id;
            console.debug("Looking up info for notification thread " + thread);
            _this.get('store').find('thread', thread);
          });
        });
        // Mark all notifications as read
        _this.get('markAllNotificationsRead')(_this);
      },

      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error occurred while checking for new GitHub notifications");
        console.error("Status: " + textStatus);
        console.error("Message: " + errorThrown);
      },

      complete: function(jqXHR) {
        var newPollingInterval = 0;
        newPollingInterval = jqXHR.getResponseHeader('X-Poll-Interval');
        var now = new Date();
        newPollingInterval *= 1000;
        if (_this.get('pollingInterval') !== newPollingInterval) {
          console.debug("Setting the new polling frequency to " + newPollingInterval + " milliseconds");
          console.debug("Old polling frequency was " + _this.get('pollingInterval') + " milliseconds");
          _this.set('pollingInterval', newPollingInterval);
        }
        _this.set('notificationsSince', now.toISOString());
      }
    });

    this.scheduleNextNotificationCheck();
  }

});
