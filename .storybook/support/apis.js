import {
  AlertApiForwarder,
  AppThemeSelector,
  ErrorAlerter,
  ErrorApiForwarder,
  GithubAuth,
  GitlabAuth,
  GoogleAuth,
  OAuthRequestManager,
  OktaAuth,
  ConfigReader,
  LocalStorageFeatureFlags,
} from '@backstage/core-app-api';

import {
  alertApiRef,
  appThemeApiRef,
  errorApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  identityApiRef,
  oauthRequestApiRef,
  oktaAuthApiRef,
  configApiRef,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';

import { themes } from '@backstage/theme';

import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { MockTranslationApi } from '@backstage/test-utils/alpha';

const configApi = new ConfigReader({});
export const appThemeApi = AppThemeSelector.createWithStorage([
  { id: 'light', title: 'Light', variant: 'light', theme: themes.light },
  { id: 'dark', title: 'Dark', variant: 'dark', theme: themes.dark },
]);
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
const translationApi = MockTranslationApi.create();

export const apis = [
  [configApiRef, configApi],
  [appThemeApiRef, appThemeApi],
  [featureFlagsApiRef, featureFlagsApi],
  [alertApiRef, alertApi],
  [errorApiRef, errorApi],
  [identityApiRef, identityApi],
  [oauthRequestApiRef, oauthRequestApi],
  [googleAuthApiRef, googleAuthApi],
  [githubAuthApiRef, githubAuthApi],
  [gitlabAuthApiRef, gitlabAuthApi],
  [oktaAuthApiRef, oktaAuthApi],
  [translationApiRef, translationApi],
];
