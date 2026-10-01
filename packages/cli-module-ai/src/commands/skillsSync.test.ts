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

import type { CliCommandContext } from '@backstage/cli-node';

const mockResolveSelection = jest.fn();
const mockRunner = jest.fn();
const mockGetRepoRoot = jest.fn();
const mockCreateRunner = jest.fn();

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
jest.mock('../lib/runSkills', () => ({
  ...jest.requireActual('../lib/runSkills'),
  createSkillsRunner: (...args: unknown[]) => {
    mockCreateRunner(...args);
    return mockRunner;
  },
}));

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import skillsSync from './skillsSync';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'ai skills sync', usage: 'backstage-cli ai skills sync' },
  } as unknown as CliCommandContext);

const url = (repo: string, name: string) =>
  `https://github.com/acme/${repo}/tree/main/skills/${name}`;
const decision = (
  name: string,
  repo: string,
  status: 'selected' | 'skipped',
) => ({
  ref: `airesource:default/${name}`,
  name,
  status,
  via: 'scope',
  reason:
    status === 'selected'
      ? 'owned by group:default/a'
      : 'outside the component scope',
  ...(status === 'selected'
    ? {
        source: {
          repoUrl: `https://github.com/acme/${repo}`,
          ref: 'main',
          installUrl: url(repo, name),
        },
      }
    : {}),
});
const selection = (decisions: unknown[]) => ({
  context: {},
  agents: ['claude-code'],
  decisions,
});

describe('ai skills sync', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });
  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });
  const out = () => stdoutSpy.mock.calls.map(c => c[0]).join('');
  const err = () => stderrSpy.mock.calls.map(c => c[0]).join('');

  it('runs one skills add per skill, even within one repository, with explicit agents and reports skipped skills', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'], global: true, entity: 'svc' },
    });
    mockResolveSelection.mockResolvedValue(
      selection([
        decision('a', 'one', 'selected'),
        decision('b', 'one', 'selected'),
        decision('c', 'two', 'skipped'),
      ]),
    );
    mockRunner.mockResolvedValue(0);

    await skillsSync(ctx([]));

    expect(mockResolveSelection).toHaveBeenCalledWith({
      entity: 'svc',
      instance: undefined,
      agents: ['claude-code'],
      allowFileSources: false,
    });
    expect(mockRunner.mock.calls).toEqual([
      [
        ['add', url('one', 'a'), '-a', 'claude-code', '-y', '-g'],
        {},
        undefined,
      ],
      [
        ['add', url('one', 'b'), '-a', 'claude-code', '-y', '-g'],
        {},
        undefined,
      ],
    ]);
    // Global installs do not depend on the project, so git is not consulted.
    expect(mockGetRepoRoot).not.toHaveBeenCalled();
    expect(err()).toMatch(
      /Skipped airesource:default\/c.*outside the component scope/,
    );
  });

  it('prints commands without running them for --dry-run', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { agent: ['codex'], 'dry-run': true },
    });
    mockResolveSelection.mockResolvedValue(
      selection([decision('a', 'one', 'selected')]),
    );
    await skillsSync(ctx([]));
    expect(mockRunner).not.toHaveBeenCalled();
    expect(out()).toContain(`skills add ${url('one', 'a')} -a codex -y`);
  });

  it('passes --allow-file-sources to the selection and prints local paths in a dry run', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { agent: ['codex'], 'dry-run': true, 'allow-file-sources': true },
    });
    mockResolveSelection.mockResolvedValue(
      selection([
        {
          ...decision('a', 'one', 'selected'),
          source: {
            repoUrl: '/skills/a',
            ref: '',
            installUrl: '/skills/a',
            localPath: '/skills/a',
          },
        },
      ]),
    );
    await skillsSync(ctx([]));
    expect(mockResolveSelection).toHaveBeenCalledWith(
      expect.objectContaining({ allowFileSources: true }),
    );
    expect(out()).toContain('skills add /skills/a -a codex -y');
  });

  it('does nothing and succeeds when no skill is installable', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { agent: ['codex'] } });
    mockResolveSelection.mockResolvedValue(
      selection([decision('c', 'two', 'skipped')]),
    );
    await expect(skillsSync(ctx([]))).resolves.toBeUndefined();
    expect(mockRunner).not.toHaveBeenCalled();
    expect(out()).toMatch(/No applicable skills/);
    expect(err()).toMatch(/Skipped airesource:default\/c/);
  });

  it('continues after a failing skill and fails at the end naming it', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { agent: ['codex'] } });
    mockResolveSelection.mockResolvedValue(
      selection([
        decision('a', 'one', 'selected'),
        decision('b', 'two', 'selected'),
      ]),
    );
    mockRunner.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await expect(skillsSync(ctx([]))).rejects.toThrow(/airesource:default\/a/);
    expect(mockRunner).toHaveBeenCalledTimes(2);
  });

  it('runs project installs from the repository root and falls back to the current directory outside a repository', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { agent: ['codex'] } });
    mockResolveSelection.mockResolvedValue(
      selection([decision('a', 'one', 'selected')]),
    );
    mockRunner.mockResolvedValue(0);

    mockGetRepoRoot.mockResolvedValueOnce('/work/repo');
    await skillsSync(ctx([]));
    expect(mockRunner).toHaveBeenLastCalledWith(
      expect.any(Array),
      {},
      '/work/repo',
    );

    mockGetRepoRoot.mockResolvedValueOnce(undefined);
    await skillsSync(ctx([]));
    expect(mockRunner).toHaveBeenLastCalledWith(
      expect.any(Array),
      {},
      undefined,
    );
  });

  it('fails before running skills on an unsupported Node.js version, but still allows --dry-run', async () => {
    mockResolveSelection.mockResolvedValue(
      selection([decision('a', 'one', 'selected')]),
    );
    const original = Object.getOwnPropertyDescriptor(process.versions, 'node')!;
    Object.defineProperty(process.versions, 'node', {
      value: '20.11.0',
      configurable: true,
    });
    try {
      (mockCli as jest.Mock).mockReturnValue({ flags: { agent: ['codex'] } });
      await expect(skillsSync(ctx([]))).rejects.toThrow(/22\.20\.0/);
      expect(mockRunner).not.toHaveBeenCalled();

      (mockCli as jest.Mock).mockReturnValue({
        flags: { agent: ['codex'], 'dry-run': true },
      });
      await expect(skillsSync(ctx([]))).resolves.toBeUndefined();
    } finally {
      Object.defineProperty(process.versions, 'node', original);
    }
  });

  describe('--hook', () => {
    let repoRoot: string;
    const lockEntry = (name: string, repo: string) => ({
      source: `acme/${repo}`,
      ref: 'main',
      sourceType: 'github',
      skillPath: `skills/${name}/SKILL.md`,
    });

    const installDir = (name: string) =>
      fs.mkdirSync(path.join(repoRoot, '.claude', 'skills', name), {
        recursive: true,
      });

    beforeEach(() => {
      repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-sync-hook-'));
      mockGetRepoRoot.mockResolvedValue(repoRoot);
      (mockCli as jest.Mock).mockReturnValue({
        flags: { agent: ['claude-code'], hook: true },
      });
    });
    afterEach(() => {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    });

    it('installs only skills missing from the lock file, quietly, and prints a single summary line', async () => {
      installDir('a');
      fs.writeFileSync(
        path.join(repoRoot, 'skills-lock.json'),
        JSON.stringify({ version: 1, skills: { a: lockEntry('a', 'one') } }),
      );
      mockResolveSelection.mockResolvedValue(
        selection([
          decision('a', 'one', 'selected'),
          decision('b', 'one', 'selected'),
          decision('c', 'two', 'skipped'),
        ]),
      );
      mockRunner.mockResolvedValue(0);

      await expect(skillsSync(ctx([]))).resolves.toBeUndefined();

      expect(mockCreateRunner).toHaveBeenCalledWith(undefined, {
        quiet: true,
      });
      expect(mockRunner.mock.calls).toEqual([
        [['add', url('one', 'b'), '-a', 'claude-code', '-y'], {}, repoRoot],
      ]);
      expect(out()).toBe('Backstage: installed 1 skill(s), 1 up to date.\n');
      expect(err()).toBe('');
    });

    it('prints nothing when every skill is already installed, but reinstalls skills whose folder is missing', async () => {
      installDir('a');
      fs.writeFileSync(
        path.join(repoRoot, 'skills-lock.json'),
        JSON.stringify({ version: 1, skills: { a: lockEntry('a', 'one') } }),
      );
      mockResolveSelection.mockResolvedValue(
        selection([decision('a', 'one', 'selected')]),
      );

      await skillsSync(ctx([]));

      expect(mockRunner).not.toHaveBeenCalled();
      expect(out()).toBe('');
      expect(err()).toBe('');

      // The lock file alone, as after a fresh clone, is not enough.
      fs.rmSync(path.join(repoRoot, '.claude'), { recursive: true });
      mockRunner.mockResolvedValue(0);
      await skillsSync(ctx([]));
      expect(mockRunner).toHaveBeenCalledTimes(1);
      expect(out()).toBe('Backstage: installed 1 skill(s), 0 up to date.\n');
    });

    it('exits successfully with one stderr line and no stdout on errors', async () => {
      mockResolveSelection.mockRejectedValue(
        new Error(
          'Not logged in to Backstage: nope.\nRun "backstage-cli auth login".',
        ),
      );
      await expect(skillsSync(ctx([]))).resolves.toBeUndefined();
      expect(out()).toBe('');
      expect(err().trim().split('\n')).toHaveLength(1);
      expect(err()).toContain('backstage-cli auth login');
      expect(mockRunner).not.toHaveBeenCalled();

      stderrSpy.mockClear();
      mockResolveSelection.mockResolvedValue(
        selection([decision('a', 'one', 'selected')]),
      );
      mockRunner.mockResolvedValue(1);
      await expect(skillsSync(ctx([]))).resolves.toBeUndefined();
      expect(out()).toBe('');
      expect(err().trim().split('\n')).toHaveLength(1);
      expect(err()).toContain('airesource:default/a');

      stderrSpy.mockClear();
      (mockCli as jest.Mock).mockReturnValue({
        flags: { agent: ['claude-code'], hook: true, global: true },
      });
      mockRunner.mockClear();
      await expect(skillsSync(ctx([]))).resolves.toBeUndefined();
      expect(err()).toContain('--global');
      expect(mockRunner).not.toHaveBeenCalled();
    });
  });
});
