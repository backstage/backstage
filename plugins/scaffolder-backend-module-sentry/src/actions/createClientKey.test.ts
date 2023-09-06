/*
 * Copyright 2023 The Backstage Authors
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
import { createSentryClientAction } from './createClientKey';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { ConfigReader } from '@backstage/config';
import { exampleResponseBody } from './test-fixutres';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(exampleResponseBody),
    headers: {
      get: jest.fn(() => ({ 'Content-Type': 'application/json' })),
    },
    ok: false,
    redirected: false,
    status: 201,
    statusText: 'string',
    type: 'basic',
    url: '',
  }),
) as jest.Mock;

describe('Create Sentry Client Key -', () => {
  it('should throw error for missing Tokens', async () => {
    // arrange
    const mockContext = {
      workspacePath: './',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };
    const config = new ConfigReader({});
    const action = createSentryClientAction(config);

    // act & assert
    await expect(() =>
      action.handler({
        ...mockContext,
        input: {
          authToken: undefined,
          apiBaseUrl: '',
          organizationSlug: '',
          projectSlug: '',
        },
      }),
    ).rejects.toThrow();
  });

  it('should take token from config', async () => {
    // arrange
    const mockContext = {
      workspacePath: './',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };
    const config = new ConfigReader({
      scaffolder: { sentry: { token: 'testtoken' } },
    });

    const action = createSentryClientAction(config);

    await action.handler({
      ...mockContext,
      input: {
        authToken: undefined,
        apiBaseUrl: '',
        organizationSlug: '',
        projectSlug: '',
      },
    });

    // act & assert
    return expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: `Bearer testtoken`,
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('should take token apiBaseUrl from Config', async () => {
    // arrange
    const mockContext = {
      workspacePath: './',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };
    const config = new ConfigReader({});

    const action = createSentryClientAction(config);

    await action.handler({
      ...mockContext,
      input: {
        authToken: 'token',
        apiBaseUrl: 'testuri',
        organizationSlug: '',
        projectSlug: '',
      },
    });

    // act & assert
    return expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('testuri'),
      expect.anything(),
    );
  });

  it('should fall back to sentry api if no url provided', async () => {
    // arrange
    const mockContext = {
      workspacePath: './',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };
    const config = new ConfigReader({});

    const action = createSentryClientAction(config);

    await action.handler({
      ...mockContext,
      input: {
        authToken: 'token',
        organizationSlug: '',
        projectSlug: '',
      },
    });

    // act & assert
    return expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://sentry.io/api/0'),
      expect.anything(),
    );
  });

  it('should provide all dsn keys for successful requests', async () => {
    // arrange
    const mockOutput = jest.fn();
    const mockContext = {
      workspacePath: './',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: mockOutput,
      createTemporaryDirectory: jest.fn(),
    };
    const config = new ConfigReader({});

    const action = createSentryClientAction(config);

    await action.handler({
      ...mockContext,
      input: {
        authToken: 'token',
        organizationSlug: '',
        projectSlug: '',
      },
    });

    // act & assert
    return expect(mockOutput).toHaveBeenCalledWith('sentryKeys', {
      secret:
        'https://a785682ddda742d7a8a4088810e67701:bcd99b3790b3441c85ce4b1eaa854f66@o4504765715316736.ingest.sentry.io/4505281256090153',
      public:
        'https://a785682ddda742d7a8a4088810e67791@o4504765715316736.ingest.sentry.io/4505281256090153',
      csp: 'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/csp-report/?sentry_key=a785682ddda719b7a8a4011110d75598',
      security:
        'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/security/?sentry_key=a785682ddda719b7a8a4011110d75598',
      minidump:
        'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/minidump/?sentry_key=a785682ddda719b7a8a4011110d75598',
      unreal:
        'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/unreal/a785682ddda719b7a8a4011110d75598/',
      cdn: 'https://js.sentry-cdn.com/a785682ddda719b7a8a4011110d75598.min.js',
    });
  });
});
