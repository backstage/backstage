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

import { ApiHolder } from '../apis/system';

/**
 * A function that determines whether an extension should be enabled and attached to the extension tree.
 * This function is evaluated during extension tree construction.
 *
 * @public
 * @param originalDecision - A function that checks the `disabled` field. Returns false if disabled: true, otherwise true.
 * @param context - Context object containing the apiHolder for accessing Backstage APIs
 * @returns A promise that resolves to true if the extension should be enabled, false otherwise
 *
 * @remarks
 * Since this function is evaluated during extension tree construction, only APIs that are available
 * early in the app lifecycle can be safely used. Feature flags and config are typically available,
 * but permission APIs may not be fully initialized yet.
 *
 * @example
 * ```typescript
 * // Feature flag check
 * enabled: async (originalDecision, { apiHolder }) => {
 *   const featureFlags = apiHolder.get(featureFlagsApiRef);
 *   return featureFlags?.isActive('my-feature') === true;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Config check
 * enabled: async (originalDecision, { apiHolder }) => {
 *   const config = apiHolder.get(configApiRef);
 *   return config?.getOptionalBoolean('app.features.newCatalog') === true;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Respecting disabled field
 * enabled: async (originalDecision, { apiHolder }) => {
 *   // First check if disabled field blocks this extension
 *   if (!(await originalDecision())) return false;
 *
 *   // Then add additional check
 *   const featureFlags = apiHolder.get(featureFlagsApiRef);
 *   return featureFlags?.isActive('beta-feature') === true;
 * }
 * ```
 */
export type ExtensionConditionFunc = (
  originalDecision: () => Promise<boolean>,
  context: { apiHolder: ApiHolder },
) => Promise<boolean>;
