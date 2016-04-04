import {moduleFor, test} from 'ember-qunit';
import createFakeToken from '../../helpers/create-fake-token';

moduleFor('adapter:user', 'Unit | Adapter | user', {});

test('valid headers', function(assert) {
  var fakeToken = createFakeToken('583231', 600, 'octocat', 'secretbearertoken');
  var session = {
    data: {
      authenticated: fakeToken
    }
  };
  var user = this.subject({session: session});
  assert.equal(user.get('headers.Authorization'), 'Bearer secretbearertoken');
  assert.equal(user.get('headers.Accept'), 'application/json');
});
