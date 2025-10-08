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

import { PluginMetadataService } from '@backstage/backend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import request from 'supertest';
import express from 'express';
import { DefaultActionsRegistryService } from './DefaultActionsRegistryService';
import { mockServices } from '@backstage/backend-test-utils';
import { MiddlewareFactory } from '../../../entrypoints/rootHttpRouter';

describe('DefaultActionsRegistryService', () => {
  let service: DefaultActionsRegistryService;
  const mockLogger = mockServices.logger.mock();
  const mockHttpAuth = mockServices.httpAuth.mock();
  const mockAuth = mockServices.auth.mock();
  let mockMetadata: jest.Mocked<PluginMetadataService>;
  let app: express.Application;

  beforeEach(() => {
    mockMetadata = {
      getId: jest.fn().mockReturnValue('test-plugin'),
    } as any;

    service = DefaultActionsRegistryService.create({
      logger: mockLogger,
      httpAuth: mockHttpAuth,
      auth: mockAuth,
      metadata: mockMetadata,
    });

    const middleware = MiddlewareFactory.create({
      logger: mockLogger,
      config: mockServices.rootConfig(),
    });

    app = express();
    app.use(service.createRouter());
    app.use(middleware.error());
  });

  describe('authorize callback functionality', () => {
    it('should allow access to actions without authorize callback', async () => {
      service.register({
        name: 'test-action',
        title: 'Test Action',
        description: 'A test action',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        action: async ({ input }) => ({
          output: { result: `Hello ${input.message}` },
        }),
      });

      const response = await request(app)
        .get('/.backstage/actions/v1/actions')
        .expect(200);

      expect(response.body.actions).toHaveLength(1);
      expect(response.body.actions[0].id).toBe('test-plugin:test-action');
    });

    it('should allow access when authorize callback returns ALLOW', async () => {
      const mockAuthorize = jest.fn().mockResolvedValue({
        result: AuthorizeResult.ALLOW,
      });

      service.register({
        name: 'authorized-action',
        title: 'Authorized Action',
        description: 'An authorized action',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: mockAuthorize,
        action: async ({ input }) => ({
          output: { result: `Authorized: ${input.message}` },
        }),
      });

      const response = await request(app)
        .get('/.backstage/actions/v1/actions')
        .expect(200);

      expect(mockAuthorize).toHaveBeenCalled();
      expect(response.body.actions).toHaveLength(1);
      expect(response.body.actions[0].id).toBe('test-plugin:authorized-action');
    });

    it('should deny access when authorize callback returns DENY', async () => {
      const mockAuthorize = jest.fn().mockResolvedValue({
        result: AuthorizeResult.DENY,
      });

      service.register({
        name: 'denied-action',
        title: 'Denied Action',
        description: 'A denied action',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: mockAuthorize,
        action: async ({ input }) => ({
          output: { result: `Denied: ${input.message}` },
        }),
      });

      const response = await request(app)
        .get('/.backstage/actions/v1/actions')
        .expect(200);

      expect(mockAuthorize).toHaveBeenCalled();
      expect(response.body.actions).toHaveLength(0);
    });

    it('should handle mixed authorization results correctly', async () => {
      const allowAuthorize = jest.fn().mockResolvedValue({
        result: AuthorizeResult.ALLOW,
      });
      const denyAuthorize = jest.fn().mockResolvedValue({
        result: AuthorizeResult.DENY,
      });

      // Register allowed action
      service.register({
        name: 'allowed-action',
        title: 'Allowed Action',
        description: 'An allowed action',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: allowAuthorize,
        action: async ({ input }) => ({
          output: { result: `Allowed: ${input.message}` },
        }),
      });

      service.register({
        name: 'denied-action',
        title: 'Denied Action',
        description: 'A denied action',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: denyAuthorize,
        action: async ({ input }) => ({
          output: { result: `Denied: ${input.message}` },
        }),
      });

      service.register({
        name: 'no-auth-action',
        title: 'No Auth Action',
        description: 'An action without authorization',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        action: async ({ input }) => ({
          output: { result: `No auth: ${input.message}` },
        }),
      });

      const response = await request(app)
        .get('/.backstage/actions/v1/actions')
        .expect(200);

      expect(allowAuthorize).toHaveBeenCalled();
      expect(denyAuthorize).toHaveBeenCalled();

      expect(response.body.actions).toHaveLength(2);
      const actionIds = response.body.actions.map((action: any) => action.id);
      expect(actionIds).toContain('test-plugin:allowed-action');
      expect(actionIds).toContain('test-plugin:no-auth-action');
      expect(actionIds).not.toContain('test-plugin:denied-action');
    });

    it('should prevent action invocation when authorize callback returns DENY', async () => {
      const mockAuthorize = jest.fn().mockResolvedValue({
        result: AuthorizeResult.DENY,
      });

      service.register({
        name: 'denied-invoke-action',
        title: 'Denied Invoke Action',
        description: 'Action that denies invocation',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: mockAuthorize,
        action: async ({ input }) => ({
          output: { result: `Should not execute: ${input.message}` },
        }),
      });

      await request(app)
        .post(
          '/.backstage/actions/v1/actions/test-plugin:denied-invoke-action/invoke',
        )
        .send({ message: 'test' })
        .expect(403);

      expect(mockAuthorize).toHaveBeenCalled();
    });

    it('should allow action invocation when authorize callback returns ALLOW', async () => {
      const mockAuthorize = jest.fn().mockResolvedValue({
        result: AuthorizeResult.ALLOW,
      });
      const mockAction = jest.fn().mockResolvedValue({
        output: { result: 'Success!' },
      });

      service.register({
        name: 'allowed-invoke-action',
        title: 'Allowed Invoke Action',
        description: 'Action that allows invocation',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: mockAuthorize,
        action: mockAction,
      });

      const response = await request(app)
        .post(
          '/.backstage/actions/v1/actions/test-plugin:allowed-invoke-action/invoke',
        )
        .send({ message: 'test' })
        .expect(200);

      expect(mockAuthorize).toHaveBeenCalled();
      expect(mockAction).toHaveBeenCalledWith({
        input: { message: 'test' },
        logger: mockLogger,
      });
      expect(response.body.output).toEqual({ result: 'Success!' });
    });

    it('should handle authorize callback errors gracefully during listing', async () => {
      const mockAuthorize = jest
        .fn()
        .mockRejectedValue(new Error('Authorization error'));

      service.register({
        name: 'error-auth-action',
        title: 'Error Auth Action',
        description: 'Action with authorization error',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: mockAuthorize,
        action: async ({ input }) => ({
          output: { result: `Error: ${input.message}` },
        }),
      });

      // The service should handle authorization errors by treating them as denial
      const response = await request(app)
        .get('/.backstage/actions/v1/actions')
        .expect(200);

      expect(mockAuthorize).toHaveBeenCalled();
      expect(response.body.actions).toHaveLength(0);
    });

    it('should handle authorize callback errors during invocation', async () => {
      const mockAuthorize = jest
        .fn()
        .mockRejectedValue(new Error('Authorization error'));

      service.register({
        name: 'error-invoke-action',
        title: 'Error Invoke Action',
        description: 'Action with authorization error during invocation',
        schema: {
          input: z => z.object({ message: z.string() }),
          output: z => z.object({ result: z.string() }),
        },
        authorize: mockAuthorize,
        action: async ({ input }) => ({
          output: { result: `Should not execute: ${input.message}` },
        }),
      });

      await request(app)
        .post(
          '/.backstage/actions/v1/actions/test-plugin:error-invoke-action/invoke',
        )
        .send({ message: 'test' })
        .expect(403);

      expect(mockAuthorize).toHaveBeenCalled();
    });
  });
});
