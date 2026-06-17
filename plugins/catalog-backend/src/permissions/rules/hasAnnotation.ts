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
import { z } from 'zod/v3';

/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for the presence of an annotation on a given entity.
 *
 * If a value is given, it filters for the annotation value, too.
 *
 * @alpha
 */
export const hasAnnotation = createPermissionRule({
  name: 'HAS_ANNOTATION',
  description: 'Allow entities with the specified annotation',
  resourceRef: catalogEntityPermissionResourceRef,
  paramsSchema: z.object({
    annotation: z.string().describe('Name of the annotation to match on'),
    value: z
      .string()
      .optional()
      .describe('Value of the annotation to match on'),
  }),
  apply: (resource, { annotation, value }) => {
    if (!resource.metadata.annotations) return false;

    // exact key match
    const isExactKeyMatch =
      !!resource.metadata.annotations?.hasOwnProperty(annotation) &&
      (value === undefined
        ? true
        : resource.metadata.annotations?.[annotation] === value);

    if (isExactKeyMatch) return true;

    // case-insensitive matching if exact match is not found
    const normalizedAnnotation = annotation.toLocaleLowerCase('en-US');
    const normalizedValue = value?.toLocaleLowerCase('en-US');

    for (const [key, val] of Object.entries(resource.metadata.annotations)) {
      if (key.toLocaleLowerCase('en-US') === normalizedAnnotation) {
        if (
          normalizedValue === undefined ||
          val.toLocaleLowerCase('en-US') === normalizedValue
        ) {
          return true;
        }
      }
    }
    return false;
  },
  toQuery: ({ annotation, value }) =>
    value === undefined
      ? {
          key: `metadata.annotations.${annotation}`,
        }
      : {
          key: `metadata.annotations.${annotation}`,
          values: [value],
        },
});
