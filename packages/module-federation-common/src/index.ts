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

/**
 * Helper library for module federation, enabling a consistent management of shared dependencies
 * in both the module federation host (frontend application) at runtime,
 * and remote modules at build time through the CLI.
 *
 * @packageDocumentation
 */

export { loadModuleFederationHostShared } from './loadModuleFederationHostShared';
export {
  defaultHostSharedDependencies,
  defaultRemoteSharedDependencies,
} from './defaults';
export {
  BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL,
  type HostSharedDependencies,
  type RemoteSharedDependencies,
  type LoadedRuntimeSharedDependency,
  type RuntimeSharedDependenciesGlobal,
} from './types';
