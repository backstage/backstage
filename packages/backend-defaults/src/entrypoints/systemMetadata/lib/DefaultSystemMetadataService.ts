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

import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  BackstageInstance,
  SystemMetadataService,
} from '@backstage/backend-plugin-api';
import { Observable } from '@backstage/types';
import z from 'zod';
import ObservableImpl from 'zen-observable';

const targetObjectSchema = z.object({
  internal: z.string(),
  external: z.string(),
});

/**
 * A basic implementation of ReactiveX behavior subjects.
 *
 * A subject is a convenient way to create an observable when you want
 * to fan out a single value to all subscribers.
 *
 * The BehaviorSubject will emit the most recently emitted value or error
 * whenever a new observer subscribes to the subject.
 *
 * See http://reactivex.io/documentation/subject.html
 *
 * FORKED FROM core-app-api - where should this live?
 */

export class BehaviorSubject<T>
  implements Observable<T>, ZenObservable.SubscriptionObserver<T>
{
  private isClosed: boolean;
  private currentValue: T;
  private terminatingError: Error | undefined;
  private readonly observable: Observable<T>;

  constructor(value: T) {
    this.isClosed = false;
    this.currentValue = value;
    this.terminatingError = undefined;
    this.observable = new ObservableImpl<T>(subscriber => {
      if (this.isClosed) {
        if (this.terminatingError) {
          subscriber.error(this.terminatingError);
        } else {
          subscriber.complete();
        }
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

  [Symbol.observable]() {
    return this;
  }

  get closed() {
    return this.isClosed;
  }

  next(value: T) {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    this.currentValue = value;
    this.subscribers.forEach(subscriber => subscriber.next(value));
  }

  error(error: Error) {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    this.isClosed = true;
    this.terminatingError = error;
    this.subscribers.forEach(subscriber => subscriber.error(error));
  }

  complete() {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    this.isClosed = true;
    this.subscribers.forEach(subscriber => subscriber.complete());
  }

  subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
  subscribe(
    onNext: (value: T) => void,
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription;
  subscribe(
    onNext: ZenObservable.Observer<T> | ((value: T) => void),
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription {
    const observer =
      typeof onNext === 'function'
        ? {
            next: onNext,
            error: onError,
            complete: onComplete,
          }
        : onNext;

    return this.observable.subscribe(observer);
  }
}

/**
 * @alpha
 */
export class DefaultSystemMetadataService implements SystemMetadataService {
  private instance$: BehaviorSubject<BackstageInstance[]>;
  constructor(
    private options: { logger: LoggerService; config: RootConfigService },
  ) {
    const getInstances = () => {
      const endpoints =
        options.config.getOptionalConfigArray('discovery.instances') ?? [];
      const instances: BackstageInstance[] = [];
      for (const endpoint of endpoints) {
        const baseUrl = endpoint.getOptional('baseUrl');
        if (baseUrl) {
          if (typeof baseUrl === 'string') {
            instances.push({ internalUrl: baseUrl, externalUrl: baseUrl });
          } else {
            const parseAttempt = targetObjectSchema.safeParse(baseUrl);
            if (parseAttempt.success) {
              const { internal, external } = parseAttempt.data;
              instances.push({
                internalUrl: internal,
                externalUrl: external,
              });
            }
          }
        }
      }
      return instances;
    };
    this.instance$ = new BehaviorSubject(getInstances());
    this.options.config.subscribe?.(() => {
      this.instance$.next(getInstances());
    });
  }

  public static create(pluginEnv: {
    logger: LoggerService;
    config: RootConfigService;
  }) {
    return new DefaultSystemMetadataService(pluginEnv);
  }

  instances(): Observable<BackstageInstance[]> {
    return this.instance$;
  }
}
