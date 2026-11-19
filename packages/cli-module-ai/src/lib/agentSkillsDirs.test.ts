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
import { AGENT_SKILLS_DIRS } from './agentSkillsDirs';

describe('AGENT_SKILLS_DIRS', () => {
  it('matches the agent table of the installed skills package', () => {
    const dist = path.join(
      path.dirname(require.resolve('skills/package.json')),
      'dist',
      'cli.mjs',
    );
    const source = fs.readFileSync(dist, 'utf8');
    const table = source.slice(source.indexOf('\nconst agents = {'));
    const pattern =
      /^\t(?:"([^"]+)"|(\w+)): \{\n(?:.*\n){0,6}?\t\tskillsDir: "([^"]+)"/gm;
    const actual: Record<string, string> = {};
    for (const match of table.matchAll(pattern)) {
      actual[match[1] ?? match[2]] = match[3];
    }

    expect(Object.keys(actual).length).toBeGreaterThan(50);
    expect(AGENT_SKILLS_DIRS).toEqual(actual);
  });
});
