import DS from 'ember-data';

export default DS.Model.extend({
  tags: DS.attr('array'),
  settings: DS.belongsTo('setting')
});
