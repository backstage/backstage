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
import { format } from 'logform';
import { MESSAGE } from 'triple-beam';
import Transport from 'winston-transport';
import { Auditor } from './Auditor';

describe('Auditor', () => {
  it('creates a auditor instance with default options', () => {
    const auditor = Auditor.create();
    expect(auditor).toBeInstanceOf(Auditor);
  });

  it('creates a child logger', () => {
    const auditor = Auditor.create();
    const childLogger = auditor.child({ plugin: 'test-plugin' });
    expect(childLogger).toBeInstanceOf(Auditor);
  });

  it('should error without plugin service', async () => {
    const auditor = Auditor.create();
    await expect(
      auditor.createEvent({
        eventId: 'test-event',
      }),
    ).rejects.toThrow(
      `The core service 'plugin' was not provided during the auditor's instantiation`,
    );
  });

  it('should error without auth service', async () => {
    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      plugin: {
        getId: () => pluginId,
      },
    });

    await expect(
      auditor.createEvent({
        eventId: 'test-event',
      }),
    ).rejects.toThrow(
      `The core service 'auth' was not provided during the auditor's instantiation`,
    );
  });

  it('should error without httpAuth service', async () => {
    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      plugin: {
        getId: () => pluginId,
      },
      auth: mockServices.auth.mock(),
    });

    await expect(
      auditor.createEvent({
        eventId: 'test-event',
      }),
    ).rejects.toThrow(
      `The core service 'httpAuth' was not provided during the auditor's instantiation`,
    );
  });

  it('should log', async () => {
    const mockTransport = new Transport({
      log: jest.fn(),
      logv: jest.fn(),
    });

    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
      format: format.json(),
      transports: [mockTransport],
    });

    await auditor.createEvent({
      eventId: 'test-event',
    });

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        [MESSAGE]: JSON.stringify({
          actor: {},
          isAuditorEvent: true,
          level: 'info',
          message: 'test-plugin.test-event',
          severityLevel: 'low',
          status: 'initiated',
        }),
      }),
      expect.any(Function),
    );
  });

  it('should redact nested object', async () => {
    const mockTransport = new Transport({
      log: jest.fn(),
      logv: jest.fn(),
    });

    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
      format: format.json(),
      transports: [mockTransport],
    });

    auditor.addRedactions(['hello']);

    await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        null: null,
        nested: 'hello (world) from nested object',
        nullProto: Object.create(null, {
          foo: { value: 'hello foo', enumerable: true },
        }),
      },
    });

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        [MESSAGE]: JSON.stringify({
          actor: {},
          isAuditorEvent: true,
          level: 'info',
          message: 'test-plugin.test-event',
          meta: {
            nested: '*** (world) from nested object',
            null: null,
            nullProto: {
              foo: '*** foo',
            },
          },
          severityLevel: 'low',
          status: 'initiated',
        }),
      }),
      expect.any(Function),
    );
  });

  it('should log a status "initiated" using createEvent', async () => {
    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    await auditor.createEvent({
      eventId: 'test-event',
    });

    expect(auditorSpy).toHaveBeenCalledWith({
      eventId: 'test-event',
      status: 'initiated',
    });
  });

  it('should log a status "succeeded" using createEvent', async () => {
    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    await auditorEvent.success();

    expect(auditorSpy).toHaveBeenCalledTimes(2);
    expect(auditorSpy).toHaveBeenLastCalledWith({
      eventId: 'test-event',
      status: 'succeeded',
    });
  });

  it('should log a status "failed"', async () => {
    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    const error = new Error('error');
    await auditorEvent.fail({ error });

    expect(auditorSpy).toHaveBeenCalledTimes(2);
    expect(auditorSpy).toHaveBeenLastCalledWith({
      eventId: 'test-event',
      status: 'failed',
      error,
    });
  });

  it('should use root meta', async () => {
    const pluginId = 'test-plugin';

    const auditor = Auditor.create({
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => pluginId,
      },
    });
    // workaround to spy on private method
    const auditorSpy = jest.spyOn(auditor as any, 'log');

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        initiated: 'test',
      },
    });

    await auditorEvent.success({ meta: { succeeded: 'test' } });

    const error = new Error('error');
    await auditorEvent.fail({ error, meta: { failed: 'test' } });

    expect(auditorSpy).toHaveBeenCalledTimes(3);
    expect(auditorSpy).toHaveBeenNthCalledWith(1, {
      eventId: 'test-event',
      status: 'initiated',
      meta: {
        initiated: 'test',
      },
    });
    expect(auditorSpy).toHaveBeenNthCalledWith(2, {
      eventId: 'test-event',
      status: 'succeeded',
      meta: {
        initiated: 'test',
        succeeded: 'test',
      },
    });
    expect(auditorSpy).toHaveBeenNthCalledWith(3, {
      eventId: 'test-event',
      status: 'failed',
      meta: {
        initiated: 'test',
        failed: 'test',
      },
      error,
    });
  });
});
