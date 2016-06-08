import DS from 'ember-data';

export default DS.Model.extend({
  subscribed: DS.attr('boolean'),
  ignored: DS.attr('boolean'),
  reason: DS.attr('string'),
  createdAt: DS.attr('date'),
  url: DS.attr('string'),
  threadUrl: DS.attr('string')
});
