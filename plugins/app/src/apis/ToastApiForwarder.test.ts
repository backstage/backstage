/*
 * Copyright 2025 The Backstage Authors
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

import { ToastApiForwarder } from './ToastApiForwarder';

describe('ToastApiForwarder', () => {
  let forwarder: ToastApiForwarder;

  beforeEach(() => {
    forwarder = new ToastApiForwarder();
  });

  describe('post', () => {
    it('should return a result with a close method', () => {
      const result = forwarder.post({ title: 'Toast 1' });

      expect(result).toBeDefined();
      expect(typeof result.close).toBe('function');
    });

    it('should emit toast to subscribers', () => {
      const received: Array<{ title: unknown; key: string }> = [];

      forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      forwarder.post({ title: 'Test Toast', status: 'success' });

      expect(received).toHaveLength(1);
      expect(received[0].title).toBe('Test Toast');
      expect(received[0].key).toBeDefined();
    });

    it('should include all toast properties in emitted message', () => {
      const received: Array<{
        title: unknown;
        description?: unknown;
        status?: string;
        timeout?: number;
      }> = [];

      forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      forwarder.post({
        title: 'Title',
        description: 'Description',
        status: 'warning',
        timeout: 5000,
        links: [{ label: 'Link', href: '/test' }],
      });

      expect(received[0]).toMatchObject({
        title: 'Title',
        description: 'Description',
        status: 'warning',
        timeout: 5000,
        links: [{ label: 'Link', href: '/test' }],
      });
    });
  });

  describe('close', () => {
    it('should notify onClose listeners when close() is called', () => {
      const onCloseFn = jest.fn();

      const received: Array<{ onClose: (cb: () => void) => void }> = [];
      forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      const result = forwarder.post({ title: 'Test' });
      received[0].onClose(onCloseFn);
      result.close();

      expect(onCloseFn).toHaveBeenCalledTimes(1);
    });

    it('should only close once even if called multiple times', () => {
      const onCloseFn = jest.fn();

      const received: Array<{ onClose: (cb: () => void) => void }> = [];
      forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      const result = forwarder.post({ title: 'Test' });
      received[0].onClose(onCloseFn);
      result.close();
      result.close();

      expect(onCloseFn).toHaveBeenCalledTimes(1);
    });

    it('should remove toast from replay buffer', () => {
      const result = forwarder.post({ title: 'Test' });
      result.close();

      // New subscriber should not receive the closed toast
      const received: Array<{ key: string }> = [];
      forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      expect(received).toHaveLength(0);
    });

    it('should immediately call onClose callback if already closed', () => {
      const onCloseFn = jest.fn();

      const received: Array<{ onClose: (cb: () => void) => void }> = [];
      forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      const result = forwarder.post({ title: 'Test' });
      result.close();

      // Register callback after close - should fire immediately
      received[0].onClose(onCloseFn);
      expect(onCloseFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('toast$ replay', () => {
    it('should replay recent toasts to new subscribers', async () => {
      forwarder.post({ title: 'Toast 1' });
      forwarder.post({ title: 'Toast 2' });

      const received: Array<{ title: unknown }> = [];

      await new Promise<void>(resolve => {
        const subscription = forwarder.toast$().subscribe({
          next: toast => {
            received.push(toast);
            // After receiving replayed toasts, unsubscribe
            if (received.length === 2) {
              subscription.unsubscribe();
              resolve();
            }
          },
        });
        // Also resolve after a short timeout in case no toasts are replayed
        setTimeout(() => resolve(), 100);
      });

      expect(received).toHaveLength(2);
      expect(received[0].title).toBe('Toast 1');
      expect(received[1].title).toBe('Toast 2');
    });

    it('should not replay closed toasts to new subscribers', async () => {
      const result1 = forwarder.post({ title: 'Toast 1' });
      forwarder.post({ title: 'Toast 2' });

      result1.close();

      const received: Array<{ title: unknown }> = [];

      await new Promise<void>(resolve => {
        const subscription = forwarder.toast$().subscribe({
          next: toast => {
            received.push(toast);
            subscription.unsubscribe();
            resolve();
          },
        });
        setTimeout(() => resolve(), 100);
      });

      expect(received).toHaveLength(1);
      expect(received[0].title).toBe('Toast 2');
    });

    it('should limit replay buffer size', async () => {
      // Post more than maxBufferSize (10) toasts
      for (let i = 0; i < 15; i++) {
        forwarder.post({ title: `Toast ${i}` });
      }

      const received: Array<{ title: unknown }> = [];

      await new Promise<void>(resolve => {
        const subscription = forwarder.toast$().subscribe({
          next: toast => {
            received.push(toast);
            if (received.length === 10) {
              subscription.unsubscribe();
              resolve();
            }
          },
        });
        setTimeout(() => resolve(), 100);
      });

      // Should only have last 10 toasts
      expect(received).toHaveLength(10);
      expect(received[0].title).toBe('Toast 5');
      expect(received[9].title).toBe('Toast 14');
    });
  });

  describe('subscription cleanup', () => {
    it('should stop receiving toasts after unsubscribe', () => {
      const received: Array<{ title: unknown }> = [];

      const subscription = forwarder.toast$().subscribe(toast => {
        received.push(toast);
      });

      forwarder.post({ title: 'Before unsubscribe' });
      subscription.unsubscribe();
      forwarder.post({ title: 'After unsubscribe' });

      expect(received).toHaveLength(1);
      expect(received[0].title).toBe('Before unsubscribe');
    });
  });
});
