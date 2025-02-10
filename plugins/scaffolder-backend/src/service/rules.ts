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
  createPermissionResourceRef,
  createPermissionRule,
  makeCreatePermissionRule,
} from '@backstage/plugin-permission-node';
import {
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
} from '@backstage/plugin-scaffolder-common/alpha';

import {
  TemplateEntityStepV1beta3,
  TemplateParametersV1beta3,
} from '@backstage/plugin-scaffolder-common';

import { z } from 'zod';
import { JsonObject, JsonPrimitive } from '@backstage/types';
import { get } from 'lodash';

/**
 * @alpha
 */
export type ScaffolderTemplatePermissionResource =
  | TemplateEntityStepV1beta3
  | TemplateParametersV1beta3;

/**
 * @alpha
 */
export const scaffolderTemplatePermissionResourceRef =
  createPermissionResourceRef<ScaffolderTemplatePermissionResource, {}>().with({
    pluginId: 'scaffolder',
    resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  });

/**
 * @alpha
 * @deprecated Use `createPermissionRule` directly instead with the resourceRef option.
 */
export const createTemplatePermissionRule = makeCreatePermissionRule<
  ScaffolderTemplatePermissionResource,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE
>();

/**
 * @alpha
 */
export const hasTag = createPermissionRule({
  name: 'HAS_TAG',
  resourceRef: scaffolderTemplatePermissionResourceRef,
  description: `Match parameters or steps with the given tag`,
  paramsSchema: z.object({
    tag: z.string().describe('Name of the tag to match on'),
  }),
  apply: (resource, { tag }) => {
    return resource['backstage:permissions']?.tags?.includes(tag) ?? false;
  },
  toQuery: () => ({}),
});

/**
 * @alpha
 */
export type ScaffolderActionPermissionResource =
  | {
      action: string;
      input: JsonObject | undefined;
    }
  | ScaffolderTemplatePermissionResource;

/**
 * @alpha
 */
export const scaffolderActionPermissionResourceRef =
  createPermissionResourceRef<ScaffolderActionPermissionResource, {}>().with({
    pluginId: 'scaffolder',
    resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  });

/**
 * @alpha
 * @deprecated Use `createPermissionRule` directly instead with the resourceRef option.
 */
export const createActionPermissionRule = makeCreatePermissionRule<
  ScaffolderActionPermissionResource,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ACTION
>();

/**
 * @alpha
 */
export const hasActionId = createPermissionRule({
  name: 'HAS_ACTION_ID',
  resourceRef: scaffolderActionPermissionResourceRef,
  description: `Match actions with the given actionId`,
  paramsSchema: z.object({
    actionId: z.string().describe('Name of the actionId to match on'),
  }),
  apply: (resource, { actionId }) => {
    return resource.action === actionId;
  },
  toQuery: () => ({}),
});

/**
 * @alpha
 */
export const hasProperty = buildHasProperty({
  name: 'HAS_PROPERTY',
  valueSchema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  validateProperty: false,
});

/**
 * @alpha
 */
export const hasBooleanProperty = buildHasProperty({
  name: 'HAS_BOOLEAN_PROPERTY',
  valueSchema: z.boolean(),
});

/**
 * @alpha
 */
export const hasNumberProperty = buildHasProperty({
  name: 'HAS_NUMBER_PROPERTY',
  valueSchema: z.number(),
});

/**
 * @alpha
 */
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
  return createPermissionRule({
    name,
    description: `Allow actions with the specified property`,
    resourceRef: scaffolderActionPermissionResourceRef,
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

/**
 * @alpha
 */
export const scaffolderTemplateRules = { hasTag };

/**
 * @alpha
 */
export const scaffolderActionRules = {
  hasActionId,
  hasBooleanProperty,
  hasNumberProperty,
  hasStringProperty,
};
