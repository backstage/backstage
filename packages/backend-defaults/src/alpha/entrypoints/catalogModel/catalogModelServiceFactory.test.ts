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
import {
  mockServices,
  registerMswTestHooks,
  ServiceFactoryTester,
  startTestBackend,
} from '@backstage/backend-test-utils';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { catalogModelServiceFactory } from './catalogModelServiceFactory';
import { catalogModelRegistryServiceFactory } from '../catalogModelRegistry/catalogModelRegistryServiceFactory';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import {
  catalogModelRegistryServiceRef,
  catalogModelServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import request from 'supertest';
import Router from 'express-promise-router';
import { json } from 'express';

const mswServer = setupServer();

describe('catalogModelServiceFactory', () => {
  describe('client', () => {
    registerMswTestHooks(mswServer);

    const defaultDeps = [
      mockServices.rootConfig.factory({
        data: {
          backend: {
            catalogModel: { pluginSources: ['my-plugin'] },
          },
        },
      }),
      catalogModelServiceFactory,
      httpRouterServiceFactory,
      catalogModelRegistryServiceFactory,
      mockServices.discovery.factory(),
    ];

    it('should list annotations from configured plugin sources', async () => {
      mswServer.use(
        rest.get(
          'http://localhost:0/api/my-plugin/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) =>
            res(
              ctx.json({
                annotations: [
                  {
                    key: 'test.io/annotation',
                    pluginId: 'my-plugin',
                    entityKind: 'Component',
                    description: 'A test annotation',
                    schema: { type: 'string' },
                  },
                ],
              }),
            ),
        ),
      );

      const subject = await ServiceFactoryTester.from(
        catalogModelServiceFactory,
        { dependencies: defaultDeps },
      ).getSubject();

      const annotations = await subject.listAnnotations();

      expect(annotations).toEqual([
        {
          key: 'test.io/annotation',
          pluginId: 'my-plugin',
          entityKind: 'Component',
          description: 'A test annotation',
          schema: { type: 'string' },
        },
      ]);
    });

    it('should filter annotations by entity kind', async () => {
      mswServer.use(
        rest.get(
          'http://localhost:0/api/my-plugin/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) =>
            res(
              ctx.json({
                annotations: [
                  {
                    key: 'test.io/component-only',
                    pluginId: 'my-plugin',
                    entityKind: 'Component',
                    schema: { type: 'string' },
                  },
                  {
                    key: 'test.io/resource-only',
                    pluginId: 'my-plugin',
                    entityKind: 'Resource',
                    schema: { type: 'string' },
                  },
                ],
              }),
            ),
        ),
      );

      const subject = await ServiceFactoryTester.from(
        catalogModelServiceFactory,
        { dependencies: defaultDeps },
      ).getSubject();

      const annotations = await subject.listAnnotations({
        entityKind: 'Component',
      });

      expect(annotations).toHaveLength(1);
      expect(annotations[0].key).toBe('test.io/component-only');
    });

    it('should handle plugin source failures gracefully', async () => {
      mswServer.use(
        rest.get(
          'http://localhost:0/api/my-plugin/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) => res(ctx.status(500)),
        ),
      );

      const subject = await ServiceFactoryTester.from(
        catalogModelServiceFactory,
        { dependencies: defaultDeps },
      ).getSubject();

      const annotations = await subject.listAnnotations();
      expect(annotations).toEqual([]);
    });

    it('should validate entity annotations locally using fetched schemas', async () => {
      mswServer.use(
        rest.get(
          'http://localhost:0/api/my-plugin/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) =>
            res(
              ctx.json({
                annotations: [
                  {
                    key: 'test.io/name',
                    pluginId: 'my-plugin',
                    entityKind: 'Component',
                    schema: { type: 'string' },
                  },
                  {
                    key: 'test.io/count',
                    pluginId: 'my-plugin',
                    entityKind: 'Component',
                    schema: { type: 'string', pattern: '^\\d+$' },
                  },
                ],
              }),
            ),
        ),
      );

      const subject = await ServiceFactoryTester.from(
        catalogModelServiceFactory,
        { dependencies: defaultDeps },
      ).getSubject();

      const validResult = await subject.validateEntity({
        kind: 'Component',
        metadata: {
          annotations: { 'test.io/name': 'hello', 'test.io/count': '42' },
        },
      });
      expect(validResult).toEqual({ valid: true, errors: [] });

      const invalidResult = await subject.validateEntity({
        kind: 'Component',
        metadata: { annotations: { 'test.io/count': 'not-a-number' } },
      });
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toHaveLength(1);
      expect(invalidResult.errors[0]).toMatchObject({
        pluginId: 'my-plugin',
        annotation: 'test.io/count',
      });
    });

    it('should skip validation for annotations not present on the entity', async () => {
      mswServer.use(
        rest.get(
          'http://localhost:0/api/my-plugin/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) =>
            res(
              ctx.json({
                annotations: [
                  {
                    key: 'test.io/required-looking',
                    pluginId: 'my-plugin',
                    entityKind: 'Component',
                    schema: { type: 'string' },
                  },
                ],
              }),
            ),
        ),
      );

      const subject = await ServiceFactoryTester.from(
        catalogModelServiceFactory,
        { dependencies: defaultDeps },
      ).getSubject();

      const result = await subject.validateEntity({
        kind: 'Component',
        metadata: { annotations: {} },
      });
      expect(result).toEqual({ valid: true, errors: [] });
    });

    it('should aggregate errors from multiple plugin sources', async () => {
      mswServer.use(
        rest.get(
          'http://localhost:0/api/plugin-a/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) =>
            res(
              ctx.json({
                annotations: [
                  {
                    key: 'a.io/field',
                    pluginId: 'plugin-a',
                    entityKind: 'Component',
                    schema: { type: 'string', pattern: '^valid$' },
                  },
                ],
              }),
            ),
        ),
        rest.get(
          'http://localhost:0/api/plugin-b/.backstage/catalog-model/v1/annotations',
          (_req, res, ctx) =>
            res(
              ctx.json({
                annotations: [
                  {
                    key: 'b.io/field',
                    pluginId: 'plugin-b',
                    entityKind: 'Component',
                    schema: { type: 'string', pattern: '^valid$' },
                  },
                ],
              }),
            ),
        ),
      );

      const subject = await ServiceFactoryTester.from(
        catalogModelServiceFactory,
        {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  catalogModel: {
                    pluginSources: ['plugin-a', 'plugin-b'],
                  },
                },
              },
            }),
            catalogModelServiceFactory,
            httpRouterServiceFactory,
            catalogModelRegistryServiceFactory,
            mockServices.discovery.factory(),
          ],
        },
      ).getSubject();

      const result = await subject.validateEntity({
        kind: 'Component',
        metadata: {
          annotations: { 'a.io/field': 'invalid', 'b.io/field': 'invalid' },
        },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ pluginId: 'plugin-a' }),
          expect.objectContaining({ pluginId: 'plugin-b' }),
        ]),
      );
    });
  });

  describe('integration', () => {
    const features = [
      catalogModelServiceFactory,
      catalogModelRegistryServiceFactory,
      httpRouterServiceFactory,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            catalogModel: { pluginSources: ['plugin-with-annotations'] },
          },
        },
      }),
      createBackendPlugin({
        pluginId: 'plugin-with-annotations',
        register({ registerInit }) {
          registerInit({
            deps: {
              catalogModelRegistry: catalogModelRegistryServiceRef,
            },
            async init({ catalogModelRegistry }) {
              catalogModelRegistry.registerAnnotations({
                entityKind: 'Component',
                annotations: zod =>
                  zod.object({
                    'test.io/name': zod.string().describe('A name annotation'),
                    'test.io/url': zod
                      .string()
                      .regex(/^https?:\/\//)
                      .describe('A URL annotation'),
                  }),
              });
            },
          });
        },
      }),
      createBackendPlugin({
        pluginId: 'test-harness',
        register({ registerInit }) {
          registerInit({
            deps: {
              catalogModel: catalogModelServiceRef,
              router: coreServices.httpRouter,
            },
            async init({ catalogModel, router }) {
              const innerRouter = Router();
              innerRouter.use(json());
              router.use(innerRouter);

              innerRouter.get('/annotations', async (_req, res) => {
                const annotations = await catalogModel.listAnnotations();
                res.json({ annotations });
              });

              innerRouter.post('/validate', async (req, res) => {
                const result = await catalogModel.validateEntity(req.body);
                res.json(result);
              });
            },
          });
        },
      }),
    ];

    it('should list annotations end-to-end', async () => {
      const { server } = await startTestBackend({ features });

      const { body, status } = await request(server).get(
        '/api/test-harness/annotations',
      );

      expect(status).toBe(200);
      expect(body.annotations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'test.io/name',
            pluginId: 'plugin-with-annotations',
            entityKind: 'Component',
            description: 'A name annotation',
          }),
          expect.objectContaining({
            key: 'test.io/url',
            pluginId: 'plugin-with-annotations',
            entityKind: 'Component',
            description: 'A URL annotation',
          }),
        ]),
      );
    });

    it('should validate entities end-to-end', async () => {
      const { server } = await startTestBackend({ features });

      const validResult = await request(server)
        .post('/api/test-harness/validate')
        .send({
          kind: 'Component',
          metadata: {
            annotations: {
              'test.io/name': 'hello',
              'test.io/url': 'https://example.com',
            },
          },
        });

      expect(validResult.status).toBe(200);
      expect(validResult.body).toEqual({ valid: true, errors: [] });

      const invalidResult = await request(server)
        .post('/api/test-harness/validate')
        .send({
          kind: 'Component',
          metadata: { annotations: { 'test.io/url': 'not-a-url' } },
        });

      expect(invalidResult.status).toBe(200);
      expect(invalidResult.body.valid).toBe(false);
      expect(invalidResult.body.errors).toHaveLength(1);
      expect(invalidResult.body.errors[0]).toMatchObject({
        pluginId: 'plugin-with-annotations',
        annotation: 'test.io/url',
      });
    });
  });
});
