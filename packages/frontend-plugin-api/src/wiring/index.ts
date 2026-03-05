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
export { createExtension } from './createExtension';
export {
  type ExtensionDefinition,
  type ExtensionDefinitionAttachTo,
  type ExtensionDefinitionParameters,
  type CreateExtensionOptions,
  type OverridableExtensionDefinition,
  type ResolvedExtensionInput,
  type ResolvedExtensionInputs,
} from './createExtension';
export {
  createExtensionInput,
  type ExtensionInput,
} from './createExtensionInput';
export {
  createExtensionDataRef,
  type AnyExtensionDataRef,
  type ExtensionDataRef,
  type ExtensionDataRefToValue,
  type ExtensionDataValue,
  type ConfigurableExtensionDataRef,
} from './createExtensionDataRef';
export {
  createFrontendPlugin,
  type FrontendPlugin,
  type OverridableFrontendPlugin,
  type PluginOptions,
  type FrontendPluginInfo,
  type FrontendPluginInfoOptions,
} from './createFrontendPlugin';
export {
  createFrontendModule,
  type FrontendModule,
  type CreateFrontendModuleOptions,
} from './createFrontendModule';
export {
  createFrontendFeatureLoader,
  type FrontendFeatureLoader,
  type CreateFrontendFeatureLoaderOptions,
} from './createFrontendFeatureLoader';
export {
  type Extension,
  type ExtensionAttachTo,
  type ExtensionAttachToSpec,
} from './resolveExtensionDefinition';
export {
  type ExtensionDataContainer,
  type FeatureFlagConfig,
  type ExtensionFactoryMiddleware,
  type FrontendFeature,
} from './types';
export {
  type CreateExtensionBlueprintOptions,
  type ExtensionBlueprint,
  type ExtensionBlueprintParameters,
  type ExtensionBlueprintParams,
  type ExtensionBlueprintDefineParams,
  createExtensionBlueprint,
  createExtensionBlueprintParams,
} from './createExtensionBlueprint';
