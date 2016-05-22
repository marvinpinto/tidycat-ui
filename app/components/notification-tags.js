import Ember from 'ember';

export default Ember.Component.extend({

  fontAwesomeIcon: Ember.computed.alias('fa-icon'),
  placeholderText: Ember.computed.alias('placeholder'),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$(".select2-tag-bar").select2({
        theme: 'bootstrap',
        placeholder: this.get('placeholderText'),
        tags: [],
        multiple: true,
        formatNoMatches: function() {
          return '';
        },
        dropdownCssClass: 'notification-tag-bar',
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
    });
  }

});
