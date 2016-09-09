import Ember from 'ember';
import AuthenticatedRouteMixin from
  'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model: function() {
    return Ember.RSVP.hash({
      user: this.modelFor('application'),
      thread: this.store.findAll('thread'),
      setting: this.store.find('setting', this.modelFor('application').get('id'))
    });
  }

});
