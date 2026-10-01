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
import fs from 'node:fs';
import path from 'node:path';
import { errorMessage } from './errorMessage';
import { shellQuote as quote } from './shellQuote';
import type { SkillDecision } from './selectSkills';

export interface SkillsInvocation {
  /** Entity ref of the skill, for reporting. */
  ref: string;
  /** Source argument for `skills add`: the skill's own tree URL. */
  source: string;
  agents: string[];
  global: boolean;
  /** Extra environment variables, `GH_HOST` for GitHub Enterprise sources. */
  env: Record<string, string>;
}

/** Runs `skills` with the given arguments and resolves with its exit code. */
export type SkillsRunner = (
  args: string[],
  env: Record<string, string>,
  cwd?: string,
) => Promise<number>;

/** Plans one `skills add` per distinct skill source. */
export function planSkillsInvocations(
  decisions: SkillDecision[],
  options: { agents: string[]; global: boolean },
): SkillsInvocation[] {
  const bySource = new Map<string, SkillsInvocation>();
  const ordered = [...decisions].sort((a, b) => a.ref.localeCompare(b.ref));
  for (const decision of ordered) {
    if (decision.status !== 'selected' || !decision.source) continue;
    const { installUrl, ghHost } = decision.source;
    if (bySource.has(installUrl)) continue;
    bySource.set(installUrl, {
      ref: decision.ref,
      source: installUrl,
      agents: options.agents,
      global: options.global,
      env: ghHost ? { GH_HOST: ghHost } : {},
    });
  }
  return [...bySource.values()].sort((a, b) =>
    a.source.localeCompare(b.source),
  );
}

export function buildSkillsArgs(invocation: SkillsInvocation): string[] {
  return [
    'add',
    invocation.source,
    ...invocation.agents.flatMap(agent => ['-a', agent]),
    '-y',
    ...(invocation.global ? ['-g'] : []),
  ];
}

export function formatSkillsCommand(invocation: SkillsInvocation): string {
  const env = Object.entries(invocation.env).map(
    ([name, value]) => `${name}=${quote(value)}`,
  );
  return [...env, 'skills', ...buildSkillsArgs(invocation).map(quote)].join(
    ' ',
  );
}

/** The oldest Node.js version that the pinned `skills` package supports. */
const MIN_SKILLS_NODE = [22, 20, 0];

/** Throws with a clear message when this Node.js is too old to run `skills`. */
export function assertSkillsNodeVersion(
  version: string = process.versions.node,
): void {
  const current = version.split('.').map(Number);
  for (let i = 0; i < MIN_SKILLS_NODE.length; i++) {
    const have = current[i] ?? 0;
    if (have !== MIN_SKILLS_NODE[i]) {
      if (have > MIN_SKILLS_NODE[i]) return;
      throw new Error(
        `Installing skills requires Node.js ${MIN_SKILLS_NODE.join(
          '.',
        )} or later, but you are running ${version}`,
      );
    }
  }
}

/** Runs one `skills add` per invocation, continuing past failures. */
export async function runSkills(
  invocations: SkillsInvocation[],
  run: SkillsRunner,
  log: (message: string) => void = message =>
    process.stderr.write(`${message}\n`),
  cwd?: string,
): Promise<{ failed: string[] }> {
  const failed: string[] = [];
  for (const invocation of invocations) {
    try {
      const code = await run(buildSkillsArgs(invocation), invocation.env, cwd);
      if (code !== 0) {
        failed.push(invocation.ref);
        log(`skills add failed for ${invocation.ref} (exit code ${code})`);
      }
    } catch (error) {
      failed.push(invocation.ref);
      log(`skills add failed for ${invocation.ref}: ${errorMessage(error)}`);
    }
  }
  return { failed };
}

/** Finds the `skills` CLI entry point inside this module's own dependencies. */
export function resolveSkillsBin(): string {
  const packageJsonPath = require.resolve('skills/package.json');
  const pkg: { bin?: string | Record<string, string> } = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8'),
  );
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.skills;
  if (!bin) {
    throw new Error(
      'The installed "skills" package does not declare a skills binary',
    );
  }
  return path.resolve(path.dirname(packageJsonPath), bin);
}

/**
 * Creates a runner for `skills`. In quiet mode the output of `skills` on
 * standard output is discarded, so that nothing but the caller's own output
 * reaches it, and standard input is closed so that it can never prompt.
 */
export function createSkillsRunner(
  bin: string = resolveSkillsBin(),
  options: { quiet?: boolean } = {},
): SkillsRunner {
  return (args, env, cwd) =>
    new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [bin, ...args], {
        stdio: options.quiet ? ['ignore', 'ignore', 'inherit'] : 'inherit',
        cwd,
        // skills reports telemetry that can include the source repository
        // path, so it is off unless the user has set DISABLE_TELEMETRY.
        env: { DISABLE_TELEMETRY: '1', ...process.env, ...env },
      });
      child.on('error', reject);
      child.on('close', code => resolve(code ?? 1));
    });
}
