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
import {
  AsyncConfigSourceGenerator,
  ConfigSource,
  ConfigSourceData,
  SubstitutionFunc,
  Parser,
  ReadConfigDataOptions,
} from './types';
import { createConfigTransformer } from './transform';
import { NotFoundError } from '@backstage/errors';
import { parseYamlContent } from './utils';

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
   * Set to `false` to disable file watching, defaults to `true`.
   */
  watch?: boolean;

  /**
   * A substitution function to use instead of the default environment substitution.
   */
  substitutionFunc?: SubstitutionFunc;

  /**
   * A content parsing function to transform string content to configuration values.
   */
  parser?: Parser;
}

async function readFile(path: string): Promise<string | undefined> {
  try {
    const content = await fs.readFile(path, 'utf8');
    // During watching we may sometimes read files too early before the file content has been written.
    // We never expect the writing to take a long time, but if we encounter an empty file then check
    // again after a short delay for safety.
    if (content === '') {
      await new Promise(resolve => setTimeout(resolve, 10));
      return await fs.readFile(path, 'utf8');
    }
    return content;
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
  readonly #watch?: boolean;
  readonly #parser: Parser;

  private constructor(options: FileConfigSourceOptions) {
    this.#path = options.path;
    this.#substitutionFunc = options.substitutionFunc;
    this.#watch = options.watch ?? true;
    this.#parser = options.parser ?? parseYamlContent;
  }

  // Work is duplicated across each read, in practice that should not
  // have any impact since there won't be multiple consumers. If that
  // changes it might be worth refactoring this to avoid duplicate work.
  async *readConfigData(
    options?: ReadConfigDataOptions,
  ): AsyncConfigSourceGenerator {
    const signal = options?.signal;
    const configFileName = basename(this.#path);

    let watchedPaths: Array<string> | null = null;
    let watcher: FSWatcher | null = null;

    if (this.#watch) {
      // Keep track of watched paths, since this is simpler than resetting the watcher
      watchedPaths = new Array<string>();
      watcher = chokidar.watch(this.#path, {
        usePolling: process.env.NODE_ENV === 'test',
      });
    }

    const dir = dirname(this.#path);
    const transformer = createConfigTransformer({
      substitutionFunc: this.#substitutionFunc,
      readFile: async path => {
        const fullPath = resolvePath(dir, path);
        if (watcher && watchedPaths) {
          // Any files discovered while reading this config should be watched too
          watcher.add(fullPath);
          watchedPaths.push(fullPath);
        }

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
      if (watcher && watchedPaths) {
        // We clear the watched files every time we initiate a new read
        watcher.unwatch(watchedPaths);
        watchedPaths.length = 0;

        watcher.add(this.#path);
        watchedPaths.push(this.#path);
      }

      const contents = await readFile(this.#path);
      if (contents === undefined) {
        throw new NotFoundError(`Config file "${this.#path}" does not exist`);
      }
      const { result: parsed } = await this.#parser({ contents });
      if (parsed === undefined) {
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

    const onAbort = () => {
      signal?.removeEventListener('abort', onAbort);
      if (watcher) watcher.close();
    };
    signal?.addEventListener('abort', onAbort);

    yield { configs: await readConfigFile() };

    if (watcher) {
      for (;;) {
        const event = await this.#waitForEvent(watcher, signal);
        if (event === 'abort') {
          return;
        }
        yield { configs: await readConfigFile() };
      }
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
