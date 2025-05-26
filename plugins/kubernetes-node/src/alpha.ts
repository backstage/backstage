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
import { KUBERNETES_RESOURCES_RESOURCE_TYPE } from '@backstage/plugin-kubernetes-common';
import { createPermissionResourceRef } from '@backstage/plugin-permission-node';
import { Entity } from '@backstage/catalog-model';
import { EntitiesSearchFilter } from '@backstage/plugin-catalog-node';

/** @alpha */
export const kubernetesPermissionResourceRef = createPermissionResourceRef<
  Entity,
  EntitiesSearchFilter
>().with({
  pluginId: 'kubernetes',
  resourceType: KUBERNETES_RESOURCES_RESOURCE_TYPE,
});

export type { KubernetesPermissionExtensionPoint } from './extensions';
export { kubernetesPermissionExtensionPoint } from './extensions';
export type { KubernetesPermissionRuleInput } from './extensions';
