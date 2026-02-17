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
import { get } from 'lodash';

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

export const hasProperty = buildHasProperty({
  name: 'HAS_PROPERTY',
  valueSchema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  validateProperty: false,
});

export const hasBooleanProperty = buildHasProperty({
  name: 'HAS_BOOLEAN_PROPERTY',
  valueSchema: z.boolean(),
});
export const hasNumberProperty = buildHasProperty({
  name: 'HAS_NUMBER_PROPERTY',
  valueSchema: z.number(),
});
export const hasStringProperty = buildHasProperty({
  name: 'HAS_STRING_PROPERTY',
  valueSchema: z.string(),
});

function buildHasProperty<Schema extends z.ZodType<JsonPrimitive>>({
  name,
  valueSchema,
  validateProperty = true,
}: {
  name: string;
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
      const foundValue = get(resource.input, key);

      if (validateProperty && !valueSchema.safeParse(foundValue).success) {
        return false;
      }
      if (value !== undefined) {
        if (valueSchema.safeParse(value).success) {
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
        'List of creater entity refs; only tasks created by these users will be viewable',
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
