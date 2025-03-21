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

import request from 'supertest';
import {
  mockCredentials,
  mockServices,
  type ServiceMock,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { kubernetesObjectsProviderExtensionPoint } from '@backstage/plugin-kubernetes-node';
import {
  createBackendModule,
  type PermissionsService,
} from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { ExtendedHttpServer } from '@backstage/backend-defaults/rootHttpRouter';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

describe('resourcesRoutes', () => {
  let app: ExtendedHttpServer;
  const permissionsMock: ServiceMock<PermissionsService> =
    mockServices.permissions.mock({
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    });

  const startPermissionDeniedTestServer = async () => {
    permissionsMock.authorize.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);
    const { server } = await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            kubernetes: {
              serviceLocatorMethod: { type: 'multiTenant' },
              clusterLocatorMethods: [],
            },
          },
        }),
        permissionsMock.factory,
        import('@backstage/plugin-kubernetes-backend'),
      ],
    });
    return server;
  };

  beforeEach(async () => {
    const objectsProviderMock = {
      getKubernetesObjectsByEntity: jest.fn().mockImplementation(args => {
        if (args.entity.metadata.name === 'inject500') {
          return Promise.reject(new Error('some internal error'));
        }

        return Promise.resolve({
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        });
      }),
      getCustomResourcesByEntity: jest.fn().mockImplementation(args => {
        if (args.entity.metadata.name === 'inject500') {
          return Promise.reject(new Error('some internal error'));
        }

        return Promise.resolve({
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        });
      }),
    };

    jest.mock('@backstage/catalog-client', () => ({
      CatalogClient: jest.fn().mockImplementation(() => ({
        getEntityByRef: jest.fn().mockImplementation(entityRef => {
          if (entityRef.name === 'noentity') {
            return Promise.resolve(undefined);
          }
          return Promise.resolve({
            kind: entityRef.kind,
            metadata: {
              name: entityRef.name,
              namespace: entityRef.namespace,
            },
          } as Entity);
        }),
      })),
    }));

    const { server } = await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            kubernetes: {
              serviceLocatorMethod: {
                type: 'multiTenant',
              },
              clusterLocatorMethods: [
                {
                  type: 'config',
                  clusters: [],
                },
              ],
            },
          },
        }),
        import('@backstage/plugin-kubernetes-backend'),
        import('@backstage/plugin-permission-backend'),
        import('@backstage/plugin-permission-backend-module-allow-all-policy'),
        createBackendModule({
          pluginId: 'kubernetes',
          moduleId: 'test-objects-provider',
          register(env) {
            env.registerInit({
              deps: { extension: kubernetesObjectsProviderExtensionPoint },
              async init({ extension }) {
                extension.addObjectsProvider(objectsProviderMock);
              },
            });
          },
        }),
      ],
    });

    app = server;
  });

  afterEach(() => {
    app.stop();
  });

  describe('POST /resources/workloads/query', () => {
    // eslint-disable-next-line jest/expect-expect
    it('200 happy path', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .send({
          entityRef: 'kind:namespacec/someComponent',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(200, {
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when missing entity ref', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .send({
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: { name: 'InputError', message: 'entity is a required field' },
          request: {
            method: 'POST',
            url: '/resources/workloads/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when bad entity ref', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .send({
          entityRef: 'ffff',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message:
              'Invalid entity ref, Error: Entity reference "ffff" had missing or empty kind (e.g. did not start with "component:" or similar)',
          },
          request: {
            method: 'POST',
            url: '/resources/workloads/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when no entity in catalog', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .send({
          entityRef: 'noentity:noentity',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message: 'Entity ref missing, noentity:default/noentity',
          },
          request: {
            method: 'POST',
            url: '/resources/workloads/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('401 when no Auth header', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .set('authorization', mockCredentials.none.header())
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(401, {
          error: {
            name: 'AuthenticationError',
            message: 'Missing credentials',
          },
          request: {
            method: 'POST',
            url: '/resources/workloads/query',
          },
          response: { statusCode: 401 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('401 when invalid Auth header', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', mockCredentials.user.invalidHeader())
        .expect(401, {
          error: {
            name: 'AuthenticationError',
            message: 'User token is invalid',
          },
          request: {
            method: 'POST',
            url: '/resources/workloads/query',
          },
          response: { statusCode: 401 },
        });
    });
    it('403 when permission blocks endpoint', async () => {
      app = await startPermissionDeniedTestServer();
      const response = await request(app).post(
        '/api/kubernetes/resources/workloads/query',
      );
      expect(response.status).toEqual(403);
    });
    // eslint-disable-next-line jest/expect-expect
    it('500 handle gracefully', async () => {
      await request(app)
        .post('/api/kubernetes/resources/workloads/query')
        .send({
          entityRef: 'inject500:inject500/inject500',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(500, {
          error: {
            name: 'Error',
            message: 'some internal error',
          },
          request: {
            method: 'POST',
            url: '/resources/workloads/query',
          },
          response: { statusCode: 500 },
        });
    });
  });
  describe('POST /resources/custom/query', () => {
    // eslint-disable-next-line jest/expect-expect
    it('200 happy path', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .expect(200, {
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when missing custom resources', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message: 'customResources is a required field',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when custom resources not array', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
          customResources: 'somestring',
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message: 'customResources must be an array',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when custom resources empty', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
          customResources: [],
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message: 'at least 1 customResource is required',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when missing entity ref', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: { name: 'InputError', message: 'entity is a required field' },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when bad entity ref', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'ffff',
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message:
              'Invalid entity ref, Error: Entity reference "ffff" had missing or empty kind (e.g. did not start with "component:" or similar)',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('400 when no entity in catalog', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'noentity:noentity',
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .expect(400, {
          error: {
            name: 'InputError',
            message: 'Entity ref missing, noentity:default/noentity',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 400 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('401 when no Auth header', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .set('authorization', mockCredentials.none.header())
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .expect(401, {
          error: {
            name: 'AuthenticationError',
            message: 'Missing credentials',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 401 },
        });
    });
    // eslint-disable-next-line jest/expect-expect
    it('401 when invalid Auth header', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'component:someComponent',
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', mockCredentials.user.invalidHeader())
        .expect(401, {
          error: {
            name: 'AuthenticationError',
            message: 'User token is invalid',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 401 },
        });
    });
    it('403 when permission blocks endpoint', async () => {
      app = await startPermissionDeniedTestServer();
      const response = await request(app).post(
        '/api/kubernetes/resources/custom/query',
      );
      expect(response.status).toEqual(403);
    });
    // eslint-disable-next-line jest/expect-expect
    it('500 handle gracefully', async () => {
      await request(app)
        .post('/api/kubernetes/resources/custom/query')
        .send({
          entityRef: 'inject500:inject500/inject500',
          auth: {
            google: 'something',
          },
          customResources: [
            {
              group: 'someGroup',
              apiVersion: 'someApiVersion',
              plural: 'somePlural',
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .expect(500, {
          error: {
            name: 'Error',
            message: 'some internal error',
          },
          request: {
            method: 'POST',
            url: '/resources/custom/query',
          },
          response: { statusCode: 500 },
        });
    });
  });
});
