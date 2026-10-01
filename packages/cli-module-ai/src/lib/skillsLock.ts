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

/** The parts of an entry in `skills-lock.json` that we compare against. */
interface SkillsLockEntry {
  source?: string;
  sourceUrl?: string;
  ref?: string;
  skillPath?: string;
}

export interface SkillsLock {
  version: number;
  skills: Record<string, SkillsLockEntry>;
}

const LOCK_FILE = 'skills-lock.json';

/**
 * Reads the project lock file that `skills` maintains in the install root.
 * Returns undefined when it is missing or not in the expected format.
 */
export function readSkillsLock(dir: string): SkillsLock | undefined {
  try {
    const parsed = JSON.parse(
      fs.readFileSync(path.join(dir, LOCK_FILE), 'utf8'),
    );
    if (
      typeof parsed?.version === 'number' &&
      parsed.skills &&
      typeof parsed.skills === 'object'
    ) {
      return parsed;
    }
  } catch {
    // Missing or unreadable lock files mean that nothing is installed.
  }
  return undefined;
}

/**
 * Normalizes a repository reference to `host/path`. `skills` records GitHub
 * repositories on github.com as `owner/repo` and other hosts as full URLs.
 */
function normalizeRepo(value: string): string | undefined {
  let normalized = value.trim();
  if (/^[\w.-]+\/[\w.-]+$/.test(normalized)) {
    normalized = `github.com/${normalized}`;
  } else {
    try {
      const url = new URL(normalized);
      normalized = `${url.host}${url.pathname}`;
    } catch {
      return undefined;
    }
  }
  return normalized
    .replace(/\/+$/, '')
    .replace(/\.git$/, '')
    .toLocaleLowerCase('en-US');
}

/**
 * Project skills directories per agent, from the agent table in `skills`
 * 1.7.0 (node_modules/skills/dist/cli.mjs, `skillsDir`). Claude Code is the
 * one common agent with its own directory. Agents that are not listed use
 * `.agents/skills`; if that is wrong for an agent, its skills are never
 * seen as installed and are installed again, which is safe.
 */
const SKILLS_DIRS: Record<string, string> = {
  'claude-code': path.join('.claude', 'skills'),
};
const DEFAULT_SKILLS_DIR = path.join('.agents', 'skills');

/**
 * Returns a check for whether a skill folder exists in the project skills
 * directory of every one of the given agents. The lock file has no agent
 * information, so it cannot tell which agents a skill was installed for.
 */
export function skillPresence(
  rootDir: string,
  agents: string[],
): (skillName: string) => boolean {
  return skillName =>
    agents.every(agent =>
      fs.existsSync(
        path.join(rootDir, SKILLS_DIRS[agent] ?? DEFAULT_SKILLS_DIR, skillName),
      ),
    );
}

/**
 * Checks whether the skill at a tree URL, as passed to `skills add`, is
 * recorded in the lock with the same repository, ref and directory, and is
 * present on disk according to `isPresent`.
 */
export function isSkillInstalled(
  lock: SkillsLock | undefined,
  installUrl: string,
  isPresent: (skillName: string) => boolean,
): boolean {
  if (!lock) return false;
  let url: URL;
  try {
    url = new URL(installUrl);
  } catch {
    return false;
  }
  const match = url.pathname.match(/^(.*?)(?:\/-)?\/tree\/([^/]+)\/(.+)$/);
  if (!match) return false;
  const [, repoPath, ref, skillDir] = match;
  const repo = normalizeRepo(`${url.origin}${repoPath}`);

  return Object.entries(lock.skills).some(([name, entry]) => {
    if (entry?.ref !== ref) return false;
    const entryDir = entry.skillPath?.replace(/\/?SKILL\.md$/i, '');
    if (entryDir !== skillDir) return false;
    return (
      [entry.source, entry.sourceUrl].some(
        candidate => candidate && normalizeRepo(candidate) === repo,
      ) && isPresent(name)
    );
  });
}
