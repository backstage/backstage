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

import { isDockerDisabledForTests } from '../util';
import { TestCaches } from './TestCaches';

const itIfDocker = isDockerDisabledForTests() ? it.skip : it;

jest.setTimeout(60_000);

describe('TestCaches', () => {
  const caches = TestCaches.create();

  it.each(caches.eachSupportedId())('fires up a cache, %p', async cacheId => {
    const { keyv } = await caches.init(cacheId);
    await keyv.set('test', 'value');
    await expect(keyv.get('test')).resolves.toBe('value');
  });

  itIfDocker('clears between tests, part 1', async () => {
    const { keyv } = await caches.init('REDIS_7');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(keyv.get('collision')).resolves.toBeUndefined();
    await keyv.set('collision', 'something');
  });

  itIfDocker('clears between tests, part 2', async () => {
    const { keyv } = await caches.init('REDIS_7');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(keyv.get('collision')).resolves.toBeUndefined();
    await keyv.set('collision', 'something');
  });

  itIfDocker('clears between tests, part 3', async () => {
    const { keyv } = await caches.init('REDIS_7');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(keyv.get('collision')).resolves.toBeUndefined();
    await keyv.set('collision', 'something');
  });
});
