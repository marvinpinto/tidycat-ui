import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    login: function() {
      this.sendAction('login');
    },

    logout: function() {
      this.sendAction('logout');
    }
  }
});
