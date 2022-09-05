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

import {
  ConfigTarget,
  loadConfig,
  loadConfigSchema,
} from '@backstage/config-loader';
import { ConfigReader } from '@backstage/config';
import { paths } from './paths';
import { isValidUrl } from './urls';
import { getPackages } from '@manypkg/get-packages';
import { PackageGraph } from './monorepo';

type Options = {
  args: string[];
  fromPackage?: string;
  mockEnv?: boolean;
  withFilteredKeys?: boolean;
  withDeprecatedKeys?: boolean;
  fullVisibility?: boolean;
};

export async function loadCliConfig(options: Options) {
  const configTargets: ConfigTarget[] = [];
  options.args.forEach(arg => {
    if (!isValidUrl(arg)) {
      configTargets.push({ path: paths.resolveTarget(arg) });
    }
  });

  // Consider all packages in the monorepo when loading in config
  const { packages } = await getPackages(paths.targetDir);

  let localPackageNames;
  if (options.fromPackage) {
    if (packages.length) {
      const graph = PackageGraph.fromPackages(packages);
      localPackageNames = Array.from(
        graph.collectPackageNames([options.fromPackage], node => {
          // Workaround for Backstage main repo only, since the CLI has some artificial devDependencies
          if (node.name === '@backstage/cli') {
            return undefined;
          }
          return node.localDependencies.keys();
        }),
      );
    } else {
      // No packages: it means that it's not a monorepo (e.g. standalone plugin)
      localPackageNames = [options.fromPackage];
    }
  } else {
    localPackageNames = packages.map(p => p.packageJson.name);
  }

  const schema = await loadConfigSchema({
    dependencies: localPackageNames,
    // Include the package.json in the project root if it exists
    packagePaths: [paths.resolveTargetRoot('package.json')],
  });

  const { appConfigs } = await loadConfig({
    experimentalEnvFunc: options.mockEnv
      ? async name => process.env[name] || 'x'
      : undefined,
    configRoot: paths.targetRoot,
    configTargets: configTargets,
  });

  // printing to stderr to not clobber stdout in case the cli command
  // outputs structured data (e.g. as config:schema does)
  process.stderr.write(
    `Loaded config from ${appConfigs.map(c => c.context).join(', ')}\n`,
  );

  try {
    const frontendAppConfigs = schema.process(appConfigs, {
      visibility: options.fullVisibility
        ? ['frontend', 'backend', 'secret']
        : ['frontend'],
      withFilteredKeys: options.withFilteredKeys,
      withDeprecatedKeys: options.withDeprecatedKeys,
    });
    const frontendConfig = ConfigReader.fromConfigs(frontendAppConfigs);

    const fullConfig = ConfigReader.fromConfigs(appConfigs);

    return {
      schema,
      appConfigs,
      frontendConfig,
      frontendAppConfigs,
      fullConfig,
    };
  } catch (error) {
    const maybeSchemaError = error as Error & { messages?: string[] };
    if (maybeSchemaError.messages) {
      const messages = maybeSchemaError.messages.join('\n  ');
      throw new Error(`Configuration does not match schema\n\n  ${messages}`);
    }
    throw error;
  }
}
