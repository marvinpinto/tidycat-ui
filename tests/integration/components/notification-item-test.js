import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('notification-item', 'Integration | Component | notification item', {
  integration: true
});

test('heading text is set correctly', function(assert) {
  assert.expect(1);
  this.set('heading', "fake heading");
  this.render(hbs`{{notification-item heading=heading}}`);
  assert.equal(this.$('div.list-group-item-heading').text(), 'fake heading');
});

test('content text is set correctly', function(assert) {
  assert.expect(2);
  this.set('heading', "fake heading two");
  this.set('content', "fake content");
  this.render(hbs`{{notification-item heading=heading content=content}}`);
  assert.equal(this.$('div.list-group-item-heading').text(), 'fake heading two');
  assert.equal(this.$('p.list-group-item-text').text(), 'fake content');
});

test("A newly added tag item triggers the 'triggerUndoNotification' action", function(assert) {
  assert.expect(3);
  var self = this;
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);

  var fakeItem = Ember.Object.create({
    send: function(arg) {
      assert.equal(arg, 'becomeDirty', "the model is marked as dirty");
    }
  });
  this.set('fakemodel', fakeItem);

  this.set('fakeTriggerUndoNotification', function(item) {
    assert.ok(true, 'triggerUndoNotification action was called');
    assert.deepEqual(item, fakeItem, "the added item is passed along as the action payload");
  });

  this.render(hbs`{{
    notification-item
    threadmodel=fakemodel
    heading="item heading"
    content="item content"
    listData=data
    triggerUndoNotification=(action fakeTriggerUndoNotification)
  }}`);

  return wait().then(function() {
    // add the new tag to the list
    var option = '<option value="opt4">opt4</option>'; // the new base option
    self.$('.select2-tag-bar').append(option);
    self.$('.select2-tag-bar').val(['opt4']).trigger('change');

    // Create and trigger the custom 'select2:select' event as the 'change'
    // event doesn't seem to trigger it here
    var e = Ember.$.Event("select2:select");  // eslint-disable-line new-cap
    e.params = {
      data: {id: "opt4"}
    };
    self.$('.select2-tag-bar').trigger(e);
  });
});

test("A removed tag item triggers the 'triggerUndoNotification' action", function(assert) {
  assert.expect(3);
  var self = this;
  var inputData = ["opt1", "opt2", "opt3"];
  this.set('data', inputData);

  var fakeItem = Ember.Object.create({
    send: function(arg) {
      assert.equal(arg, 'becomeDirty', "the model is marked as dirty");
    }
  });
  this.set('fakemodel', fakeItem);

  this.set('fakeTriggerUndoNotification', function(item) {
    assert.ok(true, 'triggerUndoNotification action was called');
    assert.deepEqual(item, fakeItem, "the added item is passed along as the action payload");
  });

  this.render(hbs`{{
    notification-item
    threadmodel=fakemodel
    heading="item heading"
    content="item content"
    listData=data
    triggerUndoNotification=(action fakeTriggerUndoNotification)
  }}`);

  return wait().then(function() {
    // remove tag "opt1" from the list
    self.$('.select2-tag-bar').val(['opt2', 'opt3']).trigger('change');

    // Create and trigger the custom 'select2:unselect' event as the 'change'
    // event doesn't seem to trigger it here
    var e = Ember.$.Event("select2:unselect");  // eslint-disable-line new-cap
    e.params = {
      data: {id: "opt1"}
    };
    self.$('.select2-tag-bar').trigger(e);
  });
});
