/* eslint no-undef: 0 */
import Ember from 'ember';
import {module, test} from 'qunit';
import {authenticateSession, invalidateSession} from '../helpers/ember-simple-auth';
import startApp from '../helpers/start-app';
import sinon from 'sinon';

var application;

module('Authentication', {
  setup: function() {
    application = startApp();
    application.xhr = sinon.useFakeXMLHttpRequest();
    application.server = sinon.fakeServer.create();
    application.server.autoRespond = true;
    sinon.spy(Ember.$, 'ajax');
  },
  teardown: function() {
    Ember.$.ajax.restore();
    application.xhr.restore();
    Ember.run(application, application.destroy);
  }
});

test('users are able to reach the login page when not logged in', function(assert) {
  visit('/');
  andThen(function() {
    invalidateSession(application);
  });
  andThen(function() {
    assert.equal(currentRouteName(), 'login');
  });
});

test('users are able to reach the the notifications page after logging in', function(assert) {
  visit('/');
  andThen(function() {
    authenticateSession(application);
  });
  andThen(function() {
    assert.equal(currentRouteName(), 'login');
  });
});
