/*
 * Copyright 2020 The Backstage Authors
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

import fs from 'fs-extra';
import semver from 'semver';
import { findPaths } from '@backstage/cli-common';

/* eslint-disable-next-line no-restricted-syntax */
const paths = findPaths(__dirname);
import { Lockfile } from './versioning';

/* eslint-disable @backstage/no-relative-monorepo-imports */
/*
This is a list of all packages used by the templates. If dependencies are added or removed,
this list should be updated as well.

The list, and the accompanying devDependencies entries, are here to ensure correct versioning
and bumping of this package. Without this list the version would not be bumped unless we
manually trigger a release.

This does not create an actual dependency on these packages and does not bring in any code.
Rollup will extract the value of the version field in each package at build time without
leaving any imports in place.
*/
import { version as backendPluginApi } from '../../../../packages/backend-plugin-api/package.json';
import { version as backendTestUtils } from '../../../../packages/backend-test-utils/package.json';
import { version as catalogClient } from '../../../../packages/catalog-client/package.json';
import { version as cli } from '../../../../packages/cli/package.json';
import { version as config } from '../../../../packages/config/package.json';
import { version as coreAppApi } from '../../../../packages/core-app-api/package.json';
import { version as coreComponents } from '../../../../packages/core-components/package.json';
import { version as corePluginApi } from '../../../../packages/core-plugin-api/package.json';
import { version as devUtils } from '../../../../packages/dev-utils/package.json';
import { version as errors } from '../../../../packages/errors/package.json';
import { version as frontendDefaults } from '../../../../packages/frontend-defaults/package.json';
import { version as frontendPluginApi } from '../../../../packages/frontend-plugin-api/package.json';
import { version as frontendTestUtils } from '../../../../packages/frontend-test-utils/package.json';
import { version as testUtils } from '../../../../packages/test-utils/package.json';
import { version as scaffolderNode } from '../../../../plugins/scaffolder-node/package.json';
import { version as scaffolderNodeTestUtils } from '../../../../plugins/scaffolder-node-test-utils/package.json';
import { version as authBackend } from '../../../../plugins/auth-backend/package.json';
import { version as authBackendModuleGuestProvider } from '../../../../plugins/auth-backend-module-guest-provider/package.json';
import { version as catalogNode } from '../../../../plugins/catalog-node/package.json';
import { version as theme } from '../../../../packages/theme/package.json';
import { version as types } from '../../../../packages/types/package.json';
import { version as backendDefaults } from '../../../../packages/backend-defaults/package.json';

export const packageVersions: Record<string, string> = {
  '@backstage/backend-defaults': backendDefaults,
  '@backstage/backend-plugin-api': backendPluginApi,
  '@backstage/backend-test-utils': backendTestUtils,
  '@backstage/catalog-client': catalogClient,
  '@backstage/cli': cli,
  '@backstage/config': config,
  '@backstage/core-app-api': coreAppApi,
  '@backstage/core-components': coreComponents,
  '@backstage/core-plugin-api': corePluginApi,
  '@backstage/dev-utils': devUtils,
  '@backstage/errors': errors,
  '@backstage/frontend-defaults': frontendDefaults,
  '@backstage/frontend-plugin-api': frontendPluginApi,
  '@backstage/frontend-test-utils': frontendTestUtils,
  '@backstage/test-utils': testUtils,
  '@backstage/theme': theme,
  '@backstage/types': types,
  '@backstage/plugin-scaffolder-node': scaffolderNode,
  '@backstage/plugin-scaffolder-node-test-utils': scaffolderNodeTestUtils,
  '@backstage/plugin-auth-backend': authBackend,
  '@backstage/plugin-auth-backend-module-guest-provider':
    authBackendModuleGuestProvider,
  '@backstage/plugin-catalog-node': catalogNode,
};

export function findVersion() {
  const pkgContent = fs.readFileSync(paths.resolveOwn('package.json'), 'utf8');
  return JSON.parse(pkgContent).version;
}

export const version = findVersion();
export const isDev = fs.pathExistsSync(paths.resolveOwn('src'));

export function createPackageVersionProvider(
  lockfile?: Lockfile,
  options?: {
    preferBackstageProtocol?: boolean;
  },
) {
  return (name: string, versionHint?: string): string => {
    const packageVersion = packageVersions[name];

    // 1) workspace precedence (existing logic) - check this first
    const lockfileEntries = lockfile?.get(name);
    const lockfileEntry = lockfileEntries?.find(entry =>
      entry.range.startsWith('workspace:'),
    );
    if (lockfileEntry) {
      return 'workspace:^';
    }

    // 2) backstage:^ when plugin is present and allowed
    if (options?.preferBackstageProtocol && name.startsWith('@backstage/')) {
      return 'backstage:^';
    }

    // 3) fallback to current npm resolution
    const targetVersion = versionHint || packageVersion;
    if (!targetVersion) {
      throw new Error(`No version available for package ${name}`);
    }

    const validRanges = lockfileEntries?.filter(entry =>
      semver.satisfies(targetVersion, entry.range),
    );
    const highestRange = validRanges?.slice(-1)[0];

    if (highestRange?.range) {
      return highestRange?.range;
    }
    if (packageVersion) {
      return `^${packageVersion}`;
    }
    if (semver.parse(versionHint)?.prerelease.length) {
      return versionHint!;
    }
    return versionHint?.match(/^[\d\.]+$/) ? `^${versionHint}` : versionHint!;
  };
}
