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
import { v4 as uuid } from 'uuid';
import { startInfinispanContainer } from './infinispan';

const itIfDocker = isDockerDisabledForTests() ? it.skip : it;

jest.setTimeout(180_000);

describe('startInfinispanContainer', () => {
  itIfDocker(
    'successfully launches the container',
    async () => {
      console.log('Starting Infinispan container...');
      const { stop, keyv } = await startInfinispanContainer(
        'infinispan/server:15.2.1.Final-1',
      );
      console.log('Container started, testing connection...');
      const value = uuid();
      await keyv.set('test', value);
      console.log('Value set, testing retrieval...');
      // eslint-disable-next-line jest/no-standalone-expect
      await expect(keyv.get('test')).resolves.toBe(value);
      console.log('Test successful, stopping container...');
      await stop();
      console.log('Container stopped.');
    },
    180000,
  );
});
