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
import { abortManually, abortOnTimeout } from './abort';

describe('ContextAbortState', () => {
  describe('abortManually', () => {
    it('can perform a manual abort', async () => {
      const state = abortManually();

      const cb = jest.fn();
      state.signal.addEventListener('abort', cb);
      state.promise.then(cb);

      state.abort();

      await state.promise;
      expect(cb).toBeCalledTimes(2);
    });

    it('triggers child when parent is aborted', async () => {
      const parent = abortManually();
      const child = abortManually(parent);

      const parentCb = jest.fn();
      parent.signal.addEventListener('abort', parentCb);
      parent.promise.then(parentCb);

      const childCb = jest.fn();
      child.signal.addEventListener('abort', childCb);
      child.promise.then(childCb);

      parent.abort();

      await child.promise;
      expect(parentCb).toBeCalledTimes(2);
      expect(childCb).toBeCalledTimes(2);
    });

    it('does not trigger parent when child is aborted', async () => {
      const parent = abortManually();
      const child = abortManually(parent);

      const parentCb = jest.fn();
      parent.signal.addEventListener('abort', parentCb);
      parent.promise.then(parentCb);

      const childCb = jest.fn();
      child.signal.addEventListener('abort', childCb);
      child.promise.then(childCb);

      child.abort();

      await child.promise;
      expect(parentCb).toBeCalledTimes(0);
      expect(childCb).toBeCalledTimes(2);
    });

    it('only triggers once', async () => {
      const state = abortManually();

      const cb = jest.fn();
      state.signal.addEventListener('abort', cb);
      state.promise.then(cb);

      state.abort();

      await state.promise;
      expect(cb).toBeCalledTimes(2);

      state.abort();

      await state.promise;
      expect(cb).toBeCalledTimes(2);
    });
  });

  describe('abortOnTimeout', () => {
    it('can abort on a timeout', async () => {
      const state = abortOnTimeout(Duration.fromMillis(200));
      const start = Date.now();

      const cb = jest.fn();
      state.signal.addEventListener('abort', cb);
      state.promise.then(cb);

      await state.promise;
      const delta = Date.now() - start;

      expect(delta).toBeGreaterThan(100);
      expect(delta).toBeLessThan(300);
      expect(cb).toBeCalledTimes(2);
    });

    it('aborts early if parent triggers first', async () => {
      const parent = abortManually();
      const child = abortOnTimeout(Duration.fromMillis(200), parent);

      const parentCb = jest.fn();
      parent.signal.addEventListener('abort', parentCb);
      parent.promise.then(parentCb);

      const childCb = jest.fn();
      child.signal.addEventListener('abort', childCb);
      child.promise.then(childCb);

      expect(parentCb).toBeCalledTimes(0);
      expect(childCb).toBeCalledTimes(0);

      const start = Date.now();

      parent.abort();

      await child.promise;
      expect(parentCb).toBeCalledTimes(2);
      expect(childCb).toBeCalledTimes(2);
      expect(Date.now() - start).toBeLessThan(100);
    });
  });
});
