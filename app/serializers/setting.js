import DS from 'ember-data';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default DS.JSONAPISerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    savedFilters: {embedded: 'always'}
  },

  // Tweak the outbound JSON object so that it conforms to the JSONAPI spec
  serialize: function() {
    var json = this._super.apply(this, arguments);
    var filtersArr = json.data['saved-filters'];
    var newFiltersArr = [];

    for (let i = 0; i < filtersArr.length; i++) {
      var tFilter = {
        id: filtersArr[i].data.id,
        type: filtersArr[i].data.type,
        attributes: {
          tags: filtersArr[i].data.attributes.tags
        }
      };
      newFiltersArr.pushObject(tFilter);
    }

    json.data.relationships = {
      'saved-filters': {
        data: newFiltersArr
      }
    };
    delete json.data['saved-filters'];
    return json;
  }
});
