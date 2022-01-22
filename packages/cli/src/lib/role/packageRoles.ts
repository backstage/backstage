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
import { PackageRoleInfo } from './types';

const packageRoles: PackageRoleInfo[] = [
  { role: 'app', platform: 'web' },
  { role: 'backend', platform: 'node' },
  { role: 'cli', platform: 'node' },
  { role: 'web-library', platform: 'web' },
  { role: 'node-library', platform: 'node' },
  { role: 'common-library', platform: 'common' },
  { role: 'plugin-frontend', platform: 'web' },
  { role: 'plugin-frontend-module', platform: 'web' },
  { role: 'plugin-backend', platform: 'node' },
  { role: 'plugin-backend-module', platform: 'node' },
];
const roleMap = Object.fromEntries(packageRoles.map(i => [i.role, i]));

export function getRoleInfo(role: string): PackageRoleInfo {
  const roleInfo = packageRoles.find(r => r.role === role);
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

export function readPackageRole(pkgJson: unknown): PackageRoleInfo | undefined {
  const pkg = readSchema.parse(pkgJson);

  // If there's an explicit role, use that.
  if (pkg.backstage) {
    const { role } = pkg.backstage;
    if (!role) {
      throw new Error(
        `Package ${pkg.name} must specify a role in the "backstage" field`,
      );
    }

    return getRoleInfo(role);
  }

  return undefined;
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

export function detectPackageRole(
  pkgJson: unknown,
): PackageRoleInfo | undefined {
  const pkg = detectionSchema.parse(pkgJson);

  if (pkg.scripts?.start?.includes('app:serve')) {
    return roleMap.app;
  }
  if (pkg.scripts?.build?.includes('backend:bundle')) {
    return roleMap.backend;
  }
  if (pkg.name?.includes('plugin-') && pkg.name?.includes('-backend-module-')) {
    return roleMap['plugin-backend-module'];
  }
  if (pkg.name?.includes('plugin-') && pkg.name?.includes('-module-')) {
    return roleMap['plugin-frontend-module'];
  }
  if (pkg.scripts?.start?.includes('plugin:serve')) {
    return roleMap['plugin-frontend'];
  }
  if (pkg.scripts?.start?.includes('backend:dev')) {
    return roleMap['plugin-backend'];
  }

  const mainEntry = pkg.publishConfig?.main || pkg.main;
  const moduleEntry = pkg.publishConfig?.module || pkg.module;
  const typesEntry = pkg.publishConfig?.types || pkg.types;
  if (typesEntry) {
    if (mainEntry && moduleEntry) {
      return roleMap['common-library'];
    }
    if (moduleEntry || mainEntry?.endsWith('.esm.js')) {
      return roleMap['web-library'];
    }
    if (mainEntry) {
      return roleMap['node-library'];
    }
  } else if (mainEntry) {
    return roleMap.cli;
  }

  return undefined;
}
