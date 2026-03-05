/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { FrontendHostDiscovery } from './FrontendHostDiscovery';

describe('FrontendHostDiscovery', () => {
  it('is created from config', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/api/catalog',
    );
  });

  it('can configure the base path', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
      }),
      { pathPattern: '/service/{{pluginId}}' },
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/service/catalog',
    );
  });

  it('uses plugin specific targets from config if provided', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
        discovery: {
          endpoints: [
            {
              target: {
                internal: 'http://catalog-backend-internal:8080/api/catalog',
                external: 'http://catalog-backend-external:8080/api/catalog',
              },
              plugins: ['catalog'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://catalog-backend-external:8080/api/catalog',
    );
  });

  it('should not use internal plugin overrides', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
        discovery: {
          endpoints: [
            {
              target: {
                internal: 'http://catalog-backend-internal:8080/api/catalog',
              },
              plugins: ['catalog'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/api/catalog',
    );
  });

  it('uses a single target for internal and external for a plugin', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
        discovery: {
          endpoints: [
            {
              target: 'http://catalog-backend:8080/api/catalog',
              plugins: ['catalog'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://catalog-backend:8080/api/catalog',
    );
  });

  it('defaults to the backend baseUrl when there is not an endpoint for a plugin', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
        discovery: {
          endpoints: [
            {
              target: 'http://catalog-backend:8080/api/catalog',
              plugins: ['catalog'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('scaffolder')).resolves.toBe(
      'http://localhost:40/api/scaffolder',
    );
  });

  it('replaces {{pluginId}} or {{ pluginId }} in the target', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
        discovery: {
          endpoints: [
            {
              target: 'http://common-backend:8080/api/{{pluginId}}',
              plugins: ['catalog', 'docs'],
            },
            {
              target: {
                internal: 'http://scaffolder-internal:8080/api/{{ pluginId }}',
                external: 'http://scaffolder-external:8080/api/{{ pluginId }}',
              },
              plugins: ['scaffolder'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://common-backend:8080/api/catalog',
    );
    await expect(discovery.getBaseUrl('docs')).resolves.toBe(
      'http://common-backend:8080/api/docs',
    );
    await expect(discovery.getBaseUrl('scaffolder')).resolves.toBe(
      'http://scaffolder-external:8080/api/scaffolder',
    );
  });

  it('encodes the pluginId', async () => {
    const discovery = FrontendHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
        },
        discovery: {
          endpoints: [
            {
              target: 'http://common-backend:8080/api/{{pluginId}}',
              plugins: ['plugin/beta'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('plugin/beta')).resolves.toBe(
      'http://common-backend:8080/api/plugin%2Fbeta',
    );
    await expect(discovery.getBaseUrl('plugin/alpha')).resolves.toBe(
      'http://localhost:40/api/plugin%2Falpha',
    );
  });
});
