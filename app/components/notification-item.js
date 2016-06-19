import Ember from 'ember';

export default Ember.Component.extend({

  isSelected: Ember.computed.alias('isCheckboxSelected'),
  data: Ember.computed.alias('listData'),

  actions: {
    toggleCheckbox() {
      this.toggleProperty('isSelected');
    }
  }

});
