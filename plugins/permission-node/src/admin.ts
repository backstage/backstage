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

import { z } from 'zod/v4';
import {
  createPermissionResourceRef,
  createPermissionRule,
  createConditionExports,
} from '@backstage/plugin-permission-node';

/**
 * Resource reference for plugin administration. Resources are plugin IDs,
 * resolved by the permission backend without requiring the plugin to be installed.
 *
 * @alpha
 */
export const adminPermissionResourceRef = createPermissionResourceRef<
  string,
  { pluginIds: string[] }
>().with({ pluginId: 'permission', resourceType: 'permission-plugin' });

/**
 * Rules for granting plugin administration.
 *
 * @alpha
 */
export const adminRules = {
  isPlugin: createPermissionRule({
    name: 'IS_PLUGIN',
    description: 'Matches an exact plugin ID',
    resourceRef: adminPermissionResourceRef,
    paramsSchema: z.object({
      pluginIds: z.array(z.string().min(1)).describe('Plugin IDs to allow'),
    }),
    apply: (pluginId, { pluginIds }) => pluginIds.includes(pluginId),
    toQuery: ({ pluginIds }) => ({ pluginIds }),
  }),
};

const conditionExports = createConditionExports({
  resourceRef: adminPermissionResourceRef,
  rules: adminRules,
});

/**
 * Condition factories for plugin administration policies.
 *
 * @alpha
 */
export const adminConditions = conditionExports.conditions;

/**
 * Creates a plugin administration decision evaluated by the permission backend.
 *
 * @alpha
 */
export const createAdminConditionalDecision =
  conditionExports.createConditionalDecision;
