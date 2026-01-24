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

import { Config } from '@backstage/config';
import type { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import * as k8sTypes from '@backstage/plugin-kubernetes-node';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 *
 * @public
 */
export type ServiceLocatorMethod =
  | 'multiTenant'
  | 'singleTenant'
  | 'catalogRelation'
  | 'http'; // TODO implement http

/**
 *
 * @public
 */
export interface KubernetesObjectsProviderOptions {
  logger: LoggerService;
  config: Config;
  fetcher: k8sTypes.KubernetesFetcher;
  serviceLocator: k8sTypes.KubernetesServiceLocator;
  customResources: k8sTypes.CustomResource[];
  objectTypesToFetch?: k8sTypes.ObjectToFetch[];
}

/**
 *
 * @public
 */
export type ObjectsByEntityRequest = KubernetesRequestBody;
