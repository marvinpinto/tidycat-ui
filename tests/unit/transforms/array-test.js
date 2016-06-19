import Ember from 'ember';
import {moduleFor, test} from 'ember-qunit';

moduleFor('transform:array', 'Unit | Transform | array', {});

test('the deserializer function returns an input array untouched', function(assert) {
  assert.expect(2);
  var transform = this.subject();
  var input = [1, 2, 3, 4];
  var result = transform.deserialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, input);
});

test('the deserializer function returns an empty array when supplied with bogus input', function(assert) {
  assert.expect(6);
  var transform = this.subject();
  var input = "hello";
  var result = transform.deserialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, []);

  input = 33;
  result = transform.deserialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, []);

  input = '';
  result = transform.deserialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, []);
});

test('the serializer function returns an input array untouched', function(assert) {
  assert.expect(2);
  var transform = this.subject();
  var input = Ember.A([1, 2, 3, 4]);  // eslint-disable-line new-cap
  var result = transform.serialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, input);
});

test('the serializer function converts csv into an array', function(assert) {
  assert.expect(2);
  var transform = this.subject();
  var input = "hello,hi,  there";
  var result = transform.serialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, ["hello", "hi", "there"]);
});

test('the serializer function returns an empty array when supplied with bogus input', function(assert) {
  assert.expect(6);
  var transform = this.subject();
  var input = /^.*/;
  var result = transform.serialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, []);

  input = 33;
  result = transform.serialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, []);

  input = null;
  result = transform.serialize(input);
  assert.equal(Ember.typeOf(result), "array");
  assert.deepEqual(result, []);
});
