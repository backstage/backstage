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
  ConfigSchema,
  ConfigTarget,
  LoadConfigOptionsRemote,
} from '@backstage/config-loader';
import { AppConfig, Config, ConfigReader } from '@backstage/config';
import { getPackages } from '@manypkg/get-packages';
import { ObservableConfigProxy } from './ObservableConfigProxy';
import { isValidUrl } from '../lib/urls';

import { setRootLoggerRedactionList } from './logging/rootLogger';

// Fetch the schema and get all the secrets to pass to the rootLogger for redaction
const updateRedactionList = (
  schema: ConfigSchema,
  configs: AppConfig[],
  logger: LoggerService,
) => {
  const secretAppConfigs = schema.process(configs, {
    visibility: ['secret'],
    ignoreSchemaErrors: true,
  });
  const secretConfig = ConfigReader.fromConfigs(secretAppConfigs);
  const values = new Set<string>();
  const data = secretConfig.get();

  JSON.parse(
    JSON.stringify(data),
    (_, v) => typeof v === 'string' && values.add(v),
  );

  logger.info(
    `${values.size} secret${
      values.size > 1 ? 's' : ''
    } found in the config which will be redacted`,
  );

  setRootLoggerRedactionList(Array.from(values));
};

// A global used to ensure that only a single file watcher is active at a time.
let currentCancelFunc: () => void;

/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 */
export async function loadBackendConfig(options: {
  logger: LoggerService;
  // process.argv or any other overrides
  remote?: LoadConfigOptionsRemote;
  argv: string[];
}): Promise<Config> {
  const args = parseArgs(options.argv);

  const configTargets: ConfigTarget[] = [args.config ?? []]
    .flat()
    .map(arg => (isValidUrl(arg) ? { url: arg } : { path: resolvePath(arg) }));

  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);

  // TODO(hhogg): This is fetching _all_ of the packages of the monorepo
  // in order to find the secrets for redactions, however we only care about
  // the backend ones, we need to find a way to exclude the frontend packages.
  const { packages } = await getPackages(paths.targetDir);
  const schema = await loadConfigSchema({
    dependencies: packages.map(p => p.packageJson.name),
  });

  const config = new ObservableConfigProxy(options.logger);
  const { appConfigs } = await loadConfig({
    configRoot: paths.targetRoot,
    configTargets: configTargets,
    remote: options.remote,
    watch: {
      onChange(newConfigs) {
        options.logger.info(
          `Reloaded config from ${newConfigs.map(c => c.context).join(', ')}`,
        );

        config.setConfig(ConfigReader.fromConfigs(newConfigs));
      },
      stopSignal: new Promise(resolve => {
        if (currentCancelFunc) {
          currentCancelFunc();
        }
        currentCancelFunc = resolve;

        // For reloads of this module we need to use a dispose handler rather than the global.
        if (module.hot) {
          module.hot.addDisposeHandler(resolve);
        }
      }),
    },
  });

  options.logger.info(
    `Loaded config from ${appConfigs.map(c => c.context).join(', ')}`,
  );

  config.setConfig(ConfigReader.fromConfigs(appConfigs));

  // Subscribe to config changes and update the redaction list for logging
  updateRedactionList(schema, appConfigs, options.logger);
  config.subscribe(() =>
    updateRedactionList(schema, appConfigs, options.logger),
  );

  return config;
}
