/* eslint no-undef: 0 */
import {test} from 'qunit';
import initializeApp from '../helpers/initialize-app';

initializeApp('Acceptance | filter manipulation');

test('An initially empty tag bar results in all the model threads being displayed', function(assert) {
  assert.expect(1);

  andThen(function() {
    var notificationList = find('.notification-items .notification-item');
    assert.equal(notificationList.size(), 3, 'All three notification items are displayed');
  });
});

test('Adding and then removing a filter from the filter bar results in expected behaviour', function(assert) {
  assert.expect(3);

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
