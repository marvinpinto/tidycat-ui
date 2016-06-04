import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeFindRecordResponse: function(store, type, payload) {
    var userPropertyName = 'user';

    if ('author' in payload) {
      // Check to see if this payload corresponds to a GitHub Release.  This
      // creates an "author" attribute that mirrors the "user" attribute.  A
      // terrible hack because the result of this latest comment url could be
      // one of many things (i.e. Issue, Pull Request, Release, etc).
      userPropertyName = 'author';
    }

    return {
      data: {
        id: payload.url,
        type: type.modelName,
        attributes: {
          url: payload.url,
          htmlUrl: payload.html_url,
          userLogin: payload[userPropertyName].login,
          userId: payload[userPropertyName].id,
          userAvatarUrl: payload[userPropertyName].avatar_url,
          userHtmlUrl: payload[userPropertyName].html_url,
          createdAt: new Date(payload.created_at),
          updatedAt: (payload.updated_at ? new Date(payload.updated_at) : null),
          body: payload.body
        }
      }
    };
  }
});
