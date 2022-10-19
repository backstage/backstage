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

import mockFs from 'mock-fs';
import { resolve as resolvePath } from 'path';
import fetch from 'node-fetch';
import { configServiceRef } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { appPlugin } from './appPlugin';
import {
  databaseFactory,
  httpRouterFactory,
  loggerFactory,
  rootLoggerFactory,
} from '@backstage/backend-app-api';
import { ConfigReader } from '@backstage/config';
import getPort from 'get-port';

describe('appPlugin', () => {
  beforeAll(() => {
    mockFs({
      [resolvePath(process.cwd(), 'node_modules/app')]: {
        'package.json': '{}',
        dist: {
          static: {},
          'index.html': 'winning',
        },
      },
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  it('boots', async () => {
    const port = await getPort();
    await startTestBackend({
      services: [
        [
          configServiceRef,
          new ConfigReader({
            backend: {
              listen: { port },
              database: { client: 'better-sqlite3', connection: ':memory:' },
            },
          }),
        ],
        loggerFactory(),
        rootLoggerFactory(),
        databaseFactory(),
        httpRouterFactory(),
      ],
      features: [
        appPlugin({
          appPackageName: 'app',
          disableStaticFallbackCache: true,
        }),
      ],
    });

    await expect(
      fetch(`http://localhost:${port}/api/app/derp.html`).then(res =>
        res.text(),
      ),
    ).resolves.toBe('winning');
    await expect(
      fetch(`http://localhost:${port}`).then(res => res.text()),
    ).resolves.toBe('winning');
  });
});
