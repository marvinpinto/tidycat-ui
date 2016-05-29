import Ember from 'ember';

export default Ember.Component.extend({

  fontAwesomeIcon: Ember.computed.alias('fa-icon'),
  placeholderText: Ember.computed.alias('placeholder'),
  tagMode: Ember.computed.alias('tagmode'),
  allowInputClearing: Ember.computed.alias('allowClear'),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var _this = this;

      this.$(".select2-tag-bar").select2({
        theme: 'bootstrap',
        placeholder: this.get('placeholderText'),
        tags: true,
        multiple: this.get('tagMode'),
        allowClear: this.get('allowInputClearing'),

        formatNoMatches: function() {
          return '';
        },

        dropdownCssClass: function() {
          if (_this.get('tagMode')) {
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

      this.$('b[role="presentation"]').hide();  // hide the select2 dropdown arrow
    });
  }

});
