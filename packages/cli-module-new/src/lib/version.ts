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

import semver from 'semver';
import { Lockfile } from '@backstage/cli-node';

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
type Pkg = { version: string };
const v = (path: string) => (require(path) as Pkg).version;
const backendPluginApi = v('../../../backend-plugin-api/package.json');
const backendTestUtils = v('../../../backend-test-utils/package.json');
const catalogClient = v('../../../catalog-client/package.json');
const cli = v('../../../cli/package.json');
const config = v('../../../config/package.json');
const coreAppApi = v('../../../core-app-api/package.json');
const coreComponents = v('../../../core-components/package.json');
const corePluginApi = v('../../../core-plugin-api/package.json');
const devUtils = v('../../../dev-utils/package.json');
const errors = v('../../../errors/package.json');
const frontendDefaults = v('../../../frontend-defaults/package.json');
const frontendPluginApi = v('../../../frontend-plugin-api/package.json');
const frontendTestUtils = v('../../../frontend-test-utils/package.json');
const testUtils = v('../../../test-utils/package.json');
const scaffolderNode = v('../../../../plugins/scaffolder-node/package.json');
const scaffolderNodeTestUtils = v('../../../../plugins/scaffolder-node-test-utils/package.json');
const authBackend = v('../../../../plugins/auth-backend/package.json');
const authBackendModuleGuestProvider = v('../../../../plugins/auth-backend-module-guest-provider/package.json');
const catalogNode = v('../../../../plugins/catalog-node/package.json');
const theme = v('../../../theme/package.json');
const types = v('../../../types/package.json');
const backendDefaults = v('../../../backend-defaults/package.json');

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
