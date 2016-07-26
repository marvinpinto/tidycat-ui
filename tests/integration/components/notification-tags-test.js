import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('notification-tags', 'Integration | Component | notification tags', {
  integration: true
});

test('Placeholder text is set correctly', function(assert) {
  var self = this;
  assert.expect(2);
  this.set('placeholder', "fake-text");
  this.render(hbs`{{notification-tags placeholder=placeholder}}`);
  return wait().then(function() {
    assert.equal(self.$('span.select2-selection__placeholder').text(), 'fake-text');
    self.set('tagMode', true);
    self.render(hbs`{{notification-tags placeholder=placeholder tagmode=tagMode}}`);
    return wait().then(function() {
      assert.equal(self.$('span.select2-selection ul li input').prop('placeholder'), 'fake-text');
    });
  });
});

test('Font Awesome tag is set correctly', function(assert) {
  var self = this;
  assert.expect(1);
  this.set('fontAwesomeIcon', "fa-such-fake-icon");
  this.render(hbs`{{notification-tags fontAwesomeIcon=fontAwesomeIcon}}`);
  return wait().then(function() {
    assert.ok(self.$('span.fa').prop('class').indexOf("fa-such-fake-icon") >= 0);
  });
});

test('The select2 dropdown arrow is removed from the UI', function(assert) {
  var self = this;
  assert.expect(1);
  this.render(hbs`{{notification-tags}}`);
  return wait().then(function() {
    assert.equal(self.$().find('span.select2-selection__arrow').size(), 0);
  });
});

test('In non-tag mode, items are loaded as options and no item is initially selected', function(assert) {
  var self = this;
  assert.expect(5);
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);
  this.render(hbs`{{notification-tags tagmode=false data=data}}`);
  return wait().then(function() {
    assert.equal(self.$('.select2-tag-bar').select2('val'), null, "nothing is initally selected");
    assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are three options available");
    assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
    assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
    assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");
  });
});

test('In non-tag mode, all items are cleared when the X is clicked', function(assert) {
  var self = this;
  assert.expect(6);
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);
  this.set('placeholder', "placeholder text");
  this.render(hbs`{{notification-tags tagmode=false data=data allowClear=true placeholder=placeholder}}`);
  return wait().then(function() {
    assert.equal(self.$('.select2-tag-bar').select2('val'), null, "nothing is initally selected");
    // Select opt3
    self.$('.select2-tag-bar').val(['opt3']).trigger('change');
    return wait().then(function() {
      self.$('.select2-tag-bar').val('').trigger('change');
      return wait().then(function() {
        assert.equal(self.$('.select2-tag-bar').select2('val'), null, "nothing is currently selected");
        assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are three options available");
        assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
        assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
        assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");
      });
    });
  });
});

test('In tag mode, items from the supplied data list are all displayed', function(assert) {
  var self = this;
  assert.expect(5);
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);
  this.render(hbs`{{notification-tags tagmode=true data=data}}`);
  return wait().then(function() {
    assert.equal(self.$('.select2-tag-bar').select2('val'), "opt1,opt2,opt3", "all the tags are displayed");
    assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are three options available");
    assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
    assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
    assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");
  });
});

test('In tag mode, all tags are cleared when the X is clicked', function(assert) {
  var self = this;
  assert.expect(6);
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);
  this.set('placeholder', "placeholder text");
  this.render(hbs`{{notification-tags tagmode=true data=data allowClear=true placeholder=placeholder}}`);
  return wait().then(function() {
    assert.equal(self.$('.select2-tag-bar').select2('val'), "opt1,opt2,opt3", "all the tags are displayed");
    self.$('.select2-tag-bar').val('').trigger('change');
    return wait().then(function() {
      assert.equal(self.$('.select2-tag-bar').select2('val'), null, "nothing is currently selected");
      assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are three options available");
      assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
      assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
      assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");
    });
  });
});

test('In tag mode, a newly added item is also added to the bound-data input list', function(assert) {
  var self = this;
  assert.expect(12);
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);
  this.render(hbs`{{notification-tags tagmode=true data=data}}`);
  return wait().then(function() {
    assert.equal(self.$('.select2-tag-bar').select2('val'), "opt1,opt2,opt3", "all the tags are displayed");
    assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are three options available");
    assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
    assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
    assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");

    // add the new tag to the list
    var option = '<option value="opt4">opt4</option>'; // the new base option
    self.$('.select2-tag-bar').append(option);
    self.$('.select2-tag-bar').val(['opt1', 'opt2', 'opt3', 'opt4']).trigger('change');

    // Create and trigger the custom 'select2:select' event as the 'change'
    // event doesn't seem to trigger it here
    var e = Ember.$.Event("select2:select");  // eslint-disable-line new-cap
    e.params = {
      data: {id: "opt4"}
    };
    self.$('.select2-tag-bar').trigger(e);

    assert.equal(self.$('.select2-tag-bar').select2('val'), "opt1,opt2,opt3,opt4", "all the tags are displayed");
    assert.equal(self.$('.select2-tag-bar option').size(), 4, "there are three options available");
    assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
    assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
    assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");
    assert.equal(self.$('.select2-tag-bar option:eq(3)').text(), "opt4", "fourth available option is opt4");
    assert.equal(self.get('data'), "opt1,opt2,opt3,opt4", "bound data list has been updated");
  });
});

test('In tag mode, a removed item is also removed from the bound-data input list', function(assert) {
  var self = this;
  assert.expect(11);
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);
  this.render(hbs`{{notification-tags tagmode=true data=data}}`);
  return wait().then(function() {
    assert.equal(self.$('.select2-tag-bar').select2('val'), "opt1,opt2,opt3", "all the tags are displayed");
    assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are three options available");
    assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
    assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
    assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");

    // remove tag "opt2" from the list
    self.$('.select2-tag-bar').val(['opt1', 'opt3']).trigger('change');

    // Create and trigger the custom 'select2:unselect' event as the 'change'
    // event doesn't seem to trigger it here
    var e = Ember.$.Event("select2:unselect");  // eslint-disable-line new-cap
    e.params = {
      data: {id: "opt2"}
    };
    self.$('.select2-tag-bar').trigger(e);

    assert.equal(self.$('.select2-tag-bar').select2('val'), "opt1,opt3", "all the tags are displayed");
    assert.equal(self.$('.select2-tag-bar option').size(), 3, "there are two options available");
    assert.equal(self.$('.select2-tag-bar option:eq(0)').text(), "opt1", "first available option is opt1");
    assert.equal(self.$('.select2-tag-bar option:eq(1)').text(), "opt2", "second available option is opt2");
    assert.equal(self.$('.select2-tag-bar option:eq(2)').text(), "opt3", "third available option is opt3");
    assert.equal(self.get('data'), "opt1,opt3", "bound data list has been updated");
  });
});
