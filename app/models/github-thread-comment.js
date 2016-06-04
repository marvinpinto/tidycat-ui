import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  htmlUrl: DS.attr('string'),
  userLogin: DS.attr('string'),
  userId: DS.attr('number'),
  userAvatarUrl: DS.attr('string'),
  userHtmlUrl: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  body: DS.attr('string')
});
