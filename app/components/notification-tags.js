import Ember from 'ember';

export default Ember.Component.extend({
  fontAwesomeIcon: Ember.computed.alias('fa-icon'),
  placeholderText: Ember.computed.alias('placeholder'),
  tagMode: Ember.computed.alias('tagmode'),
  allowInputClearing: Ember.computed.alias('allowClear'),
  initialOptions: [],

  // Sorted items from the input data list
  content: Ember.computed('data', function() {
    var _data = this.get('data');
    if (Ember.isArray(_data)) {
      return _data.sort();
    }
    return _data;
  }),

  // The DOM ID of the select2 element that corresponds to this instance
  selectComponentId: Ember.computed(function() {
    return "select-component-" + this.elementId;
  }),

  selectedObserver: function() {
    // Sets the "currently selected" items to be the items in the supplied data
    // list. Basically used as a synchronization mechanism between the inputted
    // data list and what is displayed. This is needed so that when an item is
    // removed from the data list (out of band, e.g. during a revert), this
    // information is also reflected in the selection list. This only really
    // makes sense for tagged lists.
    var self = this;
    Ember.run.next(function() {
      self.$("#" + self.get('selectComponentId')).val(self.get('content')).trigger('change');
    });
  }.observes('data.length'),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var self = this;

      // Remove the select2 dropdown arrow for this component
      Ember.run.next(function() {
        self.$("#" + self.get('selectComponentId')).next('span').find('.select2-selection__arrow').remove();
      });

      // Initialize the 'initialOptions' list with the supplied initial
      // contents.
      self.set('initialOptions', Ember.copy(self.get('content')));

      // Callback for after an item is selected or added
      self.$("#" + self.get('selectComponentId')).on('select2:select', function(e) {
        var item = e.params.data.id;
        // In tag mode, add the selected item back to the input (bound) data
        // list
        if (self.get('tagMode')) {
          console.debug("New item added: " + item);
          var origArray = self.get('data');
          var newArray = Ember.copy(origArray, true);
          newArray.pushObject(item);
          self.set('data', newArray);
          self.sendAction('itemAdded', item);
        }
      });

      // Callback for after an item is unselected or removed
      self.$("#" + self.get('selectComponentId')).on('select2:unselect', function(e) {
        var item = e.params.data.id;
        // In tag mode, remove the selected item from the input (bound) data
        // list
        if (self.get('tagMode')) {
          console.debug("item removed: " + item);
          var origArray = self.get('data');
          var newArray = Ember.copy(origArray, true);
          newArray.removeObject(item);
          self.set('data', newArray);
          self.sendAction('itemRemoved', item);
        }
      });

      // Initial setup of the select2 jquery component
      self.$("#" + self.get('selectComponentId')).select2({
        theme: 'bootstrap',
        placeholder: self.get('placeholderText'),
        tags: true,
        multiple: self.get('tagMode'),
        allowClear: self.get('allowInputClearing'),

        formatNoMatches: function() {
          return '';
        },

        dropdownCssClass: function() {
          if (self.get('tagMode')) {
            return 'notification-tag-bar';
          }
          return '';
        },

        matcher: function(searchParams, data) {
          // This bit taken from Select2's default matcher
          var match = Ember.$.extend(true, {}, data);
          if (searchParams.term === null || Ember.$.trim(searchParams.term) === '') {
            return match;
          }
          // Don't partial match tags, otherwise if a user has a tag 'abc' it is
          // impossible to then create a tag 'ab'.
          if (searchParams.term === data.text) {
            return match;
          }
          return null;
        }

      });

      // Clear out the initally selected (default) saved-search-filter item
      Ember.run.next(function() {
        if (!self.get('tagMode')) {
          self.$("#" + self.get('selectComponentId')).val(null).trigger('change');
        }
      });

    });
  }
});
