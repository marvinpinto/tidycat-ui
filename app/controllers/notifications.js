import Ember from 'ember';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),
  newNotifications: Ember.inject.service('new-notification'),
  filterTags: [],

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

    // Filter threads, returning only those that satisfy all search expressions.
    return this.get('model.thread').filter(function(item) {
      var tags = item.get('tags');

      // Thread must match every positive filter and not match any negative filter.
      return filters.every(function(filter) {
        var inverseMatch = filter.match(/^!(.+)/);
        var regexMatch = new RegExp(filter, 'i');

        if (inverseMatch) {
          // Thread passes a negative filter if none of its tags match the regex.
          var invRegex = new RegExp(inverseMatch[1], 'i');
          return !tags.any(function(tag) {
            return invRegex.test(tag);
          });
        }

        // Thread passes a positive filter if any of its tags match the regex.
        return tags.any(function(tag) {
          return regexMatch.test(tag);
        });
      });  // end filters.every
    });  // end model.thread
  })
});
