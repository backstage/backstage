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

/** This permission is used to authorize actions that involve using the kubernetes Proxy Endpoint /proxy
 * @alpha
 */
export const kubernetesProxyReadPermission = createPermission({
  name: 'kubernetes.proxy.read',
  attributes: { action: 'read' },
});

export const kubernetesProxyCreatePermission = createPermission({
  name: 'kubernetes.proxy.create',
  attributes: { action: 'create' },
});

/**
 * List of all cluster permissions.
 * @alpha
 */
export const kubernetesClusterPermissions = [
  kubernetesProxyReadPermission,
  kubernetesProxyCreatePermission,
];
