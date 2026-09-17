/*
 * Copyright 2023 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { StaticConfigSource } from './StaticConfigSource';
import { readAll } from './__testUtils__/testUtils';
import ZenObservable from 'zen-observable';

describe('StaticConfigSource', () => {
  it('should be created from data', async () => {
    const source = StaticConfigSource.create({ data: { a: 1 } });
    await expect(readAll(source)).resolves.toEqual([
      [{ data: { a: 1 }, context: 'static-config' }],
    ]);
  });

  it('should be created from promise', async () => {
    const source = StaticConfigSource.create({
      data: Promise.resolve({ a: 1 }),
    });
    await expect(readAll(source)).resolves.toEqual([
      [{ data: { a: 1 }, context: 'static-config' }],
    ]);
  });

  it('should be created from observable', async () => {
    const source = StaticConfigSource.create({
      data: ZenObservable.of<JsonObject>({ a: 1 }, { a: 2 }, { a: 3 }),
    });
    await expect(readAll(source)).resolves.toEqual([
      [{ data: { a: 1 }, context: 'static-config' }],
      [{ data: { a: 2 }, context: 'static-config' }],
      [{ data: { a: 3 }, context: 'static-config' }],
    ]);
  });
});
