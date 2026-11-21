/*
 * Copyright 2025 The Backstage Authors
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
  mockServices,
  ServiceFactoryTester,
} from '@backstage/backend-test-utils';
import { rootLoggerServiceFactory } from './rootLoggerServiceFactory';

import { DefaultRootLoggerService } from './DefaultRootLoggerService';

describe('rootLoggerServiceFactory', () => {
  afterEach(() => jest.restoreAllMocks());

  beforeEach(() => {
    jest.replaceProperty(process, 'env', { ...process.env, LOG_LEVEL: '' });
    jest.spyOn(DefaultRootLoggerService, 'create');
  });

  it('should create DefaultRootLoggerService with defaults', async () => {
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const logger = await ServiceFactoryTester.from(rootLoggerServiceFactory, {
      dependencies: [mockServices.rootConfig.factory()],
    }).getSubject();

    expect(DefaultRootLoggerService.create).toHaveBeenCalledWith({
      level: undefined,
      meta: {
        service: 'backstage',
      },
    });

    stdout.mockClear();
    logger.debug('filtered by the default level');
    logger.info('default level is info');
    expect(stdout).toHaveBeenCalledTimes(1);
    expect(stdout).toHaveBeenCalledWith(
      expect.stringContaining('default level is info'),
    );
  });

  it('should format logs as JSON with a timestamp in production', async () => {
    const env = jest.replaceProperty(process, 'env', {
      ...process.env,
      NODE_ENV: 'production',
    });
    try {
      const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
      const logger = await ServiceFactoryTester.from(rootLoggerServiceFactory, {
        dependencies: [mockServices.rootConfig.factory()],
      }).getSubject();
      stdout.mockClear();
      logger.info('hello');

      expect(JSON.parse(String(stdout.mock.calls[0][0]))).toEqual({
        service: 'backstage',
        level: 'info',
        message: 'hello',
        timestamp: expect.any(String),
      });
    } finally {
      env.restore();
    }
  });

  it('should create DefaultRootLoggerService from config', async () => {
    jest.replaceProperty(process, 'env', {
      ...process.env,
      LOG_LEVEL: 'error',
    });
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const logger = await ServiceFactoryTester.from(rootLoggerServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            backend: {
              logger: {
                meta: {
                  env: 'test',
                },
                level: 'warn',
              },
            },
          },
        }),
      ],
    }).getSubject();

    expect(DefaultRootLoggerService.create).toHaveBeenCalledWith({
      level: 'warn',
      meta: {
        service: 'backstage',
        env: 'test',
      },
    });

    stdout.mockClear();
    logger.warn('filtered by LOG_LEVEL');
    logger.error('LOG_LEVEL overrides config');
    expect(stdout).toHaveBeenCalledTimes(1);
    expect(stdout).toHaveBeenCalledWith(
      expect.stringContaining('LOG_LEVEL overrides config'),
    );
  });

  it('should redact secrets except allowlisted ones', async () => {
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);

    const logger = await ServiceFactoryTester.from(rootLoggerServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            backend: {
              auth: {
                keys: [{ secret: 'hidden-value' }, { secret: 'shown-value' }],
              },
              logger: {
                redactAllowlist: ['shown-value'],
              },
            },
          },
        }),
      ],
    }).getSubject();

    stdout.mockClear();
    logger.info('a hidden-value message');
    logger.info('a shown-value message');

    expect(stdout.mock.calls.map(([message]) => String(message))).toEqual([
      expect.stringContaining('a *** message'),
      expect.stringContaining('a shown-value message'),
    ]);
  });
});
