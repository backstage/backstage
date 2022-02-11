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

import {
  createDependencyDefinition,
  createDependencyDefinitions,
} from '@backstage/app-context-common';
import { PermissionAuthorizer } from '@backstage/plugin-permission-common';

/**
 * Dependency definitions the Permission module exposes
 *
 * @public
 */
export const permissionModuleDefinitions = createDependencyDefinitions({
  id: '@backstage/permission-common',
  definitions: {
    permissionAuthorizer: createDependencyDefinition<PermissionAuthorizer>(
      Symbol.for('@backstage/permission-common.PermissionAuthorizer'),
    ),
  },
});
