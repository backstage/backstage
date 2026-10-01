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

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveContext', () => ({
  resolveSelection: (...args: unknown[]) => mockResolveSelection(...args),
}));
jest.mock('../lib/runSkills', () => ({
  ...jest.requireActual('../lib/runSkills'),
  createSkillsRunner: () => mockRunner,
}));

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
    });
    expect(mockRunner.mock.calls).toEqual([
      [['add', url('one', 'a'), '-a', 'claude-code', '-y', '-g'], {}],
      [['add', url('one', 'b'), '-a', 'claude-code', '-y', '-g'], {}],
    ]);
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
});
