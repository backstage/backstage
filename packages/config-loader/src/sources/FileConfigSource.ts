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

import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs-extra';
import { basename, dirname, isAbsolute, resolve as resolvePath } from 'path';
import yaml from 'yaml';
import {
  AsyncConfigSourceIterator,
  ConfigSource,
  ConfigSourceData,
  EnvFunc,
  ReadConfigDataOptions,
} from './types';
import { createConfigTransformer } from './transform';

export interface FileConfigSourceOptions {
  /**
   * The path to the config file that should be loaded.
   */
  path: string;
  /**
   * Function used to resolve environment variables.
   */
  envFunc?: EnvFunc;
}

export class FileConfigSource implements ConfigSource {
  static create(options: FileConfigSourceOptions): ConfigSource {
    if (!isAbsolute(options.path)) {
      throw new Error(`Config load path is not absolute: '${options.path}'`);
    }
    return new FileConfigSource(options);
  }

  readonly #path: string;
  readonly #envFunc?: EnvFunc;

  private constructor(options: FileConfigSourceOptions) {
    this.#path = options.path;
    this.#envFunc = options.envFunc;
  }

  // Work is duplicated across each read, in practice that should not
  // have any impact since there won't be multiple consumers. If that
  // changes it might be worth refactoring this to avoid duplicate work.
  async *readConfigData(
    options?: ReadConfigDataOptions,
  ): AsyncConfigSourceIterator {
    const signal = options?.signal;
    const configFileName = basename(this.#path);

    // Keep track of watched paths, since this is simpler than resetting the watcher
    const watchedPaths = new Array<string>();
    const watcher = chokidar.watch(this.#path, {
      usePolling: process.env.NODE_ENV === 'test',
    });

    const dir = dirname(this.#path);
    const transformer = createConfigTransformer({
      envFunc: this.#envFunc,
      async readFile(path) {
        const fullPath = resolvePath(dir, path);
        // Any files discovered while reading this config should be watched too
        watcher.add(fullPath);
        watchedPaths.push(fullPath);

        return fs.readFile(fullPath, 'utf8');
      },
    });

    // This is the entry point for reading the file, called initially and on change
    const readConfigFile = async (): Promise<ConfigSourceData[]> => {
      // We clear the watched files every time we initiate a new read
      watcher.unwatch(watchedPaths);
      watchedPaths.length = 0;

      watcher.add(this.#path);
      watchedPaths.push(this.#path);
      const content = await fs.readFile(this.#path, 'utf8');
      const parsed = yaml.parse(content);
      if (parsed === null) {
        return [];
      }
      const data = await transformer(parsed, { dir });
      return [{ data, context: configFileName, path: this.#path }];
    };

    signal?.addEventListener('abort', () => {
      watcher.close();
    });

    yield { data: await readConfigFile() };

    for (;;) {
      const event = await this.#waitForEvent(watcher, signal);
      if (event === 'abort') {
        return;
      }
      yield { data: await readConfigFile() };
    }
  }

  toString() {
    return `FileConfigSource{path="${this.#path}"}`;
  }

  #waitForEvent(
    watcher: FSWatcher,
    signal?: AbortSignal,
  ): Promise<'change' | 'abort'> {
    return new Promise(resolve => {
      function onChange() {
        resolve('change');
        onDone();
      }
      function onAbort() {
        resolve('abort');
        onDone();
      }
      function onDone() {
        watcher.removeListener('change', onChange);
        signal?.removeEventListener('abort', onAbort);
      }
      watcher.addListener('change', onChange);
      signal?.addEventListener('abort', onAbort);
    });
  }
}
