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

import { LoggerService } from '@backstage/backend-plugin-api';
import { AppConfig, Config } from '@backstage/config';
import { setRootLoggerRedactionList } from '../logging/createRootLogger';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createConfigSecretEnumerator as _createConfigSecretEnumerator } from '../../../../backend-defaults/src/entrypoints/rootConfig/createConfigSecretEnumerator';

import { resolve as resolvePath } from 'path';
import parseArgs from 'minimist';
import { findPaths } from '@backstage/cli-common';
import {
  loadConfig,
  ConfigTarget,
  LoadConfigOptionsRemote,
} from '@backstage/config-loader';
import { ConfigReader } from '@backstage/config';
import { ObservableConfigProxy } from './ObservableConfigProxy';
import { isValidUrl } from './urls';

/**
 * @public
 * @deprecated Please migrate to the new backend system and use `coreServices.rootConfig` instead, or the {@link @backstage/config-loader#ConfigSources} facilities if required.
 */
export const createConfigSecretEnumerator = _createConfigSecretEnumerator;

/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 * @deprecated Please migrate to the new backend system and use `coreServices.rootConfig` instead, or the {@link @backstage/config-loader#ConfigSources} facilities if required.
 */
export async function loadBackendConfig(options: {
  logger: LoggerService;
  // process.argv or any other overrides
  remote?: LoadConfigOptionsRemote;
  additionalConfigs?: AppConfig[];
  argv: string[];
  watch?: boolean;
}): Promise<Config> {
  const secretEnumerator = await createConfigSecretEnumerator({
    logger: options.logger,
  });
  const { config } = await newLoadBackendConfig(options);

  setRootLoggerRedactionList(secretEnumerator(config));
  config.subscribe?.(() =>
    setRootLoggerRedactionList(secretEnumerator(config)),
  );

  return config;
}

async function newLoadBackendConfig(options: {
  remote?: LoadConfigOptionsRemote;
  argv: string[];
  additionalConfigs?: AppConfig[];
  watch?: boolean;
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
    watch:
      options.watch ?? true
        ? {
            onChange(newConfigs) {
              console.info(
                `Reloaded config from ${newConfigs
                  .map(c => c.context)
                  .join(', ')}`,
              );
              const configsToMerge = [...newConfigs];
              if (options.additionalConfigs) {
                configsToMerge.push(...options.additionalConfigs);
              }
              config.setConfig(ConfigReader.fromConfigs(configsToMerge));
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
          }
        : undefined,
  });
  console.info(
    `Loaded config from ${appConfigs.map(c => c.context).join(', ')}`,
  );

  const finalAppConfigs = [...appConfigs];
  if (options.additionalConfigs) {
    finalAppConfigs.push(...options.additionalConfigs);
  }
  config.setConfig(ConfigReader.fromConfigs(finalAppConfigs));

  return { config };
}
