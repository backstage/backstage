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
import React from 'react';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
  Tabs,
  Table,
  TableColumn,
  useApi,
  configApiRef, Progress
} from '@backstage/core';
import { chromeuxReportApiRef } from "../../api";
import { useAsync } from "react-use";
import Alert from "@material-ui/lab/Alert";

export const ChromeUXReport = () => {
  const configApi = useApi(configApiRef);
  const chromeUXReportApi = useApi(chromeuxReportApiRef);
  const origins = configApi.getStringArray('chromeUXReport.origins');
  const columns: TableColumn[] = [
    {
      title: 'Form Factor',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Connection Type',
      field: 'col2',
    },
    {
      title: 'First Contentful Paint',
      field: 'col3'
    },
    {
      title: 'Largest Contentful Paint',
      field: 'col4'
    },
    {
      title: 'Dom Content Loaded',
      field: 'col5'
    },
  ];

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await chromeUXReportApi.getChromeUXMetrics(origins[1]);
    return response.metrics;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const {
    form_factor,
    connection_type,
    first_contentful_paint,
    largest_contentful_paint,
    dom_content_loaded
  } = value;

  const table = <Table
    options={{paging: false, search: false}}
    data={[{
      col1: form_factor,
      col2: connection_type,
      col3: first_contentful_paint.rates.fast,
      col4: largest_contentful_paint.rates.fast,
      col5: dom_content_loaded.rates.fast
    }]}
    columns={columns}
  />;

  const tabs = origins && origins.length > 0 ? origins.map(
    (origin: string) => ({
      label: origin,
      content: table,
    }),
  ) : [{
    label: 'test',
    content: table,
  }];

  return <Page themeId="tool">
    <Header title="Chrome UX Report" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X"/>
      <HeaderLabel label="Lifecycle" value="Alpha"/>
    </Header>
    <Content>
      <div>
        <Tabs tabs={tabs} />
      </div>
    </Content>
  </Page>
};
