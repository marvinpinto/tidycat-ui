import Ember from 'ember';
import {moduleFor, test} from 'ember-qunit';
import createFakeToken from '../../helpers/create-fake-token';

moduleFor('adapter:github-subscription', 'Unit | Adapter | github subscription', {
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

test('valid headers are sent with the findRecord GET request', function(assert) {
  assert.expect(3);
  var _this = this;

  Ember.$.mockjax(function(req) {
    if (req.url === '/github-subscription/fake-thread' && req.type === 'GET') {
      return {
        response: function() {
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
    _this.subject().findRecord(null, null, '/github-subscription/fake-thread').then(function(result) {
      assert.deepEqual(result, {});
    });
  });
});

test('default values are returned when the GET request fails', function(assert) {
  assert.expect(3);
  var _this = this;

  Ember.$.mockjax(function(req) {
    if (req.url === '/github-subscription/fake-thread' && req.type === 'GET') {
      return {
        response: function() {
          assert.equal(req.headers.Authorization, 'Bearer secretbearertoken');
          assert.equal(req.headers.Accept, 'application/json');
          this.status = 401;
          this.responseText = {};
        }
      };
    }
    return;  // Did not match the 'req' url (above)
  });

  var expectedData = {
    subscribed: true,
    ignored: false,
    reason: null,
    url: '/github-subscription/fake-thread'
  };

  Ember.run(function() {
    _this.subject().findRecord(null, null, '/github-subscription/fake-thread').then(function(result) {
      assert.deepEqual(result, expectedData);
    });
  });
});

test('valid data is sent with the updateRecord PUT request', function(assert) {
  assert.expect(4);
  var _this = this;

  var expectedData = {
    ignored: false,
    subscribed: true
  };

  Ember.$.mockjax(function(req) {
    if (req.url === '/github-subscription/fake-thread' && req.type === 'PUT') {
      return {
        response: function() {
          assert.equal(req.headers.Authorization, 'Bearer secretbearertoken');
          assert.equal(req.headers.Accept, 'application/json');
          assert.deepEqual(req.data, expectedData);
          this.status = 200;
          this.responseText = {};
        }
      };
    }
    return;  // Did not match the 'req' url (above)
  });

  Ember.run(function() {
    var snapshot = {
      id: '/github-subscription/fake-thread',
      subscribed: true,
      ignored: false
    };
    _this.subject().updateRecord(null, null, snapshot).then(function(result) {
      assert.deepEqual(result, {});
    });
  });
});

test('ajax failure triggers an appropriate response', function(assert) {
  assert.expect(1);
  var _this = this;

  Ember.$.mockjax({
    status: 401,
    type: 'PUT',
    url: '/github-subscription/fake-thread',
    responseText: [
      {id: 11111}
    ]
  });

  Ember.run(function() {
    var snapshot = {
      id: '/github-subscription/fake-thread',
      subscribed: true,
      ignored: false
    };
    _this.subject().updateRecord(null, null, snapshot).then(function(result) {
      assert.deepEqual(result, {});
    }, function(error) {
      assert.equal(error, "Error occurred while attempting to update /github-subscription/fake-thread");
    });
  });
});
