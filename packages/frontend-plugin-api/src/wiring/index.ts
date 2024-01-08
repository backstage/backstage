/*
 * Copyright 2023 The Backstage Authors
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

export { coreExtensionData } from './coreExtensionData';
export {
  createExtension,
  type ExtensionDefinition,
  type CreateExtensionOptions,
  type ExtensionDataValues,
  type ResolvedExtensionInput,
  type ResolvedExtensionInputs,
  type AnyExtensionInputMap,
  type AnyExtensionDataMap,
} from './createExtension';
export {
  createExtensionInput,
  type ExtensionInput,
} from './createExtensionInput';
export {
  createExtensionDataRef,
  type ExtensionDataRef,
  type ConfigurableExtensionDataRef,
} from './createExtensionDataRef';
export { createPlugin, type PluginOptions } from './createPlugin';
export {
  createExtensionOverrides,
  type ExtensionOverridesOptions,
} from './createExtensionOverrides';
export { type Extension } from './resolveExtensionDefinition';
export {
  type AnyRoutes,
  type AnyExternalRoutes,
  type BackstagePlugin,
  type ExtensionOverrides,
  type FeatureFlagConfig,
  type FrontendFeature,
} from './types';
