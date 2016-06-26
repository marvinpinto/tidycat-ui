/* eslint no-undef: 0 */
import {test} from 'qunit';
import initializeApp from '../helpers/initialize-app';

initializeApp('Acceptance | notification group operations');

test('With nothing initially selected, clicking anywhere in the notification bar selects all items', function(assert) {
  assert.expect(6);

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
