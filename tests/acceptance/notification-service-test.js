/* eslint no-undef: 0 */
import {test} from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import {authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';
import createFakeToken from '../helpers/create-fake-token';

var options = {
  beforeEach: function() {
    fakeToken = createFakeToken('583231', 600, 'octocat', 'secretbearertoken');

    $.mockjax({
      status: 200,
      type: 'POST',
      url: '/testapi/auth/token',
      dataType: 'json',
      responseText: fakeToken
    });

    $.mockjax({
      status: 200,
      type: 'GET',
      url: '/testapi/github/users/octocat',
      dataType: 'json',
      responseText: {
        login: 'octocat',
        id: 583231,
        avatar_url: '', // eslint-disable-line camelcase
        type: 'User',
        name: 'The Octocat'
      }
    });

    /* eslint-disable camelcase */
    $.mockjax({
      status: 200,
      type: 'GET',
      url: '/testapi/notification/threads',
      dataType: 'json',
      responseText: {
        data: [
          {
            type: "threads",
            id: 111111,
            attributes: {
              thread_url: "http://example.com/fakethread/1111111",
              thread_subscription_url: "http://example.com/fakethread/subscribe/1111111",
              reason: "subscribed",
              updated_at: 1462543600,
              subject_title: "Subject Pull Request #1",
              subject_url: "http://example.com/fakethread/subscribe/1111111",
              subject_type: "Issue",
              repository_owner: "octocat",
              repository_name: "right-pad",
              tags: [
                "octocat",
                "right-pad",
                "amazing",
                "work"
              ]
            }
          }
        ]
      }
    });
    /* eslint-enable camelcase */

    $.mockjax({
      status: 200,
      type: 'GET',
      url: '/testapi/environment/settings/583231',
      dataType: 'json',
      responseText: {
        data: {
          type: "settings",
          id: 583231,
          relationships: {
            'saved-filters': {
              data: []
            }
          }
        },
        included: []
      }
    });
  }
};

moduleForAcceptance('Acceptance | notification service', options);

test('authorization headers are valid', function(assert) {
  assert.expect(4);

  $.mockjax(function(requestSettings) {
    if (/^\/testapi\/github\/notifications.*/.test(requestSettings.url)) {
      return {
        response: function() {
          assert.equal(requestSettings.headers.Authorization, 'Bearer secretbearertoken');
          this.status = 200;
          this.responseText = {};
          this.headers = {'X-Poll-Interval': 0};
        }
      };
    }
    return;  // There was no url match
  });

  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });
});

test('disable polling if header is falsy', function(assert) {
  assert.expect(6);
  var app = this.application;
  container = app.__container__;
  service = container.lookup('service:new-notification');

  loopCtr = 0;
  expPollingValues = [2000, 3000, 3000, 0, 0, 0];

  var interval = 3;

  var pollingHeaders = function(mInterval) {
    return {'X-Poll-Interval': mInterval};
  };

  $.mockjax(function(requestSettings) {
    if (/^\/testapi\/github\/notifications.*/.test(requestSettings.url)) {
      return {
        response: function() {
          assert.equal(service.get('pollingInterval'), expPollingValues[loopCtr]);
          loopCtr += 1;
          this.status = 200;
          this.responseText = {};
          this.headers = pollingHeaders(interval);
          interval = 0;
        }
      };
    }
    return;  // There was no url match
  });

  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });
});

test('process a single notification', function(assert) {
  assert.expect(2);
  var app = this.application;

  $.mockjax({
    status: 200,
    type: 'GET',
    url: /^\/testapi\/github\/notifications.*/,
    dataType: 'json',
    headers: {
      'X-Poll-Interval': 0
    },
    responseText: [
      {id: 11111}
    ]
  });

  $.mockjax({
    status: 200,
    type: 'PUT',
    url: '/testapi/github/notifications',
    dataType: 'json',
    responseText: {}
  });

  $.mockjax(function(requestSettings) {
    if (requestSettings.url === "/testapi/notification/threads/11111") {
      return {
        response: function() {
          assert.ok('Authorization' in requestSettings.headers);
          this.status = 200;
          this.responseText = {
            data: {
              type: 'threads',
              id: 11111
            }
          };
        }
      };
    }
    return;  // There was no url match
  });

  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });
});

test('process multiple notifications', function(assert) {
  assert.expect(4);
  var app = this.application;

  $.mockjax({
    status: 200,
    type: 'GET',
    url: /^\/testapi\/github\/notifications.*/,
    dataType: 'json',
    headers: {
      'X-Poll-Interval': 0
    },
    responseText: [
      {id: 11111},
      {id: 11112}
    ]
  });

  $.mockjax({
    status: 200,
    type: 'PUT',
    url: '/testapi/github/notifications',
    dataType: 'json',
    responseText: {}
  });

  $.mockjax(function(requestSettings) {
    if (requestSettings.url === "/testapi/notification/threads/11111") {
      return {
        response: function() {
          assert.ok('Authorization' in requestSettings.headers);
          this.status = 200;
          this.responseText = {
            data: {
              type: 'threads',
              id: 11111
            }
          };
        }
      };
    }
    return;  // There was no url match
  });

  $.mockjax(function(requestSettings) {
    if (requestSettings.url === "/testapi/notification/threads/11112") {
      return {
        response: function() {
          assert.ok('Authorization' in requestSettings.headers);
          this.status = 200;
          this.responseText = {
            data: {
              type: 'threads',
              id: 11112
            }
          };
        }
      };
    }
    return;  // There was no url match
  });

  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });
});

test('failure to mark all notifications as read', function(assert) {
  assert.expect(2);
  var app = this.application;

  $.mockjax({
    status: 200,
    type: 'GET',
    url: /^\/testapi\/github\/notifications.*/,
    dataType: 'json',
    headers: {
      'X-Poll-Interval': 0
    },
    responseText: [
      {id: 11111}
    ]
  });

  $.mockjax({
    status: 401,
    type: 'PUT',
    url: '/testapi/github/notifications',
    dataType: 'json',
    responseText: {error: "You are not authorized"}
  });

  $.mockjax(function(requestSettings) {
    if (requestSettings.url === "/testapi/notification/threads/11111") {
      return {
        response: function() {
          assert.ok('Authorization' in requestSettings.headers);
          this.status = 200;
          this.responseText = {
            data: {
              type: 'threads',
              id: 11111
            }
          };
        }
      };
    }
    return;  // There was no url match
  });

  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });
});

test('failure to retrieve new notifications', function(assert) {
  assert.expect(0);
  var app = this.application;

  $.mockjax({
    status: 401,
    type: 'GET',
    url: /^\/testapi\/github\/notifications.*/,
    dataType: 'json',
    headers: {
      'X-Poll-Interval': 0
    },
    responseText: [
      {id: 11111}
    ]
  });

  $.mockjax({
    status: 200,
    type: 'PUT',
    url: '/testapi/github/notifications',
    dataType: 'json',
    responseText: {}
  });

  $.mockjax(function(requestSettings) {
    if (requestSettings.url === "/testapi/notification/threads/11111") {
      return {
        response: function() {
          assert.ok('Authorization' in requestSettings.headers);
          this.status = 200;
          this.responseText = {
            data: {
              type: 'threads',
              id: 11111
            }
          };
        }
      };
    }
    return;  // There was no url match
  });

  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });
});
