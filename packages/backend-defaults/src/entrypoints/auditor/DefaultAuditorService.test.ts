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

import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { DefaultAuditorService } from './DefaultAuditorService';

const mockDeps = {
  auth: mockServices.auth.mock(),
  httpAuth: mockServices.httpAuth.mock(),
  plugin: {
    getId: () => 'test',
  },
};

describe('DefaultAuditorService', () => {
  it('creates a auditor instance with default options', () => {
    const auditor = DefaultAuditorService.create(jest.fn(), mockDeps);
    expect(auditor).toBeInstanceOf(DefaultAuditorService);
  });

  it('should log a status "initiated" using createEvent', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    await auditor.createEvent({
      eventId: 'test-event',
    });

    expect(logFn).toHaveBeenCalledWith({
      eventId: 'test-event',
      status: 'initiated',
      plugin: 'test',
      severityLevel: 'low',
      actor: {},
    });
  });

  it('should log a status "succeeded" using createEvent', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    await auditorEvent.success();

    expect(logFn).toHaveBeenCalledTimes(2);
    expect(logFn).toHaveBeenLastCalledWith({
      eventId: 'test-event',
      status: 'succeeded',
      plugin: 'test',
      severityLevel: 'low',
      actor: {},
    });
  });

  it('should log a status "failed"', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    const error = new Error('error');
    await auditorEvent.fail({ error });

    expect(logFn).toHaveBeenCalledTimes(2);
    expect(logFn).toHaveBeenLastCalledWith({
      eventId: 'test-event',
      status: 'failed',
      error,
      plugin: 'test',
      severityLevel: 'low',
      actor: {},
    });
  });

  it('should log the user and the client that the credentials were issued to', async () => {
    const logFn = jest.fn();
    const request = {
      ip: '127.0.0.1',
      hostname: 'localhost',
      originalUrl: '/api/test',
      method: 'POST',
      get: () => 'test-agent',
    } as any;

    const httpAuth = mockServices.httpAuth.mock({
      credentials: async () =>
        ({
          $$type: '@backstage/BackstageCredentials',
          principal: {
            type: 'user',
            userEntityRef: 'user:default/mock',
            clientId: 'https://example.com/client.json',
          },
        } as any),
    });
    const auditor = DefaultAuditorService.create(logFn, {
      auth: mockServices.auth(),
      httpAuth,
      plugin: mockDeps.plugin,
    });

    await auditor.createEvent({ eventId: 'test-event', request });

    expect(logFn).toHaveBeenCalledWith({
      eventId: 'test-event',
      status: 'initiated',
      plugin: 'test',
      severityLevel: 'low',
      actor: {
        actorId: 'user:default/mock',
        clientId: 'https://example.com/client.json',
        ip: '127.0.0.1',
        hostname: 'localhost',
        userAgent: 'test-agent',
      },
      request: { url: '/api/test', method: 'POST' },
    });

    // No client for credentials from an interactive sign-in
    httpAuth.credentials.mockResolvedValue(mockCredentials.user());
    await auditor.createEvent({ eventId: 'test-event', request });
    expect(logFn.mock.calls[1][0].actor).toEqual({
      actorId: 'user:default/mock',
      ip: '127.0.0.1',
      hostname: 'localhost',
      userAgent: 'test-agent',
    });
    expect(logFn.mock.calls[1][0].actor).not.toHaveProperty('clientId');
  });

  it('should use root meta', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        initiated: 'test',
      },
    });

    await auditorEvent.success({ meta: { succeeded: 'test' } });

    const error = new Error('error');
    await auditorEvent.fail({ error, meta: { failed: 'test' } });

    expect(logFn).toHaveBeenCalledTimes(3);
    expect(logFn).toHaveBeenNthCalledWith(1, {
      eventId: 'test-event',
      status: 'initiated',
      meta: {
        initiated: 'test',
      },
      plugin: 'test',
      severityLevel: 'low',
      actor: {},
    });
    expect(logFn).toHaveBeenNthCalledWith(2, {
      eventId: 'test-event',
      status: 'succeeded',
      meta: {
        initiated: 'test',
        succeeded: 'test',
      },
      plugin: 'test',
      severityLevel: 'low',
      actor: {},
    });
    expect(logFn).toHaveBeenNthCalledWith(3, {
      eventId: 'test-event',
      status: 'failed',
      meta: {
        initiated: 'test',
        failed: 'test',
      },
      error,
      plugin: 'test',
      severityLevel: 'low',
      actor: {},
    });
  });
});
