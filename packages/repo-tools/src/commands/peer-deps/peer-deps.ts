/*
 * Copyright 2024 The Backstage Authors
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

import { resolve as resolvePath } from 'path';
import { getPackages, Package } from '@manypkg/get-packages';
import { writeFileSync } from 'fs';

type ExtendedPackageJSON = Package['packageJson'] & {
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  backstage?: {
    role: string;
  };
};

const desiredLocalVersionsOfDependencies = {
  '@types/react': '^18.0.0',
  react: '^18.0.2',
  'react-dom': '^18.0.2',
  'react-router-dom': '^6.3.0',
};

const peerDependencies = {
  '@types/react': '^17.0.0 || ^18.0.0',
  react: '^17.0.0 || ^18.0.0',
  'react-dom': '^17.0.0 || ^18.0.0',
  'react-router-dom': '^6.3.0',
};

const groupsOfPeerDependencies = [['@types/react', 'react', 'react-dom']];

const optionalPeerDependencies = new Set(['@types/react']);

const isOptional = (dep: string) => {
  return optionalPeerDependencies.has(dep);
};

const isMarkedAsOptional = (dep: string, packageJson: ExtendedPackageJSON) => {
  return packageJson.peerDependenciesMeta?.[dep]?.optional;
};

const isDevDependency = (dep: string, packageJson: ExtendedPackageJSON) => {
  return !!packageJson.devDependencies?.[dep];
};

const isProdDependency = (dep: string, packageJson: ExtendedPackageJSON) => {
  return !!packageJson.dependencies?.[dep];
};

const isPeerDependency = (dep: string, packageJson: ExtendedPackageJSON) => {
  return !!packageJson.peerDependencies?.[dep];
};

const isStandaloneApplication = (packageJson: ExtendedPackageJSON) => {
  return ['cli', 'frontend', 'backend'].includes(
    packageJson.backstage?.role || '',
  );
};

const matchesDependency = (dep: string, packageJson: ExtendedPackageJSON) => {
  return (
    packageJson.devDependencies &&
    packageJson.devDependencies[dep] ===
      desiredLocalVersionsOfDependencies[
        dep as keyof typeof desiredLocalVersionsOfDependencies
      ]
  );
};

const matchesPeerDependency = (
  dep: string,
  packageJson: ExtendedPackageJSON,
) => {
  return (
    packageJson.peerDependencies &&
    packageJson.peerDependencies[dep] ===
      peerDependencies[dep as keyof typeof peerDependencies]
  );
};

export default async ({ fix }: { fix: boolean }) => {
  let failed = false;
  const attemptToApplyFix = (fn: () => void) => {
    if (fix) {
      fn();
    } else {
      failed = true;
    }
  };
  const { packages } = await getPackages(resolvePath('.'));

  const packagesWithRelevantDependencies = [];

  for (const pkg of packages) {
    if (isStandaloneApplication(pkg.packageJson as ExtendedPackageJSON)) {
      // Standalone applications are not expected to have peer dependencies.
      continue;
    }

    const dependencies = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.devDependencies,
      ...pkg.packageJson.peerDependencies,
    };
    for (const dep in peerDependencies) {
      // Check against all packages that use dependencies that are in the peerDependencies list.
      if (dependencies?.[dep]) {
        packagesWithRelevantDependencies.push(pkg);
        break;
      }
    }
  }

  for (const pkg of packagesWithRelevantDependencies) {
    const packageJson = pkg.packageJson as ExtendedPackageJSON;
    for (const dep of Object.keys(peerDependencies)) {
      // Validate that the peer dependencies are present.
      if (isPeerDependency(dep, packageJson)) {
        if (isOptional(dep) && !isMarkedAsOptional(dep, packageJson)) {
          console.error(
            `Optional peer dependency ${dep} in ${pkg.packageJson.name} is not marked as optional`,
          );
          attemptToApplyFix(() => {
            packageJson.peerDependenciesMeta =
              packageJson.peerDependenciesMeta || {};
            packageJson.peerDependenciesMeta[dep] = { optional: true };
          });
        } else if (!isOptional(dep) && isMarkedAsOptional(dep, packageJson)) {
          console.error(
            `Peer dependency ${dep} in ${pkg.packageJson.name} is marked as optional but should not be`,
          );
          attemptToApplyFix(() => {
            packageJson.peerDependenciesMeta =
              packageJson.peerDependenciesMeta || {};
            delete packageJson.peerDependenciesMeta[dep];
          });
        }
        if (!isDevDependency(dep, packageJson)) {
          console.error(
            `Peer dependency ${dep} in ${pkg.packageJson.name} is not listed as a devDependency`,
          );
          attemptToApplyFix(() => {
            delete packageJson.dependencies?.[dep];
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.devDependencies[dep] =
              desiredLocalVersionsOfDependencies[
                dep as keyof typeof desiredLocalVersionsOfDependencies
              ];
          });
        } else if (isProdDependency(dep, packageJson)) {
          console.error(
            `Peer dependency ${dep} in ${pkg.packageJson.name} is listed as a dependency`,
          );
          attemptToApplyFix(() => {
            delete packageJson.dependencies?.[dep];
          });
        }

        const groups = groupsOfPeerDependencies.filter(group =>
          group.includes(dep),
        );
        if (groups.length) {
          for (const group of groups) {
            for (const groupDep of group) {
              if (!isPeerDependency(groupDep, packageJson)) {
                console.error(
                  `Peer dependency ${groupDep} in ${pkg.packageJson.name} is missing`,
                );
                attemptToApplyFix(() => {
                  packageJson.peerDependencies =
                    packageJson.peerDependencies || {};
                  packageJson.peerDependencies[groupDep] =
                    peerDependencies[groupDep as keyof typeof peerDependencies];
                });
              }
            }
          }
        }

        if (!matchesDependency(dep, packageJson)) {
          console.error(
            `Incorrect dependency ${dep} in ${pkg.packageJson.name}`,
          );
          attemptToApplyFix(() => {
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.devDependencies[dep] =
              desiredLocalVersionsOfDependencies[
                dep as keyof typeof desiredLocalVersionsOfDependencies
              ];
          });
        }

        if (!matchesPeerDependency(dep, packageJson)) {
          console.error(
            `Incorrect peer dependency ${dep} in ${pkg.packageJson.name}`,
          );
          attemptToApplyFix(() => {
            packageJson.peerDependencies = packageJson.peerDependencies || {};
            packageJson.peerDependencies[dep] =
              peerDependencies[dep as keyof typeof peerDependencies];
          });
        }
      } else {
        console.error(
          `Missing peer dependency ${dep} in ${pkg.packageJson.name}`,
        );
        attemptToApplyFix(() => {
          packageJson.peerDependencies = packageJson.peerDependencies || {};
          packageJson.peerDependencies[dep] =
            peerDependencies[dep as keyof typeof peerDependencies];
        });
      }
    }
    if (fix) {
      writeFileSync(
        resolvePath(pkg.dir, 'package.json'),
        `${JSON.stringify(packageJson, null, 2)}\n`,
      );
    }
  }

  if (failed) {
    console.error('Some packages have incorrect peer dependencies');
    process.exit(1);
  }
};
