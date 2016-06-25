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
                "thread1",
                "one",
                "two",
                "three"
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
                "thread2",
                "three",
                "four",
                "five"
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
                "thread3",
                "five",
                "six",
                "seven"
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

moduleForAcceptance('Acceptance | filter manipulation', options);

test('An initially empty tag bar results in all the model threads being displayed', function(assert) {
  assert.expect(1);
  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });

  andThen(function() {
    var notificationList = find('.notification-items .notification-item');
    assert.equal(notificationList.size(), 3, 'All three notification items are displayed');
  });
});

test('Adding and then removing a filter from the filter bar results in expected behaviour', function(assert) {
  assert.expect(3);
  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });

  andThen(function() {
    var notificationList = find('.notification-items .notification-item');
    assert.equal(notificationList.size(), 3, 'All three notification items are displayed');
  });

  click('.tag-filter-bar .select2-selection');
  fillIn('.tag-filter-bar .select2-search__field', 'three');
  keyEvent('.tag-filter-bar .select2-search__field', 'keydown', 13);

  andThen(function() {
    var notificationList = find('.notification-items .notification-item');
    assert.equal(notificationList.size(), 2, 'The two filtered items are displayed');
  });

  click('.tag-filter-bar .select2-selection__choice[title="three"] .select2-selection__choice__remove');

  andThen(function() {
    var notificationList = find('.notification-items .notification-item');
    assert.equal(notificationList.size(), 3, 'All three notification items are displayed');
  });
});
