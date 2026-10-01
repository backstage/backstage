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
import { isInstalledInLock, readSkillsLock } from './skillsLock';

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
    const url = (u: string) => isInstalledInLock(lock, u);
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
      isInstalledInLock(undefined, 'https://github.com/a/b/tree/m/s'),
    ).toBe(false);
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
});
