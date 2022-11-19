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
import { topPods } from '@kubernetes/client-node';
import http from 'http';
import { V1Namespace } from '@kubernetes/client-node/dist/gen/api';

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
    let coreObjectsClientMock: any;
    let customObjectsClientMock: any;
    let kubernetesClientProvider: any;
    let sut: KubernetesClientBasedFetcher;

    beforeEach(() => {
      jest.resetAllMocks();
      const response = {
        statusCode: 200,
      } as unknown as http.IncomingMessage;
      const body = {
        status: {
          phase: 'Active',
        },
      } as unknown as V1Namespace;

      coreObjectsClientMock = {
        readNamespace: jest.fn((_namespace: string) =>
          Promise.resolve({
            response: response,
            body: body,
          }),
        ),
      };

      customObjectsClientMock = {
        listClusterCustomObject: jest.fn(),
        listNamespacedCustomObject: jest.fn(),
        addInterceptor: jest.fn(),
      };

      kubernetesClientProvider = {
        getCoreClientByClusterDetails: jest.fn(() => coreObjectsClientMock),
        getCustomObjectsClient: jest.fn(() => customObjectsClientMock),
      };

      sut = new KubernetesClientBasedFetcher({
        kubernetesClientProvider,
        logger: getVoidLogger(),
      });
    });

    const testErrorResponse = async (
      errorResponse: any,
      expectedResult: any,
    ) => {
      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
      });

      customObjectsClientMock.listClusterCustomObject.mockRejectedValue(
        errorResponse,
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
                },
              },
            ],
          },
        ],
      });

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls.length,
      ).toBe(2);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[0],
      ).toEqual([
        '',
        'v1',
        'pods',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[1],
      ).toEqual([
        '',
        'v1',
        'services',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        kubernetesClientProvider.getCustomObjectsClient.mock.calls.length,
      ).toBe(2);
    };

    it('should return pods, services', async () => {
      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
      });

      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'service-name',
              },
            },
          ],
        },
      });

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
                },
              },
            ],
          },
        ],
      });

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls.length,
      ).toBe(2);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[0],
      ).toEqual([
        '',
        'v1',
        'pods',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[1],
      ).toEqual([
        '',
        'v1',
        'services',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        kubernetesClientProvider.getCustomObjectsClient.mock.calls.length,
      ).toBe(2);
    });
    it('should return pods, services and customobjects', async () => {
      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
      });

      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'service-name',
              },
            },
          ],
        },
      });

      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'something-else',
              },
            },
          ],
        },
      });

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
                },
              },
            ],
          },
        ],
      });

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls.length,
      ).toBe(3);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[0],
      ).toEqual([
        '',
        'v1',
        'pods',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[1],
      ).toEqual([
        '',
        'v1',
        'services',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        customObjectsClientMock.listClusterCustomObject.mock.calls[2],
      ).toEqual([
        'some-group',
        'v2',
        'things',
        '',
        false,
        '',
        '',
        'backstage.io/kubernetes-id=some-service',
      ]);

      expect(
        kubernetesClientProvider.getCustomObjectsClient.mock.calls.length,
      ).toBe(3);
    });
    // they're in testErrorResponse
    // eslint-disable-next-line jest/expect-expect
    it('should return pods, bad request error', async () => {
      await testErrorResponse(
        {
          response: {
            statusCode: 400,
            request: {
              uri: {
                pathname: '/some/path',
              },
            },
          },
        },
        {
          errorType: 'BAD_REQUEST',
          resourcePath: '/some/path',
          statusCode: 400,
        },
      );
    });
    // they're in testErrorResponse
    // eslint-disable-next-line jest/expect-expect
    it('should return pods, unauthorized error', async () => {
      await testErrorResponse(
        {
          response: {
            statusCode: 401,
            request: {
              uri: {
                pathname: '/some/path',
              },
            },
          },
        },
        {
          errorType: 'UNAUTHORIZED_ERROR',
          resourcePath: '/some/path',
          statusCode: 401,
        },
      );
    });
    // they're in testErrorResponse
    // eslint-disable-next-line jest/expect-expect
    it('should return pods, system error', async () => {
      await testErrorResponse(
        {
          response: {
            statusCode: 500,
            request: {
              uri: {
                pathname: '/some/path',
              },
            },
          },
        },
        {
          errorType: 'SYSTEM_ERROR',
          resourcePath: '/some/path',
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
            request: {
              uri: {
                pathname: '/some/path',
              },
            },
          },
        },
        {
          errorType: 'UNKNOWN_ERROR',
          resourcePath: '/some/path',
          statusCode: 900,
        },
      );
    });
    it('should always add a labelSelector query', async () => {
      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
      });

      customObjectsClientMock.listClusterCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'service-name',
              },
            },
          ],
        },
      });

      await sut.fetchObjectsForService({
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

      const mockCall =
        customObjectsClientMock.listClusterCustomObject.mock.calls[0];
      const actualSelector = mockCall[mockCall.length - 1];
      const expectedSelector = 'backstage.io/kubernetes-id=some-service';
      expect(actualSelector).toBe(expectedSelector);
    });
    it('should use namespace if provided', async () => {
      customObjectsClientMock.listNamespacedCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
      });

      customObjectsClientMock.listNamespacedCustomObject.mockResolvedValueOnce({
        body: {
          items: [
            {
              metadata: {
                name: 'service-name',
              },
            },
          ],
        },
      });

      await sut.fetchObjectsForService({
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

      const mockCall =
        customObjectsClientMock.listNamespacedCustomObject.mock.calls[0];
      const namespace = mockCall[2];
      expect(namespace).toBe('some-namespace');
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
