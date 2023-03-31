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
  SubstitutionFunc,
  ReadConfigDataOptions,
} from './types';
import { createConfigTransformer } from './transform';
import { NotFoundError } from '@backstage/errors';

/**
 * Options for {@link FileConfigSource.create}.
 *
 * @public
 */
export interface FileConfigSourceOptions {
  /**
   * The path to the config file that should be loaded.
   */
  path: string;

  /**
   * A substitution function to use instead of the default environment substitution.
   */
  substitutionFunc?: SubstitutionFunc;
}

async function readFile(path: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

/**
 * A config source that loads configuration from a local file.
 *
 * @public
 */
export class FileConfigSource implements ConfigSource {
  /**
   * Creates a new config source that loads configuration from the given path.
   *
   * @remarks
   *
   * The source will watch the file for changes, as well as any referenced files.
   *
   * @param options - Options for the config source.
   * @returns A new config source that loads from the given path.
   */
  static create(options: FileConfigSourceOptions): ConfigSource {
    if (!isAbsolute(options.path)) {
      throw new Error(`Config load path is not absolute: "${options.path}"`);
    }
    return new FileConfigSource(options);
  }

  readonly #path: string;
  readonly #substitutionFunc?: SubstitutionFunc;

  private constructor(options: FileConfigSourceOptions) {
    this.#path = options.path;
    this.#substitutionFunc = options.substitutionFunc;
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
      substitutionFunc: this.#substitutionFunc,
      readFile: async path => {
        const fullPath = resolvePath(dir, path);
        // Any files discovered while reading this config should be watched too
        watcher.add(fullPath);
        watchedPaths.push(fullPath);

        const data = await readFile(fullPath);
        if (data === undefined) {
          throw new NotFoundError(
            `failed to include "${fullPath}", file does not exist`,
          );
        }
        return data;
      },
    });

    // This is the entry point for reading the file, called initially and on change
    const readConfigFile = async (): Promise<ConfigSourceData[]> => {
      // We clear the watched files every time we initiate a new read
      watcher.unwatch(watchedPaths);
      watchedPaths.length = 0;

      watcher.add(this.#path);
      watchedPaths.push(this.#path);
      const content = await readFile(this.#path);
      if (content === undefined) {
        throw new NotFoundError(`Config file "${this.#path}" does not exist`);
      }
      const parsed = yaml.parse(content);
      if (parsed === null) {
        return [];
      }
      try {
        const data = await transformer(parsed, { dir });
        return [{ data, context: configFileName, path: this.#path }];
      } catch (error) {
        throw new Error(
          `Failed to read config file at "${this.#path}", ${error.message}`,
        );
      }
    };

    signal?.addEventListener('abort', () => {
      watcher.close();
    });

    yield { configs: await readConfigFile() };

    for (;;) {
      const event = await this.#waitForEvent(watcher, signal);
      if (event === 'abort') {
        return;
      }
      yield { configs: await readConfigFile() };
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
