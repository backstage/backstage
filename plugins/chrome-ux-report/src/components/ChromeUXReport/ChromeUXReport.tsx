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
  Tabs
} from '@backstage/core';
import { Charts } from "./Charts";

const uxMetrics = [{
  longName: 'Firt Contentful Paint',
  shortName: 'fcp'
}, {
  longName: 'Largest Contentful Paint',
  shortName: 'lcp'
}, {
  longName: 'Dom Content Loaded',
  shortName: 'dcl'
}];

export const ChromeUXReport = () => (
  <Page themeId="tool">
    <Header title="Chrome UX Report" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X"/>
      <HeaderLabel label="Lifecycle" value="Alpha"/>
    </Header>
    <Content>
      <div>
        <Tabs
          tabs={uxMetrics.map((metric: {longName: string, shortName: string}) => ({
              label: `${metric.longName}`,
              content: <Charts metric={metric} />,
          }))}
        />
      </div>
    </Content>
  </Page>
);
