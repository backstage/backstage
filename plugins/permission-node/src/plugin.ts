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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { PermissionPolicy } from '@backstage/plugin-permission-node';

/**
 * Allows supplying policies to the permissions backend
 *
 * @alpha
 */
export type PolicyExtensionPoint = {
  setPolicy(policy: PermissionPolicy): void;
};

/**
 * Allows supplying policies to the permissions backend
 *
 * @alpha
 */
export const policyExtensionPoint = createExtensionPoint<PolicyExtensionPoint>({
  id: 'permission.policy',
});
