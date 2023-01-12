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

import { resolve as resolvePath } from 'path';
import parseArgs from 'minimist';
import { LoggerService } from '@backstage/backend-plugin-api';
import { findPaths } from '@backstage/cli-common';
import {
  loadConfigSchema,
  loadConfig,
  ConfigTarget,
  LoadConfigOptionsRemote,
} from '@backstage/config-loader';
import { Config, ConfigReader } from '@backstage/config';
import { getPackages } from '@manypkg/get-packages';
import { ObservableConfigProxy } from './ObservableConfigProxy';
import { isValidUrl } from '../lib/urls';

/** @public */
export async function createConfigSecretEnumerator(options: {
  logger: LoggerService;
  dir?: string;
}): Promise<(config: Config) => Iterable<string>> {
  const { logger, dir = process.cwd() } = options;
  const { packages } = await getPackages(dir);
  const schema = await loadConfigSchema({
    dependencies: packages.map(p => p.packageJson.name),
  });

  return (config: Config) => {
    const [secretsData] = schema.process(
      [{ data: config.getOptional() ?? {}, context: 'schema-enumerator' }],
      {
        visibility: ['secret'],
        ignoreSchemaErrors: true,
      },
    );
    const secrets = new Set<string>();
    JSON.parse(
      JSON.stringify(secretsData),
      (_, v) => typeof v === 'string' && secrets.add(v),
    );
    logger.info(
      `Found ${secrets.size} new secrets in config that will be redacted`,
    );
    return secrets;
  };
}

/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 */
export async function loadBackendConfig(options: {
  remote?: LoadConfigOptionsRemote;
  argv: string[];
}): Promise<{ config: Config }> {
  const args = parseArgs(options.argv);

  const configTargets: ConfigTarget[] = [args.config ?? []]
    .flat()
    .map(arg => (isValidUrl(arg) ? { url: arg } : { path: resolvePath(arg) }));

  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);

  let currentCancelFunc: (() => void) | undefined = undefined;

  const config = new ObservableConfigProxy();
  const { appConfigs } = await loadConfig({
    configRoot: paths.targetRoot,
    configTargets: configTargets,
    remote: options.remote,
    watch: {
      onChange(newConfigs) {
        console.info(
          `Reloaded config from ${newConfigs.map(c => c.context).join(', ')}`,
        );

        config.setConfig(ConfigReader.fromConfigs(newConfigs));
      },
      stopSignal: new Promise(resolve => {
        if (currentCancelFunc) {
          currentCancelFunc();
        }
        currentCancelFunc = resolve;

        // TODO(Rugvip): We keep this here for now to avoid breaking the old system
        //               since this is re-used in backend-common
        if (module.hot) {
          module.hot.addDisposeHandler(resolve);
        }
      }),
    },
  });

  console.info(
    `Loaded config from ${appConfigs.map(c => c.context).join(', ')}`,
  );

  config.setConfig(ConfigReader.fromConfigs(appConfigs));

  return { config };
}
