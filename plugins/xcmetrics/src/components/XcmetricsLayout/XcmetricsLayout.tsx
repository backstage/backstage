/*
 * Copyright 2021 The Backstage Authors
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
import React, { ReactChild } from 'react';
import {
  Content,
  Header,
  HeaderLabel,
  Page,
  TabbedLayout,
} from '@backstage/core-components';
import { OverviewComponent } from '../OverviewComponent';
import { buildsRouteRef, rootRouteRef } from '../../routes';
import { RouteRef, SubRouteRef } from '@backstage/core-plugin-api';
import { BuildListComponent } from '../BuildListComponent';

export interface TabConfig {
  routeRef: RouteRef | SubRouteRef;
  title: string;
  component: ReactChild;
}

const TABS: TabConfig[] = [
  {
    routeRef: rootRouteRef,
    title: 'Overview',
    component: <OverviewComponent />,
  },
  {
    routeRef: buildsRouteRef,
    title: 'Builds',
    component: <BuildListComponent />,
  },
];

export const XcmetricsLayout = () => (
  <Page themeId="tool">
    <Header title="XCMetrics" subtitle="Dashboard">
      <HeaderLabel label="Owner" value="Spotify" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <TabbedLayout>
      {TABS.map(tab => (
        <TabbedLayout.Route
          key={tab.routeRef.path}
          path={tab.routeRef.path}
          title={tab.title}
        >
          <Content>{tab.component}</Content>
        </TabbedLayout.Route>
      ))}
    </TabbedLayout>
  </Page>
);
