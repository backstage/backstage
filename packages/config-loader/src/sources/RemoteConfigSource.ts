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

import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import isEqual from 'lodash/isEqual';
import fetch from 'node-fetch';
import yaml from 'yaml';
import { ConfigTransformer, createConfigTransformer } from './transform';
import {
  AsyncConfigSourceIterator,
  ConfigSource,
  SubstitutionFunc,
  ReadConfigDataOptions,
} from './types';

const DEFAULT_RELOAD_INTERVAL_SECONDS = 60;

/**
 * Options for {@link RemoteConfigSource.create}.
 *
 * @public
 */
export interface RemoteConfigSourceOptions {
  /**
   * The URL to load the config from.
   */
  url: string;

  /**
   * The interval in seconds to reload the config from the remote URL.
   *
   * Set to Infinity to disable reloading.
   */
  reloadIntervalSeconds?: number;

  /**
   * A substitution function to use instead of the default environment substitution.
   */
  substitutionFunc?: SubstitutionFunc;
}

/**
 * A config source that loads configuration from a remote URL.
 *
 * @public
 */
export class RemoteConfigSource implements ConfigSource {
  /**
   * Creates a new {@link RemoteConfigSource}.
   *
   * @param options - Options for the source.
   * @returns A new remote config source.
   */
  static create(options: RemoteConfigSourceOptions): ConfigSource {
    try {
      // eslint-disable-next-line no-new
      new URL(options.url);
    } catch (error) {
      throw new Error(
        `Invalid URL provided to remote config source, '${options.url}', ${error}`,
      );
    }
    return new RemoteConfigSource(options);
  }

  readonly #url: string;
  readonly #reloadIntervalSeconds: number;
  readonly #transformer: ConfigTransformer;

  private constructor(options: RemoteConfigSourceOptions) {
    this.#url = options.url;
    this.#reloadIntervalSeconds =
      options.reloadIntervalSeconds ?? DEFAULT_RELOAD_INTERVAL_SECONDS;
    this.#transformer = createConfigTransformer({
      substitutionFunc: options.substitutionFunc,
    });
  }

  async *readConfigData(
    options?: ReadConfigDataOptions | undefined,
  ): AsyncConfigSourceIterator {
    let data = await this.#load();

    yield { configs: [{ data, context: this.#url }] };

    for (;;) {
      if (options?.signal?.aborted) {
        return;
      }

      await this.#wait(options?.signal);

      try {
        const newData = await this.#load(options?.signal);
        if (newData && !isEqual(data, newData)) {
          data = newData;
          yield { configs: [{ data, context: this.#url }] };
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(`Failed to read config from ${this.#url}, ${error}`);
        }
      }
    }
  }

  toString() {
    return `RemoteConfigSource{path="${this.#url}"}`;
  }

  async #load(signal?: AbortSignal): Promise<JsonObject> {
    const res = await fetch(this.#url, {
      signal: signal as import('node-fetch').RequestInit['signal'],
    });
    if (!res.ok) {
      throw ResponseError.fromResponse(res);
    }

    const content = await res.text();
    const data = await this.#transformer(yaml.parse(content));
    if (data === null) {
      throw new Error('configuration data is null');
    } else if (typeof data !== 'object') {
      throw new Error('configuration data is not an object');
    } else if (Array.isArray(data)) {
      throw new Error(
        'configuration data is an array, expected an object instead',
      );
    }
    return data;
  }

  async #wait(signal?: AbortSignal) {
    return new Promise<void>(resolve => {
      const timeoutId = setTimeout(onDone, this.#reloadIntervalSeconds * 1000);
      signal?.addEventListener('abort', onDone);

      function onDone() {
        clearTimeout(timeoutId);
        signal?.removeEventListener('abort', onDone);
        resolve();
      }
    });
  }
}
