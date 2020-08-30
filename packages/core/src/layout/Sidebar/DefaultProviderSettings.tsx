/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  configApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  oauth2ApiRef,
  oktaAuthApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/core-api';
import Star from '@material-ui/icons/Star';
import React from 'react';
import { OAuthProviderSettings, OIDCProviderSettings } from './Settings';

export const DefaultProviderSettings = () => {
  const configApi = useApi(configApiRef);
  const providersConfig = configApi.getOptionalConfig('auth.providers');
  const providers = providersConfig?.keys() ?? [];

  return (
    <>
      {providers.includes('google') && (
        <OIDCProviderSettings
          title="Google"
          apiRef={googleAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('microsoft') && (
        <OIDCProviderSettings
          title="Microsoft"
          apiRef={microsoftAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('github') && (
        <OAuthProviderSettings
          title="Github"
          apiRef={githubAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('gitlab') && (
        <OAuthProviderSettings
          title="Gitlab"
          apiRef={gitlabAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('okta') && (
        <OIDCProviderSettings
          title="Okta"
          apiRef={oktaAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('oauth2') && (
        <OIDCProviderSettings
          title="YourOrg"
          apiRef={oauth2ApiRef}
          icon={Star}
        />
      )}
    </>
  );
};
