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
import { JsonArray, JsonObject, JsonPrimitive } from '@backstage/types';
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

/**
 * Returns the input property that identifies the target entity for actions
 * of integrations whose identifiers the permission rules accept as arrays,
 * mirroring the property that the task runner's identifier re-check covers.
 * Actions with a `group` segment identify their target by `path`, and other
 * actions of those integrations by `projectId`.
 */
export function getIntegrationIdentifierKey(
  action: string,
): 'path' | 'projectId' | undefined {
  const segments = action.split(':');
  if (segments.includes('group')) {
    return 'path';
  }
  return segments.some(segment =>
    INTEGRATION_ACTION_SEGMENT_PATTERN.test(segment),
  )
    ? 'projectId'
    : undefined;
}

/**
 * Returns the identifiers that an array-valued integration identifier input
 * denotes. Actions such as `gitlab:group:ensureExists` join the elements of
 * the array into a single nested path and ensure each parent group along the
 * way, so the input denotes each of those paths. Elements in the
 * `{ name, slug }` object form contribute their slug, which is how the
 * actions themselves interpret them.
 */
export function getIntegrationIdentifierValues(input: JsonArray): string[] {
  const segments: string[] = [];
  for (const element of input) {
    if (typeof element === 'string') {
      segments.push(...element.split('/'));
    } else if (typeof element === 'number') {
      segments.push(String(element));
    } else {
      const objectElement = z
        .object({ name: z.string(), slug: z.string() })
        .safeParse(element);
      if (objectElement.success) {
        // The actions pass the slug through to the integration as part of
        // the path, so slashes in it separate path segments there too.
        segments.push(...objectElement.data.slug.split('/'));
      }
    }
  }

  const identifiers: string[] = [];
  let prefix: string | undefined;
  for (const segment of segments) {
    // The actions drop leading empty segments when they join the path, and
    // the integration does not accept empty path segments elsewhere, so
    // empty segments do not denote identifiers of their own.
    if (!segment) {
      continue;
    }
    prefix = prefix === undefined ? segment : `${prefix}/${segment}`;
    identifiers.push(prefix);
  }
  return identifiers;
}

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
      const property = toPath(key).join('.');
      const actionSegments = resource.action.split(':');
      const integration = actionSegments.find(segment =>
        INTEGRATION_ACTION_SEGMENT_PATTERN.test(segment),
      );
      const isIntegrationProperty =
        integration !== undefined &&
        (INTEGRATION_IDENTIFIER_PROPERTIES.includes(property) ||
          (actionSegments.includes('group') && property === 'path'));

      const matchesValue = (inputValue: unknown): boolean => {
        // Some integration identifiers, such as GitLab project and group IDs,
        // are accepted as either numbers or the equivalent numeric strings,
        // and the integration treats the two forms as the same entity.
        // Normalize the input value to the rule's type for those properties
        // so that policies match regardless of which form the input uses.
        let foundValue = inputValue;
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
      };

      const inputValue = get(resource.input, key);

      // Some integration identifiers are accepted as an array of path segments
      // rather than a single value, such as the path of
      // gitlab:group:ensureExists, where the elements are joined into one
      // nested path and each parent group is ensured along the way. Match the
      // rule against each of the identifiers that such an input denotes,
      // since an input that denotes the identifier should reach the same
      // decision as the equivalent single identifier. This is limited to the
      // identifier properties that the task runner's identifier re-check
      // covers, where the policy is enforced for every one of those
      // identifiers; array values of other identifier properties keep their
      // existing behavior.
      if (
        isIntegrationProperty &&
        property === getIntegrationIdentifierKey(resource.action) &&
        Array.isArray(inputValue)
      ) {
        return getIntegrationIdentifierValues(inputValue).some(matchesValue);
      }

      return matchesValue(inputValue);
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
