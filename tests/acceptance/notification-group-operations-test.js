/* eslint no-undef: 0 */
import Ember from 'ember';
import {test} from 'qunit';
import moduleForAcceptance from 'tidycat-ui/tests/helpers/module-for-acceptance';
import {authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';
import createFakeToken from '../helpers/create-fake-token';

var options = {
  beforeEach: function() {
    var fakeToken = createFakeToken('583231', 600, 'octocat', 'secretbearertoken');

    Ember.$.mockjax({
      status: 200,
      type: 'POST',
      url: '/testapi/auth/token',
      dataType: 'json',
      responseText: fakeToken
    });

    Ember.$.mockjax({
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
    Ember.$.mockjax({
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
              tags: [
                "octocat",
                "right-pad",
                "amazing",
                "work",
                "thread1"
              ]
            }
          },
          {
            type: "threads",
            id: 111112,
            attributes: {
              thread_url: "http://example.com/fakethread/1111112",
              thread_subscription_url: "http://example.com/fakethread/subscribe/1111112",
              reason: "subscribed",
              updated_at: 1462543600,
              tags: [
                "octocat",
                "right-pad",
                "amazing",
                "work",
                "thread2"
              ]
            }
          },
          {
            type: "threads",
            id: 111113,
            attributes: {
              thread_url: "http://example.com/fakethread/1111113",
              thread_subscription_url: "http://example.com/fakethread/subscribe/1111113",
              reason: "subscribed",
              updated_at: 1462543600,
              tags: [
                "octocat",
                "right-pad",
                "amazing",
                "work",
                "thread3"
              ]
            }
          }
        ]
      }
    });
    /* eslint-enable camelcase */

    Ember.$.mockjax({
      status: 200,
      url: /^\/testapi\/github\/notifications.*/,
      dataType: 'json',
      responseText: {},
      headers: {
        'X-Poll-Interval': 0
      }
    });
  }
};

moduleForAcceptance('Acceptance | notification group operations', options);

test('With nothing initially selected, clicking anywhere in the notification bar selects all items', function(assert) {
  assert.expect(6);
  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });

  andThen(function() {
    // Assert that all the cbeckboxes are initially unchecked
    var notificationList = find('.notification-items');
    assert.equal(notificationList.find('.notification-item:eq(0) :input.notification-checkbox').prop('checked'), false);
    assert.equal(notificationList.find('.notification-item:eq(1) :input.notification-checkbox').prop('checked'), false);
    assert.equal(notificationList.find('.notification-item:eq(2) :input.notification-checkbox').prop('checked'), false);
  });

  click('.panel-heading');

  andThen(function() {
    // Assert that all the cbeckboxes are now checked
    var notificationList = find('.notification-items');
    assert.equal(notificationList.find('.notification-item:eq(0) :input.notification-checkbox').prop('checked'), true);
    assert.equal(notificationList.find('.notification-item:eq(1) :input.notification-checkbox').prop('checked'), true);
    assert.equal(notificationList.find('.notification-item:eq(2) :input.notification-checkbox').prop('checked'), true);
  });
});

test('With one thing initially selected, clicking anywhere in the notification bar selects all items', function(assert) {
  assert.expect(6);
  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });

  click('.notification-items .notification-item:eq(1) :input.notification-checkbox');

  andThen(function() {
    // Assert that all the cbeckboxes are initially unchecked
    var notificationList = find('.notification-items');
    assert.equal(notificationList.find('.notification-item:eq(0) :input.notification-checkbox').prop('checked'), false);
    assert.equal(notificationList.find('.notification-item:eq(1) :input.notification-checkbox').prop('checked'), true);
    assert.equal(notificationList.find('.notification-item:eq(2) :input.notification-checkbox').prop('checked'), false);
  });

  click('.panel-heading');

  andThen(function() {
    // Assert that all the cbeckboxes are now checked
    var notificationList = find('.notification-items');
    assert.equal(notificationList.find('.notification-item:eq(0) :input.notification-checkbox').prop('checked'), true);
    assert.equal(notificationList.find('.notification-item:eq(1) :input.notification-checkbox').prop('checked'), true);
    assert.equal(notificationList.find('.notification-item:eq(2) :input.notification-checkbox').prop('checked'), true);
  });
});
