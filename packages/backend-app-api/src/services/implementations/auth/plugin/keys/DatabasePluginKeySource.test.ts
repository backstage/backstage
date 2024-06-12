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

import { mockServices } from '@backstage/backend-test-utils';
import { DatabasePluginKeySource } from './DatabasePluginKeySource';

describe('DatabasePluginKeySource', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('issues token with correct expiration of token and generated key', async () => {
    jest.useFakeTimers({
      now: new Date(0),
    });

    const keyStore = {
      addKey: jest.fn(),
      listKeys: jest.fn(),
    };

    const source = new DatabasePluginKeySource(
      keyStore,
      mockServices.logger.mock(),
      10,
      'ES256',
    );

    const key = await source.getPrivateSigningKey();
    expect(key).toMatchObject({
      alg: 'ES256',
      d: expect.any(String),
    });

    expect(keyStore.addKey).toHaveBeenCalledTimes(1);
    expect(keyStore.addKey).toHaveBeenCalledWith({
      id: expect.any(String),
      key: expect.any(Object),
      expiresAt: new Date(30_000),
    });

    jest.advanceTimersByTime(5_000);

    let newKey = await source.getPrivateSigningKey();
    expect(keyStore.addKey).toHaveBeenCalledTimes(1);
    expect(newKey).toBe(key);

    jest.advanceTimersByTime(10_000);

    newKey = await source.getPrivateSigningKey();
    expect(keyStore.addKey).toHaveBeenCalledTimes(2);
    expect(newKey).not.toBe(key);

    expect(keyStore.addKey.mock.calls[0][0].id).not.toBe(
      keyStore.addKey.mock.calls[1][0].id,
    );

    expect(keyStore.addKey).toHaveBeenNthCalledWith(2, {
      id: expect.any(String),
      key: expect.any(Object),
      expiresAt: new Date(45_000),
    });
  });
});
