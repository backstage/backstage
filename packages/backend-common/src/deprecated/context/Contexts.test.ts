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
import { Contexts } from './Contexts';

describe('Contexts', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('root', () => {
    it('can create a root', () => {
      const ctx = Contexts.root();
      expect(ctx.abortSignal).toBeDefined();
      expect(ctx.deadline).toBeUndefined();
    });
  });

  describe('setAbort', () => {
    it('works for controllers', () => {
      const controller = new AbortController();
      const parent = Contexts.root();
      const child = Contexts.withAbort(parent, controller);
      expect(child.abortSignal.aborted).toBe(false);
      controller.abort();
      expect(child.abortSignal.aborted).toBe(true);
    });

    it('works for signals', () => {
      const controller = new AbortController();
      const parent = Contexts.root();
      const child = Contexts.withAbort(parent, controller.signal);
      expect(child.abortSignal.aborted).toBe(false);
      controller.abort();
      expect(child.abortSignal.aborted).toBe(true);
    });
  });

  describe('setTimeoutDuration', () => {
    it('works', () => {
      jest.useFakeTimers();
      const parent = Contexts.root();
      const child = Contexts.withTimeoutDuration(
        parent,
        Duration.fromMillis(200),
      );
      expect(child.abortSignal.aborted).toBe(false);
      jest.advanceTimersByTime(100);
      expect(child.abortSignal.aborted).toBe(false);
      jest.advanceTimersByTime(101);
      expect(child.abortSignal.aborted).toBe(true);
    });
  });

  describe('setTimeoutMillis', () => {
    it('works', () => {
      jest.useFakeTimers();
      const parent = Contexts.root();
      const child = Contexts.withTimeoutMillis(parent, 200);
      expect(child.abortSignal.aborted).toBe(false);
      jest.advanceTimersByTime(100);
      expect(child.abortSignal.aborted).toBe(false);
      jest.advanceTimersByTime(101);
      expect(child.abortSignal.aborted).toBe(true);
    });
  });

  describe('setValue', () => {
    it('works', () => {
      const parent = Contexts.root();
      const child = Contexts.withValue(parent, 'k', 'v');
      expect(child.value('k')).toBe('v');
    });
  });
});
