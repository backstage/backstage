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
import fs from 'fs-extra';
import { Command } from 'commander';
import { paths } from '../paths';
import { PackageRole, PackageRoleInfo } from './types';

const packageRoleInfos: PackageRoleInfo[] = [
  { role: 'app', bundled: true, platform: 'web' },
  { role: 'backend', bundled: true, platform: 'node' },
  { role: 'cli', bundled: false, platform: 'node' },
  { role: 'web-library', bundled: false, platform: 'web' },
  { role: 'node-library', bundled: false, platform: 'node' },
  { role: 'common-library', bundled: false, platform: 'common' },
  { role: 'plugin-frontend', bundled: false, platform: 'web' },
  { role: 'plugin-frontend-module', bundled: false, platform: 'web' },
  { role: 'plugin-backend', bundled: false, platform: 'node' },
  { role: 'plugin-backend-module', bundled: false, platform: 'node' },
];

export function getRoleInfo(role: string): PackageRoleInfo {
  const roleInfo = packageRoleInfos.find(r => r.role === role);
  if (!roleInfo) {
    throw new Error(`Unknown package role '${role}'`);
  }
  return roleInfo;
}

const readSchema = z.object({
  name: z.string().optional(),
  backstage: z
    .object({
      role: z.string().optional(),
    })
    .optional(),
});

export function getRoleFromPackage(pkgJson: unknown): PackageRole | undefined {
  const pkg = readSchema.parse(pkgJson);

  // If there's an explicit role, use that.
  if (pkg.backstage) {
    const { role } = pkg.backstage;
    if (!role) {
      throw new Error(
        `Package ${pkg.name} must specify a role in the "backstage" field`,
      );
    }

    return getRoleInfo(role).role;
  }

  return undefined;
}

export async function findRoleFromCommand(cmd: Command): Promise<PackageRole> {
  if (cmd.role) {
    return getRoleInfo(cmd.role)?.role;
  }

  const pkg = await fs.readJson(paths.resolveTarget('package.json'));
  const info = getRoleFromPackage(pkg);
  if (!info) {
    throw new Error(`Target package must have 'backstage.role' set`);
  }
  return info;
}

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

export function detectRoleFromPackage(
  pkgJson: unknown,
): PackageRole | undefined {
  const pkg = detectionSchema.parse(pkgJson);

  if (pkg.scripts?.start?.includes('app:serve')) {
    return 'app';
  }
  if (pkg.scripts?.build?.includes('backend:bundle')) {
    return 'backend';
  }
  if (pkg.name?.includes('plugin-') && pkg.name?.includes('-backend-module-')) {
    return 'plugin-backend-module';
  }
  if (pkg.name?.includes('plugin-') && pkg.name?.includes('-module-')) {
    return 'plugin-frontend-module';
  }
  if (pkg.scripts?.start?.includes('plugin:serve')) {
    return 'plugin-frontend';
  }
  if (pkg.scripts?.start?.includes('backend:dev')) {
    return 'plugin-backend';
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
