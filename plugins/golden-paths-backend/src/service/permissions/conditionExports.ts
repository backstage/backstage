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
import { createConditionExports } from '@backstage/plugin-permission-node';
import {
  goldenPathsGoldenPathRules,
  goldenPathsTaskRules,
  goldenPathsTemplateRules,
} from './rules';
import {
  goldenPathPermissionResourceRef,
  taskPermissionResourceRef,
} from './permissionResources';

const goldenPathConditionExports = createConditionExports({
  resourceRef: goldenPathPermissionResourceRef,
  rules: goldenPathsGoldenPathRules,
});

const templatesConditionExports = createConditionExports({
  resourceRef: taskPermissionResourceRef,
  rules: goldenPathsTemplateRules,
});

const taskConditionExports = createConditionExports({
  resourceRef: taskPermissionResourceRef,
  rules: goldenPathsTaskRules,
});

/**
 * `createGoldenPathsGoldenPathConditionalDecision` can be used when authoring policies to
 * create conditional decisions. It requires a permission of type
 * `ResourcePermission<'goldenpaths-goldenpath'>` to be passed as the first parameter.
 * It's recommended that you use the provided `isResourcePermission` and
 * `isPermission` helper methods to narrow the type of the permission passed to
 * the handle method as shown below.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createGoldenPathsPolicyDecision } from '@backstage/plugin-golden-paths-backend';
 * import { RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH } from '@backstage/plugin-golden-paths-common';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *    ...
 *
 *    if (isResourcePermission(request.permission, RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH)) {
 *      return createGoldenPathsConditionalDecision(
 *        request.permission,
 *        { anyOf: [...insert conditions here...] }
 *      );
 *    }
 *
 *    ...
 * }
 *
 * ```
 *
 * @alpha
 */
export const createGoldenPathsGoldenPathConditionalDecision =
  goldenPathConditionExports.createConditionalDecision;

/**
 * These conditions are used when creating conditional decisions for golden paths
 * that are returned by authorization policies.
 *
 * @alpha
 */
export const goldenPathsGoldenPathConditions =
  goldenPathConditionExports.conditions;

/**
 * @alpha
 */
export const createGoldenPathsTemplateConditionalDecision =
  templatesConditionExports.createConditionalDecision;

/**
 *
 * These conditions are used when creating conditional decisions for golden paths
 * templates that are returned by authorization policies.
 *
 * @alpha
 */
export const goldenPathsTemplateConditions =
  templatesConditionExports.conditions;

export const createGoldenPathsTaskConditionalDecision =
  taskConditionExports.createConditionalDecision;

/**
 * These conditions are used when creating conditional decisions for golden paths
 * tasks that are returned by authorization policies.
 *
 * @alpha
 */
export const goldenPathsTaskConditions = taskConditionExports.conditions;
