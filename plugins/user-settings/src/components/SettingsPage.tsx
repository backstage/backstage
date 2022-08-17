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

import {
  Header,
  Page,
  TabbedLayout,
  useSidebarPinState,
} from '@backstage/core-components';
import React from 'react';
import { useOutlet } from 'react-router';
import { useElementFilter } from '@backstage/core-plugin-api';
import { UserSettingsAuthProviders } from './AuthProviders';
import { UserSettingsFeatureFlags } from './FeatureFlags';
import { UserSettingsGeneral } from './General';
import { USER_SETTINGS_TAB_KEY, UserSettingsTabProps } from './UserSettingsTab';

type Props = {
  providerSettings?: JSX.Element;
};

export const SettingsPage = ({ providerSettings }: Props) => {
  const { isMobile } = useSidebarPinState();
  const outlet = useOutlet();

  const tabs = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: USER_SETTINGS_TAB_KEY,
      })
      .getElements<UserSettingsTabProps>(),
  );

  return (
    <Page themeId="home">
      {!isMobile && <Header title="Settings" />}
      <TabbedLayout>
        <TabbedLayout.Route path="general" title="General">
          <UserSettingsGeneral />
        </TabbedLayout.Route>
        <TabbedLayout.Route
          path="auth-providers"
          title="Authentication Providers"
        >
          <UserSettingsAuthProviders providerSettings={providerSettings} />
        </TabbedLayout.Route>
        <TabbedLayout.Route path="feature-flags" title="Feature Flags">
          <UserSettingsFeatureFlags />
        </TabbedLayout.Route>

        {tabs.map((child, i) => (
          <TabbedLayout.Route key={i} {...child.props}>
            {child}
          </TabbedLayout.Route>
        ))}
      </TabbedLayout>
    </Page>
  );
};
