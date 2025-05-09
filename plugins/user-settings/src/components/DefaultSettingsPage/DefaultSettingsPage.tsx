/*
 * Copyright 2022 The Backstage Authors
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

import { ReactElement } from 'react';
import { UserSettingsAuthProviders } from '../AuthProviders';
import { UserSettingsFeatureFlags } from '../FeatureFlags';
import { UserSettingsGeneral } from '../General';
import { SettingsLayout, SettingsLayoutRouteProps } from '../SettingsLayout';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

/**
 * @public
 */
export const DefaultSettingsPage = (props: {
  tabs?: ReactElement<SettingsLayoutRouteProps>[];
  providerSettings?: JSX.Element;
}) => {
  const { providerSettings, tabs } = props;
  const { t } = useTranslationRef(userSettingsTranslationRef);

  return (
    <SettingsLayout>
      <SettingsLayout.Route
        path="general"
        title={t('defaultSettingsPage.tabsTitle.general')}
      >
        <UserSettingsGeneral />
      </SettingsLayout.Route>
      <SettingsLayout.Route
        path="auth-providers"
        title={t('defaultSettingsPage.tabsTitle.authProviders')}
      >
        <UserSettingsAuthProviders providerSettings={providerSettings} />
      </SettingsLayout.Route>
      <SettingsLayout.Route
        path="feature-flags"
        title={t('defaultSettingsPage.tabsTitle.featureFlags')}
      >
        <UserSettingsFeatureFlags />
      </SettingsLayout.Route>
      {tabs}
    </SettingsLayout>
  );
};
