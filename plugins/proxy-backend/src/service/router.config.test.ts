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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  registerMswTestHooks,
  startTestBackend,
} from '@backstage/backend-test-utils';
import {
  ConfigSources,
  MutableConfigSource,
  StaticConfigSource,
} from '@backstage/config-loader';
import { HttpResponse, http, passthrough } from 'msw';
import { setupServer } from 'msw/node';

// this test is stored in its own file to work around the mocked
// http-proxy-middleware module used in the main test file

describe('createRouter reloadable configuration', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  it('should be able to observe the config', async () => {
    // Grab the subscriber function and use mutable config data to mock a config file change
    const mutableConfigSource = MutableConfigSource.create({ data: {} });
    const config = await ConfigSources.toConfig(
      ConfigSources.merge([
        StaticConfigSource.create({
          data: {
            proxy: {
              endpoints: {
                '/test': {
                  target: 'https://non-existing-example.com',
                  credentials: 'dangerously-allow-unauthenticated',
                },
              },
            },
          },
        }),
        mutableConfigSource,
      ]),
    );

    const backend = await startTestBackend({
      features: [
        import('..'),
        createServiceFactory({
          service: coreServices.rootConfig,
          deps: {},
          factory: () => config,
        }),
      ],
    });

    try {
      const baseUrl = `http://localhost:${backend.server.port()}`;

      server.use(
        http.all(`${baseUrl}/*`, passthrough),
        http.get('https://non-existing-example.com/*', req =>
          HttpResponse.json({
            url: req.request.url.toString(),
            headers: req.request.headers,
          }),
        ),
      );

      await expect(fetch(`${baseUrl}/api/proxy/test`)).resolves.toMatchObject({
        status: 200,
      });
      await expect(
        fetch(`${baseUrl}/api/proxy/test2`),
      ).resolves.not.toMatchObject({ status: 200 });

      mutableConfigSource.setData({
        proxy: {
          endpoints: {
            '/test2': {
              target: 'https://non-existing-example.com',
              credentials: 'dangerously-allow-unauthenticated',
            },
          },
        },
      });

      await expect(fetch(`${baseUrl}/api/proxy/test2`)).resolves.toMatchObject({
        status: 200,
      });
    } finally {
      await backend.stop();
    }
  });
});
