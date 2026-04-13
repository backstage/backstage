/*
 * Copyright 2025 The Backstage Authors
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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
export type {
  InternalBackendFeature,
  InternalBackendRegistrations,
  InternalBackendFeatureLoader,
  InternalBackendPluginRegistration,
  InternalBackendModuleRegistration,
  InternalBackendPluginRegistrationV1_1,
  InternalBackendModuleRegistrationV1_1,
  ExtensionPointRegistration,
} from '../../backend-plugin-api/src/wiring/types';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
export type { InternalServiceFactory } from '../../backend-plugin-api/src/services/system/types';
