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
  ConfigSourceData,
  ReadConfigDataOptions,
} from './types';

const sourcesSymbol = Symbol.for(
  '@backstage/config-loader#MergedConfigSource.sources',
);

/** @internal */
export class MergedConfigSource implements ConfigSource {
  // An optimization to flatten nested merged sources to avid unnecessary microtasks
  static #flattenSources(sources: ConfigSource[]): ConfigSource[] {
    return sources.flatMap(source => {
      if (sourcesSymbol in source && Array.isArray(source[sourcesSymbol])) {
        return this.#flattenSources(source[sourcesSymbol] as ConfigSource[]);
      }
      return source;
    });
  }

  static from(sources: ConfigSource[]): ConfigSource {
    return new MergedConfigSource(this.#flattenSources(sources));
  }

  private constructor(private readonly sources: ConfigSource[]) {}

  [sourcesSymbol] = this.sources;

  async *readConfigData(
    options?: ReadConfigDataOptions,
  ): AsyncConfigSourceIterator {
    const its = this.sources.map(source => source.readConfigData(options));
    const initialResults = await Promise.all(its.map(it => it.next()));
    const configs = initialResults.map((result, i) => {
      if (result.done) {
        throw new Error(
          `Config source ${String(this.sources[i])} returned no data`,
        );
      }
      return result.value.configs;
    });

    yield { configs: configs.flat(1) };

    const results: Array<
      | Promise<
          readonly [
            number,
            IteratorResult<{ configs: ConfigSourceData[] }, void>,
          ]
        >
      | undefined
    > = its.map((it, i) => nextWithIndex(it, i));

    while (results.some(Boolean)) {
      try {
        const [i, result] = (await Promise.race(results.filter(Boolean)))!;
        if (result.done) {
          results[i] = undefined;
        } else {
          results[i] = nextWithIndex(its[i], i);
          configs[i] = result.value.configs;
          yield { configs: configs.flat(1) };
        }
      } catch (error) {
        const source = this.sources[error.index];
        if (source) {
          throw new Error(`Config source ${String(source)} failed: ${error}`);
        }
        throw error;
      }
    }
  }
}

// Helper to wait for the next value of the iterator, while decorating the value
// or error with the index of the iterator.
function nextWithIndex<T>(
  iterator: AsyncIterator<T, void, void>,
  index: number,
): Promise<readonly [index: number, result: IteratorResult<T, void>]> {
  return iterator.next().then(
    r => [index, r] as const,
    e => {
      throw Object.assign(e, { index });
    },
  );
}
