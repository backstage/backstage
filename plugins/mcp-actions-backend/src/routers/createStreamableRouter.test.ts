/*
 * Copyright 2026 The Backstage Authors
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
import {
  metricsServiceMock,
  tracingServiceMock,
} from '@backstage/backend-test-utils/alpha';
import express from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import request from 'supertest';
import { McpService } from '../services/McpService';
import { createStreamableRouter } from './createStreamableRouter';

jest.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => ({
  StreamableHTTPServerTransport: class {
    close = jest.fn();
    async handleRequest(_req: unknown, res: express.Response) {
      // Start a streamed response and leave it open
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.write('\n');
    }
  },
}));

describe('createStreamableRouter', () => {
  it('should clean up a closed connection in the async context of its request', async () => {
    const als = new AsyncLocalStorage<string>();

    const auditor = mockServices.auditor.mock();
    const closedAuditStores: Array<string | undefined> = [];
    let onClosedAuditSuccess: () => void = () => {};
    const closedAuditSucceeded = new Promise<void>(resolve => {
      onClosedAuditSuccess = resolve;
    });
    auditor.createEvent.mockImplementation(async options => {
      if (options.meta?.actionType === 'closed') {
        closedAuditStores.push(als.getStore());
      }
      return {
        success: jest.fn(async () => {
          if (options.meta?.actionType === 'closed') {
            closedAuditStores.push(als.getStore());
            onClosedAuditSuccess();
          }
        }),
        fail: jest.fn(),
      };
    });

    const metrics = metricsServiceMock.mock();
    const sessionDurationStores: Array<string | undefined> = [];
    metrics.createHistogram.mockImplementation(
      () =>
        ({
          record: () => sessionDurationStores.push(als.getStore()),
        } as any),
    );

    const closeStores: Array<string | undefined> = [];
    const server = {
      connect: jest.fn(),
      close: jest.fn(() => closeStores.push(als.getStore())),
    };
    const mcpService = {
      getServer: () => server,
    } as unknown as McpService;

    const app = express()
      .use((_req, _res, next) => als.run('request', next))
      .use(
        createStreamableRouter({
          mcpService,
          httpAuth: mockServices.httpAuth(),
          logger: mockServices.logger.mock(),
          metrics,
          tracing: tracingServiceMock.mock(),
          auditor,
        }),
      );

    // The client disconnects from the open stream, so the close event comes
    // from the socket rather than from the request's async context
    const req = request(app)
      .post('/')
      .send({})
      .parse((res, _) => {
        (res as unknown as NodeJS.ReadableStream).once('data', () =>
          req.abort(),
        );
      });
    req.catch(() => {
      // ignore 'aborted' error
    });
    await closedAuditSucceeded;

    expect(closeStores).toEqual(['request']);
    expect(sessionDurationStores).toEqual(['request']);
    expect(closedAuditStores).toEqual(['request', 'request']);
  });
});
