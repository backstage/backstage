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

import { KubernetesFetchError } from '@backstage/plugin-kubernetes-common';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { ObjectToFetch, KubernetesRejectionHandler } from '../types/types';
import { topPods } from '@kubernetes/client-node';

jest.mock('@kubernetes/client-node', () => ({
  ...jest.requireActual('@kubernetes/client-node'),
  topPods: jest.fn(),
}));

const PODS_AND_SERVICES = new Set<ObjectToFetch>([
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
  const cluster = {
    name: 'cluster1',
    url: 'http://localhost:9999',
    serviceAccountToken: 'token',
    authProvider: 'serviceAccount',
  };

  describe('fetchObjectsForService', () => {
    let clientMock: any;
    let rejectionHandler: jest.Mocked<KubernetesRejectionHandler>;
    let kubernetesClientProvider: any;
    let sut: KubernetesClientBasedFetcher;

    const pods = [{ metadata: { name: 'pod-name' } }];
    const services = [{ metadata: { name: 'service-name' } }];

    const params = {
      serviceId: 'some-service',
      clusterDetails: cluster,
      objectTypesToFetch: PODS_AND_SERVICES,
      labelSelector: '',
      customResources: [],
    };

    beforeEach(() => {
      jest.resetAllMocks();
      clientMock = {
        listClusterCustomObject: jest.fn(),
        listNamespacedCustomObject: jest.fn(),
        addInterceptor: jest.fn(),
      };

      kubernetesClientProvider = {
        getCustomObjectsClient: jest.fn(() => clientMock),
      };

      rejectionHandler = {
        onRejected: jest.fn(),
      };

      sut = new KubernetesClientBasedFetcher({
        kubernetesClientProvider,
        rejectionHandler,
      });
    });

    it('should return objectTypesToFetch and customobjects', async () => {
      const customResources = [{ metadata: { name: 'something-else' } }];

      clientMock.listClusterCustomObject
        .mockResolvedValueOnce({ body: { items: pods } })
        .mockResolvedValueOnce({ body: { items: services } })
        .mockResolvedValueOnce({ body: { items: customResources } });

      const result = await sut.fetchObjectsForService({
        ...params,
        objectTypesToFetch: PODS_AND_SERVICES,
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
          { type: 'pods', resources: pods },
          { type: 'services', resources: services },
          { type: 'customresources', resources: customResources },
        ],
      });

      expect(clientMock.listClusterCustomObject).toHaveBeenCalledTimes(3);

      expect(
        clientMock.listClusterCustomObject.mock.calls[0].slice(0, 3),
      ).toEqual(['', 'v1', 'pods']);
      expect(
        clientMock.listClusterCustomObject.mock.calls[1].slice(0, 3),
      ).toEqual(['', 'v1', 'services']);
      expect(
        clientMock.listClusterCustomObject.mock.calls[2].slice(0, 3),
      ).toEqual(['some-group', 'v2', 'things']);
    });
    it('merges successful response with rejection handler output on failure', async () => {
      const reason = new Error();
      const resourcePath = '/api/v1/services';
      const expectedError = {
        errorType: 'UNKNOWN_ERROR',
      } as KubernetesFetchError;

      clientMock.listClusterCustomObject
        .mockResolvedValueOnce({ body: { items: pods } })
        .mockRejectedValue(reason);
      rejectionHandler.onRejected.mockResolvedValue(expectedError);

      const result = await sut.fetchObjectsForService({
        ...params,
        objectTypesToFetch: PODS_AND_SERVICES,
      });

      expect(result).toStrictEqual({
        errors: [{ errorType: 'UNKNOWN_ERROR', resourcePath }],
        responses: [{ type: 'pods', resources: pods }],
      });
      expect(rejectionHandler.onRejected).toHaveBeenCalledWith(
        reason,
        resourcePath,
      );
    });
    it('should always add a labelSelector query', async () => {
      clientMock.listClusterCustomObject
        .mockResolvedValueOnce({ body: { items: pods } })
        .mockResolvedValueOnce({ body: { items: services } });

      await sut.fetchObjectsForService(params);

      const mockCall = clientMock.listClusterCustomObject.mock.calls[0];
      const actualSelector = mockCall[mockCall.length - 1];
      const expectedSelector = 'backstage.io/kubernetes-id=some-service';
      expect(actualSelector).toBe(expectedSelector);
    });
    it('should use namespace if provided', async () => {
      clientMock.listNamespacedCustomObject
        .mockResolvedValueOnce({ body: { items: pods } })
        .mockResolvedValueOnce({ body: { items: services } });

      await sut.fetchObjectsForService({
        ...params,
        namespace: 'some-namespace',
      });

      const mockCall = clientMock.listNamespacedCustomObject.mock.calls[0];
      const namespace = mockCall[2];
      expect(namespace).toBe('some-namespace');
    });
  });

  describe('fetchPodMetricsByNamespaces', () => {
    let kubernetesClientProvider: any;
    let rejectionHandler: jest.Mocked<KubernetesRejectionHandler>;
    let sut: KubernetesClientBasedFetcher;

    beforeEach(() => {
      jest.resetAllMocks();

      kubernetesClientProvider = {
        getMetricsClient: jest.fn(),
        getCoreClientByClusterDetails: jest.fn(),
      };

      rejectionHandler = {
        onRejected: jest.fn(),
      };

      sut = new KubernetesClientBasedFetcher({
        kubernetesClientProvider,
        rejectionHandler,
      });
    });

    it('should return pod metrics for each namespace', async () => {
      (topPods as jest.Mock).mockResolvedValue(POD_METRICS_FIXTURE);

      const result = await sut.fetchPodMetricsByNamespaces(
        cluster,
        new Set(['ns-a', 'ns-b']),
      );
      expect(result).toStrictEqual({
        errors: [],
        responses: [
          { type: 'podstatus', resources: POD_METRICS_FIXTURE },
          { type: 'podstatus', resources: POD_METRICS_FIXTURE },
        ],
      });
    });
    it('should return pod metrics and error', async () => {
      const topPodsMock = topPods as jest.Mock;
      const reason = new Error();
      const expectedError = {
        errorType: 'UNKNOWN_ERROR',
      } as KubernetesFetchError;

      topPodsMock
        .mockResolvedValueOnce(POD_METRICS_FIXTURE)
        .mockRejectedValueOnce(reason);
      rejectionHandler.onRejected.mockResolvedValue(expectedError);

      const result = await sut.fetchPodMetricsByNamespaces(
        cluster,
        new Set(['ns-a', 'ns-b']),
      );

      expect(result).toStrictEqual({
        errors: [expectedError],
        responses: [{ type: 'podstatus', resources: POD_METRICS_FIXTURE }],
      });
      expect(rejectionHandler.onRejected).toHaveBeenCalledWith(
        reason,
        '/apis/metrics.k8s.io/v1beta1/namespaces/ns-b/pods',
      );
    });
  });
});
