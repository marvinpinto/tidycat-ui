import Ember from 'ember';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),
  newNotifications: Ember.inject.service('new-notification'),
  filterTags: [],
  currentlySelectedSavedFilter: null,

  initiateNotificationChecking: function() {
    if (this.get('session.data.authenticated.token')) {
      var jwt = JWT.create();
      var jwtData = jwt.getTokenData(this.get('session.data.authenticated.token'));
      this.get('newNotifications').initialize(jwtData.github_token);
    }
  }.on('init'),

  datePickerEndDate: new Date(),
  selectAll: false,

  ghNotifications: [
    {
      heading: "Vivamus nec urna eget nulla",
      content: "Aliquam blandit pretium quam, nec elementum nisi congue quis. Sed gravida massa quis euismod lobortis. Donec vulputate semper est nec bibendum. Maecenas sit amet vestibulum libero, eu tempor dolor. Quisque iaculis hendrerit leo quis vulputate. Nunc turpis dui, ullamcorper a nisi sed, efficitur tincidunt elit. Praesent non dui ullamcorper, vulputate felis et, dapibus ipsum. Fusce odio ante, gravida euismod congue commodo, interdum sed odio.",
      checked: false
    },
    {
      heading: "Morbi lectus diam, finibus sit",
      content: "Morbi dignissim rutrum dui, porttitor efficitur lorem. Donec vel felis elementum, tempus leo consequat, dignissim odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi quis pharetra ligula, nec pellentesque purus. Aenean rhoncus tincidunt neque, ac congue dui suscipit eget. Duis pretium tempus ligula sit amet eleifend. Integer sodales urna eu lorem eleifend blandit. Fusce at metus nec lorem rhoncus pulvinar. Cras sem mauris, laoreet eu iaculis non, aliquam vel arcu. Praesent rhoncus sollicitudin lectus laoreet gravida. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque pellentesque at diam in aliquam. Nulla malesuada non libero a lacinia. Nam mattis magna vitae scelerisque cursus.",
      checked: false
    },
    {
      heading: "Nulla non lobortis elit, at",
      content: "Sed ac tincidunt turpis. Vestibulum dapibus ac magna ut blandit. Nam facilisis lacus non velit condimentum, vel vestibulum metus ultrices. Maecenas dapibus libero lectus, in vestibulum turpis lacinia in. Fusce ultrices rutrum ex, nec luctus est eleifend id. Suspendisse libero risus, lobortis ut dui quis, semper cursus nunc. Donec cursus imperdiet mauris, quis euismod ex porttitor eget. Duis eu vestibulum turpis. Nam elementum porttitor magna, eget aliquam justo facilisis ac. In hac habitasse platea dictumst. Integer est tortor, eleifend nec nisi a, euismod lobortis arcu. Vivamus convallis nunc risus. Sed blandit et neque eget varius. Suspendisse potenti. Donec sed tortor purus. Suspendisse venenatis nulla eros, eget finibus mauris facilisis a.",
      checked: false
    }
  ],

  toggleSelectAll: function() {
    this.get('model.thread').setEach('checked', this.get('selectAll'));
  }.observes('selectAll'),

  bootstrapAlert: function(type, message, timeout) {
    return new Ember.RSVP.Promise(function(resolve) {
      // Close any outstanding alerts before displaying the new alert
      var outstandingAlert = Ember.$('#floating-alert');
      if (outstandingAlert) {
        console.debug("Closing previously displayed alerts");
        outstandingAlert.alert('close');
      }

      var fontAwesome = `<i class="fa fa-sm fa-times-circle"></i>`;
      var premable = `<div id="floating-alert" class="alert alert-${type} fade in"><button type="button" class="close" data-dismiss="alert" aria-label="Close">${fontAwesome}</button>${message} &nbsp;</div>`;
      Ember.$(premable).appendTo('#alert-placeholder');

      // Remove the alert after the given timeout
      Ember.run.later((function() {
        Ember.$("#floating-alert").alert('close');
      }), timeout);

      // resolve this promise after the alert is closed
      Ember.$('#floating-alert').on('closed.bs.alert', function() {
        Ember.run(null, resolve);
      });
    });
  },

  actions: {
    toggleSelectAllCheckbox() {
      this.toggleProperty('selectAll');
    },

    triggerUndoNotification: function(dirtyModel) {
      var self = this;
      var modelName = dirtyModel.constructor.modelName;
      var modelId = dirtyModel.id;
      console.debug(`Triggering a notification update for model "${modelName}" (ID ${modelId})`);
      var undoLink = `<span id="undo-link" data-dirty-model="${modelName}" data-dirty-model-id="${modelId}">undo</span>`;
      this.bootstrapAlert("info", `Changes saved. ${undoLink}`, 3000).then(function() {
        dirtyModel.save().then(function() {
          console.debug(`Successfully persisted the "${modelName}" model`);
        }).catch(function(err) {
          var humanMsg = "Ran into an error while trying to write your saved information back upstream. If this persists, try logging out and back in again.";
          console.error(`Ran into an error while persisting the "${modelName}" model`);
          console.error(`Error: ${err}`);
          self.bootstrapAlert("error", humanMsg, 10000);
        });
      });
    },

    fromDateUpdated: function(newFromDate) {
      var self = this;
      var fromDate = Math.floor(new Date(newFromDate).getTime() / 1000);
      this.get('store').query('thread', {from: fromDate}).then(function(threads) {
        self.set('model.thread', threads);
      });
    },

    // Events driven via the Saved Search Filter dropdown
    // 1. A brand new saved search filter is entered (save all the current filtered tags under this brand new key)
    // 2. An already-present search filter is selected (replace all the currently filtered tags with this key's values)
    // 3. The saved search filter bar is cleared (clear the values in the filtered tags bar)
    // 4. A non-active saved search filter is deleted (remove it from the list and delete the key)

    saveFilterAdded: function(item) {
      let settingsObj = this.get('store').peekRecord('setting', this.get('model.user.id'));
      let tFilterRecord = this.get('store').peekRecord('savedFilter', item);
      let self = this;

      // Note the currently selected saved filter item
      self.set('currentlySelectedSavedFilter', item);

      // The (newly) selected search filter is *not* brand new (case #2 above)
      if (tFilterRecord) {
        console.debug(`Filter ${item} already exists - replacing tag bar contents`);
        this.set('filterTags', []);
        this.set('filterTags', tFilterRecord.get('tags', []));
        return;
      }

      // This is a brand new search filter (case #1 above)
      console.debug(`Filter ${item} is brand new!`);
      let newFilter = this.get('store').createRecord('savedFilter', {
        id: item,
        tags: this.get('filterTags', [])
      });
      settingsObj.get('savedFilters').pushObject(newFilter);
      settingsObj.save().then(function() {
        self.bootstrapAlert("info", `Saved search filter "${item}" created.`, 2000);
      });
    },

    saveFilterRemoved: function() {
      // The saved-search bar is cleared (case #3 above)

      // Clear the currently selected saved filter item
      this.set('currentlySelectedSavedFilter', null);

      console.debug("The saved-search bar has been cleared");
      this.set('filterTags', []);
    },

    saveFilterDeleted: function(item) {
      // A non-active saved-search filter is deleted (case #4 above)
      console.debug(`Will now delete search filter "${item}" from the list`);
      let settingsObj = this.get('store').peekRecord('setting', this.get('model.user.id'));
      let tFilterRecord = this.get('store').peekRecord('savedFilter', item);
      let self = this;
      tFilterRecord.deleteRecord();

      settingsObj.save().then(function() {
        self.get('model.setting').reload();
      }).then(function() {
        self.bootstrapAlert("info", `Saved search filter "${item}" deleted.`, 2000);
      });
    },

    // Events driven via the Tag Filter bar
    // 1. Saved filter bar is empty + tags are added/removed from the tag bar (do not save these search filters)
    // 2. Saved filter bar is not empty  + tags are added/removed from the tag bar (save these tags to the saved search filter key)

    filterTagAdded: function(item) {
      // Do not bother saving any saved-filters if the saved-filter-bar is
      // empty (case #1 above)
      let self = this;
      if (!this.get('currentlySelectedSavedFilter')) {
        return;
      }

      // Save the added tag to the relevant saved-filter-bar key (case #2 above)
      console.debug(`Adding tag "${item}" to the tag list for ${this.get('currentlySelectedSavedFilter')}`);
      let settingsObj = this.get('store').peekRecord('setting', this.get('model.user.id'));
      let filterRecord = this.get('store').peekRecord('savedFilter', this.get('currentlySelectedSavedFilter'));
      filterRecord.get('tags').pushObject(item);
      settingsObj.save().then(function() {
        self.bootstrapAlert("info", `Tag "${item}" saved with search filter "${self.get('currentlySelectedSavedFilter')}"`, 2000);
      });
    },

    filterTagRemoved: function(item) {
      // Do not bother saving any saved-filters if the saved-filter-bar is
      // empty (case #1 above)
      let self = this;
      if (!this.get('currentlySelectedSavedFilter')) {
        return;
      }

      // Remove the added tag from the relevant saved-filter-bar key (case #2 above)
      console.debug(`Removing tag "${item}" from the tag list for ${this.get('currentlySelectedSavedFilter')}`);
      let settingsObj = this.get('store').peekRecord('setting', this.get('model.user.id'));
      let filterRecord = this.get('store').peekRecord('savedFilter', this.get('currentlySelectedSavedFilter'));
      filterRecord.get('tags').removeObject(item);
      settingsObj.save().then(function() {
        self.bootstrapAlert("info", `Tag "${item}" removed from search filter "${self.get('currentlySelectedSavedFilter')}"`, 2000);
      });
    }

  },

  revertDirtyModel: function() {
    var self = this;

    Ember.run.next(function() {
      // Callback for when the "undo" link is clicked
      Ember.$('#alert-placeholder').on('click', '#undo-link', function() {
        var dirtyModel = Ember.$("#undo-link").data('dirty-model');
        var dirtyModelId = Ember.$("#undo-link").data('dirty-model-id');
        var modelObj = self.get(`model.${dirtyModel}`).findBy('id', dirtyModelId.toString());
        modelObj.rollbackAttributes();
        console.debug(`Successfully rolled back the "${dirtyModel}" model`);
      });
    });
  }.on('init'),

  prefillDatePickerDate: function() {
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    Ember.run.next(function() {
      Ember.$('.from-date-picker').datepicker('setDate', oneWeekAgo);
    });
  }.on('init'),

  filteredThreadModel: Ember.computed('filterTags', 'model.thread', function() {
    var filters = this.get('filterTags');

    return this.get('model.thread').filter(function(item) {
      // For each model, iterate over each of the specified filters in the
      // filter bar

      var includeModelInResults = true;
      var tags = item.get('tags');

      // Assume that by default, models *will* be included in the filtered
      // results. This allows us to short-circuit the logic using the 'every'
      // iterator below.

      filters.every(function(filter) {
        var inverseMatch = filter.match(/^!(.+)/);
        var regexMatch = new RegExp(filter, 'i');

        if (inverseMatch) {
          var invRegex = new RegExp(inverseMatch[1], 'i');
          tags.every(function(tag) {
            var match = invRegex.test(tag);
            // A 'match' here means that there's a tag we explicitly do not
            // want in our filtered results, hence this model cannot be
            // included in the filtered results.
            // includeModelInResults = false;
            if (match) {
              includeModelInResults = false;
              return false;
            }
            return true;
          });
        } else {
          var positiveMatchFound = false;
          tags.every(function(tag) {
            var match = regexMatch.test(tag);
            if (match) {
              positiveMatchFound = true;
              return false;  // short-circuit this loop since there is no point continuing
            }
            return true;
          });
          includeModelInResults = positiveMatchFound;
        }

        return includeModelInResults;
      });  // end filters.every

      return includeModelInResults;
    });  // end model.thread
  })

});
