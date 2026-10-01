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

import fs from 'node:fs';
import path from 'node:path';
import { shellQuote } from './shellQuote';

/** Marks the hook entry that this module owns, so that it can be replaced. */
const HOOK_MARKER = 'ai skills sync --hook';
const SESSION_START_MATCHER = 'startup|resume';
const HOOK_TIMEOUT_SECONDS = 120;

/**
 * Project-level hook files of the supported agents, relative to the project
 * root. Both use the same `hooks.SessionStart` format.
 *
 * - Claude Code: https://code.claude.com/docs/en/hooks. Personal, uncommitted
 *   project hooks go in `.claude/settings.local.json`.
 * - Codex: https://learn.chatgpt.com/docs/hooks. Project hooks go in
 *   `.codex/hooks.json` and must be trusted with `/hooks` before they run.
 *
 * Cursor is not supported: its project hooks (`.cursor/hooks.json`, see
 * https://cursor.com/docs/agent/hooks) are meant to be committed and share
 * between a team, which does not fit a command with machine-specific paths.
 */
const HOOK_FILES: Record<string, string> = {
  'claude-code': path.join('.claude', 'settings.local.json'),
  codex: path.join('.codex', 'hooks.json'),
};

export interface HookCommandOptions {
  /** The Node.js binary that runs the CLI. */
  execPath: string;
  /** The entry point of the CLI that runs `ai hooks install`. */
  scriptPath: string;
  agent: string;
  instance?: string;
}

/** Builds the shell command that the agent hook runs. */
export function buildHookCommand(options: HookCommandOptions): string {
  return [
    options.execPath,
    options.scriptPath,
    'ai',
    'skills',
    'sync',
    '--hook',
    '--agent',
    options.agent,
    ...(options.instance ? ['--instance', options.instance] : []),
  ]
    .map(shellQuote)
    .join(' ');
}

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function mergeHook(existing: unknown, command: string, file: string) {
  const fail = (message: string): never => {
    throw new Error(`Cannot update ${file}: ${message}`);
  };
  if (!isObject(existing)) {
    return fail('it must contain a JSON object');
  }
  const hooks = existing.hooks ?? {};
  if (!isObject(hooks)) {
    return fail('"hooks" must be an object');
  }
  const sessionStart = hooks.SessionStart ?? [];
  if (!Array.isArray(sessionStart)) {
    return fail('"hooks.SessionStart" must be an array');
  }

  const kept: unknown[] = [];
  for (const group of sessionStart) {
    if (!isObject(group) || !Array.isArray(group.hooks)) {
      return fail('each "hooks.SessionStart" entry must have a "hooks" array');
    }
    const remaining = group.hooks.filter(
      hook =>
        !(
          isObject(hook) &&
          typeof hook.command === 'string' &&
          hook.command.includes(HOOK_MARKER)
        ),
    );
    if (remaining.length > 0) {
      kept.push({ ...group, hooks: remaining });
    }
  }
  kept.push({
    matcher: SESSION_START_MATCHER,
    hooks: [{ type: 'command', command, timeout: HOOK_TIMEOUT_SECONDS }],
  });
  return { ...existing, hooks: { ...hooks, SessionStart: kept } };
}

export interface InstallHooksOptions {
  agents: string[];
  /** The project root that the hook files are written under. */
  rootDir: string;
  execPath: string;
  scriptPath: string;
  instance?: string;
  dryRun?: boolean;
}

export interface InstallHooksResult {
  agent: string;
  file: string;
  written: boolean;
  /** The resulting file content, set on a dry run. */
  json?: string;
}

/**
 * Adds or replaces the session start hook for each agent. Everything is
 * validated and merged before the first file is written.
 */
export async function installHooks(
  options: InstallHooksOptions,
): Promise<InstallHooksResult[]> {
  const unsupported = options.agents.filter(agent => !HOOK_FILES[agent]);
  if (unsupported.length > 0) {
    throw new Error(
      `${unsupported
        .map(agent => `hooks are not supported for ${agent} yet`)
        .join('; ')}. Supported agents: ${Object.keys(HOOK_FILES).join(', ')}`,
    );
  }

  const planned = [...new Set(options.agents)].map(agent => {
    const file = path.join(options.rootDir, HOOK_FILES[agent]);
    const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    let existing: unknown = {};
    if (text.trim()) {
      try {
        existing = JSON.parse(text);
      } catch {
        throw new Error(`Cannot update ${file}: it is not valid JSON`);
      }
    }
    const command = buildHookCommand({ ...options, agent });
    const json = `${JSON.stringify(
      mergeHook(existing, command, file),
      null,
      2,
    )}\n`;
    return { agent, file, json };
  });

  return planned.map(({ agent, file, json }) => {
    if (options.dryRun) {
      return { agent, file, written: false, json };
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, json);
    return { agent, file, written: true };
  });
}
