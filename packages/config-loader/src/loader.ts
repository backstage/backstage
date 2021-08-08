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
import yaml from 'yaml';
import chokidar from 'chokidar';
import { resolve as resolvePath, dirname, isAbsolute, basename } from 'path';
import { AppConfig } from '@backstage/config';
import {
  applyConfigTransforms,
  readEnvConfig,
  createIncludeTransform,
  createSubstitutionTransform,
} from './lib';
import { EnvFunc } from './lib/transform/types';

export type LoadConfigOptions = {
  // The root directory of the config loading context. Used to find default configs.
  configRoot: string;

  // Absolute paths to load config files from. Configs from earlier paths have lower priority.
  configPaths: string[];

  /** @deprecated This option has been removed */
  env?: string;

  /**
   * Custom environment variable loading function
   *
   * @experimental This API is not stable and may change at any point
   */
  experimentalEnvFunc?: EnvFunc;

  /**
   * An optional configuration that enables watching of config files.
   */
  watch?: {
    /**
     * A listener that is called when a config file is changed.
     */
    onChange: (configs: AppConfig[]) => void;

    /**
     * An optional signal that stops the watcher once the promise resolves.
     */
    stopSignal?: Promise<void>;
  };
};

export async function loadConfig(
  options: LoadConfigOptions,
): Promise<AppConfig[]> {
  const { configRoot, experimentalEnvFunc: envFunc, watch } = options;
  const configPaths = options.configPaths.slice();

  // If no paths are provided, we default to reading
  // `app-config.yaml` and, if it exists, `app-config.local.yaml`
  if (configPaths.length === 0) {
    configPaths.push(resolvePath(configRoot, 'app-config.yaml'));

    const localConfig = resolvePath(configRoot, 'app-config.local.yaml');
    if (await fs.pathExists(localConfig)) {
      configPaths.push(localConfig);
    }
  }

  const env = envFunc ?? (async (name: string) => process.env[name]);

  const loadConfigFiles = async () => {
    const configs = [];

    for (const configPath of configPaths) {
      if (!isAbsolute(configPath)) {
        throw new Error(`Config load path is not absolute: '${configPath}'`);
      }

      const dir = dirname(configPath);
      const readFile = (path: string) =>
        fs.readFile(resolvePath(dir, path), 'utf8');

      const input = yaml.parse(await readFile(configPath));
      const substitutionTransform = createSubstitutionTransform(env);
      const data = await applyConfigTransforms(dir, input, [
        createIncludeTransform(env, readFile, substitutionTransform),
        substitutionTransform,
      ]);

      configs.push({ data, context: basename(configPath) });
    }

    return configs;
  };

  let fileConfigs;
  try {
    fileConfigs = await loadConfigFiles();
  } catch (error) {
    throw new Error(
      `Failed to read static configuration file, ${error.message}`,
    );
  }

  const envConfigs = await readEnvConfig(process.env);

  // Set up config file watching if requested by the caller
  if (watch) {
    let currentSerializedConfig = JSON.stringify(fileConfigs);

    const watcher = chokidar.watch(configPaths, {
      usePolling: process.env.NODE_ENV === 'test',
    });
    watcher.on('change', async () => {
      try {
        const newConfigs = await loadConfigFiles();
        const newSerializedConfig = JSON.stringify(newConfigs);

        if (currentSerializedConfig === newSerializedConfig) {
          return;
        }
        currentSerializedConfig = newSerializedConfig;

        watch.onChange([...newConfigs, ...envConfigs]);
      } catch (error) {
        console.error(`Failed to reload configuration files, ${error}`);
      }
    });

    if (watch.stopSignal) {
      watch.stopSignal.then(() => {
        watcher.close();
      });
    }
  }

  return [...fileConfigs, ...envConfigs];
}
