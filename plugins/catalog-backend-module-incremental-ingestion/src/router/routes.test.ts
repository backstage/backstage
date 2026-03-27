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
import { mockServices } from '@backstage/backend-test-utils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  catalogIncrementalIngestionAdminPermission,
  catalogIncrementalIngestionReadPermission,
} from '@backstage/plugin-catalog-common/alpha';
import { IncrementalProviderRouter } from './routes';

describe('IncrementalProviderRouter', () => {
  const createApp = (authorizeResult: AuthorizeResult) => {
    const manager = {
      healthcheck: jest.fn().mockResolvedValue([]),
      listProviders: jest.fn().mockResolvedValue([]),
      getCurrentIngestionRecord: jest.fn().mockResolvedValue(undefined),
      triggerNextProviderAction: jest.fn(),
    };
    const logger = mockServices.logger.mock();
    const permissions = mockServices.permissions.mock();
    const httpAuth = mockServices.httpAuth();

    permissions.authorize.mockResolvedValue([{ result: authorizeResult }]);

    const router = new IncrementalProviderRouter(
      manager as any,
      logger,
      permissions,
      httpAuth,
    ).createRouter();

    const app = express();
    app.use(router);
    app.use(
      (
        error: Error & { statusCode?: number },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        const statusCode =
          error.statusCode ?? (error.name === 'NotAllowedError' ? 403 : 500);
        res.status(statusCode).json({ message: error.message });
      },
    );

    return { app, manager, permissions };
  };

  it('authorizes read endpoint with read permission', async () => {
    const { app, manager, permissions } = createApp(AuthorizeResult.ALLOW);

    const response = await request(app).get('/incremental/providers');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      providers: [],
    });
    expect(permissions.authorize).toHaveBeenCalledWith(
      [{ permission: catalogIncrementalIngestionReadPermission }],
      expect.any(Object),
    );
    expect(manager.listProviders).toHaveBeenCalledTimes(1);
  });

  it('denies read endpoint when permission is denied', async () => {
    const { app, manager } = createApp(AuthorizeResult.DENY);

    const response = await request(app).get('/incremental/providers');

    expect(response.status).toBe(403);
    expect(manager.listProviders).not.toHaveBeenCalled();
  });

  it('denies admin endpoint when permission is denied', async () => {
    const { app, manager, permissions } = createApp(AuthorizeResult.DENY);

    const response = await request(app).post(
      '/incremental/providers/demo/trigger',
    );

    expect(response.status).toBe(403);
    expect(permissions.authorize).toHaveBeenCalledWith(
      [{ permission: catalogIncrementalIngestionAdminPermission }],
      expect.any(Object),
    );
    expect(manager.triggerNextProviderAction).not.toHaveBeenCalled();
  });
});
