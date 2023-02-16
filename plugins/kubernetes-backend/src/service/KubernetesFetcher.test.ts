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
import { ObjectToFetch } from '../types/types';
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

const POD_METRICS_FIXTURE = [
  {
    type: 'podstatus',
    resources: [
      {
        CPU: { CurrentUsage: 0, LimitTotal: 1, RequestTotal: 0.5 },
        Memory: {
          CurrentUsage: 0,
          LimitTotal: 1000000000n,
          RequestTotal: 512000000n,
        },
      },
    ],
  },
];

describe('KubernetesFetcher', () => {
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
  const withLabels = <T extends { items: { metadata: object }[] }>(
    req: MockedRequest,
    ctx: RestContext,
    body: T,
  ): ResponseTransformer =>
    ctx.json({
      ...body,
      items: body.items.map(item => ({
        ...item,
        metadata: { ...item.metadata, labels: labels(req) },
      })),
    });

  describe('fetchObjectsForService', () => {
    let sut: KubernetesClientBasedFetcher;
    const logger = getVoidLogger();

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
        logger,
      });
    });

    it('should support clusters with a base path', async () => {
      worker.use(
        rest.get(
          'http://localhost:9999/k8s/clusters/1234/api/v1/pods',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'pod-name' } }],
              }),
            ),
        ),
        rest.get(
          'http://localhost:9999/k8s/clusters/1234/api/v1/services',
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
          url: 'http://localhost:9999/k8s/clusters/1234',
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
    it('should return pods and unauthorized error, logging a warning', async () => {
      const warn = jest.spyOn(logger, 'warn');
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
      expect(warn).toHaveBeenCalledWith(
        'Received 401 status when fetching "/api/v1/services" from cluster "cluster1"; body=[{"kind":"Status","apiVersion":"v1","code":401}]',
      );
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
    it('fails on a network error', async () => {
      worker.use(
        rest.get('http://badurl.does.not.exist/api/v1/pods', (_, res) =>
          res.networkError('getaddrinfo ENOTFOUND badurl.does.not.exist'),
        ),
        rest.get(
          'http://badurl.does.not.exist/api/v1/services',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'service-name' } }],
              }),
            ),
        ),
      );

      const result = sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://badurl.does.not.exist',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: OBJECTS_TO_FETCH,
        labelSelector: '',
        customResources: [],
      });

      await expect(result).rejects.toThrow(
        'getaddrinfo ENOTFOUND badurl.does.not.exist',
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
    describe('when server uses TLS', () => {
      let httpsRequest: jest.SpyInstance;
      beforeAll(() => {
        httpsRequest = jest.spyOn(
          // this is pretty egregious reverse engineering of msw.
          // If the SetupServerApi constructor was exported, we wouldn't need
          // to be quite so hacky here
          (worker as any).interceptor.interceptors[0].modules.get('https'),
          'request',
        );
      });
      beforeEach(() => {
        httpsRequest.mockClear();
      });
      it('should trust specified caData', async () => {
        worker.use(
          rest.get('https://localhost:9999/api/v1/pods', (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'pod-name' } }],
              }),
            ),
          ),
        );

        await sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'cluster1',
            url: 'https://localhost:9999',
            serviceAccountToken: 'token',
            authProvider: 'serviceAccount',
            caData: 'MOCKCA',
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

        expect(httpsRequest).toHaveBeenCalledTimes(1);
        const [[{ agent }]] = httpsRequest.mock.calls;
        expect(agent.options.ca.toString('base64')).toMatch('MOCKCA');
      });
      it('should use default chain of trust when caData is unspecified', async () => {
        worker.use(
          rest.get('https://localhost:9999/api/v1/pods', (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'pod-name' } }],
              }),
            ),
          ),
        );

        await sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'cluster1',
            url: 'https://localhost:9999',
            serviceAccountToken: 'token',
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

        expect(httpsRequest).toHaveBeenCalledTimes(1);
        const [[{ agent }]] = httpsRequest.mock.calls;
        expect(agent.options.ca).toBeUndefined();
      });
      describe('with a CA file on disk', () => {
        afterEach(() => {
          mockFs.restore();
        });
        it('should trust contents of specified caFile', async () => {
          mockFs({
            '/path/to/ca.crt': 'MOCKCA',
          });
          worker.use(
            rest.get('https://localhost:9999/api/v1/pods', (req, res, ctx) =>
              res(
                checkToken(req, ctx, 'token'),
                withLabels(req, ctx, {
                  items: [{ metadata: { name: 'pod-name' } }],
                }),
              ),
            ),
          );

          await sut.fetchObjectsForService({
            serviceId: 'some-service',
            clusterDetails: {
              name: 'cluster1',
              url: 'https://localhost:9999',
              serviceAccountToken: 'token',
              authProvider: 'serviceAccount',
              caFile: '/path/to/ca.crt',
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

          expect(httpsRequest).toHaveBeenCalledTimes(1);
          const [[{ agent }]] = httpsRequest.mock.calls;
          expect(agent.options.ca.toString()).toEqual('MOCKCA');
        });
      });
      it('should accept unauthorized certs when skipTLSVerify is set', async () => {
        worker.use(
          rest.get('https://localhost:9999/api/v1/pods', (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [{ metadata: { name: 'pod-name' } }],
              }),
            ),
          ),
        );

        await sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'cluster1',
            url: 'https://localhost:9999',
            serviceAccountToken: 'token',
            authProvider: 'serviceAccount',
            skipTLSVerify: true,
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

        expect(httpsRequest).toHaveBeenCalledTimes(1);
        const [[{ agent }]] = httpsRequest.mock.calls;
        expect(agent.options.rejectUnauthorized).toBe(false);
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
    describe('Backstage not running on k8s', () => {
      it('fails if cluster details has no token', () => {
        const result = sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'unauthenticated-cluster',
            url: 'http://ignored',
            authProvider: 'serviceAccount',
          },
          objectTypesToFetch: OBJECTS_TO_FETCH,
          labelSelector: '',
          customResources: [],
        });
        return expect(result).rejects.toThrow(
          "no bearer token for cluster 'unauthenticated-cluster' and not running in Kubernetes",
        );
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
                items: [{ metadata: { name: 'pod-name' } }],
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
    let sut: KubernetesClientBasedFetcher;

    beforeEach(() => {
      sut = new KubernetesClientBasedFetcher({
        logger: getVoidLogger(),
      });
    });

    it('should return pod metrics', async () => {
      worker.use(
        rest.get(
          'http://localhost:9999/api/v1/namespaces/:namespace/pods',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [
                  {
                    metadata: { name: 'pod-name' },
                    spec: {
                      containers: [
                        {
                          name: 'container-name',
                          resources: {
                            requests: { cpu: '500m', memory: '512M' },
                            limits: { cpu: '1000m', memory: '1G' },
                          },
                        },
                      ],
                    },
                  },
                ],
              }),
            ),
        ),
        rest.get(
          'http://localhost:9999/apis/metrics.k8s.io/v1beta1/namespaces/:namespace/pods',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [
                  {
                    metadata: { name: 'pod-name' },
                    containers: [
                      {
                        name: 'container-name',
                        usage: { cpu: '0', memory: '0' },
                      },
                    ],
                  },
                ],
              }),
            ),
        ),
      );

      const result = await sut.fetchPodMetricsByNamespaces(
        {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        new Set(['ns-a']),
      );
      expect(result).toMatchObject({
        errors: [],
        responses: POD_METRICS_FIXTURE,
      });
    });
    it('should return pod metrics and error', async () => {
      worker.use(
        rest.get(
          'http://localhost:9999/api/v1/namespaces/ns-a/pods',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [
                  {
                    metadata: { name: 'pod-name' },
                    spec: {
                      containers: [
                        {
                          name: 'container-name',
                          resources: {
                            requests: { cpu: '500m', memory: '512M' },
                            limits: { cpu: '1000m', memory: '1G' },
                          },
                        },
                      ],
                    },
                  },
                ],
              }),
            ),
        ),
        rest.get(
          'http://localhost:9999/apis/metrics.k8s.io/v1beta1/namespaces/ns-a/pods',
          (req, res, ctx) =>
            res(
              checkToken(req, ctx, 'token'),
              withLabels(req, ctx, {
                items: [
                  {
                    metadata: { name: 'pod-name' },
                    containers: [
                      {
                        name: 'container-name',
                        usage: { cpu: '0', memory: '0' },
                      },
                    ],
                  },
                ],
              }),
            ),
        ),
        rest.get(
          'http://localhost:9999/api/v1/namespaces/ns-b/pods',
          (_, res, ctx) =>
            res(
              ctx.status(404),
              ctx.json({
                kind: 'Status',
                apiVersion: 'v1',
                code: 404,
              }),
            ),
        ),
        rest.get(
          'http://localhost:9999/apis/metrics.k8s.io/v1beta1/namespaces/ns-b/pods',
          (_, res, ctx) =>
            res(
              ctx.status(404),
              ctx.json({
                kind: 'Status',
                apiVersion: 'v1',
                code: 404,
              }),
            ),
        ),
      );

      const result = await sut.fetchPodMetricsByNamespaces(
        {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        new Set(['ns-a', 'ns-b']),
      );

      expect(result.errors).toStrictEqual([
        {
          errorType: 'NOT_FOUND',
          resourcePath: '/apis/metrics.k8s.io/v1beta1/namespaces/ns-b/pods',
          statusCode: 404,
        },
      ]);
      expect(result.responses).toMatchObject(POD_METRICS_FIXTURE);
    });
  });
});
