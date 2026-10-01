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
import { buildHookCommand, installHooks } from './installHooks';

describe('buildHookCommand', () => {
  it('quotes the node and script paths and passes the agent and instance', () => {
    expect(
      buildHookCommand({
        execPath: '/usr/local/bin/node',
        scriptPath: '/repo/node_modules/@backstage/cli/bin/backstage-cli',
        agent: 'claude-code',
      }),
    ).toBe(
      '/usr/local/bin/node /repo/node_modules/@backstage/cli/bin/backstage-cli ai skills sync --hook --agent claude-code',
    );
    expect(
      buildHookCommand({
        execPath: '/Users/Jane Doe/n ode',
        scriptPath: "/Users/Jane Doe/it's/bin/backstage-cli",
        agent: 'codex',
        instance: 'my instance',
      }),
    ).toBe(
      "'/Users/Jane Doe/n ode' '/Users/Jane Doe/it'\\''s/bin/backstage-cli' ai skills sync --hook --agent codex --instance 'my instance'",
    );
  });
});

describe('installHooks', () => {
  let root: string;
  const base = () => ({
    rootDir: root,
    execPath: '/bin/node',
    scriptPath: '/bin/backstage-cli',
  });
  const command = (agent: string, instance?: string) =>
    buildHookCommand({
      execPath: '/bin/node',
      scriptPath: '/bin/backstage-cli',
      agent,
      instance,
    });
  const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-hooks-'));
  });
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('creates the settings file and directory when missing', async () => {
    const results = await installHooks({ ...base(), agents: ['claude-code'] });

    expect(results).toEqual([
      {
        agent: 'claude-code',
        file: path.join(root, '.claude', 'settings.local.json'),
        written: true,
      },
    ]);
    const text = read('.claude/settings.local.json');
    expect(text.endsWith('}\n')).toBe(true);
    expect(text).toContain('\n  "hooks": {');
    expect(JSON.parse(text)).toEqual({
      hooks: {
        SessionStart: [
          {
            matcher: 'startup|resume',
            hooks: [
              {
                type: 'command',
                command: command('claude-code'),
                timeout: 120,
              },
            ],
          },
        ],
      },
    });
  });

  it('merges into an empty file and keeps other settings and hooks', async () => {
    fs.mkdirSync(path.join(root, '.claude'));
    fs.writeFileSync(path.join(root, '.claude/settings.local.json'), '  \n');
    await installHooks({ ...base(), agents: ['claude-code'] });
    expect(
      JSON.parse(read('.claude/settings.local.json')).hooks.SessionStart,
    ).toHaveLength(1);

    const other = { type: 'command', command: 'echo hi' };
    fs.writeFileSync(
      path.join(root, '.claude/settings.local.json'),
      JSON.stringify({
        permissions: { allow: ['Bash(ls)'] },
        hooks: {
          PreToolUse: [{ matcher: 'Bash', hooks: [other] }],
          SessionStart: [
            { matcher: 'clear', hooks: [other] },
            {
              matcher: 'startup',
              hooks: [
                other,
                {
                  type: 'command',
                  command: 'old ai skills sync --hook --agent x',
                },
              ],
            },
          ],
        },
      }),
    );
    await installHooks({
      ...base(),
      agents: ['claude-code'],
      instance: 'prod',
    });

    expect(JSON.parse(read('.claude/settings.local.json'))).toEqual({
      permissions: { allow: ['Bash(ls)'] },
      hooks: {
        PreToolUse: [{ matcher: 'Bash', hooks: [other] }],
        SessionStart: [
          { matcher: 'clear', hooks: [other] },
          { matcher: 'startup', hooks: [other] },
          {
            matcher: 'startup|resume',
            hooks: [
              {
                type: 'command',
                command: command('claude-code', 'prod'),
                timeout: 120,
              },
            ],
          },
        ],
      },
    });
  });

  it('is idempotent', async () => {
    await installHooks({ ...base(), agents: ['claude-code', 'codex'] });
    const first = [
      read('.claude/settings.local.json'),
      read('.codex/hooks.json'),
    ];
    await installHooks({ ...base(), agents: ['claude-code', 'codex'] });

    expect([
      read('.claude/settings.local.json'),
      read('.codex/hooks.json'),
    ]).toEqual(first);
    expect(first[1]).toContain('--agent codex');
    expect(JSON.parse(first[0]).hooks.SessionStart).toHaveLength(1);
  });

  it('fails without writing for invalid JSON, unexpected shapes and unsupported agents', async () => {
    fs.mkdirSync(path.join(root, '.claude'));
    const file = path.join(root, '.claude/settings.local.json');
    const cases: Array<[string, string]> = [
      ['{ not json', 'is not valid JSON'],
      ['[]', 'must contain a JSON object'],
      ['{"hooks": []}', '"hooks" must be an object'],
      [
        '{"hooks": {"SessionStart": {}}}',
        '"hooks.SessionStart" must be an array',
      ],
      [
        '{"hooks": {"SessionStart": [{"matcher": "a"}]}}',
        'each "hooks.SessionStart" entry must have a "hooks" array',
      ],
    ];
    for (const [content, message] of cases) {
      fs.writeFileSync(file, content);
      await expect(
        installHooks({ ...base(), agents: ['claude-code'] }),
      ).rejects.toThrow(message);
      expect(fs.readFileSync(file, 'utf8')).toBe(content);
    }

    fs.rmSync(file);
    await expect(
      installHooks({ ...base(), agents: ['claude-code', 'cursor'] }),
    ).rejects.toThrow('hooks are not supported for cursor yet');
    expect(fs.existsSync(file)).toBe(false);

    // A failure for one agent also prevents writing the others.
    fs.mkdirSync(path.join(root, '.codex'));
    fs.writeFileSync(path.join(root, '.codex/hooks.json'), 'nope');
    await expect(
      installHooks({ ...base(), agents: ['claude-code', 'codex'] }),
    ).rejects.toThrow('.codex/hooks.json');
    expect(fs.existsSync(file)).toBe(false);
  });

  it('does not write anything on a dry run but reports the result', async () => {
    const results = await installHooks({
      ...base(),
      agents: ['claude-code'],
      dryRun: true,
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ written: false });
    expect(results[0].json).toContain(command('claude-code'));
    expect(fs.existsSync(path.join(root, '.claude'))).toBe(false);
  });
});
