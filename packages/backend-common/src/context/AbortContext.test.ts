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
import { AbortContext } from './AbortContext';
import { RootContext } from './RootContext';

describe('AbortContext', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('forTimeoutMillis', () => {
    it('can abort on a timeout', async () => {
      jest.useFakeTimers();
      const timeout = 200;
      const deadline = Date.now() + timeout;

      const root = new RootContext();

      const child = AbortContext.forTimeoutMillis(root, timeout);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(child.abortSignal.aborted).toBe(false);
      expect(Math.abs(+child.deadline! - deadline)).toBeLessThan(50);
      expect(childListener).toBeCalledTimes(0);

      jest.advanceTimersByTime(timeout + 1);

      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(1);
    });

    it('results in minimum deadline when parent triggers sooner', async () => {
      jest.useFakeTimers();
      const parentTimeout = 200;
      const childTimeout = 300;
      const parentDeadline = Date.now() + parentTimeout;
      const childDeadline = parentDeadline; // clamped

      const root = new RootContext();

      const parent = AbortContext.forTimeoutMillis(root, parentTimeout);
      const parentListener = jest.fn();
      parent.abortSignal.addEventListener('abort', parentListener);

      const child = AbortContext.forTimeoutMillis(parent, childTimeout);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(false);
      expect(Math.abs(+parent.deadline! - parentDeadline)).toBeLessThan(50);
      expect(Math.abs(+child.deadline! - childDeadline)).toBeLessThan(50);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(0);

      jest.advanceTimersByTime(parentTimeout + 1);

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(1);
      expect(childListener).toBeCalledTimes(1);
    });

    it('results in minimum deadline when child triggers sooner', async () => {
      jest.useFakeTimers();
      const parentTimeout = 300;
      const childTimeout = 200;
      const parentDeadline = Date.now() + parentTimeout;
      const childDeadline = Date.now() + childTimeout;

      const root = new RootContext();

      const parent = AbortContext.forTimeoutMillis(root, parentTimeout);
      const parentListener = jest.fn();
      parent.abortSignal.addEventListener('abort', parentListener);

      const child = AbortContext.forTimeoutMillis(parent, childTimeout);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(false);
      expect(Math.abs(+parent.deadline! - parentDeadline)).toBeLessThan(50);
      expect(Math.abs(+child.deadline! - childDeadline)).toBeLessThan(50);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(0);

      jest.advanceTimersByTime(childTimeout + 1);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(1);

      jest.advanceTimersByTime(parentTimeout - childTimeout + 1);

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(1);
      expect(childListener).toBeCalledTimes(1);
    });

    it('child carries over parent signal state if parent was already aborted and had no deadline', async () => {
      jest.useFakeTimers();
      const childTimeout = 200;
      const childDeadline = Date.now() + childTimeout;

      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forSignal(root, parentController.signal);

      parentController.abort();

      const child = AbortContext.forTimeoutMillis(parent, childTimeout);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);
      expect(Math.abs(+child.deadline! - childDeadline)).toBeLessThan(50);

      jest.advanceTimersByTime(childTimeout + 1);

      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0); // still
    });

    it('child carries over parent signal state if parent was already aborted and had a deadline', async () => {
      jest.useFakeTimers();
      const first = new RootContext();

      const secondController = new AbortController();
      const second = AbortContext.forSignal(first, secondController.signal);
      secondController.abort();

      const third = AbortContext.forTimeoutMillis(second, 200);
      const fourth = AbortContext.forTimeoutMillis(third, 300);

      expect(third.abortSignal.aborted).toBe(true);
      expect(fourth.abortSignal.aborted).toBe(true);
      expect(Math.abs(+fourth.deadline! - Date.now() - 200)).toBeLessThan(50);
    });
  });

  describe('forController', () => {
    it('signals child when parent is aborted', () => {
      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forController(root, parentController);
      const parentListener = jest.fn();
      parent.abortSignal.addEventListener('abort', parentListener);

      const childController = new AbortController();
      const child = AbortContext.forController(parent, childController);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(false);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(0);

      parentController.abort();

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(1);
      expect(childListener).toBeCalledTimes(1);
    });

    it('does not signal parent when child is aborted', async () => {
      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forController(root, parentController);
      const parentListener = jest.fn();
      parent.abortSignal.addEventListener('abort', parentListener);

      const childController = new AbortController();
      const child = AbortContext.forController(parent, childController);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(false);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(0);

      childController.abort();

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(1);
    });

    it('child carries over parent signal state if parent was already aborted', async () => {
      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forController(root, parentController);

      parentController.abort();

      const childController = new AbortController();
      const child = AbortContext.forController(parent, childController);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);

      childController.abort();

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);
    });

    it('child carries over given signal state if it was already aborted', async () => {
      const root = new RootContext();

      const childController = new AbortController();
      childController.abort();

      const child = AbortContext.forController(root, childController);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);
    });
  });

  describe('forSignal', () => {
    it('signals child when parent is aborted', async () => {
      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forSignal(root, parentController.signal);
      const parentListener = jest.fn();
      parent.abortSignal.addEventListener('abort', parentListener);

      const childController = new AbortController();
      const child = AbortContext.forSignal(parent, childController.signal);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(false);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(0);

      parentController.abort();

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(1);
      expect(childListener).toBeCalledTimes(1);
    });

    it('does not signal parent when child is aborted', async () => {
      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forSignal(root, parentController.signal);
      const parentListener = jest.fn();
      parent.abortSignal.addEventListener('abort', parentListener);

      const childController = new AbortController();
      const child = AbortContext.forSignal(parent, childController.signal);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(false);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(0);

      childController.abort();

      expect(parent.abortSignal.aborted).toBe(false);
      expect(child.abortSignal.aborted).toBe(true);
      expect(parentListener).toBeCalledTimes(0);
      expect(childListener).toBeCalledTimes(1);
    });

    it('child carries over parent signal state if parent was already aborted', async () => {
      const root = new RootContext();

      const parentController = new AbortController();
      const parent = AbortContext.forSignal(root, parentController.signal);

      parentController.abort();

      const childController = new AbortController();
      const child = AbortContext.forSignal(parent, childController.signal);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);

      childController.abort();

      expect(parent.abortSignal.aborted).toBe(true);
      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);
    });

    it('child carries over given signal state if it was already aborted', async () => {
      const root = new RootContext();

      const childController = new AbortController();
      childController.abort();

      const child = AbortContext.forSignal(root, childController.signal);
      const childListener = jest.fn();
      child.abortSignal.addEventListener('abort', childListener);

      expect(child.abortSignal.aborted).toBe(true);
      expect(childListener).toBeCalledTimes(0);
    });
  });
});
