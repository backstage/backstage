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
import { basename, isAbsolute } from 'path';
import yaml from 'yaml';
import {
  AsyncConfigSourceIterator,
  ConfigSource,
  ConfigSourceData,
  ReadConfigDataOptions,
} from './types';

export interface FileConfigSourceOptions {
  path: string;
}

export class FileConfigSource implements ConfigSource {
  static create(options: FileConfigSourceOptions): ConfigSource {
    if (!isAbsolute(options.path)) {
      throw new Error(`Config load path is not absolute: '${options.path}'`);
    }
    return new FileConfigSource(options);
  }

  readonly #path: string;

  private constructor(options: FileConfigSourceOptions) {
    this.#path = options.path;
  }

  async *readConfigData(
    options?: ReadConfigDataOptions,
  ): AsyncConfigSourceIterator {
    const signal = options?.signal;
    const configFileName = basename(this.#path);

    const readConfigFile = async (): Promise<ConfigSourceData> => {
      const content = await fs.readFile(this.#path, 'utf8');
      const data = yaml.parse(content);
      return { data, context: configFileName, path: this.#path };
    };

    const watcher = chokidar.watch(this.#path, {
      usePolling: process.env.NODE_ENV === 'test',
    });

    signal?.addEventListener('abort', () => {
      watcher.close();
    });

    yield { data: [await readConfigFile()] };

    for (;;) {
      const event = await this.#waitForEvent(watcher, signal);
      if (event === 'abort') {
        return;
      }
      yield { data: [await readConfigFile()] };
    }
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
