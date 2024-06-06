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
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { connectToExternalMemcache, startMemcachedContainer } from './memcache';
import { connectToExternalRedis, startRedisContainer } from './redis';
import { Instance, TestCacheId, TestCacheProperties, allCaches } from './types';

/**
 * Encapsulates the creation of ephemeral test cache instances for use inside
 * unit or integration tests.
 *
 * @public
 */
export class TestCaches {
  private readonly instanceById: Map<string, Instance>;
  private readonly supportedIds: TestCacheId[];
  private static defaultIds?: TestCacheId[];

  /**
   * Creates an empty `TestCaches` instance, and sets up Jest to clean up all of
   * its acquired resources after all tests finish.
   *
   * You typically want to create just a single instance like this at the top of
   * your test file or `describe` block, and then call `init` many times on that
   * instance inside the individual tests. Spinning up a "physical" cache
   * instance takes a considerable amount of time, slowing down tests. But
   * wiping the contents of an instance using `init` is very fast.
   */
  static create(options?: {
    ids?: TestCacheId[];
    disableDocker?: boolean;
  }): TestCaches {
    const ids = options?.ids;
    const disableDocker = options?.disableDocker ?? isDockerDisabledForTests();

    let testCacheIds: TestCacheId[];
    if (ids) {
      testCacheIds = ids;
    } else if (TestCaches.defaultIds) {
      testCacheIds = TestCaches.defaultIds;
    } else {
      testCacheIds = Object.keys(allCaches) as TestCacheId[];
    }

    const supportedIds = testCacheIds.filter(id => {
      const properties = allCaches[id];
      if (!properties) {
        return false;
      }
      // If the caller has set up the env with an explicit connection string,
      // we'll assume that this target will work
      if (
        properties.connectionStringEnvironmentVariableName &&
        process.env[properties.connectionStringEnvironmentVariableName]
      ) {
        return true;
      }
      // If the cache doesn't require docker at all, there's nothing to worry
      // about
      if (!properties.dockerImageName) {
        return true;
      }
      // If the cache requires docker, but docker is disabled, we will fail.
      if (disableDocker) {
        return false;
      }
      return true;
    });

    const caches = new TestCaches(supportedIds);

    if (supportedIds.length > 0) {
      afterAll(async () => {
        await caches.shutdown();
      });
    }

    return caches;
  }

  static setDefaults(options: { ids?: TestCacheId[] }) {
    TestCaches.defaultIds = options.ids;
  }

  private constructor(supportedIds: TestCacheId[]) {
    this.instanceById = new Map();
    this.supportedIds = supportedIds;
  }

  supports(id: TestCacheId): boolean {
    return this.supportedIds.includes(id);
  }

  eachSupportedId(): [TestCacheId][] {
    return this.supportedIds.map(id => [id]);
  }

  /**
   * Returns a fresh, empty cache for the given driver.
   *
   * @param id - The ID of the cache to use, e.g. 'REDIS_7'
   * @returns Cache connection properties
   */
  async init(
    id: TestCacheId,
  ): Promise<{ store: string; connection: string; keyv: Keyv }> {
    const properties = allCaches[id];
    if (!properties) {
      const candidates = Object.keys(allCaches).join(', ');
      throw new Error(
        `Unknown test cache ${id}, possible values are ${candidates}`,
      );
    }
    if (!this.supportedIds.includes(id)) {
      const candidates = this.supportedIds.join(', ');
      throw new Error(
        `Unsupported test cache ${id} for this environment, possible values are ${candidates}`,
      );
    }

    // Ensure that a testcontainers instance is up for this ID
    let instance: Instance | undefined = this.instanceById.get(id);
    if (!instance) {
      instance = await this.initAny(properties);
      this.instanceById.set(id, instance);
    }

    // Ensure that it's cleared of data from previous tests
    await instance.keyv.clear();

    return {
      store: instance.store,
      connection: instance.connection,
      keyv: instance.keyv,
    };
  }

  private async initAny(properties: TestCacheProperties): Promise<Instance> {
    switch (properties.store) {
      case 'memcache':
        return this.initMemcached(properties);
      case 'redis':
        return this.initRedis(properties);
      case 'memory':
        return {
          store: 'memory',
          connection: 'memory',
          keyv: new Keyv(),
          stop: async () => {},
        };
      default:
        throw new Error(`Unknown cache store '${properties.store}'`);
    }
  }

  private async initMemcached(
    properties: TestCacheProperties,
  ): Promise<Instance> {
    // Use the connection string if provided
    const envVarName = properties.connectionStringEnvironmentVariableName;
    if (envVarName) {
      const connectionString = process.env[envVarName];
      if (connectionString) {
        return connectToExternalMemcache(connectionString);
      }
    }

    return await startMemcachedContainer(properties.dockerImageName!);
  }

  private async initRedis(properties: TestCacheProperties): Promise<Instance> {
    // Use the connection string if provided
    const envVarName = properties.connectionStringEnvironmentVariableName;
    if (envVarName) {
      const connectionString = process.env[envVarName];
      if (connectionString) {
        return connectToExternalRedis(connectionString);
      }
    }

    return await startRedisContainer(properties.dockerImageName!);
  }

  private async shutdown() {
    const instances = [...this.instanceById.values()];
    this.instanceById.clear();
    await Promise.all(
      instances.map(({ stop }) =>
        stop().catch(error => {
          console.warn(`TestCaches: Failed to stop container`, { error });
        }),
      ),
    );
  }
}
