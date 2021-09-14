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
  configApiRef,
  Content,
  Header,
  // HeaderLabel,
  HeaderTabs,
  microsoftAuthApiRef,
  Page,
  ProfileInfo,
  Progress,
  useApi,
} from '@backstage/core';
import React from 'react';

import OverviewPage from '../../views/Overview';
import CICDPage from '../../views/CICD';
import KubernetesPage from '../../views/Kubernetes';
import CloudPage from '../../views/Cloud';
import MonitoringPage from '../../views/Monitoring';
import ExpensePage from '../../views/Expense';
import { useAsync } from 'react-use';
import queryString from 'query-string';
import { AsyncState } from 'react-use/lib/useAsync';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Autocomplete } from '@material-ui/lab';
import { Box, TextField } from '@material-ui/core';

const AuthContext = React.createContext<AsyncState<any> | undefined>(undefined);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthContextProvider');
  }
  return context;
};

const Kafka = () => {
  const {
    value: { token, baseUrl, selectedCapability },
  } = useAuthContext();
  const { value, loading, error } = useAsync(
    async (): Promise<any> => {
      const response = await fetch(
        `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${selectedCapability?.id}/topics`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const cluster: any = await fetch(
        `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${selectedCapability?.id}/cluster`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      return {
        ...data,
        cluster: cluster.reduce((acc: any, curr: { id: any }) => {
          return { ...acc, [curr.id]: curr };
        }, {}),
      };
    },
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <div>
      <Box width="auto" mb="2rem">
        <Autocomplete
          options={value?.items || []}
          getOptionLabel={(option: { name: string }) => option.name}
          renderInput={params => (
            <TextField {...params} label="Search ..." variant="outlined" />
          )}
        />
      </Box>
      <DataGrid
        autoHeight
        rows={value?.items || []}
        columns={[
          {
            field: 'id',
            headerName: 'id',
            flex: 1,
          },
          {
            field: 'name',
            headerName: 'name',
            flex: 1,
          },
          {
            field: 'description',
            headerName: 'description',
            flex: 1,
          },
          {
            field: 'kafkaClusterId',
            headerName: 'kafkaClusterId',
            flex: 1,
            valueGetter: params => {
              return value.cluster[params.id].name;
            },
          },
        ]}
      />
    </div>
  );
};
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
    label: 'Kubernetes',
    content: <KubernetesPage />,
  },
  {
    label: 'CI/CD',
    content: <CICDPage />,
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
  const authApi = useApi(microsoftAuthApiRef);
  const configApi = useApi(configApiRef);
  const baseUrl = configApi.getOptionalString('backend.baseUrl');
  const authResponse = useAsync(async (): Promise<{
    profile: ProfileInfo | undefined;
    token: string;
    baseUrl: string | undefined;
    selectedCapability: any;
  }> => {
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
      <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU">
        {/* <HeaderLabel label="Owner" value="DevX" />
        <HeaderLabel label="Lifecycle" value="Alpha" /> */}
      </Header>
      <AuthContext.Provider value={authResponse}>
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
      </AuthContext.Provider>
    </Page>
  );
};
