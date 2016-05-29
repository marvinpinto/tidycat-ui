import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
