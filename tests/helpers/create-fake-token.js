/* eslint no-undef: 0 */
export default function createFakeToken(subject, expiresInSeconds, ghLogin, bearerToken) {
  var header = window.btoa('fakeheader');
  var signature = window.btoa('fakesignature');
  var unixTimestamp = Math.round(Number(new Date() / 1000));
  var token = {};
  token.iat = unixTimestamp;
  token.sub = subject;
  token.exp = unixTimestamp + expiresInSeconds;
  token.github_login = ghLogin; // eslint-disable-line camelcase
  token.github_token = bearerToken; // eslint-disable-line camelcase
  return {
    token: header + '.' + window.btoa(JSON.stringify(token)) + '.' + signature
  };
}
