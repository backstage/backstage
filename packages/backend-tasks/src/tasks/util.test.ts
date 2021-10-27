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

import { AbortController } from 'node-abort-controller';
import { delegateAbortController } from './util';

describe('util', () => {
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
