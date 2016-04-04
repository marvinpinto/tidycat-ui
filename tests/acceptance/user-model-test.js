/* eslint no-undef: 0 */
import {test} from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import {currentSession, authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';
import createFakeToken from '../helpers/create-fake-token';

moduleForAcceptance('Acceptance | user model', options);

test('users are logged out if their bearer token is invalid', function(assert) {
  fakeToken = createFakeToken('583231', 600, 'octocat', 'secretbearertoken');

  $.mockjax({
    status: 200,
    type: 'POST',
    url: '/testapi/auth/token',
    dataType: 'json',
    responseText: fakeToken
  });

  $.mockjax({
    status: 401,
    type: 'GET',
    url: '/testapi/github/users/octocat',
    dataType: 'json',
    responseText: {
      error: 'invalid bearer token'
    }
  });

  var app = this.application;
  var session = currentSession(app);
  invalidateSession(app);
  visit('/');
  andThen(function() {
    authenticateSession(app);
  });

  andThen(function() {
    assert.equal(currentRouteName(), 'login');
    assert.equal(session.get('isAuthenticated'), false);
    assert.equal(find('ul.nav li:first').text().trim(), 'Sign in with GitHub');
  });
});
