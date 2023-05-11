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

import { Context } from './types';

/**
 * A context that implements various abort related functionality.
 */
export class AbortContext implements Context {
  /**
   * Abort either when the parent aborts, or after the given timeout has
   * expired.
   *
   * @param ctx - The parent context
   * @param timeout - A timeout value, in milliseconds
   * @returns A new context
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
    const timeoutHandle = setTimeout(abort, timeout);
    ctx.abortSignal.addEventListener('abort', abort);

    function abort() {
      ctx.abortSignal.removeEventListener('abort', abort);
      clearTimeout(timeoutHandle!);
      controller.abort();
    }

    return new AbortContext(ctx, controller.signal, actualDeadline);
  }

  /**
   * Abort either when the parent aborts, or when the given controller is
   * triggered.
   *
   * @remarks
   *
   * If you have access to the controller, this function is more efficient than
   * {@link AbortContext#forSignal}.
   *
   * @param ctx - The parent context
   * @param controller - An abort controller
   * @returns A new context
   */
  static forController(ctx: Context, controller: AbortController): Context {
    // Already aborted context / signal are fine to reuse as-is
    if (ctx.abortSignal.aborted) {
      return ctx;
    } else if (controller.signal.aborted) {
      return new AbortContext(ctx, controller.signal, ctx.deadline);
    }

    function abort() {
      ctx.abortSignal.removeEventListener('abort', abort);
      controller.abort();
    }

    ctx.abortSignal.addEventListener('abort', abort);

    return new AbortContext(ctx, controller.signal, ctx.deadline);
  }

  /**
   * Abort either when the parent aborts, or when the given signal is triggered.
   *
   * @remarks
   *
   * If you have access to the controller and not just the signal,
   * {@link AbortContext#forController} is slightly more efficient to use.
   *
   * @param ctx - The parent context
   * @param signal - An abort signal
   * @returns A new context
   */
  static forSignal(ctx: Context, signal: AbortSignal): Context {
    // Already aborted context / signal are fine to reuse as-is
    if (ctx.abortSignal.aborted) {
      return ctx;
    } else if (signal.aborted) {
      return new AbortContext(ctx, signal, ctx.deadline);
    }

    const controller = new AbortController();

    function abort() {
      ctx.abortSignal.removeEventListener('abort', abort);
      signal.removeEventListener('abort', abort);
      controller.abort();
    }

    ctx.abortSignal.addEventListener('abort', abort);
    signal.addEventListener('abort', abort);

    return new AbortContext(ctx, controller.signal, ctx.deadline);
  }

  private constructor(
    private readonly parent: Context,
    readonly abortSignal: AbortSignal,
    readonly deadline: Date | undefined,
  ) {}

  value<T = unknown>(key: string): T | undefined {
    return this.parent.value(key);
  }
}
