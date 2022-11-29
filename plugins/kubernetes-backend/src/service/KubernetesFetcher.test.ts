/*
 * Copyright 2020 The Backstage Authors
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

import { getVoidLogger } from '@backstage/backend-common';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { ObjectToFetch } from '../types/types';
import { topPods } from '@kubernetes/client-node';
import {
  MockedRequest,
  RestContext,
  ResponseTransformer,
  compose,
  rest,
} from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import mockFs from 'mock-fs';

jest.mock('@kubernetes/client-node', () => ({
  ...jest.requireActual('@kubernetes/client-node'),
  topPods: jest.fn(),
}));

const OBJECTS_TO_FETCH = new Set<ObjectToFetch>([
  {
    group: '',
    apiVersion: 'v1',
    plural: 'pods',
    objectType: 'pods',
  },
  {
    group: '',
    apiVersion: 'v1',
    plural: 'services',
    objectType: 'services',
  },
]);

const POD_METRICS_FIXTURE = {
  containers: [],
  cpu: {
    currentUsage: 100,
    limitTotal: 102,
    requestTotal: 101,
  },
  memory: {
    currentUsage: '1000',
    limitTotal: '1002',
    requestTotal: '1001',
  },
  pod: {},
};

describe('KubernetesFetcher', () => {
  describe('fetchObjectsForService', () => {
    let sut: KubernetesClientBasedFetcher;
    const worker = setupServer();
    setupRequestMockHandlers(worker);

    const labels = (req: MockedRequest): object => {
      const selectorParam = req.url.searchParams.get('labelSelector');
      if (selectorParam) {
        const [key, value] = selectorParam.split('=');
        return { [key]: value };
      }
      return {};
    };
    const checkToken = (
      req: MockedRequest,
      ctx: RestContext,
      token: string,
    ): ResponseTransformer => {
      switch (req.headers.get('Authorization')) {
        case `Bearer ${token}`:
          return ctx.status(200);
        default:
          return compose(
            ctx.status(401),
            ctx.json({
              kind: 'Status',
              apiVersion: 'v1',
              code: 401,
            }),
          );
      }
    };
    const withLabels = (
      req: MockedRequest,
      ctx: RestContext,
      body: { items: { metadata: object }[] },
    ): ResponseTransformer =>
      ctx.json({
        ...body,
        items: body.items.map(item => ({
          ...item,
          metadata: { ...item.metadata, labels: labels(req) },
        })),
      });

    const testErrorResponse = async (
      errorResponse: any,
      expectedResult: any,
    ) => {
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'pod-name' } }],
            }),
          ),
        ),
        rest.get('http://localhost:9999/api/v1/services', (_, res, ctx) => {
          return res(
            ctx.status(errorResponse.response.statusCode),
            ctx.json({
              kind: 'Status',
              apiVersion: 'v1',
              status: 'Failure',
              code: errorResponse.response.statusCode,
            }),
          );
        }),
      );

      const result = await sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: '',
        customResources: [],
      });

      expect(result).toStrictEqual({
        errors: [expectedResult],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: 'pod-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
        ],
      });
    };

    beforeEach(() => {
      sut = new KubernetesClientBasedFetcher({
        kubernetesClientProvider: new KubernetesClientProvider(),
        logger: getVoidLogger(),
      });
    });

    it('should return pods, services', async () => {
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'pod-name' } }],
            }),
          ),
        ),
        rest.get('http://localhost:9999/api/v1/services', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'service-name' } }],
            }),
          ),
        ),
      );

      const result = await sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: '',
        customResources: [],
      });

      expect(result).toStrictEqual({
        errors: [],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: 'pod-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
          {
            type: 'services',
            resources: [
              {
                metadata: {
                  name: 'service-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
        ],
      });
    });
    it('should return pods, services and customobjects', async () => {
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'pod-name' } }],
            }),
          ),
        ),
        rest.get('http://localhost:9999/api/v1/services', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'service-name' } }],
            }),
          ),
        ),
        rest.get(
          'http://localhost:9999/apis/some-group/v2/things',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'something-else' } }],
              }),
            ),
        ),
      );

      const result = await sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: '',
        customResources: [
          {
            objectType: 'customresources',
            group: 'some-group',
            apiVersion: 'v2',
            plural: 'things',
          },
        ],
      });

      expect(result).toStrictEqual({
        errors: [],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: 'pod-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
          {
            type: 'services',
            resources: [
              {
                metadata: {
                  name: 'service-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
          {
            type: 'customresources',
            resources: [
              {
                metadata: {
                  name: 'something-else',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
        ],
      });
    });
    // they're in testErrorResponse
    // eslint-disable-next-line jest/expect-expect
    it('should return pods, bad request error', async () => {
      await testErrorResponse(
        {
          response: {
            statusCode: 400,
          },
        },
        {
          errorType: 'BAD_REQUEST',
          resourcePath: '/api/v1/services',
          statusCode: 400,
        },
      );
    });
    it('should return pods, unauthorized error', async () => {
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'pod-name' } }],
            }),
          ),
        ),
        rest.get('http://localhost:9999/api/v1/services', (req, res, ctx) =>
          res(checkToken(req, ctx, 'other-token')),
        ),
      );

      const result = await sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: '',
        customResources: [],
      });

      expect(result).toStrictEqual({
        errors: [
          {
            errorType: 'UNAUTHORIZED_ERROR',
            resourcePath: '/api/v1/services',
            statusCode: 401,
          },
        ],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: 'pod-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
        ],
      });
    });
    // they're in testErrorResponse
    // eslint-disable-next-line jest/expect-expect
    it('should return pods, system error', async () => {
      await testErrorResponse(
        {
          response: {
            statusCode: 500,
          },
        },
        {
          errorType: 'SYSTEM_ERROR',
          resourcePath: '/api/v1/services',
          statusCode: 500,
        },
      );
    });
    // they're in testErrorResponse
    // eslint-disable-next-line jest/expect-expect
    it('should return pods, unknown error', async () => {
      await testErrorResponse(
        {
          response: {
            statusCode: 900,
          },
        },
        {
          errorType: 'UNKNOWN_ERROR',
          resourcePath: '/api/v1/services',
          statusCode: 900,
        },
      );
    });
    it('should respect labelSelector', async () => {
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'pod-name' } }],
            }),
          ),
        ),
        rest.get('http://localhost:9999/api/v1/services', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              items: [{ metadata: { name: 'service-name' } }],
            }),
          ),
        ),
      );

      const result = await sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: 'service-label=value',
        customResources: [],
      });

      expect(result).toStrictEqual({
        errors: [],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: 'pod-name',
                  labels: { 'service-label': 'value' },
                },
              },
            ],
          },
          {
            type: 'services',
            resources: [
              {
                metadata: {
                  name: 'service-name',
                  labels: { 'service-label': 'value' },
                },
              },
            ],
          },
        ],
      });
    });
    it('should use namespace if provided', async () => {
      worker.use(
        rest.get(
          'http://localhost:9999/api/v1/namespaces/some-namespace/pods',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'pod-name' } }],
              }),
            ),
        ),
        rest.get(
          'http://localhost:9999/api/v1/namespaces/some-namespace/services',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'service-name' } }],
              }),
            ),
        ),
      );

      const result = await sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: '',
        namespace: 'some-namespace',
        customResources: [],
      });

      expect(result).toStrictEqual({
        errors: [],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: 'pod-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
          {
            type: 'services',
            resources: [
              {
                metadata: {
                  name: 'service-name',
                  labels: { 'backstage.io/kubernetes-id': 'some-service' },
                },
              },
            ],
          },
        ],
      });
    });
    describe('Backstage running on k8s', () => {
      const initialHost = process.env.KUBERNETES_SERVICE_HOST;
      const initialPort = process.env.KUBERNETES_SERVICE_PORT;
      afterEach(() => {
        process.env.KUBERNETES_SERVICE_HOST = initialHost;
        process.env.KUBERNETES_SERVICE_PORT = initialPort;
        mockFs.restore();
      });
      it('makes in-cluster requests when cluster details has no token', async () => {
        process.env.KUBERNETES_SERVICE_HOST = '10.10.10.10';
        process.env.KUBERNETES_SERVICE_PORT = '443';
        mockFs({
          '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt': '',
          '/var/run/secrets/kubernetes.io/serviceaccount/token':
            'allowed-token',
        });
        worker.use(
          rest.get('https://10.10.10.10/api/v1/pods', (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'allowed-token'),
              withLabels(req, ctx, {
                items: [
                  { metadata: { name: 'pod-name', labels: labels(req) } },
                ],
              }),
            ),
          ),
        );

        const result = await sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'overridden-to-in-cluster',
            url: 'http://ignored',
            authProvider: 'serviceAccount',
          },
          objectTypesToFetch: new Set<ObjectToFetch>([
            {
              group: '',
              apiVersion: 'v1',
              plural: 'pods',
              objectType: 'pods',
            },
          ]),
          labelSelector: '',
          customResources: [],
        });

        expect(result).toStrictEqual({
          errors: [],
          responses: [
            {
              type: 'pods',
              resources: [
                {
                  metadata: {
                    name: 'pod-name',
                    labels: { 'backstage.io/kubernetes-id': 'some-service' },
                  },
                },
              ],
            },
          ],
        });
      });
    });
  });

  describe('fetchPodMetricsByNamespaces', () => {
    let kubernetesClientProvider: any;
    let sut: KubernetesClientBasedFetcher;

    beforeEach(() => {
      jest.resetAllMocks();

      kubernetesClientProvider = {
        getMetricsClient: jest.fn(),
        getCoreClientByClusterDetails: jest.fn(),
      };

      sut = new KubernetesClientBasedFetcher({
        kubernetesClientProvider,
        logger: getVoidLogger(),
      });
    });

    it('should return pod metrics', async () => {
      (topPods as jest.Mock).mockResolvedValue(POD_METRICS_FIXTURE);

      const result = await sut.fetchPodMetricsByNamespaces(
        {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        new Set(['ns-a', 'ns-b']),
      );
      expect(result).toStrictEqual({
        errors: [],
        responses: [
          {
            type: 'podstatus',
            resources: POD_METRICS_FIXTURE,
          },
          {
            type: 'podstatus',
            resources: POD_METRICS_FIXTURE,
          },
        ],
      });
    });
    it('should return pod metrics and error', async () => {
      const topPodsMock = topPods as jest.Mock;
      topPodsMock
        .mockResolvedValueOnce(POD_METRICS_FIXTURE)
        .mockRejectedValueOnce({
          response: {
            statusCode: 404,
            request: {
              uri: {
                pathname: '/some/path',
              },
            },
          },
        });

      const result = await sut.fetchPodMetricsByNamespaces(
        {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        new Set(['ns-a', 'ns-b']),
      );
      expect(result).toStrictEqual({
        errors: [
          {
            errorType: 'NOT_FOUND',
            resourcePath: '/some/path',
            statusCode: 404,
          },
        ],
        responses: [
          {
            type: 'podstatus',
            resources: POD_METRICS_FIXTURE,
          },
        ],
      });
    });
  });
});
