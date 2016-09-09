import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('saved-filter', 'Unit | Model | saved filter', {
  needs: ['model:setting']
});

test('should own a settings model', function(assert) {
  var tSavedFilter = this.store().modelFor('savedFilter');
  var relationship = Ember.get(tSavedFilter, 'relationshipsByName').get('settings');
  assert.equal(relationship.key, 'settings', 'has a relationship with settings');
  assert.equal(relationship.kind, 'belongsTo', 'kind of relationship is hasMany');
});
