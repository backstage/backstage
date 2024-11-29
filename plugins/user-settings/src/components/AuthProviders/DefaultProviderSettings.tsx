/*
 * Copyright 2020 The Backstage Authors
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

import Star from '@material-ui/icons/Star';
import React from 'react';
import { ProviderSettingsItem } from './ProviderSettingsItem';
import {
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  oktaAuthApiRef,
  microsoftAuthApiRef,
  bitbucketAuthApiRef,
  bitbucketServerAuthApiRef,
  atlassianAuthApiRef,
  oneloginAuthApiRef,
} from '@backstage/core-plugin-api';

/** @public */
export const DefaultProviderSettings = (props: {
  configuredProviders: string[];
}) => {
  const { configuredProviders } = props;
  return (
    <>
      {configuredProviders.includes('google') && (
        <ProviderSettingsItem
          title="Google"
          description="Provides authentication towards Google APIs and identities"
          apiRef={googleAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('microsoft') && (
        <ProviderSettingsItem
          title="Microsoft"
          description="Provides authentication towards Microsoft APIs and identities"
          apiRef={microsoftAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('github') && (
        <ProviderSettingsItem
          title="GitHub"
          description="Provides authentication towards GitHub APIs"
          apiRef={githubAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('gitlab') && (
        <ProviderSettingsItem
          title="GitLab"
          description="Provides authentication towards GitLab APIs"
          apiRef={gitlabAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('okta') && (
        <ProviderSettingsItem
          title="Okta"
          description="Provides authentication towards Okta APIs"
          apiRef={oktaAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('bitbucket') && (
        <ProviderSettingsItem
          title="Bitbucket"
          description="Provides authentication towards Bitbucket APIs"
          apiRef={bitbucketAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('onelogin') && (
        <ProviderSettingsItem
          title="OneLogin"
          description="Provides authentication towards OneLogin APIs"
          apiRef={oneloginAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('atlassian') && (
        <ProviderSettingsItem
          title="Atlassian"
          description="Provides authentication towards Atlassian APIs"
          apiRef={atlassianAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('bitbucketServer') && (
        <ProviderSettingsItem
          title="Bitbucket Server"
          description="Provides authentication towards Bitbucket Server APIs"
          apiRef={bitbucketServerAuthApiRef}
          icon={Star}
        />
      )}
    </>
  );
};
