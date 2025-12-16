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

import express from 'express';
import request from 'supertest';
import { ConfigReader } from '@backstage/config';
import { bindProviderRouters, ProviderFactories } from './router';
import { mockServices } from '@backstage/backend-test-utils';
import type { TokenIssuer } from '../identity/types';
import type { CatalogService } from '@backstage/plugin-catalog-node';
import type { UserInfoDatabase } from '../database/UserInfoDatabase';
import type { AuthProviderFactory } from '@backstage/plugin-auth-node';

describe('bindProviderRouters auditing', () => {
  const baseConfig = new ConfigReader({
    app: { baseUrl: 'http://localhost:3000' },
    auth: { providers: { mock: {} } },
  });

  const logger = mockServices.logger.mock();
  const auth = mockServices.auth.mock();
  const tokenIssuer = {
    issueToken: jest.fn(),
    listPublicKeys: jest.fn(),
  } as unknown as jest.Mocked<TokenIssuer>;
  const catalog = {} as unknown as jest.Mocked<CatalogService>;
  const userInfo = {} as unknown as jest.Mocked<UserInfoDatabase>;

  function createApp(
    providerFactory: AuthProviderFactory,
    auditor = mockServices.auditor.mock(),
  ) {
    const app = express();
    bindProviderRouters(app, {
      providers: { mock: providerFactory } as ProviderFactories,
      appUrl: 'http://localhost:3000',
      baseUrl: 'http://localhost:7000/api/auth',
      config: baseConfig,
      logger,
      auth,
      tokenIssuer,
      catalog,
      ownershipResolver: undefined,
      userInfo,
      auditor,
    });
    return { app, auditor };
  }

  it('audits login start success', async () => {
    const factory: AuthProviderFactory = () =>
      ({
        start: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        frameHandler: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
      } as any);

    const { app, auditor } = createApp(factory);

    const res = await request(app).get('/mock/start');
    expect(res.status).toBe(204);

    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'auth-login',
        request: expect.any(Object),
        meta: { providerId: 'mock', actionType: 'start' },
      }),
    );
    const event = await (auditor.createEvent as jest.Mock).mock.results[0]
      .value;
    expect(event.success).toHaveBeenCalledWith({
      meta: { outcome: 'success' },
    });
  });

  it('audits login callback success', async () => {
    const factory: AuthProviderFactory = () =>
      ({
        start: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        frameHandler: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
      } as any);

    const { app, auditor } = createApp(factory);

    const res = await request(app).get('/mock/handler/frame');
    expect(res.status).toBe(204);

    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'auth-login',
        meta: { providerId: 'mock', actionType: 'complete' },
      }),
    );
    const event = await (auditor.createEvent as jest.Mock).mock.results[0]
      .value;
    expect(event.success).toHaveBeenCalledWith({
      meta: { outcome: 'success' },
    });
  });

  it('audits login callback failure', async () => {
    const factory: AuthProviderFactory = () =>
      ({
        start: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        frameHandler: () => {
          throw new Error('boom');
        },
      } as any);

    const { app, auditor } = createApp(factory);

    const res = await request(app).get('/mock/handler/frame');
    expect(res.status).toBe(500);

    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'auth-login',
        meta: { providerId: 'mock', actionType: 'complete' },
      }),
    );
    const event = await (auditor.createEvent as jest.Mock).mock.results[0]
      .value;
    expect(event.fail).toHaveBeenCalled();
    const failArg = (event.fail as jest.Mock).mock.calls[0][0];
    expect(failArg.meta).toEqual({ outcome: 'failure' });
    expect(failArg.error).toBeInstanceOf(Error);
    expect((failArg.error as Error).message).toBe('boom');
  });

  it('audits token refresh GET and POST', async () => {
    const factory: AuthProviderFactory = () =>
      ({
        start: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        frameHandler: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        refresh: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
      } as any);

    const { app, auditor } = createApp(factory);

    const resGet = await request(app).get('/mock/refresh');
    expect(resGet.status).toBe(204);
    const eventGet = await (auditor.createEvent as jest.Mock).mock.results[0]
      .value;
    expect(eventGet.success).toHaveBeenCalledWith({
      meta: { outcome: 'success' },
    });
    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'auth-token-refresh',
        meta: { providerId: 'mock' },
      }),
    );

    (auditor.createEvent as jest.Mock).mockClear();

    const resPost = await request(app).post('/mock/refresh');
    expect(resPost.status).toBe(204);
    const eventPost = await (auditor.createEvent as jest.Mock).mock.results[0]
      .value;
    expect(eventPost.success).toHaveBeenCalledWith({
      meta: { outcome: 'success' },
    });
    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'auth-token-refresh',
        meta: { providerId: 'mock' },
      }),
    );
  });

  it('audits logout', async () => {
    const factory: AuthProviderFactory = () =>
      ({
        start: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        frameHandler: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
        logout: (_req: express.Request, res: express.Response) =>
          res.status(204).end(),
      } as any);

    const { app, auditor } = createApp(factory);

    const res = await request(app).post('/mock/logout');
    expect(res.status).toBe(204);

    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'auth-logout',
        meta: { providerId: 'mock' },
      }),
    );
    const event = await (auditor.createEvent as jest.Mock).mock.results[0]
      .value;
    expect(event.success).toHaveBeenCalledWith({
      meta: { outcome: 'success' },
    });
  });
});
