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

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveContext', () => ({
  resolveSelection: (...args: unknown[]) => mockResolveSelection(...args),
}));

import resolve from './resolve';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'ai resolve', usage: 'backstage-cli ai resolve' },
  } as unknown as CliCommandContext);

const result = {
  context: {
    user: 'user:default/jane',
    ownershipRefs: ['user:default/jane', 'group:default/team-a'],
    componentRef: 'component:default/svc',
    owner: 'group:default/team-a',
    system: 'system:default/payments',
    groupRefs: ['group:default/team-a'],
    ancestorGroupRefs: ['group:default/org-x'],
  },
  agents: ['claude-code'],
  decisions: [
    {
      ref: 'airesource:default/mine',
      name: 'mine',
      status: 'selected',
      via: 'scope',
      reason: 'owned by group:default/team-a',
    },
    {
      ref: 'airesource:default/other',
      name: 'other',
      status: 'skipped',
      via: 'scope',
      reason: 'outside the component scope',
    },
  ],
};

describe('ai resolve', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockResolveSelection.mockResolvedValue(result);
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });
  afterEach(() => stdoutSpy.mockRestore());
  const out = () => stdoutSpy.mock.calls.map(c => c[0]).join('');

  it('passes flags through and prints a human summary by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { entity: 'svc', agent: ['claude-code'], instance: 'prod' },
    });
    await resolve(ctx([]));
    expect(mockResolveSelection).toHaveBeenCalledWith({
      entity: 'svc',
      instance: 'prod',
      agents: ['claude-code'],
      allowFileSources: false,
    });
    const text = out();
    expect(text).toContain('component:default/svc');
    expect(text).toContain('system:default/payments');
    expect(text).toContain('group:default/org-x');
    expect(text).toMatch(/selected\s+airesource:default\/mine.*owned by/);
    expect(text).toMatch(/skipped\s+airesource:default\/other.*outside/);
  });

  it('prints JSON with --output json and rejects unknown formats', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'], output: 'json' },
    });
    await resolve(ctx([]));
    expect(JSON.parse(out())).toEqual(result);

    (mockCli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'], output: 'yaml' },
    });
    await expect(resolve(ctx([]))).rejects.toThrow(/--output/);
  });

  it('requires an agent when none can be detected', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { agent: [] } });
    const saved = { ...process.env };
    delete process.env.CLAUDECODE;
    delete process.env.CURSOR_AGENT;
    try {
      await expect(resolve(ctx([]))).rejects.toThrow(/--agent/);
    } finally {
      process.env = saved;
    }
  });
});
