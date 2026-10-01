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
import os from 'node:os';
import path from 'node:path';
import { isSkillInstalled, readSkillsLock, skillPresence } from './skillsLock';

const lock = {
  version: 1,
  skills: {
    a: {
      source: 'anthropics/skills',
      ref: 'main',
      sourceType: 'github',
      skillPath: 'skills/a/SKILL.md',
    },
    b: {
      source: 'https://ghe.example.com/acme/skills',
      ref: 'v1',
      sourceType: 'github',
      skillPath: 'x/b/SKILL.md',
    },
    c: {
      source: 'https://gitlab.com/g/s/r',
      sourceUrl: 'https://gitlab.com/g/s/r.git',
      ref: 'main',
      sourceType: 'gitlab',
      skillPath: 'skills/c/SKILL.md',
    },
  },
};

describe('skills lock', () => {
  it('matches install URLs against recorded source, ref and skill path', () => {
    const present = () => true;
    const url = (u: string) => isSkillInstalled(lock, u, present, '/');
    expect(url('https://github.com/anthropics/skills/tree/main/skills/a')).toBe(
      true,
    );
    expect(url('https://github.com/Anthropics/Skills/tree/main/skills/a')).toBe(
      true,
    );
    expect(url('https://ghe.example.com/acme/skills/tree/v1/x/b')).toBe(true);
    expect(url('https://gitlab.com/g/s/r/-/tree/main/skills/c')).toBe(true);

    expect(url('https://github.com/anthropics/skills/tree/dev/skills/a')).toBe(
      false,
    );
    expect(url('https://github.com/anthropics/skills/tree/main/skills/z')).toBe(
      false,
    );
    expect(url('https://github.com/other/skills/tree/main/skills/a')).toBe(
      false,
    );
    expect(url('https://ghe.example.com/acme/skills/tree/v1/x/a')).toBe(false);
    expect(url('not a url')).toBe(false);
    expect(
      isSkillInstalled(
        undefined,
        'https://github.com/a/b/tree/m/s',
        present,
        '/',
      ),
    ).toBe(false);
  });

  it('requires the skill folder to exist for every target agent', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-lock-dirs-'));
    try {
      const u = 'https://github.com/anthropics/skills/tree/main/skills/a';
      const installed = (agents: string[]) =>
        isSkillInstalled(lock, u, skillPresence(dir, agents), dir);

      // A lock file without skills on disk, such as after a fresh clone.
      expect(installed(['claude-code'])).toBe(false);

      fs.mkdirSync(path.join(dir, '.agents', 'skills', 'a'), {
        recursive: true,
      });
      // Installed for another agent only.
      expect(installed(['claude-code'])).toBe(false);
      expect(installed(['codex'])).toBe(true);

      fs.mkdirSync(path.join(dir, '.claude', 'skills', 'a'), {
        recursive: true,
      });
      expect(installed(['claude-code'])).toBe(true);
      expect(installed(['claude-code', 'codex'])).toBe(true);
      expect(installed(['claude-code', 'codex', 'cursor'])).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reads the lock file, treating missing or malformed files as empty', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-lock-'));
    try {
      expect(readSkillsLock(dir)).toBeUndefined();
      fs.writeFileSync(path.join(dir, 'skills-lock.json'), '{oops');
      expect(readSkillsLock(dir)).toBeUndefined();
      fs.writeFileSync(path.join(dir, 'skills-lock.json'), '{"version":1}');
      expect(readSkillsLock(dir)).toBeUndefined();
      fs.writeFileSync(
        path.join(dir, 'skills-lock.json'),
        JSON.stringify(lock),
      );
      expect(readSkillsLock(dir)).toEqual(lock);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('matches local sources by their real path relative to the lock file', () => {
    const dir = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ai-lock-local-')),
    );
    try {
      fs.mkdirSync(path.join(dir, 'repo'));
      fs.mkdirSync(path.join(dir, 'src', 'my-skill'), { recursive: true });
      const localLock = {
        version: 1,
        skills: {
          'my-skill': { source: '../src/my-skill', sourceType: 'local' },
        },
      };
      const installed = (source: string) =>
        isSkillInstalled(localLock, source, () => true, path.join(dir, 'repo'));
      expect(installed(path.join(dir, 'src', 'my-skill'))).toBe(true);
      expect(installed(path.join(dir, 'src', 'other'))).toBe(false);
      expect(
        isSkillInstalled(
          localLock,
          path.join(dir, 'src', 'my-skill'),
          () => false,
          path.join(dir, 'repo'),
        ),
      ).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
