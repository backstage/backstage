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
import type { CliCommandContext } from '@backstage/cli-node';

const mockResolveSelection = jest.fn();
const mockGetRepoRoot = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveContext', () => ({
  resolveSelection: (...args: unknown[]) => mockResolveSelection(...args),
}));
jest.mock('../lib/gitRemote', () => ({
  ...jest.requireActual('../lib/gitRemote'),
  getRepoRoot: (...args: unknown[]) => mockGetRepoRoot(...args),
}));

import skillsStatus from './skillsStatus';
import { cli } from 'cleye';

const ctx = {
  args: [],
  info: { name: 'ai skills status', usage: 'backstage-cli ai skills status' },
} as unknown as CliCommandContext;

const decision = (name: string) => ({
  ref: `airesource:default/${name}`,
  name,
  status: 'selected',
  via: 'scope',
  reason: 'owned by group:default/a',
  source: {
    repoUrl: 'https://github.com/acme/one',
    ref: 'main',
    installUrl: `https://github.com/acme/one/tree/main/skills/${name}`,
  },
});

describe('ai skills status', () => {
  let root: string;
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-status-'));
    mockGetRepoRoot.mockResolvedValue(root);
    mockResolveSelection.mockResolvedValue({
      context: { componentRef: 'component:default/svc' },
      agents: ['claude-code'],
      decisions: [decision('a'), decision('b')],
    });
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });
  afterEach(() => {
    stdoutSpy.mockRestore();
    fs.rmSync(root, { recursive: true, force: true });
  });
  const out = () => stdoutSpy.mock.calls.map(c => c[0]).join('');

  it('reports installed and missing skills, and fails with --check only when one is missing', async () => {
    fs.writeFileSync(
      path.join(root, 'skills-lock.json'),
      JSON.stringify({
        version: 1,
        skills: {
          a: {
            source: 'acme/one',
            ref: 'main',
            sourceType: 'github',
            skillPath: 'skills/a/SKILL.md',
          },
        },
      }),
    );
    fs.mkdirSync(path.join(root, '.claude', 'skills', 'a'), {
      recursive: true,
    });
    (cli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'] },
    });

    await skillsStatus(ctx);
    expect(out()).toContain('component:default/svc');
    expect(out()).toMatch(/✔ a\s+installed/);
    expect(out()).toMatch(/✖ b\s+missing/);
    expect(out()).toContain('1 installed, 1 missing');

    (cli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'], check: true },
    });
    await expect(skillsStatus(ctx)).rejects.toThrow(/1 skill\(s\)/);

    mockResolveSelection.mockResolvedValue({
      context: {},
      agents: ['claude-code'],
      decisions: [decision('a')],
    });
    await expect(skillsStatus(ctx)).resolves.toBeUndefined();
  });
});
