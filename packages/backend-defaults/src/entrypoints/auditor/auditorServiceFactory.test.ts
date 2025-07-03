/*
 * Copyright 2024 The Backstage Authors
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
  ServiceFactoryTester,
  mockServices,
} from '@backstage/backend-test-utils';
import { auditorServiceFactory } from './auditorServiceFactory';

describe('auditorServiceFactory', () => {
  it('should log with the appropriate log level', async () => {
    const mockLogger = mockServices.logger.mock();
    mockLogger.child.mockReturnValue(mockLogger);

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [mockLogger.factory],
    }).getSubject();

    await auditor.createEvent({
      eventId: 'test1',
      severityLevel: 'low',
    });
    await auditor.createEvent({
      eventId: 'test2',
    });
    await auditor.createEvent({
      eventId: 'test3',
      severityLevel: 'medium',
    });

    expect(mockLogger.debug).toHaveBeenCalledWith('test.test1', {
      eventId: 'test1',
      severityLevel: 'low',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
    expect(mockLogger.debug).toHaveBeenCalledWith('test.test2', {
      eventId: 'test2',
      severityLevel: 'low',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
    expect(mockLogger.info).toHaveBeenCalledWith('test.test3', {
      eventId: 'test3',
      severityLevel: 'medium',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
  });

  it('should log with custom log level mapping', async () => {
    const mockLogger = mockServices.logger.mock();
    mockLogger.child.mockReturnValue(mockLogger);

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [
        mockLogger.factory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              auditor: {
                severityLogLevelMappings: {
                  low: 'info',
                  medium: 'debug',
                  high: 'warn',
                  critical: 'error',
                },
              },
            },
          },
        }),
      ],
    }).getSubject();

    await auditor.createEvent({
      eventId: 'test1',
      severityLevel: 'low',
    });
    await auditor.createEvent({
      eventId: 'test2',
    });
    await auditor.createEvent({
      eventId: 'test3',
      severityLevel: 'medium',
    });
    await auditor.createEvent({
      eventId: 'test4',
      severityLevel: 'high',
    });
    await auditor.createEvent({
      eventId: 'test5',
      severityLevel: 'critical',
    });

    expect(mockLogger.info).toHaveBeenCalledWith('test.test1', {
      eventId: 'test1',
      severityLevel: 'low',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
    expect(mockLogger.info).toHaveBeenCalledWith('test.test2', {
      eventId: 'test2',
      severityLevel: 'low',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
    expect(mockLogger.debug).toHaveBeenCalledWith('test.test3', {
      eventId: 'test3',
      severityLevel: 'medium',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
    expect(mockLogger.warn).toHaveBeenCalledWith('test.test4', {
      eventId: 'test4',
      severityLevel: 'high',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
    expect(mockLogger.error).toHaveBeenCalledWith('test.test5', {
      eventId: 'test5',
      severityLevel: 'critical',
      actor: {
        actorId: 'plugin:test',
      },
      plugin: 'test',
      status: 'initiated',
    });
  });

  it('should throw an error given an incorrect custom level', async () => {
    const mockLogger = mockServices.logger.mock();
    mockLogger.child.mockReturnValue(mockLogger);

    await expect(
      ServiceFactoryTester.from(auditorServiceFactory, {
        dependencies: [
          mockLogger.factory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                auditor: {
                  severityLogLevelMappings: {
                    low: 'invalidloglevel',
                  },
                },
              },
            },
          }),
        ],
      }).getSubject(),
    ).rejects.toThrow(
      "Failed to instantiate service 'core.auditor' for 'test' because the factory function threw an error, InputError: The configuration value for 'backend.auditor.severityLogLevelMappings.low' was given an invalid value: 'invalidloglevel'. Expected one of the following valid values: 'debug, info, warn, error'.",
    );
  });
});
