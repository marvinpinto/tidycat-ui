import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {

    logout() {
      this.get('session').invalidate();
    },

    login() {
      var _this = this;
      this.get('session').authenticate('authenticator:torii', 'github').then(function() {
        var authorizationCode = _this.get('session.data.authenticated.authorizationCode');
        var payload = {
          password: authorizationCode
        };
        _this.get('session').authenticate('authenticator:jwt', payload);
      });
    }

  }
});
