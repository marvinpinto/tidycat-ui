import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  normalizeFindRecordResponse(store, type, payload) {
    return {
      data: {
        id: payload.id,
        type: type.modelName,
        attributes: {
          login: payload.login,
          name: payload.name,
          email: payload.email,
          avatarUrl: payload.avatar_url
        }
      }
    };
  }

});
