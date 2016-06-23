import DS from 'ember-data';

export default DS.Model.extend({
  threadUrl: DS.attr('string'),
  threadSubscriptionUrl: DS.attr('string'),
  reason: DS.attr('string'),
  updatedAt: DS.attr('number'),
  checked: DS.attr('boolean', {defaultValue: false}),
  githubThread: DS.belongsTo('github-thread'),
  tags: DS.attr('array')
});
