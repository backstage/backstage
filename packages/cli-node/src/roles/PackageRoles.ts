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

import { z } from 'zod';
import { PackageRole, PackageRoleInfo } from './types';

const packageRoleInfos: PackageRoleInfo[] = [
  {
    role: 'frontend',
    platform: 'web',
    output: ['bundle'],
  },
  {
    role: 'backend',
    platform: 'node',
    output: ['bundle'],
  },
  {
    role: 'cli',
    platform: 'node',
    output: ['cjs'],
  },
  {
    role: 'web-library',
    platform: 'web',
    output: ['types', 'esm'],
  },
  {
    role: 'node-library',
    platform: 'node',
    output: ['types', 'cjs'],
  },
  {
    role: 'common-library',
    platform: 'common',
    output: ['types', 'esm', 'cjs'],
  },
  {
    role: 'frontend-plugin',
    platform: 'web',
    output: ['types', 'esm'],
  },
  {
    role: 'frontend-plugin-module',
    platform: 'web',
    output: ['types', 'esm'],
  },
  {
    role: 'backend-plugin',
    platform: 'node',
    output: ['types', 'cjs'],
  },
  {
    role: 'backend-plugin-module',
    platform: 'node',
    output: ['types', 'cjs'],
  },
];

const readSchema = z.object({
  name: z.string().optional(),
  backstage: z
    .object({
      role: z.string().optional(),
    })
    .optional(),
});

const detectionSchema = z.object({
  name: z.string().optional(),
  scripts: z
    .object({
      start: z.string().optional(),
      build: z.string().optional(),
    })
    .optional(),
  publishConfig: z
    .object({
      main: z.string().optional(),
      types: z.string().optional(),
      module: z.string().optional(),
    })
    .optional(),
  main: z.string().optional(),
  types: z.string().optional(),
  module: z.string().optional(),
});

/**
 * Utilities for working with Backstage package roles.
 *
 * @public
 */
export class PackageRoles {
  /**
   * Get the associated info for a package role.
   */
  static getRoleInfo(role: string): PackageRoleInfo {
    const roleInfo = packageRoleInfos.find(r => r.role === role);
    if (!roleInfo) {
      throw new Error(`Unknown package role '${role}'`);
    }
    return roleInfo;
  }

  /**
   * Given package JSON data, get the package role.
   */
  static getRoleFromPackage(pkgJson: unknown): PackageRole | undefined {
    const pkg = readSchema.parse(pkgJson);

    if (pkg.backstage) {
      const { role } = pkg.backstage;
      if (!role) {
        throw new Error(
          `Package ${pkg.name} must specify a role in the "backstage" field`,
        );
      }

      return this.getRoleInfo(role).role;
    }

    return undefined;
  }

  /**
   * Attempt to detect the role of a package from its package.json.
   */
  static detectRoleFromPackage(pkgJson: unknown): PackageRole | undefined {
    const pkg = detectionSchema.parse(pkgJson);

    if (pkg.scripts?.start?.includes('app:serve')) {
      return 'frontend';
    }
    if (pkg.scripts?.build?.includes('backend:bundle')) {
      return 'backend';
    }
    if (
      pkg.name?.includes('plugin-') &&
      pkg.name?.includes('-backend-module-')
    ) {
      return 'backend-plugin-module';
    }
    if (pkg.name?.includes('plugin-') && pkg.name?.includes('-module-')) {
      return 'frontend-plugin-module';
    }
    if (pkg.scripts?.start?.includes('plugin:serve')) {
      return 'frontend-plugin';
    }
    if (pkg.scripts?.start?.includes('backend:dev')) {
      return 'backend-plugin';
    }

    const mainEntry = pkg.publishConfig?.main || pkg.main;
    const moduleEntry = pkg.publishConfig?.module || pkg.module;
    const typesEntry = pkg.publishConfig?.types || pkg.types;
    if (typesEntry) {
      if (mainEntry && moduleEntry) {
        return 'common-library';
      }
      if (moduleEntry || mainEntry?.endsWith('.esm.js')) {
        return 'web-library';
      }
      if (mainEntry) {
        return 'node-library';
      }
    } else if (mainEntry) {
      return 'cli';
    }

    return undefined;
  }
}
