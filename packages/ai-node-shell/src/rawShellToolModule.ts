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

import { spawn } from 'node:child_process';
import type { ToolDispatchInput, ToolModule } from '@backstage/ai-node/alpha';

/** The arguments the `run` tool accepts. @alpha */
export type RawShellArguments = Readonly<{
  /** The command line, executed through the host shell. */
  command: string;
  /** Standard input for the command. */
  stdin?: string;
}>;

/** What one `run` call returns. @alpha */
export type RawShellResult = Readonly<{
  /** Captured standard output. */
  stdout: string;
  /** Captured standard error. */
  stderr: string;
  /** The command's exit code, or null when it was killed by a signal. */
  exitCode: number | null;
  /** True when the host killed the command because it exceeded the limit. */
  timedOut: boolean;
}>;

/** Options for {@link createRawShellToolModule}. @alpha */
export type RawShellToolOptions = Readonly<{
  /**
   * Shell binary used to interpret the command line. Defaults to `/bin/sh` on
   * POSIX hosts and `cmd.exe` on Windows (`/d /s /c`).
   */
  shell?: { command: string; args: readonly string[] };
  /** Working directory for the command. Defaults to the backend's own. */
  cwd?: string;
  /** Wall-clock ceiling for one command. Defaults to 120 seconds. */
  timeoutMs?: number;
  /** Maximum captured output per stream. Defaults to 256 KiB. */
  maxOutputBytes?: number;
  /** Extra environment for the command; defaults to none beyond the host's. */
  env?: Readonly<Record<string, string>>;
}>;

/**
 * A raw shell tool server: one `run` tool that executes a command line on the
 * backend host.
 *
 * @remarks
 * UNSANDBOXED BY DESIGN, and deliberately so. The command comes from the model
 * and executes with the backend process's own identity, so it can read and
 * write whatever that process can, reach the network, and spawn further
 * processes. The mandatory guardrails are process-level, not a sandbox: the
 * attempt is authorized against `ai.tool.use` with the caller's credentials,
 * the session fence must be current, and the decision and outcome are
 * journaled. Run this only on hosts that are meant to give the model a shell —
 * there is no allowlist, no command filtering and no argument validation,
 * because raw is the point.
 *
 * The audit boundary is identity-level: `serverId`/`toolName`, the session,
 * the acting principal, the decision and the outcome are recorded, and the
 * command line is NEVER journaled. Free text cannot be proven secret-free, so
 * it stays out of the journal entirely — a model that echoes a token stays out
 * of the audit trail. That is accountability without reproducibility: the
 * trail proves who ran something, not what it was. A deployment that needs
 * command-level audit should build a scoped tool with structured arguments
 * (a fixed operation set, validated parameters) instead of this one.
 *
 * A command that exits non-zero reports a `failed` outcome with its captured
 * output; a command killed by {@link RawShellToolOptions.timeoutMs} reports
 * `cancelled` with `timedOut: true`.
 *
 * @alpha
 */
export function createRawShellToolModule(
  options: RawShellToolOptions = {},
): ToolModule {
  const shell = options.shell ?? defaultShell();
  const timeoutMs = options.timeoutMs ?? 120_000;
  const maxOutputBytes = options.maxOutputBytes ?? 256 * 1024;

  return {
    id: 'shell',
    tools: [
      {
        name: 'run',
        description:
          'Run a shell command on the backend host and return its output. The command runs unsandboxed with the backend process identity.',
      },
    ],
    run: async ({ arguments: rawArguments }: ToolDispatchInput) => {
      const parsed = parseArguments(rawArguments);
      if (parsed === undefined) {
        return {
          outcome: 'failed',
          value: {
            error:
              'invalid arguments: expected { command: string, stdin?: string }',
          },
        };
      }
      return execute(parsed, { shell, timeoutMs, maxOutputBytes, options });
    },
  };
}

/**
 * The reference raw shell tool server with default limits.
 *
 * @remarks
 * Prefer {@link createRawShellToolModule} when the deployment needs its own
 * working directory, timeout or shell; this constant is the zero-configuration
 * registration.
 *
 * @alpha
 */
export const rawShellToolModule: ToolModule = createRawShellToolModule();

function defaultShell(): { command: string; args: readonly string[] } {
  if (process.platform === 'win32') {
    return {
      command: process.env.ComSpec ?? 'cmd.exe',
      args: ['/d', '/s', '/c'],
    };
  }
  return { command: '/bin/sh', args: ['-c'] };
}

function parseArguments(value: unknown): RawShellArguments | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const candidate = value as { command?: unknown; stdin?: unknown };
  if (
    typeof candidate.command !== 'string' ||
    candidate.command.trim().length === 0
  ) {
    return undefined;
  }
  if (candidate.stdin !== undefined && typeof candidate.stdin !== 'string') {
    return undefined;
  }
  return {
    command: candidate.command,
    ...(candidate.stdin === undefined ? {} : { stdin: candidate.stdin }),
  };
}

function execute(
  args: RawShellArguments,
  context: {
    shell: { command: string; args: readonly string[] };
    timeoutMs: number;
    maxOutputBytes: number;
    options: RawShellToolOptions;
  },
): Promise<Awaited<ReturnType<NonNullable<ToolModule['run']>>>> {
  return new Promise(resolve => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;
    const child = spawn(
      context.shell.command,
      [...context.shell.args, args.command],
      {
        cwd: context.options.cwd,
        env: {
          ...process.env,
          ...context.options.env,
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    );
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, context.timeoutMs);
    const append = (current: string, chunk: Buffer) => {
      const next = current + chunk.toString('utf8');
      return next.length > context.maxOutputBytes
        ? next.slice(0, context.maxOutputBytes)
        : next;
    };
    child.stdout.on('data', (chunk: Buffer) => {
      stdout = append(stdout, chunk);
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr = append(stderr, chunk);
    });
    const settle = (
      result: Awaited<ReturnType<NonNullable<ToolModule['run']>>>,
    ) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    child.on('error', error => {
      settle({
        outcome: 'failed',
        value: {
          error: `the shell command could not start: ${error.message}`,
          timedOut: false,
        },
      });
    });
    child.on('close', code => {
      const value: RawShellResult = {
        stdout,
        stderr,
        exitCode: code,
        timedOut,
      };
      // A timeout is a cancelled attempt: the host ended the work. A non-zero
      // exit is a failure the model can read and react to.
      let outcome: 'completed' | 'failed' | 'cancelled' = 'failed';
      if (timedOut) {
        outcome = 'cancelled';
      } else if (code === 0) {
        outcome = 'completed';
      }
      settle({ outcome, value });
    });
    // A command may exit before its input is written (`printf`, `true`), which
    // surfaces as EPIPE on the child's stdin: the command's own result is the
    // answer, so the write failure is not.
    child.stdin.on('error', () => {});
    try {
      child.stdin.end(args.stdin ?? '');
    } catch {
      /* the child is already gone */
    }
  });
}
