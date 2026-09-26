/*
 * Copyright 2026 The Backstage Authors
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
 * Permission to administer a plugin, using its plugin ID as the resource reference.
 *
 * @remarks
 * An unconditional allow grants universal administration. Use conditional
 * decisions to grant administration of specific plugins. Check with
 * `resourceRef: false` to require universal administration.
 * This permission does not bypass other permissions.
 *
 * @alpha
 */
export const adminPermission = createPermission({
  name: 'permission.admin',
  attributes: {},
  resourceType: 'permission-plugin',
});
