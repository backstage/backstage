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

import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';

import {
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TASK,
} from '@backstage/plugin-scaffolder-common/alpha';

import {
  TemplateEntityStepV1beta3,
  TemplateParametersV1beta3,
} from '@backstage/plugin-scaffolder-common';

import { SerializedTask, TaskFilter } from '@backstage/plugin-scaffolder-node';

import { z } from 'zod/v3';
import { JsonObject, JsonPrimitive } from '@backstage/types';
import { get, toPath } from 'lodash';

/**
 * Matches action ID segments belonging to the source code hosting
 * integrations whose identifiers are accepted as either numbers or the
 * equivalent numeric strings.
 *
 * When adding a scaffolder backend module that registers actions for another
 * integration, decide whether its identifiers have this property and extend
 * this pattern and `INTEGRATION_IDENTIFIER_PROPERTIES` accordingly. Modules
 * that are not accounted for are caught by the classification test in
 * `rules.test.ts`.
 */
export const INTEGRATION_ACTION_SEGMENT_PATTERN =
  /^(?:gitlab|github|bitbucket(?:Cloud|Server)?)$/u;
const INTEGRATION_IDENTIFIER_PROPERTIES: readonly string[] = [
  'owner',
  'repoName',
  'projectId',
  'repoUrl',
];

export const createTemplatePermissionRule = makeCreatePermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE
>();

export const hasTag = createTemplatePermissionRule({
  name: 'HAS_TAG',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  description: `Match parameters or steps with the given tag`,
  paramsSchema: z.object({
    tag: z.string().describe('Name of the tag to match on'),
  }),
  apply: (resource, { tag }) => {
    return resource['backstage:permissions']?.tags?.includes(tag) ?? false;
  },
  toQuery: () => ({}),
});

export const createActionPermissionRule = makeCreatePermissionRule<
  {
    action: string;
    input: JsonObject | undefined;
  },
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ACTION
>();

export const hasActionId = createActionPermissionRule({
  name: 'HAS_ACTION_ID',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  description: `Match actions with the given actionId`,
  paramsSchema: z.object({
    actionId: z.string().describe('Name of the actionId to match on'),
  }),
  apply: (resource, { actionId }) => {
    return resource.action === actionId;
  },
  toQuery: () => ({}),
});

export const hasBooleanProperty = buildHasProperty({
  name: 'HAS_BOOLEAN_PROPERTY',
  valueKind: 'boolean',
  valueSchema: z.boolean(),
});
export const hasNumberProperty = buildHasProperty({
  name: 'HAS_NUMBER_PROPERTY',
  valueKind: 'number',
  valueSchema: z.number(),
});
export const hasStringProperty = buildHasProperty({
  name: 'HAS_STRING_PROPERTY',
  valueKind: 'string',
  valueSchema: z.string(),
});

function buildHasProperty<Schema extends z.ZodType<JsonPrimitive>>({
  name,
  valueKind,
  valueSchema,
  validateProperty = true,
}: {
  name: string;
  valueKind: 'boolean' | 'number' | 'string';
  valueSchema: Schema;
  validateProperty?: boolean;
}) {
  return createActionPermissionRule({
    name,
    description: `Allow actions with the specified property`,
    resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
    paramsSchema: z.object({
      key: z
        .string()
        .describe(`Property within the action parameters to match on`),
      value: valueSchema
        .optional()
        .describe(`Value of the given property to match on`),
    }) as unknown as z.ZodType<{ key: string; value?: z.infer<Schema> }>,
    apply: (resource, { key, value }) => {
      let foundValue = get(resource.input, key);
      const property = toPath(key).join('.');
      const actionSegments = resource.action.split(':');
      const integration = actionSegments.find(segment =>
        INTEGRATION_ACTION_SEGMENT_PATTERN.test(segment),
      );
      const isIntegrationProperty =
        integration !== undefined &&
        (INTEGRATION_IDENTIFIER_PROPERTIES.includes(property) ||
          (actionSegments.includes('group') && property === 'path'));

      // Some integration identifiers, such as GitLab project and group IDs,
      // are accepted as either numbers or the equivalent numeric strings, and
      // the integration treats the two forms as the same entity. Normalize
      // the input value to the rule's type for those properties so that
      // policies match regardless of which form the input uses.
      if (isIntegrationProperty) {
        if (
          valueKind === 'number' &&
          typeof foundValue === 'string' &&
          /^\d+$/u.test(foundValue)
        ) {
          foundValue = Number(foundValue);
        } else if (valueKind === 'string' && typeof foundValue === 'number') {
          foundValue = String(foundValue);
        }
      }

      if (validateProperty && !valueSchema.safeParse(foundValue).success) {
        return false;
      }
      if (value !== undefined) {
        if (valueSchema.safeParse(value).success) {
          if (typeof value === 'string' && typeof foundValue === 'string') {
            if (isIntegrationProperty) {
              if (/^\d+$/u.test(value) && /^\d+$/u.test(foundValue)) {
                // Digit-only identifiers may carry leading zeros; the
                // integration resolves them to the same entity as the
                // unpadded form.
                return Number(value) === Number(foundValue);
              }
              return value.toLowerCase() === foundValue.toLowerCase();
            }
          }
          return value === foundValue;
        }
        return false;
      }

      return foundValue !== undefined;
    },
    toQuery: () => ({}),
  });
}

export const createTaskPermissionRule = makeCreatePermissionRule<
  SerializedTask,
  TaskFilter,
  typeof RESOURCE_TYPE_SCAFFOLDER_TASK
>();

export const isTaskOwner = createTaskPermissionRule({
  name: 'IS_TASK_OWNER',
  description: 'Allows tasks created by certain users to be accessible',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TASK,
  paramsSchema: z.object({
    createdBy: z
      .array(z.string())
      .describe(
        'List of creator entity refs; only tasks created by these users will be viewable',
      ),
  }),
  apply: (resource, { createdBy }) => {
    if (!resource.createdBy) {
      return false;
    }
    return createdBy.includes(resource.createdBy);
  },
  toQuery: ({ createdBy }) => {
    return {
      key: 'created_by',
      values: createdBy,
    };
  },
});

export const scaffolderTemplateRules = { hasTag };
export const scaffolderActionRules = {
  hasActionId,
  hasBooleanProperty,
  hasNumberProperty,
  hasStringProperty,
};
export const scaffolderTaskRules = { isTaskOwner };
