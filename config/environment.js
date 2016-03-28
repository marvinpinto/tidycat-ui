module.exports = function(environment) {
  // **********
  //  Defaults
  // **********
  var ENV = {
    modulePrefix: 'tidycat-ui',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    torii: {
      sessionServiceName: 'session',
      providers: {
        'github-oauth2': {
          scope: 'user'
        }
      }
    },

    'ember-simple-auth': {
      authorizer: 'authorizer:token'
    },

    'ember-simple-auth-token': {
      tokenPropertyName: 'token',
      authorizationPrefix: 'Bearer ',
      authorizationHeaderName: 'Authorization',
      refreshAccessTokens: true,
      refreshLeeway: 300,
      timeFactor: 1000
    }

  };

  // *********
  //  Testing
  // *********
  if (environment === 'test') {
    ENV.baseURL = '/';
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
  }

  // *************
  //  Development
  // *************
  if (environment === 'development') {
    ENV.torii.providers['github-oauth2'].apiKey = 'a23e0b40bb0377aa6860';
    ENV.torii.providers['github-oauth2'].redirectUri = 'http://127.0.0.1:4200';
    ENV['ember-simple-auth-token'].serverTokenEndpoint = "http://127.0.0.1:8080/auth/token";
    ENV['ember-simple-auth-token'].serverTokenRefreshEndpoint = "http://127.0.0.1:8080/auth/refresh";
  }

  // *********
  //  Staging
  // *********
  if (environment === 'staging') {
    ENV.torii.providers['github-oauth2'].apiKey = 'caf40f799d653c2ca635';
    ENV.torii.providers['github-oauth2'].redirectUri = 'https://my-staging.tidycat.io';
    ENV['ember-simple-auth-token'].serverTokenEndpoint = "https://api-staging.tidycat.io/auth/token";
    ENV['ember-simple-auth-token'].serverTokenRefreshEndpoint = "https://api-staging.tidycat.io/auth/refresh";
  }

  // ************
  //  Production
  // ************
  if (environment === 'production') {
    ENV.torii.providers['github-oauth2'].apiKey = '89a218832dc2e39f575b';
    ENV.torii.providers['github-oauth2'].redirectUri = 'https://my.tidycat.io';
    ENV['ember-simple-auth-token'].serverTokenEndpoint = "https://api.tidycat.io/auth/token";
    ENV['ember-simple-auth-token'].serverTokenRefreshEndpoint = "https://api.tidycat.io/auth/refresh";
  }

  return ENV;
};
