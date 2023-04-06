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
import { SingleHostDiscovery } from './SingleHostDiscovery';

describe('SingleHostDiscovery', () => {
  it('is created from config', async () => {
    const discovery = SingleHostDiscovery.fromConfig(
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

  it('can configure the base path', async () => {
    const discovery = SingleHostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          baseUrl: 'http://localhost:40',
          listen: { port: 80, host: 'localhost' },
        },
      }),
      { basePath: '/service' },
    );

    await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
      'http://localhost:80/service/catalog',
    );
    await expect(discovery.getExternalBaseUrl('catalog')).resolves.toBe(
      'http://localhost:40/service/catalog',
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
    const discovery = SingleHostDiscovery.fromConfig(
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
});
