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

import {
  ToastApi,
  ToastApiMessage,
  ToastApiMessageWithKey,
  ToastApiPostResult,
} from '@backstage/frontend-plugin-api';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

let toastKeyCounter = 0;

/**
 * Generates a unique key for a toast message.
 */
function generateToastKey(): string {
  toastKeyCounter += 1;
  return `toast-${toastKeyCounter}-${Date.now()}`;
}

/**
 * A simple publish subject for broadcasting values to subscribers.
 */
class PublishSubject<T> {
  private subscribers = new Set<ZenObservable.SubscriptionObserver<T>>();
  private isClosed = false;

  private readonly observable = new ObservableImpl<T>(subscriber => {
    if (this.isClosed) {
      subscriber.complete();
      return () => {};
    }
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  next(value: T) {
    if (this.isClosed) {
      throw new Error('PublishSubject is closed');
    }
    this.subscribers.forEach(subscriber => subscriber.next(value));
  }

  subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription {
    return this.observable.subscribe(observer);
  }

  /**
   * Creates an Observable that replays buffered values and then subscribes to live updates.
   */
  asObservable(replayBuffer: T[] = []): Observable<T> {
    return new ObservableImpl<T>(subscriber => {
      // Replay buffered values
      for (const value of replayBuffer) {
        subscriber.next(value);
      }
      // Subscribe to live updates
      return this.subscribe(subscriber);
    });
  }
}

/**
 * Base implementation for the ToastApi that forwards toast messages to consumers.
 *
 * Recent toasts are buffered and replayed to new subscribers to prevent
 * missing toasts that were posted before subscription.
 *
 * @internal
 */
export class ToastApiForwarder implements ToastApi {
  private readonly subject = new PublishSubject<ToastApiMessageWithKey>();
  private readonly recentToasts: ToastApiMessageWithKey[] = [];
  private readonly closedKeys = new Set<string>();
  private readonly maxBufferSize = 10;

  post(toast: ToastApiMessage): ToastApiPostResult {
    const key = generateToastKey();
    const closeCallbacks: Array<() => void> = [];
    let closed = false;

    const close = () => {
      if (closed) return;
      closed = true;

      // Track closed keys to prevent replaying dismissed toasts
      this.closedKeys.add(key);

      // Remove from recent buffer if still there
      const index = this.recentToasts.findIndex(t => t.key === key);
      if (index !== -1) {
        this.recentToasts.splice(index, 1);
      }

      // Clean up old closed keys when buffer is cleared
      if (this.recentToasts.length === 0) {
        this.closedKeys.clear();
      }

      // Notify registered listeners (e.g. the toast display)
      closeCallbacks.forEach(fn => fn());
    };

    const onClose = (callback: () => void) => {
      if (closed) {
        callback();
      } else {
        closeCallbacks.push(callback);
      }
    };

    const toastWithKey: ToastApiMessageWithKey = {
      ...toast,
      key,
      close,
      onClose,
    };

    this.recentToasts.push(toastWithKey);
    if (this.recentToasts.length > this.maxBufferSize) {
      this.recentToasts.shift();
    }
    this.subject.next(toastWithKey);

    return { close };
  }

  toast$(): Observable<ToastApiMessageWithKey> {
    // Filter out any toasts that were closed to handle race conditions
    const activeToasts = this.recentToasts.filter(
      t => !this.closedKeys.has(t.key),
    );
    return this.subject.asObservable(activeToasts);
  }
}
