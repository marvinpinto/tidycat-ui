module.exports = function(environment) {
  // **********
  //  Defaults
  // **********
  var ENV = {
    modulePrefix: 'tidycat-ui',
    environmen: environment,
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
          scope: 'user',
          apiKey: process.env.EMBER_GITHUB_APIKEY,
          redirectUri: process.env.EMBER_GITHUB_REDIRECT_URI
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
      timeFactor: 1000,
      serverTokenEndpoint: process.env.EMBER_ESA_TOKEN_ENDPOINT,
      serverTokenRefreshEndpoint: process.env.EMBER_ESA_REFRESH_ENDPOINT
    },

    'github-api': {
      host: 'https://api.github.com',
      namespace: ''
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

  return ENV;
};
