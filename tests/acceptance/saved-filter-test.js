/* eslint no-undef: 0 */
import Ember from 'ember';
import {test} from 'qunit';
import initializeApp from '../helpers/initialize-app';

initializeApp('Acceptance | saved filter');

test('Adding a brand new saved search filter saves all the currently entered filtered tags under this new key', function(assert) {
  assert.expect(9);

  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/environment/settings/583231',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      var sf1 = {
        id: 'my-saved-filter-1',
        type: 'saved-filters',
        attributes: {
          tags: ['one', 'two']
        }
      };
      var sf2 = {
        id: 'my-saved-filter-2',
        type: 'saved-filters',
        attributes: {
          tags: ['two', 'three']
        }
      };
      var sf3 = {
        id: 'saved-three',
        type: 'saved-filters',
        attributes: {
          tags: ['three']
        }
      };

      var returnedData = dataObj.data.relationships['saved-filters'].data;
      assert.equal(dataObj.data.id, "583231");
      assert.equal(dataObj.data.type, "settings");
      assert.equal(returnedData.length, 3, "there are three saved filters in the list");

      var sf1Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-1');
      assert.ok(sf1Pos >= 0, "the list contains saved-filter-1");
      assert.deepEqual(returnedData[sf1Pos], sf1, 'The saved-filter-1 objects are identical');

      var sf2Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-2');
      assert.ok(sf2Pos >= 0, "the list contains saved-filter-2");
      assert.deepEqual(returnedData[sf2Pos], sf2, 'The saved-filter-2 objects are identical');

      var sf3Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('saved-three');
      assert.ok(sf3Pos >= 0, "the list contains saved-three");
      assert.deepEqual(returnedData[sf3Pos], sf3, 'The saved-three objects are identical');
      return true;
    },
    responseText: {
      meta: {
        message: 'Success!'
      }
    }
  });

  // Filter all notifications using the keyword 'three'
  click('.tag-filter-bar .select2-selection');
  fillIn('.tag-filter-bar .select2-search__field', 'three');
  keyEvent('.tag-filter-bar .select2-search__field', 'keydown', 13); // enter

  // Create a saved-search filter named 'saved-three'
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  fillIn('.saved-filter-bar .select2-search__field', 'saved-three');
  keyEvent('.saved-filter-bar .select2-search__field', 'keydown', 13); // enter
  triggerEvent('.saved-filter-bar select', 'select2:select', {params: {data: {id: "saved-three"}}});
});

test('When an already-present saved search filter is selected, all the filtered tags are replaced with this key\'s values', function(assert) {
  assert.expect(2);

  // Filter all notifications using the keyword 'three'
  click('.tag-filter-bar .select2-selection');
  fillIn('.tag-filter-bar .select2-search__field', 'three');
  keyEvent('.tag-filter-bar .select2-search__field', 'keydown', 13); // enter

  andThen(function() {
    assert.deepEqual(find('.tag-filter-bar select').val(), ['three'], "the current filter is set to 'three'");
  });

  // Choose 'my-saved-filter-1' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:first');

  andThen(function() {
    assert.deepEqual(find('.tag-filter-bar select').val(), ['one', 'two'], "the filter bar has been updated with the new values");
  });
});

test('When the saved search filter is cleared, all the filtered tags are cleared as well', function(assert) {
  assert.expect(2);

  // Choose 'my-saved-filter-1' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:first');

  andThen(function() {
    assert.deepEqual(find('.tag-filter-bar select').val(), ['one', 'two'], "the filter bar has been updated with the new values");
  });

  click('.saved-filter-bar .select2-selection__rendered .select2-selection__clear');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 27); // escape

  andThen(function() {
    assert.equal(find('.tag-filter-bar select').val(), null, "the filter bar is empty");
  });
});

test('When the tag filter bar is updated while the saved search bar is empty, these values are not persisted', function(assert) {
  assert.expect(2);

  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/environment/settings/583231',
    data: function() {
      assert.fail(1, 2, 'Settings should not be persisted');
      return true;
    },
    responseText: {
      meta: {
        message: 'Success!'
      }
    }
  });

  // Filter all notifications using the keyword 'three'
  click('.tag-filter-bar .select2-selection');
  fillIn('.tag-filter-bar .select2-search__field', 'three');
  keyEvent('.tag-filter-bar .select2-search__field', 'keydown', 13); // enter

  andThen(function() {
    assert.equal(find('.saved-filter-bar select').val(), null, "nothing is currently selected in the saved filter bar");
    assert.deepEqual(find('.tag-filter-bar select').val(), ['three'], "the tag filter bar contains the filter 'three'");
  });
});

test('When a new tag is added to the tag filter bar while the saved search bar is not empty, these values are persisted', function(assert) {
  assert.expect(11);

  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/environment/settings/583231',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      var sf1 = {
        id: 'my-saved-filter-1',
        type: 'saved-filters',
        attributes: {
          tags: ['one', 'two', 'three']
        }
      };
      var sf2 = {
        id: 'my-saved-filter-2',
        type: 'saved-filters',
        attributes: {
          tags: ['two', 'three']
        }
      };

      var returnedData = dataObj.data.relationships['saved-filters'].data;
      assert.equal(dataObj.data.id, "583231");
      assert.equal(dataObj.data.type, "settings");
      assert.equal(returnedData.length, 2, "there are three saved filters in the list");

      var sf1Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-1');
      assert.ok(sf1Pos >= 0, "the list contains saved-filter-1");
      assert.deepEqual(returnedData[sf1Pos], sf1, 'The saved-filter-1 objects are identical');

      var sf2Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-2');
      assert.ok(sf2Pos >= 0, "the list contains saved-filter-2");
      assert.deepEqual(returnedData[sf2Pos], sf2, 'The saved-filter-2 objects are identical');
      return true;
    },
    responseText: {
      meta: {
        message: 'Success!'
      }
    }
  });

  // Choose 'my-saved-filter-1' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:first');

  andThen(function() {
    assert.equal(find('.saved-filter-bar select').val(), 'my-saved-filter-1', "'my-saved-filter-1' is the currently selected saved filter");
    assert.deepEqual(find('.tag-filter-bar select').val(), ['one', 'two'], "the tag filter bar contains the correct filters");
  });

  // Add the filter 'three' to the filter list
  click('.tag-filter-bar .select2-selection');
  fillIn('.tag-filter-bar .select2-search__field', 'three');
  keyEvent('.tag-filter-bar .select2-search__field', 'keydown', 13); // enter

  andThen(function() {
    assert.equal(find('.saved-filter-bar select').val(), 'my-saved-filter-1', "'my-saved-filter-1' is the currently selected saved filter");
    assert.deepEqual(find('.tag-filter-bar select').val(), ['one', 'two', 'three'], "the tag filter bar contains the correct filters");
  });
});

test('When a tag is removed from the tag filter bar while the saved search bar is not empty, these values are persisted', function(assert) {
  assert.expect(11);

  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/environment/settings/583231',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      var sf1 = {
        id: 'my-saved-filter-1',
        type: 'saved-filters',
        attributes: {
          tags: ['one']
        }
      };
      var sf2 = {
        id: 'my-saved-filter-2',
        type: 'saved-filters',
        attributes: {
          tags: ['two', 'three']
        }
      };

      var returnedData = dataObj.data.relationships['saved-filters'].data;
      assert.equal(dataObj.data.id, "583231");
      assert.equal(dataObj.data.type, "settings");
      assert.equal(returnedData.length, 2, "there are three saved filters in the list");

      var sf1Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-1');
      assert.ok(sf1Pos >= 0, "the list contains saved-filter-1");
      assert.deepEqual(returnedData[sf1Pos], sf1, 'The saved-filter-1 objects are identical');

      var sf2Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-2');
      assert.ok(sf2Pos >= 0, "the list contains saved-filter-2");
      assert.deepEqual(returnedData[sf2Pos], sf2, 'The saved-filter-2 objects are identical');
      return true;
    },
    responseText: {
      meta: {
        message: 'Success!'
      }
    }
  });

  // Choose 'my-saved-filter-1' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:first');

  andThen(function() {
    assert.equal(find('.saved-filter-bar select').val(), 'my-saved-filter-1', "'my-saved-filter-1' is the currently selected saved filter");
    assert.deepEqual(find('.tag-filter-bar select').val(), ['one', 'two'], "the tag filter bar contains the correct filters");
  });

  // Remove filter 'two' from the filter list
  click('.tag-filter-bar .select2-selection__choice[title="two"] .select2-selection__choice__remove');
  andThen(function() {
    assert.equal(find('.saved-filter-bar select').val(), 'my-saved-filter-1', "'my-saved-filter-1' is the currently selected saved filter");
    assert.deepEqual(find('.tag-filter-bar select').val(), ['one'], "the tag filter bar contains the correct filters");
  });
});

test('When a non-active saved search filter is deleted, the key is deleted and removed from the list', function(assert) {
  assert.expect(5);

  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/environment/settings/583231',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      var sf1 = {
        id: 'my-saved-filter-1',
        type: 'saved-filters',
        attributes: {
          tags: ['one', 'two']
        }
      };

      var returnedData = dataObj.data.relationships['saved-filters'].data;
      assert.equal(dataObj.data.id, "583231");
      assert.equal(dataObj.data.type, "settings");
      assert.equal(returnedData.length, 1, "there is one filter in the list");

      var sf1Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-1');
      assert.ok(sf1Pos >= 0, "the list contains saved-filter-1");
      assert.deepEqual(returnedData[sf1Pos], sf1, 'The saved-filter-1 objects are identical');
      return true;
    },
    responseText: {
      meta: {
        message: 'Success!'
      }
    }
  });

  // Delete 'my-saved-filter-2' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:last a');
});

test('When an active saved search filter is deleted, the key is deleted and removed from the list', function(assert) {
  assert.expect(5);

  Ember.$.mockjax({
    status: 200,
    type: 'PATCH',
    url: '/testapi/environment/settings/583231',
    data: function(payload) {
      var dataObj = JSON.parse(payload);
      var sf1 = {
        id: 'my-saved-filter-1',
        type: 'saved-filters',
        attributes: {
          tags: ['one', 'two']
        }
      };

      var returnedData = dataObj.data.relationships['saved-filters'].data;
      assert.equal(dataObj.data.id, "583231");
      assert.equal(dataObj.data.type, "settings");
      assert.equal(returnedData.length, 1, "there is one filter in the list");

      var sf1Pos = returnedData.map(function(e) {
        return e.id;
      }).indexOf('my-saved-filter-1');
      assert.ok(sf1Pos >= 0, "the list contains saved-filter-1");
      assert.deepEqual(returnedData[sf1Pos], sf1, 'The saved-filter-1 objects are identical');
      return true;
    },
    responseText: {
      meta: {
        message: 'Success!'
      }
    }
  });

  // Choose 'my-saved-filter-2' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:last');

  // Delete 'my-saved-filter-2' from the dropdown list
  click('.saved-filter-bar .select2-selection');
  keyEvent('.saved-filter-bar .select2-selection', 'keydown', 32); // spacebar
  click('.saved-filter-bar .select2-container .select2-results li:last a');
});
