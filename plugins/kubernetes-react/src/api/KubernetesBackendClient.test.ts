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
import { http, HttpResponse } from 'msw';
import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { setupServer } from 'msw/node';
import { MockFetchApi, registerMswTestHooks } from '@backstage/test-utils';
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
    getCredentials: jest.fn(),
  };
  let mockResponse: ObjectsByEntityResponse;
  const worker = setupServer();
  registerMswTestHooks(worker);

  const identityApi = {
    getCredentials: jest.fn(),
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    signOut: jest.fn(),
  };
  const fetchApi = new MockFetchApi({ injectIdentityAuth: { identityApi } });

  beforeEach(() => {
    jest.resetAllMocks();
    backendClient = new KubernetesBackendClient({
      discoveryApi: UrlPatternDiscovery.compile(
        'http://localhost:1234/api/{{ pluginId }}',
      ),
      fetchApi,
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
      http.get('http://localhost:1234/api/kubernetes/clusters', () =>
        HttpResponse.json({
          items: [{ name: 'cluster-a', authProvider: 'aws' }],
        }),
      ),
    );

    const clusters = await backendClient.getClusters();

    expect(clusters).toEqual([{ name: 'cluster-a', authProvider: 'aws' }]);
  });

  it('/clusters API throws a 404 Error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.get(
        'http://localhost:1234/api/kubernetes/clusters',
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    await expect(backendClient.getClusters()).rejects.toThrow(
      'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.',
    );
  });

  it('/clusters API throws a 500 Error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.get(
        'http://localhost:1234/api/kubernetes/clusters',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    await expect(backendClient.getClusters()).rejects.toThrow(
      'Request failed with 500 Internal Server Error, ',
    );
  });

  it('hits the /resources/custom/query API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/resources/custom/query',
        () => HttpResponse.json(mockResponse),
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

    expect(customObject).toEqual(mockResponse);
  });

  it('/resources/custom/query API throws a 404 error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/resources/custom/query',
        () => new HttpResponse(null, { status: 404 }),
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

    const response = backendClient.getCustomObjectsByEntity(request);

    await expect(response).rejects.toThrow(
      'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.',
    );
  });

  it('/resources/custom/query API throws a 500 error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/resources/custom/query',
        () => new HttpResponse(null, { status: 500 }),
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

    const response = backendClient.getCustomObjectsByEntity(request);

    await expect(response).rejects.toThrow(
      'Request failed with 500 Internal Server Error, ',
    );
  });

  it('hits the /services/{entityName} API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post('http://localhost:1234/api/kubernetes/services/test-name', () =>
        HttpResponse.json(mockResponse),
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

    expect(entityObject).toEqual(mockResponse);
  });

  it('services/{entityName} API throws a 404 error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/services/test-name',
        () => new HttpResponse(null, { status: 404 }),
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

    const response = backendClient.getObjectsByEntity(request);

    await expect(response).rejects.toThrow(
      'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.',
    );
  });

  it('services/{entityName} API throws a 500 error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/services/test-name',
        () => new HttpResponse(null, { status: 500 }),
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

    const response = backendClient.getObjectsByEntity(request);

    await expect(response).rejects.toThrow(
      'Request failed with 500 Internal Server Error, ',
    );
  });

  it('hits the /resources/workloads/query API', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/resources/workloads/query',
        () => HttpResponse.json(mockResponse),
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

    expect(response).toEqual(mockResponse);
  });

  it('/resources/workloads/query API throws a 404 error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/resources/workloads/query',
        () => new HttpResponse(null, { status: 404 }),
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

    const response = backendClient.getWorkloadsByEntity(request);

    await expect(response).rejects.toThrow(
      'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.',
    );
  });

  it('/resources/workloads/query API throws a 500 error', async () => {
    identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    worker.use(
      http.post(
        'http://localhost:1234/api/kubernetes/resources/workloads/query',
        () => new HttpResponse(null, { status: 500 }),
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

    const response = backendClient.getWorkloadsByEntity(request);

    await expect(response).rejects.toThrow(
      'Request failed with 500 Internal Server Error, ',
    );
  });

  describe('proxy', () => {
    beforeEach(() => {
      worker.use(
        http.get('http://localhost:1234/api/kubernetes/clusters', () =>
          HttpResponse.json({
            items: [{ name: 'cluster-a', authProvider: 'aws' }],
          }),
        ),
      );
      identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
    });

    it('hits the /proxy API with oidc as protocol and okta as auth provider', async () => {
      worker.use(
        http.get('http://localhost:1234/api/kubernetes/clusters', () =>
          HttpResponse.json({
            items: [
              {
                name: 'cluster-a',
                authProvider: 'oidc',
                oidcTokenProvider: 'okta',
              },
            ],
          }),
        ),
      );
      kubernetesAuthProvidersApi.getCredentials.mockResolvedValue({
        token: 'k8-token3',
      });
      const nsResponse = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };
      worker.use(
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
          ({ request }) =>
            request.headers.get(
              'Backstage-Kubernetes-Authorization-oidc-okta',
            ) === 'k8-token3'
              ? HttpResponse.json(nsResponse)
              : new HttpResponse(null, { status: 403 }),
        ),
      );

      const request = {
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces',
      };

      const response = await backendClient.proxy(request);

      await expect(response.json()).resolves.toEqual(nsResponse);
      expect(kubernetesAuthProvidersApi.getCredentials).toHaveBeenCalledWith(
        'oidc.okta',
      );
    });

    it('hits the /proxy API with serviceAccount as auth provider', async () => {
      identityApi.getCredentials.mockResolvedValue({ token: 'idToken' });
      worker.use(
        http.get('http://localhost:1234/api/kubernetes/clusters', () =>
          HttpResponse.json({
            items: [
              {
                name: 'cluster-a',
                authProvider: 'serviceAccount',
              },
            ],
          }),
        ),
      );

      const nsResponse = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };
      worker.use(
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
          ({ request }) =>
            request.headers.get('Authorization') === 'Bearer idToken'
              ? HttpResponse.json(nsResponse)
              : new HttpResponse(null, { status: 403 }),
        ),
      );

      const request = {
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces',
      };

      const response = await backendClient.proxy(request);

      await expect(response.json()).resolves.toEqual(nsResponse);
      expect(kubernetesAuthProvidersApi.getCredentials).toHaveBeenCalledWith(
        'serviceAccount',
      );
    });

    it('ignores oidcTokenProvider for non-oidc auth provider', async () => {
      worker.use(
        http.get('http://localhost:1234/api/kubernetes/clusters', () =>
          HttpResponse.json({
            items: [
              {
                name: 'cluster-a',
                authProvider: 'not oidc',
                oidcTokenProvider: 'should be ignored',
              },
            ],
          }),
        ),
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
          () => HttpResponse.json([]),
        ),
      );

      await backendClient.proxy({
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces',
      });

      expect(kubernetesAuthProvidersApi.getCredentials).toHaveBeenCalledWith(
        'not oidc',
      );
    });

    it('hits /proxy api when signed in as a guest', async () => {
      // when a user is signed in as a guest the result of the getCredentials() method resolves to the {} value.
      identityApi.getCredentials.mockResolvedValue({});
      kubernetesAuthProvidersApi.getCredentials.mockResolvedValue({
        token: 'k8-token',
      });
      const nsResponse = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };
      worker.use(
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
          ({ request }) =>
            request.headers.get('Backstage-Kubernetes-Authorization-aws') ===
            'k8-token'
              ? HttpResponse.json(nsResponse)
              : new HttpResponse(null, { status: 403 }),
        ),
      );

      const request = {
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces',
      };

      const response = await backendClient.proxy(request);
      await expect(response.json()).resolves.toEqual(nsResponse);
    });

    it('/proxy API throws a 404 error', async () => {
      kubernetesAuthProvidersApi.getCredentials.mockResolvedValue({
        token: 'k8-token',
      });
      worker.use(
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
          () => new HttpResponse(null, { status: 404 }),
        ),
      );

      const request = {
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces',
      };

      const response = await backendClient.proxy(request);

      expect(response.status).toEqual(404);
    });

    it('throws a ERROR_NOT_FOUND if the cluster in the request is not found', async () => {
      const request = {
        clusterName: 'cluster-b',
        path: '/api/v1/namespaces',
      };

      await expect(backendClient.proxy(request)).rejects.toThrow(NotFoundError);
    });

    it('responds with an 403 error when invalid k8 token is provided', async () => {
      kubernetesAuthProvidersApi.getCredentials.mockResolvedValue({
        token: 'wrong-token',
      });

      const nsResponse = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };
      worker.use(
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces',
          ({ request }) =>
            request.headers.get('Backstage-Kubernetes-Authorization') ===
            'Bearer k8-token'
              ? HttpResponse.json(nsResponse)
              : new HttpResponse(null, { status: 403 }),
        ),
      );

      const request = {
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces',
      };

      const response = await backendClient.proxy(request);
      expect(response.status).toEqual(403);
    });

    it('skips authorization header when auth provider returns no creds', async () => {
      const nsResponse = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };
      worker.use(
        http.get(
          'http://localhost:1234/api/kubernetes/proxy/api/v1/namespaces/new-ns',
          ({ request }) =>
            request.headers.get('Backstage-Kubernetes-Authorization')
              ? new HttpResponse(null, { status: 403 })
              : HttpResponse.json(nsResponse),
        ),
      );
      kubernetesAuthProvidersApi.getCredentials.mockResolvedValue({});

      const response = await backendClient.proxy({
        clusterName: 'cluster-a',
        path: '/api/v1/namespaces/new-ns',
      });

      await expect(response.json()).resolves.toEqual(nsResponse);
    });
  });
});
