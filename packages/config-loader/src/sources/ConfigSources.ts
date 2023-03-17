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

import ObservableImpl from 'zen-observable';
import { LoadConfigOptionsRemote } from './loader';
import parseArgs from 'minimist';
import { ConfigSource, ConfigSourceData } from './types';
import { RemoteConfigSource } from './RemoteConfigSource';
import { FileConfigSource } from './FileConfigSource';
import { EnvConfigSource } from './EnvConfigSource';
import { Config, ConfigReader } from '@backstage/config';

export class ConfigSources {
  static parseArgs(
    argv: string[] = process.argv,
  ): Array<{ type: 'url' | 'path'; target: string }> {
    const args: string[] = parseArgs(argv).config ?? [];
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

  static default(options: {
    logger: Logger;
    argv?: string[];
    remote?: LoadConfigOptionsRemote;
    env?: Record<string, string>;
  }): ConfigSource {
    const argSources = this.parseArgs(options.argv).map(arg => {
      if (arg.type === 'url') {
        if (!options.remote) {
          throw new Error(
            `Config argument '${arg.target}' looks like a URL but remote configuration is not enabled. Enable it by passing the \`remote\` option`,
          );
        }
        return RemoteConfigSource.create({ ...options, url: arg.target });
      }
      return FileConfigSource.create({ ...options, path: arg.target });
    });
    const envSource = EnvConfigSource.create(options);

    return this.merge([...argSources, envSource]);
  }

  static merge(sources: ConfigSource[]): ConfigSource {
    return {
      configData$: new ObservableImpl<ConfigSourceData[]>(observer => {
        const dataArr = new Array<ConfigSourceData[]>(sources.length);
        let gotAll = false;
        const subscriptions = sources.map((source, i) =>
          source.configData$.subscribe({
            next({ data }) {
              dataArr[i] = data;
              if (gotAll || dataArr.every(Boolean)) {
                gotAll = true;
                observer.next(dataArr.flat(1));
              }
            },
            error(error) {
              observer.error(error);
            },
          }),
        );
        return () =>
          subscriptions.forEach(subscription => subscription.unsubscribe());
      }),
    };
  }

  static toConfig(source: ConfigSource): Promise<LiveConfig> {
    return new Promise((resolve, reject) => {
      let config: Config | undefined = undefined;
      source.configData$.subscribe({
        next({ data }) {
          if (config) {
            config.setConfig(ConfigReader.fromConfigs(data));
          } else {
            config = ConfigReader.fromConfigs(data);
            resolve(config);
          }
        },
        error(error) {
          reject(error);
        },
      });
    });
  }
}

interface LiveConfig extends Config {
  close(): void;
}
