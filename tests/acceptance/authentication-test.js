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
