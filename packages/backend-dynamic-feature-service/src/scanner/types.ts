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

import { JsonValue } from '@backstage/types';

// These types match the ones with the same names in @backstage/cli-node,
// which this package doesn't depend on, to keep the package manager
// libraries that it uses out of backend installs.

/**
 * Backstage package role, see {@link https://backstage.io/docs/tooling/cli/build-system#package-roles | docs}.
 *
 * @public
 */
export type PackageRole =
  | 'frontend'
  | 'backend'
  | 'cli'
  | 'cli-module'
  | 'web-library'
  | 'node-library'
  | 'common-library'
  | 'frontend-plugin'
  | 'frontend-plugin-module'
  | 'backend-plugin'
  | 'backend-plugin-module';

/**
 * A type of platform that a package can be built for.
 *
 * @public
 */
export type PackagePlatform = 'node' | 'web' | 'common';

/**
 * Known fields in Backstage package.json files.
 *
 * @public
 */
export interface BackstagePackageJson {
  name: string;
  version: string;
  private?: boolean;

  main?: string;
  module?: string;
  types?: string;

  scripts?: {
    [key: string]: string;
  };
  bundled?: boolean;

  type?: 'module' | 'commonjs';

  backstage?: {
    role?: PackageRole;
    moved?: string;
    inline?: boolean;
    pluginId?: string | null;
    pluginPackage?: string;
    pluginPackages?: string[];
    peerModules?: string[];
    features?: Record<
      string,
      | '@backstage/BackendFeature'
      | '@backstage/BackstagePlugin'
      | '@backstage/FrontendPlugin'
      | '@backstage/FrontendModule'
    >;
  };

  exports?: JsonValue;
  typesVersions?: Record<string, Record<string, string[]>>;

  files?: string[];

  publishConfig?: {
    access?: 'public' | 'restricted';
    directory?: string;
    registry?: string;
  };

  repository?:
    | string
    | {
        type: string;
        url: string;
        directory: string;
      };

  dependencies?: {
    [key: string]: string;
  };
  peerDependencies?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
  optionalDependencies?: {
    [key: string]: string;
  };
}

/**
 * @public
 */
export interface ScannedPluginPackage {
  location: URL;
  manifest: ScannedPluginManifest;
  alphaManifest?: BackstagePackageJson;
}

/**
 * @public
 */
export type ScannedPluginManifest = BackstagePackageJson &
  Required<Pick<BackstagePackageJson, 'main'>> &
  Required<Pick<BackstagePackageJson, 'backstage'>> & {
    backstage: {
      role: PackageRole;
    };
  };
