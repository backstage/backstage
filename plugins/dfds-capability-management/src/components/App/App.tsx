/*
 * Copyright 2021 Spotify AB
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
  Content,
  Header,
  // HeaderLabel,
  HeaderTabs,
  Page,
} from '@backstage/core';
import React from 'react';

import OverviewPage from '../../views/Overview';
import CICDPage from '../../views/CICD';
import KubernetesPage from '../../views/Kubernetes';
import CloudPage from '../../views/Cloud';
import MonitoringPage from '../../views/Monitoring';
import ExpensePage from '../../views/Expense';

const tabs = [
  {
    label: 'Overview',
    content: <OverviewPage />,
  },
  {
    label: 'CI/CD',
    content: <CICDPage />,
  },
  {
    label: 'Kubernetes',
    content: <KubernetesPage />,
  },
  {
    label: 'Cloud',
    content: <CloudPage />,
  },
  {
    label: 'Monitoring',
    content: <MonitoringPage />,
  },
  {
    label: 'Expense',
    content: <ExpensePage />,
  },
];

export const App = () => {
  const [selectedTab, setSelectedTab] = React.useState<number>(0);
  return (
    <Page themeId="">
      <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU">
        {/* <HeaderLabel label="Owner" value="DevX" />
        <HeaderLabel label="Lifecycle" value="Alpha" /> */}
      </Header>
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
        tabs={tabs.map(({ label, content }, index) => ({
          id: index.toString(),
          label,
          content,
        }))}
      />
      <Content>{tabs[selectedTab].content}</Content>
    </Page>
  );
};
