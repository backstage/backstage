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
 * Bounds of the default code mode construction, driven directly against
 * the sandbox: the host wall-clock ceiling ends a script that never
 * settles (the base sandbox would run it until aborted or closed), a
 * script-declared deadline may only lower it, and the memory limit ends
 * runaway allocation. The wiring through the managed service — the
 * extension appended to the caller's registry, the sandbox closed with
 * the harness — is covered by @backstage/ai-node's integration suite,
 * which consumes this package as its `createExtension` default.
 */
import type { CodemodeSandbox } from '@earendil-works/pi-codemode';
import { createBoundedCodemodeExtension } from './createBoundedCodemodeExtension';

/**
 * The bounds tests drive the sandbox's `start()` directly; the public type
 * exposes only `close()` because wiring sites never call `start()` themselves.
 */
function sandboxOf(built: ReturnType<typeof createBoundedCodemodeExtension>) {
  return built.sandbox as CodemodeSandbox;
}

// Keeps pending microtasks alive while still executing, so only the
// deadline can end it — the same shape the integration suite pins.
const NEVER_SETTLES = 'for (;;) { await null; }';

function startOptions(timeoutMs?: number) {
  return {
    startedAt: Date.now(),
    seed: 1,
    onCall: () => {
      /* The scripts under test never issue calls. */
    },
    ...(timeoutMs === undefined ? {} : { timeoutMs }),
  };
}

describe('createBoundedCodemodeExtension', () => {
  it('builds an extension named codemode with a closeable sandbox', async () => {
    const built = createBoundedCodemodeExtension();
    expect(built.extension.name).toBe('codemode');
    await expect(built.sandbox.close()).resolves.toBeUndefined();
  });

  it('bounds a never-settling script by the host wall-clock ceiling', async () => {
    const built = createBoundedCodemodeExtension({ timeoutMs: 250 });
    try {
      const started = Date.now();
      // No script-declared deadline: the base sandbox would run forever.
      const run = sandboxOf(built).start(NEVER_SETTLES, startOptions());
      const result = await run.result;
      expect(result).toMatchObject({ ok: false, error: { kind: 'timeout' } });
      // The ceiling, not a retry policy, ended it: well under twice the
      // bound.
      expect(Date.now() - started).toBeLessThan(500);
    } finally {
      await built.sandbox.close();
    }
  });

  it('clamps a script-declared deadline above the host ceiling', async () => {
    const built = createBoundedCodemodeExtension({ timeoutMs: 250 });
    try {
      // The script declares ten seconds; the host ceiling is 250ms.
      const run = sandboxOf(built).start(NEVER_SETTLES, startOptions(10_000));
      const result = await run.result;
      expect(result).toMatchObject({ ok: false, error: { kind: 'timeout' } });
    } finally {
      await built.sandbox.close();
    }
  });

  it('honors a script-declared deadline below the host ceiling', async () => {
    const built = createBoundedCodemodeExtension({ timeoutMs: 30_000 });
    try {
      const started = Date.now();
      const run = sandboxOf(built).start(NEVER_SETTLES, startOptions(250));
      const result = await run.result;
      expect(result).toMatchObject({ ok: false, error: { kind: 'timeout' } });
      expect(Date.now() - started).toBeLessThan(2_000);
    } finally {
      await built.sandbox.close();
    }
  });

  it('ends runaway allocation at the memory limit', async () => {
    const built = createBoundedCodemodeExtension({
      timeoutMs: 60_000,
      memoryLimitBytes: 8 * 1024 * 1024,
    });
    try {
      const run = sandboxOf(built).start(
        "const a = []; for (;;) { a.push('0123456789abcdef'); }",
        startOptions(),
      );
      const result = await run.result;
      expect(result.ok).toBe(false);
      // QuickJS surfaces the heap limit as the script's error, so the
      // script is valid and the message is the allocation failure.
      expect((result as { error: { message: string } }).error.message).toMatch(
        /out of memory|memory/i,
      );
    } finally {
      await built.sandbox.close();
    }
  });
});
