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

import { BackendFeature } from '@backstage/backend-plugin-api';
import { PackagePlatform, PackageRole } from '@backstage/cli-node';
import { ScannedPluginPackage } from '../scanner';

/**
 * @public
 */
export interface DynamicPluginProvider
  extends FrontendPluginProvider,
    BackendPluginProvider {
  plugins(options?: { includeFailed?: boolean }): DynamicPlugin[];
  getScannedPackage(plugin: DynamicPlugin): ScannedPluginPackage;
}

/**
 * @public
 */
export interface BackendPluginProvider {
  backendPlugins(options?: { includeFailed?: boolean }): BackendDynamicPlugin[];
}

/**
 * @public
 */
export interface FrontendPluginProvider {
  frontendPlugins(options?: {
    includeFailed?: boolean;
  }): FrontendDynamicPlugin[];
}

/**
 * @public
 */
export interface BaseDynamicPlugin {
  name: string;
  version: string;
  role: PackageRole;
  platform: PackagePlatform;
  failure?: string;
}

/**
 * @public
 */
export type DynamicPlugin = FrontendDynamicPlugin | BackendDynamicPlugin;

/**
 * @public
 */
export interface FrontendDynamicPlugin extends BaseDynamicPlugin {
  platform: 'web';
}

/**
 * @public
 */
export interface BackendDynamicPlugin extends BaseDynamicPlugin {
  platform: 'node';
  installer?: BackendDynamicPluginInstaller;
}

/**
 * @public
 */
export type BackendDynamicPluginInstaller = NewBackendPluginInstaller;

/**
 * @public
 */
export interface NewBackendPluginInstaller {
  kind: 'new';

  install(): BackendFeature | BackendFeature[];
}

/**
 * @public
 */
export function isBackendDynamicPluginInstaller(
  obj: any,
): obj is BackendDynamicPluginInstaller {
  return (
    obj !== undefined &&
    'kind' in obj &&
    (obj.kind === 'new' || obj.kind === 'legacy')
  );
}
