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
import { errorMessage } from './errorMessage';
import { defaultExec, type ExecFn } from './gitRemote';
import { shellQuote } from './shellQuote';

/** Marks the hook entry that this module owns, so that it can be replaced. */
const HOOK_MARKER = 'ai skills sync --hook';
const SESSION_START_MATCHER = 'startup|resume';
const HOOK_TIMEOUT_SECONDS = 120;

/**
 * Hooks are only installed in personal files that are not committed.
 *
 * - Claude Code: https://code.claude.com/docs/en/hooks. Project hooks that
 *   are personal go in `.claude/settings.local.json`.
 *
 * Cursor and Codex are not supported. Cursor's project hooks
 * (`.cursor/hooks.json`, https://cursor.com/docs/agent/hooks) and Codex's
 * (`.codex/hooks.json`, https://learn.chatgpt.com/docs/hooks) are files that
 * are shared within a team, which does not fit a command with paths that are
 * specific to one machine. Their personal hooks are in the user's home
 * directory, which this module does not modify.
 */
const HOOK_FILES: Record<string, string> = {
  'claude-code': path.join('.claude', 'settings.local.json'),
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
  /** Runs git, injectable for tests. */
  exec?: ExecFn;
}

const INSTANCE_PATTERN = /^[A-Za-z0-9_.][A-Za-z0-9_.-]*$/;

export interface InstallHooksResult {
  agent: string;
  file: string;
  written: boolean;
  /** Set to the git exclude file that the hook file was added to. */
  excludedFrom?: string;
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
  if (
    options.instance !== undefined &&
    !INSTANCE_PATTERN.test(options.instance)
  ) {
    throw new Error(
      `Invalid --instance "${options.instance}": use letters, digits, ".", "_" and "-", and do not start with "-"`,
    );
  }
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

  const results: InstallHooksResult[] = [];
  for (const { agent, file, json } of planned) {
    if (options.dryRun) {
      results.push({ agent, file, written: false, json });
      continue;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // Write next to the target and rename, so that a crash cannot leave a
    // partly written settings file behind.
    const temp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temp, json);
    fs.renameSync(temp, file);
    const excludedFrom = await excludeFromGit(
      options.rootDir,
      HOOK_FILES[agent],
      file,
      options.exec ?? defaultExec,
    );
    results.push({ agent, file, written: true, excludedFrom });
  }
  return results;
}

/**
 * Claude Code only adds `settings.local.json` to the global git excludes
 * when it writes the file itself, so make sure that a file we created is not
 * committed by accident. Returns the exclude file that was changed, if any.
 */
async function excludeFromGit(
  rootDir: string,
  relativeFile: string,
  file: string,
  exec: ExecFn,
): Promise<string | undefined> {
  try {
    await exec('git', ['-C', rootDir, 'check-ignore', '-q', file]);
    return undefined;
  } catch (error) {
    // Exit code 1 means "not ignored"; anything else, such as 128 outside
    // a git repository, means there is nothing to exclude from.
    if (
      !(
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 1
      )
    ) {
      return undefined;
    }
  }
  try {
    const { stdout } = await exec('git', [
      '-C',
      rootDir,
      'rev-parse',
      '--git-path',
      'info/exclude',
    ]);
    const excludeFile = path.resolve(rootDir, stdout.trim());
    fs.mkdirSync(path.dirname(excludeFile), { recursive: true });
    const current = fs.existsSync(excludeFile)
      ? fs.readFileSync(excludeFile, 'utf8')
      : '';
    const separator = current === '' || current.endsWith('\n') ? '' : '\n';
    const entry = `/${relativeFile.split(path.sep).join('/')}`;
    fs.writeFileSync(excludeFile, `${current}${separator}${entry}\n`);
    return excludeFile;
  } catch (error) {
    process.stderr.write(
      `Could not add ${file} to the git exclude list: ${errorMessage(error)}\n`,
    );
    return undefined;
  }
}
