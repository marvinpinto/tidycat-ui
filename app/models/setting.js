import DS from 'ember-data';

export default DS.Model.extend({
  savedFilters: DS.hasMany('saved-filter')
});
