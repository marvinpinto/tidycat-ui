import Ember from 'ember';
import config from '../config/environment';
import ApplicationRouteMixin from
  'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  sessionAuthenticated: function() {
    var authorizationCode = this.get('session.data.authenticated.authorizationCode');
    var _this = this;
    var authenticatedRoute = config['ember-simple-auth'].routeAfterAuthentication;
    var payload = {
      password: authorizationCode
    };
    this.get('session').authenticate('authenticator:jwt', payload).then(function() {
      _this.transitionTo(authenticatedRoute);
    });
  }

});
