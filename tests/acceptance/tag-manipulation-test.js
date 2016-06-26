/* eslint no-undef: 0 */
import Ember from 'ember';
import {test} from 'qunit';
import initializeApp from '../helpers/initialize-app';

initializeApp('Acceptance | tag manipulation');

test('A newly added tag is persisted after the alert times out and closes', function(assert) {
  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      assert.equal(dataObj.data.id, "111112");
      assert.equal(dataObj.data.attributes.tags.length, 5);
      assert.ok(dataObj.data.attributes.tags.indexOf("new tag") >= 0);
      assert.equal(dataObj.data.type, "threads");
      start();
      return true;
    },
    responseText: {
      meta: {
        message: 'Thread 111112 updated successfully'
      }
    }
  });

  assert.expect(4);
  stop();
  click('.notification-item:eq(1) .select2-selection');
  fillIn('.notification-item:eq(1) .select2-search__field', 'new tag');
  keyEvent('.notification-item:eq(1) .select2-search__field', 'keydown', 13);
});

test('A newly added tag is persisted after the alert is manually closed by the user', function(assert) {
  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      assert.equal(dataObj.data.id, "111112");
      assert.equal(dataObj.data.attributes.tags.length, 5);
      assert.ok(dataObj.data.attributes.tags.indexOf("new tag") >= 0);
      assert.equal(dataObj.data.type, "threads");
      start();
      return true;
    },
    responseText: {
      meta: {
        message: 'Thread 111112 updated successfully'
      }
    }
  });

  assert.expect(4);
  stop();
  click('.notification-item:eq(1) .select2-selection');
  fillIn('.notification-item:eq(1) .select2-search__field', 'new tag').then(function() {
    Ember.run.later(function() {
      // The reasoning for this nasty async call here is that the "close" link
      // is removed after the promise resolves. This is a problem because these
      // tests wait for a promise to resolve before moving on to the next step.
      // By the time it gets to the next step, the "close" link is no longer
      // present. So in order to interact with this "close" link, I need to
      // fire an event some time before I know the close link will present
      // itself.
      //
      // This isn't a great solution but will have to do until something better
      // is possible.
      find('#floating-alert .close').click();
    }, 1500);
  });
  keyEvent('.notification-item:eq(1) .select2-search__field', 'keydown', 13);
});

test('A removed tag is persisted after alert times out and closes', function(assert) {
  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      assert.equal(dataObj.data.id, "111112");
      assert.equal(dataObj.data.attributes.tags.length, 3);
      assert.ok(dataObj.data.attributes.tags.indexOf("thread2") === -1);
      assert.equal(dataObj.data.type, "threads");
      start();
      return true;
    },
    responseText: {
      meta: {
        message: 'Thread 111112 updated successfully'
      }
    }
  });

  assert.expect(4);
  stop();
  click('.notification-item:eq(1) .select2-selection__choice[title="thread2"] .select2-selection__choice__remove');
});

test('A removed tag is persisted after the alert is manually closed by the user', function(assert) {
  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      assert.equal(dataObj.data.id, "111112");
      assert.equal(dataObj.data.attributes.tags.length, 3);
      assert.ok(dataObj.data.attributes.tags.indexOf("thread2") === -1);
      assert.equal(dataObj.data.type, "threads");
      start();
      return true;
    },
    responseText: {
      meta: {
        message: 'Thread 111112 updated successfully'
      }
    }
  });

  assert.expect(4);
  stop();
  andThen(function() {
    Ember.run.later(function() {
      // The reasoning for this nasty async call here is that the "close" link
      // is removed after the promise resolves. This is a problem because these
      // tests wait for a promise to resolve before moving on to the next step.
      // By the time it gets to the next step, the "close" link is no longer
      // present. So in order to interact with this "close" link, I need to
      // fire an event some time before I know the close link will present
      // itself.
      //
      // This isn't a great solution but will have to do until something better
      // is possible.
      find('#floating-alert .close').click();
    }, 1500);
  });
  click('.notification-item:eq(1) .select2-selection__choice[title="thread2"] .select2-selection__choice__remove');
});

test('Clicking the undo link removes a newly added tag from the model', function(assert) {
  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      assert.equal(dataObj.data.id, "111112");
      assert.equal(dataObj.data.attributes.tags.length, 4);
      assert.ok(dataObj.data.attributes.tags.indexOf("new tag") === -1);
      assert.equal(dataObj.data.type, "threads");
      start();
      return true;
    },
    responseText: {
      meta: {
        message: 'Thread 111112 updated successfully'
      }
    }
  });

  assert.expect(4);
  stop();
  click('.notification-item:eq(1) .select2-selection');
  fillIn('.notification-item:eq(1) .select2-search__field', 'new tag').then(function() {
    Ember.run.later(function() {
      // The reasoning for this nasty async call here is that the "close" link
      // is removed after the promise resolves. This is a problem because these
      // tests wait for a promise to resolve before moving on to the next step.
      // By the time it gets to the next step, the "close" link is no longer
      // present. So in order to interact with this "close" link, I need to
      // fire an event some time before I know the close link will present
      // itself.
      //
      // This isn't a great solution but will have to do until something better
      // is possible.
      find('#floating-alert #undo-link').click();
    }, 1500);
  });
  keyEvent('.notification-item:eq(1) .select2-search__field', 'keydown', 13);
});

test('Clicking the undo link adds a newly-removed tag back to the model', function(assert) {
  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      assert.equal(dataObj.data.id, "111112");
      assert.equal(dataObj.data.attributes.tags.length, 4);
      assert.ok(dataObj.data.attributes.tags.indexOf("thread2") >= 0);
      assert.equal(dataObj.data.type, "threads");
      start();
      return true;
    },
    responseText: {
      meta: {
        message: 'Thread 111112 updated successfully'
      }
    }
  });

  assert.expect(4);
  stop();
  Ember.run.later(function() {
    // The reasoning for this nasty async call here is that the "close" link
    // is removed after the promise resolves. This is a problem because these
    // tests wait for a promise to resolve before moving on to the next step.
    // By the time it gets to the next step, the "close" link is no longer
    // present. So in order to interact with this "close" link, I need to
    // fire an event some time before I know the close link will present
    // itself.
    //
    // This isn't a great solution but will have to do until something better
    // is possible.
    find('#floating-alert #undo-link').click();
  }, 1500);
  click('.notification-item:eq(1) .select2-selection__choice[title="thread2"] .select2-selection__choice__remove');
});

test('The alert error message is shown when an attempt at persisting the data fails', function(assert) {
  Ember.$.mockjax({
    status: 401,
    type: 'PATCH',
    url: '/testapi/notification/threads/111112',
    responseText: {
      meta: {
        message: 'Error updating thread 111112'
      }
    }
  });

  assert.expect(1);
  stop();
  Ember.run.later(function() {
    // The reasoning for this nasty async call here is that the "close" link
    // is removed after the promise resolves. This is a problem because these
    // tests wait for a promise to resolve before moving on to the next step.
    // By the time it gets to the next step, the "close" link is no longer
    // present. So in order to interact with this "close" link, I need to
    // fire an event some time before I know the close link will present
    // itself.
    //
    // This isn't a great solution but will have to do until something better
    // is possible.
    var errText = "^Ran into an error while trying to write your saved information back upstream. If this persists, try logging out and back in again.";
    var matcher = new RegExp(errText);
    var errorAlert = find('#floating-alert');
    assert.ok(matcher.test(errorAlert.text()));
    start();
  }, 4000);
  click('.notification-item:eq(1) .select2-selection__choice[title="thread2"] .select2-selection__choice__remove');
});
