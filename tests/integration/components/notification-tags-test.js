import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('notification-tags', 'Integration | Component | notification tags', {
  integration: true
});

test('placeholder text is set correctly', function(assert) {
  assert.expect(2);
  this.set('placeholder', "fake-text");
  this.render(hbs`{{notification-tags placeholder=placeholder}}`);
  assert.equal(this.$('span.select2-selection__placeholder').text(), 'fake-text');
  this.set('tagMode', true);
  this.render(hbs`{{notification-tags placeholder=placeholder tagmode=tagMode}}`);
  assert.equal(this.$('span.select2-selection ul li input').prop('placeholder'), 'fake-text');
});

test('font awesome tag is set correctly', function(assert) {
  assert.expect(1);
  this.set('fontAwesomeIcon', "fa-such-fake-icon");
  this.render(hbs`{{notification-tags fontAwesomeIcon=fontAwesomeIcon}}`);
  assert.ok(this.$('span.fa').prop('class').indexOf("fa-such-fake-icon") >= 0);
});
