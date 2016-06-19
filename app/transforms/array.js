import Ember from 'ember';
import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize: function(serialized) {
    return (Ember.typeOf(serialized) === "array") ? serialized : Ember.A([]);  // eslint-disable-line new-cap
  },

  serialize: function(deserialized) {
    var type = Ember.typeOf(deserialized);
    if (type === 'array') {
      return deserialized;
    } else if (type === 'string') {
      return deserialized.split(',').map(function(item) {
        return Ember.$.trim(item);
      });
    }
    return Ember.A([]);  // eslint-disable-line new-cap
  }
});
