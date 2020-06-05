import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  oauthRequestApiRef,
  OAuthRequestManager,
  googleAuthApiRef,
  AlertApiForwarder,
  ErrorApiForwarder,
  ErrorAlerter,
  GoogleAuth,
} from '@backstage/core';

const builder = ApiRegistry.builder();

const alertApi = builder.add(alertApiRef, new AlertApiForwarder());

builder.add(errorApiRef, new ErrorAlerter(alertApi, new ErrorApiForwarder()));

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

export const apis = builder.build();
