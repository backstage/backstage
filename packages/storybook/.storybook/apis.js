import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  oauthRequestApiRef,
  OAuthRequestManager,
  googleAuthApiRef,
  githubAuthApiRef,
  AlertApiForwarder,
  ErrorApiForwarder,
  ErrorAlerter,
  GoogleAuth,
  GithubAuth,
  identityApiRef,
  MockIdentity,
} from '@backstage/core';

const builder = ApiRegistry.builder();

const alertApi = builder.add(alertApiRef, new AlertApiForwarder());

builder.add(errorApiRef, new ErrorAlerter(alertApi, new ErrorApiForwarder()));

builder.add(identityApiRef, new MockIdentity());

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

export const apis = builder.build();
