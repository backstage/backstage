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

import express from 'express';
import request from 'supertest';
import {
  AuthorizeResult,
  type PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { IncrementalIngestionDatabaseManager } from '../database/IncrementalIngestionDatabaseManager';
import { IncrementalProviderRouter } from './routes';

describe('IncrementalProviderRouter', () => {
  const credentials = mockCredentials.user();
  const logger = mockServices.logger.mock();
  let manager: jest.Mocked<IncrementalIngestionDatabaseManager>;
  let permissions: jest.Mocked<PermissionEvaluator>;
  let app: express.Express;

  beforeEach(() => {
    manager = {
      healthcheck: jest.fn().mockResolvedValue([]),
      cleanupProviders: jest.fn().mockResolvedValue({ success: true }),
      getCurrentIngestionRecord: jest.fn().mockResolvedValue(undefined),
      listProviders: jest.fn().mockResolvedValue([]),
      purgeAndResetProvider: jest.fn().mockResolvedValue({ success: true }),
      clearFinishedIngestions: jest.fn().mockResolvedValue(0),
    } as unknown as jest.Mocked<IncrementalIngestionDatabaseManager>;
    permissions = {
      authorize: jest
        .fn()
        .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      authorizeConditional: jest.fn(),
    };

    app = express().use(
      new IncrementalProviderRouter(
        manager,
        logger,
        permissions,
        mockServices.httpAuth({ defaultCredentials: credentials }),
      ).createRouter(),
    );
    app.use(
      (
        error: Error & { statusCode?: number },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        const status =
          error.statusCode ?? (error.name === 'NotAllowedError' ? 403 : 500);
        res.status(status).json({ error: { name: error.name } });
      },
    );
  });

  it.each([
    ['get', '/incremental/health', 'catalog.ingestion.read'],
    ['head', '/incremental/health', 'catalog.ingestion.read'],
    ['get', '/incremental/providers/example', 'catalog.ingestion.read'],
    ['get', '/incremental/providers', 'catalog.ingestion.read'],
    ['get', '/incremental/providers/example/marks', 'catalog.ingestion.read'],
    ['post', '/incremental/cleanup', 'catalog.ingestion.manage'],
    [
      'post',
      '/incremental/providers/example/trigger',
      'catalog.ingestion.manage',
    ],
    [
      'post',
      '/incremental/providers/example/start',
      'catalog.ingestion.manage',
    ],
    [
      'post',
      '/incremental/providers/example/cancel',
      'catalog.ingestion.manage',
    ],
    ['delete', '/incremental/providers/example', 'catalog.ingestion.manage'],
    [
      'delete',
      '/incremental/providers/example/marks',
      'catalog.ingestion.manage',
    ],
  ] as const)(
    '%s %s checks %s',
    async (method, path, expectedPermissionName) => {
      await request(app)[method](path);

      expect(permissions.authorize).toHaveBeenCalledWith(
        [
          {
            permission: expect.objectContaining({
              name: expectedPermissionName,
            }),
          },
        ],
        { credentials },
      );
    },
  );

  it.each([
    ['get', '/incremental/health'],
    ['post', '/incremental/cleanup'],
  ] as const)('returns 403 for denied %s %s requests', async (method, path) => {
    permissions.authorize.mockResolvedValue([{ result: AuthorizeResult.DENY }]);

    const response = await request(app)[method](path);

    expect(response.status).toBe(403);
  });
});
