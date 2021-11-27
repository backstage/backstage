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

import { AbortSignal } from 'node-abort-controller';
import { Context, ContextDecorator } from './types';

/**
 * A context that implements various abort related functionality.
 */
export class AbortContext implements Context {
  /**
   * Abort either when the parent aborts, or after the given timeout has
   * expired.
   */
  static forTimeoutMillis(ctx: Context, timeout: number): Context {
    const desiredDeadline = new Date(Date.now() + timeout);
    const actualDeadline =
      ctx.deadline && ctx.deadline < desiredDeadline
        ? ctx.deadline
        : desiredDeadline;

    if (ctx.abortSignal.aborted) {
      if (ctx.deadline && desiredDeadline === actualDeadline) {
        return ctx;
      }
      return new AbortContext(ctx, ctx.abortSignal, actualDeadline);
    }

    const controller = new AbortController();

    const timeoutHandle = setTimeout(() => {
      controller.abort();
    }, timeout);

    const abort = () => {
      ctx.abortSignal.removeEventListener('abort', abort);
      clearTimeout(timeoutHandle);
      controller.abort();
    };

    ctx.abortSignal.addEventListener('abort', abort);

    return new AbortContext(ctx, controller.signal, actualDeadline);
  }

  /**
   * Abort either when the parent aborts, or when the given signal is triggered.
   */
  static forSignal(ctx: Context, signal: AbortSignal): Context {
    // If the parent context was already aborted, it is fine to reuse as-is
    if (ctx.abortSignal.aborted) {
      return ctx;
    }

    const controller = new AbortController();
    const abort = controller.abort.bind(controller);

    // If the incoming signal was already aborted, let's trigger the new one as
    // well
    if (signal.aborted) {
      abort();
    } else {
      ctx.abortSignal.addEventListener('abort', abort);
      signal.addEventListener('abort', abort);
    }

    return new AbortContext(ctx, controller.signal, ctx.deadline);
  }

  private constructor(
    private readonly parent: Context,
    readonly abortSignal: AbortSignal,
    readonly deadline: Date | undefined,
  ) {}

  value<T = unknown>(key: string | symbol): T | undefined {
    return this.parent.value(key);
  }

  use(...items: ContextDecorator[]): Context {
    return items.reduce((prev, curr) => curr(prev), this as Context);
  }
}
