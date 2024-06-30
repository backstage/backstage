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

import fetch from 'node-fetch';
import {
  createMockDirectory,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { appPlugin } from './appPlugin';
import { createRootLogger } from '@backstage/backend-common';
import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';

const mockDir = createMockDirectory();
overridePackagePathResolution({
  packageName: 'app',
  path: mockDir.path,
});

// Make sure root logger is initialized ahead of FS mock
createRootLogger();

describe('appPlugin', () => {
  beforeEach(() => {
    mockDir.setContent({
      'package.json': '{}',
      dist: {
        static: {},
        'index.html': 'winning',
      },
    });
  });

  it('boots', async () => {
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
});
