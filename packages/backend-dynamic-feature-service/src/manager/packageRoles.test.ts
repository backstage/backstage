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

import {
  PackageRoles,
  PackageRole as CliPackageRole,
} from '@backstage/cli-node';
import { PackageRole } from '../scanner';
import { getPackageRolePlatform } from './packageRoles';

describe('getPackageRolePlatform', () => {
  it('matches the package roles of @backstage/cli-node', () => {
    // Fails to compile when a role is added to cli-node but not here
    const roles: Record<CliPackageRole, PackageRole> = {
      frontend: 'frontend',
      backend: 'backend',
      cli: 'cli',
      'cli-module': 'cli-module',
      'web-library': 'web-library',
      'node-library': 'node-library',
      'common-library': 'common-library',
      'frontend-plugin': 'frontend-plugin',
      'frontend-plugin-module': 'frontend-plugin-module',
      'backend-plugin': 'backend-plugin',
      'backend-plugin-module': 'backend-plugin-module',
    };
    for (const role of [
      ...Object.values(roles),
      'frontend-dynamic-container',
    ]) {
      expect(getPackageRolePlatform(role)).toBe(
        PackageRoles.getRoleInfo(role).platform,
      );
    }
    expect(() => getPackageRolePlatform('unknown')).toThrow(
      "Unknown package role 'unknown'",
    );
  });
});
