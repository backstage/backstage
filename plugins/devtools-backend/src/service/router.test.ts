/*
 * Copyright 2022 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { devToolsOpenTelemetryReadPermission } from '@backstage/plugin-devtools-common/alpha';
import { telemetryRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { createRouter } from './router';
import { mockErrorHandler, mockServices } from '@backstage/backend-test-utils';

const mockedAuthorize: jest.MockedFunction<PermissionEvaluator['authorize']> =
  jest.fn();
const mockedPermissionQuery: jest.MockedFunction<
  PermissionEvaluator['authorizeConditional']
> = jest.fn();

const permissionEvaluator: PermissionEvaluator = {
  authorize: mockedAuthorize,
  authorizeConditional: mockedPermissionQuery,
};

const telemetryRegistry = telemetryRegistryServiceMock.mock();

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config: new ConfigReader({
        healthCheck: {
          endpoint: [
            {
              name: '',
              type: '',
              target: '',
            },
          ],
        },
      }),
      discovery: mockServices.discovery(),
      permissions: permissionEvaluator,
      httpAuth: mockServices.httpAuth(),
      telemetryRegistry,
    });
    app = express().use(router).use(mockErrorHandler());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /opentelemetry/metrics and /opentelemetry/spans', () => {
    it('returns registry contents when allowed and 403 when denied', async () => {
      const metrics = [
        {
          pluginId: 'catalog',
          name: 'catalog.entities',
          type: 'gauge',
          unit: '{entity}',
        },
      ];
      const spans = [
        {
          pluginId: 'catalog',
          name: 'refresh',
          kind: 'internal',
          count: 3,
          lastSeen: '2026-01-01T00:00:00.000Z',
        },
      ];
      telemetryRegistry.listMetrics.mockResolvedValue({ metrics } as any);
      telemetryRegistry.listSpans.mockResolvedValue({ spans } as any);
      mockedAuthorize.mockResolvedValue([{ result: AuthorizeResult.ALLOW }]);

      const metricsResponse = await request(app).get('/opentelemetry/metrics');
      expect(metricsResponse.status).toBe(200);
      expect(metricsResponse.body).toEqual({ metrics });

      const spansResponse = await request(app).get('/opentelemetry/spans');
      expect(spansResponse.status).toBe(200);
      expect(spansResponse.body).toEqual({ spans });

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: devToolsOpenTelemetryReadPermission }],
        expect.anything(),
      );

      mockedAuthorize.mockResolvedValue([{ result: AuthorizeResult.DENY }]);
      telemetryRegistry.listMetrics.mockClear();
      telemetryRegistry.listSpans.mockClear();

      expect((await request(app).get('/opentelemetry/metrics')).status).toBe(
        403,
      );
      expect((await request(app).get('/opentelemetry/spans')).status).toBe(403);
      expect(telemetryRegistry.listMetrics).not.toHaveBeenCalled();
      expect(telemetryRegistry.listSpans).not.toHaveBeenCalled();
    });
  });
});
