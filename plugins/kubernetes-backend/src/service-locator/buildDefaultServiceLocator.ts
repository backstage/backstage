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
import { RootConfigService } from '@backstage/backend-plugin-api';
import { ServiceLocatorMethod } from '../types';
import { KubernetesClustersSupplier } from '@backstage/plugin-kubernetes-node';
import { MultiTenantServiceLocator } from './MultiTenantServiceLocator';
import { SingleTenantServiceLocator } from './SingleTenantServiceLocator';
import { CatalogRelationServiceLocator } from './CatalogRelationServiceLocator';

export const buildDefaultServiceLocator = ({
  config,
  clusterSupplier,
}: {
  config: RootConfigService;
  clusterSupplier: KubernetesClustersSupplier;
}) => {
  const method = config.getString(
    'kubernetes.serviceLocatorMethod.type',
  ) as ServiceLocatorMethod;

  switch (method) {
    case 'multiTenant':
      return new MultiTenantServiceLocator(clusterSupplier);
    case 'singleTenant':
      return new SingleTenantServiceLocator(clusterSupplier);
    case 'catalogRelation':
      return new CatalogRelationServiceLocator(clusterSupplier);
    case 'http':
      throw new Error('not implemented');
    default:
      throw new Error(
        `Unsupported kubernetes.serviceLocatorMethod "${method}"`,
      );
  }
};
