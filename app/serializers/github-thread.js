import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  normalizeFindRecordResponse: function(store, type, payload) {
    return {
      data: {
        id: payload.id,
        type: type.modelName,
        attributes: {
          unread: payload.unread,
          updatedAt: new Date(payload.updated_at),
          subjectTitle: payload.subject.title,
          subjectUrl: payload.subject.url,
          subjectType: payload.subject.type,
          subjectLatestCommentUrl: payload.subject.latest_comment_url,
          subscriptionUrl: payload.subscription_url
        },
        relationships: {
          githubSubscription: {
            data: {
              id: payload.subscription_url,
              type: 'github-subscription'
            }
          },
          githubThreadComment: {
            data: {
              id: payload.subject.latest_comment_url,
              type: 'github-thread-comment',
              attributes: {
                subjectType: payload.subject.type
              }
            }
          }
        }
      }
    };
  }

});
