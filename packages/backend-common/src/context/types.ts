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

/**
 * A function that accepts a context and produces a new, derived context from,
 * decorated with some specific behavior.
 *
 * @public
 */
export type ContextDecorator = (ctx: Context) => Context;

/**
 * A context that is meant to be passed as a ctx variable down the call chain,
 * to pass along scoped information and abort signals.
 *
 * @public
 */
export interface Context {
  /**
   * Returns an abort signal that triggers when the current context or any of
   * its parents signal for it.
   */
  readonly abortSignal: AbortSignal;

  /**
   * Returns a promise that resolves when the current context or any of its
   * parents signal to abort.
   */
  readonly abortPromise: Promise<void>;

  /**
   * The point in time when the current context shall time out and abort, if
   * applicable.
   */
  readonly deadline: DateTime | undefined;

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the current layer calls the returned
   * abort function.
   *
   * @returns A derived context, and the function that triggers it to abort.
   */
  withAbort(): { ctx: Context; abort: () => void };

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the given amount of time has passed.
   * This may affect the deadline.
   *
   * @param timeout - The duration of time, after which the derived context
   *                  will signal to abort.
   * @returns A derived context with an updated deadline
   */
  withTimeout(timeout: Duration): Context;

  /**
   * Decorates this context with one or more behaviors.
   *
   * @remarks
   *
   * The decorators are applied in the order that they are given.
   *
   * @param decorators - The decorators to apply
   * @returns A derived context with the relevant behaviors
   */
  with(...decorators: ContextDecorator[]): Context;

  /**
   * Creates a derived context, which has a specific key-value pair set as well
   * as all key-value pairs set in the original context.
   *
   * @param key - The key of the value to set
   * @param value - The value, or a function that accepts the previous value (or
   *                undefined if not set yet) and computes the new value
   */
  withValue<T = unknown>(
    key: string | symbol,
    value: T | ((previous: T | undefined) => T),
  ): Context;

  /**
   * Attempts to get a stored value by key from the context.
   *
   * @param key - The key of the value to get
   * @returns The associated value, or undefined if not set
   */
  value<T = unknown>(key: string | symbol): T | undefined;
}
