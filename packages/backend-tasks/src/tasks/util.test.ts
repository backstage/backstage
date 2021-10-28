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
import { AbortController } from 'node-abort-controller';
import { delegateAbortController, sleep, validateId } from './util';

describe('util', () => {
  describe('validateId', () => {
    it.each(['a', 'a_b', 'ab123c_2'])(
      'accepts valid inputs, %p',
      async input => {
        expect(validateId(input)).toBeUndefined();
      },
    );

    it.each(['', 'a!', 'A', 'a-b', 'a.b', '_a', 'a_', null, Symbol('a')])(
      'rejects invalid inputs, %p',
      async input => {
        expect(() => validateId(input as any)).toThrow();
      },
    );
  });

  describe('sleep', () => {
    it('finishes the wait as expected with no signal', async () => {
      const ac = new AbortController();
      const start = Date.now();
      await sleep(Duration.fromObject({ seconds: 1 }), ac.signal);
      expect(Date.now() - start).toBeGreaterThan(800);
    }, 5_000);

    it('aborts properly on the signal', async () => {
      const ac = new AbortController();
      const promise = sleep(Duration.fromObject({ seconds: 10 }), ac.signal);
      ac.abort();
      await promise;
      expect(true).toBe(true);
    }, 1_000);
  });

  describe('delegateAbortController', () => {
    it('inherits parent abort state', () => {
      const parent = new AbortController();
      const child = delegateAbortController(parent.signal);
      expect(parent.signal.aborted).toBe(false);
      expect(child.signal.aborted).toBe(false);
      parent.abort();
      expect(parent.signal.aborted).toBe(true);
      expect(child.signal.aborted).toBe(true);
    });

    it('does not inherit from child to parent', () => {
      const parent = new AbortController();
      const child = delegateAbortController(parent.signal);
      expect(parent.signal.aborted).toBe(false);
      expect(child.signal.aborted).toBe(false);
      child.abort();
      expect(parent.signal.aborted).toBe(false);
      expect(child.signal.aborted).toBe(true);
    });
  });
});
