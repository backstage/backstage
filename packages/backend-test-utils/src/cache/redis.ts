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
import KeyvRedis from '@keyv/redis';
import { v4 as uuid } from 'uuid';
import { Instance } from './types';

async function attemptRedisConnection(connection: string): Promise<Keyv> {
  const startTime = Date.now();

  for (;;) {
    try {
      const store = new KeyvRedis(connection);
      const keyv = new Keyv({ store });
      const value = uuid();
      await keyv.set('test', value);
      if ((await keyv.get('test')) === value) {
        return keyv;
      }
    } catch (e) {
      if (Date.now() - startTime > 30_000) {
        throw new Error(
          `Timed out waiting for redis to be ready for connections, ${e}`,
        );
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export async function connectToExternalRedis(
  connection: string,
): Promise<Instance> {
  const keyv = await attemptRedisConnection(connection);
  return {
    store: 'redis',
    connection,
    keyv,
    stop: async () => await keyv.disconnect(),
  };
}

export async function startRedisContainer(image: string): Promise<Instance> {
  // Lazy-load to avoid side-effect of importing testcontainers
  const { GenericContainer } =
    require('testcontainers') as typeof import('testcontainers');

  const container = await new GenericContainer(image)
    .withExposedPorts(6379)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(6379);
  const connection = `redis://${host}:${port}`;

  const keyv = await attemptRedisConnection(connection);

  return {
    store: 'redis',
    connection,
    keyv,
    stop: async () => {
      await keyv.disconnect();
      await container.stop({ timeout: 10_000 });
    },
  };
}
