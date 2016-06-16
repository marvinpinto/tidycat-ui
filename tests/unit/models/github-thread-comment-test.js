import {moduleForModel, test} from 'ember-qunit';

moduleForModel('github-thread-comment', 'Unit | Model | github thread comment', {
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(Boolean(model));
});
