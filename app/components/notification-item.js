import Ember from 'ember';

export default Ember.Component.extend({
  isSelected: Ember.computed.alias('isCheckboxSelected'),
  data: Ember.computed.alias('listData'),
  threadModel: Ember.computed.alias('threadmodel'),

  actions: {
    toggleCheckbox() {
      this.toggleProperty('isSelected');
    },

    itemAdded: function(item) {
      var dirtyModel = this.get('threadModel');
      dirtyModel.send('becomeDirty');
      console.debug(`Tag "${item}" was added to thread "${dirtyModel.id}"`);
      console.debug('Model dirty state: ' + dirtyModel.get('hasDirtyAttributes'));
      this.sendAction('triggerUndoNotification', dirtyModel);
    },

    itemRemoved: function(item) {
      var dirtyModel = this.get('threadModel');
      dirtyModel.send('becomeDirty');
      console.debug(`Tag "${item}" was removed from thread "${dirtyModel.id}"`);
      console.debug('Model dirty state: ' + dirtyModel.get('hasDirtyAttributes'));
      this.sendAction('triggerUndoNotification', dirtyModel);
    }
  }
});
