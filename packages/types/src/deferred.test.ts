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

import { describe, it, expect, vi } from 'vitest';

import { createDeferred } from './deferred';

describe('createDeferred', () => {
  it('can both resolve and reject', async () => {
    const d1 = createDeferred<number>();
    const d2 = createDeferred<string>();
    const d3 = createDeferred<object>();
    const d4 = createDeferred(); // test the implicit void

    const d1resolved = vi.fn<(v: number) => void>();
    const d1rejected = vi.fn();
    d1.then(d1resolved, d1rejected);

    const d2resolved = vi.fn<(v: string) => void>();
    const d2rejected = vi.fn();
    d2.then(d2resolved, d2rejected);

    const d3resolved = vi.fn<(v: number) => void>();
    const d3rejected = vi.fn();
    // @ts-expect-error wrong argument type for resolved
    d3.then(d3resolved, d3rejected);

    const d4resolved = vi.fn<(v: number) => void>();
    const d4rejected = vi.fn();
    // @ts-expect-error resolver should not take arguments for void deferred
    d4.then(d4resolved, d4rejected);

    d1.resolve(1);
    d1.resolve(2); // should have no effect

    // @ts-expect-error wrong argument type for resolve
    d2.resolve(1);
    d2.reject(new Error('boom')); // should have no effect

    d3.reject(new Error('boom'));

    // @ts-expect-error void deferred does not take arguments
    d4.resolve(1);

    await 'a tick';

    expect(d1resolved).toHaveBeenCalledTimes(1);
    expect(d1resolved).toHaveBeenCalledWith(1);
    expect(d1rejected).not.toHaveBeenCalled();

    expect(d1resolved).toHaveBeenCalledTimes(1);
    expect(d2resolved).toHaveBeenCalledWith(1);
    expect(d1rejected).not.toHaveBeenCalled();

    expect(d3resolved).not.toHaveBeenCalled();
    expect(d3rejected).toHaveBeenCalledTimes(1);
    expect(d3rejected).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'boom' }),
    );

    expect(`${d1}`).toBe('[object DeferredPromise]');
  });
});
