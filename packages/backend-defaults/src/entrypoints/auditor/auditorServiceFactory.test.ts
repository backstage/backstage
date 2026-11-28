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
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { auditSinksServiceRef, auditorServiceFactory } from './index';
import { defaultAuditSinksServiceFactory } from './auditSinks';

function createRootLoggerMock() {
  const mockRootLogger = mockServices.rootLogger.mock();
  mockRootLogger.child.mockReturnValue(mockRootLogger);
  return mockRootLogger;
}

describe('auditorServiceFactory', () => {
  it('should log with the appropriate log level', async () => {
    const mockRootLogger = createRootLoggerMock();

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [mockRootLogger.factory],
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

    expect(mockRootLogger.debug).toHaveBeenCalledWith(
      'test.test1',
      expect.objectContaining({
        eventId: 'test1',
        severityLevel: 'low',
        actor: {
          actorId: 'plugin:test',
        },
        plugin: 'test',
        status: 'initiated',
      }),
    );
    expect(mockRootLogger.debug).toHaveBeenCalledWith(
      'test.test2',
      expect.objectContaining({
        eventId: 'test2',
        severityLevel: 'low',
        actor: {
          actorId: 'plugin:test',
        },
        plugin: 'test',
        status: 'initiated',
      }),
    );
    expect(mockRootLogger.info).toHaveBeenCalledWith(
      'test.test3',
      expect.objectContaining({
        eventId: 'test3',
        severityLevel: 'medium',
        actor: {
          actorId: 'plugin:test',
        },
        plugin: 'test',
        status: 'initiated',
      }),
    );
  });

  it('should log with custom log level mapping', async () => {
    const mockRootLogger = createRootLoggerMock();

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [
        mockRootLogger.factory,
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

    expect(mockRootLogger.info).toHaveBeenCalledWith(
      'test.test1',
      expect.objectContaining({
        eventId: 'test1',
        severityLevel: 'low',
        status: 'initiated',
      }),
    );
    expect(mockRootLogger.info).toHaveBeenCalledWith(
      'test.test2',
      expect.objectContaining({
        eventId: 'test2',
        severityLevel: 'low',
        status: 'initiated',
      }),
    );
    expect(mockRootLogger.debug).toHaveBeenCalledWith(
      'test.test3',
      expect.objectContaining({
        eventId: 'test3',
        severityLevel: 'medium',
        status: 'initiated',
      }),
    );
    expect(mockRootLogger.warn).toHaveBeenCalledWith(
      'test.test4',
      expect.objectContaining({
        eventId: 'test4',
        severityLevel: 'high',
        status: 'initiated',
      }),
    );
    expect(mockRootLogger.error).toHaveBeenCalledWith(
      'test.test5',
      expect.objectContaining({
        eventId: 'test5',
        severityLevel: 'critical',
        status: 'initiated',
      }),
    );
  });

  it('should let adopters add a sink without replacing the auditor factory', async () => {
    const mockRootLogger = createRootLoggerMock();
    const mockLogger = mockServices.logger.mock();
    const customSink = { write: jest.fn(async () => {}) };

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [
        mockRootLogger.factory,
        mockLogger.factory,
        createServiceFactory({
          service: auditSinksServiceRef,
          deps: {},
          factory: () => customSink,
        }),
      ],
    }).getSubject();

    await auditor.createEvent({ eventId: 'test1' });

    // the custom sink receives the event...
    expect(customSink.write).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'test1',
        plugin: 'test',
        status: 'initiated',
      }),
    );
    // ...and so does the default winston sink
    expect(mockRootLogger.debug).toHaveBeenCalledWith(
      'test.test1',
      expect.objectContaining({ eventId: 'test1' }),
    );
  });

  it('should isolate a failing custom sink from the default sink', async () => {
    const mockRootLogger = createRootLoggerMock();
    const mockLogger = mockServices.logger.mock();
    const badSink = {
      write: jest.fn(async () => {
        throw new Error('sink failure');
      }),
    };

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [
        mockRootLogger.factory,
        mockLogger.factory,
        createServiceFactory({
          service: auditSinksServiceRef,
          deps: {},
          factory: () => badSink,
        }),
      ],
    }).getSubject();

    await auditor.createEvent({ eventId: 'test1' });

    expect(badSink.write).toHaveBeenCalledTimes(1);
    // the default sink still received the event, and the failure was reported
    expect(mockRootLogger.debug).toHaveBeenCalledWith(
      'test.test1',
      expect.objectContaining({ eventId: 'test1' }),
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to emit audit event'),
    );
  });

  it('should apply configured sampling per severity level', async () => {
    const mockRootLogger = createRootLoggerMock();

    const auditor = await ServiceFactoryTester.from(auditorServiceFactory, {
      dependencies: [
        mockRootLogger.factory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              auditor: {
                sampling: { low: 0 },
              },
            },
          },
        }),
      ],
    }).getSubject();

    await auditor.createEvent({ eventId: 'sampled-out' });
    await auditor.createEvent({
      eventId: 'kept',
      severityLevel: 'medium',
    });

    expect(mockRootLogger.debug).not.toHaveBeenCalled();
    expect(mockRootLogger.info).toHaveBeenCalledWith(
      'test.kept',
      expect.objectContaining({
        eventId: 'kept',
        status: 'initiated',
      }),
    );
  });

  it('should throw an error given an incorrect custom level', async () => {
    const mockRootLogger = createRootLoggerMock();

    // The mapping is consumed by the default audit sink, so an invalid value
    // fails its instantiation rather than the auditor factory that depends on
    // it. The subject is the sink factory itself because a failing root-scoped
    // dependency of a plugin-scoped factory leaves dangling promise
    // rejections in the service registry.
    await expect(
      ServiceFactoryTester.from(defaultAuditSinksServiceFactory, {
        dependencies: [
          mockRootLogger.factory,
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
      "The configuration value for 'backend.auditor.severityLogLevelMappings.low' was given an invalid value: 'invalidloglevel'. Expected one of the following valid values: 'debug, info, warn, error'.",
    );
  });
});
