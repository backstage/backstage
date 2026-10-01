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
 * Environment variables set by agent harnesses, mapped to `skills` agent IDs.
 * Only variables that the harness vendor documents are listed. Codex sets no
 * documented variable, so it must be selected with `--agent codex`.
 */
const AGENT_ENV: ReadonlyArray<readonly [envVar: string, agentId: string]> = [
  // https://code.claude.com/docs/en/env-vars
  ['CLAUDECODE', 'claude-code'],
  // https://cursor.com/docs/agent/tools/terminal
  ['CURSOR_AGENT', 'cursor'],
];

export function detectAgents(
  env: Record<string, string | undefined> = process.env,
): string[] {
  return AGENT_ENV.filter(([name]) => {
    const value = env[name];
    return Boolean(value) && value !== '0';
  }).map(([, agentId]) => agentId);
}

export function resolveTargetAgents(
  flagValues: string[],
  env: Record<string, string | undefined> = process.env,
): string[] {
  if (flagValues.length > 0) {
    return flagValues;
  }
  const detected = detectAgents(env);
  if (detected.length === 0) {
    throw new Error(
      'Could not detect the current coding agent. Pass --agent <id> (for example claude-code, codex or cursor).',
    );
  }
  return detected;
}
