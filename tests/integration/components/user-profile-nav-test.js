import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-profile-nav', 'Integration | Component | user profile nav', {
  integration: true
});

test('not logged in users see the sign in button', function(assert) {
  assert.expect(1);
  this.set('sessionValue', {isAuthenticated: false});
  this.render(hbs`{{user-profile-nav session=sessionValue}}`);
  assert.equal(this.$().text().trim(), 'Sign in with GitHub');
});

test('logged in users see profile buttons', function(assert) {
  assert.expect(1);
  this.set('sessionValue', {isAuthenticated: true});
  this.set('modelValue', {email: 'bob@example.com'});
  this.render(hbs`{{user-profile-nav session=sessionValue model=modelValue}}`);
  assert.equal(this.$('ul li a p').text().trim(), 'Alertsbob@example.comSign out');
});

test('login action is triggered when login button is clicked', function(assert) {
  assert.expect(1);
  this.set('sessionValue', {isAuthenticated: false});

  this.set('fakeLoginAction', () => {
    assert.ok(true, 'login Action was called');
  });

  this.render(hbs`{{user-profile-nav session=sessionValue login=(action fakeLoginAction)}}`);
  this.$('a i.fa-github').click();
});

test('logout action is triggered when logout button is clicked', function(assert) {
  assert.expect(1);
  this.set('sessionValue', {isAuthenticated: true});

  this.set('fakeLogoutAction', () => {
    assert.ok(true, 'logout Action was called');
  });

  this.render(hbs`{{user-profile-nav session=sessionValue logout=(action fakeLogoutAction)}}`);
  this.$('a i.fa-sign-out').click();
});
