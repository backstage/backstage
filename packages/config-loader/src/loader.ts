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

import { AppConfig } from '@backstage/config';
import { ConfigSources } from './sources';

/**
 * @public
 * @deprecated Use {@link ConfigSources.default} instead.
 */
export type ConfigTarget = { path: string } | { url: string };

/**
 * @public
 * @deprecated Use {@link ConfigSources.default} instead.
 */
export type LoadConfigOptionsWatch = {
  /**
   * A listener that is called when a config file is changed.
   */
  onChange: (configs: AppConfig[]) => void;

  /**
   * An optional signal that stops the watcher once the promise resolves.
   */
  stopSignal?: Promise<void>;
};

/**
 * @public
 * @deprecated Use {@link ConfigSources.default} instead.
 */
export type LoadConfigOptionsRemote = {
  /**
   * A remote config reloading period, in seconds
   */
  reloadIntervalSeconds: number;
};

/**
 * Options that control the loading of configuration files in the backend.
 *
 * @public
 * @deprecated Use {@link ConfigSources.default} instead.
 */
export type LoadConfigOptions = {
  // The root directory of the config loading context. Used to find default configs.
  configRoot: string;

  // Paths to load config files from. Configs from earlier paths have lower priority.
  configTargets: ConfigTarget[];

  /**
   * Custom environment variable loading function
   *
   * @experimental This API is not stable and may change at any point
   */
  experimentalEnvFunc?: (name: string) => Promise<string | undefined>;

  /**
   * An optional remote config
   */
  remote?: LoadConfigOptionsRemote;

  /**
   * An optional configuration that enables watching of config files.
   */
  watch?: LoadConfigOptionsWatch;
};

/**
 * Results of loading configuration files.
 * @public
 * @deprecated Use {@link ConfigSources.default} instead.
 */
export type LoadConfigResult = {
  /**
   * Array of all loaded configs.
   */
  appConfigs: AppConfig[];
};

/**
 * Load configuration data.
 *
 * @public
 * @deprecated Use {@link ConfigSources.default} instead.
 */
export async function loadConfig(
  options: LoadConfigOptions,
): Promise<LoadConfigResult> {
  const source = ConfigSources.default({
    substitutionFunc: options.experimentalEnvFunc,
    remote: options.remote && {
      reloadInterval: { seconds: options.remote.reloadIntervalSeconds },
    },
    watch: Boolean(options.watch),
    rootDir: options.configRoot,
    argv: options.configTargets.flatMap(t => [
      '--config',
      'url' in t ? t.url : t.path,
    ]),
  });

  return new Promise<LoadConfigResult>((resolve, reject) => {
    async function loadConfigReaderLoop() {
      let loaded = false;

      try {
        const abortController = new AbortController();
        options.watch?.stopSignal?.then(() => abortController.abort());

        for await (const { configs } of source.readConfigData({
          signal: abortController.signal,
        })) {
          if (loaded) {
            options.watch?.onChange(configs);
          } else {
            resolve({ appConfigs: configs });
            loaded = true;

            if (options.watch) {
              options.watch.stopSignal?.then(() => abortController.abort());
            } else {
              abortController.abort();
            }
          }
        }
      } catch (error) {
        if (loaded) {
          console.error(`Failed to reload configuration, ${error}`);
        } else {
          reject(error);
        }
      }
    }
    loadConfigReaderLoop();
  });
}
