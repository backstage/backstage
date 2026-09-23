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
import { createGetKubernetesClustersAction } from './createGetKubernetesClustersAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { KubernetesClustersSupplier } from '@backstage/plugin-kubernetes-node';

function createMockClusterSupplier(
  clusters: Awaited<ReturnType<KubernetesClustersSupplier['getClusters']>>,
): KubernetesClustersSupplier {
  return {
    getClusters: jest.fn().mockResolvedValue(clusters),
  };
}

describe('createGetKubernetesClustersAction', () => {
  it('returns an empty list when no clusters are registered', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const clusterSupplier = createMockClusterSupplier([]);

    createGetKubernetesClustersAction({
      clusterSupplier,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-clusters',
      input: {},
    });

    expect(result).toEqual({ output: { clusters: [] } });
  });

  it('returns cluster names, titles, dashboardUrl and dashboardApp when present', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const clusterSupplier = createMockClusterSupplier([
      {
        name: 'production',
        title: 'Production Cluster',
        url: 'https://k8s.production.example.com',
        authMetadata: {},
        dashboardUrl: 'https://dashboard.production.example.com',
        dashboardApp: 'standard',
      },
      {
        name: 'staging',
        url: 'https://k8s.staging.example.com',
        authMetadata: {},
      },
    ]);

    createGetKubernetesClustersAction({
      clusterSupplier,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-clusters',
      input: {},
    });

    expect(result).toEqual({
      output: {
        clusters: [
          {
            name: 'production',
            title: 'Production Cluster',
            dashboardUrl: 'https://dashboard.production.example.com',
            dashboardApp: 'standard',
          },
          { name: 'staging' },
        ],
      },
    });
  });

  it('omits optional fields when they are not set on a cluster', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const clusterSupplier = createMockClusterSupplier([
      {
        name: 'my-cluster',
        url: 'https://k8s.example.com',
        authMetadata: {},
      },
    ]);

    createGetKubernetesClustersAction({
      clusterSupplier,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-clusters',
      input: {},
    });
    const output = result.output as {
      clusters: Array<Record<string, unknown>>;
    };

    expect(output.clusters[0]).toEqual({ name: 'my-cluster' });
    expect(output.clusters[0]).not.toHaveProperty('title');
    expect(output.clusters[0]).not.toHaveProperty('dashboardUrl');
    expect(output.clusters[0]).not.toHaveProperty('dashboardApp');
  });
});
