/*
 * Copyright 2023 The Backstage Authors
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

import { KubernetesAuthProvidersApi } from '../kubernetes-auth-provider';
import { KubernetesBackendClient } from './KubernetesBackendClient';
import { rest } from 'msw';
import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import {
  CustomObjectsByEntityRequest,
  KubernetesRequestBody,
  ObjectsByEntityResponse,
  WorkloadsByEntityRequest,
} from '@backstage/plugin-kubernetes-common';
import { NotFoundError } from '@backstage/errors';

describe('KubernetesBackendClient', () => {
  let backendClient: KubernetesBackendClient;
  const kubernetesAuthProvidersApi: jest.Mocked<KubernetesAuthProvidersApi> = {
    decorateRequestBodyForAuth: jest.fn(),
    getBearerToken: jest.fn(),
  };
  let mockResponse: ObjectsByEntityResponse;
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  const identityApi = {
    getCredentials: jest.fn(),
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    backendClient = new KubernetesBackendClient({
      discoveryApi: UrlPatternDiscovery.compile(
        'http://localhost:1234/api/{{ pluginId }}',
      ),
      identityApi,
      kubernetesAuthProvidersApi,
    });
    mockResponse = {
      items: [
        {
          cluster: {
            name: 'cluster-a',
          },
          resources: [{ type: 'pods', resources: [] }],
          podMetrics: [
            {
              pod: {},
              cpu: { currentUsage: 8, requestTotal: 2, limitTotal: 1 },
              memory: { currentUsage: 8, requestTotal: 2, limitTotal: 1 },
              containers: [
                {
                  container: 'test',
                  cpuUsage: { currentUsage: 8, requestTotal: 2, limitTotal: 1 },
                  memoryUsage: {
                    currentUsage: 8,
                    requestTotal: 2,
                    limitTotal: 1,
                  },
                },
              ],
            },
          ],
          errors: [],
        },
      ],
    };
  });

  it('hits the /clusters API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      rest.get('http://localhost:1234/api/kubernetes/clusters', (_, res, ctx) =>
        res(ctx.json({ items: [{ name: 'cluster-a', authProvider: 'aws' }] })),
      ),
    );

    const clusters = await backendClient.getClusters();

    expect(clusters).toStrictEqual([
      { name: 'cluster-a', authProvider: 'aws' },
    ]);
  });

  it('hits the /resources/custom/query API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      rest.post(
        'http://localhost:1234/api/kubernetes/resources/custom/query',
        (_, res, ctx) => res(ctx.json(mockResponse)),
      ),
    );

    const request: CustomObjectsByEntityRequest = {
      auth: {},
      customResources: [
        {
          group: 'test-group',
          apiVersion: 'v1',
          plural: 'none',
        },
      ],
      entity: {
        apiVersion: 'v1',
        kind: 'pod',
        metadata: {
          name: 'test-name',
        },
      },
    };

    const customObject: ObjectsByEntityResponse =
      await backendClient.getCustomObjectsByEntity(request);

    expect(customObject).toStrictEqual(mockResponse);
  });

  it('hits the /services/{entityName} api', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      rest.post(
        'http://localhost:1234/api/kubernetes/services/test-name',
        (_, res, ctx) => res(ctx.json(mockResponse)),
      ),
    );

    const request: KubernetesRequestBody = {
      entity: {
        apiVersion: 'v1',
        kind: 'pod',
        metadata: {
          name: 'test-name',
        },
      },
    };

    const entityObject: ObjectsByEntityResponse =
      await backendClient.getObjectsByEntity(request);

    expect(entityObject).toStrictEqual(mockResponse);
  });

  it('hits the /resources/workloads/query API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      rest.post(
        'http://localhost:1234/api/kubernetes/resources/workloads/query',
        (_, res, ctx) => res(ctx.json(mockResponse)),
      ),
    );

    const request: WorkloadsByEntityRequest = {
      auth: {},
      entity: {
        apiVersion: 'v1',
        kind: 'pod',
        metadata: {
          name: 'test-name',
        },
      },
    };

    const response: ObjectsByEntityResponse =
      await backendClient.getWorkloadsByEntity(request);

    expect(response).toStrictEqual(mockResponse);
  });

  it('hits the /proxy API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    kubernetesAuthProvidersApi.getBearerToken.mockResolvedValue(
      'Bearer k8-token',
    );
    const nsResponse = {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name: 'new-ns',
      },
    };
    worker.use(
      rest.get(
        'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
        (_, res, ctx) => res(ctx.json(nsResponse)),
      ),
      rest.get('http://localhost:1234/api/kubernetes/clusters', (_, res, ctx) =>
        res(ctx.json({ items: [{ name: 'cluster-a', authProvider: 'aws' }] })),
      ),
    );

    const request = {
      clusterName: 'cluster-a',
      path: '/api/v1/namespaces',
    };

    const response = await backendClient.proxy(request);

    expect(response).toStrictEqual(nsResponse);
  });

  it('/proxy API throws a ERROR_NOT_FOUND if the cluster in the request is not found', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      rest.get('http://localhost:1234/api/kubernetes/clusters', (_, res, ctx) =>
        res(ctx.json({ items: [{ name: 'cluster-b', authProvider: 'aws' }] })),
      ),
    );

    const request = {
      clusterName: 'cluster-a',
      path: '/api/v1/namespaces',
    };

    await expect(backendClient.proxy(request)).rejects.toThrow(NotFoundError);
  });

  it('hits /proxy api when signed in as a guest', async () => {
    // when a user is signed in as a guest the result of the getCredentials() method resolves to the {} value.
    identityApi.getCredentials.mockResolvedValue({});
    kubernetesAuthProvidersApi.getBearerToken.mockResolvedValue(
      'Bearer k8-token',
    );
    const nsResponse = {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name: 'new-ns',
      },
    };
    worker.use(
      rest.get(
        'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
        (_, res, ctx) => res(ctx.status(200), ctx.json(nsResponse)),
      ),
      rest.get('http://localhost:1234/api/kubernetes/clusters', (_, res, ctx) =>
        res(ctx.json({ items: [{ name: 'cluster-a', authProvider: 'aws' }] })),
      ),
    );

    const request = {
      clusterName: 'cluster-a',
      path: '/api/v1/namespaces',
    };

    const response = await backendClient.proxy(request);
    expect(response).toStrictEqual(nsResponse);
  });
});
