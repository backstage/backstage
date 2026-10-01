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

const mockGetRepoRoot = jest.fn();
const mockGetMainRoot = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/gitRemote', () => ({
  ...jest.requireActual('../lib/gitRemote'),
  getRepoRoot: (...args: unknown[]) => mockGetRepoRoot(...args),
  getMainCheckoutRoot: (...args: unknown[]) => mockGetMainRoot(...args),
}));

import hooksInstall from './hooksInstall';
import { cli } from 'cleye';

const ctx = {
  args: [],
  info: { name: 'ai hooks install', usage: 'backstage-cli ai hooks install' },
} as unknown as CliCommandContext;

describe('ai hooks install', () => {
  let root: string;
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-hooks-cmd-'));
    mockGetRepoRoot.mockResolvedValue('/unused');
    mockGetMainRoot.mockResolvedValue(root);
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });
  afterEach(() => {
    stdoutSpy.mockRestore();
    fs.rmSync(root, { recursive: true, force: true });
  });
  const out = () => stdoutSpy.mock.calls.map(c => c[0]).join('');

  it('requires an agent, supports a dry run and writes the hook at the repository root', async () => {
    const file = path.join(root, '.claude', 'settings.local.json');
    (cli as jest.Mock).mockReturnValue({ flags: { agent: [] } });
    await expect(hooksInstall(ctx)).rejects.toThrow(/--agent/);

    (cli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'], 'dry-run': true, instance: 'demo' },
    });
    await hooksInstall(ctx);
    expect(fs.existsSync(file)).toBe(false);
    expect(out()).toContain(file);
    expect(out()).toContain(
      'ai skills sync --hook --agent claude-code --instance demo',
    );

    (cli as jest.Mock).mockReturnValue({ flags: { agent: ['claude-code'] } });
    await hooksInstall(ctx);
    expect(
      JSON.parse(fs.readFileSync(file, 'utf8')).hooks.SessionStart,
    ).toHaveLength(1);
    expect(out()).toContain(`Installed the claude-code hook in ${file}`);
  });

  it('falls back to the repository root, then the current directory', async () => {
    (cli as jest.Mock).mockReturnValue({
      flags: { agent: ['claude-code'], 'dry-run': true },
    });
    mockGetMainRoot.mockResolvedValue(undefined);
    mockGetRepoRoot.mockResolvedValue(root);
    await hooksInstall(ctx);
    expect(out()).toContain(path.join(root, '.claude'));

    mockGetRepoRoot.mockResolvedValue(undefined);
    await hooksInstall(ctx);
    expect(out()).toContain(path.join(process.cwd(), '.claude'));
  });
});
