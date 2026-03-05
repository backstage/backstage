/*
 * Copyright 2021 The Backstage Authors
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

import { catalogEntityPermissionResourceRef } from '@backstage/plugin-catalog-node/alpha';
import { createPermissionRule } from '@backstage/plugin-permission-node';
import { z } from 'zod';

/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with a specified kind.
 * @alpha
 */
export const isEntityKind = createPermissionRule({
  name: 'IS_ENTITY_KIND',
  description: 'Allow entities matching a specified kind',
  resourceRef: catalogEntityPermissionResourceRef,
  paramsSchema: z.object({
    kinds: z
      .array(z.string())
      .describe('List of kinds to match at least one of'),
  }),
  apply(resource, { kinds }) {
    const resourceKind = resource.kind.toLocaleLowerCase('en-US');
    return kinds.some(kind => kind.toLocaleLowerCase('en-US') === resourceKind);
  },
  toQuery({ kinds }) {
    return {
      key: 'kind',
      values: kinds.map(kind => kind.toLocaleLowerCase('en-US')),
    };
  },
});
