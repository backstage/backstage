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
 * This permission is used to authorize the TechDocs actions that are registered
 * with the Actions Registry.
 *
 * If this permission is not authorized, the actions are hidden from action
 * listings and appear as if they do not exist when invoked.
 *
 * @alpha
 */
export const techdocsActionsReadPermission = createPermission({
  name: 'techdocs.actions.read',
  attributes: {
    action: 'read',
  },
});

/**
 * The full list of permissions registered by the TechDocs plugin.
 *
 * @alpha
 */
export const techdocsPermissions = [techdocsActionsReadPermission];
