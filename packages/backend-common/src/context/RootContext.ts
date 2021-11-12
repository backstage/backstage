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

import { DateTime, Duration } from 'luxon';
import { AbortSignal } from 'node-abort-controller';
import {
  abortManually,
  abortOnTimeout,
  ContextAbortState,
} from './features/abort';
import {
  ContextValues,
  findInContextValues,
  unshiftContextValues,
} from './features/values';
import { Context, ContextDecorator } from './types';

// The context value key used for holding abort related state
const abortKey = Symbol('Context.abort');

/**
 * A context that is meant to be passed as a ctx variable down the call chain,
 * to pass along scoped information and abort signals.
 *
 * @public
 */
export class RootContext implements Context {
  /**
   * Creates a root context.
   *
   * @remarks
   *
   * This should normally only be called near the root of an application. The
   * created context is meant to be passed down into deeper levels, which may
   * or may not make derived contexts out of it.
   */
  static create() {
    return new RootContext(undefined).withValue<ContextAbortState>(
      abortKey,
      abortManually(),
    );
  }

  /**
   * {@inheritdoc Context.abortSignal}
   */
  public get abortSignal(): AbortSignal {
    return this.value<ContextAbortState>(abortKey)!.signal;
  }

  /**
   * {@inheritdoc Context.abortPromise}
   */
  public get abortPromise(): Promise<void> {
    return this.value<ContextAbortState>(abortKey)!.promise;
  }

  /**
   * {@inheritdoc Context.deadline}
   */
  public get deadline(): DateTime | undefined {
    return this.value<ContextAbortState>(abortKey)!.deadline;
  }

  private constructor(private readonly values: ContextValues) {}

  /**
   * {@inheritdoc Context.withAbort}
   */
  withAbort(): { ctx: Context; abort: () => void } {
    const state = abortManually(this.value<ContextAbortState>(abortKey));
    return {
      ctx: this.withValue(abortKey, state),
      abort: state.abort,
    };
  }

  /**
   * {@inheritdoc Context.withTimeout}
   */
  withTimeout(timeout: Duration): Context {
    return this.withValue<ContextAbortState>(abortKey, previous =>
      abortOnTimeout(timeout, previous),
    );
  }

  /**
   * {@inheritdoc Context.with}
   */
  with(...items: ContextDecorator[]): Context {
    return items.reduce<Context>((prev, curr) => curr(prev), this);
  }

  /**
   * {@inheritdoc Context.withValue}
   */
  withValue<T = unknown>(
    key: string | symbol,
    value: T | ((previous: T | undefined) => T),
  ): Context {
    return new RootContext(unshiftContextValues(this.values, key, value));
  }

  /**
   * {@inheritdoc Context.value}
   */
  value<T = unknown>(key: string | symbol): T | undefined {
    return findInContextValues<T>(this.values, key);
  }
}
