import Ember from 'ember';

export default Ember.Component.extend({

  isSelected: false,

  actions: {
    toggleCheckbox() {
      this.toggleProperty('isSelected');
    }
  }

});
