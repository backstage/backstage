import {
  AlertApiForwarder,
  alertApiRef,
  ApiRegistry,
  ErrorAlerter,
  ErrorApiForwarder,
  errorApiRef,
  GithubAuth,
  githubAuthApiRef,
  GitlabAuth,
  gitlabAuthApiRef,
  GoogleAuth,
  googleAuthApiRef,
  identityApiRef,
  OAuth2,
  oauth2ApiRef,
  oauthRequestApiRef,
  OAuthRequestManager,
  OktaAuth,
  oktaAuthApiRef,
  Auth0Auth,
  auth0AuthApiRef,
  configApiRef,
  ConfigReader,
} from '@backstage/core';

const builder = ApiRegistry.builder();

builder.add(configApiRef, new ConfigReader({}));

const alertApi = builder.add(alertApiRef, new AlertApiForwarder());

builder.add(errorApiRef, new ErrorAlerter(alertApi, new ErrorApiForwarder()));

builder.add(identityApiRef, {
  getUserId: () => 'guest',
  getProfile: () => ({ email: 'guest@example.com' }),
  getIdToken: () => undefined,
  signOut: async () => {},
});

const oauthRequestApi = builder.add(
  oauthRequestApiRef,
  new OAuthRequestManager(),
);

builder.add(
  googleAuthApiRef,
  GoogleAuth.create({
    apiOrigin: 'http://localhost:7000',
    basePath: '/auth/',
    oauthRequestApi,
  }),
);

builder.add(
  githubAuthApiRef,
  GithubAuth.create({
    apiOrigin: 'http://localhost:7000',
    basePath: '/auth/',
    oauthRequestApi,
  }),
);

builder.add(
  gitlabAuthApiRef,
  GitlabAuth.create({
    apiOrigin: 'http://localhost:7000',
    basePath: '/auth/',
    oauthRequestApi,
  }),
);

builder.add(
  oktaAuthApiRef,
  OktaAuth.create({
    apiOrigin: 'http://localhost:7000',
    basePath: '/auth/',
    oauthRequestApi,
  }),
);

builder.add(
  auth0AuthApiRef,
  Auth0Auth.create({
    apiOrigin: 'http://localhost:7000',
    basePath: '/auth/',
    oauthRequestApi,
  }),
);

builder.add(
  oauth2ApiRef,
  OAuth2.create({
    apiOrigin: 'http://localhost:7000',
    basePath: '/auth/',
    oauthRequestApi,
  }),
);

export const apis = builder.build();
