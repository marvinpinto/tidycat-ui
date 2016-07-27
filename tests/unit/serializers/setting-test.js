import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('setting', 'Unit | Serializer | setting', {
  needs: ['serializer:setting', 'model:saved-filter', 'transform:array']
});

test('the outbound serialized JSON object is compatible with the environment backend when there are no saved filters', function(assert) {
  assert.expect(2);

  let store = this.container.lookup('service:store');
  var setting;
  Ember.run(function() {
    setting = store.createRecord('setting', {savedFilters: []});
  });

  let serializedRecord = store.serializerFor("setting").serialize(setting._createSnapshot());

  assert.equal(serializedRecord.data.type, "settings");
  assert.deepEqual(serializedRecord.data.relationships['saved-filters'].data, []);
});

test('the outbound serialized JSON object is compatible with the environment backend when there is one saved filter', function(assert) {
  assert.expect(5);

  let store = this.container.lookup('service:store');
  var setting;
  Ember.run(function() {
    let filter1 = store.createRecord('saved-filter', {id: "filter1", tags: ["tag1", "tag2"]});
    setting = store.createRecord('setting', {savedFilters: [filter1]});
  });

  let serializedRecord = store.serializerFor("setting").serialize(setting._createSnapshot());

  assert.equal(serializedRecord.data.type, "settings");
  assert.equal(serializedRecord.data.relationships['saved-filters'].data.length, 1);

  let f1 = serializedRecord.data.relationships['saved-filters'].data.find(function(ele) {
    return ele.id === 'filter1';
  });
  assert.equal(f1.type, 'saved-filters');
  assert.ok(f1.attributes.tags.indexOf("tag1") >= 0, 'tag1 is present in filter1');
  assert.ok(f1.attributes.tags.indexOf("tag2") >= 0, 'tag2 is present in filter1');
});

test('the outbound serialized JSON object is compatible with the environment backend when there is more than one saved filter', function(assert) {
  assert.expect(11);

  let store = this.container.lookup('service:store');
  var setting;
  Ember.run(function() {
    let filter1 = store.createRecord('saved-filter', {id: "filter1", tags: ["tag1", "tag2"]});
    let filter2 = store.createRecord('saved-filter', {id: "filter2", tags: ["tag2", "tag3"]});
    let filter3 = store.createRecord('saved-filter', {id: "filter3", tags: ["tag3", "tag4"]});
    setting = store.createRecord('setting', {savedFilters: [filter1, filter2, filter3]});
  });

  let serializedRecord = store.serializerFor("setting").serialize(setting._createSnapshot());

  assert.equal(serializedRecord.data.type, "settings");
  assert.equal(serializedRecord.data.relationships['saved-filters'].data.length, 3);

  let f1 = serializedRecord.data.relationships['saved-filters'].data.find(function(ele) {
    return ele.id === 'filter1';
  });
  assert.equal(f1.type, 'saved-filters');
  assert.ok(f1.attributes.tags.indexOf("tag1") >= 0, 'tag1 is present in filter1');
  assert.ok(f1.attributes.tags.indexOf("tag2") >= 0, 'tag2 is present in filter1');

  let f2 = serializedRecord.data.relationships['saved-filters'].data.find(function(ele) {
    return ele.id === 'filter2';
  });
  assert.equal(f2.type, 'saved-filters');
  assert.ok(f2.attributes.tags.indexOf("tag2") >= 0, 'tag2 is present in filter2');
  assert.ok(f2.attributes.tags.indexOf("tag3") >= 0, 'tag3 is present in filter2');

  let f3 = serializedRecord.data.relationships['saved-filters'].data.find(function(ele) {
    return ele.id === 'filter3';
  });
  assert.equal(f3.type, 'saved-filters');
  assert.ok(f3.attributes.tags.indexOf("tag3") >= 0, 'tag3 is present in filter3');
  assert.ok(f3.attributes.tags.indexOf("tag4") >= 0, 'tag4 is present in filter3');
});
