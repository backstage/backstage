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
  SidebarPinStateContext,
  TabbedLayout,
} from '@backstage/core-components';
import React, { useContext, ReactElement } from 'react';
import { useOutlet } from 'react-router';
import { UserSettingsAuthProviders } from './AuthProviders';
import { UserSettingsFeatureFlags } from './FeatureFlags';
import { UserSettingsGeneral } from './General';

type Props = {
  providerSettings?: JSX.Element;
};

export const SettingsPage = ({ providerSettings }: Props) => {
  const { isMobile } = useContext(SidebarPinStateContext);
  const outlet = useOutlet();

  const extraTabs = (React.Children.toArray(outlet?.props?.children) ||
    []) as Array<ReactElement>;
  const notCompliantTab = Array.from(extraTabs).some(
    child => (child.type as any)?.displayName !== 'UserSettingsTab',
  );
  if (notCompliantTab) {
    throw new Error(
      'Invalid element passed to SettingsPage Outlet. You may only pass children of type UserSettingsTab.',
    );
  }

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

        {extraTabs.map((child, i) => {
          const path: string = child.props.path;
          const title: string = child.props.title;

          return (
            <TabbedLayout.Route key={i} path={path} title={title}>
              {child}
            </TabbedLayout.Route>
          );
        })}
      </TabbedLayout>
    </Page>
  );
};
