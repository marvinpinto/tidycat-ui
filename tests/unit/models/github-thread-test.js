import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('github-thread', 'Unit | Model | github thread', {
  needs: ['model:github-subscription', 'model:github-thread-comment']
});

test('should own a github subscription', function(assert) {
  var githubThread = this.store().modelFor('github-thread');
  var relationship = Ember.get(githubThread, 'relationshipsByName').get('githubSubscription');
  assert.equal(relationship.key, 'githubSubscription');
  assert.equal(relationship.kind, 'belongsTo');
});

test('should own a github thread comment', function(assert) {
  var githubThread = this.store().modelFor('github-thread');
  var relationship = Ember.get(githubThread, 'relationshipsByName').get('githubThreadComment');
  assert.equal(relationship.key, 'githubThreadComment');
  assert.equal(relationship.kind, 'belongsTo');
});
