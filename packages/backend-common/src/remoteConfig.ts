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

import parseArgs from 'minimist';
import {Logger} from 'winston';
import {findPaths} from '@backstage/cli-common';
import {Config, ConfigReader, JsonValue} from '@backstage/config';
import {loadConfig} from '@backstage/config-loader';

class RemoteObservableConfigProxy implements Config {
  private config: Config = new ConfigReader({});

  private readonly subscribers: (() => void)[] = [];

  constructor(private readonly logger: Logger) {
  }

  setConfig(config: Config) {
    this.config = config;
    for (const subscriber of this.subscribers) {
      try {
        subscriber();
      } catch (error) {
        this.logger.error(`Config subscriber threw error, ${error}`);
      }
    }
  }

  subscribe(onChange: () => void): { unsubscribe: () => void } {
    this.subscribers.push(onChange);
    return {
      unsubscribe: () => {
        const index = this.subscribers.indexOf(onChange);
        if (index >= 0) {
          this.subscribers.splice(index, 1);
        }
      },
    };
  }

  has(key: string): boolean {
    return this.config.has(key);
  }

  keys(): string[] {
    return this.config.keys();
  }

  get<T = JsonValue>(key?: string): T {
    return this.config.get(key);
  }

  getOptional<T = JsonValue>(key?: string): T | undefined {
    return this.config.getOptional(key);
  }

  getConfig(key: string): Config {
    return this.config.getConfig(key);
  }

  getOptionalConfig(key: string): Config | undefined {
    return this.config.getOptionalConfig(key);
  }

  getConfigArray(key: string): Config[] {
    return this.config.getConfigArray(key);
  }

  getOptionalConfigArray(key: string): Config[] | undefined {
    return this.config.getOptionalConfigArray(key);
  }

  getNumber(key: string): number {
    return this.config.getNumber(key);
  }

  getOptionalNumber(key: string): number | undefined {
    return this.config.getOptionalNumber(key);
  }

  getBoolean(key: string): boolean {
    return this.config.getBoolean(key);
  }

  getOptionalBoolean(key: string): boolean | undefined {
    return this.config.getOptionalBoolean(key);
  }

  getString(key: string): string {
    return this.config.getString(key);
  }

  getOptionalString(key: string): string | undefined {
    return this.config.getOptionalString(key);
  }

  getStringArray(key: string): string[] {
    return this.config.getStringArray(key);
  }

  getOptionalStringArray(key: string): string[] | undefined {
    return this.config.getOptionalStringArray(key);
  }
}

// A global used to ensure that only a single file watcher is active at a time.
let currentCancelFunc: () => void;

/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 */
export async function loadRemoteBackendConfig(options: {
  logger: Logger;
  // process.argv or any other overrides
  argv: string[];
}): Promise<Config> {
  const args = parseArgs(options.argv);
  const configPaths: string[] = [args.config ?? []].flat();
  const configUrls: string[] = [args.config ?? []].flat();

  const config = new RemoteObservableConfigProxy(options.logger);

  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);

  const configs = await loadConfig({
    configRoot: paths.targetRoot,
    configPaths: configPaths,
    configUrls: configUrls,
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
    `Loaded config from ${configs.map(c => c.context).join(', ')}`,
  );

  config.setConfig(ConfigReader.fromConfigs(configs));

  return config;
}
