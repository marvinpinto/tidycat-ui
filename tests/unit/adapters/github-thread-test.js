import Ember from 'ember';
import {moduleFor, test} from 'ember-qunit';
import createFakeToken from '../../helpers/create-fake-token';

moduleFor('adapter:github-thread', 'Unit | Adapter | github thread', {
  beforeEach: function() {
    Ember.$.mockjaxSettings.logging = false;
    Ember.$.mockjaxSettings.responseTime = 1;
    var session = {
      data: {
        authenticated: createFakeToken('583231', 600, 'octocat', 'secretbearertoken')
      }
    };
    this.subject().set('session', session);
  },

  afterEach: function() {
    Ember.$.mockjax.clear();
  }
});

test('valid information is sent with a request', function(assert) {
  assert.expect(4);
  var _this = this;

  Ember.$.mockjax(function(req) {
    if (req.url === '/testapi/github/notifications/threads/11111') {
      return {
        response: function() {
          assert.equal(req.url, '/testapi/github/notifications/threads/11111');
          assert.equal(req.headers.Authorization, 'Bearer secretbearertoken');
          assert.equal(req.headers.Accept, 'application/json');
          this.status = 200;
          this.responseText = {};
        }
      };
    }
    return;  // Did not match the 'req' url (above)
  });

  Ember.run(function() {
    var snapshot = {
      id: '11111'
    };
    var type = {
      modelName: 'github-thread'
    };
    _this.subject().findRecord(null, type, '11111', snapshot).then(function(result) {
      assert.deepEqual(result, {});
    });
  });
});
