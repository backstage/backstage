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
  createMockDirectory,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { appPlugin } from './appPlugin';
import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';

const mockDir = createMockDirectory();
overridePackagePathResolution({
  packageName: 'app',
  path: mockDir.path,
});

describe('appPlugin', () => {
  afterEach(() => {
    mockDir.clear();
  });

  it('boots', async () => {
    mockDir.setContent({
      'package.json': '{}',
      dist: {
        static: {},
        'index.html': 'winning',
      },
    });

    const { server } = await startTestBackend({
      features: [
        appPlugin,
        mockServices.rootConfig.factory({
          data: {
            app: {
              disableStaticFallbackCache: true,
            },
          },
        }),
      ],
    });

    await expect(
      fetch(`http://localhost:${server.port()}/api/app/derp.html`).then(res =>
        res.text(),
      ),
    ).resolves.toBe('winning');
    await expect(
      fetch(`http://localhost:${server.port()}`).then(res => res.text()),
    ).resolves.toBe('winning');
  });

  it('injects config into index.html', async () => {
    mockDir.setContent({
      'package.json': '{}',
      dist: {
        static: {},
        'index.html': '<html><head></head></html>',
        'index.html.tmpl': '<html><head></head></html>',
      },
    });

    const { server } = await startTestBackend({
      features: [
        appPlugin,
        mockServices.rootConfig.factory({
          data: {
            app: {
              disableStaticFallbackCache: true,
            },
          },
        }),
      ],
    });

    const baseUrl = `http://localhost:${server.port()}`;
    const withInjectedConfig = `<html><head>
<script type="backstage.io/config">
[]
</script>
</head></html>`;

    await expect(fetch(`${baseUrl}`).then(res => res.text())).resolves.toBe(
      withInjectedConfig,
    );

    await expect(
      fetch(`${baseUrl}?foo=bar`).then(res => res.text()),
    ).resolves.toBe(withInjectedConfig);

    await expect(
      fetch(`${baseUrl}/index.html`).then(res => res.text()),
    ).resolves.toBe(withInjectedConfig);

    await expect(
      fetch(`${baseUrl}/index.html?foo=bar`).then(res => res.text()),
    ).resolves.toBe(withInjectedConfig);

    await expect(
      fetch(`${baseUrl}/api/app/some/html5/route`).then(res => res.text()),
    ).resolves.toBe(withInjectedConfig);

    await expect(
      fetch(`${baseUrl}/api/app/some/html5/route?foo=bar`).then(res =>
        res.text(),
      ),
    ).resolves.toBe(withInjectedConfig);
  });
});
