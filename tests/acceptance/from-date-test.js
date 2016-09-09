/* eslint no-undef: 0 */
import {test} from 'qunit';
import initializeApp from '../helpers/initialize-app';

initializeApp('Acceptance | from date');

test('The initially displayed from-date is set to a week ago', function(assert) {
  assert.expect(1);
  andThen(function() {
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    var day = oneWeekAgo.getDate();
    if (day <= 9) {
      day = '0' + day;
    }
    var dateStr = `${months[oneWeekAgo.getMonth()]} ${day}, ${oneWeekAgo.getFullYear()}`;
    assert.equal(find('.from-date-picker').val(), dateStr);
  });
});
