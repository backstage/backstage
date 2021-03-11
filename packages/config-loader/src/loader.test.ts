/*
 * Copyright 2020 Spotify AB
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

import { loadConfig } from './loader';
import mockFs from 'mock-fs';

describe('loadConfig', () => {
  beforeAll(() => {
    process.env.MY_SECRET = 'is-secret';

    mockFs({
      '/root/app-config.yaml': `
        app:
          title: Example App
          sessionKey:
            $file: secrets/session-key.txt
      `,
      '/root/app-config.development.yaml': `
        app:
          sessionKey: development-key
        backend:
          $include: ./included.yaml
        other:
          $include: secrets/included.yaml
      `,
      '/root/secrets/session-key.txt': 'abc123',
      '/root/secrets/included.yaml': `
        secret:
          $file: session-key.txt
      `,
      '/root/included.yaml': `
        foo:
          bar: token \${MY_SECRET}
      `,
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  it('load config from default path', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: [],
        env: 'production',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
            sessionKey: 'abc123',
          },
        },
      },
    ]);
  });

  it('loads config with secrets', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: ['/root/app-config.yaml'],
        env: 'production',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
            sessionKey: 'abc123',
          },
        },
      },
    ]);
  });

  it('loads development config with secrets', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: [
          '/root/app-config.yaml',
          '/root/app-config.development.yaml',
        ],
        env: 'development',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
            sessionKey: 'abc123',
          },
        },
      },
      {
        context: 'app-config.development.yaml',
        data: {
          app: {
            sessionKey: 'development-key',
          },
          backend: {
            foo: {
              bar: 'token is-secret',
            },
          },
          other: {
            secret: 'abc123',
          },
        },
      },
    ]);
  });
});
