/* eslint no-undef: 0 */
import {test} from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import {currentSession, authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | authentication');

test('users are able to reach the login page when not logged in', function(assert) {
  invalidateSession(this.application);
  visit('/');
  var session = currentSession(this.application);
  andThen(function() {
    assert.equal(currentRouteName(), 'login');
    assert.equal(session.get('isAuthenticated'), false);
  });
});

test('users are able to reach the the notifications page after logging in', function(assert) {
  invalidateSession(this.application);
  visit('/');
  authenticateSession(this.application);
  var session = currentSession(this.application);
  andThen(function() {
    assert.equal(currentRouteName(), 'notifications');
    assert.equal(session.get('isAuthenticated'), true);
  });
});
