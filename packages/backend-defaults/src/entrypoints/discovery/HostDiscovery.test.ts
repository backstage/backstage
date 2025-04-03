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
import { HostDiscovery } from './HostDiscovery';

describe('HostDiscovery', () => {
  it('is created from config', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://localhost:80/api/catalog',
    );
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/api/catalog',
    );
  });

  it('strips trailing slashes in config', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40//',
          listen: { port: 80, host: 'localhost' },
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://localhost:80/api/catalog',
    );
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/api/catalog',
    );
  });

  it.each([
    [{ listen: ':80' }, 'http://localhost:80'],
    [{ listen: ':40', https: true }, 'https://localhost:40'],
    [{ listen: '127.0.0.1:80' }, 'http://127.0.0.1:80'],
    [{ listen: '127.0.0.1:80', https: true }, 'https://127.0.0.1:80'],
    [{ listen: '0.0.0.0:40' }, 'http://127.0.0.1:40'],
    [{ listen: { port: 80 } }, 'http://localhost:80'],
    [{ listen: { port: 8000 } }, 'http://localhost:8000'],
    [{ listen: { port: 80, host: '0.0.0.0' } }, 'http://127.0.0.1:80'],
    [{ listen: { port: 80, host: '::' } }, 'http://localhost:80'],
    [{ listen: { port: 80, host: '::1' } }, 'http://[::1]:80'],
    [{ listen: { port: 90, host: '::2' }, https: true }, 'https://[::2]:90'],
  ])('resolves internal baseUrl for %j as %s', async (config, expected) => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          ...config,
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      `${expected}/api/catalog`,
    );
  });

  it('uses plugin specific targets from config if provided', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
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
      'http://catalog-backend-internal:8080/api/catalog',
    );
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://catalog-backend-external:8080/api/catalog',
    );
  });

  it('uses a single target for internal and external for a plugin', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
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
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://catalog-backend:8080/api/catalog',
    );
  });

  it('defaults to the backend baseUrl when there is not an endpoint for a plugin', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
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
      'http://localhost:80/api/scaffolder',
    );
    await expect(discovery.getExternalBaseUrl('scaffolder')).resolves.toBe(
      'http://localhost:40/api/scaffolder',
    );
  });

  it('allows plugin overrides to only override either internal or external targets', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
        },
        discovery: {
          endpoints: [
            {
              target: { internal: 'http://catalog-backend:8080/api/catalog' },
              plugins: ['catalog'],
            },
            {
              target: { external: 'http://frontend/api/scaffolder' },
              plugins: ['scaffolder'],
            },
          ],
        },
      }),
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://catalog-backend:8080/api/catalog',
    );
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/api/catalog',
    );
    await expect(discovery.getBaseUrl('scaffolder')).resolves.toBe(
      'http://localhost:80/api/scaffolder',
    );
    await expect(discovery.getExternalBaseUrl('scaffolder')).resolves.toBe(
      'http://frontend/api/scaffolder',
    );
  });

  it('replaces {{pluginId}} or {{ pluginId }} in the target', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
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
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://common-backend:8080/api/catalog',
    );
    await expect(discovery.getBaseUrl('docs')).resolves.toBe(
      'http://common-backend:8080/api/docs',
    );
    await expect(discovery.getExternalBaseUrl('docs')).resolves.toBe(
      'http://common-backend:8080/api/docs',
    );
    await expect(discovery.getBaseUrl('scaffolder')).resolves.toBe(
      'http://scaffolder-internal:8080/api/scaffolder',
    );
    await expect(discovery.getExternalBaseUrl('scaffolder')).resolves.toBe(
      'http://scaffolder-external:8080/api/scaffolder',
    );
  });

  it('encodes the pluginId', async () => {
    const discovery = HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
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
      'http://localhost:80/api/plugin%2Falpha',
    );
    await expect(discovery.getExternalBaseUrl('plugin/alpha')).resolves.toBe(
      'http://localhost:40/api/plugin%2Falpha',
    );
  });
});
