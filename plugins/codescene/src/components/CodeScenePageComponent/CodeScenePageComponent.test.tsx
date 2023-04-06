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
import { CodeScenePageComponent } from './CodeScenePageComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { rootRouteRef } from '../../routes';
import {
  setupRequestMockHandlers,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { codesceneApiRef, CodeSceneClient } from '../../api/api';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';

describe('CodeScenePageComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);
  let apis: TestApiRegistry;

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
    const discoveryApi: DiscoveryApi = {
      async getBaseUrl(pluginId) {
        return `http://base.com/${pluginId}`;
      },
    };
    apis = TestApiRegistry.from([
      codesceneApiRef,
      new CodeSceneClient({ discoveryApi }),
    ]);
  });

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CodeScenePageComponent />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/codescene': rootRouteRef,
        },
      },
    );
    expect(rendered.getByText('CodeScene')).toBeInTheDocument();
  });
});
