import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('github-subscription', 'Unit | Serializer | github subscription', {
  needs: ['serializer:github-subscription'],

  beforeEach: function() {
    Ember.$.mockjaxSettings.logging = false;
    Ember.$.mockjaxSettings.responseTime = 1;
  },

  afterEach: function() {
    Ember.$.mockjax.clear();
  }
});

test('it serializes GitHub subscription information', function(assert) {
  assert.expect(6);
  var _this = this;

  /* eslint-disable camelcase */
  var response = {
    subscribed: true,
    ignored: false,
    reason: null,
    created_at: "2012-10-06T21:34:12Z",
    url: "https://api.github.com/notifications/threads/1/subscription",
    thread_url: "https://api.github.com/notifications/threads/1"
  };
  /* eslint-enable camelcase */

  Ember.$.mockjax({
    status: 200,
    type: 'GET',
    url: '/github-subscriptions/subscription-1',
    dataType: 'json',
    responseText: response
  });

  Ember.run(function() {
    _this.store().find('github-subscription', 'subscription-1').then(function(result) {
      assert.equal(result.get('subscribed'), true);
      assert.equal(result.get('ignored'), false);
      assert.equal(result.get('reason'), null);
      assert.deepEqual(result.get('createdAt'), new Date("2012-10-06T21:34:12Z"));
      assert.equal(result.get('url'), "https://api.github.com/notifications/threads/1/subscription");
      assert.equal(result.get('threadUrl'), "https://api.github.com/notifications/threads/1");
    });
  });
});
