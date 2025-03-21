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

import { catalogEntityPermissionResourceRef } from '@backstage/plugin-catalog-node/alpha';
import { createPermissionRule } from '@backstage/plugin-permission-node';
import { get } from 'lodash';
import { z } from 'zod';

export const createPropertyRule = (propertyType: 'metadata' | 'spec') =>
  createPermissionRule({
    name: `HAS_${propertyType.toUpperCase()}`,
    description: `Allow entities with the specified ${propertyType} subfield`,
    resourceRef: catalogEntityPermissionResourceRef,
    paramsSchema: z.object({
      key: z
        .string()
        .describe(`Property within the entities ${propertyType} to match on`),
      value: z
        .string()
        .optional()
        .describe(`Value of the given property to match on`),
    }),
    apply: (resource, { key, value }) => {
      const foundValue = get(resource[propertyType], key);

      if (Array.isArray(foundValue)) {
        if (value !== undefined) {
          return foundValue.includes(value);
        }
        return foundValue.length > 0;
      }
      if (value !== undefined) {
        return value === foundValue;
      }
      return !!foundValue;
    },
    toQuery: ({ key, value }) => ({
      key: `${propertyType}.${key}`,
      ...(value !== undefined && { values: [value] }),
    }),
  });
