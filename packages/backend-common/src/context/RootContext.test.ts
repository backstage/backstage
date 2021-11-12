/*
 * Copyright 2021 The Backstage Authors
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

import { Duration } from 'luxon';
import { RootContext } from './RootContext';

describe('RootContext', () => {
  it('can perform a manual abort', async () => {
    const { ctx, abort } = RootContext.create().withAbort();

    const cb = jest.fn();
    ctx.abortSignal.addEventListener('abort', cb);
    ctx.abortPromise.then(cb);

    abort();

    await ctx.abortPromise;
    expect(cb).toBeCalledTimes(2);
  });

  it('can abort on a timeout', async () => {
    const ctx = RootContext.create().withTimeout(Duration.fromMillis(200));
    const start = Date.now();

    const cb = jest.fn();
    ctx.abortSignal.addEventListener('abort', cb);
    ctx.abortPromise.then(cb);

    await ctx.abortPromise;
    const delta = Date.now() - start;

    expect(delta).toBeGreaterThan(100);
    expect(delta).toBeLessThan(300);
    expect(cb).toBeCalledTimes(2);
  });

  it('can apply behaviors', () => {
    const ctx = RootContext.create().with(
      c => c.withValue('a', 1),
      c => c.withValue<number>('a', p => p! + 1),
      c => c.withValue('b', 3),
    );

    expect(ctx.value('a')).toBe(2);
    expect(ctx.value('b')).toBe(3);
  });
});
