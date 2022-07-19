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

export type PackagePlatform = 'node' | 'web' | 'common';
export type PackageOutputType = 'bundle' | 'types' | 'esm' | 'cjs';

export interface PackageRoleInfo {
  role: PackageRole;
  platform: PackagePlatform;
  output: PackageOutputType[];
}
