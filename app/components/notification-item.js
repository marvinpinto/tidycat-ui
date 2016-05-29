import Ember from 'ember';

export default Ember.Component.extend({

  isSelected: Ember.computed.alias('isCheckboxSelected'),

  actions: {
    toggleCheckbox() {
      this.toggleProperty('isSelected');
    }
  }

});
