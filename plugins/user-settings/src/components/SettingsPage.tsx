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

import React, { useState } from 'react';
import { Content, Header, HeaderTabs, Page } from '@backstage/core';
import { General } from './General';
import { AuthProviders } from './AuthProviders';
import { FeatureFlags } from './FeatureFlags';

type Props = {
  providerSettings?: JSX.Element;
};

export const SettingsPage = ({ providerSettings }: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const onTabChange = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'auth-providers', label: 'Authentication Providers' },
    { id: 'feature-flags', label: 'Feature Flags' },
  ];

  const content = [
    <General />,
    <AuthProviders providerSettings={providerSettings} />,
    <FeatureFlags />,
  ];

  return (
    <Page themeId="home">
      <Header title="Settings" />
      <HeaderTabs tabs={tabs} onChange={onTabChange} />
      <Content>{content[activeTab]}</Content>
    </Page>
  );
};
