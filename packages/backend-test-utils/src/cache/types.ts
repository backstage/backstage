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

/**
 * The possible caches to test against.
 *
 * @public
 */
export type TestCacheId =
  | 'MEMCACHED_1'
  | 'REDIS_7'
  | 'REDIS_6'
  | 'VALKEY_8'
  | 'INFINISPAN_15';

export interface TestCacheProperties {
  store: string;
  dockerImageName?: string;
  connectionStringEnvironmentVariableName?: string;
}

export interface Instance {
  store: string;
  connection: string;
  keyv: Keyv;
  stop: () => Promise<void>;
}

export const allCaches: Record<TestCacheId, TestCacheProperties> = {
  MEMCACHED_1: {
    store: 'memcache',
    dockerImageName: 'memcached:1.6-alpine',
    connectionStringEnvironmentVariableName: 'TEST_MEMCACHED_CONNECTION',
  },
  REDIS_7: {
    store: 'redis',
    dockerImageName: 'redis:7-alpine',
    connectionStringEnvironmentVariableName: 'TEST_REDIS_CONNECTION',
  },
  REDIS_6: {
    store: 'redis',
    dockerImageName: 'redis:6-alpine',
    connectionStringEnvironmentVariableName: 'TEST_REDIS_CONNECTION',
  },
  VALKEY_8: {
    store: 'valkey',
    dockerImageName: 'valkey/valkey:8',
    connectionStringEnvironmentVariableName: 'TEST_VALKEY_CONNECTION',
  },
  INFINISPAN_15: {
    store: 'infinispan',
    dockerImageName: 'infinispan/server:15.2.1.Final-1',
    connectionStringEnvironmentVariableName: 'TEST_INFINISPAN_CONNECTION',
  },
};
