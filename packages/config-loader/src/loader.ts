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
import { basename, dirname, isAbsolute, resolve as resolvePath } from 'path';
import { AppConfig } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import {
  applyConfigTransforms,
  createIncludeTransform,
  createSubstitutionTransform,
  isValidUrl,
  readEnvConfig,
} from './lib';
import fetch from 'node-fetch';

/** @public */
export type ConfigTarget = { path: string } | { url: string };

/** @public */
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

/** @public */
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
 */
export async function loadConfig(
  options: LoadConfigOptions,
): Promise<LoadConfigResult> {
  const { configRoot, experimentalEnvFunc: envFunc, watch, remote } = options;

  const configPaths: string[] = options.configTargets
    .slice()
    .filter((e): e is { path: string } => e.hasOwnProperty('path'))
    .map(configTarget => configTarget.path);

  const configUrls: string[] = options.configTargets
    .slice()
    .filter((e): e is { url: string } => e.hasOwnProperty('url'))
    .map(configTarget => configTarget.url);

  if (remote === undefined) {
    if (configUrls.length > 0) {
      throw new Error(
        `Please make sure you are passing the remote option when loading remote configurations. See https://backstage.io/docs/conf/writing#configuration-files for detailed info.`,
      );
    }
  } else if (remote.reloadIntervalSeconds <= 0) {
    throw new Error(
      `Remote config must be contain a non zero reloadIntervalSeconds: <seconds> value`,
    );
  }

  // If no paths are provided, we default to reading
  // `app-config.yaml` and, if it exists, `app-config.local.yaml`
  if (configPaths.length === 0 && configUrls.length === 0) {
    configPaths.push(resolvePath(configRoot, 'app-config.yaml'));

    const localConfig = resolvePath(configRoot, 'app-config.local.yaml');
    if (await fs.pathExists(localConfig)) {
      configPaths.push(localConfig);
    }
  }

  const env = envFunc ?? (async (name: string) => process.env[name]);

  const loadConfigFiles = async () => {
    const fileConfigs = [];
    const loadedPaths = new Set<string>();

    for (const configPath of configPaths) {
      if (!isAbsolute(configPath)) {
        throw new Error(`Config load path is not absolute: '${configPath}'`);
      }

      const dir = dirname(configPath);
      const readFile = (path: string) => {
        const fullPath = resolvePath(dir, path);
        // if we read a file when building configuration,
        // we should include that file when watching for
        // changes, too.
        loadedPaths.add(fullPath);

        return fs.readFile(fullPath, 'utf8');
      };

      const input = yaml.parse(await readFile(configPath));
      const substitutionTransform = createSubstitutionTransform(env);
      const data = await applyConfigTransforms(dir, input, [
        createIncludeTransform(env, readFile, substitutionTransform),
        substitutionTransform,
      ]);

      fileConfigs.push({ data, context: basename(configPath) });
    }

    return { fileConfigs, loadedPaths };
  };

  const loadRemoteConfigFiles = async () => {
    const configs: AppConfig[] = [];

    const readConfigFromUrl = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not read config file at ${url}`);
      }

      return await response.text();
    };

    for (let i = 0; i < configUrls.length; i++) {
      const configUrl = configUrls[i];
      if (!isValidUrl(configUrl)) {
        throw new Error(`Config load path is not valid: '${configUrl}'`);
      }

      const remoteConfigContent = await readConfigFromUrl(configUrl);
      if (!remoteConfigContent) {
        throw new Error(`Config is not valid`);
      }
      const configYaml = yaml.parse(remoteConfigContent);
      const substitutionTransform = createSubstitutionTransform(env);
      const data = await applyConfigTransforms(configRoot, configYaml, [
        substitutionTransform,
      ]);

      configs.push({ data, context: configUrl });
    }

    return configs;
  };

  let fileConfigs: AppConfig[];
  let loadedPaths: Set<string>;
  try {
    ({ fileConfigs, loadedPaths } = await loadConfigFiles());
  } catch (error) {
    throw new ForwardedError('Failed to read static configuration file', error);
  }

  let remoteConfigs: AppConfig[] = [];
  if (remote) {
    try {
      remoteConfigs = await loadRemoteConfigFiles();
    } catch (error) {
      throw new ForwardedError(
        `Failed to read remote configuration file`,
        error,
      );
    }
  }

  const envConfigs = readEnvConfig(process.env);

  const watchConfigFile = (watchProp: LoadConfigOptionsWatch) => {
    let watchedFiles = Array.from(loadedPaths);

    const watcher = chokidar.watch(watchedFiles, {
      usePolling: process.env.NODE_ENV === 'test',
    });

    let currentSerializedConfig = JSON.stringify(fileConfigs);
    watcher.on('change', async () => {
      try {
        const { fileConfigs: newConfigs, loadedPaths: newLoadedPaths } =
          await loadConfigFiles();

        // Replace watches to handle any added or removed
        // $include or $file expressions.
        watcher.unwatch(watchedFiles);
        watchedFiles = Array.from(newLoadedPaths);
        watcher.add(watchedFiles);

        const newSerializedConfig = JSON.stringify(newConfigs);

        if (currentSerializedConfig === newSerializedConfig) {
          return;
        }
        currentSerializedConfig = newSerializedConfig;

        watchProp.onChange([...remoteConfigs, ...newConfigs, ...envConfigs]);
      } catch (error) {
        console.error(`Failed to reload configuration files, ${error}`);
      }
    });

    if (watchProp.stopSignal) {
      watchProp.stopSignal.then(() => {
        watcher.close();
      });
    }
  };

  const watchRemoteConfig = (
    watchProp: LoadConfigOptionsWatch,
    remoteProp: LoadConfigOptionsRemote,
  ) => {
    const hasConfigChanged = async (
      oldRemoteConfigs: AppConfig[],
      newRemoteConfigs: AppConfig[],
    ) => {
      return (
        JSON.stringify(oldRemoteConfigs) !== JSON.stringify(newRemoteConfigs)
      );
    };

    let handle: NodeJS.Timeout | undefined;
    try {
      handle = setInterval(async () => {
        console.info(`Checking for config update`);
        const newRemoteConfigs = await loadRemoteConfigFiles();
        if (await hasConfigChanged(remoteConfigs, newRemoteConfigs)) {
          remoteConfigs = newRemoteConfigs;
          console.info(`Remote config change, reloading config ...`);
          watchProp.onChange([...remoteConfigs, ...fileConfigs, ...envConfigs]);
          console.info(`Remote config reloaded`);
        }
      }, remoteProp.reloadIntervalSeconds * 1000);
    } catch (error) {
      console.error(`Failed to reload configuration files, ${error}`);
    }

    if (watchProp.stopSignal) {
      watchProp.stopSignal.then(() => {
        if (handle !== undefined) {
          console.info(`Stopping remote config watch`);
          clearInterval(handle);
          handle = undefined;
        }
      });
    }
  };

  // Set up config file watching if requested by the caller
  if (watch) {
    watchConfigFile(watch);
  }

  if (watch && remote) {
    watchRemoteConfig(watch, remote);
  }

  return {
    appConfigs: remote
      ? [...remoteConfigs, ...fileConfigs, ...envConfigs]
      : [...fileConfigs, ...envConfigs],
  };
}
