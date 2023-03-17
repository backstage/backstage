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

import ObservableImpl from 'zen-observable';

/**
 * A simple behavior subject that doesn't implement the observable interface itself,
 * and assumes that the observable is never completed.
 */
export class SimpleBehaviorSubject<T> {
  private currentValue: T;
  private terminatingError: Error | undefined;

  readonly observable: ObservableImpl<T>;

  constructor(value: T) {
    this.currentValue = value;
    this.terminatingError = undefined;
    this.observable = new ObservableImpl<T>(subscriber => {
      if (this.terminatingError) {
        subscriber.error(this.terminatingError);
        return () => {};
      }

      subscriber.next(this.currentValue);

      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }

  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<T>
  >();

  next(value: T) {
    this.currentValue = value;
    this.subscribers.forEach(subscriber => subscriber.next(value));
  }

  error(error: Error) {
    this.terminatingError = error;
    this.subscribers.forEach(subscriber => subscriber.error(error));
    this.subscribers.clear();
  }
}
