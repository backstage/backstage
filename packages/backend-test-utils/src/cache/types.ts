/*
 * Copyright 2024 The Backstage Authors
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

import Keyv from 'keyv';
import { getDockerImageForName } from '../util/getDockerImageForName';

/**
 * The possible caches to test against.
 *
 * @public
 */
export type TestCacheId = 'MEMORY' | 'REDIS_7' | 'MEMCACHED_1';

export type TestCacheProperties = {
  name: string;
  store: string;
  dockerImageName?: string;
  connectionStringEnvironmentVariableName?: string;
};

export type Instance = {
  store: string;
  connection: string;
  keyv: Keyv;
  stop: () => Promise<void>;
};

export const allCaches: Record<TestCacheId, TestCacheProperties> =
  Object.freeze({
    REDIS_7: {
      name: 'Redis 7.x',
      store: 'redis',
      dockerImageName: getDockerImageForName('redis:7'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_CACHE_REDIS7_CONNECTION_STRING',
    },
    MEMCACHED_1: {
      name: 'Memcached 1.x',
      store: 'memcache',
      dockerImageName: getDockerImageForName('memcached:1'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_CACHE_MEMCACHED1_CONNECTION_STRING',
    },
    MEMORY: {
      name: 'In-memory',
      store: 'memory',
    },
  });
