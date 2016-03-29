import Ember from 'ember';
import AuthenticatedRouteMixin from
  'ember-simple-auth/mixins/authenticated-route-mixin';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    var jwt = JWT.create();
    var data = jwt.getTokenData(this.get('session.data.authenticated.token'));
    return this.store.findRecord('user', data.github_login);
  }
});
