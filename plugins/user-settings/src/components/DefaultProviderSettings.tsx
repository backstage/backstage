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
} from '@backstage/core';
import Star from '@material-ui/icons/Star';
import React from 'react';
import { ProviderSettingsItem } from './ProviderSettingsItem';

export const DefaultProviderSettings = () => {
  const configApi = useApi(configApiRef);
  const providersConfig = configApi.getOptionalConfig('auth.providers');
  const providers = providersConfig?.keys() ?? [];

  return (
    <>
      {providers.includes('google') && (
        <ProviderSettingsItem
          title="Google"
          description={googleAuthApiRef.description}
          apiRef={googleAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('microsoft') && (
        <ProviderSettingsItem
          title="Microsoft"
          description={microsoftAuthApiRef.description}
          apiRef={microsoftAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('github') && (
        <ProviderSettingsItem
          title="Github"
          description={githubAuthApiRef.description}
          apiRef={githubAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('gitlab') && (
        <ProviderSettingsItem
          title="Gitlab"
          description={gitlabAuthApiRef.description}
          apiRef={gitlabAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('okta') && (
        <ProviderSettingsItem
          title="Okta"
          description={oktaAuthApiRef.description}
          apiRef={oktaAuthApiRef}
          icon={Star}
        />
      )}
      {providers.includes('oauth2') && (
        <ProviderSettingsItem
          title="YourOrg"
          description={oauth2ApiRef.description}
          apiRef={oauth2ApiRef}
          icon={Star}
        />
      )}
    </>
  );
};
