/*
 * Copyright 2022 The Backstage Authors
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

import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import {
  makeCreatePermissionRule,
  PermissionRule,
} from '@backstage/plugin-permission-node';
import { PermissionRuleParams } from '@backstage/plugin-permission-common';
import { FetchResponse } from '@backstage/plugin-kubernetes-common';
import { ObjectToFetch } from '../../types/types';

/**
 * Convenience type for {@link @backstage/plugin-permission-node#PermissionRule}
 * instances with the correct resource type and resource to work with
 * the catalog.
 *
 * @alpha
 */

export type KubernetesPermissionRule<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  FetchResponse,
  ObjectToFetch,
  'kubernetes-resource',
  TParams
>;

/**
 * Helper function for creating correctly-typed
 * {@link @backstage/plugin-permission-node#PermissionRule}s for the
 * kubernetes-backend.
 *
 * @alpha
 */
export const createKubernetesPermissionRule = makeCreatePermissionRule<
  FetchResponse,
  ObjectToFetch,
  typeof RESOURCE_TYPE_KUBERNETES_RESOURCE
>();
