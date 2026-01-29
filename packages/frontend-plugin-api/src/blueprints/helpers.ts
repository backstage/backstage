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

import { featureFlagsApiRef } from '../apis/definitions/FeatureFlagsApi';
import { ExtensionConditionFunc } from './types';

/**
 * Creates a condition function that requires all provided conditions to be true.
 *
 * @public
 * @example
 * ```typescript
 * PageBlueprint.make({
 *   params: {
 *     enabled: allOf(
 *       createPermissionCondition(catalogReadPermission),
 *       createFeatureFlagCondition('advanced-ui')
 *     ),
 *   },
 * });
 * ```
 */
export function allOf(
  ...conditions: ExtensionConditionFunc[]
): ExtensionConditionFunc {
  return async (originalDecision, context) => {
    const results = await Promise.all(
      conditions.map(condition => condition(originalDecision, context)),
    );
    return results.every(result => !!result);
  };
}

/**
 * Creates a condition function that requires at least one of the provided conditions to be true.
 *
 * @public
 * @example
 * ```typescript
 * PageBlueprint.make({
 *   params: {
 *     enabled: anyOf(
 *       createPermissionCondition(catalogReadPermission),
 *       createFeatureFlagCondition('catalog-preview')
 *     ),
 *   },
 * });
 * ```
 */
export function anyOf(
  ...conditions: ExtensionConditionFunc[]
): ExtensionConditionFunc {
  return async (originalDecision, context) => {
    const results = await Promise.all(
      conditions.map(condition => condition(originalDecision, context)),
    );
    return results.some(result => !!result);
  };
}

/**
 * Creates a condition function that inverts the result of the provided condition.
 *
 * @public
 * @example
 * ```typescript
 * PageBlueprint.make({
 *   params: {
 *     enabled: not(createFeatureFlagCondition('legacy-ui')),
 *   },
 * });
 * ```
 */
export function not(condition: ExtensionConditionFunc): ExtensionConditionFunc {
  return async (originalDecision, context) => {
    const result = await condition(originalDecision, context);
    return !result;
  };
}

/**
 * Creates a condition function that checks if a feature flag is active.
 *
 * @public
 * @example
 * ```typescript
 * PageBlueprint.make({
 *   params: {
 *     enabled: createFeatureFlagCondition('experimental-features'),
 *   },
 * });
 * ```
 */
export function createFeatureFlagCondition(
  flagName: string,
): ExtensionConditionFunc {
  return async (_, { apiHolder }) => {
    const featureFlags = apiHolder.get(featureFlagsApiRef);
    return !!featureFlags?.isActive(flagName);
  };
}
