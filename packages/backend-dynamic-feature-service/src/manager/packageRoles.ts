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

import { PackagePlatform } from '../scanner';

// The platform of each package role, as defined in @backstage/cli-node
const packageRolePlatforms = new Map<string, PackagePlatform>([
  ['frontend', 'web'],
  ['backend', 'node'],
  ['cli', 'node'],
  ['cli-module', 'node'],
  ['web-library', 'web'],
  ['node-library', 'node'],
  ['common-library', 'common'],
  ['frontend-plugin', 'web'],
  ['frontend-plugin-module', 'web'],
  ['frontend-dynamic-container', 'web'],
  ['backend-plugin', 'node'],
  ['backend-plugin-module', 'node'],
]);

export function getPackageRolePlatform(role: string): PackagePlatform {
  const platform = packageRolePlatforms.get(role);
  if (!platform) {
    throw new Error(`Unknown package role '${role}'`);
  }
  return platform;
}
