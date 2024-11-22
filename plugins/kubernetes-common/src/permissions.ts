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

/** This permission is used to check access to the proxy endpoint
 * @public
 */
export const kubernetesProxyPermission = createPermission({
  name: 'kubernetes.proxy',
  attributes: {},
});

/** This permission is used to check access to the /resources endpoints
 * @public
 */
export const kubernetesResourcePermission = createPermission({
  name: 'kubernetes.resource',
  attributes: {},
});

/** This permission is used to check access to the /services endpoint
 * @public
 */
export const kubernetesServicePermission = createPermission({
  name: 'kubernetes.service',
  attributes: {},
});

/** This permission is used to check access to the /clusters endpoint
 * @public
 */
export const kubernetesClusterPermission = createPermission({
  name: 'kubernetes.cluster',
  attributes: {},
});

/**
 * List of all Kubernetes permissions.
 * @public
 */
export const kubernetesPermissions = [
  kubernetesProxyPermission,
  kubernetesResourcePermission,
  kubernetesServicePermission,
  kubernetesClusterPermission,
];
