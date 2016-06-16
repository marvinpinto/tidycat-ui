import DS from 'ember-data';

export default DS.Model.extend({
  unread: DS.attr('boolean'),
  updatedAt: DS.attr('date'),
  subjectTitle: DS.attr('string'),
  subjectUrl: DS.attr('string'),
  subjectType: DS.attr('string'),
  subjectLatestCommentUrl: DS.attr('string'),
  subscriptionUrl: DS.attr('string'),
  githubSubscription: DS.belongsTo('github-subscription'),
  githubThreadComment: DS.belongsTo('github-thread-comment')
});
