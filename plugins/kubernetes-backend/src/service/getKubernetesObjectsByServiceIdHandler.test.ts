/*
 * Copyright 2020 Spotify AB
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

import { handleGetKubernetesObjectsByServiceId } from './getKubernetesObjectsByServiceIdHandler';
import { getVoidLogger } from '@backstage/backend-common';
import { ClusterDetails } from '../cluster-locator/types';

const TEST_SERVICE_ID = 'my-service';

const fetchConfigMapsByServiceId = jest.fn();
const fetchDeploymentsByServiceId = jest.fn();
const fetchPodsByServiceId = jest.fn();
const fetchReplicaSetsByServiceId = jest.fn();
const fetchSecretsByServiceId = jest.fn();
const fetchServicesByServiceId = jest.fn();

const getClusterByServiceId = jest.fn();

const mockFetch = (mock: jest.Mock, type: string) => {
  mock.mockImplementation((serviceId: string, clusterDetails: ClusterDetails) =>
    Promise.resolve([
      {
        metadata: {
          name: `my-${type}-${serviceId}-${clusterDetails.name}`,
        },
      },
    ]),
  );
};

describe('handleGetKubernetesObjectsByServiceId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retrieve objects for one cluster', async () => {
    getClusterByServiceId.mockImplementation(() =>
      Promise.resolve([
        {
          name: 'test-cluster',
        },
      ]),
    );

    mockFetch(fetchConfigMapsByServiceId, 'cm');
    mockFetch(fetchDeploymentsByServiceId, 'deploy');
    mockFetch(fetchPodsByServiceId, 'po');
    mockFetch(fetchReplicaSetsByServiceId, 'rs');
    mockFetch(fetchSecretsByServiceId, 'secrets');
    mockFetch(fetchServicesByServiceId, 'svc');

    const result = await handleGetKubernetesObjectsByServiceId(
      TEST_SERVICE_ID,
      {
        fetchConfigMapsByServiceId,
        fetchDeploymentsByServiceId,
        fetchPodsByServiceId,
        fetchReplicaSetsByServiceId,
        fetchSecretsByServiceId,
        fetchServicesByServiceId,
      },
      {
        getClusterByServiceId,
      },
      getVoidLogger(),
    );

    expect(getClusterByServiceId.mock.calls.length).toBe(1);
    expect(fetchConfigMapsByServiceId.mock.calls.length).toBe(1);
    expect(fetchDeploymentsByServiceId.mock.calls.length).toBe(1);
    expect(fetchPodsByServiceId.mock.calls.length).toBe(1);
    expect(fetchReplicaSetsByServiceId.mock.calls.length).toBe(1);
    expect(fetchSecretsByServiceId.mock.calls.length).toBe(1);
    expect(fetchServicesByServiceId.mock.calls.length).toBe(1);
    expect(result).toStrictEqual({
      'test-cluster': {
        configMaps: [
          {
            metadata: {
              name: 'my-cm-my-service-test-cluster',
            },
          },
        ],
        deployments: [
          {
            metadata: {
              name: 'my-deploy-my-service-test-cluster',
            },
          },
        ],
        pods: [
          {
            metadata: {
              name: 'my-po-my-service-test-cluster',
            },
          },
        ],
        replicaSets: [
          {
            metadata: {
              name: 'my-rs-my-service-test-cluster',
            },
          },
        ],
        secrets: [
          {
            metadata: {
              name: 'my-secrets-my-service-test-cluster',
            },
          },
        ],
        services: [
          {
            metadata: {
              name: 'my-svc-my-service-test-cluster',
            },
          },
        ],
      },
    });
  });

  it('retrieve objects for two clusters', async () => {
    getClusterByServiceId.mockImplementation(() =>
      Promise.resolve([
        {
          name: 'test-cluster',
        },
        {
          name: 'other-cluster',
        },
      ]),
    );

    mockFetch(fetchConfigMapsByServiceId, 'cm');
    mockFetch(fetchDeploymentsByServiceId, 'deploy');
    mockFetch(fetchPodsByServiceId, 'po');
    mockFetch(fetchReplicaSetsByServiceId, 'rs');
    mockFetch(fetchSecretsByServiceId, 'secrets');
    mockFetch(fetchServicesByServiceId, 'svc');

    const result = await handleGetKubernetesObjectsByServiceId(
      TEST_SERVICE_ID,
      {
        fetchConfigMapsByServiceId,
        fetchDeploymentsByServiceId,
        fetchPodsByServiceId,
        fetchReplicaSetsByServiceId,
        fetchSecretsByServiceId,
        fetchServicesByServiceId,
      },
      {
        getClusterByServiceId,
      },
      getVoidLogger(),
    );

    expect(getClusterByServiceId.mock.calls.length).toBe(1);
    expect(fetchConfigMapsByServiceId.mock.calls.length).toBe(2);
    expect(fetchDeploymentsByServiceId.mock.calls.length).toBe(2);
    expect(fetchPodsByServiceId.mock.calls.length).toBe(2);
    expect(fetchReplicaSetsByServiceId.mock.calls.length).toBe(2);
    expect(fetchSecretsByServiceId.mock.calls.length).toBe(2);
    expect(fetchServicesByServiceId.mock.calls.length).toBe(2);
    expect(result).toStrictEqual({
      'other-cluster': {
        configMaps: [
          {
            metadata: {
              name: 'my-cm-my-service-other-cluster',
            },
          },
        ],
        deployments: [
          {
            metadata: {
              name: 'my-deploy-my-service-other-cluster',
            },
          },
        ],
        pods: [
          {
            metadata: {
              name: 'my-po-my-service-other-cluster',
            },
          },
        ],
        replicaSets: [
          {
            metadata: {
              name: 'my-rs-my-service-other-cluster',
            },
          },
        ],
        secrets: [
          {
            metadata: {
              name: 'my-secrets-my-service-other-cluster',
            },
          },
        ],
        services: [
          {
            metadata: {
              name: 'my-svc-my-service-other-cluster',
            },
          },
        ],
      },
      'test-cluster': {
        configMaps: [
          {
            metadata: {
              name: 'my-cm-my-service-test-cluster',
            },
          },
        ],
        deployments: [
          {
            metadata: {
              name: 'my-deploy-my-service-test-cluster',
            },
          },
        ],
        pods: [
          {
            metadata: {
              name: 'my-po-my-service-test-cluster',
            },
          },
        ],
        replicaSets: [
          {
            metadata: {
              name: 'my-rs-my-service-test-cluster',
            },
          },
        ],
        secrets: [
          {
            metadata: {
              name: 'my-secrets-my-service-test-cluster',
            },
          },
        ],
        services: [
          {
            metadata: {
              name: 'my-svc-my-service-test-cluster',
            },
          },
        ],
      },
    });
  });
});
