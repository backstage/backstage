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

import { Logger } from 'winston';
import { KubernetesClustersSupplier } from '@backstage/plugin-kubernetes-node';
import express from 'express';
import { KubernetesBuilder } from './KubernetesBuilder';
import { CatalogApi } from '@backstage/catalog-client';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import {
  DiscoveryService,
  HttpAuthService,
  RootConfigService,
  AuthService,
} from '@backstage/backend-plugin-api';

interface RouterOptions {
  logger: Logger;
  config: RootConfigService;
  catalogApi: CatalogApi;
  clusterSupplier?: KubernetesClustersSupplier;
  discovery: DiscoveryService;
  permissions: PermissionEvaluator;
  auth: AuthService;
  httpAuth: HttpAuthService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { router } = await KubernetesBuilder.createBuilder(options)
    .setClusterSupplier(options.clusterSupplier)
    .build();
  return router;
}
