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
import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { airbrakePlugin, EntityAirbrakeContent } from '../src';
import {
  airbrakeApiRef,
  localDiscoveryApi,
  MockAirbrakeApi,
  ProductionAirbrakeApi,
} from '../src/api';
import { ApiBar } from './components/ApiBar';
import { Content, Header, Page } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createEntity } from '../src/api';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import CloudIcon from '@material-ui/icons/Cloud';
import { Context, ContextProvider } from './components/ContextProvider';

createDevApp()
  .registerPlugin(airbrakePlugin)
  .addPage({
    element: (
      <Page themeId="tool">
        <Header title="Airbrake demo application" subtitle="Mock API" />
        <Content>
          <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi(800)]]}>
            <EntityProvider entity={createEntity(1234)}>
              <EntityAirbrakeContent />
            </EntityProvider>
          </TestApiProvider>
        </Content>
      </Page>
    ),
    title: 'Mock API',
    path: '/airbrake-mock-api',
    icon: CloudOffIcon,
  })
  .addPage({
    element: (
      <ContextProvider>
        <Page themeId="tool">
          <Header
            title="Airbrake demo application"
            subtitle="Real API (The Airbrake backend plugin must be running for this to work)"
          >
            <ApiBar />
          </Header>
          <Content>
            <Context.Consumer>
              {value => (
                <TestApiProvider
                  apis={[
                    [
                      airbrakeApiRef,
                      new ProductionAirbrakeApi(localDiscoveryApi),
                    ],
                  ]}
                >
                  <EntityProvider entity={createEntity(value.projectId)}>
                    <EntityAirbrakeContent />
                  </EntityProvider>
                </TestApiProvider>
              )}
            </Context.Consumer>
          </Content>
        </Page>
      </ContextProvider>
    ),
    title: 'Real API',
    path: '/airbrake-real-api',
    icon: CloudIcon,
  })
  .render();
