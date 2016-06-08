import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  normalizeFindRecordResponse: function(store, type, payload) {
    return {
      data: {
        id: payload.url,
        type: type.modelName,
        attributes: {
          subscribed: payload.subscribed,
          ignored: payload.ignored,
          reason: payload.reason,
          createdAt: new Date(payload.created_at),
          url: payload.url,
          threadUrl: payload.thread_url
        }
      }
    };
  }

});
