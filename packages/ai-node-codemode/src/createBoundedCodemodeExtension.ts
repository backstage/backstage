/*
 * Copyright 2026 The Backstage Authors
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

/**
 * Default code mode construction for the managed AI service.
 *
 * The `codemode` option of `createAiServiceIntegration` (and of the stock
 * service factory) accepts a host-supplied extension factory; this package
 * provides the default construction hosts wire there: Pi's `codemode`
 * extension over a sandbox whose `start()` enforces a host wall-clock
 * ceiling.
 *
 * @packageDocumentation
 * @alpha
 */

import { createCodemodeExtension } from '@earendil-works/pi-durable/codemode';
import type { Extension } from '@earendil-works/pi-durable';
import {
  CodemodeSandbox,
  type CodemodeRun,
  type CodemodeRunOptions,
} from '@earendil-works/pi-codemode';

/**
 * The host limits of a code mode extension.
 *
 * @alpha
 */
export type BoundedCodemodeLimits = Readonly<{
  /** Host wall-clock ceiling per script execution. Default 300000. */
  readonly timeoutMs?: number;
  /** QuickJS heap limit. Default: no explicit limit. */
  readonly memoryLimitBytes?: number;
}>;

/**
 * A code mode extension and the sandbox backing it. The sandbox is closed
 * with the harness that carries the extension.
 *
 * @alpha
 */
export type BoundedCodemodeExtension = Readonly<{
  /** The `codemode` extension, appended to the caller's registry selection. */
  readonly extension: Extension;
  /** The sandbox running the scripts; `close()` aborts in-flight runs. */
  readonly sandbox: { close(): Promise<void> };
}>;

/**
 * A code mode sandbox whose `start()` enforces a host wall-clock ceiling.
 *
 * @remarks
 *
 * The extension derives a script's deadline from the script's own
 * `// @options {"timeout_ms": ...}` line and passes no timeout otherwise,
 * and `CodemodeSandboxBase.start()` then runs with no deadline at all — a
 * model-written script that keeps pending microtasks alive would run
 * until it is aborted or the sandbox closes. This ceiling bounds every
 * start regardless of what the script declares: a script may lower the
 * deadline, never raise it above the host's. It is wall-clock only, so
 * it does not enter the durable start data and cannot affect replay.
 */
class BoundedCodemodeSandbox extends CodemodeSandbox {
  readonly #hostTimeoutMs: number;

  constructor(
    hostTimeoutMs: number,
    options?: { readonly memoryLimitBytes?: number },
  ) {
    // The ceiling is also the sandbox-level default, so any future path
    // through CodemodeSandboxBase.execute() (whose timeout falls back to
    // the sandbox default) inherits the same host bound; start() keeps
    // its explicit Math.min override for script-declared timeouts.
    super(
      options?.memoryLimitBytes === undefined
        ? { timeoutMs: hostTimeoutMs }
        : {
            timeoutMs: hostTimeoutMs,
            memoryLimitBytes: options.memoryLimitBytes,
          },
    );
    this.#hostTimeoutMs = hostTimeoutMs;
  }

  start(code: string, options: CodemodeRunOptions): CodemodeRun {
    return super.start(code, {
      ...options,
      timeoutMs: Math.min(
        options.timeoutMs ?? Number.POSITIVE_INFINITY,
        this.#hostTimeoutMs,
      ),
    });
  }
}

/**
 * Builds the default code mode extension: Pi's `codemode` extension over a
 * sandbox bounded by the host limits. Pass the result's `extension` and
 * `sandbox` fields to the `codemode` option of `createAiServiceIntegration`
 * or the stock service factory through their `createExtension` callback.
 *
 * @alpha
 */
export function createBoundedCodemodeExtension(
  limits: BoundedCodemodeLimits = {},
): BoundedCodemodeExtension {
  const sandbox = new BoundedCodemodeSandbox(
    limits.timeoutMs ?? 300_000,
    limits,
  );
  return {
    extension: createCodemodeExtension({ sandbox }),
    sandbox,
  };
}
