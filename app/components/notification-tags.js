import Ember from 'ember';

export default Ember.Component.extend({
  fontAwesomeIcon: Ember.computed.alias('fa-icon'),
  placeholderText: Ember.computed.alias('placeholder'),
  tagMode: Ember.computed.alias('tagmode'),
  allowInputClearing: Ember.computed.alias('allowClear'),
  initialOptions: [],

  // The DOM ID of the select2 element that corresponds to this instance
  selectComponentId: Ember.computed(function() {
    return "select-component-" + this.elementId;
  }),

  selectedObserver: function() {
    // Sets the "currently selected" items to be the items in the supplied data
    // list. Basically used as a synchronization mechanism between the inputted
    // data list and what is displayed. This is needed so that when an item is
    // removed from the data list (out of band, e.g. during a revert), this
    // information is also reflected in the selection list.
    let self = this;
    let selectList = self.$("#" + self.get('selectComponentId'));
    let currentlySelected = selectList.val();

    // Clear out the stale option values and re-add the new, relevant
    // values
    selectList.empty();
    self.get('data').forEach(function(item) {
      let mItem = item.id || item;
      selectList.append(new Option(mItem, mItem));  // eslint-disable-line no-undef
    });

    // After the available options have been updated, ensure that the
    // 'selected' options are the ones we need
    if (self.get('tagMode')) {
      selectList.val(self.get('data')).trigger('change');
    } else {
      selectList.val(currentlySelected).trigger('change');
    }

    selectList.select2("close");
  }.observes('data.length'),

  populateInitialEntries: function() {
    let self = this;

    // This only really applies to dropdown mode
    if (self.get('tagMode')) {
      return [];
    }

    let newArray = Ember.A([]);  // eslint-disable-line new-cap
    if (self.get('data')) {
      self.get('data').forEach(function(item) {
        let mObj = {};
        mObj.id = mObj.text = item.id || item;
        newArray.pushObject(mObj);
      });
    }
    return newArray;
  },

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var self = this;

      // Remove the select2 dropdown arrow for this component
      Ember.run.next(function() {
        self.$("#" + self.get('selectComponentId')).next('span').find('.select2-selection__arrow').remove();
      });

      // Initialize the 'initialOptions' list with the supplied initial
      // contents.
      self.set('initialOptions', Ember.computed.oneWay('data'));

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
        }
        self.sendAction('itemAdded', item);
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
        }
        self.sendAction('itemRemoved', item);
      });

      // Initial setup of the select2 jquery component
      self.$("#" + self.get('selectComponentId')).select2({
        theme: 'bootstrap',
        placeholder: self.get('placeholderText'),
        tags: true,
        multiple: self.get('tagMode'),
        allowClear: self.get('allowInputClearing'),
        dropdownParent: $(self.get('select2DropdownParent')),  // eslint-disable-line no-undef
        data: self.populateInitialEntries(),

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
        },

        templateResult: function(data) {
          // The purpose of this is to present a 'delete' icon to the user in
          // order to allow them to remove/delete a saved-search item.

          if (data.id === null) {
            return data.text;
          }

          // The 'delete' icon is only relevant for the saved-search-bar,
          // therefore only relevant in non-tag mode.
          if (self.get('tagMode')) {
            return data.text;
          }

          let option = Ember.$("<span></span>");
          let deleteEntry = Ember.$("<a href='javascript:void(0)'><i class='fa fa-fw fa-trash-o' aria-hidden='true'></i></a>");
          deleteEntry.on('mouseup', function(evt) {
            // Select2 will remove the dropdown on `mouseup`, which will
            // prevent any `click` events from being triggered So we need to
            // block the propagation of the `mouseup` event
            // Ref: http://stackoverflow.com/a/31904887/1101070
            evt.stopPropagation();
          });

          deleteEntry.on('click', {optionId: data.text}, function(evt) {
            self.sendAction('listItemDeleted', evt.data.optionId);
          });

          option.text(data.text);
          option.append(deleteEntry);
          return option;
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
