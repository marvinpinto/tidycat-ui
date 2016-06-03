import Ember from 'ember';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  newNotifications: Ember.inject.service('new-notification'),

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
    this.get('ghNotifications').setEach('checked', this.get('selectAll'));
  }.observes('selectAll'),

  actions: {
    toggleSelectAllCheckbox() {
      this.toggleProperty('selectAll');
    }
  }

});
