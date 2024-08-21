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

import { type CreateBackendModuleOptions } from './createBackendModule';
import { type CreateBackendPluginOptions } from './createBackendPlugin';
import { type CreateExtensionPointOptions } from './createExtensionPoint';

export { createBackendModule } from './createBackendModule';
export { createBackendPlugin } from './createBackendPlugin';
export { createExtensionPoint } from './createExtensionPoint';
export {
  createBackendFeatureLoader,
  type CreateBackendFeatureLoaderOptions,
} from './createBackendFeatureLoader';

export type {
  BackendModuleRegistrationPoints,
  BackendPluginRegistrationPoints,
  ExtensionPoint,
} from './types';

export type {
  CreateBackendPluginOptions,
  CreateBackendModuleOptions,
  CreateExtensionPointOptions,
};
