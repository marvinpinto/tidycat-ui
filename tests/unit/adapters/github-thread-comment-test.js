import Ember from 'ember';
import {moduleFor, test} from 'ember-qunit';
import createFakeToken from '../../helpers/create-fake-token';

moduleFor('adapter:github-thread-comment', 'Unit | Adapter | github thread comment', {
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

test('valid headers are sent with GET request', function(assert) {
  assert.expect(2);
  var _this = this;

  Ember.$.mockjax(function(req) {
    if (req.url === '/github-thread-comments/fake-issue-comment-1') {
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
    _this.subject().findRecord(null, null, '/github-thread-comments/fake-issue-comment-1');
  });
});

test('ajax failure triggers an appropriate response', function(assert) {
  assert.expect(1);
  var _this = this;

  Ember.$.mockjax(function(req) {
    if (req.url === '/github-thread-comments/fake-issue-comment-1') {
      return {
        response: function() {
          this.status = 400;
          this.responseText = {error: "sorry, try again"};
        }
      };
    }
    return;  // Did not match the 'req' url (above)
  });

  Ember.run(function() {
    _this.subject().findRecord(null, null, '/github-thread-comments/fake-issue-comment-1').then(function() {
      assert.ok(false);
    }).catch(function(err) {
      assert.equal(err, 'Error occurred while retrieving comment URL /github-thread-comments/fake-issue-comment-1');
    });
  });
});
