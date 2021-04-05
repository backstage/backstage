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
  Page,
  Content,
  Tabs,
  useApi,
  configApiRef,
  Header
} from '@backstage/core';
import { Config } from '@backstage/config';
import { ChromeUXReportChart } from './ChromeUXReportChart';

export const ChromeUXReportPage = () => {
  const configApi = useApi(configApiRef);
  const origins = configApi.getConfigArray('chromeUXReport.origins');

  const tabs = origins.map(
    (origin: Config) => ({
      label: origin.getString("name"),
      content: <ChromeUXReportChart origin={origin.getString("site")} />,
    }),
  );

  return (
    <Page themeId="tool">
      <Header
        title="Chrome UX Report"
        subtitle="Chrome UX Report is a powerful plugin for analyzing your site’s speed in a variety of different ways."
      />
      <Content>
        <Tabs tabs={tabs} />
      </Content>
    </Page>
  );
};
