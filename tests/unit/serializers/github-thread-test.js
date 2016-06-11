import Ember from 'ember';
import {moduleForModel, test} from 'ember-qunit';

moduleForModel('github-thread', 'Unit | Serializer | github thread', {
  needs: [
    'serializer:github-thread',
    'model:github-subscription',
    'model:github-thread-comment'
  ],

  beforeEach: function() {
    Ember.$.mockjaxSettings.logging = false;
    Ember.$.mockjaxSettings.responseTime = 1;
  },

  afterEach: function() {
    Ember.$.mockjax.clear();
  }
});

test('it serializes GitHub thread requests', function(assert) {
  assert.expect(6);
  var _this = this;

  /* eslint-disable camelcase */
  var response = {
    id: "146393869",
    unread: false,
    reason: "subscribed",
    updated_at: "2016-06-06T15:52:17Z",
    last_read_at: null,
    subject: {
      title: "Google Analytics Async not working",
      url: "https://api.github.com/repos/spf13/hugo/issues/2184",
      latest_comment_url: "https://api.github.com/repos/spf13/hugo/issues/2184",
      type: "Issue"
    },
    repository: {
      id: 11180687,
      name: "hugo",
      full_name: "spf13/hugo",
      owner: {
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
      private: false,
      html_url: "https://github.com/spf13/hugo",
      description: "A Fast and Flexible Static Site Generator built with love in GoLang",
      fork: false,
      url: "https://api.github.com/repos/spf13/hugo",
      forks_url: "https://api.github.com/repos/spf13/hugo/forks",
      keys_url: "https://api.github.com/repos/spf13/hugo/keys{/key_id}",
      collaborators_url: "https://api.github.com/repos/spf13/hugo/collaborators{/collaborator}",
      teams_url: "https://api.github.com/repos/spf13/hugo/teams",
      hooks_url: "https://api.github.com/repos/spf13/hugo/hooks",
      issue_events_url: "https://api.github.com/repos/spf13/hugo/issues/events{/number}",
      events_url: "https://api.github.com/repos/spf13/hugo/events",
      assignees_url: "https://api.github.com/repos/spf13/hugo/assignees{/user}",
      branches_url: "https://api.github.com/repos/spf13/hugo/branches{/branch}",
      tags_url: "https://api.github.com/repos/spf13/hugo/tags",
      blobs_url: "https://api.github.com/repos/spf13/hugo/git/blobs{/sha}",
      git_tags_url: "https://api.github.com/repos/spf13/hugo/git/tags{/sha}",
      git_refs_url: "https://api.github.com/repos/spf13/hugo/git/refs{/sha}",
      trees_url: "https://api.github.com/repos/spf13/hugo/git/trees{/sha}",
      statuses_url: "https://api.github.com/repos/spf13/hugo/statuses/{sha}",
      languages_url: "https://api.github.com/repos/spf13/hugo/languages",
      stargazers_url: "https://api.github.com/repos/spf13/hugo/stargazers",
      contributors_url: "https://api.github.com/repos/spf13/hugo/contributors",
      subscribers_url: "https://api.github.com/repos/spf13/hugo/subscribers",
      subscription_url: "https://api.github.com/repos/spf13/hugo/subscription",
      commits_url: "https://api.github.com/repos/spf13/hugo/commits{/sha}",
      git_commits_url: "https://api.github.com/repos/spf13/hugo/git/commits{/sha}",
      comments_url: "https://api.github.com/repos/spf13/hugo/comments{/number}",
      issue_comment_url: "https://api.github.com/repos/spf13/hugo/issues/comments{/number}",
      contents_url: "https://api.github.com/repos/spf13/hugo/contents/{+path}",
      compare_url: "https://api.github.com/repos/spf13/hugo/compare/{base}...{head}",
      merges_url: "https://api.github.com/repos/spf13/hugo/merges",
      archive_url: "https://api.github.com/repos/spf13/hugo/{archive_format}{/ref}",
      downloads_url: "https://api.github.com/repos/spf13/hugo/downloads",
      issues_url: "https://api.github.com/repos/spf13/hugo/issues{/number}",
      pulls_url: "https://api.github.com/repos/spf13/hugo/pulls{/number}",
      milestones_url: "https://api.github.com/repos/spf13/hugo/milestones{/number}",
      notifications_url: "https://api.github.com/repos/spf13/hugo/notifications{?since,all,participating}",
      labels_url: "https://api.github.com/repos/spf13/hugo/labels{/name}",
      releases_url: "https://api.github.com/repos/spf13/hugo/releases{/id}",
      deployments_url: "https://api.github.com/repos/spf13/hugo/deployments"
    },
    url: "https://api.github.com/notifications/threads/146393869",
    subscription_url: "https://api.github.com/notifications/threads/146393869/subscription"
  };
  /* eslint-enable camelcase */

  Ember.$.mockjax({
    status: 200,
    type: 'GET',
    url: '/github-threads/fake-thread-1',
    dataType: 'json',
    responseText: response
  });

  Ember.run(function() {
    _this.store().find('github-thread', 'fake-thread-1').then(function(result) {
      assert.equal(result.get('subjectTitle'), "Google Analytics Async not working");
      assert.equal(result.get('subjectUrl'), "https://api.github.com/repos/spf13/hugo/issues/2184");
      assert.equal(result.get('subjectType'), "Issue");
      assert.equal(result.get('subjectLatestCommentUrl'), "https://api.github.com/repos/spf13/hugo/issues/2184");
      assert.equal(result.get('subscriptionUrl'), "https://api.github.com/notifications/threads/146393869/subscription");
      assert.deepEqual(result.get('updatedAt'), new Date("2016-06-06T15:52:17Z"));
    });
  });
});
