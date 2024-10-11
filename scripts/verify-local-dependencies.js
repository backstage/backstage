#!/usr/bin/env node
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

const fs = require('fs-extra');
const { getPackages } = require('@manypkg/get-packages');
const { resolve: resolvePath, join: joinPath } = require('path');

/**
 * This script checks that all local package dependencies within the repo
 * point to the correct version ranges.
 *
 * It can be run with a `--fix` flag to a automatically fix any issues.
 */

const depTypes = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const roleRules = [
  {
    sourceRole: ['frontend-plugin', 'web-library'],
    targetRole: ['backend-plugin', 'node-library', 'backend-plugin-module'],
    message: `Package SOURCE_NAME with frontend role SOURCE_ROLE has a dependency on package TARGET_NAME with backend role TARGET_ROLE, which is not permitted`,
  },
  {
    sourceRole: ['backend-plugin', 'node-library', 'backend-plugin-module'],
    targetRole: ['frontend-plugin', 'web-library'],
    message: `Package SOURCE_NAME with backend role SOURCE_ROLE has a dependency on package TARGET_NAME with frontend role TARGET_ROLE, which is not permitted`,
  },
  {
    sourceRole: ['common-library'],
    targetRole: [
      'frontend-plugin',
      'web-library',
      'backend-plugin',
      'node-library',
      'backend-plugin-module',
    ],
    message: `Polymorphic package SOURCE_NAME with role SOURCE_ROLE has a dependency on package TARGET_NAME with role TARGET_ROLE, which is not permitted since it's not also polymorphic`,
  },
  {
    sourceRole: ['frontend-plugin', 'web-library'],
    targetRole: 'frontend-plugin',
    except: [
      // TODO(freben): Address these
      '@backstage/frontend-defaults',
      '@backstage/frontend-app-api',
      '@backstage/frontend-test-utils',
      '@backstage/plugin-api-docs',
      '@backstage/plugin-techdocs-addons-test-utils',
    ],
    message: `Package SOURCE_NAME with role SOURCE_ROLE has a dependency on another plugin package TARGET_NAME with role TARGET_ROLE, which is not permitted`,
  },
  {
    sourceRole: ['frontend-plugin', 'web-library'],
    targetName: ['@backstage/core-app-api', '@backstage/frontend-app-api'],
    except: [
      // These are legitimate
      '@backstage/app-defaults',
      '@backstage/core-compat-api',
      '@backstage/dev-utils',
      '@backstage/frontend-defaults',
      '@backstage/frontend-app-api',
      '@backstage/frontend-test-utils',
      '@backstage/test-utils',
      // TODO(freben): Address these
      '@backstage/plugin-home',
      '@backstage/plugin-techdocs-addons-test-utils',
      '@backstage/plugin-user-settings',
    ],
    message: `Plugin package SOURCE_NAME with role SOURCE_ROLE has a runtime dependency on package TARGET_NAME with role TARGET_ROLE, which is not permitted. If you are using this dependency for dev server purposes, you can move it to devDependencies instead.`,
  },
  {
    sourceRole: ['backend-plugin', 'node-library'],
    targetName: ['@backstage/backend-app-api'],
    except: [
      // These are legitimate
      '@backstage/backend-common',
      '@backstage/backend-defaults',
      '@backstage/backend-test-utils',
      '@backstage/backend-dynamic-feature-service',
    ],
    message: `Plugin package SOURCE_NAME with role SOURCE_ROLE has a runtime dependency on package TARGET_NAME with role TARGET_ROLE, which is not permitted. If you are using this dependency for dev server purposes, you can move it to devDependencies instead.`,
  },
];

async function main(args) {
  const shouldFix = args.includes('--fix');
  const rootPath = resolvePath(__dirname, '..');
  const { packages } = await getPackages(rootPath);

  let hadVersionRangeErrors = false;
  let hadRoleErrors = false;

  const pkgMap = new Map(packages.map(pkg => [pkg.packageJson.name, pkg]));

  for (const pkg of packages) {
    let versionRangeErrorsFixed = false;

    /*
     * Ensure that all internal deps have "workspace:^" version ranges
     */
    for (const depType of depTypes) {
      const deps = pkg.packageJson[depType];

      for (const [dep, range] of Object.entries(deps || {})) {
        if (range === '' || range.startsWith('link:')) {
          continue;
        }
        const localPackage = pkgMap.get(dep);
        if (localPackage && range !== 'workspace:^') {
          hadVersionRangeErrors = true;
          console.log(
            `Local dependency from ${pkg.packageJson.name} to ${dep} should have a workspace range`,
          );

          versionRangeErrorsFixed = true;
          pkg.packageJson[depType][dep] = 'workspace:^';
        }
      }
    }

    /*
     * Ensure that there are no forbidden runtime dependency role combinations
     */
    const sourceRole = pkg.packageJson.backstage?.role;
    if (typeof sourceRole === 'string') {
      for (const [targetName] of Object.entries(
        pkg.packageJson.dependencies ?? {},
      )) {
        let targetPackageJson;
        try {
          const packageJsonPath = require.resolve(
            `${targetName}/package.json`,
            {
              paths: [pkg.dir],
            },
          );
          targetPackageJson = JSON.parse(await fs.readFile(packageJsonPath));
        } catch {
          // ignore
          continue;
        }

        const sourceName = pkg.packageJson.name;
        const targetRole = targetPackageJson.backstage?.role;
        if (typeof targetRole === 'string') {
          for (const rule of roleRules) {
            const matchesSourceRole = [rule.sourceRole ?? []]
              .flat()
              .includes(sourceRole);
            const matchesTargetRole = [rule.targetRole ?? []]
              .flat()
              .includes(targetRole);
            const matchesTargetName = [rule.targetName ?? []]
              .flat()
              .includes(targetName);
            const isExempt = [rule.except ?? []].flat().includes(sourceName);
            if (
              matchesSourceRole &&
              (matchesTargetName || matchesTargetRole) &&
              !isExempt
            ) {
              hadRoleErrors = true;
              console.error(
                rule.message
                  .replace('SOURCE_NAME', `'${sourceName}'`)
                  .replace('SOURCE_ROLE', `'${sourceRole}'`)
                  .replace('TARGET_NAME', `'${targetName}'`)
                  .replace('TARGET_ROLE', `'${targetRole}'`),
              );
            }
          }
        }
      }
    }

    /*
     * Fixup
     */
    if (shouldFix && versionRangeErrorsFixed) {
      await fs.writeJson(joinPath(pkg.dir, 'package.json'), pkg.packageJson, {
        spaces: 2,
      });
    }
  }

  if (!shouldFix && hadVersionRangeErrors) {
    console.error();
    console.error('At least one package has an invalid local dependency');
    console.error(
      'Run `node scripts/verify-local-dependencies.js --fix` to fix',
    );
    process.exit(2);
  }

  if (hadRoleErrors) {
    process.exit(3);
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
