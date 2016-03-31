import Ember from 'ember';
import config from '../config/environment';
import ApplicationRouteMixin from
  'ember-simple-auth/mixins/application-route-mixin';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default Ember.Route.extend(ApplicationRouteMixin, {

  model: function() {
    if (this.get('session.data.authenticated.token')) {
      var jwt = JWT.create();
      var data = jwt.getTokenData(this.get('session.data.authenticated.token'));
      return this.store.findRecord('user', data.github_login);
    }
  },

  sessionAuthenticated: function() {
    var authorizationCode = this.get('session.data.authenticated.authorizationCode');
    var _this = this;
    var authenticatedRoute = config['ember-simple-auth'].routeAfterAuthentication;
    var payload = {
      password: authorizationCode
    };
    this.get('session').authenticate('authenticator:jwt', payload).then(function() {
      _this.refresh();
      _this.transitionTo(authenticatedRoute);
    });
  }

});
