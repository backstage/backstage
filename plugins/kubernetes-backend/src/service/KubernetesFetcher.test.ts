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

import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';
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
import {
  createMockDirectory,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import { Config } from '@kubernetes/client-node';

const mockCertDir = createMockDirectory({
  content: {
    'ca.crt': 'MOCKCA',
  },
});

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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
                  labels: {},
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
                  labels: {},
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
                  labels: {},
                },
              },
            ],
          },
        ],
      });
    });
    it('localKubectlProxy authProvider fetches resources correctly', async () => {
      worker.use(
        rest.get(
          'http://localhost:9999/k8s/clusters/1234/api/v1/services',
          (req, res, ctx) =>
            res(
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
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'localKubectlProxy',
          },
        },
        credential: { type: 'anonymous' },
        objectTypesToFetch: new Set([
          {
            group: '',
            apiVersion: 'v1',
            plural: 'services',
            objectType: 'services',
          },
        ]),
        labelSelector: '',
        customResources: [],
      });

      expect(result).toStrictEqual({
        errors: [],
        responses: [
          {
            type: 'services',
            resources: [
              {
                metadata: {
                  name: 'service-name',
                  labels: {},
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
                  labels: {},
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
                  labels: {},
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
              kind: 'PodList',
              items: [{ metadata: { name: 'pod-name' } }],
            }),
          ),
        ),
        rest.get('http://localhost:9999/api/v1/services', (req, res, ctx) =>
          res(
            checkToken(req, ctx, 'token'),
            withLabels(req, ctx, {
              kind: 'ServiceList',
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
                kind: 'ThingList',
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
                  labels: {},
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
                  labels: {},
                },
              },
            ],
          },
          {
            type: 'customresources',
            resources: [
              {
                kind: 'Thing',
                metadata: {
                  name: 'something-else',
                  labels: {},
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
                  labels: {},
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
            authMetadata: {},
            caData: 'MOCKCA',
          },
          credential: { type: 'bearer token', token: 'token' },
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
            authMetadata: {},
          },
          credential: { type: 'bearer token', token: 'token' },
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
        it('should trust contents of specified caFile', async () => {
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
              authMetadata: {},
              caFile: mockCertDir.resolve('ca.crt'),
            },
            credential: { type: 'bearer token', token: 'token' },
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
            authMetadata: {},
            skipTLSVerify: true,
          },
          credential: { type: 'bearer token', token: 'token' },
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

      it('fetchObjectsForService authenticates with k8s using x509 client cert from authentication strategy', async () => {
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

        const myCert = 'MOCKCert';
        const myKey = 'MOCKKey';

        const result = sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'cluster1',
            url: 'https://localhost:9999',
            authMetadata: {},
            caData: 'MOCKCA',
          },
          credential: {
            type: 'x509 client certificate',
            cert: myCert,
            key: myKey,
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

        await expect(result).rejects.toThrow(/PEM/);

        expect(httpsRequest).toHaveBeenCalledTimes(1);
        const [[{ agent }]] = httpsRequest.mock.calls;
        expect(agent.options.ca.toString('base64')).toMatch('MOCKCA');
        expect(agent.options.cert).toEqual(myCert);
        expect(agent.options.key).toEqual(myKey);
      });

      it('fetchPodMetricsByNamespaces authenticates with k8s using x509 client cert from authentication strategy', async () => {
        worker.use(
          rest.get(
            'https://localhost:9999/api/v1/namespaces/:namespace/pods',
            (req, res, ctx) =>
              res(
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
            'https://localhost:9999/apis/metrics.k8s.io/v1beta1/namespaces/:namespace/pods',
            (req, res, ctx) =>
              res(
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

        const myCert = 'MOCKCert';
        const myKey = 'MOCKKey';

        const result = sut.fetchPodMetricsByNamespaces(
          {
            name: 'cluster1',
            url: 'https://localhost:9999',
            authMetadata: {},
            caData: 'MOCKCA',
          },
          {
            type: 'x509 client certificate',
            cert: myCert,
            key: myKey,
          },
          new Set(['ns-a']),
        );

        await expect(result).rejects.toThrow(/PEM/);

        expect(httpsRequest).toHaveBeenCalledTimes(2);
        const [[{ agent }]] = httpsRequest.mock.calls;
        expect(agent.options.ca.toString('base64')).toMatch('MOCKCA');
        expect(agent.options.cert).toEqual(myCert);
        expect(agent.options.key).toEqual(myKey);
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
          authMetadata: {},
        },
        credential: { type: 'bearer token', token: 'token' },
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
                  labels: {},
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
                  labels: {},
                },
              },
            ],
          },
        ],
      });
    });
    describe('Backstage not running on k8s', () => {
      it('fails if no credential is provided', () => {
        const result = sut.fetchObjectsForService({
          serviceId: 'some-service',
          clusterDetails: {
            name: 'unauthenticated-cluster',
            url: 'http://ignored',
            authMetadata: {},
          },
          credential: { type: 'anonymous' },
          objectTypesToFetch: OBJECTS_TO_FETCH,
          labelSelector: '',
          customResources: [],
        });
        return expect(result).rejects.toThrow(
          "no bearer token or client cert for cluster 'unauthenticated-cluster' and not running in Kubernetes",
        );
      });
    });
    describe('Backstage running on k8s', () => {
      const initialHost = process.env.KUBERNETES_SERVICE_HOST;
      const initialPort = process.env.KUBERNETES_SERVICE_PORT;
      const initialCaPath = Config.SERVICEACCOUNT_CA_PATH;

      afterEach(() => {
        process.env.KUBERNETES_SERVICE_HOST = initialHost;
        process.env.KUBERNETES_SERVICE_PORT = initialPort;
        Config.SERVICEACCOUNT_CA_PATH = initialCaPath;
      });

      it('makes in-cluster requests when cluster details has no token', async () => {
        process.env.KUBERNETES_SERVICE_HOST = '10.10.10.10';
        process.env.KUBERNETES_SERVICE_PORT = '443';
        Config.SERVICEACCOUNT_CA_PATH = mockCertDir.resolve('ca.crt');
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
            authMetadata: {
              [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
            },
          },
          credential: { type: 'bearer token', token: 'allowed-token' },
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
                    labels: {},
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
          authMetadata: {},
        },
        { type: 'bearer token', token: 'token' },
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
          authMetadata: {},
        },
        { type: 'bearer token', token: 'token' },
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
