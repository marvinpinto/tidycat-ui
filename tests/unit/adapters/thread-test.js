import {moduleFor, test} from 'ember-qunit';

moduleFor('adapter:thread', 'Unit | Adapter | thread', {});

test('valid headers', function(assert) {
  var session = {
    data: {
      authenticated: {
        token: "fake_token"
      }
    }
  };
  var thread = this.subject({session: session});
  assert.equal(thread.get('headers.Authorization'), 'Bearer fake_token');
  assert.equal(thread.get('headers.Accept'), 'application/json');
  assert.equal(thread.get('headers.Content-Type'), 'application/json');
});
