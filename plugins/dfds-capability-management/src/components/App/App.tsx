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
  useApi,
  configApiRef,
  microsoftAuthApiRef,
} from '@backstage/core';
import React from 'react';

import OverviewPage from '../../views/Overview';
import CICDPage from '../../views/CICD';
import KubernetesPage from '../../views/Kubernetes';
import CloudPage from '../../views/Cloud';
import MonitoringPage from '../../views/Monitoring';
import ExpensePage from '../../views/Expense';
import { ApplicationsList } from '../../views/IAM/ApplicationsList';
import { useAsync } from 'react-use';
import queryString from 'query-string';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { DataGrid } from '@mui/x-data-grid';

const cluster = [
  {
    id: '92e49432-d3d1-4e6c-b5ab-f7b7cb7c9a9b',
    name: 'Production cluster #1',
    description: 'The recommended Production cluster',
    enabled: true,
    clusterId: 'lkc-4npj6',
  },
  {
    id: '9cc6e73a-f62a-4f12-8fb5-3b489e39fb0a',
    name: 'Development cluster #1',
    description: '',
    enabled: true,
    clusterId: 'lkc-3wqzw',
  },
];

const topics = [
  {
    id: '2e581429-9a02-4dab-8b6a-bfc0dd6f51d4',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '92e49432-d3d1-4e6c-b5ab-f7b7cb7c9a9b',
    name: 'pub.customer-iam-ykpqn.user-dev',
    description:
      'Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 1,
    configurations: { 'retention.ms': -1 },
  },
  {
    id: 'd99cac7d-6705-43ab-9ff1-6525b99d1a18',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '92e49432-d3d1-4e6c-b5ab-f7b7cb7c9a9b',
    name: 'pub.customer-iam-ykpqn.user-test',
    description:
      'Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 3,
    configurations: { 'retention.ms': -1 },
  },
  {
    id: '81a8ec82-627c-455b-8eac-ae841210a84b',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '92e49432-d3d1-4e6c-b5ab-f7b7cb7c9a9b',
    name: 'pub.customer-iam-ykpqn.user-accept',
    description:
      'Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 3,
    configurations: { 'retention.ms': -1 },
  },
  {
    id: '30b2e524-bcd1-47be-86c7-d35d91108dcb',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '92e49432-d3d1-4e6c-b5ab-f7b7cb7c9a9b',
    name: 'pub.customer-iam-ykpqn.user-prod',
    description:
      'Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 6,
    configurations: { 'retention.ms': -1 },
  },
  {
    id: 'd7e4f5a0-b229-41e1-8445-3787ba5ad0dd',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '9cc6e73a-f62a-4f12-8fb5-3b489e39fb0a',
    name: 'pub.customer-iam-ykpqn.user-dev',
    description:
      ' Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 1,
    configurations: { 'retention.ms': 2678400000 },
  },
  {
    id: 'a0aef155-8fd2-4123-a475-bf86c65db0c2',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '9cc6e73a-f62a-4f12-8fb5-3b489e39fb0a',
    name: 'pub.customer-iam-ykpqn.user-test',
    description:
      ' Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 1,
    configurations: { 'retention.ms': 2678400000 },
  },
  {
    id: '86ed8bc6-ca54-4367-bd13-2da5f3183a4b',
    capabilityId: '4c03e2d9-f590-4900-9303-59adb3ebebb7',
    kafkaClusterId: '9cc6e73a-f62a-4f12-8fb5-3b489e39fb0a',
    name: 'pub.customer-iam-ykpqn.user-accept',
    description:
      ' Public topic, for aggregrate user on capability: Customer-IAM',
    partitions: 3,
    configurations: { 'retention.ms': 31536000000 },
  },
];

const Kafka = () => (
  <Box width="auto" mb="2rem">
    <DataGrid
      rows={topics}
      columns={[
        {
          field: 'name',
          headerName: 'name',

          valueGetter: params => {
            return params.row.name;
          },
        },
        {
          field: 'description',
          headerName: 'description',
          valueGetter: params => {
            return params.row.description;
          },
        },
        {
          field: 'kind',
          headerName: 'kind',
          valueGetter: () => {
            return 'topic';
          },
        },
      ]}
    />
  </Box>
);

const tabs = [
  {
    label: 'Overview',
    content: <OverviewPage />,
  },
  {
    label: 'Cloud',
    content: <CloudPage />,
  },
  {
    label: 'Kafka',
    content: <Kafka />,
  },
  {
    label: 'IAM',
    content: <ApplicationsList />,
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
    label: 'Monitoring',
    content: <MonitoringPage />,
  },
  {
    label: 'Expense',
    content: <ExpensePage />,
  },
];

export const UserContext = React.createContext(undefined);

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('no can do');
  }
  return context;
};

export const App = () => {
  const [selectedTab, setSelectedTab] = React.useState<number>(1);
  const authApi = useApi(microsoftAuthApiRef);
  const configApi = useApi(configApiRef);
  const baseUrl = configApi.getOptionalString('backend.baseUrl');
  const authResponse = useAsync(async (): Promise<any> => {
    // eslint-disable-next-line new-cap
    const token = await authApi.GetAccessTokenClientSide([
      'api://24420be9-46e5-4584-acd7-64850d2f2a03/access_as_user',
    ]);
    const authProfile = await authApi.getProfile();
    const response = await fetch(
      `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${
        queryString.parse(location.search).id
      }`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return { profile: authProfile, token, baseUrl, selectedCapability: data };
  }, []);

  return (
    <Page themeId="">
      <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU" />
      <UserContext.Provider value={authResponse}>
        <HeaderTabs
          selectedIndex={selectedTab}
          onChange={index => setSelectedTab(index)}
          tabs={tabs.map(({ label, content }, index) => ({
            id: index.toString(),
            label,
            content,
          }))}
        />
        {authResponse.value && <Content>{tabs[selectedTab].content}</Content>}
      </UserContext.Provider>
    </Page>
  );
};
