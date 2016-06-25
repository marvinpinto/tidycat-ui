import Ember from 'ember';
import {moduleFor, test} from 'ember-qunit';

moduleFor('controller:notifications', 'Unit | Controller | notifications | filtered threads', {

  beforeEach: function() {
    this.filterTags = [];
    this.controller = this.subject();
    this.controller.set('filterTags', this.filterTags);
    this.controller.set('model', Ember.Object.create({}));

    this.threadModel = Ember.A();  // eslint-disable-line new-cap
    this.model1 = Ember.Object.create({
      threadUrl: "http://thread1.com",
      tags: ['thread1', 'one', 'two', 'three']
    });
    this.model2 = Ember.Object.create({
      threadUrl: "http://thread2.com",
      tags: ['thread2', 'three', 'four', 'five']
    });
    this.model3 = Ember.Object.create({
      threadUrl: "http://thread3.com",
      tags: ['thread3', 'five', 'six', 'seven']
    });
    this.model4 = Ember.Object.create({
      threadUrl: "http://thread4.com",
      tags: ['thread4', 'seven', 'eight', 'nine']
    });
    this.model5 = Ember.Object.create({
      threadUrl: "http://thread5.com",
      tags: ['thread5', 'nine', 'ten', 'eleven']
    });
    this.threadModel.pushObject(this.model1);
    this.threadModel.pushObject(this.model2);
    this.threadModel.pushObject(this.model3);
    this.threadModel.pushObject(this.model4);
    this.threadModel.pushObject(this.model5);

    this.controller.get('model').set('thread', this.threadModel);
  }

});

test('zero queries', function(assert) {
  assert.expect(6);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 5);
  assert.ok(result.indexOf(this.model1) >= 0, 'the result contains model1');
  assert.ok(result.indexOf(this.model2) >= 0, 'the result contains model2');
  assert.ok(result.indexOf(this.model3) >= 0, 'the result contains model3');
  assert.ok(result.indexOf(this.model4) >= 0, 'the result contains model4');
  assert.ok(result.indexOf(this.model5) >= 0, 'the result contains model5');
});

test('one query - inverse', function(assert) {
  assert.expect(6);
  this.filterTags = ['!three'];
  this.controller.set('filterTags', this.filterTags);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 3);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) >= 0, 'the result contains model3');
  assert.ok(result.indexOf(this.model4) >= 0, 'the result contains model4');
  assert.ok(result.indexOf(this.model5) >= 0, 'the result contains model5');
});

test('two queries - inverse, regular', function(assert) {
  assert.expect(6);
  this.filterTags = ['!three', 'seven'];
  this.controller.set('filterTags', this.filterTags);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 2);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) >= 0, 'the result contains model3');
  assert.ok(result.indexOf(this.model4) >= 0, 'the result contains model4');
  assert.ok(result.indexOf(this.model5) === -1, 'the result does not contain model5');
});

test('three queries - inverse, regular, inverse', function(assert) {
  assert.expect(6);
  this.filterTags = ['!three', 'seven', '!eigh'];
  this.controller.set('filterTags', this.filterTags);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 1);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) >= 0, 'the result contains model3');
  assert.ok(result.indexOf(this.model4) === -1, 'the result does not contain model4');
  assert.ok(result.indexOf(this.model5) === -1, 'the result does not contain model5');
});

test('four queries - inverse, regular, inverse, regular', function(assert) {
  assert.expect(6);
  this.filterTags = ['!two', 'three', '!six', 'nine'];
  this.controller.set('filterTags', this.filterTags);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 0);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) === -1, 'the result does not contain model3');
  assert.ok(result.indexOf(this.model4) === -1, 'the result does not contain model4');
  assert.ok(result.indexOf(this.model5) === -1, 'the result does not contain model5');
});

test('break even - two conflicting queries', function(assert) {
  assert.expect(6);
  this.filterTags = ['five', '!five'];
  this.controller.set('filterTags', this.filterTags);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 0);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) === -1, 'the result does not contain model3');
  assert.ok(result.indexOf(this.model4) === -1, 'the result does not contain model4');
  assert.ok(result.indexOf(this.model5) === -1, 'the result does not contain model5');
});

test('disjoint sets - two separately conflicting queries', function(assert) {
  assert.expect(6);
  this.filterTags = ['!three', 'one'];
  this.controller.set('filterTags', this.filterTags);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 0);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) === -1, 'the result does not contain model3');
  assert.ok(result.indexOf(this.model4) === -1, 'the result does not contain model4');
  assert.ok(result.indexOf(this.model5) === -1, 'the result does not contain model5');
});

test('one query - empty model', function(assert) {
  assert.expect(6);
  this.filterTags = ['!three'];
  this.controller.set('filterTags', this.filterTags);
  this.threadModel = Ember.A();  // eslint-disable-line new-cap
  this.controller.get('model').set('thread', this.threadModel);
  var result = this.controller.get('filteredThreadModel');
  assert.equal(result.length, 0);
  assert.ok(result.indexOf(this.model1) === -1, 'the result does not contain model1');
  assert.ok(result.indexOf(this.model2) === -1, 'the result does not contain model2');
  assert.ok(result.indexOf(this.model3) === -1, 'the result does not contain model3');
  assert.ok(result.indexOf(this.model4) === -1, 'the result does not contain model4');
  assert.ok(result.indexOf(this.model5) === -1, 'the result does not contain model5');
});
