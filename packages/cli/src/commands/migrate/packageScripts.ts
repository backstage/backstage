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
import { resolve as resolvePath } from 'path';
import { PackageGraph, PackageRoles, PackageRole } from '@backstage/cli-node';

const configArgPattern = /--config[=\s][^\s$]+/;

const noStartRoles: PackageRole[] = ['cli', 'common-library'];

export async function command() {
  const packages = await PackageGraph.listTargetPackages();

  await Promise.all(
    packages.map(async ({ dir, packageJson }) => {
      const role = PackageRoles.getRoleFromPackage(packageJson);
      if (!role) {
        return;
      }

      const roleInfo = PackageRoles.getRoleInfo(role);
      const hasStart = !noStartRoles.includes(role);
      const needsPack = !(roleInfo.output.includes('bundle') || role === 'cli');
      const scripts = packageJson.scripts ?? {};

      const startCmd = ['start'];
      if (scripts.start?.includes('--check')) {
        startCmd.push('--check');
      }
      if (scripts.start?.includes('--config')) {
        startCmd.push(...(scripts.start.match(configArgPattern) ?? []));
      }

      const buildCmd = ['build'];
      if (scripts.build?.includes('--minify')) {
        buildCmd.push('--minify');
      }
      if (scripts.build?.includes('--config')) {
        buildCmd.push(...(scripts.build.match(configArgPattern) ?? []));
      }

      // For test scripts we keep all existing flags except for --passWithNoTests, since that's now default
      const testCmd = ['test'];
      if (scripts.test?.startsWith('backstage-cli test')) {
        const args = scripts.test
          .slice('backstage-cli test'.length)
          .split(' ')
          .filter(Boolean);
        if (args.includes('--passWithNoTests')) {
          args.splice(args.indexOf('--passWithNoTests'), 1);
        }
        testCmd.push(...args);
      }

      const expectedScripts = {
        ...(hasStart && {
          start: `backstage-cli package ${startCmd.join(' ')}`,
        }),
        build: `backstage-cli package ${buildCmd.join(' ')}`,
        lint: 'backstage-cli package lint',
        test: `backstage-cli package ${testCmd.join(' ')}`,
        clean: 'backstage-cli package clean',
        ...(needsPack && {
          postpack: 'backstage-cli package postpack',
          prepack: 'backstage-cli package prepack',
        }),
      };

      let changed = false;
      const currentScripts: Record<string, string | undefined> =
        (packageJson.scripts = packageJson.scripts || {});

      for (const [name, value] of Object.entries(expectedScripts)) {
        const currentScript = currentScripts[name];

        const isMissing = !currentScript;
        const isDifferent = currentScript !== value;
        const isBackstageScript = currentScript?.includes('backstage-cli');
        if (isMissing || (isDifferent && isBackstageScript)) {
          changed = true;
          currentScripts[name] = value;
        }
      }

      if (changed) {
        console.log(`Updating scripts for ${packageJson.name}`);
        await fs.writeJson(resolvePath(dir, 'package.json'), packageJson, {
          spaces: 2,
        });
      }
    }),
  );
}
