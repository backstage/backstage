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

import { mockServices } from '@backstage/backend-test-utils';
import { PassThrough } from 'node:stream';
import * as winston from 'winston';
import { WinstonRootAuditorService } from './WinstonRootAuditorService';
import { DefaultAuditorService } from './DefaultAuditorService';

function captureTransport() {
  const entries: Record<string, any>[] = [];
  const stream = new PassThrough({ objectMode: true });
  stream.on('data', (info: Record<string, any>) => entries.push(info));
  return {
    entries,
    transport: new winston.transports.Stream({ stream }),
  };
}

describe('WinstonRootAuditorService', () => {
  it('creates a auditor instance with default options', () => {
    const auditor = WinstonRootAuditorService.create();
    expect(auditor).toBeInstanceOf(WinstonRootAuditorService);
  });

  it('creates a child logger', () => {
    const auditor = WinstonRootAuditorService.create();
    const childLogger = auditor.forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => 'test-plugin',
      },
      config: mockServices.rootConfig.mock(),
    });
    expect(childLogger).toBeInstanceOf(DefaultAuditorService);
  });

  it('should log a status "initiated" using createEvent', async () => {
    const pluginId = 'test-plugin';

    const auditor = WinstonRootAuditorService.create().forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
      config: mockServices.rootConfig.mock(),
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    await auditor.createEvent({
      eventId: 'test-event',
    });

    expect(auditorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'initiated',
      }),
    );
  });

  it('should log a status "succeeded" using createEvent', async () => {
    const pluginId = 'test-plugin';

    const auditor = WinstonRootAuditorService.create().forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
      config: mockServices.rootConfig.mock(),
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    await auditorEvent.success();

    expect(auditorSpy).toHaveBeenCalledTimes(2);
    expect(auditorSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
      }),
    );
  });

  it('should log a status "failed"', async () => {
    const pluginId = 'test-plugin';

    const auditor = WinstonRootAuditorService.create().forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
      config: mockServices.rootConfig.mock(),
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    const error = new Error('error');
    await auditorEvent.fail({ error });

    expect(auditorSpy).toHaveBeenCalledTimes(2);
    expect(auditorSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'failed',
        error: {
          name: 'Error',
          message: 'error',
          stack: expect.any(String),
        },
      }),
    );
  });

  it('should use root meta', async () => {
    const pluginId = 'test-plugin';

    const auditor = WinstonRootAuditorService.create().forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
      config: mockServices.rootConfig.mock(),
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    const successEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        initiated: 'test',
      },
    });
    await successEvent.success({ meta: { succeeded: 'test' } });

    const failEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        initiated: 'test',
      },
    });

    const error = new Error('error');
    await failEvent.fail({ error, meta: { failed: 'test' } });

    expect(auditorSpy).toHaveBeenCalledTimes(4);
    expect(auditorSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'initiated',
        meta: {
          initiated: 'test',
        },
      }),
    );
    expect(auditorSpy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
        meta: {
          initiated: 'test',
          succeeded: 'test',
        },
      }),
    );
    expect(auditorSpy).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'failed',
        meta: {
          initiated: 'test',
          failed: 'test',
        },
        error: {
          name: 'Error',
          message: 'error',
          stack: expect.any(String),
        },
      }),
    );
  });

  it('should apply default hygiene to emitted events', async () => {
    const { entries, transport } = captureTransport();
    const auditor = WinstonRootAuditorService.create({
      transports: [transport],
    }).forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => 'test-plugin',
      },
      config: mockServices.rootConfig.mock(),
    });

    await auditor.createEvent({
      eventId: 'test-event',
      severityLevel: 'medium',
      meta: { password: 'hunter2', long: 'a'.repeat(5000) },
      // @ts-expect-error partial request is fine for this test
      request: {
        method: 'GET',
        originalUrl: '/api/entities?filter=x',
        get: () => undefined,
      },
    });

    await new Promise(resolve => setImmediate(resolve));

    expect(entries).toHaveLength(1);
    expect(entries[0].id).toEqual(expect.any(String));
    expect(entries[0].request).toEqual({
      url: '/api/entities',
      method: 'GET',
    });
    expect(entries[0].meta.password).toBe('[REDACTED]');
    expect(entries[0].meta.long).toHaveLength(4096);
  });

  it('should honor hygiene configuration overrides', async () => {
    const { entries, transport } = captureTransport();
    const auditor = WinstonRootAuditorService.create({
      transports: [transport],
    }).forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => 'test-plugin',
      },
      config: mockServices.rootConfig({
        data: {
          backend: {
            auditor: {
              sanitizeRequestQuery: false,
              maxMetaStringLength: -1,
              redactMetaKeys: [],
            },
          },
        },
      }),
    });

    await auditor.createEvent({
      eventId: 'test-event',
      severityLevel: 'medium',
      meta: { password: 'hunter2', long: 'a'.repeat(5000) },
      // @ts-expect-error partial request is fine for this test
      request: {
        method: 'GET',
        originalUrl: '/api/entities?filter=x',
        get: () => undefined,
      },
    });

    await new Promise(resolve => setImmediate(resolve));

    expect(entries).toHaveLength(1);
    expect(entries[0].request).toEqual({
      url: '/api/entities?filter=x',
      method: 'GET',
    });
    expect(entries[0].meta.password).toBe('hunter2');
    expect(entries[0].meta.long).toHaveLength(5000);
  });

  it('should apply configured sampling', async () => {
    const { entries, transport } = captureTransport();
    const auditor = WinstonRootAuditorService.create({
      transports: [transport],
    }).forPlugin({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => 'test-plugin',
      },
      config: mockServices.rootConfig({
        data: {
          backend: {
            auditor: {
              sampling: { low: 0 },
            },
          },
        },
      }),
    });

    await auditor.createEvent({ eventId: 'sampled-out' });
    await auditor.createEvent({
      eventId: 'kept',
      severityLevel: 'medium',
    });

    expect(entries).toHaveLength(1);
    expect(entries[0].eventId).toBe('kept');
  });
});
