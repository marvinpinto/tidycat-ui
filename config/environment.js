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
          scope: 'user:email,notifications,repo',
          apiKey: process.env.EMBER_GITHUB_APIKEY,
          redirectUri: process.env.EMBER_GITHUB_REDIRECT_URI
        }
      }
    },

    'ember-simple-auth': {
      authenticationRoute: 'login',
      routeAfterAuthentication: 'notifications',
      routeIfAlreadyAuthenticated: 'notifications'
    },

    'ember-simple-auth-token': {
      tokenPropertyName: 'token',
      authorizationPrefix: 'Bearer ',
      authorizationHeaderName: 'Authorization',
      tokenExpireName: 'exp',
      refreshAccessTokens: true,
      refreshLeeway: 300,
      timeFactor: 1000,
      serverTokenEndpoint: process.env.EMBER_ESA_TOKEN_ENDPOINT,
      serverTokenRefreshEndpoint: process.env.EMBER_ESA_REFRESH_ENDPOINT
    },

    'github-api': {
      host: 'https://api.github.com',
      namespace: ''
    },

    'notification-api': {
      host: process.env.EMBER_NOTIFICATION_ENDPOINT,
      namespace: ''
    },

    'environment-api': {
      host: process.env.EMBER_ENVIRONMENT_ENDPOINT,
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
    ENV['ember-simple-auth'].store = 'simple-auth-session-store:ephemeral';
    ENV['ember-simple-auth-token'].serverTokenEndpoint = '/testapi/auth/token';
    ENV['ember-simple-auth-token'].serverTokenRefreshEndpoint = '/testapi/auth/refresh';
    ENV['github-api'].host = '/testapi/github';
    ENV['ember-simple-auth-token'].refreshAccessTokens = false;
    ENV['notification-api'].host = '/testapi/notification';
    ENV['environment-api'].host = '/testapi/environment';
  }

  // *************
  //  Development
  // *************
  if (environment === 'development') {
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
  }

  return ENV;
};
