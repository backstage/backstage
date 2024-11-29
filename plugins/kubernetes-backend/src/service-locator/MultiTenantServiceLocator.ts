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

import { Entity } from '@backstage/catalog-model';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  KubernetesServiceLocator,
  ServiceLocatorRequestContext,
} from '../types/types';

// This locator assumes that every service is located on every cluster
// Therefore it will always return all clusters provided
export class MultiTenantServiceLocator implements KubernetesServiceLocator {
  private readonly clusterSupplier: KubernetesClustersSupplier;

  constructor(clusterSupplier: KubernetesClustersSupplier) {
    this.clusterSupplier = clusterSupplier;
  }

  // As this implementation always returns all clusters serviceId is ignored here
  getClustersByEntity(
    _entity: Entity,
    requestContext: ServiceLocatorRequestContext,
  ): Promise<{ clusters: ClusterDetails[] }> {
    return this.clusterSupplier
      .getClusters({ credentials: requestContext.credentials })
      .then(clusters => ({ clusters }));
  }
}
