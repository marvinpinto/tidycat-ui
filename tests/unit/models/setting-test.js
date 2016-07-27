import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('setting', 'Unit | Model | setting', {
  needs: ['model:saved-filter']
});

test('should contain many saved filters', function(assert) {
  var tSetting = this.store().modelFor('setting');
  var relationship = Ember.get(tSetting, 'relationshipsByName').get('savedFilters');
  assert.equal(relationship.key, 'savedFilters', 'has a relationship with savedFilters');
  assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});
