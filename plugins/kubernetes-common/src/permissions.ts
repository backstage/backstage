/*
 * Copyright 2023 The Backstage Authors
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

import { createPermission } from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to cluster entities.
 * @alpha
 */
export const RESOURCE_TYPE_KUBERNETES_RESOURCE = 'kubernetes-resource';

/** This permission is used to check access to the proxy endpoint
 * @alpha
 */
export const kubernetesProxyPermission = createPermission({
  name: 'kubernetes.proxy',
  attributes: {},
});

/**
 * List of all Kubernetes permissions.
 * @alpha
 */
export const kubernetesPermissions = [kubernetesProxyPermission];
