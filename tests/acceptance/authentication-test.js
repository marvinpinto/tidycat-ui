/* eslint no-undef: 0 */
import {test} from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import {currentSession, authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';
import createFakeToken from '../helpers/create-fake-token';

moduleForAcceptance('Acceptance | authentication');

test('users are able to reach the login page when not logged in', function(assert) {
  invalidateSession(this.application);
  visit('/');
  var session = currentSession(this.application);
  andThen(function() {
    assert.equal(currentRouteName(), 'login');
    assert.equal(session.get('isAuthenticated'), false);
    assert.equal(find('ul.nav li:eq(0)').text().trim(), 'Sign in with GitHub');
  });
});

test('users are able to log in with a valid jwt', function(assert) {
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

  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });

  var session = currentSession(app);
  andThen(function() {
    assert.equal(currentRouteName(), 'notifications');
    assert.equal(session.get('isAuthenticated'), true);
    assert.equal(find('ul.nav li:eq(0)').text().trim(), 'Alerts');
    assert.equal(find('ul.nav li:eq(1)').text().trim(), 'octocat');
    assert.equal(find('ul.nav li:eq(2)').text().trim(), 'Sign out');
  });
});

test('users are not able to log in with an expired jwt', function(assert) {
  fakeToken = createFakeToken('583231', -600, 'octocat', 'secretbearertoken');

  $.mockjax({
    status: 200,
    type: 'POST',
    url: '/testapi/auth/token',
    dataType: 'json',
    responseText: fakeToken
  });

  var app = this.application;
  invalidateSession(app);
  visit('/');

  andThen(function() {
    authenticateSession(app);
  });

  var session = currentSession(app);
  andThen(function() {
    assert.equal(currentRouteName(), 'login');
    assert.equal(session.get('isAuthenticated'), false);
    assert.equal(find('ul.nav li:first').text().trim(), 'Sign in with GitHub');
  });
});
