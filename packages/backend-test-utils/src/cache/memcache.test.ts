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

import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { startMemcachedContainer } from './memcache';
import { v4 as uuid } from 'uuid';

const itIfDocker = isDockerDisabledForTests() ? it.skip : it;

jest.setTimeout(60_000);

describe('startMemcachedContainer', () => {
  itIfDocker('successfully launches the container', async () => {
    const { stop, keyv } = await startMemcachedContainer('memcached:1');
    const value = uuid();
    await keyv.set('test', value);
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(keyv.get('test')).resolves.toBe(value);
    await stop();
  });
});
