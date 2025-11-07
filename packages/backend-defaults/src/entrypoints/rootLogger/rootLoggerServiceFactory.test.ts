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

import { WinstonLogger } from './WinstonLogger';

describe('rootLoggerServiceFactory', () => {
  beforeEach(() => {
    jest.spyOn(WinstonLogger, 'create');
  });

  it('should create WinstonLogger with defaults', async () => {
    await ServiceFactoryTester.from(rootLoggerServiceFactory, {
      dependencies: [mockServices.rootConfig.factory()],
    }).getSubject();

    expect(WinstonLogger.create).toHaveBeenCalledWith({
      level: 'info',
      meta: {
        service: 'backstage',
      },
      format: expect.anything(),
      transports: expect.anything(),
    });
  });

  it('should create WinstonLogger from config', async () => {
    await ServiceFactoryTester.from(rootLoggerServiceFactory, {
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

    expect(WinstonLogger.create).toHaveBeenCalledWith({
      level: 'warn',
      meta: {
        service: 'backstage',
        env: 'test',
      },
      format: expect.anything(),
      transports: expect.anything(),
    });
  });
});
