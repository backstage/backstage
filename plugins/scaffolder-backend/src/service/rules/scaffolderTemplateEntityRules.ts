/*
 * Copyright 2024 The Backstage Authors
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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { z } from 'zod';
import { RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY } from '@backstage/plugin-scaffolder-common/alpha';
import { get } from 'lodash';
import { JsonPrimitive } from '@backstage/types';

/**
 * @public
 */
export const createTemplateEntityPermissionRule = makeCreatePermissionRule<
  TemplateEntityV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY
>();

/**
 * @public
 */
export const hasAction = createTemplateEntityPermissionRule({
  name: 'HAS_ACTION',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
  description: `Match templates with that use one an action`,
  paramsSchema: z.object({
    actionId: z.string().describe('The ID of an action to match on'),
  }),
  apply: (resource, { actionId }) => {
    const actions = resource.spec.steps;
    return !!actions.find(action => action.action === actionId);
  },
  toQuery: () => ({}),
});

function buildHasActionProperty<Schema extends z.ZodType<JsonPrimitive>>({
  name,
  valueSchema,
  validateProperty = true,
}: {
  name: string;
  valueSchema: Schema;
  validateProperty?: boolean;
}) {
  return createTemplateEntityPermissionRule({
    name,
    description: `Allow actions with the specified property`,
    resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
    paramsSchema: z.object({
      actionId: z.string().describe('The ID of an action to match on'),
      key: z
        .string()
        .describe(`Property within the action parameters to match on`),
      value: valueSchema
        .optional()
        .describe(`Value of the given property to match on`),
    }) as unknown as z.ZodType<{
      actionId: string;
      key: string;
      value?: z.infer<Schema>;
    }>,
    apply: (resource, { actionId, key, value }) => {
      const matched = resource.spec.steps
        .filter(action => action.action === actionId)
        .find(action => {
          const foundValue = get(action.input, key);

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
        });

      return !!matched;
    },
    toQuery: () => ({}),
  });
}

/**
 * @public
 */
export const hasActionWithProperty = buildHasActionProperty({
  name: 'HAS_ACTION_WITH_PROPERTY',
  valueSchema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  validateProperty: false,
});

/**
 * @public
 */
export const hasActionWithBooleanProperty = buildHasActionProperty({
  name: 'HAS_ACTION_WITH_BOOLEAN_PROPERTY',
  valueSchema: z.boolean(),
});

/**
 * @public
 */
export const hasActionWithNumberProperty = buildHasActionProperty({
  name: 'HAS_ACTION_WITH_NUMBER_PROPERTY',
  valueSchema: z.number(),
});

/**
 * @public
 */
export const hasActionWithStringProperty = buildHasActionProperty({
  name: 'HAS_ACTION_WITH_STRING_PROPERTY',
  valueSchema: z.string(),
});

export const scaffolderTemplateEntityRules = {
  hasAction,
  hasActionWithProperty,
  hasActionWithBooleanProperty,
  hasActionWithNumberProperty,
  hasActionWithStringProperty,
};
