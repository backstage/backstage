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

import { permissionsMiddlewareFactory } from './permissions';
import express from 'express';
import request from 'supertest';
import type { PermissionsService } from '@backstage/backend-plugin-api';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { mockServices } from '@backstage/backend-test-utils';
import { createValidatedOpenApiRouter } from '../stub';
import {
  AuthorizeResult,
  BasicPermission,
} from '@backstage/plugin-permission-common';

const middleware = MiddlewareFactory.create({
  logger: mockServices.logger.mock(),
  config: mockServices.rootConfig(),
});

const catalogLocationReadPermission: BasicPermission = {
  type: 'basic',
  name: 'catalog.location.read',
  attributes: {
    action: 'read',
  },
};

const catalogEntityReadPermission: BasicPermission = {
  type: 'basic',
  name: 'catalog.entity.read',
  attributes: {
    action: 'read',
  },
};

describe('permissionsMiddleware', () => {
  const createMockPermissionsService = () => {
    const mockAuthorize = jest.fn();

    const permissionsService: PermissionsService = {
      authorize: mockAuthorize,
      authorizeConditional: jest.fn(),
    };

    return { permissionsService, mockAuthorize };
  };

  const specWithPermissions = {
    openapi: '3.0.2',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    paths: {
      '/locations/{id}': {
        get: {
          operationId: 'getLocation',
          'x-backstage-permissions': {
            permission: 'catalog.location.read',
            onDeny: 404,
          },
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
      '/entities': {
        get: {
          operationId: 'listEntities',
          'x-backstage-permissions': {
            permission: 'catalog.entity.read',
          },
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
      '/validate-manually': {
        get: {
          operationId: 'validateManuallyEndpoint',
          'x-backstage-permissions': {
            permission: 'catalog.entity.read',
            validateManually: true,
          },
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
      '/public': {
        get: {
          operationId: 'publicEndpoint',
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
      '/unknown': {
        get: {
          operationId: 'unknown',
          'x-backstage-permissions': {
            permission: 'unknown.permission',
          },
          responses: { '200': { description: 'OK' } },
        },
      },
      '/unknown-validate-manually': {
        get: {
          operationId: 'unknownValidateManually',
          'x-backstage-permissions': {
            permission: 'unknown.validateManually.permission',
            validateManually: true,
          },
          responses: { '200': { description: 'OK' } },
        },
      },
    },
  } as const;

  let app: express.Router;
  let router: express.Router;
  let mockPermissionsService: ReturnType<typeof createMockPermissionsService>;
  let permissionsMiddleware: express.RequestHandler;
  let mockHttpAuth: ReturnType<typeof mockServices.httpAuth.mock>;
  let mockPermissionsRegistry: ReturnType<
    typeof mockServices.permissionsRegistry.mock
  >;

  beforeEach(() => {
    router =
      createValidatedOpenApiRouter<typeof specWithPermissions>(
        specWithPermissions,
      );
    app = express().use(router);
    mockPermissionsService = createMockPermissionsService();
    mockPermissionsRegistry = mockServices.permissionsRegistry.mock();
    mockPermissionsRegistry.listPermissions.mockReturnValue([
      catalogLocationReadPermission,
      catalogEntityReadPermission,
    ]);
    mockHttpAuth = mockServices.httpAuth.mock();
    permissionsMiddleware = permissionsMiddlewareFactory({
      permissions: mockPermissionsService.permissionsService,
      httpAuth: mockHttpAuth,
      permissionsRegistry: mockPermissionsRegistry,
      logger: mockServices.logger.mock(),
    });
    router.use(permissionsMiddleware);
  });

  it('allows request when authorization succeeds', async () => {
    const { mockAuthorize } = mockPermissionsService;
    mockAuthorize.mockResolvedValue([{ result: AuthorizeResult.ALLOW }]);

    router.get('/locations/:id', (_req, res) => {
      res.json({ id: 'loc-123' });
    });
    router.use(middleware.error());

    await request(app).get('/locations/loc-123').expect(200);

    expect(mockAuthorize).toHaveBeenCalledWith(
      [{ permission: catalogLocationReadPermission }],
      { credentials: undefined },
    );
  });

  it('throws NotFoundError when authorization denied and onDeny is 404', async () => {
    const { mockAuthorize } = mockPermissionsService;
    mockAuthorize.mockResolvedValue([{ result: AuthorizeResult.DENY }]);

    router.get('/locations/:id', (_req, res) => {
      res.json({ id: 'loc-123' });
    });
    router.use(middleware.error());

    const response = await request(app).get('/locations/loc-123').expect(404);

    expect(response.body.error).toMatchObject({
      name: 'NotFoundError',
    });
  });

  it('throws NotAllowedError when authorization denied and onDeny is 403', async () => {
    const { mockAuthorize } = mockPermissionsService;
    mockAuthorize.mockResolvedValue([{ result: AuthorizeResult.DENY }]);

    router.get('/entities', (_req, res) => {
      res.json({ entities: [] });
    });
    router.use(middleware.error());

    const response = await request(app).get('/entities').expect(403);

    expect(response.body.error).toMatchObject({
      name: 'NotAllowedError',
    });
  });

  it('skips authorization for routes without x-backstage-permissions', async () => {
    const { mockAuthorize } = mockPermissionsService;

    router.get('/public', (_req, res) => {
      res.json({ message: 'public' });
    });

    await request(app).get('/public').expect(200);

    expect(mockAuthorize).not.toHaveBeenCalled();
  });

  it('throws error when permission not in registry', async () => {
    router.get('/unknown', (_req, res) => {
      res.json({ ok: true });
    });
    router.use(middleware.error());

    const response = await request(app).get('/unknown').expect(500);

    expect(response.body.error.message).toContain(
      "Permission 'unknown.permission' not found",
    );
  });

  it('passes credentials to permissions service', async () => {
    const mockCredentials = {
      $$type: '@backstage/BackstageCredentials' as const,
      principal: { type: 'user', userEntityRef: 'user:default/test' },
    };

    mockHttpAuth.credentials.mockResolvedValue(mockCredentials);
    mockPermissionsService.mockAuthorize.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);

    router.get('/locations/:id', (_req, res) => {
      console.log('Handler called');
      res.json({ id: 'loc-123' });
    });
    router.use(middleware.error());

    await request(app).get('/locations/loc-123').expect(200);

    expect(mockPermissionsService.mockAuthorize).toHaveBeenCalledWith(
      [{ permission: catalogLocationReadPermission }],
      { credentials: mockCredentials },
    );
  });

  it('skips authorization when validateManually is true', async () => {
    const { mockAuthorize } = mockPermissionsService;

    router.get('/validate-manually', (_req, res) => {
      res.json({ entities: [] });
    });

    await request(app).get('/validate-manually').expect(200);

    expect(mockAuthorize).not.toHaveBeenCalled();
  });

  it('validates permission exists in registry for validateManually', async () => {
    router.get('/unknown-validate-manually', (_req, res) => {
      res.json({ ok: true });
    });
    router.use(middleware.error());

    const response = await request(app)
      .get('/unknown-validate-manually')
      .expect(500);

    expect(response.body.error.message).toContain(
      "Permission 'unknown.validateManually.permission' not found",
    );
  });
});
