import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('github-thread-comment', 'Unit | Serializer | github thread comment', {
  needs: ['serializer:github-thread-comment'],

  beforeEach: function() {
    Ember.$.mockjaxSettings.logging = false;
    Ember.$.mockjaxSettings.responseTime = 1;
  },

  afterEach: function() {
    Ember.$.mockjax.clear();
  }
});

test('it serializes GitHub issue comments', function(assert) {
  assert.expect(9);
  var _this = this;

  /* eslint-disable camelcase */
  var response = {
    url: "https://api.github.com/repos/spf13/hugo/issues/2184",
    html_url: "https://github.com/spf13/hugo/issues/2184",
    id: 158575130,
    number: 2184,
    title: "Google Analytics Async not working",
    user: {
      login: "vguhesan",
      id: 193960,
      avatar_url: "https://avatars.githubusercontent.com/u/193960?v=3",
      gravatar_id: "",
      url: "https://api.github.com/users/vguhesan",
      html_url: "https://github.com/vguhesan",
      type: "User",
      site_admin: false
    },
    labels: [],
    state: "closed",
    locked: false,
    assignee: null,
    milestone: null,
    comments: 1,
    created_at: "2016-06-05T21:13:12Z",
    updated_at: "2016-06-06T15:52:17Z",
    closed_at: "2016-06-06T15:52:17Z",
    body: "This is a very long body",
    closed_by: {
      login: "digitalcraftsman",
      id: 7010165,
      avatar_url: "https://avatars.githubusercontent.com/u/7010165?v=3",
      gravatar_id: "",
      url: "https://api.github.com/users/digitalcraftsman",
      html_url: "https://github.com/digitalcraftsman",
      type: "User",
      site_admin: false
    }
  };
  /* eslint-enable camelcase */

  Ember.$.mockjax({
    status: 200,
    type: 'GET',
    url: '/github-thread-comments/fake-issue-comment-1',
    dataType: 'json',
    responseText: response
  });

  Ember.run(function() {
    _this.store().find('github-thread-comment', 'fake-issue-comment-1').then(function(comments) {
      assert.equal(comments.get('url'), 'https://api.github.com/repos/spf13/hugo/issues/2184');
      assert.equal(comments.get('htmlUrl'), 'https://github.com/spf13/hugo/issues/2184');
      assert.equal(comments.get('userLogin'), 'vguhesan');
      assert.equal(comments.get('userId'), 193960);
      assert.equal(comments.get('userAvatarUrl'), "https://avatars.githubusercontent.com/u/193960?v=3");
      assert.equal(comments.get('userHtmlUrl'), "https://github.com/vguhesan");
      assert.deepEqual(comments.get('createdAt'), new Date("2016-06-05T21:13:12Z"));
      assert.deepEqual(comments.get('updatedAt'), new Date("2016-06-06T15:52:17Z"));
      assert.equal(comments.get('body'), "This is a very long body");
    });
  });
});

test('it serializes comments of type GitHub releases', function(assert) {
  assert.expect(9);
  var _this = this;

  /* eslint-disable camelcase */
  var response = {
    url: "https://api.github.com/repos/spf13/hugo/releases/3371111",
    assets_url: "https://api.github.com/repos/spf13/hugo/releases/3371111/assets",
    upload_url: "https://uploads.github.com/repos/spf13/hugo/releases/3371111/assets{?name,label}",
    html_url: "https://github.com/spf13/hugo/releases/tag/v0.16",
    id: 3371111,
    tag_name: "v0.16",
    target_commitish: "master",
    name: "v0.16",
    draft: false,
    author: {
      login: "spf13",
      id: 173412,
      avatar_url: "https://avatars.githubusercontent.com/u/173412?v=3",
      gravatar_id: "",
      url: "https://api.github.com/users/spf13",
      html_url: "https://github.com/spf13",
      followers_url: "https://api.github.com/users/spf13/followers",
      following_url: "https://api.github.com/users/spf13/following{/other_user}",
      gists_url: "https://api.github.com/users/spf13/gists{/gist_id}",
      starred_url: "https://api.github.com/users/spf13/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/spf13/subscriptions",
      organizations_url: "https://api.github.com/users/spf13/orgs",
      repos_url: "https://api.github.com/users/spf13/repos",
      events_url: "https://api.github.com/users/spf13/events{/privacy}",
      received_events_url: "https://api.github.com/users/spf13/received_events",
      type: "User",
      site_admin: false
    },
    prerelease: false,
    created_at: "2016-06-06T12:37:59Z",
    published_at: "2016-06-06T13:05:52Z",
    assets: [
      {
        url: "https://api.github.com/repos/spf13/hugo/releases/assets/1800925",
        id: 1800925,
        name: "hugo_0.16_darwin-arm32.tgz",
        label: null,
        uploader: {
          login: "spf13",
          id: 173412,
          avatar_url: "https://avatars.githubusercontent.com/u/173412?v=3",
          gravatar_id: "",
          url: "https://api.github.com/users/spf13",
          html_url: "https://github.com/spf13",
          followers_url: "https://api.github.com/users/spf13/followers",
          following_url: "https://api.github.com/users/spf13/following{/other_user}",
          gists_url: "https://api.github.com/users/spf13/gists{/gist_id}",
          starred_url: "https://api.github.com/users/spf13/starred{/owner}{/repo}",
          subscriptions_url: "https://api.github.com/users/spf13/subscriptions",
          organizations_url: "https://api.github.com/users/spf13/orgs",
          repos_url: "https://api.github.com/users/spf13/repos",
          events_url: "https://api.github.com/users/spf13/events{/privacy}",
          received_events_url: "https://api.github.com/users/spf13/received_events",
          type: "User",
          site_admin: false
        },
        content_type: "application/gzip",
        state: "uploaded",
        size: 3732839,
        download_count: 23,
        created_at: "2016-06-06T13:01:00Z",
        updated_at: "2016-06-06T13:01:10Z",
        browser_download_url: "https://github.com/spf13/hugo/releases/download/v0.16/hugo_0.16_darwin-arm32.tgz"
      }
    ],
    tarball_url: "https://api.github.com/repos/spf13/hugo/tarball/v0.16",
    zipball_url: "https://api.github.com/repos/spf13/hugo/zipball/v0.16",
    body: "This is a very long body"
  };
  /* eslint-enable camelcase */

  Ember.$.mockjax({
    status: 200,
    type: 'GET',
    url: '/github-thread-comments/fake-issue-comment-2',
    dataType: 'json',
    responseText: response
  });

  Ember.run(function() {
    _this.store().find('github-thread-comment', 'fake-issue-comment-2').then(function(comments) {
      assert.equal(comments.get('url'), 'https://api.github.com/repos/spf13/hugo/releases/3371111');
      assert.equal(comments.get('htmlUrl'), 'https://github.com/spf13/hugo/releases/tag/v0.16');
      assert.equal(comments.get('userLogin'), 'spf13');
      assert.equal(comments.get('userId'), 173412);
      assert.equal(comments.get('userAvatarUrl'), "https://avatars.githubusercontent.com/u/173412?v=3");
      assert.equal(comments.get('userHtmlUrl'), "https://github.com/spf13");
      assert.deepEqual(comments.get('createdAt'), new Date("2016-06-06T12:37:59Z"));
      assert.deepEqual(comments.get('updatedAt'), null);
      assert.equal(comments.get('body'), "This is a very long body");
    });
  });
});
