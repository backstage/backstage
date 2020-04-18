/*
 * Copyright 2020 Spotify AB
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

import fs from 'fs-extra';
import { Cache } from './cache';
import { Options } from './options';

function print(msg: string) {
  process.stdout.write(`[build-cache] ${msg}\n`);
}

// Wrap a build function with a cache, which won't call the build function on cache hit
export async function withCache(
  options: Options,
  buildFunc: () => Promise<void>,
): Promise<void> {
  const key = await Cache.readInputKey(options.inputs);
  if (!key) {
    print('input directory is dirty, skipping cache');
    await fs.remove(options.output);
    await buildFunc();
    return;
  }

  const cache = await Cache.read(options);

  const cacheResult = cache.query(key);
  if (cacheResult.hit) {
    if (cacheResult.copy) {
      print('external cache hit, copying archive to output folder');
      await cacheResult.copy(options.output);
    } else {
      print('cache hit, nothing to be done');
    }
    return;
  }

  print('cache miss, need to build');
  await fs.remove(options.output);
  await buildFunc();

  await cacheResult.archive(options.output, options.maxCacheEntries);
}
