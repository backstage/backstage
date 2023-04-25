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
import { HumanDuration, JsonObject } from '@backstage/types';
import isEqual from 'lodash/isEqual';
import fetch from 'node-fetch';
import yaml from 'yaml';
import { ConfigTransformer, createConfigTransformer } from './transform';
import {
  AsyncConfigSourceGenerator,
  ConfigSource,
  SubstitutionFunc,
  ReadConfigDataOptions,
} from './types';

const DEFAULT_RELOAD_INTERVAL = { seconds: 60 };

function durationToMs(duration: HumanDuration): number {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = duration;

  const totalDays = years * 365 + months * 30 + weeks * 7 + days;
  const totalHours = totalDays * 24 + hours;
  const totalMinutes = totalHours * 60 + minutes;
  const totalSeconds = totalMinutes * 60 + seconds;
  const totalMilliseconds = totalSeconds * 1000 + milliseconds;

  return totalMilliseconds;
}

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
   * How often to reload the config from the remote URL, defaults to 1 minute.
   *
   * Set to Infinity to disable reloading, for example `{ days: Infinity }`.
   */
  reloadInterval?: HumanDuration;

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
  readonly #reloadIntervalMs: number;
  readonly #transformer: ConfigTransformer;

  private constructor(options: RemoteConfigSourceOptions) {
    this.#url = options.url;
    this.#reloadIntervalMs = durationToMs(
      options.reloadInterval ?? DEFAULT_RELOAD_INTERVAL,
    );
    this.#transformer = createConfigTransformer({
      substitutionFunc: options.substitutionFunc,
    });
  }

  async *readConfigData(
    options?: ReadConfigDataOptions | undefined,
  ): AsyncConfigSourceGenerator {
    let data = await this.#load();

    yield { configs: [{ data, context: this.#url }] };

    for (;;) {
      await this.#wait(options?.signal);

      if (options?.signal?.aborted) {
        return;
      }

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
      const timeoutId = setTimeout(onDone, this.#reloadIntervalMs);
      signal?.addEventListener('abort', onDone);

      function onDone() {
        clearTimeout(timeoutId);
        signal?.removeEventListener('abort', onDone);
        resolve();
      }
    });
  }
}
