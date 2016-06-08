import {moduleForModel, test} from 'ember-qunit';

moduleForModel('github-subscription', 'Unit | Model | github subscription', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(Boolean(model));
});
