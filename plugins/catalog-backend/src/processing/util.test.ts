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

import { createBarrier } from './util';

describe('createBarrier', () => {
  const tick = (millis: number) =>
    new Promise(resolve => setTimeout(resolve, millis));

  it('abandons a wait after the timeout expires', async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const barrier = createBarrier({ waitTimeoutMillis: 100, signal });

    const fn1 = jest.fn();
    barrier.wait().then(fn1);

    await tick(0);
    expect(fn1).not.toHaveBeenCalled();

    await tick(50);
    expect(fn1).not.toHaveBeenCalled();

    // start a new wait mid-way through the timeout
    // should NOT resolve when the first one times out
    const fn2 = jest.fn();
    barrier.wait().then(fn2);

    await tick(0);
    expect(fn2).not.toHaveBeenCalled();

    await tick(50);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).not.toHaveBeenCalled();

    await tick(50);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('abandons a wait after aborted', async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const barrier = createBarrier({ waitTimeoutMillis: 100, signal });

    const fn1 = jest.fn();
    barrier.wait().then(fn1);

    // should resolve immediately, not after timeout
    await tick(0);
    expect(fn1).not.toHaveBeenCalled();
    abortController.abort();
    await tick(0);
    expect(fn1).toHaveBeenCalledTimes(1);

    // subsequent waits should be immediate no matter what
    const fn2 = jest.fn();
    barrier.wait().then(fn2);
    await tick(0);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('release immediately unblocks all waits', async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const barrier = createBarrier({ waitTimeoutMillis: 100, signal });

    const fn1 = jest.fn();
    barrier.wait().then(fn1);

    await tick(50);
    expect(fn1).not.toHaveBeenCalled();

    // start a new wait mid-way through the timeout
    // SHOULD resolve when releasing
    const fn2 = jest.fn();
    barrier.wait().then(fn2);

    await tick(0);
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    barrier.release();

    await tick(0);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});
