/*
 * Copyright 2023 The Backstage Authors
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
import fs from 'fs-extra';
import { Config, ConfigReader } from '@backstage/config';
import parseArgs from 'minimist';
import { EnvConfigSource } from './EnvConfigSource';
import { FileConfigSource } from './FileConfigSource';
import { MergedConfigSource } from './MergedConfigSource';
import {
  RemoteConfigSource,
  RemoteConfigSourceOptions,
} from './RemoteConfigSource';
import { ConfigSource, SubstitutionFunc } from './types';
import { ObservableConfigProxy } from './ObservableConfigProxy';

export type ConfigSourceTarget =
  | {
      type: 'path';
      target: string;
    }
  | {
      type: 'url';
      target: string;
    };

export interface ClosableConfig extends Config {
  close(): void;
}

export interface BaseConfigSourcesOptions {
  rootDir: string;
  remote?: Pick<RemoteConfigSourceOptions, 'reloadIntervalSeconds'>;
  substitutionFunc?: SubstitutionFunc;
}

export interface ConfigSourcesDefaultForTargetsOptions
  extends BaseConfigSourcesOptions {
  targets: ConfigSourceTarget[];
}

export interface ConfigSourcesDefaultOptions extends BaseConfigSourcesOptions {
  argv?: string[];
  env?: Record<string, string>;
}

export class ConfigSources {
  static parseArgs(argv: string[] = process.argv): Array<ConfigSourceTarget> {
    const args: string[] = [parseArgs(argv).config].flat().filter(Boolean);
    return args.map(target => {
      try {
        // eslint-disable-next-line no-new
        new URL(target);
        return { type: 'url', target };
      } catch {
        return { type: 'path', target };
      }
    });
  }

  static defaultForTargets(
    options: ConfigSourcesDefaultForTargetsOptions,
  ): ConfigSource {
    const argSources = options.targets.map(arg => {
      if (arg.type === 'url') {
        if (!options.remote) {
          throw new Error(
            `Config argument '${arg.target}' looks like a URL but remote configuration is not enabled. Enable it by passing the \`remote\` option`,
          );
        }
        return RemoteConfigSource.create({
          url: arg.target,
          substitutionFunc: options.substitutionFunc,
          reloadIntervalSeconds: options.remote.reloadIntervalSeconds,
        });
      }
      return FileConfigSource.create({
        path: arg.target,
        substitutionFunc: options.substitutionFunc,
      });
    });

    if (argSources.length === 0) {
      const defaultPath = resolvePath(options.rootDir, 'app-config.yaml');
      const localPath = resolvePath(options.rootDir, 'app-config.local.yaml');

      argSources.push(
        FileConfigSource.create({
          path: defaultPath,
          substitutionFunc: options.substitutionFunc,
        }),
      );
      if (fs.pathExistsSync(localPath)) {
        argSources.push(
          FileConfigSource.create({
            path: localPath,
            substitutionFunc: options.substitutionFunc,
          }),
        );
      }
    }

    return this.merge(argSources);
  }

  static default(options: ConfigSourcesDefaultOptions): ConfigSource {
    const argSource = this.defaultForTargets({
      ...options,
      targets: this.parseArgs(options.argv),
    });

    const envSource = EnvConfigSource.create(options);

    return this.merge([argSource, envSource]);
  }

  static merge(sources: ConfigSource[]): ConfigSource {
    return MergedConfigSource.from(sources);
  }

  static toConfig(source: ConfigSource): Promise<ClosableConfig> {
    return new Promise(async (resolve, reject) => {
      let config: ObservableConfigProxy | undefined = undefined;
      try {
        const abortController = new AbortController();
        for await (const { data } of source.readConfigData({
          signal: abortController.signal,
        })) {
          if (config) {
            config.setConfig(ConfigReader.fromConfigs(data));
          } else {
            config = ObservableConfigProxy.create(abortController);
            config!.setConfig(ConfigReader.fromConfigs(data));
            resolve(config);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
