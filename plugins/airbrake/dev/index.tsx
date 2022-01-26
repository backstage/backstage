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
import { airbrakePlugin, EntityAirbrakeContent } from '../src';
import { airbrakeApiRef, MockAirbrakeApi } from '../src/api';
import { ApiBar } from './components/ApiBar';
import { Content, Header, Page } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createEntity } from '../src/api/mock/mock-entity';
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';
import AirplanemodeInactiveIcon from '@material-ui/icons/AirplanemodeInactive';

createDevApp()
  .registerPlugin(airbrakePlugin)
  .registerApi({
    api: airbrakeApiRef,
    deps: {},
    factory: () => new MockAirbrakeApi(),
  })
  .addPage({
    element: (
      <Page themeId="tool">
        <Header
          title="Airbrake demo application"
          subtitle="This uses a fake API"
        />
        <Content>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2em',
            }}
          >
            <EntityProvider entity={createEntity('demo')}>
              <EntityAirbrakeContent />
            </EntityProvider>
          </div>
        </Content>
      </Page>
    ),
    title: 'Mock API',
    path: '/airbrake-mock-api',
    icon: AirplanemodeActiveIcon,
  })
  .addPage({
    element: (
      <Page themeId="tool">
        <Header
          title="Airbrake demo application"
          subtitle="Test the plugin below"
        />
        <Content>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2em',
            }}
          >
            <ApiBar />
            <EntityProvider entity={createEntity('demo')}>
              <EntityAirbrakeContent />
            </EntityProvider>
          </div>
        </Content>
      </Page>
    ),
    title: 'Real API',
    path: '/airbrake-real-api',
    icon: AirplanemodeInactiveIcon,
  })
  .render();
