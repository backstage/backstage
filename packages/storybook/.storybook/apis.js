import {
  AlertApiForwarder,
  ErrorAlerter,
  ErrorApiForwarder,
  GithubAuth,
  GitlabAuth,
  GoogleAuth,
  OAuth2,
  OAuthRequestManager,
  OktaAuth,
  Auth0Auth,
  ConfigReader,
  LocalStorageFeatureFlags,
} from '@backstage/core-app-api';

import {
  alertApiRef,
  errorApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  identityApiRef,
  oauth2ApiRef,
  oauthRequestApiRef,
  oktaAuthApiRef,
  auth0AuthApiRef,
  configApiRef,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';

const configApi = new ConfigReader({});
const featureFlagsApi = new LocalStorageFeatureFlags();
const alertApi = new AlertApiForwarder();
const errorApi = new ErrorAlerter(alertApi, new ErrorApiForwarder());
const identityApi = {
  getUserId: () => 'guest',
  getProfile: () => ({ email: 'guest@example.com' }),
  getIdToken: () => undefined,
  signOut: async () => {},
};
const oauthRequestApi = new OAuthRequestManager();
const googleAuthApi = GoogleAuth.create({
  apiOrigin: 'http://localhost:7007',
  basePath: '/auth/',
  oauthRequestApi,
});
const githubAuthApi = GithubAuth.create({
  apiOrigin: 'http://localhost:7007',
  basePath: '/auth/',
  oauthRequestApi,
});
const gitlabAuthApi = GitlabAuth.create({
  apiOrigin: 'http://localhost:7007',
  basePath: '/auth/',
  oauthRequestApi,
});
const oktaAuthApi = OktaAuth.create({
  apiOrigin: 'http://localhost:7007',
  basePath: '/auth/',
  oauthRequestApi,
});
const auth0AuthApi = Auth0Auth.create({
  apiOrigin: 'http://localhost:7007',
  basePath: '/auth/',
  oauthRequestApi,
});
const oauth2Api = OAuth2.create({
  apiOrigin: 'http://localhost:7007',
  basePath: '/auth/',
  oauthRequestApi,
});

export const apis = [
  [configApiRef, configApi],
  [featureFlagsApiRef, featureFlagsApi],
  [alertApiRef, alertApi],
  [errorApiRef, errorApi],
  [identityApiRef, identityApi],
  [oauthRequestApiRef, oauthRequestApi],
  [googleAuthApiRef, googleAuthApi],
  [githubAuthApiRef, githubAuthApi],
  [gitlabAuthApiRef, gitlabAuthApi],
  [oktaAuthApiRef, oktaAuthApi],
  [auth0AuthApiRef, auth0AuthApi],
  [oauth2ApiRef, oauth2Api],
];
