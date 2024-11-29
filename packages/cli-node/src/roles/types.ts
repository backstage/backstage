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

/**
 * Backstage package role, see {@link https://backstage.io/docs/tooling/cli/build-system#package-roles | docs}.
 *
 * @public
 */
export type PackageRole =
  | 'frontend'
  | 'backend'
  | 'cli'
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
 * The type of output that a package can produce.
 *
 * @public
 */
export type PackageOutputType = 'bundle' | 'types' | 'esm' | 'cjs';

/**
 * Information about a package role.
 *
 * @public
 */
export interface PackageRoleInfo {
  role: PackageRole;
  platform: PackagePlatform;
  output: PackageOutputType[];
}
