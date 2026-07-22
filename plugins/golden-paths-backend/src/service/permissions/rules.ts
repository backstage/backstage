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
import { createPermissionRule } from '@backstage/plugin-permission-node';
import { z } from 'zod/v3';
import {
  goldenPathPermissionResourceRef,
  taskPermissionResourceRef,
} from './permissionResources';

export const hasTag = createPermissionRule({
  name: 'HAS_TAG',
  resourceRef: goldenPathPermissionResourceRef,
  description: `Match parameters or steps with the given tag`,
  paramsSchema: z.object({
    tag: z.string().describe('Name of the tag to match on'),
  }),
  apply: (resource, { tag }) =>
    resource['backstage:permissions']?.tags?.includes(tag) ?? false,

  toQuery: () => ({}),
});

export const isTaskOwner = createPermissionRule({
  name: 'IS_TASK_OWNER',
  description: 'Allows tasks created by certain users to be accessible',
  resourceRef: taskPermissionResourceRef,
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

export const goldenPathsGoldenPathRules = { hasTag };
export const goldenPathsTemplateRules = {};
export const goldenPathsTaskRules = { isTaskOwner };
