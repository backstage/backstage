/*
 * Copyright 2024 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  KubernetesServiceLocator,
  ServiceLocatorRequestContext,
} from '@backstage/plugin-kubernetes-node';

// This locator assumes that service is located on the clusters it depends on
// Therefore it will return the clusters based on the relations it has or none otherwise
export class CatalogRelationServiceLocator implements KubernetesServiceLocator {
  private readonly clusterSupplier: KubernetesClustersSupplier;

  constructor(clusterSupplier: KubernetesClustersSupplier) {
    this.clusterSupplier = clusterSupplier;
  }

  // As this implementation always returns all clusters serviceId is ignored here
  getClustersByEntity(
    entity: Entity,
    requestContext: ServiceLocatorRequestContext,
  ): Promise<{ clusters: ClusterDetails[] }> {
    if (
      entity.relations &&
      entity.relations.some(
        r => r.type === 'dependsOn' && r.targetRef.includes('resource:'),
      )
    ) {
      return this.clusterSupplier
        .getClusters({ credentials: requestContext.credentials })
        .then(clusters => {
          return {
            clusters: clusters.filter(c =>
              this.doesEntityDependOnCluster(entity, c),
            ),
          };
        });
    }
    return Promise.resolve({ clusters: [] });
  }

  protected doesEntityDependOnCluster(
    entity: Entity,
    cluster: ClusterDetails,
  ): boolean {
    return entity.relations!.some(
      rel =>
        rel.type === 'dependsOn' &&
        rel.targetRef ===
          `resource:${entity.metadata.namespace ?? 'default'}/${cluster.name}`,
    );
  }
}
