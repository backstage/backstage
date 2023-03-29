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

import {
  AsyncConfigSourceIterator,
  ConfigSource,
  ReadConfigDataOptions,
} from './types';
import isEqual from 'lodash/isEqual';
import yaml from 'yaml';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';

const DEFAULT_RELOAD_INTERVAL_SECONDS = 60;

export interface RemoteConfigSourceOptions {
  url: string;
  reloadIntervalSeconds?: number;
}

export class RemoteConfigSource implements ConfigSource {
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

  private constructor(options: RemoteConfigSourceOptions) {
    this.#url = options.url;
    this.#reloadIntervalSeconds =
      options.reloadIntervalSeconds ?? DEFAULT_RELOAD_INTERVAL_SECONDS;
  }

  async *readConfigData(
    options?: ReadConfigDataOptions | undefined,
  ): AsyncConfigSourceIterator {
    let data = await this.#load();

    yield { data: [{ data, context: this.#url }] };

    for (;;) {
      if (options?.signal?.aborted) {
        return;
      }
      const loadStart = Date.now();

      try {
        const newData = await this.#load(options?.signal);
        if (newData && !isEqual(data, newData)) {
          data = newData;
          yield { data: [{ data, context: this.#url }] };
        }
      } catch (error) {
        console.error(`Failed to read config from ${this.#url}, ${error}`);
      }
      const loadTime = Date.now() - loadStart;

      await this.#wait(loadTime, options?.signal);
    }
  }

  async #load(signal?: AbortSignal): Promise<JsonObject> {
    const res = await fetch(this.#url, { signal });
    if (!res.ok) {
      throw ResponseError.fromResponse(res);
    }

    const content = await res.text();
    const data = yaml.parse(content);
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

  async #wait(loadTimeMs: number, signal?: AbortSignal) {
    return new Promise<void>(resolve => {
      const timeoutId = setTimeout(
        onDone,
        Math.max(0, this.#reloadIntervalSeconds * 1000 - loadTimeMs),
      );
      signal?.addEventListener('abort', onDone);

      function onDone() {
        clearTimeout(timeoutId);
        signal?.removeEventListener('abort', onDone);
        resolve();
      }
    });
  }
}
