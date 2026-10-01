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
import type { SkillDecision } from './selectSkills';
import {
  buildSkillsArgs,
  formatSkillsCommand,
  planSkillsInvocations,
  resolveSkillsBin,
  runSkills,
} from './runSkills';

const selected = (
  name: string,
  installUrl: string,
  ghHost?: string,
): SkillDecision => ({
  ref: `airesource:default/${name}`,
  name,
  status: 'selected',
  via: 'scope',
  reason: 'owned by group:default/a',
  source: {
    repoUrl: 'https://example.com/acme/skills',
    ref: 'main',
    installUrl,
    ...(ghHost ? { ghHost } : {}),
  },
});
const skipped: SkillDecision = {
  ref: 'airesource:default/nope',
  name: 'nope',
  status: 'skipped',
  via: 'scope',
  reason: 'outside the component scope',
};

const one = 'https://github.com/acme/skills/tree/main/skills/one';
const two = 'https://github.com/acme/skills/tree/main/skills/two';
const ghe = 'https://github.acme.com/o/r/tree/v1/skills/three';

describe('planSkillsInvocations', () => {
  it('plans one invocation per distinct skill source, without --skill, and ignores skipped skills', () => {
    const plan = planSkillsInvocations(
      [
        selected('two', two),
        selected('one', one),
        // Same source reached through a second entity: installed once.
        selected('one-again', one),
        selected('three', ghe, 'github.acme.com'),
        skipped,
      ],
      { agents: ['claude-code', 'cursor'], global: false },
    );
    expect(plan.map(i => i.ref)).toEqual([
      'airesource:default/three',
      'airesource:default/one',
      'airesource:default/two',
    ]);
    expect(plan.map(buildSkillsArgs)).toEqual([
      ['add', ghe, '-a', 'claude-code', '-a', 'cursor', '-y'],
      ['add', one, '-a', 'claude-code', '-a', 'cursor', '-y'],
      ['add', two, '-a', 'claude-code', '-a', 'cursor', '-y'],
    ]);
    expect(plan.map(i => i.env)).toEqual([
      { GH_HOST: 'github.acme.com' },
      {},
      {},
    ]);

    const global = planSkillsInvocations([selected('one', one)], {
      agents: ['codex'],
      global: true,
    });
    expect(global.map(buildSkillsArgs)).toEqual([
      ['add', one, '-a', 'codex', '-y', '-g'],
    ]);
    expect(
      planSkillsInvocations([skipped], { agents: ['codex'], global: false }),
    ).toEqual([]);
  });

  it('formats a copy-pasteable command including the environment', () => {
    const [plain] = planSkillsInvocations(
      [selected('one', 'https://github.com/a/b/tree/main/my skill')],
      { agents: ['codex'], global: false },
    );
    expect(formatSkillsCommand(plain)).toBe(
      "skills add 'https://github.com/a/b/tree/main/my skill' -a codex -y",
    );
    const [enterprise] = planSkillsInvocations(
      [selected('three', ghe, 'github.acme.com')],
      { agents: ['codex'], global: true },
    );
    expect(formatSkillsCommand(enterprise)).toBe(
      `GH_HOST=github.acme.com skills add ${ghe} -a codex -y -g`,
    );
  });
});

describe('runSkills', () => {
  const inv = (name: string, env: Record<string, string> = {}) => ({
    ref: `airesource:default/${name}`,
    source: `https://github.com/acme/skills/tree/main/skills/${name}`,
    agents: ['codex'],
    global: false,
    env,
  });

  it('continues after failures and reports which skills failed', async () => {
    const run = jest
      .fn()
      .mockResolvedValueOnce(1)
      .mockRejectedValueOnce(new Error('spawn failed'))
      .mockResolvedValueOnce(0);
    const log = jest.fn();
    const result = await runSkills(
      [inv('a', { GH_HOST: 'h.example.com' }), inv('b'), inv('c')],
      run,
      log,
    );
    expect(run).toHaveBeenCalledTimes(3);
    expect(run).toHaveBeenNthCalledWith(
      1,
      [
        'add',
        'https://github.com/acme/skills/tree/main/skills/a',
        '-a',
        'codex',
        '-y',
      ],
      { GH_HOST: 'h.example.com' },
    );
    expect(result.failed).toEqual([
      'airesource:default/a',
      'airesource:default/b',
    ]);
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('airesource:default/a'),
    );
    expect(log).toHaveBeenCalledWith(expect.stringContaining('spawn failed'));
  });
});

describe('resolveSkillsBin', () => {
  it('resolves the skills binary from the installed package', () => {
    const bin = resolveSkillsBin();
    expect(bin).toMatch(/skills[\\/]bin[\\/]cli\.mjs$/);
    expect(fs.existsSync(bin)).toBe(true);
  });
});
