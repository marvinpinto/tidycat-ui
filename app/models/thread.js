import DS from 'ember-data';

export default DS.Model.extend({
  threadUrl: DS.attr('string'),
  threadSubscriptionUrl: DS.attr('string'),
  reason: DS.attr('string'),
  updatedAt: DS.attr('number'),
  subjectTitle: DS.attr('string'),
  subjectUrl: DS.attr('string'),
  subjectType: DS.attr('string'),
  repositoryOwner: DS.attr('string'),
  repositoryName: DS.attr('string')
});
