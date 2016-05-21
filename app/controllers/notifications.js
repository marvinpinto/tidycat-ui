import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  datePickerEndDate: new Date(),

  filterByTagsOptions: Ember.A([]),  // eslint-disable-line new-cap
  selectedTags: [],

  savedFilterOptions: Ember.A([]),  // eslint-disable-line new-cap
  selectedFilter: [],

  actions: {
    createOnEnter(select, e) {
      if (e.keyCode === 13 &&
          select.isOpen &&
          !select.highlighted &&
          !Ember.isBlank(select.searchText)) {
        let selectedTags = this.get('selectedTags');
        if (!selectedTags.includes(select.searchText)) {
          this.get('filterByTagsOptions').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },

    createFilter(filterName) {
      this.get('savedFilterOptions').pushObject(filterName);
      this.set('selectedFilter', filterName);
    }
  }
});
