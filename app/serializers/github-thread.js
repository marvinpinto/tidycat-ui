import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  normalizeFindRecordResponse: function(store, type, payload) {
    var response = {
      data: {
        attributes: {},
        relationships: {}
      }
    };

    response.data.id = payload.id;
    response.data.type = type.modelName;
    response.data.attributes = {
      unread: payload.unread,
      updatedAt: new Date(payload.updated_at),
      subjectTitle: payload.subject.title,
      subjectUrl: payload.subject.url,
      subjectType: payload.subject.type,
      subjectLatestCommentUrl: payload.subject.latest_comment_url,
      subscriptionUrl: payload.subscription_url
    };

    if (payload.subject.latest_comment_url) {
      response.data.relationships.githubThreadComment = {
        data: {
          id: payload.subject.latest_comment_url,
          type: 'github-thread-comment'
        }
      };
    }

    if (payload.subscription_url) {
      response.data.relationships.githubSubscription = {
        data: {
          id: payload.subscription_url,
          type: 'github-subscription'
        }
      };
    }

    return response;
  }
});
