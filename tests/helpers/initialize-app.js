/* eslint no-undef: 0 */
import Ember from 'ember';
import {module} from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import createFakeToken from '../helpers/create-fake-token';
import {authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';

export default function(name, options = {}) {
  module(name, {

    beforeEach() {
      this.application = startApp();
      Ember.$.mockjaxSettings.logging = false;
      Ember.$.mockjaxSettings.responseTime = 1;

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

      // Apply any additional pre-test options supplied via the test runner
      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }

      var app = this.application;
      invalidateSession(app);
      visit('/');

      andThen(function() {
        authenticateSession(app);
      });
    },

    afterEach() {
      // Apply any additional post-test options supplied via the test runner
      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }

      destroyApp(this.application);
      Ember.$.mockjax.clear();
    }

  });
}
