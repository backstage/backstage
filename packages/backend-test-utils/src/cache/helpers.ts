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

import Keyv, { type KeyvStoreAdapter } from 'keyv';
import { v4 as uuid } from 'uuid';
import { waitForReady } from '../util/waitForReady';
import { Instance } from './types';

/**
 * Polls a Keyv store until a set/get round-trip succeeds.
 */
export async function attemptKeyvConnection(
  createStore: (connection: string) => KeyvStoreAdapter,
  connection: string,
  label: string,
): Promise<Keyv> {
  let keyv: Keyv | undefined;

  await waitForReady(async () => {
    const store = createStore(connection);
    const attemptKeyv = new Keyv({ store });
    let succeeded = false;

    try {
      const value = uuid();
      await attemptKeyv.set('test', value);
      succeeded = (await attemptKeyv.get('test')) === value;
      if (succeeded) {
        keyv = attemptKeyv;
      }
      return succeeded;
    } finally {
      if (!succeeded) {
        await attemptKeyv.disconnect();
      }
    }
  }, label);

  return keyv!;
}

/**
 * Starts a Redis-protocol-compatible container (Redis, Valkey, etc.) on port
 * 6379 and waits until a Keyv round-trip succeeds.
 */
export async function startRedisLikeContainer(
  image: string,
  store: string,
  createStore: (connection: string) => KeyvStoreAdapter,
): Promise<Instance> {
  // Lazy-load to avoid side-effect of importing testcontainers
  const { GenericContainer } =
    require('testcontainers') as typeof import('testcontainers');

  const container = await new GenericContainer(image)
    .withExposedPorts(6379)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(6379);
  const connection = `redis://${host}:${port}`;

  const keyv = await attemptKeyvConnection(createStore, connection, store);

  return {
    store,
    connection,
    keyv,
    stop: async () => {
      await keyv.disconnect();
      await container.stop({ timeout: 10_000 });
    },
  };
}
