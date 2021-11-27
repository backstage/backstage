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
import { AbortSignal } from 'node-abort-controller';
import { AbortContext } from './AbortContext';
import { RootContext } from './RootContext';
import { Context, ContextDecorator } from './types';
import { ValueContext } from './ValueContext';

/**
 * Common context decorators.
 *
 * @public
 */
export class Contexts {
  /**
   * Creates a root context.
   *
   * @remarks
   *
   * This should normally only be called near the root of an application. The
   * created context is meant to be passed down into deeper levels, which may or
   * may not make derived contexts out of it.
   */
  static root(): Context {
    return new RootContext();
  }

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the given controller is aborted.
   *
   * @remarks
   *
   * If the parent context was already aborted, then it is returned as-is.
   *
   * If the given signal was already aborted, then a new already-aborted context
   * is returned.
   *
   * @param signal - An abort signal that you intend to perhaps trigger at some
   *                 later point in time.
   * @returns A decorator that can be passed to {@link Context.use}
   */
  static setAbort(signal: AbortSignal): ContextDecorator {
    return ctx => AbortContext.forSignal(ctx, signal);
  }

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the given amount of time has passed.
   * This may affect the deadline.
   *
   * @param timeout - The duration of time, after which the derived context will
   *                  signal to abort.
   * @returns A decorator that can be passed to {@link Context.use}
   */
  static setTimeoutDuration(timeout: Duration): ContextDecorator {
    return ctx =>
      AbortContext.forTimeoutMillis(ctx, timeout.as('milliseconds'));
  }

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the given amount of time has passed.
   * This may affect the deadline.
   *
   * @param timeout - The number of milliseconds, after which the derived
   *                  context will signal to abort.
   * @returns A decorator that can be passed to {@link Context.use}
   */
  static setTimeoutMillis(timeout: number): ContextDecorator {
    return ctx => AbortContext.forTimeoutMillis(ctx, timeout);
  }

  /**
   * Creates a derived context, which has a specific key-value pair set as well
   * as all key-value pairs that were set in the original context.
   *
   * @param key - The key of the value to set
   * @param value - The value, or a function that accepts the previous value (or
   *                undefined if not set yet) and computes the new value
   * @returns A decorator that can be passed to {@link Context.use}
   */
  static setValue(
    key: string | symbol,
    value: unknown | ((previous: unknown | undefined) => unknown),
  ): ContextDecorator {
    return ctx => {
      const v = typeof value === 'function' ? value(ctx.value(key)) : value;
      return ValueContext.forConstantValue(ctx, key, v);
    };
  }
}
