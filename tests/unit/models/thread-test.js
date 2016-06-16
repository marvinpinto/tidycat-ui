import {moduleForModel, test} from 'ember-qunit';

moduleForModel('thread', 'Unit | Model | thread', {
  needs: ['model:github-thread']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(Boolean(model));
});
