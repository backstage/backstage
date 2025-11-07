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
  openshiftAuthApiRef,
} from '@backstage/core-plugin-api';
import { userSettingsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/frontend-plugin-api';

/** @public */
export const DefaultProviderSettings = (props: {
  configuredProviders: string[];
}) => {
  const { configuredProviders } = props;
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return (
    <>
      {configuredProviders.includes('google') && (
        <ProviderSettingsItem
          title="Google"
          description={t('defaultProviderSettings.description', {
            provider: 'Google',
          })}
          apiRef={googleAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('microsoft') && (
        <ProviderSettingsItem
          title="Microsoft"
          description={t('defaultProviderSettings.description', {
            provider: 'Microsoft',
          })}
          apiRef={microsoftAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('github') && (
        <ProviderSettingsItem
          title="GitHub"
          description={t('defaultProviderSettings.description', {
            provider: 'GitHub',
          })}
          apiRef={githubAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('gitlab') && (
        <ProviderSettingsItem
          title="GitLab"
          description={t('defaultProviderSettings.description', {
            provider: 'GitLab',
          })}
          apiRef={gitlabAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('okta') && (
        <ProviderSettingsItem
          title="Okta"
          description={t('defaultProviderSettings.description', {
            provider: 'Okta',
          })}
          apiRef={oktaAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('bitbucket') && (
        <ProviderSettingsItem
          title="Bitbucket"
          description={t('defaultProviderSettings.description', {
            provider: 'Bitbucket',
          })}
          apiRef={bitbucketAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('onelogin') && (
        <ProviderSettingsItem
          title="OneLogin"
          description={t('defaultProviderSettings.description', {
            provider: 'OneLogin',
          })}
          apiRef={oneloginAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('atlassian') && (
        <ProviderSettingsItem
          title="Atlassian"
          description={t('defaultProviderSettings.description', {
            provider: 'Atlassian',
          })}
          apiRef={atlassianAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('bitbucketServer') && (
        <ProviderSettingsItem
          title="Bitbucket Server"
          description={t('defaultProviderSettings.description', {
            provider: 'Bitbucket Server',
          })}
          apiRef={bitbucketServerAuthApiRef}
          icon={Star}
        />
      )}
      {configuredProviders.includes('openshift') && (
        <ProviderSettingsItem
          title="OpenShift"
          description="Provides authentication towards OpenShift APIs and identities"
          apiRef={openshiftAuthApiRef}
          icon={Star}
        />
      )}
    </>
  );
};
