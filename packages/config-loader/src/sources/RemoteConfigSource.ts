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
import {
  HumanDuration,
  JsonObject,
  durationToMilliseconds,
} from '@backstage/types';
import isEqual from 'lodash/isEqual';
import { ConfigTransformer, createConfigTransformer } from './transform';
import {
  AsyncConfigSourceGenerator,
  ConfigSource,
  SubstitutionFunc,
  ReadConfigDataOptions,
  Parser,
} from './types';
import { parseYamlContent } from './utils';

const DEFAULT_RELOAD_INTERVAL = { seconds: 60 };

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

  /**
   * A content parsing function to transform string content to configuration values.
   */
  parser?: Parser;
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
  readonly #parser: Parser;

  private constructor(options: RemoteConfigSourceOptions) {
    this.#url = options.url;
    this.#reloadIntervalMs = durationToMilliseconds(
      options.reloadInterval ?? DEFAULT_RELOAD_INTERVAL,
    );
    this.#transformer = createConfigTransformer({
      substitutionFunc: options.substitutionFunc,
    });
    this.#parser = options.parser ?? parseYamlContent;
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
      signal: signal as RequestInit['signal'],
    });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }

    const contents = await res.text();
    const { result: rawData } = await this.#parser({ contents });
    if (rawData === undefined) {
      /**
       * This error message is/was coupled to the implementation and with refactoring it is no longer truly accurate
       * This behavior is also inconsistent with {@link FileConfigSource}, which doesn't error on unparseable or empty
       * content
       *
       * Preserving to not make a breaking change
       */
      throw new Error('configuration data is null');
    }

    const data = await this.#transformer(rawData);
    if (typeof data !== 'object') {
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
