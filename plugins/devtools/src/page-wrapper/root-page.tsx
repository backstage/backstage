/*
 * Copyright 2022 The Backstage Authors
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
import { Route, Routes, Outlet, useParams, Navigate } from 'react-router';

import { BackstageApp } from '@backstage/core-app-api';

import { PageName, pages } from './pages';
import { PageWrapper } from './wrapper';

import { BackstageAppProvider } from '../hooks-internal/backstage-app';

import { ApisPage } from '../pages/apis';
import { ApiGraphPage } from '../pages/api-graph';
import { PluginsPage } from '../pages/plugins';
import { PluginPage } from '../pages/plugin';
import { RoutesPage } from '../pages/routes';

const pageComponents: Record<PageName, React.ComponentType> = {
  apis: ApisPage,
  'api-graph': ApiGraphPage,
  plugins: PluginsPage,
  routes: RoutesPage,
};

export interface RootPageProps {
  app: BackstageApp;
}

export function RootPage(props: RootPageProps) {
  return (
    <BackstageAppProvider value={props.app}>
      <Routes>
        <Route path="/*" element={<Wrapper />}>
          <Route path="/" element={<Navigate replace to="apis" />} />
          <Route path="/plugins/:pluginId" element={<PluginPage />} />
          {pages.map(page => {
            const Component = pageComponents[page.name];
            return (
              <Route key={page.name} path={page.name} element={<Component />} />
            );
          })}
        </Route>
      </Routes>
    </BackstageAppProvider>
  );
}

function Wrapper() {
  let { '*': pageParam } = useParams();

  if (pageParam.includes('/')) pageParam = pageParam.split('/')[0];

  const page: PageName = pageParam === '' ? 'apis' : (pageParam as PageName);

  return (
    <PageWrapper page={page as PageName}>
      <Outlet />
    </PageWrapper>
  );
}
