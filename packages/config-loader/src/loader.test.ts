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

jest.mock('fs-extra', () => {
  const mockFiles: { [path in string]: string } = {
    '/root/app-config.yaml': `
      app:
        title: Example App
        sessionKey:
          $secret:
            file: secrets/session-key.txt
    `,
    '/root/app-config.development.yaml': `
      app:
        sessionKey: development-key
    `,
    '/root/secrets/session-key.txt': 'abc123',
  };

  return {
    async readFile(path: string) {
      if (path in mockFiles) {
        return mockFiles[path];
      }
      throw new Error(`File not found, ${path}`);
    },
    async pathExists(path: string) {
      return path in mockFiles;
    },
  };
});

describe('loadConfig', () => {
  it('loads config without secrets', async () => {
    await expect(
      loadConfig({
        rootPaths: ['/root'],
        env: 'production',
        shouldReadSecrets: false,
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
          },
        },
      },
    ]);
  });

  it('loads config with secrets', async () => {
    await expect(
      loadConfig({
        rootPaths: ['/root'],
        env: 'production',
        shouldReadSecrets: true,
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

  it('loads development config without secrets', async () => {
    await expect(
      loadConfig({
        rootPaths: ['/root'],
        env: 'development',
        shouldReadSecrets: false,
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
          },
        },
      },
      {
        context: 'app-config.development.yaml',
        data: {
          app: {},
        },
      },
    ]);
  });

  it('loads development config with secrets', async () => {
    await expect(
      loadConfig({
        rootPaths: ['/root'],
        env: 'development',
        shouldReadSecrets: true,
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
        },
      },
    ]);
  });
});
